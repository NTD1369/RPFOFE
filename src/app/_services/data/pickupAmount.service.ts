import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { TPickupAmount } from 'src/app/_models/pickupamount';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PickupAmountService {

  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { } 


  //  getAll(companyCode): Observable<TPickupAmount[]> {
  //   return this.http.get<TPickupAmount[]>(this.baseUrl + 'PickupAmount/GetAll?companyCode=' + companyCode);
  // }
  
  GetItems(companyCode, storeId, DailyId, CounterId,  ShiftId, PickupBy, CreatedBy, FDate, TDate): Observable<TPickupAmount> {
    return this.http.get<TPickupAmount>(this.baseUrl + 'PickupAmount/getItems?companyCode=' + companyCode + '&storeId='+ storeId +'&DailyId=' + DailyId +'&CounterId=' + CounterId
    + '&ShiftId='+ ShiftId+ '&PickupBy='+ PickupBy+ '&CreatedBy='+ CreatedBy + '&FDate='+ FDate + '&TDate='+ TDate);
  }
  GetItem(companyCode, storeId, DailyId, CounterId,  ShiftId, Id, NumOfList): Observable<TPickupAmount> {
    return this.http.get<TPickupAmount>(this.baseUrl + 'PickupAmount/getItem?companyCode=' + companyCode + '&storeId='+ storeId +'&DailyId=' + DailyId +'&CounterId=' + CounterId
    + '&ShiftId='+ ShiftId+ '&Id='+ Id+ '&NumOfList='+ NumOfList);
  }
   
  GetPickupAmountLst(companyCode, storeId, DailyId, ShiftId, IsSales?, FDate?, TDate?): Observable<TPickupAmount> {
    if(IsSales===null || IsSales===undefined || IsSales ==="")
    {
      IsSales = "";
    }
    if(FDate===null || FDate===undefined || FDate ==="")
    {
      FDate = "";
    }
    if(TDate===null || TDate===undefined || TDate ==="")
    {
      TDate = "";
    }
    return this.http.get<TPickupAmount>(this.baseUrl + 'PickupAmount/GetPickupAmountLst?companyCode=' + companyCode + '&storeId='+ storeId +'&DailyId=' + DailyId 
    +'&ShiftId=' + ShiftId +'&IsSales=' + IsSales +'&FDate=' + FDate +'&TDate=' + TDate 
     );
  }
   
  create(model: TPickupAmount) { 
    return this.http.post(this.baseUrl + 'PickupAmount/create', model );
  }

  update(model: TPickupAmount) { 
    return this.http.put(this.baseUrl + 'PickupAmount/update', model );
  }

  // update(paymentmethod: MPaymentMethod) {
  //   let store = this.authService.storeSelected();
   
  //   paymentmethod.createdBy = this.authService.decodeToken?.unique_name ;
  //   paymentmethod.companyCode = store.companyCode;
  //   return this.http.put(this.baseUrl + 'paymentmethod/update', paymentmethod);
  // }

  
  delete(model: TPickupAmount) {
    return this.http.post(this.baseUrl + 'PickupAmount/delete', model );
  }
}
