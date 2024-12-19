"use client";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";


const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    submit: "",
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('/api/auth/reset-password', { email });
      setMessage(response.data.message);
    } catch (err: any) {
      setErrors(err.response?.data?.message || 'Failed to send password reset email');
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

export default ForgetPassword;