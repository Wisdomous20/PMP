"use client";

import Image from "next/image";
import Link from "next/link";
import { RefObject, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  scrollToSection: (ref: React.RefObject<HTMLElement | null>) => void;
  howItWorksRef: RefObject<HTMLElement | null>;
}

export default function Header({ howItWorksRef, scrollToSection }: HeaderProps) {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="px-4 md:px-8 lg:px-16 py-4 relative z-10">
      <div className="flex justify-between items-center h-20">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/cpu-logo.png"
            width={40}
            height={40}
            alt="Central Philippine University logo"
            className="w-8 h-8 sm:w-12 sm:h-12"
          />
          <div>
            <h1 className="text-yellow-400 text-sm sm:text-base md:text-xl font-semibold">
              Central Philippine University
            </h1>
            <span className="block text-blue-900 text-xs sm:text-sm font-normal">
              Project Management System
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            className="text-gray-600 hover:text-blue-900 transition-colors"
            onClick={() => scrollToSection(howItWorksRef)}
          >
            How it works?
          </button>
          {session?.user && (
            <Link
              href="/service-request"
              className="text-gray-600 hover:text-blue-900 transition-colors"
            >
              Your Service Requests
            </Link>
          )}
        </nav>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {session?.user ? (
            <button
              onClick={() => signOut()}
              className="text-blue-900 font-medium hover:text-blue-700 transition-colors"
            >
              Log Out
            </button>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-blue-900 font-medium hover:text-blue-700 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-900 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-blue-900"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-4 border-t pt-4">
          <button
            className="text-gray-600 hover:text-blue-900 transition-colors text-left"
            onClick={() => {
              scrollToSection(howItWorksRef);
              setIsMobileMenuOpen(false);
            }}
          >
            How it works?
          </button>
          {session?.user && (
            <Link
              href="/service-request"
              className="text-gray-600 hover:text-blue-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Your Service Requests
            </Link>
          )}
          {session?.user ? (
            <button
              onClick={() => {
                signOut();
                setIsMobileMenuOpen(false);
              }}
              className="text-blue-900 font-medium hover:text-blue-700 transition-colors text-left"
            >
              Log Out
            </button>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-blue-900 font-medium hover:text-blue-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-900 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
