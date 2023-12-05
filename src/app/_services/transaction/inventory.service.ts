import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { TInventoryHeader, TInventoryLineTemplate } from 'src/app/_models/inventory';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {


    // baseUrl = environment.apiUrl;
    baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode): Observable<TInventoryHeader[]> {
    return this.http.get<TInventoryHeader[]>(this.baseUrl + 'inventory/GetAll?CompanyCode='+companyCode);
  }
  getInventoryList(companyCode, FromStore,ToStore,DocType,Status,FrDate,ToDate,Keyword, ViewBy): Observable<TInventoryHeader[]> {
    return this.http.get<TInventoryHeader[]>(this.baseUrl + 'inventory/GetInventoryList?CompanyCode='+companyCode+'&FromStore='+FromStore+'&ToStore='+ToStore+'&DocType='+DocType+'&Status='+Status+'&FrDate='+FrDate+'&ToDate='+ToDate+'&Keyword='+Keyword + '&ViewBy=' + ViewBy);
  }
  getInventoryTransfer(id,storeId, companyCode): Observable<TInventoryHeader> {
    // if((storeId===null || storeId===undefined ) && (companyCode===null || companyCode===undefined ))
    // {
    //   let store = this.authService.storeSelected(); 
    //   storeId = store.storeId;
    //   companyCode= store.companyCode;
    // } 
    return this.http.get<TInventoryHeader>(this.baseUrl + 'inventory/GetById?id=' + id + '&storeId='+ storeId+ '&companyCode='+ companyCode);
  }
    
  create(model: TInventoryHeader) {
    //  let store = this.authService.storeSelected();
    //  debugger;
    // model.storeId = store.storeId;
    // model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'inventory/create', model );
  } 
    
  update(model: TInventoryHeader) {
    return this.http.put(this.baseUrl + 'inventory/update', model);
  } 
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'inventory/delete' + Id );
  }
  GetTranferNotify(companyCode, storeId): Observable<TInventoryHeader[]> {
    return this.http.get<TInventoryHeader[]>(this.baseUrl + 'inventory/GetTranferNotify?CompanyCode='+companyCode+'&StoreId='+storeId);
  }
  cancel(model: TInventoryHeader) {
    return this.http.post(this.baseUrl + 'inventory/cancel', model);
  } 
  SendEmail(to:string,subject:string,html:string) {
    return this.http.get(this.baseUrl + 'Common/SendEmail?to='+to +'&subject='+subject +'&html='+html);
  } 
  checkImport(model:any) {
    return this.http.post(this.baseUrl + 'inventory/CheckitemImport', model);
  } 
}
