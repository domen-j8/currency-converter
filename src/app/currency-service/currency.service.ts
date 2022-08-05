import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {CurrencySymbolsResponse} from "../interfaces/currency-symbols-response";
import {CurrencySymbols} from "../interfaces/currency-symbols";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) { }

  getSymbols(): Observable<CurrencySymbols> {
    return this.http.get<CurrencySymbolsResponse>('https://api.exchangerate.host/symbols')
      .pipe(
        map((r: CurrencySymbolsResponse) => r.symbols),
        catchError(this.handleError)
      );
  }

  currencyConvert(amount: any, baseCurrency: any, counterCurrency: any): Observable<any> {
    return this.http.get(`https://api.exchangerate.host/convert?from=${baseCurrency}&to=${counterCurrency}&amount=${amount}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  timeSeries(startDate: any, today: any, baseCurrency: any, counterCurrency: any): Observable<any> {
    return this.http.get(`https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${today}&base=${baseCurrency}&symbols=${counterCurrency}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
