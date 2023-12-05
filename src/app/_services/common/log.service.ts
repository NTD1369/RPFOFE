import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { SLog } from 'src/app/_models/slog';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll( DbType,   CompanyCode, StoreId, User,  Type,  FromDate, ToDate ): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'log/GetAll?DbType='+DbType+'&companyCode=' + CompanyCode  + '&StoreId=' + StoreId+ '&User=' + User + '&Type=' + Type+ '&FromDate=' + FromDate+ '&ToDate=' + ToDate );
  }
  
  create(model: SLog) {
    
    return this.http.post(this.baseUrl + 'log/create', model );
  }

    
  update(model: SLog) {
  
    return this.http.put(this.baseUrl + 'log/update', model);
  }

  
  // delete(model: TBankIn) {
  //   return this.http.post(this.baseUrl + 'bankin/delete', model );
  // }

}
