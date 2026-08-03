import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProjectButton } from "@/components/EnrollButton";
import { navLinks } from "@/config/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Debounce active section detection to prevent jitter
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const sections = [
          "services",
          "process",
          "reviews",
          "pricing",
          "why-us",
          "faqs",
        ];
        const viewportHeight = window.innerHeight;
        const scrollPosition = window.scrollY;

        // Use 40% viewport threshold for hysteresis
        const threshold = viewportHeight * 0.4;
        let newActiveSection = "";
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top;
            const elementBottom = rect.bottom;

            // Section is active when it's clearly in view (40% into viewport)
            if (elementTop <= threshold && elementBottom > threshold * 0.5) {
              newActiveSection = section;
              break;
            }
          }
        }

        // Clear active if at top of page
        if (scrollPosition < 100) {
          newActiveSection = "";
        }
        setActiveSection(newActiveSection);
      }, 50); // Small debounce for smoothness
    };
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("#")) {
      e.preventDefault();
      navigate(href);
      setIsMobileMenuOpen(false);
      setOpenMobileMenu(null);
      setOpenDesktopMenu(null);
      return;
    }
    e.preventDefault();
    const targetId = href.replace("#", "");

    // If not on homepage, navigate there first with the hash
    if (location.pathname !== "/") {
      navigate("/" + href);
      setIsMobileMenuOpen(false);
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      // Use getBoundingClientRect for accurate position with nested wrappers
      const rect = element.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const targetPosition = rect.top + scrollTop - 80; // 80px offset for fixed header

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false);
  };

  const handleDesktopMenuEnter = (label: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpenDesktopMenu(label);
  };

  const handleDesktopMenuLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDesktopMenu(null);
    }, 150);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 md:px-6 border-0 border-none">
        <div className="flex items-center justify-between h-16 md:h-20 max-w-6xl mx-auto border-0">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (location.pathname !== "/") {
                navigate("/");
              } else {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }
            }}
            className="flex items-center">
            <Logo showText={true} size="md" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = activeSection === link.href.replace("#", "");
              const hasSubmenu = !!link.submenu?.length;
              const isMenuOpen = openDesktopMenu === link.label;

              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() =>
                    hasSubmenu && handleDesktopMenuEnter(link.label)
                  }
                  onMouseLeave={() => hasSubmenu && handleDesktopMenuLeave()}>
                  <a
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    aria-haspopup={hasSubmenu ? "true" : undefined}
                    aria-expanded={hasSubmenu ? isMenuOpen : undefined}
                    className="relative flex items-center gap-1 text-sm font-medium"
                    style={{
                      color: active
                        ? "hsl(var(--primary))"
                        : "hsl(var(--foreground))",
                      opacity: active ? 1 : 0.85,
                      transition:
                        "color 350ms cubic-bezier(0.4, 0, 0.2, 1), opacity 350ms cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.opacity = "0.85";
                    }}>
                    {link.label}
                    {hasSubmenu && (
                      <ChevronDown
                        size={14}
                        className="transition-transform duration-200"
                        style={{
                          transform: isMenuOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    )}
                    <span
                      className="absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full"
                      style={{
                        width: active ? "100%" : "0%",
                        opacity: active ? 1 : 0,
                        transition:
                          "width 350ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                  </a>

                  {/* Desktop Dropdown */}
                  {hasSubmenu && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200"
                      style={{
                        opacity: isMenuOpen ? 1 : 0,
                        visibility: isMenuOpen ? "visible" : "hidden",
                        transform: `translate(-50%, ${isMenuOpen ? "0" : "-6px"})`,
                      }}>
                      <div className="min-w-[220px] rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-lg py-2">
                        {link.submenu!.map((sub) => (
                          <a
                            key={sub.label}
                            href={sub.href}
                            onClick={(e) => handleSmoothScroll(e, sub.href)}
                            className="block px-4 py-2.5 text-sm text-foreground/85 hover:text-primary hover:bg-secondary/30 transition-colors">
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <ProjectButton className="hidden lg:flex" />

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground touch-manipulation active:bg-secondary/30 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden bg-background border-t border-border overflow-hidden transition-all duration-300 ease-out ${
            isMobileMenuOpen
              ? "max-h-[32rem] opacity-100 py-4 overflow-y-auto"
              : "max-h-0 opacity-0 py-0"
          }`}
          aria-hidden={!isMobileMenuOpen}>
          <nav
            className="flex flex-col space-y-1"
            role="navigation"
            aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const active = activeSection === link.href.replace("#", "");
              const hasSubmenu = !!link.submenu?.length;
              const isMenuOpen = openMobileMenu === link.label;

              return (
                <div key={link.label}>
                  <div className="flex items-center justify-between">
                    <a
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="flex-1 text-sm font-medium px-4 py-3 active:bg-secondary/30 transition-colors touch-manipulation"
                      style={{
                        color: active
                          ? "hsl(var(--primary))"
                          : "hsl(var(--muted-foreground))",
                        transition:
                          "color 350ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms ease-out",
                      }}
                      tabIndex={isMobileMenuOpen ? 0 : -1}>
                      {link.label}
                    </a>
                    {hasSubmenu && (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMobileMenu(isMenuOpen ? null : link.label)
                        }
                        aria-label={`Toggle ${link.label} submenu`}
                        aria-expanded={isMenuOpen}
                        className="p-3 text-muted-foreground touch-manipulation"
                        tabIndex={isMobileMenuOpen ? 0 : -1}>
                        <ChevronDown
                          size={16}
                          className="transition-transform duration-200"
                          style={{
                            transform: isMenuOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      </button>
                    )}
                  </div>

                  {hasSubmenu && (
                    <div
                      className={`overflow-hidden transition-all duration-250 ease-out ${
                        isMenuOpen
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}>
                      <div className="flex flex-col pl-6 pb-2">
                        {link.submenu!.map((sub) => (
                          <a
                            key={sub.label}
                            href={sub.href}
                            onClick={(e) => handleSmoothScroll(e, sub.href)}
                            className="text-sm px-4 py-2 text-muted-foreground/90 active:bg-secondary/30 transition-colors touch-manipulation"
                            tabIndex={isMobileMenuOpen ? 0 : -1}>
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="px-4 pt-3">
              <ProjectButton fullWidth />
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
