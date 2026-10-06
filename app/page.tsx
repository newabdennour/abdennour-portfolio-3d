import Preloader from "@/components/Preloader";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="relative min-h-screen bg-void">
      <Preloader />
      <CursorGlow />
      <Navbar />
      <Hero />
      <Marquee />
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(99,102,241,0.08),transparent_70%)]" />
        <Projects />
        <About />
        <Timeline />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
