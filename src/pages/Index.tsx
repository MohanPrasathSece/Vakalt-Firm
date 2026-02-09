import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import PracticeAreas from "@/components/PracticeAreas";
import Stats from "@/components/Stats";
import Ticker from "@/components/Ticker";
import BrandStory from "@/components/BrandStory";
import InsightsPreview from "@/components/InsightsPreview";
import ToolsPreview from "@/components/ToolsPreview";
import ContactCTA from "@/components/ContactCTA";

const Index = () => {
  return (
    <main>
      <SEO
        title="Litigation Reformed | Modern Legal Authority"
        description="Vakalt is a leading legal authority redefining litigation through strategic excellence, specialized expertise, and innovative legal technologies."
      />
      <Navbar />
      <Hero />
      <Stats />
      <Ticker />
      <PracticeAreas />
      <ToolsPreview />
      <BrandStory />
      <ContactCTA />
      <Footer />
    </main>
  );
};

export default Index;
