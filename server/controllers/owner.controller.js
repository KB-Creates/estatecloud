import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

const fmt = (obj) => {
  if (!obj) return null;
  const { id, password, ...rest } = obj;
  return { _id: id, ...rest };
};

const generateOwnerId = async (name) => {
  let basePrefix = 'own';
  if (name && typeof name === 'string') {
    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanName.length >= 3) basePrefix = cleanName.substring(0, 3);
    else if (cleanName.length > 0) basePrefix = cleanName;
  }

  let pfx = basePrefix;
  let counter = 1;
  while (true) {
    const existing = await prisma.user.findFirst({
      where: { uniqueId: { startsWith: `${pfx}-` } }
    });
    if (!existing) break;
    pfx = `${basePrefix}${counter}`;
    counter++;
  }

  let uniqueId;
  let exists = true;
  while (exists) {
    const number = Math.floor(100000 + Math.random() * 900000);
    uniqueId = `${pfx}-${number}`;
    exists = await prisma.user.findUnique({ where: { uniqueId } });
  }
  return uniqueId;
};

export const createOwner = async (req, res) => {
  try {
    const { name, email, password, phone, companyName, taxId, status } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const uniqueId = await generateOwnerId(name);
    const rawPass = password || Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPass, salt);

    const owner = await prisma.user.create({
      data: {
        uniqueId,
        name,
        email,
        password: hashedPassword,
        role: 'owner',
        phone: phone || null,
        companyName: companyName || null,
        taxId: taxId || null,
        status: status || 'Active',
        createdById: req.user.id,
      }
    });

    res.status(201).json(fmt(owner));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOwners = async (req, res) => {
  try {
    const owners = await prisma.user.findMany({
      where: { role: 'owner', createdById: req.user.id },
      omit: { password: true },
      orderBy: { createdAt: 'desc' }
    });

    const result = [];
    for (const owner of owners) {
      if (!owner.uniqueId) {
        const uniqueId = await generateOwnerId(owner.name);
        await prisma.user.update({ where: { id: owner.id }, data: { uniqueId } });
        result.push({ ...fmt(owner), uniqueId });
      } else {
        result.push(fmt(owner));
      }
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOwner = async (req, res) => {
  try {
    const { name, email, phone, companyName, taxId, status } = req.body;

    const owner = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!owner || owner.role !== 'owner') {
      return res.status(404).json({ message: 'Owner not found' });
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        name: name || owner.name,
        email: email || owner.email,
        phone: phone !== undefined ? phone : owner.phone,
        companyName: companyName !== undefined ? companyName : owner.companyName,
        taxId: taxId !== undefined ? taxId : owner.taxId,
        status: status || owner.status,
      },
      omit: { password: true }
    });

    res.json(fmt(updated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOwner = async (req, res) => {
  try {
    const owner = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!owner || owner.role !== 'owner') {
      return res.status(404).json({ message: 'Owner not found' });
    }

    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'Owner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
