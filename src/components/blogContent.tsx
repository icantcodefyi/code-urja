"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Mdx } from "~/components/mdx-components";
import { DashboardTableOfContents } from "~/components/toc";
import { Blog } from "~/.contentlayer/generated";
import { TableOfContents } from "~/lib/toc";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { AspectRatio } from "./ui/aspect-ratio";

const BlogContent = ({ doc, toc }: { doc: Blog; toc: TableOfContents }) => {
  return (
    <div className="relative py-6 lg:gap-0 lg:py-8 xl:grid xl:grid-cols-[1fr_500px]">
      <div className="mx-auto w-full min-w-0 max-w-3xl">
        <div className="mb-4 flex items-center space-x-1 text-sm leading-none text-muted-foreground">
          <Link href={"/"} className="truncate hover:underline">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={"/blog"} className="truncate hover:underline">
            Blog
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <div className="text-brand">{doc.label}</div>
        </div>
        <div className="xl:hidden visible">
          <Accordion
            type="single"
            collapsible
            className="w-full border-b-2 border-t-2 mb-4"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger disabledIcon>In this article</AccordionTrigger>
              <AccordionContent>
                <DashboardTableOfContents toc={toc} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <AspectRatio
          ratio={16 / 9}
          className="bg-cover overflow-hidden rounded-[10px] flex justify-end flex-col"
          style={{
            backgroundImage: `url(${doc.banner})`,
          }}
        >
          <div className="h-44 w-[950px] flex flex-col justify-start rounded-[10px] bottom-0 backdrop-blur-md p-5 overflow-hidden ">
            <div className="bg-white rounded-full gap-2 flex items-center w-fit px-2">
              <div className="size-5 bg-[#58D2FB] rounded-full" />
              {doc.label}
            </div>
            <p className="text-white text-2xl font-semibold mt-4 text-wrap">
              {doc.description}
            </p>
            <span className="text-white text-sm mt-3">
              {doc.date} • {doc.timeToRead} min read
            </span>
          </div>
        </AspectRatio>

        <div className="pb-12 pt-8 md:mx-0 mx-3">
          <Mdx code={doc.body.code} />
        </div>
      </div>
      <div className="hidden text-sm xl:block">
        <div className="sticky top-20 mt-6 h-[calc(100vh-3.5rem)] pt-4">
          <div className="no-scrollbar h-full overflow-auto pb-10">
            <DashboardTableOfContents toc={toc} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogContent;
