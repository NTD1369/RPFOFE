import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { PaginatedResult } from 'src/app/_models/pagination';
import { MPaymentMethod } from 'src/app/_models/paymentmethod';
import { SFormatConfig } from 'src/app/_models/sformatconfig';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormatconfigService {



  
  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode): Observable<SFormatConfig[]> {
    return this.http.get<SFormatConfig[]>(this.baseUrl + 'formatconfig/GetAll?companyCode=' + companyCode);
  }
  getByStore(companyCode, storeId): Observable<SFormatConfig> {
    return this.http.get<SFormatConfig>(this.baseUrl + 'formatconfig/GetByStore?companyCode=' + companyCode+ '&storeId=' + storeId);
  }
  // getMaxValueByCurrency(companyCode, storeId, currency): Observable<SFormatConfig> {
  //   return this.http.get<SFormatConfig>(this.baseUrl + 'formatconfig/GetByStore?companyCode=' + companyCode +'&storeId=' + storeId);
  // }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<any> {
    debugger;
    const paginatedResult: PaginatedResult<SFormatConfig[]> = new PaginatedResult<SFormatConfig[]>();
  
    let params = new HttpParams();


    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('keyword', userParams.keyword);
      
      params = params.append('orderBy', userParams.orderBy);
    }

    return this.http.get<any>(this.baseUrl + 'formatconfig/GetPagedList', { observe: 'response', params})
      .pipe(
        map((response: any) => {
          debugger;
          if(response.body.success===false)
          {
            paginatedResult.result = null;
         
            if (response.headers.get('Pagination') != null) {
              paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
            }
            return paginatedResult;
          }
          else
          {
            paginatedResult.result = response.body;
         
            if (response.headers.get('Pagination') != null) {
              paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
            }
            return paginatedResult;
          }
         
        })
      );

    // return this.http.get<Item[]>(this.baseUrl + 'item/GetAll');
  }
  getItem(companyCode, id): Observable<SFormatConfig> {
    return this.http.get<SFormatConfig>(this.baseUrl + 'formatconfig/GetById?companyCode=' + companyCode +'&id=' + id);
  }
   
    
  create(model: SFormatConfig) {
    return this.http.post(this.baseUrl + 'formatconfig/create', model );
  }

    
  update(model: SFormatConfig) {
    return this.http.put(this.baseUrl + 'formatconfig/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'formatconfig/delete' + Id );
  }

}
