"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import IconBoxHero from "./cards/iconBoxHero";
import Analytics from "./cards/Analytics";
import SocialMediaCard from "./cards/SocialMediaCard";
import PaperPinCard from "./cards/paperPin";
import Link from "next/link";
import { transition, variants } from "~/lib/data";
import { ArrowRight } from "lucide-react";

const text = "Record interviews. Centralise feedback automatically.";

export const Hero = () => {
  const words = text.split(" ");
  return (
    <motion.div className="relative mt-5 h-[710px] overflow-hidden rounded-[35px] border border-[#E6E6E6] p-4 md:h-[912px]">
      <div
        className="absolute top-0 left-0 -z-20 h-full w-full"
        style={{
          backgroundImage:
            "radial-gradient(circle, #e6e6e6 1px, transparent 1px)",
          backgroundSize: "10px 10px",
        }}
      />

      <div className="absolute top-4 left-4 -z-10 rotate-[-15.11deg] md:top-24 md:left-36">
        <IconBoxHero />
      </div>

      <div className="absolute right-11 bottom-64 -z-10 rotate-[14deg] md:right-96 md:bottom-80">
        <IconBoxHero />
      </div>

      <div className="absolute bottom-36 -left-14 -z-10 hidden rotate-[12deg] md:bottom-52 md:-left-5 md:block">
        <motion.div className="scale-[0.9] rotate-[5deg]">
          <Analytics color="#e2e8f0" />
        </motion.div>
      </div>

      <div className="absolute -bottom-36 -left-32 -z-10 rotate-[20deg] md:-bottom-40 md:-left-20">
        <motion.div className="scale-[0.9] rotate-[5deg]">
          <SocialMediaCard className="[&>*]:scale-[0.6] md:[&>*]:scale-100" />
        </motion.div>
      </div>

      <div className="absolute right-16 -bottom-20 -z-10 rotate-[-19deg] md:right-72 md:-bottom-16">
        <Analytics color="#DFEBF3" />
      </div>

      <div className="absolute -right-48 -bottom-36 -z-10 rotate-[-12deg] md:-right-10 md:-bottom-36">
        <PaperPinCard className="[&>*]:scale-75 md:[&>*]:scale-100" />
      </div>

      <motion.div className="flex h-5/6 w-full flex-col items-center justify-center">
        <Banner />
        <h1 className="mt-8 w-full text-center text-2xl font-bold md:w-4/6 md:text-6xl">
          {words.map((word, index) => (
            <React.Fragment key={index}>
              <motion.span
                className="inline-block"
                transition={transition}
                variants={variants}
              >
                {word}
              </motion.span>
              {index < words.length - 1 && " "}
            </React.Fragment>
          ))}
        </h1>
        <motion.p
          transition={transition}
          variants={variants}
          className="mx-auto mt-9 w-[95%] max-w-2xl text-center text-sm leading-[23px] font-medium tracking-tight text-neutral-600 md:text-lg"
        >
          Record and organize user interviews automatically. Focus on what
          matters - connecting with users.
        </motion.p>
        <Link href="/sign-up">
          <motion.button
            transition={transition}
            variants={variants}
            style={{ boxShadow: "0px 4px 14.8px rgba(0, 0, 0, 0.2)" }}
            className="mt-9 flex h-12 w-56 cursor-pointer items-center justify-center rounded-xl border border-purple-700 font-semibold text-purple-600"
          >
            Hire Now! - it&apos;s free
            <ArrowRight className="ml-2 h-4 w-4" />
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

const Banner = () => {
  return (
    <motion.div
      className="flex h-9 w-72 items-center justify-center gap-1 rounded-xl bg-purple-500/50 md:h-10 md:w-[459px] md:gap-3"
      transition={transition}
      variants={variants}
    >
      <p className="text-[10px] font-semibold md:text-base">
        New! Record user interviews without recording bots
      </p>
    </motion.div>
  );
};
