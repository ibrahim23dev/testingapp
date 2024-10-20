"use client";
import Image from "next/image";
import React, { useState } from "react";
import filter from "@/public/icons/filter.svg";
import down from "@/public/icons/down-arrow.svg";
import clock from "@/public/icons/clock.svg";
export default function FlightFilter() {
  const [stop, setStop] = useState([]);
  const [flightType, setFlightType] = useState();

  return (
    <div className="py-5 ">
      <div className="grid grid-cols-1  md:grid-cols-2 bg-white rounded-lg ">
        <div className="p-3 flex items-center flex-wrap gap-10">
          <div className="flex items-center gap-2">
            <Image src={filter}></Image>
            <span className="text-[var(--text-primary)] text-[12px] font-semibold">
              Filters
            </span>
          </div>
          <div className=" flex items-center  gap-2">
            <span className="text-[var(--text-primary)] text-[12px] font-semibold">
              Stops
            </span>
            <div className="flex items-center gap-2">
              <div
                className={`border-2 border-[#CDC3C3] rounded-md w-[22px] h-[22px] cursor-pointer ${
                  stop.includes(0) ? "bg-black text-white" : ""
                }`}
                onClick={() => {
                  if (stop.includes(0)) {
                    setStop(stop.filter((item) => item !== 0));
                  } else {
                    setStop([...stop, 0]);
                  }
                }}
              >
                <span className="text-[12px] flex justify-center items-center">
                  0
                </span>
              </div>
              <div
                className={`border-2 border-[#CDC3C3] rounded-md w-[22px] h-[22px] cursor-pointer ${
                  stop.includes(1) ? "bg-black text-white" : ""
                }`}
                onClick={() => {
                  if (stop.includes(1)) {
                    setStop(stop.filter((item) => item !== 1));
                  } else {
                    setStop([...stop, 1]);
                  }
                }}
              >
                <span className="text-[12px] flex justify-center items-center">
                  1
                </span>
              </div>
              <div
                className={`border-2 border-[#CDC3C3] rounded-md w-[22px] h-[22px] cursor-pointer ${
                  stop.includes(2) ? "bg-black text-white" : ""
                }`}
                onClick={() => {
                  if (stop.includes(2)) {
                    setStop(stop.filter((item) => item !== 2));
                  } else {
                    setStop([...stop, 2]);
                  }
                }}
              >
                <span className="text-[12px] flex justify-center items-center">
                  2
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="AcceptConditions"
              className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-[var(--primary-btn)]"
            >
              <input
                type="checkbox"
                id="AcceptConditions"
                className="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
              />

              <span className="absolute inset-y-0 start-0 z-10 m-1 inline-flex size-6 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-[var(--primary-btn)]">
                <svg
                  data-unchecked-icon
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>

                <svg
                  data-checked-icon
                  xmlns="http://www.w3.org/2000/svg"
                  className="hidden size-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </label>
            <span>Partially Refundable</span>
          </div>
        </div>

        <div className="p-4 flex items-center justify-evenly gap-10 flex-wrap">
          <div className="flex items-center gap-2 ">
            <span className="text-[12px]">Layover Time</span>
            <Image src={down}></Image>
          </div>
          <div className="flex items-center gap-2 ">
            <span className="text-[12px]">Depart Time</span>
            <Image src={down}></Image>
          </div>{" "}
          <div className="flex items-center gap-2 ">
            <span className="text-[12px]">Airlines</span>
            <Image src={down}></Image>
          </div>
          <div className="flex items-center gap-2 ">
            <span className="text-[12px]">More Filters</span>
            <Image src={down}></Image>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-10 ">
        <div className="col-span-1 md:col-span-8 grid  grid-cols-1 md:grid-cols-3  my-3">
          <div
            className="bg-[var(--primary-btn)] p-5 rounded-s-[15px] cursor-pointer"
            onClick={() => setFlightType("cheapest")}
          >
            <h2 className="text-[24px] text-white font-bold">Cheapest</h2>
            <span className="text-[11px] text-white">
              Showing the cheapest flights in ascending order
            </span>
          </div>
          <div
            className="bg-white p-5  cursor-pointer"
            onClick={() => setFlightType("earliest")}
          >
            <h2 className="text-[24px] text-black font-bold">Earliest</h2>
            <span className="text-[11px] text-black">
              Click to see the Earliest flights in ascending order
            </span>
          </div>{" "}
          <div
            className="bg-[#63F67B57] p-5 rounded-e-[15px] cursor-pointer"
            onClick={() => setFlightType("fastest")}
          >
            <h2 className="text-[24px] text-black font-bold">Fastest</h2>
            <span className="text-[11px] text-black">
              Click to see the fastest flights in ascending order
            </span>
          </div>
        </div>
        <div className="col-span-1 md:col-span-2 w-full">
          <div className=" p-7 bg-white m-2 rounded-[15px]">
            <div className="bg-[#C4D6D9] w-full rounded-[7px]  flex items-center justify-between  p-2">
              <Image className="w-[25px] h-[25px]" src={clock}></Image>
              <h2 className="text-[24px]">25:00</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
