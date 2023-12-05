import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';

@Component({
  selector: 'app-management-invtransfer',
  templateUrl: './management-invtransfer.component.html',
  styleUrls: ['./management-invtransfer.component.scss']
})
export class ManagementInvtransferComponent implements OnInit {

  inventoryList: any;
  lguAdd: string = "Add";

  constructor(public authService: AuthService, private inventory: InventoryService, private alertifyService: AlertifyService, private router: Router,
     private printService: PrintService,) { 
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
  functionId = "Adm_InventoryTransfer";
  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.loadList();
  }

  loadList() {
    let store = this.authService.storeSelected();
    let user= this.authService.getCurrentInfor().username;
    this.inventory.getInventoryList(store.companyCode, store.storeId, '', 'T', '', '', '', '', user).subscribe((response: any) => {

      this.inventoryList = response.data;

    });
  }

  newModel() {
    // this.inventory = new TGoodsReceiptHeader();
    // this.router.navigate['/goodreceipt/m=i'];
    this.router.navigate(["admin/inventory/transfer", 'i', '']);
  }
  viewDetail(data: any) {
    debugger;
    this.router.navigate(["admin/inventory/transfer", 'e', data.invtid]);
  }
  print(data) {
    this.router.navigate(["admin/print/transfer/", data.invtid]);
  }
  // PrintDetail(data: any) {
  //   this.inventoryService.getInventoryTransfer(data.invtid, data.storeId, data.companyCode).subscribe((response: any) => {
  //     this.printService.changeParamTranferShipment(response);
  //   });
  // }

  PrintDetail(data) {
    console.log("dataaaa", data);
    this.router.navigate(["admin/invstransfer/transfer/print", data.invtid]).then(() => {
      // window.location.reload();
    });
  }
}
