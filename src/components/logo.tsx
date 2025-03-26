import { cn } from "~/lib/utils";
import React from "react";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <img
      src="/assets/logo.ai.png"
      alt="Logo"
      className={cn("flex-shrink-0", className)}
    />
  );
};
