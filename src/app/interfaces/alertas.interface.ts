export interface Alerta {

  id?: string;

  tipo: string;

  veiculoId: string;

  modelo: string;

  placa: string;

  kmAtual: number;

  kmLimite: number;

  visualizado: boolean;

  data: string;
}