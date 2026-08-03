import { MessageSquare, Palette, Code, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We learn your goals, audience, and brand so every decision is grounded in strategy.",
    icon: MessageSquare,
  },
  {
    number: "02",
    title: "Design",
    description:
      "We craft custom wireframes and visual designs that reflect your brand and convert visitors.",
    icon: Palette,
  },
  {
    number: "03",
    title: "Development",
    description:
      "We build with clean, modern code—performance, accessibility, and SEO in mind from day one.",
    icon: Code,
  },
  {
    number: "04",
    title: "Launch & Support",
    description:
      "We deploy, test, and optimize, then stay on call for updates, hosting, and growth.",
    icon: Rocket,
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-16 sm:py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            A clear process,{" "}
            <span className="text-primary font-lora">clean results</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            No black boxes. You know exactly where your project stands from
            kickoff to launch.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                // transition-all -> transition: border/shadow/transform are covered by
                // Tailwind's default transition set, so nothing visible changes, but the
                // browser no longer has to watch layout properties on 4 cards at once.
                className="group relative bg-card border border-border rounded-2xl p-5 sm:p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:border-primary/20">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,hsl(var(--primary)/0.08)_0%,transparent_70%)]" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground/60">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground/90 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
