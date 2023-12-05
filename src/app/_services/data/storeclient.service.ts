import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { SStoreClient } from 'src/app/_models/storeclient';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreclientService {


    // baseUrl = environment.apiUrl;
    baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  getAll(companyCode, storeId, from, to): Observable<SStoreClient[]> {
    return this.http.get<SStoreClient[]>(this.baseUrl + 'StoreClient/GetAll?companyCode=' + companyCode + '&storeId=' + storeId + '&from='+ from +  '&to=' +to);
  } 
 
  GetCounterSalesInDay(companyCode, storeId, date): Observable<SStoreClient[]> {
    return this.http.get<SStoreClient[]>(this.baseUrl + 'StoreClient/GetCounterSalesInDay?companyCode=' + companyCode + '&storeId=' + storeId + '&date='+ date);
  } 
 
  getById(companyCode, storeId,Id, LocalIp, PublicIP): Observable<SStoreClient> {
    return this.http.get<SStoreClient>(this.baseUrl + 'StoreClient/GetById?companyCode=' + companyCode + '&storeId=' + storeId + '&Id=' + Id + '&LocalIp=' + LocalIp + '&PublicIP=' + PublicIP);
  }
  
  create(model: SStoreClient) { 
    return this.http.post(this.baseUrl + 'StoreClient/create', model );
  }

    
  update(model: SStoreClient) { 
    return this.http.put(this.baseUrl + 'StoreClient/update', model);
  }
 
  delete(model: SStoreClient) {
    return this.http.post(this.baseUrl + 'StoreClient/delete', model);
  }

}
