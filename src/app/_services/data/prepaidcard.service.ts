import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MPrepaidCard, TPrepaidCardTrans } from 'src/app/_models/prepaidcard';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrepaidcardService {



  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(  private http: HttpClient, public env: EnvService) { } 
  getAll(companyCode, status): Observable<MPrepaidCard[]> {
    return this.http.get<MPrepaidCard[]>(this.baseUrl + 'prepaidcard/GetAll?companyCode='+ companyCode + '&status=' + status);
  }
  
  
  getItem(companyCode, code): Observable<MPrepaidCard> {
    return this.http.get<MPrepaidCard>(this.baseUrl + 'prepaidcard/GetById?companyCode='+companyCode+'&code=' + code);
  }
   
  getHistoryItem(companyCode, code): Observable<TPrepaidCardTrans> {
    return this.http.get<TPrepaidCardTrans>(this.baseUrl + 'prepaidcard/GetHistoryById?companyCode='+companyCode+'&code=' + code);
  }
  create(model: MPrepaidCard) {
    
    return this.http.post(this.baseUrl + 'prepaidcard/create', model );
  }

    
  update(model: MPrepaidCard) {
    
    return this.http.put(this.baseUrl + 'prepaidcard/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'prepaidcard/delete' + Id );
  }
  import(data: DataImport) {
    
    return this.http.post(this.baseUrl + 'prepaidcard/import', data );
  }

}
