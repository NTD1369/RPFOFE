import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

constructor() { }
  public importFromFile(bstr: string, sheetnum: number): XLSX.AOA2SheetOpts {
    /* read workbook */
    // debugger;
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

    /* grab first sheet */
    const wsname: string = wb.SheetNames[sheetnum];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* save data */
    const data = <XLSX.AOA2SheetOpts>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

    return data;
  }
fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
fileExtension = '.xlsx';
  public excelDateToJSDate(serial) {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
 
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
 
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
 }

  public exportToFile(fileName: string, element_id: string) {
    if (!element_id) throw new Error('Element Id does not exists');

    let tbl = document.getElementById(element_id);
    let wb = XLSX.utils.table_to_book(tbl);
    XLSX.writeFile(wb, fileName + '.xlsx');
  }
  public exportExcel(jsonData: any[], fileName: string,width:any[],serialData? :any[]): void {
    if(serialData !==null && serialData != null && serialData?.length>0 )
    {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
      const ws1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(serialData);
      const wb: XLSX.WorkBook = { Sheets: { 'data': ws ,'seri': ws1}, SheetNames: ['data','seri'] };
    
      ws['!cols']=width;
      ws1['!cols']= [{ width: 15 },{ width: 15 },{ width: 200 }];
      const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          this.saveExcelFile(excelBuffer, fileName);
    }
    else
    {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    
      const wb: XLSX.WorkBook = { Sheets: { 'data': ws}, SheetNames: ['data'] };
    
      ws['!cols']=width;
      const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          this.saveExcelFile(excelBuffer, fileName);
    }
    
  }
  
  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: this.fileType});
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }
}
