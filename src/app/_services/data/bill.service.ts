import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { PaginatedResult } from 'src/app/_models/pagination';
import { TSalesHeader } from 'src/app/_models/tsaleheader';
import { TSalesInvoice } from 'src/app/_models/tsalesinvoice';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { Order } from 'src/app/_models/viewmodel/order';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { }

  bill: any = {};
  getByType(companycode: string, storeid: string, type, fromdate, todate, dataSource, transId, status, salesMan, keyword, viewBy): Observable<TSalesHeader[]> {
    return this.http.get<TSalesHeader[]>(this.baseUrl + 'sale/GetByType?companyCode=' + companycode + '&storeId=' + storeid + '&type=' + type + '&fromdate=' + fromdate + '&todate=' + todate + '&dataSource='
      + dataSource + '&transId=' + transId + '&status=' + status + '&salesMan=' + salesMan + '&keyword=' + keyword + '&viewBy=' + viewBy);
  }
  getCheckoutOpentList(companycode: string, storeid: string, type, fromdate, todate, viewBy): Observable<TSalesHeader[]> {
    return this.http.get<TSalesHeader[]>(this.baseUrl + 'sale/GetCheckoutOpentList?companyCode=' + companycode + '&storeId=' + storeid + '&type=' + type + '&fromdate=' + fromdate + '&todate=' + todate + '&viewBy=' + viewBy);
  }
  getInvoiceInfor(companycode: string, phone: string, taxCode): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'sale/GetInvoiceInfor?companyCode=' + companycode + '&phone=' + phone + '&taxCode=' + taxCode);
  }
  getSummaryPayment(TransId, EvenId, CompanyCode, StoreId): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'sale/GetSummaryPayment?TransId=' + TransId + '&EvenId=' + EvenId + '&companyCode=' + CompanyCode + '&StoreId=' + StoreId);
  }

  testPrint(htmlStr, filename): Observable<any> {
    debugger;
    return this.http.post<any>(this.baseUrl + 'sale/testPrint?&filename=' + filename, htmlStr);
  }


  getNewOrderCode(StoreCode: string) {
    return this.http.get(this.baseUrl + 'sale/getNewOrderNum?StoreCode=' + StoreCode);
  }
  checkOMSIDAlready(CompanyCode, OMSID: string) {
    return this.http.get(this.baseUrl + 'sale/CheckOMSIDAlready?CompanyCode=' + CompanyCode + '&OMSID=' + OMSID);
  }

  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<TSalesHeader[]>> {
    const paginatedResult: PaginatedResult<TSalesHeader[]> = new PaginatedResult<TSalesHeader[]>();
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

    return this.http.get<TSalesHeader[]>(this.baseUrl + 'sale/GetPagedList', { observe: 'response', params })
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

  getBill(id: string, companycode: string, storeid: string): Observable<Order> {
    return this.http.get<Order>(this.baseUrl + 'sale/GetOrderById?Id=' + id + '&CompanyCode=' + companycode + '&StoreId=' + storeid);
  }

  PrintReceipt(companycode: string, storeid: string, transId: string, printStatus, size, printName): Observable<Order> {
    if (printName === null || printName === undefined || printName === 'null' || printName === 'undefined') {
      printName = "";
    }
    return this.http.get<Order>(this.baseUrl + 'sale/PrintReceipt?CompanyCode=' + companycode + '&StoreId=' + storeid + '&transId=' + transId + '&printStatus=' + printStatus + '&size=' + size + '&printName=' + printName);
  }
  getBillCheckIn(id: string, companycode: string, storeid: string): Observable<Order> {
    return this.http.get<Order>(this.baseUrl + 'sale/GetCheckInById?Id=' + id + '&CompanyCode=' + companycode + '&StoreId=' + storeid);
  }
  getContractItem(companycode: string, storeid: string, PlaceId: string, ContractNo: string, TransId: string, ShiftId: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'sale/GetContractItem?CompanyCode=' + companycode + '&StoreId=' + storeid + '&PlaceId=' + PlaceId + '&ContractNo=' + ContractNo + '&TransId=' + TransId + '&ShiftId=' + ShiftId);
  }
  getCheckOutById(id: string, companycode: string, storeid: string): Observable<Order> {
    return this.http.get<Order>(this.baseUrl + 'sale/GetCheckOutById?Id=' + id + '&CompanyCode=' + companycode + '&StoreId=' + storeid);
  }
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'sale/delete' + Id);
  }
  create(order: Order) {
    return this.http.post(this.baseUrl + 'sale/CreateSaleOrderByTableType', order);
  }

  createMultipleOrder(orders) {
    return this.http.post(this.baseUrl + 'sale/CreateMultipleOrder', orders);
  }


  import(data: DataImport) {

    return this.http.post(this.baseUrl + 'sale/import', data);
  }
  cancelOrder(order: Order) {
    // if(Type==="Cancel")
    // {
    //   cancel = 'C';
    // }
    debugger
    // order.refTransId ='';
    order.refTransId = order.transId;
    order.transId = '';
    order.isCanceled = 'C';
    console.log(order);
    return this.http.post(this.baseUrl + 'sale/CreateSaleOrderByTableType', order);
    // return this.http.post(this.baseUrl + 'sale/CancelSO', order);
  }
  confirmOrder(order: Order) {
    return this.http.post(this.baseUrl + 'sale/ConfirmSO', order);
  }
  confirmPayooOrder(order: Order) {
    return this.http.post(this.baseUrl + 'sale/ConfirmSOPayoo', order);
  }
  rejectOrder(order: Order) {
    return this.http.post(this.baseUrl + 'sale/RejectSO', order);
  }
  addPayment(order: Order) {
    return this.http.post(this.baseUrl + 'sale/AddPayment', order);
  }


  GetOrderByContractNo(companyCode, storeId, contractNo, ShiftId, PlateId): Observable<any> {
    return this.http.get<any[]>(this.baseUrl
      + 'Sale/GetOrderByContractNo?companyCode=' + companyCode + "&StoreId=" + storeId + "&ContractNo=" + contractNo + "&ShiftId=" + ShiftId + "&PlateId=" + PlateId);
  }
  MoveTable(companyCode, storeId, placeId, fromTable, toTable, TransIdList?): Observable<any> {

    let mang = ['a', 'b', 'c'];
    let strJoin = mang.join(','); // a,b,c
    if (TransIdList === null || TransIdList === undefined) {
      TransIdList = "";
    }
    return this.http.get<any[]>(this.baseUrl
      + 'Sale/MoveTable?companyCode=' + companyCode + "&StoreId=" + storeId + "&PlaceId=" + placeId + "&FromTable=" + fromTable + "&ToTable=" + toTable + "&TransIdList=" + TransIdList);
  }
  MergeTable(CompanyCode, StoreId, ShiftId, PlaceId, CreatedBy, tableList, toTable, ClearTable?): Observable<any> {
    if (ClearTable === null || ClearTable === undefined) {
      ClearTable = true;
    }

    return this.http.post(this.baseUrl
      + 'Sale/MergeTable?companyCode=' + CompanyCode + "&StoreId=" + StoreId + "&ShiftId=" + ShiftId + "&PlaceId=" + PlaceId + "&CreatedBy=" + CreatedBy + "&ToTable=" + toTable + "&ClearTable=" + ClearTable, tableList);
  }

  SplitTable(CompanyCode, StoreId, ShiftId, PlaceId, tableId, groupKey): Observable<any> {
    const tableList = {
      CompanyCode: CompanyCode,
      TableId: tableId.toString(),
      ShiftId: ShiftId,
      StoreId: StoreId,
      PlaceId: PlaceId,
      GroupKey: groupKey
    }
    return this.http.post(this.baseUrl
      + `Sale/SplitTable`, tableList);
  }
}
