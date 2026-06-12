import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from "primeng/button";
import { AuthService } from '../service/auth.service';
import { Auth, authState, onAuthStateChanged } from '@angular/fire/auth';
import { MotoristasService } from '../service/motoristas.service';
import { of, switchMap } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { Tooltip, TooltipModule } from "primeng/tooltip";
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { MovimentacaoService } from '../service/movimentacao.service';
import { MessageModule } from "primeng/message";


@Component({
  selector: 'app-layout-restrito',
  imports: [RouterOutlet, CommonModule, ButtonModule, RouterLink, RouterLinkActive, AvatarModule, AvatarGroupModule, TooltipModule, ToastModule, ConfirmDialogModule, DialogModule, MessageModule],
  templateUrl: './layout-restrito.component.html',
  styleUrl: './layout-restrito.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class LayoutRestritoComponent {
  anoAtual = new Date().getFullYear();
  private authService = inject(AuthService);
  private movimentacaoService = inject(MovimentacaoService);

private router = inject(Router);
private auth = inject(Auth);

private motoristaService = inject(MotoristasService);
constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

usuario: any;
  sidebarOpen = false;
   open: boolean = false;

   private timeout: any;

   
   

  ngOnInit(): void {

  onAuthStateChanged(this.auth, (usuarioLogado) => {

    if (usuarioLogado) {

      this.motoristaService
        .buscarPorUid(usuarioLogado.uid)
        .subscribe(resposta => {
          

          this.usuario = resposta;

          // console.log(this.usuario);
        });
    }
  });
  this.movimentacaoService
  .listarAlertas()
  .subscribe(alertas => {

    this.alertas = alertas;

    this.quantidadeAlertas =
      alertas.length;
  });

  this.iniciarMonitoramento();
}

ngOnDestroy(): void {

  clearTimeout(this.timeout);
}

getIniciais(nome: string | undefined , sobrenome: string | undefined): string {

   const inicialNome = nome ? nome[0] : '';

  const inicialSobrenome = sobrenome
    ? sobrenome[0]
    : '';

  return (
    inicialNome + inicialSobrenome
  ).toUpperCase();
}

  toggleSidebar() {
    
    this.open = !this.open;
  } 
  fecharSidebarMobile() {

  if (window.innerWidth <= 768) {

    this.open = false;
  }
} 

  logout() {

  this.authService
    .logout()
    .then(() => {

      this.router.navigate(['/login']);
    })
    .catch(error => {

      console.error(error);
    });
}

confirmLogout(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Ao sair você será direcionado para o login.',
            header: 'Confirmar Logout?',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Sair',
                severity: 'danger',
                icon: 'pi pi-sign-out'
            },
            accept: () => {
                this.logout()
            },
            reject: () => {
                // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            },
        });
    }

    iniciarMonitoramento() {

  this.resetarTempo();

  window.onmousemove =
    () => this.resetarTempo();

  window.onkeydown =
    () => this.resetarTempo();

  window.onclick =
    () => this.resetarTempo();
}

resetarTempo() {

  clearTimeout(this.timeout);

  this.timeout = setTimeout(() => {

    this.messageService.add({

      severity: 'warn',

      summary: 'Sessão encerrada',

      detail:
        'Você ficou muito tempo inativo'
    });

    this.logout();

  }, 1000 * 60 * 20 );
}

modalAlertas = false;
quantidadeAlertas = 0;
alertas: any[] = [];

abrirAlertas() {

  this.modalAlertas = true;
}

}
