import BentoGrid from "./BentoGrid";

const WhyUsSection = () => {
  return (
    <section id="why-us" className="py-16 sm:py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Why choose{" "}
            <span className="text-primary font-lora">Maple Matrix</span>?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Every project is handled with care. We combine design craft with
            engineering discipline so your site works beautifully today and
            scales cleanly tomorrow.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mb-12 sm:mb-20">
          <BentoGrid />
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
