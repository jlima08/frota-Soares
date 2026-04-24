export interface Motorista {
  id: number;
  nome: string;
  sobrenome: string;
  celular: string;
  cargo: string;
   senha?: string; // Senha é opcional, mas será usada para login
  role?: 'Administrador' | 'Motorista';
}
