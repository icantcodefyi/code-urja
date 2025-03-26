"use client";

import Image from "next/image";
import React from "react";
import { motion } from "motion/react";
import IconBoxHero from "./iconBoxHero";

const ProductPreview = (): JSX.Element => {
  return (
    <div className="w-full flex flex-col relative items-center justify-center">
      <motion.div
        className="relative mt-28 md:p-24 p-4 bg-gradient-to-b from-brand md:rounded-[32px] rounded-[12px]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute z-10 top-10 -left-4 md:top-28 md:-left-10 rotate-[-15.11deg]">
          <motion.div
            variants={{
              hidden: { opacity: 0, transform: "scale(0.8) rotate(10deg)" },
              visible: { opacity: 1, transform: "scale(1) rotate(0deg)" },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{
              delay: 0.2,
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <IconBoxHero />
          </motion.div>
        </div>
        <div className="absolute z-10 bottom-16 right-0 md:bottom-52 lg:bottom-96 md:-right-5 rotate-[14deg]">
          <motion.div
            variants={{
              hidden: { opacity: 0, transform: "scale(0.8) rotate(10deg)" },
              visible: { opacity: 1, transform: "scale(1) rotate(0deg)" },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{
              delay: 0.2,
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <IconBoxHero />
          </motion.div>
        </div>
        <Image
          src={"/assets/landing.webp"}
          alt="preview image"
          width={1200}
          height={951}
        />
      </motion.div>
    </div>
  );
};

export default ProductPreview;
