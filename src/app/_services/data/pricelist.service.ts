import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MPriceList } from 'src/app/_models/mpricelist';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PricelistService {

 
  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
  getAll(CompanyCode, storeId, itemCode): Observable<MPriceList[]> {
    return this.http.get<MPriceList[]>(this.baseUrl + 'pricelist/GetAll?CompanyCode='+ CompanyCode + '&storeId='+ storeId + '&itemCode='+ itemCode);
  }
  GetAllId(CompanyCode): Observable<MPriceList[]> {
    return this.http.get<MPriceList[]>(this.baseUrl + 'pricelist/GetAllId?CompanyCode='+ CompanyCode);
  }
  
  
  getItem(CompanyCode, code): Observable<MPriceList> {
    return this.http.get<MPriceList>(this.baseUrl + 'pricelist/GetByCode?CompanyCode='+ CompanyCode +'&code=' + code);
  }
   
    
  create(model: MPriceList) {
    let store = this.authService.storeSelected();
    
    model.createdBy = this.authService.decodeToken?.unique_name ;
    model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'pricelist/create', model );
  }

    
  update(model: MPriceList) {
    let store = this.authService.storeSelected();
    
    model.modifiedBy = this.authService.decodeToken?.unique_name ;
    model.companyCode = store.companyCode;
    return this.http.put(this.baseUrl + 'pricelist/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'pricelist/delete' + Id );
  }
  import(data: DataImport) {
    let store = this.authService.storeSelected();
    
    data.createdBy = this.authService.decodeToken?.unique_name ;
    data.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'pricelist/import', data );
  }



}
