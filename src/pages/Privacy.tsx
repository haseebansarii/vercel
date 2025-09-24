import React from 'react';
import { Shield, Lock, Eye, UserCheck } from 'lucide-react';

export function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-700 mb-4">
            DinTalk ("we," "our," or "us") is committed to protecting your privacy.
          </p>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 mb-4">
              TrustNTrust Ghana ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <UserCheck className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
                  <p className="text-gray-700">
                    When you create an account, we collect your email address and encrypted password.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Eye className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Report Content</h3>
                  <p className="text-gray-700">
                    We collect the content of reports you submit, including descriptions, categories, 
                    and any evidence files you upload.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                  <p className="text-gray-700">
                    We automatically collect information about how you use our platform, 
                    including pages visited and actions taken.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>To provide and maintain our platform services</li>
              <li>To process and moderate submitted reports</li>
              <li>To communicate with you about your account and reports</li>
              <li>To improve our platform and user experience</li>
              <li>To ensure platform security and prevent abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties, 
              except in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>When you choose to make reports public (approved reports are visible to all users)</li>
              <li>When required by law or legal process</li>
              <li>To protect our rights, property, or safety, or that of our users</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Protection</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Automatic redaction of sensitive information in reports</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information by authorized personnel only</li>
              <li>Secure hosting infrastructure with industry-standard protections</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Anonymous Reporting</h2>
            <p className="text-gray-700">
              When you choose to submit an anonymous report, we do not display your identity 
              publicly. However, we may retain your account information internally for 
              moderation and security purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Withdraw consent for data processing</li>
              <li>Request data portability</li>
              <li>Object to certain data processing activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-700">
              We retain your information for as long as necessary to provide our services 
              and comply with legal obligations. Approved reports may be retained indefinitely 
              to maintain the integrity of our transparency platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700">
              Our platform is not intended for children under 18. We do not knowingly 
              collect personal information from children under 18.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of 
              any changes by posting the new Privacy Policy on this page and updating the 
              "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@trustntrust.gh<br />
                <strong>Address:</strong> Accra, Ghana
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}