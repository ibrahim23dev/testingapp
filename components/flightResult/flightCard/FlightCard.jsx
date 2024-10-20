"use client";
import biman from "@/public/images/biman-bd.png";
import arrowRight from "@/public/icons/arrow-right.svg";
import right from "@/public/icons/right-arrow1.svg";
import arrowDown from "@/public/icons/down-arrow.svg";
import arrowUp from "@/public/icons/arrowhead-up (1).png"; 
import { IoIosArrowUp } from "react-icons/io";

// Use an up-arrow icon for the dropdown toggle
import credit from "@/public/icons/credit.svg";
import Image from "next/image";
import { useState } from "react";

export default function FlightCard() {
  const [cards, setCards] = useState([
    {
      id: 1,
      airline: "Biman Airways",
      departure: "DAC",
      arrival: "CXB",
      duration: "2h 15m",
      stops: 0,
      price: 1000,
      currency: "BDT",
      image: biman,
      description: "Lorem ipsum dolor sit amet",
      flightDetailsVisible: false,
      refundableDetailsVisible: false,
    },
    {
      id: 2,
      airline: "Biman Airways",
      departure: "DAC",
      arrival: "CXB",
      duration: "2h 15m",
      stops: 0,
      price: 1000,
      currency: "BDT",
      image: biman,
      description: "Lorem ipsum dolor sit amet",
      flightDetailsVisible: false,
      refundableDetailsVisible: false,
    },
  ]);

  const toggleFlightDetails = (id) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id
          ? {
              ...card,
              flightDetailsVisible: !card.flightDetailsVisible,
              refundableDetailsVisible: false, // Close refundable dropdown if open
            }
          : { ...card, flightDetailsVisible: false } // Close others
      )
    );
  };

  
  const toggleRefundableDetails = (id) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id
          ? {
              ...card,
              refundableDetailsVisible: !card.refundableDetailsVisible,
              flightDetailsVisible: false, // Close flight details if open
            }
          : { ...card, refundableDetailsVisible: false } // Close others
      )
    );
  };

  return (
    <div className="space-y-5 pb-10">
      {cards.map((card) => (
        <div className="max-w-[909px] bg-white relative rounded-2xl" key={card.id}>
          {/* Left section with airline info */}
          <div className="absolute left-[-15px] top-2 bg-[url('/images/badge.png')] bg-no-repeat bg-contain w-28 h-10">
            <span className="text-white text-[13px] p-5">Best Deal</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 h-full md:h-[145px] w-full">
            <div className="py-5 px-1">
              <div className="mt-5">
                <Image src={biman} alt="airline logo" />
              </div>
            </div>

            <div className="flex items-start gap-2 py-5 px-1">
              <div>
                <h2 className="text-[20px] font-semibold">15:30</h2>
                <span className="text-[20px]">DAC</span>
              </div>
              <div>
                <span className="text-[14px] flex justify-center">Non-stop</span>
                <Image src={arrowRight} alt="right arrow" />
              </div>
              <div>
                <h2 className="text-[20px] font-semibold">16:45</h2>
                <span className="text-[20px]">CXB</span>
              </div>
            </div>

            <div className="flex w-full gap-2">
              <p className="text-[14px] font-semibold w-full py-5">1h 15m</p>

              <div className="flex flex-col justify-between p-4 w-[600px] bg-green-100">
                <div className="flex gap-2 items-center justify-end">
                  <Image src={credit} alt="credit icon" />
                  <span className="text-[13px]">DOMB0724</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-black">৳ 5049/-</p>
                  <p className="text-sm line-through text-gray-400">৳ 6059/-</p>
                </div>

                <button className="bg-purple-600 text-white py-2 px-4 rounded-lg flex justify-between items-center">
                  Select
                  <span>
                    <Image src={right} alt="right arrow" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Dropdown section */}
          <div className="border-t w-full py-3 px-6 flex justify-between">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleRefundableDetails(card.id)}
            >
              <span className="text-[10px] md:text-[13px]">Partially Refundable</span>
              <Image src={card.refundableDetailsVisible ? arrowUp : arrowDown} alt="arrow toggle" />
            </div>

            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleFlightDetails(card.id)}
            >
              <span className="text-[10px] md:text-[13px]">Flight Details</span>
              <Image src={card.flightDetailsVisible ? arrowUp : arrowDown} alt="arrow toggle" />
            </div>
          </div>

          {/* Refundable Details Dropdown */}
          {card.refundableDetailsVisible && (
            <div className="bg-gray-100 p-5 rounded-b-xl">
              <h3 className="text-lg font-bold">Refundable Policy</h3>
              <p>This ticket is partially refundable. Cancellation fees may apply.</p>
              <p>Please check the airline's terms and conditions for more information.</p>
            </div>
          )}

          {/* Flight Details Dropdown */}
          {card.flightDetailsVisible && (
            <div className="bg-gray-100 p-5 rounded-b-xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-bold">Flight Details</h3>
                  <p>
                    <span className="font-semibold">Airline:</span> {card.airline}
                  </p>
                  <p>
                    <span className="font-semibold">Departure:</span> {card.departure}
                  </p>
                  <p>
                    <span className="font-semibold">Arrival:</span> {card.arrival}
                  </p>
                  <p>
                    <span className="font-semibold">Duration:</span> {card.duration}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Baggage</h3>
                  <p>
                    <span className="font-semibold">Cabin:</span> 7 Kg
                  </p>
                  <p>
                    <span className="font-semibold">Check-in:</span> 20 Kg
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


