import React from 'react';
import { Shield, Users, Eye, MessageSquare, CheckCircle, Globe } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About DinTalk
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building a more transparent and accountable community through community-driven 
            reporting and shared experiences.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            DinTalk is dedicated to promoting transparency, accountability, and trust 
            in business and social environments. We provide a secure platform where 
            citizens can share their experiences about companies and individuals, helping others 
            make informed decisions while encouraging good practices.
          </p>
          <p className="text-gray-700">
            Our goal is to create a culture of accountability where businesses and individuals 
            are motivated to maintain high standards of service and conduct, knowing that their 
            actions will be transparently documented and shared with the community.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Reports</h3>
              <p className="text-gray-600">
                Citizens share their positive and negative experiences with companies and individuals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification Process</h3>
              <p className="text-gray-600">
                All reports go through our moderation process to ensure accuracy and prevent abuse.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Public Transparency</h3>
              <p className="text-gray-600">
                Verified reports are made publicly available to help others make informed decisions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Right of Reply</h3>
              <p className="text-gray-600">
                Entities can respond to reports, ensuring balanced perspectives and fair representation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Protection</h3>
              <p className="text-gray-600">
                Sensitive information is automatically redacted to protect privacy while maintaining transparency.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Impact</h3>
              <p className="text-gray-600">
                Building a more accountable society where good practices are recognized and poor behavior is addressed.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600">
                We believe in open, honest communication and making information accessible to all Ghanaians.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fairness</h3>
              <p className="text-gray-600">
                Every entity has the right to respond and present their side of the story.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accountability</h3>
              <p className="text-gray-600">
                Promoting responsible behavior through community oversight and feedback.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy</h3>
              <p className="text-gray-600">
                Protecting personal information while maintaining the integrity of shared experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Making Ghana Better Together</h2>
          <p className="text-lg mb-6">
            Join thousands of people who are building a more transparent and accountable society.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold mb-2">1,000+</div>
              <div className="text-blue-100">Reports Shared</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Entities Documented</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-blue-100">User Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}