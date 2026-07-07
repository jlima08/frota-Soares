export interface Movimentacao {

  id?: string;
  motoristaId: string;
  motoristaNome: string;
  veiculoId: string;
  modelo: string;
  placa: string;
  observacao: string;
  dataRetirada: string;
  dataDevolucao?: string | null;
  status: 'Em uso' | 'Finalizado';
  kmRetirada?: number;
  kmDevolucao?: number;
  tipo: 'Carro' | 'Moto';
  fotosRetirada?: {
  painel?: string;
  frente?: string;
  traseira?: string;
  lateralEsquerda?: string;
  lateralDireita?: string;
};
fotosDevolucao?: {
  painel?: string;
  frente?: string;
  traseira?: string;
  lateralEsquerda?: string;
  lateralDireita?: string;
};
observacaoDevolucao?: string;
 abastecimento?: {
    houveAbastecimento: boolean;
    km?: number;
    fotoNota?: string;
    fotoPainel?: string;
    data?: string;
    valorAbastecido: number;
    litrosAbastecido: number;
  };
}