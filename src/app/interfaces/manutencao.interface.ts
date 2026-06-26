export interface Manutencao {

  id?: string;

  veiculoId: string;

  modelo: string;

  placa: string;
  tipoVeiculo: 'Carro' | 'Moto';

  tipo: string;

  km: number;

  servicoRealizado: string;

  produtosUtilizados: string;

  oficina: string;

  valor: number;

  data: string;

}