import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MUom } from 'src/app/_models/muom';
import { PaginatedResult } from 'src/app/_models/pagination';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class UomService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  getAll(companyCode): Observable<MUom[]> {
    return this.http.get<MUom[]>(this.baseUrl + 'uom/GetAll?companyCode?companyCode=' + companyCode);
  }
  
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MUom[]>> {
    const paginatedResult: PaginatedResult<MUom[]> = new PaginatedResult<MUom[]>();
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

    return this.http.get<MUom[]>(this.baseUrl + 'uom/GetPagedList', { observe: 'response', params})
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
 
  getItem(companyCode, code): Observable<MUom> {
    return this.http.get<MUom>(this.baseUrl + 'uom/GetByCode?companyCode='+companyCode+ '&code=' + code);
  }
   
    
  create(model: MUom) {
  
    return this.http.post(this.baseUrl + 'uom/create', model );
  }

    
  update(model: MUom) {
   
    return this.http.put(this.baseUrl + 'uom/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'uom/delete' + Id );
  }
  import(data: DataImport) {
   
    return this.http.post(this.baseUrl + 'uom/import', data );
  }

}
