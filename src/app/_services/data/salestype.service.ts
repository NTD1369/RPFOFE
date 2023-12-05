import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { SSalesType } from 'src/app/_models/salestype';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalestypeService {


    // baseUrl = environment.apiUrl;
    baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  getAll(): Observable<SSalesType[]> {
    return this.http.get<SSalesType[]>(this.baseUrl + 'SalesType/GetAll');
  }
   
  getItem(code): Observable<SSalesType> {
    return this.http.get<SSalesType>(this.baseUrl + 'SalesType/GetByCode?code=' + code);
  }
   
    
  create(model: SSalesType) {
   
    return this.http.post(this.baseUrl + 'SalesType/create', model );
  }

    
  update(model: SSalesType) {
   
    return this.http.put(this.baseUrl + 'SalesType/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'SalesType/delete' + Id );
  }
   

}
