import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, Observable, Subject } from 'rxjs';
import { ItemSearch } from 'src/app/shop/components/shop-search-item/shop-search-item.component';
import { MCustomer } from 'src/app/_models/customer';
import { ErrorList } from 'src/app/_models/inventorycounting';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { MUom } from 'src/app/_models/muom';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { AverageNumberModel, TPurchaseRequestHeader, TPurchaseRequestLine, TPurchaseRequestLineSerial, TPurchaseRequestLineTemplate } from 'src/app/_models/purchase';
import { MStorage } from 'src/app/_models/storage';
import { MStore } from 'src/app/_models/store';
import { MTax } from 'src/app/_models/tax';
import { MWarehouse } from 'src/app/_models/warehouse';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { ItemuomService } from 'src/app/_services/data/itemuom.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { StorageService } from 'src/app/_services/data/storage.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { StorewarehouseService } from 'src/app/_services/data/storewarehouse.service';
import { TaxService } from 'src/app/_services/data/tax.service';
import { UomService } from 'src/app/_services/data/uom.service';
import { WarehouseService } from 'src/app/_services/data/warehouse.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';
import { purchaseRequestService } from 'src/app/_services/transaction/puchaserequest.service';
import Swal from 'sweetalert2';
import { Row } from 'jspdf-autotable';

@Component({
  selector: 'app-management-purchaserequest-detail',
  templateUrl: './management-purchaserequest-detail.component.html',
  styleUrls: ['./management-purchaserequest-detail.component.scss'],
  providers: [DatePipe] // Add this
})
export class ManagementPurchaseRequestDetailComponent implements OnInit {

  currentValue: Date = new Date();
  purchase: TPurchaseRequestHeader = new TPurchaseRequestHeader();
  lines: TPurchaseRequestLine[];
  itemList: any;
  taxList: MTax[];
  storageList: MWarehouse[];
  serialList: MItemSerial[];
  uomList: MUom[];
  mode: string;
  issueId: string;
  isNew = false;
  gridBoxValue: string[] = [];
  storeList: MStore[];
  customerList: MCustomer[];
  isActive = false;
  storeSelected: MStore = new MStore();
  isEditGrid = false;
  configStorage: boolean = true;
  importContent: TPurchaseRequestLineTemplate[] = [];
  ErrorRepair: ErrorList[] = [];
  Erroreexcel: ErrorList[] = [];
  ListNotExitItem: ErrorList[] = [];
  ListNullItem = [];
  ListNullBarcode = [];
  ListNullUom = [];
  ListNullSlocid = [];
  ListNullQuantity = [];
  ListNullTax: ErrorList[] = [];
  nowDate: string;
  statusOptions = [
    {
      value: "O", name: "Open",
    },
    {
      value: "C", name: "Closed",
    },

  ];
  inputWithoutConfig = "true";
  salesRotationConfig = "false";
  qtyPattern: any = '';
  lguAdd: string = "Add";
  isSave = true;
  forNum: string = "2";
  onToolbarPreparing(e) {
    if (this.mode !== 'edit' && this.purchase.dataSource === 'POS' && this.purchase.status !== 'C'
      && (this.purchase.docEntry === null || this.purchase.docEntry === undefined || this.purchase.docEntry === '')) {
      e.toolbarOptions.items.unshift({
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: this.lguAdd,
          onClick: this.addNewLine.bind(this)
        }
      });
    }


  }
  rowEdit = 0;
  waitingData = false;
  onEditingStart(e) {
    this.rowEdit = e.component.getRowIndexByKey(e.key)
    // console.log('edit', e.data);
    // this.NumOfTurns(e.data);
  }
  addNewLine() {
    // this.dataGrid.instance.validating();
    setTimeout(x => {
      this.dataGrid.instance.addRow();
    }, 200);
  }
  setToDateValue;
  setFromDateValue;
  setQty;
  loadformat;

  constructor(public authService: AuthService, private purchaseService: purchaseRequestService, private whsService: WarehouseService, private alertifyService: AlertifyService, private datePipe: DatePipe,
    private uomService: UomService, private customerService: CustomerService, private inventoryService: InventoryService, private controlService: ControlService,
    private taxService: TaxService, private storeService: StoreService, private storageService: StorageService, public itemUomService: ItemuomService,
    private itemService: ItemService, private route: ActivatedRoute, private router: Router, private excelSrv: ExcelService, private formBuilder: FormBuilder,
    private printService: PrintService, private storewarehouseService: StorewarehouseService, private warehouseService: WarehouseService,
    public commonService: CommonService, private modalService: BsModalService) {
    this.storeSelected = this.authService.storeSelected();
    // this.loadItemList();
    this.loadTaxList();
    // this.loadStorageList();
    this.loadUom();
    this.loadStore();
    this.loadCustomer();
    this.getItemFilterControlList();
    this.customizeText = this.customizeText.bind(this);
    let self = this;

    self.loadformat = this.authService.loadFormat().qtyDecimalPlacesFormat.toString();
    console.log("this.loadformat", this.loadformat);
    // this.setFromDateValue = function setFromDateValue(rowData: any, value: any, currentRowData) {
    //   if (value !== null && value !== undefined) {
    //     currentRowData.fromDate = value;
    //     rowData.fromDate = value;
    //     rowData.numOfDate = self.CalculateNumOfDay(currentRowData);
    //     // (<any>this).defaultSetCellValue(rowData, value);
    //     if (currentRowData.fromDate !== null && currentRowData.fromDate !== undefined && currentRowData.toDate !== null && currentRowData.toDate !== undefined) {
    //       let sumday = self.SetNumOfDay(currentRowData, rowData.numOfDate);
    //       self.waitingData = true;
    //       debugger;
    //       // await timer(3000).pipe(take(1)).toPromise(); 
    //       forkJoin(sumday).subscribe(responseTotal => {
    //         // all observables have been completed
    //         debugger;
    //         console.log('response', responseTotal);
    //         let responseSumday = responseTotal[0];
    //         if (responseSumday.data !== null || responseSumday.dataField !== undefined) {
    //           let data = responseSumday.data;
    //           debugger;
    //           console.log("1 response.data", data);
    //           let total = 0;
    //           let cancel = 0;
    //           let returnt = 0;
    //           let lastQtyOrder = 0;
    //           if (data.averageNumberSaleModel?.length > 0) {
    //             total = Number(data.averageNumberSaleModel[0]?.quantityTotal ?? 0);
    //             cancel = Number(Math.abs(data?.averageNumberSaleModel[0]?.quantityCancel ?? 0));
    //             returnt = Number(Math.abs(data?.averageNumberSaleModel[0]?.quantityReturn ?? 0));
    //           }

    //           if (data.qtyPOModel?.length > 0) {
    //             lastQtyOrder = Number(Math.abs(data?.qtyPOModel[0]?.quantity ?? 0));
    //           }

    //           console.log("data", total, cancel, returnt);
    //           let qtyTotal = ((total - (cancel + returnt)) / rowData.numOfDate);
    //           rowData.salesDay = qtyTotal.toFixed(self.loadformat);

    //           let sumWeek = self.SetNumOfWeek(rowData);
    //           let sumMonth = self.SetNumOfMonth(rowData);

    //           this.forNum = self.loadformat;
    //           console.log("this.forNum", this.forNum);

    //           rowData.lastQtyOrder = lastQtyOrder;
    //           rowData.salesWeek = sumWeek;
    //           rowData.salesMonth = sumMonth;
    //           currentRowData.salesDay = qtyTotal.toFixed(self.loadformat);
    //           currentRowData.lastQtyOrder = lastQtyOrder;
    //           currentRowData.salesWeek = sumWeek;
    //           currentRowData.salesMonth = sumMonth;

    //           let turns = self.NumOfTurns(currentRowData, true);
    //           rowData.turns = turns;
    //           let row = self.rowEdit;// self.countRow - 1;
    //           self.dataGrid.instance.cellValue(row, 'salesDay', qtyTotal.toFixed(self.loadformat));
    //           self.dataGrid.instance.cellValue(row, 'lastQtyOrder', lastQtyOrder);
    //           self.dataGrid.instance.cellValue(row, 'salesWeek', sumWeek);
    //           self.dataGrid.instance.cellValue(row, 'salesMonth', sumMonth);
    //           self.dataGrid.instance.cellValue(row, 'turns', turns);
    //           // (<any>this).defaultSetCellValue(rowData, value);
    //           self.waitingData = false;
    //         }



    //       });
    //     }
    //     (<any>this).defaultSetCellValue(rowData, value);
    //     // (<any>this).defaultSetCellValue(rowData, value);
    //   }

    // }


    ///////////////////////////
    // this.setToDateValue = async function setToDateValue(rowData: any, value: any, currentRowData, componentInstance) {
    //   console.log('componentInstance', componentInstance);
    //   if (value !== null && value !== undefined) {
    //     currentRowData.toDate = value;
    //     rowData.toDate = value;
    //     rowData.numOfDate = self.CalculateNumOfDay(currentRowData);

    //     debugger;
    //     if (currentRowData.fromDate !== null && currentRowData.fromDate !== undefined && currentRowData.toDate !== null && currentRowData.toDate !== undefined) {
    //       let sumday = self.SetNumOfDay(currentRowData, rowData.numOfDate);

    //       self.waitingData = true;
    //       debugger;
    //       // await timer(3000).pipe(take(1)).toPromise(); 
    //       forkJoin(sumday).subscribe(responseTotal => {
    //         // all observables have been completed
    //         debugger;
    //         console.log('response', responseTotal);
    //         let responseSumday = responseTotal[0];
    //         if (responseSumday.data !== null || responseSumday.dataField !== undefined) {
    //           let data = responseSumday.data;
    //           debugger;
    //           console.log("1 response.data", data);
    //           let total = 0;
    //           let cancel = 0;
    //           let returnt = 0;
    //           let lastQtyOrder = 0;
    //           let qtyTotal = 0;
    //           if (data.averageNumberSaleModel?.length > 0) {
    //             total = Number(data.averageNumberSaleModel[0]?.quantityTotal ?? 0);
    //             cancel = Number(Math.abs(data?.averageNumberSaleModel[0]?.quantityCancel ?? 0));
    //             returnt = Number(Math.abs(data?.averageNumberSaleModel[0]?.quantityReturn ?? 0));
    //           }
    //           if (data.qtyPOModel?.length > 0) {
    //             lastQtyOrder = Number(Math.abs(data?.qtyPOModel[0]?.quantity ?? 0));

    //           }
    //           console.log("data 1", total, cancel, returnt);
    //           if (data.averageNumberSaleModel[0]?.quantityTotal > 0) {
    //             qtyTotal = ((total - (cancel + returnt)) / rowData.numOfDate);
    //           }
    //           this.forNum = self.loadformat;
    //           console.log("this.forNum", this.forNum);
    //           rowData.salesDay = qtyTotal.toFixed(self.loadformat);
    //           let sumWeek = self.SetNumOfWeek(rowData);
    //           let sumMonth = self.SetNumOfMonth(rowData);

    //           // this.setQty = this.SetQty(qtyTotal);
    //           // var a = await this.getDAta(qtyTotal);
    //           // console.log("2 this.qtyTotal", qtyTotal)
    //           // this.flag = true;

    //           rowData.lastQtyOrder = lastQtyOrder;
    //           rowData.salesWeek = sumWeek;
    //           rowData.salesMonth = sumMonth;
    //           debugger;

    //           currentRowData.salesDay = qtyTotal.toFixed(self.loadformat);
    //           currentRowData.lastQtyOrder = lastQtyOrder;
    //           currentRowData.salesWeek = sumWeek;
    //           currentRowData.salesMonth = sumMonth;

    //           let turns = self.NumOfTurns(currentRowData, true);
    //           rowData.turns = turns;
    //           let row = self.rowEdit;// self.countRow - 1;
    //           // console.log(row)
    //           self.dataGrid.instance.cellValue(row, 'salesDay', qtyTotal.toFixed(self.loadformat));
    //           self.dataGrid.instance.cellValue(row, 'lastQtyOrder', lastQtyOrder);
    //           self.dataGrid.instance.cellValue(row, 'salesWeek', sumWeek);
    //           self.dataGrid.instance.cellValue(row, 'salesMonth', sumMonth);
    //           self.dataGrid.instance.cellValue(row, 'turns', turns);
    //           // (<any>this).defaultSetCellValue(rowData, value);
    //           self.waitingData = false;
    //         }



    //       });
    //     }
    //     (<any>this).defaultSetCellValue(rowData, value);
    //     // (<any>this).defaultSetCellValue(rowData, value);
    //   }
    // }

    // this.setFromDateValue = async function setFromDateValue(rowData: any, value: any, currentRowData) {
    //   if (value !== null && value !== undefined) {
    //     currentRowData.toDate = value;
    //     rowData.toDate = value;
    //     // rowData.numOfDate = self.CalculateNumOfDay(currentRowData);
    //     let numOfDate = self.CalculateNumOfDay(currentRowData);

    //     // debugger;
    //     if (currentRowData.fromDate !== null && currentRowData.fromDate !== undefined && currentRowData.toDate !== null && currentRowData.toDate !== undefined) {
    //       // let sumday = self.SetNumOfDay(currentRowData, rowData.numOfDate);
    //       let sumday = self.SetNumOfDay(currentRowData, numOfDate);

    //       self.waitingData = true;
    //       debugger;
    //       // await timer(3000).pipe(take(1)).toPromise(); 
    //       forkJoin(sumday).subscribe(responseTotal => {
    //         // all observables have been completed
    //         // debugger;
    //         console.log('response', responseTotal);
    //         let responseSumday = responseTotal[0];
    //         if (responseSumday.data !== null || responseSumday.dataField !== undefined) {
    //           let data = responseSumday.data;
    //           // debugger;
    //           console.log("1 response.data", data);
    //           let total = 0;
    //           let cancel = 0;
    //           let returnt = 0;
    //           let lastQtyOrder = 0;
    //           let qtyTotal = 0;
    //           if (data.averageNumberSaleModel?.length > 0) {
    //             total = Number(data.averageNumberSaleModel[0]?.quantityTotal ?? 0);
    //             cancel = Number(Math.abs(data?.averageNumberSaleModel[0]?.quantityCancel ?? 0));
    //             returnt = Number(Math.abs(data?.averageNumberSaleModel[0]?.quantityReturn ?? 0));
    //           }
    //           if (data.qtyPOModel?.length > 0) {
    //             lastQtyOrder = Number(Math.abs(data?.qtyPOModel[0]?.quantity ?? 0));

    //           }
    //           if (data.averageNumberSaleModel[0]?.quantityTotal > 0) {
    //             qtyTotal = ((total - (cancel + returnt)) / numOfDate);
    //           }
    //           this.forNum = self.loadformat;
    //           rowData.salesDay = qtyTotal.toFixed(self.loadformat);
    //           let sumWeek = self.SetNumOfWeek(rowData);
    //           let sumMonth = self.SetNumOfMonth(rowData);
    //           let turns = self.NumOfTurns(currentRowData, true);
             
    //           let customField1 = "numOfDate:" + numOfDate + "|salesDay:" + qtyTotal.toFixed(self.loadformat) + "|salesWeek:" + sumWeek + "|salesMonth:" + sumMonth + "|turns:" + turns + "|shelfLife:" + currentRowData.customField3 + "|lastQtyOrder:" + lastQtyOrder + "|min:" + currentRowData.customField8 + "|max:" + currentRowData.customField9;
    //           console.log("string", customField1);
    //           let row = self.rowEdit;
    //           self.dataGrid.instance.cellValue(row, 'customField1', customField1);

    //           self.waitingData = false;

    //         }
    //       });
    //       (<any>this).defaultSetCellValue(rowData, value);

    //     }
    //   }
    // }
    
    this.setToDateValue = async function setToDateValue(rowData: any, value: any, currentRowData) {

      console.log("todate rowData", rowData);
      console.log("todate value", value);
      console.log("todate currentRowData", currentRowData);
      if (value !== null && value !== undefined) {
        currentRowData.toDate = value;
        rowData.toDate = value;
        // rowData.numOfDate = self.CalculateNumOfDay(currentRowData);
        let numOfDate = self.CalculateNumOfDay(currentRowData);

        // debugger;
        if (currentRowData.fromDate !== null && currentRowData.fromDate !== undefined && currentRowData.toDate !== null && currentRowData.toDate !== undefined) {
          // let sumday = self.SetNumOfDay(currentRowData, rowData.numOfDate);
          let sumday = self.SetNumOfDay(currentRowData, numOfDate);

          self.waitingData = true;
          debugger;
          // await timer(3000).pipe(take(1)).toPromise(); 
          forkJoin(sumday).subscribe(responseTotal => {
            // all observables have been completed
            // debugger;
            console.log('response', responseTotal);
            let responseSumday = responseTotal[0];
            if (responseSumday.data !== null || responseSumday.dataField !== undefined) {
              let data = responseSumday.data;
              // debugger;
              console.log("1 response.data", data);
              let total = 0;
              let cancel = 0;
              let returnt = 0;
              let lastQtyOrder = 0;
              let qtyTotal = 0;
              if (data.averageNumberSaleModel?.length > 0) {
                total = Number(data.averageNumberSaleModel[0]?.quantityTotal ?? 0);
                cancel = Number(Math.abs(data?.averageNumberSaleModel[0]?.quantityCancel ?? 0));
                returnt = Number(Math.abs(data?.averageNumberSaleModel[0]?.quantityReturn ?? 0));
              }
              if (data.qtyPOModel?.length > 0) {
                lastQtyOrder = Number(Math.abs(data?.qtyPOModel[0]?.quantity ?? 0));

              }
              if (data.averageNumberSaleModel[0]?.quantityTotal > 0) {
                qtyTotal = ((total - (cancel + returnt)) / numOfDate);
              }
              this.forNum = self.loadformat;
              rowData.salesDay = qtyTotal.toFixed(self.loadformat);
              let sumWeek = self.SetNumOfWeek(rowData);
              let sumMonth = self.SetNumOfMonth(rowData);
              let turns = self.NumOfTurns(currentRowData, true);
              let c3 = 0;
              let c8 = 0;
              let c9 = 0;
              if(Number(currentRowData.customField3) && !isNaN(currentRowData.customField3)){
                c3 = currentRowData.customField3;
              }
              if(Number(currentRowData.customField8) && !isNaN(currentRowData.customField8)){
                c8 = currentRowData.customField8;
              }
              if(Number(currentRowData.customField9) && !isNaN(currentRowData.customField9)){
                c9 = currentRowData.customField9;
              }
              let customField1 = "NumOfDay: " + numOfDate + " | OnHand: "+ currentRowData.openQty + " | SaleFor1Day: " + qtyTotal.toFixed(self.loadformat) + " |SaleForWeek: " + sumWeek + " | SaleForMonth: " + sumMonth + " | VongQuayDiHang: " + turns + " | ShelfLife: " + c3 + " | LastQtyOrder: " + lastQtyOrder + " | Min: " + c8 + " | Max: " + c9;
              console.log("string", customField1);
              let row = self.rowEdit;
              self.dataGrid.instance.cellValue(row, 'customField1', customField1);

              self.waitingData = false;

            }
          });
          (<any>this).defaultSetCellValue(rowData, value);

        }
      }
    }

  }

  itemSearchForm: FormGroup;
  functionIdFilter = "Cpn_ItemFilter";
  controlList: any[];
  groupControlList = {};
  searchModel: ItemSearch;
  searchItem() {

    let filter = this.searchModel;
    let itemCode = (filter.itemCode === null || filter.itemCode === undefined) ? '' : filter.itemCode;
    let uomcode = (filter.uomcode === null || filter.uomcode === undefined) ? '' : filter.uomcode;
    let barcode = (filter.barcode === null || filter.barcode === undefined) ? '' : filter.barcode;
    let keyword = (filter.keyword === null || filter.keyword === undefined) ? '' : filter.keyword;
    // debugger;
    this.loadItemList(itemCode, uomcode, barcode, keyword);
  }
  getItemFilterControlList() {

    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionIdFilter).subscribe((response: any) => {
      if (response.data.length > 0) {

        this.searchModel = new ItemSearch();
        this.controlList = response.data.filter(x => x.controlType !== 'Button' && x.controlType === 'TextBox');

        let group: any = {};
        this.controlList.forEach(item => {
          if (item.controlType === "DateTime") {
            debugger;
            if (this.searchModel[item.controlId] === null || this.searchModel[item.controlId] === undefined) {

              group[item.controlId] = new FormControl({ value: null, disabled: false });
            }
            else {

              let date = new Date(this.searchModel[item.controlId]);
              this.searchModel[item.controlId] = new Date(this.searchModel[item.controlId]);

              group[item.controlId] = new FormControl({ value: date, disabled: false });
            }
          }
          else {
            group[item.controlId] = [''];

          }
        });

        this.itemSearchForm = this.formBuilder.group(group);

        if (this.controlList.length > 0) {

          var groups = this.controlList.reduce(function (obj, item) {
            obj[item.controlType] = obj[item.controlType] || [];

            obj[item.controlType].push({
              controlId: item.controlId,
              companyCode: item.companyCode,
              controlName: item.controlName,
              functionId: item.functionId,
              action: item.action,
              controlType: item.controlType,
              createdBy: item.createdBy,
              createdOn: item.createdOn,
              optionName: item.optionName,
              require: item.require,
              optionKey: item.optionKey,
              custom1: item.custom1,
              custom2: item.custom2,
              optionValue: item.optionValue,
              status: item.status,
              orderNum: item.orderNum,
              isView: item.isView,
            });
            return obj;
          }, {});
          this.groupControlList = Object.keys(groups).map(function (key) {
            let indexKey = 0;
            if (key === "CheckBox") {
              indexKey = 6;
            } else if (key === "DateTime") {
              indexKey = 2;
            } else if (key === "TextBox") {
              indexKey = 3;
            } else if (key === "DropDown") {
              indexKey = 4;
            }
            return { controlType: key, arrayGroup: groups[key], index: indexKey, len: groups[key].length };
          }).sort((a, b) => a.index > b.index ? 1 : -1);


          console.log('this.groupControlList', this.groupControlList);

        }
      }
    });
  }
  loadCustomer() {
    this.customerService.getByCompany(this.storeSelected.companyCode, "S").subscribe((response: any) => {
      // this.customerList= response;
      if (response.success) {
        this.customerList = response.data;
      }
      else {
        this.alertifyService.warning(response.message)
      }
    });
  }
  customizeText(e) {
    // debugger;
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  loadStore() {

    this.storeService.getByUser(this.authService.getCurrentInfor().username).subscribe((response: any) => {
      if (response.success) {
        this.storeList = response.data;
        // this.storeList= response;
        if (this.storeList !== null && this.storeList !== undefined) {

          this.purchase.storeId = this.storeSelected.storeId;

          if (this.configStorage) {
            this.warehouseService.GetWarehouseByWhsType(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any) => {
              if (response.success) {
                // S: Main W: Order
                const arrByWhs = response.data.filter(s => s.whsType !== "T");
                console.log("arrByWhs", arrByWhs);
                this.storageList = arrByWhs;
              }
              else {
                this.alertifyService.warning(response.message);
              }
            })
          } else {
            this.storageService.getByStore(this.storeSelected.storeId, this.storeSelected.companyCode).subscribe((response: any) => {
              // this.storageList = response;
              if (response.success) {
                this.storageList = response.data;
              }
              else {
                this.alertifyService.warning(response.message);
              }
            })
          }

        }
      }
      else {
        this.alertifyService.warning(response.message);
      }

    });
  }
  ngAfterViewInit() {


  }
  onTaxSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent): void {
    // debugger; 
    console.log(e);
    cellInfo.setValue(selectedRowKeys[0]);

    if (selectedRowKeys.length > 0) {
      dropDownBoxComponent.close();
      // let code =event.selectedRowsData[0].itemCode;
      // debugger;
      let price = this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price')
      let percent = event.selectedRowsData[0].taxPercent;

      let taxamt = price * percent / 100;
      let linetotal = price + taxamt;
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxAmt', taxamt);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxRate', percent);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxCode', selectedRowKeys[0]);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lineTotal', linetotal);
      // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 

    }
  }
  getLastedPrice(itemCode, uomCode) {
    return this.purchaseService.GetLastPricePO(this.storeSelected.companyCode, this.storeSelected.storeId, itemCode, uomCode, '');
  }
  getItemPrice(itemCode, uomCode) {
    return this.itemService.GetItemPrice(this.storeSelected.companyCode, this.storeSelected.storeId, itemCode, uomCode, '');
  }

  
  async onItemSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
    // debugger;
    cellInfo.setValue(selectedRowKeys[0]);
    if (selectedRowKeys.length > 0) {
      dropDownBoxComponent.close();
      let code = event.selectedRowsData[0].itemCode;
      let name = event.selectedRowsData[0].itemName;
      let uom = event.selectedRowsData[0].uomCode;
      let barcode = event.selectedRowsData[0].barCode;
      let price = event.selectedRowsData[0].defaultPrice;
      let customField3 = event.selectedRowsData[0].customField3;
      let customField8 = event.selectedRowsData[0].customField8;
      let customField9 = event.selectedRowsData[0].customField9;
      let allowDecimal = false;
      if (this.authService.checkFormatNumber(1.5, "quantity", uom)) {
        allowDecimal = true;
      }

      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'itemCode', code);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'description', name);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'currencyCode', this.storeSelected.currencyCode);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'uomCode', uom);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'barCode', barcode);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'quantity', '1');
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'openQty', '0');
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'customField3', customField3);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'customField8', customField8);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'customField9', customField9);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'allowDecimal', allowDecimal);
      console.log("event.selectedRowsData[0]", event.selectedRowsData[0]);
      let quantity = 0;
      if (this.slocFromDefault !== null && this.slocFromDefault !== undefined) {
        await this.itemService.getItemStock(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, this.slocFromDefault,
          code, uom, barcode, '').subscribe((response: any) => {
            if (response.data !== null && response.data !== undefined && response.data.length > 0) {
              quantity = response.data[0].quantity;
            }
            quantity = quantity;
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'openQty', quantity);
          })
      }

      this.getItemPrice(code, uom).subscribe((response: any) => {
        if (response !== null && response !== undefined && response !== '') {
          let priceAfterVAT = response.data.priceAfterTax
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price', priceAfterVAT);
          this.getLastedPrice(code, uom).subscribe((response: any) => {
            if (response !== null && response !== undefined && response !== '') {
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lastPrice', response.data);
            }
            else {
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lastPrice', price);
            }

          });
        }
        else {
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price', 0);
          this.getLastedPrice(code, uom).subscribe((response: any) => {
            if (response !== null && response !== undefined && response !== '') {
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lastPrice', response);
            }
            else {
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lastPrice', price);
            }

          });
        }

      });


      setTimeout(() => {
        this.dataGrid.instance.saveEditData();
      }, 200);
    }

  }

  onEditorPreparing(e) {
    // debugger;
    if (e.parentType === "dataRow" && e.dataField === "uomCode") {

      // e.editorOptions.disabled = (typeof e.row.data.itemCode !== "number");
      this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, e.row.data.itemCode).subscribe((response: any) => {
        // this.uomList = response; 
        if (response.success) {
          // debugger;
          this.uomList = response.data;
        }
        else {
          this.alertifyService.error(response.message);
        }
      })
    }
  }
  updateProductName(eventData, cellInfo: any) {

    if (cellInfo.setValue) {
      cellInfo.setValue(eventData.value);
    }
  }
  checkLines(lines) {
    let rs = true;
    // lines.forEach(line => {
    //   let amountX = line.lastPrice * 10 / 100;
    //   let fromAmt = line.lastPrice - amountX ;
    //   let toAmt = amountX + line.lastPrice;
    //   if(line.price > toAmt || line.price < fromAmt)
    //   {
    //     rs = false;
    //     return rs;
    //   }
    // });
    return rs;
  }
  checkInput() {
    let rs = true;
    // if(this.purchase.cardCode===null || this.purchase.cardCode===undefined || this.purchase.cardCode==='')
    // {
    //   rs= false;
    //   this.alertifyService.warning('Please input Vendor');
    // }
    // if (this.purchase.docDate === null || this.purchase.docDate === undefined || this.purchase.docDate === '') {
    //   rs = false;
    //   this.alertifyService.warning('Please input DocDate');
    // }
    // if (this.purchase.docDueDate === null || this.purchase.docDueDate === undefined || this.purchase.docDueDate === '') {
    //   rs = false;
    //   this.alertifyService.warning('Please input Doc Due Date');
    // }
    // if (this.purchase.storeId === null || this.purchase.storeId === undefined || this.purchase.storeId === '') {
    //   rs = false;
    //   this.alertifyService.warning('Please input store');
    // }

    return rs;
  }
  closePO() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to close !',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.purchase.status = 'C';
        this.purchase.modifiedBy = this.authService.getCurrentInfor().username;
        this.purchaseService.updateStatus(this.purchase).subscribe((response: any) => {
          if (response.success === true) {
            this.alertifyService.success("Close transaction successfully completed.");

          }
          else {
            this.alertifyService.error(response.message);
          }
        });
      }
    });
  }
  cancelPO() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel !',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.purchase.status = 'C';
        this.purchase.modifiedBy = this.authService.getCurrentInfor().username;
        this.purchaseService.updatecancel(this.purchase).subscribe((response: any) => {
          if (response.success === true) {
            this.alertifyService.success("Cancel transaction successfully completed.");

          }
          else {
            this.alertifyService.error(response.message);
          }
        });
      }
    });
  }
  @ViewChild('dataGrid', { static: false }) dataGrid;
  GetDateFormat(date) {
    if (date !== null && date !== undefined && date != '') {
      var month = (date.getMonth() + 1).toString();
      month = month.length > 1 ? month : '0' + month;
      var day = date.getDate().toString();
      day = day.length > 1 ? day : '0' + day;
      return date.getFullYear() + '-' + month + '-' + (day);
    }
    else return null;
  }

  saveModel() {

    if (this.checkInput()) {
      let gridInstance = this.dataGrid.instance as any;
      let check = true;
      gridInstance.getController('validating').validate(true).done(function (result) {
        //check result. It should be true or false.
        //  console.log(result);
        // console.log(result);
        check = result;
      });
      if (check) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to save!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            // debugger;
            let VATTotal: number = 0;
            let DocTotal: number = 0;
            let storeClient = this.authService.getStoreClient();
            if (storeClient !== null && storeClient !== undefined) {
              this.purchase.terminalId = this.authService.getStoreClient().publicIP;
            }
            else {
              this.purchase.terminalId = this.authService.getLocalIP();
            }
            this.isSave = false;
            this.lines.forEach((item) => {

              if (item.lineTotal !== null && item.lineTotal !== undefined) {
                DocTotal += parseInt(item.lineTotal.toString());
              }
              else {
                let lineTotal = item.quantity * item.price;
                DocTotal += lineTotal;
              }
              if (item.lineTotal !== null && item.lineTotal !== undefined && item.vatpercent !== null && item.vatpercent !== undefined) VATTotal += parseInt(item.vatpercent.toString()) * parseInt(item.lineTotal.toString());

            })
            // this.purchase.docDate = this.datePipe.transform(this.purchase.docDate, 'yyyy-MM-dd HH:mm:ss');
            // this.purchase.docDate = new Date(this.purchase.docDate.toString() + 'UTC');
            // this.purchase.docDueDate = new Date(this.purchase.docDueDate.toString() + 'UTC');
            this.purchase.storeId = this.purchase.storeId;
            this.purchase.storeName = this.purchase.storeName;
            this.purchase.companyCode = this.storeSelected.companyCode;
            this.purchase.vattotal = VATTotal;
            this.purchase.docTotal = DocTotal;
            this.lines.forEach(element => {
              element.fromDate = this.GetDateFormat(element.fromDate);
              element.toDate = this.GetDateFormat(element.toDate);
            });
            this.purchase.lines = this.lines;
            // this.purchase.isCanceled = 'N';
            this.purchase.isCanceled = 'N';
            if (this.isNew === true) {
              //  this.purchase.dataSource = 'POS'; 
              this.purchase.status = 'O';
              this.purchase.docStatus = 'O';
              this.purchase.createdBy = this.authService.decodeToken?.unique_name;
            }
            else {
              this.purchase.modifiedBy = this.authService.decodeToken?.unique_name;
            }
            this.purchase.cardCode = null;
            let checkLine = this.checkLines(this.purchase.lines);
            // debugger;
            if (checkLine === true) {
              this.purchaseService.SavePO(this.purchase).subscribe((response: any) => {
                this.isSave = true;
                if (response.success === true) {
                  this.alertifyService.success("Create successfully completed. Trans Id: " + response.message);
                  // debugger;

                  this.router.navigate(["admin/purchaserequest/edit", response.message]);
                }
                else {
                  this.alertifyService.error(response.message);
                }
              });
            }
            else {
              this.isSave = true;
              this.alertifyService.warning('Please check price in line.');
            }

          }
        });

      }
    }


  }
  onFromStoreChanged(store) {
    if (store !== null && store !== undefined) {
      this.loadStorageList(store);
    }
  }
  onItemBuySelectionChanged(selectedRowKeys, dropDownBoxComponent) {

    // cellInfo.setValue(selectedRowKeys[0]);

    if (selectedRowKeys.length > 0) {
      // debugger;

      dropDownBoxComponent.close();



    }

  }
  whs: MWarehouse;
  loadDefaultWhs(whs) {
    this.whsService.getItem(this.authService.getCurrentInfor().companyCode, whs).subscribe((response: any) => {
      // this.whs = response;
      if (response.success) {
        this.whs = response.data.filter(s => s.whsType !== "T");
        console.log("this.whs", this.whs);

      }
      else {
        this.alertifyService.error(response.message);
      }
    });
  }
  dataSourceItem: any;
  dateFormat = "";

  functionId = "Adm_PurchaseRequest";
  canEdit = false;
  canAdd = false;


  countRow = 0;
  slocFromDefault = "";
  onInitNewRow(e) {
    this.countRow++;
    e.data.slocId = this.slocFromDefault;
    this.rowEdit = 0;
    console.log("this.rowEdit", this.rowEdit);
  }
  checkFormatQty() {
    let format = this.authService.loadFormat();
    if (format !== null || format !== undefined) {
      let inputWithoutConfig = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'InputWithoutConfig');
      if (inputWithoutConfig !== null && inputWithoutConfig !== undefined) {

        this.inputWithoutConfig = inputWithoutConfig.settingValue;
      }

      let salesRotationConfig = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'SalesRotation');
      if (salesRotationConfig !== null && salesRotationConfig !== undefined) {

        this.salesRotationConfig = salesRotationConfig.settingValue;
      }

      if (this.inputWithoutConfig === 'false') {
        this.qtyPattern = '^-?[0-9]\\d*(\\.\\d{1,' + format.qtyDecimalPlacesFormat.toString() + '})?$';
      }
    }
  }
  ngOnInit() {
    // debugger;

    this.nowDate = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
    let check = this.authService.checkRole(this.functionId, '', 'V');
    // this.loadDefaultWhs(this.authService.storeSelected().whsCode);
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.checkFormatQty();
    this.canAdd = this.authService.checkRole(this.functionId, '', 'I');
    this.canEdit = this.authService.checkRole(this.functionId, '', 'E');
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.route.params.subscribe(data => {
      this.mode = data['m'];
      this.issueId = data['id'];
    })
    if (this.mode === 'edit') {

      this.purchaseService.getBill(this.issueId, this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any) => {
        this.purchase = response;


        // debugger;
        this.lines = response.lines;

        console.log("this.lines", this.lines);

        // this.getFilteredUom = this.getFilteredUom.bind(this.lines);
        this.isNew = false;
      });
    }
    else {
      this.purchase = new TPurchaseRequestHeader();
      this.lines = [];
      // console.log(this.goodreceipt);
      this.isNew = true;
      this.purchase.dataSource = 'POS';
      // this.purchase.syncMWIStatus = ;
      // this.loadUom();
    }

  }

  // @ViewChild('dataGrid', { static: false }) dataGrid;
  @ViewChild('gridBox') gridBox;
  @ViewChild('gridTaxBox') gridTaxBox;
  @ViewChild('gridUoMBox', { static: false }) gridUoMBox;
  @ViewChild('dropDownUoM') dropDownUoM;
  taxAmtCellValue(rowData) {

    if (rowData.quantity !== undefined && rowData.price !== undefined) {
      // debugger;
      let amount = rowData.quantity * rowData.price;
      if (amount !== null && amount !== undefined) {
        let taxpercent = rowData.taxRate;

        return amount * taxpercent / 100;
      }
    }

    return 0;
  }

  onRowValidating(e) {
    // debugger;
    if (e.newData.price) {
      let amountX = e.oldData.lastPrice * 10 / 100;
      let fromAmt = e.oldData.lastPrice - amountX;
      let toAmt = amountX + e.oldData.lastPrice;
      if (e.newData.price > toAmt || e.newData.price < fromAmt) {
        e.errorText = "Price can't more than 10% last price";
        e.isValid = false;
      }

    }
  }
  onCellPrepared(e) {

    if (e.rowType === "data" && e.column.dataField === "price") {
      // debugger;
      let amountX = e.data.lastPrice * 10 / 100;
      let fromAmt = e.data.lastPrice - amountX;
      let toAmt = amountX + e.data.lastPrice;
      e.cellElement.style.color = e.data.price >= fromAmt && e.data.price <= toAmt ? "green" : "red";
      // Tracks the `Amount` data field
      e.watch(function () {
        return e.data.price;
      }, function () {
        e.cellElement.style.color = e.data.price >= fromAmt && e.data.price <= toAmt ? "green" : "red";
      })
    }
  }
  onRowPrepared(e) {
    if (e !== undefined && e !== null) {
      this.NumOfTurns(e.data, false);
    }

    if (e.data !== null && e.data !== undefined) {

      if (e.data.keyId !== null && e.data.keyId !== undefined && e.data.lineId !== null && e.data.lineId !== undefined) {
        if (e.rowType == "data" && (e.data.lines === null || e.data.lines === undefined || e.data.lines.length === 0 || e.data.lines === 'undefined')) {

          e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");
          e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");

        }
      }

    }
  }
  lineTotalCellValue(rowData) {

    if (rowData.quantity !== null && rowData.price !== null) {
      return rowData.quantity * rowData.price;
    }
    return 0;
  }
  getFilteredUom(options): any {
    // debugger;

    // console.log('options: ' + options);
    if (options !== null && options !== undefined) {
      if (options.data !== undefined && options.data !== null) {
        this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, options.data.itemCode).subscribe((response: any) => {
          // debugger; 
          // this.itemUom = response;
          if (response.success) {
            // debugger;
            this.itemUom = response.data;
          }
          else {
            this.alertifyService.error(response.message);
          }
        });
      }

    }
    this.uomService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      // debugger;
      // return response;
      if (response.success) {
        this.itemUom = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }
      // this.itemUom = response;
    });
    // this.uomService.getAll().subscribe((response: any)=>{
    //   debugger;
    //   // return response;
    //   this.itemUom = response;
    // });

  }
  onUoMSelectionChanged(e: any, data: any) {
    console.log(e);
    // debugger;
    if (e.selectedRowsData[0] !== null && e.selectedRowsData[0] !== undefined) {
      let itemCode = data.data.itemCode;
      let uomCode = e.selectedRowsData[0].uomCode;

      this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any) => {
        if (response.success) {
          // debugger;
          this.itemUom = response.data;
          // this.itemUom = response; 
          // debugger;
          //
          if (this.itemUom === null || this.itemUom === undefined) {
            this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', '');
          }
          else {
            let itemuom = this.itemUom.find(x => x.uomCode === uomCode);
            // debugger;
            if (itemuom !== null && itemuom !== undefined) {
              this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', itemuom.barCode);

            }
            else {
              this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', '');
            }
          }
        }
        else {
          this.alertifyService.error(response.message);
        }



      })

    }

  }
  isDropDownBoxOpened(e, data) {
    // debugger;
    // console.log(data.itemCode);
    setTimeout(() => {
      this.loadUomNew(data.itemCode)
    }, 2);
    return true;
  }
  loadUomNew(itemCode) {
    this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any) => {
      // this.itemUom = response; 
      if (response.success) {
        // debugger;
        this.itemUom = response.data;
      }
      else {
        this.alertifyService.error(response.message);
      }
    })
  }
  onSelectionChanged(e: any, data: any): void {
    // debugger; console.log(e);
    console.log(e.selectedRowsData);
    let itemCode = e.selectedRowsData[0].itemCode;
    // this.dataGrid.instance.cellValue(data.rowIndex, 'itemCode', itemCode);  
    this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any) => {
      // debugger;
      if (response.success) {
        // debugger;
        this.itemUom = response.data;
        // this.itemUom = response;

        // console.log(this.itemList); 
        // console.log(this.itemUom);
        let description = e.selectedRowsData[0].description;
        this.dataGrid.instance.cellValue(data.rowIndex, 'description', description);
        let price = e.selectedRowsData[0].defaultPrice;
        this.dataGrid.instance.cellValue(data.rowIndex, 'price', price);
        let uom = e.selectedRowsData[0].inventoryUom;
        this.dataGrid.instance.cellValue(data.rowIndex, 'uomCode', uom);
        let itemuom = this.itemUom.find(x => x.itemCode === itemCode && x.uomcode === uom);

        if (itemuom !== null && itemuom !== undefined) {
          this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', itemuom.barCode);
        }
        let tax = e.selectedRowsData[0].purchaseTaxCode;
        this.dataGrid.instance.cellValue(data.rowIndex, 'quantity', 1);
        let taxamt = 0;
        if (tax !== '' && tax !== undefined && tax !== null) {
          this.dataGrid.instance.cellValue(data.rowIndex, 'taxCode', tax);
          let taxvalue = this.taxList.find(x => x.taxCode === tax);
          if (taxvalue !== null && taxvalue !== undefined) {
            this.dataGrid.instance.cellValue(data.rowIndex, 'taxRate', taxvalue.taxPercent);
          }
          let taxSelected = this.taxList.filter(x => x.taxCode === tax)[0];
          let percent = taxSelected.taxPercent;
          taxamt = price * percent / 100;
          this.dataGrid.instance.cellValue(data.rowIndex, 'taxAmt', taxamt);
        }
        // let uom = e.selectedRowsData[0].inventoryUom;
        this.dataGrid.instance.cellValue(data.rowIndex, 'currencyCode', this.storeSelected.currencyCode);

        let linetotal = price + taxamt;
        this.dataGrid.instance.cellValue(data.rowIndex, 'lineTotal', linetotal);
        // setTimeout(() => {  
        //   this.dataGrid.instance.repaintRows([data.rowIndex]);  
        // }, 200);  
        this.gridBox.instance.close();
      }
      else {
        this.alertifyService.error(response.message);
      }

    });


  }

  priceColumn_customizeText(cellInfo) {
    // debugger;
    return cellInfo.value + "$";
  }


  loadItemList(itemCode, uomcode, barcode, keyword) {
    this.itemService.GetItemInforList(this.storeSelected.companyCode, this.storeSelected.storeId, itemCode, uomcode, barcode, keyword, '').subscribe((response: any) => {
      this.itemList = response.data;
      // debugger;
    });


  }
  itemUom: any;
  loadItemUom(itemCode) {
    this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any) => {

      if (response.success) {
        // debugger;
        this.itemUom = response.data;
      }
      else {
        this.alertifyService.error(response.message);
      }
    });
  }
  loadUom() {
    this.uomService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      // debugger;
      if (response.success) {
        this.uomList = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }
    });
  }

  loadTaxList() {

    this.taxService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      // debugger;
      if (response.success) {
        this.taxList = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }
    });
  }
  loadStorageList(store = null) {
    if (store === null || store === undefined)
      store.storeId = this.storeSelected.storeId
    this.storewarehouseService.getByWhsStore(this.storeSelected.companyCode, store.storeId).subscribe((response: any) => {
      // debugger;
      if (response.success) {
        this.storageList = response.data.filter(x => x.whsType !== 'T');
        this.slocFromDefault = this.storageList[0].whsCode;
        console.log("this.storageList", this.storageList);
        console.log("this.countRow", this.countRow);
        if (this.countRow > 0) {
          // add
          for (var i = 0; i < this.countRow; i++) {
            this.dataGrid.instance.cellValue(i, 'Sloc ID', this.storageList[0].whsCode);
          }
        } else {
          // edit
          console.log("this.lines", this.lines);
          for (var j = 0; j < this.lines.length; j++) {
            this.dataGrid.instance.cellValue(j, 'Sloc ID', this.storageList[0].whsCode);
          }
        }
      }
      else {
        this.alertifyService.warning(response.message);
      }
      // this.storageList = response;
      console.log(this.storageList);
    });
  }

  PrintDetail(data) {
    console.log("data", data);
    this.router.navigate(["admin/purchaserequest/print", data.purchaseId]).then(() => {
      // window.location.reload();
    });
  }

  onFileChange(evt: any, template) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const dataHeader = <any[]>this.excelSrv.importFromFile(bstr, 0);

      const header: string[] = Object.getOwnPropertyNames(new TPurchaseRequestLineTemplate());
      const excelHeader = dataHeader[0];
      const importedDataHeader = dataHeader.slice(1);//.slice(1, -2); 
      var stt = 0;
      this.importContent = importedDataHeader.map(arr => {
        const obj = {};
        stt++;
        for (let i = 0; i < excelHeader.length; i++) {
          for (let j = 0; j < header.length; j++) {
            const ki = this.capitalizeFirstLetter(excelHeader[i]);
            const kj = this.capitalizeFirstLetter(header[j]);
            //  debugger;
            if (kj.toLowerCase() === 'stt') {
              obj[header[j]] = stt;
            }
            if (ki.toLowerCase() === kj.toLowerCase()) {
              if (header[j].toLowerCase() === 'barcode' || header[j].toLowerCase() === 'itemcode' || header[j].toLowerCase() === 'uomcode' ||
                header[j].toLowerCase() === 'slocid') {
                obj[header[j]] = arr[i] == undefined ? '' : arr[i].toString();
              }
              else {
                obj[header[j]] = arr[i];
              }
            }
          }
        }


        return <TPurchaseRequestLineTemplate>obj;
      })
      //Check Error:
      this.ErrorRepair = [];
      this.Erroreexcel = [];
      this.ListNotExitItem = [];
      this.ListNullItem = [];
      this.ListNullBarcode = [];
      this.ListNullUom = [];
      this.ListNullSlocid = [];
      this.ListNullQuantity = [];
      // this.ListNullTax = [];
      this.importContent.forEach(item => {
        item.storeId = this.authService.storeSelected().storeId;
        item.companyCode = this.authService.storeSelected().companyCode;
        item.keyId = item.itemCode + item.uomCode + item.barCode;
        item.lineId = (this.lines.length + item.stt).toString();
        if (this.lines.filter(x => x.itemCode === item.itemCode).length > 0) {
          let index = new ErrorList();
          index.itemCode = item.itemCode;
          index.stt = item.stt;
          this.ErrorRepair.push(index);
        }
        let listStt = this.importContent.filter(x => x.itemCode === item.itemCode && x.itemCode != '' && x.stt !== item.stt);
        if (listStt.length > 0 && this.Erroreexcel.filter(x => x.itemCode === item.itemCode).length == 0) {
          let index = new ErrorList();
          index.itemCode = item.itemCode;
          index.stt = item.stt;
          index.listStt.push(item.stt);
          listStt.forEach(e => {
            index.listStt.push(e.stt);
          });
          this.Erroreexcel.push(index);
        }

        if (item.itemCode == '' || item.itemCode == null) {
          this.ListNullItem.push(item.stt);
        }
        if (item.barCode == '' || item.barCode == null) {
          this.ListNullBarcode.push(item.stt);
        }
        if (item.uomCode == '' || item.uomCode == null) {
          this.ListNullUom.push(item.stt);;
        }
        if (item.slocId == '' || item.slocId == null) {
          this.ListNullSlocid.push(item.stt);
        }
        if (item.quantity == undefined || item.quantity == null) {
          this.ListNullQuantity.push(item.stt);
        }
      });
      console.log(this.importContent);
      this.checkitemimport(this.importContent, template);
      this.clearFileInput();
    };
  }
  downloadTemplate() {
    setTimeout(() => {
      this.commonService.download('PurchaseRequest.xlsx');
    }, 2);

    // this.dowloadLine();

  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  modalRef: BsModalRef;
  clearFileInput() {
    this.myInputVariable.nativeElement.value = "";
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: 'static',
    });
  }
  exportExcel() {
    this.importContent.forEach(item => {
      item.listError = "";
      if (this.ErrorRepair.filter(x => x.stt == item.stt).length > 0) {
        item.listError = item.listError + "Item already exists; "
      }
      let excelDulicate = this.Erroreexcel.filter(x => x.stt == item.stt)
      if (excelDulicate.length > 0) {
        item.listError = item.listError + "Item duplicate with row: " + excelDulicate[0].listStt.toString() + "; ";
      }
      let notExit = this.ListNotExitItem.filter(x => x.stt == item.stt)
      if (notExit.length > 0) {
        item.listError = item.listError + notExit[0].itemCode + " Not Found; "
      }
      // let taxCode = this.ListNullTax.filter(x=>x.stt == item.stt)
      // if(taxCode.length >0)
      // {
      //   item.listError =item.listError + "taxCode Not Found; "
      // }
      if (this.ListNullItem.filter(x => x === item.stt).length > 0) {
        item.listError = item.listError + "ItemCode is Null; "
      }
      if (this.ListNullBarcode.filter(x => x === item.stt).length > 0) {
        item.listError = item.listError + "BarCode is Null; "
      }
      if (this.ListNullUom.filter(x => x === item.stt).length > 0) {
        item.listError = item.listError + "UomCode is Null; "
      }
      if (this.ListNullSlocid.filter(x => x === item.stt).length > 0) {
        item.listError = item.listError + "SlocId is Null; "
      }
      if (this.ListNullQuantity.filter(x => x === item.stt).length > 0) {
        item.listError = item.listError + "Quantity is Not Correct; "
      }
      delete item.description;
      delete item.stt;
      delete item.lineId;
      delete item.price;
      delete item.lineTotal;
      delete item.keyId;
    });
    let day = new Date()
    let fileName = "PurchaseRequest" + day.toLocaleString();
    let fileWidth: any = [{ width: 15 }, { width: 10 }, { width: 20 }, { width: 15 }, { width: 15 }, { width: 40 }, { width: 200 }];
    this.excelSrv.exportExcel(this.importContent, fileName, fileWidth);
  }
  checkitemimport(model: TPurchaseRequestLineTemplate[], template) {
    this.inventoryService.checkImport(model).subscribe((respone: any) => {
      if (respone.success === true) {
        // debugger;
        respone.data.forEach(x => {
          // debugger;
          if (x.isNotfound) {
            let stt = this.importContent.filter(y => x.itemCode == y.itemCode && x.barCode == y.barCode &&
              x.uomCode == y.uomCode)[0].stt;
            let index = new ErrorList();
            index.type = 'I';
            index.stt = stt;
            index.itemCode = "ItemCode: " + x.itemCode + " Barcode: " + x.barCode + " UomCode: " + x.uomCode;
            this.ListNotExitItem.push(index);
          }
          else {
            this.importContent.forEach(y => {
              // debugger;
              if (x.itemCode == y.itemCode && x.barCode == y.barCode && x.uomCode == y.uomCode) {
                y.description = x.itemName;
                y.price = x.defaultPrice;
                y.lineTotal = x.price * x.quantity;
                y.openQty = x.stock;
              }
            });


          }
        });
        setTimeout(() => {
          if (this.ErrorRepair.length == 0 && this.Erroreexcel.length == 0 && this.ListNullItem.length == 0 &&
            this.ListNullBarcode.length == 0 && this.ListNullUom.length == 0 && this.ListNullSlocid.length == 0 &&
            this.ListNullQuantity.length == 0 && this.ListNotExitItem.length == 0 && this.ListNullTax.length == 0)
            this.lines = this.lines.concat(this.importContent);
          else {
            this.openModal(template);
          }
        }, 100);
      }
      else {
        this.alertifyService.error(respone.message);
      }
    }, error => {
      this.alertifyService.error(error);
    });

  }


  // Số lượng bán trung bình ngày
  SetNumOfDay(rowData, clNumDay): Observable<any> {
    let qtyTotal = 0;
    // let subject = new Subject();
    if (rowData.itemCode != null && rowData.slocId != null && rowData.uomCode != null && rowData.fromDate != null && rowData.toDate != null) {
      rowData.fromDate = new Date(rowData.fromDate).toLocaleDateString('en-US');
      rowData.toDate = new Date(rowData.toDate).toLocaleDateString('en-US');
      return this.purchaseService.GetSalesPeriod(rowData);
    }
  }

  // Số lượng bán trung bình tuần
  SetNumOfWeek(rowData) {
    console.log("rowData", rowData)
    const numOfWeek = Number((Number(rowData.salesDay) * 7)).toFixed(this.loadformat);
    console.log("data 1", numOfWeek);
    return numOfWeek;
  }

  // Số lượng bán trung bình tháng
  SetNumOfMonth(rowData) {
    const numOfMonth = Number((Number(rowData.salesDay) * 30)).toFixed(this.loadformat);
    return numOfMonth;
  }

  CalculateNumOfDay(rowData) {
    let clNumDay = 0;
    let cvfromDate = new Date(rowData.fromDate).toLocaleDateString('en-US');
    let cvtoDate = new Date(rowData.toDate).toLocaleDateString('en-US');
    let date1 = new Date(cvfromDate);
    let date2 = new Date(cvtoDate);

    if (rowData.itemCode != null && rowData.slocId != null && rowData.uomCode != null && rowData.fromDate != null && rowData.toDate != null) {
      const _MS_PER_DAY = 1000 * 60 * 60 * 24;
      const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
      const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
      clNumDay = Math.floor((utc2 - utc1) / _MS_PER_DAY) + 1;

    }
    return clNumDay;
  }

  NumOfTurns(rowData, type) {
    if (type == true) {
      if (rowData.itemCode != null && rowData.slocId != null && rowData.uomCode != null && rowData.fromDate != null && rowData.toDate != null) {
        const clNumDay = rowData.salesDay;//  this.CalculateNumOfDay(rowData);
        if (clNumDay > 0) {
          const numTurn = (Number(Number(rowData.quantity) + Number(rowData.openQty)) / clNumDay);
          return numTurn.toFixed(this.loadformat);
        } else {
          return 0;
        }
      }
    } else {
      if (rowData != undefined) {
        const clNumDay = rowData.salesDay;//  this.CalculateNumOfDay(rowData);
        if (clNumDay > 0) {
          const numTurn = (Number(Number(rowData.quantity) + Number(rowData.openQty)) / clNumDay);
          rowData.turns = numTurn.toFixed(this.loadformat);
        } else {
          rowData.turns = 0;
        }
      }
    }


  }

  // số lượng đặt hàng gần nhất
  lastQtyOrder: number = 0;
  LastQtyOrder(rowData) {
    if (rowData.itemCode != null && rowData.slocId != null && rowData.uomCode != null) {
      rowData.fromDate = new Date(rowData.fromDate).toLocaleDateString();
      rowData.toDate = new Date(rowData.toDate).toLocaleDateString();
      return this.purchaseService.GetSalesPeriod(rowData);
    }
  }
  validateNumber(e) {
    // debugger;
    if (e.data.quantity != undefined) {
      if (e.data.allowDecimal)
        return true;
      var str = e.value.toString();
      var decimalOnly = 0;

      if (str.indexOf('.') != -1) { //check if has decimal
        let decimalOnly: string = parseFloat(Math.abs(e.value).toString()).toString().split('.')[1];
        if (decimalOnly !== null && decimalOnly !== undefined) {
          let length = decimalOnly.toString()?.length;
          if (length > parseInt('0')) {
            return false;
          }
        }
        return true
      }
      return true;
    }

    return true;
  }
}
