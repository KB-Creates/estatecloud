import prisma from '../lib/prisma.js';
import { createNotification } from './notification.controller.js';

const fmt = (obj) => obj ? { ...obj, _id: obj.id } : null;

export const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    const existingRole = await prisma.role.findUnique({ where: { name } });
    if (existingRole) {
      return res.status(400).json({ message: 'Role with this name already exists' });
    }

    const role = await prisma.role.create({
      data: {
        name,
        description: description || null,
        permissions: permissions || [],
      }
    });

    res.status(201).json(fmt(role));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({ orderBy: { createdAt: 'asc' } });

    // Get user counts per role name
    const userCounts = await prisma.user.groupBy({
      by: ['role'],
      _count: { id: true }
    });

    const rolesWithCounts = roles.map(role => {
      const countObj = userCounts.find(c => c.role?.toLowerCase() === role.name.toLowerCase());
      return { ...fmt(role), userCount: countObj ? countObj._count.id : 0 };
    });

    res.json(rolesWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const role = await prisma.role.findUnique({ where: { id: req.params.id } });
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(fmt(role));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const role = await prisma.role.findUnique({ where: { id: req.params.id } });
    if (!role) return res.status(404).json({ message: 'Role not found' });

    const updateData = {};
    if (role.isSystem) {
      // System roles: only description and permissions can change
      if (description !== undefined) updateData.description = description;
      if (permissions !== undefined) updateData.permissions = permissions;
    } else {
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (permissions !== undefined) updateData.permissions = permissions;
    }

    const updated = await prisma.role.update({
      where: { id: req.params.id },
      data: updateData
    });

    await createNotification({
      userId: req.user.id,
      title: 'Role Updated',
      description: `Access permissions for role "${updated.name}" were successfully updated.`,
      type: 'user',
      link: '/roles',
      metadata: { roleId: updated.id }
    });

    req.io?.emit('users_updated', { action: 'updateRolePermissions', roleId: req.params.id });
    res.json(fmt(updated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const role = await prisma.role.findUnique({ where: { id: req.params.id } });
    if (!role) return res.status(404).json({ message: 'Role not found' });
    if (role.isSystem) return res.status(403).json({ message: 'System roles cannot be deleted' });

    const usersCount = await prisma.user.count({
      where: { role: { equals: role.name, mode: 'insensitive' } }
    });
    if (usersCount > 0) {
      return res.status(400).json({
        message: `Cannot delete role. It is assigned to ${usersCount} users. Please change their roles first.`
      });
    }

    await prisma.trash.create({
      data: { collectionName: 'Role', document: role }
    });
    await prisma.role.delete({ where: { id: req.params.id } });

    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
