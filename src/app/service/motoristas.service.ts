import { computed, Injectable, signal } from '@angular/core';
import { Motorista } from '../interfaces/motorista.interface';

@Injectable({
  providedIn: 'root'
})
export class MotoristasService {

   private _motoristas = signal<Motorista[]>([
    {
      id: 1, nome: 'John', sobrenome: 'Lima', celular: '68999887766', cargo: 'Tecnico'
    },
    {
      id: 2, nome: 'Anderson', sobrenome: 'Camargo', celular: '68999887766', cargo: 'Gerente'
    },
    {
      id: 3, nome: 'Felipinho', sobrenome: 'safado', celular: '68999887766', cargo: 'Tecnico'
    },   
    {
      id: 4, nome: 'Cristian', sobrenome: 'Chefe', celular: '68999887766', cargo: 'CEO'
    },   
    {
      id: 5, nome: 'Ruan', sobrenome: 'Mendoça', celular: '68999887766', cargo: 'Tecnico'
    },   
    {
      id: 6, nome: 'Ruan', sobrenome: 'Mendoça', celular: '68999887766', cargo: 'Tecnico'
    },   
    {
      id: 7, nome: 'Ruan', sobrenome: 'Mendoça', celular: '68999887766', cargo: 'Tecnico'
    },   
  ]);

  // Expondo o signal como um computed para garantir imutabilidade externa
  motoristas = computed(() => this._motoristas());

  constructor() { }

  // Exemplo de método para adicionar um motorista
  addMotorista(motorista: Motorista): void {
    this._motoristas.update(currentMotoristas => [...currentMotoristas, motorista]);
  }

  // Exemplo de método para atualizar um motorista
  updateMotorista(updatedMotorista: Motorista): void {
    this._motoristas.update(currentMotoristas => 
      currentMotoristas.map(m => m.id === updatedMotorista.id ? updatedMotorista : m)
    );
  }

  // Exemplo de método para remover um motorista
  deleteMotorista(id: number): void {
    this._motoristas.update(currentMotoristas => 
      currentMotoristas.filter(m => m.id !== id)
    );
  }

  // Exemplo de método para obter um motorista por ID
  getMotoristaById(id: number): Motorista | undefined {
    return this._motoristas().find(m => m.id === id);
  }
}
