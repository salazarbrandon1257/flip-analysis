import { Component } from '@angular/core';
import { DealService } from '../../services/deal.service';
import { DealAnalysis } from '../../models/deal';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
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
    const sum = this.analyzedDeals.reduce((acc, deal) => acc + deal.roi, 0);
    return sum / this.analyzedDeals.length;
  }
}
