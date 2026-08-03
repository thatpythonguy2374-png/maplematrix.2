import { useState } from "react";
import { cn } from "@/lib/utils";
import { AccordionToggleButton } from "@/components/AccordionToggleButton";

const faqs = [
  {
    id: 1,
    question: "How long does a typical website project take?",
    answer:
      "A focused landing page or small site usually takes 2–3 weeks. A larger marketing site or e-commerce build is typically 4–6 weeks. Complex web applications can take longer, and we always share a clear timeline before we start.",
  },
  {
    id: 2,
    question: "What platforms and technologies do you use?",
    answer:
      "We build custom sites with React, TypeScript, Tailwind CSS, and Vite. For e-commerce, we work with Shopify or WooCommerce. For content-heavy sites, we integrate headless CMS options like Sanity or Contentful. We pick the stack that fits your project, not the other way around.",
  },
  {
    id: 3,
    question: "Do you work with startups and small teams?",
    answer:
      "Absolutely. We specialize in helping startups and growing brands launch quickly without sacrificing quality. Our packages are designed to scale from MVP to full product.",
  },
  {
    id: 4,
    question: "Will my site be mobile-friendly and SEO-ready?",
    answer:
      "Yes. Every site we build is responsive across all devices and includes technical SEO fundamentals—clean markup, fast load times, accessible structure, and proper metadata. We also offer deeper SEO and performance audits as add-ons.",
  },
  {
    id: 5,
    question: "What happens after the site launches?",
    answer:
      "We include 30 days of post-launch support on every project. After that, you can choose an ongoing maintenance and hosting retainer, or we can hand everything over with documentation for your team.",
  },
  {
    id: 6,
    question: "How does pricing work?",
    answer:
      "We offer three starting packages: Starter ($3,999), Growth ($8,999), and Enterprise ($19,999). Each has a fixed scope so you know exactly what you're getting. For custom work, we'll prepare a detailed proposal after an initial discovery call.",
  },
  {
    id: 7,
    question: "Can you help with branding and copywriting?",
    answer:
      "Our core focus is design and development, but we can coordinate with your brand team or recommend trusted partners for copywriting, brand identity, and content strategy when needed.",
  },
  {
    id: 8,
    question: "How do we get started?",
    answer:
      "Click the Start your project button, fill out the contact form, and tell us about your goals. We'll reply within one business day to schedule a free discovery call and send you a clear proposal.",
  },
];

const FAQsSection = () => {
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faqs" className="py-16 sm:py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Frequently asked{" "}
            <span className="text-primary font-lora">questions</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Everything you need to know before starting your project.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={cn(
                    "relative bg-card border border-border rounded-2xl overflow-hidden",
                    "transition-colors duration-300 ease-out",
                    "group",
                    isOpen && "border-primary/30",
                  )}>
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className={cn(
                      "w-full p-4 sm:p-5 flex items-start gap-3 sm:gap-4 text-left",
                      "transition-colors duration-200",
                      "hover:bg-secondary/30 active:bg-secondary/40",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset",
                      "touch-manipulation",
                    )}
                    aria-expanded={isOpen}
                    aria-controls={`faq-content-${faq.id}`}>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-semibold text-foreground">
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className="flex-shrink-0 mt-0.5"
                      onClick={(e) => e.stopPropagation()}>
                      <AccordionToggleButton
                        isOpen={isOpen}
                        onClick={() => toggleFaq(faq.id)}
                        openLabel="Collapse answer"
                        closeLabel="Expand answer"
                      />
                    </div>
                  </button>

                  <div
                    id={`faq-content-${faq.id}`}
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}>
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5">
                        <div className="border-t border-border pt-4">
                          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
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

export default FAQsSection;
