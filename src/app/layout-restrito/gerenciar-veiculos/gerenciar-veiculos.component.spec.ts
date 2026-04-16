import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarVeiculosComponent } from './gerenciar-veiculos.component';

describe('GerenciarVeiculosComponent', () => {
  let component: GerenciarVeiculosComponent;
  let fixture: ComponentFixture<GerenciarVeiculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarVeiculosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarVeiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
