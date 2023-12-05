import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { TInvoiceHeader, TInvoiceLine } from 'src/app/_models/invoice';
import { PaginatedResult } from 'src/app/_models/pagination';
import { Order } from 'src/app/_models/viewmodel/order';
import { environment } from 'src/environments/environment';
import { InventorycoutingService } from './inventorycouting.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { }
  
  bill: any = {};
  getAll(companycode: string, storeid: string, fromdate, todate): Observable<TInvoiceHeader[]> {
    return this.http.get<TInvoiceHeader[]>(this.baseUrl + 'invoice/GetByType?companyCode='+companycode+'&storeId=' +storeid+'&type=&fromdate=' + fromdate+'&todate=' + todate);
  }
  getByType(companycode: string, storeid: string, type, fromdate, todate, top): Observable<TInvoiceHeader[]> {
    return this.http.get<TInvoiceHeader[]>(this.baseUrl + 'invoice/GetByType?companyCode='+companycode+'&storeId=' +storeid+'&type=' +type +'&fromdate=' + fromdate+'&todate=' + todate+'&top=' + top);
  }
  getEcomARList(companycode: string, storeid: string, type, fromdate, todate): Observable<TInvoiceHeader[]> {
    return this.http.get<TInvoiceHeader[]>(this.baseUrl + 'invoice/GetEcomARList?companyCode='+companycode+'&storeId=' +storeid+'&type=' +type +'&fromdate=' + fromdate+'&todate=' + todate);
  }
  // getNewOrderCode(StoreCode: string) {
  //   return this.http.get(
  //     this.baseUrl + 'sale/getNewOrderNum?StoreCode=' + StoreCode,
  //     { responseType: 'text' }
  //   );
  // }
  getNewOrderCode(companyCode: string, storeId: string) 
  { 
    return this.http.get(this.baseUrl + 'invoice/getNewNum?companyCode=' + companyCode + '&storeId=' + storeId,  { responseType: 'text' });
  }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<TInvoiceHeader[]>> {
    const paginatedResult: PaginatedResult<TInvoiceHeader[]> = new PaginatedResult<TInvoiceHeader[]>();
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

    return this.http.get<TInvoiceHeader[]>(this.baseUrl + 'invoice/GetPagedList', { observe: 'response', params})
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
  mapOrder2Invoice(order: Order): TInvoiceHeader
  {
    if(order!==null && order!==undefined)
    {
      
      let invoice:TInvoiceHeader = new TInvoiceHeader();
      invoice.companyCode= order.companyCode;
      invoice.contractNo = order.contractNo;
      invoice.dataSource = order.dataSource;
      invoice.amountChange= order.amountChange;
      invoice.cusId= order.cusId;
      invoice.customer= order.customer;
      invoice.cusIdentifier= order.cusIdentifier;
      invoice.discountAmount= order.discountAmount;
      invoice.discountRate= order.discountRate;
      invoice.discountType= order.discountType;
      invoice.isCanceled= order.isCanceled;
      invoice.manualDiscount= order.manualDiscount;
      invoice.paymentDiscount= order.paymentDiscount;
      invoice.refTransId= order.transId;
      invoice.remarks= order.remarks;
      invoice.salesMode= order.salesMode;
      invoice.salesPerson= order.salesPerson;
      invoice.shiftId= order.shiftId;
      invoice.status= order.status;
      invoice.storeId=order.storeId;
      invoice.storeName= order.storeName;
      invoice.totalAmount= order.totalAmount;
      invoice.totalDiscountAmt= order.totalDiscountAmt;
      invoice.totalPayable= order.totalPayable;
      invoice.totalReceipt= order.totalReceipt;
      invoice.totalTax= order.totalTax;
      invoice.transId= '';
      invoice.posType = order.posType;
      invoice.checkOutOn = order.checkOutOn;
      invoice.phone = order.phone;
      invoice.cusAddress = order.cusAddress;
      invoice.cusName = order.cusName;
      
      invoice.payments = order.payments;
      invoice.promoLines= order.promoLines;
      invoice.serialLines= order.serialLines;
      
      // debugger;
      var newArray = [];
      order.lines.forEach(val => newArray.push(Object.assign({}, val)));
      newArray.forEach(line => {
         
          if( line.itemType !=="Member" && line.itemType !=="Class" && line.itemType !=="Booklet" )
          {
            let invoiceline= new   TInvoiceLine();
            invoiceline.transId= line.transId;
            invoiceline.lineId= line.lineId;
            invoiceline.companyCode= line.companyCode;
            invoiceline.itemCode= line.itemCode;
            invoiceline.slocId= line.slocId;
            invoiceline.barCode= line.barCode;
            invoiceline.uomCode= line.uomCode;
            invoiceline.price= line.price;
            invoiceline.lineTotal= line.lineTotal;
            invoiceline.discountType= line.discountType;
            invoiceline.discountAmt= line.discountAmt;
            invoiceline.discountRate= line.discountRate;
            invoiceline.itemName =line.itemName;
            invoiceline.status= line.status;
            invoiceline.remark= line.remark;
            invoiceline.promoId= line.promoId;
            invoiceline.promoType= line.promoType;
            invoiceline.promoPercent= line.promoPercent;
            invoiceline.promoBaseItem= line.promoBaseItem;
            invoiceline.salesMode= line.salesMode;
            invoiceline.taxRate= line.taxRate;
            invoiceline.taxAmt= line.taxAmt;
            invoiceline.taxCode= line.taxCode;
            invoiceline.minDepositAmt= line.minDepositAmt;
            invoiceline.minDepositPercent= line.minDepositPercent;
            invoiceline.deliveryType= line.deliveryType;
            invoiceline.posservice= line.posservice;
            invoiceline.storeAreaId= line.storeAreaId;
            invoiceline.timeFrameId= line.timeFrameId;
            invoiceline.bomId= line.bomId;
            invoiceline.appointmentDate= line.appointmentDate; 
            invoiceline.promoPrice= line.promoPrice;
            invoiceline.promoLineTotal= line.promoLineTotal;
            invoiceline.quantity= line.quantity;
            invoiceline.oriQty = line.quantity;
            // invoiceline.ori= line.;
            debugger;
            // || (line.openQty===0 && line.quantity > 0)
            if(line.openQty===null || line.openQty=== undefined || line.openQty.toString() ==="" )
            {
              line.openQty= line.quantity;
            }
            // var numOfOpen= line.openQty;
            invoiceline.openQty= line.openQty; 
            invoiceline.checkOutQty = line.openQty;
            invoiceline.baseLine= parseInt(line.lineId) ;
            debugger;
            invoiceline.baseTransId= order.transId;
            invoiceline.promoDisAmt= line.promoDisAmt;
            invoiceline.isPromo= line.isPromo;
            invoiceline.isSerial= line.isSerial; 
  
  
            invoiceline.prepaidCardNo = line.prepaidCardNo;
            invoiceline.memberDate = line.memberDate;
            invoiceline.memberValue = line.memberValue;
            invoiceline.itemType = line.itemType;

           
            // invoiceline.startDate = line.startDate;
            invoiceline.serialLines= [];
            var newSerialArray = [];
            // console.log(line.serialLine);
           
            line.serialLines.forEach(val => newSerialArray.push(Object.assign({}, val)));
            newSerialArray.forEach(serialLine => {
              debugger;
                let newSerial = serialLine;
                if(serialLine.openQty===null || serialLine.openQty=== undefined || serialLine.openQty.toString() ==="" )
                {
                  newSerial.openQty= newSerial.quantity;
                }
                newSerial.baseLine= serialLine.lineNum;
                // var numOfOpen= line.openQty;
                newSerial.openQty= newSerial.openQty;
                newSerial.quantity= newSerial.openQty;
                invoiceline.serialLines.push(newSerial);
            });
             
            invoice.lines.push(invoiceline);
         
            line.lines.forEach(BOMline => {
              let invoicelineBOM= new   TInvoiceLine();
              invoicelineBOM.transId= BOMline.transId;
              invoicelineBOM.bomId= BOMline.bomId;
              invoicelineBOM.lineId= BOMline.lineId;
              invoicelineBOM.companyCode= BOMline.companyCode;
              invoicelineBOM.itemCode= BOMline.itemCode;
              invoicelineBOM.slocId= BOMline.slocId;
              invoicelineBOM.barCode= BOMline.barCode;
              invoicelineBOM.uomCode= BOMline.uomCode;
              invoicelineBOM.price= BOMline.price;
              invoicelineBOM.lineTotal= BOMline.lineTotal;
              invoicelineBOM.discountType= BOMline.discountType;
              invoicelineBOM.discountAmt= BOMline.discountAmt;
              invoicelineBOM.discountRate= BOMline.discountRate;
              invoicelineBOM.itemName =BOMline.itemName;
              invoicelineBOM.status= BOMline.status;
              invoicelineBOM.remark= BOMline.remark;
              invoicelineBOM.promoId= BOMline.promoId;
              invoicelineBOM.promoType= BOMline.promoType;
              invoicelineBOM.promoPercent= BOMline.promoPercent;
              invoicelineBOM.promoBaseItem= BOMline.promoBaseItem;
              invoicelineBOM.salesMode= BOMline.salesMode;
              invoicelineBOM.taxRate= BOMline.taxRate;
              invoicelineBOM.taxAmt= BOMline.taxAmt;
              invoicelineBOM.taxCode= BOMline.taxCode;
              invoicelineBOM.minDepositAmt= BOMline.minDepositAmt;
              invoicelineBOM.minDepositPercent= BOMline.minDepositPercent;
              invoicelineBOM.deliveryType= BOMline.deliveryType;
              invoicelineBOM.posservice= BOMline.posservice;
              invoicelineBOM.storeAreaId= BOMline.storeAreaId;
              invoicelineBOM.timeFrameId= BOMline.timeFrameId;
              invoicelineBOM.bomId= BOMline.bomId;
              invoicelineBOM.appointmentDate= BOMline.appointmentDate; 
              invoicelineBOM.promoPrice= BOMline.promoPrice;
              invoicelineBOM.promoLineTotal= BOMline.promoLineTotal;
              invoicelineBOM.oriQty= BOMline.quantity / line.quantity;
              invoicelineBOM.quantity = BOMline.quantity;
              // invoicelineBOM.oriQty = BOMline.quantity;
              // invoicelineBOM.ori= line.;
              debugger;
              // || (line.openQty===0 && line.quantity > 0)
              // if(line.openQty===null || line.openQty=== undefined || line.openQty.toString() ==="" )
              // {
              //   line.openQty= line.quantity;
              // }
              // var numOfOpen= line.openQty;
           
              invoicelineBOM.baseLine= parseInt(BOMline.lineId) ;
              debugger;
              invoicelineBOM.baseTransId= order.transId;
              invoicelineBOM.promoDisAmt= BOMline.promoDisAmt;
              invoicelineBOM.isPromo= BOMline.isPromo;
              invoicelineBOM.isSerial= BOMline.isSerial; 
    
    
              invoicelineBOM.prepaidCardNo = BOMline.prepaidCardNo;
              invoicelineBOM.memberDate = BOMline.memberDate;
              invoicelineBOM.memberValue = BOMline.memberValue;
              invoicelineBOM.itemType = BOMline.itemType;
 
              invoice.lines.push(invoicelineBOM);
            });
            
          }
         
       
      });



      

      // invoice.promoLines.forEach(line => {
      //   if(line.openQty===null || line.openQty=== undefined || line.openQty.toString() ==="" )
      //   {
      //     line.openQty= line.quantity;
      //   }
      //   invoiceline.openQty= line.openQty;
      //   invoiceline.quantity= line.openQty;
      // });
      return invoice;
    }
    else
    {
      return null;
    }
    
  }
  getCheckedPayment(TransId: string, EventId,  companycode: string, storeid: string): Observable<TInvoiceHeader> {
    return this.http.get<TInvoiceHeader>(this.baseUrl + 'invoice/GetCheckedPayment?TransId=' + TransId + '&EventId=' + EventId + '&CompanyCode=' + companycode + '&StoreId='+ storeid);
  }
  getCheckOutByEvent( EventId,  companycode: string, storeid: string): Observable<TInvoiceHeader> {
    // debugger;
    return this.http.get<TInvoiceHeader>(this.baseUrl + 'invoice/GetCheckOutByEvent?EventId=' + EventId + '&CompanyCode=' + companycode + '&StoreId='+ storeid);
  }
  getBill(id: string, companycode: string, storeid: string): Observable<TInvoiceHeader> {
    return this.http.get<TInvoiceHeader>(this.baseUrl + 'invoice/GetOrderById?Id=' + id + '&CompanyCode=' + companycode + '&StoreId='+ storeid);
  }
  

  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'invoice/delete' + Id );
  }
  
  create(invoice: TInvoiceHeader)
  {
   
    return this.http.post(this.baseUrl + 'invoice/CreateInvoice', invoice);
  }
  checkOrderOnHand(invoice: TInvoiceHeader)
  {
    return this.http.post(this.baseUrl + 'sale/CheckOrderOnHand', invoice);
  }
  saveImage(invoice: TInvoiceHeader)
  {
    return this.http.post(this.baseUrl + 'invoice/SaveImage', invoice);
  }
}
