import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) { }

  getSymbols() {
    return this.http.get('https://api.exchangerate.host/symbols')
      .pipe(
        map((r:any) => r.symbols),
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    return '';
  }

}
