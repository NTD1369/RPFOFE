import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MFunction } from 'src/app/_models/mfunction';
import { PaginatedResult } from 'src/app/_models/pagination';
import { NodeFunctionViewModel } from 'src/app/_models/viewmodel/FunctionNodeModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {

    // baseUrl = environment.apiUrl;
    baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { }
  
  function: any = {};
  getAll(companyCode): Observable<MFunction[]> {
    return this.http.get<MFunction[]>(this.baseUrl + 'function/GetAll?companyCode='+ companyCode);
  }
  getFuntionMenuShow(companyCode): Observable<MFunction[]> {
    return this.http.get<MFunction[]>(this.baseUrl + 'function/GetFuntionMenuShow?companyCode='+ companyCode);
  }
  getAllNode(companyCode): Observable<NodeFunctionViewModel[]> {
    return this.http.get<NodeFunctionViewModel[]>(this.baseUrl + 'Function/GetNodeAll?companyCode='+ companyCode);
  }
  getFunctionExpandAll(companyCode, userId): Observable<MFunction[]> {
    return this.http.get<MFunction[]>(this.baseUrl + 'Function/GetFunctionExpandAll?companyCode='+ companyCode+'&userId=' + userId);
  }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MFunction[]>> {
    const paginatedResult: PaginatedResult<MFunction[]> = new PaginatedResult<MFunction[]>();
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

    return this.http.get<MFunction[]>(this.baseUrl + 'function/GetPagedList', { observe: 'response', params})
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
 
  getById(companyCode, id: string): Observable<MFunction> {
    return this.http.get<MFunction>(this.baseUrl + 'function/GetById?companyCode='+ companyCode+'&Id=' + id );
  }
   
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'function/delete' + Id );
  }
  create(func: MFunction)
  { 
    return this.http.post(this.baseUrl + 'function/create',  func);
  }
  update(func: MFunction)
  {
    debugger;
    this.function = func;
    // this.role = {
    //   RoleId= role.roleId,
    //   CompanyCode: role.companyCode,
    //   RoleName: role.roleName,
    //   Description: role.description,
    //   ModifiedBy: role.createdBy,
    //   Status: role.status,
    // }; 
    return this.http.put(this.baseUrl + 'function/update',  this.function);
  }
  updateMenuShow(func: MFunction[])
  {
    debugger;
    this.function = func;
    // this.role = {
    //   RoleId= role.roleId,
    //   CompanyCode: role.companyCode,
    //   RoleName: role.roleName,
    //   Description: role.description,
    //   ModifiedBy: role.createdBy,
    //   Status: role.status,
    // }; 
    return this.http.put(this.baseUrl + 'function/UpdateMenuShow',  this.function);
  }
}
