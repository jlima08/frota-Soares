//Angular
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Componentes
import { CardPageComponent } from "../components/card-page/card-page.component";

//Services e Interfaces
import { VeiculosService } from '../../service/veiculos.service';
import { ManutencaoService } from '../../service/manutencao.service';
import { Veiculo } from '../../interfaces/veiculo.interface';
import { Manutencao } from '../../interfaces/manutencao.interface';

//PrimeNG
import { InputText } from "primeng/inputtext";
import { MessageService } from 'primeng/api';
import { FloatLabelModule } from "primeng/floatlabel";
import { InputNumberModule } from "primeng/inputnumber";
import { ButtonModule } from "primeng/button";
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from "primeng/message";
import { CardModule } from "primeng/card";

@Component({
  selector: 'app-manutencao-veiculos',
  imports: [
    CardPageComponent,
    InputText,
    CommonModule,
    FloatLabelModule,
    InputNumberModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    ToastModule,
    MessageModule,
    CardModule,
    RouterLink
],
  templateUrl: './manutencao-veiculos.component.html',
  styleUrl: './manutencao-veiculos.component.scss',
  providers: [MessageService]
})
export class ManutencaoVeiculosComponent {
  private route = inject(ActivatedRoute);
  private veiculoService = inject(VeiculosService);
  private manutencaoService = inject(ManutencaoService);
  private messageService = inject(MessageService);

  veiculo?: Veiculo;

  loading = false;

  oficinas = [
  {
    label: 'Oficina interna',
    value: 'Oficina interna'
  },
  {
    label: 'Terceirizada',
    value: 'Terceirizada'
  }
];

  tiposManutencao = [

    {
      label: 'Troca de óleo',
      value: 'Troca de óleo'
    },

    {
      label: 'Troca de pneus',
      value: 'Troca de pneus'
    },

    {
      label: 'Outros',
      value: 'Outros'
    }

  ];

  manutencao: Partial<Manutencao> = {

    tipo: '',
    km: undefined,
    servicoRealizado: '',
    produtosUtilizados: '',
    oficina: '',
    valor: undefined

  };
  outraOficina = '';

  ngOnInit() {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.veiculoService
      .buscarPorId(id)
      .subscribe(resposta => {

        this.veiculo = resposta;

      });

  }

  async salvar() {

    if (!this.veiculo) return;

    if (
      !this.manutencao.tipo ||
      !this.manutencao.km ||
      !this.manutencao.servicoRealizado ||
      !this.manutencao.produtosUtilizados
    ) {

      this.messageService.add({

        severity: 'warn',
        summary: 'Preencha os campos obrigatórios'

      });

      return;
    }
    //se a opção for Terceirizada vai salvar oq for digitado no campo
    if (this.manutencao.oficina === 'Terceirizada') {
      this.manutencao.oficina = this.outraOficina;
    }

    this.loading = true;

    try {

      await this.manutencaoService.cadastrar({

        veiculoId: this.veiculo.id!,

        modelo: this.veiculo.modelo,

        placa: this.veiculo.placa,

        tipoVeiculo: this.veiculo.tipo,

        tipo: this.manutencao.tipo!,

        km: this.manutencao.km!,

        servicoRealizado:
          this.manutencao.servicoRealizado!,

        produtosUtilizados:
          this.manutencao.produtosUtilizados!,

        oficina:
          this.manutencao.oficina ?? '',

        valor:
          this.manutencao.valor ?? 0,

        data:
          new Date().toISOString()

      });

      // Atualiza automaticamente o KM do óleo
      if (this.manutencao.tipo === 'Troca de óleo') {

        await this.veiculoService.atualizar(this.veiculo.id!, {

            kmUltimaTrocaOleo:this.manutencao.km,

            kmProximaTrocaOleo: Number(this.manutencao.km) + 10000

          }

        );

      }

      this.messageService.add({
        severity: 'success',
        summary: 'Manutenção registrada'
      });

      this.manutencao = {

        tipo: '',
        km: undefined,
        servicoRealizado: '',
        produtosUtilizados: '',
        oficina: '',
        valor: 0
      };

    }
    finally {
      this.loading = false;
    }
  }

}
