import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { TGoodsIssueHeader } from 'src/app/_models/goodissue';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class GoodsissueService {


   // baseUrl = environment.apiUrl;
   baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode): Observable<TGoodsIssueHeader[]> {
    return this.http.get<TGoodsIssueHeader[]>(this.baseUrl + 'goodissue/GetAll?companyCode='+ companyCode);
  }
  getByStore(companyCode, storeId): Observable<TGoodsIssueHeader[]> {
    return this.http.get<TGoodsIssueHeader[]>(this.baseUrl + 'goodissue/GetByStore?companyCode='+ companyCode + '&storeId='+ storeId);
  }
  getGoodsIssueList(companyCode, StoreId,  Status,FrDate,ToDate,Keyword, ViewBy): Observable<TGoodsIssueHeader[]> {
    return this.http.get<TGoodsIssueHeader[]>(this.baseUrl + 'goodissue/GetGoodsIssueList?CompanyCode='+companyCode+'&StoreId='+StoreId +'&Status='+Status+'&FrDate='+FrDate+'&ToDate='+ToDate+'&Keyword='+Keyword + '&ViewBy=' + ViewBy);
  }
  getIssue(id,storeId, companyCode): Observable<TGoodsIssueHeader> {
     
    return this.http.get<TGoodsIssueHeader>(this.baseUrl + 'goodissue/GetById?id=' + id + '&storeId='+ storeId+ '&companyCode='+ companyCode);
  }
    
  create(model: TGoodsIssueHeader) {
  
    return this.http.post(this.baseUrl + 'goodissue/create', model );
  } 
    
  update(model: TGoodsIssueHeader) {
    return this.http.put(this.baseUrl + 'goodissue/update', model);
  } 
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'goodissue/delete' + Id );
  }


}
