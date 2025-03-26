"use client";

import React from "react";
import Badge from "./ui/badge";
import { motion } from "motion/react";
import { cn } from "~/lib/utils";

const Features = ({ className }: { className?: string }) => {
  return (
    <motion.div
      // initial={{ opacity: 0, y: -20 }}
      // whileInView={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.9, delay: 0.2 }}
      className={cn(
        "flex flex-col items-center justify-center space-y-3 my-16 md:my-24",
        className
      )}
    >
      <Badge>Features</Badge>
      <h1 className="md:text-4xl font-semibold mb-2 lg:text-5xl text-2xl">
        Go from question to hired
      </h1>
      <p className="text-center w-72 md:w-[670px] md:text-base lg:text-lg text-sm px-1">
        All the features you need to evaluate technical candidates effectively,
        track hiring pipelines, and find your next star engineer - all in one
        place.
      </p>
    </motion.div>
  );
};

export default Features;
