import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClientInformationResponse } from '../models/clientInformationModel';
import { CreditRequest, UploadedDocument } from '../models/creditRequestModel';
import { LoanCalculationResponse } from '../models/loanCalculationModel';
import { createAsyncFetchClientInformationReducer } from './operations/fetchClientInformation.operation';
import { createAsyncCalculateLoanReducer } from './operations/calculateLoan.operation';
import { createAsyncSubmitLoanRequestReducer } from './operations/submitLoanRequest.operation';

export interface CreditManagementState {
  clientInformation: ClientInformationResponse | null;
  loading: boolean;
  error: string | null;
  // Información de la solicitud de crédito
  creditRequest: CreditRequest | null;
  // Documentos subidos
  uploadedDocuments: UploadedDocument[];
  // Paso actual del proceso
  currentStep: number;
  // Estado del cálculo del préstamo
  loanCalculation: LoanCalculationResponse | null;
  calculatingLoan: boolean;
  loanCalculationError: string | null;
}

export const creditManagementSlice = createSlice({
  name: 'creditManagement',
  initialState: {
    clientInformation: null,
    loading: false,
    error: null,
    creditRequest: null,
    uploadedDocuments: [],
    currentStep: 0, // Paso inicial: 0 = Calcular crédito
    loanCalculation: null,
    calculatingLoan: false,
    loanCalculationError: null,
  } as CreditManagementState,
  reducers: {
    setClientInformation: (state, action) => {
      state.clientInformation = action.payload;
    },
    // Acciones para la solicitud de crédito
    setCreditRequest: (state, action: PayloadAction<CreditRequest>) => {
      state.creditRequest = action.payload;
    },
    clearCreditRequest: (state) => {
      state.creditRequest = null;
    },
    // Acciones para documentos
    addDocument: (state, action: PayloadAction<UploadedDocument>) => {
      // Eliminar documento del mismo tipo si existe
      state.uploadedDocuments = state.uploadedDocuments.filter(
        doc => doc.type !== action.payload.type
      );
      // Agregar el nuevo documento
      state.uploadedDocuments.push(action.payload);
    },
    removeDocument: (state, action: PayloadAction<string>) => {
      state.uploadedDocuments = state.uploadedDocuments.filter(
        doc => doc.id !== action.payload
      );
    },
    clearDocuments: (state) => {
      state.uploadedDocuments = [];
    },
    // Acciones para navegación de pasos
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      state.currentStep = Math.min(state.currentStep + 1, 3); // Máximo 4 pasos (0-3)
    },
    previousStep: (state) => {
      state.currentStep = Math.max(state.currentStep - 1, 0); // Mínimo paso 0
    },
    // Limpiar todo el estado
    resetCreditManagement: (state) => {
      state.creditRequest = null;
      state.uploadedDocuments = [];
      state.currentStep = 0;
      state.loanCalculation = null;
      state.loanCalculationError = null;
    },
    // Limpiar el cálculo del préstamo
    clearLoanCalculation: (state) => {
      state.loanCalculation = null;
      state.loanCalculationError = null;
    },
  },
  extraReducers: (builder) => {
    createAsyncFetchClientInformationReducer({ builder });
    createAsyncCalculateLoanReducer({ builder });
    createAsyncSubmitLoanRequestReducer({ builder });
  },
});

export const { 
  setClientInformation,
  setCreditRequest,
  clearCreditRequest,
  addDocument,
  removeDocument,
  clearDocuments,
  setCurrentStep,
  nextStep,
  previousStep,
  resetCreditManagement,
  clearLoanCalculation,
} = creditManagementSlice.actions;
export default creditManagementSlice.reducer;