import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MStoreArea } from 'src/app/_models/mstorearea';
import { PaginatedResult } from 'src/app/_models/pagination';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class StoreareaService {

   // baseUrl = environment.apiUrl;
   baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService,private http: HttpClient, public env: EnvService) { } 
  getAll(companyCode): Observable<MStoreArea[]> {
    return this.http.get<MStoreArea[]>(this.baseUrl + 'storearea/GetAll?companyCode='+ companyCode);
  }
  GetStoreAreaCapacity(storeid, companycode): Observable<MStoreArea[]> {
    return this.http.get<MStoreArea[]>(this.baseUrl + 'storearea/GetStoreAreaCapacity?storeid=' + storeid + '&companycode=' + companycode);
  }
 
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MStoreArea[]>> {
    const paginatedResult: PaginatedResult<MStoreArea[]> = new PaginatedResult<MStoreArea[]>();
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

    return this.http.get<MStoreArea[]>(this.baseUrl + 'storearea/GetPagedList', { observe: 'response', params})
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
 
  getItem(companyCode, id): Observable<MStoreArea> {
    return this.http.get<MStoreArea>(this.baseUrl + 'storearea/GetById?companyCode='+ companyCode +'&id=' + id);
  }
   
    
  create(warehouse: MStoreArea) {
    return this.http.post(this.baseUrl + 'storearea/create', warehouse );
  }

    
  update(warehouse: MStoreArea) {
    return this.http.put(this.baseUrl + 'storearea/update', warehouse);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'storearea/delete' + Id );
  }

  import(data: DataImport) {
    let store = this.authService.storeSelected();
    debugger;
    // warehouse.storeId = store.storeId;
    data.createdBy = this.authService.decodeToken?.unique_name ;
    data.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'storearea/import', data );
  }
}
