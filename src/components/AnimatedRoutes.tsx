import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import ScrollToTop from "./ScrollToTop";
import Index from "@/pages/Index";
import Contact from "@/pages/Contact";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import NotFound from "@/pages/NotFound";
import StartProject from "@/pages/StartYourProject";
import About from "@/pages/About";
import Services from "@/pages/Services";
import WebsiteDevelopment from "@/pages/services/WebsiteDevelopment";
import UiUxDesign from "@/pages/services/UiUxDesign";
import ECommerce from "@/pages/services/ECommerce";
import WebApplications from "@/pages/services/WebApplications";
import MobileApps from "@/pages/services/MobileApps";
import Branding from "@/pages/services/Branding";
import Seo from "@/pages/services/Seo";
import DigitalMarketing from "@/pages/services/DigitalMarketing";
import WebsiteMaintenance from "@/pages/services/WebsiteMaintenance";

const AnimatedRoutes = () => {
  const location = useLocation();

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
