import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { now } from 'moment';
import { TInventoryCountingHeader } from 'src/app/_models/inventorycounting';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { InventorycoutingService } from 'src/app/_services/transaction/inventorycouting.service';

@Component({
  selector: 'app-management-inventory-couting-print',
  templateUrl: './management-inventory-couting-print.component.html',
  styleUrls: ['./management-inventory-couting-print.component.scss']
})
export class ManagementInventoryCoutingPrintComponent implements OnInit {

  constructor(private activedRoute: ActivatedRoute, private authService: AuthService, private inventoryCountingService: InventorycoutingService, 
    private companyService: CompanyService) { }

  param = "";
  version = "en";
  storeInfo = {};
  arrDataPrintList: TInventoryCountingHeader;
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
    this.inventoryCountingService.getInventoryCounting(this.param, store.storeId, store.companyCode).subscribe((response: any) => {
      let resultStatus = this.statusOptions.filter(s => s.value.includes(response.data.status));
      this.arrDataPrintList = response.data;
      this.arrDataPrintList.status = resultStatus.length > 0 ? resultStatus[0].name : "";
      console.log("response", response.data);
      let sumQ = 0;
      let sumO = 0;
      let sumV = 0;
      if (this.arrDataPrintList.lines.length > 0) {
        this.arrDataPrintList.lines.forEach(element => {
          sumQ += element.quantity;
          sumO += element.totalStock;
          sumV += element.totalDifferent;
          element.lineTotal = element.price * element.quantity;
        });
      }
      this.arrDataPrintList.sumQuality = sumQ;
      this.arrDataPrintList.sumOnhand = sumO;
      this.arrDataPrintList.sumVariance = sumV;
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
