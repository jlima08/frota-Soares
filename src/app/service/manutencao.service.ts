import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Manutencao } from '../interfaces/manutencao.interface';

@Injectable({
  providedIn: 'root',
})
export class ManutencaoService {
  private firestore = inject(Firestore);

  cadastrar(manutencao: Manutencao) {
    const ref = collection(this.firestore, 'manutencoes');
    return addDoc(ref, manutencao);
  }

  listar(): Observable<Manutencao[]> {
    const ref = collection(this.firestore, 'manutencoes');

    return collectionData(ref, { idField: 'id' }) as Observable<Manutencao[]>;
  }

  listarPorVeiculo(veiculoId: string): Observable<Manutencao[]> {
    const ref = collection(this.firestore, 'manutencoes');
    const q = query(ref, where('veiculoId', '==', veiculoId));
    return collectionData(q, { idField: 'id' }) as Observable<Manutencao[]>;
  }
}
