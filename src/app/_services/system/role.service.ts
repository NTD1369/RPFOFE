import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MRole } from 'src/app/_models/mrole';
import { PaginatedResult } from 'src/app/_models/pagination';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {


   // baseUrl = environment.apiUrl;
   baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { }
  
  role: any = {};
  getAll(): Observable<MRole[]> {
    return this.http.get<MRole[]>(this.baseUrl + 'role/GetAll');
  }
  
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MRole[]>> {
    const paginatedResult: PaginatedResult<MRole[]> = new PaginatedResult<MRole[]>();
    debugger;
    let params = new HttpParams();


    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('status', userParams.status);
      params = params.append('keyword', userParams.keyword);
       
      params = params.append('orderBy', userParams.orderBy);
    }

    return this.http.get<MRole[]>(this.baseUrl + 'role/GetPagedList', { observe: 'response', params})
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
 
  getById(id: string): Observable<MRole> {
    return this.http.get<MRole>(this.baseUrl + 'role/GetById?Id=' + id );
  }
   
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'role/delete' + Id );
  }
  create(role: MRole)
  {
    debugger;
    this.role = {
      CompanyCode: role.companyCode,
      RoleName: role.roleName,
      Description: role.description,
      CreatedBy: role.createdBy,
      ModifiedOn: null,
      ModifiedBy: null,  
      Status: role.status
    }; 
    return this.http.post(this.baseUrl + 'role/create',  this.role);
  }
  update(role: MRole)
  {
    debugger;
    this.role = role;
    // this.role = {
    //   RoleId= role.roleId,
    //   CompanyCode: role.companyCode,
    //   RoleName: role.roleName,
    //   Description: role.description,
    //   ModifiedBy: role.createdBy,
    //   Status: role.status,
    // }; 
    return this.http.put(this.baseUrl + 'role/update',  this.role);
  }
}
