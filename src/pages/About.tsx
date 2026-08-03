import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { ProjectButton } from "@/components/EnrollButton";
import {
  Clock3,
  Zap,
  SearchCheck,
  Smartphone,
  ShieldCheck,
  Headset,
  MessagesSquare,
  ClipboardList,
  Palette,
  Code2,
  Bug,
  Rocket,
} from "lucide-react";
import DotGridBackground from "@/components/ui/DotGridBackground";

export default function About() {
  const navigate = useNavigate();
  const reasons = [
    {
      icon: Clock3,
      title: "Quick Turnaround",
      description:
        "Our experienced web design and development team delivers fast turnaround times without compromising quality for your website, mobile app, or digital marketing needs.",
    },
    {
      icon: Zap,
      title: "Modern Technologies",
      description:
        "We build using React, Node.js, TypeScript, Supabase, cloud infrastructure, and other modern technologies that are scalable and future ready.",
    },
    {
      icon: Headset,
      title: "No Geek Speak",
      description:
        "Our project managers keep every client informed in plain, straightforward English. Our designers, developers, and marketers communicate clearly, so you always understand exactly where your project stands.",
    },
    {
      icon: SearchCheck,
      title: "SEO & Performance",
      description:
        "We design solutions grounded in a complete understanding of your requirements — assessing your needs and recommending the best technology fit for your business.",
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description:
        "Your website will look and perform beautifully across desktops, tablets, and smartphones for every visitor.",
    },
    {
      icon: ShieldCheck,
      title: "Reliable Support",
      description:
        "After launch, we continue supporting your website with updates, maintenance, and improvements as your business grows.",
    },
  ];
  const processSteps = [
    {
      number: "01",
      title: "Discovery & Consultation",
      description:
        "We understand your business goals, audience, and project requirements before planning the solution.",
      icon: MessagesSquare,
    },
    {
      number: "02",
      title: "Planning & Strategy",
      description:
        "A detailed roadmap, timeline, and technology stack are prepared to ensure a smooth development process.",
      icon: ClipboardList,
    },
    {
      number: "03",
      title: "UI/UX Design",
      description:
        "Our designers create clean, intuitive, and engaging user experiences that reflect your brand.",
      icon: Palette,
    },
    {
      number: "04",
      title: "Development",
      description:
        "Using modern technologies, we build scalable, secure, and high-performing digital solutions.",
      icon: Code2,
    },
    {
      number: "05",
      title: "Testing & Optimization",
      description:
        "Every project undergoes extensive testing for speed, security, responsiveness, and SEO.",
      icon: Bug,
    },
    {
      number: "06",
      title: "Launch & Support",
      description:
        "After launch, we continue providing updates, maintenance, and technical support whenever you need us.",
      icon: Rocket,
    },
  ];
  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground">
        <div className="hidden md:block">
          <DotGridBackground />
        </div>
        {/* ================= HERO ================= */}
        <section className="pt-32 sm:pt-40 pb-16 sm:pb-24">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
              {/* Left */}
              <div>
                <p className="text-primary uppercase tracking-[0.3em] text-sm font-semibold">
                  About Maple Matrix
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 sm:mt-6 leading-tight">
                  Where creativity
                  <br />
                  Meets with
                  <br />
                  Clean structure.
                </h1>

                <p className="mt-6 sm:mt-8 text-base sm:text-lg text-muted-foreground leading-7 sm:leading-8 max-w-xl">
                  Maple Matrix crafts premium digital experiences for startups
                  and growing businesses across Dwarka, New Delhi, Delhi NCR,
                  and all of India. We specialize in custom website design, web
                  application development, and UI/UX design built for
                  performance, and built to convert. Something exceptional is
                  always on the way.
                </p>
              </div>

              {/* Right */}
              <div>
                <div className="aspect-[4/3] rounded-3xl border border-border bg-secondary flex items-center justify-center">
                  IMAGE
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHO WE ARE ================= */}
        <section className="py-16 sm:py-28 bg-secondary/30">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-10 sm:gap-20 items-center">
              <div>
                <div className="aspect-square rounded-3xl border border-border bg-background flex items-center justify-center">
                  IMAGE
                </div>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">
                  Who We Are
                </h2>

                <div className="space-y-5 sm:space-y-6 text-muted-foreground leading-7 sm:leading-8">
                  <p>
                    Our commitment to exceptional web design, mobile app
                    development, and digital marketing services is rooted in one
                    belief, your satisfaction is the true measure of our
                    success. Helping you achieve your business goals whatever
                    they may be is what sets Maple Matrix apart from the
                    competition in a crowded digital landscape.
                  </p>

                  <p>
                    Maple Matrix is a full-service digital agency offering
                    end-to-end website solutions under one roof from custom
                    website design and web application development to hosting,
                    corporate email, mobile app development, and digital
                    marketing. Our team of experienced designers, developers,
                    and digital marketers takes pride in solving complex
                    technology challenges and supporting the needs that help
                    businesses across Gurugram and Delhi NCR reach their goals.
                  </p>

                  <p>
                    We're committed to complete client satisfaction across every
                    IT and digital service we provide no hassles, no
                    complications, and always delivered on time.
                  </p>
                  <p>
                    Contact us today, and let our team of talented developers
                    turn your ideas into a stunning, high-performing web
                    application that exceeds expectations. As a trusted web
                    application development company in Delhi, we specialize in
                    building custom, cutting-edge digital solutions that help
                    businesses scale. Don't settle for less when you can partner
                    with the best.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ================= MISSION / VISION ================= */}
        <section className="py-16 sm:py-28">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {/* backdrop-blur-xl is desktop-only: 3 stacked frosted-glass cards is a
                  heavy repeated GPU cost on mobile for a subtlety most users never notice */}
              <div className="group h-full rounded-3xl border border-primary/15 bg-white/5 md:backdrop-blur-xl p-6 sm:p-10 transition-transform duration-500 hover:-translate-y-2 hover:border-primary/60 md:hover:shadow-[0_0_35px_rgba(249,115,22,.25)] flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Our Mission
                </h3>

                <p className="text-muted-foreground leading-7 sm:leading-8">
                  Our mission is to build on our technical expertise in web
                  design, web application development, and digital marketing to
                  deliver measurable value for every Maple Matrix client. We
                  achieve this by focusing on the intersection of our clients'
                  evolving business and brand needs accelerating both business
                  growth and technological progress through custom, scalable
                  digital solutions.
                </p>
              </div>

              <div className="group h-full rounded-3xl border border-primary/15 bg-white/5 md:backdrop-blur-xl p-6 sm:p-10 transition-transform duration-500 hover:-translate-y-2 hover:border-primary/60 md:hover:shadow-[0_0_35px_rgba(249,115,22,.25)] flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Our Values
                </h3>

                <p className="text-muted-foreground leading-7 sm:leading-8">
                  At Maple Matrix, our values are the guiding principles that
                  shaped our founding and continue to inform how we conduct
                  business every day. They reflect our vision for the future of
                  digital innovation and define how we treat our clients,
                  partners, and each other with honesty, accountability, and a
                  commitment to excellence in every web design and development
                  project we deliver.
                </p>
              </div>
              <div className="group h-full rounded-3xl border border-primary/15 bg-white/5 md:backdrop-blur-xl p-6 sm:p-10 transition-transform duration-500 hover:-translate-y-2 hover:border-primary/60 md:hover:shadow-[0_0_35px_rgba(249,115,22,.25)] flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Our Approach & Culture
                </h3>

                <p className="text-muted-foreground leading-7 sm:leading-8">
                  Our commitment to exceptional web design, mobile app
                  development, and digital marketing services is rooted in one
                  belief: your satisfaction is the true measure of our success.
                  Helping you achieve your business goals whatever they may be
                  is what sets Maple Matrix apart from the competition in a
                  crowded digital landscape.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* ================= WHY CHOOSE US ================= */}
        <section className="py-16 sm:py-28 relative overflow-hidden">
          {/* Radial gradient wash — no filter/blur, cheap on mobile as-is */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,.06),transparent_70%)]" />

          <div className="container relative mx-auto max-w-7xl px-6">
            <div className="text-center mb-12 sm:mb-20">
              <p className="uppercase tracking-[0.35em] text-primary text-sm font-semibold">
                WHY CHOOSE MAPLE MATRIX
              </p>

              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold">
                6 Reasons To Partner With Us
              </h2>

              <div className="w-24 h-1 bg-primary rounded-full mx-auto mt-6 sm:mt-8" />
            </div>

            <div className="grid lg:grid-cols-3 gap-x-10 sm:gap-x-16 gap-y-10 sm:gap-y-16">
              {reasons.map((reason) => {
                const Icon = reason.icon;

                return (
                  <div
                    key={reason.title}
                    className="group flex items-start gap-5 sm:gap-6">
                    <div className="flex-shrink-0 transition-transform duration-300 md:group-hover:drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]">
                      <Icon
                        className="w-8 h-8 text-primary group-hover:text-white"
                        strokeWidth={1.7}
                      />
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
                        {reason.title}
                      </h3>

                      <p className="text-muted-foreground leading-7 sm:leading-8">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 sm:mt-20 text-center">
              <p className="text-base sm:text-lg text-muted-foreground">
                Ready to transform your business with a modern digital presence?
              </p>

              <div className="mt-6">
                <ProjectButton />
              </div>
            </div>
          </div>
        </section>

        {/* ================= PROCESS ================= */}

        <section className="py-16 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,.05),transparent_70%)]" />

          <div className="container relative mx-auto max-w-7xl px-6">
            <div className="text-center mb-12 sm:mb-20">
              <p className="uppercase tracking-[0.35em] text-primary text-sm font-semibold">
                HOW WE WORK
              </p>

              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold">
                Our Development Process
              </h2>

              <div className="w-24 h-1 bg-primary rounded-full mx-auto mt-6 sm:mt-8" />
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-10">
              {processSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="group rounded-3xl border border-primary/15 bg-white/5 md:backdrop-blur-xl p-6 sm:p-8 transition-transform duration-500 hover:-translate-y-2 hover:border-primary md:hover:shadow-[0_0_35px_rgba(249,115,22,.2)]">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                      <Icon
                        className="w-9 h-9 text-primary md:group-hover:drop-shadow-[0_0_10px_rgba(249,115,22,.8)] transition-transform"
                        strokeWidth={1.8}
                      />

                      <span className="text-4xl sm:text-5xl font-black text-primary/15">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                      {step.title}
                    </h3>

                    <p className="text-muted-foreground leading-7 sm:leading-8">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        {/* ================= TECHNOLOGIES ================= */}
        <section className="py-16 sm:py-28 bg-secondary/30">
          <div className="container mx-auto max-w-7xl px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16">
              Technologies We Use
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {[
                "React",
                "Node",
                "TypeScript",
                "Tailwind",
                "Supabase",
                "AWS",
              ].map((tech) => (
                <div
                  key={tech}
                  className="rounded-2xl border border-border h-24 sm:h-32 flex items-center justify-center font-semibold">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* ================= CTA ================= */}
        <section className="py-20 sm:py-32">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="rounded-3xl sm:rounded-[40px] border border-border p-8 sm:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                Web Designs That Speaks For Your Brand
              </h2>

              <p className="mt-6 sm:mt-8 text-muted-foreground max-w-2xl mx-auto leading-7 sm:leading-8">
                Write your CTA here...
              </p>

              <div className="mt-8 sm:mt-10 flex justify-center">
                <ProjectButton />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
