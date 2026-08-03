import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header - Centered */}
            <div className="text-center mb-16">
              <p className="text-sm text-muted-foreground mb-4">
                Last updated — January 15, 2026
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                Terms & Conditions
              </h1>
            </div>

            {/* Content - Left aligned, readable width */}
            <div className="max-w-3xl mx-auto space-y-12">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using Maple Matrix's services, website, or any associated content (collectively, the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  2. Description of Service
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Maple Matrix provides online educational content, courses, and resources focused on AI prompt engineering and related skills. Our Service includes video lessons, written materials, community access, and other educational resources.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  3. User Accounts
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To access certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  4. Payment and Refunds
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Certain features of the Service require payment. All payments are processed securely through our payment providers. We offer a 30-day money-back guarantee for course purchases. Refund requests must be submitted within 30 days of purchase.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  5. Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content provided through the Service, including but not limited to text, graphics, logos, videos, and course materials, is the property of Maple Matrix or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  6. User Conduct
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree not to use the Service to: share account access with others; distribute course content without authorization; engage in any activity that interferes with or disrupts the Service; attempt to gain unauthorized access to any portion of the Service; or violate any applicable laws or regulations.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  7. Disclaimer of Warranties
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free. Your use of the Service is at your own risk.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  8. Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by law, Maple Matrix shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  9. Changes to Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes by posting a notice on our website. Your continued use of the Service after changes are posted constitutes your acceptance of the modified terms.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  10. Contact Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at legal@maplematrix.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
