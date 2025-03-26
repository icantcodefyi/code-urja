"use client";

import React from "react";
import Badge from "./ui/badge";
import { cn } from "~/lib/utils";

const Header = ({
  className,
  title = "Features that will make your life easier",
  subtitle = "Streamline your hiring process with powerful tools for sourcing, evaluating, and onboarding top talent - all in one platform.",
  badge = "Products",
}: {
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-3 my-16 md:my-24 tracking-tight text-center",
        className
      )}
    >
      <Badge>{badge}</Badge>
      <h1 className="md:text-4xl font-semibold mb-2 lg:text-5xl text-2xl text-center">
        {title}
      </h1>
      <p className="text-center w-72 md:w-[670px] md:text-base lg:text-lg text-sm px-1">
        {subtitle}
      </p>
    </div>
  );
};

export default Header;
