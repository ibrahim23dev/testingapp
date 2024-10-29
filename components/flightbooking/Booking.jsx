"use client";
import React, { useState } from "react";

const Booking = () => {
  const [activeTab, setActiveTab] = useState("baggage"); // Default to "baggage"
  const [title, setTitle] = useState("MR"); // State for title selection (MR, MS, MRS)

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-xl font-semibold text-blue-900">
          <h1>Review Your Booking</h1>
        </div>

        {/* Flight Info Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h2 className="text-lg font-bold text-blue-900">DAC-CXB</h2>
          <div className="flex justify-between items-center mt-2">
            <div>
              <p className="text-gray-700">Biman Bangladesh Airlines</p>
              <p className="text-sm text-gray-500">BG 435 | DH8</p>
              <p className="text-xl font-semibold text-gray-800">11:45</p>
              <p className="text-sm text-gray-500">Sun, 03 Nov, 2024</p>
            </div>
            <p className="text-sm text-gray-500">Non Stop</p>
            <div>
              <p className="text-xl font-semibold text-gray-800">13:00</p>
              <p className="text-sm text-gray-500">Sun, 03 Nov, 2024</p>
            </div>
          </div>
        </div>

        {/* Flight Details Section with Tabs */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h3 className="font-semibold text-blue-900">Flight Details</h3>
          <div className="border-b border-gray-300 my-2"></div>

          {/* Tabs */}
          <div className="flex space-x-6">
            {["baggage", "fare", "policy"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-semibold ${
                  activeTab === tab ? "text-blue-900 border-b-2 border-blue-900" : "text-gray-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === "baggage" && (
              <div>
                <h4 className="text-sm font-bold text-blue-800 mb-2">Baggage</h4>
                <p>Cabin: 7 kg</p>
                <p>Check-in: 20 kg</p>
              </div>
            )}
            {activeTab === "fare" && (
              <div>
                <h4 className="text-sm font-bold text-blue-800 mb-2">Fare</h4>
                <p>Base Fare: BDT 5,024</p>
                <p>Tax: BDT 975</p>
                <p className="font-semibold">Total Fare: BDT 5,999</p>
              </div>
            )}
            {activeTab === "policy" && (
              <div>
                <h4 className="text-sm font-bold text-blue-800 mb-2">Policy</h4>
                <div className="bg-blue-100 p-3 rounded text-center text-blue-900 font-semibold">
                  DAC-CXB
                </div>
                <div className="text-sm mt-2 space-y-2">
                  <p>
                    <strong>Cancellation:</strong> Refund Amount = Paid Amount - Airline's Cancellation Fee
                  </p>
                  <p>
                    <strong>Re-issue:</strong> Re-issue Fee = Airline's Fee + Fare Difference
                  </p>
                  <p className="text-gray-500">
                    *The airline's fee is indicative and per person. Convenience fee is non-refundable.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fare Summary Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h3 className="font-semibold text-blue-900">Fare Summary</h3>
          <div className="border-b border-gray-300 my-2"></div>
          <div className="flex justify-between text-sm mb-2">
            <p>Base Fare</p>
            <p>BDT 5,024</p>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <p>Tax</p>
            <p>BDT 975</p>
          </div>
          <div className="flex justify-between text-sm mb-2 font-semibold">
            <p>You Pay</p>
            <p>BDT 5,511</p>
          </div>
        </div>

        {/* Traveler Details Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h3 className="font-semibold text-blue-900">Enter Traveller Details</h3>
          <div className="border-b border-gray-300 my-2"></div>
          <div className="flex justify-between text-sm mb-2">
            <p>Passenger 1</p>
            <p>Adult</p>
          </div>

          {/* Personal Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Personal Details</h3>
            <p className="text-sm text-gray-600 mb-4">
              As mentioned on your passport or government-approved IDs
            </p>
            <div className="flex gap-4">
              {["MR", "MS", "MRS"].map((option) => (
                <button
                  key={option}
                  onClick={() => setTitle(option)}
                  className={`px-4 py-2 border rounded ${
                    title === option ? "bg-blue-600 text-white" : "text-blue-600 border-blue-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Given Name / First Name"
                className="border border-gray-300 p-3 rounded"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="border border-gray-300 p-3 rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nationality"
                value="Bangladesh"
                readOnly
                className="border border-gray-300 p-3 rounded"
              />
              <input
                type="text"
                placeholder="Frequent Flyer Number (Optional)"
                className="border border-gray-300 p-3 rounded"
              />
            </div>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Contact Details</h3>
          <p className="text-sm text-gray-600 mb-4">Receive booking confirmation & updates</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 p-3 rounded"
            />
            <div className="flex items-center gap-2">
              <select className="border border-gray-300 p-3 rounded">
                <option>+880</option>
                {/* Add more country codes as needed */}
              </select>
              <input
                type="text"
                placeholder="1XXX XXXXX"
                className="border border-gray-300 p-3 rounded flex-grow"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" id="save-traveler" className="w-4 h-4 text-blue-600" />
            <label htmlFor="save-traveler" className="text-sm text-gray-600">
              Save this to my traveler list.
            </label>
          </div>
        </div>

        {/* Continue Button */}
        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold">
          Continue
        </button>
      </div>
    </div>
  );
};

export default Booking;
