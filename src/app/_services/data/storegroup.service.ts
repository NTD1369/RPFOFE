import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { PaginatedResult } from 'src/app/_models/pagination';
import { MStoreGroup } from 'src/app/_models/storegroup';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class StoregroupService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode): Observable<MStoreGroup[]> {
    return this.http.get<MStoreGroup[]>(this.baseUrl + 'storegroup/GetAll?companyCode=' + companyCode);
  }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MStoreGroup[]>> {
    const paginatedResult: PaginatedResult<MStoreGroup[]> = new PaginatedResult<MStoreGroup[]>();
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

    return this.http.get<MStoreGroup[]>(this.baseUrl + 'storegroup/GetPagedList', { observe: 'response', params})
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
 
  getItem(companyCode, id): Observable<MStoreGroup> {
    return this.http.get<MStoreGroup>(this.baseUrl + 'storegroup/GetById?companyCode='+companyCode+'&id=' + id);
  }
   
    
  create(storegroup: MStoreGroup) {
    let store = this.authService.storeSelected();
    debugger;
    // warehouse.storeId = store.storeId;
    storegroup.createdBy = this.authService.decodeToken?.unique_name ;
    storegroup.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'storegroup/create', storegroup );
  }

    
  update(storegroup: MStoreGroup) {
    let store = this.authService.storeSelected();
    debugger;
    // warehouse.storeId = store.storeId;
    storegroup.modifiedBy = this.authService.decodeToken?.unique_name ;
    storegroup.companyCode = store.companyCode;
    return this.http.put(this.baseUrl + 'storegroup/update', storegroup);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'storegroup/delete' + Id );
  }
  import(data: DataImport) {
    let store = this.authService.storeSelected();
    debugger;
    // warehouse.storeId = store.storeId;
    data.createdBy = this.authService.decodeToken?.unique_name ;
    data.companyCode = store.companyCode;
    
    return this.http.post(this.baseUrl + 'storegroup/import', data );
  }
}
