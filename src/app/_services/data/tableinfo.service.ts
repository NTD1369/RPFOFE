
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from 'src/app/env.service';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { MTableInfor } from 'src/app/_models/tableinfo';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
@Injectable({
  providedIn: 'root'
})
export class TableinfoService {

  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { }

  getAll(companyCode, storeId, keyword): Observable<any> {
    return this.http.get<any[]>(this.baseUrl
      + 'tableinfor/GetAll?companyCode=' + companyCode + "&storeId=" + storeId + "&keyword=" + keyword);
  }

  getByCode(companyCode, storeId, tableId): Observable<any> {
    return this.http.get<any[]>(this.baseUrl
      + 'tableinfor/GetByCode?companyCode=' + companyCode + "&storeId=" + storeId + "&tableId=" + tableId);
  }

  create(model: MTableInfor) {
    return this.http.post(this.baseUrl + 'tableinfor/create', model);
  }

  update(model: MTableInfor) {
    return this.http.put(this.baseUrl
      + 'tableinfor/update', model);
  }

  delete(model: MTableInfor) {
    return this.http.post(this.baseUrl
      + 'tableinfor/delete', model);
  }

  import(data: DataImport) {

    return this.http.post(this.baseUrl + 'tableinfor/import', data);
  }
}
