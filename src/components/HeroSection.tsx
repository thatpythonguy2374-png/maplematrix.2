import { ProjectButton } from "@/components/EnrollButton";
import HeroLightRays from "./HeroLightRays";
import { useScrollParallax } from "@/hooks/use-parallax";

const HeroSection = () => {
  const headlineParallax = useScrollParallax(0.08);
  const subheadlineParallax = useScrollParallax(0.05);

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Light rays background - rendered first, behind everything */}
      <HeroLightRays />

      {/* Hero Content */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 lg:py-16 relative z-10 flex-1 flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4 sm:mb-6 xl:text-6xl opacity-0"
            style={{
              animation: "heroFadeIn 0.7s ease-out 0.3s forwards",
              transform: `translateY(${headlineParallax}px)`,
            }}>
            Web Design That
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span
              className="text-primary font-lora inline-block"
              style={{
                animation: "subtleGlow 3s ease-in-out infinite",
              }}>
              Speaks
            </span>{" "}
            For Your Brand.
          </h1>

          {/* Subheadline */}
          <p
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-12 opacity-0 px-2"
            style={{
              animation: "heroFadeIn 0.6s ease-out 0.45s forwards",
              transform: `translateY(${subheadlineParallax}px)`,
            }}>
            Where creativity meets clean structure. We combine modern
            engineering with thoughtful design to build websites and web apps
            that are fast, accessible, and built to last.
          </p>

          {/* Primary CTA */}
          <div
            className="flex flex-col items-center space-y-6 mb-4 opacity-0"
            style={{ animation: "heroFadeIn 0.6s ease-out 0.55s forwards" }}>
            <ProjectButton size="lg" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes subtleGlow {
          0%, 100% { 
            text-shadow: 0 0 0px hsl(var(--primary) / 0);
            filter: brightness(1);
          }
          50% { 
            text-shadow: 0 0 20px hsl(var(--primary) / 0.4);
            filter: brightness(1.1);
          }
        }
        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
