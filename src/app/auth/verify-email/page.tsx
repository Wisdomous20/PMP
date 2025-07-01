"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Mail, ArrowLeft } from "lucide-react";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/images/cpu-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="z-10 w-full max-w-md p-8 rounded-lg bg-black bg-opacity-70">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/images/cpu-logo.png"
            width={80}
            height={80}
            alt="Central Philippine University logo"
            className="mb-4"
          />
          <h1 className="text-xl font-bold text-yellow-400">
            Project Management System
          </h1>
          <p className="text-sm text-yellow-200">
            Central Philippine University
          </p>
        </div>

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-black" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              Check Your Email
            </h2>
            <p className="text-gray-300 text-sm">
              We&apos;ve sent a verification link to
            </p>
            <p className="text-yellow-400 font-medium break-all">
              {email}
            </p>
            <p className="text-gray-300 text-xs">
              Please check your inbox and click the verification link to activate your account.
              The link will expire in 15 minutes.
            </p>
            <p className="text-gray-400 text-xs">
              Don&apos;t forget to check your spam folder if you don&apos;t see the email.
            </p>
          </div>

          <Button
            onClick={handleBackToLogin}
            variant="outline"
            className="w-full bg-transparent border-gray-400 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <div className="flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </div>
          </Button>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          ·
          <a href="privacy-policy" className="ml-2 hover:underline">
            Privacy Policy
          </a>
          ·
          <a href="terms-and-conditions" className="ml-2 hover:underline">
            Terms and conditions
          </a>
        </div>
      </div>
    </div>
  );
}
