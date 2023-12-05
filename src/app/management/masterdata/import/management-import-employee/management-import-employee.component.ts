import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MCustomer } from 'src/app/_models/customer';
import { MEmployee } from 'src/app/_models/employee';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { EmployeeService } from 'src/app/_services/data/employee.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-import-employee',
  templateUrl: './management-import-employee.component.html',
  styleUrls: ['./management-import-employee.component.scss']
})
export class ManagementImportEmployeeComponent implements OnInit {

  
  value: any[] = [];
  importContent: MEmployee[] = [];
  isResult= false;
  constructor(private commonService: CommonService ,private employeeService: EmployeeService, private excelSrv: ExcelService, private alertifyService: AlertifyService, private route: ActivatedRoute, private router: Router) { }

  downloadTemplate()
  {
    this.commonService.download('M_Employee.xlsx');
  }

  ngOnInit() {
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
     
 
      const header: string[] = Object.getOwnPropertyNames(new MEmployee());
      
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
            
                if(ki.toLowerCase() === 'fromDate' || ki.toLowerCase() === 'toDate' || ki.toLowerCase() === 'fromdate' || ki.toLowerCase() === 'todate')
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
                  if(ki.toLowerCase() ===kj.toLowerCase())
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
                  // obj[header[j]] = arr[i].toString();
                }
              // obj[header[j]] = arr[i];
             }
          } 
        }
       

        return  <MEmployee>obj;
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
    let data= new DataImport();
    data.employee  = this.importContent;
    
    this.employeeService.import(data).subscribe((response: any)=>{
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
