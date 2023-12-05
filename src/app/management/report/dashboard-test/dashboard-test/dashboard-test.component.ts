
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxChartComponent, DxDataGridComponent, DxPieChartComponent, DxSelectBoxModule } from 'devextreme-angular';
import { ThumbnailsPosition } from 'ng-gallery';
import { AuthService } from 'src/app/_services/auth.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { StorageService } from 'src/app/_services/data/storage.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import jspdf, { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { exportWidgets } from 'devextreme/viz/export';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-dashboard-test',
  templateUrl: './dashboard-test.component.html',
  styleUrls: ['./dashboard-test.component.css']
})
export class DashboardTestComponent implements OnInit {
  constructor(private reportService: ReportService,private storeServies: StoreService, private alertify: AlertifyService, private router: Router, public authService: AuthService) { }
  dataSource;
  viewType: any = [
    { name: 'Amount', value: 'amount' }, 
    { name: 'Quantity', value: 'quantity' },
    
    ];
    //check dieu kien de hien thi cai can show
    chartType = "Barchart";
    chartViewType: any = [
      { name: 'Barchart', value: 'Barchart' }, 
      { name: 'Peichart', value: 'Peichart' },
      
      ];
  topType: any= [
    { name: '5', value: 5 }, 
    { name: '10', value: 10 },
    { name: '15', value: 15 },
    ];
    loginInfor;
    // them % 
  customizeLabel(arg) {
    return `${arg.valueText} (${arg.percentText})`;
  }
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
    this.loadData(this.loginInfor.storeId,this.fromDate, this.toDate,"quantity",15)
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
            
            console.log('this.dataSource', this.dataSource);
      }
      else{
        this.alertify.warning(response.message)
      }
    })
  }
  storeList =[];
  fromDate: Date;
  toDate: Date;
  dateFormat ="";
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild(DxPieChartComponent, { static: false }) chart: DxPieChartComponent;
 
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  exportGridToPDF(top) {
    
    const doc = new jsPDF();
    let data = document.getElementById('pieDiv');
    
    const pdfDoc = new jsPDF('l', 'pt', 'a2');
    pdfDoc.setFontSize(12);  
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png')  
      pdfDoc.addImage(contentDataURL, 'PNG', 0, 0, 1700, 400);
      pdfDoc.save('SaleDetail Transaction By Top '+top+'.pdf');
    });
  }
 

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
  
}

 