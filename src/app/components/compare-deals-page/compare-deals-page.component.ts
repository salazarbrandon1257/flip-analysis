import { Component } from '@angular/core';
import { DealService } from '../../services/deal.service';
import { DealAnalysis } from '../../models/deal';

@Component({
  selector: 'app-compare-deals-page',
  templateUrl: './compare-deals-page.component.html',
  styleUrls: ['./compare-deals-page.component.scss'],
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
    if (this.selectedDealIds.has(dealId)) {
      this.selectedDealIds.delete(dealId);
    } else {
      this.selectedDealIds.add(dealId);
    }
  }

  selectAll(): void {
    this.analyzedDeals.forEach(d => this.selectedDealIds.add(d.deal.id));
  }

  clearSelection(): void {
    this.selectedDealIds.clear();
  }
}
