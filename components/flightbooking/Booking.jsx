"use client";
import React, { useState,useEffect } from "react";
import biman from '../../public/images/biman-bd.png';
import Image from "next/image";
import { TbClockFilled } from "react-icons/tb";
import Link from "next/link";
// components/Modal.js
import { Fragment } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { MdReviews } from "react-icons/md";

const Booking = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [details, setDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("baggage"); // Default to "baggage"
  const [title, setTitle] = useState("MR"); // State for title selection (MR, MS, MRS)
  useEffect(() => {
    const storedFlights = localStorage.getItem("selectedFlight");
    if (storedFlights) {
      const parsedData = JSON.parse(storedFlights);
      setFlights(parsedData.results); // Set only the results to the flights state
    }
  }, []);


  const [time, setTime] = useState(1800); // 30 minutes in seconds

  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId); // Cleanup on unmount
    }
  }, [time]);

  // Format time as MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="
      p-6">
      <div className=" ml-[230px] space-y-6">
        {/* Header */}
        <div className="text-xl font-semibold text-blue-900">
          <h1 className=" text-[26px]">Review Your Booking</h1>
        </div>

       
        <div className=" flex gap-6">
          <div className=" flex flex-col gap-8">
             {/* Flight Info Section */}
          <div className="bg-white h-[250px] w-[900px] rounded-lg shadow-lg p-9 mb-4">
          <h2 className="text-[24px] font-bold text-blue-900">DAC-JFK</h2>
          <div className="flex justify-between items-center mt-2">
            <div className=" w-full">
              <div className=" w-full flex items-center justify-between">
                
                <span className=" flex flex-col space-y-3">
                  
                   <p className="text-gray-700">
                    <div className=" flex gap-2">
                    <span><Image src={biman} className=" w-[80px]"/></span>
                      <span>Biman Bangladesh Airlines</span>
                      
                    </div>
                    </p>
                <p className="text-sm text-gray-500">BG 435 | DH8</p>
                </span>
                <span className="text-gray-700">Economy</span>
              </div>
             <div className=" flex items-center justify-center">
              <span> Non-Stop</span>
             </div>
             <div className=" mt-3 flex justify-between items-center">
             <div> <p className="text-xl font-semibold text-gray-800">11:45</p></div>
             <div> <p className="text-xl font-semibold text-gray-800">13:00</p></div>

             </div>
           
             <div className=" flex items-center justify-between">
              <div>   <p className="text-sm text-gray-500">Sun, 03 Nov, 2024</p></div>
              <div>
             
              <p className="text-sm text-gray-500">Sun, 03 Nov, 2024</p>
            </div>
            </div>
            
            </div>
           
            
          </div>
        </div>
        {/* Flight Details Section with Tabs */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h3 className="font-semibold text-[24px] text-blue-900">Flight Details</h3>
          <div className="border-b border-gray-300 my-2"></div>

          {/* Tabs */}
          <div className="flex space-x-6">
            {["baggage", "fare", "policy"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[20px] ${
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
              <div className=" flex space-y-5 flex-col">
                <div className=" flex justify-between items-center">
                <p className="text-[20px] text-blue-800 mb-2">Flight</p>
                <p className="text-[20px] text-blue-800 mb-2">Cabin</p>
                <p className="text-[20px] text-blue-800 mb-2">Check-in</p>
              </div>
              <div className=" flex justify-between mr-8 items-center">
                <p className="text-[16px]  mb-2">DAC-JFK</p>
                <p className="text-[16px]  mb-2">7 kg</p>
                <p className="text-[16px]  mb-2">20 kg</p>
              </div>
              </div>
              
            )}
            {activeTab === "fare" && (
              <div className=" flex gap-4 flex-col">
                <div className=" flex justify-between  items-center">
                <p className="text-[20px]  text-blue-800 mb-2">Fare Summary</p>
                <p className="text-[20px]  text-blue-800 mb-2 pr-9">Base Fare</p>
                <p className="text-[20px]  text-blue-800 mb-2">Tax</p>
                </div>
                <div className=" flex ml-5 items-center justify-between">
                <p className="text-[16px]  mb-2">Adult x 2</p>
                <p className="text-[16px] pl-7  mb-2">BDT 5,024</p>
                <p className="text-[16px]  mb-2">BDT 975</p>
                
                </div>
                
              </div>
            )}
            {activeTab === "policy" && (
              <div>
                
                <div className="bg-blue-100 p-3 text-[20px] rounded text-center text-blue-900 font-semibold">
                  DAC-JFK
                </div>
                <div className="text-sm mt-4 space-y-4">
                  <p className=" text-[16px]">
                    <strong className="text-[18px]">Cancellation:</strong> Refund Amount = Paid Amount - Airline's Cancellation Fee
                  </p>
                  <p className=" text-[16px]">
                    <strong className="text-[18px]">Re-issue:</strong> Re-issue Fee = Airline's Fee + Fare Difference
                  </p>
                  <p className="text-gray-500">
                    *The airline's fee is indicative and per person. Convenience fee is non-refundable.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
   {/* Sing In to book faster and unlock all deals */}

   <div>
    <Link href='/'>
    <div className=" flex items-center gap-3">
      <h1 className=" text-[24px] font-semibold text-blue-900">Sign In</h1>
      <span className=" text-[18px]">to book faster and unlock all deals</span>
    </div>
    </Link>
       <div className="bg-white rounded-lg shadow-lg p-6 mb-4 mt-4" >
        <h2 className="text-blue-900 text-[20px] font-semibold underline">Have a coupon?</h2>
       </div>
   </div>

        {/* Traveler Details Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h3 className="font-semibold text-[24px] text-blue-900">Enter Traveller Details</h3>
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
          <h3 className="text-[24px] font-bold text-blue-900 mb-2">Contact Details</h3>
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
        <button   onClick={openModal} className="w-full mb-10 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold">
          Continue
        </button>
        {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="space-y-4 w-[800px]">
          <h2 className="text-[26px] flex items-center gap-2 font-semibold text-blue-800">
            <span><MdReviews className=" w-9 h-9"/></span>
            <span> Review Details</span>
            </h2>
<div className=" w-[790px] bg-red-100 p-2 rounded-lg flex flex-col">
  
  <p className=" text-red-500 font-bold">Important</p>
    <p> Please recheck the traveler <b>Name</b> and <b>Details</b> with your <b>NID</b> or the airlines will penalise you for providing incorrect information.</p></div>
       <div className="mt-4">
        <h2>Traveler Details</h2>
        <div className=" w-[790px] mt-3 h-36 border-[2px] p-5 rounded-lg">
          <p className=" font-bold text-xl">Traveler 2</p>
          <div className=" mt-2 flex gap-56">
            <div className="flex flex-col gap-2">
              <span className=" text-gray-300">Given Name/First Name</span>
              <span className=" font-semibold text-blue-900">Mohammad</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className=" text-gray-300">Surname/Last Name</span>
              <span className=" font-semibold text-blue-900">Ibrahim</span>
            </div>
          </div>
        </div>
        <p className=" mt-7 ml-20 justify-center text-gray-400">Your booking will be confirmed and held for 20 minutes to complete payment</p>
       </div>
          {/* You can add more details here if needed */}
          <div className="flex justify-center space-x-3 mt-4">
            <button
              onClick={closeModal}
              className="bg-gray-200 text-gray-700 w-[300px] py-4 px-4 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none"
            >
              Edit Details
            </button>
            <Link href="/payment">
            <button
              className="bg-blue-600 text-white w-[300px] py-4 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none"
            >
              Confirm Booking
            </button>
            </Link>
            
          </div>
        </div>
      </Modal>
          </div>
       
        <div className="flex gap-4 flex-col">
        <div className=" bg-white rounded-[8px] w-[400px] h-[150px] flex gap-5">
           <div className=" bg-slate-400 absolute ml-10 mt-8  w-[300px] rounded-[8px] p-8 h-[80px] flex justify-center items-center">
           <div className="flex gap-2 text-sky-700 items-center"> <TbClockFilled className="w-[35px] h-[35px] text-sky-800" />
          <h2 className="text-[28px] font-semibold text-sky-800">{formatTime(time)}</h2></div>
        
          <div className=" ml-10 text-[14px] text-slate-600 flex justify-end gap-3 items-center">
            <p>Min</p>
            <p>Sec</p>
          </div>
           </div>
          </div>
    <div className="w-[400px] mx-auto h-[400px] bg-white shadow-md rounded-lg p-4 space-y-4">
      {/* Header with logo and route */}
      <div className="flex items-center space-x-3">
        <Image
          src={biman} // Replace with the path to your logo image
          alt="Airline Logo"
          width={40}
          height={40}
          className="rounded"
        />
        <div>
          <h2 className="text-blue-600 font-medium">Flight</h2>
          <h3 className="text-xl font-semibold">DAC - CXB</h3>
          <p className="text-sm text-gray-500">One Way</p>
        </div>
        <button className="ml-auto text-blue-600 focus:outline-none">
          <span className="material-icons">expand_less</span> {/* Replace with a suitable icon */}
        </button>
      </div>

      {/* Fare Summary */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-blue-800">Fare Summary</h3>
        <div className="text-gray-700 mt-2 space-y-1">
          <div className="flex justify-between">
            <span>Adult (1 traveler)</span>
            <span className="font-medium">BDT 5,024</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span className="font-medium">BDT 975</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between">
            <span>Sub-Total</span>
            <span className="font-medium">BDT 5,999</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              Hot Deals <span className="ml-2 bg-blue-100 text-blue-600 font-semibold px-2 py-0.5 rounded">DOMB1124</span>
            </span>
            <span className="text-green-600 font-medium">- BDT 602</span>
          </div>
          <div className="flex justify-between">
            <span>Convenience Charge</span>
            <span className="font-medium">+ BDT 114</span>
          </div>
        </div>
      </div>

      {/* Total Payable */}
      <div className="bg-blue-50 p-4 rounded-lg text-blue-800">
        <div className="flex justify-between">
          <span className="text-lg font-semibold">You Pay (for 1 Traveler)</span>
          <span className="text-xl font-bold">BDT 5,511</span>
        </div>
        <div className="text-green-600 text-sm text-right">You Save BDT 602</div>
      </div>
    </div>
        </div>

        </div>
       

      </div>
    </div>
  );
};

export default Booking;




const  Modal=({ isOpen, onClose, children })=> {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className=" w-[850px] transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-end">
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
