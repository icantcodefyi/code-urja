"use client";

import { useInView, useIsomorphicLayoutEffect } from "motion/react";
import { useRef } from "react";

type AnimatedCounterProps = {
  from: number;
  to: number;
};

const AnimatedCounter = ({ from, to }: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  const formatter = new Intl.NumberFormat("en-US");

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;

    // Just set the final value without animation
    element.textContent = formatter.format(to);
  }, [ref, inView, from, to, formatter]);

  return <span ref={ref} />;
};

export default AnimatedCounter;
