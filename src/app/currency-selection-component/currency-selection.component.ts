import {Component, HostListener, OnInit} from '@angular/core';
import {CurrencyService} from "../currency-service/currency.service";
import {BehaviorSubject, debounceTime, map, Observable, skip, switchMap, takeUntil} from "rxjs";
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

  term$ = new BehaviorSubject<string>('');
  results$: Observable<any> = this.term$.pipe(
    debounceTime(1000),
    switchMap(term =>
      this.currencyService.getSymbols().pipe(
        map(currency => Object.entries(currency).filter((item: any) => item[1].code.includes(term.toUpperCase()))),
        takeUntil(this.term$.pipe(skip(1)))
      )
    )
  )

  showCurrencies: boolean = false;
  currencies: any;
  selectedCurrency: string = '';
  onChange = (selectedCurrency: any) => {debugger};
  onTouched = () => {debugger};

  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.showCurrencies = false;
    // if (this.selectedCurrency === '') {
    //   this.selectedCurrency = 'EUR';
    // }
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
