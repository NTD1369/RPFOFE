import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { EnvService } from 'src/app/env.service';
import { TReceiptfromProductionHeader } from 'src/app/_models/viewmodel/receiptFromProduction';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptFromProductionService {

  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService,private http: HttpClient, public env: EnvService) { }

  getOrderById(id,companyCode,storeId): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'receiptFromProduction/GetOrderById?id=' + id + "&companyCode=" + companyCode  +"&storeId=" + storeId );
  }

  getByType(companycode: string, storeid: string, type, fromdate, todate, key,status): Observable<TReceiptfromProductionHeader[]> {
    
    return this.http.get<TReceiptfromProductionHeader[]>(this.baseUrl + 'receiptFromProduction/GetByType?companyCode='+companycode+'&storeId=' +storeid+'&type=' +type +'&fromdate=' + fromdate+'&todate=' + todate+'&key=' + key+'&status=' + status);
  }

}
