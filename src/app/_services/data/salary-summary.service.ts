import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { TEmployeeSalesTargetSummary } from 'src/app/_models/salestarget';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalarySummaryService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
 
  getItems(companyCode,  Employee,  Position,  FromDate,  ToDate, ViewType ): Observable<any> {
    if(ToDate===null || ToDate === undefined)
    {
      ToDate = '';
    }
    if(FromDate===null || FromDate === undefined)
    {
      FromDate = '';
    }
    return this.http.get<any>(this.baseUrl + 'SalarySummary/GetAll?companyCode=' + companyCode + '&Employee=' + Employee + '&Position=' + Position  + '&FromDate=' + FromDate  + '&ToDate=' + ToDate + '&ViewType=' + ViewType);
  }
 
    
  create(model: TEmployeeSalesTargetSummary) {
    return this.http.post(this.baseUrl + 'SalarySummary/create', model );
  }
  createList(models: TEmployeeSalesTargetSummary[]) {
    return this.http.post(this.baseUrl + 'SalarySummary/createByList', models );
  }
  
  update(model: TEmployeeSalesTargetSummary) {
    return this.http.put(this.baseUrl + 'SalarySummary/update', model);
  }
 
  
  delete(model: TEmployeeSalesTargetSummary) { 
    return this.http.post(this.baseUrl + 'SalarySummary/delete', model );
  }


}
