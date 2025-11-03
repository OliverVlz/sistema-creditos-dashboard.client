import { useState } from 'react';
import arrowDownOrangeIcon from '../../../../../assets/images/landing/img_icons_arrow_drop_down_48px_deep_orange_400_01.svg';
import arrowDownIcon from '../../../../../assets/images/landing/img_icons_arrow_drop_down_48px.svg';

export default function Faq() {
  const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null);

  const faqItems = [
    {
      question: '¿Qué es un crédito de libranza?',
      answer: 'Un crédito de libranza es un préstamo que se descuenta directamente de tu salario o pensión, ofreciendo tasas preferenciales y mayor facilidad de aprobación.'
    },
    {
      question: '¿Qué líneas de crédito ofrecemos?',
      answer: 'Ofrecemos créditos por libranza para pensionados y activos de las Fuerzas Militares y Policía Nacional, con montos desde $1.000.000 hasta $150.000.000.'
    },
    {
      question: '¿Cómo puedo obtener un crédito?',
      answer: 'Para obtener un crédito por libranza, simula tu cuota, regístrate o inicia sesión, haz clic en Solicitar, completa tus datos y el monto, y carga los documentos requeridos (cédula, desprendible de pago y certificación bancaria). Envía tu solicitud y en menos de 48 horas te notificaremos por correo el resultado; si es aprobada, un asesor te contactará contigo.'
    },
    {
      question: '¿A través de qué entidades puedo acceder al crédito de libranza?',
      answer: 'Puedes acceder a través de las Fuerzas Militares (Ejército, Armada, Fuerza Aeroespacial) y la Policía Nacional.'
    },
    {
      question: '¿Qué documentos necesito para solicitar un crédito?',
      answer: 'Necesitas cédula de ciudadanía, desprendible de pago actualizado, certificación bancaria y los documentos adicionales que te indiquemos según tu perfil.'
    },
    {
      question: '¿En cuánto tiempo se realiza el desembolso?',
      answer: 'Una vez aprobado tu crédito, el desembolso se realiza en un plazo máximo de 48 horas hábiles directamente a tu cuenta bancaria.'
    },
    {
      question: '¿Cuál es el monto mínimo y máximo de aprobación?',
      answer: 'El monto mínimo es de $1.000.000 COP y el máximo es de $150.000.000 COP, sujeto a tu capacidad de pago y perfil crediticio.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setSelectedFAQ(selectedFAQ === index ? null : index);
  };

  return (
    <section id="faq" className="w-full bg-global-2 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-normal text-global-12 mb-6">
            Preguntas frecuentes
          </h2>
          <p className="text-base text-global-7 max-w-3xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre nuestros servicios.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="grid gap-6">
            {faqItems.map((item, index) => (
              <div key={index} className="relative">
                <div
                  className="bg-white rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:border-orange-200"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-semibold leading-tight text-global-8 flex-1">
                      {item.question}
                    </h3>
                    <div className="flex items-center gap-2">
                      {selectedFAQ === index && (
                        <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
                      )}
                      <img
                        src={selectedFAQ === index ? arrowDownOrangeIcon : arrowDownIcon}
                        alt={selectedFAQ === index ? "Collapse" : "Expand"}
                        className={`w-6 h-6 flex-shrink-0 transition-all duration-300 ${selectedFAQ === index ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                  {selectedFAQ === index && (
                    <div className="mt-4 pt-4 border-t border-orange-200">
                      <p className="text-base leading-relaxed text-global-7">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

