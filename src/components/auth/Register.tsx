"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff, Check, ChevronsUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import validator from "validator";
import { fetchVerificationToken } from "@/domains/user-management/services/fetchVerificationToken";
import { fetchSendUserVerificationEmail } from "@/domains/notification/services/fetchSendUserVerificationEmail";
import DEPARTMENTS from "@/lib/departments";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { register } from "@/lib/user-actions";

const MAX_LENGTH = {
  firstName: 50,
  lastName: 50,
  department: 100,
  localNumber: 11,
  cellphoneNumber: 15,
  email: 255,
  password: 128,
};

export default function Register() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/service-request/create";
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

  const [deptOpen, setDeptOpen] = useState(false);

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

    const nameRegex = new RegExp("^\\p{L}[\\p{L}\\s'-]*$", "u");

    if (validator.isEmpty(firstName)) {
      newErrors.firstName = "First name is required.";
      isValid = false;
    } else if (!nameRegex.test(firstName)) {
      newErrors.firstName =
        "First name may only include letters (including ñ, é, etc.), spaces, hyphens or apostrophes.";
      isValid = false;
    } else if (firstName.length > MAX_LENGTH.firstName) {
      newErrors.firstName = `First name cannot exceed ${MAX_LENGTH.firstName} characters.`;
      isValid = false;
    }

    if (validator.isEmpty(lastName)) {
      newErrors.lastName = "Last name is required.";
      isValid = false;
    } else if (!nameRegex.test(lastName)) {
      newErrors.lastName =
        "Last name may only include letters (including ñ, é, etc.), spaces, hyphens or apostrophes.";
      isValid = false;
    } else if (lastName.length > MAX_LENGTH.lastName) {
      newErrors.lastName = `Last name cannot exceed ${MAX_LENGTH.lastName} characters.`;
      isValid = false;
    }

    if (validator.isEmpty(department.trim())) {
      newErrors.department = "Department is required.";
      isValid = false;
    } else if (department.length > MAX_LENGTH.department) {
      newErrors.department = `Department cannot exceed ${MAX_LENGTH.department} characters.`;
      isValid = false;
    }

    if (!validator.isEmpty(localNumber)) {
      if (!validator.isNumeric(localNumber)) {
        newErrors.localNumber = "Local number must contain only numbers.";
        isValid = false;
      } else if (!(validator.isLength(localNumber, { min: 7, max: MAX_LENGTH.localNumber }) || validator.isLength(localNumber, { min: 4, max: 4 }))) {
        newErrors.localNumber = `Local number must be 4 digits or between 7 and ${MAX_LENGTH.localNumber} digits.`;
        isValid = false;
      }
    }


    if (validator.isEmpty(cellphoneNumber)) {
      newErrors.cellphoneNumber = "Cellphone number is required.";
      isValid = false;
    } else if (!validator.isMobilePhone(cellphoneNumber, 'any')) {
      newErrors.cellphoneNumber = "Please enter a valid cellphone number.";
      isValid = false;
    } else if (cellphoneNumber.length > MAX_LENGTH.cellphoneNumber) {
      newErrors.cellphoneNumber = `Cellphone number cannot exceed ${MAX_LENGTH.cellphoneNumber} characters.`;
      isValid = false;
    }

    if (!validator.isEmail(email) || !email.endsWith("@cpu.edu.ph")) {
      newErrors.email = "Please enter a valid CPU email address.";
      isValid = false;
    } else if (email.length > MAX_LENGTH.email) {
      newErrors.email = `Email address cannot exceed ${MAX_LENGTH.email} characters.`;
      isValid = false;
    }

    if (!validator.isStrongPassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.";
      isValid = false;
    } else if (password.length > MAX_LENGTH.password) {
      newErrors.password = `Password cannot exceed ${MAX_LENGTH.password} characters.`;
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
        // const response = await fetch("/api/auth/register", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ firstName, lastName, email, password, cellphoneNumber, localNumber, department }),
        // });

        const data = await register(
          firstName,
          lastName,
          email,
          password,
          cellphoneNumber,
          department,
          localNumber
        )

        // const data = await response.json();

        if (data.status !== 201) {
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

        // const signInResult = await signIn("credentials", {
        //   redirect: false,
        //   email,
        //   password,
        // });

        // if (signInResult?.error) {
        //   setErrors((prevErrors) => ({
        //     ...prevErrors,
        //     submit: signInResult.error || "An error occurred during sign in.",
        //   }));
        //   setIsLoading(false);
        //   return
        // }

        try {

          if (!data.newUser || !data.newUser.id) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              submit: "Registration successful, but user information is incomplete. Please contact support.",
            }));
            setIsLoading(false);
            return;
          }
          const verificationToken = await fetchVerificationToken(data.newUser.id);
          await fetchSendUserVerificationEmail(
            email,
            `${firstName} ${lastName}`,
            data.newUser.id,
            verificationToken
          );

          router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);

        } catch (emailError) {
          console.error("Failed to send verification email:", emailError);
          setErrors((prevErrors) => ({
            ...prevErrors,
            submit: "Registration successful, but failed to send verification email. Please check your spam folder or contact support.",
          }));
          setIsLoading(false);
        }

      } catch (error) {
        console.error("Registration process error:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          submit: "An unexpected error occurred during the registration process.",
        }));
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
                    !department && "text-gray-400"
                  )}
                >
                  {department || "Select department..."}
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
                            setDepartment(current);
                            setDeptOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              department === dept ? "opacity-100" : "opacity-0"
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
                value={localNumber}
                onChange={(e) => setLocalNumber(e.target.value)}
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
                value={cellphoneNumber}
                onChange={(e) => setCellphoneNumber(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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