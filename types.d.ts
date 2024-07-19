import { DefaultSession } from "next-auth";
import { Category, Report } from "@prisma/client";
import { SessionInput } from "./lib/schema";

export interface IEmailProps {
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    email: string,
    setEmail: (email: string) => void
  ) => void;
  isLoading: boolean;
}

export interface ResetState {
  section: number;
  email: string;
  otp: string[];
  password: {
    newPass: string;
    confirmPass: string;
  };
  tokenId: string;
  userId: string;
}

export interface OTPProps {
  otp: string;
}

export interface ModalState {
  id: number;
  mode: number;
  type: string;
}

export interface ModalContextType {
  modalState: ModalState;
  setState: (id: number, mode: number, type: string) => void;
  setType: (type: string) => void;
  setId: (id: number) => void;
  setMode: (mode: number) => void;
  exitModal: () => void;
}
export interface ModalProviderProps {
  children: ReactNode;
}

export interface Venue {
  id: number;
  name: string;
  bookings: VenueBooking[];
  created_on: string;
  updated_at: string;
}

export interface VenueBooking {
  start_time: string;
  end_time: string;
  id: number;
  venue_id: number;
  session_id: number;
}

export interface SelectOption {
  readonly value: number | string;
  readonly label: string;
  readonly isDisabled?: boolean;
}

export type SessionEdit = {
  id: number;
  sessionStart: string;
  sessionEnd: string;
  comments: string | null;
  classes: string[];
  courseNames: string[];
  invigilators: string[];
  courseCodes: string[];
  venue: {
    id: number;
    name: string;
  };
};

export interface ModalSliceState {
  venues: Venue[];
  session: SessionEdit | {};
  report: ReportInfo | {};
  student: StudentInfo | {};
  summary: SessionSummary | {};
  reload: boolean;
}

export interface Notification {
  id: number;
  read: boolean;
  category_id: number;
  message: string;
  created_on: Date;
  updated_at: Date;
  category: Category;
}

export interface SidebarState {
  fullView: boolean;
}

// ---------  Session ---------------

export interface SessionWarn {
  courseNames: number[];
  courseCodes: number[];
  classes: number[];
  venue: boolean;
  sessionStart: boolean;
  sessionEnd: boolean;
  invigilators: number[];
}

export interface SessionRow {
  reportsCount: number;
  created_on: string;
  duration: string;
  id: number;
  course_codes: string[];
  venue_id: number;
  venue_name: string;
  studentCount: number;
  status: string;
}

export interface SessionDisplay {
  sessions: SessionRow[];
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pageNumber: number;
  pendingCount: number;
  activeCount: number;
  closedCount: number;
}

export interface SessionQuery {
  page: number;
  limit: number;
  venue: number;
  status: string;
  startTime: string;
  endTime: string;
  search: string;
}

interface SessionBox {
  query: SessionQuery;
  filter: {
    venue: number;
    status: string;
    startTime: string;
    endTime: string;
  };
  search: string;
  mode: "none" | "query";
}

export interface SessionSlice {
  data: SessionDisplay | undefined;
  sessionsBox: SessionBox;
  session: SessionOutput | undefined;
  reload: boolean;
  isDisabled: boolean;
}

export interface SessionOutput {
  id: number;
  start_time: string;
  end_time: string;
  venue_id: number;
  comments: string | null;
  actual_end_time: string | undefined;
  actualDuration: string | undefined;
  terminated_by: number | null;
  created_by: number | null;
  course_names: string[];
  course_codes: string[];
  classes: string[];
  invigilators: string[];
  created_on: string;
  updated_at: string;
  temp_status: string;
  attendance: SessionOutputAttendance | null;
  venue: SessionOutputVenue;
  terminator: SessionOutputExamsOfficer | null;
  creator: SessionOutputExamsOfficer | null;
  reports: SessionOutputReport[];
  _count: SessionOutputCount;
  duration: string;
  status: string;
}

export interface SessionSummary {
  reports: {
    pending: number;
    approved: number;
    rejected: number;
  };
  students: {
    fullname: string;
    index_number: number;
    frequency: number;
  }[];
}

interface SessionOutputAttendance {
  student_count: number;
  id: number;
}

interface SessionOutputVenue {
  name: string;
  id: number;
}

interface SessionOutputExamsOfficer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface SessionOutputReport {
  id: number;
  status: string;
  description: string;
  created_on: string;
  student: SessionOutputStudent | null;
  timestamp: string;
}

interface SessionOutputStudent {
  index_number: number;
  first_name: string;
  last_name: string;
  program: string;
  image_url: string | null;
}

interface SessionOutputCount {
  reports: number;
}

// -------- Reports --------------
export interface ReportSlice {
  data: ReportDisplay | undefined;
  reportsBox: ReportBox;
  report: ReportOutput | undefined;
  reload: boolean;
  isDisabled: boolean;
}

export interface ReportDisplay {
  reports: ReportRow[];
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pageNumber: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface ReportRow {
  id: number;
  student: {
    id: number | string;
    fullName: string;
    photo: string;
    index_number: number | string;
  };
  session_id: number;
  status: string;
  timestamp: string;
}

interface ReportBox {
  query: ReportQuery;
  filter: {
    startTime: string;
    endTime: string;
  };
  sort: {
    field: keyof Report;
    order: "asc" | "desc";
  };
  status: string;
  search: string;
  mode: "none" | "query";
}

export interface ReportQuery {
  page: number;
  limit: number;
  sort: {
    field: keyof Report;
    order: "asc" | "desc";
  };
  startTime: string;
  endTime: string;
  search: string;
}

type SortableReportFields = "id" | "status" | "timestamp" | "session_id";

export interface ReportOutput {
  id: number;
  student: {
    id: number;
    level: string;
    last_name: string;
    first_name: string;
    reference_no: number;
    index_number: number;
    program: string;
    photo: string;
  };
  status: string;
  description: string;
  comments: string | null;
  snapshot_url: string;
  timestamp: string;
  session_id: number;
  status_changed: string | undefined;
  editor:
    | {
        id: number;
        first_name: string;
        last_name: string;
      }
    | undefined;
  created_on: string;
  updated_at: string;
  valid_reports: number;
  total_reports: number;
  last_seven: {
    session_id: number;
    report_count: number;
  }[];
}

export interface ReportInfo {
  id: number;
  student: {
    id: number;
    fullName: string;
    reference_no: number;
    index_number: number;
    program: string;
    photo: string;
  };
  timestamp: string;
  session_id: number;
  description: string;
}

export interface StudentInfo {
  fullName: string;
  index_number: number;
  reference_no: number;
  valid_reports: number;
  total_reports: number;
  photo: string;
  last_seven: {
    session_id: number;
    report_count: number;
  }[];
}
