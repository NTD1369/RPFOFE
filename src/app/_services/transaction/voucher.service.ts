import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { TVoucherTransaction } from 'src/app/_models/vouchertransaction';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {


    // baseUrl = environment.apiUrl;
    baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode): Observable<TVoucherTransaction[]> {
    return this.http.get<TVoucherTransaction[]>(this.baseUrl + 'VoucherTransaction/GetAll?companyCode=' + companyCode );
  }
 
  getByCode(companyCode, itemcode, VoucherNo, VoucherType): Observable<TVoucherTransaction> {
   
    return this.http.get<TVoucherTransaction>(this.baseUrl + 'VoucherTransaction/GetByCode?companyCode=' + companyCode + '&itemcode='+ itemcode+ '&VoucherNo='+ VoucherNo+ '&VoucherType='+ VoucherType);
  }
    
  create(model: TVoucherTransaction) {
    //  let store = this.authService.storeSelected();
    //  debugger;
    // model.storeId = store.storeId;
    // model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'VoucherTransaction/create', model );
  } 
    
  update(model: TVoucherTransaction) {
    return this.http.put(this.baseUrl + 'VoucherTransaction/update', model);
  } 
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'VoucherTransaction/delete' + Id );
  }


}
