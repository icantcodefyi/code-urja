import React from "react";
import { cn } from "~/lib/utils";

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("px-4 md:px-10 max-w-9xl mx-auto", className)}>
      {children}
    </div>
  );
};
