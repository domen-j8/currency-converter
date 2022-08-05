import {CurrencySymbols} from "./currency-symbols";
import {ExchangeRateResponse} from "./exchange-rate-response";


export interface CurrencySymbolsResponse extends ExchangeRateResponse {
  symbols: CurrencySymbols;
}
