import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MPriceListName } from 'src/app/_models/pricelistname';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PricelistnameService {


  
  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
  getAll(companyCode): Observable<MPriceListName[]> {
    return this.http.get<MPriceListName[]>(this.baseUrl + 'pricelistname/GetAll?companyCode=' + companyCode );
  }
   
  getItem(companyCode, priceListId): Observable<MPriceListName> {
    return this.http.get<MPriceListName>(this.baseUrl + 'pricelistname/GetByCode?companyCode=' + companyCode + '&priceListId=' + priceListId);
  }
   
    
  create(model: MPriceListName) {
    
    return this.http.post(this.baseUrl + 'pricelistname/create', model );
  }

    
  update(model: MPriceListName) {
   
    return this.http.put(this.baseUrl + 'pricelistname/update', model);
  }

  
  delete(model: MPriceListName) {
    return this.http.post(this.baseUrl + 'pricelistname/delete' , model );
  }
 



}
