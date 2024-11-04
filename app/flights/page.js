import Navbar from "@/components/common/navbar/Navbar";
import FlightCard from "@/components/flightResult/flightCard/FlightCard";
import FlightFilter from "@/components/flightResult/flightFilter/FlightFilter";
import React from "react";

export default function page() {
  return (
    <div>
      <Navbar />
      <div className="bg-[#F0F4F4] px-5 md:px-48 min-h-screen">
        <FlightFilter />
        <FlightCard />
      </div>
    </div>
  );
}
