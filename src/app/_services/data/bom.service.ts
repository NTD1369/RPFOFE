import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MBomline } from 'src/app/_models/mbomline';
import { PaginatedResult } from 'src/app/_models/pagination';
import { BOMDataImport, BOMViewModel } from 'src/app/_models/viewmodel/BOMViewModel';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class BomService {



  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
 
  constructor(private http: HttpClient, private authService: AuthService, public env: EnvService) { } 
  
  item: any = {};
  GetByItemCode(companyCode,itemcode): Observable<BOMViewModel> {
    return this.http.get<BOMViewModel>(this.baseUrl + 'BOM/GetByItemCode?companyCode='+companyCode+'&itemcode='+ itemcode);
  }
   
  getAll(companyCode): Observable<BOMViewModel[]> {
    return this.http.get<BOMViewModel[]>(this.baseUrl + 'BOM/GetAll?companyCode=' + companyCode);
  }
 
  getPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<BOMViewModel[]>> {
    const paginatedResult: PaginatedResult<BOMViewModel[]> = new PaginatedResult<BOMViewModel[]>();
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

    return this.http.get<BOMViewModel[]>(this.baseUrl + 'BOM/GetPagedList', { observe: 'response', params})
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
  
  create(model: BOMViewModel) {
    model.companyCode = this.authService.storeSelected().companyCode;
    model.createdBy = this.authService.decodeToken?.unique_name ;
    return this.http.post(this.baseUrl + 'BOM/create', model );
  }
  importBOM(model: BOMDataImport)
  { 
    debugger;
    model.companyCode = this.authService.storeSelected().companyCode;
    model.createdBy = this.authService.decodeToken?.unique_name ;
    return this.http.post(this.baseUrl + 'BOM/Import', model);
  }
    
  update(model: BOMViewModel) {
    model.companyCode = this.authService.storeSelected().companyCode;
    model.createdBy = this.authService.decodeToken?.unique_name ;
    return this.http.put(this.baseUrl + 'BOM/update', model);
  }

  createLine(model: MBomline) {
    model.companyCode = this.authService.storeSelected().companyCode;
    model.createdBy = this.authService.decodeToken?.unique_name ;
    return this.http.post(this.baseUrl + 'BOM/createLine', model );
  }
 
  updateLine(model: MBomline) {
    model.companyCode = this.authService.storeSelected().companyCode;
    model.createdBy = this.authService.decodeToken?.unique_name ;
    return this.http.put(this.baseUrl + 'BOM/updateLine', model);
  }
  
  delete(itemcode: string) {
   let companyCode = this.authService.storeSelected().companyCode;
    return this.http.delete(this.baseUrl + 'BOM/delete?CompanyCode=' + companyCode + '&ItemCode=' + itemcode );
  }

  deleteLine(Id: string, BomId: string) {
    let companyCode = this.authService.storeSelected().companyCode;
    return this.http.delete(this.baseUrl + 'BOM/deleteLine?CompanyCode=' + companyCode + '&BomId=' + BomId + '&Id=' + Id);
  }


}
