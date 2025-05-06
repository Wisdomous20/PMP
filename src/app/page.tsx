"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/layouts/Header";
import Link from "next/link";
import { CheckCircle, Clock, FileText, Users } from "lucide-react";
import Footer from "@/components/layouts/Footer";
import { fetchUserRole } from "@/domains/user-management/services/fetchUserRole";

export default function Page() {
  const router = useRouter();
  const howItWorksRef = useRef<HTMLElement>(null);
  const { data: session } = useSession();

  const { data: userRole, isLoading: isUserRoleLoading } = useQuery({
    queryKey: ["userRole", session?.user?.id],
    queryFn: () => fetchUserRole(session?.user?.id as string),
    enabled: !!session?.user?.id,
  });

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!isUserRoleLoading && userRole && (userRole === "ADMIN" || userRole === "SUPERVISOR")) {
      router.push("/dashboard");
    }
  }, [isUserRoleLoading, userRole, router]);

  // if (isUserRoleLoading || (userRole && (userRole === "ADMIN" || userRole === "SUPERVISOR"))) {
  //    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  // }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 to-blue-50">
      <Header scrollToSection={scrollToSection} howItWorksRef={howItWorksRef} />
      <section className="pt-16 px-6 max-w-8xl mx-auto">
        <div className="text-center max-w-5xl mx-auto mb-12">
          <div className="text-sm font-medium text-blue-600 mb-3 uppercase tracking-wider">
            REQUEST & MONITOR
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-2 leading-tight">
            Project Management System
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-yellow-400 mb-6 leading-tight">
            Central Philippine University
          </h2>
          <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Request services from the University under the Office of the Vice
            President of Administration.
          </p>
          <Link
            href="/service-request/create"
            className="bg-blue-900 text-white px-8 py-4 rounded-md font-medium hover:bg-blue-800 transition-colors inline-flex items-center"
          >
            Create a Service Request
          </Link>
        </div>

        {/* Floating UI Elements */}
        <div className="relative mt-24 mb-16 w-full">
          {/* Central Element */}
          <div className="bg-blue-900 rounded-xl p-6 max-w-3xl mx-auto text-white relative z-10 shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-blue-800 rounded-lg p-4 md:w-1/3">
                <h3 className="text-2xl font-bold mb-2">Request #SR-2458</h3>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Submitted on April 15, 2023</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Technical Support</span>
                </div>
              </div>

              <div className="md:w-2/3">
                <div className="mb-4">
                  <h4 className="text-lg font-medium mb-1">Description</h4>
                  <p className="text-blue-100">
                    Computer not turning on after power outage. Need urgent
                    assistance as this is affecting my work.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-1">Status</h4>
                  <div className="flex items-center gap-2">
                    <div className="bg-yellow-500 text-blue-900 px-3 py-1 rounded-full text-sm font-medium">
                      In Progress
                    </div>
                    <span className="text-blue-100 text-sm">
                      Last updated: 2 hours ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Element - Left */}
          <div className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/4 bg-white p-5 rounded-xl shadow-lg w-64 z-20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-blue-900" />
              </div>
              <h4 className="font-medium text-blue-900">Easy Submission</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Submit requests in just a few clicks with our intuitive form
            </p>
          </div>

          {/* Floating Element - Right */}
          <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4 bg-white p-5 rounded-xl shadow-lg w-64 z-20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-blue-900" />
              </div>
              <h4 className="font-medium text-blue-900">Real-time Updates</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Track the status of your requests with real-time notifications
            </p>
          </div>

          {/* Floating Element - Bottom */}
          <div className="hidden md:block absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 bg-white p-5 rounded-xl shadow-lg w-64 z-20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-blue-900" />
              </div>
              <h4 className="font-medium text-blue-900">Collaborative</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Work together with service providers to resolve your issues
            </p>
          </div>
        </div>
      </section>

      <section ref={howItWorksRef} className="my-8 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            How to process your service request
          </p>
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
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  Submit a Service Request
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  You can begin by submitting a service request using the
                  system. Whether you&lsquo;re reporting an issue, requesting
                  maintenance, or suggesting an improvement, simply fill out the
                  request form. Once submitted, you&lsquo;ll receive a
                  confirmation email letting you know your request is being
                  reviewed.
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
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  Request Review
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  An administrator will review your request to determine its
                  urgency, feasibility, and the resources needed.
                </p>
                <p className="text-gray-600 leading-relaxed mt-2">
                  If it&lsquo;s not approved, you&lsquo;ll be notified with a
                  reason and given the option to update and resubmit it.
                </p>
                <p className="text-gray-600 leading-relaxed mt-2">
                  If it&lsquo;s approved, you&lsquo;ll be given an approved
                  status update and the project will move forward to the
                  planning stage.
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
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  Project Planning
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  If your request is approved, the admin team will prepare a
                  project plan outlining tasks, and timelines. You&lsquo;ll
                  receive a notification when the plan is ready for your review.
                  You can either approve it or request adjustments to ensure it
                  meets your expectations before the work begins.
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
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  Project Execution
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Once the plan is approved, the project will begin as
                  scheduled. You can track its progress directly through the
                  system. You&apos;ll also receive notifications about any
                  updates or changes.
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
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  Provide Feedback
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  After the project is completed, you&apos;ll be invited to
                  provide feedback through a short survey. Your input helps us
                  evaluate the quality of service and improve future processes,
                  ensuring your next experience is even better.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}