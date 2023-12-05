import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { TInventoryPostingHeader } from 'src/app/_models/inventoryposting';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventorypostingService {


    // baseUrl = environment.apiUrl;
    baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode): Observable<TInventoryPostingHeader[]> {
    return this.http.get<TInventoryPostingHeader[]>(this.baseUrl + 'inventoryPosting/GetAllcompanyCode=' + companyCode);
  }
  getByStore(companyCode, storeid): Observable<TInventoryPostingHeader> {
    
    return this.http.get<TInventoryPostingHeader>(this.baseUrl + 'inventoryPosting/getByStore?companyCode=' + companyCode  + '&storeid='+ storeid );
  }
  getInventoryPostingList(companyCode, storeId , Status, FrDate, ToDate, Keyword, ViewBy): Observable<TInventoryPostingHeader[]> {
    return this.http.get<TInventoryPostingHeader[]>(this.baseUrl + 'inventoryPosting/GetInventoryList?CompanyCode='+companyCode+'&StoreId='+storeId +'&Status='+Status+'&FrDate='+FrDate+'&ToDate='+ToDate+'&Keyword='+Keyword+'&ViewBy='+ViewBy);
  }
  getInventoryPosting(companyCode , storeid, id): Observable<TInventoryPostingHeader> {
    
    return this.http.get<TInventoryPostingHeader>(this.baseUrl + 'inventoryPosting/GetById?companyCode='+ companyCode  + '&storeid='+ storeid + '&id=' +id);
  }
    
  create(model: TInventoryPostingHeader) {
    //  let store = this.authService.storeSelected();
    //  debugger;
    // model.storeId = store.storeId;
    // model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'inventoryPosting/create', model );
  } 
    
  update(model: TInventoryPostingHeader) {
    return this.http.put(this.baseUrl + 'inventoryPosting/update', model);
  } 
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'inventoryPosting/delete' + Id );
  }


}
