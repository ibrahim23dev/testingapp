'use client';
import Navbar from "@/components/common/navbar/Navbar";
import Link from "next/link";
import { use, useState } from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white shadow-lg rounded-lg p-6 max-w-[500px] w-full">
          <button className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 font-medium mb-4 flex justify-center items-center">
            <FcGoogle className=" w-6 h-6" />
            Login with Google
          </button>

          <div className="flex items-center mb-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="someone@example.com"
              />
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0s10 4.477 10 10a10.05 10.05 0 01-.125 1.175M21 21l-2-2M8.5 8.5l3.5 3.5m0 0l3.5-3.5m-3.5 3.5V21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-3-3m0 0l-3-3m6 3H9m4 0V3" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <a href="#" className="text-indigo-600 hover:underline text-sm">
                Forgot Password?
              </a>
            </div>
            <Link href="/">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md text-center font-medium hover:bg-indigo-700"
              >
                Sign In
              </button>
            </Link>

          </form>

          <p className="mt-4 text-center text-gray-500">
            Don’t have an account? <a href="http://localhost:3000/auth-singup" className="text-indigo-600 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>

  );
};

export default Login;
