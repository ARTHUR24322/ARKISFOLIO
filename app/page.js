import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import SolutionsSection from '../components/SolutionsSection';
import ProcessSection from '../components/ProcessSection';
import SkillsSection from '../components/SkillsSection';
import RealisationsSection from '../components/RealisationsSection';
import ShopSection from '../components/ShopSection';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import LenisProvider from '../components/LenisProvider';

export default function Home() {
    return (
        <main>
            <LenisProvider />
            <Navbar />
            <HeroSection />
            <ServicesSection />
            <RealisationsSection />
            <ShopSection />
            <SolutionsSection />
            <ProcessSection />
            <SkillsSection />
            <ContactForm />
            <Footer />
        </main>
    );
}
