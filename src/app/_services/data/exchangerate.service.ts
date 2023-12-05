import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MExchangeRate } from 'src/app/_models/exchangerate';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExchangerateService {



  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  getAll(companyCode, storeId, Currency, from, to): Observable<MExchangeRate[]> {
    debugger;
    return this.http.get<MExchangeRate[]>(this.baseUrl + 'exchangerate/GetAll?companyCode=' + companyCode + '&storeId=' + storeId + '&Currency=' + Currency + '&from=' + from + '&to=' + to);
  } 
  getExchangeRateByStore(companyCode, storeId, Currency): Observable<MExchangeRate[]> {
    return this.http.get<MExchangeRate[]>(this.baseUrl + 'exchangerate/GetExchangeRateByStore?companyCode=' + companyCode + '&storeId=' + storeId+ '&Currency=' + Currency);
  }  
  getExchangeRateIsNullByDate(companyCode, storeId, date): Observable<MExchangeRate[]> {
    return this.http.get<MExchangeRate[]>(this.baseUrl + 'exchangerate/GetExchangeRateIsNullByDate?companyCode=' + companyCode + '&storeId=' + storeId+ '&Date=' + date);
  } 
  getByCurrency(companyCode, storeId, currencyCode): Observable<MExchangeRate> {
    return this.http.get<MExchangeRate>(this.baseUrl + 'exchangerate/GetByCurrency?companyCode=' + companyCode + '&storeId=' + storeId + '&CurrencyCode=' + currencyCode);
  }
  getByDate(companyCode, storeId, date): Observable<MExchangeRate> {
    return this.http.get<MExchangeRate>(this.baseUrl + 'exchangerate/GetByDate?companyCode=' + companyCode + '&storeId=' + storeId + '&date=' + date);
  }
  
  create(model: MExchangeRate) {
     
    return this.http.post(this.baseUrl + 'exchangerate/create', model );
  } 
  update(model: MExchangeRate) {
    
    return this.http.put(this.baseUrl + 'exchangerate/update', model);
  }
  delete(model: MExchangeRate) {
    
    return this.http.post(this.baseUrl + 'exchangerate/delete', model);
  }
}
