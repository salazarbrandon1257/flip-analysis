import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DealService } from '../../services/deal.service';
import { ArvCompsService } from '../../services/arv-comps.service';
import { Deal } from '../../models/deal';
import { Auth, authState } from '@angular/fire/auth';
import { firstValueFrom, timeout } from 'rxjs';

export interface Comp {
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
export class ArvFinderComponent implements OnInit {
  selectedDealId: string = '';
  comps: Comp[] = [];
  avgCompPrice: number = 0;
  avgPricePerSqft: number = 0;
  suggestedArv: number = 0;
  savedMessage = '';
  routeDealId: string | null = null;

  constructor(
    private dealService: DealService,
    private arvCompsService: ArvCompsService,
    private auth: Auth,
    private route: ActivatedRoute,
  ) {
    this.resetForm();
  }

  ngOnInit(): void {
    this.routeDealId = this.route.snapshot.paramMap.get('dealId');
    if (this.routeDealId) {
      this.selectedDealId = this.routeDealId;
      this.loadCompsForSelectedDeal();
    }
  }

  private async getUserId(): Promise<string | null> {
    try {
      const user = await firstValueFrom(authState(this.auth).pipe(timeout(1000)));
      return user?.uid ?? null;
    } catch {
      return null;
    }
  }

  onDealSelected(): void {
    this.loadCompsForSelectedDeal();
  }

  async loadCompsForSelectedDeal(): Promise<void> {
    if (!this.selectedDealId) {
      this.resetForm();
      return;
    }

    const userId = await this.getUserId();
    if (!userId) return;

    const saved = await this.arvCompsService.loadComps(userId, this.selectedDealId);
    if (saved.length > 0) {
      this.comps = [...saved];
    } else {
      this.resetForm();
      return;
    }
    this.calculateArv();
  }

  async saveComps(): Promise<void> {
    if (!this.selectedDealId) return;

    const userId = await this.getUserId();
    if (!userId) return;

    await this.arvCompsService.saveComps(userId, this.selectedDealId, this.comps);
    this.savedMessage = 'Saved!';
    setTimeout(() => { this.savedMessage = ''; }, 2000);
  }

  async clearComps(): Promise<void> {
    if (!this.selectedDealId) return;

    const userId = await this.getUserId();
    if (!userId) return;

    await this.arvCompsService.deleteComps(userId, this.selectedDealId);
    this.resetForm();
    this.savedMessage = 'Cleared!';
    setTimeout(() => { this.savedMessage = ''; }, 2000);
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
    this.savedMessage = '';
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
