import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from 'src/app/env.service';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { MTableInfor } from 'src/app/_models/tableinfo';

@Injectable({
  providedIn: 'root'
})
export class TablePlaceService {

  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { }

  getAll(companyCode, storeId, shiftId, placeId, keyword, isSetup, IsDesign): Observable<any> {
    return this.http.get<any[]>(this.baseUrl
      + 'tableplace/GetAll?companyCode=' + companyCode + "&storeId=" + storeId + "&shiftId=" + shiftId + "&placeId=" + placeId + "&keyword=" + keyword + "&isSetup=" + isSetup + "&IsDesign=" + IsDesign);
  }

  GetAllTableNoActiveInPlace(companyCode, storeId, shiftId, placeId, keyword, isSetup, IsDesign): Observable<any> {
    return this.http.get<any[]>(this.baseUrl
      + `tableplace/GetAllTableNoActiveInPlace?companyCode=${companyCode}&storeId=${storeId}&shiftId= ${shiftId}&placeId=${placeId}&keyword=${keyword}`);
  }

  getByCode(companyCode, storeId, shiftId, placeId, tableId): Observable<any> {
    return this.http.get<any[]>(this.baseUrl
      + 'tableplace/GetByCode?companyCode=' + companyCode + "&storeId=" + storeId + "&shiftId=" + shiftId + "&placeId=" + placeId + "&tableId=" + tableId);
  }
  
  create(model: MTableInfor) {
    return this.http.post(this.baseUrl + 'tableplace/create', model);
  }

  apply(model: MTableInfor) {
    return this.http.post(this.baseUrl + 'tableplace/apply', model);
  }

  update(model: MTableInfor) {
    return this.http.put(this.baseUrl
      + 'tableplace/update', model);
  }

  delete(model: MTableInfor) {
    return this.http.post(this.baseUrl
      + 'tableplace/delete', model);
  }

}
