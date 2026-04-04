import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Deal, DealAnalysis, DEAL_STATUSES, statusColor, statusBackground } from '../../models/deal';
import { DealService } from '../../services/deal.service';

@Component({
    selector: 'app-deal-list',
    templateUrl: './deal-list.component.html',
    styleUrls: ['./deal-list.component.scss'],
    standalone: false
})
export class DealListComponent {
  activeFilter = 'All';
  readonly filterOptions = ['All', ...DEAL_STATUSES];
  statusColor = statusColor;
  statusBackground = statusBackground;

  constructor(private dealService: DealService) {}

  get analyzedDeals(): DealAnalysis[] {
    return this.dealService.analyzedDeals;
  }

  get filteredDeals(): DealAnalysis[] {
    if (this.activeFilter === 'All') return this.analyzedDeals;
    return this.analyzedDeals.filter(d => d.deal.status === this.activeFilter);
  }

  statusCount(status: string): number {
    if (status === 'All') return this.analyzedDeals.length;
    return this.analyzedDeals.filter(d => d.deal.status === status).length;
  }

  setFilter(status: string): void {
    this.activeFilter = status;
  }

  deleteDeal(id: string): void {
    if (confirm('Are you sure you want to delete this deal?')) {
      this.dealService.deleteDeal(id);
    }
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

  getProfitClass(netProfit: number): string {
    if (netProfit > 0) return 'profit-positive';
    if (netProfit < 0) return 'profit-negative';
    return 'profit-neutral';
  }
}
