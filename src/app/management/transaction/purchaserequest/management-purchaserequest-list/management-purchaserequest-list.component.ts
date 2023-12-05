import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TPurchaseOrderHeader, TPurchaseRequestHeader } from 'src/app/_models/purchase';
import { AuthService } from 'src/app/_services/auth.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { purchaseRequestService } from 'src/app/_services/transaction/puchaserequest.service';
import Swal from 'sweetalert2';
import { status } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { DxDateBoxComponent, DxSelectBoxComponent, DxTextBoxComponent } from 'devextreme-angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-management-purchaserequest-list',
  templateUrl: './management-purchaserequest-list.component.html',
  styleUrls: ['./management-purchaserequest-list.component.scss'],
  providers: [
    DatePipe
  ],
})
export class ManagementPurchaseRequestListComponent implements OnInit {
  list: TPurchaseRequestHeader[];
  docStatus: any[] = status.InventoryDocument;
  lguAdd: string = "Add";
  fromdate = "";
  todate = "";
  totalBill = 0;
  openBill = 0;
  cancelBill = 0;
  closedBill = 0;
  saveBill: any = [];
  selectType = "";
  functionId = "Adm_PurchaseRequest";
  production = false;

  statusOptions: any = [
    { name: 'All', value: '' },
    { name: 'Closed', value: 'C' },
    { name: 'Canceled', value: 'N' },
    { name: 'Open', value: 'O' },
  ];

  constructor(public authService: AuthService, private purchaseService: purchaseRequestService, private alertifyService: AlertifyService, private router: Router,
    private printService: PrintService, public datepipe: DatePipe) {
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
  @ViewChild('transId', { static: false }) transId: DxTextBoxComponent;
  @ViewChild('toCalendar', { static: false }) toCalendar: DxDateBoxComponent;
  @ViewChild('fromCalendar', { static: false }) fromCalendar: DxDateBoxComponent;
  @ViewChild('cbbStatus', { static: false }) cbbStatus: DxSelectBoxComponent;

  ngAfterViewInit() {
    let now = new Date();
    let from = now.setDate(1);
    this.fromdate = this.datepipe.transform(from, 'yyyy-MM-dd');
    this.todate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    setTimeout(() => {
      console.log("1");
      this.loadList();
    }, 50);
  }

  filterbills(type) {
    debugger;
    this.list = this.saveBill;
    if (type === "All") {
      this.list = this.saveBill;
    }
    if (type === "C") {
      this.list = this.list.filter(x => x.status?.toLowerCase() === 'closed' || x.status?.toLowerCase() === 'c');
    }
    if (type === "N") {
      this.list = this.list.filter(x => x.status?.toLowerCase() === 'canceled' || x.status?.toLowerCase() === 'n');
    }
    if (type === "O") {
      this.list = this.list.filter(x => x.status.toLowerCase() === 'open' || x.status.toLowerCase() === 'o');
    }
    this.selectType = type;
  }


  ngOnInit() {
    this.production = environment.production;

    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    // this.loadList();
  }
  customizeText(e) {

    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  onToolbarPreparing(e) {
    if (this.authService.checkRole(this.functionId, '', 'I')) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: this.lguAdd,
          onClick: this.newPromotion.bind(this)
        }
      });
    }
  }

  newPromotion() {
    this.router.navigate(["admin/purchaserequest/new"]);
  }
  createGrpo(data) {
    this.router.navigate(["admin/purchaseRequest/goodsreturn/", data.data.purchaseId, data.data.companyCode, data.data.storeId]);
    // :id/:companycode/:storeid
    // this.alertifyService.warning('Function not response.');
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'Do you want to delete this promotion',
    //   icon: 'question',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes',
    //   cancelButtonText: 'No'
    // }).then((result) => {
    //   if (result.value) {
    //     this.purchaseService.removePromotion(data.data.promoId,"CP001").subscribe((response: any)=>{
    //       debugger;
    //       if(response.success)
    //       {
    //         debugger;
    //         this.alertifyService.success('Remove promotion '+ data.data.promoId +' completed successfully. ');
    //         this.loadList();
    //       }
    //       else
    //       {
    //         this.alertifyService.warning('Remove promotion failed. Message: ' + response.message);
    //       }
    //     });

    //   }
    // });
  }
  viewDetail(data) {
    debugger;
    this.router.navigate(["admin/purchaserequest", "edit", data.data.purchaseId]);
    //  this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
  }
  printGrpo(data) {
    this.router.navigate(["admin/print/purchaserequest", data.data.purchaseId]);
  }
  cardNameColumn_calculateCellValue(rowData) {
    let value = rowData.cardCode;
    if (rowData.cardName !== null && rowData.cardName !== undefined)
      value = rowData.cardCode + " - " + rowData.cardName;
    return value;
  }

  loadList() {
    let fromStr = '';
    let toStr = '';
    let key = '';
    let status = '';
    // if (this.production === false) {
      let from = this.fromCalendar.value;
      let to = this.toCalendar.value;
      status = this.cbbStatus.value;
      key = this.transId.value;
      if (from !== null && from !== undefined) {
        fromStr = this.datepipe.transform(from, 'yyyy-MM-dd');
      }

      if (to !== null && to !== undefined) {
        toStr = this.datepipe.transform(to, 'yyyy-MM-dd');
      }
    // }

    console.log("aaaa", fromStr, toStr, key, status);
    let comp = this.authService.storeSelected();
    // this.purchaseService.getByType(comp.companyCode, comp.storeId, fromStr, toStr, key, status).subscribe((response: any) => {
    //   if (response.length > 0) {
    //     // this.list.forEach(el => {
    //     //   el.status = this.statusOptions.filter(x => x.value == el.status)[0].name;
    //     // });
    //     this.list = response;
    //     this.totalBill = response.data?.length ?? 0;
    //     this.cancelBill = response.data?.filter(x => x.status?.toLowerCase()  === 'canceled' || x.status?.toLowerCase()  === 'n')?.length ?? 0;
    //     this.closedBill = response.data?.filter(x => x.status?.toLowerCase()  === 'closed' || x.status?.toLowerCase()  === 'c')?.length ?? 0; 
    //     this.openBill = response.data?.filter(x => x.status.toLowerCase() === 'open' || x.status.toLowerCase() === 'o')?.length ?? 0; 
    //     this.saveBill = this.list;
    //   }

    // });
    this.purchaseService.getAll(comp.companyCode, comp.storeId, fromStr, toStr, key, status).subscribe((response: any) => {
      if (response.success = true) {
        this.list = response.data;
        console.log("response", response);
        // if(this.isFilter)
        // this.list = response.filter(x=>x.status.toLowerCase() ==='o');
        // this.list.forEach(el => {
        //   if(el.isCanceled==='1')
        //   el.status = 'Canceled'
        //   el.status = this.statusOptions.filter(x => x.value == el.status)[0].name;
        // });
        this.list = response.data;
        this.totalBill = response.data?.length ?? 0;
        this.cancelBill = response.data?.filter(x => x.status?.toLowerCase()  === 'canceled' || x.status?.toLowerCase()  === 'n')?.length ?? 0;
        this.closedBill = response.data?.filter(x => x.status?.toLowerCase()  === 'closed' || x.status?.toLowerCase()  === 'c')?.length ?? 0; 
        this.openBill = response.data?.filter(x => x.status.toLowerCase() === 'open' || x.status.toLowerCase() === 'o')?.length ?? 0; 
        this.saveBill = this.list;
      }

    });
  }

  PrintDetail(data) {
    console.log("data", data);
    this.router.navigate(["admin/purchaserequest/print", data.purchaseId]).then(() => {
      // window.location.reload();
    });
  }
}
