import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { PaginatedResult } from 'src/app/_models/pagination';
import { AverageNumberModel, TPurchaseRequestHeader } from 'src/app/_models/purchase';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class purchaseRequestService {
    baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { }
  
  bill: any = {};
  getAll(companycode: string, storeid: string, fromdate, todate, key: string, status: string): Observable<TPurchaseRequestHeader[]> {
    return this.http.get<TPurchaseRequestHeader[]>(this.baseUrl + 'purchaserequest/GetByType?companyCode='+companycode+'&storeId=' +storeid+'&fromdate=' + fromdate+'&todate=' + todate + '&key=' + key + '&status=' + status);
  }
  getByType(companycode: string, storeid: string, type, fromdate, todate): Observable<TPurchaseRequestHeader[]> {
    return this.http.get<TPurchaseRequestHeader[]>(this.baseUrl + 'purchaserequest/GetByType?companyCode='+companycode+'&storeId=' +storeid+'&type=' +type +'&fromdate=' + fromdate+'&todate=' + todate);
  }
 
  getNewOrderCode(companyCode: string, storeId: string) 
  { 
    return this.http.get(this.baseUrl + 'purchaserequest/getNewNum?companyCode=' + companyCode + '&storeId=' + storeId,  { responseType: 'text' });
  }
  GetLastPricePO(companyCode, storeId, ItemCode, UomCode, Barcode) 
  { 
    return this.http.get(this.baseUrl + 'purchaserequest/GetLastPricePO?companyCode=' + companyCode + '&storeId=' + storeId+ '&ItemCode=' + ItemCode+ '&UomCode=' + UomCode+ '&Barcode=' + Barcode,  { responseType: 'text' });
  }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<TPurchaseRequestHeader[]>> {
    const paginatedResult: PaginatedResult<TPurchaseRequestHeader[]> = new PaginatedResult<TPurchaseRequestHeader[]>();
    debugger;
    let params = new HttpParams();


    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('status', userParams.status);
      params = params.append('keyword', userParams.keyword);
       
      params = params.append('orderBy', userParams.orderBy);
    }

    return this.http.get<TPurchaseRequestHeader[]>(this.baseUrl + 'purchaserequest/GetPagedList', { observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
          }
          return paginatedResult;
        })
      );

    // return this.http.get<Item[]>(this.baseUrl + 'item/GetAll');
  }

  getBill(id: string, companycode: string, storeid: string): Observable<TPurchaseRequestHeader> {
    return this.http.get<TPurchaseRequestHeader>(this.baseUrl + 'purchaserequest/GetOrderById?Id=' + id + '&CompanyCode=' + companycode + '&StoreId='+ storeid);
  }
   
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'purchaserequest/delete' + Id );
  }
  SavePO(invoice: TPurchaseRequestHeader)
  {
    // let headers = new Headers({ 'Content-Type': 'application/json' });
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //         'Content-Type':  'application/json'
  //     })
  //  };
    return this.http.post(this.baseUrl + 'purchaserequest/SavePO', invoice);
  }
  updateStatus(invoice: TPurchaseRequestHeader)
  {
    return this.http.post(this.baseUrl + 'purchaserequest/UpdateStatus', invoice);
  }
  updatecancel(invoice: TPurchaseRequestHeader)
  {
    return this.http.post(this.baseUrl + 'purchaserequest/UpdateCancel', invoice);
  }

  GetSalesPeriod(model: AverageNumberModel)
  {
    return this.http.post(this.baseUrl + 'purchaserequest/GetSalesPeriod', model);
  }

  GetLastOrderQuantity(model: AverageNumberModel)
  {
    return this.http.post(this.baseUrl + 'purchaserequest/GetLastOrderQuantity', model);
  }
}
