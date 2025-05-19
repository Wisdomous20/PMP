"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Header from "@/components/layouts/Header"
import Link from "next/link"
import { Clock, MessageSquare, User, Users } from "lucide-react"
import Footer from "@/components/layouts/Footer"
import { fetchUserRole } from "@/domains/user-management/services/fetchUserRole"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function Page() {
  const router = useRouter()
  const howItWorksRef = useRef<HTMLElement>(null)
  const { data: session } = useSession()

  const { data: userRole, isLoading: isUserRoleLoading } = useQuery({
    queryKey: ["userRole", session?.user?.id],
    queryFn: () => fetchUserRole(session?.user?.id as string),
    enabled: !!session?.user?.id,
  })

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    if (!isUserRoleLoading && userRole && (userRole === "ADMIN" || userRole === "SUPERVISOR")) {
      router.push("/dashboard")
    }
  }, [isUserRoleLoading, userRole, router])

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 to-blue-50">
      <Header scrollToSection={scrollToSection} howItWorksRef={howItWorksRef} />
      <section className="pt-16 px-6 max-w-8xl mx-auto w-full">
        <div className="text-center max-w-5xl mx-auto mb-12">
          <div className="text-sm font-medium text-blue-600 mb-3 uppercase tracking-wider">REQUEST & MONITOR</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-2 leading-tight">
            Project Management System
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-yellow-400 mb-6 leading-tight">
            Office of the Vice President for Administration
          </h2>
          <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto">Central Philippine University</p>
          <Link
            href="/service-request/create"
            className="bg-blue-900 text-white px-8 py-4 rounded-md font-medium hover:bg-blue-800 transition-colors inline-flex items-center"
          >
            Create a Service Request
          </Link>
        </div>

        {/* Floating Cards Section */}
        <div className="relative mt-24 mb-12 w-full max-w-6xl mx-auto px-4">
          {/* Project Created Pill */}
          {/* Connection Lines - Hidden on mobile */}
          <div className="absolute inset-0 top-[-100px] z-0 hidden md:block pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1000 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M250 100 C 350 50, 400 150, 500 100 C 600 50, 650 150, 750 100"
                stroke="#BFDBFE"
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
              />
            </svg>
          </div>

          {/* Workflow Cards */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            {/* Card 1: New Request */}
            <div className="bg-white rounded-xl p-5 shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-blue-900 font-medium text-lg">New Service Request</h3>
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white">New</Badge>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-blue-800 font-medium">Internet Connectivity</span>
                </div>
                <p className="text-gray-700 text-sm">
                  No Internet Connectivity at Engineering since May 17, 2025.
                </p>
              </div>
              <div className="flex items-center justify-between text-gray-500 text-xs">
                <span>2 hours ago</span>
              </div>
            </div>

            {/* Card 2: Work Assignment */}
            <div className="bg-white rounded-xl p-5 shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-blue-900 font-medium text-lg">Implementation Plan</h3>
                <Badge className="bg-yellow-400 hover:bg-yellow-500 text-blue-900">In Progress</Badge>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-800 font-medium">Assigned to IT Team</span>
                </div>
                <p className="text-gray-700 text-sm">Technician dispatched to investigate internet connection at Engineering.</p>
              </div>
            </div>

            {/* Card 3: Process Started */}
            <div className="bg-white rounded-xl p-5 shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-blue-900 font-medium text-lg">Completion</h3>
                <Badge className="bg-green-500 hover:bg-green-600 text-white">Completed</Badge>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-blue-800 font-medium">Internet Connectivity Established</span>
                </div>
                <p className="text-gray-700 text-sm">Successfully Established Inernet Connectivity at Engineering </p>
              </div>
              <div className="flex items-center justify-between text-gray-500 text-xs">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>Feedback requested</span>
                </div>
                <span>Completed: Today</span>
              </div>
            </div>
          </div>

          {/* Bottom Card */}
          <div className="hidden md:block max-w-sm mx-auto bg-white rounded-xl p-5 shadow-lg border border-blue-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl mt-16 relative z-10">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-xs font-medium">
              Service Request Details
            </div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-blue-900">Computer Hardware Repair</h3>
              <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">John Doe</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Submitted: May 15, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">College of Computer Studies</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs text-gray-500 mb-1">Progress</div>
              <Progress value={65} className="h-2" />
            </div>
          </div>
        </div>
      </section>

      <section ref={howItWorksRef} className="my-8 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">How to process your service request</p>
        </div>
        <div className="h-[2px] w-1/2 bg-blue-900 mb-16 mx-auto"> </div>

        <div className="max-w-3xl mx-auto relative">
          <div className="absolute left-[28px] top-0 bottom-0 w-1 bg-blue-200 rounded-full"></div>

          <div className="mb-12 relative">
            <div className="flex">
              <div className="flex-shrink-0 relative z-10">
                <div className="w-14 h-14 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  1
                </div>
              </div>
              <div className="ml-6 bg-white p-6 rounded-xl shadow-md flex-1">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Submit a Service Request</h3>
                <p className="text-gray-600 leading-relaxed">
                  You can begin by submitting a service request using the system. Whether you&lsquo;re reporting an
                  issue, requesting maintenance, or suggesting an improvement, simply fill out the request form. Once
                  submitted, you&lsquo;ll receive a confirmation email letting you know your request is being reviewed.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12 relative">
            <div className="flex">
              <div className="flex-shrink-0 relative z-10">
                <div className="w-14 h-14 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  2
                </div>
              </div>
              <div className="ml-6 bg-white p-6 rounded-xl shadow-md flex-1">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Request Review</h3>
                <p className="text-gray-600 leading-relaxed">
                  An administrator will review your request to determine its urgency, feasibility, and the resources
                  needed.
                </p>
                <p className="text-gray-600 leading-relaxed mt-2">
                  If it&lsquo;s not approved, you&lsquo;ll be notified with a reason and given the option to update and
                  resubmit it.
                </p>
                <p className="text-gray-600 leading-relaxed mt-2">
                  If it&lsquo;s approved, you&lsquo;ll be given an approved status update and the project will move
                  forward to the planning stage.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12 relative">
            <div className="flex">
              <div className="flex-shrink-0 relative z-10">
                <div className="w-14 h-14 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  3
                </div>
              </div>
              <div className="ml-6 bg-white p-6 rounded-xl shadow-md flex-1">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Project Planning</h3>
                <p className="text-gray-600 leading-relaxed">
                  If your request is approved, the admin team will prepare a project plan outlining tasks, and
                  timelines. You&lsquo;ll receive a notification when the plan is ready for your review. You can either
                  approve it or request adjustments to ensure it meets your expectations before the work begins.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12 relative">
            <div className="flex">
              <div className="flex-shrink-0 relative z-10">
                <div className="w-14 h-14 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  4
                </div>
              </div>
              <div className="ml-6 bg-white p-6 rounded-xl shadow-md flex-1">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Project Execution</h3>
                <p className="text-gray-600 leading-relaxed">
                  Once the plan is approved, the project will begin as scheduled. You can track its progress directly
                  through the system. You&apos;ll also receive notifications about any updates or changes.
                </p>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative">
            <div className="flex">
              <div className="flex-shrink-0 relative z-10">
                <div className="w-14 h-14 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  5
                </div>
              </div>
              <div className="ml-6 bg-white p-6 rounded-xl shadow-md flex-1">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Provide Feedback</h3>
                <p className="text-gray-600 leading-relaxed">
                  After the project is completed, you&apos;ll be invited to provide feedback through a short survey.
                  Your input helps us evaluate the quality of service and improve future processes, ensuring your next
                  experience is even better.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
