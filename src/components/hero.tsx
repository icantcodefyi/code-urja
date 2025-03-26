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
    <motion.div className="md:h-[912px] h-[710px] p-4 relative rounded-[35px] border border-[#E6E6E6] mt-5 overflow-hidden">
      <div
        className="absolute -z-20 top-0 left-0 w-full h-full"
        style={{
          backgroundImage:
            "radial-gradient(circle, #e6e6e6 1px, transparent 1px)",
          backgroundSize: "10px 10px",
        }}
      />

      <div className="absolute -z-10 md:top-24 md:left-36 top-4 left-4 rotate-[-15.11deg]">
        <IconBoxHero />
      </div>

      <div className="absolute -z-10 md:bottom-80 md:right-96 bottom-64 right-11 rotate-[14deg]">
        <IconBoxHero />
      </div>

      <div className="absolute -z-10 md:bottom-52 bottom-36 md:-left-5 -left-14 rotate-[12deg] hidden md:block">
        <motion.div className="rotate-[5deg] scale-[0.9]">
          <Analytics color="#e2e8f0" />
        </motion.div>
      </div>

      <div className="absolute -z-10 md:-bottom-40 -bottom-36 md:-left-20 -left-32 rotate-[20deg]">
        <motion.div className="rotate-[5deg] scale-[0.9]">
          <SocialMediaCard className="md:[&>*]:scale-100 [&>*]:scale-[0.6]" />
        </motion.div>
      </div>

      <div className="absolute -z-10 md:-bottom-16 md:right-72 -bottom-20 right-16 rotate-[-19deg]">
        <Analytics color="#DFEBF3" />
      </div>

      <div className="absolute -z-10 md:-bottom-36 md:-right-10 -bottom-36 -right-48 rotate-[-12deg]">
        <PaperPinCard className="md:[&>*]:scale-100 [&>*]:scale-75" />
      </div>

      <motion.div className="w-full h-5/6 flex flex-col items-center justify-center">
        <Banner />
        <h1 className="md:text-6xl text-2xl font-bold text-center md:w-4/6 w-full mt-8">
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
          className="md:text-lg text-sm font-medium leading-[23px] text-center tracking-tight max-w-2xl mx-auto w-[95%] mt-9 text-neutral-600"
        >
          Record and organize user interviews automatically. Focus on what
          matters - connecting with users.
        </motion.p>
        <Link href="/sign-up">
          <motion.button
            transition={transition}
            variants={variants}
            style={{ boxShadow: "0px 4px 14.8px rgba(0, 0, 0, 0.2)" }}
            className="flex items-center justify-center w-56 h-12 mt-9 rounded-xl border border-emerald-700 bg-gradient-to-b from-emerald-500 to-brand text-base font-semibold text-white"
          >
            Get started - it&apos;s free
            <ArrowRight className="h-4 w-4 ml-2" />
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

const Banner = () => {
  return (
    <Link href="/blog/Artificial-Intelligence">
      <motion.div
        className="md:w-[459px] w-72 md:h-10 h-9 rounded-xl bg-emerald-500/50 flex items-center justify-center md:gap-3 gap-1"
        transition={transition}
        variants={variants}
      >
        <Image
          height={20}
          width={20}
          src="/assets/banner_Icon.svg"
          alt="hero_text"
          className="size-5 md:size-6"
        />
        <p className="md:text-base text-[10px] font-semibold">
          New! Record user interviews without recording bots
        </p>
      </motion.div>
    </Link>
  );
};
