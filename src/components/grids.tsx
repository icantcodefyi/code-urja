"use client";

import Image from "next/image";
import React from "react";
import { Dots, HorizontalDots } from "./icons";
import IconBoxHero from "./cards/iconBoxHero";
import Analytics from "./cards/Analytics";
import Avatar from "./ui/avatar";
import ChartCard from "./cards/chart";
import { ContentCard } from "./cards/ContentCard";

const Grids = () => {
  return (
    <div className="relative flex justify-center items-center w-full">
      <div className="absolute z-20 lg:-top-16 lg:left-[120px] -top-10 left-0 rotate-[-15.11deg]">
        <div>
          <IconBoxHero />
        </div>
      </div>
      <div className="lg:w-10/12 w-full space-y-5">
        <div className="flex lg:flex-row flex-col gap-5">
          <div className="relative bg-[#FFFFFF] h-[483px] lg:w-2/5 w-full flex flex-col items-center rounded-[26px] p-5 border">
            <div className="absolute w-[70%] h-[160px] border border-[#DBDCDF] bg-[#ffffff] mt-24 shadow-[0px_3px_8px_-1px_#3232470D,0px_0px_1px_0px_#0C1A4B3D] rounded-3xl" />
            <div className="w-[85%] h-[189px] bg-[#FFFFFF] mt-10 py-5 space-y-2 z-10 border border-[#DBDCDF] shadow-[0px_3px_8px_-1px_#3232470D,0px_0px_1px_0px_#0C1A4B3D] rounded-3xl">
              <div className="flex justify-between px-5">
                <div className="p-3 bg-[#E4ECF7] rounded-xl">
                  <Image
                    src={"/assets/driveLogo.png"}
                    width={30}
                    height={30}
                    alt={"avatar"}
                  />
                </div>
                <HorizontalDots />
              </div>
              <h1 className="font-semibold px-5">Manu Arora</h1>
              <div className="px-5">
                <div className="flex justify-between text-[#84859E]">
                  <span>69 GB</span>
                  <span>80 GB</span>
                </div>
                <div className="mt-2">
                  <div className="w-full h-2 bg-[#E4ECF7] rounded-full overflow-hidden">
                    <div className="h-2 bg-[#4C6FFF] rounded-full w-[70%]"></div>
                  </div>
                </div>
              </div>
            </div>
            <ContentCard
              title="Easy resume upload"
              description="Simple way to track user's resume and relevant scores"
              className="mt-24 "
            />
          </div>
          <div className="bg-[#FFFFFF] h-[483px] lg:w-3/5 w-full flex flex-col items-center rounded-[26px] p-5 border overflow-hidden">
            <div className="relative w-full h-[293px] mt-5 flex flex-col items-center">
              <div className="absolute -left-[70px] scale-125 top-7 rotate-[12deg]">
                <div>
                  <Analytics color="#DFEBF3" />
                </div>
              </div>
              <div className="absolute -right-[70px] scale-125 top-7 rotate-[-20deg]">
                <div>
                  <Analytics color="#DFEBF3" />
                </div>
              </div>
              <div className="space-y-3 z-10">
                {[
                  {
                    avatar: 1,
                    name: "Manu's Girlfriend",
                    description: "Doesn't exist, fake profile.",
                    src: "/assets/avatar/avatar1.png",
                  },
                  {
                    avatar: 2,
                    name: "Gone Girl",
                    description: "Not a good idea to hire.",
                    src: "/assets/avatar/avatar2.png",
                  },
                  {
                    avatar: 3,
                    name: "Dua Lipa",
                    description: "Instant hire.",
                    src: "/assets/avatar/avatar3.png",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 lg:w-[400px] w-[270px] h-20 bg-white border rounded-xl shadow-[0px_3px_8px_-1px_#3232470D,0px_0px_1px_0px_#0C1A4B3D]"
                  >
                    <div className="flex items-center">
                      <Avatar src={item.src} badge="/assets/avatar_badge.png" />
                      <div className="grid ml-4">
                        <h1 className="font-semibold">{item.name}</h1>
                        <p className="font-normal text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Dots />
                    </div>
                  </div>
                ))}
              </div>
              <ContentCard
                title="Track interview feedback"
                description="All the features of product feedback tool you need to easily centralize product"
                className="mt-8"
              />
            </div>
          </div>
        </div>
        <div className="flex lg:flex-row flex-col gap-5">
          <ChartCard />
          <div className="relative bg-[#EBEBEB] h-[483px] lg:w-2/5 overflow-hidden w-full mr-0 flex flex-col items-center rounded-[26px] p-5 border-4 border-dashed border-[#D5D5D5]">
            <div className="absolute lg:mt-10 mt-20 mx-auto flex items-center justify-center inset-x-0">
              <Image
                src={"/assets/social/discord.svg"}
                alt="discord"
                width="200"
                height="200"
                className="rotate-[-16deg]"
              />
              <Image
                src={"/assets/social/insta.svg"}
                alt="discord"
                width="200"
                height="200"
                className="rotate-[7deg] ml-[-145px]"
              />
              <Image
                src={"/assets/social/fb.svg"}
                alt="discord"
                width="200"
                height="200"
                className="rotate-[-10deg] ml-[-115px]"
              />
              <Image
                src={"/assets/social/in.svg"}
                alt="discord"
                width="200"
                height="200"
                className="rotate-[12deg] ml-[-140px]"
              />
            </div>
            <ContentCard
              title="Easy social media integration"
              description="Go from nothing to social media success stories."
              className="mt-72"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grids;
