import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TDelivery } from 'src/app/_models/viewmodel/delivery';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { DeliveryService } from 'src/app/_services/data/delivery.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-transaction-delivery-print',
  templateUrl: './management-transaction-delivery-print.component.html',
  styleUrls: ['./management-transaction-delivery-print.component.scss']
})
export class ManagementTransactionDeliveryPrintComponent implements OnInit {

  constructor(public authService: AuthService,private activedRoute: ActivatedRoute,private companyService: CompanyService, private deliveryService: DeliveryService, private alertifyService: AlertifyService, private router: Router,) { }

    date:Date =new Date;
    version = "en";
    companyName: string = '';
    param = "";
    itemDetailPrint;

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

this.loadItemPrint();

  }



loadItemPrint(){
  let store = this.authService.storeSelected();

  this.deliveryService.getOrderById(this.param,store.companyCode,store.storeId).subscribe((response:any)=>{
    if(response.success){
      debugger
      let resultStatus = this.statusOptions.filter(s => s.value.includes(response.data.status));
      console.log("resultStatus",resultStatus);
      this.itemDetailPrint= response.data;
      this.itemDetailPrint.status = resultStatus.length > 0 ? resultStatus[0].name : "";

      console.log("itemDetailPrint",this.itemDetailPrint);
      let sumQ = 0;
      let sumTL = 0;
      if (this.itemDetailPrint.lines.length > 0) {
        debugger
        this.itemDetailPrint.lines.forEach(element => {
          sumQ += element.quantity;
          sumTL += element.lineTotal;
        });
      }
      this.itemDetailPrint.sumQuality = sumQ;
      this.itemDetailPrint.sumLineTotal = sumTL;
      this.companyService.getItem(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
        this.companyName = response.data.companyName;
        console.log("companyName",this.companyName);
  
      });
    }else{
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
