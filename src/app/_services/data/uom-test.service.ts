import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from 'src/app/env.service';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { MUom } from 'src/app/_models/muom';

@Injectable({
  providedIn: 'root'
})
export class UomTestService {

  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService,private http: HttpClient, public env: EnvService) { }
  
  getAll(companyCode): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'uom/GetAll?companyCode=' + companyCode);
  }

 taomoi(model: MUom)
  {
    return this.http.post(this.baseUrl + 'uom/create', model);
  }
  getByCode(companyCode,code): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'uom/GetByCode?companyCode=' + companyCode + "&code=" + code);
  }
  capnhat(model: MUom) {
    return this.http.put(this.baseUrl 
      + 'uom/update' , model);
  }
  deleteX(model: MUom) {
    return this.http.post(this.baseUrl 
      + 'uom/delete' , model);
  }
  delete(model: MUom) {
    return this.http.delete(this.baseUrl 
      + 'uom/delete?id='+ model.uomCode);
  }
}


