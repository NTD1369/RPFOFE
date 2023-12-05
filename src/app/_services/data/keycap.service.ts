import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MKeyCap } from 'src/app/_models/shortcut';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KeycapService {


 
  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  getAll(): Observable<MKeyCap[]> {
    return this.http.get<MKeyCap[]>(this.baseUrl + 'keyCap/GetAll');
  } 
  getItem(id): Observable<MKeyCap> {
    return this.http.get<MKeyCap>(this.baseUrl + 'keyCap/GetById?id=' + id);
  }
  
  create(model: MKeyCap) {
     
    return this.http.post(this.baseUrl + 'keyCap/create', model );
  }

    
  update(model: MKeyCap) {
    
    return this.http.put(this.baseUrl + 'keyCap/update', model);
  }
 
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'keyCap/delete' + Id );
  }


}
