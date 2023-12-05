import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from 'src/app/env.service';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { MPlaceInfor } from 'src/app/_models/placeinfor';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService,private http: HttpClient, public env: EnvService) { }
  getAll(companyCode,storeId,keyword): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'placeinfor/GetAll?companyCode=' + companyCode + "&storeId=" + storeId + "&keyword=" + keyword);
  }
  getByCode(companyCode,storeId,tableId): Observable<any> {
    return this.http.get<any[]>(this.baseUrl 
      + 'placeinfor/GetByCode?companyCode=' + companyCode + "&storeId=" + storeId + "&tableId=" + tableId);
  }
  create(model: MPlaceInfor) {
    return this.http.post(this.baseUrl + 'placeinfor/create', model);
  }
  update(model: MPlaceInfor) {
    return this.http.put(this.baseUrl 
      + 'placeinfor/update' , model);
  }
  delete(model: MPlaceInfor) {
    return this.http.post(this.baseUrl 
      + 'placeinfor/delete' , model);
  }
}
