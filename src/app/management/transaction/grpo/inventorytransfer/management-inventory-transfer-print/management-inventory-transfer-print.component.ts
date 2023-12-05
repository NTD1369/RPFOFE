import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TInventoryTransferHeader } from 'src/app/_models/inventorytransfer';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { InventoryTransferService } from 'src/app/_services/transaction/inventorytransfer.service';

@Component({
  selector: 'app-management-inventory-transfer-print',
  templateUrl: './management-inventory-transfer-print.component.html',
  styleUrls: ['./management-inventory-transfer-print.component.scss']
})
export class ManagementInventoryTransferPrintComponent implements OnInit {

  constructor(private activedRoute: ActivatedRoute, private authService: AuthService, private inventoryService: InventoryTransferService,
    private companyService: CompanyService) { }

  param = "";
  version = "en";
  storeInfo = {};
  arrDataPrintList: TInventoryTransferHeader;

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

    this.GetData();
  }

  GetData() {
    let store = this.authService.storeSelected();
    console.log("store", store);
    this.inventoryService.getInventoryTransfer(this.param, store.storeId, store.companyCode).subscribe((response: any) => {
      this.arrDataPrintList = response.data;
      console.log("this.ar", this.arrDataPrintList);
      
      let sumQ = 0;
      if (this.arrDataPrintList.lines.length > 0) {
        this.arrDataPrintList.lines.forEach(element => {
          sumQ += element.quantity;
        });
      }
      this.arrDataPrintList.sumQuality = sumQ;

      console.log("response",  this.arrDataPrintList);
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
