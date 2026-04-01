import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Deal, DealAnalysis, calculateDealAnalysis } from '../models/deal';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DealService {
  private readonly collectionName = 'deals';
  private dealsSubject = new BehaviorSubject<Deal[]>([]);
  private isInitialized = false;
  private firestore = inject(Firestore);

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

  async addDeal(deal: Omit<Deal, 'id' | 'createdAt'>): Promise<string> {
    const newDeal: Deal = {
      ...deal,
      id: this.generateId(),
      createdAt: new Date(),
    };

    try {
      const dealsCollection = collection(this.firestore, this.collectionName);
      const docRef = await addDoc(dealsCollection, {
        ...newDeal,
        createdAt: Timestamp.fromDate(newDeal.createdAt),
      });

      // Update the deal with the actual Firestore document ID
      const dealWithDocId = { ...newDeal, id: docRef.id };
      await updateDoc(docRef, { id: docRef.id });

      const updatedDeals = [...this.deals, dealWithDocId];
      this.dealsSubject.next(updatedDeals);

      return docRef.id;
    } catch (error) {
      console.error('Error adding deal:', error);
      throw error;
    }
  }

  async updateDeal(id: string, deal: Partial<Deal>): Promise<void> {
    try {
      const dealDoc = doc(this.firestore, this.collectionName, id);
      await updateDoc(dealDoc, deal);

      const updatedDeals = this.deals.map((d) =>
        d.id === id ? { ...d, ...deal } : d
      );
      this.dealsSubject.next(updatedDeals);
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error;
    }
  }

  async deleteDeal(id: string): Promise<void> {
    try {
      const dealDoc = doc(this.firestore, this.collectionName, id);
      await deleteDoc(dealDoc);

      const updatedDeals = this.deals.filter((d) => d.id !== id);
      this.dealsSubject.next(updatedDeals);
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  }

  clearAll(): void {
    this.dealsSubject.next([]);
  }

  private async loadDeals(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const dealsCollection = collection(this.firestore, this.collectionName);
      const q = query(dealsCollection, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);

      const deals: Deal[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: (data['createdAt'] as Timestamp)?.toDate() || new Date(),
        } as Deal;
      });

      this.dealsSubject.next(deals);
      this.isInitialized = true;
    } catch (error) {
      console.error('Error loading deals from Firestore:', error);
      this.isInitialized = true;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
