import prisma from '../lib/prisma.js';
import { createNotification } from './notification.controller.js';

const fmt = (obj) => obj ? { ...obj, _id: obj.id } : null;

export const createMaintenance = async (req, res) => {
  try {
    const body = { ...req.body };

    const maintenance = await prisma.maintenance.create({
      data: {
        requestedBy: body.requestedBy,
        email: body.email,
        phone: body.phone,
        title: body.title,
        type: body.type,
        description: body.description || null,
        source: body.source || 'Website',
        priority: body.priority || 'Medium',
        status: body.status || 'Pending',
        estimatedCost: Number(body.estimatedCost || 0),
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
        userId: req.user.id,
        propertyId: body.property || body.propertyId,
        unitId: body.unit || body.unitId,
      }
    });

    // Update unit status to 'Maintenance'
    if (maintenance.unitId) {
      await prisma.unit.update({
        where: { id: maintenance.unitId },
        data: { status: 'Maintenance' }
      });
    }

    await createNotification({
      userId: req.user.id,
      title: 'New Maintenance Request',
      description: `New request: ${maintenance.title}`,
      type: 'maintenance',
      link: '/maintenance',
      metadata: { maintenanceId: maintenance.id }
    });

    res.status(201).json(fmt(maintenance));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMaintenances = async (req, res) => {
  try {
    const maintenances = await prisma.maintenance.findMany({
      where: { userId: req.user.id },
      include: {
        property: { select: { id: true, title: true } },
        unit: { select: { id: true, unitNumber: true, block: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(maintenances.map(fmt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMaintenance = async (req, res) => {
  try {
    const existing = await prisma.maintenance.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!existing) return res.status(404).json({ message: 'Maintenance record not found' });

    const body = { ...req.body };
    delete body.id;
    delete body._id;
    delete body.userId;
    if (body.scheduledDate) body.scheduledDate = new Date(body.scheduledDate);
    if (body.estimatedCost !== undefined) body.estimatedCost = Number(body.estimatedCost);

    const maintenance = await prisma.maintenance.update({
      where: { id: req.params.id },
      data: body
    });

    if (body.status === 'Completed' || body.status === 'Cancelled') {
      await prisma.unit.update({ where: { id: maintenance.unitId }, data: { status: 'Available' } });
    } else if (body.status === 'In Progress') {
      await prisma.unit.update({ where: { id: maintenance.unitId }, data: { status: 'Maintenance' } });
    }

    await createNotification({
      userId: req.user.id,
      title: 'Maintenance Status Updated',
      description: `Request "${maintenance.title}" is now ${maintenance.status}`,
      type: 'maintenance',
      link: '/maintenance',
      metadata: { maintenanceId: maintenance.id, status: maintenance.status }
    });

    res.json(fmt(maintenance));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await prisma.maintenance.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!maintenance) return res.status(404).json({ message: 'Maintenance record not found' });

    await prisma.unit.update({ where: { id: maintenance.unitId }, data: { status: 'Available' } });

    await prisma.trash.create({
      data: { collectionName: 'Maintenance', document: maintenance }
    });
    await prisma.maintenance.delete({ where: { id: req.params.id } });

    res.json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
