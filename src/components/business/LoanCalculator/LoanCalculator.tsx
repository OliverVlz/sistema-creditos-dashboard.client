import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector, RootState } from '../../../store';
import EditText from '../../ui/EditText';
import Dropdown from '../../ui/Dropdown';
import Button from '../../ui/Button';
import { setCreditRequest, nextStep, clearLoanCalculation } from '../../../features/credit-management/slices/creditManagement';
import { calculateLoan } from '../../../features/credit-management/slices/operations/calculateLoan.operation';

// Options generator (1 to 24 months)
const loanTermOptions = Array.from({ length: 24 }, (_, i) => ({
  label: `${i + 1} ${i === 0 ? 'Mes' : 'Meses'}`, // UI Label remains in Spanish
  value: String(i + 1),
}));

// Loan Type ID quemado (temporalmente)
const LOAN_TYPE_ID = 'a0835c2b-cd2d-4347-954c-384aecb5e24a';

export const LoanCalculator: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Obtener estado del cálculo del préstamo desde Redux
  const { loanCalculation, calculatingLoan, loanCalculationError } = useAppSelector(
    (state: RootState) => state.creditManagement
  );
  
  // State
  const [loanAmount, setLoanAmount] = useState<string>('$1.000.000');
  const [loanTerm, setLoanTerm] = useState<string>('6'); 
  const [showResult, setShowResult] = useState(false);

  // Inicializar Redux con los valores por defecto al montar el componente
  useEffect(() => {
    const initialAmount = '$1.000.000';
    const initialTerm = '6';
    const amountNumber = parseInt(initialAmount.replace(/[^0-9]/g, '')) || 0;
    const monthsNumber = parseInt(initialTerm) || 6;
    if (amountNumber > 0) {
      dispatch(setCreditRequest({
        amount: amountNumber,
        months: monthsNumber,
      }));
    }
    // Limpiar cálculo previo al montar
    dispatch(clearLoanCalculation());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo se ejecuta al montar

  // --- HELPERS ---
  const formatCurrencyInput = (value: string) => {
    // Remover todo excepto números
    const numberOnly = value.replace(/[^0-9]/g, '');
    
    // Si no hay números, retornar solo el signo de peso
    if (numberOnly === '') {
      return '$';
    }
    
    // Formatear con puntos como separadores de miles
    const formatted = numberOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Agregar el signo de peso al inicio
    return `$${formatted}`;
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
    // Limpiar cálculo previo cuando cambia el monto
    dispatch(clearLoanCalculation());
    // Actualizar Redux cuando cambia el monto (remover $ y puntos)
    const amountNumber = parseInt(formattedValue.replace(/[^0-9]/g, '')) || 0;
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
    // Limpiar cálculo previo cuando cambia el plazo
    dispatch(clearLoanCalculation());
    // Actualizar Redux cuando cambia el plazo (remover $ y puntos)
    const amountNumber = parseInt(loanAmount.replace(/[^0-9]/g, '')) || 0;
    if (amountNumber > 0) {
      dispatch(setCreditRequest({
        amount: amountNumber,
        months: parseInt(val) || 6,
      }));
    }
  };

  // Función para calcular el préstamo
  const handleCalculateLoan = async () => {
    const amountNumber = parseInt(loanAmount.replace(/[^0-9]/g, '')) || 0;
    const monthsNumber = parseInt(loanTerm) || 0;

    if (amountNumber === 0 || monthsNumber === 0) {
      return;
    }

    try {
      // @ts-expect-error - Redux Toolkit types issue with React 19
      await dispatch(calculateLoan({
        loanTypeId: LOAN_TYPE_ID,
        amountRequested: amountNumber,
        termMonths: monthsNumber,
      })).unwrap();
      setShowResult(true);
    } catch (error) {
      console.error('Error al calcular el préstamo:', error);
      // El error se maneja en el estado de Redux
    }
  };

  return (
    <div className="bg-global-11 rounded-xl p-6 md:p-10 shadow-lg border border-global-3/50">
      
      {/* --- INPUTS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col flex-1">
          <label className="block text-base font-semibold text-global-9 mb-3 ml-1">
            ¿Quanto dinero necesitas?
          </label>
          <EditText
            placeholder="$0"
            value={loanAmount}
            onChange={handleAmountChange}
            className="w-full h-12 text-lg font-medium"
            type="text"
          />
          <p className="mt-2 text-xs text-global-6 ml-1">
            Monto a solicitar
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
            onClick={handleCalculateLoan}
            disabled={calculatingLoan}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {calculatingLoan ? 'Calculando...' : 'Calcular mi crédito'}
          </Button>
        </div>
      )}

      {/* --- ERROR MESSAGE --- */}
      {loanCalculationError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            Error al calcular el préstamo: {loanCalculationError}
          </p>
        </div>
      )}

      {/* --- RESULTS SECTION --- */}
      {showResult && loanCalculation && (
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
                {formatMoney(loanCalculation.monthlyPayment)}
             </div>
          </div>

          {/* Breakdown Table */}
          <div className="space-y-3 mb-8">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-global-7 font-medium">Valor del crédito</span>
              <span className="text-sm text-global-9 font-bold">{formatMoney(loanCalculation.amountRequested)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-global-7">Tasa de interés anual</span>
              <span className="text-sm text-global-9">{loanCalculation.annualInterestRate}%</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-global-7">Tasa de interés mensual (N.M.V)</span>
              <span className="text-sm text-global-9">{(loanCalculation.monthlyRate * 100).toFixed(4)}%</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100 bg-blue-50/30 px-2 -mx-2 rounded">
              <span className="text-sm text-blue-800 font-medium">Total de intereses</span>
              <span className="text-sm text-blue-800 font-bold">{formatMoney(loanCalculation.totalInterest)}</span>
            </div>

            {/* Total Payable Row */}
            <div className="flex justify-between items-center pt-4 mt-2">
              <span className="text-base font-bold text-global-9">Total a pagar aproximado</span>
              <span className="text-xl font-bold text-[#FF8546]">
                {formatMoney(loanCalculation.totalPayable)}
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