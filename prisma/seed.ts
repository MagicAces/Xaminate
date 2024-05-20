import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("gracian", 12);

  const user = await prisma.examsOfficer.create({
    data: {
      first_name: "Oniti",
      last_name: "Isaac",
      email: "acestar@gmail.com",
      password,
    },
  });

  console.log(user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
