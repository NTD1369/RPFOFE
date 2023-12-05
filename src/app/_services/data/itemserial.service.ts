import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { PaginatedResult } from 'src/app/_models/pagination';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItemserialService {



  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, private authService:AuthService, public env: EnvService) { } 
  getAll(CompanyCode, StoreId, SlocId, ItemCode, Keyword,Selecttop ): Observable<MItemSerial[]> {
    if(Selecttop ===null)
        Selecttop = "";
    return this.http.get<MItemSerial[]>(this.baseUrl + 'itemserial/GetAll?CompanyCode=' + CompanyCode + '&StoreId=' + StoreId + '&SlocId=' + SlocId +'&ItemCode=' + ItemCode+ '&Keyword=' + Keyword +'&Selecttop='+ Selecttop);
  }
  GenerateSerial(CompanyCode, StoreId, ExpDate, By,  Prefix,  ItemCode,  NumOfGen,  RandomNumberLen, RuningNumberLen): Observable<MItemSerial[]> {
    return this.http.get<MItemSerial[]>(this.baseUrl + 'itemserial/GenerateSerial?CompanyCode=' + CompanyCode + '&StoreId=' + StoreId + '&ExpDate=' + ExpDate+ '&By=' + By+ '&Prefix=' + Prefix+ '&ItemCode=' + ItemCode
    + '&NumOfGen=' + NumOfGen+ '&RandomNumberLen=' + RandomNumberLen+ '&RuningNumberLen=' + RuningNumberLen);
  }
  getByItem(CompanyCode, StoreId, itemCode): Observable<MItemSerial[]> {
    return this.http.get<MItemSerial[]>(this.baseUrl + 'itemserial/GetByItem?CompanyCode=' + CompanyCode + '&StoreId=' + StoreId + '&ItemCode='+itemCode);
  }
 
  getPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MItemSerial[]>> {
    const paginatedResult: PaginatedResult<MItemSerial[]> = new PaginatedResult<MItemSerial[]>();
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

    return this.http.get<MItemSerial[]>(this.baseUrl + 'itemserial/GetPagedList', { observe: 'response', params})
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
 
  getItem(itemCode, uomCode): Observable<MItemSerial> {
    return this.http.get<MItemSerial>(this.baseUrl + 'itemserial/GetByCode?itemCode=' + itemCode + '&uomCode' + uomCode);
  }
   
    
  create(model: MItemSerial) {
    model.companyCode = this.authService.storeSelected().companyCode;
    model.createdBy = this.authService.decodeToken?.unique_name ;
    return this.http.post(this.baseUrl + 'itemserial/create', model );
  }

    
  update(model: MItemSerial) {
    model.companyCode = this.authService.storeSelected().companyCode;
    model.modifiedBy = this.authService.decodeToken?.unique_name ;
    return this.http.put(this.baseUrl + 'itemserial/update', model);
  }
  updateWithStock(model) {
    model.companyCode = this.authService.storeSelected().companyCode;
    model.modifiedBy = this.authService.decodeToken?.unique_name ;
    return this.http.put(this.baseUrl + 'itemserial/updateWithStock', model);
  }

  
  delete(model) {
    // return this.http.delete(this.baseUrl + 'itemserial/delete' + Id );
    return this.http.post(this.baseUrl + 'itemserial/delete', model );
  }

  import(data: DataImport) {
    data.companyCode = this.authService.storeSelected().companyCode;
    data.storeId = this.authService.storeSelected().storeId;
    data.createdBy = this.authService.decodeToken?.unique_name ;
    return this.http.post(this.baseUrl + 'itemserial/import', data );
  }

}
