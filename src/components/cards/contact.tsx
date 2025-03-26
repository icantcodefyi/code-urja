"use client";

import Image from "next/image";
import React from "react";
import BookACall from "../BookACall";
import { motion } from "motion/react";

const Contact = (): JSX.Element => {
  return (
    <div className="w-full flex items-center justify-center py-16 mt-24">
      <div className="flex flex-col items-center justify-center w-[430px] space-y-4">
        <motion.div
          className="flex -space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[
            "avatar1.png",
            "avatar2.png",
            "avatar3.png",
            "avatar4.png",
            "avatar5.png",
            "avatar6.png",
          ].map((item, i) => (
            <motion.div
              variants={{
                hidden: { opacity: 0, transform: "scale(1) rotate(0deg)" },
                visible: { opacity: 1, transform: "scale(0.9) rotate(5deg)" },
              }}
              key={item}
              initial="hidden"
              whileInView="visible"
              transition={{ delay: 0.2, duration: 0.3 * i }}
            >
              <Image
                src={`/assets/avatar/${item}`}
                alt="avatar"
                width={70}
                height={70}
                className="md:w-[70px] md:h-[70px] w-[55px] h-[55px]"
              />
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          variants={{
            hidden: {
              transform: "translateY(20%)",
              opacity: 0,
            },
            visible: {
              transform: "translateY(0)",
              opacity: 1,
            },
          }}
          className="flex flex-col items-center justify-center gap-3 pt-4"
        >
          <h2 className="text-2xl">People love us </h2>
          <p className="text-sm md:text-lg w-[80%] md:w-full text-center text-[#7B7B7B]">
            Playful is loved by thousands of people across the world, be part of
            the community and join us.
          </p>
        </motion.div>
        <div>
          <BookACall />
        </div>
      </div>
    </div>
  );
};

export default Contact;
