import Image from "next/image";
import React from "react";

const Avatar: React.FC<{ src: string; badge?: string }> = ({ src, badge }) => {
  return (
    <div className="relative w-[50px] h-[50px]">
      <Image
        src={src}
        alt="avatar"
        width={50}
        height={50}
        className="rounded-full"
      />
      {badge && (
        <Image
          src={badge}
          alt="avatar"
          width={20}
          height={20}
          className="absolute bottom-0 right-0"
        />
      )}
    </div>
  );
};

export default Avatar;
