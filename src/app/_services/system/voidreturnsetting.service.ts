import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { SVoidOrderSetting } from 'src/app/_models/voidordersetting';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoidreturnsettingService {


    // baseUrl = environment.apiUrl;
    baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { }
  
  role: any = {};
  getAll(): Observable<SVoidOrderSetting[]> {
    return this.http.get<SVoidOrderSetting[]>(this.baseUrl + 'VoidOrderSetting/GetAll');
  }
   
  getById(type: string, code): Observable<SVoidOrderSetting> {
    return this.http.get<SVoidOrderSetting>(this.baseUrl + 'VoidOrderSetting/GetByCode?Type=' + type +'&Code=' + code );
  }
   
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'VoidOrderSetting/delete' + Id );
  }
  create(model: SVoidOrderSetting)
  {
    debugger;
   
    return this.http.post(this.baseUrl + 'VoidOrderSetting/create',  model);
  }
  update(model: SVoidOrderSetting)
  {
      
    return this.http.put(this.baseUrl + 'VoidOrderSetting/update', model);
  }

}

