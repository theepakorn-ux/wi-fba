import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const departments = [
  { code: "FBA-OFFICE", name: "สำนักงานคณบดีคณะบริหารธุรกิจ" },
  { code: "FBA-ACCT", name: "สาขาการบัญชี" },
  { code: "FBA-MGMT", name: "สาขาการจัดการ" },
  { code: "FBA-MKT", name: "สาขาการตลาด" },
  { code: "FBA-IS", name: "สาขาระบบสารสนเทศ" },
];

async function main() {
  for (const department of departments) {
    await prisma.department.upsert({
      where: { code: department.code },
      update: { name: department.name, isActive: true },
      create: department,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
