import React from 'react';
import Button from '../../../../../components/ui/Button';
import fuerzaAereaImage from '../../../../../assets/images/landing/aereo1.png';

export const FuerzaAereaHero: React.FC = () => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-15 md:py-20">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={fuerzaAereaImage}
                alt="Escudo de la Fuerza Aeroespacial"
                className="w-16 h-16 md:w-20 md:h-20 rounded-lg shadow-lg"
              />
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
                  Fuerza Aeroespacial
                </h1>
                <p className="text-orange-600 text-lg">Dominio del Cielo Colombiano</p>
              </div>
            </div>

            <p className="text-base pr-12 leading-relaxed text-gray-600">
              Como parte de las Fuerzas Armadas de Colombia, puedes acceder a un crédito por libranza hecho a tu medida. Tramítalo desde donde estés, con asesoría personalizada y sin preocuparte por los pagos: las cuotas se descuentan automáticamente de tu nómina.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="large"
                className="w-full sm:w-auto font-semibold"
              >
                Solicitar Crédito
              </Button>

              <Button
                variant="outline"
                size="large"
                className="w-full sm:w-auto"
              >
                Conocer Más
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex items-right flex-1 max-w-md">
            <div className="relative">
              <div className="relative bg-gradient-to-br from-[#FF8546]/10 via-[#A855F7]/10 to-[#4264A9]/10 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
                <img
                  src={fuerzaAereaImage}
                  alt="Fuerza Aeroespacial Colombiana"
                  className="w-full h-auto rounded-2xl shadow-lg object-contain"
                />

                <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-[#FF8546]">250+</div>
                  <div className="text-sm text-gray-600">Aeronaves</div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-[#FF8546]">12K+</div>
                  <div className="text-sm text-gray-600">Aviadores</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
