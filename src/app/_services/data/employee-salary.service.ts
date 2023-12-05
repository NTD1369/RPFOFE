import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MEmployeeSalary } from 'src/app/_models/salestarget';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSalaryService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getItems(CompanyCode, Employee, Id, FromDate, ToDate, ViewType): Observable<any> {
    return this.http.get<any[]>(this.baseUrl + 'EmployeeSalary/GetAll?CompanyCode='+ CompanyCode + '&Employee='+ Employee + '&Id='+ Id 
    + '&FromDate='+ FromDate + '&ToDate='+ ToDate  + '&ViewType='+ ViewType);
  }
   
    
  create(model: MEmployeeSalary) {
   
    return this.http.post(this.baseUrl + 'EmployeeSalary/create', model );
  }

    
  update(model: MEmployeeSalary) {
     
    return this.http.put(this.baseUrl + 'EmployeeSalary/update', model);
  }

  
  delete(model: MEmployeeSalary) {
    return this.http.post(this.baseUrl + 'EmployeeSalary/delete' , model);
  }
   
   
  // import(data: DataImport) {
  //   let store = this.authService.storeSelected();
    
  //   data.createdBy = this.authService.decodeToken?.unique_name ;
  //   data.companyCode = store.companyCode;
  //   return this.http.post(this.baseUrl + 'employee/import', data );
  // }


}
