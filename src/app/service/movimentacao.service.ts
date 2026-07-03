import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Movimentacao } from '../interfaces/movimentacao.interface';

@Injectable({
  providedIn: 'root',
})
export class MovimentacaoService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  cadastrar(movimentacao: Movimentacao) {
    const movimentacaoRef = collection(this.firestore, 'movimentacoes');

    return addDoc(movimentacaoRef, movimentacao);
  }

  listar(): Observable<Movimentacao[]> {
    const movimentacaoRef = collection(this.firestore, 'movimentacoes');

    return collectionData(movimentacaoRef, { idField: 'id' }) as Observable<
      Movimentacao[]
    >;
  }

  finalizarMovimentacao(id: string) {
    const movimentacaoDoc = doc(this.firestore, `movimentacoes/${id}`);

    return updateDoc(movimentacaoDoc, {
      status: 'Finalizado',

      dataDevolucao: new Date().toISOString(),
    });
  }

  atualizar(id: string, dados: Partial<Movimentacao>) {
    const movimentacaoDoc = doc(this.firestore, `movimentacoes/${id}`);

    return updateDoc(movimentacaoDoc, dados);
  }

  async uploadImagem(file: File) {
    const nomeArquivo = `movimentacoes/${Date.now()}_${file.name}`;

    const storageRef = ref(this.storage, nomeArquivo);

    await uploadBytes(storageRef, file);

    return await getDownloadURL(storageRef);
  }

  criarAlerta(alerta: any) {
    const ref = collection(this.firestore, 'alertas');

    return addDoc(ref, alerta);
  }
  listarAlertas() {
    const ref = collection(this.firestore, 'alertas');

    const q = query(ref, where('ativo', '==', true));

    return collectionData(q, { idField: 'id' });
  }

  async verificarAlertaTrocaOleo(veiculoId: string): Promise<boolean> {
    const ref = collection(this.firestore, 'alertas');

    const q = query(
      ref,
      where('veiculoId', '==', veiculoId),
      where('tipo', '==', 'troca_oleo'),
      where('ativo', '==', true),
    );

    const resultado = await getDocs(q);

    return !resultado.empty;
  }
  async limparAlerta(id: string) {
    const alertaDoc = doc(this.firestore, `alertas/${id}`);

    return updateDoc(alertaDoc, {
      ativo: false,
    });
  }
}
