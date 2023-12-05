import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { PaginatedResult } from 'src/app/_models/pagination';
import { MTax } from 'src/app/_models/tax';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaxService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode): Observable<MTax[]> {
    return this.http.get<MTax[]>(this.baseUrl + 'tax/GetAll?companyCode=' + companyCode);
  }
 
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MTax[]>> {
    const paginatedResult: PaginatedResult<MTax[]> = new PaginatedResult<MTax[]>();
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

    return this.http.get<MTax[]>(this.baseUrl + 'tax/GetPagedList', { observe: 'response', params})
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
 
  getItem(companyCode, id): Observable<MTax> {
    return this.http.get<MTax>(this.baseUrl + 'tax/GetById?companyCode=' + companyCode +'&id=' + id);
  }
   
    
  create(warehouse: MTax) {
    let store = this.authService.storeSelected();
    debugger;
    // warehouse.storeId = store.storeId;
    warehouse.createdBy = this.authService.decodeToken?.unique_name ;
    warehouse.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'tax/create', warehouse );
  }

    
  update(warehouse: MTax) {
     let store = this.authService.storeSelected();
    debugger;
    // warehouse.storeId = store.storeId;
    warehouse.modifiedBy = this.authService.decodeToken?.unique_name ;
    warehouse.companyCode = store.companyCode;
    return this.http.put(this.baseUrl + 'tax/update', warehouse);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'tax/delete' + Id );
  }
  import(data: DataImport) {
    let store = this.authService.storeSelected();
    debugger;
    // warehouse.storeId = store.storeId;
    data.createdBy = this.authService.decodeToken?.unique_name ;
    data.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'tax/import', data );
  }

}
