import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector, RootState } from "../../../store";
import { CREDIT_MANAGEMENT_ROUTE } from "../../../routes/routes";
import { useAuth } from "../../../hooks/useAuth";
import EditText from "../../ui/EditText";
import Dropdown from "../../ui/Dropdown";
import Button from "../../ui/Button";
import {
  setCreditRequest,
  nextStep,
  clearLoanCalculation,
} from "../../../features/credit-management/slices/creditManagement";
import { calculateLoan } from "../../../features/credit-management/slices/operations/calculateLoan.operation";
import { fetchLoanTypes } from "../../../features/loan-types/slices/operations/fetchLoanTypes.operation";

const LOAN_TYPE_NAME = "Libranza";

export const LoanCalculator: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Obtener estado del cálculo del préstamo desde Redux
  const { loanCalculation, calculatingLoan, loanCalculationError } =
    useAppSelector((state: RootState) => state.creditManagement);

  // Obtener tipos de préstamo desde Redux
  const { loanTypes, loading: loadingLoanTypes } = useAppSelector(
    (state: RootState) => state.loanTypes
  );

  // Obtener el tipo de préstamo "Libranza"
  const loanTypeConfig = useMemo(() => {
    const libranza = loanTypes.find((lt) => lt.name === LOAN_TYPE_NAME);
    if (libranza) {
      return {
        minAmount: libranza.minAmount,
        maxAmount: libranza.maxAmount,
        minTerm: libranza.minTerm,
        maxTerm: libranza.maxTerm,
        interestRate: libranza.interestRate,
      };
    }
    // Valores por defecto mientras carga
    return {
      minAmount: 500000,
      maxAmount: 20000000,
      minTerm: 6,
      maxTerm: 60,
      interestRate: 25,
    };
  }, [loanTypes]);

  // Generar opciones de plazo dinámicamente
  const loanTermOptions = useMemo(() => {
    const options = [];
    for (let i = loanTypeConfig.minTerm; i <= loanTypeConfig.maxTerm; i++) {
      options.push({
        label: `${i} ${i === 1 ? "Mes" : "Meses"}`,
        value: String(i),
      });
    }
    return options;
  }, [loanTypeConfig.minTerm, loanTypeConfig.maxTerm]);

  // State
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [amountError, setAmountError] = useState<string>("");

  useEffect(() => {
    dispatch(fetchLoanTypes({}));
  }, [dispatch]);

  // Inicializar valores cuando se carga el tipo de préstamo
  useEffect(() => {
    if (loanTypes.length > 0 && !loanAmount) {
      const initialAmount = formatCurrencyInput(
        String(loanTypeConfig.minAmount)
      );
      const initialTerm = String(loanTypeConfig.minTerm);
      setLoanAmount(initialAmount);
      setLoanTerm(initialTerm);

      const amountNumber = loanTypeConfig.minAmount;
      dispatch(
        setCreditRequest({
          amount: amountNumber,
          months: loanTypeConfig.minTerm,
        })
      );
    }
    // Limpiar cálculo previo al montar
    dispatch(clearLoanCalculation());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanTypes]); // Solo se ejecuta cuando se cargan los tipos

  // --- HELPERS ---
  const formatCurrencyInput = (value: string) => {
    // Remover todo excepto números
    const numberOnly = value.replace(/[^0-9]/g, "");

    // Si no hay números, retornar solo el signo de peso
    if (numberOnly === "") {
      return "$";
    }

    // Formatear con puntos como separadores de miles
    const formatted = numberOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Agregar el signo de peso al inicio
    return `$${formatted}`;
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
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

    // Validar monto
    const amountNumber = parseInt(formattedValue.replace(/[^0-9]/g, "")) || 0;
    if (amountNumber > 0) {
      if (amountNumber < loanTypeConfig.minAmount) {
        setAmountError(
          `El monto mínimo es ${formatMoney(loanTypeConfig.minAmount)}`
        );
      } else if (amountNumber > loanTypeConfig.maxAmount) {
        setAmountError(
          `El monto máximo es ${formatMoney(loanTypeConfig.maxAmount)}`
        );
      } else {
        setAmountError("");
      }

      dispatch(
        setCreditRequest({
          amount: amountNumber,
          months: parseInt(loanTerm) || loanTypeConfig.minTerm,
        })
      );
    } else {
      setAmountError("");
    }
  };

  const handleTermChange = (val: string) => {
    setLoanTerm(val);
    setShowResult(false);
    // Limpiar cálculo previo cuando cambia el plazo
    dispatch(clearLoanCalculation());
    // Actualizar Redux cuando cambia el plazo
    const amountNumber = parseInt(loanAmount.replace(/[^0-9]/g, "")) || 0;
    if (amountNumber > 0) {
      dispatch(
        setCreditRequest({
          amount: amountNumber,
          months: parseInt(val) || loanTypeConfig.minTerm,
        })
      );
    }
  };

  // Validar si se puede calcular
  const canCalculate = useMemo(() => {
    const amountNumber = parseInt(loanAmount.replace(/[^0-9]/g, "")) || 0;
    const termNumber = parseInt(loanTerm) || 0;
    return (
      amountNumber >= loanTypeConfig.minAmount &&
      amountNumber <= loanTypeConfig.maxAmount &&
      termNumber >= loanTypeConfig.minTerm &&
      termNumber <= loanTypeConfig.maxTerm &&
      !amountError
    );
  }, [loanAmount, loanTerm, loanTypeConfig, amountError]);

  // Función para calcular el préstamo
  const handleCalculateLoan = async () => {
    const amountNumber = parseInt(loanAmount.replace(/[^0-9]/g, "")) || 0;
    const monthsNumber = parseInt(loanTerm) || 0;

    if (amountNumber === 0 || monthsNumber === 0) {
      return;
    }

    try {
      await dispatch(
        calculateLoan({
          loanTypeName: LOAN_TYPE_NAME,
          amountRequested: amountNumber,
          termMonths: monthsNumber,
        })
      ).unwrap();
      setShowResult(true);
    } catch (error) {
      console.error("Error al calcular el préstamo:", error);
    }
  };

  // Loading state
  if (loadingLoanTypes) {
    return (
      <div className="bg-global-11 rounded-xl p-6 md:p-10 shadow-lg border border-global-3/50">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <i className="pi pi-spin pi-spinner text-3xl text-blue-600 mb-3"></i>
            <p className="text-sm text-global-6">Cargando configuración...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-global-11 rounded-xl p-6 md:p-10 shadow-lg border border-global-3/50">
      {/* --- INPUTS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col flex-1">
          <label className="block text-base font-semibold text-global-9 mb-3 ml-1">
            ¿Cuánto dinero necesitas?
          </label>
          <EditText
            placeholder={`${formatMoney(loanTypeConfig.minAmount)}`}
            value={loanAmount}
            onChange={handleAmountChange}
            className={`w-full h-12 text-lg font-medium ${
              amountError ? "border-red-500" : ""
            }`}
            type="text"
          />
          {amountError ? (
            <p className="mt-2 text-xs text-red-500 ml-1">{amountError}</p>
          ) : (
            <p className="mt-2 text-xs text-global-6 ml-1">
              Monto entre {formatMoney(loanTypeConfig.minAmount)} y{" "}
              {formatMoney(loanTypeConfig.maxAmount)}
            </p>
          )}
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
            Plazo de {loanTypeConfig.minTerm} a {loanTypeConfig.maxTerm} meses
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
            disabled={calculatingLoan || !canCalculate}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {calculatingLoan ? "Calculando..." : "Calcular mi crédito"}
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
              <p className="text-sm text-blue-800 font-medium">
                Cuota mensual estimada
              </p>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {formatMoney(loanCalculation.monthlyPayment)}
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="space-y-3 mb-8">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-global-7 font-medium">
                Valor del crédito
              </span>
              <span className="text-sm text-global-9 font-bold">
                {formatMoney(loanCalculation.amountRequested)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-global-7">
                Tasa de interés anual
              </span>
              <span className="text-sm text-global-9">
                {loanCalculation.annualInterestRate}%
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-global-7">
                Tasa de interés mensual
              </span>
              <span className="text-sm text-global-9">
                {(loanCalculation.monthlyRate * 100).toFixed(4)}%
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100 bg-blue-50/30 px-2 -mx-2 rounded">
              <span className="text-sm text-blue-800 font-medium">
                Total de intereses
              </span>
              <span className="text-sm text-blue-800 font-bold">
                {formatMoney(loanCalculation.totalInterest)}
              </span>
            </div>

            {/* Total Payable Row */}
            <div className="flex justify-between items-center pt-4 mt-2">
              <span className="text-base font-bold text-global-9">
                Total a pagar aproximado
              </span>
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
              onClick={() => {
                if (isAuthenticated) {
                  dispatch(nextStep());
                  if (location.pathname !== CREDIT_MANAGEMENT_ROUTE) {
                    navigate(CREDIT_MANAGEMENT_ROUTE);
                  }
                } else {
                  navigate("/registro");
                }
              }}
            >
              Continuar con la solicitud
            </Button>
          </div>
          {/* <p className="mt-4 text-xs text-center text-global-6 leading-relaxed">
            * Los valores presentados son una simulación y pueden variar según
            el análisis de crédito definitivo.
          </p> */}
        </div>
      )}
    </div>
  );
};
