"use client";

import * as accounts from "@/lib/accounts/register";
import {type ChangeEvent, type FormEvent, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Spinner} from "@/components/ui/spinner";
import {Check, ChevronsUpDown, Eye, EyeOff} from "lucide-react";
import {useRouter, useSearchParams} from "next/navigation";
import Image from "next/image";
import DEPARTMENTS from "@/lib/departments";
import {cn} from "@/lib/utils";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import validator from "@/lib/validators";
import type {RegisterInputType} from "@/lib/types/RegisterInputType";
import {ErrorCodes} from "@/lib/ErrorCodes";

const MAX_LENGTH = {
  firstName: 50,
  lastName: 50,
  department: 100,
  localNumber: 11,
  cellphoneNumber: 15,
  email: 255,
  password: 128,
};

interface RegisterInputState extends RegisterInputType {
  confirmPassword: string;
}

interface RegisterErrorState extends RegisterInputState {
  submit: string;
}

export default function Register() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/service-request/create";
  const router = useRouter();

  // Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Registration Input states
  const [inputs, setInputs] = useState<RegisterInputState>({
    firstName: "",
    lastName: "",
    localNumber: "",
    cellphoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });

  // Registration Errors goes here
  const [errors, setErrors] = useState<RegisterErrorState>({
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

  const [deptOpen, setDeptOpen] = useState(false);

  const validateForm = async () => {
    const newErrors: RegisterErrorState = {
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

    const result = await validator.validate<RegisterInputState>(inputs, {
      properties: {
        firstName: {type: "string", formatter: "ascii-names"},
        lastName: {type: "string", formatter: "ascii-names"},
        department: {type: "string", formatter: "non-empty-string"},
        localNumber: { type: "string", formatter: "local-number" },
        cellphoneNumber: { type: "string", formatter: "cellphone-number" },
        email: { type: "string", formatter: "cpu-email" },
        password: { type: "string", formatter: "strong-password" },
        confirmPassword: { type: "string", formatter: "strong-password" },
      },
      requiredProperties: [
        "firstName",
        "lastName",
        "department",
        "cellphoneNumber",
        "email",
        "password",
        "confirmPassword"
      ],
      allowUnvalidatedProperties: true,
    });

    if (!result.ok) {
      for (const e of Object.keys(result.errors)) {
        newErrors[e as keyof RegisterInputState] = result.errors[e as keyof RegisterInputState].message;
      }
    }

    setErrors(newErrors);
    return result.ok;
  };

  const handleInputChange = (key: keyof RegisterInputState, e: ChangeEvent<HTMLInputElement>) => {
    setInputs(l => ({
      ...l,
      [key]: e.target.value,
    }));
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const validation = await validateForm();
    if (!validation) {
      setIsLoading(false);
      return;
    }

    // Register the account
    const result = await accounts.register(inputs);

    // Account already exists
    if (result.code === ErrorCodes.ACCOUNT_ALREADY_EXISTS) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email already exists.",
      }));

      return;
    }

    // Success but sending mail has failed
    if (result.code === ErrorCodes.REGISTRATION_SUCCESS_BUT_MAIL_SEND_FAILURE) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        submit: "Registration successful, but failed to send verification email. Please check your spam folder or contact support.",
      }));
      setIsLoading(false);

      return;
    }

    setIsLoading(false);
    router.push(`/auth/verify-email?email=${encodeURIComponent(result.data!.email)}`);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
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
                value={inputs.firstName}
                onChange={(e) => handleInputChange('firstName', e)}
                className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400"
                placeholder="Enter your first name"
                maxLength={MAX_LENGTH.firstName}
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
                value={inputs.lastName}
                onChange={(e) => handleInputChange('lastName', e)}
                className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400"
                placeholder="Enter your last name"
                maxLength={MAX_LENGTH.lastName}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              Department
            </label>
            <Popover open={deptOpen} onOpenChange={setDeptOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="department"
                  role="combobox"
                  aria-expanded={deptOpen}
                  variant="outline"
                  className={cn(
                    "w-full justify-between bg-white bg-opacity-20 text-white placeholder-gray-400",
                    !inputs.department && "text-gray-400"
                  )}
                >
                  {inputs.department || "Select department..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] w-auto overflow-auto">
                <Command className="w-full">
                  <CommandInput placeholder="Search department..." />
                  <CommandList className="w-full">
                    <CommandEmpty className="w-full">No department found.</CommandEmpty>
                    <CommandGroup className="w-full">
                      {DEPARTMENTS.map((dept) => (
                        <CommandItem
                          key={dept}
                          value={dept}
                          onSelect={(current) => {
                            setInputs(l => ({
                              ...l,
                              department: current,
                            }));
                            setDeptOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              inputs.department === dept ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {dept}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
                Local Number (Optional)
              </label>
              <Input
                id="localNumber"
                type="text"
                value={inputs.localNumber}
                onChange={(e) => handleInputChange('localNumber', e)}
                className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400"
                placeholder="Enter your local number"
                maxLength={MAX_LENGTH.localNumber}
              />
              {errors.localNumber && (
                <p className="text-red-500 text-xs mt-1 h-10 md:h-6">{errors.localNumber}</p>
              )}
            </div>
            <div className="mt-auto">
              <label
                htmlFor="cellphoneNumber"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Cellphone Number
              </label>
              <Input
                id="cellphoneNumber"
                type="text"
                value={inputs.cellphoneNumber}
                onChange={(e) => handleInputChange('cellphoneNumber', e)}
                className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400"
                placeholder="Enter your cellphone number"
                maxLength={MAX_LENGTH.cellphoneNumber}
              />
              {errors.cellphoneNumber && (
                <p className="text-red-500 text-xs mt-1 h-10 md:h-6">{errors.cellphoneNumber}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              CPU Email
            </label>
            <Input
              id="email"
              type="email"
              value={inputs.email}
              onChange={(e) => handleInputChange('email', e)}
              className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400"
              placeholder="Enter your CPU email"
              maxLength={MAX_LENGTH.email}
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
                value={inputs.password}
                onChange={(e) => handleInputChange('password', e)}
                className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400 pr-10"
                placeholder="Enter your password"
                maxLength={MAX_LENGTH.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
                value={inputs.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e)}
                className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400 pr-10"
                placeholder="Confirm your password"
                maxLength={MAX_LENGTH.password}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
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
            <a
              href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="text-yellow-400 hover:underline"
            >
              Log in here
            </a>
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          <a href="mailto:ovpa@cpu.edu.ph" className="hover:underline">
            Help
          </a>
          ·
          <a href="/privacy-policy" className="ml-2 hover:underline">
            Privacy Policy
          </a>
          ·
          <a href="/terms-and-conditions" className="ml-2 hover:underline">
            Terms and Conditions
          </a>
        </div>
      </div>
    </div>
  );
}