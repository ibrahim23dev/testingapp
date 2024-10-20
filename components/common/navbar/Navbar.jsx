"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import logo from "@/public/images/logo-white.png";
import logoBlack from "@/public/images/logo-black.png";
import usd from "@/public/icons/usd.png";
import { IoIosArrowDown } from "react-icons/io";
import flight from "@/public/icons/flight.png";
import hotel from "@/public/icons/hotel.png";
import tour from "@/public/icons/tour.png";
import visa from "@/public/icons/visa.png";
import aboutImg from "@/public/icons/aboutImg.png";
import Link from "next/link";

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0); // State to track scroll position
  const [isScrollingDown, setIsScrollingDown] = useState(false); // State to track scroll direction
  const [categoryTab, setCategoryTab] = useState("flight");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > scrollY) {
        setIsScrollingDown(true); // If scrolling down
      } else {
        setIsScrollingDown(false); // If scrolling up
      }
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);
  const [isOpenCurrency, setIsOpenCurrency] = useState(false);

  return (
    <>
      <nav className="max-w-7xl mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <Link href={"/"}>
          <Image src={logoBlack} alt="Logo" />
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-10">
          {/* Currency Selector */}
          <Image src={usd} alt="USD Icon" />
          <div className="relative">
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setIsOpenCurrency(!isOpenCurrency)}
            >
              <span className="text-gray-700">USD</span>
              <IoIosArrowDown size={20} className="text-gray-700" />
            </div>

            {isOpenCurrency && (
              <div
                className="absolute end-0 z-10 mt-2 rounded-2xl w-full md:w-[243px] h-[112px] border border-gray-100 bg-white shadow-lg"
                role="menu"
              >
                <div className=" flex p-5 justify-between ">
                  <div>
                    <p className="text-[#0F5677] text-[14px] font-semibold mb-2">
                      Region
                    </p>
                    <ul className="text-[12px] space-y-2">
                      <li>Bangladesh</li>
                      <li>Bangladesh</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[#0F5677] text-[14px] font-semibold mb-2">
                      Currency
                    </p>
                    <ul className="text-[12px] space-y-2">
                      <li>USD</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sign In Button */}
          <Link href="http://localhost:3000/auth-login">
          <button  className="w-[90px] h-[40px] bg-[var(--primary-btn)] text-[var(--dark-text)] rounded-md font-semibold text-[12px]">
            Sign in
          </button>
          </Link>
          
        </div>
      </nav>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          scrollY > 0 ? "bg-white shadow-md" : "bg-transparent"
        } ${isScrollingDown ? "translate-y-0" : "-translate-y-full"}`}
      >
        <nav className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          {/* Logo */}
          <Link href={"/"}>
            <Image src={logoBlack} alt="Logo" />
          </Link>
          <div className="   container  rounded-[22px] w-full px-32 mx-auto bottom-[-25px] hidden md:block">
            <div className="flex items-center justify-between px-14 flex-wrap">
              <div
                className={`flex items-center gap-2 cursor-pointer ${
                  categoryTab == "flight"
                    ? "border-b-4 border-[var(--tertiary)] py-2 "
                    : ""
                }`}
                onClick={() => setCategoryTab("flight")}
              >
                <Image src={flight} alt="" className="w-[22px] h-[22px]" />
                <span className="text-[var(--secondary)] text-[16px] font-semibold">
                  Flight
                </span>
              </div>
              <div
                className={`flex items-center gap-2 cursor-pointer ${
                  categoryTab == "hotel"
                    ? "border-b-4 border-[var(--tertiary)] py-2 "
                    : ""
                }`}
                onClick={() => setCategoryTab("hotel")}
              >
                <Image src={hotel} alt="" className="w-[22px] h-[22px]" />
                <span className="text-[var(--secondary)] text-[16px] font-semibold">
                  Hotel
                </span>
              </div>{" "}
              <div
                className={`flex items-center gap-2 cursor-pointer ${
                  categoryTab == "tour"
                    ? "border-b-4 border-[var(--tertiary)] py-2 "
                    : ""
                }`}
                onClick={() => setCategoryTab("tour")}
              >
                <Image src={tour} alt="" className="w-[22px] h-[22px]" />
                <span className="text-[var(--secondary)] text-[16px] font-semibold">
                  Tour
                </span>
              </div>{" "}
              <div
                className={`flex items-center gap-2 cursor-pointer ${
                  categoryTab == "visa"
                    ? "border-b-4 border-[var(--tertiary)] py-2"
                    : ""
                }`}
                onClick={() => setCategoryTab("visa")}
              >
                <Image src={visa} alt="" className="w-[22px] h-[22px]" />
                <span className="text-[var(--secondary)] text-[16px] font-semibold">
                  Visa
                </span>
              </div>
              <div
                className={`flex items-center gap-2 cursor-pointer ${
                  categoryTab == "aboutus"
                    ? "border-b-4 border-[var(--tertiary)] py-2"
                    : ""
                }`}
                onClick={() => setCategoryTab("aboutus")}
              >
                <Image src={aboutImg} alt="" className="w-[22px] h-[22px]" />
                <span className="text-[var(--secondary)] text-[16px] font-semibold">
                  About us
                </span>
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div className="flex items-center gap-10">
            {/* Currency Selector */}
            <Image src={usd} alt="USD Icon" />
            <div className="relative">
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => setIsOpenCurrency(!isOpenCurrency)}
              >
                <span className="text-gray-700">USD</span>
                <IoIosArrowDown size={20} className="text-gray-700" />
              </div>

              {isOpenCurrency && scrollY > 0 && (
                <div
                  className="absolute end-0 z-10 mt-2 rounded-2xl w-full md:w-[243px] h-[112px] border border-gray-100 bg-white shadow-lg"
                  role="menu"
                >
                  <div className=" flex p-5 justify-between ">
                    <div>
                      <p className="text-[#0F5677] text-[14px] font-semibold mb-2">
                        Region
                      </p>
                      <ul className="text-[12px] space-y-2">
                        <li>Bangladesh</li>
                        <li>Bangladesh</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-[#0F5677] text-[14px] font-semibold mb-2">
                        Currency
                      </p>
                      <ul className="text-[12px] space-y-2">
                        <li>USD</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sign In Button */}
            <button className="w-[90px] h-[40px] bg-[var(--primary-btn)] text-[var(--dark-text)] rounded-md font-semibold text-[12px]">
              Sign in
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
