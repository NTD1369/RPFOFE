import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent, DxDateBoxComponent, DxSelectBoxComponent, DxTextBoxComponent } from 'devextreme-angular';
import { Item } from 'src/app/_models/item';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { TSalesHeader } from 'src/app/_models/tsaleheader';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import query from 'devextreme/data/query';
import { debug } from 'console';
import { MStore } from 'src/app/_models/store';
import { DatePipe } from '@angular/common';
import { TSalesLine } from 'src/app/_models/tsaleline';
import { ControlService } from 'src/app/_services/data/control.service';
import { FormControl } from '@angular/forms';
import { LoadingService } from 'src/app/_services/common/loading.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { ShortcutService } from 'src/app/_services/data/shortcut.service';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/_services/common/common.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { ShopReasonInputComponent } from '../tools/shop-reason-input/shop-reason-input.component';
import { ShopApprovalInputComponent } from '../tools/shop-approval-input/shop-approval-input.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PermissionService } from 'src/app/_services/system/permission.service';
export class IPermission {
  controlId: string;
  permission: string;
  result: boolean;
}
enum LoadingIndicator {
  OPERATOR,
  MANUAL,
  ASYNC_PIPE
}

@Component({
  selector: 'app-shop-bill-list',
  templateUrl: './shop-bill-list.component.html',
  styleUrls: ['./shop-bill-list.component.scss'],
  providers: [
    DatePipe
  ],
})

export class ShopBillListComponent implements OnInit, AfterViewInit {
  LoadingIndicator = LoadingIndicator;
  minWidthAction = 150;
  bills: TSalesHeader[];
  pagination: Pagination;
  functionId = "Adm_BillSearch";
  marked = false;
  userParams: any = {};
  totalBill = 0;
  exchangeBill = 0;
  returnBill = 0;
  cancelBill = 0;
  closedBill = 0;
  controlList: any[];

  permissionDic: IPermission[] = [];
  checkPermission(controlId: string, permission: string): boolean {
    // debugger;
    let result = false;
    let re = this.permissionDic.find(x => x.controlId === controlId && x.permission === permission);
    if (re === null || re === undefined) {
      let rs = this.authService.checkRole(this.functionId, controlId, permission);
      let per = new IPermission();
      per.controlId = controlId;
      per.permission = permission;
      per.result = rs;
      this.permissionDic.push(per);
      result = true;
    }
    else {
      result = re.result;
    }

    return result;
  }
  public innerWidth: any;
  constructor(private billService: BillService,  private shiftService: ShiftService,  private modalService: BsModalService,
     private permissionService: PermissionService,  private basketService: BasketService, private commonService: CommonService, 
     private shortcutService: ShortcutService, public loadingService: LoadingService, private controlService: ControlService, 
     private alertify: AlertifyService, private routeNav: Router, private authService: AuthService, public datepipe: DatePipe,
    private route: ActivatedRoute) {
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.customizeText = this.customizeText.bind(this);


  }
  closePopup() {
    this.popupVisible = false;
  }
  customizeText(e) {
    // debugger;
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  isLoading = true;
  ngAfterViewInit() {

    // debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function (item) {
      // Do stuff here
      if (item !== null && item !== undefined) {
        item.classList.add('hide');
        // console.log('bill list');
      }
    });



    // paymentMenu

    this.loadingService.startLoading(this, LoadingIndicator.MANUAL);
    let now = new Date();
    let from = now.setDate(now.getDate() - 0);


    this.fromdate = this.datepipe.transform(from, 'yyyy-MM-dd');
    this.todate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.route.data.subscribe(data => {
      // debugger;
      let result = data['bills'];
      if (result.success) {
        this.bills = result.data.filter(x => x.status !== 'Hold');//.result;
        this.totalBill = this.bills.length;
        this.cancelBill = this.bills.filter(x => x.status === 'Canceled').length;
        this.closedBill = this.bills.filter(x => x.status === 'Closed').length;
        this.exchangeBill = this.bills.filter(x => x.salesMode.toLowerCase() === 'ex' || x.salesMode.toLowerCase() === 'exchange').length;
        this.returnBill = this.bills.filter(x => x.salesMode.toLowerCase() === 'return').length;
        this.saveBill = this.bills;
        console.log("this.bills",this.bills);
      }
      else {
        this.alertify.warning(result.message);
      }
      this.isLoading = false;
      this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
    });
    setTimeout(() => {
      this.loadShortcut();
    }, 100);

  }
  buttonList = [];
  loadControl() {
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
      if (response.data.length > 0) {
        //  debugger;
        this.controlList = response.data.filter(x => x.custom2 !== 'button' && x.controlType === 'GridColumn');

        this.buttonList = response.data.filter(x => x.custom2 === 'button');
        this.controlList = this.controlList.sort((a, b) => a.orderNum > b.orderNum ? 1 : -1);
        this.buttonList = this.buttonList.sort((a, b) => a.orderNum > b.orderNum ? 1 : -1);

        if(this.controlList!==null && this.controlList!==undefined && this.controlList?.length > 0)
        {
          this.controlList.forEach(control => {
            control.isView= this.checkPermission(control.controlId,'V'),
            control.isEdit=  control?.readOnly ? false : this.checkPermission(control.controlId,'E'),
            control.isInsert=  control?.readOnly ? false : this.checkPermission(control.controlId,'I')
          });
        }
        console.log(this.controlList);

        console.log("buttonList", this.buttonList);

      }
    });
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
      location: 'before',
      template: 'totalGroupCount'
    }, {
      location: 'before',
      widget: 'dxSelectBox',
      options: {
        width: 200,
        items: [{
          value: 'POS',
          text: 'POS'
        }, {
          value: '',
          text: 'Others'
        }],
        displayExpr: 'text',
        valueExpr: 'value',
        value: 'dataSource',
        onValueChanged: this.groupChanged.bind(this)
      }
    });
  }
  totalCount: number;
  groupChanged(e) {
    // this.dataGrid.instance.clearGrouping();
    // this.dataGrid.instance.columnOption(e.value, 'groupIndex', 0);
    // this.totalCount = this.getGroupCount(e.value);
    debugger;
    this.dataGrid.instance.columnOption('dataSource', "=", e.value);
  }
  getGroupCount(groupField) {
    debugger;
    let abc = query(this.bills)
      .groupBy(groupField)
      .toArray().length;
    return abc;
  }
  expanded = true;
  // routerLink="printOrder(cell.data)/shop/bills/print/{{}}/:companycode/:storeid">
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 1024) {
      this.minWidthAction = 480;
    }
    else {
      this.minWidthAction = 150;
    }
  }
  downloads = ["View", "Return", "Exchange", "Print"];
  onActionChange(e) {
    debugger;
    let actiont = e.itemData;

  }
  popupVisible = false;
  printButtonOptions: any;
  closeButtonOptions: any;
  detailButtonOptions: any;
  returnButtonOptions: any;
  exchangeButtonOptions: any;
  positionOf: string;
  bill: Order;
  showInfo(detail) {
    this.bill = detail;
    this.popupVisible = true;
  }
  dateFormat = "";
  storeSelected: MStore;
  fromdate = "";
  todate = "";
  shortCutList: any = [];
  shortcuts: ShortcutInput[] = [];

  @ViewChild('transId', { static: false }) transId: DxTextBoxComponent;
  @ViewChild('toCalendar', { static: false }) toCalendar: DxDateBoxComponent;
  @ViewChild('fromCalendar', { static: false }) fromCalendar: DxDateBoxComponent;
  @ViewChild('cbbStatus', { static: false }) cbbStatus: DxSelectBoxComponent;
  loadShortcut() {
    debugger;

    setTimeout(() => {

      this.commonService.MainShortcuts$.subscribe((data: any) => {
        // this.commonService.changeShortcuts(data);
        this.shortcuts = data;
        // console.log('main sc', data);
      })
    }, 100);
    debugger;
    setTimeout(() => {
      this.shortcuts.push(
        {
          key: ["alt + f"],
          label: "Focus From Date",
          description: "Focus From Date",
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: (e) => {
            this.fromCalendar.instance.focus();
          },
          preventDefault: true
        },
        {
          key: ["alt + t"],
          label: "Focus To Date",
          description: "Focus To Date",
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: (e) => {
            this.toCalendar.instance.focus();

          },
          preventDefault: true
        },
        {
          key: ["alt + s"],
          label: "Focus Status",
          description: "Focus Status",
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: (e) => {
            this.cbbStatus.instance.focus();

          },
          preventDefault: true
        },
        {
          key: ["alt + b"],
          label: "Focus filter text",
          description: "Focus filter text",
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: (e) => {
            this.transId.instance.focus();

          },
          preventDefault: true
        },
        {
          key: ["ctrl + r"],
          label: "Refund Order",
          description: "Refund Order",
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: (e) => {
            if (this.dataGrid.focusedRowKey !== null && this.dataGrid.focusedRowKey !== undefined && this.dataGrid.focusedRowKey !== '') {
              let order: any = this.bills.find(x => x.transId === this.dataGrid.focusedRowKey);
              if (order !== null && order !== undefined) {
                this.ReturnOrder(order)

              }

              debugger;

            }

          },
          preventDefault: true
        },
        {
          key: ["ctrl + e"],
          label: "Exchange Order",
          description: "Exchange Order",
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: (e) => {
            if (this.dataGrid.focusedRowKey !== null && this.dataGrid.focusedRowKey !== undefined && this.dataGrid.focusedRowKey !== '') {
              let order: any = this.bills.find(x => x.transId === this.dataGrid.focusedRowKey);
              if (order !== null && order !== undefined) {
                this.ExchangeOrder(order)

              }

              debugger;

            }

          },
          preventDefault: true
        },
        {
          key: ["ctrl + p"],
          label: "Print",
          description: "Print",
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: (e) => {
            if (this.dataGrid.focusedRowKey !== null && this.dataGrid.focusedRowKey !== undefined && this.dataGrid.focusedRowKey !== '') {
              let order = this.bills.find(x => x.transId === this.dataGrid.focusedRowKey);
              if (order !== null && order !== undefined) {
                this.PrintOrder(order)

              }

              debugger;

            }
          },
          preventDefault: true
        },
        {
          key: ["ctrl + d"],
          label: "Focus grid",
          description: "Focus grid",
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: (e) => {
            debugger;
            setTimeout(() => {

              if (this.bills !== null && this.bills !== undefined && this.bills?.length > 0) {

                this.dataGrid.focusedRowKey = this.bills[0].transId;

                this.dataGrid.instance.focus();

              }
            }, 100);


          },
          preventDefault: true
        },
        {
          key: ["ctrl + i"],
          label: "View Order",
          description: "View Order",
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: (e) => {
            if (this.dataGrid.focusedRowKey !== null && this.dataGrid.focusedRowKey !== undefined && this.dataGrid.focusedRowKey !== '') {
              let order: any = this.bills.find(x => x.transId === this.dataGrid.focusedRowKey);
              if (order !== null && order !== undefined) {
                this.OpenOrder(order)

              }

            }

          },
          preventDefault: true
        },

        {
          key: ["ctrl + s"],
          label: "Search & Focus grid",
          description: "Search & Focus grid",
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: (e) => {
            debugger;
            setTimeout(() => {
              this.transId.instance.focus();
              this.loadBills(this.fromCalendar.value, this.toCalendar.value, this.cbbStatus.value, '', this.transId.value, '');

            }, 10)



          },
          preventDefault: true
        },

      )
      console.log('this.shortcuts', this.shortcuts)
      this.commonService.changeShortcuts(this.shortcuts, true);


    }, 100);


  }
  ngOnInit() {
    debugger;
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.innerWidth = window.innerWidth;
    this.storeSelected = this.authService.storeSelected();
    // this.shortcuts = this.authService.getShortcutWindown(this.functionId, '');
    // this.route
    // this.loadItems();
    // debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();

    this.loadControl();
  }

  checkBtnShow(controlId, data, require) {
    let rs = false;
    if (this.checkPermission(controlId, 'V')) {
      // debugger;
      if (require) {
        // if(data.isCanceled==='N' && data.salesMode==='SALES')
        // {
        //   rs= true;
        // }
        // else
        // {

        //   rs= false;
        // }

        if (((data.collectedStatus === 'Returned' || data.collectedStatus === 'Exchanged') && data.salesMode === 'SALES') || (data.collectedStatus === "Canceled") || (data.collectedStatus === "Closed"))  {
          rs = false;
        } else {
          rs = true;
        }
      }
      else {

        rs = true;
      }
    }
    return rs;
  }
  loadBills(from, to, status, type, transId, keyword) {
    let now = new Date();
    let fromStr = '';
    let toStr = '';
    debugger;
    if (from !== null && from !== undefined) {
      // from = now.setDate(now.getDate() - 60 ); 
      fromStr = this.datepipe.transform(from, 'yyyy-MM-dd');
    }

    if (to !== null && to !== undefined) {
      // to = now;
      toStr = this.datepipe.transform(to, 'yyyy-MM-dd');
    }
    if (status !== null && status !== undefined) {
      if (status == 'C') {
        status = 'C';
      }
      if (status == 'N') {
        // status = 'C';
      }
      if (status == 'Ex') {

      }
      if (status == 'R') {

      }

    }
    let viewBy = this.authService.getCurrentInfor().username;
    this.billService.getByType(this.storeSelected.companyCode, this.storeSelected.storeId, type,
      fromStr, toStr, 'POS', transId, status, '', keyword, viewBy).subscribe(
       
        (response: any) => {
        
          if (response.success) {
            debugger;
            // let list = response.data;
            // let abc =  list.filter(x=>x.companyCode === "CP001");
            // let abcd =  list.find(x=>x.transId === "SO100100018347");
          
            this.bills = response.data.filter(x => x.status !== 'Hold');//.result;
            this.totalBill = this.bills.length;
            this.cancelBill = this.bills.filter(x => x.status === 'Canceled').length;
            this.closedBill = this.bills.filter(x => x.status === 'Closed').length;
            this.exchangeBill = this.bills.filter(x => x.salesMode.toLowerCase() === 'ex' || x.salesMode.toLowerCase() === 'exchange').length;
            this.returnBill = this.bills.filter(x => x.salesMode.toLowerCase() === 'return').length;
            this.saveBill = this.bills;
            setTimeout(() => {

              if (this.bills !== null && this.bills !== undefined && this.bills?.length > 0) {
                // this.focusedRowKey= this.items[0].keyId;
                this.dataGrid.focusedRowKey = this.bills[0].transId;
                // const scrollTo = document.querySelector(".gridContainerX");
                // if (scrollTo) {
                //   scrollTo.scrollIntoView({ behavior: 'smooth', block: 'center'});
                // }
                this.dataGrid.instance.focus();
                // this.focusedcelKey = 1;
                // this.dataGrid.instance.navigateToRow(1);
              }
            }, 1000);
          }
          else {
            this.alertify.warning(response.message);
          }
        })
  }
  saveBill: any = [];
  statusOptions: any = [
    { name: 'All', value: '' },
    { name: 'Closed', value: 'C' },
    { name: 'Canceled', value: 'N' },
    // { name: 'Hold', value:'H'},
    { name: 'Open', value: 'O' },
    // { name: 'Exchange', value:'Ex'},
    // { name: 'Return', value:'R'},
  ];
  filterbills(type) {
    debugger;
    this.bills = this.saveBill;
    if (type === "All") {
      this.bills = this.saveBill;
    }
    if (type === "C") {
      this.bills = this.bills.filter(x => x.status === 'Closed');
    }
    if (type === "N") {
      this.bills = this.bills.filter(x => x.status === 'Canceled');
    }
    if (type === "Ex") {
      this.bills = this.bills.filter(x => x.salesMode.toLowerCase() === 'ex' || x.salesMode.toLowerCase() === 'exchange' || x.salesMode.toLowerCase() === 'return');
    }
    if (type === "R") {
      this.bills = this.bills.filter(x => x.salesMode.toLowerCase() === 'return');
    }

  }
  OpenOrder(order: Order) {
    debugger;
    window.open('shop/bills/' +  order.transId +'/'+ order.companyCode+'/'+order.storeId, "_blank");
    // ['MyCompB', {id: "someId", id2: "another ID"}]
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]).then(() => {
    //   window.location.reload();
    // });
  }
  PrintOrder(order) {
    //  /shop/bills/print//:companycode/:storeid
    this.routeNav.navigate(["shop/bills/print", order.transId, order.companyCode, order.storeId]).then(() => {
      window.location.reload();
    });
  }
  CheckOutOrder(order: Order) {
    debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
    this.routeNav.navigate(["shop/bills/checkout", order.transId, order.companyCode, order.storeId]).then(() => {
      window.location.reload();
    });
  }
  // setItemExchangeToBasket(lines: TSalesLine[]){
  //   let Lines= [];
  //   lines.forEach(async item => {

  //     let itemX = this.items.find(x=>x.itemCode === item.itemCode && x.uomCode===item.uomCode);
  //     debugger;
  //     if(itemX!==null && itemX!==undefined && item.openQty > 0)
  //     {
  //       // let infor=ressponse[0];

  //       if(item.slocId!==undefined&& item.slocId!==null)
  //       {
  //         itemX.slocId= item.slocId;
  //       }
  //       else
  //       {
  //         itemX.slocId= this.storeSelected.whsCode;
  //       }
  //       let itembasket = this.basketService.mapProductItemtoBasket(itemX, 1);
  //       if(itembasket.productName===null || itembasket.productName===undefined)
  //       {
  //         itembasket.productName = itemX.itemDescription;
  //       }
  //       itembasket.quantity = -item.openQty;
  //       // itembasket.openQty=item.openQty;
  //       if(itembasket.isCapacity)
  //       {
  //         itembasket.appointmentDate = item.appointmentDate.toString();
  //         itembasket.timeFrameId = item.timeFrameId.toString();
  //         itembasket.storeAreaId = item.storeAreaId.toString();
  //         itembasket.quantity = item.quantity;
  //         itembasket.note = item.remark;

  //       }
  //       itembasket.prepaidCardNo = item.prepaidCardNo;

  //       itembasket.isSerial = item.isSerial;
  //       itembasket.isVoucher = item.isVoucher;
  //       itembasket.memberDate = item.memberDate;
  //       itembasket.memberValue = item.memberValue;
  //       itembasket.startDate = item.startDate;
  //       itembasket.endDate = item.endDate;
  //       itembasket.itemType = item.itemType;
  //       itembasket.price = item.price;
  //       itembasket.discountType = item.discountType;
  //       itembasket.discountValue = item.discountAmt;
  //       itembasket.promotionIsPromo = item.isPromo;
  //       itembasket.salesTaxCode = item.taxCode;
  //       itembasket.salesTaxRate = item.taxRate;
  //       itembasket.taxAmt = item.taxAmt;
  //       itembasket.promotionType = item.promoType; 
  //       itembasket.baseLine = item.lineId;
  //       itembasket.baseTransId = item.transId;
  //       // this.basketService.addItemBasketToBasket(itembasket,  -item.openQty);
  //       Lines.push(itembasket);
  //     } 

  //   });
  //   // if(Lines!==null && Lines!==undefined)
  //   // {
  //   //   debugger;
  //   //   this.basketService.addItemListBasketToBasket(Lines, true);
  //   // }

  // }
  ExchangeOrder(order: Order) {
    debugger;
    let checkAction = this.authService.checkRole('Spc_ExchangeOrder', '', 'I');
    let checkApprovalRequire = this.authService.checkRole('Spc_ExchangeOrder', '', 'A');
    if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
    {
      checkAction = false;
    }
    if (checkAction) {

      this.redirectToExchange(order)
    }
    else {
      // const initialState = {
      //   title: 'Permission denied',
      // };
      let permissionModel= { functionId: 'Spc_ExchangeOrder', functionName: 'Exchange Order', controlId: '', permission: 'I'};
      const initialState = {
          title: 'Exchange Order - ' + 'Permission denied', 
          freeApprove : true,
          permissionModel : permissionModel
      };
      let modalApprovalRef = this.modalService.show(ShopApprovalInputComponent, {
        initialState,
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-xl medium-center-modal'
        // class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
      });
      modalApprovalRef.content.outEvent.subscribe((received: any) => {
        if (received.isClose) {
          modalApprovalRef.hide();
        }
        else {
          debugger;
          this.redirectToExchange(order);
          modalApprovalRef.hide();

          // let modelLogin = {
          //   username: received.user, password: received.pass
          // }
         
          // let code = (received.customCode ?? '');
          // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, code, 'Spc_ExchangeOrder', '', 'I').subscribe((response: any) => {
          //   // const user = response;
          //   // debugger;
          //   if (response.success) {
          //     let note = (received.note ?? '');
          //     if (note !== null && note !== undefined && note !== '') {
          //       this.basketService.changeNote(note).subscribe((response) => {
  
          //       });
          //       this.alertify.success('Set note successfully completed.');
          //     }
            
          //   }
          //   else {
          //     Swal.fire({
          //       icon: 'warning',
          //       title: 'Exchange Order',
          //       text: response.message
          //     });
          //   }
          // })
        }

      });

    }
    
    // ['MyCompB', {id: "someId", id2: "another ID"}]
    // this.routeNav.navigate(["shop/bills/exchange", order.transId, order.companyCode, order.storeId]);

  }

  redirectToExchange(order)
  {
    let basket = this.basketService.getCurrentBasket();
    if (basket !== null && basket !== undefined) {
      this.basketService.deleteBasket(basket).subscribe(() => {

      });
      if (this.authService.getShopMode() === 'FnB') {
        this.routeNav.navigate(["shop/order/exchange", order.transId]).then(() => {
          // window.location.reload();
        });
      }
      if (this.authService.getShopMode() === 'Grocery') {
        this.routeNav.navigate(["shop/order-grocery/exchange", order.transId]).then(() => {
          // window.location.reload();
        });

      }
    }
    else {
      if (this.authService.getShopMode() === 'FnB') {
        this.routeNav.navigate(["shop/order/exchange", order.transId]).then(() => {
          // window.location.reload();
        });
      }
      if (this.authService.getShopMode() === 'Grocery') {
        this.routeNav.navigate(["shop/order-grocery/exchange", order.transId]).then(() => {
          // window.location.reload();
        });

      }
    }

  }


  CheckInOrder(order: Order) {
    debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
    // checkin-by-orderid/:id/:companycode/:storeid
    this.routeNav.navigate(["shop/checkin-by-orderid", order.transId, order.companyCode, order.storeId]).then(() => {
      window.location.reload();
    });
  }
  checkCancelOrder(order) {
    let rs = true;
    let storeSetting = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId);
    if (storeSetting !== null && storeSetting !== undefined && storeSetting?.length > 0) {
      let voidSetting = storeSetting.find(x => x.settingId === 'VoidOrder');
      if (voidSetting !== null && voidSetting !== undefined) {
        if (voidSetting.settingValue === "BeforeSyncData" && order.syncMWIStatus === 'Y') {
          rs = false;
          this.alertify.warning("The order cannot be canceled because the order has been synced with MWI.");
        }
      }
    }
    return rs;
  }

  focusedRowKey = "";
  focusedcelKey = -1;
  autoNavigateToFocusedRow = true;
  // @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  
  // dayOfCancel = 5;
  // checkDayOfOrder() {
  //   debugger;
  //   console.log('this.authService.getVoidReturnSetting()',this.authService.getVoidReturnSetting());
  //   let setting = this.authService.getVoidReturnSetting().find(x => x.type.replace(/\s/g, "") === 'Retail' && x.code.replace(/\s/g, "") === 'SOVoidDay');
  //   if (setting !== null && setting !== undefined) {
  //     this.dayOfCancel = setting.value;
  //   }
  // }
  // addDays(days: number): Date {
  //   var futureDate = new Date(this.order.createdOn);
  //   futureDate.setDate(futureDate.getDate() + days);
  //   return futureDate;
  // }
  // cancelOrder(order) {


  //   if (this.shiftService.getCurrentShip() == null || this.shiftService.getCurrentShip() === undefined) { 
  //     Swal.fire({
  //       icon: 'warning',
  //       title: 'Shift',
  //       text: "You are not on the shift. Please create your shift"
  //     });
  //   }
  //   else
  //   {
  //     let cancleLimitDate = this.addDays(this.dayOfCancel);// date.setDate(date.getDate() + );
  //     let now = new Date();
  //     if (order.status.toLocaleLowerCase()!=='h' && order.status.toLocaleLowerCase()!=='hold' && now > cancleLimitDate) {
  //       Swal.fire({
  //         icon: 'warning',
  //         title: 'Payment',
  //         text: "Cant void order. Because order date out of range!"
  //       });
  //     }
  //     else {
  //       let checkAction = this.authService.checkRole('Spc_CancelOrder', '', 'I');
  //       if (checkAction) {
  //         this.cancelAction('');
  //       }
  //       else {
  //         const initialState = {
  //           title: 'Permission denied',
  //         };
  //         let modalApprovalRef = this.modalService.show(ShopApprovalInputComponent, {
  //           initialState,
  //           animated: true,
  //           keyboard: true,
  //           backdrop: true,
  //           ignoreBackdropClick: true,
  //           ariaDescribedby: 'my-modal-description',
  //           ariaLabelledBy: 'my-modal-title',
  //           class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
  //         });
  //         modalApprovalRef.content.outEvent.subscribe((received: any) => {
  //           if (received.isClose) {
  //             modalApprovalRef.hide();
  //           }
  //           else {
  //             debugger;
  
  //             this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, 'Spc_CancelOrder', '', 'I').subscribe((response: any) => {
  //               // const user = response;
  //               // debugger;
  //               if (response.success) {
  //                 this.cancelAction(received.user);
  //                 modalApprovalRef.hide();
  //               }
  //               else {
  //                 Swal.fire({
  //                   icon: 'warning',
  //                   title: 'Cancel Order',
  //                   text: response.message
  //                 });
  //               }
  //             })
  //           }
  
  //         });
  
  //       }
  //     }
  //   }

  //   // Swal.fire({
  //   //   title: 'Submit your reason',
  //   //   input: 'text',
  //   //   inputAttributes: {
  //   //     autocapitalize: 'off'
  //   //   },
  //   //   showCancelButton: true,
  //   //   confirmButtonText: 'Submit',
  //   //   showLoaderOnConfirm: true,
  //   //   allowOutsideClick: () => !Swal.isLoading()
  //   // }).then((result) => {
  //   //   if (result.isConfirmed) {
  //   //     debugger;
  //   //     this.billService.getBill(order.transId, order.companyCode, order.storeId).subscribe((response: any) => {
  //   //       if (this.checkCancelOrder(order)) {
  //   //         let orderCancel = response.data;
  //   //         orderCancel.reason = result.value;
  //   //         orderCancel.totalAmount = -orderCancel.totalAmount;
  //   //         orderCancel.totalDiscountAmt = -orderCancel.totalDiscountAmt;
  //   //         orderCancel.totalPayable = -orderCancel.totalPayable;
  //   //         orderCancel.totalReceipt = -orderCancel.totalReceipt;
  //   //         orderCancel.amountChange = -orderCancel.amountChange;
  //   //         orderCancel.lines.forEach(line => {
  //   //           line.baseLine = parseInt(line.lineId);
  //   //           line.baseTransId = line.transId;
  //   //           line.quantity = -line.quantity;
  //   //           line.lineTotal = -line.lineTotal;
  //   //         });

  //   //         orderCancel.payments.forEach(line => {
  //   //           line.totalAmt = -line.totalAmt;
  //   //           line.chargableAmount = -line.chargableAmount;
  //   //           line.collectedAmount = -line.collectedAmount;
  //   //         });
  //   //         orderCancel.lines.forEach(line => {
  //   //           let BomLine = line.lines;
  //   //           if (BomLine !== null && BomLine !== undefined && BomLine.length > 0) {
  //   //             BomLine.forEach(lineBOM => {
  //   //               orderCancel.lines.push(lineBOM);
  //   //             });
  //   //           }
  //   //         });
  //   //         this.billService.cancelOrder(orderCancel).subscribe((response: any) => {
  //   //           if (response.success) {
  //   //             console.log("response.success", response.data);

  //   //             setTimeout(() => {
  //   //               window.print();
  //   //             }, 1000);
  //   //             // this.alertify.success('Cancel completed successfully. ' + response.message);
  //   //             // window.location.reload();
  //   //           }
  //   //           else {
  //   //             this.alertify.warning(response.message);
  //   //           }
  //   //         })
  //   //       }

  //   //     });

  //   //   }
  //   // })




  // }
  // cancelAction(order, approvalId) {
  //   let storeClient = this.authService.getStoreClient();
  //   if (storeClient !== null && storeClient !== undefined) {
  //     order.terminalId = this.authService.getStoreClient().publicIP;
  //   }
  //   else {
  //     order.terminalId = this.authService.getLocalIP();
  //   }
  //   if (order.terminalId !== null && order.terminalId !== undefined && order.terminalId !== '') {
  //     if (this.checkCancelOrder(order)) {
  //       if (this.reasonList !== null && this.reasonList !== undefined && this.reasonList?.length > 0) {
  //         let langOptions = [];
  //         this.reasonList.forEach(element => {
  //           debugger;
  //           if (langOptions.filter(x => x.value === element.language)?.length <= 0) {
  //             debugger;
  //             langOptions.push({ value: element.language, name: element.language })
  //           }

  //         });
  //         debugger;
  //         const initialState = {
  //           reasonList: this.reasonList,
  //           langs: langOptions
  //         };

  //         let modalRefX = this.modalService.show(ShopReasonInputComponent, {
  //           initialState, animated: true,
  //           keyboard: true,
  //           backdrop: true,
  //           ignoreBackdropClick: false,
  //           ariaDescribedby: 'my-modal-description',
  //           ariaLabelledBy: 'my-modal-title',
  //           class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
  //         });

  //         modalRefX.content.outReason.subscribe((response: any) => {
  //           debugger;
  //           modalRefX.hide();
  //           if (response.selected) {
  //             debugger;
  //             order.reason = response.selectedReason;
  //             order.totalAmount = -order.totalAmount;
  //             order.totalDiscountAmt = -order.totalDiscountAmt;
  //             order.totalPayable = -order.totalPayable;
  //             order.totalReceipt = -order.totalReceipt;
  //             order.amountChange = -order.amountChange;
  //             if (approvalId !== null && approvalId !== undefined && approvalId !== '') {
  //               order.approvalId = approvalId;
  //             }
  //             order.lines.forEach(line => {
  //               line.baseLine = parseInt(line.lineId);
  //               line.baseTransId = line.transId;
  //               line.quantity = -line.quantity;
  //               line.lineTotal = -line.lineTotal;
  //             });

  //             order.payments.forEach(line => {
  //               line.totalAmt = -line.totalAmt;
  //               line.chargableAmount = -line.chargableAmount;
  //               line.collectedAmount = -line.collectedAmount;
  //             });
  //             order.lines.forEach(line => {
  //               let BomLine = line.lines;
  //               if (BomLine !== null && BomLine !== undefined && BomLine.length > 0) {
  //                 BomLine.forEach(lineBOM => {
  //                   order.lines.push(lineBOM);
  //                 });
  //               }
  //             });
  //             let storeClient = this.authService.getStoreClient();
  //             if(storeClient!==null && storeClient!==undefined)
  //             {
  //               order.terminalId = this.authService.getStoreClient().publicIP;
  //             }
  //             else
  //             {
  //               order.terminalId = this.authService.getLocalIP();
  //             }
  //             order.shiftId = this.shiftService.getCurrentShip().shiftId;

  //             if(order.terminalId!==null && order.terminalId!==undefined && order.terminalId!== '')
  //             {
  //               this.billService.cancelOrder(order).subscribe((response: any) => {
  //                 debugger;
  //                 if (response.success) {
  //                   order.transId = response.data.refTransId;
  //                   console.log("response.success", response.data);
  //                   response.data.isCanceled = "Y";
  //                   // this.outPutModel = response.data;
  //                   setTimeout(() => {
  //                     window.print();
  //                   }, 1000);
  //                   setTimeout(() => {
  //                     // this.alertify.success('Cancel completed successfully. ' );
  //                     window.location.reload();
  //                   }, 1000);
  
  //                 }
  //                 else {
  //                   // order.refTransId = order.transId;
  //                   // this.order.transId ='';
  //                   order.isCanceled = 'C';
  //                   this.alertify.warning(response.message);
  //                 }
  //               })
  //             }
  //             else  
  //             {
  //               Swal.fire({
  //                 icon: 'warning',
  //                 title: 'Cancel Order',
  //                 text: "Counter ID can't null please mapping value in Store Counter"
  //               });
  //               // this.alertify.warning("Counter ID can't null please mapping value in Store Counter");
  //             }
            
  //           }
  //           else {
  //             modalRefX.hide();
  //           }
  //         });

  //       }
  //       else {

  //         Swal.fire({
  //           title: 'Submit your reason',
  //           input: 'text',
  //           inputAttributes: {
  //             autocapitalize: 'off'
  //           },
  //           showCancelButton: true,
  //           confirmButtonText: 'Submit',
  //           showLoaderOnConfirm: true,
  //           allowOutsideClick: () => !Swal.isLoading()
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             order.reason = result.value;
  //             order.totalAmount = -order.totalAmount;
  //             order.totalDiscountAmt = -order.totalDiscountAmt;
  //             order.totalPayable = -order.totalPayable;
  //             order.totalReceipt = -order.totalReceipt;
  //             order.amountChange = -order.amountChange;
  //             // this.order.terminalId = this.authService.getLocalIP();

  //             order.lines.forEach(line => {
  //               line.baseLine = parseInt(line.lineId);
  //               line.baseTransId = line.transId;
  //               line.quantity = -line.quantity;
  //               line.lineTotal = -line.lineTotal;
  //             });

  //             order.payments.forEach(line => {
  //               line.totalAmt = -line.totalAmt;
  //               line.chargableAmount = -line.chargableAmount;
  //               line.collectedAmount = -line.collectedAmount;
  //             });
  //             order.lines.forEach(line => {
  //               let BomLine = line.lines;
  //               if (BomLine !== null && BomLine !== undefined && BomLine.length > 0) {
  //                 BomLine.forEach(lineBOM => {
  //                   order.lines.push(lineBOM);
  //                 });
  //               }
  //             });
  //             order.shiftId = this.shiftService.getCurrentShip().shiftId;
  //             this.billService.cancelOrder(order).subscribe((response: any) => {
  //               // debugger;
  //               if (response.success) {
  //                 console.log("response.success", response.data);
  //                 response.data.isCanceled = "Y";
  //                 // this.outPutModel = response.data;
  //                 setTimeout(() => {
  //                   window.print();
  //                 }, 1000);
  //                 setTimeout(() => {
  //                   // this.alertify.success('Cancel completed successfully. ' );
  //                   window.location.reload();
  //                 }, 1000);
  //                 // this.alertify.success('Cancel completed successfully. ' + response.message);
  //                 // window.location.reload();
  //               }
  //               else {
  //                 // order.refTransId = order.transId;
  //                 // this.order.transId ='';
  //                 order.isCanceled = 'C';
  //                 this.alertify.warning(response.message);
  //               }
  //             })
  //           }
  //         })
  //       }

  //     }
  //   }
  //   else {
  //     this.alertify.warning("Counter ID can't null please mapping value in Store Counter");
  //   }
  // }

  redirectToReturn(order)
  {
    let basket = this.basketService.getCurrentBasket();
    if (basket !== null && basket !== undefined) {
      this.basketService.deleteBasket(basket).subscribe(() => {
        debugger;
        // ['MyCompB', {id: "someId", id2: "another ID"}]
        //  this.routeNav.navigate(["shop/return", order.transId, order.companyCode, order.storeId]);

      });
      if (this.authService.getShopMode() === 'FnB') {
        this.routeNav.navigate(["shop/return", order.transId]).then(() => {
          window.location.reload();
        });
      }
      if (this.authService.getShopMode() === 'Grocery') {
        this.routeNav.navigate(["shop/order-grocery/return", order.transId]).then(() => {
          window.location.reload();
        });

      }
      // this.routeNav.navigate(["shop/return", order.transId ]).then(() => {
      //   window.location.reload();
      // }); 
    }
    else {
      if (this.authService.getShopMode() === 'FnB') {
        this.routeNav.navigate(["shop/return", order.transId]).then(() => {
          window.location.reload();
        });
      }
      if (this.authService.getShopMode() === 'Grocery') {
        this.routeNav.navigate(["shop/order-grocery/return", order.transId]).then(() => {
          window.location.reload();
        });

      }
      // this.routeNav.navigate(["shop/return", order.transId ]).then(() => {
      //   window.location.reload();
      // }); 
    }

  }
  ReturnOrder(order: Order) {
    let checkAction = this.authService.checkRole('Spc_ReturnOrder', '', 'I');
    let checkApprovalRequire =  this.authService.checkRole('Spc_ReturnOrder', '', 'A');
    if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
    {
      checkAction = false;
    }
    if (checkAction) {
      this.redirectToReturn(order);
    }
    else {
      // const initialState = {
      //   title: 'Permission denied',
      // };
      let permissionModel= { functionId: 'Spc_ReturnOrder', functionName: 'Return Order', controlId: '', permission: 'I'};
      const initialState = {
          title: 'Return Order - ' + 'Permission denied',
          freeApprove : true,
          permissionModel : permissionModel
      };
      let modalApprovalRef = this.modalService.show(ShopApprovalInputComponent, {
        initialState,
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-xl medium-center-modal'
        // class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
      });
      modalApprovalRef.content.outEvent.subscribe((received: any) => {
        if (received.isClose) {
          modalApprovalRef.hide();
        }
        else {
          debugger;
          this.redirectToReturn(order);
          modalApprovalRef.hide();

          // let code = (received.customCode ?? '');
          // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, code,'Spc_ReturnOrder', '', 'I').subscribe((response: any) => {
           
          //   if (response.success) {
          //     let note = (received.note ?? '');
          //     if (note !== null && note !== undefined && note !== '') {
          //       this.basketService.changeNote(note).subscribe((response) => {
  
          //       });
          //       this.alertify.success('Set note successfully completed.');
          //     }
            
          //   }
          //   else {
          //     Swal.fire({
          //       icon: 'warning',
          //       title: 'Return Order',
          //       text: response.message
          //     });
          //   }
          // })
        }

      });
      modalApprovalRef.onHide.subscribe((reason: string) => {
        this.commonService.TempShortcuts$.subscribe((data) => {
          this.commonService.changeShortcuts(data, true);
          console.log('Old Shorcut', data);
        });
      })
    }

  }
}
// redirectTo(uri:string){
//   this.route.navigate([uri]).then(() => {
//     window.location.reload();
//   });

// }