import ejercitoNacional from '../../../../../assets_landing/images/landing/ejercito-nacional.png';
import armadaNacional from '../../../../../assets_landing/images/landing/armada-nacional.png';
import fuerzaAeroespacial from '../../../../../assets_landing/images/landing/fuerza-aeroespacial.png';
import policiaNacional from '../../../../../assets_landing/images/landing/policia-nacional.png';
import comandoGeneral from '../../../../../assets_landing/images/landing/comando-general.png';
import { useRef, useEffect } from 'react';
import './divider.css';

const logos = [
  { src: ejercitoNacional, alt: 'Ejército Nacional', accent: 'text-orange-600' },
  { src: armadaNacional, alt: 'Armada Nacional', accent: 'text-blue-600' },
  { src: fuerzaAeroespacial, alt: 'Fuerza Aeroespacial', accent: 'text-sky-600' },
  { src: policiaNacional, alt: 'Policía Nacional', accent: 'text-red-600' },
  { src: comandoGeneral, alt: 'Comando General', accent: 'text-green-600' },
];

function LogoCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="group relative h-full w-full">
      <div className="h-full w-full rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl">
        <img
          src={src}
          alt={alt}
          className="mx-auto h-20 w-auto object-contain transition-all duration-300"
        />
      </div>
    </div>
  );
}

type Props = {
  durationSec?: number;
  className?: string;
};

export default function Divider({ durationSec = 5, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const firstItem = container.querySelector('.carousel-item') as HTMLElement;
    if (!firstItem) return;

    const itemWidth = firstItem.offsetWidth;
    const gap = 16;
    const stepWidth = itemWidth + gap;
    
    let currentTransform = 0;
    const totalItems = logos.length;
    const maxTransform = -(stepWidth * totalItems);

    function animate() {
      if (isPausedRef.current || !container) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const speed = stepWidth / (durationSec * 60);
      currentTransform -= speed;

      if (currentTransform <= maxTransform) {
        currentTransform = 0;
      }

      container.style.transform = `translateX(${currentTransform}px)`;
      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    const handleMouseEnter = () => { isPausedRef.current = true; };
    const handleMouseLeave = () => { isPausedRef.current = false; };

    const parentElement = container.parentElement;
    if (parentElement) {
      parentElement.addEventListener('mouseenter', handleMouseEnter);
      parentElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (parentElement) {
        parentElement.removeEventListener('mouseenter', handleMouseEnter);
        parentElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [durationSec]);

  return (
    <section
      aria-label="Carrusel de instituciones"
      className={`w-full bg-global-11 py-12 md:py-12 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-[#DEE5ED]/40 p-8 shadow-md backdrop-blur-md md:p-12">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
            <div className="absolute right-20 -translate-y-1/2 h-40 w-40 rounded-full bg-blue-400/80 blur-xl" />
            <div className="absolute top-2/3 translate-x-1/2 h-40 w-40 rounded-full bg-orange-400/60 blur-xl" />
          </div>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent" />

          <div className="carousel-mask pause-on-hover">
            <div 
              ref={containerRef}
              className="flex items-stretch gap-4 will-change-transform"
            >
                             {[...logos, ...logos, ...logos].map((item, idx) => (
                 <div key={idx} className="carousel-item flex-none basis-1/2 md:basis-1/4 min-w-0">
                   <LogoCard src={item.src} alt={item.alt} />
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
