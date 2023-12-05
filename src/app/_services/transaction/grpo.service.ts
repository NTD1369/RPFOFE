import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { TGoodsReceiptPoheader, TGoodsReceiptPoline } from 'src/app/_models/grpo';
import { PaginatedResult } from 'src/app/_models/pagination';
import { TPurchaseOrderHeader } from 'src/app/_models/purchase';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrpoService {


   // baseUrl = environment.apiUrl;
   baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { }
  
  bill: any = {};
  getAll(companycode: string, storeid: string, fromdate, todate,  key: string, status: string): Observable<TGoodsReceiptPoheader[]> {
    return this.http.get<TGoodsReceiptPoheader[]>(this.baseUrl + 'grpo/GetByType?companyCode='+companycode+'&storeId=' +storeid+'&fromdate=' + fromdate+'&todate=' + todate+'&key=' + key+'&status=' + status);
  }
  getByType(companycode: string, storeid: string, type, fromdate, todate): Observable<TGoodsReceiptPoheader[]> {
    return this.http.get<TGoodsReceiptPoheader[]>(this.baseUrl + 'grpo/GetByType?companyCode='+companycode+'&storeId=' +storeid+'&type=' +type +'&fromdate=' + fromdate+'&todate=' + todate);
  }
  // getNewOrderCode(StoreCode: string) {
  //   return this.http.get(
  //     this.baseUrl + 'sale/getNewOrderNum?StoreCode=' + StoreCode,
  //     { responseType: 'text' }
  //   );
  // }
  getNewOrderCode(companyCode: string, storeId: string) 
  { 
    return this.http.get(this.baseUrl + 'grpo/getNewNum?companyCode=' + companyCode + '&storeId=' + storeId,  { responseType: 'text' });
  }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<TGoodsReceiptPoheader[]>> {
    const paginatedResult: PaginatedResult<TGoodsReceiptPoheader[]> = new PaginatedResult<TGoodsReceiptPoheader[]>();
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

    return this.http.get<TGoodsReceiptPoheader[]>(this.baseUrl + 'grpo/GetPagedList', { observe: 'response', params})
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
  mapPO2GRPO(po: TPurchaseOrderHeader): TGoodsReceiptPoheader
  {
    if(po!==null && po!==undefined)
    {
      
      let grpo:TGoodsReceiptPoheader = new TGoodsReceiptPoheader();
      grpo.purchaseId= '';
      grpo.companyCode = po.companyCode;
      grpo.storeId= po.storeId;
      grpo.storeName= po.storeName;
      grpo.docStatus= 'O';
      grpo.docDate= po.docDate;
      grpo.docDueDate= po.docDueDate;
      grpo.cardCode= po.cardCode;
      grpo.cardName= po.cardName;
      grpo.taxCode= po.taxCode;
      grpo.vatPercent= po.vatpercent;
      grpo.vattotal= po.vattotal;
      grpo.docTotal=  po.docTotal;
      grpo.invoiceAddress = po.invoiceAddress;
      grpo.comment= po.comment;
      grpo.createdBy= '';
      grpo.status= 'O';
      grpo.refTransId= po.purchaseId;
      grpo.isCanceled= 'N';
      debugger;
      // grpo.serialLines= po.serialLines;
      var newArray = [];
      grpo.lines=[];
      po.lines.forEach(val => newArray.push(Object.assign({}, val)));
      newArray.forEach(line => {
        

         
          let invoiceline= new   TGoodsReceiptPoline();
          invoiceline.purchaseId="";
          invoiceline.lineId= "1";
          invoiceline.companyCode= line.companyCode;
          invoiceline.itemCode= line.itemCode;
          invoiceline.slocId= line.slocId;
          invoiceline.keyId= line.keyId;
          invoiceline.barCode= line.barCode;
          invoiceline.uomCode= line.uomCode; 
          invoiceline.price= line.price;
          invoiceline.lineTotal= line.lineTotal;
          invoiceline.comment= line.comment;
          invoiceline.description= line.description;
          invoiceline.discPercent= line.discPercent;
          invoiceline.comment= line.comment;
          invoiceline.comment= line.comment;
          invoiceline.status= "A";
          invoiceline.lineStatus= "A";
          invoiceline.vatPercent= line.vatpercent;
           

//           baseSAPId: null
// baseSAPLine: null
          invoiceline.baseLine= parseInt(line.lineId) ;
          invoiceline.baseTransId= line.purchaseId;
          debugger;
          // || (line.openQty===0 && line.quantity > 0)
          if(line.openQty===null || line.openQty=== undefined || line.openQty.toString() ==="" )
          {
            line.openQty= line.quantity;
          }
          // var numOfOpen= line.openQty;
          invoiceline.openQty= line.openQty;
          invoiceline.quantity= line.openQty;
          
          invoiceline.serialLines= [];
          var newSerialArray = [];
          // console.log(line.serialLine);
          if(line.serialLines!==null && line.serialLines!==undefined)
          {
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
          
          }
         
          
          grpo.lines.push(invoiceline);
       
      });
       
      return grpo;
    }
    else
    {
      return null;
    }
    
  }
  getBill(id: string, companycode: string, storeid: string): Observable<TGoodsReceiptPoheader> {
    return this.http.get<TGoodsReceiptPoheader>(this.baseUrl + 'grpo/GetOrderById?Id=' + id + '&CompanyCode=' + companycode + '&StoreId='+ storeid);
  }
   
  delete(companyCode: string, storeId: string, Id: string) {
    return this.http.delete(this.baseUrl + 'grpo/delete?companyCode=' + companyCode + '&storeId=' + storeId  + '&Id=' + Id );
  }
  create(invoice: TGoodsReceiptPoheader)
  {
    return this.http.post(this.baseUrl + 'grpo/CreateInvoice', invoice);
  }
  updateStatus(invoice: TGoodsReceiptPoheader)
  {
    return this.http.post(this.baseUrl + 'grpo/UpdateStatus', invoice);
  }


}
