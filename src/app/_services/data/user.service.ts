import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from 'src/app/_models/pagination';
import { MUser, User } from 'src/app/_models/user';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
 
import { v4 as uuidv4 } from 'uuid';
import { EnvService } from 'src/app/env.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {


   // baseUrl = environment.apiUrl;
   baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'user/GetAll?companyCode=' + companyCode);
  }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
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

    return this.http.get<User[]>(this.baseUrl + 'user/GetPagedList', { observe: 'response', params})
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
 
  getItem(companyCode, id): Observable<MUser> {
    return this.http.get<MUser>(this.baseUrl + 'user/GetById?companyCode='+companyCode+'&id=' + id);
  }
   
  
  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'user/delete' + Id );
  }

  create(model: MUser) {
    let store = this.authService.storeSelected();
    debugger;
    model.userId = uuidv4();
    model.companyCode = store.companyCode;
  //  model.storeId = store.storeId;
  //   model.createdBy = this.authService.decodeToken?.unique_name ;
  //  model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'user/create', model );
  }

    
  update(model: MUser) {
    // let store = this.authService.storeSelected();
    debugger;
   //  model.storeId = store.storeId;
    // model.companyCode = store.companyCode;
    model.modifiedBy = this.authService.decodeToken?.unique_name ;
    return this.http.put(this.baseUrl + 'user/update', model);
  }
  updateLastStore(model: MUser) {
    // let store = this.authService.storeSelected();
    debugger;
   //  model.storeId = store.storeId;
    // model.companyCode = store.companyCode;
    model.modifiedBy = this.authService.decodeToken?.unique_name ;
    return this.http.put(this.baseUrl + 'user/UpdateLastStore', model);
  }
 
  import(data: DataImport) {
    let store = this.authService.storeSelected(); 
   //  model.storeId = store.storeId;
    data.companyCode = store.companyCode;
    data.createdBy = this.authService.decodeToken?.unique_name ;
    return this.http.post(this.baseUrl + 'user/import', data );
  }

}
