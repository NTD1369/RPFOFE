import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { DeliveryService } from 'src/app/_services/data/delivery.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-management-transaction-delivery',
  templateUrl: './management-transaction-delivery.component.html',
  styleUrls: ['./management-transaction-delivery.component.css']
})
export class ManagementTransactionDeliveryComponent implements OnInit {

  constructor(public authService: AuthService, private deliveryService: DeliveryService, private alertifyService: AlertifyService, private router: Router,
   private route: ActivatedRoute,) { }



companyCode;
  ngOnInit() {
    var d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth(); 
    const nowDate = d.getDay();
    const lastDay =  new Date(year, month +1, 0).getDate();
    this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;
    this.fromDate = new Date();
    this.toDate = new Date(year + '/' + (month + 1) + '/' + lastDay) ;
    
   
  }

  status:string='';
  key:string = '';

  statusOptions: any = [
    { name: 'All', value: '' },
    { name: 'Closed', value: 'C' },
    { name: 'Canceled', value: 'N' },
    { name: 'Open', value: 'O' },
  ];


loadData;

fromDate: Date;
toDate: Date;
dateFormat ="";
loadItem(){
  debugger;
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
console.log("comp",comp);
  this.deliveryService.getByType(comp.companyCode,comp.storeId,"",fromvl,tovl,this.key,this.status).subscribe((response:any)=>{
    if(response.success){
      response.data.forEach(el => {
        if ( el.isCanceled == 'Y') {
          el.status = 'Canceled';
        }
      });
      this.loadData = response.data
      console.log("loaddata",this.loadData);
    }
    else {
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
this.router.navigate(["admin/delivery", "edit", data.data.purchaseId]);
}
PrintDelivery(data) {
  debugger
  console.log("data", data);
  this.router.navigate(["admin/deliveri/print", data.data.purchaseId]).then(() => {
    // window.location.reload();
  });
}

}
