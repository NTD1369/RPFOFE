import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MPermission } from 'src/app/_models/mpermission';
import { PaginatedResult } from 'src/app/_models/pagination';
import { NodeUpdateModel } from 'src/app/_models/viewmodel/FunctionNodeModel';
import { HeaderPermissionViewModel } from 'src/app/_models/viewmodel/headerGridModel';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService, public env: EnvService) { }
  
  permistion: any = {};
  getAll(companyCode): Observable<MPermission[]> {
    return this.http.get<MPermission[]>(this.baseUrl + 'permission/GetAll?companyCode=' + companyCode);
  }
  
  getHeaderGrid(): Observable<HeaderPermissionViewModel[]> {
    return this.http.get<HeaderPermissionViewModel[]>(this.baseUrl + 'permission/GetHeaderFunctionPermission');
  }
  getHeaderControlPermissionGrid(): Observable<HeaderPermissionViewModel[]> {
    return this.http.get<HeaderPermissionViewModel[]>(this.baseUrl + 'permission/GetHeaderPermission');
  }
  getPermissionByFunction(functionId: string): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'permission/GetPermissionByFunction?FunctionId=' + functionId);
  }
  GetPermissionByRole(roleId: string): Observable<any[]> {
    // debugger;
    return this.http.get<any[]>(this.baseUrl + 'permission/GetPermissionByRole?RoleId=' + roleId);
  }
  CopyFromRole(CompanyCode,  FrRole,  ToRole, By): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'permission/CopyFromRole?CompanyCode=' + CompanyCode+ '&FrRole='+ FrRole + '&ToRole='+ ToRole + '&By='+ By);
  }

  GetControlPermissionListByFunction(functionId: string, roleId): Observable<any[]> {
    // debugger;
    return this.http.get<any[]>(this.baseUrl + 'permission/GetControlPermissionListByFunction?FunctionId=' + functionId + '&RoleId='+ roleId);
  }

  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MPermission[]>> {
    const paginatedResult: PaginatedResult<MPermission[]> = new PaginatedResult<MPermission[]>();
    // debugger;
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

    return this.http.get<MPermission[]>(this.baseUrl + 'permission/GetPagedList', { observe: 'response', params})
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
 
  getById(companyCode, id: string): Observable<MPermission> {
    return this.http.get<MPermission>(this.baseUrl + 'permission/GetById?companyCode='+companyCode+'&Id=' + id );
  }
  checkApproveFunctionByUser(CompanyCode, User,  Password, CustomCode, Function, ControlId, Permission): Observable<MPermission> {
    return this.http.get<MPermission>(this.baseUrl + 'permission/checkApproveFunctionByUser?companyCode='+CompanyCode+'&User=' + User
    +'&Password=' + Password+'&CustomCode=' + CustomCode+'&Function=' + Function+'&ControlId=' + ControlId+'&Permission=' + Permission );
  }
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'permission/delete' + Id );
  }
  updateNode(model: MPermission)
  { 
     debugger;
     model.createdBy =  this.authService.decodeToken?.unique_name;
    return this.http.post(this.baseUrl + 'permission/UpdateNode',  model);
  }
  updateListNode(list: MPermission[])
  { 
     debugger;
     
    return this.http.post(this.baseUrl + 'permission/UpdateListNode',  list);
  }
  create(permis: MPermission)
  { 
    permis.createdBy =  this.authService.decodeToken?.unique_name;
    return this.http.post(this.baseUrl + 'permission/create',  permis);
  }
  update(permis: MPermission)
  {
    debugger;
    this.permistion = permis;
    // this.role = {
    //   RoleId= role.roleId,
    //   CompanyCode: role.companyCode,
    //   RoleName: role.roleName,
    //   Description: role.description,
    //   ModifiedBy: role.createdBy,
    //   Status: role.status,
    // }; 
    return this.http.put(this.baseUrl + 'permission/update',  this.permistion);
  }
}
