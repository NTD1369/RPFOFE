import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { SClientDisallowance } from 'src/app/_models/clientDisallowance';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientDisallowanceService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  getAll( CompanyCode,  StoreId,  Id,  CounterId,  Keyword): Observable<SClientDisallowance[]> {
    return this.http.get<SClientDisallowance[]>(this.baseUrl + 'ClientDisallowance/GetAll?CompanyCode='+ CompanyCode + '&StoreId='+ StoreId+ '&Id='+ Id+ '&CounterId='+ CounterId+ '&Keyword='+ Keyword);
  } 
   
  GetByCode(CompanyCode,  StoreId,  Id): Observable<SClientDisallowance> {
    return this.http.get<SClientDisallowance>(this.baseUrl + 'ClientDisallowance/GetByCode?CompanyCode='+ CompanyCode + '&StoreId='+ StoreId+ '&Id='+ Id);
  }
  
  create(model: SClientDisallowance) {
     
    return this.http.post(this.baseUrl + 'ClientDisallowance/create', model );
  }

    
  update(model: SClientDisallowance) {
    
    return this.http.put(this.baseUrl + 'ClientDisallowance/update', model);
  }
 
  delete(model: SClientDisallowance) {
    return this.http.post(this.baseUrl + 'ClientDisallowance/delete', model);
  }


}
