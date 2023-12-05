import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MItemSerialStock } from 'src/app/_models/itemserialstock';
import { PaginatedResult } from 'src/app/_models/pagination';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItemserialstockService {



  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService, public env: EnvService) { } 
  getAll(CompanyCode): Observable<MItemSerialStock[]> {
    return this.http.get<MItemSerialStock[]>(this.baseUrl + 'itemserialstock/GetAll?CompanyCode=' + CompanyCode);
  }
  getByItem(CompanyCode, itemCode): Observable<MItemSerialStock[]> {
    return this.http.get<MItemSerialStock[]>(this.baseUrl + 'itemserialstock/GetByItem?CompanyCode='+CompanyCode+'&ItemCode='+itemCode);
  }
 
  getPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MItemSerialStock[]>> {
    const paginatedResult: PaginatedResult<MItemSerialStock[]> = new PaginatedResult<MItemSerialStock[]>();
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

    return this.http.get<MItemSerialStock[]>(this.baseUrl + 'itemserialstock/GetPagedList', { observe: 'response', params})
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
 
  getBySlocItem(CompanyCode, sloc, itemCode): Observable<MItemSerialStock[]> {
    return this.http.get<MItemSerialStock[]>(this.baseUrl + 'itemserialstock/GetBySlocItem?CompanyCode='+CompanyCode+'&sloc=' + sloc + '&itemCode' + itemCode);
  }
  
   
    
  create(model: MItemSerialStock) {
    model.companyCode = this.authService.storeSelected().companyCode;
    model.createdBy = this.authService.decodeToken?.unique_name ;
    return this.http.post(this.baseUrl + 'itemserialstock/create', model );
  }

    
  update(model: MItemSerialStock) {
    model.companyCode = this.authService.storeSelected().companyCode;
    model.modifiedBy = this.authService.decodeToken?.unique_name ;
    return this.http.put(this.baseUrl + 'itemserialstock/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'itemserialstock/delete' + Id );
  }
  import(data: DataImport) {
    data.companyCode = this.authService.storeSelected().companyCode;
    data.createdBy = this.authService.decodeToken?.unique_name ;
    return this.http.post(this.baseUrl + 'itemserialstock/import', data );
  }

}
