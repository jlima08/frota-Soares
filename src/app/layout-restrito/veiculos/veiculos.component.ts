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
import { FloatLabelModule } from "primeng/floatlabel";
import { InputNumberModule } from 'primeng/inputnumber';


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
    FileUploadModule,
    FloatLabelModule,
    InputNumberModule
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

kmRetirada?: number;

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

    this.loadingConfirmar = false;

    return;
  }

  if (!this.kmRetirada) {

    this.messageService.add({

      severity: 'error',

      summary: 'KM obrigatório',

      detail: 'Informe o KM atual do veículo'
    });

    this.loadingConfirmar = false;

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
        'Adicione todas as fotos do veículo'
    });

    this.loadingConfirmar = false;

    return;
  }

  const veiculo =
    this.veiculoSelecionado;

  // ALERTA TROCA DE ÓLEO

  if (
    veiculo.kmProximaTrocaOleo &&
    this.kmRetirada >= veiculo.kmProximaTrocaOleo
  ) {

    this.messageService.add({

      severity: 'warn',

      summary: 'Troca de óleo pendente',

      detail:
        `Veículo ultrapassou o KM da próxima troca (${veiculo.kmProximaTrocaOleo} km)`
    });

    // Futuramente:
    // salvar alerta no Firestore
  }

  Promise.all([

    this.movimentacaoService
      .uploadImagem(this.fotoPainel),

    this.movimentacaoService
      .uploadImagem(this.fotoFrente),

    this.movimentacaoService
      .uploadImagem(this.fotoTraseira),

    this.movimentacaoService
      .uploadImagem(this.fotoLateralDireita),

    this.movimentacaoService
      .uploadImagem(this.fotoLateralEsquerda)

  ])

  .then(([

    urlPainel,

    urlFrente,

    urlTraseira,

    urlLateralDireita,

    urlLateralEsquerda

  ]) => {

    const movimentacao: Movimentacao = {

      motoristaId:
        usuario.id,

      motoristaNome:
        usuario.nome + ' ' + usuario.sobrenome,

      veiculoId:
        veiculo.id!,

      modelo:
        veiculo.modelo,

      placa:
        veiculo.placa,

      observacao:
        this.observacao,

      kmRetirada:
        this.kmRetirada,

      dataRetirada:
        new Date().toISOString(),

      dataDevolucao:
        '',

      status:
        'Em uso',

      fotosRetirada: {

        painel:
          urlPainel,

        frente:
          urlFrente,

        traseira:
          urlTraseira,

        lateralDireita:
          urlLateralDireita,

        lateralEsquerda:
          urlLateralEsquerda
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

    this.kmRetirada = undefined;

    this.fotoPainel = undefined;

    this.fotoFrente = undefined;

    this.fotoTraseira = undefined;

    this.fotoLateralDireita = undefined;

    this.fotoLateralEsquerda = undefined;

    this.loadingConfirmar = false;
  })

  .catch(error => {

    console.error(error);

    this.loadingConfirmar = false;

    this.messageService.add({

      severity: 'error',

      summary: 'Erro',

      detail:
        'Erro ao registrar movimentação'
    });
  });
}

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
