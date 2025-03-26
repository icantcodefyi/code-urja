import { cn } from "~/lib/utils";
import React from "react";

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className={cn(
        "w-fit px-3 md:text-base text-sm py-1 rounded-3xl gap-2 border-[1.3px] border-[#D6D6D6]",
        "shadow-[0px_1px_2px_0px_#0000001A,0px_4px_4px_0px_#00000017,0px_9px_5px_0px_#0000000D,0px_16px_6px_0px_#00000003,0px_25px_7px_0px_#00000000]"
      )}
    >
      {children}
    </div>
  );
};

export default Badge;
