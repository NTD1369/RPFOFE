import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TInventoryHeader } from 'src/app/_models/inventory';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';

@Component({
  selector: 'app-management-invstranfer-request-print',
  templateUrl: './management-invstranfer-request-print.component.html',
  styleUrls: ['./management-invstranfer-request-print.component.css']
})
export class ManagementInvstranferRequestPrintComponent implements OnInit {

  constructor(private activedRoute: ActivatedRoute, private authService: AuthService, private inventoryService: InventoryService,
    private companyService: CompanyService) { }

  param = "";
  version = "en";
  storeInfo = {};
  arrDataPrintList: TInventoryHeader;
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
    this.inventoryService.getInventoryTransfer(this.param, store.storeId, store.companyCode).subscribe((response: any) => {
      debugger;
      let resultStatus = this.statusOptions.filter(s => s.value.includes(response.data.status));
      this.arrDataPrintList = response.data;
      this.arrDataPrintList.status = resultStatus.length > 0 ? resultStatus[0].name : "";
      console.log("response", response.data);
      let sumQ = 0;
      let sumA = 0;
      if (this.arrDataPrintList.lines.length > 0) {
        this.arrDataPrintList.lines.forEach(element => {
          sumQ += element.quantity;
          sumA += element.approve;
        });
      }
      this.arrDataPrintList.sumQuality = sumQ;
      this.arrDataPrintList.sumapprove = sumA;
    });
    this.companyService.getItem(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      console.log("response company", response.data);
      this.storeInfo = response.data;
      console.log("response this.storeInfo", this.storeInfo);
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
