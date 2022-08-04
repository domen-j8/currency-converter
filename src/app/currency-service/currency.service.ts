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

  currencyConvert(): Observable<any> {
    return this.http.get('https://api.exchangerate.host/convert?from=USD&to=EUR')
      .pipe(
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    return '';
  }

}
