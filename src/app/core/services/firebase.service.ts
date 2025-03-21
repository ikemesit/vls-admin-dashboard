import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firestore = inject(Firestore);

  getAll(
    collectionPath: string
  ): Observable<(DocumentData | (DocumentData & { id: string }))[]> {
    const ref = collection(this.firestore, collectionPath);
    return collectionData(ref, { idField: 'id' });
  }

  getById(
    collectionPath: string,
    id: string
  ): Observable<DocumentData | (DocumentData & { id: string }) | undefined> {
    const ref = doc(this.firestore, `${collectionPath}/${id}`);
    return docData(ref, { idField: 'id' });
  }

  async create(collectionPath: string, data: any): Promise<any> {
    const ref = collection(this.firestore, collectionPath);
    const docRef = await addDoc(ref, data);
    return { id: docRef.id, ...data };
  }

  async update(collectionPath: string, id: string, data: any): Promise<void> {
    const ref = doc(this.firestore, `${collectionPath}/${id}`);
    return updateDoc(ref, data);
  }

  async delete(collectionPath: string, id: string): Promise<void> {
    const ref = doc(this.firestore, `${collectionPath}/${id}`);
    return deleteDoc(ref);
  }
}
