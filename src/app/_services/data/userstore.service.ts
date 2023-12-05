import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MUserStore } from 'src/app/_models/muserstore';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserstoreService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  getAll(): Observable<MUserStore[]> {
    return this.http.get<MUserStore[]>(this.baseUrl + 'userstore/GetAll');
  }
  
  
  getItem(code): Observable<MUserStore> {
    return this.http.get<MUserStore>(this.baseUrl + 'userstore/GetByCode?code=' + code);
  }
   
    
  create(model: MUserStore) {
    return this.http.post(this.baseUrl + 'userstore/create', model );
  }

    
  update(model: MUserStore) {
    return this.http.put(this.baseUrl + 'userstore/update', model);
  }
  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'userstore/delete' + Id );
  }
  import(data: DataImport) {
    return this.http.post(this.baseUrl + 'userstore/import', data );
  }



}
