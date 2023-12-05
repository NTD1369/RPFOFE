import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TPurchaseOrderHeader } from 'src/app/_models/purchase';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { PurchaseService } from 'src/app/_services/transaction/purchase.service';

@Component({
  selector: 'app-management-purchase-order-print',
  templateUrl: './management-purchase-order-print.component.html',
  styleUrls: ['./management-purchase-order-print.component.scss']
})
export class ManagementPurchaseOrderPrintComponent implements OnInit {

  constructor(private activedRoute: ActivatedRoute, private authService: AuthService, private purchaseService: PurchaseService, private companyService: CompanyService) { }

  param = "";
  version = "en";
  companyName: string = '';
  arrDataPrintList: TPurchaseOrderHeader;
  date:Date =new Date;
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
      this.param = data['id'];
    })
    this.version = localStorage.getItem('language');
    this.GetData();
  }


  GetData() {
    let store = this.authService.storeSelected();
    this.purchaseService.getBill(this.param, store.companyCode, store.storeId).subscribe((response: any) => {
      let resultStatus = this.statusOptions.filter(s => s.value.includes(response.status));
      this.arrDataPrintList = response;
      this.arrDataPrintList.status = resultStatus.length > 0 ? resultStatus[0].name : "";
      console.log("response", response);
      if(this.arrDataPrintList.isCanceled==='1')
      this.arrDataPrintList.status = 'Canceled'
      let sumQ = 0;
      let sumTL = 0;
      if (this.arrDataPrintList.lines.length > 0) {
        this.arrDataPrintList.lines.forEach(element => {
          sumQ += element.quantity;
          sumTL += element.lineTotal;
        });
      }
      this.arrDataPrintList.sumQuality = sumQ;
      this.arrDataPrintList.sumLineTotal = sumTL;
    });


    this.companyService.getItem(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      this.companyName = response.data.companyName;
      console.log("companyName",this.companyName);

    });
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
