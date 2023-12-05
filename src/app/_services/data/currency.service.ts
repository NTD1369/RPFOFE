import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MCurrency } from 'src/app/_models/currency';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  getAll(): Observable<MCurrency[]> {
    return this.http.get<MCurrency[]>(this.baseUrl + 'currency/GetAll');
  } 
  GetRoundingMethod(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'currency/GetRoundingMethod');
  }
  
  getItem(code): Observable<MCurrency> {
    return this.http.get<MCurrency>(this.baseUrl + 'currency/GetByCode?code=' + code);
  }
  
  create(model: MCurrency) {
     
    return this.http.post(this.baseUrl + 'currency/create', model );
  }

    
  update(model: MCurrency) {
    
    return this.http.put(this.baseUrl + 'currency/update', model);
  }
 
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'currency/delete' + Id );
  }

}
