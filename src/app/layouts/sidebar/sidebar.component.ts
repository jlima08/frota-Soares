import { Component, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    public authService = inject(AuthService);
  open: boolean = false; // Propriedade para controlar a classe 'closed' do menu

  constructor() { }

  // Método para verificar se o usuário é administrador
  isAdmin(): boolean {
    return this.authService.hasRole('Administrador');
  }

  // Método para verificar se o usuário é motorista
  isMotorista(): boolean {
    return this.authService.hasRole('Motorista');
  }

  // Método para verificar se o usuário está logado
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  // Método para obter a role do usuário logado
  getUserRole(): string | undefined {
    return this.authService.currentUser()?.role;
  }

}
