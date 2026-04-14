import { Link } from 'react-router-dom';
import whatsappIcon from '../../assets_landing/images/icons/contact/whatsapp.png';
import facebookIcon from '../../assets_landing/images/icons/social/facebook.svg';
import instagramIcon from '../../assets_landing/images/icons/social/instagram.svg';
import emailIcon from '../../assets_landing/images/icons/contact/email.svg';
import logoWhite from '../../assets_landing/images/ui/logo-white.png';
import {
  PRIVACY_POLICY_ROUTE,
  TERMS_AND_CONDITIONS_ROUTE,
} from '../../routes/routes';

const ICON_SIZE = "w-[28px] sm:w-[32px] md:w-[36px] h-[28px] sm:h-[32px] md:h-[36px]";
const TEXT_SIZE = "text-base font-normal";
const HEADING_SIZE = "text-md font-bold";
const SPACING = "gap-[10px] sm:gap-[12px] md:gap-[14px]";
const PADDING = "pt-[16px] sm:pt-[18px] md:pt-[20px] pr-[16px] sm:pr-[18px] md:pr-[20px] pb-[16px] sm:pb-[18px] md:pb-[20px] pl-[16px] sm:pl-[18px] md:pl-[20px]";

const Footer = () => {
  return (
    <footer className={`w-full bg-[#333333] ${PADDING}`}>
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="mt-[24px] flex w-full flex-col items-center gap-2 justify-start sm:mt-[28px] md:mt-[32px]">
          <div className="flex w-full flex-col justify-between gap-10 px-4 text-center sm:px-6 md:px-10 lg:flex-row lg:gap-0 lg:px-[64px] lg:text-left">
            <div className="flex w-full flex-col items-center justify-start lg:items-start">
              <div>
                <h3 className={`font-plus-jakarta ${HEADING_SIZE} mb-6 w-full text-white lg:mb-8`}>
                  Legales
                </h3>
              </div>
              <div className="flex flex-col items-center gap-4 lg:items-start lg:gap-[28px]">
                <Link
                  to={TERMS_AND_CONDITIONS_ROUTE}
                  className={`font-plus-jakarta ${TEXT_SIZE} w-auto rounded px-1.5 py-0.5 text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-white`}
                >
                  Términos y Condiciones
                </Link>
                <Link
                  to={PRIVACY_POLICY_ROUTE}
                  className={`font-plus-jakarta ${TEXT_SIZE} w-auto rounded px-1.5 py-0.5 text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-white`}
                >
                  Política de privacidad
                </Link>
              </div>
            </div>

            <div className="flex w-full justify-center">

                  <img
                  src={logoWhite}
                  alt="Company Logo"
                  className="w-full max-w-[150px] h-auto lg:w-full object-contain"
                />

            </div>
            <div className="flex w-full flex-col items-center lg:items-end">
              <h3 className={`font-plus-jakarta ${HEADING_SIZE} mb-6 w-full text-white text-center lg:text-right`}>
                Contactanos
              </h3>

              <div className="flex flex-col items-center lg:items-end">
                <div className={`flex ${SPACING} items-center justify-center rounded-md p-2 transition-colors duration-200 hover:bg-white/5 lg:flex-row-reverse`}>
                  <div className="shrink-0">
                    <img src={whatsappIcon} alt="WhatsApp" className={ICON_SIZE} />
                  </div>
                  <span className={`font-plus-jakarta ${TEXT_SIZE} text-center leading-[18px] text-white sm:leading-[20px] md:leading-[22px] lg:text-right`}>
                    315 8008588
                  </span>
                </div>

                <div className={`flex ${SPACING} items-center justify-center rounded-md p-2 transition-colors duration-200 hover:bg-white/5 lg:flex-row-reverse`}>
                  <div className="shrink-0">
                    <img src={facebookIcon} alt="Facebook" className={ICON_SIZE} />
                  </div>
                  <span className={`font-plus-jakarta ${TEXT_SIZE} text-center leading-[18px] text-white sm:leading-[20px] md:leading-[22px] lg:text-right`}>
                    Inversiones Murillo Martinez
                  </span>
                </div>

                <div className={`flex ${SPACING} items-center justify-center rounded-md p-2 transition-colors duration-200 hover:bg-white/5 lg:flex-row-reverse`}>
                  <div className="shrink-0">
                    <img src={instagramIcon} alt="Instagram" className={ICON_SIZE} />
                  </div>
                  <span className={`font-plus-jakarta ${TEXT_SIZE} text-center leading-[18px] text-white sm:leading-[20px] md:leading-[22px] lg:text-right`}>
                    @Inversiones Murillo Martinez
                  </span>
                </div>

                <div className={`flex ${SPACING} items-center justify-center rounded-md p-2 transition-colors duration-200 hover:bg-white/5 lg:flex-row-reverse`}>
                  <div className="shrink-0">
                    <img src={emailIcon} alt="Email" className={ICON_SIZE} />
                  </div>
                  <span className={`font-plus-jakarta ${TEXT_SIZE} text-center leading-[18px] text-white sm:leading-[20px] md:leading-[22px] lg:text-right`}>
                    inversionesmurillomartinez@outlook.es
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-linear-to-r from-transparent via-gray-600 to-transparent my-3"></div>

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
