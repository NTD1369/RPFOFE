import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MStoreCurrency } from 'src/app/_models/storecurrency';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorecurrencyService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  getAll(companyCode, storeId): Observable<MStoreCurrency[]> {
    return this.http.get<MStoreCurrency[]>(this.baseUrl + 'storecurrency/GetAll?companyCode=' + companyCode + '&storeId=' + storeId);
  } 
  getByStoreWExchangeRate(companyCode, storeId): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'storecurrency/GetByStoreWExchangeRate?companyCode=' + companyCode + '&storeId=' + storeId);
  } 
  getItem(companyCode, storeId, code): Observable<MStoreCurrency> {
    return this.http.get<MStoreCurrency>(this.baseUrl + 'storecurrency/GetByCode?companyCode=' + companyCode + '&storeId=' + storeId + '&code=' + code);
  }
  
  create(model: MStoreCurrency) {
     
    return this.http.post(this.baseUrl + 'storecurrency/create', model );
  } 
  update(model: MStoreCurrency) {
    
    return this.http.put(this.baseUrl + 'storecurrency/update', model);
  }
 
  delete(companycode, storeId, currencyCode) {
    return this.http.delete(this.baseUrl + 'storecurrency/delete?companycode=' + companycode + '&storeId=' + storeId + '&currencyCode=' + currencyCode);
  }


}
