import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { PaginatedResult } from 'src/app/_models/pagination';
import { SReleaseNote } from 'src/app/_models/system/releaseNote';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReleaseNoteService {



  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, private authService: AuthService, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode ): Observable<SReleaseNote[]> {
    return this.http.get<SReleaseNote[]>(this.baseUrl + 'ReleaseNote/GetAll?companyCode=' + companyCode   );
  }
  
  getItem(companyCode, id, Version): Observable<SReleaseNote> {
    return this.http.get<SReleaseNote>(this.baseUrl + 'ReleaseNote/GetById?companyCode=' + companyCode + '&id=' + id + '&Version=' + Version );
  }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<SReleaseNote[]>> {
    const paginatedResult: PaginatedResult<SReleaseNote[]> = new PaginatedResult<SReleaseNote[]>();
    debugger;
    let params = new HttpParams();

   

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
      params = params.append('PageSize', itemsPerPage);
    }

    if (userParams != null) {
      if(userParams.Keyword !== null && userParams.Keyword !== undefined){
        params = params.append('Keyword', userParams.Keyword);
      } 
      if(userParams.CompanyCode !== null && userParams.CompanyCode !== undefined  && userParams.CompanyCode !== ''){
        params = params.append('CompanyCode', userParams.CompanyCode);
      }
    
      if(userParams.Version !== null && userParams.Version !== undefined  && userParams.Version !== ''){
        params = params.append('Version', userParams.Version);
      }
      if(userParams.Id !== null && userParams.Id !== undefined  && userParams.Id !== ''){
        params = params.append('Id', userParams.Id);
      }
      if(userParams.Status !== null && userParams.Status !== undefined  && userParams.Status !== ''){
        params = params.append('Status', userParams.Status);
      }
      if(userParams.orderBy !== null && userParams.orderBy !== undefined){
        params = params.append('orderBy', userParams.orderBy);
      }
    }
    else
    {  
      let storeSelected = this.authService.storeSelected();

      params = params.append('CompanyCode', storeSelected.companyCode);
    }
    return this.http.get<SReleaseNote[]>(this.baseUrl + 'ReleaseNote/GetPagedList', { observe: 'response', params })
      .pipe(
        map(response => {
          debugger;
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
          }
          return paginatedResult;
        })
      );

    // return this.http.get<Item[]>(this.baseUrl + 'item/GetAll');
  }
    
  create(model: SReleaseNote) {
    
    return this.http.post(this.baseUrl + 'ReleaseNote/create', model );
  }

    
  update(model: SReleaseNote) {
  
    return this.http.put(this.baseUrl + 'ReleaseNote/update', model);
  }

  
  delete(model: SReleaseNote) {
    return this.http.post(this.baseUrl + 'ReleaseNote/delete', model );
  }

}
