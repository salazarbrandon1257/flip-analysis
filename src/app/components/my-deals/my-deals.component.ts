import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DealService } from '../../services/deal.service';
import { DealAnalysis } from '../../models/deal';

@Component({
    selector: 'app-my-deals',
    templateUrl: './my-deals.component.html',
    styleUrls: ['./my-deals.component.scss'],
    standalone: false
})
export class MyDealsComponent {
  constructor(
    public dealService: DealService,
    private router: Router
  ) {}

  get analyzedDeals(): DealAnalysis[] {
    return this.dealService.analyzedDeals;
  }

  deleteDeal(id: string): void {
    if (confirm('Are you sure you want to delete this deal?')) {
      this.dealService.deleteDeal(id);
    }
  }

  navigateToDeal(id: string): void {
    this.router.navigate(['/deals', id]);
  }

  onDealAdded(): void {
    // Scroll to top of deals list after adding
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  exportDealsToCsv(): void {
    const deals = this.analyzedDeals;
    if (deals.length === 0) return;

    const headers = [
      'Address',
      'Status',
      'Purchase Price',
      'Asking Price',
      'ARV',
      'Rehab Costs',
      'Buyer Closing Costs',
      'Title Closing Costs',
      'Down Payment %',
      'Interest Rate %',
      'Hold Period (Months)',
      'Loan Monthly Interest',
      'Personal Loan Amount',
      'Personal Loan APR',
      'Personal Loan Monthly Payment',
      'Taxes/Insurance/Utilities',
      'Agent Commission %',
      'Seller Closing Costs',
      'Total Project Cost',
      'Cash Required',
      'Net Profit',
      'ROI %',
      'Profit Margin %',
      'MAO 70%',
      'MAO 65%',
      'Notes',
    ];

    const rows = deals.map((d) => [
      `"${d.deal.address}"`,
      d.deal.status,
      d.deal.purchasePrice,
      d.deal.askingPrice,
      d.deal.afterRepairValue,
      d.deal.rehabCosts,
      d.deal.buyerClosingCosts,
      d.deal.titleClosingCosts,
      d.deal.downPaymentPercent,
      d.deal.interestRatePercent,
      d.deal.holdPeriodMonths,
      d.deal.loanMonthlyInterest,
      d.deal.personalLoanAmount,
      d.deal.personalLoanApr,
      d.deal.personalLoanMonthlyPayment,
      d.deal.taxesInsuranceUtilities,
      d.deal.agentCommissionPercent,
      d.deal.sellerClosingCosts,
      d.totalProjectCost,
      d.cashRequired,
      d.netProfit,
      d.roi,
      d.profitMargin,
      d.mao70,
      d.mao65,
      `"${d.deal.notes ?? ''}"`,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deals-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
