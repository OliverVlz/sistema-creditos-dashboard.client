import bannerImage from '../utils/Home.jpg';

/**
 * Banner de inicio
 * Solo muestra la imagen, sin textos ni overlays por encima
 */
export default function HomeBanner() {
  return (
    <img
      src={bannerImage}
      alt="Banner Presta Ya"
      className="w-full h-auto max-h-[250px] xs:max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[calc(100vh-180px)] object-cover rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl"
    />
  );
}

