import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, concatMap, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) { }

  getSymbols(): Observable<any> {
    return this.http.get('https://api.exchangerate.host/symbols')
      .pipe(
        map((r:any) => r.symbols),
        catchError(this.handleError)
      );
  }

  currencyConvert(amount: any, baseCurrency: any, counterCurrency: any): Observable<any> {
    return this.http.get(`https://api.exchangerate.host/convert?from=${baseCurrency}&to=${counterCurrency}&amount=${amount}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  timeSeries(baseCurrency: any, counterCurrency: any): Observable<any> {
    return this.http.get(`https://api.exchangerate.host/timeseries?start_date=2022-01-01&end_date=2022-08-04&base=${baseCurrency}&symbols=${counterCurrency}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    return '';
  }

}
