import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProjectButton } from "@/components/EnrollButton";
import { AccordionToggleButton } from "@/components/AccordionToggleButton";

const services = [
  {
    id: 1,
    title: "Website Design & Development",
    tagline: "Bespoke sites that convert",
    summary:
      "Custom-designed marketing and company websites built for performance, SEO, and memorable brand presence.",
    details: [
      { label: "Custom UI/UX design", value: "no templates" },
      { label: "Responsive across all devices", value: "mobile-first" },
      { label: "Performance & SEO optimized", value: "fast + visible" },
      { label: "CMS integration", value: "easy updates" },
    ],
  },
  {
    id: 2,
    title: "E-commerce & Online Stores",
    tagline: "Stores built to sell",
    summary:
      "Conversion-focused online stores on Shopify, WooCommerce, or custom stacks—designed around your products and customers.",
    details: [
      { label: "Shopify / WooCommerce", value: "platform experts" },
      { label: "Product & catalog setup", value: "ready to sell" },
      { label: "Payment & shipping flows", value: "secure + smooth" },
      { label: "Conversion optimization", value: "more revenue" },
    ],
  },
  {
    id: 3,
    title: "Web Apps & SaaS Products",
    tagline: "Scalable tools and dashboards",
    summary:
      "Frontend-heavy web applications, dashboards, and MVPs built with React, TypeScript, and modern architecture.",
    details: [
      { label: "React + TypeScript", value: "modern stack" },
      { label: "Dashboards & internal tools", value: "data-driven" },
      { label: "API integrations", value: "connected systems" },
      { label: "Scalable architecture", value: "built to grow" },
    ],
  },
  {
    id: 4,
    title: "API & Integration",
    tagline: "Connect your systems",
    summary:
      "We connect your website or app to the services you already use—CRMs, payment providers, analytics, and custom APIs.",
    details: [
      { label: "Third-party API integrations", value: "seamless data flow" },
      { label: "Custom backend endpoints", value: "tailored logic" },
      { label: "CRM & marketing automation", value: "synced workflows" },
      { label: "Analytics & tracking", value: "measure what matters" },
    ],
  },
  {
    id: 5,
    title: "SEO, Hosting & Maintenance",
    tagline: "Keep it fast and secure",
    summary:
      "Ongoing support that keeps your site fast, secure, and search-visible long after launch.",
    details: [
      { label: "Technical SEO audits", value: "higher rankings" },
      { label: "Performance monitoring", value: "always fast" },
      { label: "Security updates & backups", value: "peace of mind" },
      { label: "Content & growth support", value: "long-term partner" },
    ],
  },
];

const CourseStructureSection = () => {
  const [openServiceId, setOpenServiceId] = useState<number | null>(1);

  const toggleService = (id: number) => {
    setOpenServiceId(openServiceId === id ? null : id);
  };

  return (
    <section id="services" className="py-16 sm:py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 max-w-6xl mx-auto">
          <div className="lg:sticky lg:top-32 lg:self-start space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Services built for{" "}
                <span className="text-primary font-lora">startups</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                From your first landing page to a full-featured web application,
                we help growing brands launch, scale, and stand out online.
              </p>
            </div>

            <ProjectButton size="lg" fullWidthMobile />
          </div>

          <div className="space-y-3">
            {services.map((service) => {
              const isOpen = openServiceId === service.id;

              return (
                <div
                  key={service.id}
                  className={cn(
                    "group relative bg-card border border-border rounded-2xl overflow-hidden",
                    // transition-all -> transition: only border-color, box-shadow, and
                    // transform change on this element; naming them keeps the browser
                    // from watching layout-affecting properties unnecessarily.
                    "transition duration-300 ease-out",
                    "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]",
                    "active:translate-y-0 active:shadow-[0_4px_15px_rgba(0,0,0,0.25)]",
                    isOpen && "border-primary/30",
                  )}>
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 z-10">
                    <div className="absolute inset-[-100%] bg-[linear-gradient(90deg,transparent_0%,transparent_40%,hsl(var(--primary)/0.12)_50%,transparent_60%,transparent_100%)]" />
                  </div>
                  <button
                    onClick={() => toggleService(service.id)}
                    className={cn(
                      "w-full p-4 sm:p-5 flex items-start gap-3 sm:gap-4 text-left",
                      "transition-colors duration-200",
                      "hover:bg-secondary/30 active:bg-secondary/40",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset",
                      "touch-manipulation",
                    )}
                    aria-expanded={isOpen}
                    aria-controls={`service-content-${service.id}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                          {service.tagline}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {service.summary}
                      </p>
                    </div>
                    <div
                      className="flex-shrink-0 mt-1"
                      onClick={(e) => e.stopPropagation()}>
                      <AccordionToggleButton
                        isOpen={isOpen}
                        onClick={() => toggleService(service.id)}
                        openLabel="Collapse service"
                        closeLabel="Expand service"
                      />
                    </div>
                  </button>

                  <div
                    id={`service-content-${service.id}`}
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}>
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5">
                        <div className="border-t border-border pt-4">
                          <ul className="space-y-3">
                            {service.details.map((detail, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between gap-4 py-2">
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                                    {index + 1}
                                  </span>
                                  <span className="text-sm text-foreground truncate">
                                    {detail.label}
                                  </span>
                                </div>
                                <span className="text-xs text-primary flex-shrink-0">
                                  {detail.value}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseStructureSection;
