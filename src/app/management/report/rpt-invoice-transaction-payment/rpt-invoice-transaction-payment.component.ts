import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IPermission } from 'src/app/shop/shop-another-source-bill/shop-another-source-bill.component';
import { RPT_InvoiceTransactionPaymentModel, RPT_SalesTransactionPaymentModel } from 'src/app/_models/common/report';
import { AuthService } from 'src/app/_services/auth.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import saveAs from 'file-saver';

@Component({
  selector: 'app-rpt-invoice-transaction-payment',
  templateUrl: './rpt-invoice-transaction-payment.component.html',
  styleUrls: ['./rpt-invoice-transaction-payment.component.css']
})
export class RptInvoiceTransactionPaymentComponent implements OnInit {

  isLoadingData = false;
  list: RPT_InvoiceTransactionPaymentModel []=[];  
  isNew:boolean = false;
  constructor(private reportService: ReportService, private alertify: AlertifyService, private router: Router,public authService: AuthService,
    private controlService: ControlService,  private modalService: BsModalService, private route: ActivatedRoute) {
      this.customizeText= this.customizeText.bind(this);
     }
    customizeText (e) {
    debugger;
      if( e.value!==null &&  e.value!== undefined)
      {
        return this.authService.formatCurrentcy( e.value);

      }
      return 0;
  };
  onExporting(e) {
    const workbook = new Workbook();    
    const worksheet = workbook.addWorksheet('Main sheet');
    let nameOfRpt= 'InvoiceTransactionPayment' ;
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
  fromDate: Date;
    toDate: Date;
    dateFormat="";
    ngOnInit() {
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
        const lastDay =  new Date(year, month +1, 0).getDate();
    
        this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;
        this.toDate = new Date(year + '/' + (month + 1) + '/' + lastDay) ;
        // this.route
        // this.loadItems("","","admin","","");
        debugger;
        this.loadControl();
      }
    }
    controlList: any[];
    functionId = "RPT_InvoiceTransactionPayment";
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
  viewReport(from, to)
  {
    this.loadItems(this.authService.storeSelected().companyCode,this.authService.storeSelected().storeId, this.authService.getCurrentInfor().username,from, to);
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

    this.reportService.Get_RPT_InvoiceTransactionPayment(companycode, '', user, fromvl, tovl).subscribe((res:any) => {
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
 

