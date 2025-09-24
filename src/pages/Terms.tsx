import React from 'react';
import { FileText, AlertTriangle, Shield, Users } from 'lucide-react';

export function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 mb-4">
            To the maximum extent permitted by law, DinTalk shall not be liable 
            These terms govern your use of the DinTalk platform and services.
          </p>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700">
              By accessing and using TrustNTrust Ghana ("the Platform"), you agree to be bound 
              by these Terms of Service and all applicable laws and regulations. If you do not 
              agree with any of these terms, you are prohibited from using this platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Purpose</h2>
            <div className="flex items-start space-x-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <p className="text-gray-700">
                  DinTalk is a transparency platform that allows users to share 
                  experiences about companies and individuals. Our goal is to promote 
                  accountability and help users make informed decisions.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Truthful Reporting</h3>
                  <p className="text-gray-700">
                    You must provide truthful, accurate information in all reports. False or 
                    misleading reports may result in account suspension or termination.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Prohibited Content</h3>
                  <p className="text-gray-700 mb-2">You may not submit reports that contain:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Defamatory, libelous, or slanderous content</li>
                    <li>Personal attacks or harassment</li>
                    <li>Discriminatory language based on race, religion, gender, etc.</li>
                    <li>Private personal information without consent</li>
                    <li>Content that violates any applicable laws</li>
                    <li>Spam or promotional content</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Moderation</h2>
            <p className="text-gray-700 mb-4">
              All submitted reports undergo a moderation process before publication. We reserve 
              the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Review and approve or reject any submitted content</li>
              <li>Edit content to remove sensitive information</li>
              <li>Remove content that violates these terms</li>
              <li>Suspend or terminate accounts for violations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Right of Reply</h2>
            <p className="text-gray-700">
              Entities mentioned in reports have the right to respond and provide their 
              perspective. These replies are also subject to moderation and must comply 
              with our community guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Key points include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Automatic redaction of sensitive information (phone numbers, emails, etc.)</li>
              <li>Option to submit reports anonymously</li>
              <li>Secure storage of personal information</li>
              <li>Compliance with applicable data protection laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700">
              By submitting content to the platform, you grant us a non-exclusive, 
              royalty-free license to use, display, and distribute your content for 
              the purposes of operating the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimers</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
                <div>
                  <p className="text-yellow-800 mb-2">
                    <strong>Important Disclaimers:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-yellow-800">
                    <li>Reports reflect individual user experiences and opinions</li>
                    <li>We do not guarantee the accuracy of user-submitted content</li>
                    <li>The platform is provided "as is" without warranties</li>
                    <li>We are not liable for decisions made based on platform content</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700">
              To the maximum extent permitted by law, TrustNTrust Ghana shall not be liable 
              for any indirect, incidental, special, consequential, or punitive damages 
              resulting from your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account at any time for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Violation of these terms</li>
              <li>Submission of false or misleading information</li>
              <li>Abusive behavior toward other users or entities</li>
              <li>Any activity that harms the platform or its users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700">
              These terms are governed by the laws of Ghana. Any disputes will be resolved 
              in the courts of Ghana.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. Users will be notified 
              of significant changes, and continued use of the platform constitutes acceptance 
              of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@dintalk.com<br />
                <strong>Address:</strong> Ghana
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}