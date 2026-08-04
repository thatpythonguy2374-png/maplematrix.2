import { cn } from "@/lib/utils";
import logoLight from "@/assets/logo-light.png"; // White logo
import logoDark from "@/assets/logo-dark.png"; // Black logo
import { useEffect, useState } from "react";

interface LogoProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ showText = true, size = "md", className }: LogoProps) => {
  const textSizes = {
    sm: "text-sm",
    md: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl",
  };
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const currentLogo = isDark ? logoDark : logoLight;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <img
        src={currentLogo}
        alt="Maple Matrix logo"
        title="Maple Matrix Logo"
        className={cn(
          size === "sm" && "h-8",
          size === "md" && "h-10",
          size === "lg" && "h-12",
          "w-auto",
        )}
      />

      {showText && (
        <span className={cn("font-bold tracking-tight", textSizes[size])}>
          Maple <span className="text-primary">Matrix</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
