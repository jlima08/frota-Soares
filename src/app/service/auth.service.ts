import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Motorista } from './../interfaces/motorista.interface';
import { MotoristasService } from './motoristas.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _currentUser = signal<Motorista | null>(null);
  currentUser = this._currentUser.asReadonly();

  constructor(private motoristasService: MotoristasService, private router: Router) { }

  login(nome: string, senha: string): boolean {
    const motorista = this.motoristasService.getMotoristaByNome(nome);

    if (motorista && motorista.senha === senha) {
      this._currentUser.set(motorista);
      // Em um cenário real, você armazenaria um token JWT aqui
      console.log('Login bem-sucedido para:', motorista.nome);
      this.router.navigate(['/restrito/veiculos']); // Redirecionar para uma página protegida
      return true;
    }
    this._currentUser.set(null);
    console.log('Falha no login para:', nome);
    return false;
  }

  logout(): void {
    this._currentUser.set(null);
    this.router.navigate(['/login']); // Redirecionar para a página de login
  }

  isAuthenticated(): boolean {
    return this._currentUser() !== null;
  }

  hasRole(role: 'Administrador' | 'Motorista'): boolean {
    return this._currentUser()?.role === role;
  }
}