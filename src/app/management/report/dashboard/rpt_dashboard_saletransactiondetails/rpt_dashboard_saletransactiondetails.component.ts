import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxSelectBoxModule } from 'devextreme-angular';
import { ThumbnailsPosition } from 'ng-gallery';
import { AuthService } from 'src/app/_services/auth.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { StorageService } from 'src/app/_services/data/storage.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-rpt_dashboard_saletransactiondetails',
  templateUrl: './rpt_dashboard_saletransactiondetails.component.html',
  styleUrls: ['./rpt_dashboard_saletransactiondetails.component.css']
})
export class Rpt_dashboard_saletransactiondetailsComponent implements OnInit {

  constructor(private reportService: ReportService, private alertify: AlertifyService, private router: Router, public authService: AuthService, private storeServies: StoreService) { }
  dataSource;
  nameType="amount";
  viewType: any = [
    { name: 'Amount', value: 'amount' }, 
    { name: 'Quantity', value: 'quantity' },
    
    ];
    topType: any= [
      { name: '5', value: 5 }, 
      { name: '10', value: 10 },
      { name: '15', value: 15 },
      ];
     storeList =[];

  isLoadingData= false;
  @ViewChild(DxSelectBoxModule, { static: false }) cbbViewType: DxSelectBoxModule;
  loginInfor;
  ngOnInit() {
    debugger
    this.loginInfor = this.authService.getCurrentInfor();
    var d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth(); 
    const nowDate = d.getDay();
    const lastDay =  new Date(year, month +1, 0).getDate();

  
    this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;
    this.fromDate = new Date();
    this.toDate = new Date(year + '/' + (month + 1) + '/' + lastDay) ;
    //  this.loadData('1001',this.fromDate, this.toDate,"quantity",15);
     this.loadStore();
  }
  fromDate: Date;
  toDate: Date;
  dateFormat ="";
  loadStore()
  {
    this.storeServies.getAll("CP001").subscribe((response:any)=>{
      if(response.success){
        this.storeList = response.data
        console.log("this.storeList", this.storeList);
      }
      else{
        console.log(this.alertify.warning);
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
  loadData(storeId,fromDate,toDate,viewType,top)
  {
    
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
     
  //1001, CP001,2022-06-01, 2022-06-05,admin,10
    this.reportService.Get_Dash_SaleDetailTransactionByTop(this.loginInfor.companyCode,storeId,fromvl,tovl,viewType,this.loginInfor.username, top).subscribe((response: any) =>{

      if(response.success){
            this.dataSource = response.data;
            this.nameType = viewType;
            console.log('this.dataSource', this.dataSource);
      }
      else{
        this.alertify.warning(response.message)
      }
    })
  }
}
