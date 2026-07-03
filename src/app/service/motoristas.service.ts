import { computed, inject, Injectable, signal } from '@angular/core';
import { Motorista } from '../interfaces/motorista.interface';
import { Observable } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  docData,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class MotoristasService {
  private firestore = inject(Firestore);

  cadastrar(uid: string, motorista: Motorista) {
    const motoristaDoc = doc(this.firestore, `usuarios/${uid}`);

    return setDoc(motoristaDoc, motorista);
  }

  listar(): Observable<Motorista[]> {
    const motoristaRef = collection(this.firestore, 'usuarios');

    return collectionData(motoristaRef, {
      idField: 'id',
    }) as Observable<Motorista[]>;
  }

  atualizar(id: string, motorista: Partial<Motorista>) {
    const motoristaDoc = doc(this.firestore, `usuarios/${id}`);

    return updateDoc(motoristaDoc, motorista);
  }
  buscarPorUid(uid: string) {
    const motoristaDoc = doc(this.firestore, `usuarios/${uid}`);

    return docData(motoristaDoc, {
      idField: 'id',
    });
  }

  deletar(id: string) {
    const motoristaDoc = doc(this.firestore, `usuarios/${id}`);

    return deleteDoc(motoristaDoc);
  }
}
