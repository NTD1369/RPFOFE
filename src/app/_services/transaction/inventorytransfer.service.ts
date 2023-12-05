import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { TInventoryTransferHeader } from 'src/app/_models/inventorytransfer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransferService {


   // baseUrl = environment.apiUrl;
   baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { }

  item: any = {};
  getAll(companyCode): Observable<TInventoryTransferHeader[]> {
    return this.http.get<TInventoryTransferHeader[]>(this.baseUrl + 'inventoryTransfer/GetAll?CompanyCode=' + companyCode);
  }
  getInventoryList(companyCode, storeId, fromSloc, toSloc, DocType, Status, FrDate, ToDate, Keyword): Observable<TInventoryTransferHeader[]> {
    return this.http.get<TInventoryTransferHeader[]>(this.baseUrl + 'inventoryTransfer/GetInventoryList?CompanyCode=' + companyCode + '&storeId=' + storeId + '&fromSloc=' + fromSloc + '&toSloc=' + toSloc + '&DocType=' + DocType + '&Status=' + Status + '&FrDate=' + FrDate + '&ToDate=' + ToDate + '&Keyword=' + Keyword);
  }
  getInventoryTransfer(id, storeId, companyCode): Observable<TInventoryTransferHeader> {
    return this.http.get<TInventoryTransferHeader>(this.baseUrl + 'inventoryTransfer/GetById?id=' + id + '&storeId=' + storeId + '&companyCode=' + companyCode);
  }

  create(model: TInventoryTransferHeader) {
    return this.http.post(this.baseUrl + 'inventoryTransfer/create', model);
  }

  update(model: TInventoryTransferHeader) {
    return this.http.put(this.baseUrl + 'inventoryTransfer/update', model);
  }
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'inventoryTransfer/delete' + Id);
  }
}
