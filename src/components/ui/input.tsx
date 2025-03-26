import * as React from "react";

import { cn } from "~/lib/utils";

const Input: React.FC<
  React.ComponentPropsWithoutRef<"input"> &
    React.RefAttributes<HTMLInputElement>
> = ({ className, type, ...props }) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-lg border border-input px-3 py-2 text-sm shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#4d4d4d] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};

export { Input };
