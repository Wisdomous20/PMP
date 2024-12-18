"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import validator from "validator";
import { signIn } from "next-auth/react";


export default function Login() {
  const callbackUrl = "/service-request";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    submit: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [resetpassword, setResetPassword] = useState<boolean>(false);

    const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
      submit: "",
    };

    if (!validator.isEmail(email) || !email.endsWith("@cpu.edu.ph")) {
      newErrors.email = "Please enter a valid CPU email address";
      isValid = false;
    }

    if (!validator.isLength(password, { min: 8 })) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (validateForm()) {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: email,
          password: password,
        });

        if (result?.error) {
          console.error("Login error:", result.error);
          setIsLoading(false);

          if (result.error.includes("Email not found")) {
            setErrors({
              ...errors,
              submit: "Email not found. Please register first",
            });
          } else if (result.error.includes("Invalid email or password")) {
            setErrors({ ...errors, submit: "Invalid email or password" });
          } else {
            setErrors({ ...errors, submit: "Invalid email or password" });
          }
        } else {
          setTimeout(() => {
            router.push(callbackUrl);
          }, 2000);
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrors({ ...errors, submit: "An error occurred during login" });
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/cpu-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="z-10 w-full max-w-md p-6 rounded-lg bg-black bg-opacity-70">
        <div className="flex flex-col items-center mb-4">
          <Image
            src="/images/cpu-logo.png"
            width={80}
            height={80}
            alt="Central Philippines University logo"
            className="mb-4"
          />
          <h1 className="text-2xl font-bold text-yellow-400">
            Project Management System
          </h1>
          <p className="text-sm text-yellow-200">
            Central Philippines University
          </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400 pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

       <p onClick={() => setResetPassword(!resetpassword)} className="text-yellow-400 hover:underline cursor-pointer">
        {resetpassword ? 'Login' : 'Forgot Password'}</p>
          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}
          {!resetpassword &&
          <div>
            <div>

            </div>

          <Button
            id="login-button"
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
            type="submit"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center gap-2">
              {isLoading && <Spinner size="small" />}
              {!isLoading && "Log In"}
            </div>
          </Button>
          </div>}
          {resetpassword && <div>
            <div>
            <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
              
            </div>
            <br></br>
            <Button
            id="reset-button"
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
            type="submit"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center gap-2">
              {isLoading && <Spinner size="small" />}
              {!isLoading && "Reset Password"}
            </div>
          </Button>
          </div>}

        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Don&lsquo;t have an account?{" "}
            <a
              href="/auth/register"
              className="text-yellow-400 hover:underline"
            >
              Register here
            </a>
          </p>
        </div>
        <div className="mt-6 text-center text-xs text-gray-400">
          <a href="#" className="hover:underline">
            Help
          </a>{" "}
          ·
          <a href="#" className="ml-2 hover:underline">
            Privacy Policy
          </a>{" "}
          ·
          <a href="#" className="ml-2 hover:underline">
            Terms of Use
          </a>
        </div>
      </div>
    </div>
  );
}
