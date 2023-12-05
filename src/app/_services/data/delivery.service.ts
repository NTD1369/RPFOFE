import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from 'src/app/env.service';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { MPlaceInfor } from 'src/app/_models/placeinfor';
import { TPurchaseOrderHeader } from 'src/app/_models/purchase';
import { TDelivery } from 'src/app/_models/viewmodel/delivery';
@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService,private http: HttpClient, public env: EnvService) { }

  getOrderById(id,companyCode,storeId): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'delivery/GetOrderById?id=' + id + "&companyCode=" + companyCode  +"&storeId=" + storeId );
  }

  getByType(companycode: string, storeid: string, type, fromdate, todate, key,status): Observable<TDelivery[]> {
    
    return this.http.get<TDelivery[]>(this.baseUrl + 'delivery/GetByType?companyCode='+companycode+'&storeId=' +storeid+'&type=' +type +'&fromdate=' + fromdate+'&todate=' + todate+'&key=' + key+'&status=' + status);
  }
}
