import { useEffect, useMemo, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/Button";
import EditText from "@/components/ui/EditText";
import Dropdown from "@/components/ui/Dropdown";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { fetchLoanTypes } from "@/features/loan-types/slices/operations/fetchLoanTypes.operation";

const LOAN_TYPE_NAME = "Libranza";
const DEFAULT_LOAN_TYPE_CONFIG = {
  minAmount: 500000,
  maxAmount: 20000000,
  minTerm: 6,
  maxTerm: 60,
  interestRate: 25,
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const parseCurrency = (value: string) => {
  const parsed = Number(value.replace(/[^0-9]/g, ""));
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
};

const formatCurrencyInput = (value: string) => {
  const amount = parseCurrency(value);
  if (!amount) {
    return "$";
  }
  return `$${amount.toLocaleString("es-CO")}`;
};

export default function LoanCalculatorDashboardPage() {
  const dispatch = useAppDispatch();
  const { loanTypes } = useAppSelector((state: RootState) => state.loanTypes);

  const loanTypeConfig = useMemo(() => {
    const libranza = loanTypes.find((loanType) => loanType.name === LOAN_TYPE_NAME);
    if (!libranza) {
      return DEFAULT_LOAN_TYPE_CONFIG;
    }
    return {
      minAmount: libranza.minAmount,
      maxAmount: libranza.maxAmount,
      minTerm: libranza.minTerm,
      maxTerm: libranza.maxTerm,
      interestRate: libranza.interestRate,
    };
  }, [loanTypes]);

  const termOptions = useMemo(() => {
    const options = [];
    for (let term = loanTypeConfig.minTerm; term <= loanTypeConfig.maxTerm; term += 1) {
      options.push({
        label: `${term} meses`,
        value: String(term),
      });
    }
    return options;
  }, [loanTypeConfig.minTerm, loanTypeConfig.maxTerm]);

  const [amountInput, setAmountInput] = useState(formatCurrencyInput(String(DEFAULT_LOAN_TYPE_CONFIG.minAmount)));
  const [termInput, setTermInput] = useState(String(DEFAULT_LOAN_TYPE_CONFIG.minTerm));
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    dispatch(fetchLoanTypes({}));
  }, [dispatch]);

  useEffect(() => {
    if (!loanTypes.length) {
      return;
    }
    setAmountInput((currentValue) => {
      const currentAmount = parseCurrency(currentValue);
      if (!currentAmount || currentAmount < loanTypeConfig.minAmount) {
        return formatCurrencyInput(String(loanTypeConfig.minAmount));
      }
      if (currentAmount > loanTypeConfig.maxAmount) {
        return formatCurrencyInput(String(loanTypeConfig.maxAmount));
      }
      return currentValue;
    });
    setTermInput((currentValue) => {
      const currentTerm = Number(currentValue);
      if (currentTerm < loanTypeConfig.minTerm) {
        return String(loanTypeConfig.minTerm);
      }
      if (currentTerm > loanTypeConfig.maxTerm) {
        return String(loanTypeConfig.maxTerm);
      }
      return currentValue;
    });
  }, [
    loanTypeConfig.maxAmount,
    loanTypeConfig.maxTerm,
    loanTypeConfig.minAmount,
    loanTypeConfig.minTerm,
    loanTypes.length,
  ]);

  const amount = useMemo(() => parseCurrency(amountInput), [amountInput]);
  const annualRate = useMemo(() => loanTypeConfig.interestRate, [loanTypeConfig.interestRate]);
  const term = useMemo(() => Number(termInput), [termInput]);

  const result = useMemo(() => {
    if (amount <= 0 || annualRate <= 0 || term <= 0) {
      return null;
    }
    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment =
      monthlyRate === 0
        ? amount / term
        : (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
    const totalPayable = monthlyPayment * term;
    const totalInterest = totalPayable - amount;
    return {
      monthlyPayment,
      totalPayable,
      totalInterest,
      monthlyRate: monthlyRate * 100,
    };
  }, [amount, annualRate, term]);

  const canCalculate =
    amount >= loanTypeConfig.minAmount &&
    amount <= loanTypeConfig.maxAmount &&
    annualRate > 0 &&
    term >= loanTypeConfig.minTerm &&
    term <= loanTypeConfig.maxTerm;

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Calculadora de préstamos
        </h1>
        <PageBreadcrumb
          showTitle={false}
          items={[
            { label: "Home", path: "/dashboard/home" },
            { label: "Calculadora" },
          ]}
        />
      </div>

      <div className="bg-global-11 rounded-xl p-6 md:p-10 shadow-lg border border-global-3/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col flex-1">
            <label className="block text-base font-semibold text-global-9 mb-3 ml-1">
              ¿Cuánto dinero necesitas?
            </label>
            <EditText
              type="text"
              value={amountInput}
              onChange={(value) => {
                setAmountInput(formatCurrencyInput(value));
                setCalculated(false);
              }}
              placeholder="$0"
              className="w-full h-12 text-lg font-medium"
            />
          </div>

          <div className="flex flex-col flex-1">
            <label className="block text-base font-semibold text-global-9 mb-3 ml-1">
              ¿A cuántos meses?
            </label>
            <Dropdown
              options={termOptions}
              value={termInput}
              onChange={(value) => {
                setTermInput(String(value));
                setCalculated(false);
              }}
              placeholder="Seleccionar plazo"
              className="w-full h-12"
            />
          </div>
        </div>

        <div className="mb-6 animate-fade-in">
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={() => setCalculated(true)}
            disabled={!canCalculate}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calcular mi crédito
          </Button>
        </div>

        {calculated && result && (
          <div className="animate-fade-in-up">
            <div className="w-full h-px bg-global-3 mb-6"></div>

            <h3 className="text-xl font-bold text-global-9 mb-6 flex items-center">
              <span className="w-2 h-8 bg-[#FF8546] rounded-full mr-3"></span>
              Detalles del crédito
            </h3>

            <div className="bg-blue-50/50 rounded-xl p-4 mb-6 border border-blue-100 flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  Cuota mensual estimada
                </p>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {formatMoney(result.monthlyPayment)}
              </div>
            </div>

            <div className="space-y-3 mb-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-global-7 font-medium">
                  Valor del crédito
                </span>
                <span className="text-sm text-global-9 font-bold">
                  {formatMoney(amount)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-global-7">
                  Tasa de interés anual
                </span>
                <span className="text-sm text-global-9">{annualRate}%</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-global-7">
                  Tasa de interés mensual
                </span>
                <span className="text-sm text-global-9">
                  {result.monthlyRate.toFixed(4)}%
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100 bg-blue-50/30 px-2 -mx-2 rounded">
                <span className="text-sm text-blue-800 font-medium">
                  Total de intereses
                </span>
                <span className="text-sm text-blue-800 font-bold">
                  {formatMoney(result.totalInterest)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-4 mt-2">
                <span className="text-base font-bold text-global-9">
                  Total a pagar aproximado
                </span>
                <span className="text-xl font-bold text-[#FF8546]">
                  {formatMoney(result.totalPayable)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
