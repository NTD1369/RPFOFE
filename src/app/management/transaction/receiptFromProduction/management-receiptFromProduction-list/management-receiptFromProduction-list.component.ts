import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TReceiptfromProductionHeader } from 'src/app/_models/viewmodel/receiptFromProduction';
import { AuthService } from 'src/app/_services/auth.service';
import { ReceiptFromProductionService } from 'src/app/_services/data/receiptFromProduction.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-receiptFromProduction-list',
  templateUrl: './management-receiptFromProduction-list.component.html',
  styleUrls: ['./management-receiptFromProduction-list.component.css']
})
export class ManagementReceiptFromProductionListComponent implements OnInit {

  constructor(public authService: AuthService,private alertifyService: AlertifyService,
    private receiptFromProduction : ReceiptFromProductionService,private router: Router ) { }



  statusOptions: any = [
    { name: 'All', value: '' },
    { name: 'Closed', value: 'C' },
    { name: 'Canceled', value: 'N' },
    { name: 'Open', value: 'O' },
  ];
  status:string='';
  key:string = '';
  ngOnInit() {
    var d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth(); 
    const nowDate = d.getDay();
    const lastDay =  new Date(year, month +1, 0).getDate();
    this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;

    this.toDate = new Date(year + '/' + (month + 1) + '/' + lastDay) ;
  }




dataReceipt;
fromDate: Date;
toDate: Date;
loadReceipt(){

  let fromvl= null;  let tovl= null;
  if(this.fromDate===null||this.fromDate===undefined)
  {
    this.fromDate=null;
  }
  if(this.toDate===null||this.toDate===undefined)
  {
    this.toDate=null;
  }
  if(this.fromDate!=null)
  {
    fromvl=this.GetDateFormat(this.fromDate);
  }
  if(this.toDate!=null)
  {
    tovl= this.GetDateFormat(this.toDate);
  }
  let comp = this.authService.storeSelected();
  this.receiptFromProduction.getByType(comp.companyCode,comp.storeId,"",fromvl,tovl,this.key,this.status).subscribe((response:any)=>{
    if(response.success){
      response.data.forEach(el => {
        if ( el.isCanceled == 'Y') {
          el.status = 'Canceled';
        }
      });
      this.dataReceipt = response.data;
      console.log(" this.dataReceipt ", this.dataReceipt );
    }else{
      this.alertifyService.warning(response.message);

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
moveDetail(data){
  debugger
  this.router.navigate(["admin/receiptFromProduction", "edit", data.data.invtid]);
  }
  PrintDelivery(data) {
    debugger
    console.log("data", data);
    this.router.navigate(["admin/receiptfromProduction/print", data.data.invtid]).then(() => {
      // window.location.reload();
    });
  }

}
