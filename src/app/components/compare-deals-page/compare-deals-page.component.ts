import { Component } from '@angular/core';
import { DealService } from '../../services/deal.service';
import { DealAnalysis } from '../../models/deal';

@Component({
    selector: 'app-compare-deals-page',
    templateUrl: './compare-deals-page.component.html',
    styleUrls: ['./compare-deals-page.component.scss'],
    standalone: false
})
export class CompareDealsPageComponent {
  selectedDealIds: Set<string> = new Set();

  constructor(public dealService: DealService) {}

  get analyzedDeals(): DealAnalysis[] {
    return this.dealService.analyzedDeals;
  }

  get selectedDeals(): DealAnalysis[] {
    return this.analyzedDeals.filter(d => this.selectedDealIds.has(d.deal.id));
  }

  toggleDealSelection(dealId: string): void {
    const next = new Set(this.selectedDealIds);
    if (next.has(dealId)) {
      next.delete(dealId);
    } else {
      next.add(dealId);
    }
    this.selectedDealIds = next;
  }

  selectAll(): void {
    this.analyzedDeals.forEach(d => this.selectedDealIds.add(d.deal.id));
  }

  clearSelection(): void {
    this.selectedDealIds.clear();
  }

  isGoodDeal(analysis: DealAnalysis): boolean {
    return analysis.profitMargin >= 15 && analysis.vsMAO70 <= 0;
  }
}
