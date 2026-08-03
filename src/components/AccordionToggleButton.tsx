import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
  openLabel?: string;
  closeLabel?: string;
}

/**
 * Shared expand/collapse toggle used by both FAQsSection and
 * CourseStructureSection. Previously this exact component was duplicated in
 * both files — since each section ships as its own lazy-loaded chunk, that
 * meant the same code was bundled and downloaded twice. Extracting it here
 * means both chunks import from one shared module instead.
 */
export const AccordionToggleButton = ({
  isOpen,
  onClick,
  openLabel = "Collapse",
  closeLabel = "Expand",
}: AccordionToggleButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-9 h-9 rounded-lg flex items-center justify-center",
      "bg-primary/10 border border-primary/30",
      "shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
      // transition-all -> transition: background/border/shadow/transform are
      // the only properties that change here; naming them means the browser
      // isn't watching layout-affecting properties it'll never need to react
      // to on this element.
      "transition duration-200 ease-out",
      "hover:bg-primary/20 hover:border-primary/50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] hover:-translate-y-0.5",
      "active:translate-y-0 active:shadow-[0_1px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
      "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
    )}
    aria-expanded={isOpen}
    aria-label={isOpen ? openLabel : closeLabel}>
    {isOpen ? (
      <X className="w-4 h-4 text-primary transition-transform duration-200" />
    ) : (
      <Plus className="w-4 h-4 text-primary transition-transform duration-200" />
    )}
  </button>
);
