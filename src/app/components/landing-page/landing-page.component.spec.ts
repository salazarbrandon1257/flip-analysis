import { DealAnalysis } from '../../models/deal';
import { DEAL_STATUSES, statusColor } from '../../models/deal';

function makeDeal(overrides: { netProfit?: number; roi?: number; profitMargin?: number; status?: string }): DealAnalysis {
  return {
    deal: {
      id: '1',
      address: '123 Test St',
      purchasePrice: 100000,
      askingPrice: 120000,
      buyerClosingCosts: 1999,
      titleClosingCosts: 2000,
      rehabCosts: 30000,
      loanAmount: 88000,
      downPaymentPercent: 12,
      interestRatePercent: 12,
      holdPeriodMonths: 6,
      loanMonthlyInterest: 880,
      taxesInsuranceUtilities: 7400,
      afterRepairValue: 200000,
      agentCommissionPercent: 6,
      sellerClosingCosts: 8000,
      personalLoanAmount: 0,
      personalLoanApr: 17,
      personalLoanTermMonths: 84,
      personalLoanMonthlyPayment: 0,
      personalLoanTotalInterest: 0,
      personalLoanInterestForHold: 0,
      createdAt: new Date(),
      status: overrides.status ?? 'Analyzing',
    },
    totalClosingCosts: 3999,
    totalHoldingCosts: 12680,
    agentCommission: 12000,
    totalSellingCosts: 20000,
    netSaleProceeds: 180000,
    totalProjectCost: 146679,
    cashRequired: 31719,
    cashRequiredBrandon: 0,
    cashRequiredAakash: 28679,
    mao70: 110000,
    mao65: 100000,
    vsMAO70: -10000,
    vsMAO65: 0,
    netProfit: overrides.netProfit ?? 33321,
    roi: overrides.roi ?? 105,
    profitMargin: overrides.profitMargin ?? 16.66,
  } as DealAnalysis;
}

describe('LandingPageComponent', () => {
  describe('DEAL_STATUSES', () => {
    it('should have exactly 6 statuses', () => {
      expect(DEAL_STATUSES.length).toBe(6);
    });

    it('should include Analyzing, Offer Made, Contract, Rehab, Listed, Sold', () => {
      expect(DEAL_STATUSES).toContain('Analyzing');
      expect(DEAL_STATUSES).toContain('Offer Made');
      expect(DEAL_STATUSES).toContain('Contract');
      expect(DEAL_STATUSES).toContain('Rehab');
      expect(DEAL_STATUSES).toContain('Listed');
      expect(DEAL_STATUSES).toContain('Sold');
    });
  });

  describe('statusColor', () => {
    it('should return distinct colors for each status', () => {
      const colors = DEAL_STATUSES.map(s => statusColor(s));
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(6);
    });

    it('should return gray for unknown status', () => {
      expect(statusColor('bogus')).toBe('#64748b');
    });
  });
});
