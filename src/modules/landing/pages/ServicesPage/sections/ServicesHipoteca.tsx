import Button from '../../../../../components/ui/Button';
import hogarImage from '../../../../../assets_landing/images/landing/hogar.svg';
import calendarImage from '../../../../../assets_landing/images/landing/calendar1.svg';
import escudoImage from '../../../../../assets_landing/images/landing/escudo.svg';
import docllaveImage from '../../../../../assets_landing/images/landing/docllave1.svg';


export default function ServicesHipoteca() {
  return (
    <section className="w-full bg-global-11 pb-20 md:pb-20 md:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-normal text-global-12 mb-8">
            Crédito con hipoteca
          </h1>
          <p className="text-base text-gray-700 mb-18 max-w-4xl mx-auto leading-relaxed">
            ¿Tienes vivienda propia o estás por comprar? Te ayudamos a obtener un crédito con hipoteca con montos superiores y plazos más largos, sin letras pequeñas y con preaprobación en menos de 24 horas. Te acompañamos en todo: avalúo, estudio de títulos, firma y desembolso, con un proceso claro, digital y seguro.
          </p>

          <div className="grid max-w-5xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-18">
            <div className="flex flex-col items-center text-center">
              <img
                src={hogarImage}
                alt="Solicitar crédito"
                className="w-16 h-16 mb-4"
              />
              <p className="text-sm text-gray-700 font-medium">
                Solicita tu crédito desde $5'000.000 y hasta $40'000.000
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <img
                src={calendarImage}
                alt="Plazos"
                className="w-16 h-16 mb-4"
              />
              <p className="text-sm text-gray-700 font-medium">
                Plazos hasta 5 años
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <img
                src={escudoImage}
                alt="Compra, sustitución y libre inversión con garantía"
                className="w-16 h-16 mb-4"
              />
              <p className="text-sm text-gray-700 font-medium">
                Compra, sustitución y libre inversión con garantía
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <img
                src={docllaveImage}
                alt="Firma y desembolso guiados"
                className="w-16 h-16 mb-4"
              />
              <p className="text-sm text-gray-700 font-medium">
                Firma y desembolso guiados
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="primary" size="large">
              Solicitar mi crédito
            </Button>
            <Button variant="outline" size="large">
              Simular crédito
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
