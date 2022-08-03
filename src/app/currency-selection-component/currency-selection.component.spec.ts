import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySelectionComponent } from './currency-selection.component';

describe('CurrencySelectionComponent', () => {
  let component: CurrencySelectionComponent;
  let fixture: ComponentFixture<CurrencySelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencySelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
