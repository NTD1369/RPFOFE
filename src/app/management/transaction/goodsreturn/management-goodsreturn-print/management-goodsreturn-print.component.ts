import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TGoodsReceiptPoheader } from 'src/app/_models/grpo';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { GoodsreturnService } from 'src/app/_services/transaction/goodsreturn.service';

@Component({
  selector: 'app-management-goodsreturn-print',
  templateUrl: './management-goodsreturn-print.component.html',
  styleUrls: ['./management-goodsreturn-print.component.scss']
})
export class ManagementGoodsReturnPrintComponent implements OnInit {

  constructor(private activedRoute: ActivatedRoute, private authService: AuthService, private goodsreturnService: GoodsreturnService, private companyService: CompanyService) { }

  param = "";
  version = "en";
  companyName: string = '';
  arrDataPrintList: TGoodsReceiptPoheader;
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

  sumQuality: number = 0;
  sumLineTotal: number = 0;
  GetData() {
    debugger;
    let store = this.authService.storeSelected();
    this.goodsreturnService.getBill(this.param, store.companyCode, store.storeId).subscribe((response: any) => {
      let resultStatus = this.statusOptions.filter(s => s.value.includes(response.data.status));
      this.arrDataPrintList = response.data;
      this.arrDataPrintList.status = resultStatus.length > 0 ? resultStatus[0].name : "";
      console.log("response", response.data);

      if (this.arrDataPrintList.lines.length > 0) {
        this.arrDataPrintList.lines.forEach(element => {
          this.sumQuality += element.quantity != null ? element.quantity : 0;
          this.sumLineTotal += (element.price * element.quantity);
        });
        this.arrDataPrintList.sumQuality = this.sumQuality;
        this.arrDataPrintList.sumLineTotal = this.sumLineTotal;
      }
    });

    this.companyService.getItem(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      this.companyName = response.data.companyName;

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
