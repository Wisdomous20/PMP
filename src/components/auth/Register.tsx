"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import validator from "validator";

export default function Register() {
  const callbackUrl = "/";
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cellphoneNumber, setCellphoneNumber] = useState("");
  const [localNumber, setLocalNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    localNumber: "",
    cellphoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    submit: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      localNumber: "",
      cellphoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
      submit: "",
    };

    if (!validator.isAlpha(firstName, 'en-US', { ignore: " -" })) {
      newErrors.firstName = "First name must contain only letters.";
      isValid = false;
    } else if (validator.isEmpty(firstName)) {
      newErrors.firstName = "First name is required.";
      isValid = false;
    }
  
    if (!validator.isAlpha(lastName, 'en-US', { ignore: " -" })) {
      newErrors.lastName = "Last name must contain only letters.";
      isValid = false;
    } else if (validator.isEmpty(lastName)) {
      newErrors.lastName = "Last name is required.";
      isValid = false;
    }
    
    if (validator.isEmpty(department)) {
      newErrors.department = "Department is required.";
      isValid = false;
    }

    if (!validator.isEmpty(localNumber) && !validator.isNumeric(localNumber)) {
      newErrors.localNumber = "Local number must contain only numbers.";
      isValid = false;
    } else if (!validator.isEmpty(localNumber) && !validator.isLength(localNumber, { min: 7, max: 10 })) {
      newErrors.localNumber = "Local number must be between 7 and 10 digits.";
      isValid = false;
    }

    if (validator.isEmpty(cellphoneNumber)) {
      newErrors.cellphoneNumber = "Cellphone number is required.";
      isValid = false;
    } else if (!validator.isMobilePhone(cellphoneNumber, 'any')) {
      newErrors.cellphoneNumber = "Please enter a valid cellphone number.";
      isValid = false;
    }

    if (!department.trim()) {
      newErrors.department = "Department is required.";
      isValid = false;
    }

    if (!validator.isEmail(email) || !email.endsWith("@cpu.edu.ph")) {
      newErrors.email = "Please enter a valid CPU email address.";
      isValid = false;
    }

    if (!validator.isStrongPassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
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
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstName, lastName, email, password, cellphoneNumber, localNumber, department }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.error === "Email already exists") {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "Email already exists.",
            }));
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              submit: data.error || "An error occurred during registration.",
            }));
          }
          setIsLoading(false);
          return;
        }

        const signInResult = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (signInResult?.error) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            submit: signInResult.error || "An error occurred during sign in.",
          }));
          setIsLoading(false);
        } else {
          router.push(callbackUrl)
        }
      } catch (error) {
        console.error("Registration error:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          submit: "An error occurred during registration.",
        }));
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
      <div className="z-10 w-full max-w-lg p-6 rounded-lg max-h-[95vh] bg-black bg-opacity-70 overflow-y-auto subtle-scrollbar">
        <div className="flex flex-col items-center mb-4">
          <Image
            src="/images/cpu-logo.png"
            width={80}
            height={80}
            alt="Central Philippine University logo"
            className="mb-4"
          />
          <h1 className="text-2xl font-bold text-yellow-400">
            Project Management System
          </h1>
          <p className="text-sm text-yellow-200">
            Central Philippine University
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                First Name
              </label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400"
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Last Name
              </label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400"
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              Unit/Department/College
            </label>
            <Input
              id="department"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400"
              placeholder="Enter your unit/department/college"
            />
            {errors.department && (
              <p className="text-red-500 text-xs mt-1">{errors.department}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-2">
            <div>
              <label
                htmlFor="localNumber"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Local Number
              </label>
              <Input
                id="localNumber"
                type="text"
                value={localNumber}
                onChange={(e) => setLocalNumber(e.target.value)}
                className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400"
                placeholder="Enter your local number"
              />
              {errors.localNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.localNumber}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="cellphoneNumber"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Cellphone Number
              </label>
              <Input
                id="cellphoneNumber"
                type="text"
                value={cellphoneNumber}
                onChange={(e) => setCellphoneNumber(e.target.value)}
                className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400"
                placeholder="Enter your cellphone number"
              />
              {errors.cellphoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cellphoneNumber}</p>
              )}
            </div>
          </div>

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
              placeholder="Enter your CPU email"
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400 pr-10"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center gap-2">
              {isLoading && <Spinner size="small" />}
              {!isLoading && "Register"}
            </div>
          </Button>
        </form>

        {errors.submit && (
          <p className="text-red-500 text-center mt-4">{errors.submit}</p>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <a href="/auth/login" className="text-yellow-400 hover:underline">
              Log in here
            </a>
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
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
