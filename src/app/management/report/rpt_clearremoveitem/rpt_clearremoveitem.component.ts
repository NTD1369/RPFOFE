import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IPermission } from 'src/app/shop/shop-another-source-bill/shop-another-source-bill.component';
import { RPT_SalesTransactionDetailModel } from 'src/app/_models/common/report';
import { AuthService } from 'src/app/_services/auth.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import saveAs from 'file-saver';
import { CommonService } from 'src/app/_services/common/common.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-rpt_clearremoveitem',
  templateUrl: './rpt_clearremoveitem.component.html',
  styleUrls: ['./rpt_clearremoveitem.component.scss']
})
export class Rpt_clearremoveitemComponent implements OnInit {

  isLoadingData = false;
  list: any[]=[];  
  isNew:boolean = false;
  constructor(private reportService: ReportService, private alertify: AlertifyService, private router: Router,public authService: AuthService,
    private controlService: ControlService, private modalService: BsModalService, private commonService: CommonService, 
    public datepipe: DatePipe, private route: ActivatedRoute, 
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
    });
  }
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

      this.loadActionType();

      
      var d = new Date();
      const year = d.getFullYear();
      const month = d.getMonth(); 
      const currentDate = d.getDate();
      const lastDay =  new Date(year, month +1, 0).getDate();

      // this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;
      this.toDate = new Date(year + '/' + (month + 1) + '/' + currentDate) ;
      this.fromDate = new Date(year + '/' + (month + 1) + '/' + currentDate) ;
      this.loadControl();
      this.loadStore();

     
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
  controlList: any[];
  functionId = "RPT_ActionOnOrder";
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
  viewReport(store, type, transId, from, to)
  {
    debugger;
    // this.authService.storeSelected().storeId
    this.loadItems(this.authService.storeSelected().companyCode, store ,  type,transId , this.authService.getCurrentInfor().username,from, to);
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

    this.reportService.Get_RPT_ActionOnOrder(companycode, store, '' , transId, user, fromvl, tovl,  type).subscribe((res:any) => {
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
      
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.isLoadingData = false;
      this.alertify.error(error);
    });
  }

}
// function saveAs(arg0: Blob, arg1: string) {
//   throw new Error('Function not implemented.');
// }

