import { Injectable } from '@angular/core';
import { EnvService } from 'src/app/env.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { PlacePrintModel } from 'src/app/_models/viewmodel/PlacePrintModel';

@Injectable({
  providedIn: 'root'
})
export class PlacePrintService {

  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) {
    console.log("baseUrl", this.baseUrl);

  }

  getAll(companyCode, storeId): Observable<any> {
    return this.http.get<any[]>(this.baseUrl
      + 'placePrint/GetAll?companyCode=' + companyCode + "&storeId=" + storeId);
  }


  viewItemByItemGroup(companyCode, storeId,itemGroup,status): Observable<any> {
    console.log("itemGroup",itemGroup);
    return this.http.get<any>(this.baseUrl + 'placePrint/ViewItemByItemGroup?companyCode=' + companyCode + "&storeId=" + storeId + "&itemGroup=" + itemGroup + "&status=" + status);
  }


  getListItemGroup(companyCode, storeId): Observable<any> {
    return this.http.get<any[]>(this.baseUrl + `PlacePrint/GetListItemGroup?companyCode=${companyCode}&storeId=${storeId}`);
  }

  create(model: PlacePrintModel) {
    return this.http.post(this.baseUrl + 'placePrint/create', model);
  }

  update(model: PlacePrintModel) {
    return this.http.put(this.baseUrl
      + 'placePrint/update', model);
  }

  delete(printId: number) {
    return this.http.delete(this.baseUrl + 'placePrint/delete?printId=' + printId);
  }

  getSystemPrintName(): Observable<any> {
    return this.http.get<any[]>(this.baseUrl + 'placePrint/SyncPrintName');
  }
}
