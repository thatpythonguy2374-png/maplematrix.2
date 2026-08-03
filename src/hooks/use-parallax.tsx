import { useEffect, useState, useRef, RefObject } from "react";

interface ParallaxOptions {
  speed?: number; // Multiplier for scroll effect (0.1 = slow, 1 = match scroll)
  direction?: "up" | "down";
  clamp?: boolean; // Limit maximum displacement
  maxDisplacement?: number;
}

export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: ParallaxOptions = {},
): { ref: RefObject<T>; offset: number } {
  const {
    speed = 0.3,
    direction = "up",
    clamp = true,
    maxDisplacement = 150,
  } = options;
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    // getBoundingClientRect (a layout read) and setOffset (a render-triggering
    // write) are batched into a single requestAnimationFrame tick instead of
    // running once per raw scroll event. Without this, a fast scroll can fire
    // dozens of layout reads per second — the "Forced reflow" pattern — since
    // each read has to wait for any pending style/layout work to flush first.
    const measure = () => {
      rafId = null;
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distanceFromCenter = elementCenter - viewportCenter;

      let parallaxOffset =
        distanceFromCenter * speed * (direction === "up" ? 1 : -1);

      if (clamp) {
        parallaxOffset = Math.max(
          -maxDisplacement,
          Math.min(maxDisplacement, parallaxOffset),
        );
      }

      setOffset(parallaxOffset);
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(measure);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    measure(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [speed, direction, clamp, maxDisplacement]);

  return { ref, offset };
}

// Simpler hook for global scroll-based parallax (doesn't need ref)
export function useScrollParallax(speed: number = 0.5): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    const measure = () => {
      rafId = null;
      setScrollY(window.scrollY * speed);
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(measure);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    measure();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return scrollY;
}
