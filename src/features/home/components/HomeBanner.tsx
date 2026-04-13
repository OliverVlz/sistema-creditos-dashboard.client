import bannerImage from '../utils/Home.jpg';

export default function HomeBanner() {
  return (
    <div className="relative h-full min-h-[220px] w-full overflow-hidden rounded-lg shadow-lg sm:rounded-xl sm:shadow-xl lg:rounded-2xl">
      <img
        src={bannerImage}
        alt="Inversiones Murillo Martínez"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
