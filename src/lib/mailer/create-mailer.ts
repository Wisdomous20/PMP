"use server";

import nodemailer, { type Transporter } from "nodemailer";

export async function createMailer(): Promise<Transporter> {
  return new Promise(r => {
    r(nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    }));
  });
}
