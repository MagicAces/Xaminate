"use server";

import { signIn, signOut } from "@/auth";
import { AutheniticateInput, authenticateSchema } from "@/lib/schema";
import { AuthError } from "next-auth";
import {
  isRedirectError,
  redirect,
} from "next/dist/client/components/redirect";
import { action } from "./actions";


export const authenticate = action(
  authenticateSchema,
  async (credentials: AutheniticateInput) => {
    try {
      const data = await signIn("credentials", credentials);
      
      return { success: "Welcome back", data };
    } catch (error) {
      if (isRedirectError(error))
        throw error;

      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials." };
          case "CallbackRouteError":
            return { error: error?.cause?.err?.toString() };
          default:
            return { error: "Something went wrong." };
        }
      }
      throw error;
    }
  }
);

export const logout = async () => {
  try {
    await signOut({ redirect: true, redirectTo: "/login" });
    return {success: true}
  } catch (error) {
    // throw error;
    return { success: false };
  }
}