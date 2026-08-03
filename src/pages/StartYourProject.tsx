import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

export default function StartProject() {
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("start-project", {
        body: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          website: formData.website,
          description: formData.description,

          projectType: null,
          budget: null,
          timeline: null,
        },
      });

      if (error) {
        console.error(error);
        alert("Something went wrong.");
        return;
      }

      console.log(data);

      alert("Project enquiry submitted successfully!");

      setFormData({
        fullName: "",
        company: "",
        email: "",
        phone: "",
        website: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert("Unable to submit the form.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <section className="pt-32 sm:pt-40 pb-8 sm:pb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>

                <span className="text-sm text-primary">
                  Let's build something amazing together
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Start Your{" "}
                <span className="text-primary font-lora">Project</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Tell us about your business, your vision and your goals. We'll
                prepare a tailored proposal and get back to you within one
                business day.
              </p>
            </div>
          </div>
        </section>
        <section className="pb-20 sm:pb-32 relative -mt-2">
          <div className="container mx-auto px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              {/* backdrop-blur-xl + shadow-2xl are desktop-only now — the frosted-glass
                  form card is the heaviest single element on this page for mobile paint */}
              <div className="lg:col-span-2 rounded-3xl border border-primary/20 bg-white/[0.04] md:backdrop-blur-xl shadow-lg md:shadow-2xl p-6 sm:p-8 md:p-10 space-y-8 sm:space-y-10 relative overflow-hidden">
                {/* Personal Information */}

                <div className="space-y-6">
                  {/* Decorative glow hidden on mobile: large blur-3xl radius is expensive
                      and barely visible above a form on a small screen anyway */}
                  <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                    Personal Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>

                      <Input
                        className="mt-2"
                        id="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fullName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="company">Company Name</Label>

                      <Input
                        className="mt-2"
                        id="company"
                        placeholder="Maple Matrix"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            company: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}

                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                    Contact Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email *</Label>

                      <Input
                        className="mt-2"
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>

                      <Input
                        className="mt-2"
                        id="phone"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Website */}

                <div>
                  <Label htmlFor="website">Website</Label>

                  <Input
                    className="mt-2"
                    id="website"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        website: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Project Description */}

                <div>
                  <Label htmlFor="description">
                    Tell us about your project
                  </Label>

                  <Textarea
                    className="mt-2 min-h-[180px]"
                    id="description"
                    rows={8}
                    placeholder="Describe your project, your goals, target audience, features you need..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Submit */}

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full h-14 text-base font-semibold mt-4">
                  {loading ? "Submitting..." : "Start My Project"}
                </Button>
              </div>
            </form>
            <div className="max-w-4xl mx-auto mt-8 sm:mt-10">
              <div className="rounded-3xl border border-primary/20 bg-white/[0.04] md:backdrop-blur-xl shadow-lg md:shadow-2xl p-6 sm:p-8 relative overflow-hidden">
                {/* Glow — desktop only, same reasoning as above */}
                <div className="hidden sm:block absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-semibold mb-2">
                    What Happens Next?
                  </h3>

                  <p className="text-muted-foreground mb-6 sm:mb-8">
                    Once you submit your enquiry, here's exactly what you can
                    expect.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold">
                        1
                      </div>

                      <div>
                        <h4 className="font-semibold">
                          We Review Your Requirements
                        </h4>

                        <p className="text-sm text-muted-foreground mt-1">
                          Our team carefully reviews your project goals,
                          features and business requirements.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold">
                        2
                      </div>

                      <div>
                        <h4 className="font-semibold">Discovery Call</h4>

                        <p className="text-sm text-muted-foreground mt-1">
                          We schedule a call to understand your vision and
                          answer your questions.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold">
                        3
                      </div>

                      <div>
                        <h4 className="font-semibold">Proposal & Timeline</h4>

                        <p className="text-sm text-muted-foreground mt-1">
                          You'll receive a detailed proposal, timeline and
                          pricing tailored to your project.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold">
                        4
                      </div>

                      <div>
                        <h4 className="font-semibold">Project Kickoff</h4>

                        <p className="text-sm text-muted-foreground mt-1">
                          Once approved, we begin designing and building your
                          project with regular updates.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 sm:mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Average response time
                      </p>

                      <p className="text-xl font-semibold text-primary">
                        Within 1 Business Day
                      </p>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      No obligation • Free consultation • Transparent pricing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
