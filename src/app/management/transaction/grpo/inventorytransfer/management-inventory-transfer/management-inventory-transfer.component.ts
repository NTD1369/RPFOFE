import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';
import { InventoryTransferService } from 'src/app/_services/transaction/inventorytransfer.service';

@Component({
  selector: 'app-management-inventory-transfer',
  templateUrl: './management-inventory-transfer.component.html',
  styleUrls: ['./management-inventory-transfer.component.scss']
})
export class ManagementInventoryTransferComponent implements OnInit {

  inventoryList: any;
  lguAdd: string = "Add";
  functionId = "Adm_InventoryTransfer";

  constructor(public authService: AuthService, private inventory: InventoryTransferService, private alertifyService: AlertifyService, private router: Router) {
    // Chuyển đổi ngôn ngữ
    const lgu = localStorage.getItem('language');
    if (lgu === "vi") {
      this.lguAdd = "Thêm";
    } else if (lgu === "en") {
      this.lguAdd = "Add";
    } else {
      console.log("error");
    }
  }
  @ViewChild('template', { static: false }) template;
  onToolbarPreparing(e) {
    if (this.authService.checkRole(this.functionId, '', 'I')) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: this.lguAdd,
          onClick: this.newModel.bind(this)
        }
      });
    }
  }

  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.loadList();
  }

  loadList() {
    let store = this.authService.storeSelected();
    this.inventory.getInventoryList(store.companyCode, store.storeId, '', '', '', '', '', '', '').subscribe((response: any) => {
      this.inventoryList = response.data;
      console.log("this.inventoryList", this.inventoryList);
    });
  }
  transferType: any = [
    { name: 'Receipt', value: 'R' },
    { name: 'Shipment', value: 'S' },
  ];
  newModel() {
    this.router.navigate(["admin/inventory/inventorytransfer", 'i', '']);
  }
  viewDetail(data: any) {
    console.log("data", data);
    this.router.navigate(["admin/inventory/inventorytransfer", 'e', data.invtTransid]);
  }

  print(data) {
    this.router.navigate(["admin/print/inventorytransfer/", data.invtTransid]);
  }

  PrintDetail(data) {
    this.router.navigate(["admin/inventorytransfer/print", data.invtTransid]).then(() => {
    });
  }
}


