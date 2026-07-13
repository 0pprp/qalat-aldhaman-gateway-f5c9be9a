import { LanguageProvider } from '@/contexts/LanguageContext';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import OurProducts from '@/components/landing/OurProducts';
import ShowroomSection from '@/components/landing/ShowroomSection';
import About from '@/components/landing/About';
import Values from '@/components/landing/Values';
import Vision from '@/components/landing/Vision';
import Challenges from '@/components/landing/Challenges';
import Branches from '@/components/landing/Branches';
import WhyUs from '@/components/landing/WhyUs';
import Footer from '@/components/landing/Footer';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <OurProducts />
          <ShowroomSection />
          <About />
          <Values />
          <Vision />
          <Challenges />
          <Branches />
          <WhyUs />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
