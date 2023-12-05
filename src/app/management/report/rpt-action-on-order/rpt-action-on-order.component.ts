import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IPermission } from 'src/app/shop/shop-another-source-bill/shop-another-source-bill.component';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import saveAs from 'file-saver';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { DxDataGridComponent } from 'devextreme-angular';
@Component({
  selector: 'app-rpt-action-on-order',
  templateUrl: './rpt-action-on-order.component.html',
  styleUrls: ['./rpt-action-on-order.component.scss']
})
export class RptActionOnOrderComponent implements OnInit {

 
  isLoadingData = false;
  list: any[]=[];  
  isNew:boolean = false;
  constructor(private reportService: ReportService, private alertify: AlertifyService, private router: Router,public authService: AuthService,
    private controlService: ControlService, private modalService: BsModalService, private commonService: CommonService, public datepipe: DatePipe, private route: ActivatedRoute, 
    private storeService: StoreService) {
      this.customizeText= this.customizeText.bind(this);
     }
  customizeText (e) {
    // debugger;
      if( e.value!==null &&  e.value!== undefined)
      {
        return this.authService.formatCurrentcy( e.value);

      }
      return 0;
  };
  fromDate: any;
  toDate: any;
  dateFormat="";
  storeOptions: any = [];
  typeOptions = [
    {
      value: "", name: "-- All --",
    },
    {
      value: "Order", name: "Order",
    } 
  ];

  loadActionType()
  {
    let store = this.authService.storeSelected();
    let stringQuery= "select * from S_POSOption with (nolock) where Type = 'ActivityType' and Status = 'A'";
    this.commonService.getQuery(store.companyCode, '', '', stringQuery).subscribe((response: any) =>{
      if(response.success)
      {
         if(response?.data?.length > 0)
         {
            this.typeOptions=[];
            this.typeOptions.push( {
              value: "", name: "-- All --",
            });

            response?.data.forEach(line => {
              this.typeOptions.push( {
                value: line.Code , name: line.Code + " - " + line.Name,
              });
              
            });
         }
         
      }
      else
      {
        this.alertify.warning(response.message);
      }
      this.initData = true;
    })
    

    return this.typeOptions;
  }

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
        this.alertify.warning(response.message);
      }
      this.loadActionType();
    });
  }
  initData = false;
  ngOnInit() {
    this.dateFormat = this.authService.loadFormat().dateFormat;
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    else{
      // let now = new Date();
      // let from = now.setDate(now.getDate() - 0);
  
  
      // this.fromDate = this.datepipe.transform(from, 'yyyy-MM-dd');
      // this.toDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

     

      
      var d = new Date();
      const year = d.getFullYear();
      const month = d.getMonth(); 
      const currentDate = d.getDate();
      const lastDay =  new Date(year, month +1, 0).getDate();

      // this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;
      this.toDate = new Date(year + '/' + (month + 1) + '/' + currentDate) ;
      this.fromDate = new Date(year + '/' + (month + 1) + '/' + currentDate) ;
      this.loadControl();
      // this.loadStore();

     
    }
  }
  onExporting(e) {
    const workbook = new Workbook();    
    const worksheet = workbook.addWorksheet('Main sheet');
    let nameOfRpt= this.functionId ;
    var d = new Date();
    let dateFm = this.GetDateFormat(d);
    
    nameOfRpt = nameOfRpt + '_' + dateFm.replace(/\-/gi,'') + '_' + this.authService.getCurrentInfor().username;
    exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        // customizeCell: function(options) {
        //     const excelCell = options;
        //     excelCell.font = { name: 'Arial', size: 12 };
        //     excelCell.alignment = { horizontal: 'left' };
        // } 
    }).then(function() {
        workbook.xlsx.writeBuffer()
            .then(function(buffer: BlobPart) {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), nameOfRpt + '.xlsx');
            });
    });
    e.cancel = true; 
  }
  showToPDF = false;
  pdfModel: any;
  controlList: any[];
  functionId = "RPT_ActionOnOrder";
  permissionDic: IPermission[]=[];
  @ViewChild('contentPDF') contentPDF: ElementRef;
  rpStoreId ="";
  rpRangeFr ="";
  rpRangeTo ="";
  rpTitle ="";
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  exportGridToPDF() {
    // this.dataGrid.instance.columnOption('print', 'visible', false); 
    const doc = new jsPDF();
    debugger;
    
    // exportDataGridToPdf({
    //   jsPDFDocument: doc,
    //   component: this.dataGrid.instance,
    // }).then(() => {

       
    //   doc.save('PickupAmount.pdf');
    //   setTimeout(() => {
        
    //     this.dataGrid.instance.columnOption('print', 'visible', true); 
    //   }, 20);
     
    // });

    let infor = this.authService.getCurrentInfor();

    // let headerStore = this.storeId; 
    let headerStoreName = ''; 
    if(this.rpStoreId!==null && this.rpStoreId !==undefined && this.rpStoreId !== ''  && this.rpStoreId !== 'All')
    {
      headerStoreName = this.rpStoreId;//this.storeOptions.find(x=>x.storeId === this.rpStoreId).storeName; 
    }
    
    let headerBy = infor.username; 
    let headerDate = this.GetDateFormat(new Date()); 
    const pdfDoc = new jsPDF('l', 'pt', 'a0');

    // let TitleRpt= "Sales Transaction Detail (" +  +")";
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

   
    exportDataGridToPdf(options).then(() => {
     

      // for (let i = 1; i <= pageCount; i++) {
      //     pdfDoc.setPage(i);
      //     const pageSize = pdfDoc.internal.pageSize;
      //     const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      //     const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
       

      //     // Footer
      //     pdfDoc.text(footer, pageWidth / 2 - (pdfDoc.getTextWidth(footer) / 2), pageHeight - 15, { baseline: 'bottom' });
      // }
    }).then(() => {
        pdfDoc.save(this.rpTitle+'.pdf');
        // setTimeout(() => {
        
        //   this.dataGrid.instance.columnOption('print', 'visible', true); 
        // }, 20);
    });
  }

  exportToPDF()
  {
    debugger;

    if(this.list!==undefined && this.list!==null && this.list?.length > 0)
    {
       debugger;
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
        this.commonService.exportHtmlToPDF(this.rpTitle, data, 200);
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
      
        this.loadStore();
     
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
  viewReport(store, type, transId, from, to)
  {
    debugger;
    this.pdfModel = null;
    // this.authService.storeSelected().storeId
    this.loadItems(this.authService.storeSelected().companyCode, store ,  type,transId , this.authService.getCurrentInfor().username,from, to);
  }
  onToolbarPreparing(e) {
    // if(this.authService.checkRole(this.functionId , '', 'I'))
    // {
     if(this.list !==null && this.list!==undefined && this.list?.length > 0)
     {
        e.toolbarOptions.items.unshift( 
      //     {
      //     location: 'before',
      //     widget: 'dxButton',
      //     options: {
      //         width: 136, 
      //         icon:"", type:"default", text: "PDF",
      //         onClick: this.exportToPDF.bind(this)
      //     } 
      // },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
            width: 136, 
            icon:"", type:"default", text: "PDF By Grid",
            onClick: this.exportGridToPDF.bind(this)
        } 
    }
      );

     } 
     
      // }
  }

  loadItems(companycode, store,  type, transId, user, from, to) {
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
    this.rpRangeFr = fromvl; 
    this.rpRangeTo = tovl; 
    this.rpTitle = "Activity Logs";
    if(type!=="" && type!=="All")
    {
      let typeName=  this.typeOptions.find(x=>x.value === type)?.name??"";
      debugger;
      if(typeName?.length > 0)
      {
        this.rpTitle += "("+typeName+")";
      }
    }
   
    // if(this.rpTitle?.length > 0)
    // {
    //   let spl= this.rpTitle.split('-');
    //   if(spl?.length > 1)
    //   {
    //     this.rpTitle = spl[1];
    //   }
    // }
    this.rpTitle += " Report(" + this.rpRangeFr + " ~ " + this.rpRangeTo + ")";
    this.reportService.Get_RPT_ActionOnOrder(companycode, store, '' , transId, user, fromvl, tovl,  type).subscribe((res:any) => {
      // loadItems
     
      this.isLoadingData = false;
      if(res.success)
      {
        this.list = res.data;
       
      
      }
      else
      {
        this.alertify.error(res.message);
      }
      
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.isLoadingData = false;
      this.alertify.error(error);
    });
  }

}
 

