import { cn } from "~/lib/utils";
import React from "react";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <img src="/logo.png" alt="Logo" className={cn("h-10 w-10 object-contain", className)} />
  );
};
