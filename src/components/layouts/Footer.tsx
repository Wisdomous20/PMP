import Link from "next/link"
import Image from "next/image"
import { Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-12 px-6 max-w-7xl mx-auto border-t border-gray-200 mt-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div>
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
        </div>

        <div>
          <h4 className="font-bold text-blue-900 mb-4">Information</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-gray-600 hover:text-blue-900 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-600 hover:text-blue-900 transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-blue-900 mb-4">Contact</h4>
          <ul className="space-y-2 text-gray-600">

            <li className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span> 3266/3260</span>
            </li>

            <li className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <a
                // href="mailto:info@sigrabfilmfest.com"
                className="hover:text-blue-100 transition-all duration-300"
              >
                ovpa@cpu.edu.ph
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-600 mb-4 md:mb-0">© {new Date().getFullYear()} Central Philippine University Project Management System. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="text-gray-600 hover:text-blue-900 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" className="text-gray-600 hover:text-blue-900 transition-colors">
            Terms and Conditions
          </Link>
        </div>
      </div>
    </footer>
  )
}