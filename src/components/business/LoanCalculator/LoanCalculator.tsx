import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import EditText from '../../ui/EditText';
import Dropdown from '../../ui/Dropdown';
import Button from '../../ui/Button';
import { setCreditRequest, nextStep } from '../../../features/credit-management/slices/creditManagement';

// Options generator (1 to 24 months)
const loanTermOptions = Array.from({ length: 24 }, (_, i) => ({
  label: `${i + 1} ${i === 0 ? 'Mes' : 'Meses'}`, // UI Label remains in Spanish
  value: String(i + 1),
}));

// Business Constants
const MONTHLY_INTEREST_RATE = 0.018; // 1.8% N.M.V.

export const LoanCalculator: React.FC = () => {
  const dispatch = useDispatch();
  
  // State
  const [loanAmount, setLoanAmount] = useState<string>('1.000.000');
  const [loanTerm, setLoanTerm] = useState<string>('6'); 
  const [showResult, setShowResult] = useState(false);

  // Inicializar Redux con los valores por defecto al montar el componente
  useEffect(() => {
    const initialAmount = '1.000.000';
    const initialTerm = '6';
    const amountNumber = parseInt(initialAmount.replace(/\./g, '')) || 0;
    const monthsNumber = parseInt(initialTerm) || 6;
    if (amountNumber > 0) {
      dispatch(setCreditRequest({
        amount: amountNumber,
        months: monthsNumber,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo se ejecuta al montar

  // --- HELPERS ---
  const formatCurrencyInput = (value: string) => {
    const numberOnly = value.replace(/\D/g, '');
    return numberOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAmountChange = (val: string) => {
    const formattedValue = formatCurrencyInput(val);
    setLoanAmount(formattedValue);
    setShowResult(false);
    // Actualizar Redux cuando cambia el monto
    const amountNumber = parseInt(formattedValue.replace(/\./g, '')) || 0;
    if (amountNumber > 0) {
      dispatch(setCreditRequest({
        amount: amountNumber,
        months: parseInt(loanTerm) || 6,
      }));
    }
  };

  const handleTermChange = (val: string) => {
    setLoanTerm(val);
    setShowResult(false);
    // Actualizar Redux cuando cambia el plazo
    const amountNumber = parseInt(loanAmount.replace(/\./g, '')) || 0;
    if (amountNumber > 0) {
      dispatch(setCreditRequest({
        amount: amountNumber,
        months: parseInt(val) || 6,
      }));
    }
  };

  // --- CALCULATIONS ---
  const results = useMemo(() => {
    const principal = parseInt(loanAmount.replace(/\./g, '')) || 0;
    const months = parseInt(loanTerm);

    if (principal === 0 || months === 0) return null;

    // 1. Monthly Payment Formula (Amortization)
    const numerator = principal * MONTHLY_INTEREST_RATE * Math.pow(1 + MONTHLY_INTEREST_RATE, months);
    const denominator = Math.pow(1 + MONTHLY_INTEREST_RATE, months) - 1;
    const monthlyPayment = numerator / denominator;

    // 2. Totals Calculation
    const totalAmountPaid = monthlyPayment * months;
    const totalInterest = totalAmountPaid - principal;
    
    // Total Payable (Principal + Interest)
    const totalPayable = totalAmountPaid;

    return {
      principal,
      monthlyPayment,
      totalInterest,
      totalPayable
    };
  }, [loanAmount, loanTerm]);

  return (
    <div className="bg-global-11 rounded-xl p-6 md:p-10 shadow-lg border border-global-3/50">
      
      {/* --- INPUTS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col flex-1">
          <label className="block text-base font-semibold text-global-9 mb-3 ml-1">
            ¿Quanto dinero necesitas?
          </label>
          <EditText
            placeholder="1.000.000"
            value={loanAmount}
            onChange={handleAmountChange}
            className="w-full h-12 text-lg font-medium"
          />
          <p className="mt-2 text-xs text-global-6 ml-1">
            Desde $1.000.000 hasta $150.000.000
          </p>
        </div>

        <div className="flex flex-col flex-1">
          <label className="block text-base font-semibold text-global-9 mb-3 ml-1">
            ¿A cuántos meses?
          </label>
          <Dropdown
            placeholder="Seleccionar plazo"
            options={loanTermOptions}
            value={loanTerm}
            onChange={(val) => handleTermChange(String(val))}
            className="w-full h-12"
          />
          <p className="mt-2 text-xs text-global-6 ml-1">
            Plazo máximo hasta 24 meses
          </p>
        </div>
      </div>

      {/* --- CALCULATE BUTTON --- */}
      {!showResult && (
        <div className="mb-6 animate-fade-in">
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={() => setShowResult(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
          >
            Calcular mi crédito
          </Button>
        </div>
      )}

      {/* --- RESULTS SECTION --- */}
      {showResult && results && (
        <div className="animate-fade-in-up">
          <div className="w-full h-px bg-global-3 mb-6"></div>

          <h3 className="text-xl font-bold text-global-9 mb-6 flex items-center">
            <span className="w-2 h-8 bg-[#FF8546] rounded-full mr-3"></span>
            Detalles de tu crédito
          </h3>

          {/* Monthly Payment Card */}
          <div className="bg-blue-50/50 rounded-xl p-4 mb-6 border border-blue-100 flex justify-between items-center">
             <div>
                <p className="text-sm text-blue-800 font-medium">Cuota mensual estimada</p>
                <p className="text-xs text-blue-600">Capital + Intereses</p>
             </div>
             <div className="text-2xl font-bold text-blue-900">
                {formatMoney(results.monthlyPayment)}
             </div>
          </div>

          {/* Breakdown Table */}
          <div className="space-y-3 mb-8">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-global-7 font-medium">Valor del crédito</span>
              <span className="text-sm text-global-9 font-bold">{formatMoney(results.principal)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-global-7">Tasa de interés (N.M.V)</span>
              <span className="text-sm text-global-9">{(MONTHLY_INTEREST_RATE * 100).toFixed(2)}%</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100 bg-blue-50/30 px-2 -mx-2 rounded">
              <span className="text-sm text-blue-800 font-medium">Total de intereses</span>
              <span className="text-sm text-blue-800 font-bold">{formatMoney(results.totalInterest)}</span>
            </div>

            {/* Total Payable Row */}
            <div className="flex justify-between items-center pt-4 mt-2">
              <span className="text-base font-bold text-global-9">Total a pagar aproximado</span>
              <span className="text-xl font-bold text-[#FF8546]">
                {formatMoney(results.totalPayable)}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="primary"
              size="large"
              fullWidth
              className="shadow-md"
              onClick={() => dispatch(nextStep())}
            >
              Continuar con la solicitud
            </Button>
          </div>

          <p className="mt-4 text-xs text-center text-global-6 leading-relaxed">
            * Los valores presentados son una simulación y pueden variar según el análisis de crédito definitivo.
          </p>
        </div>
      )}
    </div>
  );
};