import Image from "next/image";
import Link from "next/link";
import { RefObject } from "react";
import { useSession, signOut } from "next-auth/react";

interface HeaderProps {
  scrollToSection: (ref: React.RefObject<HTMLElement>) => void;
  howItWorksRef: RefObject<HTMLElement>;
}

export default function Header({ howItWorksRef, scrollToSection }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <div className="py-4 px-4 md:px-8 lg:px-16 flex h-20 justify-between items-center w-full">
      <div className="flex items-center gap-2">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/images/cpu-logo.png"
            width={50}
            height={50}
            alt="Central Philippine University logo"
          />
          <div className="ml-2">
            <h1 className="text-yellow-400 text-xl font-semibold">
              Central Philippine University
            </h1>
            <span className="block text-blue-900 text-sm font-normal">
              Project Management System
            </span>
          </div>
        </Link>
      </div>
      <div className="hidden md:flex items-center space-x-8">
        <button
          className="text-gray-600 hover:text-blue-900 transition-colors"
          onClick={() =>
            scrollToSection(howItWorksRef as RefObject<HTMLElement>)
          }
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
      </div>
      <div className="flex items-center gap-3">
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
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}