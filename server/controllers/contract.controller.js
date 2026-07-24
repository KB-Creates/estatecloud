import prisma from '../lib/prisma.js';
import { createNotification } from './notification.controller.js';

const fmt = (obj) => obj ? { ...obj, _id: obj.id } : null;

const genContractNumber = () => 'CON-' + Math.floor(100000 + Math.random() * 900000);

export const createContract = async (req, res) => {
  try {
    const body = { ...req.body };

    const contract = await prisma.contract.create({
      data: {
        contractNumber: genContractNumber(),
        contractType: body.contractType || 'Rental Agreement',
        clientName: body.clientName,
        status: body.status || 'Draft',
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        notes: body.notes || null,
        rentAmount: Number(body.rentAmount),
        billingCycle: body.billingCycle || 'Monthly',
        securityDeposit: Number(body.securityDeposit || 0),
        lateFee: Number(body.lateFee || 0),
        attachmentUrl: body.attachmentUrl || null,
        propertyId: body.property || body.propertyId,
        unitId: body.unit || body.unitId || null,
        userId: req.user.id,
      }
    });

    // Update unit status if contract is Active and unit is assigned
    if (contract.status === 'Active' && contract.unitId) {
      await prisma.unit.update({
        where: { id: contract.unitId },
        data: { status: 'Rented' }
      });
    }

    await createNotification({
      userId: req.user.id,
      title: 'New Lease Signed',
      description: `New contract signed for ${contract.clientName} (${contract.contractType})`,
      type: 'lease',
      link: '/contracts',
      metadata: { contractId: contract.id }
    });

    res.status(201).json(fmt(contract));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getContracts = async (req, res) => {
  try {
    const contracts = await prisma.contract.findMany({
      where: { userId: req.user.id },
      include: {
        property: { select: { id: true, title: true } },
        unit: { select: { id: true, unitNumber: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(contracts.map(fmt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContractById = async (req, res) => {
  try {
    const contract = await prisma.contract.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { property: true, unit: true }
    });
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    res.json(fmt(contract));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContract = async (req, res) => {
  try {
    const existing = await prisma.contract.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!existing) return res.status(404).json({ message: 'Contract not found' });

    const body = { ...req.body };
    delete body.id;
    delete body._id;
    delete body.userId;

    if (body.startDate) body.startDate = new Date(body.startDate);
    if (body.endDate) body.endDate = new Date(body.endDate);
    if (body.rentAmount !== undefined) body.rentAmount = Number(body.rentAmount);
    if (body.securityDeposit !== undefined) body.securityDeposit = Number(body.securityDeposit);
    if (body.lateFee !== undefined) body.lateFee = Number(body.lateFee);

    const contract = await prisma.contract.update({
      where: { id: req.params.id },
      data: body
    });
    res.json(fmt(contract));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteContract = async (req, res) => {
  try {
    const paymentsCount = await prisma.payment.count({ where: { contractId: req.params.id } });
    if (paymentsCount > 0) {
      return res.status(400).json({
        message: `Cannot delete contract. It has ${paymentsCount} linked payments. Please delete payments first.`
      });
    }

    const contract = await prisma.contract.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    // Set unit back to Available
    if (contract.unitId) {
      await prisma.unit.update({
        where: { id: contract.unitId },
        data: { status: 'Available' }
      });
    }

    await prisma.contract.delete({ where: { id: req.params.id } });

    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};