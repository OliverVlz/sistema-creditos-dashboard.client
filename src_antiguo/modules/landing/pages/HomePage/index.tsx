import Hero from './sections/Hero';
import { CreditSimulation } from './sections/CreditSimulation';
import { ClientsSection } from './sections/ClientsSection';
import CreditProcess from './sections/CreditProcess';
import Faq from './sections/Faq';
import ContactSection from './sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CreditSimulation />
      <ClientsSection />
      <CreditProcess />
      <ContactSection />
      <Faq />
    </>
  );
}

