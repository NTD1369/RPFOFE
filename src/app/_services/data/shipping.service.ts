import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MShipping } from 'src/app/_models/shipping';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {


  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService,private http: HttpClient, public env: EnvService) { }
  getAll(companyCode, keyword): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'shipping/GetAll?companyCode=' + companyCode   + "&keyword=" + keyword);
  }
  getByCode(companyCode, code): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'shipping/GetByCode?companyCode=' + companyCode + "&code=" + code );
  }
  create(model: MShipping) {
    return this.http.post(this.baseUrl + 'shipping/create', model);
  }
  update(model: MShipping) {
    return this.http.put(this.baseUrl 
      + 'shipping/update' , model);
  }
  delete(model: MShipping) {
    return this.http.post(this.baseUrl 
      + 'shipping/delete' , model);
  }
  // import(data: DataImport) {
   
  //   return this.http.post(this.baseUrl + 'tableinfor/import', data );
  // }

}
