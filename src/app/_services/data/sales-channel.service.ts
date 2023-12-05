import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MSalesChannel } from 'src/app/_models/msaleschannel';
import { MSalesPlanHeader } from 'src/app/_models/salesplan';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesChannelService {

  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  // StoreId,  Type, 
  getAll(companyCode,  Keyword ): Observable<any> {

    return this.http.get<any>(this.baseUrl + 'Saleschannel/GetAll?companyCode=' + companyCode + '&Keyword=' + Keyword);
  }
  getItem(companyCode,  Id): Observable<any> { 
    return this.http.get<any>(this.baseUrl + 'Saleschannel/GetByCode?companyCode=' + companyCode +  '&key=' + Id);
  }
 
    
    
  create(model: MSalesChannel) {
    return this.http.post(this.baseUrl + 'Saleschannel/create', model );
  }

    
  update(model: MSalesPlanHeader) {
    return this.http.put(this.baseUrl + 'Saleschannel/update', model);
  }
 
  
  delete(model: MSalesPlanHeader) { 
    return this.http.post(this.baseUrl + 'Saleschannel/delete', model );
  }

}

