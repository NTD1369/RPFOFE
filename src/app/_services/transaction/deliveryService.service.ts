import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EnvService } from 'src/app/env.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { TReturnHeader } from 'src/app/_models/viewmodel/deliveryReturn';

@Injectable({
  providedIn: 'root'
})
export class DeliveryReturnService {

  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService,private http: HttpClient, public env: EnvService) { }

  getOrderById(id,companyCode,storeId): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'deliveryReturn/GetOrderById?id=' + id + "&companyCode=" + companyCode  +"&storeId=" + storeId );
  }

  getByType(companycode: string, storeid: string, type, fromdate, todate, key,status): Observable<TReturnHeader[]> {
    
    return this.http.get<TReturnHeader[]>(this.baseUrl + 'deliveryReturn/GetByType?companyCode='+companycode+'&storeId=' +storeid+'&type=' +type +'&fromdate=' + fromdate+'&todate=' + todate+'&key=' + key+'&status=' + status);
  }

}
