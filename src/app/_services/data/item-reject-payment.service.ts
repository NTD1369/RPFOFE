import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MItemRejectPayment } from 'src/app/_models/MItemRejectPayment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemRejectPaymentService {

  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode, itemCode, status): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'ItemRejectPayment/GetAll?companyCode=' + companyCode + '&itemCode=' + itemCode + '&status=' + status);
  }
  
  // getItem(companyCode, code): Observable<any> {
  //   return this.http.get<any>(this.baseUrl + 'ItemRejectPayment/GetByCode?companyCode=' + companyCode + '&code=' + code);
  // }
   
    
  create(model: MItemRejectPayment) {
    
    return this.http.post(this.baseUrl + 'ItemRejectPayment/create', model );
  }

    
  update(model: MItemRejectPayment) {
  
    return this.http.put(this.baseUrl + 'ItemRejectPayment/update', model);
  }

  
  delete(model: MItemRejectPayment) {
    return this.http.post(this.baseUrl + 'ItemRejectPayment/delete', model );
  }
  // import(data: DataImport) {
    
  //   return this.http.post(this.baseUrl + 'holiday/import', data );
  // }

}
