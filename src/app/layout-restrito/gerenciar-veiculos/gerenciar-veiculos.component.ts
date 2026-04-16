import { Component, inject, signal } from '@angular/core';
import { CardPageComponent } from "../components/card-page/card-page.component";
import { VeiculoService } from '../../service/veiculo.service';
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from 'primeng/inputtext';
import { Veiculo } from '../../interfaces/veiculo.interface';

@Component({
  selector: 'app-gerenciar-veiculos',
  imports: [CardPageComponent, TableModule, ButtonModule, FloatLabelModule, InputTextModule],
  templateUrl: './gerenciar-veiculos.component.html',
  styleUrl: './gerenciar-veiculos.component.scss'
})
export class GerenciarVeiculosComponent {
  public veiculoService = inject(VeiculoService);
  cadastrarVeiculo = false
  
   loading: boolean = false;

    load() {
        this.loading = true;

        setTimeout(() => {
            this.loading = false
        }, 2000);
    } // Signal para o estado de carregamento

  constructor() { }

  showCadastrarVeiculo(){
    this.cadastrarVeiculo = !this.cadastrarVeiculo;
  }
  editarVeiculo(veiculo: Veiculo): void {
  console.log('Editar veículo:', veiculo);
  // Aqui você pode abrir um modal ou navegar para a tela de edição
}

excluirVeiculo(id: number): void {
  this.veiculoService.deleteVeiculo(id);
}


}
