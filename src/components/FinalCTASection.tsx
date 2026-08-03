import { useRef, useEffect, useState, lazy, Suspense } from "react";
import { ProjectButton } from "@/components/EnrollButton";
import { useScrollParallax } from "@/hooks/use-parallax";

// Lazy load the globe for performance
const InteractiveGlobe = lazy(() => import("@/components/InteractiveGlobe"));

const FinalCTASection = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const parallaxOffset = useScrollParallax(0.08);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // matchMedia only fires on an actual breakpoint crossing, unlike a resize
    // listener which fires continuously while scrolling/zooming on mobile.
    const mql = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mql.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  // Intersection Observer for fade-in animation
  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, []);

  // On mobile the globe never mounts (see the isDesktop check below), so there's
  // no "real content" for the parallax rays to reveal — they're pure decoration
  // riding on a scroll listener. Zeroing the offset on mobile keeps the listener
  // (owned by the hook) but stops these blurred layers from recomputing their
  // transform on every scroll tick, which is the expensive part.
  const effectiveParallax = isDesktop ? parallaxOffset : 0;

  return (
    <section className="relative pt-12 md:pt-20 pb-12 lg:pb-0 lg:-mb-8 overflow-visible">
      {/* Single unified gradient background - similar to hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `hsl(var(--background))`,
        }}
      />

      {/* Globe glow - positioned to appear behind the globe - with parallax */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[80%] pointer-events-none animate-glow-breathe"
        style={{
          transform: `translate3d(0, ${-effectiveParallax * 0.3}px, 0)`,
          background: `radial-gradient(
            ellipse 90% 100% at 50% 100%,
            hsl(24 95% 55% / 0.6) 0%,
            hsl(24 95% 50% / 0.35) 25%,
            hsl(24 95% 45% / 0.15) 50%,
            transparent 75%
          )`,
          willChange: "transform",
        }}
      />

      {/* Subtle rays emanating upward from globe — hidden on mobile: these are
          blur(45–50px) filtered layers whose transform updates on every scroll
          tick via the parallax hook. Blur + continuous transform is one of the
          most expensive combinations you can ask a phone GPU to composite, for a
          decorative effect that's barely visible next to the globe it accents —
          and on mobile the globe itself never renders. */}
      <div className="hidden lg:flex absolute inset-0 pointer-events-none overflow-hidden justify-center">
        <div
          className="absolute bottom-0 origin-bottom"
          style={{
            width: "250px",
            height: "70%",
            transform: `translate3d(-50%, ${-effectiveParallax * 0.4}px, 0) rotate(-12deg)`,
            background: `linear-gradient(
              to top,
              hsl(24 95% 50% / 0.25) 0%,
              hsl(24 95% 45% / 0.1) 50%,
              transparent 80%
            )`,
            filter: "blur(50px)",
            willChange: "transform",
          }}
        />
        <div
          className="absolute bottom-0 origin-bottom"
          style={{
            width: "220px",
            height: "65%",
            transform: `translate3d(50%, ${-effectiveParallax * 0.5}px, 0) rotate(15deg)`,
            background: `linear-gradient(
              to top,
              hsl(24 95% 52% / 0.2) 0%,
              hsl(24 95% 45% / 0.08) 55%,
              transparent 85%
            )`,
            filter: "blur(45px)",
            willChange: "transform",
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* CTA Content - Above Globe */}
        <div className="max-w-5xl mx-auto mb-10">
          <div
            ref={contentRef}
            className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}>
            {/* Left column - Headline and CTA */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-3 sm:mb-4">
                Ready to build{" "}
                <span className="text-primary font-lora">your website?</span>
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-5 sm:mb-6">
                Tell us about your project and we'll get back to you within one
                business day.
              </p>

              <ProjectButton size="lg" fullWidthMobile />
            </div>

            {/* Right column - Benefits list */}
            <div className="space-y-2 sm:space-y-3">
              {[
                "Free initial consultation",
                "Clear proposal & timeline",
                "No templates, no shortcuts",
                "Ongoing support after launch",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full border border-primary/50 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base text-foreground">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Globe Section - Below CTA. Desktop only: on mobile this whole block
            (copy, shimmer placeholder, glow ring, dot pattern, and the lazy
            globe canvas) simply doesn't mount, rather than mounting a static
            placeholder that stands in for a globe that never arrives. That
            removes several absolutely-positioned layers, a box-shadow with a
            large blur radius, and a background dot pattern from mobile's
            paint work entirely, and shrinks the page height instead of
            reserving ~280px for content mobile never sees. */}
        {isDesktop && (
          <>
            <div className="text-center mb-3 sm:mb-4">
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                Building for brands around the world
              </p>
            </div>

            {/* Globe viewport - fixed dimensions, no CLS */}
            <div className="relative overflow-visible mx-auto w-full h-[350px] pt-16">
              {/* Globe anchor - absolutely positioned, centered, fixed size */}
              <div
                className="absolute h-[700px]"
                style={{
                  /* Lock position from first paint - never changes */
                  left: "50%",
                  bottom: "-280px",
                  width: "100%",
                  maxWidth: "700px",
                  /* Single transform baseline - GPU accelerated */
                  transform: "translate3d(-50%, 0, 0)",
                  transformOrigin: "center top",
                  willChange: "transform",
                }}>
                {/* Globe canvas - lazy loaded, fades in over placeholder */}
                <Suspense fallback={null}>
                  <InteractiveGlobe />
                </Suspense>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FinalCTASection;
