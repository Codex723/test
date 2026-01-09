import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AmenitiesSection from "@/components/AmenitiesSection";
import RoomsSection from "@/components/RoomsSection";
import AbujaSection from "@/components/AbujaSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AmenitiesSection />
        <RoomsSection />
        <AbujaSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
