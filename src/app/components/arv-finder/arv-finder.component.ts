import { Component } from '@angular/core';
import { DealService } from '../../services/deal.service';
import { Deal } from '../../models/deal';

interface Comp {
  address: string;
  soldPrice: number;
  sqft: number;
  beds: number;
  baths: number;
  yearBuilt: number;
  distanceMiles: number;
  soldDate: string;
}

@Component({
  selector: 'app-arv-finder',
  templateUrl: './arv-finder.component.html',
  styleUrls: ['./arv-finder.component.scss'],
  standalone: false
})
export class ArvFinderComponent {
  selectedDealId: string = '';
  comps: Comp[] = [];
  avgCompPrice: number = 0;
  avgPricePerSqft: number = 0;
  suggestedArv: number = 0;

  constructor(private dealService: DealService) {
    this.resetForm();
  }

  get deals(): Deal[] {
    return this.dealService.deals;
  }

  resetForm(): void {
    this.comps = [
      this.emptyComp(),
      this.emptyComp(),
      this.emptyComp(),
    ];
    this.calculateArv();
  }

  addComp(): void {
    this.comps.push(this.emptyComp());
  }

  removeComp(index: number): void {
    this.comps.splice(index, 1);
    this.calculateArv();
  }

  emptyComp(): Comp {
    return {
      address: '',
      soldPrice: 0,
      sqft: 0,
      beds: 3,
      baths: 2,
      yearBuilt: 2000,
      distanceMiles: 0.5,
      soldDate: '',
    };
  }

  calculateArv(): void {
    const validComps = this.comps.filter(c => c.soldPrice > 0);
    if (validComps.length === 0) {
      this.avgCompPrice = 0;
      this.avgPricePerSqft = 0;
      this.suggestedArv = 0;
      return;
    }

    this.avgCompPrice = Math.round(
      validComps.reduce((sum, c) => sum + c.soldPrice, 0) / validComps.length
    );

    const compsSqft = validComps.filter(c => c.sqft > 0);
    this.avgPricePerSqft = compsSqft.length > 0
      ? Math.round(validComps.reduce((sum, c) => sum + (c.soldPrice / c.sqft), 0) / validComps.length)
      : 0;

    // Suggested ARV: average sold price rounded
    this.suggestedArv = this.avgCompPrice;
  }
}
