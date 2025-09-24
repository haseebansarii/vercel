import React from 'react';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold">
                DinTalk
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              Building trust and transparency in Ghana by providing a platform 
              for citizens to share experiences about companies and individuals.
            </p>
            <p className="text-gray-400 text-sm">
              Promoting accountability, transparency, and good business practices 
              across Ghana.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/browse" className="text-gray-300 hover:text-white transition-colors">
                  Browse Reports
                </a>
              </li>
              <li>
                <a href="/submit-report" className="text-gray-300 hover:text-white transition-colors">
                  Submit Report
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/guidelines" className="text-gray-300 hover:text-white transition-colors">
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} DinTalk. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-sm text-gray-400 mt-4 md:mt-0">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>for Ghana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}