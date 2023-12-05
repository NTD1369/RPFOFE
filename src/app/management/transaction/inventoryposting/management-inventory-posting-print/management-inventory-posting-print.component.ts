import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TInventoryPostingHeader } from 'src/app/_models/inventoryposting';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { InventorypostingService } from 'src/app/_services/transaction/inventoryposting.service';

@Component({
  selector: 'app-management-inventory-posting-print',
  templateUrl: './management-inventory-posting-print.component.html',
  styleUrls: ['./management-inventory-posting-print.component.scss']
})
export class ManagementInventoryPostingPrintComponent implements OnInit {

  constructor(private activedRoute: ActivatedRoute, private authService: AuthService, private inventorypostingService: InventorypostingService,
    private companyService: CompanyService) { }

  param = "";
  version = "en";
  storeInfo = {};
  arrDataPrintList: TInventoryPostingHeader;
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
    this.inventorypostingService.getInventoryPosting(store.companyCode, store.storeId, this.param).subscribe((response: any) => {
      let resultStatus = this.statusOptions.filter(s => s.value.includes(response.data.status));
      this.arrDataPrintList = response.data;
      this.arrDataPrintList.status = resultStatus.length > 0 ? resultStatus[0].name : "";
      console.log("response", response.data);
      let sumQ = 0;
      if (this.arrDataPrintList.lines.length > 0) {
        this.arrDataPrintList.lines.forEach(element => {
          sumQ += element.quantity;
        });
      }
      this.arrDataPrintList.sumQuality = sumQ;
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
