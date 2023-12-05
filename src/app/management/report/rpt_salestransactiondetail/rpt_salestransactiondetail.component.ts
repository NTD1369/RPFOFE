import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
 
import { BsModalService } from 'ngx-bootstrap/modal';
import { IPermission } from 'src/app/shop/shop-another-source-bill/shop-another-source-bill.component';
import { RPT_SalesTransactionDetailModel } from 'src/app/_models/common/report';
import { AuthService } from 'src/app/_services/auth.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { StoreService } from 'src/app/_services/data/store.service';
import { TranslateService } from '@ngx-translate/core';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
 


import { DxDataGridComponent } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/_services/common/common.service';
@Component({
  selector: 'app-rpt_salestransactiondetail',
  templateUrl: './rpt_salestransactiondetail.component.html',
  styleUrls: ['./rpt_salestransactiondetail.component.scss']
})
export class Rpt_salestransactiondetailComponent implements OnInit {
  zoomLevels: string[] = [
    'year', 'decade', 'century',
  ];
  now: Date = new Date();
  isLoadingData= false;
  list: RPT_SalesTransactionDetailModel[]=[]; 
  isNew:boolean = false;
  storeOptions:any =[];
  title = "Sales Transaction Detail";
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
 
  constructor(private reportService: ReportService, private alertify: AlertifyService, private router: Router, public authService: AuthService,
    private commonService: CommonService,
    private controlService: ControlService, private modalService: BsModalService, private route: ActivatedRoute,private storeService: StoreService,
    public translate: TranslateService) { 
      this.customizeText= this.customizeText.bind(this);
      // this.onExporting= this.onExporting.bind(this);
    }
    chuyenTrangDashboard()
    {
      this.router.navigate(["/admin/report/dashboard-sales-transaction-detail"]);
    }
    customizeText (e) {
      // debugger;
       if( e.value!==null &&  e.value!== undefined)
       {
         return this.authService.formatCurrentcy( e.value);
  
       }
       return 0;
    };
    exportGrid() {
      const doc = new jsPDF();
      exportDataGridToPdf({
        jsPDFDocument: doc,
        component: this.dataGrid.instance,
      }).then(() => {
        doc.save('Customers.pdf');
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
  exportGridToPDF() {
    
    let infor = this.authService.getCurrentInfor(); 
    let headerStoreName = ''; 
    if(this.rpStoreId!==null && this.rpStoreId !==undefined && this.rpStoreId !== ''  && this.rpStoreId !== 'All')
    {
      headerStoreName = this.rpStoreId;//this.storeOptions.find(x=>x.storeId === this.rpStoreId).storeName; 
    }
    
    let headerBy = infor.username; 
    let headerDate = this.GetDateFormat(new Date()); 
    const pdfDoc = new jsPDF('p', 'pt', 'a0');
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
     
      // pdfDoc.addImage()
      // for (let i = 1; i <= pageCount; i++) {
      //     pdfDoc.setPage(i);
      //     const pageSize = pdfDoc.internal.pageSize;
      //     const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      //     const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
       

      //     // Footer
      //     pdfDoc.text(footer, pageWidth / 2 - (pdfDoc.getTextWidth(footer) / 2), pageHeight - 15, { baseline: 'bottom' });
      // }
    }).then(() => {
        let numOfExport = 200;
        let numOfRows = this.dataGrid.instance.totalCount()??0;
        if(numOfRows > 1000)
        {
          numOfExport = numOfExport * (numOfRows /1000);
        }
        setTimeout(() => {
          pdfDoc.save(this.rpTitle+'.pdf');
          
        }, numOfExport);
        // setTimeout(() => {
        
        //   this.dataGrid.instance.columnOption('print', 'visible', true); 
        // }, 20);
    });
  }

    onExporting(e) {
      const workbook = new Workbook();    
      const worksheet = workbook.addWorksheet('Main sheet');
      let nameOfRpt= 'SalesTransactionDetail' ;
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

        dateRow.getCell(1).value = "From" ;
        dateRow.getCell(2).value = this.rpRangeFr  ;
        dateRow.getCell(3).value = "To"  ;
        dateRow.getCell(4).value = this.rpRangeTo  ;
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
    fromDate: Date;
    toDate: Date;
    dateFormat ="";
    loadDashboard()
  {
    debugger;
    this.reportService.Get_Dash_SaleDetailTransactionByTop('CP001', '1001','2022-06-01','2022-06-14','Amount','', 10).subscribe((response: any) =>{
      debugger;
      if(response.success)
      {
        console.log(response.data);
      }
      else
      {
         console.log(response.message);
      }
    });
  }
    ngOnInit() {
      this.loadDashboard();
      this.loadStore();
      this.dateFormat = this.authService.loadFormat().dateFormat;
      
      let check =  this.authService.checkRole(this.functionId , '', 'V' );
      if(check === false)
      {
        this.router.navigate(["/admin/permission-denied"]);
      }
      else{
        var d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth(); 
        const nowDate = d.getDay();
        const lastDay =  new Date(year, month +1, 0).getDate();

      
        // this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;
        this.fromDate = new Date();
        this.toDate = new Date(year + '/' + (month + 1) + '/' + lastDay) ;
        // this.route
        // this.loadItems("","","admin","","");
        debugger;
        this.loadControl();
      }
    }
    controlList: any[];
    functionId = "RPT_SalesTransactionDetail";
    permissionDic: IPermission[]=[];
    checkPermission(controlId: string, permission: string): boolean
    { 
      // debugger;
      let result=false;
      let re= this.permissionDic.find(x=>x.controlId===controlId && x.permission===permission);
      if(re===null || re===undefined)
      {
        let rs= this.authService.checkRole(this.functionId , controlId, permission );
        let per=  new IPermission();
        per.controlId= controlId;
        per.permission = permission;
        per.result = rs; 
        this.permissionDic.push(per);
        result=true;
      }
      else
      {
        result=re.result;
      }
      
      return result;
    }
    loadControl()
    {
      this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any)=>{
        if(response.data.length > 0)
        {
        //  debugger;
         this.controlList= response.data.filter(x=>x.custom2!=='button' && x.controlType === 'GridColumn') ;
         this.controlList= this.controlList.sort(( a, b ) => a.orderNum > b.orderNum ? 1 : -1  );
         this.controlList.forEach(item=>{
           if(item.controlId.substring(0,3) === "sum")
           {
            item.sum =item.controlId.substring(3);
            item.isView =this.authService.checkRole(this.functionId , item.controlId, 'V' );
           }
         })
        //  this.buttonList = response.filter(x=>x.custom2==='button') ;
        //  
        //  this.buttonList= this.buttonList.sort(( a, b ) => a.orderNum > b.orderNum ? 1 : -1  )
        //  console.log(this.controlList);
        
       
       
        }
       });
    }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  pdfModel: any;
  @ViewChild('contentPDF') contentPDF: ElementRef;
  rpStoreId ="";
  rpRangeFr ="";
  rpRangeTo ="";
  rpTitle ="";
  exportToPDF()
  { 
    if(this.list!==undefined && this.list!==null && this.list?.length > 0)
    {
    
      this.pdfModel = {};
      this.pdfModel.lines = [];
      this.pdfModel.lines =  this.list;
      this.pdfModel.storeId = this.rpStoreId ;
      this.pdfModel.title = this.rpTitle;
      this.pdfModel.dateFr = this.rpRangeFr;
      this.pdfModel.dateTo = this.rpRangeTo;
      this.pdfModel.printBy = this.authService.getCurrentInfor().username; 
      this.pdfModel.printDate = new Date();
      let storeClient = this.authService.getStoreClient();
      if(storeClient!==null && storeClient!==undefined)
      {
        this.pdfModel.terminalId = this.authService.getStoreClient().publicIP;
      }
      else
      {
        this.pdfModel.terminalId = this.authService.getLocalIP();
      } 
      // this.pdfModel.terminalId = "";
      setTimeout(() => {
        let data = this.contentPDF.nativeElement;
        this.commonService.exportHtmlToPDF(this.rpTitle +'_'+ this.rpRangeFr +'_'+ this.rpRangeTo +'_'+ this.pdfModel.printBy, data, 200);
        this.pdfModel = null;
      }, 5);
    }
    else
    {
      Swal.fire({
        icon: 'warning',
        title:'Export PDF Report',
        text:  'Data is null'
      });
    }

  
    //  let data = PDFHtml.elementRef.nativeElement.innerHTML;



    // setTimeout(() => {
    //   this.pdfModel = null
    // }, 20);

  }
  viewReport(from, to,store)
  {
    this.loadItems(this.authService.storeSelected().companyCode,store.value, this.authService.getCurrentInfor().username,from, to);
  }

  loadItems(companycode, store, user, from, to) {
    debugger;
    let fromvl= null;  let tovl= null;
    if(from===null||from===undefined)
    {
      from=null;
    }
    if(to===null||to===undefined)
    {
      to=null;
    }
    if(from!=null)
    {
      fromvl=this.GetDateFormat(from);
    }
    if(to!=null)
    {
      tovl= this.GetDateFormat(to);
    }
     
    this.isLoadingData = true;
    this.rpStoreId = this.storeOptions.find(x=>x.value === store)?.name??"";
    if(this.rpStoreId === 'All')
    {
      this.rpStoreId = "All Store";
    }
    this.rpRangeFr = fromvl; 
    this.rpRangeTo = tovl; 
    this.rpTitle = "Sales Transaction Details";
    if(this.rpTitle?.length > 0)
    {
      let spl= this.rpTitle.split('-');
      if(spl?.length > 1)
      {
        this.rpTitle = spl[1];
      }
    }
    this.rpTitle += " Report(" + this.rpRangeFr + " ~ " + this.rpRangeTo + ")";
    this.reportService.get_RPT_SalesTransactionDetail(companycode, store, user, fromvl, tovl).subscribe((res:any) => {
      // loadItems
      // debugger;
      this.isLoadingData = false;
      if(res.success)
      {
        this.list = res.data;
      }
      else
      {
        this.alertify.error(res.message);
      }
       
    }, error => {
      this.isLoadingData = false;
      this.alertify.error(error);
    });
  }
  loadStore(){
    debugger;
    this.storeService.getByUserWithStatus(this.authService.decodeToken?.unique_name).subscribe((response: any) => {
     // debugger;
      if(response.success)
      {
       response.data.forEach(item => {
        //  let data = {name:item.storeName,value:item.storeId}
         let data = {
          // name: item.status === 'I' ? item.storeName + " (Inactive)" : item.storeName, 
          name: item.status === 'I' ? item.storeId + ' - ' + item.storeName + " (Inactive)" : item.storeId + ' - ' + item.storeName, 
          value:item.storeId
       }
         this.storeOptions.push(data);
       });;
       this.storeOptions.unshift({name:'All',value:''});
      } 
      else
      {
        this.alertify.warning(response.message);
      }
     
      // this.storeList = response;
      // console.log(this.storeList);
    });
}
downloadExcel(from, to,store)
{
  this.exportExcel(this.authService.storeSelected().companyCode,store.value, this.authService.getCurrentInfor().username,from, to);
}
exportExcel(companycode, store, user, from, to){
let header:any= [];
this.controlList.forEach(item=>{
  // debugger
  if(this.authService.checkRole(this.functionId , item.controlId, 'V' ))
  {
    let control:any = {};
    control.key = this.capitalizeFirstLetter(item.controlId);
    control.name = this.translate.instant(item.controlName);
    header.push(control);
  }
  });
  debugger;
  let fromvl= null;  let tovl= null;
  if(from===null||from===undefined)
  {
    from=null;
  }
  if(to===null||to===undefined)
  {
    to=null;
  }
  if(from!=null)
  {
    fromvl=this.GetDateFormat(from);
  }
  if(to!=null)
  {
    tovl= this.GetDateFormat(to);
  }
  let nameOfRpt= 'SalesTransactionDetail' ;
  var d = new Date();
  let dateFm = this.GetDateFormat(d);

  nameOfRpt = nameOfRpt + '_' + dateFm.replace(/\-/gi,'') + '_' + this.authService.getCurrentInfor().username;
  this.isLoadingData = true;

  this.reportService.export_RPT_SalesTransactionDetail(companycode, store, user, fromvl, tovl,header).subscribe((res:any) => {
    // loadItems
    // debugger;
    this.isLoadingData = false;
    const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = nameOfRpt + '.xlsx';
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
     
  }, error => {
    this.isLoadingData = false;
    this.alertify.error(error);
  });
}
capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
}
 

