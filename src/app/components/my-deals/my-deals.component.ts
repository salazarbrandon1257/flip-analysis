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

  onDealAdded(): void {
    // Scroll to top of deals list after adding
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
