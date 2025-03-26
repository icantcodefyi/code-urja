"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { motion } from "motion/react";
import { Logo } from "./logo";
import { cn } from "~/lib/utils";
import { ArrowRight } from "lucide-react";

const navbarItems = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
  { name: "Blog", path: "/blog" },
];

const Navbar = (): React.ReactNode => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div className="relative w-full flex justify-between items-center">
      <Link href="/" className="flex gap-3 mb-4 md:mb-0 w-1/3 cursor-pointer">
        <Logo />
        <label className="text-3xl font-semibold tracking-tight">Playful</label>
      </Link>
      <div className="md:flex hidden justify-between w-2/3 ">
        <div className="flex justify-center w-1/2 gap-2 md:gap-9 text-lg mb-4 md:mb-0">
          {navbarItems.map((item) => (
            <Link
              href={item.path}
              className={cn(
                "text-base font-medium hover:text-brand",
                pathname === item.path ? "text-brand" : ""
              )}
              key={item.name}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="w-1/2 flex justify-end">
          <GetStartedButton />
        </div>
      </div>
      <div className="md:hidden -mt-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={toggleMenu}
        >
          {isOpen ? (
            <motion.svg
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              transition={{ duration: 0.2 }}
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg
              initial={{ rotate: 0 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.2 }}
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </motion.svg>
          )}
        </motion.button>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.1,
              type: "spring",
              stiffness: 1000,
              damping: 30,
            }}
            className="fixed bottom-0 left-0 pt-10 flex flex-col justify-start items-center w-full h-full bg-[#FAFAFA] z-50"
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={toggleMenu}
              className="fixed top-4 right-4"
            >
              {isOpen ? (
                <motion.svg
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                  transition={{ duration: 0.2 }}
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </motion.svg>
              ) : (
                <motion.svg
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </motion.svg>
              )}
            </motion.button>
            <ul className="py-2 flex flex-col items-center w-full gap-4 mt-10">
              {navbarItems.map((item) => (
                <Link
                  onClick={() => setIsOpen(false)}
                  href={item.path}
                  className={pathname === item.path ? "text-brand" : ""}
                  key={item.name}
                >
                  <li className="px-4 py-2 text-base font-bold">{item.name}</li>
                </Link>
              ))}
            </ul>
            <div className="w-3/4 my-4">
              <GetStartedButton />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Navbar;

const GetStartedButton = () => {
  return (
    <Link
      href="/sign-up"
      style={{ boxShadow: "0px 4px 14.8px rgba(0, 0, 0, 0.2)" }}
      className="flex items-center justify-center w-full md:w-36 h-10 rounded-xl border border-emerald-700 bg-gradient-to-b from-emerald-500 to-brand text-base font-semibold text-white"
    >
      Hire Now!
      <ArrowRight className="h-4 w-4 ml-2" />
    </Link>
  );
};
