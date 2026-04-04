import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DealService } from '../../services/deal.service';
import { DealAnalysis, Deal } from '../../models/deal';

// Parse comma-formatted string to number
function parseValue(val: any): number {
  if (typeof val === 'string') {
    return Number(val.replace(/,/g, '')) || 0;
  }
  return val || 0;
}

@Component({
    selector: 'app-deals-detail',
    templateUrl: './deals-detail.component.html',
    styleUrls: ['./deals-detail.component.scss'],
    standalone: false
})
export class DealsDetailComponent implements OnInit {
  expandedDealId: string | null = null;
  selectedDealId: string | null = null;
  editingField: string | null = null;
  editValue: string | number = '';

  constructor(
    public dealService: DealService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedDealId = params.get('id') || null;
      if (this.selectedDealId) {
        this.expandedDealId = this.selectedDealId;
      } else {
        this.expandedDealId = null;
        this.editingField = null;
      }
    });
  }

  onBack(): void {
    this.selectedDealId = null;
    this.expandedDealId = null;
    this.editingField = null;
  }

  startEdit(field: string, value: string | number): void {
    this.editingField = field;
    this.editValue = value;
  }

  cancelEdit(): void {
    this.editingField = null;
    this.editValue = '';
  }

  saveEdit(field: string): void {
    if (!this.selectedDealId || !this.selectedDeal) return;

    // Get the actual input value from the DOM
    const inputEl = document.querySelector('.inline-edit-input') as HTMLInputElement;
    const rawValue = inputEl?.value || String(this.editValue);

    const deal = this.selectedDeal.deal;
    const update: Partial<Deal> = {};

    switch (field) {
      case 'address':
        update.address = rawValue;
        break;
      case 'askingPrice':
        update.askingPrice = parseValue(rawValue);
        break;
      case 'purchasePrice':
        update.purchasePrice = parseValue(rawValue);
        // Recalculate derived values
        update.buyerClosingCosts = Math.round(update.purchasePrice * 0.01) + 999;
        update.titleClosingCosts = Math.round(update.purchasePrice * 0.02);
        const downPayment = deal.downPaymentPercent || 0;
        update.loanAmount = Math.round(update.purchasePrice * (1 - downPayment / 100));
        update.loanMonthlyInterest = Math.round(update.loanAmount * (deal.interestRatePercent / 100) / 12);
        break;
      case 'afterRepairValue':
        update.afterRepairValue = parseValue(rawValue);
        update.sellerClosingCosts = Math.round(update.afterRepairValue * 0.04);
        break;
      case 'rehabCosts':
        update.rehabCosts = parseValue(rawValue);
        break;
      case 'downPaymentPercent':
        update.downPaymentPercent = parseValue(rawValue);
        // Recalculate loan amount and monthly interest
        const newDownPayment = parseValue(rawValue);
        update.loanAmount = Math.round(deal.purchasePrice * (1 - newDownPayment / 100));
        update.loanMonthlyInterest = Math.round(update.loanAmount * (deal.interestRatePercent / 100) / 12);
        break;
      case 'interestRatePercent':
        update.interestRatePercent = parseValue(rawValue);
        // Recalculate loan monthly interest
        update.loanMonthlyInterest = Math.round(deal.loanAmount * (update.interestRatePercent / 100) / 12);
        break;
      case 'holdPeriodMonths':
        update.holdPeriodMonths = parseValue(rawValue);
        // Recalculate taxes/insurance/utilities
        const annualPropertyTax = deal.purchasePrice * 0.04;
        const holdPeriodPropertyTax = annualPropertyTax * (update.holdPeriodMonths / 12);
        const utilitiesCost = 400 * update.holdPeriodMonths;
        update.taxesInsuranceUtilities = Math.round(holdPeriodPropertyTax + utilitiesCost);
        break;
      case 'agentCommissionPercent':
        update.agentCommissionPercent = parseValue(rawValue);
        break;
      case 'personalLoanAmount':
        update.personalLoanAmount = parseValue(rawValue);
        // Recalculate personal loan values
        const personalLoanApr = 17;
        const personalLoanTermMonths = 84;
        const personalLoanMonthlyRate = personalLoanApr / 100 / 12;
        const personalLoanMonthlyPayment = update.personalLoanAmount > 0
          ? update.personalLoanAmount * (personalLoanMonthlyRate * Math.pow(1 + personalLoanMonthlyRate, personalLoanTermMonths)) / (Math.pow(1 + personalLoanMonthlyRate, personalLoanTermMonths) - 1)
          : 0;
        update.personalLoanApr = personalLoanApr;
        update.personalLoanTermMonths = personalLoanTermMonths;
        update.personalLoanMonthlyPayment = Math.round(personalLoanMonthlyPayment * 100) / 100;
        update.personalLoanTotalInterest = update.personalLoanAmount > 0
          ? (personalLoanMonthlyPayment * personalLoanTermMonths) - update.personalLoanAmount
          : 0;
        break;
    }

    this.dealService.updateDeal(this.selectedDealId, update);
    this.editingField = null;
    this.editValue = '';
  }

  onKeydown(event: KeyboardEvent, field: string): void {
    if (event.key === 'Enter') {
      this.saveEdit(field);
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  get analyzedDeals(): DealAnalysis[] {
    return this.dealService.analyzedDeals;
  }

  get selectedDeal(): DealAnalysis | undefined {
    if (!this.selectedDealId) return undefined;
    return this.analyzedDeals.find(d => d.deal.id === this.selectedDealId);
  }

  deleteDeal(id: string): void {
    if (confirm('Are you sure you want to delete this deal?')) {
      this.dealService.deleteDeal(id);
    }
  }

  toggleExpand(dealId: string): void {
    this.expandedDealId = this.expandedDealId === dealId ? null : dealId;
  }

  isExpanded(dealId: string): boolean {
    return this.expandedDealId === dealId;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  formatPercent(value: number): string {
    return value.toFixed(1) + '%';
  }

  formatMonth(value: number): string {
    return value + ' month' + (value !== 1 ? 's' : '');
  }

  isGoodDeal(analysis: DealAnalysis): boolean {
    return analysis.profitMargin >= 15 && analysis.vsMAO70 <= 0;
  }

  formatNumber(value: number): string {
    return value.toString();
  }
}
