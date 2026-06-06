import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import SolutionsSection from '../components/SolutionsSection';
import ProcessSection from '../components/ProcessSection';
import SkillsSection from '../components/SkillsSection';
import RealisationsSection from '../components/RealisationsSection';
import AppsSection from '../components/AppsSection';
import ShopSection from '../components/ShopSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import ExperienceSection from '../components/ExperienceSection';
import ContactForm from '../components/ContactForm';
import NewsletterSection from '../components/NewsletterSection';
import Footer from '../components/Footer';
import LenisProvider from '../components/LenisProvider';

export default function Home() {
    return (
        <main>
            <LenisProvider />
            <Navbar />
            <HeroSection />
            <ServicesSection />
            <AppsSection />
            <RealisationsSection />
            <ShopSection />
            <SolutionsSection />
            <ProcessSection />
            {/* <TestimonialsSection /> - Masqué temporairement car pas d'avis pour le moment */}
            <SkillsSection />
            <ExperienceSection />
            <FAQSection />
            <ContactForm />
            <NewsletterSection />
            <Footer />
        </main>
    );
}
