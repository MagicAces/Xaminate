import { faker } from "@faker-js/faker";

// Interface for Student
interface Student {
  id: number;
  index_number: string;
  first_name: string;
  last_name: string;
  other_name: string;
  program: string;
  level: number;
  image_url: string;
}

// Interface for ExamsOfficer
interface ExamsOfficer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  email_alerts: boolean;
}

// Interface for Report
interface Report {
  id: number;
  status: string;
  timestamp: string;
  student: Student | null;
  description: string;
  comments: string | undefined;
  last_edited_by: number | undefined;
  snapshot_url: string | undefined;
  status_changed: string | undefined;
  session_id: number;
  created_on: string;
  updated_at: string;
}

// Function to generate random students
function generateStudents(count: number): Student[] {
  const students: Student[] = [];

  for (let i = 0; i < count; i++) {
    const student: Student = {
      id: i + 1,
      index_number: faker.string.numeric(7),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      other_name: faker.person.firstName(),
      program: faker.helpers.arrayElement([
        "BSc. Computer Engineering",
        "BSc. Aerospace Engineering",
        "BSc. Electrical Engineering",
        "BSc. Materials Engineering",
      ]),
      level: faker.helpers.arrayElement([100, 200, 300, 400]),
      image_url: faker.image.urlPicsumPhotos(),
    };

    students.push(student);
  }

  return students;
}

// Function to generate random reports
function generateReports(count: number, students: Student[]): Report[] {
  const reports: Report[] = [];

  for (let i = 0; i < count; i++) {
    const student = faker.helpers.arrayElement([...students, null]);

    const report: Report = {
      id: faker.number.int({ min: 1, max: 100 }),
      status: faker.helpers.arrayElement(["Approved", "Pending", "Rejected"]),
      timestamp: faker.date.recent().toISOString(),
      student: student,
      description: faker.lorem.paragraph(),
      comments: faker.helpers.maybe(() => faker.lorem.sentence(), {
        probability: 0.5,
      }),
      last_edited_by: faker.helpers.maybe(() => 1, { probability: 0.5 }),
      snapshot_url: faker.helpers.maybe(() => faker.image.urlPicsumPhotos(), {
        probability: 0.5,
      }),
      status_changed: faker.helpers.maybe(
        () => faker.date.recent().toISOString(),
        { probability: 0.5 }
      ),
      session_id: faker.helpers.arrayElement([5, 6]),
      created_on: faker.date.recent().toISOString(),
      updated_at: faker.date.recent().toISOString(),
    };

    reports.push(report);
  }

  return reports;
}

// Function to generate a single ExamsOfficer
function generateExamsOfficer(): ExamsOfficer {
  return {
    id: 1,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    email_alerts: faker.datatype.boolean(),
  };
}

// Generate students, reports, and exams officer
const students = generateStudents(30);
const reports = generateReports(50, students);
const examsOfficer = generateExamsOfficer();

// Exporting the generated data for use in other parts of the application
export { students, reports, examsOfficer };
