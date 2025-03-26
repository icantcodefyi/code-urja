"use client";

import React from "react";
import { CloudIcon, ProfileSearch, SymbolsSpeed } from "../icons";
import { motion } from "motion/react";

const FeaturesCards = (): JSX.Element => {
  const features = [
    {
      title:
        "Centralise system to search for candidates, easy access to the entire database.",
      icon: <ProfileSearch />,
    },
    {
      title:
        "Accelerated speed to shortlist candidates, make notes as you scan and decide later.",
      icon: <SymbolsSpeed />,
    },
    {
      title:
        "Data is backed up every 2 seconds so that you never lose a single candidate ever again.",
      icon: <CloudIcon />,
    },
  ];
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl mx-auto grid lg:grid-cols-3 lg:grid-rows-1 grid-cols-1 grid-rows-3 gap-10 align-center">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: idx * 0.1 }}
            className="space-y-4  flex items-center justify-center flex-col"
          >
            <div className="size-14 flex items-center justify-center">
              {feature.icon}
            </div>
            <p className="text-center max-w-xs mx-auto">{feature.title}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesCards;
