import { Routes } from '@angular/router';
import { LayoutRestritoComponent } from './layout-restrito/layout-restrito.component';
import { VeiculosComponent } from './layout-restrito/veiculos/veiculos.component';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.component')
            .then(m => m.LoginComponent)
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
        path: 'motorista', canActivate: [ roleGuard ],
        loadComponent: () =>
          import('./layout-restrito/motorista/motorista.component')
            .then(m => m.MotoristaComponent)
      },
      {
        path: 'gerenciar-veiculos', canActivate: [ roleGuard ],
        loadComponent: () =>
          import('./layout-restrito/gerenciar-veiculos/gerenciar-veiculos.component')
            .then(m => m.GerenciarVeiculosComponent)
      },
      {
        path: 'relatorio',
        loadComponent: () =>
          import('./layout-restrito/relatorio-movimentacoes/relatorio-movimentacoes.component')
            .then(m => m.RelatorioMovimentacoesComponent)
      },
      {
        path: 'minha-conta',
        loadComponent: () =>
          import('./layout-restrito/minha-conta/minha-conta.component')
            .then(m => m.MinhaContaComponent)
      },
      {
        path: 'dashboard', canActivate: [ roleGuard ],
        loadComponent: () =>
          import('./layout-restrito/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'manutencao/:id', canActivate: [ roleGuard ],
        loadComponent: () =>
          import('./layout-restrito/manutencao-veiculos/manutencao-veiculos.component')
            .then(m => m.ManutencaoVeiculosComponent)
      },
      {
        path: 'relatorio-manutencao', canActivate: [ roleGuard ],
        loadComponent: () =>
          import('./layout-restrito/relatorio-manutencao/relatorio-manutencao.component')
            .then(m => m.RelatorioManutencaoComponent)
      },
    ]
  }

];
