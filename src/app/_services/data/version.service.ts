import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { SVersion } from 'src/app/_models/system/version';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VersionService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  getAll(companyCode): Observable<SVersion[]> {
    return this.http.get<SVersion[]>(this.baseUrl + 'version/GetAll?companyCode=' + companyCode );
  }
  
  
  getItem(companyCode, version): Observable<SVersion> {
    return this.http.get<SVersion>(this.baseUrl + 'version/GetByCode?companyCode=' + companyCode + '&version=' + version);
  }
   
    
  create(model: SVersion) {
    return this.http.post(this.baseUrl + 'version/create', model );
  }

    
  update(model: SVersion) {
    return this.http.put(this.baseUrl + 'version/update', model);
  }
  
  delete(model: SVersion) {
    return this.http.post(this.baseUrl + 'version/delete', model);
  }

}
