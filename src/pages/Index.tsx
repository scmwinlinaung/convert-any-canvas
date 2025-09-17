import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FormatCategories } from "@/components/FormatCategories";
import { ImageConverter } from "@/components/ImageConverter";
import { VideoCompressor } from "@/components/VideoCompressor";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FormatCategories />
        <ImageConverter />
        <VideoCompressor />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
