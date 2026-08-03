import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import DotGridBackground from "@/components/ui/DotGridBackground";

// Below-the-fold sections are code-split: on first load the browser only has to
// download/parse/execute Navbar + HeroSection to paint something. The rest ship
// as separate chunks the browser can fetch in parallel instead of all bundled
// into one blocking file — this is the single biggest lever for mobile load time
// here, since phones are usually parse/execute-bound, not just network-bound.
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const CourseStructureSection = lazy(
  () => import("@/components/CourseStructureSection"),
);
const PricingSection = lazy(() => import("@/components/PricingSection"));
const WhyUsSection = lazy(() => import("@/components/WhyUsSection"));
const FAQsSection = lazy(() => import("@/components/FAQsSection"));
const FinalCTASection = lazy(() => import("@/components/FinalCTASection"));

const Index = () => {
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // matchMedia only notifies on an actual breakpoint crossing, unlike a
    // resize listener which fires continuously (often dozens of times a
    // second) while the user pinch-zooms or rotates on mobile.
    const mql = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mql.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  // Handle hash navigation from other pages
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace("#", "");
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          const targetPosition = rect.top + scrollTop - 80;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [location.hash]);

  // Below-the-fold sections render as plain fragments on mobile (no scroll-triggered
  // animation library running/observing), and get wrapped in ScrollReveal on desktop.
  // Suspense fallback is null rather than a spinner: these sections are far enough
  // down the page that a brief blank space while their chunk loads is invisible —
  // a skeleton would just be extra DOM/paint work for no user benefit.
  const renderSection = (Section: React.ComponentType, delay?: number) =>
    isDesktop ? (
      <ScrollReveal delay={delay}>
        <Section />
      </ScrollReveal>
    ) : (
      <Section />
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <DotGridBackground />
      </div>
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />

          <Suspense fallback={null}>
            {renderSection(ProcessSection)}
            {renderSection(CourseStructureSection, 100)}
            {renderSection(PricingSection, 100)}
            {renderSection(WhyUsSection, 100)}
            {renderSection(FAQsSection, 100)}
            {renderSection(FinalCTASection, 100)}
          </Suspense>
        </main>

        {isDesktop ? (
          <ScrollReveal delay={100}>
            <Footer />
          </ScrollReveal>
        ) : (
          <Footer />
        )}
      </div>
    </div>
  );
};

export default Index;
