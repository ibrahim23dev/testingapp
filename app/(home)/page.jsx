import FlightSearch from "@/components/flightSearch/FlightSearch";
import Ads from "@/components/home/ads/Ads";
import BannerAds from "@/components/home/bannerAds/BannerAds";
import ExclusiveOffers from "@/components/home/excusiveOffers/ExclusiveOffers";
import Packages from "@/components/home/packages/Packages";
import SpecialOffers from "@/components/home/specialOffers/SpecialOffers";
import React from "react";

export default function Home() {
  return (
    <>
      <FlightSearch />
      <div className="px-5 md:px-48 py-20 bg-[#FCF5F5]">
        <BannerAds />
        <ExclusiveOffers />
        <SpecialOffers />
        <Ads />
        <Packages />
      </div>
    </>
  );
}
