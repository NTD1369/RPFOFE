import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDiagramComponent, DxListComponent } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';
import { confirm } from 'devextreme/ui/dialog';
import { ThumbnailsPosition } from 'ng-gallery';
import { element } from 'protractor';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { MPlaceInfor } from 'src/app/_models/placeinfor';
import { MTableInfor } from 'src/app/_models/tableInfor';
import { TSalesLine } from 'src/app/_models/tsaleline';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { PlaceService } from 'src/app/_services/data/place.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { TablePlaceService } from 'src/app/_services/data/table-place.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { EnvService } from 'src/app/env.service';
@Component({
  selector: 'app-Management-table-cashier',
  templateUrl: './Management-table-cashier.component.html',
  preserveWhitespaces: true,
  styleUrls: ['./Management-table-cashier.component.scss']
})

export class ManagementTableCashierComponent implements OnInit {
  modalRef: BsModalRef;
  moveItem: boolean = false;
  minnumber: any = 1;
  item: any;
  quantity: number = 0;
  orderMove: any;
  filterBtn = false;
  reload = false;
  showReload = false;
  showDiagram = true;
  currentTableInfor: MTableInfor = new MTableInfor();
  placeInfor: MPlaceInfor;
  tableInforList: MTableInfor[] = [];
  isSplitTable: boolean = false;
  selectTableSplit: number = 0;
  // tableInfors: MTableInfor[];
  dataSource: ArrayStore;
  popupVisible = false;
  generatedID = 100;
  showAvailabel = true;
  itemselected;
  detail;
  transLst;
  totalamount = 0;
  currentOrder: any[];
  showCurrenOrder = false;
  positionOf: string;
  selectAllModeVlaue = 'page';
  selectionModeValue = 'all';
  tongqtt = 0;
  linesTmp = [];
  sourceC;
  loginInfo;
  splitLineItem = [];
  orderSplit = [];
  orderSplitTab = [];
  tabs: Tab[] = [
    // {stt
    //   id: 0,
    //   text: 'user',
    //   icon: 'user',
    //   content: 'User tab content',
    // },
    // {
    //   id: 1,
    //   text: 'comment',
    //   icon: 'comment',
    //   content: 'Comment tab content',
    // },
    // {
    //   id: 2,
    //   text: 'find',
    //   icon: 'find',
    //   content: 'Find tab content',
    // },
  ];
  isLoading = false;
  selectedIndex = 0;
  placeId;
  storeId;
  urlImage;
  apiUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  itemMove;
  showDroptable = false;
  moveTableTam;
  //manhinh="Normal ";
  showHeaderAvailable = true;
  buttonChonThemBan = true;
  showSelected = false;
  showDetail = false;
  showViewDetail = false;
  buttonThemMon = false;
  buttonDetail = false;
  showMoveTable = false;
  showTable = true;
  buttonTinhTien = false;
  buttonInBill = false;
  showMerge = false;
  showSplit = false;
  buttonSpit = false;
  troVe = false;
  showApply = false;
  showAll = true;
  showOrder = false;
  showMove = false;
  viewShowDetail = false;
  buttonApllyMove = false;
  inputSlot = false;
  buttonCheckSlot = false;
  buttonReload = false;
  buttonAvalable = true;
  buttonMore = true;
  showPlace = false;
  viewUserManual = false
  tableSelectTam;
  popupVisibleMer = false;
  itemMerge;
  popupVisibleSplt = false;
  sourceData;
  infoTam;
  tongView = 0;
  selectedItemKeys;
  popupVisibleMore = false;
  listTableMore;
  mes = "";
  checkItem;
  timeout = null;
  message = "";
  showFirstSubmenuModes: any;

  @ViewChild(DxDiagramComponent, { static: false }) diagram: DxDiagramComponent;
  @ViewChild(DxListComponent, { static: false }) list: DxListComponent;

  constructor(private spinnerService: NgxSpinnerService, private modalService: BsModalService, http: HttpClient,
    private storeServies: StoreService, private billService: BillService, private tablePlace: TablePlaceService, private placeService:
      PlaceService, public authService: AuthService, private route: ActivatedRoute, public env: EnvService, private router: Router, private shiftService: ShiftService,
    private alertity: AlertifyService, private cdr: ChangeDetectorRef) {
    let sef = this;

    this.itemStyleExpr = this.itemStyleExpr.bind(this);
    this.loginInfo = this.authService.getCurrentInfor();
    this.placeId = this.route.snapshot.params.placeid;
    this.storeId = this.route.snapshot.params.storeid;


    this.dataSource = new ArrayStore({
      key: 'tableId',
      data: [],
      onInserting(values) {
        let id = values.text.split('-')[0];
        values.dataItem = sef.tableInforList.find(x => x.tableName === id);

        values.tableId = values.dataItem.tableId || "";// values.tableId || "";
        values.tableName = values.dataItem.tableName || "";//values.tableName || "";

        // values.tableId = values.tableId || uuidv4(); 
        // values.tableName = values.tableName || "";

        values.status = values.status || "A";
        values.isOrdered = values.isOrdered || false;
        values.slot = values.slot || 100;
        values.description = values.description || "";
        values.type = values.type || "";
        values.height = values.height || 100;
        values.width = values.width || 100;
        values.remark = values.remark || "";
        values.customField1 = values.customField1 || "";
        values.customField2 = values.customField2 || "";
        values.customField3 = values.customField3 || "";
        values.customField4 = values.customField4 || "";
        values.customField5 = values.customField5 || "";

        values.orderCustomF1 = values.orderCustomF1 || "";
        values.orderCustomF2 = values.orderCustomF2 || "";
        values.orderCustomF3 = values.orderCustomF3 || "";
        values.orderCustomF4 = values.orderCustomF4 || "";
        values.orderCustomF5 = values.orderCustomF5 || "";
      },
    });
  }

  filterAvailable() {
    //debugger;
    let arrSave = this.diagram.instance.getItems();
    console.log("arr", arrSave);
    //  let a = this.tableInforList.filter(x=>x.isOrdered === true)
    arrSave.forEach(element => {
      //debugger;
      if (element.dataItem?.isOrdered === true || element.dataItem?.orderCustomF2?.length > 0) {
        //debugger;
        this.dataSource.push([{ type: 'remove', key: element.dataItem.tableId }]);
      }
    });
    // console.log("filter",a);  
    this.showAvailabel = false;
    this.inputSlot = true;
    this.buttonCheckSlot = true;
    this.buttonReload = true;
    this.buttonAvalable = false;
    this.buttonMore = false;
    this.viewShowDetail = false;
    this.showPlace = false;
    // this.buttonSpit = false;
    // this.showMove = false;
    // this.buttonThemMon=false;
    // this.buttonTinhTien = false;
    // this.buttonChonThemBan = false;
    // this.troVe = true;
  }

  contentReadyHandler(e) {
    const diagram = e.component;
    // preselect some shape
    const items = diagram.getItems().filter((item) => item.itemType === 'shape' && (item.text.toLowerCase().includes('bàn')));
    if (items.length > 0) {
      diagram.setSelectedItems(items);
      diagram.scrollToItem(items[0]);
      diagram.focus();
    }

  }

  selectionChangedHandler(e) {
    this.cdr.detectChanges();

    this.itemselected = e.items.filter((item) => item.itemType === 'shape');
    this.checkSplitTableOrOrderHaveGroup(this.itemselected);    

    if (this.itemselected !== null && this.itemselected !== undefined && this.itemselected.length > 0) {
      this.activeSelectTable(this.itemselected);
      if (this.tableSelectTam !== null && this.tableSelectTam !== undefined && this.tableSelectTam.length > 0) {
        this.tableSelectTam.forEach(element => {
          if (element.id !== this.itemselected[0].id) {
            this.itemselected.push(element)
          }
        });      
      }
      if (this.buttonApllyMove === true) {
        this.buttonApllyMove = true;
        this.troVe = true;
      } else {
        this.showSelected = true;
        this.troVe = false;
        this.showTable = true;
        this.buttonDetail = false;
        this.buttonThemMon = false;
        this.buttonTinhTien = false;
        this.buttonInBill = true;
        this.buttonChonThemBan = false;
        this.showMove = false;
        this.buttonSpit = false;
        this.buttonApllyMove = false;
        this.showPlace = false;
        this.viewUserManual = true
        this.showPlace = false;
        this.viewShowDetail = false;
        //  this.tableSelectTam=[];
        // this.showDetail = true
        if (this.itemselected?.length >= 2 || this.tableSelectTam?.length >= 2) {
          this.buttonThemMon = false;
          this.viewShowDetail = false;
          this.showSelected = true;
          this.troVe = true;
          this.detailSelected();
        } else {
          this.detailSelected();
        }
      }
    } else {
      // this.viewShowDetail =false
      this.tableSelectTam = [];
      this.viewShowDetail = false;
      this.buttonSpit = false;
      // this.showCurrenOrder=true;
      this.buttonThemMon = false;
      this.buttonTinhTien = false;
      // this.buttonInBill=false;
      this.troVe = false;
      this.showMove = false;
      // this.buttonDetail=false;
    }
  }

  checkSplitTableOrOrderHaveGroup(itemselected: any[]) {
    this.isSplitTable = false;
    this.selectTableSplit = 0;
    if (itemselected.length > 0) {
      this.isSplitTable =
        itemselected[0].dataItem.dataItem.orderCustomF2 != undefined &&
        itemselected[0].dataItem.dataItem.orderCustomF2 != null &&
        itemselected[0].dataItem.dataItem.orderCustomF3 === '#fa3142';
      if (this.isSplitTable) {
        this.selectTableSplit = itemselected[0].dataItem.dataItem.tableId;
      }
      // this.buttonSpit = itemselected[0].dataItem.dataItem.isOrdered;      
    }
  }

  activeSelectTable(itemselected: any[]) {  
    this.tableInforList.forEach(element => {
      var elementTable = document.getElementById(`table_${element.tableId}`);
      elementTable.classList.remove("active");
      if (itemselected[0].dataItem.dataItem.tableId === element.tableId) {
        elementTable.classList.add("active");
      }
    });
  }

  selectedNametable(): string {
    if (this.itemselected.length > 0) {
      return this.itemselected[0].type.toUpperCase();
    }
  }

  btnSplitTable() {
    if (this.isSplitTable) {
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to split table ${this.selectedNametable()}? `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          if (this.itemselected) {
            this.itemselected.forEach(element => {
              let tableName = element.type.toLowerCase();
              this.detail = this.tableInforList.find((item) => item.tableName.toLowerCase() === tableName.toLowerCase());
              if (this.detail != undefined && this.detail != null) {
                const groupKey = this.detail.orderCustomF2?.length > 0 ? this.detail.orderCustomF2 : null;
                this.billService.SplitTable(this.loginInfo.companyCode,
                  this.storeId, this.shiftService.getCurrentShip().shiftId,
                  this.placeId, this.selectTableSplit, groupKey).subscribe((res: any) => {
                    if (res.success) {
                      this.itemMerge = res.data;
                      this.funcTroVE();
                      this.popupVisibleMer = false;
                      Swal.fire({
                        icon: 'success',
                        title: 'Split table',
                        text: "Split table successfully completed"
                      }).then(() => {
                        this.reLoadPageFirst();
                        window.location.reload();
                      })
                    } else {
                      this.alertity.warning(res.message);
                    }
                  })
              }
            });
          }
        }
      });
    }
  }

  onEmployeeListReady(e) {
    e.component.selectAll();
  }

  detailSelected() {
    //toLowerCase : chữ hoa thành chữ trong data
    // let c = this.tableInforList.find((item)=>item.tableName.toLowerCase() === "bàn 1");
    // let c = this.tableInforList.find((item)=>item.tableName.toLowerCase() === b.text.toLowerCase());
    this.linesTmp = [];
    this.totalamount = 0;
    this.transLst = [];
    this.detail = null;
    this.showDroptable = false;
    this.selectedItemKeys = [];

    if (this.itemselected) {
      this.itemselected.forEach(element => {
        let tableName = element.type.toLowerCase();
        this.detail = this.tableInforList.find((item) => item.tableName.toLowerCase() === tableName.toLowerCase());
        this.billService.GetOrderByContractNo(this.loginInfo.companyCode, this.storeId, this.detail.orderCustomF2?.length > 0 ? this.detail.orderCustomF2 : this.detail.tableId, this.shiftService.getCurrentShip().shiftId, this.detail.placeId).subscribe((res: any) => {
          if (res.success) {
            if (res.data != undefined && res.data !== null) {
              res.data.forEach(item => {
                this.transLst.push(item);
              })
              if (this.transLst !== null && this.transLst !== undefined && this.transLst.length > 0) {
                this.transLst.forEach((item) => {
                  this.totalamount = item.totalAmount + this.totalamount;
                })
              }
            }
          }
          else {
            this.alertity.warning(res.message);
          }
        })
      });
    }

    if (this.itemselected?.length >= 2 || this.tableSelectTam?.length >= 2) {
      this.troVe = true;
    } else {
      // this.showInfo()
      this.showDetail = false;
      this.buttonDetail = false;
      this.showMerge = false;
      this.showSplit = false;
      this.showTable = true;
      this.troVe = false;
      this.showViewDetail = false;
      this.showMove = true;
      this.buttonSpit = true;
      this.buttonThemMon = true;
      this.buttonInBill = false;
      this.showSelected = true;
      this.buttonTinhTien = true;
      this.viewShowDetail = true;
      this.showHeaderAvailable = false;
      this.buttonChonThemBan = true;
      this.showPlace = false;
    }
  }

  orderBill() {
    let firstItemselected = this.itemselected[0];
    if (firstItemselected != undefined && firstItemselected != null) {
      let tableName = firstItemselected.type.toLowerCase();
      this.detail = this.tableInforList.find((item) => item.tableName.toLowerCase() === tableName.toLowerCase());

      var currentOrderPayments: Array<string> = [];
      this.currentOrder.map(element => {
        element.lines.map(x => { currentOrderPayments.push(x.itemCode) });
      });

      if (currentOrderPayments.length > 0) {
        localStorage.setItem('currentOrderPayments', JSON.stringify(currentOrderPayments));
      }

      if (this.detail.transId !== null && this.detail.transId !== undefined && this.detail.transId?.length > 0) {
        if (this.authService.getShopMode() === 'FnB') {
          this.router.navigate(["shop/order", this.detail.transId]).then(() => { });
        }
        if (this.authService.getShopMode() === 'FnBTable') {
          this.router.navigate(["shop/order", this.detail.transId]).then(() => { });
        }
        if (this.authService.getShopMode() === 'Grocery') {
          this.router.navigate(["shop/order-grocery", this.detail.transId]).then(() => { });
        }
      }
      else {
        this.router.navigate(["shop/order/", "preorder", this.detail.tableId, this.detail.placeId]);
      }

    }
    else {
      this.alertity.warning(`Please choose a dining table.`)
    }
  }

  listSelectionChanged = (e) => {
    debugger;
    if (this.selectedItemKeys !== null && this.selectedItemKeys !== undefined && this.selectedItemKeys.length > 0) {
      //   this.currentOrder = e.addedItems[0];
      //   if(this.currentOrder ===null || this.currentOrder===undefined ){
      //   //debugger;

      //     if(this.selectedItemKeys!==null && this.selectedItemKeys!== undefined  && this.selectedItemKeys.length>0 ){
      // //debugger;

      //       this.currentOrder = this.transLst.find(x=>x.transId === this.selectedItemKeys[0])
      //     }
      //   }
      this.currentOrder = [];
      this.selectedItemKeys.forEach(element => {
        this.currentOrder.push(this.transLst.find(x => x.transId === element))
        console.log("this.current", this.currentOrder);

      });
      this.showCurrenOrder = true;
    }
    else {
      this.currentOrder = [];
      this.showCurrenOrder = false;

    }
  }

  showInfo() {
    this.popupVisible = true;
  }

  closePoppup() {
    this.popupVisible = false;
  }

  viewdetail() {
    //debugger;
    this.totalamount = 0;
    this.tongqtt = 0;
    this.linesTmp = [];
    let bill = this.selectedItemKeys;
    // this.detail=[]

    bill.forEach(element => {
      //debugger;
      let itemLines = this.transLst.find(x => x.transId === element && x.companyCode === "CP001");
      //debugger;
      itemLines.lines.forEach(line => {
        //debugger;
        let itemtam = this.linesTmp.filter((x: TSalesLine) => x.itemCode === line.itemCode);
        //debugger;
        if (itemtam.length > 0) {
          let item = itemtam[0];
          // let itemCheck = this.linesTmp.filter(x=>x.transId === item.transId && x.itemCode === item.itemCode );
          // if(itemCheck.length>0){

          // }else{

          // }
          item.quantity += line.quantity;
          item.lineTotal = item.quantity * item.price;
          console.log("itemtam", itemtam);
        }
        else {
          this.linesTmp.push(line);
        }
        //debugger;
        this.tongqtt = this.tongqtt + line.quantity;
        console.log("tongqtt", this.tongqtt);
      });
      //debugger;
      this.totalamount = this.totalamount + itemLines.totalAmount;
    });
    //debugger;
    console.log(" this.linesTmp", this.linesTmp);

  }

  splitOrder(numOfSplit) {
    //debugger;
    this.orderSplit = [];
    this.tabs = [];
    for (let index = 0; index < numOfSplit; index++) {
      let orderClone = Object.assign({}, this.transLst[0]);
      orderClone.lines = [];

      this.orderSplit.push(orderClone);
      this.tabs.push({
        id: index,
        text: 'Order ' + (index + 1),
        icon: 'user',
        content: 'Order content',
      });
    }
  }

  splitOrderTab() {
    //debugger;
    let numberTab = 0;

    numberTab = this.tabs.length + 1;


    let orderSplitTab = Object.assign({}, this.transLst[0]);
    orderSplitTab.lines = [];
    this.orderSplit.push(orderSplitTab);
    this.tabs.push({
      id: numberTab,
      text: 'Order ' + numberTab,
      icon: 'user',
      content: 'Order content',
    });
  }

  selectTab(e) {
    // this.tabContent = this.tabs[e.itemIndex].content;
    this.selectedIndex = e.itemIndex;
  }

  addSplitOrder() {
    //debugger;
    if (this.splitLineItem.length > 0) {
      let orderSplitTab = Object.assign({}, this.transLst[0]);
      orderSplitTab.lines = [...this.splitLineItem];
      this.orderSplit.push(orderSplitTab);
    }

    if (this.orderSplit?.length > 0) {
      this.orderSplit.forEach((order: Order) => {
        if (order.lines.length > 0) {
          let lineForOrder = [];
          order.createdBy = this.loginInfo.username;
          order.shiftId = this.shiftService.getCurrentShip().shiftId;
          order.payments = [];
          order.voucherApply = [];
          order.vouchers = [];
          order.promoLines = [];
          order.status = "C";
          order.isCanceled = "N";
          order.customF1 = this.placeId;
          order.lines.forEach(line => {
            let itemCheck = lineForOrder.filter(x => x.itemCode === line.itemCode && x.uomCode === line.uomCode && (x.barCode ?? '' === line.barCode ?? ''));
            if (itemCheck !== null && itemCheck !== undefined && itemCheck.length > 0) {
              itemCheck[0].quantity += line.quantity;
              itemCheck[0].lineTotal += itemCheck[0].quantity * itemCheck[0].price;
              itemCheck[0].lineTotalBefDis = itemCheck[0].lineTotal;
            } else {
              lineForOrder.push(line);
            }

          });
          order.lines = [];
          order.lines = lineForOrder;
          let total = order.lines.reduce(
            (a, b) => (b.price * b.quantity) + a,
            0);// subtotal + ship;
          order.totalPayable = total;
          order.totalAmount = total;
          order.totalDiscountAmt = 0;
        }
      });

      this.isLoading = true;
      this.orderSplit = this.orderSplit.filter(x => x.lines.length > 0);
      console.log("this.splitLineItem", this.orderSplit, this.splitLineItem);

      this.billService.createMultipleOrder(this.orderSplit).subscribe((response: any) => {
        if (response.success) {
          // this.spinnerService.hide();
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Split Order',
            text: "Split successfully completed"
          }).then(() => {
            window.location.reload();
          })
          // this.alertity.warning("Split success");
          // setTimeout(() => {
          // }, 1000);
        }
        else {
          // this.spinnerService.hide();
          this.isLoading = false;
          this.alertity.warning(response.message);
        }
      }, error => {
        // this.spinnerService.hide();
        this.isLoading = false;
        this.alertity.warning(error);
      })
    }
    else {
      // this.spinnerService.hide();
      this.isLoading = false;
      this.alertity.warning("Please split order, Order is null");
    }
    this.funcTroVE();
    //  setTimeout(() => {
    //   this.reloadModel();
    //  }, 300);
  }

  addItemToOrder(line, order) {
    //debugger;
    let check = order.lines.filter(x => x.itemCode === line.itemCode && x.uomCode === line.uomCode && x.barCode === line.barCode);
    // if(check!==null && check !==undefined &&  check?.length>0)
    // {
    //   check[0].quantity += line.quantity ;
    //   check[0].lineTotal += check[0].quantity * check[0].price ; 
    // }
    // else
    // {

    // } 
    this.splitLineItem = this.splitLineItem.filter(x => x.lineNum !== line.lineNum);
    order.lines.push(line);
  }

  viewdetailWithOne(billSelect) {
    //debugger;
    this.splitLineItem = []
    let lineNum = 0;
    this.totalamount = 0;

    billSelect.forEach(element => {
      //debugger;
      let itemLines = this.transLst.find(x => x.transId === element && x.companyCode === this.authService.getCurrentInfor().companyCode);
      //debugger;
      itemLines.lines.forEach(line => {
        //debugger;

        for (let index = 0; index < line.quantity; index++) {
          let lineClone = Object.assign({}, line);
          lineNum++;
          lineClone.lineNum = lineNum;
          lineClone.quantity = 1;
          lineClone.lineTotal = lineClone.quantity * lineClone.price;
          this.splitLineItem.push(lineClone);
        }
      });
    });
    //debugger;
    console.log(" this.linesTmp", this.linesTmp);
  }

  itemTypeExpr(obj) {
    return 'employee';
  }

  itemCustomDataExpr(obj, value) {
    if (value === undefined) {
      return {
        id: obj.id,
        tableId: obj.tableId,
        tableName: obj.tableName,
        remark: obj.remark,
        storeId: obj.storeId,
        isOrdered: obj.isOrdered,
        slot: obj.slot,
        description: obj.description || "",
        type: obj.type || "",
        height: obj.height,
        width: obj.width,
        customField1: obj.customField1 || "",
        customField2: obj.customField2 || "",
        customField3: obj.customField3 || "",
        customField4: obj.customField4 || "",
        customField5: obj.customField5 || "",

        orderCustomF1: obj.orderCustomF1 || "",
        orderCustomF2: obj.orderCustomF2 || "",
        orderCustomF3: obj.orderCustomF3 || "",
        orderCustomF4: obj.orderCustomF4 || "",
        orderCustomF5: obj.orderCustomF5 || ""
      };
    }
    obj.id = value.id;
    obj.tableId = value.tableId;
    obj.tableName = value.tableName;
    obj.remark = value.remark;
    obj.storeId = value.storeId;
    obj.isOrdered = value.isOrdered;

    obj.slot = value.slot,
      obj.description = value.description || "",
      obj.type = value.type || "",
      obj.height = value.height,
      obj.width = value.width
    obj.customField1 = value.customField1 || "";
    obj.customField2 = value.customField2 || "";
    obj.customField3 = value.customField3 || "";
    obj.customField4 = value.customField4 || "";
    obj.customField5 = value.customField5 || "";

    obj.orderCustomF1 = value.orderCustomF1 || "";
    obj.orderCustomF2 = value.orderCustomF2 || "";
    obj.orderCustomF3 = value.orderCustomF3 || "";
    obj.orderCustomF4 = value.orderCustomF4 || "";
    obj.orderCustomF5 = value.orderCustomF5 || "";
  }

  requestLayoutUpdateHandler(e) {
    // //debugger;
    // for (let i = 0; i < e.changes.length; i++) {
    //   if (e.changes[i].type === 'remove') { e.allowed = true; } 
    //   else 
    //   if (e.changes[i].data.tableId !== undefined && e.changes[i].data.tableId !== null) { e.allowed = true; }
    // }
  }

  editTable(table) {
    this.currentTableInfor = { ...table };
    this.popupVisible = true;
  }

  deleteTable(table) {
    this.dataSource.push([{ type: 'remove', key: table.tableId }]);
  }

  updateTable() {
    this.dataSource.push([{
      type: 'update',
      key: this.currentTableInfor.tableId,
      data: {
        tableId: this.currentTableInfor.tableId,
        tableName: this.currentTableInfor.tableName,
        remark: this.currentTableInfor.remark,
        storeId: this.currentTableInfor.storeId,
        isOrdered: this.currentTableInfor.isOrdered,

        // Skype: this.currentEmployee.Skype,
        // Mobile_Phone: this.currentEmployee.Mobile_Phone,
      },
    }]);
    this.popupVisible = false;
  }

  AssignModel(table) {
    // //debugger;
    console.log('data 2', table);
    this.reload = false;
    this.currentTableInfor = { ...table };
    if (this.currentTableInfor !== null && this.currentTableInfor !== undefined) {
      //debugger;
      let currenX: any = this.currentTableInfor;
      // let tableInlist = this.tableInforList.find(x=>x.tableName === currenX?.text);
      let tableInlist = this.tableInforList.find(x => x.tableName === currenX?.tableName);
      let value = tableInlist?.isOrdered ?? false;// !this.currentTableInfor.isOrdered;

      this.dataSource.push([{
        type: 'update',
        key: this.currentTableInfor.tableId,
        data: {
          tableId: this.currentTableInfor.tableId,
          tableName: this.currentTableInfor.tableName,
          remark: this.currentTableInfor.remark,
          storeId: this.currentTableInfor.storeId,
          isOrdered: value
        },
      }]);

      if (tableInlist !== null && tableInlist !== undefined) {
        tableInlist.isOrdered = value;
        this.currentTableInfor.isOrdered = value;
        this.currentTableInfor.slot = tableInlist.slot;
        this.currentTableInfor.description = tableInlist.description;
        this.currentTableInfor.type = tableInlist.type;
        this.currentTableInfor.height = tableInlist.height;
        this.currentTableInfor.width = tableInlist.width;
        this.currentTableInfor.customField1 = tableInlist.customField1;
        this.currentTableInfor.customField2 = tableInlist.customField2;
        this.currentTableInfor.customField3 = tableInlist.customField3;
        this.currentTableInfor.customField4 = tableInlist.customField4;
        this.currentTableInfor.customField5 = tableInlist.customField5;
        this.currentTableInfor.orderCustomF1 = tableInlist.orderCustomF1;
        this.currentTableInfor.orderCustomF2 = tableInlist.orderCustomF2;
        this.currentTableInfor.orderCustomF3 = tableInlist.orderCustomF3;
        this.currentTableInfor.orderCustomF4 = tableInlist.orderCustomF4;
        this.currentTableInfor.orderCustomF5 = tableInlist.orderCustomF5;
      }
    }
    setTimeout(() => {
      console.log('this.currentTableInfor', this.currentTableInfor);
      let tanleClone = Object.assign({}, this.currentTableInfor);
      this.itemStyleExpr(tanleClone);

    }, 5);

    // let a = this.diagram.instance.getItems();
    // a[0].dataItem[0].isOrdered = !a[0].dataItem[0].isOrdered;
    // // a[0].dataItem[0].fill = "#ffcfc3";
    // if(this.tableInforList[0].isOrdered === null || this.tableInforList[0].isOrdered === undefined)
    // {
    //   this.tableInforList[0].isOrdered = false;
    // }
    // this.tableInforList[0].isOrdered = false;
    // this.diagram.instance.endUpdate();
    // this.diagram.instance.repaint();
    // this.saveModel();
    // setTimeout(() => {
    //   this.reloadModel();
    // }, 200);
  }

  HideModel() {

  }

  itemStyleExpr(obj) {
    //debugger;

    let color = "";

    let idText = obj?.text;
    if (idText !== '' && idText !== undefined && idText !== null) {
      // let id = obj?.text.split('-')[0].toLowerCase();   
      let tableInlist = this.tableInforList.find(x => x.tableName === idText);
      if (tableInlist !== null && tableInlist !== undefined) {
        obj.isOrdered = tableInlist.isOrdered;
        obj.slot = tableInlist.slot;
        obj.description = tableInlist.description;
        obj.type = tableInlist.type;
        obj.height = tableInlist.height;
        obj.width = tableInlist.width;
        obj.customField1 = tableInlist.customField1;
        obj.customField2 = tableInlist.customField2;
        obj.customField3 = tableInlist.customField3;
        obj.customField4 = tableInlist.customField4;
        obj.customField5 = tableInlist.customField5;
        obj.orderCustomF1 = tableInlist.orderCustomF1;
        obj.orderCustomF2 = tableInlist.orderCustomF2;
        obj.orderCustomF3 = tableInlist.orderCustomF3;
        obj.orderCustomF4 = tableInlist.orderCustomF4;
        obj.orderCustomF5 = tableInlist.orderCustomF5;
      }
    }

    if (!this.reload) {
      if (obj.isOrdered) { color = '#ffcfc3' }
      else {
        color = '#bbefcb'
      }
    }
    else {
      //debugger;
      let id = obj?.type.toLowerCase();
      let idText = id;// obj?.text; 
      if (idText !== '' && idText !== undefined && idText !== null) {
        if (this.tableInforList !== null && this.tableInforList !== undefined && this.tableInforList?.length > 0) {
          let getObj = this.tableInforList.find(x => x?.tableId === idText);
          if (getObj !== null && getObj !== undefined) {
            obj.isOrdered = getObj.isOrdered;
            obj.orderCustomF3 = getObj.orderCustomF3;
          }
        }
      }
    }

    if (obj.orderCustomF3?.length > 0) {
      color = obj.orderCustomF3;
    }
    console.log('color', color);
    if (color !== null && color !== undefined && color !== '') {
      return { fill: color };
    }
  }

  cancelEditEmployee() {
    this.currentTableInfor = new MTableInfor();
    this.popupVisible = false;
  }

  saveModel() {
    //debugger;
    this.diagram.instance.endUpdate();
    this.sourceC = this.diagram.instance.export();
    console.log("sourceC", this.sourceC);
    //debugger;
    setTimeout(() => {
      this.diagram.instance.import(null);
    }, 100);
    //debugger;
    //
    this.placeInfor.assignMap = this.sourceC;
    console.log(" this.placeInfor.assignMap", this.placeInfor.assignMap);
    this.placeInfor.modifiedBy = this.loginInfo.username;
    //debugger;
    this.updatePlace(this.placeInfor);
  }

  updatePlace(model) {
    //debugger;
    this.placeService.update(model).subscribe((rep: any) => {
      //debugger;
      if (rep.success) {
        this.alertity.success("Update completed successfully");
      } else {
        this.alertity.warning("Error");
      }
    })

    // let sourceA = this.diagram.instance.getEdgeDataSource();
    // let sourceB =this.diagram.instance.getNodeDataSource();
    // console.log(sourceA);
    // console.log(sourceB);
    // console.log(sourceC);

  }

  refreshDigram() {
    this.showDiagram = false;
    setTimeout(() => {
      this.showDiagram = true;
    }, 2);
  }

  hideInactiveTable() {
    let table2: any = this.diagram.instance.getItems();
    table2.forEach(element => {
      // //debugger;
      let tableInforX = this.tableInforList.find(x => x.tableId === element.key);
      if (tableInforX !== null && tableInforX !== undefined) {

        if (tableInforX.status === 'I') {
          this.dataSource.push([{ type: 'remove', key: element.key }]);
        }
      }
    })
  }

  reloadModel() {
    this.tableSelectTam = [];
    this.filterBtn = false;
    if (this.diagram !== null && this.diagram !== undefined) {
      this.diagram.instance.import(null);
      this.reload = true;
      this.diagram.instance.import(this.placeInfor.assignMap);
      let table: any = this.diagram.instance.getItems()[0];
      // table.dataItem.isOrdered = true;
      //debugger;
      // let id = table.text.split('-')[0];
      let tableInfor = this.tableInforList.find(x => x.tableName === table.type);
      // this.AssignModel(table);
      setTimeout(() => {
        //debugger;
        table.dataItem = {
          companyCode: tableInfor.companyCode,
          storeId: tableInfor.storeId,
          tableId: table.key,
          tableName: tableInfor.tableName,
          remark: tableInfor.tableName,
          isOrdered: false,
          status: "A",
          text: tableInfor.tableName,
          customField1: tableInfor.customField1,
          customField2: tableInfor.customField2,
          customField3: tableInfor.customField3,
          customField4: tableInfor.customField4,
          customField5: tableInfor.customField5,

          orderCustomF1: tableInfor.orderCustomF1,
          orderCustomF2: tableInfor.orderCustomF2,
          orderCustomF3: tableInfor.orderCustomF3,
          orderCustomF4: tableInfor.orderCustomF4,
          orderCustomF5: tableInfor.orderCustomF5,
          urlImage: ""
        };
        table.isOrdered = true;
        this.AssignModel(table.dataItem);
      }, 50);

      setTimeout(() => {
        let table2: any = this.diagram.instance.getItems();
        table2.forEach(element => {
          //debugger;
          //let id = table.text.split('-')[0].toLowerCase();;
          let tableInforX = this.tableInforList.find(x => x.tableName.toLowerCase() === table.type.toLowerCase);
          // let tableInforX = this.tableInforList.find(x=>x.tableName === element.text);
          if (tableInforX !== null && tableInforX !== undefined) {
            if (element.dataItem === null || element.dataItem === undefined) {
              element.dataItem = {
                companyCode: tableInforX.companyCode,
                storeId: tableInforX.storeId,
                tableId: element.key,
                tableName: tableInforX.tableName,
                remark: tableInforX.tableName,
                isOrdered: tableInforX.isOrdered,
                status: "A",
                text: tableInforX.tableName,
                customField1: tableInforX.customField1,
                customField2: tableInforX.customField2,
                customField3: tableInforX.customField3,
                customField4: tableInforX.customField4,
                customField5: tableInforX.customField5,

                orderCustomF1: tableInforX.orderCustomF1,
                orderCustomF2: tableInforX.orderCustomF2,
                orderCustomF3: tableInforX.orderCustomF3,
                orderCustomF4: tableInforX.orderCustomF4,
                orderCustomF5: tableInforX.orderCustomF5,
                urlImage: ""
              };
            }
            //
            setTimeout(() => {
              this.AssignModel(element.dataItem);
            }, 10);
          }

        });
      }, 200);
    }
    this.showTable = true;
    this.showAvailabel = true;
    this.inputSlot = false;
    this.buttonReload = false;
    this.buttonAvalable = true;
    this.buttonCheckSlot = false;
    this.buttonMore = true;
    this.message = '';
    setTimeout(() => {
      this.hideInactiveTable();

    }, 300);
  }

  onCustomCommand(e) {
    if (e.name === 'clear') {
      const result = confirm('Are you sure you want to clear the diagram? This action cannot be undone.', 'Warning');
      result.then(
        (dialogResult) => {
          if (dialogResult) {
            e.component.import('');
          }
        },
      );
    }
  }

  ngOnInit() {
    this.reLoadPageFirst();
    this.showMerge = false;
    this.troVe = false;
  }

  reLoadPageFirst() {
    this.loadTableData();
    this.loadInfoItem()
    this.checkMin()
  }

  getByCode(code) {
    // //debugger;
    this.placeService.getByCode(this.loginInfo.companyCode, this.storeId, code).subscribe((res: any) => {
      // //debugger;
      if (res.success) {
        this.placeInfor = res.data;
        //debugger;

        if (this.placeInfor.urlImageSave !== null && this.placeInfor.urlImageSave !== undefined && this.placeInfor.urlImageSave.toString() !== "" && this.placeInfor.urlImageSave.toString() !== "undefined") {
          this.urlImage = this.apiUrl.replace('api', '') + this.placeInfor.urlImageSave;

          console.log("this.urlImage", this.urlImage);
        }

        setTimeout(() => {
          this.reloadModel();

        }, 200);
        console.log("this.placeInfor", this.placeInfor);
      } else {
        this.alertity.warning(res.message)
      }
    })
  }

  loadTableData() {
    let shift = this.shiftService.getCurrentShip();
    if (shift !== null && shift !== undefined) {
      this.tablePlace.getAll(this.loginInfo.companyCode, this.storeId, this.shiftService.getCurrentShip().shiftId, this.placeId, "", "N", "Y").subscribe((res: any) => {
        if (res.success) {
          this.tableInforList = res.data;
          // this.tableInforList[0].status = 'I';
          console.log("res.tableInforList", this.tableInforList);
          this.getByCode(this.placeId);
        }
        else {
          this.alertity.warning("Error");
        }
      })
    }
    else {
      Swal.fire({
        icon: 'warning',
        title: 'Shift ',
        text: "Please load your shift to start get data of place"
      });
    }
  }

  createNewOrder() {
    let firstItemselected = this.itemselected[0];
    if (firstItemselected != undefined && firstItemselected != null) {
      // let tableName = firstItemselected.text.split('-')[0].toLowerCase();
      this.detail = this.tableInforList.find((item) => item.tableName.toLowerCase() === firstItemselected.type.toLowerCase());
      if (this.detail.transId !== null && this.detail.transId !== undefined && this.detail.transId?.length > 0) {
        Swal.fire({
          title: 'warning!',
          // input: 'text',
          icon: 'warning',
          text: 'Please completed the bill',
          inputAttributes: {
            autocapitalize: 'off'
          },
          // showCancelButton: true,
          // confirmButtonText: 'Yes',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {

        })
      }
      else {
        this.router.navigate(["shop/order/", "table", this.detail.tableId, this.detail.placeId]);
      }
    }
    else {
      this.alertity.warning(`Please choose a dining table.`);
    }
  }

  chuyenBan(totable) {
    debugger;
    if (totable.length <= 0) {
      this.alertity.warning("Please select a table to transfer the menu !");
    }
    if (this.moveItem) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to move  item: ' + this.item.itemCode + ' Quantity: ' + this.quantity + ' to table: ' + totable[0].text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        debugger;
        if (result.value) {
          this.orderSplit = [];
          let orderSplitTab = Object.assign({}, this.orderMove);
          orderSplitTab.lines = [];
          let orderSplitTab2 = Object.assign({}, this.orderMove);
          orderSplitTab2.lines = [];
          let item = Object.assign({}, this.item);
          orderSplitTab.lines.push(item);

          if (this.quantity != this.item.quantity) {
            this.orderMove.lines.forEach(x => {
              orderSplitTab2.lines.push(x);
            });
            orderSplitTab.lines[0].quantity = +this.quantity;
            orderSplitTab.lines[0].lineTotal = orderSplitTab.lines[0].quantity * orderSplitTab.lines[0].price;
            orderSplitTab2.lines.forEach(x => {
              debugger
              if ((x.itemCode === this.item.itemCode && x.uomCode === this.item.uomCode && x.barCode === this.item.barCode)) {
                x.quantity = this.item.quantity - this.quantity;
                x.lineTotal = x.quantity * x.price;
              }
            });
          }
          else {
            this.orderMove.lines.forEach(x => {
              if (!(x.itemCode === this.item.itemCode && x.uomCode === this.item.uomCode && x.barCode === this.item.barCode))
                orderSplitTab2.lines.push(x);
            });
          }
          this.orderSplit.push(orderSplitTab);
          if (orderSplitTab2.lines.length > 0)
            this.orderSplit.push(orderSplitTab2);
          if (this.orderSplit?.length > 0) {
            this.orderSplit[0].customF5 = this.orderSplit[0].transId;
            this.orderSplit[0].customF2 = "";
            this.orderSplit[0].contractNo = totable[0].key.toString();
            this.orderSplit.forEach((order: Order) => {
              let lineForOrder = [];
              order.createdBy = this.loginInfo.username;
              order.shiftId = this.shiftService.getCurrentShip().shiftId;
              order.payments = [];
              order.voucherApply = [];
              order.vouchers = [];
              order.promoLines = [];
              order.status = "C";
              order.isCanceled = "N";
              order.customF1 = this.placeId;
              order.lines.forEach(line => {
                let itemCheck = lineForOrder.filter(x => x.itemCode === line.itemCode && x.uomCode === line.uomCode && (x.barCode ?? '' === line.barCode ?? ''));
                if (itemCheck !== null && itemCheck !== undefined && itemCheck.length > 0) {
                  itemCheck[0].quantity += line.quantity;
                  itemCheck[0].lineTotal += itemCheck[0].quantity * itemCheck[0].price;
                  itemCheck[0].lineTotalBefDis = itemCheck[0].lineTotal;
                } else {
                  lineForOrder.push(line);
                }

              });
              order.lines = [];
              order.lines = lineForOrder;
              let total = order.lines.reduce(
                (a, b) => (b.price * b.quantity) + a,
                0);// subtotal + ship;
              order.totalPayable = total;
              order.totalAmount = total;
              order.totalDiscountAmt = 0;
            });
            // this.spinnerService.show();
            this.isLoading = true;
            this.billService.createMultipleOrder(this.orderSplit).subscribe((response: any) => {
              if (response.success) {
                // this.spinnerService.hide();
                this.isLoading = false;
                Swal.fire({
                  icon: 'success',
                  title: 'Move Item',
                  text: "Move Item successfully completed"
                }).then(() => {
                  window.location.reload();
                })
                // this.alertity.warning("Split success");
                // setTimeout(() => {

                // }, 1000);
              }
              else {
                // this.spinnerService.hide();
                this.isLoading = false;

                this.alertity.warning(response.message);
              }
            }, error => {
              // this.spinnerService.hide();
              this.isLoading = false;

              this.alertity.warning(error);
            })
            window.location.reload();
          }
          else {
            // this.spinnerService.hide();
            this.isLoading = false;

            this.alertity.warning("Please split order, Order is null");
          }
        };
      });
    }
    else {
      let tableClone: MTableInfor;
      if (totable.length > 0)
        tableClone = this.tableInforList.find(x => x.tableId.toString().toLowerCase() === totable[0]?.dataItem?.tableId.toString().toLowerCase());

      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to move to table: ' + totable[0].text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          debugger;
          let selectBill = this.selectedItemKeys;
          if (selectBill.length > 0) {
            this.totalamount = 0;
            this.tongqtt = 0;
            this.linesTmp = [];
            let mang = selectBill;
            let strJoin = mang.join(',');
            tableClone.tableId = tableClone.orderCustomF2 != undefined && tableClone.orderCustomF2 != null && tableClone.orderCustomF2 != "" ? tableClone.orderCustomF2 : tableClone.tableId;
            this.billService.MoveTable(this.loginInfo.companyCode, this.storeId, this.placeId, this.detail.tableId, tableClone.tableId, strJoin).subscribe((res: any) => {
              if (res.success) {
                Swal.fire({
                  icon: 'success',
                  title: 'Move Order',
                  text: "Move successfully completed"
                }).then(() => {
                  this.itemMove = res.data;
                  this.popupVisible = false;
                  this.buttonApllyMove = false;
                  setTimeout(() => {
                    this.ngOnInit();
                    window.location.reload();

                  }, 100);
                })
              }
              else {
                this.alertity.warning(res.message);
              }
            })
            // window.location.reload();
          }
          else {
            this.alertity.warning("vui lòng chọn bill cần chuyển")
          }
        }
      })
    }
  }

  chonThemBan(soBan) {
    if (this.tableSelectTam !== null && this.tableSelectTam !== undefined && this.tableSelectTam.length > 0) {
      if (this.tableSelectTam !== null && this.tableSelectTam !== undefined && this.tableSelectTam.length > 0) {
        this.tableSelectTam.forEach(element => {
          if (element.id !== this.tableSelectTam[0].id) {
            this.tableSelectTam.push(element);
          }
        });
      }
    } else {
      this.tableSelectTam = soBan;
    }
    this.troVe = true;
    this.viewShowDetail = false;
    this.buttonChonThemBan = false
    this.buttonDetail = false;
    this.buttonThemMon = false;
    this.buttonSpit = false;
    this.buttonApllyMove = false;
    this.buttonTinhTien = false;
    this.showMove = false;
    this.buttonAvalable = false;
    this.inputSlot = false;
    this.buttonReload = false;
    this.buttonMore = false;
    this.isSplitTable = false;
  }

  functionPopupMerge() {
    // this.popupVisibleMer = true;
    this.buttonThemMon = false;
    this.showMerge = true;
    this.showDetail = false;
    this.showSplit = false;
    this.showTable = false;
    this.troVe = true;
    this.showApply = true;
    this.buttonChonThemBan = false;

  }

  mergeBan(tableMerger) {
    //debugger;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to merge table?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      // if(tableMerger){
      //  this.detailSelected();
      // }
      if (result.value) {
        let tableTam = [];
        let groupKey = "";
        let groupList = [];
        tableMerger.forEach(element => {

          //debugger;
          // let item = this.tableInforList.find(x=>x.tableName === element.text)
          let item = this.tableInforList.find(x => x.tableId === element?.dataItem?.tableId)

          //debugger;
          if (item !== null) {
            tableTam.push(item.tableId.toString());
            if (item.orderCustomF2 !== null && item.orderCustomF2 !== undefined && item.orderCustomF2 !== '') {
              groupList.push(item.orderCustomF2);
            }
          }
          //debugger;
        });
        if (groupList?.length > 1) {
          Swal.fire({
            icon: 'warning',
            title: 'Item',
            text: "List table in multi group"
          });
        }
        else {
          if (groupList?.length === 1) {
            groupKey = groupList[0];
          }
          if (groupKey === null || groupKey === undefined || groupKey === "") {
            groupKey = tableTam[0];
          }
          this.billService.MergeTable(this.loginInfo.companyCode, this.storeId, this.shiftService.getCurrentShip().shiftId, this.placeId, this.authService.getCurrentInfor().username, tableTam, groupKey, true).subscribe((res: any) => {
            if (res.success) {
              this.itemMerge = res.data;
              this.funcTroVE();
              this.popupVisibleMer = false;
              Swal.fire({
                icon: 'success',
                title: 'Merge Order',
                text: "Merge successfully completed"
              }).then(() => {
                this.reLoadPageFirst();
                window.location.reload();
              })
              
            } else {
              this.alertity.warning(res.message);
            }
          })
        }
      }
    })

  }

  checkMin() {
    let format = this.authService.loadFormat();
    if (format !== null || format !== undefined) {
      for (let i = 0; i < parseInt(format.qtyDecimalPlacesFormat.toString()); i++) {
        this.minnumber = this.minnumber / 10;
      }
    }
  }

  cancelOrderBill(bill) {
    //debugger;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel bill: ' + bill.transId,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.billService.cancelOrder(bill).subscribe((res: any) => {
          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: 'Cancel Order',
              text: "Cancel successfully completed"
            }).then(() => {
              this.reLoadPageFirst();
            })
          }
          else {
            this.alertity.error(res.message);
          }
        })
      }
    })
  }

  fucncPopupVisiblesplt() {
    //debugger;
    this.totalamount = 0;
    // this.transLst=[];
    this.detail = null;
    // this.popupVisibleSplt = true;
    this.tabs = [];
    let itemselectedFirst = this.itemselected[0];
    let tableName = itemselectedFirst.type.toLowerCase();
    let tableInforList = this.tableInforList.find((item) => item.tableName.toLowerCase() === tableName.toLowerCase());
   
    this.detail = tableInforList;

    debugger;
    this.billService.GetOrderByContractNo(this.loginInfo.companyCode, this.storeId, this.detail.orderCustomF2?.length > 0 ? this.detail.orderCustomF2 : this.detail.tableId, this.shiftService.getCurrentShip().shiftId, this.detail.placeId).subscribe((res: any) => {
      //debugger;
      if (res.success) {
        //debugger;
        this.transLst = res.data;
        let splitTam = [];
        if (this.transLst?.length > 0) {
          this.transLst.forEach(element => {
            //debugger;
            splitTam.push(element.transId)
            console.log("splitTam", splitTam);
          });
          this.viewdetailWithOne(splitTam);
        }
      }
      else {
        this.alertity.warning(res.message);
      }
    });
    this.isSplitTable = false;
    this.showDetail = false;
    this.showMerge = false;
    this.showSplit = true;
    this.showTable = false;
    this.showOrder = true;
    this.showAll = false;
    this.showViewDetail = false;
    this.showSelected = false;
    this.showHeaderAvailable = false;
    this.splitLineItem = []
    this.viewShowDetail = false;
    this.showPlace = false;
    this.inputSlot = false;
    this.buttonReload = false;
    this.viewUserManual = false;
    this.buttonThemMon = false;
    this.buttonAvalable = false;
    this.buttonMore = false;
    this.buttonChonThemBan = false;
    this.buttonSpit = false;
    this.showMove = false;
    this.buttonTinhTien = false;
    this.troVe = false;
  }

  funcSlot(input) {

    this.message = "";
    // this.reloadModel();
    this.checkItem = [];
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      let arrSave = this.diagram.instance.getItems();
      console.log("arrSave", arrSave);
      arrSave.forEach(element => {
        if (element.dataItem.isOrdered === true) {
          this.dataSource.push([{ type: 'remove', key: element.dataItem.tableId ?? element.key }]);
        }
        else {
          if (element.dataItem.dataItem.slot < parseInt(input)) {
            this.dataSource.push([{ type: 'remove', key: element.dataItem.dataItem.tableId ?? element.key }]);
          }
        }
      });
      setTimeout(() => {
        let checkItem = this.diagram.instance.getItems();
        console.log("checkItem", checkItem);
        if (checkItem.length > 0) {
          //debugger;
          this.message = "";
        }
        else {
          Swal.fire({
            icon: 'warning',
            title: 'Thông báo',
            text: "Không có số chỗ tương thích !!!"
          });
        }
      }, 50);
    }, 1000);

  }

  funcHeight(height) {
    let arrH = this.diagram.instance.getItems()
    //debugger;
    console.log("arrH", arrH);
    arrH.forEach(x => {
      if (x.dataItem.height < height && x.dataItem.isOrdered === false) {
        this.dataSource.push([{ type: 'remove', key: x.dataItem.tableId }])
      } else {

      }
    })
  }

  choNgoi(chongoi) {
    let arCho = this.diagram.instance.getItems();
    arCho.forEach(x => {
      if (x.dataItem.slot < chongoi) {
        this.mes = "không có chỗ ngồi tương thích"
      }
      else {
        this.mes = "";
      }
    })
  }

  fucnMoveTable() {
    debugger
    let selectbill = this.selectedItemKeys;
    if (selectbill !== null && selectbill !== undefined && selectbill?.length > 0) {
      this.buttonThemMon = false;
      this.showMoveTable = false;
      this.showTable = true;
      this.showDetail = false;
      this.showMerge = false;
      this.showSplit = false;
      this.buttonSpit = false;
      this.showViewDetail = false;
      this.showOrder = false
      this.buttonTinhTien = false;
      this.buttonInBill = false;
      this.showMove = false;
      this.troVe = true;
      this.buttonChonThemBan = false;
      this.buttonDetail = false;
      this.showHeaderAvailable = false;
      this.viewShowDetail = false;
      this.buttonApllyMove = true;
      this.buttonAvalable = false;
      this.buttonMore = false;
      this.inputSlot = false;
      this.buttonReload = false;
    }
    else {
      // this.alertity.warning("vui lòng chọn bill")
      Swal.fire({
        icon: 'warning',
        title: 'Move Order',
        text: "Please select bill to move"
      }).then(() => {
        // window.location.reload();
      })
    }
  }

  funcTroVE() {
    //debugger;
    this.message = '';
    this.moveItem = false;
    this.showHeaderAvailable = true;
    this.showTable = true;
    this.buttonThemMon = false;
    this.showDetail = false;
    this.showMerge = false;
    this.showSplit = false;
    this.showViewDetail = false;
    this.showOrder = false
    this.showAll = true;
    this.buttonDetail = false;
    this.showMove = false;
    this.troVe = false;
    this.showApply = false;
    this.showMoveTable = false;
    this.buttonSpit = false;
    this.buttonTinhTien = false;
    this.buttonInBill = false;
    this.tableSelectTam = [];
    this.itemselected = [];
    this.showSelected = false;
    this.currentOrder = [];
    this.showCurrenOrder = false;
    this.viewShowDetail = false;
    this.buttonApllyMove = false;
    this.viewUserManual = false;
    setTimeout(() => {
      this.reloadModel()
      // window.location.reload();

    }, 100);


  }

  backSplit() {
    //debugger;
    this.message = '';
    this.showHeaderAvailable = true;
    this.showTable = true;
    this.buttonThemMon = false;
    this.showDetail = false;
    this.showMerge = false;
    this.showSplit = false;
    this.showViewDetail = false;
    this.showOrder = false
    this.showAll = true;
    this.buttonDetail = false;
    this.showMove = false;
    this.troVe = false;
    this.showApply = false;
    this.showMoveTable = false;
    this.buttonSpit = false;
    this.buttonTinhTien = false;
    this.buttonInBill = false;
    this.tableSelectTam = [];
    this.itemselected = [];
    this.showSelected = false;
    this.currentOrder = [];
    this.showCurrenOrder = false;
    this.viewShowDetail = false;
    this.buttonApllyMove = false;
    this.viewUserManual = false;
    setTimeout(() => {
      // this.reloadModel()
      window.location.reload();

    }, 100);


  }

  viewInfo() {
    this.tongView = 0;
    this.infoTam = [];
    this.totalamount = 0;
    let bill = this.selectedItemKeys;
    debugger
    bill.forEach(element => {
      this.selectedItemKeys = [];
      debugger

      let itemView = this.transLst.find(x => x.transId === element)
      itemView.lines.forEach(lines => {
        let viewTam = this.infoTam.filter((x: TSalesLine) => x.itemCode === lines.itemCode);
        if (viewTam.length > 0) {

        } else {
          this.infoTam.push(lines);

        }
        //debugger;
        this.tongView = this.tongView + lines.quantity;

      });
    });
  }

  delectTab(line) {
    //debugger;
    let index = line.id;
    let itemTsm = this.tabs.filter(x => x.id !== index);
    console.log("itm", itemTsm);
    this.tabs = itemTsm;
    this.orderSplit[index].lines.forEach(element => {
      //debugger;
      this.splitLineItem.push(element);
      console.log("splitLineItem", this.splitLineItem);
    });
    this.orderSplit.splice(index, 1);
    // xóa đi 1 order thì + lại 1 order
    let stt = 0;
    this.tabs.forEach(tab => {
      tab.id = stt;
      tab.text = 'Order ' + (stt + 1);
      stt++;
    })
  }

  deleteItemTab(lineNumCanXoa, itemOrder) {
    debugger
    let itemCanXoa = itemOrder.lines.find(x => x.lineNum === lineNumCanXoa);
    this.splitLineItem.push(itemCanXoa)
    let tabItem = itemOrder.lines.filter(x => x.lineNum !== lineNumCanXoa);
    itemOrder.lines = tabItem;

  }

  clickItemMove(item, order) {
    console.log("item move", item);
    console.log("order move", order);

    console.log("min", this.minnumber)
    Swal.fire({
      title: 'Quantity!',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      input: "number",
      inputPlaceholder: 'Quantity',
      inputValue: 1,
      //   inputAttributes: {
      //     min: 1,
      //     max: cantidad_existencia,
      //     step: 1,
      //     pattern: "[0-9]{10}"
      // },

      inputAttributes: {
        autocapitalize: 'off',
        min: this.minnumber,
        max: item.quantity
      },
      inputValidator: (value) => {
        if (value > item.quantity) {
          return 'Sai số lượng ! Vui lòng kiểm tra lại'
        }
        if (value < this.minnumber) {
          return ' Sai số lượng ! Vui lòng kiểm tra lại'
        }

      },
      // showCancelButton: true,
      // confirmButtonText: 'Yes',
      showLoaderOnConfirm: true,

    }).then((result) => {
      if (this.authService.checkFormatNumber(result.value, 'quantity', item.uomCode)) {
        this.moveItem = true;
        this.quantity = result.value;
        this.item = Object.assign({}, item);
        this.orderMove = Object.assign({}, order);
        this.fucnMoveTable();
      }
      else {
        this.alertity.warning("Quantity format invalid !")
      }
    })
  }

  fucntionMore() {
    //debugger;
    this.itemselected = [];
    this.popupVisibleMore = true;
    this.sourceData = this.sourceData.filter(x => x.storeId === this.storeId && x.placeId !== this.placeId);
    var result = this.tableInforList.reduce(function (obj, item) {
      console.log("item", item);

      let key = item.orderCustomF2;
      debugger
      if (key === null || key === undefined || key === '') {
        key = "orther";
      }
      if (key !== "orther") {
        obj[key] = obj[key] || [];
        obj[key].name = key;
        obj[key].color = item.orderCustomF3;
        if (obj[key].lines === null || obj[key].lines === undefined || obj[key]?.lines?.length === 0) {
          obj[key].lines = [];
        }

        obj[key].lines.push(item);
      }
      return obj;
    }, {});
    let responseProps = Object.keys(result);
    let cashierPaymentResponse = [];
    for (let prop of responseProps) {
      cashierPaymentResponse.push(result[prop]);
    }
    this.listTableMore = cashierPaymentResponse;
    console.log("listTableMore", this.listTableMore);
    this.showPlace = true;
    this.viewShowDetail = false;
    this.showSelected = false;
    this.showMove = false;
    //dat
  }

  loadInfoItem() {
    this.placeService.getAll(this.loginInfo.companyCode, this.placeId, "").subscribe((res: any) => {
      if (res.success) {
        this.sourceData = res.data
        console.log("res", this.sourceData);
      }
      else {
        this.alertity.warning(res.message)
      }
    })
  }

  moveTableCashier(placeNew) {
    this.router.navigate(["admin/table-cashier/", placeNew.storeId, placeNew.placeId]).then(() => {
      window.location.reload();
    });
  }

  backtoList() {
    this.router.navigate(['/admin/masterdata/place-info']);
  }

  // funcHeight(iput){
  //   this.reloadModel();
  //   //debugger;
  //   setTimeout(() => {
  //     let arrheight = this.diagram.instance.getItems()
  //     arrheight.forEach(x=>{
  //       //debugger;

  //       if(x.dataItem.isOrdered === true){
  //         //debugger;
  //         console.log('Xóa 1')

  //         this.dataSource.push([{type:'remove',key:x.dataItem.tableId??x.key}])
  //       }
  //       else{
  //         if(x.dataItem.height<iput && x.dataItem.isOrdered===false){
  //           //debugger;
  //           console.log('Xóa 2')
  //           this.dataSource.push([{type:'remove',key:x.dataItem.tableId??x.key}])

  //         }
  //       }
  //     })
  //   }, 500);
  // }
}

export class Tab {
  id: number;
  text: string;
  icon: string;
  content: string;
} 