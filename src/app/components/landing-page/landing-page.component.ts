import { Component } from '@angular/core';
import { DealService } from '../../services/deal.service';
import { DealAnalysis, statusColor, statusBackground } from '../../models/deal';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  standalone: false,
})
export class LandingPageComponent {
  statusColor = statusColor;
  statusBackground = statusBackground;

  constructor(public dealService: DealService) {}

  get analyzedDeals(): DealAnalysis[] {
    return this.dealService.analyzedDeals;
  }

  get totalDeals(): number {
    return this.analyzedDeals.length;
  }

  get totalProfit(): number {
    return this.analyzedDeals.reduce((sum, deal) => sum + deal.netProfit, 0);
  }

  get averageRoi(): number {
    if (this.analyzedDeals.length === 0) return 0;
    return this.analyzedDeals.reduce((acc, deal) => acc + deal.roi, 0) / this.analyzedDeals.length;
  }

  get bestDeal(): DealAnalysis | null {
    if (this.analyzedDeals.length === 0) return null;
    return this.analyzedDeals.reduce((best, d) => d.profitMargin > best.profitMargin ? d : best);
  }

  get pipeline(): { status: string; count: number; color: string }[] {
    const counts: Record<string, number> = {};
    for (const deal of this.analyzedDeals) {
      counts[deal.deal.status] = (counts[deal.deal.status] || 0) + 1;
    }
    const order = ['Analyzing', 'Offer Made', 'Contract', 'Rehab', 'Listed', 'Sold', 'Passed'];
    return order.map(status => ({
      status,
      count: counts[status] || 0,
      color: statusColor(status),
    }));
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  }
}
