import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; 
import { EnvService } from 'src/app/env.service';
import { MDenomination } from 'src/app/_models/denomination';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DenominationService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(currency): Observable<MDenomination[]> {
    
    return this.http.get<MDenomination[]>(this.baseUrl + 'denomination/getall?currency=' + currency);
  }
  // getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MCustomer[]>> {
  //   const paginatedResult: PaginatedResult<MCustomer[]> = new PaginatedResult<MCustomer[]>();
    
  //   let params = new HttpParams();


  //   if (page != null && itemsPerPage != null) {
  //     params = params.append('pageNumber', page);
  //     params = params.append('pageSize', itemsPerPage);
  //   }

  //   if (userParams != null) {
  //     params = params.append('keyword', userParams.keyword);
       
  //     params = params.append('orderBy', userParams.orderBy);
  //   }

  //   return this.http.get<MCustomer[]>(this.baseUrl + 'customer/GetPagedList', { observe: 'response', params})
  //     .pipe(
  //       map(response => {
  //         paginatedResult.result = response.body;
  //         if (response.headers.get('Pagination') != null) {
  //           paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
  //         }
  //         return paginatedResult;
  //       })
  //     );
 
  // }
 
  getItem(companyCode, id): Observable<MDenomination> {
    // debugger;
    return this.http.get<MDenomination>(this.baseUrl + 'denomination/GetById?companyCode='+companyCode+'&id=' + id);
  }
   
  
  
  // delete(Id: string) {
  //   return this.http.delete(this.baseUrl + 'customer/delete' + Id );
  // }
 

  create(model: MDenomination) {
  
    return this.http.post(this.baseUrl + 'denomination/create', model );
  }

    
  update(model: MDenomination) {
   
    return this.http.put(this.baseUrl + 'denomination/update', model);
  }
 
  // import(data: DataImport) {
   
  //   return this.http.post(this.baseUrl + 'customer/import', data );
  // }

}
