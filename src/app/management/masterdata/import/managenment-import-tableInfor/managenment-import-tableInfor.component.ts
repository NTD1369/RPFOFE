import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { MCustomer, MCustomerGroup } from 'src/app/_models/customer';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { AuthService } from 'src/app/_services/auth.service';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { TableinfoService } from 'src/app/_services/data/tableinfo.service';
import { MTableInforTemplate } from 'src/app/_models/tableinfo';

@Component({
  selector: 'app-managenment-import-tableInfor',
  templateUrl: './managenment-import-tableInfor.component.html',
  styleUrls: ['./managenment-import-tableInfor.component.scss']
})
export class ManagenmentImportTableInforComponent implements OnInit {

  constructor(private commonService: CommonService,private excelSrv: ExcelService,private authService: AuthService , private tableService: TableinfoService,private alertifyService: AlertifyService) { }
  importContent: MTableInforTemplate[] = [];
  isResult = false;
  ngOnInit() {
  }
  downloadTemplate()
  {
    this.commonService.download('M_Table.xlsx');
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  onFileChange(evt: any) {
    debugger;
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      // debugger;
      const bstr: string = e.target.result;
      const dataHeader = <any[]>this.excelSrv.importFromFile(bstr, 0);
     
 
      const header: string[] = Object.getOwnPropertyNames(new MTableInforTemplate());
      
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
               
              if(ki.toLowerCase() === 'dob' || ki.toLowerCase() === 'DOB' || ki.toLowerCase() === 'joineddate' || ki.toLowerCase() === 'joinedDate')
              {
                debugger;
                if(arr[i]!==undefined && arr[i]!==null && arr[i]!=='')
                {
                  let date = this.excelSrv.excelDateToJSDate(arr[i]);
                  obj[header[j]] = date;// new Date(arr[i] * 1000);;
                }
                // validFrom: Date | string | null=null;
                // validTo: Date | string | null=null;
                // validDateFrom: Date | string | null=null;
                // validDateTo: Date | string | null=null;
                // var date = new Date(arr[i] * 1000);
              
              }
              else
              {
                if(arr[i]!==null && arr[i]!==undefined)
                {
                  obj[header[j]] = arr[i].toString();
                }
                else
                {
                  obj[header[j]] = null;
                }
                
              }
              // obj[header[j]] = arr[i];
             }
          } 
        }
        return  <MTableInforTemplate>obj;
      })
      console.log("ccc", this.importContent);
    };
   

  }
  // onRowPrepared(e) {  
  //   // console.log('onRowPrepared');
  //   // debugger;
  //   if (e.rowType == "data" && (e.data.lines===null || e.data.lines===undefined || e.data.lines.length===0 || e.data.lines==='undefined'))  {  
  //     // debugger;
  //     e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");  
  //     e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");  

  //   }  
  // }  
  onImportData()
  {
   
    let data= new DataImport();
    data.tableInfor  = this.importContent;
    let store = this.authService.storeSelected();
      debugger;
    //  model.storeId = store.storeId;
    data.companyCode = store.companyCode;
    data.createdBy = this.authService.decodeToken?.unique_name ;
 
  
    this.tableService.import(data).subscribe((response: any)=>{
      debugger;
      if(response.success===true)
      {
        if(response.data!==null && response.data !==undefined &&  response.data.length > 0)
        {
          this.isResult=true;

          if(response.data.length > 0){
            response.data.forEach(el => {
              el.cusType = el.cusType === 'C' ? "Customer" : el.cusType;
              console.log("element.cusType 444", el.cusType)
            });
          }

          this.importContent= response.data;
          
        }
        this.alertifyService.success("Import completed succesfully.");
        window.location.reload();
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
