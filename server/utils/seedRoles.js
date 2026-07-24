import prisma from '../lib/prisma.js';

const defaultRoles = [
  {
    name: 'Admin',
    description: 'Full system access with all permissions.',
    isSystem: true,
    permissions: [
      { featureId: 'properties', viewScope: 'all', actions: { create: true, edit: true, delete: true }, enabled: true },
      { featureId: 'users', viewScope: 'all', actions: { create: true, edit: true, delete: true }, enabled: true },
      { featureId: 'roles', viewScope: 'all', actions: { create: true, edit: true, delete: true }, enabled: true },
      { featureId: 'financials', viewScope: 'all', actions: { create: true, edit: true, delete: true }, enabled: true },
    ]
  },
  {
    name: 'Agent',
    description: 'Manage assigned properties and leads.',
    isSystem: true,
    permissions: [
      { featureId: 'properties', viewScope: 'own', actions: { create: true, edit: true, delete: false }, enabled: true },
      { featureId: 'inquiries', viewScope: 'own', actions: { create: true, edit: true, delete: false }, enabled: true },
    ]
  },
  {
    name: 'Owner',
    description: 'Property owners who can view their property status and financials.',
    isSystem: true,
    permissions: [
      { featureId: 'properties', viewScope: 'own', actions: { create: false, edit: false, delete: false }, enabled: true },
      { featureId: 'financials', viewScope: 'own', actions: { create: false, edit: false, delete: false }, enabled: true },
    ]
  },
  {
    name: 'Staff',
    description: 'Back office staff with limited management access.',
    isSystem: true,
    permissions: [
      { featureId: 'properties', viewScope: 'all', actions: { create: true, edit: true, delete: false }, enabled: true },
      { featureId: 'bookings', viewScope: 'all', actions: { create: true, edit: true, delete: false }, enabled: true },
    ]
  },
  {
    name: 'Customer',
    description: 'General customers or tenants.',
    isSystem: true,
    permissions: [
      { featureId: 'properties', viewScope: 'all', actions: { create: false, edit: false, delete: false }, enabled: true },
      { featureId: 'bookings', viewScope: 'own', actions: { create: true, edit: false, delete: false }, enabled: true },
    ]
  }
];

export const seedRoles = async () => {
  try {
    const count = await prisma.role.count();
    if (count === 0) {
      console.log('Seeding default roles...');
      await prisma.role.createMany({
        data: defaultRoles.map(role => ({
          name: role.name,
          description: role.description,
          isSystem: role.isSystem,
          permissions: role.permissions,
        }))
      });
      console.log('Roles seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
};
