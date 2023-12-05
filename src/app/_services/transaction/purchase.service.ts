import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { PaginatedResult } from 'src/app/_models/pagination';
import { TPurchaseOrderHeader } from 'src/app/_models/purchase';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {


    // baseUrl = environment.apiUrl;
    baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { }
  
  bill: any = {};
  getAll(companycode: string, storeid: string, fromdate, todate, key, status): Observable<TPurchaseOrderHeader[]> {
    return this.http.get<TPurchaseOrderHeader[]>(this.baseUrl + 'purchase/GetByType?companyCode='+companycode+'&storeId=' +storeid+'&fromdate=' + fromdate+'&todate=' + todate+'&key=' + key + '&status=' + status);
  }
  getByType(companycode: string, storeid: string, type, fromdate, todate, transId): Observable<TPurchaseOrderHeader[]> {
    if(transId === null || transId === undefined)
    {
      transId = "";
    }
    return this.http.get<TPurchaseOrderHeader[]>(this.baseUrl + 'purchase/GetByType?companyCode='+companycode+'&storeId=' +storeid+'&type=' +type +'&fromdate=' + fromdate+'&todate=' + todate+'&transId=' + transId);
  }
  // getNewOrderCode(StoreCode: string) {
  //   return this.http.get(
  //     this.baseUrl + 'sale/getNewOrderNum?StoreCode=' + StoreCode,
  //     { responseType: 'text' }
  //   );
  // }
  getNewOrderCode(companyCode: string, storeId: string) 
  { 
    return this.http.get(this.baseUrl + 'purchase/getNewNum?companyCode=' + companyCode + '&storeId=' + storeId,  { responseType: 'text' });
  }
  GetLastPricePO(companyCode, storeId, ItemCode, UomCode, Barcode) 
  { 
    return this.http.get(this.baseUrl + 'purchase/GetLastPricePO?companyCode=' + companyCode + '&storeId=' + storeId+ '&ItemCode=' + ItemCode+ '&UomCode=' + UomCode+ '&Barcode=' + Barcode,  { responseType: 'text' });
  }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<TPurchaseOrderHeader[]>> {
    const paginatedResult: PaginatedResult<TPurchaseOrderHeader[]> = new PaginatedResult<TPurchaseOrderHeader[]>();
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

    return this.http.get<TPurchaseOrderHeader[]>(this.baseUrl + 'purchase/GetPagedList', { observe: 'response', params})
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
  // mapOrder2Invoice(order: Order): TPurchaseOrderHeader
  // {
  //   if(order!==null && order!==undefined)
  //   {
      
  //     let invoice:TInvoiceHeader = new TInvoiceHeader();
  //     invoice.companyCode= order.companyCode;
  //     invoice.contractNo = '';
  //     invoice.amountChange= order.amountChange;
  //     invoice.cusId= order.cusId;
  //     invoice.customer= order.customer;
  //     invoice.cusIdentifier= order.cusIdentifier;
  //     invoice.discountAmount= order.discountAmount;
  //     invoice.discountRate= order.discountRate;
  //     invoice.discountType= order.discountType;
  //     invoice.isCanceled= order.isCanceled;
  //     invoice.manualDiscount= order.manualDiscount;
  //     invoice.paymentDiscount= order.paymentDiscount;
  //     invoice.refTransId= order.transId;
  //     invoice.remarks= order.remarks;
  //     invoice.salesMode= order.salesMode;
  //     invoice.salesPerson= order.salesPerson;
  //     invoice.shiftId= order.shiftId;
  //     invoice.status= order.status;
  //     invoice.storeId=order.storeId;
  //     invoice.storeName= order.storeName;
  //     invoice.totalAmount= order.totalAmount;
  //     invoice.totalDiscountAmt= order.totalDiscountAmt;
  //     invoice.totalPayable= order.totalPayable;
  //     invoice.totalReceipt= order.totalReceipt;
  //     invoice.totalTax= order.totalTax;
  //     invoice.transId= '';
     
  //     invoice.payments = order.payments;
  //     invoice.promoLines= order.promoLines;
  //     invoice.serialLines= order.serialLines;
  //     var newArray = [];
  //     order.lines.forEach(val => newArray.push(Object.assign({}, val)));
  //     newArray.forEach(line => {
        
  //         let invoiceline= new   TInvoiceLine();
  //         invoiceline.transId= line.transId;
  //         invoiceline.lineId= line.lineId;
  //         invoiceline.companyCode= line.companyCode;
  //         invoiceline.itemCode= line.itemCode;
  //         invoiceline.slocId= line.slocId;
  //         invoiceline.barCode= line.barCode;
  //         invoiceline.uomCode= line.uomCode;
          
  //         invoiceline.price= line.price;
  //         invoiceline.lineTotal= line.lineTotal;
  //         invoiceline.discountType= line.discountType;
  //         invoiceline.discountAmt= line.discountAmt;
  //         invoiceline.discountRate= line.discountRate;
  //         invoiceline.itemName =line.itemName;
  //         invoiceline.status= line.status;
  //         invoiceline.remark= line.remark;
  //         invoiceline.promoId= line.promoId;
  //         invoiceline.promoType= line.promoType;
  //         invoiceline.promoPercent= line.promoPercent;
  //         invoiceline.promoBaseItem= line.promoBaseItem;
  //         invoiceline.salesMode= line.salesMode;
  //         invoiceline.taxRate= line.taxRate;
  //         invoiceline.taxAmt= line.taxAmt;
  //         invoiceline.taxCode= line.taxCode;
  //         invoiceline.minDepositAmt= line.minDepositAmt;
  //         invoiceline.minDepositPercent= line.minDepositPercent;
  //         invoiceline.deliveryType= line.deliveryType;
  //         invoiceline.posservice= line.posservice;
  //         invoiceline.storeAreaId= line.storeAreaId;
  //         invoiceline.timeFrameId= line.timeFrameId;
  //         invoiceline.bomId= line.bomId;
  //         invoiceline.appointmentDate= line.appointmentDate; 
  //         invoiceline.promoPrice= line.promoPrice;
  //         invoiceline.promoLineTotal= line.promoLineTotal;
  //         debugger;
  //         // || (line.openQty===0 && line.quantity > 0)
  //         if(line.openQty===null || line.openQty=== undefined || line.openQty.toString() ==="" )
  //         {
  //           line.openQty= line.quantity;
  //         }
  //         // var numOfOpen= line.openQty;
  //         invoiceline.openQty= line.openQty;
  //         invoiceline.quantity= line.openQty;
  //         invoiceline.baseLine= parseInt(line.lineId) ;
  //         invoiceline.baseTransId= order.transId;
          
  //         invoice.lines.push(invoiceline);
       
  //     });
  //     // invoice.promoLines.forEach(line => {
  //     //   if(line.openQty===null || line.openQty=== undefined || line.openQty.toString() ==="" )
  //     //   {
  //     //     line.openQty= line.quantity;
  //     //   }
  //     //   invoiceline.openQty= line.openQty;
  //     //   invoiceline.quantity= line.openQty;
  //     // });
  //     return invoice;
  //   }
  //   else
  //   {
  //     return null;
  //   }
    
  // }
  getBill(id: string, companycode: string, storeid: string): Observable<TPurchaseOrderHeader> {
    return this.http.get<TPurchaseOrderHeader>(this.baseUrl + 'purchase/GetOrderById?Id=' + id + '&CompanyCode=' + companycode + '&StoreId='+ storeid);
  }
   
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'purchase/delete' + Id );
  }
  SavePO(invoice: TPurchaseOrderHeader)
  {
    // let headers = new Headers({ 'Content-Type': 'application/json' });
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json'
      })
   };
    return this.http.post(this.baseUrl + 'purchase/SavePO', JSON.stringify(invoice), httpOptions);
  }
  updateStatus(invoice: TPurchaseOrderHeader)
  {
    return this.http.post(this.baseUrl + 'purchase/UpdateStatus', invoice);
  }

}
