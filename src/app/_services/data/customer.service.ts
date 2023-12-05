import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MCustomer } from 'src/app/_models/customer';
import { PaginatedResult } from 'src/app/_models/pagination';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  item: any = {};
  getByCompany(companyCode, type): Observable<MCustomer[]> {
    // debugger;
    return this.http.get<MCustomer[]>(this.baseUrl + 'customer/GetByCompany?companycode=' + companyCode + '&type=' + type);
  }
  getByCompanyFilter(companyCode, type, CustomerGrpId, CustomerId, Status
    , Keyword, CustomerName, CustomerRank, Address, Phone, DOB,display?): Observable<MCustomer[]> {
    // debugger;
    if(display===null || display===undefined )  { display =null; }
    return this.http.get<MCustomer[]>(this.baseUrl + 'customer/GetByCompany?companycode=' + companyCode + '&type=' + type + '&CustomerGrpId=' + CustomerGrpId
    + '&CustomerId=' + CustomerId+ '&Status=' + Status+ '&Keyword=' + Keyword
    + '&CustomerName=' + CustomerName+ '&CustomerRank=' + CustomerRank + '&Address=' + Address+ '&Phone=' + Phone+ '&DOB=' + DOB +'&Display=' + display);
  }
   

  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MCustomer[]>> {
    const paginatedResult: PaginatedResult<MCustomer[]> = new PaginatedResult<MCustomer[]>();
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

    return this.http.get<MCustomer[]>(this.baseUrl + 'customer/GetPagedList', { observe: 'response', params})
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
 
  getItem(companyCode, id): Observable<MCustomer> {
    // debugger;
    return this.http.get<MCustomer>(this.baseUrl + 'customer/GetById?companyCode='+companyCode+'&id=' + id);
  }
   
  
  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'customer/delete' + Id );
  }
 

  create(model: MCustomer) {
  
    return this.http.post(this.baseUrl + 'customer/create', model );
  }

    
  update(model: MCustomer) {
   
    return this.http.put(this.baseUrl + 'customer/update', model);
  }
 
  import(data: DataImport) {
   
    return this.http.post(this.baseUrl + 'customer/import', data );
  }
}
