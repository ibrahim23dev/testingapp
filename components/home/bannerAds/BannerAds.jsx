"use client";
import Image from "next/image";
import React from "react";
import bannerAd from "@/public/images/banner.png";

export default function BannerAds() {
  return (
    <div className="flex justify-center">
      <Image className="w-full" src={bannerAd}></Image>
    </div>
  );
}
