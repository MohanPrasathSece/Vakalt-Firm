import Navbar from "@/components/Navbar";
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
      <Navbar />
      <Hero />
      <Stats />
      <Ticker />
      <ToolsPreview />
      <PracticeAreas />
      <BrandStory />
      <ContactCTA />
      <Footer />
    </main>
  );
};

export default Index;
