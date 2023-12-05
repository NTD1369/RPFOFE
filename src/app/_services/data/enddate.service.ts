import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { TEndDate } from 'src/app/_models/enddate';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnddateService {


  
  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
 
  getAll(companyCode, storeId, top): Observable<TEndDate[]> {

    return this.http.get<TEndDate[]>(this.baseUrl + 'enddate/GetAll?companyCode=' + companyCode + '&storeId=' + storeId + '&top=' + top);
  }

  CheckCounterConnection(companyCode, storeId, date): Observable<TEndDate[]> {
    return this.http.get<TEndDate[]>(this.baseUrl + 'enddate/CheckCounterConnection?companyCode=' + companyCode + '&storeId=' + storeId + '&transdate=' + date );
  }
  getEndDateList(companyCode, storeId): Observable<TEndDate[]> {
    return this.http.get<TEndDate[]>(this.baseUrl + 'enddate/GetEndDateList?companyCode=' + companyCode + '&storeId=' + storeId );
  } 
  
  getItem(companyCode, storeId, code): Observable<TEndDate> {
    debugger;
    return this.http.get<TEndDate>(this.baseUrl + 'enddate/GetByCode?companyCode=' + companyCode + '&storeId=' + storeId + '&Code=' + code);
  }
  endDateSummary(companyCode, storeId, transdate): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'enddate/EndDateSummary?companyCode='+ companyCode +'&storeId=' + storeId + '&transdate='+ transdate);
  }
  SummaryPaymentPrint(companyCode, storeId, dailyId): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'enddate/SummaryPaymentPrint?companyCode='+ companyCode +'&storeId=' + storeId + '&dailyId='+ dailyId);
  }
  EndDateSummaryByDepartment(companyCode, storeId, userlogin, fromDate, toDate, DailyId?) {
    if(DailyId== null || DailyId==undefined)
    {
      DailyId = "";
    }
    return this.http.get(this.baseUrl + 'enddate/EndDateSummaryByDepartment?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fDate='+ fromDate + '&tDate='+ toDate  + '&DailyId='+ DailyId);
  }
  create(model: TEndDate) {
    
    return this.http.post(this.baseUrl + 'enddate/create', model );
  }

    
  update(model: TEndDate) {
  
    return this.http.put(this.baseUrl + 'enddate/update', model);
  } 
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'enddate/delete' + Id );
  }

}
