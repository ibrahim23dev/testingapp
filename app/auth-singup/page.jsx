// pages/signup.js
'use client';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logoBlack from "@/public/images/logo-black.png";
import Navbar from '@/components/common/navbar/Navbar';
export default function SignUp() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <>
    <Navbar/>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      
        <h2 className="text-2xl font-semibold text-center text-gray-800">Sign Up</h2>
        <p className="text-center text-gray-500 mb-6">Create an account to easily use adbiyastoure.com services.</p>

        <form>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="someone@example.com"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {/* Mobile Field */}
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="mobile">Mobile</label>
            <div className="relative">
              <input
                type="tel"
                id="mobile"
                placeholder="+880 1XXX XXXXX"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                +880
              </span>
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="password">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                placeholder="some@pass#123"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-600">
                By creating an account you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a>.
              </span>
            </label>
          </div>

          {/* Sign-Up Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Sign Up
          </button>

          {/* Already have an account */}
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="#" className="text-blue-600 hover:underline">Sign In</a>
          </p>
        </form>
      </div>
    </div>
    </>
  
  );
}
