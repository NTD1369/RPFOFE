import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MSalesTarget } from 'src/app/_models/salestarget';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalestargetService {



  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
 
  getItems(companyCode,  SetupType,  Id,  FromDate,  ToDate ): Observable<any> {
    if(ToDate===null || ToDate === undefined)
    {
      ToDate = '';
    }
    if(FromDate===null || FromDate === undefined)
    {
      FromDate = '';
    }
    return this.http.get<any>(this.baseUrl + 'SalesTarget/GetAll?companyCode=' + companyCode + '&SetupType=' + SetupType + '&Id=' + Id  + '&FromDate=' + FromDate  + '&ToDate=' + ToDate);
  }
 
    
  create(model: MSalesTarget) {
    return this.http.post(this.baseUrl + 'SalesTarget/create', model );
  }

    
  update(model: MSalesTarget) {
    return this.http.put(this.baseUrl + 'SalesTarget/update', model);
  }
 
  
  delete(model: MSalesTarget) { 
    return this.http.post(this.baseUrl + 'SalesTarget/delete', model );
  }


}
