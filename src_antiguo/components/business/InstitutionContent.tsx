import React from 'react';
import Button from '../ui/Button';
import pesoIcon from '../../assets/images/decorative/peso.svg';
import calendarIcon from '../../assets/images/decorative/calendar.svg';
import timeIcon from '../../assets/images/decorative/time.svg';
import rayoIcon from '../../assets/images/decorative/rayo.svg';
import verifiedIcon from '../../assets/images/decorative/verified.svg';
import estrellaIcon from '../../assets/images/decorative/id-estrella.svg';

interface InstitutionContentProps {
  institutionName: string;
  userType: 'pensionado' | 'activo';
  onUserTypeChange: (type: 'pensionado' | 'activo') => void;
  isPolice?: boolean; // Para ajustar tasas para policía
}

export const InstitutionContent: React.FC<InstitutionContentProps> = ({
  institutionName,
  userType,
  onUserTypeChange,
  isPolice = false
}) => {
  const miniCards = [
    { icon: pesoIcon, title: 'Hasta', value: '5\'000.000', subtitle: 'Monto máximo' },
    { icon: calendarIcon, title: 'Plazo', value: '36 Meses', subtitle: 'Hasta 36 meses' },
    { icon: timeIcon, title: 'Respuesta', value: '1-24 Horas', subtitle: 'Tiempo de aprobación' },
    { icon: rayoIcon, title: 'Proceso', value: '100% Digital', subtitle: 'Completamente online' }
  ];

  const documentsPensionado = [
    { number: '1.', title: 'Cédula', description: 'Ambos respaldos' },
    { number: '2.', title: 'Comprobante de pago', description: 'De mesada pensional' }
  ];

  const documentsActivo = [
    { number: '1.', title: 'Cédula', description: 'Ambos respaldos' },
    { number: '2.', title: 'Comprobante de pago', description: 'De nómina mensual' },
    { number: '3.', title: 'Constancia de tiempo', description: 'De servicio activo' }
  ];

  const currentDocuments = userType === 'pensionado' ? documentsPensionado : documentsActivo;

  // Tasas específicas para policía (simulación)
  const rates = isPolice
    ? { desde: '1.84%', hasta: '1.89%', desdeEA: '24.45%', hastaEA: '25.17%' }
    : { desde: '1.86%', hasta: '1.91%', desdeEA: '24.75%', hastaEA: '25.49%' };

  return (
    <>
      {/* 4 Mini Cards */}
        <section id="mini-cards" className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {miniCards.map((card, index) => (
              <div key={index} className="bg-[#f5f5f5ea] rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-6">
                  {/* Icono SVG - 1/4 del espacio */}
                  <div className="flex-shrink-0 w-1/4">
                    <img
                      src={card.icon}
                      alt={card.title}
                      className="w-10 h-10 mx-auto"
                    />
                  </div>

                  {/* Texto - 3/4 del espacio */}
                  <div className="flex-1">
                    <div className="text-sm text-global-6">{card.title}</div>
                    <div className="text-xl font-bold text-[#FF8546]">{card.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      {/* Sección de Documentos */}
        <section id="documents" className="max-w-5xl mx-auto py-16">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">

            {/* Botones para cambiar entre pensionado/activo */}
            <div className="flex justify-center mb-14">
              <div className="flex bg-gray-50 shadow-md rounded-xl p-2">
                <button
                  onClick={() => onUserTypeChange('pensionado')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-100 flex items-center gap-2 cursor-pointer ${
                    userType === 'pensionado'
                      ? 'bg-[#FF8546] text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <img src={verifiedIcon} alt="Verified" className={`w-5 h-5 ${userType === 'pensionado' ? '' : 'filter brightness-0'}`} />
                  Pensionados
                </button>
                <button
                  onClick={() => onUserTypeChange('activo')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    userType === 'activo'
                      ? 'bg-[#FF8546] text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <img src={estrellaIcon} alt="Estrella" className={`w-5 h-5 ${userType === 'activo' ? 'filter brightness-0 invert' : 'filter brightness-0'}`} />
                  Personal Activo
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Documentos Necesarios */}
              <div className="flex flex-col min-h-[400px]">
                <div>
                  <h3 className="text-xl font-semibold text-global-12 mb-6">
                    <span className="underline decoration-[#FF8546] decoration-2 underline-offset-5">Documentos necesarios</span>
                  </h3>
                  <div className="space-y-4">
                    {currentDocuments.map((doc, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <span className="text-[#FF8546] font-bold text-lg">{doc.number}</span>
                        <div>
                          <h4 className="font-semibold text-global-12">{doc.title}</h4>
                          <p className="text-global-6 text-sm">{doc.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-auto pt-8">
                  <a href="#" className="text-global-6 text-sm block cursor-pointer">
                    ¿Tienes dudas? <span className="text-[#0076FF]">contáctanos ahora</span>
                  </a>
                </div>
              </div>

              {/* Formato de Entrega */}
              <div>
                <h3 className="text-xl font-semibold text-global-12 mb-6">
                  Formato de entrega
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-global-12 mb-2">Cédula</h4>
                    <ul className="text-sm text-global-6 space-y-1">
                      <li>• Debe ser legible y nítida por ambos respaldos</li>
                      <li>• Debe ir en formato PDF</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-global-12 mb-2">
                      Comprobante de pago de {userType === 'pensionado' ? 'mesada' : 'nómina'} 
                    </h4>
                    <ul className="text-sm text-global-6 space-y-1">
                      <li>• Debe ser legible y no más antiguo de los últimos dos meses</li>
                      <li>• Debe ir en formato PDF</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-[#FF8546]">
                    <h4 className="font-semibold text-global-12 mb-2">Archivo comprimido</h4>
                    <p className="text-sm text-global-6">
                      Ambos documentos PDF, cédula y comprobante de pago de {userType === 'pensionado' ? 'mesada ' : 'nómina '} 
                      deben ser subidos a la plataforma en un solo archivo comprimido (.zip o .rar)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Sección de Tasas y Tarifas */}  
        <section id="rates-and-fees" className="max-w-5xl mx-auto pt-12 pb-10">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-global-12 mb-8 text-center">
              Tasas y Tarifas
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8 text-center">
              {/* Columna 1 - Desde */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-global-12 mb-4">Desde</h3>
                <div className="text-4xl font-bold text-[#FF8546] mb-2">{rates.desde}</div>
                <div className="text-global-6">Mes vencido</div>
                <div className="text-sm text-global-6 mt-2">({rates.desdeEA}% Efectiva Anual)</div>
              </div>

              {/* Columna 2 - Hasta */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-global-12 mb-4">Hasta</h3>
                <div className="text-4xl font-bold text-[#FF8546] mb-2">{rates.hasta}</div>
                <div className="text-global-6">Mes vencido</div>
                <div className="text-sm text-global-6 mt-2">({rates.hastaEA}% Efectiva Anual)</div>
              </div>
            </div>

            {/* Detalles */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-global-12 mb-4">Detalles</h3>
              <div className="space-y-3 text-global-6">
                <p>• Tasas y plazos varían según el empleador y el perfil crediticio del cliente</p>
                <p>• Tasa máxima legal permitida para Junio 2025: <strong className="text-[#FF8546]">25.55% E.A</strong></p>
                <p>• <span className="text-global-6">Políticas de crédito disponibles </span><a href="#" className="text-[#0076FF] hover:underline cursor-pointer">aquí</a></p>
                <p className="text-sm text-gray-500">Fecha de actualización: Junio 5 de 2025</p>
              </div>
            </div>
          </div>
        </section>

      {/* Call to Action Final */}
        <section id="call-to-action" className="max-w-6xl mx-auto pb-12">
          {/* Call to Action */}
          <div className="text-center mt-10 mb-10">
            {/* Capa base con blur glass */}
            <div className="relative backdrop-blur-md bg-[#DEE5ED]/40 rounded-3xl p-8 md:p-12 shadow-md">
              {/* Partículas blur dentro del glass */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                {/* Esfera naranja blur */}
                <div className="absolute top-2/3 translate-x-1/2 w-40 h-40 bg-orange-400/60 rounded-full blur-xl animate-pulse-slow"></div>
                {/* Esfera azul blur */}
                <div className="absolute -translate-y-1/2 right-20 w-40 h-40 bg-blue-400/85 rounded-full blur-xl animate-pulse-slow"></div>
              </div>

              {/* Overlay adicional para efecto glass */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>

              <div className="relative">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-5 h-5 text-global-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-global-12">
                    ¿Listo para solicitar tu crédito?
                  </h2>
                </div>

                <p className="text-lg mb-8 text-global-7 max-w-2xl mx-auto">
                  Como integrante de {institutionName}, tienes acceso a condiciones especiales
                  para créditos por libranza con tasas preferenciales adaptadas a tu servicio.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    variant="cta"
                    size="xlarge"
                    className="w-full sm:w-auto"
                  >
                    ¡Solicitar Crédito Ahora!
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );
};
