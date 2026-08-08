"use client";
import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  triggerOnce?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export function useInView(options: UseInViewOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (options.triggerOnce) observer.unobserve(element);
        } else if (!options.triggerOnce) {
          setInView(false);
        }
      },
      { threshold: options.threshold, rootMargin: options.rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.triggerOnce, options.threshold, options.rootMargin]);

  return [ref, inView] as const;
}