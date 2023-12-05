import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MBomheader } from 'src/app/_models/mbomheader';
import { MBomline } from 'src/app/_models/mbomline';
import { BOMDataImport, BOMViewModel } from 'src/app/_models/viewmodel/BOMViewModel';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { BomService } from 'src/app/_services/data/bom.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-import-bom',
  templateUrl: './management-import-bom.component.html',
  styleUrls: ['./management-import-bom.component.scss']
})
export class ManagementImportBomComponent implements OnInit {

  value: any[] = [];
  importContent: BOMViewModel[] = [];
  isResult= false;
  constructor(private commonService: CommonService ,private bomService: BomService, private excelSrv: ExcelService, private alertifyService: AlertifyService, private route: ActivatedRoute, private router: Router) { }

  downloadTemplate()
  {
    this.commonService.download('M_BOM.xlsx');
  }
  ngOnInit() {
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  onBomFileChange(evt: any) {
    // debugger;
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      // debugger;
      const bstr: string = e.target.result;
      const dataHeader = <any[]>this.excelSrv.importFromFile(bstr, 0);
      const dataLine = <any[]>this.excelSrv.importFromFile(bstr, 1);
      console.log(dataLine);
      const header: string[] = Object.getOwnPropertyNames(new MBomheader());
      const headerLine: string[] = Object.getOwnPropertyNames(new MBomline());
      
     
       debugger;
      // console.log(data);
      const excelHeader = dataHeader[0];
      const importedDataHeader = dataHeader.slice(1);//.slice(1, -2); 
      const excelLineHeader = dataLine[0];
      const importedDataLine = dataLine.slice(1);//.slice(1, -2); 
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
              obj[header[j]] = arr[i].toString();
             }
          } 
        }
        // debugger;
        let BOM:BOMViewModel= new BOMViewModel();
        let headerData = <BOMViewModel>obj;
        BOM= headerData;

        debugger;
        console.log(importedDataLine);
        const dataLines= importedDataLine.filter(x=>x.BOMId===BOM.itemCode);
        for(let i=0; i<importedDataLine.length ; i++ )
        {
          debugger;
          let value = importedDataLine[0][0];
          if(importedDataLine[0][0]===BOM.itemCode)
          {
            dataLines.push(importedDataLine[i]);
          }
          
        }
        debugger;
        const linesContent = dataLines.map(arrLine => {
          debugger
          const objLine = {};
          // for (let j = 0; j < headerLine.length; j++) {
          //   const kj = this.capitalizeFirstLetter(headerLine[j]);
          //   objLine[kj] = arrLine[j];
          // } 
          for (let i = 0; i < excelLineHeader.length; i++) { 
            for(let j = 0; j < headerLine.length; j++)
            {
              const ki = this.capitalizeFirstLetter(excelLineHeader[i]);
              const kj = this.capitalizeFirstLetter(headerLine[j]); 

              debugger;
               if(ki.toLowerCase() ===kj.toLowerCase())
               {
                objLine[headerLine[j]] = arrLine[i];
               }
            } 
          }
          return <MBomline>objLine;
        }) 
        debugger;
        // console.log(linesContent);
        BOM.lines= linesContent;
       
        console.log(BOM);

        return BOM;//<MBomheader>obj;
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
    let data= new BOMDataImport();
    data.data = this.importContent;
    
    this.bomService.importBOM(data).subscribe((response: any)=>{
      if(response.success===true)
      {
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
