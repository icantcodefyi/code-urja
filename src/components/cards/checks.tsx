"use client";

import React from "react";
import { CheckIcon } from "../icons";
import { motion } from "motion/react";

const Checks = (): JSX.Element => {
  return (
    <motion.div
      className="flex flex-col lg:flex-row justify-center gap-10 lg:gap-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="flex items-center gap-1"
        whileHover={{ scale: 1.05 }}
      >
        <CheckIcon color="#25a18e" />
        <p className="font-medium text-[#000303]">Interview candidates</p>
      </motion.div>
      <motion.div
        className="flex items-center gap-1"
        whileHover={{ scale: 1.05 }}
      >
        <CheckIcon color="#25a18e" />
        <p className="font-medium text-[#000303]">Find proven leads</p>
      </motion.div>
      <motion.div
        className="flex items-center gap-1"
        whileHover={{ scale: 1.05 }}
      >
        <CheckIcon color="#25a18e" />
        <p className="font-medium text-[#000303]">Filter, select, enjoy</p>
      </motion.div>
    </motion.div>
  );
};

export default Checks;
