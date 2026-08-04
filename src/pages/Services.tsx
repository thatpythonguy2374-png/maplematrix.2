import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ProjectButton } from "@/components/EnrollButton";
import {
  Code2,
  Terminal,
  ShoppingBag,
  PenTool,
  Cloud,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import DotGridBackground from "@/components/ui/DotGridBackground";

const services = [
  {
    id: "website-development",
    icon: Code2,
    title: "Website Development",
    description:
      "Full-lifecycle application engineering for complex business needs. We build scalable backends paired with lightning-fast frontend architectures.",
    stack: ["REACT", "NODE.JS", "TYPESCRIPT", "SUPABASE"],
    size: "lg",
  },
  {
    id: "ui-ux-design",
    icon: ShoppingBag,
    title: "UI/UX Design",
    description:
      "High-conversion online stores that blend fast performance with immersive brand storytelling.",
    stack: ["SHOPIFY", "STRIPE"],
    size: "md",
  },
  {
    id: "ui-ux-design",
    icon: PenTool,
    title: "Branding",
    description:
      "User interfaces that breathe. We focus on motion systems, spatial logic, and accessibility from day one.",
    stack: ["FIGMA", "FRAMER MOTION"],
    size: "md",
  },
  {
    id: "devops",
    icon: Cloud,
    title: "DevOps & Cloud Ops",
    description:
      "Hardened cloud infrastructure focused on high availability, automated CI/CD pipelines, and global edge delivery.",
    stack: ["AWS", "TERRAFORM", "CI/CD"],
    size: "lg",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Strategic Discovery",
    description:
      "We start with deep planning — auditing your current setup, defining core goals, and building a technical spec that leaves no room for ambiguity.",
    checklist: ["Tech Stack Audit", "User Flow Mapping"],
  },
  {
    number: "02",
    title: "High-Fidelity Prototyping",
    description:
      "We design at the intersection of usability and aesthetics. Our prototypes are living representations of the final product, not just pictures.",
    checklist: ["Design System Setup", "Motion Planning"],
  },
  {
    number: "03",
    title: "Precision Engineering",
    description:
      "Clean, typed, and documented code. We prioritize testing, accessibility, and performance optimization out of the box.",
    checklist: ["CI/CD Automation", "Core Web Vitals"],
  },
  {
    number: "04",
    title: "Deployment & Handover",
    description:
      "The launch is just the beginning. We make sure your team is equipped with documentation and monitoring tools.",
    checklist: ["Monitoring Setup", "Documentation Sprint"],
  },
];

export default function Services() {
  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground">
        {/* Decorative dot-grid is genuinely expensive to paint/animate — desktop only */}
        <div className="hidden md:block">
          <DotGridBackground />
        </div>

        {/* ================= HERO ================= */}
        {/* pt bumped up on mobile: small-screen navbars are often taller than desktop
            (stacked logo/menu, extra padding), so a value tuned for desktop can leave
            too little clearance and the hero heading creeps up under it. */}
        <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 overflow-hidden">
          {/* Blur radius capped + orb hidden on mobile: blur() at 120px forces a huge,
              slow GPU compositing pass on low-end phones for essentially no visible gain
              on a small viewport. */}
          <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="container relative mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
                Engineering the{" "}
                <span className="text-primary font-lora">Digital Frontier</span>
              </h1>

              <p className="mt-6 sm:mt-8 text-base sm:text-lg text-muted-foreground leading-7 sm:leading-8 max-w-2xl">
                We craft high-performance digital products for ambitious
                businesses across Delhi NCR and beyond from cloud infrastructure
                to fluid, human-centric interfaces.
              </p>

              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4">
                <ProjectButton />
              </div>
            </div>
          </div>
        </section>

        {/* ================= SERVICES GRID ================= */}
        <ScrollReveal>
          <section className="py-16 sm:py-28 bg-secondary/30">
            <div className="container mx-auto max-w-7xl px-6">
              <div className="mb-12 sm:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
                <div>
                  <p className="uppercase tracking-[0.35em] text-primary text-sm font-semibold mb-4">
                    Expertise
                  </p>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                    Digital Craftsmanship
                    <br />
                    at Scale
                  </h2>
                </div>
                <p className="text-muted-foreground max-w-sm">
                  Our technical suite is built for companies that demand zero
                  compromises on performance or design.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div
                      id={service.id}
                      key={service.title}
                      className={`group relative overflow-hidden rounded-3xl border border-primary/15 bg-white/5 md:backdrop-blur-xl p-6 sm:p-10 md:transition-transform md:duration-500 md:hover:-translate-y-2 md:hover:border-primary/60 md:hover:shadow-[0_0_35px_rgba(249,115,22,.2)] ${
                        service.size === "lg"
                          ? "lg:col-span-8"
                          : "lg:col-span-4"
                      } flex flex-col`}>
                      {/* backdrop-blur-xl is desktop-only above: on mobile the layered
                          frosted-glass effect is one of the heaviest paint operations
                          the browser can do, especially repeated across 4 cards.
                          Hover/translate is also gated to md: and up — on mobile
                          there's no real hover, but a tap can still trigger and hold
                          the :hover state, so leaving it unscoped costs an extra
                          transform + repaint on every card tap for no visual payoff. */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 sm:mb-8 border border-primary/20 md:transition-transform md:group-hover:scale-110">
                        <Icon
                          className="w-6 h-6 sm:w-7 sm:h-7 text-primary"
                          strokeWidth={1.7}
                        />
                      </div>

                      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4">
                        {service.title}
                      </h3>

                      <p className="text-muted-foreground leading-7 sm:leading-8 max-w-xl mb-auto">
                        {service.description}
                      </p>

                      <div className="mt-8 sm:mt-10 pt-6 border-t border-border">
                        <p className="text-[11px] text-primary/70 uppercase tracking-widest mb-3 font-semibold">
                          Core Stack
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {service.stack.map((tech) => (
                            <span
                              key={tech}
                              className="px-4 py-2 rounded-full border border-border text-xs text-muted-foreground">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Plain SVG icon, no blur/filter — cheap, safe to keep on mobile.
                          Opacity transition still keyed off group-hover, which now
                          only actually fires on md:+ per the parent's hover scoping. */}
                      <Terminal className="absolute -right-8 -bottom-8 w-40 h-40 sm:w-48 sm:h-48 text-primary opacity-[0.03] transition-opacity duration-1000 group-hover:opacity-[0.06]" />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ================= PROCESS TIMELINE ================= */}
        <ScrollReveal delay={100}>
          <section className="py-16 sm:py-28 relative overflow-hidden">
            {/* Radial gradient wash — cheap, no filter/blur, safe on mobile as-is */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,.05),transparent_70%)]" />
            <div className="container relative mx-auto max-w-7xl px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16">
                <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                  <p className="uppercase tracking-[0.35em] text-primary text-sm font-semibold mb-6">
                    Protocol
                  </p>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">
                    How we engineer excellence.
                  </h2>
                  <p className="text-muted-foreground leading-7 sm:leading-8 mb-8 sm:mb-10 max-w-sm">
                    Our workflow is a rigorous orchestration of strategy,
                    design, and engineering. Every line of code serves a
                    purpose.
                  </p>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Agile Delivery
                      <br />
                      Every 2 Weeks
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-7 lg:ml-auto relative">
                  <div className="absolute left-6 top-4 bottom-4 w-px bg-primary/15 hidden md:block" />
                  <div className="space-y-10 sm:space-y-16">
                    {processSteps.map((step) => (
                      <div
                        key={step.number}
                        className="flex gap-5 sm:gap-8 group relative">
                        <div className="flex-none relative z-10">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border bg-background flex items-center justify-center text-primary text-sm font-semibold transition-colors duration-500 group-hover:bg-primary group-hover:text-white shadow-sm">
                            {step.number}
                          </div>
                        </div>
                        <div className="pt-1">
                          <h4 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 transition-colors group-hover:text-primary">
                            {step.title}
                          </h4>
                          <p className="text-muted-foreground leading-7 sm:leading-8 mb-4 sm:mb-5">
                            {step.description}
                          </p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {step.checklist.map((item) => (
                              <li
                                key={item}
                                className="flex items-center gap-3 text-sm text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ================= CTA ================= */}
        <ScrollReveal delay={100}>
          <section className="py-20 sm:py-32 relative overflow-hidden">
            <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="container relative mx-auto max-w-5xl px-6">
              <div className="rounded-3xl sm:rounded-[40px] border border-border p-8 sm:p-16 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold max-w-3xl mx-auto">
                  Ready to engineer your{" "}
                  <span className="text-primary font-lora">
                    digital masterpiece?
                  </span>
                </h2>
                <p className="mt-6 sm:mt-8 text-muted-foreground max-w-2xl mx-auto leading-7 sm:leading-8">
                  Tell us about your project and we'll get back to you within
                  one business day.
                </p>
                <div className="mt-8 sm:mt-10 flex justify-center">
                  <ProjectButton />
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
