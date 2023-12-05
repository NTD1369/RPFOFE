import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MStoreCapacity } from 'src/app/_models/mstorecapacity';
import { CapacityViewModel } from 'src/app/_models/viewmodel/CapacityViewModel';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CapacityService {

  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;

  constructor( private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getCapacity(companyCode, transDate, quantity, storeId, storeAreaId, timeFrameId): Observable<CapacityViewModel[]> {
    return this.http.get<CapacityViewModel[]>(this.baseUrl + 'capacity/GetCapacity?companyCode='+companyCode+'&transDate='
    +transDate+'&quantity='+quantity+'&storeId='+storeId+'&storeAreaId='+storeAreaId+'&timeFrameId='+timeFrameId+'');
  }
  getCapacityFromTo(companyCode, fromDate, toDate, quantity, storeId, storeAreaId, timeFrameId): Observable<CapacityViewModel[]> {
    return this.http.get<CapacityViewModel[]>(this.baseUrl + 'capacity/GetCapacityFromTo?companyCode='+companyCode+'&fromDate='
    +fromDate+'&toDate=' +toDate+'&quantity='+quantity+'&storeId='+storeId+'&storeAreaId='+storeAreaId+'&timeFrameId='+timeFrameId+'');
  }
  getCapacityByStore(companyCode, transDate, quantity, storeId): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'capacity/GetCapacityByStore?companyCode='+companyCode+'&transDate='
    +transDate+'&quantity='+quantity+'&storeId='+storeId);
  }
  getCapacityByAreaStore(companyCode, storeId, storeAreaId): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'capacity/GetCapacityByAreaStore?companyCode='+companyCode +'&storeId='+storeId+'&storeAreaId='+storeAreaId);
  }
  
  getCapacityAreaStore(companyCode, storeId): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'capacity/GetCapacityAreaStore?companyCode='+companyCode +'&storeId='+storeId);
  }

  getItem(id): Observable<MStoreCapacity> {
    return this.http.get<MStoreCapacity>(this.baseUrl + 'capacity/GetById?id=' + id);
  }
   
    
  create(model: MStoreCapacity) {
    let store = this.authService.storeSelected();
    debugger; 
    model.createdBy = this.authService.decodeToken?.unique_name ;
    model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'capacity/create', model );
  }

  

  update(model: MStoreCapacity) {
    let store = this.authService.storeSelected();
    debugger; 
    model.modifiedBy = this.authService.decodeToken?.unique_name ;
    model.companyCode = store.companyCode;
    return this.http.put(this.baseUrl + 'capacity/update', model);
  }

  
  delete(model: MStoreCapacity) {
    return this.http.post(this.baseUrl + 'capacity/delete' ,model);
  }

  import(data: DataImport) {
    let store = this.authService.storeSelected();
    debugger; 
    data.createdBy = this.authService.decodeToken?.unique_name ;
    data.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'capacity/import', data );
  }

  
}
