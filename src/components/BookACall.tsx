"use client";

import Image from "next/image";
import React from "react";

const BookACall = (): React.ReactNode => {
  return (
    <div className="my-20 md:mt-32 mt-20">
      <div className="space-y-2">
        <div className="relative">
          <input
            className="flex h-12 w-72 md:w-96 rounded-full border border-input px-3 py-2 text-sm shadow-sm shadow-black/5 placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#4d4d4d] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter your work email"
            type="email"
          />
          <button
            className="absolute inset-y-0 end-0 flex h-10 mt-1 mr-1 w-28 text-white bg-gradient-to-l from-[#4d4d4d] to-[#000000] items-center justify-center rounded-full border border-transparent outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 shadow-[1px_1px_1px_0px_#1E2D5233,0px_0px_1px_1px_#1E2D520F];"
            aria-label="Subscribe"
          >
            Book a call
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center space-x-2 mt-2">
        <span>Powered by</span>
        <span>
          <Image
            src="/assets/aceternity.png"
            alt="aceternity"
            width={25}
            height={25}
          />
        </span>
        <span>Aceternity</span>
      </div>
    </div>
  );
};

export default BookACall;
