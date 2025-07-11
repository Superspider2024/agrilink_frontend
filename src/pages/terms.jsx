// src/pages/TermsPage.jsx
import React from 'react';
import Navbar from '../components/navbar';

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
        <div className="prose prose-lg">
          <p>
            Welcome to AgriLink. These terms and conditions outline the rules and regulations for the use of AgriLink's Website, located at agrilink.com. By accessing this website we assume you accept these terms and conditions. Do not continue to use AgriLink if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <h2 className="mt-8">1. License</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <h2 className="mt-8">2. User Accounts</h2>
          <p>
            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
          </p>
          <p>
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.
          </p>
        </div>
      </div>
    </div>
  );
}
