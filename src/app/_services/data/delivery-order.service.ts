import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { TDeliveryHeader } from 'src/app/_models/deliveryOrder';
import { Order } from 'src/app/_models/viewmodel/order';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryOrderService {


   // baseUrl = environment.apiUrl;
   baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { }
  
  bill: any = {};
 
  getByType(companycode: string, storeid: string, fromdate, todate, TransId, DeliveryBy, key, status, ViewBy): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'deliveryorder/GetByType?companyCode='+companycode+'&storeId=' +storeid+'&fromdate=' + fromdate
    +'&todate=' + todate +'&TransId=' + TransId +'&DeliveryBy=' + DeliveryBy +'&key=' + key +'&status=' + status +'&ViewBy=' + ViewBy);
  }
  
  getNewOrderCode(companyCode: string, storeId: string) 
  { 
    return this.http.get(this.baseUrl + 'deliveryorder/getNewNum?companyCode=' + companyCode + '&storeId=' + storeId );
  }
  
  mapSO2DO(so) 
  {
    
    if(so!==null && so!==undefined)
    {
      let doX: any = Object.assign({}, so);
      doX.purchaseId= '';
      doX.docStatus= 'O';
      doX.status= 'O';
      
      doX.isCanceled= 'N';
      doX.refTransId = so.transId;
      doX.createdOn = null;
      // let do:any  = so;
      // do.purchaseId= '';
      // do.companyCode = po.companyCode;
      // do.storeId= po.storeId;
      // do.storeName= po.storeName;
      // do.docStatus= 'O';
      // do.docDate= po.docDate;
      // do.docDueDate= po.docDueDate;
      // do.cardCode= po.cardCode;
      // do.cardName= po.cardName;
      // do.taxCode= po.taxCode;
      // do.vatPercent= po.vatpercent;
      // do.vattotal= po.vattotal;
      // do.docTotal=  po.docTotal;
      // do.invoiceAddress = po.invoiceAddress;
      // do.comment= po.comment;
      // do.createdBy= '';
      // do.status= 'O';
      // do.refTransId= po.purchaseId;
      // do.isCanceled= 'N';
      // debugger;
      
      var newArray = [];
      doX.lines=[];
      so.lines.forEach(val => newArray.push(Object.assign({}, val)));
      newArray.forEach(line => {
        

         
          let invoiceline= line;// new   TGoodsReceiptPoline();
          // invoiceline.purchaseId="";
          // invoiceline.lineId= "1";
          // invoiceline.companyCode= line.companyCode;
          // invoiceline.itemCode= line.itemCode;
          // invoiceline.slocId= line.slocId;
          // invoiceline.keyId= line.keyId;
          // invoiceline.barCode= line.barCode;
          // invoiceline.uomCode= line.uomCode; 
          // invoiceline.price= line.price;
          // invoiceline.lineTotal= line.lineTotal;
          // invoiceline.comment= line.comment;
          // invoiceline.description= line.description;
          // invoiceline.discPercent= line.discPercent;
          // invoiceline.comment= line.comment;
          // invoiceline.comment= line.comment;
          // invoiceline.status= "A";
          // invoiceline.lineStatus= "A";
          // invoiceline.vatPercent= line.vatpercent; 
          invoiceline.baseLine= parseInt(line.lineId) ;
          invoiceline.baseTransId= so.transId;
          invoiceline.orgQty= line.quantity;
          debugger;
        
          // if(line.openQty===null || line.openQty=== undefined || line.openQty.toString() ==="" )
          // {
          //   line.openQty= line.quantity;
          // }
         
          // invoiceline.openQty= line.openQty;
          // invoiceline.quantity= line.openQty;
          
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
          doX.lines.push(invoiceline);
       
      });
      console.log('doX ', doX);
      return doX;
    }
    else
    {
      return null;
    }
    
  }
  getBill(id: string, companycode: string, storeid: string) {
    return this.http.get(this.baseUrl + 'deliveryorder/GetById?Id=' + id + '&CompanyCode=' + companycode + '&StoreId='+ storeid);
  }
   
  delete(companyCode: string, storeId: string, Id: string) {
    return this.http.delete(this.baseUrl + 'deliveryorder/delete?companyCode=' + companyCode + '&storeId=' + storeId  + '&Id=' + Id );
  }
  create(delivery: TDeliveryHeader)
  {
    return this.http.post(this.baseUrl + 'deliveryorder/Create', delivery);
  }
  update(delivery: TDeliveryHeader)
  {
    return this.http.post(this.baseUrl + 'deliveryorder/Update', delivery);
  }


}
