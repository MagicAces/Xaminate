import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const venues = [
  {
    name: "A110",
  },
  {
    name: "BKB303",
  },
  {
    name: "NEB-GF",
  },
];

const prisma = new PrismaClient();
    
async function main() {
  const password = await hash("gracian", 12);
  const res = await prisma.venue.createMany({
    data: venues
  });
  console.log(res)
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
