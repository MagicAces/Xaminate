"use server";

import { signIn, signOut } from "@/auth";
import {
  AutheniticateInput,
  authenticateSchema,
  emailAlertsSchema,
} from "@/lib/schema";
import { AuthError } from "next-auth";
import {
  isRedirectError,
  RedirectType,
} from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { action, authAction } from "./actions";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma/prisma";

export const authenticate = action(
  authenticateSchema,
  async (credentials: AutheniticateInput) => {
    try {
      // const data =
      await signIn("credentials", credentials);
      // console.log(data);
      // revalidatePath("/");
      // redirect(credentials.redirectTo);
      // return { success: "Welcome back", data };
    } catch (error) {
      if (isRedirectError(error)) throw error;

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
  } catch (error) {
    throw error;
  }
};

export const updateAlert = authAction(
  emailAlertsSchema,
  async ({ emailAlerts }: { emailAlerts: boolean }, { userId }) => {
    try {
      const updatedUser = await prisma.examsOfficer.update({
        where: { id: Number(userId) },
        data: {
          email_alerts: emailAlerts,
        },
      });

      revalidatePath("/settings");

      return {
        success: "Successfully Updated Status",
        emailAlerts: updatedUser.email_alerts,
      };
    } catch (error: any) {
      console.log(error);
      return { error: "Something went wrong" };
    }
  }
);
