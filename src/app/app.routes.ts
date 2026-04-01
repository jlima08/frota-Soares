import { Routes } from '@angular/router';
import { LayoutRestritoComponent } from './layout-restrito/layout-restrito.component';
import { VeiculosComponent } from './layout-restrito/veiculos/veiculos.component';

export const routes: Routes = [
  {
        path: '',
        redirectTo: 'restrito',
        pathMatch: 'full',
      },
    {
    path: 'restrito',
    loadComponent: () =>
      import('./layout-restrito/layout-restrito.component')
        .then(m => m.LayoutRestritoComponent),

    children: [
      {
        path: 'veiculos',
        loadComponent: () =>
          import('./layout-restrito/veiculos/veiculos.component')
            .then(m => m.VeiculosComponent)
      },
      {
        path: 'motorista',
        loadComponent: () =>
          import('./layout-restrito/motorista/motorista.component')
            .then(m => m.MotoristaComponent)
      }
    ]
  }

];
