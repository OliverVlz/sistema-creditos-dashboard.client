import bannerImage from '../utils/Home.jpg';

/**
 * Banner de inicio
 * Solo muestra la imagen, sin textos ni overlays por encima
 */
export default function HomeBanner() {
  return (
    <div className="relative h-full min-h-[420px] lg:min-h-[560px] rounded-2xl overflow-hidden shadow-xl">
      <img
        src={bannerImage}
        alt="Banner Presta Ya"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

