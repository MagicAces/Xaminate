import { DefaultSession } from "next-auth";
import { Category } from "@prisma/client";
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
  created_on: string;
  updated_at: string;
}

export interface SelectOption {
  readonly value: number | string;
  readonly label: string;
}

export type Session =
  | {
      type: "edit" | "create";
      sessionStart: Date | string | null;
      sessionEnd: Date | string | null;
      comments?: string;
      classes: string[];
      courseNames: string[];
      invigilators: string[];
      courseCodes: string[];
      venue: number;
    }
  | {};

export interface ModalSliceState {
  venues: Venue[];
  session: Session;
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
  reports: SessionOutputReport[] | null;
  _count: SessionOutputCount;
  duration: string;
  status: string;
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
  student: Student;
}

interface SessionOutputStudent {
  index_number: number;
  first_name: string;
  last_name: string;
  program: string;
  image_url: string;
}

interface SessionOutputCount {
  reports: number;
}

export interface SidebarState {
  fullView: boolean;
}