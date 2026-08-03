import {
  ArrowRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Sparkles,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { footerNavLinks, legalLinks, socialLinks } from "@/config/navigation";
import Logo from "@/components/Logo";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#") && href.length > 1) {
      e.preventDefault();
      const targetId = href.substring(1);

      // If not on homepage, navigate there first with the hash
      if (location.pathname !== "/") {
        navigate("/" + href);
        return;
      }

      const element = document.getElementById(targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = rect.top + scrollTop - 80;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <footer className="relative overflow-hidden bg-background border-t border-border">
      {/* Orange Accent Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--grid-dot-color)) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Orange Glow */}
      <div className="absolute -top-60 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[140px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        {/* ===== MAIN GRID ===== */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
          {/* Brand */}

          {/* Brand */}
          <div className="lg:col-span-5">
            <Logo showText size="lg" />

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary">
                Building Digital Experiences Since 2025
              </span>
            </div>

            <p className="mt-6 max-w-md leading-8 text-[15px] text-muted-foreground">
              Maple Matrix is a premium web design and development studio
              helping startups, businesses, and ambitious founders build
              beautiful digital experiences that perform as good as they look.
            </p>

            {/* Social Icons */}

            <div className="flex items-center gap-3 mt-8">
              {[
                {
                  icon: Linkedin,
                  href: "https://linkedin.com",
                },
                {
                  icon: Github,
                  href: "https://github.com",
                },
                {
                  icon: Instagram,
                  href: "https://instagram.com",
                },
                {
                  icon: Twitter,
                  href: "https://twitter.com",
                },
              ].map((social, index) => {
                const Icon = social.icon;

                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
            group
            w-11
            h-11
            rounded-xl
            border
            border-border
            bg-card
            flex
            items-center
            justify-center
            transition-all
            duration-300
            hover:bg-primary
            hover:border-primary
            hover:-translate-y-1
          ">
                    <Icon className="w-5 h-5 text-muted-foreground transition-colors duration-300 group-hover:text-foreground" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company */}

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-wide text-foreground mb-6">
              Company
            </h3>

            <ul className="space-y-4">
              {footerNavLinks.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground">
                      <span>{link.label}</span>

                      <ArrowRight
                        className="
                w-3.5 h-3.5
                opacity-0
                -translate-x-2
                group-hover:opacity-100
                group-hover:translate-x-0
                transition-all
                duration-300
              "
                      />
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground">
                      <span>{link.label}</span>

                      <ArrowRight
                        className="
                w-3.5 h-3.5
                opacity-0
                -translate-x-2
                group-hover:opacity-100
                group-hover:translate-x-0
                transition-all
                duration-300
              "
                      />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-wide text-foreground mb-6">
              Resources
            </h3>

            <ul className="space-y-4">
              <li>
                <Link
                  to="/privacy-policy"
                  className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground">
                  Privacy Policy
                  <ArrowRight
                    className="
            w-3.5 h-3.5
            opacity-0
            -translate-x-2
            group-hover:opacity-100
            group-hover:translate-x-0
            transition-all
            duration-300
          "
                  />
                </Link>
              </li>

              <li>
                <Link
                  to="/terms-of-service"
                  className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground">
                  Terms of Service
                  <ArrowRight
                    className="
            w-3.5 h-3.5
            opacity-0
            -translate-x-2
            group-hover:opacity-100
            group-hover:translate-x-0
            transition-all
            duration-300
          "
                  />
                </Link>
              </li>

              <li>
                <a
                  href="mailto:maplematrix2374@gmail.com"
                  className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground">
                  Contact Us
                  <ArrowUpRight
                    className="
            w-3.5 h-3.5
            opacity-0
            -translate-x-2
            group-hover:opacity-100
            group-hover:translate-x-0
            transition-all
            duration-300
          "
                  />
                </a>
              </li>

              <li>
                <Link
                  to="/start-project"
                  className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground">
                  Start a Project
                  <ArrowRight
                    className="
            w-3.5 h-3.5
            opacity-0
            -translate-x-2
            group-hover:opacity-100
            group-hover:translate-x-0
            transition-all
            duration-300
          "
                  />
                </Link>
              </li>
            </ul>
          </div>

          {/* CTA */}

          {/* CTA */}

          <div className="lg:col-span-3">
            <div
              className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-border
      bg-card
border-border
      backdrop-blur-xl
      p-7
      h-full
    ">
              {/* Glow */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
              </div>

              {/* Badge */}
              <div className="relative inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-6">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />

                <span className="text-xs font-medium text-primary">
                  Available for New Projects
                </span>
              </div>

              <div className="relative">
                <h3 className="text-2xl font-bold text-foreground leading-tight">
                  Let's Build
                  <br />
                  Something Great.
                </h3>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Whether you're launching a startup or redesigning an existing
                  product, we're here to help you create something exceptional.
                </p>

                <Link
                  to="/start-project"
                  className="
          group
          mt-8
          inline-flex
          items-center
          gap-3
          rounded-xl
          bg-primary
          px-6
          py-3
          text-sm
          font-semibold
          text-foreground
          transition-all
          duration-300
          hover:scale-105
          hover:shadow-[0_10px_35px_rgba(249,115,22,.35)]
        ">
                  Start Your Project
                  <ArrowRight
                    className="
            w-4
            h-4
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-border pt-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left */}

            <div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Maple Matrix. Crafted with passion
                in India.
              </p>

              <p className="mt-2 text-xs text-muted-foreground/70">
                Building fast, modern and scalable digital experiences.
              </p>
            </div>

            {/* Center */}

            <div className="flex flex-wrap items-center gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="
            text-sm
            text-muted-foreground
            hover:text-foreground
            transition-colors
          ">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right */}

            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="
        group
        flex
        items-center
        gap-3
        self-start
        rounded-xl
        border
        border-border
        bg-card
        px-5
        py-3
        text-sm
        text-foreground
        transition-all
        duration-300
        hover:border-primary
        hover:bg-primary
      ">
              Back to Top
              <ArrowUpRight
                className="
          h-4
          w-4
          transition-transform
          duration-300
          group-hover:-translate-y-1
          group-hover:translate-x-1
        "
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
