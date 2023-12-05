import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TGoodsReceiptLineTemplate } from 'src/app/_models/goodreceipt';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { GoodreceiptService } from 'src/app/_services/transaction/goodreceipt.service';

@Component({
  selector: 'app-management-import-goods-receipt',
  templateUrl: './management-import-goods-receipt.component.html',
  styleUrls: ['./management-import-goods-receipt.component.css']
})
export class ManagementImportGoodsReceiptComponent implements OnInit {

  value: any[] = [];
  importContent: TGoodsReceiptLineTemplate[]=[];
  isResult= false;
  constructor(private authService: AuthService, private commonService: CommonService ,private goodreceiptService: GoodreceiptService, private excelSrv: ExcelService, private alertifyService: AlertifyService, 
    private route: ActivatedRoute, private router: Router) {

      this.customizeText= this.customizeText.bind(this);
     }

  downloadTemplate()
  {
    setTimeout(() => {
      this.commonService.download('T_GoodsReceiptLines.xlsx');
      }, 2);
    
    // this.dowloadLine();
   
  }
  // dowloadLine()
  // {
  //    setTimeout(() => {
  //     this.commonService.download('T_SO_Line.xlsx');
  //     }, 12);
   
  // }
  functionId="Adm_ImportGR";
  ngOnInit() {
    let check =  this.authService.checkRole(this.functionId , '', 'I' );
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
  }
  capitalizeFirstLetter(string) { 
    debugger;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  onRowPrepared(e) {  
    // console.log('onRowPrepared');
    // debugger;
    if (e.rowType == "data" && (e.data.lines===null || e.data.lines===undefined || e.data.lines.length===0 || e.data.lines==='undefined'))  {  
      // debugger;
      e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");  
      e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");  

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
      // debugger;
      const bstr: string = e.target.result;
      const dataHeader = <any[]>this.excelSrv.importFromFile(bstr, 0);
      
      const header: string[] = Object.getOwnPropertyNames(new TGoodsReceiptLineTemplate());
      
       debugger;
      // console.log(data);
      const excelHeader = dataHeader[0];
      const importedDataHeader = dataHeader.slice(1);//.slice(1, -2); 
      
      this.importContent = importedDataHeader.map(arr => {
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
               if(header[j].toLowerCase()==='barcode' || header[j].toLowerCase()==='itemcode' || header[j].toLowerCase()==='uomcode' || header[j].toLowerCase()==='lineid' || header[j].toLowerCase()==='linenum')
               {
                obj[header[j]] = arr[i].toString();
               }
               else
               {
                obj[header[j]] = arr[i];
               }
                
             }
          } 
        }
       

        return  <TGoodsReceiptLineTemplate>obj;
      })
      console.log(this.importContent);
    };
   

  }
   

  onImportData()
  {
    let data= new DataImport();
     data.goodsReceiptImport  = this.importContent;
     let store = this.authService.storeSelected();
     debugger;
     data.storeId = store.storeId;
     data.createdBy = this.authService.decodeToken?.unique_name ;
     data.companyCode = store.companyCode;
    this.goodreceiptService.import(data).subscribe((response: any)=>{
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
