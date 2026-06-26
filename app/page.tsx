import { Breakdowns } from "@/components/Breakdowns";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { InstallSection } from "@/components/InstallSection";
import { Nav } from "@/components/Nav";
import { Pipeline } from "@/components/Pipeline";
import { Proof } from "@/components/Proof";
import { TokenTypes } from "@/components/TokenTypes";

export default function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <Proof />
      <Breakdowns />
      <Pipeline />
      <TokenTypes />
      <InstallSection />
      <FinalCta />
      <Footer />
    </>
  );
}
