import Button from '../../../../../components/ui/Button';
import emailIcon from '../../../../../assets/images/landing/img_group.svg';
import phoneIcon from '../../../../../assets/images/landing/img_phone.svg';
import locationIcon from '../../../../../assets/images/landing/img_location.svg';

export default function ContactSection() {
  const contactInfo = [
    {
      icon: emailIcon,
      label: "Email",
      value: "inversionesmurillomartinez@outlook.es",
      iconClass: "w-4 h-3"
    },
    {
      icon: phoneIcon,
      label: "Teléfono",
      value: "315 8008588",
      iconClass: "w-6 h-4"
    },
    {
      icon: locationIcon,
      label: "Dirección",
      value: "Calle 25 N 12-27 110110 Bogotá, Colombia",
      iconClass: "w-7 h-5"
    }
  ];

  const formFields = [
    {
      label: "¿Cuál es tu nombre?*",
      required: true
    },
    {
      label: "¿Cuál es tu número de teléfono?*", 
      required: true,
      helpText: "Ingresa un número válido"
    },
    {
      label: "¿Cuál es tu email?",
      required: false
    },
    {
      label: "Escribe tus dudas o qué necesitas…",
      required: false
    }
  ];

  return (
    <section id="contacto" className="w-full bg-[#F6F6F6] py-20 md:pt-20 md:pb-32 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-orange-100/40 to-blue-100/40 rounded-full blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Content */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-4xl md:text-5xl font-normal text-global-12 leading-tight">
                  ¿Necesitas ayuda?
                </h2>
              </div>
              <p className="text-lg text-global-7 leading-relaxed">
                Cuéntanos qué necesitas. Te daremos una respuesta clara y te guiaremos hasta el desembolso.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-semibold text-global-12 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-100 to-orange-100 rounded-full"></div>
                Información de contacto
              </h3>
            
              {/* Contact Info */}
              <div className="space-y-5 mb-8">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-orange-50/50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img
                        src={contact.icon}
                        alt={contact.label}
                        className={`${contact.iconClass} opacity-80`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-600 mb-1">{contact.label}</p>
                      <p className="text-sm text-global-7 leading-relaxed">{contact.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-global-12">
                    Horario de atención
                  </h4>
                </div>
                <p className="text-base text-global-7 ml-8">
                  Lunes a viernes de 8:00 a.m. a 5:00 p.m.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Contact Form */}
          <div className="bg-white rounded-3xl shadow-sm p-7 md:p-12 border border-gray-100 relative overflow-hidden">
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">

                <h3 className="text-2xl md:text-3xl font-semibold text-global-12 leading-tight">
                  Solicita asesoría para tu crédito por libranza 
                </h3>
              </div>

              <form className="space-y-6 mb-8">
                {formFields.map((field, index) => (
                  <div key={index} className="group">
                    <label className="block text-base font-medium text-global-7 mb-3 group-focus-within:text-global-12 transition-colors">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        type={index === 1 ? "tel" : index === 2 ? "email" : index === 3 ? "text" : "text"}
                        className="w-full pb-2 bg-transparent border-b-2 border-gray-200 focus:border-global-5 outline-none transition-colors text-global-7 placeholder-gray-400"
                      />
                      {field.required && (
                        <span className="absolute right-0 top-0 text-orange-500 text-sm">*</span>
                      )}
                    </div>
                    {field.helpText && (
                      <p className="text-sm text-orange-400 mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {field.helpText}
                      </p>
                    )}
                  </div>
                ))}
              </form>

              {/* Submit Button */}
              <Button
                variant="primary"
                size="large"
                fullWidth
                className="text-lg font-semibold bg-gradient-to-r from-orange-400 to-blue-600 hover:from-orange-500 hover:to-blue-700 rounded-xl py-4 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  Enviar mensaje
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

