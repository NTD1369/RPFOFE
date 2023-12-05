import { RepositionScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-test-dashboard',
  templateUrl: './test-dashboard.component.html',
  styleUrls: ['./test-dashboard.component.scss']
})
export class TestDashboardComponent implements OnInit {

  constructor(public authService:AuthService, private reportService:ReportService, private alertity:AlertifyService,private store:StoreService) { }

  sourceData;
  storeList=[]
  loginInfor;
  
  view:any=[
    {name:"amount",value:"amount"},
    {name:"quantity",value:"quantity"},
  ]

  top:any=[
    {name:"5",value:5},
    {name:"10",value:10},
  ]
  
  chartType = "Barchart";
  chartViewType: any = [
    { name: 'Barchart', value: 'Barchart' }, 
    { name: 'Peichart', value: 'Peichart' },
    
    ];
  ngOnInit() {
    this.loginInfor = this.authService.getCurrentInfor();
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
  this.loaddata(this.loginInfor.storeId,this.fromDate, this.toDate,"quantity", 5) // nơi nhận giá trị truyền vào(admin,quantity)
   
  }
  
  loaddata(storeId,fromDate,toDate,viewtype,top){
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
    console.log("search", this.loginInfor);
    this.reportService.Get_Dash_SaleDetailTransactionByTop(this.loginInfor.companyCode,storeId,fromvl,tovl,viewtype,this.loginInfor.username,top).subscribe((res:any)=>{
      if(res.success){
        this.sourceData = res.data
        console.log("res",this.sourceData);
      }
      else{
        this.alertity.warning(res.message)
      }
    })
  }
  fromDate: Date;
  toDate: Date;
  dateFormat ="";
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  loadStore(){
    this.store.getAll("CP001").subscribe((respon:any)=>{
      if(respon.success){
        this.storeList = respon.data
        console.log("res",this.storeList);
      }
      else{
        this.alertity.warning(respon.message)
      }
    })
  }
  
}
