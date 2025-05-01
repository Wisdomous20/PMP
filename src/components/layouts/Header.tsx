import Image from "next/image"
import Link from "next/link"
import { RefObject } from "react"

interface HeaderProps {
  scrollToSection: (ref: React.RefObject<HTMLElement>) => void
  howItWorksRef: RefObject<HTMLElement>
}

export default function Header({ howItWorksRef, scrollToSection }: HeaderProps) {
  return (
    <div className="py-4 px-4 md:px-8 lg:px-16 flex h-20 justify-between items-center w-full">
      <div className="flex items-center gap-2">
        <Image
          src="/images/cpu-logo.png"
          width={50}
          height={50}
          alt="Central Philippine University logo"
        />
        <h1 className="text-yellow-400 text-xl font-semibold">
          Central Philippine University
          <span className="block text-blue-900 text-sm font-normal">
            Project Management System
          </span>
        </h1>
      </div>
      <div className="hidden md:flex items-center space-x-8">
        <button className="text-gray-600 hover:text-blue-900 transition-colors"
          onClick={() =>
            scrollToSection(howItWorksRef as RefObject<HTMLElement>)
          }>
          How it works?
        </button>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/auth/login" className="text-blue-900 font-medium hover:text-blue-700 transition-colors">
          Log In
        </Link>
        <Link
          href="/auth/register"
          className="bg-blue-900 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}
