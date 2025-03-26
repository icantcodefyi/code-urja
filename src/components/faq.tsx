"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import IconBoxHero from "./cards/iconBoxHero";
import { FAQData } from "~/lib/data";

const FAQSection = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="md:w-[80%] w-full flex flex-col items-center justify-center md:mt-48 mt-0">
        <div className="w-full flex items-center justify-center">
          <div>
            <IconBoxHero className="rotate-[-15deg]" />
          </div>
        </div>
        <div className="font-bold text-xl mb-4 md:mb-0 md:text-7xl mt-16 md:leading-[78px] text-center">
          Frequently asked questions
        </div>
        <div className="md:w-[80%] w-[90%] md:mt-20 mt-0">
          <Accordion type="single" collapsible className="w-full">
            {FAQData.map((item, index) => (
              <div key={index}>
                <AccordionItem value={`item-${index + 1}`}>
                  <AccordionTrigger className="text-left">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent>{item.description}</AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
