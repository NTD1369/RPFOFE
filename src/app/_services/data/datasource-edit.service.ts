import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { SDatasourceEdit } from 'src/app/_models/datasourceedit';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class DatasourceEditService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
 
  constructor( private authService: AuthService, private http: HttpClient, public env: EnvService ) { } 
  
  item: any = {};
  getAll(CompanyCode, Datasource): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'DatasourceEdit/GetAll?CompanyCode='+ CompanyCode + '&Datasource=' + Datasource);
  }
   
  getItem(CompanyCode, Datasource,id): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'DatasourceEdit/GetById?CompanyCode='+ CompanyCode + '&Datasource=' + Datasource+ '?id=' + id);
  }
   
    
  create(model: SDatasourceEdit) {
   
    return this.http.post(this.baseUrl + 'DatasourceEdit/create', model );
  }

    
  update(model: SDatasourceEdit) {
   
    return this.http.put(this.baseUrl + 'DatasourceEdit/update', model);
  }

  
  delete(companyCode,  id: string) {
    return this.http.delete(this.baseUrl + 'DatasourceEdit/delete?companyCode=' + companyCode + '&id=' +id );
  }
   
   

}
