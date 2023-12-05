import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; 
import { EnvService } from 'src/app/env.service';
import { TGoodsReceiptHeader } from 'src/app/_models/goodreceipt';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class GoodrecieptService {
 

  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService,private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(): Observable<TGoodsReceiptHeader[]> {
    return this.http.get<TGoodsReceiptHeader[]>(this.baseUrl + 'goodreceipt/GetAll');
  }
 
  getReceipt(id,storeId, companyCode): Observable<TGoodsReceiptHeader> {
    if((storeId===null || storeId===undefined ) && (companyCode===null || companyCode===undefined ))
    {
      let store = this.authService.storeSelected(); 
      storeId = store.storeId;
      companyCode= store.companyCode;
    } 
    return this.http.get<TGoodsReceiptHeader>(this.baseUrl + 'goodreceipt/GetById?id=' + id + '&storeId='+ storeId+ '&companyCode='+ companyCode);
  }
    
  create(model: TGoodsReceiptHeader) {
     let store = this.authService.storeSelected();
     debugger;
    model.storeId = store.storeId;
    model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'goodreceipt/create', model );
  } 
    
  update(model: TGoodsReceiptHeader) {
    return this.http.put(this.baseUrl + 'goodreceipt/update', model);
  } 
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'goodreceipt/delete' + Id );
  }

}
