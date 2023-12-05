import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { DeliveryReturnService } from 'src/app/_services/transaction/deliveryService.service';

@Component({
  selector: 'app-management-transaction-deliveryReturn-print',
  templateUrl: './management-transaction-deliveryReturn-print.component.html',
  styleUrls: ['./management-transaction-deliveryReturn-print.component.scss']
})
export class ManagementTransactionDeliveryReturnPrintComponent implements OnInit {

  constructor(public authService: AuthService,private activedRoute: ActivatedRoute,private companyService: CompanyService, private deliveryReturnService: DeliveryReturnService, private alertifyService: AlertifyService, private router: Router,) { }


  version = "en";
  companyName: string = '';
  param = "";
  statusOptions = [
    {
      value: "O", name: "Open",
    },
    {
      value: "A", name: "Open",
    },
    {
      value: "C", name: "Closed",
    },
    {
      value: "P", name: "Partial",
    },
    {
      value: "Canceled", name: "Canceled",
    },
  ];



  ngOnInit() {
    this.activedRoute.params.subscribe(data => {
      console.log("data",data);
      this.param = data['id'];
    })
    this.loadItemDeliveryReturnPrint()
  }






  itemDeliveryReturn;
loadItemDeliveryReturnPrint(){
  let store = this.authService.storeSelected();

  this.deliveryReturnService.getOrderById(this.param,store.companyCode,store.storeId).subscribe((response:any)=>{
    if(response.success){
      this.itemDeliveryReturn = response.data;
      let resultStatus = this.statusOptions.filter(s => s.value.includes(response.data.status));
      this.itemDeliveryReturn.status = resultStatus.length > 0 ? resultStatus[0].name : "";
      let sumQ = 0;
      let sumTL = 0;
      if (this.itemDeliveryReturn.lines.length > 0) {
        debugger
        this.itemDeliveryReturn.lines.forEach(element => {
          sumQ += element.quantity;
          sumTL += element.lineTotal;
        });
      }
      this.itemDeliveryReturn.sumQuality = sumQ;
      this.itemDeliveryReturn.sumLineTotal = sumTL;
      this.companyService.getItem(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
        this.companyName = response.data.companyName;
        console.log("companyName",this.companyName);
  
      });
    }
    else{
      this.alertifyService.warning(response.message);
    }
  })
}



switchVersion() {
  if (this.version === 'vi') {
    this.version = 'en';
  }
  else {
    this.version = 'vi';
  }
}


PrintPage() {
  window.print();
}


}
