import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MCustomerGroup, MCustomer, CustomerGroupViewModel } from 'src/app/_models/customer';
import { PaginatedResult } from 'src/app/_models/pagination';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomergroupService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
 
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService ) { } 
  
  item: any = {};
  getAll(Companycode): Observable<MCustomerGroup[]> {
    return this.http.get<MCustomerGroup[]>(this.baseUrl + 'customerGroup/GetAll?Companycode=' + Companycode);
  }
  getAllViewModel(Companycode): Observable<CustomerGroupViewModel[]> {
    return this.http.get<CustomerGroupViewModel[]>(this.baseUrl + 'customerGroup/getAllViewModel?Companycode=' + Companycode);
  }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MCustomerGroup[]>> {
    const paginatedResult: PaginatedResult<MCustomerGroup[]> = new PaginatedResult<MCustomerGroup[]>();
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

    return this.http.get<MCustomerGroup[]>(this.baseUrl + 'customerGroup/GetPagedList', { observe: 'response', params})
      .pipe(
        map((response: any) => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
          }
          return paginatedResult;
        })
      );

    // return this.http.get<Item[]>(this.baseUrl + 'item/GetAll');
  }
 
  getItem(Companycode, id): Observable<MCustomerGroup> {
    return this.http.get<MCustomerGroup>(this.baseUrl + 'customerGroup/GetById?Companycode='+Companycode+'&id=' + id);
  }
   
  
  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'customerGroup/delete' + Id );
  }

  create(model: MCustomerGroup) {
    let store = this.authService.storeSelected();
    debugger;
  //  model.storeId = store.storeId;
  model.createdBy = this.authService.decodeToken?.unique_name ;
   model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'customerGroup/create', model );
  }

    
  update(model: MCustomerGroup) {
    let store = this.authService.storeSelected();
    debugger;
   //  model.storeId = store.storeId;
    model.companyCode = store.companyCode;
    model.createdBy = this.authService.decodeToken?.unique_name ;
    return this.http.put(this.baseUrl + 'customerGroup/update', model);
  }
 
  import(data: DataImport) {
    let store = this.authService.storeSelected();
    debugger;
   //  model.storeId = store.storeId;
    data.companyCode = store.companyCode;
    data.createdBy = this.authService.decodeToken?.unique_name ;
    return this.http.post(this.baseUrl + 'customerGroup/import', data );
  }
}
