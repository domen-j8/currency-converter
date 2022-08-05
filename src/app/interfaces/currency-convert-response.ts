import {ExchangeRateResponse} from "./exchange-rate-response";
import {ConvertQuery} from "./convert-query";

export interface CurrencyConvertResponse extends ExchangeRateResponse {
  query: ConvertQuery;
  info: {rate: number};
  historical: boolean;
  date: string;
  result: number
}
