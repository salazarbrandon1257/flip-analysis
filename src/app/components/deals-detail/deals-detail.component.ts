import { Component } from '@angular/core';
import { DealService } from '../../services/deal.service';
import { DealAnalysis } from '../../models/deal';

@Component({
  selector: 'app-deals-detail',
  templateUrl: './deals-detail.component.html',
  styleUrls: ['./deals-detail.component.scss'],
})
export class DealsDetailComponent {
  expandedDealId: string | null = null;

  constructor(public dealService: DealService) {}

  get analyzedDeals(): DealAnalysis[] {
    return this.dealService.analyzedDeals;
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
}
