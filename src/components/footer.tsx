"use client";

import React from "react";
import SocialMediaCard from "./cards/SocialMediaCard";
import PaperPinCard from "./cards/paperPin";
import Link from "next/link";
import { Facebook, Github, Instagram, Linkedin, Twitter } from "./icons";
import { Logo } from "./logo";

const footerData = {
  Pages: [
    {
      name: "All Products",
      path: "/",
    },
    {
      name: "Studio",
      path: "/",
    },
    {
      name: "Clients",
      path: "/",
    },
    {
      name: "Pricing",
      path: "/",
    },
    {
      name: "Blog",
      path: "/",
    },
  ],
  Legal: [
    {
      name: "Privacy Policy",
      path: "/",
    },
    {
      name: "Terms of Service",
      path: "/",
    },
    {
      name: "Cookie Policy",
      path: "/",
    },
  ],
};

const Footer = () => {
  return (
    <div className="md:h-[683px] h-[200%] p-4 pb-0 relative rounded-[35px] border border-[#E6E6E6] mt-5 mb-11 overflow-hidden flex flex-col justify-between">
      <div
        className="absolute -z-20 top-0 left-0 w-full h-full"
        style={{
          backgroundImage:
            "radial-gradient(circle, #e6e6e6 1px, transparent 1px)",
          backgroundSize: "10px 10px",
        }}
      />{" "}
      <SocialMediaCard className="absolute hidden xl:block -bottom-44 -left-36 md:-bottom-40 md:-left-20 md:z-10 -z-10 rotate-[20deg] md:[&>*]:scale-100 [&>*]:scale-50" />
      <PaperPinCard className="absolute hidden xl:block -bottom-48 -right-36 md:-bottom-36 md:-right-10 rotate-[-10deg] md:z-10 -z-10 md:[&>*]:scale-100 [&>*]:scale-50" />
      <div className="flex xl:flex-row flex-col ">
        <div className="w-[740px] md:p-9 p-2">
          <div className="flex gap-1">
            <Logo />
            <label className="text-3xl font-semibold">Playful</label>
          </div>
          <p className="md:text-3xl lg:text-5xl font-bold text-lg  md:leading-[54px] md:w-[700px] w-[300px] md:mt-9 mt-0">
            Record interviews. Centralise feedback automatically.
          </p>
        </div>
        <div className="flex items-center xl:justify-end justify-start w-full md:px-10 xl:px-0">
          <div className="grid grid-cols-2 md:grid-cols-3 justify-end md:w-1/2 w-[80%] md:gap-10 gap-20 xl:mt-32 mt-5 mr-10 px-2">
            {["Pages", "Legal"].map((item) => (
              <div key={item} className="flex flex-col gap-4">
                <h1 className="font-extrabold">{item}</h1>
                {footerData[item as keyof typeof footerData].map((item) => (
                  <Link
                    className="font-normal text-[#535353] text-nowrap"
                    href={item.path}
                    key={item.name}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="border-[#CCCCCC] border-dashed border-t w-full h-1 mt:mt-10 mt-32 " />
        <div className="h-20 flex justify-center items-center md:gap-10 gap-2 mb-36 md:mb-0">
          <p className="text-[#737373] font-normal md:text-lg text-xs text-nowrap">
            © Playful Aceternity LLC
          </p>
          <div className="flex md:gap-5 gap-3 [&>*]:md:scale-100 scale-75">
            <Link href={"https://twitter.com"}>
              <Twitter />
            </Link>
            <Link href={"https://linkedin.com"}>
              <Linkedin />
            </Link>
            <Link href={"https://github.com"}>
              <Github />
            </Link>
            <Link href={"https://facebook.com"}>
              <Facebook />
            </Link>
            <Link href={"https://instagram.com"}>
              <Instagram />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
