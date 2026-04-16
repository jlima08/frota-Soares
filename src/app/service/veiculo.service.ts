import { Injectable, signal, computed } from '@angular/core';
import { Veiculo } from '../interfaces/veiculo.interface';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {

  private _veiculos = signal<Veiculo[]>([
    {
      id: 1, modelo: 'Gol bolinha', ano: '2000', placa: 'OVG2441', cor: 'Prata'
    },
    {
      id: 2, modelo: 'Gol g4', ano: '2001', placa: 'OVG2441', cor: 'Prata'
    },
    {
      id: 3, modelo: 'Strada', ano: '2002', placa: 'OVG2441', cor: 'Branco'
    },   
    {
      id: 4, modelo: 'Strada', ano: '2002', placa: 'OVG2441', cor: 'Branco'
    },   
    {
      id: 5, modelo: 'Strada', ano: '2002', placa: 'OVG2441', cor: 'Branco'
    },   
  ]);

  // Expondo o signal como um computed para garantir imutabilidade externa
  veiculos = computed(() => this._veiculos());

  constructor() { }

  // Exemplo de método para adicionar um veículo
  addVeiculo(veiculo: Veiculo): void {
    this._veiculos.update(currentVeiculos => [...currentVeiculos, veiculo]);
  }

  // Exemplo de método para atualizar um veículo
  updateVeiculo(updatedVeiculo: Veiculo): void {
    this._veiculos.update(currentVeiculos => 
      currentVeiculos.map(v => v.id === updatedVeiculo.id ? updatedVeiculo : v)
    );
  }

  // Exemplo de método para remover um veículo
  deleteVeiculo(id: number): void {
    this._veiculos.update(currentVeiculos => 
      currentVeiculos.filter(v => v.id !== id)
    );
  }

  // Exemplo de método para obter um veículo por ID
  getVeiculoById(id: number): Veiculo | undefined {
    return this._veiculos().find(v => v.id === id);
  }
}
