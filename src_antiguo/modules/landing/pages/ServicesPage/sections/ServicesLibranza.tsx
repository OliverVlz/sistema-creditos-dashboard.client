import Button from '../../../../../components/ui/Button';
import solicitaImage from '../../../../../assets/images/landing/solicita.svg';
import calendarImage from '../../../../../assets/images/landing/calendar1.svg';
import desembolsoImage from '../../../../../assets/images/landing/desembolso.svg';
import mesadaImage from '../../../../../assets/images/landing/mesada1.svg';

export default function ServicesLibranza() {
  return (
    <section className="w-full bg-global-11 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-normal text-global-12 mb-8">
          Crédito por libranza
          </h1>
          <p className="text-base text-gray-700 mb-18 max-w-4xl mx-auto leading-relaxed">
            Si eres pensionado o activo de las Fuerzas Militares o la Policía Nacional, estás en el lugar correcto: gestionamos tu crédito por libranza con asesoría dedicada, cero costos ocultos y respuesta en menos de 24 horas. Aunque no tengas historial crediticio, puedes solicitar en línea 100 % digital con total seguridad y transparencia.
          </p>

          <div className="grid max-w-5xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-18">
            <div className="flex flex-col items-center text-center">
              <img
                src={solicitaImage}
                alt="Solicitar crédito"
                className="w-16 h-16 mb-4"
              />
              <p className="text-sm text-gray-700 font-medium">
                Solicita tu crédito desde $1'000.000 y hasta $5'000.000
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <img
                src={calendarImage}
                alt="Plazos"
                className="w-16 h-16 mb-4"
              />
              <p className="text-sm text-gray-700 font-medium">
                Plazos hasta 36 meses
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <img
                src={desembolsoImage}
                alt="Proceso virtual"
                className="w-16 h-16 mb-4"
              />
              <p className="text-sm text-gray-700 font-medium">
                Proceso 100% virtual con desembolso ágil
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <img
                src={mesadaImage}
                alt="Descuento mensual"
                className="w-16 h-16 mb-4"
              />
              <p className="text-sm text-gray-700 font-medium">
                Descuento mensual a través de nómina o mesada pensional
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

