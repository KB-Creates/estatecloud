import prisma from '../lib/prisma.js';

async function main() {
  const targetEmail = 'azam.asghar26@gmail.com';
  
  // Find the target user
  const targetUser = await prisma.user.findUnique({
    where: { email: targetEmail }
  });

  if (!targetUser) {
    console.error(`Error: User with email ${targetEmail} not found!`);
    return;
  }

  const targetId = targetUser.id;
  console.log(`Target User: ${targetUser.name} (${targetEmail}), ID: ${targetId}`);

  // Force role to admin to ensure they are the admin
  console.log('Ensuring target user has Admin role...');
  await prisma.user.update({
    where: { id: targetId },
    data: { role: 'admin' }
  });

  // Begin clean up of relations of target user to avoid self-reference block
  console.log('Clearing self-referential relations for target user...');
  await prisma.user.update({
    where: { id: targetId },
    data: {
      createdById: null,
      ownerId: null,
      assignedAgents: { set: [] },
      assignedTo: { set: [] }
    }
  });

  // Delete dependencies of other users that cannot be reassigned (settings, notifications, payrolls)
  console.log('Deleting notifications of other users...');
  await prisma.notification.deleteMany({
    where: { userId: { not: targetId } }
  });

  console.log('Deleting settings of other users...');
  await prisma.setting.deleteMany({
    where: { userId: { not: targetId } }
  });

  console.log('Deleting payrolls of other users...');
  await prisma.payroll.deleteMany({
    where: {
      OR: [
        { createdById: { not: targetId } },
        { staffId: { not: targetId } }
      ]
    }
  });

  // Reassign data dependencies of other users to target user to prevent data loss and foreign key violations
  console.log('Reassigning properties to target user...');
  await prisma.property.updateMany({
    where: { userId: { not: targetId } },
    data: { userId: targetId }
  });

  console.log('Reassigning units to target user...');
  await prisma.unit.updateMany({
    where: { userId: { not: targetId } },
    data: { userId: targetId }
  });

  console.log('Reassigning contracts to target user...');
  await prisma.contract.updateMany({
    where: { userId: { not: targetId } },
    data: { userId: targetId }
  });

  console.log('Reassigning bookings to target user...');
  await prisma.booking.updateMany({
    where: { userId: { not: targetId } },
    data: { userId: targetId }
  });

  console.log('Reassigning maintenances to target user...');
  await prisma.maintenance.updateMany({
    where: { userId: { not: targetId } },
    data: { userId: targetId }
  });

  console.log('Reassigning inquiries to target user...');
  await prisma.inquiry.updateMany({
    where: { userId: { not: targetId } },
    data: { userId: targetId }
  });

  console.log('Reassigning payments to target user...');
  await prisma.payment.updateMany({
    where: { createdById: { not: targetId } },
    data: { createdById: targetId }
  });

  console.log('Reassigning expenses to target user...');
  await prisma.expense.updateMany({
    where: { createdById: { not: targetId } },
    data: { createdById: targetId }
  });

  console.log('Clearing inquiry assignments to other users...');
  await prisma.inquiry.updateMany({
    where: { assignedToId: { not: targetId } },
    data: { assignedToId: null }
  });

  // Now, sever self-references of other users to avoid reference loops
  console.log('Clearing self-references for other users...');
  await prisma.user.updateMany({
    where: { id: { not: targetId } },
    data: {
      createdById: null,
      ownerId: null
    }
  });

  // Delete all other users
  console.log('Deleting all other users...');
  const deleteResult = await prisma.user.deleteMany({
    where: { id: { not: targetId } }
  });

  console.log(`Successfully deleted ${deleteResult.count} other users.`);
}

main()
  .catch(e => {
    console.error('An error occurred during deletion:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
