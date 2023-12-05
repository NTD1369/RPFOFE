import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MPriorityPriceList } from 'src/app/_models/mpricelist';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PriotypricelistService {


  
  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
  getAll(CompanyCode, CusGrpId, Id): Observable<MPriorityPriceList[]> {
    return this.http.get<MPriorityPriceList[]>(this.baseUrl + 'PriorityPriceList/GetAll?CompanyCode=' + CompanyCode + '&CusGrpId=' + CusGrpId + '&Id=' + Id);
  }
  
  
  getItem(CompanyCode,Id): Observable<MPriorityPriceList> {
    return this.http.get<MPriorityPriceList>(this.baseUrl + 'PriorityPriceList/GetById?Company=' + CompanyCode + '&Id=' + Id);
  }
   
    
  create(model: MPriorityPriceList) {
     
    return this.http.post(this.baseUrl + 'PriorityPriceList/create', model );
  }

    
  update(model: MPriorityPriceList) {
    
    return this.http.put(this.baseUrl + 'PriorityPriceList/update', model);
  }

  
  delete(model: MPriorityPriceList) {
    return this.http.post(this.baseUrl + 'PriorityPriceList/delete', model );
  }
   


}
