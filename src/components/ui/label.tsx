import { cn } from "~/lib/utils";
import React from "react";

const Label: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <label className={cn("text-sm text-[#525252]", className)}>
      {children}
    </label>
  );
};

export default Label;
