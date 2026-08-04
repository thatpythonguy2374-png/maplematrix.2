import { ProjectButton } from "@/components/EnrollButton";
import HeroLightRays from "./HeroLightRays";
import { useScrollParallax } from "@/hooks/use-parallax";

const HeroSection = () => {
  // Single scroll listener instead of two: both the headline and subheadline
  // just need window.scrollY scaled by a different multiplier, so there's no
  // reason to run two independent listeners/state updates for the same input.
  const rawParallax = useScrollParallax(1);
  const headlineParallax = rawParallax * 0.08;
  const subheadlineParallax = rawParallax * 0.05;

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Light rays background - rendered first, behind everything */}

      <HeroLightRays />

      {/* Hero Content */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 lg:py-16 relative z-10 flex-1 flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          {/*
            IMPORTANT: this H1 is almost certainly your LCP (Largest Contentful
            Paint) element — it's the biggest text block above the fold. It
            previously started at opacity: 0 and only became visible after a
            0.3s delay + 0.7s fade, meaning the browser couldn't count it as
            "painted" for LCP/FCP purposes until roughly a full second in.
            That's not a small styling choice — it was directly inflating the
            two metrics that make up most of your performance score. It now
            renders fully visible immediately; the parallax transform is kept
            since transform doesn't block paint the way opacity does.
          */}
          <div
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4 sm:mb-6 xl:text-6xl"
            style={{
              transform: `translateY(${headlineParallax}px)`,
            }}>
            <h1>Web Design That</h1>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span className="text-primary font-lora inline-block glow-pulse">
              Speaks
            </span>{" "}
            For Your Brand.
          </div>

          {/* Subheadline — same reasoning: visible immediately, no opacity gate */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
            Where creativity meets clean structure. We combine modern
            engineering with thoughtful design to build websites and web apps
            that are fast, accessible, and built to last.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col items-center space-y-6 mb-4">
            <ProjectButton size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
