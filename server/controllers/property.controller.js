import prisma from '../lib/prisma.js';
import { createNotification } from './notification.controller.js';

const fmt = (obj) => obj ? { ...obj, _id: obj.id } : null;

export const getAllProperties = async (req, res) => {
  try {
    const userRole = req.user.role?.toLowerCase() || 'user';
    const viewScope = req.viewScope || 'own';
    const where = {};

    // Tenant scoping
    if (!req.isSuperAdmin && req.user.companyId) {
      where.companyId = req.user.companyId;
    }

    if (userRole !== 'admin' && userRole !== 'companyadmin' && userRole !== 'superadmin') {
      if (viewScope === 'all') {
        where.OR = [
          { userId: req.user.id },
          { agent: req.user.id },
          req.user.createdById ? { userId: req.user.createdById } : null
        ].filter(Boolean);
      } else if (viewScope === 'assigned') {
        where.agent = req.user.id;
      } else {
        where.userId = req.user.id;
      }
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(properties.map(fmt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProperty = async (req, res) => {
  try {
    const body = { ...req.body };

    // Check SaaS Plan Limit
    if (!req.isSuperAdmin && req.user.companyId) {
      const company = await prisma.company.findUnique({
        where: { id: req.user.companyId },
        include: { plan: true }
      });
      if (company && company.plan) {
        const count = await prisma.property.count({ where: { companyId: req.user.companyId } });
        if (count >= company.plan.maxProperties) {
          return res.status(403).json({
            message: `Property limit reached (${count}/${company.plan.maxProperties}) for plan "${company.plan.name}". Please upgrade your subscription to add more properties.`
          });
        }
      }
    }

    const numericFields = ['price', 'areaSize', 'bedrooms', 'bathrooms', 'parkingSpots', 'propertyAge'];
    numericFields.forEach(field => {
      if (body[field] === '' || body[field] === undefined) {
        body[field] = null;
      } else {
        body[field] = Number(body[field]);
      }
    });

    // Extract coordinates if provided
    const lat = body.coordinates?.lat ?? body.lat ?? null;
    const lng = body.coordinates?.lng ?? body.lng ?? null;
    delete body.coordinates;

    console.log('Attempting to save property:', body.title);

    const newProperty = await prisma.property.create({
      data: {
        title: body.title,
        description: body.description || null,
        propertyType: body.propertyType,
        purpose: body.purpose,
        price: body.price,
        status: body.status || 'Available',
        areaSize: body.areaSize,
        areaUnit: body.areaUnit || 'Sq M',
        bedrooms: body.bedrooms || null,
        bathrooms: body.bathrooms || null,
        parkingSpots: body.parkingSpots || null,
        propertyAge: body.propertyAge || null,
        amenities: Array.isArray(body.amenities) ? body.amenities : [],
        address: body.address,
        city: body.city,
        state: body.state || null,
        zipCode: body.zipCode || null,
        country: body.country || null,
        lat,
        lng,
        images: Array.isArray(body.images) ? body.images : [],
        agent: body.agent || null,
        owner: body.owner || null,
        isFeatured: body.isFeatured || false,
        isHot: body.isHot || false,
        userId: req.user.id,
        companyId: req.user.companyId || null,
      }
    });

    console.log('Property saved successfully:', newProperty.id);
    req.io?.emit('properties_updated', { action: 'create', data: newProperty });
    res.status(201).json(fmt(newProperty));
  } catch (error) {
    console.error('Error saving property:', error.message);
    res.status(400).json({ message: 'Failed to save property', error: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const userRole = req.user.role?.toLowerCase() || 'user';
    const viewScope = req.viewScope || 'own';
    const where = { id: req.params.id };

    if (userRole !== 'admin') {
      if (viewScope === 'all') {
        where.OR = [
          { userId: req.user.id },
          { agent: req.user.id },
          req.user.createdById ? { userId: req.user.createdById } : null
        ].filter(Boolean);
      } else if (viewScope === 'assigned') {
        where.agent = req.user.id;
      } else {
        where.userId = req.user.id;
      }
    }

    const property = await prisma.property.findFirst({
      where
    });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json(fmt(property));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const body = { ...req.body };

    const numericFields = ['price', 'areaSize', 'bedrooms', 'bathrooms', 'parkingSpots', 'propertyAge'];
    numericFields.forEach(field => {
      if (body[field] === '' || body[field] === undefined) {
        body[field] = null;
      } else {
        body[field] = Number(body[field]);
      }
    });

    const lat = body.coordinates?.lat ?? body.lat ?? undefined;
    const lng = body.coordinates?.lng ?? body.lng ?? undefined;
    delete body.coordinates;
    delete body.userId;
    delete body.id;
    delete body._id;

    const updateData = { ...body };
    if (lat !== undefined) updateData.lat = lat;
    if (lng !== undefined) updateData.lng = lng;
    if (body.amenities !== undefined) updateData.amenities = Array.isArray(body.amenities) ? body.amenities : [];
    if (body.images !== undefined) updateData.images = Array.isArray(body.images) ? body.images : [];

    const userRole = req.user.role?.toLowerCase() || 'user';
    const where = { id: req.params.id };

    if (userRole !== 'admin') {
      where.OR = [
        { userId: req.user.id },
        { agent: req.user.id }
      ];
    }

    const existing = await prisma.property.findFirst({
      where
    });
    if (!existing) return res.status(404).json({ message: 'Property not found' });

    const updatedProperty = await prisma.property.update({
      where: { id: req.params.id },
      data: updateData
    });

    if (updateData.status && updateData.status !== existing.status) {
      await createNotification({
        userId: req.user.id,
        title: 'Property Status Changed',
        description: `Property "${updatedProperty.title}" status changed from ${existing.status} to ${updatedProperty.status}`,
        type: 'property',
        link: '/properties',
        metadata: { propertyId: updatedProperty.id }
      });
    }

    req.io?.emit('properties_updated', { action: 'update', data: updatedProperty });
    res.status(200).json(fmt(updatedProperty));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;

    const [
      unitsCount,
      contractsCount,
      maintenancesCount,
      bookingsCount,
      expensesCount,
      paymentsCount
    ] = await Promise.all([
      prisma.unit.count({ where: { propertyId } }),
      prisma.contract.count({ where: { propertyId } }),
      prisma.maintenance.count({ where: { propertyId } }),
      prisma.booking.count({ where: { propertyId } }),
      prisma.expense.count({ where: { propertyId } }),
      prisma.payment.count({ where: { propertyId } })
    ]);

    const linkedItems = [];
    if (unitsCount > 0) linkedItems.push(`${unitsCount} unit(s)`);
    if (contractsCount > 0) linkedItems.push(`${contractsCount} contract(s)`);
    if (maintenancesCount > 0) linkedItems.push(`${maintenancesCount} maintenance request(s)`);
    if (bookingsCount > 0) linkedItems.push(`${bookingsCount} booking(s)`);
    if (expensesCount > 0) linkedItems.push(`${expensesCount} expense(s)`);
    if (paymentsCount > 0) linkedItems.push(`${paymentsCount} payment(s)`);

    if (linkedItems.length > 0) {
      return res.status(400).json({
        message: `Cannot delete property. It has linked: ${linkedItems.join(', ')}. Please delete these linked records first.`
      });
    }

    const userRole = req.user.role?.toLowerCase() || 'user';
    const where = { id: req.params.id };

    if (userRole !== 'admin') {
      where.userId = req.user.id;
    }

    const property = await prisma.property.findFirst({
      where
    });
    if (!property) return res.status(404).json({ message: 'Property not found' });

    await prisma.trash.create({
      data: { collectionName: 'Property', document: property }
    });

    await prisma.property.delete({ where: { id: req.params.id } });
    req.io?.emit('properties_updated', { action: 'delete', id: req.params.id });

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
