import { cn } from "~/lib/utils";
import React from "react";
import { Logo } from "../logo";

const IconBoxHero: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div
      style={{
        background: "linear-gradient(147.09deg, #fbfbfb 9.63%, #e8e8e8 91.74%)",
      }}
      className={cn(
        "size-16 md:size-20 lg:size-28 flex items-center justify-center rounded-xl lg:rounded-3xl border border-[#f3f3f3]",
        "shadow-[0px_5px_11px_0px_rgba(0,0,0,0.1),0px_20px_20px_0px_rgba(0,0,0,0.09),0px_44px_27px_0px_rgba(0,0,0,0.05),0px_79px_32px_0px_rgba(0,0,0,0.01),0px_123px_35px_0px_rgba(0,0,0,0)]",
        className
      )}
    >
      <Logo className="md:h-20 md:w-20 h-10 w-10" />
    </div>
  );
};

export default IconBoxHero;
