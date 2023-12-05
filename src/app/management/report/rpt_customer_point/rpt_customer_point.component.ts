import { Component, OnInit } from '@angular/core';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { IPermission } from 'src/app/shop/shop-another-source-bill/shop-another-source-bill.component';

import saveAs from 'file-saver';
import { ReportService } from 'src/app/_services/common/report.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RPT_CustomerPoint } from 'src/app/_models/common/report';

@Component({
  selector: 'app-rpt_customer_point',
  templateUrl: './rpt_customer_point.component.html',
  styleUrls: ['./rpt_customer_point.component.scss']
})
export class Rpt_customer_pointComponent implements OnInit {

  list: any[]=[];  
  isNew:boolean = false;
  storeOptions:any =[];
  isLoadingData = false;
  storeId:string='';
  constructor(private reportService: ReportService, private alertify: AlertifyService, private router: Router,public authService: AuthService,
    private controlService: ControlService, private modalService: BsModalService, private route: ActivatedRoute) {
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
  fromDate: Date;
  toDate: Date;
  dateFormat="";

  onExporting(e) {
    const workbook = new Workbook();    
    const worksheet = workbook.addWorksheet('Main sheet');
    let nameOfRpt= 'RPT_CustomerPoint' ;
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
  functionId = "RPT_CustomerPoint";
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
        if(item.controlId.substring(0,7) === "groupby")
        {
         item.groupby =item.controlId.substring(7);
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
  viewReport(customerId)
  {
    this.loadItems(this.authService.storeSelected().companyCode,customerId);
  }
  loadItems(companycode, customerId) {
    

    this.reportService.Get_RPT_CustomerPoint(companycode, customerId).subscribe((res:any) => {
      // loadItems
      // debugger;
      this.isLoadingData = false;
      if(res.success)
      {
        this.list = res.data;
        console.log(this.list)
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
