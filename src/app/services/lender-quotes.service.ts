import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Firestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  where,
} from '@angular/fire/firestore';

export interface PersonalLoanQuote {
  id?: string;
  createdAt: Date;
  lenderName: string;
  loanAmount: number;
  apr: number;
  termMonths: number;
  holdPeriodMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  notes?: string;
}

export interface HardMoneyQuote {
  id?: string;
  createdAt: Date;
  lenderName: string;
  purchasePrice: number;
  downPaymentPercent: number;
  rehabCosts: number;
  interestRate: number;
  holdPeriodMonths: number;
  originationFeePercent: number;
  documentationFee: number;
  downPayment: number;
  loanAmount: number;
  monthlyInterest: number;
  totalInterest: number;
  totalCost: number;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class LenderQuotesService {
  private firestore = inject(Firestore);
  private personalQuotesSubject = new BehaviorSubject<PersonalLoanQuote[]>([]);
  private hardMoneyQuotesSubject = new BehaviorSubject<HardMoneyQuote[]>([]);

  personalQuotes$ = this.personalQuotesSubject.asObservable();
  hardMoneyQuotes$ = this.hardMoneyQuotesSubject.asObservable();

  get personalQuotes(): PersonalLoanQuote[] {
    return this.personalQuotesSubject.value;
  }

  get hardMoneyQuotes(): HardMoneyQuote[] {
    return this.hardMoneyQuotesSubject.value;
  }

  constructor() {
    this.loadAllQuotes();
  }

  async addPersonalLoanQuote(quote: Omit<PersonalLoanQuote, 'id' | 'createdAt'>): Promise<void> {
    const data: Record<string, unknown> = { createdAt: Timestamp.fromDate(new Date()) };
    for (const [key, value] of Object.entries(quote)) {
      if (value !== undefined) data[key] = value;
    }
    const col = collection(this.firestore, 'personalLoanQuotes');
    await addDoc(col, data);
    await this.loadPersonalQuotes();
  }

  async addHardMoneyQuote(quote: Omit<HardMoneyQuote, 'id' | 'createdAt'>): Promise<void> {
    const data: Record<string, unknown> = { createdAt: Timestamp.fromDate(new Date()) };
    for (const [key, value] of Object.entries(quote)) {
      if (value !== undefined) data[key] = value;
    }
    const col = collection(this.firestore, 'hardMoneyQuotes');
    await addDoc(col, data);
    await this.loadHardMoneyQuotes();
  }

  async deletePersonalLoanQuote(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'personalLoanQuotes', id));
    await this.loadPersonalQuotes();
  }

  async deleteHardMoneyQuote(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'hardMoneyQuotes', id));
    await this.loadHardMoneyQuotes();
  }

  private async loadAllQuotes(): Promise<void> {
    await Promise.all([this.loadPersonalQuotes(), this.loadHardMoneyQuotes()]);
  }

  private async loadPersonalQuotes(): Promise<void> {
    const col = collection(this.firestore, 'personalLoanQuotes');
    const q = query(col, orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);
    const quotes: PersonalLoanQuote[] = snap.docs.map(d => ({
      ...d.data() as any,
      id: d.id,
      createdAt: (d.data()['createdAt'] as Timestamp)?.toDate() || new Date(),
    }));
    this.personalQuotesSubject.next(quotes);
  }

  private async loadHardMoneyQuotes(): Promise<void> {
    const col = collection(this.firestore, 'hardMoneyQuotes');
    const q = query(col, orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);
    const quotes: HardMoneyQuote[] = snap.docs.map(d => ({
      ...d.data() as any,
      id: d.id,
      createdAt: (d.data()['createdAt'] as Timestamp)?.toDate() || new Date(),
    }));
    this.hardMoneyQuotesSubject.next(quotes);
  }
}
