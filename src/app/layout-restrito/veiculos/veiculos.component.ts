import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { VeiculosService } from '../../service/veiculos.service';
import { Veiculo } from '../../interfaces/veiculo.interface';
import { MessageModule } from 'primeng/message';
import { DialogModule } from "primeng/dialog";
import { MovimentacaoService } from '../../service/movimentacao.service';
import { Auth } from '@angular/fire/auth';
import { MotoristasService } from '../../service/motoristas.service';
import { Movimentacao } from '../../interfaces/movimentacao.interface';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import imageCompression
from 'browser-image-compression';


@Component({
  selector: 'app-veiculos',
  imports: [
    CardModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    CommonModule,
    MessageModule,
    DialogModule,
    FormsModule,
    TextareaModule,
    FileUploadModule
  ],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class VeiculosComponent {
  private movimentacaoService = inject(MovimentacaoService);
  private auth = inject(Auth);
  private motoristaService = inject(MotoristasService);
  public veiculoService = inject(VeiculosService);

  dialogVisible = false;
  observacao = '';
  
  veiculoSelecionado?: Veiculo;
  veiculos: Veiculo[] = [];
  usuario: any;
   veiculo = this.veiculoSelecionado;

   //imagens
   fotoPainel?: File;
fotoFrente?: File;
fotoTraseira?: File;
fotoLateralEsquerda?: File;
fotoLateralDireita?: File;

previewPainel = '';
previewFrente = '';
previewTraseira = '';
previewLateralEsquerda = '';
previewLateralDireita = '';

 ngOnInit(): void {

  this.veiculoService
    .listar()
    .subscribe(resposta => {

      this.veiculos = resposta;
    });

  const usuarioLogado =
    this.auth.currentUser;

  if (usuarioLogado) {

    this.motoristaService
      .buscarPorUid(usuarioLogado.uid)
      .subscribe(resposta => {

        this.usuario = resposta;
      });
  }
}



  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) { }

  abrirDialog(carro: Veiculo) {

    this.veiculoSelecionado = carro;

    this.dialogVisible = true;
  }

  loadingConfirmar = false;

  confirmarSelecionado() {

    this.loadingConfirmar = true;

  const usuario = this.usuario;

  if (!usuario || !this.veiculoSelecionado) {
    return;
  }

  if (
    !this.fotoPainel ||
    !this.fotoFrente ||
    !this.fotoTraseira ||
    !this.fotoLateralDireita ||
    !this.fotoLateralEsquerda
  ) {

    this.messageService.add({

      severity: 'error',

      summary: 'Fotos obrigatórias',

      detail:
        'Adicione as fotos do veículo'
    });

    this.loadingConfirmar = false;
    return;

  }

  const veiculo =
    this.veiculoSelecionado;

  // 🚀 PASSO 8 AQUI
  Promise.all([

    this.movimentacaoService.uploadImagem(this.fotoPainel),
    this.movimentacaoService.uploadImagem(this.fotoFrente),
    this.movimentacaoService.uploadImagem(this.fotoTraseira),
    this.movimentacaoService.uploadImagem(this.fotoLateralDireita),
    this.movimentacaoService.uploadImagem(this.fotoLateralEsquerda),


  ])

  .then(([
    urlPainel,
    urlFrente,
    urlTraseira,
    urlLateralDireita,
    urlLateralEsquerda
  ]) => {

    // 🚀 AGORA cria movimentação
    const movimentacao: Movimentacao = {

      motoristaId: usuario.id,

      motoristaNome: usuario.nome + ' ' + usuario.sobrenome,

      veiculoId: veiculo.id!,

      modelo: veiculo.modelo,

      placa: veiculo.placa,

      observacao: this.observacao,

      dataRetirada: new Date().toISOString(),

      dataDevolucao: '',
      status: 'Em uso',
      fotosRetirada: {
        painel: urlPainel,
        frente: urlFrente,
        traseira: urlTraseira,
        lateralDireita: urlLateralDireita,
        lateralEsquerda:urlLateralEsquerda
      }
    };

    return this.movimentacaoService
      .cadastrar(movimentacao);
  })

  .then(() => {

    return this.veiculoService
      .atualizar(
        veiculo.id!,
        {
          status: 'Em uso'
        }
      );
  })

  .then(() => {

    this.messageService.add({

      severity: 'success',

      summary:
        'Veículo selecionado',

      detail:
        'Movimentação registrada'
    });

    this.dialogVisible = false;

    this.observacao = '';
    this.loadingConfirmar = false;
  })

  .catch(error => {

    console.error(error);

    this.loadingConfirmar = false;

    this.messageService.add({

      severity: 'error',

      summary: 'Erro',

      detail:
        'Erro ao enviar imagens'
    });
  });
}

  // confirmarCar(carros: Veiculo) {
  //   this.confirmationService.confirm({
  //     header: 'Confirmação',
  //     message: `Ao confirmar você ficará responsável pelo ${carros.modelo}`,
  //     icon: 'pi pi-exclamation-circle',
  //     rejectButtonProps: {
  //       label: 'Cancelar',
  //       icon: 'pi pi-times',
  //       outlined: true,
  //       size: 'small',
  //       severity: 'danger'
  //     },
  //     acceptButtonProps: {
  //       label: 'Selecionar',
  //       icon: 'pi pi-check',
  //       size: 'small'
  //     },
  //     accept: () => {
  //       this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
  //       console.log('Carro selecionado:', carros);
  //     },
  //     reject: () => {
  //       this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  //     }
  //   });
  // }

  async selecionarImagem(
  event: any,
  tipo: string
) {

  const file = event.files[0];

  if (!file) return;

  // 🚀 compressão
  const compressedFile =
    await imageCompression(file, {

      maxSizeMB: 0.3,

      maxWidthOrHeight: 1280,

      useWebWorker: true
    });

  const preview =
    URL.createObjectURL(
      compressedFile
    );

  switch(tipo) {

    case 'painel':

      this.fotoPainel =
        compressedFile;

      this.previewPainel =
        preview;

    break;

    case 'frente':

      this.fotoFrente =
        compressedFile;

      this.previewFrente =
        preview;

    break;

    case 'traseira':

      this.fotoTraseira =
        compressedFile;

      this.previewTraseira =
        preview;

    break;

    case 'lateralEsquerda':

      this.fotoLateralEsquerda =
        compressedFile;

      this.previewLateralEsquerda =
        preview;

    break;

    case 'lateralDireita':

      this.fotoLateralDireita =
        compressedFile;

      this.previewLateralDireita =
        preview;

    break;
  }
}


}
