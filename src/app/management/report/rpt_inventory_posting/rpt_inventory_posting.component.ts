import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IPermission } from 'src/app/shop/shop-another-source-bill/shop-another-source-bill.component';
import { RPT_InventoryPostingModel, RPT_SalesStoreSummaryModel } from 'src/app/_models/common/report';
import { AuthService } from 'src/app/_services/auth.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { StoreService } from 'src/app/_services/data/store.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rpt_inventory_posting',
  templateUrl: './rpt_inventory_posting.component.html',
  styleUrls: ['./rpt_inventory_posting.component.css']
})
export class Rpt_inventory_postingComponent implements OnInit {

  isLoadingData = false;
  list: RPT_InventoryPostingModel[]=[];  
  isNew:boolean = false;
  constructor(private reportService: ReportService, private alertify: AlertifyService, private router: Router,public authService: AuthService,
    private controlService: ControlService, private modalService: BsModalService, private route: ActivatedRoute, private storeService: StoreService,
    private spinnerService: NgxSpinnerService, public translate: TranslateService) {
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
  storeOptions:any =[];
  gridBoxValue:string[] =[];
  onExporting(e) {
    const workbook = new Workbook();    
    const worksheet = workbook.addWorksheet('Main sheet');
    let nameOfRpt= 'InventoryPosting' ;
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

      // this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;
      // let now = new Date();
      this.fromDate =   new Date();
      this.toDate = new Date(year + '/' + (month + 1) + '/' + lastDay) ;
      // this.route
      // this.loadItems("","","admin","","");
      debugger;
      this.loadControl();
    }
  }
  controlList: any[];
  functionId = "RPT_InventoryPosting";
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
  viewReport(from, to,store)
  {
    this.loadItems(this.authService.storeSelected().companyCode,store.value, this.authService.getCurrentInfor().username,from, to);
    // this.loadItems(this.authService.storeSelected().companyCode,this.gridBoxValue.toString(), this.authService.getCurrentInfor().username,from, to);
  }
  loadItems(companycode, store, user, from, to) {
    // debugger;
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
    this.spinnerService.show()
    this.reportService.Get_RPT_InventoryPosting(companycode, store, user, fromvl, tovl).subscribe((res:any) => {
      // loadItems
      // debugger;
      this.spinnerService.hide()
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
  loadStore(){
    debugger;
    this.storeService.getByUserWithStatus(this.authService.decodeToken?.unique_name).subscribe((response: any) => {
     debugger;
      if(response.success)
      {
       response.data.forEach(item => {
         let data = {
           name: item.status === 'I' ? item.storeName + " (Inactive)" : item.storeName, 
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
  let nameOfRpt= 'RPT_InventoryPosting' ;
  var d = new Date();
  let dateFm = this.GetDateFormat(d);

  nameOfRpt = nameOfRpt + '_' + dateFm.replace(/\-/gi,'') + '_' + this.authService.getCurrentInfor().username;
  this.isLoadingData = true;

  this.reportService.export_RPT_InventoryPosting(companycode, store, user, fromvl, tovl,header).subscribe((res:any) => {
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
