import { calculateDealAnalysis } from './deal';

describe('calculateDealAnalysis', () => {
  const baseDeal = {
    id: 'test-1',
    address: '123 Test St',
    status: 'Analyzing',
    purchasePrice: 100000,
    askingPrice: 120000,
    buyerClosingCosts: 1999, // 1% + $999
    titleClosingCosts: 2000, // 2%
    rehabCosts: 30000,
    loanAmount: 88000, // 88% of 100k
    downPaymentPercent: 12,
    interestRatePercent: 12,
    holdPeriodMonths: 6,
    loanMonthlyInterest: 880, // 88k * 12% / 12
    taxesInsuranceUtilities: 7400,
    afterRepairValue: 200000,
    agentCommissionPercent: 6,
    sellerClosingCosts: 8000, // 4% of 200k
    personalLoanAmount: 0,
    personalLoanApr: 17,
    personalLoanTermMonths: 84,
    personalLoanMonthlyPayment: 0,
    personalLoanTotalInterest: 0,
    personalLoanInterestForHold: 0,
    createdAt: new Date(),
  };

  it('should calculate correct total closing costs', () => {
    const analysis = calculateDealAnalysis(baseDeal);
    expect(analysis.totalClosingCosts).toBe(1999 + 2000); // 3999
  });

  it('should calculate correct agent commission', () => {
    const analysis = calculateDealAnalysis(baseDeal);
    expect(analysis.agentCommission).toBe(12000); // 6% of 200k
  });

  it('should calculate correct net sale proceeds', () => {
    const analysis = calculateDealAnalysis(baseDeal);
    // selling costs = 12000 + 8000 = 20000
    // net = 200000 - 20000 = 180000
    expect(analysis.netSaleProceeds).toBe(180000);
  });

  it('should calculate correct total project cost', () => {
    const analysis = calculateDealAnalysis(baseDeal);
    // holding = 880 * 6 + 7400 = 12680
    // total = 100000 + 3999 + 30000 + 12680 = 146679
    expect(analysis.totalProjectCost).toBe(146679);
  });

  it('should calculate correct net profit', () => {
    const analysis = calculateDealAnalysis(baseDeal);
    // 180000 - 146679 = 33321
    expect(analysis.netProfit).toBe(33321);
  });

  it('should calculate correct ROI', () => {
    const analysis = calculateDealAnalysis(baseDeal);
    // cashRequired = 1280 (brandon interest) + 7400 + 10560 + 12000 + 3999 = 35239
    const cash = analysis.cashRequiredAakash + analysis.cashRequiredBrandon;
    expect(analysis.cashRequired).toBe(cash);
    expect(analysis.roi).toBeCloseTo((33321 / cash) * 100, 1);
  });

  it('should calculate correct profit margin', () => {
    const analysis = calculateDealAnalysis(baseDeal);
    expect(analysis.profitMargin).toBeCloseTo((33321 / 200000) * 100, 1);
  });

  it('should calculate correct MAO 70% rule', () => {
    const analysis = calculateDealAnalysis(baseDeal);
    // mao70 = 200000 * 0.70 - 30000 = 110000
    expect(analysis.mao70).toBe(110000);
    // vs MAO = 100000 - 110000 = -10000 (under)
    expect(analysis.vsMAO70).toBe(-10000);
  });

  it('should calculate correct MAO 65% rule', () => {
    const analysis = calculateDealAnalysis(baseDeal);
    // mao65 = 200000 * 0.65 - 30000 = 100000
    expect(analysis.mao65).toBe(100000);
    expect(analysis.vsMAO65).toBe(0);
  });

  it('should identify a good deal (margin >= 15% and under MAO 70%)', () => {
    const analysis = calculateDealAnalysis(baseDeal);
    const isGood = analysis.profitMargin >= 15 && analysis.vsMAO70 <= 0;
    expect(isGood).toBeTrue();
  });

  it('should handle zero purchase price without NaN', () => {
    const deal = { ...baseDeal as any, purchasePrice: 0, loanAmount: 0, loanMonthlyInterest: 0 };
    const analysis = calculateDealAnalysis(deal);
    expect(Number.isNaN(analysis.totalProjectCost)).toBeFalse();
    expect(Number.isNaN(analysis.roi)).toBeFalse();
    expect(Number.isNaN(analysis.profitMargin)).toBeFalse();
  });

  it('should handle zero after repair value without NaN', () => {
    const deal = { ...baseDeal as any, afterRepairValue: 0, sellerClosingCosts: 0 };
    const analysis = calculateDealAnalysis(deal);
    expect(Number.isNaN(analysis.netSaleProceeds)).toBeFalse();
    expect(Number.isNaN(analysis.profitMargin)).toBeFalse();
    expect(Number.isNaN(analysis.roi)).toBeFalse();
  });

  it('should handle deals with personal loan', () => {
    const deal = {
      ...baseDeal,
      status: 'Analyzing',
      personalLoanAmount: 20000,
      personalLoanApr: 17,
      personalLoanTermMonths: 84,
      personalLoanMonthlyPayment: 412.98,
      personalLoanTotalInterest: 14650.32,
      personalLoanInterestForHold: 1700,
    } as any;
    const analysis = calculateDealAnalysis(deal);
    // Total holding costs should include personal loan payments during hold
    expect(analysis.totalHoldingCosts).toBeGreaterThan(baseDeal.loanMonthlyInterest * baseDeal.holdPeriodMonths);
    // Net profit should be lower due to personal loan payments
    expect(analysis.netProfit).toBeLessThan(33321);
  });

  it('should calculate correct cash split between Brandon and Aakash', () => {
    const analysis = calculateDealAnalysis(baseDeal);
    // Brandon: personal loan payments during hold (0 in this case)
    expect(analysis.cashRequiredBrandon).toBe(0);
    // Aakash: taxes+insurance+utilities + HML interest + HML downpayment + closing costs
    // downpayment = 100000 * 12/100 = 12000
    // interest = 880 * 6 = 5280
    // aakash = 7400 + 5280 + 12000 + 3999 = 28679
    expect(analysis.cashRequiredAakash).toBe(7400 + 5280 + 12000 + 3999);
  });
});
