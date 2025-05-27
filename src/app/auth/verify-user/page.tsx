"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

type VerifyStatus = "idle" | "loading" | "success" | "error";

function VerifyUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userIdQuery = searchParams.get("userId");
    const tokenQuery = searchParams.get("token");

    console.log(userIdQuery)
    console.log(tokenQuery)

    if (userIdQuery) {
      setUserId(userIdQuery);
    } else {
      setMessage("Missing user ID in verification link.");
      setVerifyStatus("error");
    }
    
    if (tokenQuery) {
      setToken(tokenQuery);
    } else {
      setMessage("Missing verification token.");
      setVerifyStatus("error");
    }
  }, [searchParams]);

  const handleVerify = useCallback(async () => {
    if (!userId || !token) {
      setMessage("Missing verification parameters.");
      setVerifyStatus("error");
      return;
    }

    setVerifyStatus("loading");

    try {
      const response = await fetch("/api/auth/validate-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, token }),
      });

      const data = await response.json();

      console.log(data)

      if (response.ok && data.success) {
        setVerifyStatus("success");
        setMessage(data.message || "Email verified successfully!");
      } else {
        setVerifyStatus("error");
        setMessage(data.error || "Verification failed. The link may have expired or is invalid.");
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      setVerifyStatus("error");
      setMessage("An error occurred while verifying your email. Please try again.");
    }
  }, [userId, token]);

  useEffect(() => {
    if (userId && token && verifyStatus === "idle") {
      handleVerify();
    }
  }, [userId, token, verifyStatus, handleVerify]);

  const handleGoToLogin = () => {
    router.push("/auth/login");
  };

  // const handleResendVerification = () => {
  //   router.push("/auth/register");
  // };

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
          {verifyStatus === "loading" && (
            <>
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">
                  Verifying Your Email
                </h2>
                <p className="text-gray-300 text-sm">
                  Please wait while we verify your account...
                </p>
              </div>
            </>
          )}

          {(verifyStatus === "success" || verifyStatus === "error") && (
            <>
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">
                  Email Verified Successfully!
                </h2>
                <p className="text-gray-300 text-sm">
                  {message}
                </p>
              </div>
              <Button
                onClick={handleGoToLogin}
                className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
              >
                Continue to Login
              </Button>
            </>
          )}

          {/* {verifyStatus === "error" && (
            <>
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">
                  Verification Failed
                </h2>
                <p className="text-gray-300 text-sm">
                  {message}
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={handleGoToLogin}
                  className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
                >
                  Go to Login
                </Button>
                <Button
                  onClick={handleResendVerification}
                  variant="outline"
                  className="w-full bg-transparent border-gray-400 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Register Again
                </Button>
              </div>
            </>
          )} */}
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          <a href="#" className="hover:underline">
            Help
          </a>
          ·
          <a href="#" className="ml-2 hover:underline">
            Privacy Policy
          </a>
          ·
          <a href="#" className="ml-2 hover:underline">
            Terms of Use
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <VerifyUserPage />
    </Suspense>
  );
}