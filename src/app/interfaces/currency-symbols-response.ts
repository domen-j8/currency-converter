import {CurrencySymbols} from "./currency-symbols";


export interface CurrencySymbolsResponse {
  motd: {msg: string; url: string};
  success: boolean;
  symbols: CurrencySymbols;
}
