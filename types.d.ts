import { DefaultSession } from "next-auth";
import { Category } from "@prisma/client";

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

export interface ModalSliceState {
  loader: boolean;
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
