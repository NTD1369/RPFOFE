import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MPeripherals } from 'src/app/_models/peripherals';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PeripheralsService {


  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService,private http: HttpClient, public env: EnvService) { }
  getAll(companyCode): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'Peripherals/GetAll?companyCode=' + companyCode );
  }
  getByCode(companyCode,code): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'Peripherals/GetById?companyCode=' + companyCode + "&code=" + code);
  }
  create(model: MPeripherals) {
    return this.http.post(this.baseUrl + 'Peripherals/create', model);
  }
  update(model: MPeripherals) {
    return this.http.put(this.baseUrl 
      + 'Peripherals/update' , model);
  }
  delete(model: MPeripherals) {
    return this.http.post(this.baseUrl 
      + 'Peripherals/delete' , model);
  }

}
