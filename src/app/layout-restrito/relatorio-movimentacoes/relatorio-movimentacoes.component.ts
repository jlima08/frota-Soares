import { Component, inject } from '@angular/core';
import { Movimentacao } from '../../interfaces/movimentacao.interface';
import { MovimentacaoService } from '../../service/movimentacao.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { CardPageComponent } from '../components/card-page/card-page.component';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { VeiculosService } from '../../service/veiculos.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Auth } from '@angular/fire/auth';
import { MotoristasService } from '../../service/motoristas.service';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { Textarea, TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { Veiculo } from '../../interfaces/veiculo.interface';
import { InputNumberModule } from 'primeng/inputnumber';
import { GastosCombustivelComponent } from "./gastos-combustivel/gastos-combustivel.component";

@Component({
  selector: 'app-relatorio-movimentacoes',
  imports: [
    ButtonModule,
    CommonModule,
    TableModule,
    MessageModule,
    CardPageComponent,
    TooltipModule,
    FormsModule,
    InputTextModule,
    CommonModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    FileUploadModule,
    TextareaModule,
    CheckboxModule,
    PaginatorModule,
    InputNumberModule,
    GastosCombustivelComponent
],
  templateUrl: './relatorio-movimentacoes.component.html',
  styleUrl: './relatorio-movimentacoes.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class RelatorioMovimentacoesComponent {
  private movimentacaoService = inject(MovimentacaoService);
  private veiculoService = inject(VeiculosService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private auth = inject(Auth);
  private motoristaService = inject(MotoristasService);

  movimentacoes: Movimentacao[] = [];
  movimentacoesOriginais: Movimentacao[] = [];
  veiculos: Veiculo[] = [];
  usuario: any;

  modalObservacao = false;
  loadAbastecimento = false;

  observacaoSelecionada = '';

  // /paginação
  paginaAtual = 0;
  itensPorPagina = 12;

  //filtros
  filtroMotorista = '';
  filtroPlaca = '';
  filtroModelo = '';
  filtroDataRetirada = '';
  filtroDataDevolucao = '';

  //imgs devolução
  fotoPainelDevolucao?: File;
  fotoFrenteDevolucao?: File;
  fotoTraseiraDevolucao?: File;
  fotoLateralEsquerdaDevolucao?: File;
  fotoLateralDireitaDevolucao?: File;

  previewPainelDevolucao = '';
  previewFrenteDevolucao = '';
  previewTraseiraDevolucao = '';
  previewLateralEsquerdaDevolucao = '';
  previewLateralDireitaDevolucao = '';

  // imgs comparacao
  modalComparacao = false;
  imagemAntes = '';
  imagemDepois = '';
  tituloComparacao = '';

  modalDevolucao = false;
  movimentacaoDevolucao?: Movimentacao;
  observacaoDevolucao = '';

  //abastecimento
  modalAbastecimento = false;
  movimentacaoAbastecimento?: Movimentacao;
  houveAbastecimento = false;
  kmAbastecimento?: number;
  litrosAbastecidos: number | null = null;
  valorAbastecidos: number | null = null;
  fotoNota?: File;
  fotoPainelAbastecimento?: File;
  previewNota = '';
  previewPainelAbastecimento = '';

  showFiltrosAvancados = false;
  loading = false;

  modalDetalhesAbastecimento = false;
  abastecimentoSelecionado?: Movimentacao;
  verAbastecimento(mov: Movimentacao) {
    this.abastecimentoSelecionado = mov;
    this.modalDetalhesAbastecimento = true;
  }

  movimentacaoSelecionada?: Movimentacao;

  abrirAbastecimento(mov: Movimentacao) {
    this.movimentacaoAbastecimento = mov;
    this.modalAbastecimento = true;
  }

  abrirComparacao(titulo: string, antes?: string, depois?: string) {
    this.tituloComparacao = titulo;
    this.imagemAntes = antes || '';
    this.imagemDepois = depois || '';
    this.modalComparacao = true;
  }

  abrirObservacao(movimentacao: Movimentacao) {
    this.movimentacaoSelecionada = movimentacao;

    this.modalObservacao = true;
  }

  FiltrosAvancados() {
    this.showFiltrosAvancados = !this.showFiltrosAvancados;
  }

  ngOnInit(): void {
    const usuarioLogado = this.auth.currentUser;

    if (!usuarioLogado) return;

    this.motoristaService
      .buscarPorUid(usuarioLogado.uid)
      .subscribe((usuario) => {
        this.usuario = usuario;

        this.movimentacaoService.listar().subscribe((resposta) => {
          console.log(resposta);

          let movimentacoesFiltradas = resposta;

          // SE FOR MOTORISTA
          if (this.usuario.role === 'Motorista') {
            movimentacoesFiltradas = resposta.filter(
              (mov) => mov.motoristaId === this.usuario.id,
            );
          }

          // ORDENAR MAIS RECENTES
          movimentacoesFiltradas.sort((a, b) => {
            return (
              new Date(b.dataRetirada).getTime() -
              new Date(a.dataRetirada).getTime()
            );
          });

          this.movimentacoes = movimentacoesFiltradas;
          this.movimentacoesOriginais = movimentacoesFiltradas;
        });
      });
  }

  finalizar(movimentacao: Movimentacao) {
    if (!movimentacao.id || !movimentacao.veiculoId) {
      return;
    }

    this.movimentacaoService
      .finalizarMovimentacao(movimentacao.id)

      .then(() => {
        return this.veiculoService.atualizar(movimentacao.veiculoId, {
          status: 'Ativo',
        });
      })

      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Veículo devolvido',
          detail: 'Veículo disponível novamente',
        });
      })

      .catch((error) => {
        console.error(error);
      });
  }

  filtrar() {
    this.movimentacoes = this.movimentacoesOriginais.filter((mov) => {
      const motorista = mov.motoristaNome
        ?.toLowerCase()
        .includes(this.filtroMotorista.toLowerCase());

      const placa = mov.placa
        ?.toLowerCase()
        .includes(this.filtroPlaca.toLowerCase());

      const modelo = mov.modelo
        ?.toLowerCase()
        .includes(this.filtroModelo.toLowerCase());

      const dataRetirada =
        !this.filtroDataRetirada ||
        mov.dataRetirada?.includes(this.filtroDataRetirada);

      const dataDevolucao =
        !this.filtroDataDevolucao ||
        mov.dataDevolucao?.includes(this.filtroDataDevolucao);

      return motorista && placa && modelo && dataRetirada && dataDevolucao;
    });

    this.paginaAtual = 0;
  }

  limparFiltros() {
    this.filtroMotorista = '';
    this.filtroPlaca = '';
    this.filtroModelo = '';
    this.filtroDataRetirada = '';
    this.filtroDataDevolucao = '';
    this.movimentacoes = this.movimentacoesOriginais;
    this.paginaAtual = 0;
  }

  abrirDialogDevolucao(mov: Movimentacao) {
    this.movimentacaoDevolucao = mov;
    this.modalDevolucao = true;
  }

  selecionarImagemDevolucao(event: any, tipo: string) {
    const file = event.files[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    switch (tipo) {
      case 'painel':
        this.fotoPainelDevolucao = file;
        this.previewPainelDevolucao = preview;
        break;

      case 'frente':
        this.fotoFrenteDevolucao = file;
        this.previewFrenteDevolucao = preview;
        break;

      case 'traseira':
        this.fotoTraseiraDevolucao = file;
        this.previewTraseiraDevolucao = preview;
        break;

      case 'lateralEsquerda':
        this.fotoLateralEsquerdaDevolucao = file;
        this.previewLateralEsquerdaDevolucao = preview;
        break;

      case 'lateralDireita':
        this.fotoLateralDireitaDevolucao = file;
        this.previewLateralDireitaDevolucao = preview;
        break;
    }
  }

  confirmarDevolucaoFinal() {
    this.loading = true;

    if (!this.movimentacaoDevolucao) {
      this.loading = false;
      return;
    }

    if (!this.fotoPainelDevolucao) {
      this.messageService.add({
        severity: 'error',
        summary: 'Imagem obrigatória',
        detail: 'Adicione a foto do painel',
      });

      this.loading = false;
      return;
    }

    Promise.all([
      this.movimentacaoService.uploadImagem(this.fotoPainelDevolucao),
      this.movimentacaoService.uploadImagem(this.fotoFrenteDevolucao!),
      this.movimentacaoService.uploadImagem(this.fotoTraseiraDevolucao!),
      this.movimentacaoService.uploadImagem(this.fotoLateralEsquerdaDevolucao!),
      this.movimentacaoService.uploadImagem(this.fotoLateralDireitaDevolucao!),
    ])

      .then(
        ([
          urlPainel,
          urlFrente,
          urlTraseira,
          urlLateralEsquerda,
          urlLateralDireita,
        ]) => {
          return this.movimentacaoService.atualizar(
            this.movimentacaoDevolucao!.id!,
            {
              status: 'Finalizado',
              dataDevolucao: new Date().toISOString(),
              observacaoDevolucao: this.observacaoDevolucao,
              fotosDevolucao: {
                painel: urlPainel,
                frente: urlFrente,
                traseira: urlTraseira,
                lateralEsquerda: urlLateralEsquerda,
                lateralDireita: urlLateralDireita,
              },
            },
          );
        },
      )

      .then(() => {
        return this.veiculoService.atualizar(
          this.movimentacaoDevolucao!.veiculoId!,
          {
            status: 'Ativo',
          },
        );
      })

      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Veículo devolvido',
        });

        this.resetarDevolucao();
      })

      .catch((error) => {
        console.error(error);

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao finalizar devolução',
        });
      })

      .finally(() => {
        this.loading = false;
      });
  }

  resetarDevolucao() {
    this.modalDevolucao = false;
    this.movimentacaoDevolucao = undefined;
    this.observacaoDevolucao = '';
    this.fotoPainelDevolucao = undefined;
    this.fotoFrenteDevolucao = undefined;
    this.fotoTraseiraDevolucao = undefined;
    this.fotoLateralEsquerdaDevolucao = undefined;
    this.fotoLateralDireitaDevolucao = undefined;
    this.previewPainelDevolucao = '';
    this.previewFrenteDevolucao = '';
    this.previewTraseiraDevolucao = '';
    this.previewLateralEsquerdaDevolucao = '';
    this.previewLateralDireitaDevolucao = '';
  }

  selecionarImagemAbastecimento(event: any, tipo: string) {
    const file = event.files[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (tipo === 'nota') {
      this.fotoNota = file;
      this.previewNota = preview;
    }

    if (tipo === 'painel') {
      this.fotoPainelAbastecimento = file;
      this.previewPainelAbastecimento = preview;
    }
  }

  salvarAbastecimento() {
    this.loadAbastecimento = true;
    if (!this.movimentacaoAbastecimento) {
      this.loadAbastecimento = false;
      return;
    }
    if (!this.houveAbastecimento) {
      this.movimentacaoService.atualizar(this.movimentacaoAbastecimento.id!, {
        abastecimento: {
          houveAbastecimento: false,
          litrosAbastecido: 0,
          valorAbastecido: 0,
        },
      });
      this.modalAbastecimento = false;
      this.loadAbastecimento = false;

      return;
    }
    if (this.valorAbastecidos == null || this.valorAbastecidos <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Valor inválido',
        detail: 'O valor informado deve ser maior que 0.',
      });

      this.loadAbastecimento = false;
      return;
    }

    if (this.litrosAbastecidos == null || this.litrosAbastecidos <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Litros inválidos',
        detail: 'Informe uma quantidade de litros maior que 0.',
      });

      this.loadAbastecimento = false;
      return;
    }

    if (this.kmAbastecimento! < this.movimentacaoAbastecimento.kmRetirada!) {
      this.messageService.add({
        severity: 'error',
        summary: 'KM inválido',
        detail: 'O KM informado não pode ser menor que o KM da retirada.',
      });
      this.loadAbastecimento = false;

      return;
    }
    if (!this.fotoNota || !this.fotoPainelAbastecimento) {
      this.messageService.add({
        severity: 'error',
        summary: 'Fotos obrigatórias',
        detail: 'Adicione a foto da nota e a foto do painel.',
      });
      this.loadAbastecimento = false;

      return;
    }
    console.log({
      valor: this.valorAbastecidos,
      litros: this.litrosAbastecidos,
    });

    Promise.all([
      this.movimentacaoService.uploadImagem(this.fotoNota!),
      this.movimentacaoService.uploadImagem(this.fotoPainelAbastecimento!),
    ])

      .then(([urlNota, urlPainel]) => {
        return this.movimentacaoService.atualizar(
          this.movimentacaoAbastecimento!.id!,
          {
            abastecimento: {
              houveAbastecimento: true,
              km: this.kmAbastecimento,
              litrosAbastecido: this.litrosAbastecidos!,
              valorAbastecido: this.valorAbastecidos!,
              fotoNota: urlNota,
              fotoPainel: urlPainel,
              data: new Date().toISOString(),
            },
          },
        );
      })

      .then(() => {
        this.messageService.add({
          severity: 'success',

          summary: 'Abastecimento registrado',
        });
        this.loadAbastecimento = false;
        this.modalAbastecimento = false;
        this.resetarAbastecimento();
      });
  }

  get movimentacoesPaginadas() {
    const inicio = this.paginaAtual * this.itensPorPagina;

    const fim = inicio + this.itensPorPagina;

    return this.movimentacoes.slice(inicio, fim);
  }
  trocarPagina(event: any) {
    this.paginaAtual = event.page;
  }
  resetarAbastecimento() {
    this.movimentacaoAbastecimento = undefined;
    this.houveAbastecimento = false;
    this.kmAbastecimento = undefined;
    this.litrosAbastecidos = null;
    this.valorAbastecidos = null;
    this.fotoNota = undefined;
    this.fotoPainelAbastecimento = undefined;
    this.previewNota = '';
    this.previewPainelAbastecimento = '';
    this.loadAbastecimento = false;
  }
}
