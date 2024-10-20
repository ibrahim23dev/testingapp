import React from "react";
import ad1 from "@/public/images/ad1.png";
import ad2 from "@/public/images/ad2.png";

import Image from "next/image";

export default function Ads() {
  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-10 my-20">
      <div className="w-full">
        <Image className="w-full" src={ad1}></Image>
      </div>
      <div className="w-full">
        <Image className="w-full" src={ad2}></Image>
      </div>
    </div>
  );
}
