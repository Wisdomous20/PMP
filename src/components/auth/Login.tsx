"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [staySignedIn, setStaySignedIn] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/cpu-bg.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="z-10 w-full max-w-md p-8 rounded-lg bg-black bg-opacity-70">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/images/cpu-logo.png"
            width={80}
            height={80}
            alt="Central Philippines University logo"
            className="mb-4"
          />
          <h1 className="text-2xl font-bold text-yellow-400">Project Management System</h1>
          <p className="text-sm text-yellow-200">Central Philippines University</p>
        </div>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
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
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white bg-opacity-20 text-white placeholder-gray-400"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox
                id="stay-signed-in"
                checked={staySignedIn}
                onCheckedChange={(checked) => setStaySignedIn(checked as boolean)}
                className="border-gray-400"
              />
              <label htmlFor="stay-signed-in" className="ml-2 text-sm text-gray-200">
                Stay signed in
              </label>
            </div>
            <a href="#" className="text-sm text-yellow-400 hover:underline">
              Forgot Password?
            </a>
          </div>
          <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
            Log In
          </Button>
        </form>
        <div className="mt-6 text-center text-xs text-gray-400">
          <a href="#" className="hover:underline">Help</a> · 
          <a href="#" className="ml-2 hover:underline">Privacy Policy</a> · 
          <a href="#" className="ml-2 hover:underline">Terms of Use</a>
        </div>
      </div>
    </div>
  )
}