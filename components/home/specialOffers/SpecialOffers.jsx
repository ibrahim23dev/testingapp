"use client";
import React from "react";
import exclusive1 from "@/public/images/exclusive1.png";
import exclusive2 from "@/public/images/exclusive2.png";
import exclusive3 from "@/public/images/exclusive3.png";
import Image from "next/image";
export default function SpecialOffers() {
  return (
    <div className="my-5">
      <h2 className="text-[35px]">Special Offers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 my-2">
        <div>
          <Image className="w-full" src={exclusive1}></Image>
        </div>
        <div>
          <Image className="w-full" src={exclusive2}></Image>
        </div>{" "}
        <div>
          <Image className="w-full" src={exclusive3}></Image>
        </div>
      </div>
    </div>
  );
}
