import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutRestritoComponent } from './layout-restrito.component';

describe('LayoutRestritoComponent', () => {
  let component: LayoutRestritoComponent;
  let fixture: ComponentFixture<LayoutRestritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutRestritoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutRestritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
