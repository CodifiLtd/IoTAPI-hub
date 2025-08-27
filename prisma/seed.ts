import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = ['Owner', 'Resident', 'Guest'];

  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {}, // do nothing if it already exists
      create: { name }
    });
  }

  console.log('Default roles inserted ✅');

  // seed device types
  const deviceTypes = [
    { code: 'LIGHT', description: 'Smart Light', manufacturer: 'Aico' },
    { code: 'THERMO', description: 'Smart Thermostat', manufacturer: 'Aico' },
    { code: 'CAMERA', description: 'Security Camera', manufacturer: 'Aico' },
    { code: 'LOCK', description: 'Smart Lock', manufacturer: 'Aico' }
  ];

  for (const dt of deviceTypes) {
    await prisma.deviceType.upsert({
      where: { code: dt.code }, // code must be unique
      update: {},
      create: dt
    });
  }

  console.log('Default device types inserted ✅');
}

main()
  .catch(e => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
