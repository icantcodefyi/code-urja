import Image from "next/image";
import React from "react";

const SocialMediaCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <div className="relative w-[405px] h-[439px]">
        <Image
          src="/assets/Social_Media.svg"
          alt="Social_Media"
          width="405"
          height="439"
          className="absolute -z-10 top-0 left-0"
        />
        <p className="absolute left-16 top-[70px] font-medium z-10">
          Social Media Integrations
        </p>
        <div className="absolute left-10 mt-7 flex w-[405px] h-[439px] z-[-1px]">
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
            className="rotate-[7deg] ml-[-155px]"
          />
          <Image
            src={"/assets/social/fb.svg"}
            alt="discord"
            width="200"
            height="200"
            className="rotate-[-10deg] ml-[-125px]"
          />
          <Image
            src={"/assets/social/in.svg"}
            alt="discord"
            width="200"
            height="200"
            className="rotate-[12deg] ml-[-150px]"
          />
        </div>
      </div>
    </div>
  );
};

export default SocialMediaCard;
