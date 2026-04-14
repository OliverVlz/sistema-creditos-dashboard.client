import bannerImage from '../utils/Home.jpg';

export default function HomeBanner() {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white shadow-lg sm:aspect-auto sm:h-full sm:min-h-[220px] sm:rounded-xl sm:shadow-xl lg:rounded-2xl">
      <img
        src={bannerImage}
        alt="Inversiones Murillo Martínez"
        className="absolute inset-0 h-full w-full object-contain sm:object-cover"
      />
    </div>
  );
}
