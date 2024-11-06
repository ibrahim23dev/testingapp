// pages/paybill.js
"use client"
import React from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Bkash from '@/public/icons/bkash.png';
import Flightkiya from '@/public/icons/logoFlight.jpg'

function PayBill() {
  const [timeLeft, setTimeLeft] = useState(18 * 60); // 18 minutes in seconds

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (

    <div className="min-h-screen  p-4 flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white h-[650px] p-4 rounded-md shadow-md space-y-4">
        <div className="space-y-2 ">
          {['Credit/Debit Card', 'bKash', 'upay', 'Nagad', 'Tap', 'Rocket', 'Net Banking', 'EMI on credit card', 'International Payment', 'Pay in Cash'].map((method, index) => (
            <button key={index} className={`w-full bg-slate-200 p-3 rounded-lg py-2 text-left ${method === 'bKash' ? 'text-red-500 font-bold' : 'text-gray-700'}`}>
              {method}
            </button>
          ))}
        </div>
      </aside>

      {/* Payment Details */}
      <main className="flex-1 mx-4 h-[650px] bg-white p-8 rounded-md shadow-md space-y-8">
        <h2 className="text-xl mb-28 text-center font-semibold text-gray-800">You will be directed to the bKash platform where you can complete your purchase.</h2>
        <div className="flex items-center justify-center space-x-2">
          <Image src={Flightkiya} alt="FlightKiya Logo" width={300} height={70} />
          <span className="text-xl">→</span>
          <Image src={Bkash} alt="bKash Logo" width={300} height={70} />
        </div>
        <p className=" text-gray-600 text-center ml-10 mr-10">By continuing to pay, I understand and agree with the <a href="#" className="text-blue-500 underline">privacy policy</a> and <a href="#" className="text-blue-500 underline">terms of service</a> of Flightkiya</p>
        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-md">Proceed to Payment</button>
        <p className="text-gray-700 text-center">You Pay: <span className="font-bold text-lg">BDT 5,767</span></p>
      </main>

      {/* Fare Summary & Timer */}
      <section className="w-1/4 h-[650px] bg-white p-4 rounded-md shadow-md">
        <div className="bg-blue-100 p-4 rounded-md mb-4">
          <p className="text-gray-800 text-center">Booking confirmed. Complete payment before timeout.</p>
          <div className="text-2xl text-center font-semibold text-blue-600">{String(minutes).padStart(2, '0')} : {String(seconds).padStart(2, '0')}</div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Fare Summary</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex justify-between"><span>Base Fare</span><span>BDT 5,024</span></li>
            <li className="flex justify-between"><span>Tax</span><span>BDT 975</span></li>
            <li className="flex justify-between"><span>Sub-Total</span><span>BDT 5,999</span></li>
            <li className="flex justify-between text-green-500"><span>Hot Deals</span><span>- BDT 351</span></li>
            <li className="flex justify-between"><span>Convenience Charge</span><span>BDT 119</span></li>
          </ul>
          <div className="flex justify-between font-bold text-lg text-gray-800 mt-4">
            <span>Total</span>
            <span>BDT 5,767</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PayBill;
