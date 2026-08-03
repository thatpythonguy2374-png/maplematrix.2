/**
 * Navigation Configuration
 * 
 * Single source of truth for all navigation links.
 * Used by Navbar and Footer to ensure consistency.
 */

export interface NavSubLink {
  label: string;
  href: string;
  isRoute?: boolean;
}

export interface NavLink {
  label: string;
  href: string;
  isRoute?: boolean;
  submenu?: NavSubLink[];
}

/**
 * Primary navigation links - used by Navbar.
 * Order matters: this is the canonical order for the navbar.
 * Services and Resources carry dropdown submenus.
 */
export const navLinks: NavLink[] = [
  { label: "Home", href: "/", isRoute: true },
  { label: "About", href: "/about", isRoute: true },
  {
    label: "Services",
    href: "/services",
    isRoute: true,
    submenu: [
      { label: "Website Development", href: "/services/website-development", isRoute: true },
      { label: "UI/UX Design", href: "/services/ui-ux-design", isRoute: true },
      { label: "E-Commerce", href: "/services/e-commerce", isRoute: true },
      { label: "Web Applications", href: "/services/web-applications", isRoute: true },
      { label: "Mobile Apps", href: "/services/mobile-apps", isRoute: true },
      { label: "Branding", href: "/services/branding", isRoute: true },
      { label: "SEO", href: "/services/seo", isRoute: true },
      { label: "Digital Marketing", href: "/services/digital-marketing", isRoute: true },
      { label: "Website Maintenance", href: "/services/website-maintenance", isRoute: true },
    ],
  },
  // {
  //   label: "Resources",
  //   href: "/resources",
  //   isRoute: true,
  //   submenu: [
  //     { label: "Guides", href: "/resources/guides", isRoute: true },
  //     { label: "FAQs", href: "#faqs" },
  //   ],
  // },
  { label: "Contact", href: "/contact", isRoute: true },
];

/**
 * Footer-only links that appear after primary navigation.
 * Kept empty since Contact now lives in navLinks; retained for
 * backwards compatibility with anything importing it directly.
 */
export const footerExtraLinks: NavLink[] = [];

/**
 * Combined navigation for footer (primary + extra).
 * Footer links are flattened (no submenus) since footers typically
 * list flat link lists rather than dropdowns.
 */
export const footerNavLinks: NavLink[] = [...navLinks, ...footerExtraLinks].map(
  ({ label, href, isRoute }) => ({ label, href, isRoute }),
);

/**
 * Legal/utility links for footer bottom
 */
export const legalLinks: NavLink[] = [
  { label: "Terms of Service", href: "/terms-of-service", isRoute: true },
  { label: "Privacy Policy", href: "/privacy-policy", isRoute: true },
];

/**
 * Social media links
 */
export const socialLinks = [
  { label: "Twitter / X", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
];