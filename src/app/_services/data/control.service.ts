import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MControl } from 'src/app/_models/control';
import { PaginatedResult } from 'src/app/_models/pagination';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ControlService {



  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  // getItems(): Observable<Item[]> {
  //   return this.http.get<Item[]>(this.baseUrl + 'item/GetAll');
  // }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MControl[]>> {
    const paginatedResult: PaginatedResult<MControl[]> = new PaginatedResult<MControl[]>();
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

    return this.http.get<MControl[]>(this.baseUrl + 'control/GetPagedList', { observe: 'response', params})
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
 
  getControl(companyCode, id, functionId): Observable<MControl> {
    return this.http.get<MControl>(this.baseUrl + 'control/GetById?companyCode='+companyCode+'&id=' + id + '&Function='+ functionId);
  }
    
  getControlByFunction(companyCode, functionId): Observable<MControl[]> {
    return this.http.get<MControl[]>(this.baseUrl + 'control/GetControlByFunction?companyCode='+companyCode+'&functionid=' + functionId);
  }
    
  create(control: MControl) {
    return this.http.post(this.baseUrl + 'control/create', control );
  }

    
  update(control: MControl) {
    return this.http.put(this.baseUrl + 'control/update', control);
  }
  updateOrderNum(controls ) {
    return this.http.put(this.baseUrl + 'control/UpdateOrderNum', controls);
  }
  
  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'control/delete' + Id );
  }

}
