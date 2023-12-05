import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { PaginatedResult } from 'src/app/_models/pagination';
import { MStorage } from 'src/app/_models/storage';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
    // baseUrl = environment.apiUrl;
    baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
  getAll(companyCode): Observable<MStorage[]> {
    return this.http.get<MStorage[]>(this.baseUrl + 'storage/GetAll?companyCode=' + companyCode);
  }
  getByStore(storeid, companycode): Observable<MStorage[]> {
    return this.http.get<MStorage[]>(this.baseUrl + 'storage/GetByStore?storeid=' + storeid + '&companycode=' + companycode);
  }
 
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MStorage[]>> {
    const paginatedResult: PaginatedResult<MStorage[]> = new PaginatedResult<MStorage[]>();
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

    return this.http.get<MStorage[]>(this.baseUrl + 'storage/GetPagedList', { observe: 'response', params})
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
 
  getItem(id): Observable<MStorage> {
    return this.http.get<MStorage>(this.baseUrl + 'storage/GetById?id=' + id);
  }
   
    
  create(warehouse: MStorage) {
    let store = this.authService.storeSelected();
    debugger;
    // warehouse.storeId = store.storeId;
    warehouse.createdBy = this.authService.decodeToken?.unique_name ;
    warehouse.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'storage/create', warehouse );
  }

    
  update(warehouse: MStorage) {
    let store = this.authService.storeSelected();
    debugger;
    // warehouse.storeId = store.storeId;
    warehouse.modifiedBy = this.authService.decodeToken?.unique_name ;
    warehouse.companyCode = store.companyCode;
    return this.http.put(this.baseUrl + 'storage/update', warehouse);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'storage/delete' + Id );
  }

  import(data: DataImport) {
    let store = this.authService.storeSelected();
    debugger;
    // warehouse.storeId = store.storeId;
    data.createdBy = this.authService.decodeToken?.unique_name ;
    data.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'storage/import', data );
  }
}
