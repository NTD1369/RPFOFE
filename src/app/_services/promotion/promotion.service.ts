import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { PromotionDocument } from 'src/app/_models/promotion/document';
import { SPromoHeader } from 'src/app/_models/promotion/promotionheader';
import { MPromoType } from 'src/app/_models/promotion/promotiontype';
import { InActivePromoViewModel, PromotionViewModel } from 'src/app/_models/promotion/promotionViewModel';
import { SchemaViewModel } from 'src/app/_models/promotion/schemaViewModel';
import { SStatus } from 'src/app/_models/promotion/status';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {


  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService ) { } 
  
  item: any = {};
  getStatus(): Observable<SStatus[]> {
    return this.http.get<SStatus[]>(this.baseUrl + 'promotions/GetAll');
  }
  
  getPromotionsType(): Observable<MPromoType[]> {
    return this.http.get<MPromoType[]>(this.baseUrl + 'promotions/PromoType');
  }
  searchPromotion(companyCode, promoId, promotype, promoName, customerType, customerValue, validDateFrom, 
    validDateTo, validTimeFrom, validTimeTo, isMon, isTue, isWed, isThu, isFri, isSat, isSun, isCombine, status): Observable<SPromoHeader[]> {
    // 
    return this.http.get<SPromoHeader[]>(this.baseUrl + 'promotions/Search?companyCode='+ companyCode +'&promoId='+ promoId+'&promotype='+ promotype
    +'&promoName='+ promoName+'&customerType='+ customerType+'&customerValue='+ customerValue+'&validDateFrom='+ validDateFrom+'&validDateTo='+ validDateTo
    +'&validTimeFrom='+ validTimeFrom+'&validTimeTo='+ validTimeTo +'&isMon='+ isMon+'&isTue='+ isTue+'&isWed='+ isWed+'&isThu='+ isThu+'&isFri='+ isFri+'&isSat='+ isSat
    +'&isSun='+ isSun+'&isCombine='+ isCombine+'&status='+ status);
  }
   
  getPromotion(companyCode, promoId): Observable<PromotionViewModel> {
    return this.http.get<PromotionViewModel>(this.baseUrl + 'promotions/Promotion?companyCode=' + companyCode + '&promoId='+ promoId);
  }
  searchSchema(companyCode, schemaId, schemaName, promoId, status): Observable<SPromoHeader[]> {
    // 
    return this.http.get<SPromoHeader[]>(this.baseUrl + 'promotions/SearchSchema?companyCode='+ companyCode +'&schemaId='+ schemaId+'&schemaName='+ schemaName
    +'&promoId='+ promoId +'&status='+ status);
  }
  getSchema(companyCode, schemaId): Observable<SchemaViewModel> {
    return this.http.get<SchemaViewModel>(this.baseUrl + 'promotions/Schema?companyCode=' + companyCode + '&schemaId='+ schemaId);
  }
  saveEntity(promotion) {
    debugger;
    return this.http.post(this.baseUrl + 'promotions/CreateUpdate', promotion );
  }
  removePromotion(promotionId, companyCode) {
    debugger;
    return this.http.get(this.baseUrl + 'promotions/Remove?companyCode='+ companyCode + '&promotionId='+ promotionId);
  }
  saveSchema(schema) {
    return this.http.post(this.baseUrl + 'promotions/CreateUpdateSchema', schema );
  }
  applyPromotion(document: PromotionDocument)
  { 
    return this.http.post(this.baseUrl + 'promotions/Apply', document );
  }
  applyPaymentPromotion(document: PromotionDocument)
  { 
    return this.http.post(this.baseUrl + 'promotions/ApplyPayment', document );
  }

  applyPromotionManual(document: PromotionDocument, promoId)
  { 
    return this.http.post(this.baseUrl + 'promotions/ApplyPromo?promoId=' + promoId, document );
  }
  runSimulator(document: PromotionDocument, schema)
  { 
    return this.http.post(this.baseUrl + 'promotions/Simulator?schema=' + schema, document );
  }
  applySchema(document: PromotionDocument, schemaId)
  { 
    return this.http.post(this.baseUrl + 'promotions/ApplySchema?schemaId=' + schemaId, document );
  }
  InActiveLine(line: InActivePromoViewModel)
  { 
    return this.http.post(this.baseUrl + 'promotions/CheckInActiveGetBuy', line );
  }
  checkVoucherPromotion(document: PromotionDocument)
  { 
    return this.http.post(this.baseUrl + 'promotions/CheckVoucherPromotion', document );
  }
  import(data: DataImport) {
     
    return this.http.post(this.baseUrl + 'promotions/import', data );
  }
  getSchemaList(companyCode,  customerCode,  customerGrp,  totalBuy, docDate)
  {
  
    return this.http.get(this.baseUrl + 'promotions/SchemaList?companyCode='+ companyCode + 
      '&customerCode='+ customerCode+ '&customerGrp='+ customerGrp+ '&totalBuy='+ totalBuy + '&docDate='+ docDate);
  }
  getPromoList(companyCode, storeId, promoType, customerCode,  customerGrp,  totalBuy, docDate)
  {
    // debugger;
    return this.http.get(this.baseUrl + 'promotions/PromoList?companyCode='+ companyCode + '&storeId='+ storeId + '&promoType='+ promoType+
      '&customerCode='+ customerCode+ '&customerGrp='+ customerGrp+ '&totalBuy='+ totalBuy + '&docDate='+ docDate);
  }

}
