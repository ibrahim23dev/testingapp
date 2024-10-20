import React from "react";

export default function RequestNow() {
  return (
    <div className="pb-20">
      <div className="bg-[var(--primary-btn)] w-full md:w-[713px] h-full md:h-[106px] mx-auto flex items-center justify-center rounded-[12px]">
        <div className="flex items-center justify-between w-full px-16">
          <h2 className="text-white text-[24px] font-bold">
            Need a Customized Tour?
          </h2>
          <button className="bg-[var(--tertiary)] w-[173px] h-[54px] text-[15px] font-bold text-[var(--primary)] rounded-[10px]">
            Request Now
          </button>
        </div>
      </div>
    </div>
  );
}
