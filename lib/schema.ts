import { number, object, string, TypeOf } from "zod";

export const loginSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" }).min(
    1,
    "Password is required"
  ),
});

export const authenticateSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" }).min(
    1,
    "Password is required"
  ),
  redirectTo: string(),
});

export const registerSchema = object({
  firstName: string({ required_error: "First name is required" }).min(
    1,
    "First name is required"
  ),
  lastName: string({ required_error: "Last name is required" }).min(
    1,
    "Last name is required"
  ),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  passwordConfirm: string({
    required_error: "Please confirm your password",
  }).min(1, "Please confirm your password"),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});

export const emailSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
});

export const OTPSchema = object({
  otp: string({ required_error: "OTP is required" }).length(
    6,
    "OTP must be 6 digit"
  ),
  userId: number({ required_error: "User Id is Required" }).gte(1, {
    message: "Id should be greater than 1",
  }),
  tokenId: number({ required_error: "Token Id is Required" }),
});

export const passwordSchema = object({
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  userId: number({ required_error: "User Id is Required" }).gte(1, {
    message: "Id should be greater than ti",
  }),
});

export const profileSchema = object({
  firstName: string({ required_error: "First name is required" }).min(
    1,
    "First name is required"
  ),
  lastName: string({ required_error: "Last name is required" }).min(
    1,
    "Last name is required"
  ),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
});

export const markNotificationAsReadSchema = object({
  id: number(),
});

export const emptySchema = object({});

export type LoginInput = TypeOf<typeof loginSchema>;
export type AutheniticateInput = TypeOf<typeof authenticateSchema>;
export type RegisterInput = TypeOf<typeof registerSchema>;
export type EmailInput = TypeOf<typeof emailSchema>;
export type OTPInput = TypeOf<typeof OTPSchema>;
export type PasswordInput = TypeOf<typeof passwordSchema>;
export type ProfileInput = TypeOf<typeof profileSchema>;
