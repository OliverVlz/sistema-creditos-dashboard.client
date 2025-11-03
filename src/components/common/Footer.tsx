import whatsappIcon from '../../assets_landing/images/icons/contact/whatsapp.png';
import facebookIcon from '../../assets_landing/images/icons/social/facebook.svg';
import instagramIcon from '../../assets_landing/images/icons/social/instagram.svg';
import emailIcon from '../../assets_landing/images/icons/contact/email.svg';
import logoWhite from '../../assets_landing/images/ui/logo-white.png';

// Constantes para tamaños repetitivos
const ICON_SIZE = "w-[28px] sm:w-[32px] md:w-[36px] h-[28px] sm:h-[32px] md:h-[36px]";
const TEXT_SIZE = "text-base font-normal";
const HEADING_SIZE = "text-md font-bold";
const SPACING = "gap-[10px] sm:gap-[12px] md:gap-[14px]";
const PADDING = "pt-[16px] sm:pt-[18px] md:pt-[20px] pr-[16px] sm:pr-[18px] md:pr-[20px] pb-[16px] sm:pb-[18px] md:pb-[20px] pl-[16px] sm:pl-[18px] md:pl-[20px]";

const Footer = () => {
  return (
    <footer className={`w-full bg-[#333333] ${PADDING}`}>
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-2 justify-start items-center w-full mt-[24px] sm:mt-[28px] md:mt-[32px]">
          <div className="flex flex-col lg:flex-row justify-between w-full px-[40px] sm:px-[48px] md:px-[56px] lg:px-[64px] gap-8 lg:gap-0">
            {/* Legal Section */}
            <div className="flex flex-col justify-start items-start w-full">
              <div className="pl-2">
                <h3 className={`font-plus-jakarta ${HEADING_SIZE} text-left text-white mb-8 w-full`}>
                  Legales
                </h3>
              </div>
              <div className="flex flex-col gap-[28px]">
                {[
                  "Condiciones de crédito",
                  "Tratamiento de datos",
                  "Politicas de seguridad e internet",
                  "Aviso de privacidad"
                ].map((link, index) => (
                  <span key={index} className={`font-plus-jakarta ${TEXT_SIZE} text-white/90 hover:text-white cursor-pointer transition-colors duration-200 px-1.5 py-0.5 rounded hover:bg-white/10 w-full`}>
                    {link}
                  </span>
                ))}
              </div>
            </div>

            {/* Logo Section */}
            <div className="flex w-full justify-center">

                  <img
                  src={logoWhite}
                  alt="Company Logo"
                  className="w-full max-w-[150px] h-auto lg:w-[100%] object-contain"
                />

            </div>
            {/* Contact Section */}
            <div className="flex flex-col text-right w-full">
              <h3 className={`font-plus-jakarta ${HEADING_SIZE} text-white mb-6 w-full`}>
                Contactanos
              </h3>

              {/* Contact Items */}
              <div className="flex flex-col items-end">
                {/* WhatsApp */}
                <div className={`flex flex-row-reverse ${SPACING} justify-start items-center w-auto p-2 rounded-md hover:bg-white/5 transition-colors duration-200`}>
                  <div className="flex-shrink-0">
                    <img src={whatsappIcon} alt="WhatsApp" className={ICON_SIZE} />
                  </div>
                  <span className={`font-plus-jakarta ${TEXT_SIZE} leading-[18px] sm:leading-[20px] md:leading-[22px] text-right text-white`}>
                    315 8008588
                  </span>
                </div>

                {/* Facebook */}
                <div className={`flex flex-row-reverse ${SPACING} justify-start items-center w-auto p-2 rounded-md hover:bg-white/5 transition-colors duration-200`}>
                  <div className="flex-shrink-0">
                    <img src={facebookIcon} alt="Facebook" className={ICON_SIZE} />
                  </div>
                  <span className={`font-plus-jakarta ${TEXT_SIZE} leading-[18px] sm:leading-[20px] md:leading-[22px] text-right text-white`}>
                    Inversiones Murillo Martinez
                  </span>
                </div>

                {/* Instagram */}
                <div className={`flex flex-row-reverse ${SPACING} justify-start items-center w-auto p-2 rounded-md hover:bg-white/5 transition-colors duration-200`}>
                  <div className="flex-shrink-0">
                    <img src={instagramIcon} alt="Instagram" className={ICON_SIZE} />
                  </div>
                  <span className={`font-plus-jakarta ${TEXT_SIZE} leading-[18px] sm:leading-[20px] md:leading-[22px] text-right text-white`}>
                    @Inversiones Murillo Martinez
                  </span>
                </div>

                {/* Email */}
                <div className={`flex flex-row-reverse ${SPACING} justify-start items-center w-auto p-2 rounded-md hover:bg-white/5 transition-colors duration-200`}>
                  <div className="flex-shrink-0">
                    <img src={emailIcon} alt="Email" className={ICON_SIZE} />
                  </div>
                  <span className={`font-plus-jakarta ${TEXT_SIZE} leading-[18px] sm:leading-[20px] md:leading-[22px] text-right text-white`}>
                    inversionesmurillomartinez@outlook.es
                  </span>
                </div>
              </div>
            </div>
          </div>
          
                    {/* Divider Line */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent my-3"></div>

          {/* Copyright */}
          <div className="pt-3 pb-1">
            <p className={`font-plus-jakarta ${TEXT_SIZE} font-medium leading-[20px] sm:leading-[22px] md:leading-[24px] text-center text-white/80`}>
              ©2025 Todos los Derechos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
