import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TGoodsReceiptPoheader } from 'src/app/_models/grpo';
import { AuthService } from 'src/app/_services/auth.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { GoodsreturnService } from 'src/app/_services/transaction/goodsreturn.service';
import { DatePipe } from '@angular/common';
import { DxDateBoxComponent, DxSelectBoxComponent, DxTextBoxComponent } from 'devextreme-angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-management-goodsreturn-list',
  templateUrl: './management-goodsreturn-list.component.html',
  styleUrls: ['./management-goodsreturn-list.component.scss']
})
export class ManagementGoodsReturnListComponent implements OnInit {

  list: TGoodsReceiptPoheader[];
  issueId: string;
  // lguAdd: string = "Add";
  fromdate = "";
  todate = "";
  totalBill = 0;
  openBill = 0;
  cancelBill = 0;
  closedBill = 0;
  saveBill: any = [];
  selectType = "";
  production = false;

  statusOptions: any = [
    { name: 'All', value: '' },
    { name: 'Closed', value: 'C' },
    { name: 'Canceled', value: 'N' },
    { name: 'Open', value: 'O' },
  ];


  constructor(public authService: AuthService, private goodsreturnService: GoodsreturnService, private alertifyService: AlertifyService, private router: Router,
    private printService: PrintService, public datepipe: DatePipe) {
    this.customizeText = this.customizeText.bind(this);
    // Chuyển đổi ngôn ngữ
    const lgu = localStorage.getItem('language');
    // if (lgu === "vi") {
    //   this.lguAdd = "Thêm";
    // } else if (lgu === "en") {
    //   this.lguAdd = "Add";
    // } else {
    //   console.log("error");
    // }
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
      this.list = this.list.filter(x => x.status?.toLowerCase() === 'open' || x.status?.toLowerCase() === 'o');
    }
    this.selectType = type;
  }

  customizeText(e) {

    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  ngOnInit() {
    this.production = environment.production;
    // this.loadList();
  }

  onToolbarPreparing(e) {
    // e.toolbarOptions.items.unshift({
    //   location: 'before',
    //   widget: 'dxButton',
    //   options: {
    //     width: 136,
    //     icon: "add", type: "default", text: this.lguAdd,
    //     onClick: this.newPromotion.bind(this)
    //   }
    // });
  }

  newPromotion() {
    this.router.navigate(["admin/purchaserequest"]);
  }
  delPromotion(data) {
    this.alertifyService.warning('Function not response.');
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
    this.router.navigate(["admin/goodsreturn", "edit", data.data.purchaseId, data.data.companyCode, data.data.storeId]);
    //  this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
  }
  cardNameColumn_calculateCellValue(rowData) {
    let value = rowData.cardCode;
    if (rowData.cardName !== null && rowData.cardName !== undefined)
      value = rowData.cardCode + " - " + rowData.cardName;
    return value;
  }
  printgoodsreturn(data) {
    this.router.navigate(["admin/print/goodsreturn", data.data.purchaseId]);
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

    let comp = this.authService.storeSelected();
    this.goodsreturnService.getAll(comp.companyCode, comp.storeId, fromStr, toStr, key, status).subscribe((response: any) => {
      console.log("response", response);
      if (response.success = true) {
        this.list = response.data;
        this.totalBill = response.data?.length ?? 0;
        this.cancelBill = response.data?.filter(x => x.status?.toLowerCase() === 'canceled' || x.status?.toLowerCase() === 'n')?.length ?? 0;
        this.closedBill = response.data?.filter(x => x.status?.toLowerCase() === 'closed' || x.status?.toLowerCase() === 'c')?.length ?? 0;
        this.openBill = response.data?.filter(x => x.status?.toLowerCase() === 'open' || x.status?.toLowerCase() === 'o')?.length ?? 0;
        this.saveBill = this.list;
        //  console.log(this.list)
        //  this.list.forEach(x=>
        //   {
        //     if(x.isCanceled == '1')
        //     {
        //       x.docStatus ='Canceled';
        //     }
        //   });
        //   console.log(this.list)
      }
    });
  }

  PrintDetail(data) {
    console.log("data", data);
    this.router.navigate(["admin/print/goodsreturn", data.purchaseId]).then(() => {
      // window.location.reload();
    });
  }
}
