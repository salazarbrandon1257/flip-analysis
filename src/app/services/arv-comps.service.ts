import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { Comp } from '../components/arv-finder/arv-finder.component';

@Injectable({
  providedIn: 'root',
})
export class ArvCompsService {
  private firestore = inject(Firestore);
  private collectionName = 'arvComps';

  async loadComps(userId: string, dealId: string): Promise<Comp[]> {
    const compsCollection = collection(this.firestore, this.collectionName);
    const q = query(compsCollection, where('userId', '==', userId), where('dealId', '==', dealId));
    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
      return snapshot.docs[0].data()['comps'] || [];
    }
    return [];
  }

  async saveComps(userId: string, dealId: string, comps: Comp[]): Promise<string> {
    const compsCollection = collection(this.firestore, this.collectionName);
    const q = query(compsCollection, where('userId', '==', userId), where('dealId', '==', dealId));
    const snapshot = await getDocs(q);

    const data = { userId, dealId, comps, updatedAt: new Date() };

    if (snapshot.docs.length > 0) {
      const docRef = doc(this.firestore, this.collectionName, snapshot.docs[0].id);
      await updateDoc(docRef, data);
      return docRef.id;
    } else {
      const docRef = await addDoc(compsCollection, data);
      return docRef.id;
    }
  }

  async deleteComps(userId: string, dealId: string): Promise<void> {
    const compsCollection = collection(this.firestore, this.collectionName);
    const q = query(compsCollection, where('userId', '==', userId), where('dealId', '==', dealId));
    const snapshot = await getDocs(q);

    for (const d of snapshot.docs) {
      await deleteDoc(d.ref);
    }
  }
}
