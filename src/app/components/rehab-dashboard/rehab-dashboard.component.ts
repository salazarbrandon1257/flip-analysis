import { Component } from '@angular/core';
import { DealService } from '../../services/deal.service';
import { DealAnalysis } from '../../models/deal';

@Component({
    selector: 'app-rehab-dashboard',
    templateUrl: './rehab-dashboard.component.html',
    styleUrls: ['./rehab-dashboard.component.scss'],
    standalone: false
})
export class RehabDashboardComponent {
  activeTab: 'budget' | 'costs' | 'timeline' = 'budget';

  constructor(public dealService: DealService) {}

  get analyzedDeals(): DealAnalysis[] {
    return this.dealService.analyzedDeals;
  }

  get totalRehabBudget(): number {
    return this.analyzedDeals.reduce((sum, d) => sum + d.deal.rehabCosts, 0);
  }

  get averageRehabCost(): number {
    if (this.analyzedDeals.length === 0) return 0;
    return this.totalRehabBudget / this.analyzedDeals.length;
  }

  get totalHoldPeriod(): number {
    return this.analyzedDeals.reduce((sum, d) => sum + d.deal.holdPeriodMonths, 0);
  }

  get highestRehabDeal(): DealAnalysis | null {
    if (this.analyzedDeals.length === 0) return null;
    return this.analyzedDeals.reduce((best, current) =>
      current.deal.rehabCosts > best.deal.rehabCosts ? current : best
    );
  }

  get lowestRehabDeal(): DealAnalysis | null {
    if (this.analyzedDeals.length === 0) return null;
    return this.analyzedDeals.reduce((best, current) =>
      current.deal.rehabCosts < best.deal.rehabCosts ? current : best
    );
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

  formatMonth(value: number): string {
    return value + 'mo';
  }

  rehabCostPercentOfProject(deal: DealAnalysis): number {
    if (deal.totalProjectCost === 0) return 0;
    return (deal.deal.rehabCosts / deal.totalProjectCost) * 100;
  }

  holdProgressPercent(deal: DealAnalysis): number {
    // Simplified: estimate months elapsed from createdAt
    const created = new Date(deal.deal.createdAt);
    const now = new Date();
    const monthsElapsed = Math.max(0,
      (now.getFullYear() - created.getFullYear()) * 12 +
      (now.getMonth() - created.getMonth())
    );
    if (deal.deal.holdPeriodMonths === 0) return 100;
    return Math.min(100, Math.round((monthsElapsed / deal.deal.holdPeriodMonths) * 100));
  }

  isGoodDeal(deal: DealAnalysis): boolean {
    return deal.profitMargin >= 15 && deal.vsMAO70 <= 0;
  }

  monthsRemaining(deal: DealAnalysis): number {
    const progress = this.holdProgressPercent(deal);
    const totalMonths = deal.deal.holdPeriodMonths;
    const elapsed = Math.round((progress / 100) * totalMonths);
    return Math.max(0, totalMonths - elapsed);
  }

  isOverHold(deal: DealAnalysis): boolean {
    return this.holdProgressPercent(deal) >= 100;
  }
}
