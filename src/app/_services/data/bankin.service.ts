import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { TBankIn } from 'src/app/_models/bankin';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankinService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode, storeId, dailyId): Observable<TBankIn[]> {
    return this.http.get<TBankIn[]>(this.baseUrl + 'bankin/GetAll?companyCode=' + companyCode  + '&storeId=' + storeId + '&dailyId=' + dailyId );
  }
  
  getItem(companyCode, storeId, dailyId, id): Observable<TBankIn> {
    return this.http.get<TBankIn>(this.baseUrl + 'bankin/GetById?companyCode=' + companyCode + '&storeId=' + storeId + '&dailyId=' + dailyId + '&id=' + id);
  }
   
    
  create(model: TBankIn) {
    
    return this.http.post(this.baseUrl + 'bankin/create', model );
  }

    
  update(model: TBankIn) {
  
    return this.http.put(this.baseUrl + 'bankin/update', model);
  }

  
  delete(model: TBankIn) {
    return this.http.post(this.baseUrl + 'bankin/delete', model );
  }
  // import(data: DataImport) {
    
  //   return this.http.post(this.baseUrl + 'holiday/import', data );
  // }
}
