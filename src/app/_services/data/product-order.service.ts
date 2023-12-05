import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { Observable } from 'rxjs';
import { TProductionOrderHeader } from 'src/app/_models/viewmodel/productionOrder';

@Injectable({
  providedIn: 'root'
})
export class ProductOrderService {

  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService,private http: HttpClient, public env: EnvService) { }

  getOrderById(id,companyCode,storeId): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl 
      + 'productionOrder/GetOrderById?id=' + id + "&companyCode=" + companyCode  +"&storeId=" + storeId );
  }

  getByType(companycode: string, storeid: string, type, fromdate, todate, key,status): Observable<any[]> {
    
    return this.http.get<TProductionOrderHeader[]>(this.baseUrl + 'productionOrder/GetByType?companyCode='+companycode+'&storeId=' +storeid+'&type=' +type +'&fromdate=' + fromdate+'&todate=' + todate+'&key=' + key+'&status=' + status);
  }

}
