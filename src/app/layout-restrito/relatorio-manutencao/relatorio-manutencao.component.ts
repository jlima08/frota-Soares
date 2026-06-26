import { Component, inject } from '@angular/core';
import { ManutencaoService } from '../../service/manutencao.service';
import { Manutencao } from '../../interfaces/manutencao.interface';
import { CommonModule } from '@angular/common';

import { TagModule } from 'primeng/tag';
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from 'primeng/inputtext';
import { CardPageComponent } from "../components/card-page/card-page.component";
import { Message } from "primeng/message";
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-relatorio-manutencao',
  imports: [CommonModule, TagModule, FloatLabelModule, InputTextModule, CardPageComponent, Message, AccordionModule],
  templateUrl: './relatorio-manutencao.component.html',
  styleUrl: './relatorio-manutencao.component.scss'
})
export class RelatorioManutencaoComponent {

    private manutencaoService = inject(ManutencaoService);

  manutencoes: Manutencao[] = [];

  // Cards do topo

  totalCarros = 0;

  totalMotos = 0;

  totalGeral = 0;

  totalOleo = 0;

  totalPneus = 0;

  totalOutros = 0;

  quantidadeManutencoes = 0;

  quantidadeCarros = 0;

  quantidadeMotos = 0;

  loading = true;

  ngOnInit() {

    this.manutencaoService
      .listar()
      .subscribe(resposta => {

        this.manutencoes = resposta;

        this.calcularResumo();

        this.loading = false;

      });

  }

  calcularResumo() {

    this.totalCarros = 0;

    this.totalMotos = 0;

    this.totalGeral = 0;

    this.totalOleo = 0;

    this.totalPneus = 0;

    this.totalOutros = 0;

    this.quantidadeManutencoes = 0;

    this.quantidadeCarros = 0;

    this.quantidadeMotos = 0;

    this.manutencoes.forEach(manutencao => {

      const valor = Number(manutencao.valor) || 0;

      this.totalGeral += valor;

      this.quantidadeManutencoes++;

      // Total por tipo de veículo

      if (manutencao.tipoVeiculo === 'Carro') {

        this.totalCarros += valor;

        this.quantidadeCarros++;

      } else {

        this.totalMotos += valor;

        this.quantidadeMotos++;

      }

      // Total por tipo de manutenção

      switch (manutencao.tipo) {

        case 'Troca de óleo':

          this.totalOleo += valor;

          break;

        case 'Troca de pneus':

          this.totalPneus += valor;

          break;

        default:

          this.totalOutros += valor;

      }

    });

  }


}
