import bannerImage from '../utils/Home.jpg';

/**
 * Banner de inicio
 * Solo muestra la imagen, sin textos ni overlays por encima
 */
export default function HomeBanner() {
  return (
    <div className="relative w-full h-auto max-h-[calc(100vh-180px)] rounded-2xl overflow-hidden shadow-xl">
      <img
        src={bannerImage}
        alt="Banner Presta Ya"
        className="w-full h-auto max-h-[calc(100vh-180px)] object-contain rounded-2xl"
      />
    </div>
  );
}

