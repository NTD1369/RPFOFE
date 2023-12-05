import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { SCurrencyRoundingOff } from 'src/app/_models/currencyRoundingOff';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyRoundingOffService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  getAll(companyCode,storeId): Observable<SCurrencyRoundingOff[]> {
    return this.http.get<SCurrencyRoundingOff[]>(this.baseUrl + 'CurrencyRoundingOff/GetAll?companyCode=' + companyCode + '&StoreId=' + storeId );
  } 
   
  
  getItem(companyCode,storeId, id): Observable<SCurrencyRoundingOff> {
    return this.http.get<SCurrencyRoundingOff>(this.baseUrl + 'CurrencyRoundingOff/GetById?companyCode=' + companyCode + '&StoreId=' + storeId + '&id=' + id);
  }
  
  create(model: SCurrencyRoundingOff) {
     
    return this.http.post(this.baseUrl + 'CurrencyRoundingOff/create', model );
  }

    
  update(model: SCurrencyRoundingOff) {
    
    return this.http.put(this.baseUrl + 'CurrencyRoundingOff/update', model);
  }
 
  delete(model: SCurrencyRoundingOff) {
    return this.http.post(this.baseUrl + 'CurrencyRoundingOff/delete' ,model );
  }

}
