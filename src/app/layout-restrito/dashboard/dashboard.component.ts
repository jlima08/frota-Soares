import { Component, inject } from '@angular/core';
import { CardPageComponent } from "../components/card-page/card-page.component";
import { Veiculo } from '../../interfaces/veiculo.interface';
import { VeiculosService } from '../../service/veiculos.service';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardDashboardComponent } from '../components/card-dashboard/card-dashboard.component';
import { RouterLink } from "@angular/router";
import { MotoristasService } from '../../service/motoristas.service';
import { Motorista } from '../../interfaces/motorista.interface';
import { MovimentacaoService } from '../../service/movimentacao.service';
import { ManutencaoService } from '../../service/manutencao.service';
import { CardModule } from "primeng/card";

@Component({
  selector: 'app-dashboard',
  imports: [CardPageComponent, CommonModule, ChartModule, CardDashboardComponent, RouterLink, CardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private veiculoService = inject(VeiculosService);
  private motoristaService = inject(MotoristasService);
  private movimentacaoService = inject(MovimentacaoService);
  private manutencaoService = inject(ManutencaoService);
  
  data: any;
  options: any;

  totalAdministradores = 0;
  totalMotoristas = 0;

  movimentacaoChart: any;

movimentacaoOptions: any;

  veiculos: Veiculo[] = [];
  motoristas: Motorista[] = [];

  totalGastoManutencao = 0;
  quantidadeManutencoes = 0;
  quantidadeCarros = 0;
  quantidadeMotos = 0;

  ngOnInit(): void {

   this.veiculoService.listar().subscribe(resposta => {

    this.veiculos = resposta;

    const ativos =
      resposta.filter(
        v => v.status === 'Ativo'
      ).length;

    const emUso =
      resposta.filter(
        v => v.status === 'Em uso'
      ).length;

    const inativos =
      resposta.filter(
        v => v.status === 'Inativo'
      ).length;

    this.data = {

      labels: [
        'Ativos',
        'Em uso',
        'Inativos'
      ],

       datasets: [

    {

      data: [

        ativos,

        emUso,

        inativos
      ],

      backgroundColor: [

        '#10b981',

        '#f59e0b',

        '#ef4444'
      ],

      hoverBackgroundColor: [

        '#059669',

        '#d97706',

        '#dc2626'
      ],

      borderColor: '#ffffff',

      borderWidth: 2
    }
  ]
    };
  });
  this.motoristaService.listar().subscribe(resposta => {

    this.motoristas = resposta;

    this.totalAdministradores = resposta.filter(usuario => usuario.role === 'Administrador' ).length;

    this.totalMotoristas = resposta.filter(usuario => usuario.role === 'Motorista').length;
  });

  this.movimentacaoService.listar().subscribe(resposta => { const total = resposta.length;

    const emUso = resposta.filter( mov => mov.status === 'Em uso' ).length;

    const finalizadas =

      resposta.filter(

        mov =>
          mov.status === 'Finalizado'

      ).length;

    this.movimentacaoChart = {
      labels: [
        'Total',
        'Em uso',
        'Finalizadas'
      ],

      datasets: [
        {
          label: 'Movimentações',
          data: [
            total,
            emUso,
            finalizadas
          ],

          backgroundColor: [
            '#161616',
            '#f59e0b',
            '#2563eb'
          ],

          borderRadius: 8
        }
      ]
    };

    this.movimentacaoOptions = {

      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },

      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  });

  this.manutencaoService.listar().subscribe(resposta => {

    this.totalGastoManutencao = 0;
    this.quantidadeManutencoes = resposta.length;
    this.quantidadeCarros = 0;
    this.quantidadeMotos = 0;

    resposta.forEach(m => {

      this.totalGastoManutencao += Number(m.valor) || 0;

      if (m.tipoVeiculo === 'Carro') {
        this.quantidadeCarros++;
      } else {
        this.quantidadeMotos++;
      }
    });

  });
  }
  

}
