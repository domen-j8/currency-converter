import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {CurrencyService} from "./currency-service/currency.service";
import {Observable, pairwise, startWith} from "rxjs";
import * as Highcharts from 'highcharts';
import {CurrencyConvertResponse} from "./interfaces/currency-convert-response";

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
      categories: []
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
    baseCurrency: ['EUR', Validators.required],
    counterCurrency: ['USD', Validators.required]
  })

  /**
   * Contains converted amount and info about conversion
   */
  convertedCurrency$: Observable<CurrencyConvertResponse> = new Observable<CurrencyConvertResponse>();

  constructor(private fb: FormBuilder, private currencyService: CurrencyService) {
  }

  ngOnInit(): void {
    if (this.currencyConvertForm.valid) {
      this.convertedCurrency$ = this.currencyService.currencyConvert(
        this.currencyConvertForm.get('amount')?.value,
        this.currencyConvertForm.get('baseCurrency')?.value,
        this.currencyConvertForm.get('counterCurrency')?.value
      );

      this.drawGraphLine(this.currencyConvertForm.get('baseCurrency')?.value,
        this.currencyConvertForm.get('counterCurrency')?.value);
    }
    this.subscribeToFormChanges();
  }

  subscribeToFormChanges() {
    this.currencyConvertForm.valueChanges.pipe(
      startWith(null),
      pairwise()
    ).subscribe(([prev, next]: [any, any]) => {
      if (this.currencyConvertForm.valid) {
        this.convertedCurrency$ = this.currencyService.currencyConvert(
          next.amount, next.baseCurrency, next.counterCurrency);
        if (prev === null || prev.baseCurrency != next.baseCurrency || prev.counterCurrency != next.counterCurrency) {
          this.drawGraphLine(this.currencyConvertForm.get('baseCurrency')?.value,
            this.currencyConvertForm.get('counterCurrency')?.value);
        }
      }
    })
  }

  /**
   * It swaps current two currencies for which conversion is done.
   */
  switchCurrencies() {
    let oldBaseCurrency = this.currencyConvertForm.get('baseCurrency')?.value;
    let oldCounterCurrency = this.currencyConvertForm.get('counterCurrency')?.value;
    this.currencyConvertForm.patchValue({
      baseCurrency: oldCounterCurrency,
      counterCurrency: oldBaseCurrency
    })
  }

  /**
   *  It draws daily historical rates between two currencies for current year.
   *
   * @param baseCurrency
   * @param counterCurrency
   */
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
