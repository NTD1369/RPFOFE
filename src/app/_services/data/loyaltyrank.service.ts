import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { SLoyaltyRank } from 'src/app/_models/crm';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyrankService {


  
  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  getAll(companyCode): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'loyaltyRank/GetAll?companyCode=' +companyCode );
  } 
  getItem(companyCode, rankid): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'loyaltyRank/GetByCode?companyCode=' +companyCode + '&rankid=' + rankid );
  }
   
    
  create(model: SLoyaltyRank) {
    return this.http.post(this.baseUrl + 'loyaltyRank/create', model );
  }

    
  update(model: SLoyaltyRank) {
    return this.http.put(this.baseUrl + 'loyaltyRank/update', model);
  }

  
  delete(companyCode, rankid: string) {
    return this.http.delete(this.baseUrl + 'loyaltyRank/delete?companyCode=' +companyCode + '&rankid=' + rankid );
  }
  

}
