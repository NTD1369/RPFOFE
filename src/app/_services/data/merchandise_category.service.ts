import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { PaginatedResult } from 'src/app/_models/pagination';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { AlertifyService } from '../system/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class Merchandise_categoryService {

 
  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
   
  constructor(private authService: AuthService, private http: HttpClient,private alertify: AlertifyService, public env: EnvService) { } 

  getAll(companyCode): Observable<MMerchandiseCategory[]> {
    return this.http.get<MMerchandiseCategory[]>(this.baseUrl + 'merchandise/GetAll?companyCode=' + companyCode);
  }
  getByCompany(companyCode, mcid, status, keyword): Observable<MMerchandiseCategory[]> {
    return this.http.get<MMerchandiseCategory[]>(this.baseUrl + 'merchandise/GetByCompany?companyCode='+ companyCode +'&mcid='+ mcid+'&status='+ status+'&keyword='+ keyword);
  }

  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MMerchandiseCategory[]>> {
    const paginatedResult: PaginatedResult<MMerchandiseCategory[]> = new PaginatedResult<MMerchandiseCategory[]>();
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

    return this.http.get<MMerchandiseCategory[]>(this.baseUrl + 'merchandise/GetPagedList', { observe: 'response', params})
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
 
  getItem(companyCode, id): Observable<MMerchandiseCategory> {
    return this.http.get<MMerchandiseCategory>(this.baseUrl + 'merchandise/GetById?companyCode='+companyCode+'&id=' + id);
  }
  
   
  create(model: MMerchandiseCategory) {
    let store = this.authService.storeSelected();
    
    model.createdBy = this.authService.decodeToken?.unique_name ;
    model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'merchandise/create', model );
  }

    
  update(model: MMerchandiseCategory) {
    let store = this.authService.storeSelected();
    
    model.modifiedBy = this.authService.decodeToken?.unique_name ;
    model.companyCode = store.companyCode;
    return this.http.put(this.baseUrl + 'merchandise/update', model);
  }
  updateSetting(models: MMerchandiseCategory[]) { 
    return this.http.put(this.baseUrl + 'merchandise/updateSetting', models);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'merchandise/delete' + Id );
  }
  import(data: DataImport) {
    let store = this.authService.storeSelected(); 
    data.createdBy = this.authService.decodeToken?.unique_name ;
    data.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'merchandise/import', data );
  }

}
