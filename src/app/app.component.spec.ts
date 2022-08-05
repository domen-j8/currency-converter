import {TestBed} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {HighchartsChartModule} from "highcharts-angular";

describe('AppComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        HighchartsChartModule
      ],
      declarations: [
        AppComponent,
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should flip base/counter currencies', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.currencyConvertForm.setValue({
      amount: 10,
      baseCurrency: 'EUR',
      counterCurrency: 'USD'
    });
    expect(app.currencyConvertForm.valid).toEqual(true);
    expect(app.currencyConvertForm.get('baseCurrency')?.value).toEqual('EUR');
    expect(app.currencyConvertForm.get('counterCurrency')?.value).toEqual('USD');

    app.switchCurrencies();

    expect(app.currencyConvertForm.get('baseCurrency')?.value).toEqual('USD');
    expect(app.currencyConvertForm.get('counterCurrency')?.value).toEqual('EUR');

  });

});
