import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MReason } from 'src/app/_models/reason';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReasonService {


  
  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
 
  GetById(companyCode, id): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'reason/GetById?companyCode='+companyCode+'&id=' + id  );
  }
  getAll(companyCode ): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'reason/GetAll?companyCode='+companyCode );
  }
 
    
  create(control: MReason) {
    return this.http.post(this.baseUrl + 'reason/create', control );
  }

    
  update(control: MReason) {
    return this.http.put(this.baseUrl + 'reason/update', control);
  }
 
  
  delete(companyCode, id: string) {
    return this.http.delete(this.baseUrl + 'reason/delete?companyCode=' + companyCode+'&id=' + id );
  }


}
