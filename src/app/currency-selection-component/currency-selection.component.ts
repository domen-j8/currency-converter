import {Component, HostListener, OnInit} from '@angular/core';
import {CurrencyService} from "../currency-service/currency.service";
import {BehaviorSubject, debounceTime, map, Observable, skip, switchMap, takeUntil} from "rxjs";

@Component({
  selector: 'app-currency-selection-component',
  templateUrl: './currency-selection.component.html',
  styleUrls: ['./currency-selection.component.css']
})
export class CurrencySelectionComponent implements OnInit {

  term$ = new BehaviorSubject<string>('');
  results$: Observable<any> = this.term$.pipe(
    debounceTime(1000),
    switchMap(term =>
      this.currencyService.getSymbols().pipe(
        map(currency => Object.entries(currency).filter((item: any) => item[1].code.includes(term))),
        takeUntil(this.term$.pipe(skip(1)))
      )
    )
  )

  showCurrencies: boolean = false;
  currencies: any;
  selectedCurrency: string = 'EUR';

  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.showCurrencies = false;
    if (this.selectedCurrency === '') {
      this.selectedCurrency = 'EUR';
    }
  }

  constructor(private currencyService: CurrencyService) {
  }

  ngOnInit(): void {
  }

  showDropDown(event: any) {
    this.showCurrencies = true;
    event.stopPropagation()
  }

  selectCurrency(currency: any, event: any) {
    this.selectedCurrency = currency[1].code;
    this.showCurrencies = false;
    this.term$.next(this.selectedCurrency)
  }

  onInputChange(event: any) {
    this.term$.next(event.target.value)
  }

}
