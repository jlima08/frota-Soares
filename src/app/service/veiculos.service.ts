import { inject, Injectable } from '@angular/core';

import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { Veiculo } from '../interfaces/veiculo.interface';

@Injectable({
  providedIn: 'root',
})
export class VeiculosService {
  private firestore = inject(Firestore);

  cadastrar(veiculo: Veiculo) {
    const veiculoRef = collection(this.firestore, 'veiculos');

    return addDoc(veiculoRef, veiculo);
  }

  listar(): Observable<Veiculo[]> {
    const veiculoRef = collection(this.firestore, 'veiculos');

    return collectionData(veiculoRef, {
      idField: 'id',
    }) as Observable<Veiculo[]>;
  }

  atualizar(id: string, veiculo: Partial<Veiculo>) {
    const veiculoDoc = doc(this.firestore, `veiculos/${id}`);

    return updateDoc(veiculoDoc, veiculo);
  }

  deletar(id: string) {
    const veiculoDoc = doc(this.firestore, `veiculos/${id}`);

    return deleteDoc(veiculoDoc);
  }

  buscarPorId(id: string) {
    const veiculoDoc = doc(this.firestore, `veiculos/${id}`);

    return docData(veiculoDoc, { idField: 'id' }) as Observable<Veiculo>;
  }
}
