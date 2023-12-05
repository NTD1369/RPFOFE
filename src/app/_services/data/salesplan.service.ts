import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MSalesPlanHeader, SSalesPlan } from 'src/app/_models/salesplan';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesplanService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  // StoreId,  Type, 
  getItems(companyCode,  Id,  Name,  Keyword , FromDate, ToDate): Observable<any> {
    if(FromDate === null || FromDate === undefined)
    {
      FromDate = '';
    }
    if(ToDate === null || ToDate === undefined)
    {
      ToDate = '';
    }
    return this.http.get<any>(this.baseUrl + 'SalesPlan/getItems?companyCode=' + companyCode +  '&Id=' + Id+ '&Name=' + Name + '&Keyword=' + Keyword+ '&FromDate=' + FromDate+ '&ToDate=' + ToDate);
  }
  getItem(companyCode,  Id): Observable<any> { 
    return this.http.get<any>(this.baseUrl + 'SalesPlan/getItemById?companyCode=' + companyCode +  '&Id=' + Id);
  }
 
    
    
  create(model: MSalesPlanHeader) {
    return this.http.post(this.baseUrl + 'SalesPlan/create', model );
  }

    
  update(model: MSalesPlanHeader) {
    return this.http.put(this.baseUrl + 'SalesPlan/update', model);
  }
 
  
  delete(model: MSalesPlanHeader) { 
    return this.http.post(this.baseUrl + 'SalesPlan/delete', model );
  }

}
