import misionImage from '../../../../../assets_landing/images/landing/mision1.png';
import visionImage from '../../../../../assets_landing/images/landing/vision1.png';

export default function MissionVision() {
  return (
    <>
      {/* ==================== SECCIÓN MISIÓN ==================== */}
      <section className="w-full bg-white py-20 md:py-25 relative overflow-hidden">
        {/* === ELEMENTOS DECORATIVOS DE FONDO === */}
        <div className="absolute inset-0 opacity-4">
          {/* Círculo principal grande */}
          <div className="absolute top-30 right-30 w-10 h-10 bg-orange-500 rounded-full shadow-lg"></div>
          {/* Círculo pequeño acento */}
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* === TEXTO MISIÓN - IZQUIERDA === */}
            <div className="text-center lg:text-left">
              <h3 className="font-plus-jakarta text-2xl md:text-5xl font-bold text-gray-900 mb-8">
                Nuestra Misión
              </h3>

              <div className="text-base md:text-base text-gray-700 leading-relaxed space-y-4 bg-white/50 backdrop-blur-sm p-6 rounded-lg border-l-4 border-[#F07F44]">
                <p>
                  Brindar soluciones financieras responsables y accesibles mediante créditos por libranza para diferentes funcionarios del sector público, para promover y apoyar el cumplimiento de metas personales y familiares.
                </p>
                <p>
                  Esta compañía también contribuirá con el desarrollo económico nacional al participar de manera activa en sectores económicos como el mercado de valores, la producción y comercialización de bienes y servicios y la representación y agenciamiento de firmas nacionales e internacionales.
                </p>
                <p>
                  La compañía operará bajo los más altos estándares de integridad y con valores éticos y legales que garanticen transparencia, seguridad y confianza en todas sus operaciones.
                </p>
              </div>
            </div>

            {/* Imagen Misión - Derecha */}
            <div className="flex justify-center lg:justify-end relative">
              {/* === ELEMENTOS DECORATIVOS FLOTANTES === */}
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-100 rounded-full opacity-60 shadow-md"></div>
              <div className="absolute bottom-1/4 -right-6 w-3 h-3 bg-yellow-200 rounded-full opacity-50"></div>

              {/* === Sombra sutil naranja === */}
              <div className="absolute inset-0 bg-orange-400/20 rounded-full transform translate-x-7 translate-y-1 scale-102 opacity-50"></div>

              {/* === Imagen principal === */}
              <div className="transform hover:scale-105 transition-transform duration-300 relative z-10">
                <img
                  src={misionImage}
                  alt="Nuestra Misión"
                  className="w-full max-w-md h-auto rounded-full shadow-2xl border-4 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECCIÓN VISIÓN ==================== */}
      <section className="w-full bg-global-11 py-20 md:pt-20 md:pb-40 relative overflow-hidden">
        {/* === ELEMENTOS DECORATIVOS DE FONDO === */}
        <div className="absolute inset-0 opacity-5">
          {/* Círculo secundario mediano */}
          <div className="absolute bottom-10 right-20 w-20 h-20 bg-orange-600 rounded-full shadow-md"></div>
          {/* Círculo pequeño acento */}
          <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-yellow-500 rounded-full shadow-sm"></div>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* === IMAGEN VISIÓN - IZQUIERDA === */}
            <div className="flex justify-center lg:justify-start relative">
              {/* === Sombra sutil naranja cuadrada === */}
              <div className="absolute inset-0 bg-orange-400/20 rounded-lg transform -translate-x-7 translate-y-1 scale-102 opacity-50"></div>

              {/* === Imagen principal === */}
              <div className="transform hover:scale-102 transition-transform duration-300 relative z-10">
                <img
                  src={visionImage}
                  alt="Nuestra Visión"
                  className="w-full max-w-md h-auto rounded-lg shadow-2xl border-4 border-white"
                />
              </div>
            </div>

            {/* === TEXTO VISIÓN - DERECHA === */}
            <div className="text-center lg:text-right">
              <h3 className="font-plus-jakarta text-2xl md:text-5xl font-bold text-gray-900 mb-8">
                Nuestra Visión
              </h3>

              <div className="text-base md:text-base text-gray-700 leading-relaxed space-y-4 bg-white/30 backdrop-blur-sm p-6 rounded-lg border-r-4 border-[#F07F44]">
                <p>
                  Para 2030 Inversiones Murillo Martínez será reconocida como empresa líder y competitiva en el mercado de créditos por libranza para funcionario públicos, en el ámbito nacional.
                </p>
                <p>
                  Durante este quinquenio, Inversiones Murillo Martínez se destacará por su solidez financiera, innovación en servicios, calidad humana y compromiso con el crecimiento económico de sus clientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

