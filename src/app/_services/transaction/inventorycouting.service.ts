import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { TInventoryHeader } from 'src/app/_models/inventory';
import { TInventoryCountingHeader } from 'src/app/_models/inventorycounting';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventorycoutingService {


   // baseUrl = environment.apiUrl;
   baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode): Observable<TInventoryCountingHeader[]> {
    return this.http.get<TInventoryCountingHeader[]>(this.baseUrl + 'inventoryCounting/GetAll?companyCode=' + companyCode);
  }
  getByStore(companyCode, storeid): Observable<TInventoryCountingHeader> {
    
    return this.http.get<TInventoryCountingHeader>(this.baseUrl + 'inventoryCounting/getByStore?companyCode=' + companyCode  + '&storeid='+ storeid );
  }
  getInventoryCountingList(companyCode, storeId , Status, FrDate, ToDate, Keyword, ViewBy): Observable<TInventoryCountingHeader[]> {
    return this.http.get<TInventoryCountingHeader[]>(this.baseUrl + 'inventoryCounting/GetInventoryList?CompanyCode='+companyCode+'&StoreId='+storeId +'&Status='+Status+'&FrDate='+FrDate+'&ToDate='+ToDate+'&Keyword='+Keyword +'&ViewBy='+ViewBy);
  }
  getInventoryCountedList(companyCode, storeId ,  FrDate, ToDate, Keyword): Observable<TInventoryCountingHeader[]> {
    return this.http.get<TInventoryCountingHeader[]>(this.baseUrl + 'inventoryCounting/GetInventoryCounted?CompanyCode='+companyCode+'&StoreId='+storeId +'&FrDate='+FrDate+'&ToDate='+ToDate+'&Keyword='+Keyword);
  }

  countingToCounted(id, storeid, companyCode): Observable<TInventoryCountingHeader> {
    
    return this.http.get<TInventoryCountingHeader>(this.baseUrl + 'inventoryCounting/InventoryCountingToCounted?id=' + id  + '&storeid='+ storeid+ '&companyCode='+ companyCode);
  }
  getInventoryCounting(id, storeid, companyCode): Observable<TInventoryCountingHeader> {
    
    return this.http.get<TInventoryCountingHeader>(this.baseUrl + 'inventoryCounting/GetById?id=' + id  + '&storeid='+ storeid+ '&companyCode='+ companyCode);
  }
    
  create(model: TInventoryCountingHeader) {
    //  let store = this.authService.storeSelected();
    //  debugger;
    // model.storeId = store.storeId;
    // model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'inventoryCounting/create', model );
  } 
    
  update(model: TInventoryCountingHeader) {
    return this.http.put(this.baseUrl + 'inventoryCounting/update', model);
  } 
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'inventoryCounting/delete' + Id );
  }



}
