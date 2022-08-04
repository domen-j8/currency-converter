import {Component, NgModule, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {CurrencyService} from "./currency-service/currency.service";
import {Observable} from "rxjs";
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = false;
  chartOptions: Highcharts.Options = {
    series: [{
      data: [1, 2, 3],
      type: 'line'
    }],
    title: {
      style: {
        display: 'none'
      }
    },
    yAxis: {
      title: {
        style: {
          display: 'none'
        }
      }
    },
    xAxis: {
      type: 'datetime'
    },
    tooltip: {
      enabled: false
    }
  };


  currencyConvertForm = this.fb.group({
    amount: [1],
    baseCurrency: ['EUR'],
    counterCurrency: ['USD']
  })

  convertedCurrency$: Observable<any> = this.currencyService.currencyConvert(
    this.currencyConvertForm.get('amount')?.value,
    this.currencyConvertForm.get('baseCurrency')?.value,
    this.currencyConvertForm.get('counterCurrency')?.value
  );

  constructor(private fb: FormBuilder, private currencyService: CurrencyService) {
  }

  ngOnInit(): void {
    this.currencyConvertForm.valueChanges.subscribe(val => {
      this.convertedCurrency$ = this.currencyService.currencyConvert(val.amount, val.baseCurrency, val.counterCurrency);
      this.currencyService.timeSeries(val.baseCurrency, val.counterCurrency)
        .subscribe((res) => {
          let timeSeriesValues: any[] = []
          Object.entries(res.rates).forEach((rate: any) => {
            console.log('rate: ', timeSeriesValues.push(Object.values(rate[1])[0]));
          })
          console.log('time series: ', timeSeriesValues);

          this.chartOptions.series = [
            {
              data: timeSeriesValues,
              type: 'line'
            }
          ];
          this.updateFlag = true;


        })

    })



  }

  switchCurrencies() {
    let oldBaseCurrency = this.currencyConvertForm.get('baseCurrency')?.value;
    let oldCounterCurrency = this.currencyConvertForm.get('counterCurrency')?.value;
    this.currencyConvertForm.patchValue({
      baseCurrency: oldCounterCurrency,
      counterCurrency: oldBaseCurrency
    })
  }


}
