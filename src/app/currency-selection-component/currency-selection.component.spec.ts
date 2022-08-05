import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySelectionComponent } from './currency-selection.component';
import {HttpClientModule} from "@angular/common/http";

describe('CurrencySelectionComponent', () => {
  let component: CurrencySelectionComponent;
  let fixture: ComponentFixture<CurrencySelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
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
