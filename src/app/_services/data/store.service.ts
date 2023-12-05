import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { PaginatedResult } from 'src/app/_models/pagination';
import { MStore } from 'src/app/_models/store';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(CompanyCode): Observable<MStore[]> {
    return this.http.get<MStore[]>(this.baseUrl + 'store/GetAll?CompanyCode=' + CompanyCode);
  }
  getByUserWithStatus(userCode): Observable<MStore[]> {
    return this.http.get<MStore[]>(this.baseUrl + 'store/GetStoreByUserWithStatus?UserCode='+ userCode);
  }
  getByUser(userCode): Observable<MStore[]> {
    return this.http.get<MStore[]>(this.baseUrl + 'store/GetByUser?UserCode='+ userCode);
  }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MStore[]>> {
    const paginatedResult: PaginatedResult<MStore[]> = new PaginatedResult<MStore[]>();
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

    return this.http.get<MStore[]>(this.baseUrl + 'store/GetPagedList', { observe: 'response', params})
      .pipe(
        map((response: any) => {
          // if(!response.success)
          debugger;
          // {
          //   return response;
          // }
          // else{
          
          // }
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
          }
          return paginatedResult;
        })
      );

    // return this.http.get<Item[]>(this.baseUrl + 'item/GetAll');
  }
 
  getItem(CompanyCode, id): Observable<MStore> {
    return this.http.get<MStore>(this.baseUrl + 'store/GetById?CompanyCode='+ CompanyCode + '&id=' + id);
  }
   
    
  create(store: MStore) {
    store.createdBy = this.authService.decodeToken?.unique_name ;
    return this.http.post(this.baseUrl + 'store/create', store );
  }

    
  update(store: MStore) {
    debugger;
    store.formatConfigId = store.formatConfigId.toString();
     
    debugger;
    // warehouse.storeId = store.storeId;
    store.modifiedBy = this.authService.decodeToken?.unique_name ;
   
    return this.http.put(this.baseUrl + 'store/update', store);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'store/delete' + Id );
  }
  import(data: DataImport) {
    let store = this.authService.storeSelected();
    debugger;
    // warehouse.storeId = store.storeId;
    data.createdBy = this.authService.decodeToken?.unique_name ;
    data.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'store/import', data );
  }

  getStoreByUserWhsType(userCode): Observable<MStore[]> {
    return this.http.get<MStore[]>(this.baseUrl + 'store/getStoreByUserWhsType?UserCode='+ userCode);
  }

  getAllByWhsType(CompanyCode): Observable<MStore[]> {
    return this.http.get<MStore[]>(this.baseUrl + 'store/getAllByWhsType?CompanyCode=' + CompanyCode);
  }



}
