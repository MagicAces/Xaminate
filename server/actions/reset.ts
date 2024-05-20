"use server";

import {
  EmailInput,
  emailSchema,
  OTPInput,
  OTPSchema,
  PasswordInput,
  passwordSchema,
} from "@/lib/schema";
import { action } from "./actions";
import prisma from "@/prisma/prisma";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import OTP from "@/emails/OTP";
import { hash, hashSync } from "bcryptjs";

const getToken = (): string => {
  let token = randomBytes(32).readUInt32BE(0) % 1000000;
  return token.toString().padStart(6, "0");
};

class EmailError extends Error {
  constructor(message: string, public code: number) {
    super(message);
    this.name = "EmailError";
  }
}

class OTPError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OTPError";
  }
}

const sendEmail = async (email: string, token: string) => {
  const emailHtml = render(OTP({ otp: token }));

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Xaminate" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Forgot Password",
    html: emailHtml,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      throw new EmailError("Error occured sending code", 501);
    }

    console.log("Email sent: " + info.response);
  });
};

export const sendOTP = action(emailSchema, async (value: EmailInput) => {
  try {
    const { email } = value;

    const user = await prisma.examsOfficer.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) throw new EmailError("Email not registered", 502);

    const token = getToken();

    await prisma.token.deleteMany({
      where: {
        user_id: user.id,
      },
    });
    const newToken = await prisma.token.create({
      data: {
        token,
        user_id: user.id,
      },
    });

    await sendEmail(user.email, token);
    return {
      success: "OTP Code has been sent",
      ids: { tokenId: newToken.id, userId: user.id },
    };
  } catch (error: any) {
    if (error instanceof EmailError)
      return {
        error: error?.message,
        section: error?.code === 502 ? 1 : 2,
      };

    throw error;
  }
});

export const verifyOTP = action(OTPSchema, async (value: OTPInput) => {
  try {
    const { otp, userId, tokenId } = value;

    const [foundToken, foundUser] = await Promise.all([
      prisma.token.findUnique({
        where: {
          id: tokenId,
          token: otp,
          user_id: userId,
        },
      }),
      prisma.examsOfficer.findUnique({
        where: {
          id: userId,
        },
      }),
    ]);

    if (!foundToken) throw new OTPError("Invalid Token");

    if (!foundUser) throw new EmailError("User not registered", 502);

    const expiryDate = new Date(foundToken.expirationDate);
    if (expiryDate.getTime() <= Date.now())
      throw new OTPError("Token has expired");

    return { success: "Successfully verified OTP", section: 3 };
  } catch (error: any) {
    if (error instanceof OTPError) return { error: error?.message, section: 2 };
    if (error instanceof EmailError)
      return { error: error?.message, section: 1 };

    throw error;
  }
});

export const changePassword = action(
  passwordSchema,
  async (value: PasswordInput) => {
    try {
      const { password, userId } = value;
      const passwordHash = await hash(password, 12);

      await prisma.examsOfficer.update({
        where: {
          id: userId,
        },
        data: {
          password: passwordHash,
        },
      });

      return { success: "Password saved", section: 4 };
    } catch (error: any) {
      if (error?.detail.includes("RecordNotFound"))
        return { error: "User not registered" };
      throw error;
    }
  }
);
