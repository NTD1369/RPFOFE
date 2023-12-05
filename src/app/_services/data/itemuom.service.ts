import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { ItemUomViewModel, MItemUom } from 'src/app/_models/mitemuom';
import { PaginatedResult } from 'src/app/_models/pagination';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemuomService {

 
  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  getAll(CompanyCode): Observable<MItemUom[]> {
    return this.http.get<MItemUom[]>(this.baseUrl + 'itemuom/GetAll?CompanyCode=' + CompanyCode);
  }
  getByItem(CompanyCode, itemCode): Observable<ItemUomViewModel[]> {
    return this.http.get<ItemUomViewModel[]>(this.baseUrl + 'itemuom/GetByItem?CompanyCode='+CompanyCode+'&ItemCode='+itemCode);
  }
  getByBarcode(CompanyCode, barCode): Observable<MItemUom> {
    return this.http.get<MItemUom>(this.baseUrl + 'itemuom/GetByItem?BarCode='+barCode);
  }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MItemUom[]>> {
    const paginatedResult: PaginatedResult<MItemUom[]> = new PaginatedResult<MItemUom[]>();
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

    return this.http.get<MItemUom[]>(this.baseUrl + 'itemuom/GetPagedList', { observe: 'response', params})
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
 
  getItem(CompanyCode, itemCode, uomCode): Observable<MItemUom> {
    return this.http.get<MItemUom>(this.baseUrl + 'itemuom/GetByCode?CompanyCode='+ CompanyCode +'&itemCode=' + itemCode + '&uomCode' + uomCode);
  }
   
    
  create(model: MItemUom) {
    return this.http.post(this.baseUrl + 'itemuom/create', model );
  }

    
  update(model: MItemUom) {
    return this.http.put(this.baseUrl + 'itemuom/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'itemuom/delete' + Id );
  }
  import(data: DataImport) {
    return this.http.post(this.baseUrl + 'itemuom/import', data );
  }

}
