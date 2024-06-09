import { faker } from "@faker-js/faker";

interface Student {
  index_number: string;
  first_name: string;
  last_name: string;
  program: string;
  image: string;
}

interface Report {
  id: number;
  status: string;
  created_on: string;
  student: Student;
}

// Function to generate random reports
function generateReports(count: number): Report[] {
  const reports: Report[] = [];

  for (let i = 0; i < count; i++) {
    const report: Report = {
      id: faker.number.int({ min: 1, max: 100 }),
      status: faker.helpers.arrayElement(["Approved", "Pending", "Rejected"]),
      created_on: faker.date.recent().toISOString(),
      student: {
        index_number: faker.string.numeric(7),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        program: faker.helpers.arrayElement([
          "BSc. Computer Engineering",
          "BSc. Aerospace Engineering",
          "BSc. Electrical Engineering",
          "BSc. Materials Engineering",
        ]),
        image: faker.image.urlPicsumPhotos(),
      },
    };

    reports.push(report);
  }

  return reports;
}

// Generate an array of 10 random reports
const reports = generateReports(15);

// Export the generated reports
export default reports;
