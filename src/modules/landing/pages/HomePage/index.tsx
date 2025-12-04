import { useEffect } from 'react';
import Hero from './sections/Hero';
import { CreditSimulation } from './sections/CreditSimulation';
import { ClientsSection } from './sections/ClientsSection';
import CreditProcess from './sections/CreditProcess';
import Faq from './sections/Faq';
import ContactSection from './sections/ContactSection';

export default function HomePage() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

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

