import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CardPageComponent } from '../components/card-page/card-page.component';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { MotoristasService } from '../../service/motoristas.service';

interface Motorista {
  id: number;
  nome: string;
  sobrenome: string;
  celular: string;
  cargo: string;
}

@Component({
  selector: 'app-motorista',
  imports: [ButtonModule, TableModule, InputTextModule, FloatLabelModule, CardPageComponent],
  templateUrl: './motorista.component.html',
  styleUrl: './motorista.component.scss'
})
export class MotoristaComponent {
  public motoristaService = inject(MotoristasService);
  // public loading = signal<boolean>(false);
  CadMotorista = false;

   loading: boolean = false;

    load() {
        this.loading = true;

        setTimeout(() => {
            this.loading = false
        }, 2000);
    }

  showCadMotorista(){
    this.CadMotorista = !this.CadMotorista;
  }

  //  motoristas: Motorista[] = [
  //   {
  //     id: 1, nome: 'John', sobrenome: 'Lima', celular: '68999887766', cargo: 'Tecnico'
  //   },
  //   {
  //     id: 2, nome: 'Anderson', sobrenome: 'Camargo', celular: '68999887766', cargo: 'Gerente'
  //   },
  //   {
  //     id: 3, nome: 'Felipinho', sobrenome: 'safado', celular: '68999887766', cargo: 'Tecnico'
  //   },   
  //   {
  //     id: 4, nome: 'Cristian', sobrenome: 'Chefe', celular: '68999887766', cargo: 'CEO'
  //   },   
  //   {
  //     id: 5, nome: 'Ruan', sobrenome: 'Mendoça', celular: '68999887766', cargo: 'Tecnico'
  //   },   
  //   {
  //     id: 6, nome: 'Ruan', sobrenome: 'Mendoça', celular: '68999887766', cargo: 'Tecnico'
  //   },   
  //   {
  //     id: 7, nome: 'Ruan', sobrenome: 'Mendoça', celular: '68999887766', cargo: 'Tecnico'
  //   },   

  // ]
  

  

}
