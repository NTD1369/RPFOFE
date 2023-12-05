import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MEmployee } from 'src/app/_models/employee';
import { Item } from 'src/app/_models/item';
import { MLicensePlate } from 'src/app/_models/LicensePlate';
import { LicensePlateHearderTemplate, LicensePlateLineTemplate } from 'src/app/_models/licensePlatemodel';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { LicensePlateService } from 'src/app/_services/data/LicensePlate.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-import-LicensePlate',
  templateUrl: './management-import-LicensePlate.component.html',
  styleUrls: ['./management-import-LicensePlate.component.scss']
})
export class ManagementImportLicensePlateComponent implements OnInit {

  value: any[] = [];
  importContent: LicensePlateHearderTemplate[] = [];
  isResult= false;
  constructor(private commonService: CommonService ,private LicensePlateService: LicensePlateService, private excelSrv: ExcelService, private alertifyService: AlertifyService, private route: ActivatedRoute, private router: Router) { }
  downloadTemplate()
  {
    this.commonService.download('M_LicensePlate.xlsx');
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
     
 
      const header: string[] = Object.getOwnPropertyNames(new LicensePlateHearderTemplate());
      
      //  debugger;
      // console.log(data);
      const excelHeader = dataHeader[0];
      const importedDataHeader = dataHeader.slice(1);//.slice(1, -2); 

      const dataHeaderSeri = <any[]>this.excelSrv.importFromFile(bstr, 1);
      const headerSeri: string[] = Object.getOwnPropertyNames(new LicensePlateLineTemplate());
      const excelHeaderSeri = dataHeaderSeri[0];
      const importedDataHeaderSeri = dataHeaderSeri.slice(1);
      console.log(importedDataHeaderSeri);
      console.log(excelHeaderSeri);
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
                
              if(ki.toLowerCase() === 'startdate' || ki.toLowerCase() === 'enddate')
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
       

        return  <LicensePlateHearderTemplate>obj;
      })
      this.importContent.forEach(item=>
        {
          let arr :any = [];
           importedDataHeaderSeri.forEach(x=>
            {
              if(x.find(y=>y ==item.contract) !==undefined && x.find(y=>y ==item.contract) !==null)
              {
                arr.push(x);
              }
            });
            console.log(arr,item.contract);
          item.lines= arr.map(arr => {

            const obj = {};
            for (let i = 0; i < excelHeaderSeri.length; i++) { 
              for(let j = 0; j < headerSeri.length; j++)
              {
                const ki = this.capitalizeFirstLetter(excelHeaderSeri[i]);
                const kj = this.capitalizeFirstLetter(headerSeri[j]); 
               
                if(ki.toLowerCase() ==="contract")
                {
                  if(kj.toLowerCase() ==="customf1")
                  {
                    debugger;
                    obj[headerSeri[j]] = arr[i].toString();
                  }
                }
                else
                 if(ki.toLowerCase() ===kj.toLowerCase())
                 {
                    
                  if(ki.toLowerCase() === 'startdate' || ki.toLowerCase() === 'enddate')
                  {
                    debugger;
                    if(arr[i]!==undefined && arr[i]!==null && arr[i]!=='')
                    {
                      let date = this.excelSrv.excelDateToJSDate(arr[i]);
                      obj[headerSeri[j]] = date;// new Date(arr[i] * 1000);;
                    }
                    // validFrom: Date | string | null=null;
                    // validTo: Date | string | null=null;
                    // validDateFrom: Date | string | null=null;
                    // validDateTo: Date | string | null=null;
                    // var date = new Date(arr[i] * 1000);
                  
                  }
                    else
                    {
                      if(arr[i]!==null && arr[i]!==undefined && arr[i]!=="undefined")
                      {
                        obj[headerSeri[j]] = arr[i].toString();
                      }
                      else{
                        obj[headerSeri[j]] = null;
                      }
                    }
                  
                  }
                 }
              
            }
           
    
            return  <LicensePlateLineTemplate>obj;
          })
          
           let stt =0;
        item.lines.forEach(x=>{
            x.lineId =stt.toString();
            stt+=1;
        });
        });
      
      // let stt =0;
      // this.importContent[0].lines.forEach(x=>{
      //     x.lineId =stt.toString();
      //     stt+=1;
      // });
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
    try {
      let data= new DataImport();
      data.licensePlateImport = this.importContent;
      
      debugger;
       

      this.LicensePlateService.import(data).subscribe((response: any)=>{
        if(response.success===true)
        {
          if(response.data!==null && response.data !==undefined &&  response.data.length > 0)
          {
            this.isResult=true;
            this.importContent= response.data;
          }
          let error = false;
          response.data.forEach(item=>{
            if(item.success == false)
            {
              error = true;
             
            }
          });
          if(error === false)
          {
            this.alertifyService.success("Import completed succesfully.");
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
         else
         {
          this.alertifyService.error("Import failed");
         }
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
    catch (error) {
      debugger;
      // console.error(error);
      let result = error.Message;
      this.alertifyService.error(error);
      // expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser
    }
  }
    

}
