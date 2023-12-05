import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { TGoodsReceiptHeader } from 'src/app/_models/goodreceipt';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class GoodreceiptService {


    // baseUrl = environment.apiUrl;
    baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode): Observable<TGoodsReceiptHeader[]> {
    return this.http.get<TGoodsReceiptHeader[]>(this.baseUrl + 'goodreceipt/GetAll?companyCode='+ companyCode);
  }
  getByStore(companyCode, storeId): Observable<TGoodsReceiptHeader[]> {
    return this.http.get<TGoodsReceiptHeader[]>(this.baseUrl + 'goodreceipt/GetByStore?companyCode='+ companyCode + '&storeId='+ storeId);
  }
  getGoodsReceiptList(companyCode, StoreId,Status,FrDate,ToDate,Keyword, ViewBy): Observable<TGoodsReceiptHeader[]> {
    return this.http.get<TGoodsReceiptHeader[]>(this.baseUrl + 'goodreceipt/GetGoodsReceiptList?CompanyCode='+companyCode+'&StoreId='+StoreId+'&Status='+Status+'&FrDate='+FrDate+'&ToDate='+ToDate+'&Keyword='+Keyword + '&ViewBy=' + ViewBy);
  }
  getReceipt(id,storeId, companyCode): Observable<TGoodsReceiptHeader> {
    
    return this.http.get<TGoodsReceiptHeader>(this.baseUrl + 'goodreceipt/GetById?id=' + id + '&storeId='+ storeId+ '&companyCode='+ companyCode);
  }
    
  create(model: TGoodsReceiptHeader) {
     
    return this.http.post(this.baseUrl + 'goodreceipt/create', model );
  } 
    
  update(model: TGoodsReceiptHeader) {
    return this.http.put(this.baseUrl + 'goodreceipt/update', model);
  } 
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'goodreceipt/delete' + Id );
  }
  import(data: DataImport) { 
    return this.http.post(this.baseUrl + 'goodreceipt/import', data );
  }
}
