import Image from "next/image";
import React from "react";
import Avatar from "../ui/avatar";
import { Dots } from "../icons";

const PaperPinCard = ({ className }: { className?: string }) => {
  const blocks = [
    {
      title: "Manu's Interview",
      subtitle: "Candidate is mid.",
      src: "/assets/avatar.png",
      badge: "/assets/avatar_badge.png",
    },
    {
      title: "Ruru's Interview",
      subtitle: "Candidate is good.",
      src: "/assets/avatar.png",
      badge: "/assets/avatar_badge.png",
    },
  ];
  return (
    <div className={className}>
      <div className="relative w-[400px] h-[439px]">
        <Image
          src="/assets/Social_Media.svg"
          alt="Social_Media"
          width="405"
          height="439"
          className="absolute -z-10 top-0 left-0"
        />
        <Image
          src={"/assets/paper_clip.png"}
          alt="paper_clip"
          width={400}
          height={400}
          className="absolute left-5 -top-10 font-medium z-10 rotate-[8deg] h-20 w-20 aspect-square"
        />
        <div className="absolute left-12 mt-24 flex flex-col gap-4 w-[300px] h-[439px] z-[-1px]">
          {blocks.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between p-4 w-[300px] h-20 bg-white rounded-xl shadow-[0px_3px_8px_-1px_#3232470D,0px_0px_1px_0px_#0C1A4B3D]"
            >
              <div className="flex items-center">
                <Avatar src={item.src} badge={item.badge} />
                <div className="grid ml-4">
                  <h1 className="font-semibold">{item.title}</h1>
                  <p className="font-normal text-sm">{item.subtitle}</p>
                </div>
              </div>
              <div>
                <Dots />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaperPinCard;
