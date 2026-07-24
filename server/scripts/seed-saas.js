import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

async function seedSaaS() {
  console.log('🌱 Starting SaaS Seeding for EstateCloud...');

  // 1. Create Default Subscription Plans
  const starterPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'starter' },
    update: {},
    create: {
      name: 'Starter',
      slug: 'starter',
      description: 'Ideal for independent real estate agents & small offices.',
      priceMonthly: 49,
      priceYearly: 490,
      maxProperties: 25,
      maxStaff: 3,
      maxUnits: 100,
      features: [
        'Up to 25 Properties',
        'Up to 3 Staff Members',
        'Basic Financial Reports',
        'Lead Management',
        'Email Support'
      ],
      isPopular: false
    }
  });

  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'pro' },
    update: {},
    create: {
      name: 'Pro',
      slug: 'pro',
      description: 'For growing real estate agencies & property managers.',
      priceMonthly: 99,
      priceYearly: 990,
      maxProperties: 100,
      maxStaff: 10,
      maxUnits: 500,
      features: [
        'Up to 100 Properties',
        'Up to 10 Staff Members',
        'Advanced Financial Reports & Analytics',
        'Tenant Portal & Online Payments',
        'Maintenance & Maintenance Tracking',
        'Priority 24/7 Support'
      ],
      isPopular: true
    }
  });

  const enterprisePlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'enterprise' },
    update: {},
    create: {
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'Unlimted power for large estate companies & multi-city groups.',
      priceMonthly: 199,
      priceYearly: 1990,
      maxProperties: 9999,
      maxStaff: 100,
      maxUnits: 10000,
      features: [
        'Unlimited Properties & Units',
        'Up to 100 Staff Members',
        'Custom Domain / White-labeling',
        'Dedicated Account Manager',
        'API Access & Integrations'
      ],
      isPopular: false
    }
  });

  console.log('✅ Subscription Plans created/updated.');

  // 2. Create Default Company (Tenant)
  const defaultCompany = await prisma.company.upsert({
    where: { slug: 'estatecloud-demo' },
    update: { planId: proPlan.id },
    create: {
      name: 'EstateCloud Demo Agency',
      slug: 'estatecloud-demo',
      email: 'info@estatecloud-demo.com',
      phone: '+92 300 1234567',
      address: 'Gulberg III, Lahore, Pakistan',
      status: 'Active',
      subscriptionStatus: 'Active',
      planId: proPlan.id
    }
  });

  console.log('✅ Default Company (Tenant) created:', defaultCompany.name);

  // 3. Attach existing data to Default Company if companyId is null
  await prisma.user.updateMany({
    where: { companyId: null, role: { not: 'superadmin' } },
    data: { companyId: defaultCompany.id }
  });

  await prisma.property.updateMany({
    where: { companyId: null },
    data: { companyId: defaultCompany.id }
  });

  await prisma.unit.updateMany({
    where: { companyId: null },
    data: { companyId: defaultCompany.id }
  });

  await prisma.contract.updateMany({
    where: { companyId: null },
    data: { companyId: defaultCompany.id }
  });

  await prisma.payment.updateMany({
    where: { companyId: null },
    data: { companyId: defaultCompany.id }
  });

  await prisma.expense.updateMany({
    where: { companyId: null },
    data: { companyId: defaultCompany.id }
  });

  await prisma.maintenance.updateMany({
    where: { companyId: null },
    data: { companyId: defaultCompany.id }
  });

  await prisma.booking.updateMany({
    where: { companyId: null },
    data: { companyId: defaultCompany.id }
  });

  await prisma.inquiry.updateMany({
    where: { companyId: null },
    data: { companyId: defaultCompany.id }
  });

  await prisma.payroll.updateMany({
    where: { companyId: null },
    data: { companyId: defaultCompany.id }
  });

  await prisma.role.updateMany({
    where: { companyId: null },
    data: { companyId: defaultCompany.id }
  });

  await prisma.setting.updateMany({
    where: { companyId: null },
    data: { companyId: defaultCompany.id }
  });

  console.log('✅ Existing records linked to default company.');

  // 4. Create Super Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@estatecloud.com' },
    update: { role: 'superadmin' },
    create: {
      name: 'Super Admin (EstateCloud)',
      email: 'superadmin@estatecloud.com',
      password: hashedPassword,
      role: 'superadmin',
      status: 'Active'
    }
  });

  console.log('✅ Super Admin account created:', superAdmin.email);
  console.log('🎉 SaaS Seeding completed successfully!');
}

seedSaaS()
  .catch((e) => {
    console.error('Error seeding SaaS:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
