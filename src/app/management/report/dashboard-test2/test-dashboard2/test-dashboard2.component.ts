import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxChartComponent, DxDataGridComponent, DxPieChartComponent, DxSelectBoxModule } from 'devextreme-angular';
import { ThumbnailsPosition } from 'ng-gallery';
import { AuthService } from 'src/app/_services/auth.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { StorageService } from 'src/app/_services/data/storage.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import 'jspdf-autotable';
@Component({
  selector: 'app-test-dashboard2',
  templateUrl: './test-dashboard2.component.html',
  styleUrls: ['./test-dashboard2.component.scss']
})
export class TestDashboard2Component implements OnInit {



  constructor(private reportService: ReportService,private storeServies: StoreService, private alertify: AlertifyService, private router: Router, public authService: AuthService ) { }

chartType="barchart"
chartviewType: any = [
  { name: 'barchart', value: 'barchart' }, 
  { name: 'peichart', value: 'peichart' },
  
  ];
  viewType: any = [
    { name: 'Amount', value: 'amount' }, 
    { name: 'Quantity', value: 'quantity' },
    
    ];
  topType: any= [
    { name: '5', value: 5 }, 
    { name: '10', value: 10 },
    { name: '15', value: 15 },
    ];
  sourceData;
  storeList=[];
  loginInfor;
  ngOnInit() {
    var d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth(); 
    const nowDate = d.getDay();
    const lastDay =  new Date(year, month +1, 0).getDate();
    this.loginInfor = this.authService.getCurrentInfor();

  
    this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;
    this.fromDate = new Date();
    this.toDate = new Date(year + '/' + (month + 1) + '/' + lastDay) ;
  this.loadStore()
  this.loadData(this.loginInfor.storeId, this.fromDate, this.toDate,"quantity",5)

  }
  fromDate: Date;
  toDate: Date;
  dateFormat ="";
  loadData(storeId,fromDate,toDate,viewType,top){
    let fromvl= null;  let tovl= null;
    if(fromDate===null||fromDate===undefined)
    {
      fromDate=null;
    }
    if(toDate===null||toDate===undefined)
    {
      toDate=null;
    }
    if(fromDate!=null)
    {
      fromvl=this.GetDateFormat(fromDate);
    }
    if(toDate!=null)
    {
      tovl= this.GetDateFormat(toDate);
    }
  this.reportService.Get_Dash_SaleDetailTransactionByTop(this.loginInfor.companyCode,storeId,fromvl,tovl,viewType,this.loginInfor.username,top).subscribe((res:any)=>{
    if(res.success){
      this.sourceData = res.data
      console.log("res",this.sourceData);
    }
    else{
      this.alertify.warning(res.message)
    }
  })
}
GetDateFormat(date) {
  var month = (date.getMonth() + 1).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
}
  loadStore(){
    debugger;
  this.storeServies.getAll("CP001").subscribe((respon:any)=>{
    if(respon.success){
      this.storeList = respon.data
      console.log("respon",this.storeList);
    }
    else{
      this.alertify.warning(respon.message)
    }
  })
  }
}





