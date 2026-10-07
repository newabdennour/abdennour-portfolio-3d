import dynamic from "next/dynamic";
import Preloader from "@/components/Preloader";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const GlobalBackdrop = dynamic(() => import("@/components/GlobalBackdrop"), { ssr: false });

export default function Page() {
  return (
    <main className="relative min-h-screen bg-transparent font-display text-slate-900">
      <GlobalBackdrop />
      <Preloader />
      <CursorGlow />
      <Navbar />
      <Hero />
      <Projects />
      <About />
      <Timeline />
      <Contact />
      <Footer />
    </main>
  );
}
