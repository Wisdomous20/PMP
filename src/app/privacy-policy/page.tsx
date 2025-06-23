"use client";

import { useRef } from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { ArrowLeft, Lock, Shield, Eye, Server, Globe } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const policyRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 to-blue-50">
      <Header scrollToSection={scrollToSection} howItWorksRef={policyRef} />

      <section className="pt-16 px-6 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-900 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="text-sm font-medium text-blue-600 mb-3 uppercase tracking-wider">
            Important Information
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 leading-tight">
            Privacy Policy
          </h1>
          <div className="flex justify-center mb-8">
            <div className="bg-blue-100 p-3 rounded-full">
              <Lock className="h-8 w-8 text-blue-900" />
            </div>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Central Philippine University is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Project Management System.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> May 11, 2025
            </p>

            <section className="space-y-12" ref={policyRef}>
              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <Eye className="mr-3 h-6 w-6 text-blue-800" />
                  Information We Collect
                </h2>
                <div className="ml-9 space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Personal Information</h3>
                    <p className="text-gray-600 mb-3">
                      We may collect the following personal information when you register for and use the Project Management System:
                    </p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>Full name</li>
                      <li>Email address</li>
                      <li>Department or unit affiliation</li>
                      <li>Contact information</li>
                      <li>User role and permissions within the system</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Service Request Information</h3>
                    <p className="text-gray-600 mb-3">
                      When you submit service requests, we collect information related to:
                    </p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>Request descriptions and details</li>
                      <li>Location information relevant to the request</li>
                      <li>Timestamps of submission and updates</li>
                      <li>Communications related to your requests</li>
                      <li>Feedback provided about completed services</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Usage Data</h3>
                    <p className="text-gray-600 mb-3">
                      We automatically collect certain information when you access and use the system:
                    </p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>IP address</li>
                      <li>Device information (type, operating system, browser)</li>
                      <li>Log data (pages visited, actions taken, time spent)</li>
                      <li>Login dates and times</li>
                      <li>System interaction patterns</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <Server className="mr-3 h-6 w-6 text-blue-800" />
                  How We Use Your Information
                </h2>
                <div className="ml-9 space-y-4">
                  <p className="text-gray-600">
                    Central Philippine University uses the collected information for the following purposes:
                  </p>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">System Operation</h3>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>To create and maintain your user account</li>
                      <li>To process, track, and manage service requests</li>
                      <li>To assign appropriate personnel to address requests</li>
                      <li>To communicate updates about request status</li>
                      <li>To facilitate communication between requesters and service providers</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Service Improvement</h3>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>To analyze usage patterns and optimize system functionality</li>
                      <li>To identify common issues or recurring requests</li>
                      <li>To evaluate service quality and efficiency</li>
                      <li>To develop new features and improve existing ones</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Administrative Purposes</h3>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>To generate reports on service performance</li>
                      <li>To allocate resources effectively across departments</li>
                      <li>To maintain records for institutional accountability</li>
                      <li>To ensure compliance with university policies</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Security and Legal Compliance</h3>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>To protect against unauthorized access or misuse</li>
                      <li>To detect and prevent fraudulent activities</li>
                      <li>To comply with legal obligations and regulations</li>
                      <li>To establish, exercise, or defend legal claims when necessary</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <Shield className="mr-3 h-6 w-6 text-blue-800" />
                  Information Sharing and Disclosure
                </h2>
                <div className="ml-9 space-y-6">
                  <p className="text-gray-600">
                    We are committed to maintaining your privacy and will not sell, rent, or lease your personal information to third parties. However, we may share your information in the following circumstances:
                  </p>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Internal University Departments</h3>
                    <p className="text-gray-600">
                      Information is shared with relevant university departments and personnel solely for the purpose of fulfilling service requests and maintaining efficient operations under the Office of the Vice President for Administration.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Service Providers</h3>
                    <p className="text-gray-600">
                      We may engage trusted third-party service providers to assist in operating, maintaining, and enhancing our system. These providers have access to your information only to perform specific tasks on our behalf and are obligated to protect your information.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Legal Requirements</h3>
                    <p className="text-gray-600">
                      We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., court order, government request). We may also disclose information when we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">With Your Consent</h3>
                    <p className="text-gray-600">
                      We may share your information with third parties when you have given us explicit consent to do so.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <Lock className="mr-3 h-6 w-6 text-blue-800" />
                  Data Security
                </h2>
                <div className="ml-9 space-y-4">
                  <p className="text-gray-600">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction:
                  </p>

                  <ul className="list-disc ml-6 text-gray-600 space-y-2">
                    <li>Data encryption for information transmitted through the system</li>
                    <li>Secure authentication procedures including password policies</li>
                    <li>Regular security assessments and vulnerability testing</li>
                    <li>Access controls limiting data access to authorized personnel</li>
                    <li>Server security measures and firewall protection</li>
                    <li>Regular data backups to prevent data loss</li>
                    <li>Staff training on data protection and security practices</li>
                  </ul>

                  <p className="text-gray-600 mt-4">
                    While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security but continuously work to enhance our security measures.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <Globe className="mr-3 h-6 w-6 text-blue-800" />
                  Your Rights and Choices
                </h2>
                <div className="ml-9 space-y-6">
                  <p className="text-gray-600">
                    As a user of our Project Management System, you have certain rights regarding your personal information:
                  </p>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Access and Update</h3>
                    <p className="text-gray-600">
                      You can access and update your profile information directly through your account settings. For information that cannot be modified through the system, please contact the system administrator.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Data Request</h3>
                    <p className="text-gray-600">
                      You may request a copy of the personal information we hold about you. We will provide this information in a structured, commonly used, and machine-readable format.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Deletion</h3>
                    <p className="text-gray-600">
                      You may request deletion of your personal information, subject to certain exceptions prescribed by law and legitimate university record-keeping requirements. Note that some information may be retained in archive or backup systems for legal and operational purposes.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Restriction of Processing</h3>
                    <p className="text-gray-600">
                      You can request that we restrict the processing of your information under certain circumstances, such as if you contest the accuracy of the data or object to our processing of it.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">How to Exercise Your Rights</h3>
                    <p className="text-gray-600">
                      To exercise these rights, please contact our Data Protection Officer at dpo@cpu.edu.ph or submit a written request to the Office of the Vice President for Administration. We will respond to your request within 30 days.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Cookies and Similar Technologies</h2>
                <div className="ml-9">
                  <p className="text-gray-600 mb-4">
                    Our system uses cookies and similar tracking technologies to enhance your experience and collect information about how you use the system:
                  </p>

                  <ul className="list-disc ml-6 text-gray-600 space-y-2">
                    <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser, used to maintain your session while using the system</li>
                    <li><strong>Authentication Cookies:</strong> Used to identify you once you have logged in</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the system</li>
                  </ul>

                  <p className="text-gray-600 mt-4">
                    You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of the system.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Data Retention</h2>
                <div className="ml-9">
                  <p className="text-gray-600 mb-4">
                    We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. The retention periods for different types of data may vary:
                  </p>

                  <ul className="list-disc ml-6 text-gray-600 space-y-2">
                    <li><strong>Account Information:</strong> Maintained for the duration of your affiliation with the university and for a reasonable period thereafter</li>
                    <li><strong>Service Request Data:</strong> Retained for up to 5 years after completion for reference, auditing, and analysis purposes</li>
                    <li><strong>Usage Data:</strong> Typically retained for up to 2 years for system improvement purposes</li>
                    <li><strong>Communication Records:</strong> Maintained for up to 3 years after the last interaction</li>
                  </ul>

                  <p className="text-gray-600 mt-4">
                    When your data is no longer required, we will securely delete or anonymize it so that it can no longer be associated with you.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Children&apos;s Privacy</h2>
                <div className="ml-9">
                  <p className="text-gray-600">
                    Our Project Management System is not intended for use by individuals under the age of 18. We do not knowingly collect personally identifiable information from children. If we become aware that we have collected personal information from a child without verification of parental consent, we will take steps to remove that information from our servers.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Changes to This Privacy Policy</h2>
                <div className="ml-9">
                  <p className="text-gray-600">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date at the top. For significant changes, we will provide a more prominent notice, which may include email notifications to registered users.
                  </p>
                  <p className="text-gray-600 mt-4">
                    We encourage you to review this Privacy Policy periodically for any changes. Your continued use of the Project Management System after we post changes to the Privacy Policy will constitute your acknowledgment of the changes and your consent to abide by and be bound by the updated policy.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Contact Us</h2>
                <div className="ml-9">
                  <p className="text-gray-600 mb-4">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                  </p>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-gray-700 font-medium">Project Management System Administrator</p>
                    <p className="text-gray-600">Central Philippine University</p>
                    <p className="text-gray-600">Office of the Vice President for Administration</p>
                    <p className="text-gray-600">Email: ovpa@cpu.edu.ph</p>
                    <p className="text-gray-600">Phone: 3266/3260</p>
                    <p className="text-gray-600">Address: Jaro, Iloilo City, Philippines</p>
                  </div>
                </div>
              </section>
            </section>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-900 text-white rounded-xl p-8 mb-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Have Questions About Your Privacy?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            We&apos;re committed to transparency and protecting your information. If you need clarification on any aspect of our privacy policy, our team is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="mailto:ovpa@cpu.edu.ph"
              className="bg-white text-blue-900 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/service-request/create"
              className="bg-blue-800 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Create a Service Request
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}