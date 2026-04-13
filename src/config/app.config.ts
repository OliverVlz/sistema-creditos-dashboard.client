
export const appConfig = {
    apiUrl: import.meta.env.VITE_API_URL,
    loanContractTemplateUrl:
        import.meta.env.VITE_LOAN_CONTRACT_TEMPLATE_URL ||
        (import.meta.env.VITE_API_URL
            ? `${import.meta.env.VITE_API_URL}/loans/preapproval-contract-template`
            : '')
}
