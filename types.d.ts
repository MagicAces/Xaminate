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

export interface SessionDisplay {
  sessions: {
    reportsCount: number;
    created_on: string;
    duration: string;
    id: number;
    course_names: string[];
    venue_id: number;
  }[];
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
  reload: boolean;
  isDisabled: boolean;
}
