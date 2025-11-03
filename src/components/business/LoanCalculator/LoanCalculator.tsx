import React, { useState } from 'react';
import EditText from '../../ui/EditText';
import Dropdown from '../../ui/Dropdown';
import Button from '../../ui/Button';
import arrowDownIcon from '../../../assets_landing/images/landing/img_arrowdown.svg';

const loanTermOptions = Array.from({ length: 120 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}));

export const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<string>('1.000.000');
  const [loanTerm, setLoanTerm] = useState<string>(loanTermOptions[11].value);

  return (
    <div className="bg-global-11 rounded-xl p-10 shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col flex-1">
          <label className="block text-base font-normal text-global-9 mb-4">
            Monto
          </label>
          <EditText
            placeholder="1.000.000"
            value={loanAmount}
            onChange={setLoanAmount}
            className="w-full h-12"
          />
          <p className="mt-2 text-sm font-normal text-global-6">
            Desde $1.000.000 hasta $150.000.000 COP
          </p>
        </div>

        <div className="flex flex-col flex-1">
          <label className="block text-base font-normal text-global-9 mb-4">
            Plazo
          </label>
          <Dropdown
            placeholder="12"
            options={loanTermOptions}
            value={loanTerm}
            onChange={(value) => setLoanTerm(String(value))}
            rightIcon={{
              src: arrowDownIcon,
              width: 12,
              height: 10
            }}
            className="w-full h-12"
          />
          <p className="mt-2 text-sm font-normal text-global-6">
            Hasta 120 Meses
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-global-3 my-6"></div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-center capitalize text-global-9 mb-6">
          Tu resultado
        </h3>

        <div className="space-y-4">
          <p className="text-base font-light capitalize text-global-7">
            monto solicitado
          </p>

          <div className="flex justify-between items-center">
            <span className="text-base font-light capitalize text-global-7">
              Interés %* (N.M.V.)
            </span>
            <span className="text-base font-light capitalize text-global-7">
              1.80%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-base font-medium capitalize text-global-9">
              tu cuota mensual
            </span>
            <span className="text-base font-medium capitalize text-global-9">
              $ 0 COP
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-global-3 mb-6"></div>

      <Button
        variant="cta"
        size="large"
        fullWidth
        className="mb-4"
      >
        Solicitar Credito
      </Button>

      <p className="text-sm font-normal text-center text-global-6">
        Sujeto a términos y condiciones de viabilidad para el otorgamiento del crédito
      </p>
    </div>
  );
};
