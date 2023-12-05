import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from 'src/app/env.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {



  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, public env: EnvService ,  private http: HttpClient) { } 
  
  item: any = {};
  get_RPT_InventoryAudit(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_InventoryAudit?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  get_RPT_InventoryOnHand(companyCode, storeId, userlogin) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_InventoryOnHand?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin);
  }
  get_RPT_SalesStoreSummary(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_SalesStoreSummary?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  get_RPT_SalesTransactionDetail(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_SalesTransactionDetail?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  Get_Dash_SaleDetailTransactionByTop(companyCode, storeId,   FromDate, ToDate, ViewType, ViewBy, Top) {
    return this.http.get(this.baseUrl + 'report/Get_Dash_SaleDetailTransactionByTop?companyCode=' + companyCode + '&storeId='+ storeId+ '&FromDate='+ FromDate+ '&ToDate='+ ToDate + '&ViewType='+ ViewType  + '&ViewBy='+ ViewBy  + '&Top='+ Top);
  }

  get_RPT_SalesTransactionDetail_Ex(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_SalesTransactionDetail_Ex?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  get_RPT_SalesTransactionDetail_Return(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_SalesTransactionDetail_Return?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  get_RPT_SalesTransactionSummary(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_SalesTransactionSummary?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  Get_RPT_SalesTopProduct(companyCode, storeId, userlogin, fromDate, toDate, top) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_SalesTopProduct?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate+ '&top='+ top);
  }
  Get_RPT_SOToDivision(CompanyCode, Date, CusId, TransId, InComplete) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_SOToDivision?CompanyCode=' + CompanyCode + '&Date='+ Date
    + '&CusId='+ CusId+ '&TransId='+ TransId + '&InComplete='+ InComplete);
  }
  get_RPT_SalesByHour(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/get_RPT_SalesByHour?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  Get_RPT_SalesByYear(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_SalesByYear?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  Get_RPT_SalesBySalesPerson(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_SalesBySalesPerson?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  Get_RPT_SalesTransactionPayment(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_SalesTransactionPayment?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  Get_RPT_VoucherCheckIn(companyCode, storeId, userlogin, fromDate, toDate, keyword) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_VoucherCheckIn?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate+ '&keyword='+ keyword);
  }
  Get_RPT_Dashboard(companyCode, storeId, userlogin, date) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_Dashboard?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&date='+ date);
  }
  Get_RPT_LoadChartOrderPeriodByYear(companyCode, storeId, userlogin, year) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_LoadChartOrderPeriodByYear?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&year='+ year);
  }
  Get_RPT_LoadChartOrderPeriodByMonth(companyCode, storeId, userlogin, year, month) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_LoadChartOrderPeriodByMonth?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&year='+ year + '&month='+ month);
  }
  Get_RPT_LoadChartOrderPeriodByWeek(companyCode, storeId, userlogin) {
    // debugger;
    return this.http.get(this.baseUrl + 'report/Get_RPT_LoadChartOrderPeriodByWeek?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin);
  }

  Get_SYNC_ITEM_CMP(companyCode, FItem, TItem,FDate ,TDate) {
    if(FDate === null || FDate ===undefined)
    {
      FDate = '';
    }
    if(TDate === null || TDate ===undefined)
    {
      TDate = '';
    }
    // debugger;
    return this.http.get(this.baseUrl + 'report/Get_SYNC_ITEM_CMP?companyCode=' + companyCode + '&FItem='+ FItem+ '&TItem='+ TItem + '&FDate='+ FDate + '&TDate='+ TDate);
  }
  Get_RPT_SYNC_LISTING_CMP(companyCode, FItem, TItem,FDate ,TDate) {
    if(FDate === null || FDate ===undefined)
    {
      FDate = '';
    }
    if(TDate === null || TDate ===undefined)
    {
      TDate = '';
    }
    // debugger;
    return this.http.get(this.baseUrl + 'report/Get_RPT_SYNC_LISTING_CMP?companyCode=' + companyCode + '&FItem='+ FItem+ '&TItem='+ TItem + '&FDate='+ FDate + '&TDate='+ TDate);
  }
  Get_RPT_SYNC_PROMO_CMP(companyCode, FId, TId,FDate ,TDate) {
    if(FDate === null || FDate ===undefined)
    {
      FDate = '';
    }
    if(TDate === null || TDate ===undefined)
    {
      TDate = '';
    }
    // debugger;
    return this.http.get(this.baseUrl + 'report/Get_RPT_SYNC_PROMO_CMP?companyCode=' + companyCode + '&FId='+ FId+ '&TId='+ TId + '&FDate='+ FDate + '&TDate='+ TDate);
  }
  Get_RPT_SYNC_PRICE_CMP(companyCode, FItem, TItem,FDate ,TDate) {
    // debugger;
    if(FDate === null || FDate ===undefined)
    {
      FDate = '';
    }
    if(TDate === null || TDate ===undefined)
    {
      TDate = '';
    }
    return this.http.get(this.baseUrl + 'report/Get_RPT_SYNC_PRICE_CMP?companyCode=' + companyCode + '&FItem='+ FItem+ '&TItem='+ TItem+ '&FDate='+ FDate + '&TDate='+ TDate);
  }


  Get_Rpt_GiftVoucher(fromDate, toDate, OutletID) {
    return this.http.get(this.baseUrl + 'report/Get_Rpt_GiftVoucher?fromDate=' + fromDate + '&toDate='+ toDate+ '&OutletID='+ OutletID);
  }
  Get_RPT_POSPromo(fromDate, toDate, OutletID) {
    // debugger;
    return this.http.get(this.baseUrl + 'report/Get_RPT_POSPromo?fromDate=' + fromDate + '&toDate='+ toDate+ '&OutletID='+ OutletID);
  }
  Get_RPT_SyncDataStatusByIdoc(CompanyCode, IdocNum, DataType) {
    // debugger;
    return this.http.get(this.baseUrl + 'report/Get_RPT_SyncDataStatusByIdoc?CompanyCode=' + CompanyCode + '&IdocNum='+ IdocNum+ '&DataType='+ DataType);
  }

  Get_RPT_InventoryPosting(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_InventoryPosting?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  Get_RPT_SalesEPAYDetail(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_SalesEPAYDetail?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  Get_RPT_SyncDataStatusView(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_SyncDataStatusView?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  Get_RPT_SalesTransactionSummaryByDepartment(companyCode, storeId, userlogin, fromDate, toDate, DailyId?) {
    if(DailyId== null || DailyId==undefined)
    {
      DailyId = "";
    }
    return this.http.get(this.baseUrl + 'report/Get_RPT_SalesTransactionSummaryByDepartment?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate  + '&DailyId='+ DailyId);
  }
  Get_RPT_ActionOnOrder(companyCode, storeId,  user, transId, userlogin, fromDate, toDate, Type) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_ActionOnOrder?companyCode=' + companyCode + '&storeId='+ storeId + '&user='+ user + '&transId='+ transId + '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate  + '&Type='+ Type);
  }

  Get_RPT_CollectionDailyByCounter(companyCode, storeId,  userlogin, Date) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_CollectionDailyByCounter?companyCode=' + companyCode + '&storeId='+ storeId + '&userlogin='+ userlogin + '&Date='+ Date);
  }

  Get_RPT_InvoiceTransactionPayment(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_InvoiceTransactionPayment?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }

  get_RPT_InvoiceTransactionDetail(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_InvoiceTransactionDetail?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  get_RPT_InvoiceTransactionSummary(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_InvoiceTransactionSummary?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  Get_RPT_POSPromoNew(companyCode,   fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_POSPromoNew?CompanyCode=' + companyCode + '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  get_RPT_InventorySerial(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_InventorySerial?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  
  Get_RPT_SalesByItem(companyCode, storeId, userlogin, fromDate, toDate) {
    return this.http.get(this.baseUrl + 'report/Get_RPT_SalesbyItem?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate);
  }
  Get_RPT_CustomerPoint(companyCode, customerId) {
    return this.http.get(this.baseUrl + 'Loyalty/PointReport?companyCode=' + companyCode + '&customerId='+ customerId );
  }
  export_RPT_SalesTransactionDetail(companyCode, storeId, userlogin, fromDate, toDate,header) {
    return this.http.post(this.baseUrl + 'report/Export_RPT_SalesTransactionDetail?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate,header,{ responseType: 'blob' });
  }
  export_RPT_SalesStoreSummary(companyCode, storeId, userlogin, fromDate, toDate,header) {
    return this.http.post(this.baseUrl + 'report/Export_RPT_SalesStoreSummary?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate,header,{ responseType: 'blob' });
  }
  export_RPT_SalesTransactionSummary(companyCode, storeId, userlogin, fromDate, toDate,header) {
    return this.http.post(this.baseUrl + 'report/Export_RPT_SalesTransactionSummary?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate,header,{ responseType: 'blob' });
  }
  export_RPT_SalesTransactionPayment(companyCode, storeId, userlogin, fromDate, toDate,header) {
    return this.http.post(this.baseUrl + 'report/Export_RPT_SalesTransactionPayment?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate,header,{ responseType: 'blob' });
  }
  export_RPT_InventoryPosting(companyCode, storeId, userlogin, fromDate, toDate,header) {
    return this.http.post(this.baseUrl + 'report/Export_RPT_InventoryPosting?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate,header,{ responseType: 'blob' });
  }
  export_RPT_InventoryAudit(companyCode, storeId, userlogin, fromDate, toDate,header) {
    return this.http.post(this.baseUrl + 'report/Export_RPT_InventoryAudit?companyCode=' + companyCode + '&storeId='+ storeId+ '&userlogin='+ userlogin+ '&fromDate='+ fromDate + '&toDate='+ toDate,header,{ responseType: 'blob' });
  }
}
