import { Component, OnInit } from '@angular/core';
import {CurrencyService} from "../currency-service/currency.service";

@Component({
  selector: 'app-currency-selection-component',
  templateUrl: './currency-selection.component.html',
  styleUrls: ['./currency-selection.component.css']
})
export class CurrencySelectionComponent implements OnInit {

  currencies: { name: string, code: string }[] = [];
  selectedCurrency: { name: string; code: string; } | undefined;

  constructor(private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.currencyService.getSymbols()
      .subscribe((r) => {
        this.currencies = Object.entries(r).map((item: any) => ({name: item[1].code, code: item[1].code}))
      })
  }

  onKeyDown() {
    console.log('test');
  }

}
