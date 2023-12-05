import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { PaginatedResult } from 'src/app/_models/pagination';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { MWarehouse } from 'src/app/_models/warehouse';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {


   // baseUrl = environment.apiUrl;
   baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService,private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(CompanyCode): Observable<MWarehouse[]> {
    return this.http.get<MWarehouse[]>(this.baseUrl + 'warehouse/GetAll?CompanyCode=' + CompanyCode);
  }
  getWhsTypeList(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'warehouse/GetWhsType');
  }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MWarehouse[]>> {
    const paginatedResult: PaginatedResult<MWarehouse[]> = new PaginatedResult<MWarehouse[]>();
    // debugger;
    let params = new HttpParams();


    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('keyword', userParams.keyword);
       
      params = params.append('orderBy', userParams.orderBy);
    }

    return this.http.get<MWarehouse[]>(this.baseUrl + 'warehouse/GetPagedList', { observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
          }
          return paginatedResult;
        })
      );

    // return this.http.get<Item[]>(this.baseUrl + 'item/GetAll');
  }
 
  getItem(CompanyCode, id): Observable<MWarehouse> {
    return this.http.get<MWarehouse>(this.baseUrl + 'warehouse/GetById?CompanyCode='+CompanyCode+'&id=' + id);
  }
   
    
  create(warehouse: MWarehouse) {
    let store = this.authService.storeSelected();
    debugger;
    // warehouse.storeId = store.storeId;
    warehouse.createdBy = this.authService.decodeToken?.unique_name ;
    warehouse.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'warehouse/create', warehouse );
  }

    
  update(warehouse: MWarehouse) {
    let store = this.authService.storeSelected();
    debugger;
   
    warehouse.modifiedBy = this.authService.decodeToken?.unique_name ;
    warehouse.companyCode = store.companyCode;
    return this.http.put(this.baseUrl + 'warehouse/update', warehouse);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'warehouse/delete' + Id );
  }
  import(data: DataImport) {
    let store = this.authService.storeSelected();
    debugger;
    // warehouse.storeId = store.storeId;
    data.createdBy = this.authService.decodeToken?.unique_name ;
    data.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'warehouse/import', data );
  }

  getAllByStoreWhs(CompanyCode, storeId): Observable<MWarehouse[]> {
    return this.http.get<MWarehouse[]>(this.baseUrl + 'warehouse/getAllByStoreWhs?CompanyCode=' + CompanyCode+'&storeId=' + storeId);
  }

  GetWarehouseByWhsType(CompanyCode, storeId): Observable<MWarehouse[]> {
    return this.http.get<MWarehouse[]>(this.baseUrl + 'warehouse/GetWarehouseByWhsType?CompanyCode=' + CompanyCode+'&storeId=' + storeId);
  }

}
