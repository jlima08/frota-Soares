import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CardPageComponent } from '../components/card-page/card-page.component';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { MotoristasService } from '../../service/motoristas.service';
import { Motorista } from '../../interfaces/motorista.interface';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../service/auth.service';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Tooltip, TooltipModule } from "primeng/tooltip";
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { environment } from '../../../enviroments/environments';
import { InputMaskModule } from 'primeng/inputmask';




@Component({
  selector: 'app-motorista',
  imports: [ButtonModule, TableModule, InputTextModule, FloatLabelModule, CardPageComponent, FormsModule, SelectModule, DialogModule, ToastModule, TooltipModule, InputMaskModule],
  templateUrl: './motorista.component.html',
  styleUrl: './motorista.component.scss',
  providers: [MessageService]
})
export class MotoristaComponent {

  modalExcluir = false;
motoristaSelecionado?: Motorista;

   private motoristaService = inject(MotoristasService); 
   private authService = inject(AuthService); 

   roles = [
  {
    label: 'Administrador',
    value: 'Administrador'
  },
  {
    label: 'Motorista',
    value: 'Motorista'
  }
];

    motoristas: Motorista[] = [];

  
  motorista: Motorista = {
  nome: '',
  sobrenome: '',
  celular: '',
  cargo: '',
  email: '',
  senha: '',
  role: 'Motorista'
};


cargos = [
  'Técnico',
  'Gerente',
  'Auxiliar Técnico',
  'Monitoramento',
  'Administrativo'
];
  
  CadMotorista = false;
  loading: boolean = false;
  editando = false;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {

  this.motoristaService
    .listar()
    .subscribe(resposta => {

      this.motoristas = resposta;
    });
}

abrirModalExcluir(motorista: Motorista) {

  this.motoristaSelecionado = motorista;

  this.modalExcluir = true;
}

  load() {
        this.loading = true;

        setTimeout(() => {
            this.loading = false
        }, 2000);
  }
  showCadMotorista(){
    this.CadMotorista = !this.CadMotorista;
  }

  editarMotorista(motorista: Motorista) {

  this.editando = true;

  this.CadMotorista = true;
  

  this.motorista = {
    ...motorista
  };
}

showMenssage() {
        this.messageService.add({ severity: 'error', summary: 'Motorista não cadastrado', detail: 'Preencha todos os campos', life: 3000 });
    }

  salvarMotorista() {

  if (
    !this.motorista.nome ||
    !this.motorista.sobrenome ||
    !this.motorista.celular ||
    !this.motorista.email ||
    !this.motorista.role
  ) {
    // alert('Preencha todos os campos');
    this.showMenssage()

    return;
  }

  this.loading = true;

  // EDITAR
  if (this.editando && this.motorista.id) {

    this.motoristaService
      .atualizar(this.motorista.id, this.motorista)
      .then(() => {

        // alert('Motorista atualizado');
        this.messageService.add({ severity: 'info', summary: 'Motorista editado com sucesso', detail: '', life: 3000 });

        this.resetFormulario();
      })
      .catch(error => {

        console.error(error);

        this.loading = false;
      });

    return;
  }
  
  // CADASTRAR
  const secondaryApp = initializeApp(
    environment.firebase,
    'Secondary'
  );

  const secondaryAuth = getAuth(
    secondaryApp
  );

  createUserWithEmailAndPassword(
    secondaryAuth,
    this.motorista.email,
    this.motorista.senha!
  )
  .then((credencial) => {

    const motoristaFirestore = {

      nome: this.motorista.nome,
      sobrenome: this.motorista.sobrenome,
      celular: this.motorista.celular,
      cargo: this.motorista.cargo,

      email: this.motorista.email,

      role: this.motorista.role,

      uid: credencial.user.uid
    };

    return this.motoristaService
      .cadastrar(
        credencial.user.uid,
        motoristaFirestore
      );
  })
  .then(() => {

    this.messageService.add({ severity: 'success', summary: 'Motorista cadastrado com sucesso', detail: '', life: 3000 });

    this.resetFormulario();
  })
  .catch(error => {

    console.error(error);

    this.loading = false;
  });
}

excluirMotorista() {

  if (
    !this.motoristaSelecionado?.id
  ) return;

  this.motoristaService
    .deletar(
      this.motoristaSelecionado.id
    )
    .then(() => {

      this.modalExcluir = false;

      this.motoristaSelecionado = undefined;
    })
    .catch(error => {

      console.error(error);
    });
}

resetFormulario() {

  this.motorista = {
    nome: '',
    sobrenome: '',
    celular: '',
    cargo: '',
    email: '',
    role: 'Motorista'
  };

  this.editando = false;

  this.CadMotorista = false;

  this.loading = false;
}

 buscarMotoristas() {
    this.loading = true;

    this.motoristaService
      .listar()
      .subscribe({
        next: (resposta) => {
          this.motoristas = resposta;

          this.loading = false;
        },

        error: (erro) => {
          console.error(erro);

          this.loading = false;
        }
      });
  }

  

}
