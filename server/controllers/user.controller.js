import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { createNotification } from './notification.controller.js';

const formatUser = (user) => {
  const { id, password, ...rest } = user;
  return { _id: id, ...rest };
};

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const where = {};

    if (role) {
      where.role = { equals: role, mode: 'insensitive' };
    }

    const userRole = req.user.role || 'user';
    if (userRole.toLowerCase() !== 'admin') {
      where.OR = [
        { id: req.user.id },
        { createdById: req.user.id }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      omit: { password: true }
    });
    res.json(users.map(formatUser));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, notes, status, assignedAgents, owner } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const targetRole = role || 'staff';
    if (targetRole.toLowerCase() === 'admin' && email.toLowerCase() !== 'azam.asghar26@gmail.com') {
      return res.status(400).json({ message: 'Only azam.asghar26@gmail.com can have the admin role.' });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: targetRole,
        phone,
        address,
        notes,
        status,
        ownerId: owner || null,
        createdById: req.user.id,
      },
    });

    await createNotification({
      userId: req.user.id,
      title: 'New User Created',
      description: `New user account "${user.name}" created with role "${user.role}".`,
      type: 'user',
      link: '/users',
      metadata: { newUserId: user.id }
    });

    req.io?.emit('users_updated', { action: 'create', data: user });
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, role, password, phone, address, notes, status, owner } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const targetRole = role || user.role;
    const targetEmail = email || user.email;
    if (targetRole.toLowerCase() === 'admin' && targetEmail.toLowerCase() !== 'azam.asghar26@gmail.com') {
      return res.status(400).json({ message: 'Only azam.asghar26@gmail.com can have the admin role.' });
    }

    const updateData = {
      name: name || user.name,
      email: email || user.email,
      role: targetRole,
      phone: phone !== undefined ? phone : user.phone,
      address: address !== undefined ? address : user.address,
      notes: notes !== undefined ? notes : user.notes,
      status: status || user.status,
      ownerId: owner || user.ownerId,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
    });

    req.io?.emit('users_updated', { action: 'update', data: updatedUser });
    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      omit: { password: true }
    });
    res.json(formatUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.role;
    delete updates.password;
    delete updates.email;

    console.log('Updating profile for user:', req.user.id);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updates,
      omit: { password: true }
    });

    console.log('Profile updated successfully');
    res.json(formatUser(user));
  } catch (error) {
    console.error('Update profile error details:', error);
    res.status(500).json({
      message: error.message || 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user.password && !user.googleId) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.trash.create({
      data: { collectionName: 'User', document: user }
    });

    await prisma.user.delete({ where: { id: req.params.id } });
    req.io?.emit('users_updated', { action: 'delete', id: req.params.id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (role && role.toLowerCase() === 'admin' && user.email.toLowerCase() !== 'azam.asghar26@gmail.com') {
      return res.status(400).json({ message: 'Only azam.asghar26@gmail.com can have the admin role.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { role }
    });

    req.io?.emit('users_updated', { action: 'updateRole', id: req.params.id });
    res.json({ message: 'User role updated', user: formatUser(updatedUser) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
