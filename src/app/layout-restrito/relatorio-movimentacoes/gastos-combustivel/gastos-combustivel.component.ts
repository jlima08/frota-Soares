import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { Movimentacao } from '../../../interfaces/movimentacao.interface';

@Component({
  selector: 'app-gastos-combustivel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AccordionModule,
    CardModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './gastos-combustivel.component.html',
  styleUrl: './gastos-combustivel.component.scss',
})
export class GastosCombustivelComponent implements OnChanges {
  @Input()
  movimentacoes: Movimentacao[] = [];
  movimentacoesFiltradas: Movimentacao[] = [];

  filtros = false;
  dataInicio?: Date;
  dataFim?: Date;
  veiculoSelecionado = '';

  veiculos: any[] = [];

  // ===========================
  // Indicadores  
  totalGasto = 0;
  totalCarros = 0;
  totalMotos = 0;
  totalLitros = 0;
  precoMedioLitro = 0;
  quantidadeAbastecimentos = 0;
  quantidadeCarros = 0;
  quantidadeMotos = 0;
  // ===========================

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movimentacoes']) {
      this.carregarVeiculos();

      this.movimentacoesFiltradas = [...this.movimentacoes];

      this.calcularResumo();
    }
  }

  carregarVeiculos() {
    const lista = this.movimentacoes.map((m) => ({
      label: `${m.modelo} - ${(m.placa ?? '').toUpperCase()}`,

      value: m.veiculoId,
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

  aplicarFiltros() {
    this.movimentacoesFiltradas = this.movimentacoes.filter((m) => {
      if (!m.abastecimento?.houveAbastecimento) {
        return false;
      }

      if (!m.abastecimento.data) {
        return false;
      }

      const data = new Date(m.abastecimento.data);

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

    this.calcularResumo();
  }

  limparFiltros() {
    this.dataInicio = undefined;

    this.dataFim = undefined;

    this.veiculoSelecionado = '';

    this.movimentacoesFiltradas = this.movimentacoes.filter(
      (m) => m.abastecimento?.houveAbastecimento,
    );

    this.calcularResumo();
  }

  calcularResumo() {
    this.totalGasto = 0;

    this.totalCarros = 0;

    this.totalMotos = 0;

    this.totalLitros = 0;

    this.precoMedioLitro = 0;

    this.quantidadeAbastecimentos = 0;

    this.quantidadeCarros = 0;

    this.quantidadeMotos = 0;

    this.movimentacoesFiltradas.forEach((m) => {
      if (!m.abastecimento?.houveAbastecimento) {
        return;
      }

      const valor = Number(m.abastecimento.valorAbastecido) || 0;

      const litros = Number(m.abastecimento.litrosAbastecido) || 0;

      this.totalGasto += valor;

      this.totalLitros += litros;

      this.quantidadeAbastecimentos++;

      if (m.tipo === 'Carro') {
        this.totalCarros += valor;

        this.quantidadeCarros++;
      } else {
        this.totalMotos += valor;

        this.quantidadeMotos++;
      }
    });

    if (this.totalLitros > 0) {
      this.precoMedioLitro = this.totalGasto / this.totalLitros;
    }
  }
}
