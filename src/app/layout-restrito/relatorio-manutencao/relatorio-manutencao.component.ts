import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ManutencaoService } from '../../service/manutencao.service';
import { Manutencao } from '../../interfaces/manutencao.interface';

import { TagModule } from 'primeng/tag';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { CardPageComponent } from '../components/card-page/card-page.component';
import { SelectModule } from 'primeng/select';
import { PaginatorModule } from 'primeng/paginator';

import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

@Component({
  selector: 'app-relatorio-manutencao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TagModule,
    FloatLabelModule,
    InputTextModule,
    MessageModule,
    AccordionModule,
    CardModule,
    ButtonModule,
    CardPageComponent,
    SelectModule,
    PaginatorModule,
  ],
  templateUrl: './relatorio-manutencao.component.html',
  styleUrl: './relatorio-manutencao.component.scss',
})
export class RelatorioManutencaoComponent {
  // filtros
  pesquisa = '';
  tipoSelecionado = '';
  oficinaSelecionada = '';
  tipos = [
    {
      label: 'Todos',
      value: '',
    },

    {
      label: 'Troca de óleo',
      value: 'Troca de óleo',
    },

    {
      label: 'Troca de pneus',
      value: 'Troca de pneus',
    },

    {
      label: 'Outros',
      value: 'Outros',
    },
  ];
  oficinas = [
    {
      label: 'Todas',
      value: '',
    },

    {
      label: 'Terceirizada',
      value: 'Terceirizada',
    },

    {
      label: 'Oficina interna',
      value: 'Oficina interna',
    },
  ];
  veiculoSelecionado = '';

  veiculos: {
    label: string;
    value: string;
  }[] = [];

  filtros = false;
  filtrosCards = false;

  private manutencaoService = inject(ManutencaoService);

  manutencoes: Manutencao[] = [];
  manutencoesFiltradas: Manutencao[] = [];
  first = 0;

  rows = 10;

  manutencoesPaginadas: Manutencao[] = [];

  loading = true;

  dataInicio?: Date;
  dataFim?: Date;

  // Totais

  totalCarros = 0;
  totalMotos = 0;
  totalGeral = 0;

  totalOleo = 0;
  totalPneus = 0;
  totalOutros = 0;
  totalTerceirizados = 0;

  quantidadeManutencoes = 0;
  quantidadeCarros = 0;
  quantidadeMotos = 0;

  ngOnInit(): void {
    this.manutencaoService.listar().subscribe((resposta) => {
      this.manutencoes = resposta;

      this.manutencoesFiltradas = [...resposta];
      this.carregarVeiculos();

      this.calcularIndicadores();
      this.atualizarPaginacao();

      this.loading = false;
    });
  }
  atualizarPaginacao() {
    this.manutencoesPaginadas = this.manutencoesFiltradas.slice(
      this.first,
      this.first + this.rows,
    );
  }

  carregarVeiculos() {
    const lista = this.manutencoes.map((m) => ({
      value: m.veiculoId,
      label: `${m.modelo} - ${m.placa.toUpperCase()}`,
    }));

    this.veiculos = [
      {
        label: 'Todos',
        value: '',
      },
      ...lista.filter(
        (item, index, self) =>
          index === self.findIndex((v) => v.value === item.value),
      ),
    ];
  }

  calcularIndicadores(): void {
    this.totalCarros = 0;
    this.totalMotos = 0;
    this.totalGeral = 0;

    this.totalOleo = 0;
    this.totalPneus = 0;
    this.totalOutros = 0;
    this.totalTerceirizados = 0;

    this.quantidadeManutencoes = 0;
    this.quantidadeCarros = 0;
    this.quantidadeMotos = 0;

    this.manutencoesFiltradas.forEach((m) => {
      const valor = Number(m.valor) || 0;

      this.totalGeral += valor;

      this.quantidadeManutencoes++;

      // Tipo do veículo

      if (m.tipoVeiculo === 'Carro') {
        this.totalCarros += valor;
        this.quantidadeCarros++;
      } else {
        this.totalMotos += valor;
        this.quantidadeMotos++;
      }

      // Tipo da manutenção

      switch (m.tipo) {
        case 'Troca de óleo':
          this.totalOleo += valor;
          break;

        case 'Troca de pneus':
          this.totalPneus += valor;
          break;

        default:
          this.totalOutros += valor;
      }
       // Total de serviços terceirizados
    if (m.oficina !== 'Oficina interna') {
      this.totalTerceirizados += valor;
    }
    });
  }

  filtrarIndicadores(): void {
    this.manutencoesFiltradas = this.manutencoes.filter((m) => {
      const data = new Date(m.data);

      if (this.dataInicio) {
        const inicio = new Date(this.dataInicio);
        inicio.setHours(0, 0, 0, 0);
        if (data < inicio) {
          return false;
        }
      }

      if (this.dataFim) {
        const fim = new Date(this.dataFim);
        fim.setHours(23, 59, 59, 999);
        if (data > fim) {
          return false;
        }
      }
      if (this.veiculoSelecionado && m.veiculoId !== this.veiculoSelecionado) {
        return false;
      }

      return true;
    });

    this.calcularIndicadores();
  }

  limparFiltro(): void {
    this.dataInicio = undefined;
    this.dataFim = undefined;

    this.manutencoesFiltradas = [...this.manutencoes];

    this.calcularIndicadores();
  }

  aplicarFiltros() {
    this.manutencoesFiltradas = this.manutencoes.filter((m) => {
      // Pesquisa

      const pesquisaOk =
        !this.pesquisa ||
        m.modelo.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        m.placa.toLowerCase().includes(this.pesquisa.toLowerCase());

      // Tipo

      const tipoOk = !this.tipoSelecionado || m.tipo === this.tipoSelecionado;

      // Oficina

      const oficinaOk =
        !this.oficinaSelecionada ||
        (this.oficinaSelecionada === 'Oficina interna'
          ? m.oficina === 'Oficina interna'
          : m.oficina !== 'Oficina interna');

      return pesquisaOk && tipoOk && oficinaOk;
    });
    this.first = 0;

    this.atualizarPaginacao();
    this.calcularIndicadores();
  }
  limparFiltrosCards() {
    this.pesquisa = '';
    this.veiculoSelecionado = '';

    this.tipoSelecionado = '';

    this.oficinaSelecionada = '';

    this.manutencoesFiltradas = [...this.manutencoes];
    this.first = 0;

    this.atualizarPaginacao();
    this.calcularIndicadores();
  }
  onPageChange(event: any) {
    this.first = event.first;

    this.rows = event.rows;

    this.atualizarPaginacao();
  }

  exportarExcel() {
    const dados = this.manutencoesFiltradas.map((m) => ({
      Data: new Date(m.data).toLocaleDateString('pt-BR'),
      Modelo: m.modelo,
      Placa: m.placa.toUpperCase(),
      Veículo: m.tipoVeiculo,
      Manutenção: m.tipo,
      Oficina: m.oficina,
      KM: m.km,
      Valor: m.valor,
      'Serviço realizado': m.servicoRealizado,
      Produtos: m.produtosUtilizados,
      
    }));

    const worksheet = XLSX.utils.json_to_sheet(dados);

    const ultimaLinha = dados.length + 2;
    // Adiciona uma linha em branco e depois o total
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[], ['', '', '', '', '', '', 'TOTAL', this.totalGeral]],
      {
        origin: `A${ultimaLinha}`,
      },
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Manutenções');

    XLSX.writeFile(
      workbook,
      `relatorio-manutencoes-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`,
    );
  }
}
