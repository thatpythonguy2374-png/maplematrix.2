import * as React from "react";
import { ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * ProjectButton - Canonical Primary CTA Component
 *
 * This is the SINGLE source of truth for all "Start your project" buttons across the site.
 * DO NOT create custom button variations - use the size variants provided here.
 *
 * All instances share:
 * - Identical height, padding, border-radius
 * - Same background, shadow, text styling
 * - Consistent arrow icon (size, stroke, position, 8px gap)
 * - Unified hover/active/focus animations
 */

interface ProjectButtonProps {
  /** Size variant: "default" for nav/cards, "lg" for hero/sections */
  size?: "default" | "lg";
  /** Optional: make button full width on mobile */
  fullWidthMobile?: boolean;
  /** Optional: always full width */
  fullWidth?: boolean;
  /** Custom label - defaults to "Start your project" */
  label?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional className (use sparingly - avoid style overrides) */
  className?: string;
}

const scrollToContact = () => {
  const element =
    document.getElementById("contact") || document.getElementById("pricing");
  if (element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetPosition = rect.top + scrollTop - 80;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }
};

const ProjectButton = React.forwardRef<HTMLButtonElement, ProjectButtonProps>(
  (
    {
      size = "default",
      fullWidthMobile = false,
      fullWidth = false,
      label = "Start your project",
      onClick,
      className,
    },
    ref,
  ) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = () => {
      if (onClick) {
        onClick();
        return;
      }

      navigate("/start-project");
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          // Base styles - locked
          "group inline-flex items-center justify-center font-medium",
          // transition-all -> transition: this button only ever changes
          // background, border-color, box-shadow, and transform (all listed
          // explicitly below). Naming them instead of "all" is a no-op
          // visually but stops the browser watching every property (including
          // layout ones) on the single most-repeated interactive element
          // on the site.
          "rounded-lg border transition",

          // Colors - locked (using design tokens)
          "bg-primary/10 border-primary/30 text-primary",
          "shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",

          // Hover animation - 150ms ease-out, -1px lift, enhanced glow
          "hover:bg-primary/20 hover:border-primary/50",
          "hover:shadow-[0_4px_12px_rgba(0,0,0,0.4),0_0_20px_hsl(var(--primary)/0.15),inset_0_1px_0_rgba(255,255,255,0.15)]",
          "hover:-translate-y-[1px]",
          "duration-150 ease-out",

          // Active/Press - instant response, press down
          "active:translate-y-0 active:duration-75",
          "active:shadow-[0_1px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",

          // Focus ring - consistent across all instances
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-background",

          // Disabled state - smooth fade with sufficient contrast
          "disabled:pointer-events-none disabled:opacity-60 disabled:transition-opacity disabled:duration-200",

          // Size variants - locked dimensions
          size === "default" && "h-10 px-6 py-2 text-sm gap-2",
          size === "lg" && "h-14 px-8 py-4 text-base gap-2",

          // Width modifiers
          fullWidth && "w-full",
          fullWidthMobile && "w-full sm:w-auto",

          // Respect reduced motion
          "motion-reduce:transition-none motion-reduce:hover:transform-none",

          className,
        )}>
        <span>{label}</span>
        <ArrowRight
          className={cn(
            // Arrow icon - locked size and position
            "h-4 w-4 flex-shrink-0",
            // Arrow animation on hover - smooth slide
            "transition-transform duration-150 ease-out",
            "group-hover:translate-x-0.5",
            "motion-reduce:group-hover:transform-none",
          )}
          strokeWidth={2}
        />
      </button>
    );
  },
);

ProjectButton.displayName = "ProjectButton";

export { ProjectButton, scrollToContact };
