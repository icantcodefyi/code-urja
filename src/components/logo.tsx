import { cn } from "~/lib/utils";
import React from "react";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      width="39"
      height="51"
      viewBox="0 0 39 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
    >
      <g filter="url(#filter0_di_309_821)">
        <path
          d="M28.4037 17H22.9204C22.3083 17 21.8399 16.455 21.9318 15.8498L23.0424 8.53875C23.0806 8.28789 23.0686 8.03089 23.0071 7.78565C22.9456 7.54042 22.8361 7.31285 22.6863 7.11878C22.5365 6.92471 22.3499 6.76882 22.1396 6.66195C21.9292 6.55509 21.7002 6.49982 21.4684 6.5H13.2526C12.8753 6.50012 12.5103 6.647 12.2225 6.91454C11.9346 7.18207 11.7425 7.55294 11.6802 7.96125L9.02186 25.4612C8.98364 25.712 8.99565 25.9688 9.05706 26.2139C9.11847 26.459 9.2278 26.6865 9.37745 26.8806C9.52709 27.0746 9.71347 27.2305 9.9236 27.3375C10.1337 27.4445 10.3626 27.4999 10.5942 27.5H15.973C16.5253 27.5 16.973 27.9477 16.973 28.5V37.8148C16.973 38.8346 18.3204 39.2002 18.8358 38.3203L29.7465 19.6968C29.9015 19.4323 29.9887 19.1269 29.999 18.8126C30.0092 18.4983 29.9421 18.1868 29.8047 17.9109C29.6673 17.6349 29.4647 17.4047 29.2182 17.2444C28.9716 17.0841 28.6903 16.9997 28.4037 17Z"
          fill="#25A18E"
        />
        <path
          d="M28.4037 17H22.9204C22.3083 17 21.8399 16.455 21.9318 15.8498L23.0424 8.53875C23.0806 8.28789 23.0686 8.03089 23.0071 7.78565C22.9456 7.54042 22.8361 7.31285 22.6863 7.11878C22.5365 6.92471 22.3499 6.76882 22.1396 6.66195C21.9292 6.55509 21.7002 6.49982 21.4684 6.5H13.2526C12.8753 6.50012 12.5103 6.647 12.2225 6.91454C11.9346 7.18207 11.7425 7.55294 11.6802 7.96125L9.02186 25.4612C8.98364 25.712 8.99565 25.9688 9.05706 26.2139C9.11847 26.459 9.2278 26.6865 9.37745 26.8806C9.52709 27.0746 9.71347 27.2305 9.9236 27.3375C10.1337 27.4445 10.3626 27.4999 10.5942 27.5H15.973C16.5253 27.5 16.973 27.9477 16.973 28.5V37.8148C16.973 38.8346 18.3204 39.2002 18.8358 38.3203L29.7465 19.6968C29.9015 19.4323 29.9887 19.1269 29.999 18.8126C30.0092 18.4983 29.9421 18.1868 29.8047 17.9109C29.6673 17.6349 29.4647 17.4047 29.2182 17.2444C28.9716 17.0841 28.6903 16.9997 28.4037 17Z"
          fill="url(#paint0_linear_309_821)"
          fillOpacity="0.7"
        />
      </g>
      <defs>
        <filter
          id="filter0_di_309_821"
          x="0"
          y="0.5"
          width="39"
          height="50.3164"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="4.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_309_821"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_309_821"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1.24444" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect2_innerShadow_309_821"
          />
        </filter>
        <linearGradient
          id="paint0_linear_309_821"
          x1="15"
          y1="3.93902"
          x2="41.039"
          y2="28.2012"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7BD1FF" />
          <stop offset="1" stopColor="#7BD1FF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
