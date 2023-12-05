import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MEmployee } from 'src/app/_models/employee';
import { MUom } from 'src/app/_models/muom';
import { MTax } from 'src/app/_models/tax';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { TaxService } from 'src/app/_services/data/tax.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-import-tax',
  templateUrl: './management-import-tax.component.html',
  styleUrls: ['./management-import-tax.component.scss']
})
export class ManagementImportTaxComponent implements OnInit {

  value: any[] = [];
  importContent: MTax[] = [];
  isResult= false;
  constructor(private commonService: CommonService ,private taxService: TaxService, private excelSrv: ExcelService, private alertifyService: AlertifyService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
  }
  downloadTemplate()
  {
    this.commonService.download('M_Tax.xlsx');
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
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
     
 
      const header: string[] = Object.getOwnPropertyNames(new MTax());
      
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
              // obj[header[j]] = arr[i].toString();
              if(arr[i]!==null && arr[i]!==undefined)
              {
                obj[header[j]] = arr[i].toString();
              }
              else
              {
                obj[header[j]] = null;
              }
             }
          } 
        }
       

        return  <MTax>obj;
      })
      console.log(this.importContent);
    };
   

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
  onImportData()
  {
    if(this.importContent===null || this.importContent===undefined  || this.importContent.length===0)
    {

    }
    else
    {
      let data= new DataImport();
      data.tax  = this.importContent;
      
      this.taxService.import(data).subscribe((response: any)=>{
        if(response.success===true)
        {
            if(response.data!==null && response.data !==undefined &&  response.data.length > 0)
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


}
