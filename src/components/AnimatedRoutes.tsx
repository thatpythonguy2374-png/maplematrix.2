import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import ScrollToTop from "./ScrollToTop";
import Index from "@/pages/Index";
import { lazy } from "react";

const AnimatedRoutes = () => {
  const location = useLocation();
  const Contact = lazy(() => import("@/pages/Contact"));
  const StartProject = lazy(() => import("@/pages/StartYourProject"));
  const About = lazy(() => import("@/pages/About"));
  const Services = lazy(() => import("@/pages/Services"));
  const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
  const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
  const NotFound = lazy(() => import("@/pages/NotFound"));
  const ECommerce = lazy(() => import("@/pages/services/ECommerce"));
  const WebApplications = lazy(
    () => import("@/pages/services/WebApplications"),
  );
  const MobileApps = lazy(() => import("@/pages/services/MobileApps"));
  const Branding = lazy(() => import("@/pages/services/Branding"));
  const Seo = lazy(() => import("@/pages/services/Seo"));
  const WebsiteMaintenance = lazy(
    () => import("@/pages/services/WebsiteMaintenance"),
  );
  const DigitalMarketing = lazy(
    () => import("@/pages/services/DigitalMarketing"),
  );
  const UiUxDesign = lazy(() => import("@/pages/services/UiUxDesign"));
  const WebsiteDevelopment = lazy(
    () => import("@/pages/services/WebsiteDevelopment"),
  );

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Index />
              </PageTransition>
            }
          />
          <Route path="/start-project" element={<StartProject />} />
          <Route
            path="/contact"
            element={
              <PageTransition>
                <Contact />
              </PageTransition>
            }
          />
          <Route
            path="/services/website-development"
            element={
              <PageTransition>
                <WebsiteDevelopment />
              </PageTransition>
            }
          />

          <Route
            path="/services/ui-ux-design"
            element={
              <PageTransition>
                <UiUxDesign />
              </PageTransition>
            }
          />

          <Route
            path="/services/e-commerce"
            element={
              <PageTransition>
                <ECommerce />
              </PageTransition>
            }
          />

          <Route
            path="/services/web-applications"
            element={
              <PageTransition>
                <WebApplications />
              </PageTransition>
            }
          />

          <Route
            path="/services/mobile-apps"
            element={
              <PageTransition>
                <MobileApps />
              </PageTransition>
            }
          />

          <Route
            path="/services/branding"
            element={
              <PageTransition>
                <Branding />
              </PageTransition>
            }
          />

          <Route
            path="/services/seo"
            element={
              <PageTransition>
                <Seo />
              </PageTransition>
            }
          />

          <Route
            path="/services/digital-marketing"
            element={
              <PageTransition>
                <DigitalMarketing />
              </PageTransition>
            }
          />

          <Route
            path="/services/website-maintenance"
            element={
              <PageTransition>
                <WebsiteMaintenance />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <About />
              </PageTransition>
            }
          />
          <Route
            path="/services"
            element={
              <PageTransition>
                <Services />
              </PageTransition>
            }
          />
          <Route
            path="/terms-of-service"
            element={
              <PageTransition>
                <TermsOfService />
              </PageTransition>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <PageTransition>
                <PrivacyPolicy />
              </PageTransition>
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default AnimatedRoutes;
