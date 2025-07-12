"use client";

import * as accounts from "@/lib/accounts/update-password";
import type {ChangeEvent, FormEvent} from "react";
import {ErrorCodes} from "@/lib/ErrorCodes";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {useState} from "react";
import {useSearchParams} from 'next/navigation';
import validator from "@/lib/validators";

interface UpdatePasswordState {
  password: string;
  confirmPassword: string;
}

interface UpdatePasswordStateErrors extends UpdatePasswordState {
  submit: string;
}

export default function UpdatePassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // State
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<UpdatePasswordState>({
    password: "",
    confirmPassword: ""
  });

  // Errors
  const [errors, setErrors] = useState<UpdatePasswordStateErrors>({
    password: "",
    confirmPassword: "",
    submit: "",
  });

  const validateForm = async (): Promise<boolean> => {
    const newErrors: UpdatePasswordStateErrors = {
      password: "",
      confirmPassword: "",
      submit: "",
    };

    const validation = await validator.validate(form, {
      properties: {
        password: {type: "string", formatter: "strong-password"},
        confirmPassword: {
          type: "string",
          formatterFn: async (x) => {
            if (form.password !== x) {
              return {
                ok: false,
                error: "Passwords do not match",
              };
            }

            return {ok: true};
          }
        }
      },
      requiredProperties: ["password", "confirmPassword"],
    });
    if (!validation.ok) {
      for (const e of Object.keys(validation.errors)) {
        newErrors[e as keyof UpdatePasswordState] = validation.errors[e as keyof UpdatePasswordState].message;
      }
    }

    setErrors(newErrors);
    return validation.ok;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setMessage('');
    setIsLoading(true);

    const validate = await validateForm();
    if (validate) {
      setIsLoading(false);
      return;
    }

    const updateResult = await accounts.updatePassword({
      token: token!,
      password: form.password,
    });

    // Failed
    if (updateResult.code !== ErrorCodes.OK) {
      setErrors(e => ({
        ...e,
        submit: updateResult.message as string,
      }));
      setIsLoading(false);
      return;
    }

    // Success
    setMessage("Password updated successfully.");
    setIsLoading(false);
  };

  const handleChange = (t: keyof UpdatePasswordState, e: ChangeEvent<HTMLInputElement>) => {
    setForm(l => ({
      ...l,
      [t]: e.target.value,
    }));
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/cpu-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="z-10 w-full max-w-md p-6 rounded-lg bg-black bg-opacity-70">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-2xl font-bold text-yellow-400">
            Reset Password
          </h1>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              New password
            </label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e)}
              className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400"
              placeholder="Enter your new password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              Confirm password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => handleChange('password', e)}
              className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400"
              placeholder="Confirm your new password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          <Button
            id="reset-password"
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
            type="submit"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center gap-2">
              {isLoading && <Spinner size="small" />}
              {!isLoading && "Reset Password"}
            </div>
          </Button>
          {message &&
           <p className="text-green-500 text-m mt-1">{message}</p>}   
          {errors.submit && <p className="text-red-500 text-m mt-1">{errors.submit}</p>}
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            <a
              href="/auth/login"
              className="text-yellow-400 hover:underline"
            >
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
