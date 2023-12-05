import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { TShippingDivisionHeader } from 'src/app/_models/ship-division';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShipDivisionService {


  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService,private http: HttpClient, public env: EnvService) { }
  getAll(companyCode, FromDate, ToDate): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'ShippingDivision/GetAll?companyCode=' + companyCode + "&FromDate=" + FromDate + "&ToDate=" + ToDate);
  }
  GetDivisionToShip(companyCode, id, date): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'ShippingDivision/GetDivisionToShip?companyCode=' + companyCode + "&id=" + id + "&date=" + date);
  }

  getByCode(companyCode, id): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'ShippingDivision/GetByCode?companyCode=' + companyCode + "&id=" + id);
  }
  create(model: TShippingDivisionHeader) {
    return this.http.post(this.baseUrl + 'ShippingDivision/create', model);
  }
  update(model: TShippingDivisionHeader) {
    return this.http.put(this.baseUrl 
      + 'ShippingDivision/update' , model);
  }
  delete(model: TShippingDivisionHeader) {
    return this.http.post(this.baseUrl 
      + 'ShippingDivision/delete' , model);
  }
  // import(data: DataImport) {
   
  //   return this.http.post(this.baseUrl + 'tableinfor/import', data );
  // }
}
