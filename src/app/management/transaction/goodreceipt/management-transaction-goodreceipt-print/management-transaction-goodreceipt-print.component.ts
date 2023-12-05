import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TGoodsReceiptHeader } from 'src/app/_models/goodreceipt';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { GoodreceiptService } from 'src/app/_services/transaction/goodreceipt.service';

@Component({
  selector: 'app-management-transaction-goodreceipt-print',
  templateUrl: './management-transaction-goodreceipt-print.component.html',
  styleUrls: ['./management-transaction-goodreceipt-print.component.scss']
})
export class ManagementGoodReceiptPrintComponent implements OnInit {

  constructor(private activedRoute: ActivatedRoute, private authService: AuthService, private goodreceiptService: GoodreceiptService, private companyService: CompanyService) { }

  param = "";
  version = "en";
  companyName: string = '';
  arrDataPrintList: TGoodsReceiptHeader;
  storeInfo = {};
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
    this.goodreceiptService.getReceipt(this.param, store.storeId, store.companyCode).subscribe((response: any) => {
      let resultStatus = this.statusOptions.filter(s => s.value.includes(response.data.status));
      this.arrDataPrintList = response.data;
      this.arrDataPrintList.status = resultStatus.length > 0 ? resultStatus[0].name : "";
      console.log("response", response.data);
    });

    this.companyService.getItem(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      this.storeInfo = response.data;
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
