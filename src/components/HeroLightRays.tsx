import { useEffect, useState } from "react";
import { useScrollParallax } from "@/hooks/use-parallax";

const HeroLightRays = () => {
  const scrollOffset = useScrollParallax(0.15);
  const gridOffset = useScrollParallax(0.05);
  const [isDark, setIsDark] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    setIsDesktop(media.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    media.addEventListener("change", handler);

    return () => media.removeEventListener("change", handler);
  }, []);
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}>
      {/* Base dark layer */}
      <div
        className="absolute inset-0"
        style={{
          background: `hsl(var(--background))`,
        }}
      />

      {/* Animated ray container with parallax */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollOffset * 0.5}px)`,
          willChange: "transform",
        }}>
        {/* Ray 2 - Center */}
        <div
          className="absolute top-0 left-1/2 origin-top animate-ray-sway-2"
          style={{
            width: isDesktop ? "280px" : "58vw",
            height: "120%",
            transform: `
  translateX(-50%)
  rotate(${isDesktop ? -8 : 0}deg)
  translateY(${scrollOffset * 0.2}px)
`,

            background: `
radial-gradient(
ellipse at top,
hsl(24 95% 55% / ${isDark ? 0.75 : 0.28}) 0%,
hsl(24 95% 50% / ${isDark ? 0.35 : 0.12}) 35%,
transparent 80%
)
`,
            filter: isDesktop ? "blur(35px)" : "blur(18px)",
          }}
        />

        {isDesktop && (
          <>
            {/* Ray 1 - Center left */}
            <div
              className="absolute top-0 left-1/2 origin-top animate-ray-sway-1"
              style={{
                width: "300px",
                height: "120%",
                transform: `translateX(-50%) rotate(-25deg) translateY(${scrollOffset * 0.3}px)`,
                background: `linear-gradient(
              to bottom,
              hsl(24 95% 50% / ${isDark ? 0.6 : 0.22}) 0%,
              hsl(24 95% 45% / ${isDark ? 0.4 : 0.12}) 30%,
              hsl(24 95% 40% / ${isDark ? 0.15 : 0.04}) 60%,
              transparent 100%
            )`,
                filter: "blur(40px)",
              }}
            />
            {/* Ray 3 - Center right */}
            <div
              className="absolute top-0 left-1/2 origin-top animate-ray-sway-3"
              style={{
                width: "260px",
                height: "120%",
                transform: `translateX(-50%) rotate(12deg) translateY(${scrollOffset * 0.35}px)`,
                background: `linear-gradient(
              to bottom,
              hsl(24 95% 52% / ${isDark ? 0.65 : 0.24}) 0%,
              hsl(24 95% 48% / ${isDark ? 0.4 : 0.13}) 28%,
              hsl(24 95% 42% / ${isDark ? 0.15 : 0.04}) 58%,
              transparent 100%
            )`,
                filter: "blur(38px)",
              }}
            />
            {/* Ray 4 - Far left */}
            <div
              className="absolute top-0 left-1/2 origin-top animate-ray-sway-4"
              style={{
                width: "220px",
                height: "110%",
                transform: `translateX(-50%) rotate(-42deg) translateY(${scrollOffset * 0.4}px)`,
                background: `linear-gradient(
              to bottom,
              hsl(24 95% 48% / ${isDark ? 0.55 : 0.18}) 0%,
              hsl(24 95% 42% / ${isDark ? 0.3 : 0.1}) 35%,
              hsl(24 95% 38% / ${isDark ? 0.1 : 0.03}) 65%,
              transparent 100%
            )`,
                filter: "blur(45px)",
              }}
            />

            {/* Ray 5 - Far right */}
            <div
              className="absolute top-0 left-1/2 origin-top animate-ray-sway-5"
              style={{
                width: "240px",
                height: "110%",
                transform: `translateX(-50%) rotate(35deg) translateY(${scrollOffset * 0.25}px)`,
                background: `linear-gradient(
              to bottom,
              hsl(24 95% 50% / ${isDark ? 0.58 : 0.19}) 0%,
              hsl(24 95% 44% / ${isDark ? 0.32 : 0.1}) 32%,
              hsl(24 95% 40% / ${isDark ? 0.12 : 0.03}) 62%,
              transparent 100%
            )`,
                filter: "blur(42px)",
              }}
            />

            {/* Ray 6 - Extra left */}
            <div
              className="absolute top-0 left-1/2 origin-top animate-ray-sway-6"
              style={{
                width: "180px",
                height: "100%",
                transform: `translateX(-50%) rotate(-58deg) translateY(${scrollOffset * 0.45}px)`,
                background: `linear-gradient(
              to bottom,
              hsl(24 95% 45% / ${isDark ? 0.45 : 0.14}) 0%,
              hsl(24 95% 40% / ${isDark ? 0.22 : 0.07}) 40%,
              transparent 80%
            )`,
                filter: "blur(20px)",
              }}
            />
          </>
        )}
      </div>

      {/* Top glow source with parallax */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[140%] h-[350px] animate-glow-breathe"
        style={{
          transform: `translateX(-50%) translateY(${scrollOffset * 0.1}px)`,
          background: `radial-gradient(
            ellipse 70% 100% at 50% 0%,
            hsl(24 95% 55% / ${isDark ? 0.7 : 0.24}) 0%,
            hsl(24 95% 50% / ${isDark ? 0.4 : 0.13}) 30%,
            hsl(24 95% 45% / ${isDark ? 0.15 : 0.04}) 60%,
            transparent 100%
          )`,
          willChange: "transform",
        }}
      />

      {/* Grid texture overlay with subtle parallax */}
      <div
        className="absolute inset-0 "
        style={{
          backgroundImage: `
            linear-gradient(hsl(24 40% 60% / 0.4) 1px, transparent 1px),
            linear-gradient(90deg, hsl(24 40% 60% / 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          backgroundPosition: `0 ${gridOffset}px`,
          willChange: "background-position",
          opacity: isDark ? 0.12 : 0.05,
        }}
      />

      {/* Bottom fade to background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%]"
        style={{
          background: `linear-gradient(to top, 
            hsl(var(--background)) 0%, 
            hsl(var(--background) / 0.8) 40%,
            transparent 100%
          )`,
        }}
      />
    </div>
  );
};

export default HeroLightRays;
