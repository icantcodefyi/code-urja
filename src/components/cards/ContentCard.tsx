import { cn } from "~/lib/utils";
import React from "react";

export const ContentCard: React.FC<{
  className?: string;
  title?: string;
  description?: string;
}> = ({
  className,
  title = "From Interview to Insights",
  description = `All the features you need to evaluate technical candidates effectively, track hiring pipelines, and find your next star engineer - all in one place.`,
}) => {
  const words = title.split(" ");

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <h1 className="text-xl md:text-4xl font-semibold tracking-tight text-center">
        {words.map((word, index) => (
          <React.Fragment key={index}>
            <span className="inline-block">{word}</span>
            {index < words.length - 1 && " "}
          </React.Fragment>
        ))}
      </h1>
      <p className="text-center text-sm md:w-[70%] w-full mt-2 md:mt-4">
        {description}
      </p>
    </div>
  );
};
