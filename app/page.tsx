import dynamic from "next/dynamic";
import Preloader from "@/components/Preloader";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Companies from "@/components/Companies";
import Projects from "@/components/Projects";
import Research from "@/components/Research";
import Venues from "@/components/Venues";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AssistantFab from "@/components/AssistantFab";
import ScrollTop from "@/components/ScrollTop";

const GlobalBackdrop = dynamic(() => import("@/components/GlobalBackdrop"), { ssr: false });

export default function Page() {
  return (
    <main className="relative min-h-screen bg-transparent font-display text-slate-900">
      <ScrollTop />
      <GlobalBackdrop />
      <Preloader />
      <CursorGlow />
      <Navbar />
      <Hero />
      <Companies />
      <Projects />
      <Research />
      <Venues />
      <Timeline />
      <Contact />
      <Footer />
      <AssistantFab />
    </main>
  );
}
