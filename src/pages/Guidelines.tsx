import React from 'react';
import { Users, CheckCircle, AlertTriangle, MessageSquare, Shield, Heart } from 'lucide-react';

export function Guidelines() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
          <p className="text-lg text-gray-600">
            DinTalk is built on the principles of transparency, fairness, and mutual respect. 
            These guidelines help ensure our platform remains a safe and constructive space for everyone.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900">Our Community Values</h2>
            </div>
            <p className="text-gray-700 mb-4">
              TrustNTrust Ghana is built on the principles of transparency, fairness, and mutual respect. 
              These guidelines help ensure our platform remains a safe and constructive space for all Ghanaians.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">What We Encourage</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Honest and Constructive Reporting</h3>
                <p className="text-gray-700">
                  Share your genuine experiences, both positive and negative. Focus on specific 
                  incidents and provide context that helps others understand the situation.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Respectful Communication</h3>
                <p className="text-gray-700">
                  Treat all community members, including entities being discussed, with dignity 
                  and respect. Disagree with actions, not people.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Evidence-Based Reports</h3>
                <p className="text-gray-700">
                  When possible, support your reports with evidence such as receipts, 
                  screenshots, or documentation. This helps verify your experience.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Balanced Perspectives</h3>
                <p className="text-gray-700">
                  Acknowledge when entities make efforts to resolve issues or provide 
                  good service. Recognize improvements and positive changes.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">What We Don't Allow</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">False or Misleading Information</h3>
                <p className="text-gray-700">
                  Do not submit reports that contain false information, exaggerated claims, 
                  or misleading details. Accuracy is crucial for maintaining trust.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Personal Attacks and Harassment</h3>
                <p className="text-gray-700">
                  Avoid personal insults, name-calling, or harassment. Focus on specific 
                  behaviors or services, not personal characteristics.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibent text-gray-900 mb-2">Discrimination and Hate Speech</h3>
                <p className="text-gray-700">
                  Content that discriminates based on race, religion, gender, ethnicity,
                  sexual orientation, or other protected characteristics is not tolerated.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Privacy Violations</h3>
                <p className="text-gray-700">
                  Do not share private personal information such as home addresses, 
                  phone numbers, or private communications without consent.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Spam and Self-Promotion</h3>
                <p className="text-gray-700">
                  Avoid repetitive posts, promotional content, or using the platform 
                  primarily for advertising purposes.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Writing Effective Reports</h2>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Tips for Quality Reports:</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Be specific about dates, locations, and circumstances</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Describe what happened objectively, avoiding emotional language</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Include relevant details that help others understand the context</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Mention any attempts to resolve the issue</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Use clear, simple language that's easy to understand</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Moderation Process</h2>
            </div>
            
            <p className="text-gray-700 mb-4">
              All reports go through our moderation process to ensure they meet community standards:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-yellow-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Submission</h3>
                <p className="text-sm text-gray-600">
                  Your report is automatically scanned for sensitive information
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Review</h3>
                <p className="text-sm text-gray-600">
                  Our team reviews the report for accuracy and compliance
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Publication</h3>
                <p className="text-sm text-gray-600">
                  Approved reports are published and entities can respond
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Consequences of Violations</h2>
            <p className="text-gray-700 mb-4">
              Violations of these guidelines may result in:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Warning and request to modify content</li>
              <li>Temporary suspension of posting privileges</li>
              <li>Permanent account suspension for serious or repeated violations</li>
              <li>Legal action in cases of defamation or illegal content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reporting Violations</h2>
            <p className="text-gray-700 mb-4">
              If you see content that violates these guidelines, please report it to us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> report@dintalk.com<br />
                <strong>Subject:</strong> Community Guidelines Violation<br />
                <strong>Include:</strong> Link to the content and reason for reporting
              </p>
            </div>
          </section>

          <section className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-green-900">Thank You</h2>
            </div>
            <p className="text-green-800">
              By following these guidelines, you're helping to build a more transparent 
              and accountable community. Together, we can create a platform that serves 
              the entire community with integrity and respect.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}