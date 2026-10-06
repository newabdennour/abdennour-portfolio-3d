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
    <main className="relative min-h-screen bg-white font-display text-slate-900">
      <Preloader />
      <CursorGlow />
      <Navbar />
      <Hero />
      <Marquee />
      <Projects />
      <About />
      <Timeline />
      <Contact />
      <Footer />
    </main>
  );
}
