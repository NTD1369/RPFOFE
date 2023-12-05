import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DivisionService {

  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  getAll(companycode, fromdate, todate): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'division/GetAll?companyCode='+ companycode +'&fromdate=' + fromdate+'&todate=' + todate );
  }
   
  getItem(companycode, id): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'division/GetById?companyCode='+ companycode +'&id=' + id);
  }
  getDetail(companycode, id): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'division/GetDetailDivision?companyCode='+ companycode +'&id=' + id);
  }
   
  createByList(listData: any) {
    // let store = this.authService.storeSelected();
    
    // model.createdBy = this.authService.decodeToken?.unique_name ;
    // model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'division/createByList', listData );
  }
  create(model: any) {
    // let store = this.authService.storeSelected();
    
    // model.createdBy = this.authService.decodeToken?.unique_name ;
    // model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'division/create', model );
  }

    
  update(model: any) {
    // let store = this.authService.storeSelected();
    
    // model.modifiedBy = this.authService.decodeToken?.unique_name ;
    // model.companyCode = store.companyCode;
    return this.http.put(this.baseUrl + 'division/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'division/delete' + Id );
  }
   
  Get_RPT_SOToDivision(CompanyCode, Date, CusId, TransId, InComplete) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_SOToDivision?CompanyCode=' + CompanyCode + '&Date='+ Date
    + '&CusId='+ CusId+ '&TransId='+ TransId + '&InComplete='+ InComplete);
  }
}
