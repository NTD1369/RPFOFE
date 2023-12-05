import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { debug } from 'console';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { StoreWareHouseViewModel } from 'src/app/_models/viewmodel/StoreWareHouseViewModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorewarehouseService {
    // baseUrl = environment.apiUrl;
    baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
constructor(private http: HttpClient, public env: EnvService) { }
    getAll(storeId:string ): Observable<any> {
  return this.http.get<any>(this.baseUrl + 'StoreWaseHouse/GetByStoreID?storeid=' + storeId);
  }
  getAllStore(storeId:string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'StoreWaseHouse/GetAll?storeid=' + storeId);
    }
  create(model: StoreWareHouseViewModel) {
    debugger;
    return this.http.post(this.baseUrl + 'StoreWaseHouse/Create', model );
  }
  Delete(storeId:string) {
    return this.http.delete(this.baseUrl + 'StoreWaseHouse/Delete?storeid=' + storeId);
  }

  update(model: StoreWareHouseViewModel) {
    debugger;
    return this.http.put(this.baseUrl + 'StoreWaseHouse/Update', model);
  }
  getByWhsStore(CompanyCode,storeId): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'StoreWaseHouse/GetWhsbyStore?CompanyCode=' + CompanyCode+'&storeId=' + storeId);
  }

}
