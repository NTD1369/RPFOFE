import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { SToDoList } from 'src/app/_models/company copy';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class TodolistService {

    // baseUrl = environment.apiUrl;
    baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService,private http: HttpClient, public env: EnvService) { } 
  getAll(Id,  Code,  Name,  Description,  Content,  Remark,  Status,
    FromDate,  ToDate,  CreatedBy, CreatedOn): Observable<SToDoList[]> {
    return this.http.get<SToDoList[]>(this.baseUrl + 'todolist/GetAll?Id=' + Id + "&Code=" + Code+ "&Name=" + Name+ "&Description=" + Description+ "&Content=" + Content+ "&Remark=" + Remark+ "&Status=" + Status
    + "&FromDate=" + FromDate+ "&ToDate=" + ToDate+ "&CreatedBy=" + CreatedBy+ "&CreatedOn=" + CreatedOn);
  }
   
 
  getItem(id): Observable<SToDoList> {
    return this.http.get<SToDoList>(this.baseUrl + 'todolist/GetById?Id=' + id);
  }
   
    
  create(model: SToDoList) {
    
    return this.http.post(this.baseUrl + 'todolist/create', model );
  }

    
  update(model: SToDoList) {
    
    return this.http.put(this.baseUrl + 'todolist/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'todolist/delete' + Id );
  }
  


}
