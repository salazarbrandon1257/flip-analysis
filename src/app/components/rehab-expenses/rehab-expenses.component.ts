import { Component, OnInit } from '@angular/core';
import { DealService } from '../../services/deal.service';
import { ExpenseService } from '../../services/expense.service';
import { ExpenseEntry, EXPENSE_CATEGORIES } from '../../models/expense-entry';
import { DealAnalysis } from '../../models/deal';
import { Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-rehab-expenses',
  templateUrl: './rehab-expenses.component.html',
  styleUrls: ['./rehab-expenses.component.scss'],
  standalone: false,
})
export class RehabExpensesComponent implements OnInit {
  analyzedDeals: DealAnalysis[] = [];
  selectedDeal: DealAnalysis | null = null;
  expenses$: Observable<ExpenseEntry[]> = of([]);
  categories = EXPENSE_CATEGORIES;
  selectedDealIndex = 0;

  // Local editing state
  rows: {
    id: string;
    category: string;
    description: string;
    estimatedCost: string;
    actualCost: string;
    isNew: boolean;
  }[] = [];

  constructor(
    public dealService: DealService,
    public expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    this.analyzedDeals = this.dealService.analyzedDeals;
    if (this.analyzedDeals.length > 0) {
      this.selectDealByIndex(0);
    }
  }

  get expenseTotals$(): Observable<{ estimated: number; actual: number; variance: number }> {
    return this.expenses$.pipe(
      map((expenses) => ({
        estimated: this.expenseService.totalEstimated(expenses),
        actual: this.expenseService.totalActual(expenses),
        variance: this.expenseService.totalActual(expenses) - this.expenseService.totalEstimated(expenses),
      }))
    );
  }

  selectDealByIndex(index: number): void {
    this.selectedDealIndex = index;
    const deal = this.analyzedDeals[index];
    if (!deal) return;
    this.selectedDeal = deal;
    this.expenses$ = this.expenseService.getExpensesForDeal(deal.deal.id).pipe(
      switchMap((expenses) => {
        this.rows = expenses.map((e) => ({
          id: e.id,
          category: e.category,
          description: e.description,
          estimatedCost: String(e.estimatedCost),
          actualCost: String(e.actualCost),
          isNew: false,
        }));
        return of(expenses);
      }),
      shareReplay(1),
    );
  }

  addRow(): void {
    this.rows.push({
      id: '',
      category: this.categories[0],
      description: '',
      estimatedCost: '',
      actualCost: '',
      isNew: true,
    });
  }

  removeRow(index: number): void {
    this.rows.splice(index, 1);
  }

  rowVariance(row: { estimatedCost: string; actualCost: string }): number {
    return this.parseCurrency(row.actualCost) - this.parseCurrency(row.estimatedCost);
  }

  async save(): Promise<void> {
    if (!this.selectedDeal) return;

    for (const row of this.rows) {
      if (row.isNew) {
        if (!row.estimatedCost && !row.actualCost) continue;
        await this.expenseService.addExpense(this.selectedDeal.deal.id, {
          dealId: this.selectedDeal.deal.id,
          category: row.category,
          description: row.description,
          estimatedCost: this.parseCurrency(row.estimatedCost),
          actualCost: this.parseCurrency(row.actualCost),
        });
      } else {
        await this.expenseService.updateExpense({
          id: row.id,
          dealId: this.selectedDeal.deal.id,
          category: row.category,
          description: row.description,
          estimatedCost: this.parseCurrency(row.estimatedCost),
          actualCost: this.parseCurrency(row.actualCost),
          createdAt: new Date(),
        });
      }
    }

    this.selectDealByIndex(this.selectedDealIndex);
  }

  remaining(): number {
    const total = this.rows.reduce((sum, r) => sum + this.parseCurrency(r.actualCost), 0);
    return (this.selectedDeal?.deal.rehabCosts ?? 0) - total;
  }

  private parseCurrency(val: string): number {
    if (!val) return 0;
    return Number(val.replace(/[^0-9.\-]/g, '')) || 0;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
}
