export const DEAL_STATUSES = [
  'Analyzing',
  'Offer Made',
  'Contract',
  'Rehab',
  'Listed',
  'Sold',
] as const;

export function statusColor(status: string): string {
  switch (status) {
    case 'Analyzing': return '#64748b';
    case 'Offer Made': return '#3b82f6';
    case 'Contract': return '#f59e0b';
    case 'Rehab': return '#f97316';
    case 'Listed': return '#6366f1';
    case 'Sold': return '#22c55e';
    default: return '#64748b';
  }
}

export function statusBackground(status: string): string {
  const bgMap: Record<string, string> = {
    Analyzing: 'rgba(100,116,139,0.10)',
    'Offer Made': 'rgba(59,130,246,0.10)',
    Contract: 'rgba(245,158,11,0.10)',
    Rehab: 'rgba(249,115,22,0.10)',
    Listed: 'rgba(99,102,241,0.10)',
    Sold: 'rgba(34,197,94,0.10)',
  };
  return bgMap[status] ?? bgMap['Analyzing'];
}

export interface Deal {
  id: string;
  address: string;

  // Status
  status: string;

  // Acquisition
  purchasePrice: number;
  askingPrice: number;
  buyerClosingCosts: number;
  titleClosingCosts: number;

  // Rehab
  rehabCosts: number;

  // Financing
  loanAmount: number;
  downPaymentPercent: number;
  interestRatePercent: number;
  holdPeriodMonths: number;
  loanMonthlyInterest: number;

  // Personal Loan for Rehab
  personalLoanAmount: number;
  personalLoanApr: number;
  personalLoanTermMonths: number;
  personalLoanMonthlyPayment: number;
  personalLoanTotalInterest: number;
  personalLoanInterestForHold: number;

  // Holding Costs
  taxesInsuranceUtilities: number;

  // Sale/Exit
  afterRepairValue: number;
  agentCommissionPercent: number;
  sellerClosingCosts: number;

  notes?: string;
  createdAt: Date;
}

export interface DealAnalysis {
  deal: Deal;

  // Acquisition Costs
  totalClosingCosts: number;

  // Holding Costs
  totalHoldingCosts: number;

  // Sale Costs
  agentCommission: number;
  totalSellingCosts: number;
  netSaleProceeds: number;

  // Investment & Returns
  totalProjectCost: number;
  cashRequired: number;
  cashRequiredBrandon: number;
  cashRequiredAakash: number;
  netProfit: number;
  roi: number;
  profitMargin: number;

  // MAO Rules
  mao70: number;
  mao65: number;
  vsMAO70: number;
  vsMAO65: number;
}

export function calculateDealAnalysis(deal: Deal): DealAnalysis {
  // Acquisition
  const totalClosingCosts = deal.buyerClosingCosts + deal.titleClosingCosts;

  // Financing
  const totalLoanInterest = deal.loanMonthlyInterest * deal.holdPeriodMonths;
  const personalLoanPaymentsForHold = deal.personalLoanAmount > 0
    ? deal.personalLoanMonthlyPayment * deal.holdPeriodMonths
    : 0;

  // Holding
  const totalHoldingCosts = totalLoanInterest + deal.taxesInsuranceUtilities + personalLoanPaymentsForHold;

  // Total Investment
  const totalProjectCost =
    deal.purchasePrice +
    totalClosingCosts +
    deal.rehabCosts +
    totalHoldingCosts;

  // Cash Required Split
  // Brandon: loan rehab interest (personal loan interest for hold period)
  const cashRequiredBrandon = personalLoanPaymentsForHold || 0;

  // Aakash: Taxes/Insurance/Utilities + HML interest + HML downpayment + total closing costs
  const hmlDownPayment = deal.purchasePrice * (deal.downPaymentPercent / 100);
  const hmlInterest = totalLoanInterest;
  const cashRequiredAakash = deal.taxesInsuranceUtilities + hmlInterest + hmlDownPayment + totalClosingCosts;

  // Total Cash Required
  const cashRequired = cashRequiredBrandon + cashRequiredAakash;

  // Sale
  const agentCommission = deal.afterRepairValue * (deal.agentCommissionPercent / 100);
  const totalSellingCosts = agentCommission + deal.sellerClosingCosts;
  const netSaleProceeds = deal.afterRepairValue - totalSellingCosts;

  // Returns
  const netProfit = netSaleProceeds - totalProjectCost;
  const roi = cashRequired > 0 ? (netProfit / cashRequired) * 100 : 0;
  const profitMargin = deal.afterRepairValue > 0
    ? (netProfit / deal.afterRepairValue) * 100
    : 0;

  // MAO (Maximum Allowable Offer) Rules
  // 70% Rule: MAO = (ARV * 0.70) - Rehab
  const mao70 = (deal.afterRepairValue * 0.70) - deal.rehabCosts;
  // 65% Rule: MAO = (ARV * 0.65) - Rehab
  const mao65 = (deal.afterRepairValue * 0.65) - deal.rehabCosts;

  const vsMAO70 = deal.purchasePrice - mao70;
  const vsMAO65 = deal.purchasePrice - mao65;

  return {
    deal,
    totalClosingCosts,
    totalHoldingCosts,
    agentCommission,
    totalSellingCosts,
    netSaleProceeds,
    totalProjectCost,
    cashRequired,
    cashRequiredBrandon,
    cashRequiredAakash,
    netProfit,
    roi,
    profitMargin,
    mao70,
    mao65,
    vsMAO70,
    vsMAO65,
  };
}
