import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/_services/auth.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { IPermission } from 'src/app/shop/shop-another-source-bill/shop-another-source-bill.component';

@Component({
  selector: 'app-RPT_SyncDataStatusView',
  templateUrl: './RPT_SyncDataStatusView.component.html',
  styleUrls: ['./RPT_SyncDataStatusView.component.scss']
})
export class RPT_SyncDataStatusViewComponent implements OnInit {


  list: any[]=[];  
  isNew:boolean = false;
  storeOptions:any =[];
  isLoadingData = false;
  storeId:string='';
  constructor(private reportService: ReportService, private alertify: AlertifyService, private router: Router,public authService: AuthService,
    private controlService: ControlService, private modalService: BsModalService, private route: ActivatedRoute,
    private storeService: StoreService) {
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
    let nameOfRpt= 'RPT_SyncDataStatusView' ;
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
      const lastDay =  new Date(year, month +1, 0).getDate();

      this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;
      this.toDate = new Date(year + '/' + (month + 1) + '/' + lastDay) ;
      // this.route
      // this.loadItems("","","admin","","");
      debugger;
      // this.loadControl();
    }
  }
  controlList: any[];
  functionId = "RPT_SyncDataStatusView";
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
   
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  viewReport(from, to)
  {
    let storeList = this.gridBoxValue.join(';');
    this.loadItems(this.authService.storeSelected().companyCode, storeList, this.authService.getCurrentInfor().username,from, to);
  }
  gridBoxValue: string[] = [];
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
   
    this.reportService.Get_RPT_SyncDataStatusView(companycode, store, user, fromvl, tovl).subscribe((res:any) => {
      // loadItems
      // debugger;
      console.log('response', res);
      this.isLoadingData = false;
      if(res.success)
      {
        this.controlList= res.data.header;
        this.controlList= this.controlList.sort(( a, b ) => a.OrderNum > b.OrderNum ? 1 : -1  );
        // this.controlList.forEach(item=>{
        //   if(item.controlId.substring(0,3) === "sum")
        //   {
        //     item.sum =item.controlId.substring(3);
        //     item.isView =this.authService.checkRole(this.functionId , item.controlId, 'V' );
        //   }
        // })
        this.list = res.data.lines;
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
  loadStore(){
      debugger;
      this.storeService.getByUserWithStatus(this.authService.decodeToken?.unique_name).subscribe((response: any) => {
       // debugger;
        if(response.success)
        {
         response.data.forEach(item => {
          //  let data = {name:item.storeName,value:item.storeId}
           let data = {
            name: item.storeId + ' - '  + (item.status === 'I' ? item.storeName + " (Inactive)" : item.storeName), 
            value:item.storeId
           }
           this.storeOptions.push(data);
         });;
        //  this.storeOptions.unshift({name:'All',value:''});
        } 
        else
        {
          this.alertify.warning(response.message);
        }
       
        // this.storeList = response;
        // console.log(this.storeList);
      });
  }
 
}
