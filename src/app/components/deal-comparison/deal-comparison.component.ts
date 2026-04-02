import { Component } from '@angular/core';
import { DealAnalysis } from '../../models/deal';
import { DealService } from '../../services/deal.service';

@Component({
    selector: 'app-deal-comparison',
    templateUrl: './deal-comparison.component.html',
    styleUrls: ['./deal-comparison.component.scss'],
    standalone: false
})
export class DealComparisonComponent {
  selectedDealIds: string[] = [];

  constructor(public dealService: DealService) {}

  get analyzedDeals(): DealAnalysis[] {
    return this.dealService.analyzedDeals;
  }

  get selectedDeals(): DealAnalysis[] {
    return this.analyzedDeals.filter((d) =>
      this.selectedDealIds.includes(d.deal.id)
    );
  }

  toggleDealSelection(dealId: string): void {
    const index = this.selectedDealIds.indexOf(dealId);
    if (index > -1) {
      this.selectedDealIds.splice(index, 1);
    } else if (this.selectedDealIds.length < 4) {
      this.selectedDealIds.push(dealId);
    }
  }

  isSelected(dealId: string): boolean {
    return this.selectedDealIds.includes(dealId);
  }

  canSelectMore(): boolean {
    return this.selectedDealIds.length < 4;
  }

  clearSelection(): void {
    this.selectedDealIds = [];
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  formatPercent(value: number): string {
    return value.toFixed(1) + '%';
  }

  getBestDeal(metric: keyof DealAnalysis): DealAnalysis | null {
    if (this.selectedDeals.length === 0) return null;

    return this.selectedDeals.reduce((best, current) => {
      // For cost metrics, lower is better
      const costMetrics: (keyof DealAnalysis)[] = ['totalProjectCost', 'cashRequired', 'totalClosingCosts', 'totalHoldingCosts', 'totalSellingCosts'];
      if (costMetrics.includes(metric)) {
        return (current[metric] as number) < (best[metric] as number) ? current : best;
      }
      // For return metrics, higher is better
      return (current[metric] as number) > (best[metric] as number) ? current : best;
    });
  }

  isBest(deal: DealAnalysis, metric: keyof DealAnalysis): boolean {
    const best = this.getBestDeal(metric);
    return best?.deal.id === deal.deal.id;
  }

  getLowestPurchasePrice(): number {
    if (this.selectedDeals.length === 0) return 0;
    return Math.min(...this.selectedDeals.map(d => d.deal.purchasePrice));
  }

  isLowest(deal: DealAnalysis, metric: keyof DealAnalysis | 'purchasePrice' | 'cashRequired' | 'totalProjectCost'): boolean {
    if (this.selectedDeals.length === 0) return false;
    const values = this.selectedDeals.map(d => {
      if (metric === 'purchasePrice') return d.deal.purchasePrice;
      if (metric === 'cashRequired') return d.cashRequired;
      if (metric === 'totalProjectCost') return d.totalProjectCost;
      if (metric === 'totalHoldingCosts') return d.totalHoldingCosts;
      return d[metric] as number;
    });
    const min = Math.min(...values);
    const dealValue = metric === 'purchasePrice' ? deal.deal.purchasePrice :
                      metric === 'cashRequired' ? deal.cashRequired :
                      metric === 'totalProjectCost' ? deal.totalProjectCost :
                      metric === 'totalHoldingCosts' ? deal.totalHoldingCosts :
                      deal[metric] as number;
    return dealValue === min;
  }

  isHighest(deal: DealAnalysis, section: string, metric?: keyof DealAnalysis): boolean {
    if (this.selectedDeals.length === 0) return false;

    if (section === 'deal' && metric) {
      const values = this.selectedDeals.map(d => (d.deal as any)[metric]);
      const max = Math.max(...values);
      return (deal.deal as any)[metric] === max;
    }

    const values = this.selectedDeals.map(d => d[metric as keyof DealAnalysis] as number);
    const max = Math.max(...values);
    return deal[metric as keyof DealAnalysis] === max;
  }

  isHighestARV(deal: DealAnalysis): boolean {
    if (this.selectedDeals.length === 0) return false;
    const values = this.selectedDeals.map(d => d.deal.afterRepairValue);
    const max = Math.max(...values);
    return deal.deal.afterRepairValue === max;
  }

  isHighestNetProceeds(deal: DealAnalysis): boolean {
    if (this.selectedDeals.length === 0) return false;
    const values = this.selectedDeals.map(d => d.netSaleProceeds);
    const max = Math.max(...values);
    return deal.netSaleProceeds === max;
  }

  isHighestProfit(deal: DealAnalysis): boolean {
    if (this.selectedDeals.length === 0) return false;
    const values = this.selectedDeals.map(d => d.netProfit);
    const max = Math.max(...values);
    return deal.netProfit === max;
  }

  isHighestROI(deal: DealAnalysis): boolean {
    if (this.selectedDeals.length === 0) return false;
    const values = this.selectedDeals.map(d => d.roi);
    const max = Math.max(...values);
    return deal.roi === max;
  }

  isHighestMargin(deal: DealAnalysis): boolean {
    if (this.selectedDeals.length === 0) return false;
    const values = this.selectedDeals.map(d => d.profitMargin);
    const max = Math.max(...values);
    return deal.profitMargin === max;
  }

  isGoodDeal(deal: DealAnalysis): boolean {
    return deal.profitMargin >= 15 && deal.vsMAO70 <= 0;
  }
}
