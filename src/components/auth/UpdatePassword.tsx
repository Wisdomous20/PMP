"use client";

import { useState } from "react";
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import validator from 'validator';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const UpdatePassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    submit: "",
  });
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      password: "",
      confirmPassword: "",
      submit: "",
    };

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/update-password', { token, password });
      setMessage(response.data.message);
    } catch (err: any) {
      setErrors({ ...errors, submit: err.response?.data?.message || 'Failed to reset password' });
    } finally {
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

export default UpdatePassword;