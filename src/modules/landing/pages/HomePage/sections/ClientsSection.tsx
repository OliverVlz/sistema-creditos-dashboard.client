import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../../../../../components/layout/Section';
import ejercitoImage from '../../../../../assets_landing/images/landing/soldier1.png';
import armadaImage from '../../../../../assets_landing/images/landing/naval1.png';
import fuerzaAereaImage from '../../../../../assets_landing/images/landing/aereo1.png';
import policiaImage from '../../../../../assets_landing/images/landing/policia1.png';
import {
  EJERCITO_NACIONAL_ROUTE,
  ARMADA_NACIONAL_ROUTE,
  FUERZA_AERESPACIAL_ROUTE,
  POLICIA_NACIONAL_ROUTE
} from '../../../../../routes/routes';

export const ClientsSection: React.FC = () => {
  const clients = [
    {
      name: "Ejercito Nacional",
      image: ejercitoImage,
      route: EJERCITO_NACIONAL_ROUTE,
      description: "Defensa y Honor Nacional"
    },
    {
      name: "Armada Nacional",
      image: armadaImage,
      route: ARMADA_NACIONAL_ROUTE,
      description: "Poder Naval Colombiano"
    },
    {
      name: "Fuerza Aeroespacial",
      image: fuerzaAereaImage,
      route: FUERZA_AERESPACIAL_ROUTE,
      description: "Dominio del Cielo Colombiano"
    },
    {
      name: "Policía Nacional",
      image: policiaImage,
      route: POLICIA_NACIONAL_ROUTE,
      description: "Protección y Servicio Ciudadano"
    }
  ];

  return (
    <Section id="clientes" className="w-full py-20 md:pb-32 bg-global-11">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-normal text-global-12 mb-6">
          Nuestros clientes
        </h2>
        
        <p className="font-normal text-global-7 mb-8 max-w-4xl mx-auto">
          Sabemos lo que significa servir al país. Por eso ofrecemos créditos por libranza para pensionados y activos del Ejército, Armada, Fuerza Aeroespacial y Policía Nacional, con transparencia total, sin costos ocultos y acompañamiento personalizado hasta el desembolso.
        </p>
      </div>
      
      {/* Client Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {clients.map((client, index) => (
          <Link
            key={index}
            to={client.route}
            className="group flex flex-col items-center text-center"
          >
            <div className="relative mb-6 cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl group-hover:shadow-2xl rounded-3xl">
              <div className="relative overflow-hidden rounded-3xl bg-white">
                <img
                  src={client.image}
                  alt={client.name}
                  className="w-full max-w-[200px] h-auto mx-auto transition-all duration-300 group-hover:brightness-110 rounded-3xl"
                />

                {/* Overlay de navegación con mejor border-radius */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl">
                  {/* Capa de fondo oscura */}
                  <div className="absolute inset-0 bg-black/30 rounded-3xl"></div>

                  {/* Capa del gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent rounded-3xl"></div>

                  {/* Contenido del overlay */}
                  <div className="relative z-10 flex items-end justify-center pb-4 h-full">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <svg className="w-6 h-6 text-global-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-plus-jakarta text-md sm:text-lg md:text-lg font-semibold leading-tight text-global-10 group-hover:text-button-background1 transition-colors duration-300 mb-2">
              {client.name}
            </h3>

            <p className="text-sm text-global-6 group-hover:text-global-8 transition-colors duration-300">
              {client.description}
            </p>

            {/* Indicador de navegación */}
            <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-global-7 font-medium">Ver detalles</span>
              <svg className="w-4 h-4 text-global-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>


    </Section>
  );
};

