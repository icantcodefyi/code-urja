"use client";

import * as React from "react";

import { TableOfContents } from "~/lib/toc";
import { cn } from "~/lib/utils";

interface TocProps {
  toc: TableOfContents;
}

export function DashboardTableOfContents({ toc }: TocProps) {
  const itemIds = React.useMemo(
    () =>
      toc.items
        ? toc.items
            .flatMap((item) => [item.url, item?.items?.map((item) => item.url)])
            .flat()
            .filter(Boolean)
            .map((id) => id?.split("#")[1])
        : [],
    [toc]
  );

  const activeHeading = useActiveItem(itemIds as string[]);

  if (!toc?.items?.length) {
    return null;
  }

  return (
    <div className="space-y-2 xl:mb-0 mb-10">
      <p className="font-medium text-xl xl:block hidden">In this article</p>
      <Tree tree={toc} activeItem={activeHeading!} />
    </div>
  );
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    itemIds?.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      itemIds?.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return activeId;
}

interface TreeProps {
  tree: TableOfContents;
  level?: number;
  activeItem?: string;
}

function Tree({ tree, level = 1, activeItem }: TreeProps) {
  return tree?.items?.length && level < 3 ? (
    <ul className={cn("m-0 list-none", { "pl-4": level !== 1 })}>
      {tree.items.map((item, index) => {
        return (
          <li
            key={index}
            className={cn(
              "mt-0 pt-2 pl-5",
              item.url === `#${activeItem}` ? "border-l-4 border-brand" : ""
            )}
          >
            <a
              href={item.url}
              className={cn(
                "inline-block no-underline text-base hover:text-emerald-500",
                item.url === `#${activeItem}`
                  ? "font-semibold text-brand"
                  : "text-black"
              )}
            >
              {item.title}
            </a>
            {item.items?.length ? (
              <Tree tree={item} level={level + 1} activeItem={activeItem} />
            ) : null}
          </li>
        );
      })}
    </ul>
  ) : null;
}
