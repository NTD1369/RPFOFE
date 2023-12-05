import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDateBoxComponent, DxSelectBoxComponent, DxTextBoxComponent } from 'devextreme-angular';
import { AuthService } from 'src/app/_services/auth.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventorypostingService } from 'src/app/_services/transaction/inventoryposting.service';

@Component({
  selector: 'app-management-inventory-posting',
  templateUrl: './management-inventory-posting.component.html',
  styleUrls: ['./management-inventory-posting.component.scss']
})
export class ManagementInventoryPostingComponent implements OnInit {



  inventoryList: any;
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


  constructor(public authService: AuthService, private inventorypostingService: InventorypostingService,  public datepipe: DatePipe,private alertifyService: AlertifyService, private router: Router,
    private printService: PrintService) {
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
  storeNameColumn_calculateCellValue(rowData) {
    let value = rowData.storeId;
    if (rowData.storeName !== null && rowData.storeName !== undefined)
      value = rowData.storeId + " - " + rowData.storeName;
    return value;
  }
  functionId = "Adm_InvPosting";
  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    // this.loadList();
  }
  // loadList() {
  //   let store = this.authService.storeSelected();
  //   this.inventorypostingService.getByStore(store.companyCode, store.storeId).subscribe((response: any) => {

  //     this.inventoryList = response.data;
  //     console.log("this.inventoryList", this.inventoryList);
  //     this.totalBill = response.data?.length ?? 0;
  //     this.cancelBill = response.data?.filter(x => x.status?.toLowerCase()  === 'canceled' || x.status?.toLowerCase()  === 'n')?.length ?? 0;
  //     this.closedBill = response.data?.filter(x => x.status?.toLowerCase()  === 'closed' || x.status?.toLowerCase()  === 'c')?.length ?? 0; 
  //     this.openBill = response.data?.filter(x => x.status.toLowerCase() === 'open' || x.status.toLowerCase() === 'o')?.length ?? 0; 
  //     this.saveBill = this.inventoryList;
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
    this.inventorypostingService.getInventoryPostingList(store.companyCode, store.storeId,  status, fromStr, toStr, key, user).subscribe((response: any) => {
    // this.inventory.getInventoryList(this.authService.storeSelected().companyCode, '', store.storeId, 'R', '', '', '', '', user).subscribe((response: any) => {
      if (response.success) {
      
        this.inventoryList = response.data;
        // console.log("this.inventoryList R:", this.inventoryList);
        this.totalBill = response.data?.length ?? 0;
        this.cancelBill = response.data?.filter(x => x.status?.toLowerCase()  === 'canceled' || x.status?.toLowerCase()  === 'n')?.length ?? 0;
        this.closedBill = response.data?.filter(x => x.status?.toLowerCase()  === 'closed' || x.status?.toLowerCase()  === 'c')?.length ?? 0; 
        this.openBill = response.data?.filter(x => x.status.toLowerCase() === 'open' || x.status.toLowerCase() === 'o')?.length ?? 0; 
        this.saveBill = this.inventoryList;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
    });
  }
  newModel() {
    // this.inventory = new TGoodsReceiptHeader();
    // this.router.navigate['/goodreceipt/m=i'];
    this.router.navigate(["admin/inventory/posting", 'i', '']);
  }
  viewDetail(data: any) {
    debugger;
    this.router.navigate(["admin/inventory/posting", 'e', data.ipid]);
  }

  // PrintDetail(data: any) {
  //   console.log("data", data);
  //   this.inventorypostingService.getInventoryPosting(data.companyCode, data.storeId, data.ipid).subscribe((response: any) => {
  //     console.log("response", response);
  //     this.printService.changeParamInvPosting(response);
  //   });
  // }
  PrintDetail(data) {
    this.router.navigate(["admin/inventoryposting/print", data.ipid]).then(() => {
      // window.location.reload();
    });
  }
}


