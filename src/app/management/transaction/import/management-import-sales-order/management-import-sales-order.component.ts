import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TSalesLine } from 'src/app/_models/tsaleline';
import { TSalesPayment } from 'src/app/_models/tsalepayment';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-import-sales-order',
  templateUrl: './management-import-sales-order.component.html',
  styleUrls: ['./management-import-sales-order.component.css']
})
export class ManagementImportSalesOrderComponent implements OnInit {
  
  value: any[] = [];
  importContent: Order[]=[];
  isResult= false;
  functionId="Adm_ImportSO";
  constructor(private authService: AuthService, private commonService: CommonService ,private orderService: BillService, private excelSrv: ExcelService, private alertifyService: AlertifyService, 
    private route: ActivatedRoute, private router: Router) {

      this.customizeText= this.customizeText.bind(this);
     }

  downloadTemplate()
  {
    setTimeout(() => {
      this.commonService.download('T_SO.xlsx');
      }, 2);
    
    // this.dowloadLine();
   
  }
  // dowloadLine()
  // {
  //    setTimeout(() => {
  //     this.commonService.download('T_SO_Line.xlsx');
  //     }, 12);
   
  // }
  ngOnInit() {
    let check =  this.authService.checkRole(this.functionId , '', 'I' );
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  onRowPrepared(e) {  
    
    if(e.data!==null && e.data!==undefined)
    { 
      if(e.data.lineId!==null && e.data.lineId!==undefined )
      {
        //&& (e.data.lines===null || e.data.lines===undefined || e.data.lines.length===0 || e.data.lines==='undefined'
        if (e.rowType === "data" && (!e.data.isSerial || (e.data.lines===null || e.data.lines===undefined)))  {  
          // debugger;
          e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");  
          e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");  
    
        }  
      }
      
    }
    
      
  }  
 
  customizeText (e) {
    
     if( e.value!==null &&  e.value!== undefined)
     {
       return this.authService.formatCurrentcy( e.value);

     }
     return 0;
  };
  onFileChange(evt: any) {
    // debugger;
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      debugger;
      const bstr: string = e.target.result;
      const dataHeader = <any[]>this.excelSrv.importFromFile(bstr, 0);
     
      const dataLine = <any[]>this.excelSrv.importFromFile(bstr, 1);

      const dataPayment = <any[]>this.excelSrv.importFromFile(bstr, 2);

      const header: string[] = Object.getOwnPropertyNames(new Order());
      const line: string[] = Object.getOwnPropertyNames(new TSalesLine());
      const payment: string[] = Object.getOwnPropertyNames(new TSalesPayment());
       debugger;
      // console.log(data);
      const excelHeader = dataHeader[0];
      const importedDataHeader = dataHeader.slice(1);//.slice(1, -2); 
      // sale Line

      const excelHeaderLine = dataLine[0];
      const importedDataLine = dataLine.slice(1);//.slice(1, -2); 
      // payment Line

      const excelHeaderPayment = dataPayment[0];
      const importedDataPayment = dataPayment.slice(1);//.slice(1, -2); 
      let headers = this.getHeaderList(importedDataHeader, excelHeader, header) ;
   
      
      let Lines = this.getLineList(importedDataLine, excelHeaderLine, line);

      let Payments = this.getPaymentList(importedDataPayment, excelHeaderPayment, payment);
      // importedDataLine.map(arr => {
      //   // debugger;
      //   const obj = {};
        
      //   for (let i = 0; i < excelHeaderLine.length; i++) { 
      //     for(let j = 0; j < line.length; j++)
      //     {
      //       const ki = this.capitalizeFirstLetter(excelHeaderLine[i]);
      //       const kj = this.capitalizeFirstLetter(line[j]); 
      //       // debugger;
      //        if(ki.toLowerCase() ===kj.toLowerCase())
      //        {
      //          obj[line[j]] = arr[i];
               
      //        }
      //     } 
      //   }
      //   return  <TSalesLine>obj;
      // })
      Lines.forEach(line => {
        if(line.transId!==null && line.transId!==undefined)
        {
          line.transId = line.transId.toString();
        }
        
      
    });
      headers.forEach(header => {
        if(header.transId!==null && header.transId!==undefined)
        {
          // if(header.isCanceled===null && header.isCanceled===undefined)
          // {
          //   header.isCanceled = false;
          // }
          header.transId = header.transId.toString();
          let lines = Lines.filter(x=>x.transId === header.transId);
          let payments = Payments.filter(x=>x.transId === header.transId);
          header.lines = lines;
          header.payments = payments;
        }
        
      });
      this.importContent = headers;
      // return this.importContent;
      console.log(this.importContent);
    };
   

  }
  getLineList(importedDataLine, excelHeaderLine, line)
  {
    let lines = [];
     importedDataLine.map(arr => {
      // debugger;
      const obj = {};
      
      for (let i = 0; i < excelHeaderLine.length; i++) { 
        for(let j = 0; j < line.length; j++)
        {
          const ki = this.capitalizeFirstLetter(excelHeaderLine[i]);
          const kj = this.capitalizeFirstLetter(line[j]); 
          // debugger;
          //  if(ki.toLowerCase() ===kj.toLowerCase())
          //  {
          //    obj[line[j]] = arr[i];
             
          //  }
           if(ki.toLowerCase() ===kj.toLowerCase())
           {
             debugger;
             let a =typeof line[j];
           
             if(line[j].toLowerCase()==="iscanceled")
             {
               if(arr[i]!==null || arr[i]!==undefined || arr[i]!=="undefined" || arr[i]!=="false" || arr[i].toString()!=="0")
               {
                 obj[line[j]] = false;
               }
               else{
                 obj[line[j]] = true;
               }
             }
             else
             {
               if(arr[i]!==null && arr[i]!==undefined && arr[i]!=="undefined")
               {
                 obj[line[j]] = arr[i].toString();
               }
               else{
                 obj[line[j]] = null;
               }
             }
           
           }
        } 
      }
      lines.push(<TSalesLine>obj) ;
    });
    return  lines;
  }

  getPaymentList(importedDataLine, excelHeaderLine, line)
  {
    let lines = [];
     importedDataLine.map(arr => {
      // debugger;
      const obj = {};
      
      for (let i = 0; i < excelHeaderLine.length; i++) { 
        for(let j = 0; j < line.length; j++)
        {
          const ki = this.capitalizeFirstLetter(excelHeaderLine[i]);
          const kj = this.capitalizeFirstLetter(line[j]); 
        
           if(ki.toLowerCase() ===kj.toLowerCase())
           {
             debugger;
             let a =typeof line[j];
           
             if(line[j].toLowerCase()==="iscanceled")
             {
               if(arr[i]!==null || arr[i]!==undefined || arr[i]!=="undefined" || arr[i]!=="false" || arr[i].toString()!=="0")
               {
                 obj[line[j]] = false;
               }
               else{
                 obj[line[j]] = true;
               }
             }
             else
             {
               if(arr[i]!==null && arr[i]!==undefined && arr[i]!=="undefined")
               {
                 obj[line[j]] = arr[i].toString();
               }
               else{
                 obj[line[j]] = null;
               }
             }
           
           }
        } 
      }
      lines.push(<TSalesPayment>obj) ;
    });
    return  lines;
  }

  getHeaderList(importedDataHeader, excelHeader,  header) 
  {
    let headers: Order[] = [];
    importedDataHeader.map(arr => {
      // debugger;
      const obj = {};
   
      for (let i = 0; i < excelHeader.length; i++) { 
        for(let j = 0; j < header.length; j++)
        {
          const ki = this.capitalizeFirstLetter(excelHeader[i]);
          const kj = this.capitalizeFirstLetter(header[j]); 
          // debugger;
          if(ki.toLowerCase() ===kj.toLowerCase())
          {
            debugger;
            let a =typeof header[j];
          
            if(header[j].toLowerCase()==="iscanceled")
            {
              if(arr[i]!==null || arr[i]!==undefined || arr[i]!=="undefined" || arr[i]!=="false" || arr[i].toString()!=="0")
              {
                obj[header[j]] = false;
              }
              else{
                obj[header[j]] = true;
              }
            }
            else
            {
              if(arr[i]!==null && arr[i]!==undefined && arr[i]!=="undefined")
              {
                obj[header[j]] = arr[i].toString();
              }
              else{
                obj[header[j]] = null;
              }
            }
          
          }
           
        } 
      } 
      headers.push(<Order>obj)
      //
    })
    return  headers;
  }


  onImportData()
  {
    let data= new DataImport();
     data.so  = this.importContent;
     let store = this.authService.storeSelected();
     debugger;
     data.storeId = store.storeId;
     data.createdBy = this.authService.decodeToken?.unique_name ;
     data.companyCode = store.companyCode;
    this.orderService.import(data).subscribe((response: any)=>{
      if(response.success===true)
      {
          if(response.data!==null && response.data !==undefined &&response.data.length > 0)
          {
            this.isResult=true;
            this.importContent= response.data;
          }
          this.alertifyService.success("Import completed succesfully.");
      }
      else
      {
        debugger;
        if(response.data!==null && response.data !==undefined &&  response.data.length > 0)
        {
          this.isResult=true;
          this.importContent= response.data;
        }
        this.alertifyService.warning("Import failed" + response.message);
      }
    });
  }

}
