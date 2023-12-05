import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MLoyaltyType, SLoyaltyBuy, SLoyaltyHeader } from 'src/app/_models/crm';
import { PromotionViewModel } from 'src/app/_models/promotion/promotionViewModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrmService {

  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  
  getType(): Observable<MLoyaltyType[]> {
    return this.http.get<MLoyaltyType[]>(this.baseUrl + 'Loyalty/Type');
  }
  search(companyCode, loyaltyId, loyaltyType, loyaltyName, customerType, customerValue, validDateFrom, 
    validDateTo, validTimeFrom, validTimeTo, isMon, isTue, isWed, isThu, isFri, isSat, isSun, isCombine, status): Observable<SLoyaltyHeader[]> {
    // 
    return this.http.get<SLoyaltyHeader[]>(this.baseUrl + 'Loyalty/Search?companyCode='+ companyCode +'&loyaltyId='+ loyaltyId+'&loyaltyType='+ loyaltyType
    +'&loyaltyName='+ loyaltyName+'&customerType='+ customerType+'&customerValue='+ customerValue+'&validDateFrom='+ validDateFrom+'&validDateTo='+ validDateTo
    +'&validTimeFrom='+ validTimeFrom+'&validTimeTo='+ validTimeTo +'&isMon='+ isMon+'&isTue='+ isTue+'&isWed='+ isWed+'&isThu='+ isThu+'&isFri='+ isFri+'&isSat='+ isSat
    +'&isSun='+ isSun+'&isCombine='+ isCombine+'&status='+ status);
  }
   
  getById(companyCode, loyaltyId): Observable<SLoyaltyHeader> {
    debugger
    return this.http.get<SLoyaltyHeader>(this.baseUrl + 'Loyalty/Loyalty?companyCode=' + companyCode + '&loyaltyId='+ loyaltyId);
  }
 
  saveEntity(loyalty) {
    debugger;
    return this.http.post(this.baseUrl + 'Loyalty/CreateUpdate', loyalty );
  }
  remove(loyaltyId, companyCode) {
    debugger;
    return this.http.get(this.baseUrl + 'Loyalty/Remove?companyCode='+ companyCode + '&loyaltyId='+ loyaltyId);
  }
  RedeemPoint( companyCode, storeId, point) {
    debugger;
    return this.http.get(this.baseUrl + 'Loyalty/RedeemPoint?companyCode='+ companyCode + '&storeId='+ storeId + '&point='+ point);
  }
  applyPromotion(document)
  { 
    return this.http.post(this.baseUrl + 'Loyalty/Apply', document );
  }
  
  // checkVoucherPromotion(document: PromotionDocument)
  // { 
  //   return this.http.post(this.baseUrl + 'promotions/CheckVoucherPromotion', document );
  // }
  // import(data: DataImport) {
     
  //   return this.http.post(this.baseUrl + 'promotions/import', data );
  // }

}
