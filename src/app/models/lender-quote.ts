export interface PersonalLoanQuote {
  id?: string;
  createdAt: Date;
  lenderName: string;
  loanAmount: number;
  apr: number;
  termMonths: number;
  holdPeriodMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  notes?: string;
}

export interface HardMoneyQuote {
  id?: string;
  createdAt: Date;
  lenderName: string;
  purchasePrice: number;
  downPaymentPercent: number;
  rehabCosts: number;
  interestRate: number;
  holdPeriodMonths: number;
  originationFeePercent: number;
  downPayment: number;
  loanAmount: number;
  monthlyInterest: number;
  totalInterest: number;
  totalCost: number;
  notes?: string;
}
