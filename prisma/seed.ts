import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { faker } from "@faker-js/faker";

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
  // const password = await hash("gracian", 12);
  // const res = await prisma.venue.createMany({
  //   data: venues
  // });
  // console.log(res)
  // const user = await prisma.examsOfficer.create({
  //   data: {
  //     first_name: "Oniti",
  //     last_name: "Isaac",
  //     email: "acestar@gmail.com",
  //     password,
  //   },
  // });
  // await prisma.camera.createMany({
  //   data: [
  //     {
  //       name: "NEB-GF Camera 1",
  //       venue_id: 3,
  //       status: "Active",
  //     },
  //     {
  //       name: "NEB-GF Camera 2",
  //       venue_id: 3,
  //       status: "Active",
  //     },
  //     {
  //       name: "NEB-GF Camera 3",
  //       venue_id: 3,
  //       status: "Active",
  //     },
  //     {
  //       name: "PB 001 Camera 1",
  //       venue_id: 2,
  //       status: "Active",
  //     },
  //   ],
  // });

  const programs = [
    "BSc. Computer Engineering",
    "BSc. Electrical Engineering",
    "BSc. Biomedical Engineering",
  ];

  const levels = [100, 200, 300, 400];

  const endYears = ["20", "21", "22", "23"];

  const students = [];

  for (let i = 0; i < 50; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const otherName = faker.person.middleName();
    const program = faker.helpers.arrayElement(programs);
    const level = faker.helpers.arrayElement(levels);
    const indexNumber =
      faker.number.int({ min: 100000, max: 999999 }) +
      faker.helpers.arrayElement(endYears);
    const referenceNo = faker.number.int({
      min: 10000000,
      max: 99999999,
    });
    const imageUrl = faker.image.avatar();

    students.push({
      first_name: firstName,
      last_name: lastName,
      other_name: otherName,
      program: program,
      level: level,
      index_number: Number(indexNumber),
      reference_no: referenceNo,
      image_url: imageUrl,
    });
  }

  const res = await prisma.student.createMany({
    data: students,
  });

  console.log("Seeding finished.");
  console.log(res);
  // console.log(user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
