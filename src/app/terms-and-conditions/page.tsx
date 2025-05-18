"use client";

import { useRef } from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { ArrowLeft, FileText, Scale, AlertCircle, BookOpen, Clock, LifeBuoy, Building, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function TermsAndConditionsPage() {
  const termsRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 to-blue-50">
      <Header scrollToSection={scrollToSection} howItWorksRef={termsRef} />
      
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
            Legal Agreement
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 leading-tight">
            Terms and Conditions
          </h1>
          <div className="flex justify-center mb-8">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-8 w-8 text-blue-900" />
            </div>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Please read these Terms and Conditions carefully before using the Central Philippine University Project Management System.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> May 11, 2025
            </p>

            <section className="space-y-12" ref={termsRef}>
              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-6">
                  Agreement to Terms
                </h2>
                <div className="ml-3 space-y-4 text-gray-600">
                  <p>
                    These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of your department or unit (&quot;you&quot;) and Central Philippine University (&quot;University&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), concerning your access to and use of the Project Management System (&quot;System&quot;).
                  </p>
                  <p>
                    By accessing, registering, or using the System, you acknowledge that you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, you are prohibited from using the System and must discontinue use immediately.
                  </p>
                  <p>
                    Supplemental terms may apply to certain services or features of the System, and such supplemental terms will be disclosed to you in connection with the applicable services. Any supplemental terms are in addition to these Terms and Conditions and shall be deemed a part of these Terms and Conditions.
                  </p>
                  <p>
                    We reserve the right, in our sole discretion, to make changes or modifications to these Terms and Conditions at any time and for any reason. We will alert you about any changes by updating the &quot;Last Updated&quot; date of these Terms and Conditions, and you waive any right to receive specific notice of each such change.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <BookOpen className="mr-3 h-6 w-6 text-blue-800" />
                  System Access and Account Security
                </h2>
                <div className="ml-9 space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Account Eligibility</h3>
                    <p className="text-gray-600 mb-3">
                      The System is intended solely for use by current faculty, staff, students, and authorized affiliates of Central Philippine University. By using the System, you represent and warrant that:
                    </p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>You are a current member or authorized affiliate of Central Philippine University</li>
                      <li>You have been provided with authorized access credentials by the University</li>
                      <li>You are at least 18 years of age or are accessing under the supervision of a parent, legal guardian, or University advisor</li>
                      <li>You will use the System in accordance with all applicable laws, regulations, and University policies</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Account Credentials</h3>
                    <p className="text-gray-600 mb-3">
                      When you are assigned account credentials or create an account, you agree to:
                    </p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>Provide accurate, current, and complete information</li>
                      <li>Maintain and promptly update your account information</li>
                      <li>Maintain the security of your account by not sharing your password with others</li>
                      <li>Accept all risks of unauthorized access to your account</li>
                      <li>Notify us immediately upon discovering any security breach or unauthorized use of your account</li>
                    </ul>
                    <p className="text-gray-600 mt-3">
                      You are solely responsible for all activity that occurs under your account, and the University may hold you liable for losses incurred by the University or others due to someone else using your credentials.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Account Termination</h3>
                    <p className="text-gray-600">
                      We reserve the right to suspend or terminate your access to the System, with or without notice and without liability, for any reason, including but not limited to:
                    </p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>Violation of these Terms and Conditions</li>
                      <li>Ending of your affiliation with the University</li>
                      <li>Conduct we determine to be harmful to other users, third parties, or University interests</li>
                      <li>Unauthorized use of the System</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <Scale className="mr-3 h-6 w-6 text-blue-800" />
                  Intellectual Property Rights
                </h2>
                <div className="ml-9 space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">University Ownership</h3>
                    <p className="text-gray-600">
                      The System and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Central Philippine University, its licensors, or other providers of such material and are protected by Philippine and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Limited License</h3>
                    <p className="text-gray-600">
                      The University grants you a limited, non-exclusive, non-transferable, revocable license to access and use the System strictly in accordance with these Terms and Conditions. This license does not include:
                    </p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>The right to reproduce, distribute, modify, or create derivative works of the System</li>
                      <li>The right to sell, rent, lease, or sublicense the System</li>
                      <li>The right to use the System for commercial purposes</li>
                      <li>The right to decompile, reverse engineer, or disassemble the System</li>
                      <li>The right to remove any copyright or other proprietary notations</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">User Contributions</h3>
                    <p className="text-gray-600">
                      You retain any intellectual property rights in content you submit through the System. However, by submitting content, you grant the University a perpetual, worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content in any existing or future media formats for legitimate University purposes.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <AlertCircle className="mr-3 h-6 w-6 text-blue-800" />
                  Prohibited Activities
                </h2>
                <div className="ml-9">
                  <p className="text-gray-600 mb-4">
                    You may not access or use the System for any purpose other than that for which we make it available. You agree not to:
                  </p>
                  
                  <ul className="list-disc ml-6 text-gray-600 space-y-3">
                    <li>Systematically retrieve data or other content from the System to create or compile, directly or indirectly, a collection, database, or directory</li>
                    <li>Trick, defraud, or mislead us or other users, especially in any attempt to learn sensitive information</li>
                    <li>Circumvent, disable, or otherwise interfere with security-related features of the System</li>
                    <li>Use the System in a manner that could disable, overburden, damage, or impair the System</li>
                    <li>Use any information obtained from the System to harass, abuse, or harm another person</li>
                    <li>Use the System as part of any effort to compete with the University or circumvent the purpose of the System</li>
                    <li>Engage in unauthorized framing of or linking to the System</li>
                    <li>Upload or transmit viruses, Trojan horses, or other harmful, disruptive, or destructive files</li>
                    <li>Attempt to bypass any measures designed to prevent or restrict access to the System</li>
                    <li>Use the System to advertise or offer to sell goods and services</li>
                    <li>Copy or adapt the System&apos;s software, including but not limited to HTML, CSS, JavaScript, or other code</li>
                    <li>Harass, annoy, intimidate, or threaten any University employees or agents engaged in providing services</li>
                    <li>Delete the copyright or other proprietary rights notice from any content</li>
                    <li>Attempt to impersonate another user or person</li>
                    <li>Upload or transmit any material that acts as a passive or active information collection or transmission mechanism</li>
                    <li>Use the System in a manner inconsistent with any applicable laws or regulations</li>
                    <li>Use the System to engage in any activity that interferes with or disrupts the proper functioning of University operations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <Clock className="mr-3 h-6 w-6 text-blue-800" />
                  System Availability and Modifications
                </h2>
                <div className="ml-9 space-y-4">
                  <p className="text-gray-600">
                    We strive to provide a reliable and functional System, but we cannot guarantee its continuous, uninterrupted, error-free, or secure operation.
                  </p>
                  
                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">System Availability</h3>
                    <p className="text-gray-600">
                      The System may be temporarily unavailable due to maintenance, updates, or technical issues. We are not liable for any interruptions or errors in the System&apos;s operation. We reserve the right to:
                    </p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>Temporarily suspend access to the System for maintenance</li>
                      <li>Restrict access to parts or all of the System without notice</li>
                      <li>Monitor usage patterns to ensure optimal performance</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">System Updates and Changes</h3>
                    <p className="text-gray-600">
                      We may update, change, or enhance the System at any time. We may add or remove functionalities or features, and we may suspend or stop a feature altogether.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Service Notifications</h3>
                    <p className="text-gray-600">
                      We will make reasonable efforts to provide advance notice of significant changes or scheduled maintenance periods. However, we may make changes without notice when necessary for security, legal compliance, or emergency situations.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <Building className="mr-3 h-6 w-6 text-blue-800" />
                  Service Requests and Project Management
                </h2>
                <div className="ml-9 space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Service Request Submission</h3>
                    <p className="text-gray-600">
                      By submitting a service request through the System, you acknowledge and agree that:
                    </p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>All information provided is accurate, complete, and truthful</li>
                      <li>You have the necessary authority to submit the request on behalf of yourself or your department</li>
                      <li>The University has discretion to approve, deny, or modify requests based on available resources, priorities, and policies</li>
                      <li>Submission of a request does not guarantee its approval or completion</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Project Timelines and Expectations</h3>
                    <p className="text-gray-600">
                      The System may provide estimated timelines for service requests and projects. You understand that:
                    </p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>All timelines are estimates only and not binding commitments</li>
                      <li>Projects may be delayed due to unforeseen circumstances, resource limitations, or changing priorities</li>
                      <li>The University reserves the right to prioritize requests according to institutional needs</li>
                      <li>Multiple revision requests or scope changes may affect project timelines</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Feedback and Communication</h3>
                    <p className="text-gray-600">
                      When using the communication features of the System:
                    </p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>You agree to maintain professional and respectful communication</li>
                      <li>You will respond to requests for information in a timely manner</li>
                      <li>The feedback you provide will be constructive and specific</li>
                      <li>You acknowledge that communication through the System may be accessible to authorized University personnel</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <Scale className="mr-3 h-6 w-6 text-blue-800" />
                  Limitation of Liability
                </h2>
                <div className="ml-9 space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Disclaimer of Warranties</h3>
                    <p className="text-gray-600">
                      THE SYSTEM IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. THE UNIVERSITY EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                    <p className="text-gray-600 mt-2">
                      WE DO NOT GUARANTEE THAT THE SYSTEM WILL MEET YOUR REQUIREMENTS, BE AVAILABLE ON AN UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE BASIS, OR THAT THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SYSTEM WILL BE ACCURATE OR RELIABLE.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Limitation of Liability</h3>
                    <p className="text-gray-600">
                      TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL THE UNIVERSITY, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF, OR INABILITY TO USE, THE SYSTEM, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
                    </p>
                    <p className="text-gray-600 mt-2">
                      THIS INCLUDES, BUT IS NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND ANY OTHER DAMAGES OF ANY KIND, EVEN IF THE UNIVERSITY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Indemnification</h3>
                    <p className="text-gray-600">
                      You agree to defend, indemnify, and hold harmless the University, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising out of or relating to your violation of these Terms and Conditions or your use of the System.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <MessageSquare className="mr-3 h-6 w-6 text-blue-800" />
                  User Content and Communications
                </h2>
                <div className="ml-9 space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">User-Generated Content</h3>
                    <p className="text-gray-600">
                      The System may allow you to submit descriptions, comments, files, images, and other content (&quot;User Content&quot;). You are solely responsible for all User Content that you submit, and you represent and warrant that:
                    </p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>You own or have the necessary rights to use and authorize the University to use all intellectual property rights in and to any User Content</li>
                      <li>All User Content is accurate, complete, and not misleading</li>
                      <li>User Content does not violate the privacy rights, publicity rights, copyright rights, or other rights of any person or entity</li>
                      <li>User Content does not contain any defamatory, obscene, indecent, abusive, offensive, harassing, violent, hateful, inflammatory, or otherwise objectionable material</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Content Monitoring and Removal</h3>
                    <p className="text-gray-600">
                      We do not control or assume responsibility for User Content. However, we reserve the right to:
                    </p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                      <li>Monitor any content submitted to the System</li>
                      <li>Remove or refuse to post any User Content for any or no reason</li>
                      <li>Take any action with respect to User Content if we believe it violates these Terms and Conditions, infringes intellectual property rights, threatens personal safety, or could create liability for the University</li>
                      <li>Disclose your identity or other information about you to any third party who claims that material posted by you violates their rights</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">System Communications</h3>
                    <p className="text-gray-600">
                      By using the System, you consent to receive communications from us electronically, including emails, texts, mobile push notices, or notices and messages within the System. You agree that all agreements, notices, disclosures, and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <LifeBuoy className="mr-3 h-6 w-6 text-blue-800" />
                  Dispute Resolution
                </h2>
                <div className="ml-9 space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Internal Resolution</h3>
                    <p className="text-gray-600">
                      Any disputes arising from the use of the System shall first be addressed through the University&apos;s internal dispute resolution process. Users should initially contact the System administrator or their department supervisor to resolve issues related to the System.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Governing Law</h3>
                    <p className="text-gray-600">
                      These Terms and Conditions and your use of the System are governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to its conflict of law principles. University policies and regulations shall also apply to all disputes arising from the use of the System.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Jurisdiction</h3>
                    <p className="text-gray-600">
                      Any legal action or proceeding relating to your access to, or use of, the System or these Terms and Conditions shall be instituted exclusively in the courts located in Iloilo City, Philippines. You agree to submit to the jurisdiction of, and agree that venue is proper in, these courts in any such legal action or proceeding.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Time Limitation</h3>
                    <p className="text-gray-600">
                      You agree that any cause of action related to or arising from your use of the System must commence within one (1) year after the cause of action accrues. Otherwise, such cause of action is permanently barred.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Miscellaneous Provisions</h2>
                <div className="ml-9 space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Entire Agreement</h3>
                    <p className="text-gray-600">
                      These Terms and Conditions, our Privacy Policy, and any specific guidelines or rules that may be posted in connection with specific services, constitute the entire agreement between you and the University regarding your use of the System and supersede any prior agreements between you and the University relating to your use of the System.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Waiver and Severability</h3>
                    <p className="text-gray-600">
                      No waiver by the University of any term or condition set out in these Terms and Conditions shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition. If any provision of these Terms and Conditions is held by a court to be invalid, illegal, or unenforceable, such provision shall be modified to the minimum extent necessary to make it valid, legal, and enforceable and the remaining provisions shall remain in full force and effect.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Assignment</h3>
                    <p className="text-gray-600">
                      These Terms and Conditions, and any rights and licenses granted hereunder, may not be transferred or assigned by you, but may be assigned by the University without restriction or notice.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Force Majeure</h3>
                    <p className="text-gray-600">
                      The University will not be liable or responsible for any failure to perform, or delay in performance of, any of our obligations that is caused by events outside our reasonable control including acts of God, epidemic, pandemic, civil commotion, terrorist attack, war, fire, explosion, storm, flood, earthquake, subsidence, or any other natural disaster.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Contact Information</h3>
                    <p className="text-gray-600">
                      Questions or comments about the System or these Terms and Conditions may be directed to:
                    </p>
                    <div className="bg-blue-50 p-6 rounded-lg mt-3">
                      <p className="text-gray-700 font-medium">Project Management System Administrator</p>
                      <p className="text-gray-600">Central Philippine University</p>
                      <p className="text-gray-600">Office of the Vice President for Administration</p>
                      <p className="text-gray-600">Email: ovpa@cpu.edu.ph</p>
                      <p className="text-gray-600">Phone: 3266/3260</p>
                      <p className="text-gray-600">Address: Jaro, Iloilo City, Philippines</p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Acknowledgment</h2>
                <div className="ml-9">
                  <p className="text-gray-600">
                    BY USING THE PROJECT MANAGEMENT SYSTEM, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS AND CONDITIONS, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE TO THESE TERMS AND CONDITIONS, YOU ARE NOT AUTHORIZED TO USE THE SYSTEM.
                  </p>
                </div>
              </section>
            </section>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-blue-900 text-white rounded-xl p-8 mb-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Have Questions About These Terms?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            If you need clarification on any aspect of our Terms and Conditions, our team is ready to assist you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="mailto:ovpa@cpu.edu.ph" 
              className="bg-white text-blue-900 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              Contact Support
            </Link>
            <Link 
              href="/privacy-policy" 
              className="bg-blue-800 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              View Privacy Policy
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}