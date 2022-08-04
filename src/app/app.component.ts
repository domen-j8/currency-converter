import {Component, NgModule, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {CurrencyService} from "./currency-service/currency.service";
import {merge, Observable, pairwise} from "rxjs";
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
      data: [],
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
      gridLineWidth: 1,
      categories: ['1.1.2022', '1.2.2022', '1.3.2022', '1.4.2022']
    },
    tooltip: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    credits: {
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
    this.drawGraphLine(this.currencyConvertForm.get('baseCurrency')?.value,
      this.currencyConvertForm.get('counterCurrency')?.value);

    this.currencyConvertForm.valueChanges.pipe(
      pairwise()
    ).subscribe(([prev, next]: [any, any]) => {
      this.convertedCurrency$ = this.currencyService.currencyConvert(next.amount, next.baseCurrency, next.counterCurrency);

      if (prev.baseCurrency != next.counterCurrency || prev.baseCurrency != prev.counterCurrency) {
        this.drawGraphLine(this.currencyConvertForm.get('baseCurrency')?.value,
          this.currencyConvertForm.get('counterCurrency')?.value);
      }
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

  drawGraphLine(baseCurrency: any, counterCurrency: any) {
    let today = new Date().toISOString().slice(0, 10)
    let startDate = `${new Date().getFullYear()}-01-01`

    this.currencyService.timeSeries(startDate, today, baseCurrency, counterCurrency)
      .subscribe((res) => {
        let timeSeriesValues: any[] = [];
        let timeSeriesDates: any[] = [];
        Object.entries(res.rates).forEach((rate: any) => {
          timeSeriesValues.push(Object.values(rate[1])[0]);
          timeSeriesDates.push(rate[0]);
        })
        this.chartOptions.series = [
          {
            data: timeSeriesValues,
            type: 'line',
            color: '#ff1493'
          }
        ];
        this.chartOptions.xAxis = {
          gridLineWidth: 1,
          categories: timeSeriesDates
        }
        this.updateFlag = true;
      })
  }

}
