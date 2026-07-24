import prisma from '../lib/prisma.js';

const fmt = (obj) => obj ? { ...obj, _id: obj.id } : null;

export const createUnit = async (req, res) => {
  try {
    const body = { ...req.body };

    const numericFields = ['price', 'areaSize', 'bedrooms', 'bathrooms', 'windows'];
    numericFields.forEach(field => {
      if (body[field] !== undefined && body[field] !== '') {
        body[field] = Number(body[field]);
      } else {
        body[field] = null;
      }
    });

    const newUnit = await prisma.unit.create({
      data: {
        unitNumber: body.unitNumber,
        block: body.block || null,
        floor: body.floor || null,
        unitType: body.unitType || null,
        status: body.status || 'Available',
        price: body.price,
        areaSize: body.areaSize,
        areaUnit: body.areaUnit || 'sqft',
        bedrooms: body.bedrooms || null,
        bathrooms: body.bathrooms || null,
        windows: body.windows || null,
        propertyId: body.property || body.propertyId,
        userId: req.user.id,
      }
    });

    res.status(201).json(fmt(newUnit));
  } catch (error) {
    res.status(400).json({ message: 'Failed to create unit', error: error.message });
  }
};

export const getAllUnits = async (req, res) => {
  try {
    const units = await prisma.unit.findMany({
      where: { userId: req.user.id },
      include: { property: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(units.map(fmt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnitById = async (req, res) => {
  try {
    const unit = await prisma.unit.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { property: { select: { id: true, title: true } } }
    });
    if (!unit) return res.status(404).json({ message: 'Unit not found' });
    res.status(200).json(fmt(unit));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUnitsByProperty = async (req, res) => {
  try {
    const units = await prisma.unit.findMany({
      where: {
        propertyId: req.params.propertyId,
        userId: req.user.id
      }
    });
    res.status(200).json(units.map(fmt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUnit = async (req, res) => {
  try {
    const existing = await prisma.unit.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!existing) return res.status(404).json({ message: 'Unit not found' });

    const body = { ...req.body };
    delete body.id;
    delete body._id;
    delete body.userId;
    delete body.propertyId;

    const numericFields = ['price', 'areaSize', 'bedrooms', 'bathrooms', 'windows'];
    numericFields.forEach(field => {
      if (body[field] !== undefined && body[field] !== '') {
        body[field] = Number(body[field]);
      }
    });

    const unit = await prisma.unit.update({
      where: { id: req.params.id },
      data: body
    });
    res.status(200).json(fmt(unit));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUnit = async (req, res) => {
  try {
    const contractsCount = await prisma.contract.count({ where: { unitId: req.params.id } });
    if (contractsCount > 0) {
      return res.status(400).json({
        message: `Cannot delete unit. It has ${contractsCount} linked contracts. Please delete the contracts first.`
      });
    }

    const maintenanceCount = await prisma.maintenance.count({ where: { unitId: req.params.id } });
    if (maintenanceCount > 0) {
      return res.status(400).json({
        message: `Cannot delete unit. It has ${maintenanceCount} linked maintenance requests.`
      });
    }

    const unit = await prisma.unit.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!unit) return res.status(404).json({ message: 'Unit not found' });

    await prisma.trash.create({
      data: { collectionName: 'Unit', document: unit }
    });

    await prisma.unit.delete({ where: { id: req.params.id } });

    res.status(200).json({ message: 'Unit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
