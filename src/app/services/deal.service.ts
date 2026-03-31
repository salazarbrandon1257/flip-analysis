import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Deal, DealAnalysis, calculateDealAnalysis } from '../models/deal';

@Injectable({
  providedIn: 'root',
})
export class DealService {
  private readonly storageKey = 'flip-deals';
  private dealsSubject = new BehaviorSubject<Deal[]>([]);

  constructor() {
    this.loadDeals();
  }

  get deals$(): Observable<Deal[]> {
    return this.dealsSubject.asObservable();
  }

  get deals(): Deal[] {
    return this.dealsSubject.getValue();
  }

  get analyzedDeals(): DealAnalysis[] {
    return this.deals.map(calculateDealAnalysis);
  }

  addDeal(deal: Omit<Deal, 'id' | 'createdAt'>): void {
    const newDeal: Deal = {
      ...deal,
      id: this.generateId(),
      createdAt: new Date(),
    };
    const updatedDeals = [...this.deals, newDeal];
    this.dealsSubject.next(updatedDeals);
    this.saveDeals();
  }

  updateDeal(id: string, deal: Partial<Deal>): void {
    const updatedDeals = this.deals.map((d) =>
      d.id === id ? { ...d, ...deal } : d
    );
    this.dealsSubject.next(updatedDeals);
    this.saveDeals();
  }

  deleteDeal(id: string): void {
    const updatedDeals = this.deals.filter((d) => d.id !== id);
    this.dealsSubject.next(updatedDeals);
    this.saveDeals();
  }

  clearAll(): void {
    this.dealsSubject.next([]);
    localStorage.removeItem(this.storageKey);
  }

  private loadDeals(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const deals = JSON.parse(stored);
        // Convert date strings back to Date objects
        const parsedDeals = deals.map((d: any) => ({
          ...d,
          createdAt: new Date(d.createdAt),
        }));
        this.dealsSubject.next(parsedDeals);
      }
    } catch (error) {
      console.error('Error loading deals from storage:', error);
    }
  }

  private saveDeals(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.deals));
    } catch (error) {
      console.error('Error saving deals to storage:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
