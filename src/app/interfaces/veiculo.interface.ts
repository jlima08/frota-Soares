export interface Veiculo {
  id?: string;
  modelo: string;
  ano: string;
  placa: string;
  cor: string;
  status: 'Ativo' | 'Em uso' | 'Inativo';
  tipo: 'Carro' | 'Moto';
  foto?:string
  kmAtual?: number;
  kmUltimaTrocaOleo?: number;
  kmProximaTrocaOleo?: number;
}