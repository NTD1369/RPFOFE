import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MEmployee } from 'src/app/_models/employee';
import { PaginatedResult } from 'src/app/_models/pagination';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(CompanyCode): Observable<MEmployee[]> {
    return this.http.get<MEmployee[]>(this.baseUrl + 'employee/GetAll?CompanyCode='+ CompanyCode);
  }
  getByStore(companyCode, storeId, checkAvailable?): Observable<MEmployee[]> {
    let strurl = this.baseUrl + 'employee/GetByStore?companyCode=' + companyCode + '&storeid=' +storeId;
    if(checkAvailable!==null && checkAvailable!==undefined)
    {
      strurl += '&checkAvailable=' +checkAvailable;
    }
    return this.http.get<MEmployee[]>(strurl);
  }
  getByUser(companyCode, userId): Observable<MEmployee[]> {
    return this.http.get<MEmployee[]>(this.baseUrl + 'employee/getByUser?companyCode=' + companyCode + '&userCode=' +userId);
  }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MEmployee[]>> {
    const paginatedResult: PaginatedResult<MEmployee[]> = new PaginatedResult<MEmployee[]>();
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

    return this.http.get<MEmployee[]>(this.baseUrl + 'employee/GetPagedList', { observe: 'response', params})
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
 
  getItem(companycode, id): Observable<MEmployee> {
    return this.http.get<MEmployee>(this.baseUrl + 'employee/GetById?companyCode='+ companycode +'&id=' + id);
  }
   
    
  create(model: MEmployee) {
    let store = this.authService.storeSelected();
    
    model.createdBy = this.authService.decodeToken?.unique_name ;
    model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'employee/create', model );
  }

    
  update(model: MEmployee) {
    let store = this.authService.storeSelected();
    
    model.modifiedBy = this.authService.decodeToken?.unique_name ;
    model.companyCode = store.companyCode;
    return this.http.put(this.baseUrl + 'employee/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'employee/delete' + Id );
  }
   
   
  import(data: DataImport) {
    let store = this.authService.storeSelected();
    
    data.createdBy = this.authService.decodeToken?.unique_name ;
    data.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'employee/import', data );
  }

}
