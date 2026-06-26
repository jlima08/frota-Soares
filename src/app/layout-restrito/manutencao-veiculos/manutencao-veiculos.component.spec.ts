import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManutencaoVeiculosComponent } from './manutencao-veiculos.component';

describe('ManutencaoVeiculosComponent', () => {
  let component: ManutencaoVeiculosComponent;
  let fixture: ComponentFixture<ManutencaoVeiculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManutencaoVeiculosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManutencaoVeiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
