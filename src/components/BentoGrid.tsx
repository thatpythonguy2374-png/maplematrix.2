import { ReactNode } from "react";
import { Target, Sparkles, Code2, Users, Zap, Shield } from "lucide-react";

interface BentoTileProps {
  children: ReactNode;
  className?: string;
  span?: "1x1" | "2x1" | "1x2" | "2x2";
  gridArea?: string;
}

const BentoTile = ({
  children,
  className = "",
  span = "1x1",
  gridArea
}: BentoTileProps) => {
  const spanClasses = {
    "1x1": "",
    "2x1": "lg:col-span-2",
    "1x2": "lg:row-span-2",
    "2x2": "lg:col-span-2 lg:row-span-2"
  };
  return (
    <div 
      className={`group relative bg-card border border-border rounded-2xl p-5 overflow-hidden
        md:min-h-[280px] lg:min-h-0
        transition-[transform,opacity] duration-300
        ${spanClasses[span]} ${className}`} 
      style={gridArea ? { gridArea } : undefined}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,hsl(var(--primary)/0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_hsl(var(--primary)/0.06),inset_0_1px_0_hsl(var(--primary)/0.1)]" />
      </div>
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
};

const BentoGrid = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Mobile: Simple vertical stack */}
      <div className="flex flex-col gap-4 md:hidden">
        <BentoTile>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            Purpose-driven design
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            Every page is designed around your business goals—conversion, clarity, and credibility.
          </p>
        </BentoTile>

        <BentoTile>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            Clean, modern code
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            We build with React, TypeScript, and Tailwind so your site is fast, maintainable, and scalable.
          </p>
        </BentoTile>

        <BentoTile>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            Performance-first
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            Fast load times, accessibility compliance, and SEO fundamentals are built in from the start.
          </p>
        </BentoTile>

        <BentoTile>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            No templates, no shortcuts
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            Every design is original and tailored to your brand—not a reused theme with your logo swapped in.
          </p>
        </BentoTile>

        <BentoTile>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            Collaborative process
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            You get clear timelines, regular updates, and a partner who actually listens to feedback.
          </p>
        </BentoTile>

        <BentoTile>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            Launch-ready support
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            We handle hosting, deployment, and post-launch maintenance so you can focus on your business.
          </p>
        </BentoTile>
      </div>

      {/* Tablet: Stable 2-column grid */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-4 max-w-4xl mx-auto items-stretch">
        <BentoTile>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            Purpose-driven design
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            Every page is designed around your business goals—conversion, clarity, and credibility.
          </p>
        </BentoTile>

        <BentoTile>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            Clean, modern code
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            We build with React, TypeScript, and Tailwind so your site is fast, maintainable, and scalable.
          </p>
        </BentoTile>

        <BentoTile>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            Performance-first
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            Fast load times, accessibility, and SEO are built in from the start.
          </p>
        </BentoTile>

        <BentoTile>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            No templates, no shortcuts
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            Every design is original and tailored to your brand.
          </p>
        </BentoTile>

        <BentoTile>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            Collaborative process
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            Clear timelines, regular updates, and real feedback loops.
          </p>
        </BentoTile>

        <BentoTile>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            Launch-ready support
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            Hosting, deployment, and ongoing maintenance included.
          </p>
        </BentoTile>
      </div>

      {/* Desktop: Bento grid layout */}
      <div 
        className="hidden lg:grid lg:grid-cols-4 gap-4 max-w-6xl mx-auto"
        style={{
          gridTemplateAreas: `
            "purpose code perf community"
            "templates purpose2 support support"
          `
        }}
      >
        <BentoTile span="1x1" gridArea="purpose">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            Purpose-driven design
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            Every page is designed around your business goals—conversion, clarity, and credibility.
          </p>
        </BentoTile>

        <BentoTile span="1x1" gridArea="code">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            Clean, modern code
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            React, TypeScript, and Tailwind for fast, maintainable, scalable products.
          </p>
        </BentoTile>

        <BentoTile span="1x1" gridArea="perf">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            Performance-first
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            Speed, accessibility, and SEO fundamentals are built in from day one.
          </p>
        </BentoTile>

        <BentoTile span="1x1" gridArea="community">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            Collaborative process
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            Clear timelines, regular updates, and a partner who listens to feedback.
          </p>
        </BentoTile>

        <BentoTile span="2x1" gridArea="templates">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            No templates, no shortcuts
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            Every design is original and tailored to your brand—not a reused theme with your logo swapped in.
          </p>
        </BentoTile>

        <BentoTile span="2x1" gridArea="support">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5">
            Launch-ready support
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            We handle hosting, deployment, and ongoing maintenance so you can focus on growing your business.
          </p>
        </BentoTile>
      </div>
    </div>
  );
};

export default BentoGrid;
