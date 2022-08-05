import {Component, HostListener, OnInit} from '@angular/core';
import {CurrencyService} from "../currency-service/currency.service";
import {BehaviorSubject, map, Observable, of, switchMap} from "rxjs";
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from "@angular/forms";

@Component({
  selector: 'app-currency-selection-component',
  templateUrl: './currency-selection.component.html',
  styleUrls: ['./currency-selection.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: CurrencySelectionComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CurrencySelectionComponent
    }
  ]
})
export class CurrencySelectionComponent implements OnInit, ControlValueAccessor, Validator {

  symbols$ = new Observable<any>();
  term$ = new BehaviorSubject<string>('');
  results$: Observable<any> = this.term$.pipe(
    switchMap(term =>
      this.symbols$.pipe(
        map(currency => Object.entries(currency).filter((item: any) => item[1].code.startsWith(term.toUpperCase()))),
      )
    )
  )

  showCurrencies: boolean = false;
  currencies: any;
  selectedCurrency: string = '';
  previousSelectedCurrency = '';
  onChange = (selectedCurrency: any) => {debugger};
  onTouched = () => {debugger};

  @HostListener('document:click', ['$event']) onDocumentClick() {
    if (this.showCurrencies) {
      // If new currency is not selected show previous one.
      this.selectedCurrency = this.previousSelectedCurrency;
    }
    this.showCurrencies = false;
  }

  constructor(private currencyService: CurrencyService) {
  }

  ngOnInit(): void {
    this.currencyService.getSymbols()
      .subscribe((res) => {
        this.symbols$ = of(res);
    })
  }

  showDropDown(event: any) {
    this.previousSelectedCurrency = this.selectedCurrency;
    this.term$.next('')
    this.showCurrencies = true;
    event.stopPropagation()
  }

  selectCurrency(currency: any) {
    this.selectedCurrency = currency[1].code;
    this.showCurrencies = false;
    this.onChange(this.selectedCurrency);
  }

  onInputChange(event: any) {
    this.term$.next(event.target.value)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  writeValue(obj: any): void {
    this.selectedCurrency = obj;
  }

}
