import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { DeliveryReturnService } from 'src/app/_services/transaction/deliveryService.service';

@Component({
  selector: 'app-management-transaction-deliveryReturn',
  templateUrl: './management-transaction-deliveryReturn.component.html',
  styleUrls: ['./management-transaction-deliveryReturn.component.scss']
})
export class ManagementTransactionDeliveryReturnComponent implements OnInit {

  constructor(public authService: AuthService,private activedRoute: ActivatedRoute,private companyService: CompanyService, private deliveryReturnService: DeliveryReturnService, private alertifyService: AlertifyService, private router: Router,) { }

  ngOnInit() {
    // this.loadDeliveryReturn()
    var d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth(); 
    const nowDate = d.getDay();
    const lastDay =  new Date(year, month +1, 0).getDate();
    this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;
    this.fromDate = new Date();
    this.toDate = new Date(year + '/' + (month + 1) + '/' + lastDay) ;
    
  }
  
  statusOptions: any = [
    { name: 'All', value: '' },
    { name: 'Closed', value: 'C' },
    { name: 'Canceled', value: 'N' },
    { name: 'Open', value: 'O' },
  ];

fromDate: Date;
toDate: Date;
status:string='';
key:string = '';
itemDeliveryReturn;
GetDateFormat(date) {
  var month = (date.getMonth() + 1).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
}

loadDeliveryReturn(){
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
  this.deliveryReturnService.getByType(comp.companyCode,comp.storeId,"",fromvl,tovl,this.key,this.status).subscribe((res:any)=>{
    if(res.success){
      res.data.forEach(el => {
        if (el.status == 'C' && el.isCanceled == 'Y') {
          el.status = 'Canceled';
        }
      });
      this.itemDeliveryReturn = res.data;
      console.log("this.itemDeliveryReturn",this.itemDeliveryReturn);
    }else{
      this.alertifyService.warning(res.message);

    }
  })
}


moveDetail(data){
  debugger
  this.router.navigate(["admin/deliveryReturn", "edit", data.data.purchaseId]);
  }


  PrintDeliveryReturn(data) {
    debugger
    console.log("data", data);
    this.router.navigate(["admin/deliveriReturn/print", data.data.purchaseId]).then(() => {
      // window.location.reload();
    debugger

    });
  }
  

}
