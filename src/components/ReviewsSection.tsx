import { Star, Play, Twitter, Linkedin, Instagram } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import { useState } from "react";
import testimonialAvatar1 from "@/assets/testimonial-avatar-1.jpg";
import testimonialAvatar2 from "@/assets/testimonial-avatar-2.jpg";
import testimonialAvatar3 from "@/assets/testimonial-avatar-3.jpg";
import testimonialAvatar4 from "@/assets/testimonial-avatar-4.jpg";
import testimonialAvatar5 from "@/assets/testimonial-avatar-5.jpg";
import testimonialAvatar6 from "@/assets/testimonial-avatar-6.jpg";
import instructorImage from "@/assets/instructor-alex.jpg";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder, Bloom Health",
    quote: "Maple Matrix took our MVP from rough wireframes to a polished product in five weeks. The site loads fast, looks incredible, and converts 40% better than our old landing page.",
    rating: 5,
    avatar: testimonialAvatar1,
  },
  {
    name: "Marcus Johnson",
    role: "CTO, Dispatchly",
    quote: "Finally a dev team that cares about clean structure as much as design. Their React work is maintainable, accessible, and exactly what our engineering team wanted to inherit.",
    rating: 5,
    avatar: testimonialAvatar2,
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director, North & Oak",
    quote: "Our Shopify store was slow and outdated. Maple Matrix rebuilt it with a custom design that feels premium and our mobile conversion rate has doubled.",
    rating: 5,
    avatar: testimonialAvatar3,
  },
  {
    name: "David Park",
    role: "SaaS Founder",
    quote: "They built our marketing site and onboarding dashboard. The process was transparent, the communication was excellent, and they hit every deadline.",
    rating: 5,
    avatar: testimonialAvatar4,
  },
  {
    name: "Lisa Thompson",
    role: "Head of Product, Vantage",
    quote: "We needed a partner who could move fast without sacrificing quality. Maple Matrix delivered a design system and web app that our team is still building on a year later.",
    rating: 5,
    avatar: testimonialAvatar5,
  },
  {
    name: "James Wilson",
    role: "Founder, Craft & Co",
    quote: "The SEO and performance improvements alone paid for the project. Plus, the site genuinely reflects our brand now. Highly recommend.",
    rating: 5,
    avatar: testimonialAvatar6,
  },
];

const socialLinks = [
  { icon: Twitter, href: "#", label: "X (Twitter)" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

// Stat component with count-up animation
const AnimatedStat = ({ numericValue, suffix, label, decimals = 0 }: { 
  numericValue: number; 
  suffix: string; 
  label: string;
  decimals?: number;
}) => {
  const { ref, formattedCount } = useCountUp({ end: numericValue, duration: 1.4, decimals });
  
  return (
    <div ref={ref} className="text-center px-2">
      <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-0.5 sm:mb-1 font-lora">
        {formattedCount}{suffix}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

const ReviewsSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="reviews" className="py-16 sm:py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Trusted by <span className="text-primary font-lora">founders</span> & teams
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            We've helped startups and growing brands launch, scale, and stand out online.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto mb-12 md:mb-16">
          <AnimatedStat numericValue={50} suffix="+" label="Projects shipped" />
          <AnimatedStat numericValue={4.9} suffix="/5" label="Average rating" decimals={1} />
          <AnimatedStat numericValue={98} suffix="%" label="On-time delivery" />
          <AnimatedStat numericValue={85} suffix="%" label="Repeat clients" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col h-full overflow-hidden hover:border-primary/20 active:border-primary/30"
            >
              {/* Inner glow overlay */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,hsl(var(--primary)/0.08)_0%,transparent_70%)]" />
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_hsl(var(--primary)/0.06),inset_0_1px_0_hsl(var(--primary)/0.1)]" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>
                <blockquote className="text-foreground mb-4 flex-1">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border">
                  <img
                    src={testimonial.avatar}
                    alt={`${testimonial.name} avatar`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-background shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Founder / Studio Introduction */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Video placeholder */}
            <div className="order-1">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-secondary">
                {isPlaying ? (
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Studio Introduction"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src={instructorImage}
                      alt="Maple Matrix Lead Designer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-background/40" />
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center group"
                      aria-label="Play studio introduction"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <Play className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground ml-1" fill="currentColor" />
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Text Content */}
            <div className="order-2 space-y-5">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                Meet the <span className="text-primary font-lora">studio</span>
              </h3>
              <div className="space-y-3 text-muted-foreground leading-relaxed text-sm md:text-base">
                <p>
                  Maple Matrix is a small, focused web design and development studio built for 
                  startups and growing brands. We believe the best digital products come from the 
                  overlap of clear design, clean code, and genuine collaboration.
                </p>
                <p>
                  Every project starts with a conversation, not a template. We design around your 
                  goals, build with modern tools, and stay with you long after launch.
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 pt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 active:bg-primary/20 transition-all duration-200 touch-manipulation"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
