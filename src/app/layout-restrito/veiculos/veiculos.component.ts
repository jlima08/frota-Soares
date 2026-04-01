import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

interface Carro {
  id: number;
  modelo: string;
  ano: string;
  placa: string;
  cor: string;
}

@Component({
  selector: 'app-veiculos',
  imports: [
    CardModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    CommonModule
    
  ],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class VeiculosComponent {


  carros: Carro[] = [
    {
      id: 1, modelo: 'Gol bolinha', ano: '2000', placa: 'OVG2441', cor: 'Prata'
    },
    {
      id: 2, modelo: 'Gol g4', ano: '2001', placa: 'OVG2441', cor: 'Prata'
    },
    {
      id: 3, modelo: 'Strada', ano: '2002', placa: 'OVG2441', cor: 'Branco'
    },   
    {
      id: 3, modelo: 'Strada', ano: '2002', placa: 'OVG2441', cor: 'Branco'
    },   
    {
      id: 3, modelo: 'Strada', ano: '2002', placa: 'OVG2441', cor: 'Branco'
    },   

  ]

   constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

    confirm(carros: Carro) {
        this.confirmationService.confirm({
            header: 'Confirmação',
            message: `Ao confirmar você ficará responsável pelo ${carros.modelo}`,
            icon: 'pi pi-exclamation-circle',
            rejectButtonProps: {
                label: 'Cancelar',
                icon: 'pi pi-times',
                outlined: true,
                size: 'small',
                severity: 'danger'
            },
            acceptButtonProps: {
                label: 'Selecionar',
                icon: 'pi pi-check',
                size: 'small'
            },
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
                console.log('Carro selecionado:', carros);
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    }


}
