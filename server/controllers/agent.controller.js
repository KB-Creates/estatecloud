import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { createNotification } from './notification.controller.js';

const fmt = (obj) => {
  if (!obj) return null;
  const { id, password, ...rest } = obj;
  return { _id: id, ...rest };
};

const generateUniqueId = async (name, prefix = 'agt') => {
  let basePrefix = prefix;
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

export const createAgent = async (req, res) => {
  try {
    const { name, email, password, phone, commissionType, commissionValue, experience, status, specialization } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const specializationArray = typeof specialization === 'string'
      ? specialization.split(',').map(s => s.trim()).filter(s => s !== '')
      : (specialization || []);

    const uniqueId = await generateUniqueId(name, 'agt');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const agent = await prisma.user.create({
      data: {
        name, email,
        password: hashedPassword,
        uniqueId,
        role: 'agent',
        phone: phone || null,
        commissionType: commissionType || 'Percentage',
        commissionValue: Number(commissionValue || 0),
        experience: Number(experience || 0),
        status: status || 'Active',
        specialization: specializationArray,
        createdById: req.user.id,
      }
    });

    await createNotification({
      userId: req.user.id,
      title: 'New Agent Added',
      description: `New agent "${agent.name}" (ID: ${agent.uniqueId}) added successfully.`,
      type: 'user',
      link: '/agents',
      metadata: { agentId: agent.id }
    });

    res.status(201).json(fmt(agent));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAgents = async (req, res) => {
  try {
    const agents = await prisma.user.findMany({
      where: { role: 'agent', createdById: req.user.id },
      omit: { password: true },
      orderBy: { createdAt: 'desc' }
    });

    // Generate uniqueId for agents that don't have one
    const result = [];
    for (const agent of agents) {
      if (!agent.uniqueId) {
        const uniqueId = await generateUniqueId(agent.name, 'agt');
        await prisma.user.update({ where: { id: agent.id }, data: { uniqueId } });
        result.push({ ...fmt(agent), uniqueId });
      } else {
        result.push(fmt(agent));
      }
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAgent = async (req, res) => {
  try {
    const { name, email, password, phone, commissionType, commissionValue, experience, status, specialization } = req.body;

    const agent = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!agent || agent.role !== 'agent') {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const specializationArray = typeof specialization === 'string'
      ? specialization.split(',').map(s => s.trim()).filter(s => s !== '')
      : (specialization || agent.specialization);

    const updateData = {
      name: name || agent.name,
      email: email || agent.email,
      phone: phone !== undefined ? phone : agent.phone,
      commissionType: commissionType || agent.commissionType,
      commissionValue: commissionValue !== undefined ? Number(commissionValue) : agent.commissionValue,
      experience: experience !== undefined ? Number(experience) : agent.experience,
      status: status || agent.status,
      specialization: specializationArray,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      omit: { password: true }
    });

    res.json(fmt(updated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAgent = async (req, res) => {
  try {
    const agent = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!agent || agent.role !== 'agent') {
      return res.status(404).json({ message: 'Agent not found' });
    }

    await prisma.trash.create({ data: { collectionName: 'User', document: agent } });
    await prisma.user.delete({ where: { id: req.params.id } });

    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
