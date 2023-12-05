import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MEmployee } from 'src/app/_models/employee';
import { Item } from 'src/app/_models/item';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-import-item',
  templateUrl: './management-import-item.component.html',
  styleUrls: ['./management-import-item.component.scss']
})
export class ManagementImportItemComponent implements OnInit {

  value: any[] = [];
  importContent: Item[] = [];
  isResult= false;
  constructor(private commonService: CommonService ,private itemService: ItemService, private excelSrv: ExcelService, private alertifyService: AlertifyService, private route: ActivatedRoute, private router: Router) { }
  downloadTemplate()
  {
    this.commonService.download('M_Item.xlsx');
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
     
 
      const header: string[] = Object.getOwnPropertyNames(new Item());
      
      //  debugger;
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
              debugger;
              let a =typeof header[j];
              if(header[j]==="defaultPrice")
              {
                obj[header[j]] = arr[i];
              }
              else
              {
                if(header[j].toLowerCase()==="isserial" || header[j].toLowerCase()==="isbom")
                {
                  if(arr[i]!==null || arr[i]!==undefined || arr[i]!=="undefined" || arr[i].toString()!=="0")
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
        }
       

        return  <Item>obj;
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
    try {
      let data= new DataImport();
      data.item = this.importContent;
      
      debugger;
       

      this.itemService.import(data).subscribe((response: any)=>{
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
