import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDateBoxComponent, DxSelectBoxComponent, DxTextBoxComponent } from 'devextreme-angular';
import { AuthService } from 'src/app/_services/auth.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-management-invstransfer-receipt',
  templateUrl: './management-invstransfer-receipt.component.html',
  styleUrls: ['./management-invstransfer-receipt.component.scss']
})
export class ManagementInvstransferReceiptComponent implements OnInit {

  lguAdd: string = "Add";
  statusOptions: any = [
    { name: 'All', value: '' },
    { name: 'Closed', value: 'C' },
    { name: 'Canceled', value: 'N' },
    { name: 'Open', value: 'O' },
  ];
  inventoryList: any;
  fromdate = "";
  todate = "";
  @ViewChild('transId', { static: false }) transId: DxTextBoxComponent;
  @ViewChild('toCalendar', { static: false }) toCalendar: DxDateBoxComponent;
  @ViewChild('fromCalendar', { static: false }) fromCalendar: DxDateBoxComponent;
  @ViewChild('cbbStatus', { static: false }) cbbStatus: DxSelectBoxComponent;
  totalBill = 0; 
  openBill = 0;
  cancelBill = 0;
  closedBill = 0;
  saveBill: any = [];
  ngAfterViewInit() {
    
    let now = new Date();
    let from = now.setDate(1);


    this.fromdate = this.datepipe.transform(from, 'yyyy-MM-dd');
    this.todate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

    setTimeout(() => {
      this.loadList();
    }, 50);
   
  }
  selectType = "";
  filterbills(type) {
    debugger;
    this.inventoryList = this.saveBill;
    if (type === "All") {
      this.inventoryList = this.saveBill;
    }
    if (type === "C") {
      this.inventoryList = this.inventoryList.filter(x =>x.status?.toLowerCase()  === 'closed' || x.status?.toLowerCase()  === 'c');
    }
    if (type === "N") {
      this.inventoryList = this.inventoryList.filter(x => x.status?.toLowerCase()  === 'canceled' || x.status?.toLowerCase()  === 'n');
    } 
    if (type === "O") {
      this.inventoryList = this.inventoryList.filter(x =>x.status.toLowerCase() === 'open' || x.status.toLowerCase() === 'o');
    }
    this.selectType = type;
  }
  production = false;

  constructor(private inventory: InventoryService, private alertifyService: AlertifyService, private router: Router, public authService: AuthService,
     private printService: PrintService,  public datepipe: DatePipe) {
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
  functionId = "Adm_InvTransferReceipt";
  ngOnInit() {
    this.production =  environment.production;
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    // this.loadList();
  }
  loadList() { 
    let store = this.authService.storeSelected();
    let user= this.authService.getCurrentInfor().username;

    let now = new Date();
    let fromStr = '';
    let toStr = '';
    let key = '';
    debugger;
    let status = '';
    if(this.production===false)
    {
       let from = this.fromCalendar.value;
       let to = this.toCalendar.value;
       status = this.cbbStatus.value;
       key = this.transId.value;
       if (from !== null && from !== undefined) {
         // from = now.setDate(now.getDate() - 60 ); 
         fromStr = this.datepipe.transform(from, 'yyyy-MM-dd');
       }
   
       if (to !== null && to !== undefined) {
         // to = now;
         toStr = this.datepipe.transform(to, 'yyyy-MM-dd');
       }
    }
    this.inventory.getInventoryList(store.companyCode, '', store.storeId, 'R', status, fromStr, toStr, key, user).subscribe((response: any) => {
    // this.inventory.getInventoryList(this.authService.storeSelected().companyCode, '', store.storeId, 'R', '', '', '', '', user).subscribe((response: any) => {
      if (response.success) {
        response.data.forEach(el => {
          if (el.status == 'C' && el.isCanceled == 'Y') {
            el.status = 'Canceled';
          }
        }); 
        this.inventoryList = response.data;
        // console.log("this.inventoryList R:", this.inventoryList);
        this.totalBill = response.data?.length ?? 0;
        this.cancelBill = response.data?.filter(x => x.status?.toLowerCase()  === 'canceled' || x.status?.toLowerCase()  === 'n')?.length ?? 0;
        this.closedBill = response.data?.filter(x => x.status?.toLowerCase()  === 'closed' || x.status?.toLowerCase()  === 'c')?.length ?? 0; 
        this.openBill = response.data?.filter(x => x.status.toLowerCase() === 'open' || x.status.toLowerCase() === 'o')?.length ?? 0; 
        this.saveBill = this.inventoryList;
      }
    });
  }

  newModel() {
    // this.inventory = new TGoodsReceiptHeader();
    // this.router.navigate['/goodreceipt/m=i'];
    this.router.navigate(["admin/inventory/transfer-receipt", 'i', '']);
  }
  viewDetail(data: any) {
    // debugger;
    this.router.navigate(["admin/inventory/transfer-receipt", 'e', data.invtid]);
  }
  print(data) {
    this.router.navigate(["admin/print/transfer-receipt/", data.invtid]);
  }
   

  PrintDetail(data) {
    this.router.navigate(["admin/invstransfer/receipt/print", data.invtid]).then(() => {
      // window.location.reload();
    });
  }
  
}
