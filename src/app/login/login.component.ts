import { Component, inject, signal } from '@angular/core';
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from "primeng/button";
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FloatLabelModule, InputTextModule, ButtonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username = signal<string>('');
  password = signal<string>('');
  errorMessage = signal<string | null>(null);

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() { }

  onLogin(): void {
    this.errorMessage.set(null);
    if (this.authService.login(this.username(), this.password())) {
      // Login bem-sucedido, o AuthService já redireciona
    } else {
      this.errorMessage.set('Usuário ou senha inválidos.');
    }
  }

}
