import Section from '../../../../../components/layout/Section';
import { LoanCalculator } from '../../../../../components/business/LoanCalculator/LoanCalculator';

export const CreditSimulation: React.FC = () => {
  return (
    <Section id="simulacion" className="relative pt-20 pb-20 bg-global-1">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
        <div className="flex-1 max-w-lg pr-10">
          <h2 className="text-5xl font-normal text-global-12 mb-6">
            Simula tu crédito<br />
            por libranza
          </h2>
          <p className="font-normal text-global-7 mb-8">
            Calcula la cuota mensual de tu crédito en línea de forma rápida y sencilla.
          </p>
        </div>

        <div className="flex-1 max-w-lg">
          <LoanCalculator />
        </div>
      </div>
    </Section>
  );
};

