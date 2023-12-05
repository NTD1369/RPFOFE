import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { info } from 'console';
import { DxDataGridComponent, DxTextBoxComponent } from 'devextreme-angular';
import { AuthService } from 'src/app/_services/auth.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { Router } from '@angular/router';


@Component({
  selector: 'app-collection-daily-by-counter',
  templateUrl: './collection-daily-by-counter.component.html',
  styleUrls: ['./collection-daily-by-counter.component.css']
})
export class CollectionDailyByCounterComponent implements OnInit {

  constructor(public reportService: ReportService, private storeService: StoreService, public authService: AuthService, private router: Router)
  { }
  listData: any[] = [];
  listHeader: HeaderModel[] = [];
  title= "Collection Daily By Counter";
  isLoadingData = false;
  Date = new Date();
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  filter = false;
  filterNeedDivision()
  {
    if (this.filter  !== null && this.filter !== undefined && this.filter !== true) {
      this.dataGrid.instance.clearFilter();
      
    } else {
        this.dataGrid.instance.filter(["total", "<", 'onHand']);
    }
    this.filter = !this.filter;
  }
  listHeaderShow = [];
  dateFormat="";
  storeOptions: any = [];
  loadStore() {
    this.storeService.getByUserWithStatus(this.authService.decodeToken?.unique_name).subscribe((response: any) => {
      // debugger;
      if (response.success) {
        response.data.forEach(item => {
          // let data = { name: item.storeName, value: item.storeId }
          let data = {
            name: item.status === 'I' ? item.storeId + ' - ' + item.storeName + " (Inactive)" : item.storeId + ' - ' + item.storeName, 
            value:item.storeId
         }
          console.log("item", item);
          this.storeOptions.push(data);
        });;
        this.storeOptions.unshift({ name: 'All', value: '' });
      }
      else {
        Swal.fire('Store Data',response.message,'warning');
      }
    });
  }
  onToolbarPreparing(e) {
    // if(this.authService.checkRole(this.functionId , '', 'I'))
    // {
      e.toolbarOptions.items.unshift( 
        
          {
            location: 'before',
            template: 'exportoPDF'
          }, 
     
      
      
        );
      
  } 
  onExporting(e) {
    const workbook = new Workbook();    
    const worksheet = workbook.addWorksheet('Main sheet');
    let nameOfRpt= 'Collection Daily By Counter' ;
    var d = new Date();
    let dateFm = this.GetDateFormat(d);
  
    nameOfRpt = nameOfRpt + '_' + dateFm.replace(/\-/gi,'') + '_' + this.authService.getCurrentInfor().username;
    exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        topLeftCell: { row: 7, column: 1 },
        customizeCell: function(options) {
          debugger;
            // const excelCell = options;
            const { gridCell, excelCell } = options;

            if(gridCell.rowType === 'data') {
              // debugger;
              //   excelCell.font = { color: { argb: 'FF0000FF' }, underline: true };
              //   excelCell.alignment = { horizontal: 'left' };
            }
        } 
    }).then((cellRange) => {
      // header
      const headerRow = worksheet.getRow(2);
      headerRow.height = 30;
      let columnCount = this.dataGrid.instance.columnCount();
      let colCount = 0;
      for (let index = 0; index < columnCount; index++) {
        if( this.dataGrid.instance.columnOption(index, "visible")) {  
          colCount ++;
        }  
        
      }
     
      worksheet.mergeCells(2, 1, 2, colCount);

      headerRow.getCell(1).value = this.title;// 'Sales Transaction Detail';
      headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 17, bold: true };
      headerRow.getCell(1).alignment = { horizontal: 'left' };
      const dateRow = worksheet.getRow(4);
      const storeRow = worksheet.getRow(3);
      let headerStoreName = ''; 
      if(this.rpStoreId!==null && this.rpStoreId !==undefined && this.rpStoreId !== ''  && this.rpStoreId !== 'All')
      {
        headerStoreName = this.rpStoreId;//this.storeOptions.find(x=>x.storeId === this.rpStoreId).storeName; 
      }
      // + "("+ this.rpRangeFr + + this.rpRangeTo+")"
      storeRow.getCell(1).value = "Store" ;
      storeRow.getCell(2).value = headerStoreName ;
      storeRow.getCell(1).font = { name: 'Segoe UI Light', size: 13 };
      storeRow.getCell(1).alignment = { horizontal: 'left' };

      dateRow.getCell(1).value = "Date" ;
      dateRow.getCell(2).value = dateFm;// this.rpRangeFr  ;
      // dateRow.getCell(3).value = "To"  ;
      // dateRow.getCell(4).value = this.rpRangeTo  ;
      dateRow.getCell(1).font = { name: 'Segoe UI Light', size: 13 };
      dateRow.getCell(1).alignment = { horizontal: 'left' };
      // // footer
      // const footerRowIndex = cellRange.to.row + 2;
      // const footerRow = worksheet.getRow(footerRowIndex);
      // worksheet.mergeCells(footerRowIndex, 1, footerRowIndex, 8);

      // footerRow.getCell(1).value = 'www.wikipedia.org';
      // footerRow.getCell(1).font = { color: { argb: 'BFBFBF' }, italic: true };
      // footerRow.getCell(1).alignment = { horizontal: 'right' };
    })
    .then(function() {
        workbook.xlsx.writeBuffer()
            .then(function(buffer: BlobPart) {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), nameOfRpt + '.xlsx');
            });
    });
    e.cancel = true; 
  }
  pdfModel: any;
  @ViewChild('contentPDF') contentPDF: ElementRef;
  rpStoreId ="";
  rpRangeFr ="";
  // rpRangeTo ="";
  rpTitle ="";
  exportPDF = false;
  
  // exportToPDF()
  // { 
  //   if(this.listData!==undefined && this.listData!==null && this.listData?.length > 0)
  //   {
  //     this.exportPDF = true;
  //     this.pdfModel = {};
  //     this.pdfModel.lines = [];
  //     this.pdfModel.lines =  this.listData;
  //     this.pdfModel.storeId = this.rpStoreId ;
  //     this.pdfModel.title = this.rpTitle;
  //     this.pdfModel.dateFr = this.rpRangeFr;
  //     this.pdfModel.dateTo = this.rpRangeTo;
  //     this.pdfModel.printBy = this.authService.getCurrentInfor().username; 
  //     this.pdfModel.printDate = new Date();
  //     let storeClient = this.authService.getStoreClient();
  //     if(storeClient!==null && storeClient!==undefined)
  //     {
  //       this.pdfModel.terminalId = this.authService.getStoreClient().publicIP;
  //     }
  //     else
  //     {
  //       this.pdfModel.terminalId = this.authService.getLocalIP();
  //     } 
  //     // this.pdfModel.terminalId = "";
  //     let numOfExport = 200;
  //     let numOfRows = this.listData?.length??0;
  //     if(numOfRows > 1000)
  //     {
  //       numOfExport = numOfExport * (numOfRows /1000);
  //     }
        
  //     setTimeout(() => {
  //       // let data = this.contentPDF.nativeElement;
  
  //       // this.commonService.exportHtmlToPDF(this.rpTitle +'_'+ this.rpRangeFr +'_'+ this.rpRangeTo +'_'+ this.pdfModel.printBy, data, 21, 'a4', 'cm');
        
  //       this.pdfModel = null;
  //       this.exportPDF = false;
  //     }, numOfExport);
  //   }
  //   else
  //   {
  //     Swal.fire({
  //       icon: 'warning',
  //       title:'Export PDF Report',
  //       text:  'Data is null'
  //     });
  //   }

   
  //   //  let data = PDFHtml.elementRef.nativeElement.innerHTML;
  

 
  //   // setTimeout(() => {
  //   //   this.pdfModel = null
  //   // }, 20);

  // }

  async exportGridToPDF() {
    this.rpTitle = "Collection Daily By Counter";
    let infor = this.authService.getCurrentInfor(); 
    let headerStoreName = ''; 
    if(this.rpStoreId!==null && this.rpStoreId !==undefined && this.rpStoreId !== ''  && this.rpStoreId !== 'All')
    {
      headerStoreName = this.rpStoreId;//this.storeOptions.find(x=>x.storeId === this.rpStoreId).storeName; 
    }
    
    let headerBy = infor.username; 
    let headerDate = this.GetDateFormat(new Date()); 
    const pdfDoc = new jsPDF('p', 'pt', 'a1');
    pdfDoc.setFontSize(12); 
    const pageCount = 1;// pdfDoc.internal.getNumberOfPages(); 
    // Header
    // pdfDoc.text("Store Id: " + headerStore, 40, 15, { baseline: 'top' });
    pdfDoc.text(this.rpTitle, 40, 15, { baseline: 'top' });
    pdfDoc.setFontSize(9);
    if(headerStoreName?.length > 0)
    { 
      pdfDoc.text("Store: " + headerStoreName, 40, 34, { baseline: 'top' });
      pdfDoc.text("Print By: " + headerBy, 40, 50, { baseline: 'top' });
      pdfDoc.text("Print Date: " + headerDate, 40, 66, { baseline: 'top' });
    }
    else
    {
      pdfDoc.text("Print By: " + headerBy, 40, 34, { baseline: 'top' });
      pdfDoc.text("Print Date: " +headerDate, 40, 50, { baseline: 'top' });
    }
   
    const options = {
        jsPDFDocument: pdfDoc,
        component: this.dataGrid.instance,
        autoTableOptions: {
          startY: 85
          // margin: { top: 85 }, 
      }
    };
    // let TitleRpt= "Sales Transaction Detail (" +  +")";
    exportDataGridToPdf(options).then(() => {
      
    }).then(() => {
        let numOfExport = 200;
        let numOfRows = this.dataGrid.instance.totalCount()??0;
        if(numOfRows > 1000)
        {
          numOfExport = numOfExport * (numOfRows /1000);
        }
        setTimeout(() => {
          pdfDoc.save(this.rpTitle + headerDate +'.pdf');
          
        }, numOfExport);
        // setTimeout(() => {
        
        //   this.dataGrid.instance.columnOption('print', 'visible', true); 
        // }, 20);
    });
  }

  loadData(storeId)
  {
    this.isLoadingData = true;
    let date = this.GetDateFormat(this.Date);
    let infor = this.authService.getCurrentInfor() ;
    this.listData = [];
    this.listHeaderShow = []; 
    
    this.rpStoreId = this.storeOptions.find(x=>x.value === storeId)?.name??"";
    if(this.rpStoreId === 'All')
    {
      this.rpStoreId = "All Store";
    }
    this.reportService.Get_RPT_CollectionDailyByCounter(infor.companyCode, storeId, infor.username, date).subscribe((response: any)=>{
      if(response.success)
      {
        this.isLoadingData = false;
        let rsData = response.data;
        debugger;
          this.listData = rsData?.data;
          this.listHeader = rsData?.header;
          
          if(this.listData!==null && this.listData!==undefined && this.listData?.length > 0)
          {
            this.listHeader.forEach((element: any) => {
              // let result = element.Id.includes("Division");
              // if(result===false)
              // {
                
                
              // } 
              this.listHeaderShow.push(element);
            });
            console.log('listHeaderShow', this.listHeaderShow);
            this.listHeader.forEach((element: any) => {
              if( element.IsAutoColumn === '1' || element.IsAutoColumn === 1)
              {
                element.IsAutoColumn = true;
              } ;
            });
            let headerAuto = this.listHeader.filter(x=>x.IsAutoColumn === true  );
           
            // this.listData.forEach(lineData => {
            //   headerAuto.forEach(header => {
            //     let result = header.Code.includes("Division");
            //     if(result===false)
            //     {
            //       let number =  lineData[header.Code];
                   
            //       lineData[header.Code+'Division'] =number;
                  
            //       let onHand = lineData.OnHand??0;
            //       let totalSo = lineData.Total??0;
            //       if(onHand < totalSo)
            //       {
            //         lineData[header.Code]= 0;
            //         lineData[header.Code+'Flag'] = false ;
            //       }
            //     }
                
            //   });
             
            // });
 
            console.log('this.listData', this.listData);
          }
         

      } 
      else
      {
        this.isLoadingData = false;
        Swal.fire({
              icon: 'warning',
              title: 'Report Collection',
              text: response.message
            });
      }
    }, error =>{
      this.isLoadingData = false;
      Swal.fire({
        icon: 'error',
        title: 'Report Collection',
        text: "Failed to load report"
      });
    })
  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  ngOnInit() {
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    let date = this.GetDateFormat(this.Date);
    this.loadStore()
    // this.loadData();
  }
  groupCus =[]; 

  functionId = "RPT_CollectionDailyByCounter";
}

export class HeaderModel
{
  ControlType: string ='';
  GroupNum: number | null = null;
  Code: string ='';
  IsAutoColumn: boolean | null = null;
  OrderNum: number | null = null;
  Title: string =''; 
    
}

 