import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { TPaymentHeader } from 'src/app/_models/tpayment';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {


  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService,private http: HttpClient, public env: EnvService) { }
  getAll(companyCode,CusId,  FromDate, ToDate, top, status): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'payment/GetAll?companyCode=' + companyCode + "&FromDate=" + FromDate + "&ToDate=" + ToDate+ "&CusId=" + CusId + "&top=" + top+ "&status=" + status);
  }
  
  getByCode(companyCode, id): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'payment/GetById?companyCode=' + companyCode + "&id=" + id);
  }
  create(model: TPaymentHeader) {
    return this.http.post(this.baseUrl + 'payment/create', model);
  }
  update(model: TPaymentHeader) {
    return this.http.put(this.baseUrl 
      + 'payment/update' , model);
  }
  delete(model: TPaymentHeader) {
    return this.http.post(this.baseUrl 
      + 'payment/delete' , model);
  }

}
