import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosCombustivelComponent } from './gastos-combustivel.component';

describe('GastosCombustivelComponent', () => {
  let component: GastosCombustivelComponent;
  let fixture: ComponentFixture<GastosCombustivelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastosCombustivelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastosCombustivelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
