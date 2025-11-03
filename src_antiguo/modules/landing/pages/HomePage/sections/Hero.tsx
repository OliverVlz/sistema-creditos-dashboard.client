import Button from '../../../../../components/ui/Button';
import Section from '../../../../../components/layout/Section';
import heroNavalOfficer from '../../../../../assets/images/landing/hero-naval-officer1.png';

export default function Hero() {
  return (
    <section className="w-full bg-white">
      <Section className="py-15 md:py-20">
        <div className="flex flex-col lg:flex-row items-start justify-center gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <h1 className="sm:text-5xl md:text-[47px] font-extrabold leading-tight uppercase text-global-10">
              Préstamos por libranza, 100% digitales y sin complicaciones.
            </h1>
            
            <p className="mt-6 text-base leading-relaxed text-global-6">
              Especialistas en créditos por libranza para pensionados y activos de las Fuerzas Militares y la Policía Nacional: desde hace más de 10 años hacemos que tu solicitud sea transparente y segura, sin costos ocultos y con acompañamiento paso a paso hasta el desembolso.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button 
                variant="primary" 
                size="large"
                className="w-full sm:w-auto font-semibold"
              >
                Simula tu préstamo
              </Button>
              
              <Button
                variant="outline"
                size="large"
                className="w-full sm:w-auto"
              >
                Contáctanos
              </Button>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="flex-1 max-w-sm">
            <img 
              src={heroNavalOfficer} 
              alt="Naval Officer" 
              className="w-full h-auto rounded-2xl shadow-xl" 
            />
          </div>
        </div>
      </Section>
    </section>
  );
}

