import Button from '../../../../../components/ui/Button';

export default function CreditProcess() {
  const steps = [
    {
      number: "1",
      title: "Regístrate o inicia sesión",
      description: "Crea tu cuenta o accede con tus credenciales para guardar el avance de tu solicitud."
    },
    {
      number: "2", 
      title: "Haz clic en Solicitar y completa la información",
      description: "Ingresa tus datos básicos, selecciona tu perfil (pensionado, servidor público, militar o policía) y define el monto que deseas solicitar. Verás una estimación inmediata de tu cuota."
    },
    {
      number: "3",
      title: "Sube los documentos requeridos", 
      description: "Carga cédula, desprendible de pago y los soportes que te indiquemos; todo 100% digital."
    },
    {
      number: "4",
      title: "Envía tu solicitud",
      description: "Revisa el resumen y confirma. ¡Listo! Comenzamos el análisis."
    },
    {
      number: "5",
      title: "Recibe respuesta en menos de 24 h",
      description: "Te notificaremos por correo si tu solicitud fue aprobada. – Si es aprobada, un asesor se comunicará contigo para formalizar el desembolso. – Acto seguido, recibirás el dinero directamente en tu cuenta y las cuotas se descontarán automáticamente de tu salario o mesada pensional."
    }
  ];

  return (
    <section id="proceso" className="w-full bg-global-1 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-normal text-global-12 mb-6">
            Solicitud de crédito
          </h2>
          <p className="text-base text-global-7 max-w-3xl mx-auto">
            Proceso simple y transparente para obtener tu crédito por libranza
          </p>
        </div>
        
        {/* Process Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Conector entre steps */}
                {index < steps.length - 1 && (
                  <div className="md:flex hidden absolute left-7 top-16 flex-col gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-button-background1 to-orange-400 opacity-70 animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Step Number */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-100 to-button-background1/30 rounded-full flex items-center justify-center shadow-xs transform hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl md:text-3xl font-bold text-white" style={{ textShadow: '-1px -1px 0 #FF8546, 1px -1px 0 #FF8546, -1px 1px 0 #FF8546, 1px 1px 0 #FF8546, -2px 0 0 #FF8546, 2px 0 0 #FF8546, 0 -2px 0 #FF8546, 0 2px 0 #FF8546' }}>
                        {step.number}
                      </span>
                    </div>

                    {/* Indicador especial para el último paso */}
                    {index === 4 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-md border border-green-300">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-button-background1/10 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-button-background1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-global-12 leading-tight">
                          {step.title}
                        </h3>
                      </div>
                      <div className="hidden md:flex items-center gap-2 text-sm text-button-background1 font-medium bg-button-background1/10 px-3 py-1 rounded-full">
                        <span>Paso {step.number}</span>
                        <div className="w-2 h-2 bg-button-background1 rounded-full"></div>
                      </div>
                    </div>

                    <p className="text-base text-global-7 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Barra de progreso visual */}
                    <div className="mt-6 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-button-background1 to-blue-600 transition-all duration-1000 ease-out rounded-full"
                          style={{ width: `${((index + 1) / steps.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-global-6 font-medium">
                        {Math.round(((index + 1) / steps.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-30 mb-10">
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
                  <h3 className="text-2xl md:text-3xl font-bold text-global-12">
                    ¿Listo para comenzar?
                  </h3>
                </div>

                <p className="text-lg mb-8 text-global-7 max-w-2xl mx-auto">
                  Inicia tu solicitud de crédito por libranza de manera segura y sencilla
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    variant="cta"
                    size="xlarge"
                    className="w-full sm:w-auto"
                  >
                    ¡Solicita tu crédito ya!
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

