import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { LicensePlateHearder, LicensePlateLine } from 'src/app/_models/licensePlatemodel';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class LicensePlateService {
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService, public env: EnvService) { }
  import(data: DataImport) {
    let store = this.authService.storeSelected();
    data.createdBy = this.authService.decodeToken?.unique_name;
    data.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'LicensePlate/import', data);
  }
  checkLicensePlate(companyCode,licensePlate,quantity ) {
    return this.http.get(this.baseUrl + 'LicensePlate/CheckLicensePlate?CompanyCode=' + companyCode + '&licensePlate=' + licensePlate + '&quantity=' + quantity);
  }
  getMenberInfo(companyCode,storeId,key,type ) {
    return this.http.get(this.baseUrl + 'LicensePlate/GetVoucherInfo?CompanyCode=' + companyCode + '&storeId=' + storeId + '&Key=' + key + '&Type='+type);
  }
  getAll(companyCode,key ) {
    return this.http.get(this.baseUrl + 'LicensePlate/GetAll?CompanyCode=' + companyCode +  '&Key=' + key);
  }
  getById(id, companyCode): Observable<LicensePlateHearder> {
    if((companyCode===null || companyCode===undefined ))
    {
      let store = this.authService.storeSelected(); 
      companyCode= store.companyCode;
    } 
    return this.http.get<LicensePlateHearder>(this.baseUrl + 'LicensePlate/GetById?companyCode='+ companyCode +'&id='+id);
  }
  Search(companyCode,key ) {
    return this.http.get<LicensePlateLine[]>(this.baseUrl + 'LicensePlate/Search?CompanyCode=' + companyCode +  '&Key=' + key);
  }
  getSerialInfo(companyCode,storeId,key ) {
    return this.http.get(this.baseUrl + 'LicensePlate/GetSerialInfo?CompanyCode=' + companyCode + '&storeId=' + storeId + '&Key=' + key);
  }
}
