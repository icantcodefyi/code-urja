"use client";

import React from "react";
import type { JSX } from "react";
import { CloudIcon, ProfileSearch, SymbolsSpeed } from "../icons";
import { motion } from "motion/react";

const FeaturesCards = () => {
  const features = [
    {
      title:
        "Unified candidate database with powerful AI search to find the perfect match instantly.",
      icon: <ProfileSearch />,
    },
    {
      title:
        "Smart candidate evaluation with AI-assisted note-taking and automated insights generation.",
      icon: <SymbolsSpeed />,
    },
    {
      title:
        "Secure cloud storage with real-time sync ensures your interview data is always protected.",
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
