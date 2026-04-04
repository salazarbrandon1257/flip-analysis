import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  collectionData,
} from '@angular/fire/firestore';
import { ExpenseEntry } from '../models/expense-entry';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private firestore: Firestore) {}

  addExpense(dealId: string, expense: Omit<ExpenseEntry, 'id' | 'createdAt'>): Promise<void> {
    const col = collection(this.firestore, 'rehabExpenses');
    return addDoc(col, {
      ...expense,
      dealId,
      createdAt: new Date(),
    }).then(() => {});
  }

  getExpensesForDeal(dealId: string): Observable<ExpenseEntry[]> {
    const col = collection(this.firestore, 'rehabExpenses');
    const q = query(col, where('dealId', '==', dealId));
    return collectionData(q, { idField: 'id' }).pipe(
      map((docs: any[]) =>
        docs.map((d: any) => ({
          ...d,
          createdAt: d.createdAt?.toDate?.() ?? new Date(),
          estimatedCost: d.estimatedCost ?? 0,
          actualCost: d.actualCost ?? 0,
        }))
      )
    );
  }

  updateExpense(expense: ExpenseEntry): Promise<void> {
    const ref = doc(this.firestore, 'rehabExpenses', expense.id);
    return updateDoc(ref, {
      category: expense.category,
      description: expense.description,
      estimatedCost: expense.estimatedCost,
      actualCost: expense.actualCost,
    });
  }

  deleteExpense(expenseId: string): Promise<void> {
    const ref = doc(this.firestore, 'rehabExpenses', expenseId);
    return deleteDoc(ref);
  }

  totalEstimated(expenses: ExpenseEntry[]): number {
    return expenses.reduce((sum, e) => sum + e.estimatedCost, 0);
  }

  totalActual(expenses: ExpenseEntry[]): number {
    return expenses.reduce((sum, e) => sum + e.actualCost, 0);
  }
}
