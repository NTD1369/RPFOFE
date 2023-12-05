import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDateBoxComponent, DxSelectBoxComponent, DxTextBoxComponent } from 'devextreme-angular';
import { TGoodsReceiptHeader } from 'src/app/_models/goodreceipt';
import { MStore } from 'src/app/_models/store';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { GoodreceiptService } from 'src/app/_services/transaction/goodreceipt.service';

@Component({
  selector: 'app-management-transaction-goodreceipt',
  templateUrl: './management-transaction-goodreceipt.component.html',
  styleUrls: ['./management-transaction-goodreceipt.component.scss']
})
export class ManagementTransactionGoodreceiptComponent implements OnInit {

  @Input() order: Order = new Order();
  list: TGoodsReceiptHeader[];
  goodreceipt: TGoodsReceiptHeader;
  storeSelected: MStore;
  lguAdd: string = "Add";
  statusOptions: any = [
    { name: 'All', value: '' },
    { name: 'Closed', value: 'C' },
    { name: 'Canceled', value: 'N' },
    { name: 'Open', value: 'O' },
  ];
 
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
    this.list = this.saveBill;
    if (type === "All") {
      this.list = this.saveBill;
    }
    if (type === "C") {
      this.list = this.list.filter(x =>x.status?.toLowerCase()  === 'closed' || x.status?.toLowerCase()  === 'c');
    }
    if (type === "N") {
      this.list = this.list.filter(x => x.status?.toLowerCase()  === 'canceled' || x.status?.toLowerCase()  === 'n');
    } 
    if (type === "O") {
      this.list = this.list.filter(x =>x.status.toLowerCase() === 'open' || x.status.toLowerCase() === 'o');
    }
    this.selectType = type;
  }
  production = false;

  constructor(private goodreceiptService: GoodreceiptService, private router: Router, private alertifyService: AlertifyService,public datepipe: DatePipe, public authService: AuthService, private printService: PrintService) {
    this.storeSelected = this.authService.storeSelected();
    this.customizeText = this.customizeText.bind(this);
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
  customizeText(e) {

    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  @ViewChild('template', { static: false }) template;
  functionId = "Adm_GoodReceipt";

  onToolbarPreparing(e) {
    if (this.authService.checkRole(this.functionId, '', 'I')) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: this.lguAdd,
          onClick: this.newGoodReceipt.bind(this)
        }
      });
    }
  }
  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    // this.loadData();
  }
  // loadData() {
  //   console.log("this.storeSelected.companyCode", this.storeSelected.companyCode);
  //   console.log("this.storeSelected.companyCode", this.storeSelected.storeId);
  //   this.goodreceiptService.getByStore(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any) => {

  //     this.list = response.data;
  //     console.log("this.list", this.list);
  //   });
  // }

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
    this.goodreceiptService.getGoodsReceiptList(store.companyCode, store.storeId,  status, fromStr, toStr, key, user).subscribe((response: any) => {
    // this.inventory.getInventoryList(this.authService.storeSelected().companyCode, '', store.storeId, 'R', '', '', '', '', user).subscribe((response: any) => {
      if (response.success) {
        // response.data.forEach(el => {
        //   if (el.status == 'C' && el.isCanceled == 'Y') {
        //     el.status = 'Canceled';
        //   }
        // }); 
        this.list = response.data.filter(x=>x.type?.toLowerCase() !== "production");
      
        // console.log("this.inventoryList R:", this.inventoryList);
        this.totalBill = response.data?.filter(x=>x.type?.toLowerCase() !== "production").length ?? 0;
        this.cancelBill = response.data?.filter(x => x.status?.toLowerCase()  === 'canceled' || x.status?.toLowerCase()  === 'n' && x.type?.toLowerCase() !== "production")?.length ?? 0;
        this.closedBill = response.data?.filter(x => x.status?.toLowerCase()  === 'closed' || x.status?.toLowerCase()  === 'c' && x.type?.toLowerCase() !== "production")?.length ?? 0; 
        this.openBill = response.data?.filter(x => x.status?.toLowerCase() === 'open' || x.status?.toLowerCase() === 'o' && x.type?.toLowerCase() !== "production")?.length ?? 0; 
        this.saveBill = this.list;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
    });
  }

  newGoodReceipt() {
    this.goodreceipt = new TGoodsReceiptHeader();
    // this.router.navigate['/goodreceipt/m=i'];
    this.router.navigate(["admin/goodreceipt", 'i', '']);
  }
  viewDetail(data: any) {
    // debugger;
    console
    this.router.navigate(["admin/goodreceipt", 'e', data.invtid]);
  }
  storeNameColumn_calculateCellValue(rowData) {
    let value = rowData.storeId;
    if (rowData.storeName !== null && rowData.storeName !== undefined)
      value = rowData.storeId + " - " + rowData.storeName;
    return value;
  }

  // PrintDetail(data: any)
  // {
  //   this.goodreceiptService.getReceipt(data.invtid, data.storeId, data.companyCode).subscribe((response: any) => {
  //     this.printService.changeParamGoodsReceipt(response);
  //   });
  // }

  PrintDetail(data) {
    console.log("data", data);
    this.router.navigate(["admin/goodsreceipt/print", data.invtid]).then(() => {
      // window.location.reload();
    });
  }

}
