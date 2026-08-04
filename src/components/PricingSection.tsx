import { useState } from "react";
import { Link } from "react-router-dom";
import { ProjectButton } from "@/components/EnrollButton";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const starterFeatures = [
  "Custom design & brand alignment",
  "Up to 5 pages",
  "Mobile & tablet responsive",
  "SEO & performance fundamentals",
  "CMS setup for easy edits",
  "30 days of support after launch",
];

const growthFeatures = [
  "Everything in Starter, plus:",
  "E-commerce or app functionality",
  "Up to 15 pages",
  "Advanced integrations & APIs",
  "Priority support & revisions",
  "Ongoing maintenance option",
];

const enterpriseFeatures = [
  "Everything in Growth, plus:",
  "Custom web application or SaaS",
  "Unlimited pages",
  "Dedicated project manager",
  "SLA & ongoing retainer",
  "Custom integrations & automation",
];

type PlanType = "starter" | "growth" | "enterprise";

const PricingSection = () => {
  const [activePlan, setActivePlan] = useState<PlanType>("growth");

  const plans = [
    {
      id: "starter" as PlanType,
      features: starterFeatures,
      cta: "Get started",
      popular: false,
    },
    {
      id: "growth" as PlanType,
      features: growthFeatures,
      cta: "Start your project",
      popular: true,
    },
    {
      id: "enterprise" as PlanType,
      features: enterpriseFeatures,
      cta: "Start your project",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            Transparent <span className="text-primary font-lora">pricing</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No hidden fees. Pick the package that fits your stage, or ask for a
            custom quote.
          </p>
        </div>

        {/* Mobile Plan Selector */}
        <div
          className="flex md:hidden justify-center gap-2 mb-6"
          role="tablist"
          aria-label="Pricing plan selector">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setActivePlan(plan.id)}
              role="tab"
              aria-selected={activePlan === plan.id}
              aria-pressed={activePlan === plan.id}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full border transition-colors",
                activePlan === plan.id
                  ? "bg-primary/20 border-primary text-primary"
                  : "bg-secondary/30 border-border text-muted-foreground",
              )}>
              {plan.id.charAt(0).toUpperCase() + plan.id.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "group relative rounded-2xl px-6 py-6 overflow-hidden flex flex-col md:transition md:duration-300",
                plan.popular
                  ? "bg-card border-2 border-primary shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)] md:hover:-translate-y-1 md:hover:shadow-[0_8px_40px_rgba(0,0,0,0.3),0_0_40px_-5px_hsl(var(--primary)/0.4)]"
                  : "bg-card border border-border md:hover:-translate-y-1 md:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]",
                "hidden md:flex",
                activePlan === plan.id && "flex md:flex",
              )}>
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg z-20">
                  Most Popular
                </div>
              )}

              {/* Shimmer sweep was previously keyed off an unscoped group-hover, so a
                  tap on mobile would trigger and hold it with no matching hover intent.
                  Gated to md: since it's a hover-only decorative effect. */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-300">
                <div className="absolute inset-[-100%] bg-[linear-gradient(90deg,transparent_0%,transparent_40%,hsl(var(--primary)/0.12)_50%,transparent_60%,transparent_100%)]" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />

                      <span
                        className={cn(
                          "text-sm leading-relaxed",
                          index === 0
                            ? "text-primary font-semibold"
                            : "text-foreground",
                        )}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {plan.id === "enterprise" ? (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full h-14 rounded-lg border-primary/30 md:hover:bg-primary/10 md:transition-colors">
                      <Link to="/start-project">{plan.cta} →</Link>
                    </Button>
                  ) : (
                    <ProjectButton size="lg" fullWidth label={plan.cta} />
                  )}

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-3.5 h-3.5 text-primary" />
                      <span>Scope clarity before any payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm text-foreground">
              Typical launch: 2–6 weeks
            </span>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm text-foreground">
              Custom quotes for complex projects
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
