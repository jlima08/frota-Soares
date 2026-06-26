import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

import { MovimentacaoService } from '../../service/movimentacao.service';
import { VeiculosService } from '../../service/veiculos.service';
import { CardPageComponent } from "../components/card-page/card-page.component";
import { Veiculo } from '../../interfaces/veiculo.interface';

import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { ToastModule } from "primeng/toast";
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule } from "primeng/fileupload";

// import { v4 as uuid } from 'uuid';



@Component({
  selector: 'app-gerenciar-veiculos',
  imports: [
    CardPageComponent,
    TableModule,
    ButtonModule,
    FloatLabelModule, 
    InputTextModule, 
    FormsModule, 
    SelectModule, 
    ToastModule, 
    CommonModule, 
    MessageModule, TooltipModule, ConfirmDialogModule, InputNumberModule, InputMaskModule,
    FileUploadModule,
    RouterLink
],
  templateUrl: './gerenciar-veiculos.component.html',
  styleUrl: './gerenciar-veiculos.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class GerenciarVeiculosComponent {
 private veiculoService = inject(
  VeiculosService
);
private movimentacaoService =
  inject(MovimentacaoService);
cores = [
  { nome: 'Branco' },
  { nome: 'Preto' },
  { nome: 'Prata' },
  { nome: 'Cinza' },
  { nome: 'Vermelho' },
  { nome: 'Azul' },
  { nome: 'Verde' },
  { nome: 'Amarelo' },
  { nome: 'Marrom' },
  { nome: 'Bege' },
  { nome: 'Laranja' },
  { nome: 'Roxo' }
];

fotoVeiculo?: File;
previewFotoVeiculo = '';

veiculos: Veiculo[] = [];

loading = false;

cadastrarVeiculo = false;

editando = false;

veiculo: Veiculo = {
  modelo: '',
  ano: '',
  placa: '',
  cor: '',
  status: 'Ativo',
  tipo: 'Carro'
};

tiposVeiculo = [

  {
    label: 'Carro',
    value: 'Carro'
  },

  {
    label: 'Moto',
    value: 'Moto'
  }
];

statusVeiculo = [
  'Ativo',
  'Inativo'
]

ngOnInit(): void {

  this.veiculoService
    .listar()
    .subscribe(resposta => {

      this.veiculos = resposta;
    });
}

showCadastrarVeiculo() {

  this.cadastrarVeiculo =
    !this.cadastrarVeiculo;
}

constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

salvarVeiculo() {

  if (
    !this.veiculo.modelo ||
    !this.veiculo.ano ||
    !this.veiculo.placa ||
    !this.veiculo.cor ||
    !this.veiculo.kmUltimaTrocaOleo ||
  !this.veiculo.kmProximaTrocaOleo
  ) {

    this.messageService.add({
      severity: 'error',
      summary: 'Preencha todos os campos',
      life: 3000
    });

    return;
  }
  if (
  this.veiculo.kmProximaTrocaOleo! <=
  this.veiculo.kmUltimaTrocaOleo!
) {

  this.messageService.add({

    severity: 'warn',

    summary:
      'KM da próxima troca deve ser maior'
  });

  return;
}

  this.loading = true;

  // EDITAR

  if (
  this.editando &&
  this.veiculo.id
) {

  // SE ESCOLHEU NOVA FOTO
  if (this.fotoVeiculo) {

    this.movimentacaoService
      .uploadImagem(this.fotoVeiculo)

      .then(urlFoto => {

        this.veiculo.foto = urlFoto;

        return this.veiculoService.atualizar(
          this.veiculo.id!,
          this.veiculo
        );
      })

      .then(() => {

        this.messageService.add({
          severity: 'info',
          summary: 'Veículo editado com sucesso',
          life: 3000
        });

        this.resetFormulario();

        this.loading = false;
      })

      .catch(error => {

        console.error(error);

        this.loading = false;
      });

  } else {

    // EDITAR SEM TROCAR FOTO

    this.veiculoService
      .atualizar(
        this.veiculo.id,
        this.veiculo
      )

      .then(() => {

        this.messageService.add({
          severity: 'info',
          summary: 'Veículo editado com sucesso',
          life: 3000
        });

        this.resetFormulario();

        this.loading = false;
      })

      .catch(error => {

        console.error(error);

        this.loading = false;
      });
  }

  return;
}

  // CADASTRAR COM FOTO

  if (this.fotoVeiculo) {

    this.movimentacaoService
      .uploadImagem(this.fotoVeiculo)

      .then(urlFoto => {

        this.veiculo.foto = urlFoto;

        return this.veiculoService
          .cadastrar(this.veiculo);
      })

      .then(() => {

        this.messageService.add({
          severity: 'success',
          summary: 'Veículo cadastrado com sucesso',
          life: 3000
        });

        this.resetFormulario();

        this.loading = false;
      })

      .catch(error => {

        console.error(error);

        this.loading = false;
      });

    return;
  }

  // CADASTRAR SEM FOTO

  this.veiculoService
    .cadastrar(this.veiculo)

    .then(() => {

      this.messageService.add({
        severity: 'success',
        summary: 'Veículo cadastrado com sucesso',
        life: 3000
      });

      this.resetFormulario();

      this.loading = false;
    })

    .catch(error => {

      console.error(error);

      this.loading = false;
    });
}

editarVeiculo(
  veiculo: Veiculo
) {

  this.editando = true;

  this.cadastrarVeiculo = true;

  this.veiculo = {
    ...veiculo
  };
}

excluirVeiculo(id?: string) {

  if (!id) return;

  this.veiculoService
    .deletar(id)
    .then(() => {

      this.messageService.add({ severity: 'warn', summary: 'Veículo EXCLUIDO com sucesso.', detail: '', life: 3000 });
    });
}

confirmDelete(event: Event, id?: string) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Ao confirmar o veículo sera deletado para sempre.',
            header: 'Confirmar Exclusão?',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Excluir',
                severity: 'danger',
            },
            accept: () => {
                this.excluirVeiculo(id);
            },
            reject: () => {
                // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            },
        });
    }

resetFormulario() {

  this.veiculo = {
    modelo: '',
    ano: '',
    placa: '',
    cor: '',
    status: 'Ativo',
    tipo: 'Carro'
  };

  this.editando = false;

  this.cadastrarVeiculo = false;

  this.loading = false;
}

selecionarFotoVeiculo(event: any) {

  const file = event.files[0];

  if (!file) return;

  this.fotoVeiculo = file;

  this.previewFotoVeiculo =
    URL.createObjectURL(file);
}



}
