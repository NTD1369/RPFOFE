import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import { TGoodsReceiptHeader, TGoodsReceiptLine, TGoodsReceiptLineSerial, TGoodsReceiptLineTemplate } from 'src/app/_models/goodreceipt';
import { Item } from 'src/app/_models/item';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { ItemService } from 'src/app/_services/data/item.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import { DxDataGridComponent } from 'devextreme-angular';
import { StorageService } from 'src/app/_services/data/storage.service';
import { TaxService } from 'src/app/_services/data/tax.service';
import { MTax } from 'src/app/_models/tax';
import { MStorage } from 'src/app/_models/storage';
import { ItemuomService } from 'src/app/_services/data/itemuom.service';
import { MItemUom } from 'src/app/_models/mitemuom';
import { UomService } from 'src/app/_services/data/uom.service';
import { MUom } from 'src/app/_models/muom';
import { GoodreceiptService } from 'src/app/_services/transaction/goodreceipt.service';
import { AuthService } from 'src/app/_services/auth.service';
import { MStore } from 'src/app/_models/store';
import Swal from 'sweetalert2';
import { status } from 'src/environments/environment';
import { MovementtypeService } from 'src/app/_services/data/movementtype.service';
import { MWarehouse } from 'src/app/_models/warehouse';
import { WarehouseService } from 'src/app/_services/data/warehouse.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { ManagementItemSerialComponent } from 'src/app/management/shared/management-item-serial/management-item-serial.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ErrorList } from 'src/app/_models/inventorycounting';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';
import { ItemSearch } from 'src/app/shop/components/shop-search-item/shop-search-item.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ControlService } from 'src/app/_services/data/control.service';
@Component({
  selector: 'app-management-transaction-goodreceipt-edit',
  templateUrl: './management-transaction-goodreceipt-edit.component.html',
  styleUrls: ['./management-transaction-goodreceipt-edit.component.scss']
})
export class ManagementTransactionGoodreceiptEditComponent implements OnInit {
  currentValue: Date = new Date();
  goodreceipt: TGoodsReceiptHeader;
  lines: TGoodsReceiptLine[] = [];
  itemList: any;
  taxList: MTax[];
  storageList: MStorage[];
  serialList: MItemSerial[];
  uomList: MUom[];
  mode: string;
  receiptId: string;
  isNew = false;
  gridBoxValue: string[] = [];
  docStatus: any[] = status.InventoryDocument;
  movementTypes = [];
  importContent: TGoodsReceiptLineTemplate[] = [];
  ErrorRepair: ErrorList[] = [];
  Erroreexcel: ErrorList[] = [];
  ListNotExitItem: ErrorList[] = [];
  ListNullItem = [];
  ListNullBarcode = [];
  ListNullUom = [];
  ListNullSlocid = [];
  ListNullQuantity = [];
  ListNullTax: ErrorList[] = [];
  arrWhsFrm = [];
  configStorage: boolean = true;
  loadItem: boolean = false;
  minnumber: number = 1;
  minnumberPrice: number = 0;
  qtyPattern: any = '';
  inputWithoutConfig = "true";
  lguAdd: string = "Add";
  isSave = true;
  onToolbarPreparing(e) {
    if(this.mode!=='e')
    {
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
  addNewLine()
  {
    setTimeout(x=> { 
      this.dataGrid.instance.addRow();
    },100 ); 
  }
  loadMovementType() {
    this.movementService.getAll().subscribe((response: any) => {
      if (response.success) {
        this.movementTypes = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }
      // this.movementTypes = response;
    })
  }
  whs: MWarehouse;
  loadDefaultWhs(whs) {
    this.whsService.getItem(this.authService.getCurrentInfor().companyCode, whs).subscribe((response: any) => {
      if (response.success) {
        this.whs = response.data;
        console.log("this.whs load", this.whs);
      }
      else {
        this.alertifyService.error(response.message);
      }
    });
  }
  storeSelected: MStore;
  constructor(private excelSrv: ExcelService, public commonService: CommonService, private modalService: BsModalService, private goodreceiptService: GoodreceiptService, private alertifyService: AlertifyService, private whsService: WarehouseService, private uomService: UomService, private movementService: MovementtypeService,
    private taxService: TaxService, private storageService: StorageService, public itemUomService: ItemuomService, private formBuilder: FormBuilder,
    public authService: AuthService, private shiftService: ShiftService, private controlService: ControlService,
    private itemService: ItemService, private route: ActivatedRoute, private router: Router, private printService: PrintService,private inventoryService: InventoryService) {
    this.storeSelected = this.authService.storeSelected();
    // this.loadItemList();
    this.loadTaxList();
    this.loadStorageList();
    this.loadUom();
    this.getItemFilterControlList();
    this.customizeText = this.customizeText.bind(this);
    this.goodreceipt = new TGoodsReceiptHeader();
    // this.getFilteredUom = this.getFilteredUom.bind(this);
  }
  itemSearchForm: FormGroup;
  functionIdFilter = "Cpn_ItemFilter";
  controlList: any[];
  groupControlList = {};
  searchModel: ItemSearch;
  searchItem()
  {
  
    let filter = this.searchModel;
    let itemCode =  (filter.itemCode === null || filter.itemCode === undefined) ? '' : filter.itemCode;
    let uomcode =  (filter.uomcode === null || filter.uomcode === undefined) ? '' : filter.uomcode;
    let barcode =  (filter.barcode === null || filter.barcode === undefined) ? '' : filter.barcode;
    let keyword =   (filter.keyword === null || filter.keyword === undefined ) ? '' : filter.keyword;
    // debugger;
    this.loadItemList(itemCode,  uomcode,  barcode,  keyword);
  }
  ngAfterViewInit() {
    console.log("afterinit");

  }
  customizeText(e) {
    // debugger;
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
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
      let linetotal = price;// + taxamt;
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxAmt', taxamt);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxRate', percent);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxCode', selectedRowKeys[0]);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lineTotal', linetotal);
      // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 

    }
  }
  onItemSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
    // debugger;
    console.log(cellInfo);
    cellInfo.setValue(selectedRowKeys[0]);
    if (selectedRowKeys.length > 0) {
      dropDownBoxComponent.close();
      let code = event.selectedRowsData[0].itemCode;
      let name = event.selectedRowsData[0].itemName;
      let uom = event.selectedRowsData[0].uomCode;
      let barcode = event.selectedRowsData[0].barCode;
      let price = event.selectedRowsData[0].defaultPrice;
      let isSerial = event.selectedRowsData[0].isSerial;
      let isVoucher = event.selectedRowsData[0].isVoucher;
      let allowDecimal = false;
      if(this.authService.checkFormatNumber(1.5,"quantity",uom) )
      {
        allowDecimal = true;
      }

      let percent = 0;
      let taxamt = price * percent / 100;
      let linetotal = price + taxamt;
      let checkItemInList = this.lines.filter(x => x.itemCode === code && x.uomCode === uom
        && x.barCode === barcode && x.slocId === this.storeSelected.whsCode);
      if (checkItemInList !== null && checkItemInList !== undefined && checkItemInList?.length > 0) {
        this.alertifyService.warning("item already exists in the list");
        this.dataGrid.instance.deleteRow(cellInfo.rowIndex);
      }
      else {
        if (isSerial === true || isVoucher === true) {

          if(this.checkInventorySerial === "true")
          {
            let line = new TGoodsReceiptLine();

            line.lineId = (this.lines.length + 1).toString();
            line.keyId = selectedRowKeys[0];
            line.itemCode = code;
            line.description = name;
            line.currencyCode = this.storeSelected.currencyCode;
            line.uomCode = uom;
            line.barCode = barcode;
            line.price = price;
            line.quantity = 1;
            line.taxCode = 'S0';
            line.slocId = this.storeSelected.whsCode;
            line.taxAmt = taxamt;
            line.taxRate = percent;
            line.lineTotal = linetotal;

            // this.dataGrid.instance.refresh();

            // let xxx =false;
            let Itemcheck = event.selectedRowsData[0];
            Itemcheck.slocId = line.slocId;
            const initialState = {
              item: Itemcheck
            };

            let modalRefX = this.modalService.show(ManagementItemSerialComponent, {
              initialState, animated: true,
              keyboard: true,
              backdrop: true,
              ignoreBackdropClick: false,
              ariaDescribedby: 'my-modal-description',
              ariaLabelledBy: 'my-modal-title',
              class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
            });

            modalRefX.content.outEvent.subscribe((response: MItemSerial[]) => {
              debugger;
              console.log('itemSerial', response) // here you will get the value
              // let rounded = Math.round(payment.value * 100.0 / 5.0) * 5.0 / 100.0;  
              // payment.afterExchange = rounded * payment.rate;
              if (response !== null && response !== undefined && response.length > 0) {
                line.lines = [];
                response.forEach(serial => {
                  let serialLine = new TGoodsReceiptLineSerial();
                  serialLine.serialNum = serial.serialNum;
                  serialLine.itemCode = line.itemCode;
                  serialLine.uomCode = line.uomCode;
                  serialLine.description = line.description;
                  serialLine.slocId = line.slocId;
                  serialLine.quantity = 1;
                  line.lines.push(serialLine);

                });
                line.quantity = response.length;
                this.lines.push(line);
                modalRefX.hide();
              }
              else {
                this.alertifyService.warning('Serial line isnull');

              }
            });
            this.dataGrid.instance.deleteRow(cellInfo.rowIndex);

          }
          else
          {
             // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'itemCode', code);
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'description', name);
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'currencyCode', this.storeSelected.currencyCode);
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'uomCode', uom);
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'barCode', barcode);
            // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price', price);   
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'quantity', '1');
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxCode', 'S0');

            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxAmt', taxamt);
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxRate', percent);
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lineTotal', linetotal);
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'allowDecimal', allowDecimal);
          }

          

        }
        else {
          // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'itemCode', code);
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'description', name);
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'currencyCode', this.storeSelected.currencyCode);
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'uomCode', uom);
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'barCode', barcode);
          // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price', price);   
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'quantity', '1');
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxCode', 'S0');

          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxAmt', taxamt);
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxRate', percent);
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lineTotal', linetotal);
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'allowDecimal', allowDecimal);
        }
      }
      setTimeout(() => {
        this.dataGrid.instance.saveEditData();
      }, 100);
     
    }

  }

  onInitNewRow(e) {
    e.data.taxCode = 'S0';
    e.data.price = 0;
    e.data.slocId = this.whs.defaultSlocId != null ? this.whs.defaultSlocId : this.authService.storeSelected().whsCode;
  }
  onEditorPreparing(e) {
    // debugger;
    if (e.parentType === "dataRow" && e.dataField === "uomCode") {

      // e.editorOptions.disabled = (typeof e.row.data.itemCode !== "number");
      this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, e.row.data.itemCode).subscribe((response: any) => {
        if (response.success) {
          debugger;
          this.uomList = response.data;
        }
        else {
          this.alertifyService.error(response.message);
        }
        // this.uomList = response;   
      })
    }
  }
  updateProductName(eventData, cellInfo: any) {

    if (cellInfo.setValue) {
      cellInfo.setValue(eventData.value);
    }
  }
  @ViewChild('dataGrid', { static: false }) dataGrid;
  @ViewChild('ddlStatus', { static: false }) ddlStatus;
  checkInventoryInShift = "false";
  saveModel() {
    let shift = this.shiftService.getCurrentShip();
    let canAdd = true;

    if(this.checkInventoryInShift ==="true" )
    {
      if (shift !== null && shift !== undefined) {
        canAdd = true;
      }
      else
      {
        canAdd = false;
        Swal.fire({
          icon: 'warning',
          title: 'Shift',
          text: "Not in shift. Please create / load your shift. "
        });
      }
    }
    if(canAdd)
    {
      let gridInstance = this.dataGrid.instance as any;  
      let check = true;
      gridInstance.getController('validating').validate(true).done(function(result) {
        //check result. It should be true or false.
      //  console.log(result);
      // console.log(result);
      check = result;
      });
       if(check)
       {
      if (this.goodreceipt.movementType !== null && this.goodreceipt.movementType !== undefined) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to save!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            let TotalPayable: number = 0;
            let TotalDiscountAmt: number = 0;
            let TotalReceipt: number = 0;
            let TotalTax: number = 0;
            let storeClient = this.authService.getStoreClient();
            if(storeClient!==null && storeClient!==undefined)
            {
              this.goodreceipt.terminalId = this.authService.getStoreClient().publicIP;
            }
            else
            {
              this.goodreceipt.terminalId = this.authService.getLocalIP();
            }
            this.isSave = false;
            this.lines.forEach((item) => {
              item.lineTotal = item.quantity * item.price;// + item.taxAmt;
              if (item.taxAmt !== null && item.taxAmt !== undefined) TotalTax += parseFloat(item.taxAmt.toString());
              if (item.lineTotal !== null && item.lineTotal !== undefined) TotalPayable += parseFloat(item.lineTotal.toString());
              if (item.quantity !== null && item.quantity !== undefined) TotalReceipt += parseFloat(item.quantity.toString());
  
            })
  
            // let shift = this.shiftService.getCurrentShip();
            if (shift !== null && shift !== undefined) {
              this.goodreceipt.shiftId = this.shiftService.getCurrentShip().shiftId;
            }
            debugger;
            this.goodreceipt.totalReceipt = TotalReceipt;
            this.goodreceipt.totalTax = TotalTax;
            this.goodreceipt.totalPayable = TotalPayable;
            this.goodreceipt.lines = this.lines;
  
            this.goodreceipt.isCanceled = 'N';
            this.goodreceipt.storeId = this.storeSelected.storeId;
            this.goodreceipt.storeName = this.storeSelected.storeName;
            this.goodreceipt.companyCode = this.storeSelected.companyCode;
            if (this.isNew === true) {
              this.goodreceipt.createdBy = this.authService.getCurrentInfor().username;
              this.goodreceipt.status = 'C';
              this.goodreceiptService.create(this.goodreceipt).subscribe((response: any) => {
                this.isSave = true;
                if (response.success === true) {
                  // this.isSave = true;
                  this.alertifyService.success("Create successfully completed. Trans Id: " + response.message);
                  // this.router.navigate['goodreceipt'];
                  this.router.navigate(["admin/goodreceipt", 'e', response.message]);
                }
                else {
                  // this.isSave = true;
                  this.alertifyService.error(response.message);
                }
              });
            }
            else {
              if (this.ddlStatus.value === "N") {
                this.goodreceipt.refId = this.goodreceipt.invtid;
                this.goodreceipt.invtid = "";
                this.goodreceipt.isCanceled = 'Y';
                this.goodreceipt.status = "C";
  
                this.goodreceipt.createdBy = this.authService.getCurrentInfor().username;
                this.goodreceiptService.create(this.goodreceipt).subscribe((response: any) => {
                  if (response.success === true) {
                    // this.isSave = true;
                    this.alertifyService.success("Create successfully completed. Trans Id: " + response.message);
                    // this.router.navigate['goodissue'];
                    this.router.navigate(["admin/goodreceipt", 'e', response.message]);
                  }
                  else {
                    // this.isSave = true;
                    this.alertifyService.error(response.message);
                  }
                });
              }
              else {
                this.goodreceipt.status = this.ddlStatus.value;
                this.goodreceipt.modifiedBy = this.authService.getCurrentInfor().username;
                this.goodreceiptService.update(this.goodreceipt).subscribe((response: any) => {
                  this.isSave = true;
                  if (response.success === true) {
                    // this.isSave = true;
                    this.alertifyService.success("Update successfully completed. Trans Id: " + response.message);
                  }
                  else {
                    // this.isSave = true;
                    this.alertifyService.error(response.message);
                  }
                });
              }
  
            }
          }
        });
      }
      else {
        this.alertifyService.error("Please input Movement Type");
      }
    }
    }
   

  }
  dataSourceItem: any;
  dateFormat = "";
  canEdit = false;
  canAdd = false;
  functionId = "Adm_GoodReceipt";

  // downloadTemplate() {
  //   this.commonService.download('T_GoodsReceiptLines.xlsx');
  // }


  // onFileChange(evt: any) {
  //   // debugger;
  //   const target: DataTransfer = <DataTransfer>(evt.target);
  //   if (target.files.length !== 1) throw new Error('Cannot use multiple files');

  //   const reader: FileReader = new FileReader();
  //   reader.readAsBinaryString(target.files[0]);
  //   reader.onload = (e: any) => {
  //     // debugger;
  //     const bstr: string = e.target.result;
  //     const dataLine = <any[]>this.excelSrv.importFromFile(bstr, 0);
  //     // const dataBuy = <any[]>this.excelSrv.importFromFile(bstr, 1);
  //     // const dataGet = <any[]>this.excelSrv.importFromFile(bstr, 2);
  //     // const dataCustomer = <any[]>this.excelSrv.importFromFile(bstr, 3);
  //     // const dataStore = <any[]>this.excelSrv.importFromFile(bstr, 4);


  //     const lines: string[] = Object.getOwnPropertyNames(new TGoodsReceiptLine());

  //     // debugger;
  //     // console.log(data);
  //     const excelHeader = dataLine[0];
  //     const importedDataHeader = lines.slice(1);//.slice(1, -2); 

  //     let importContent = importedDataHeader.map(arr => {
  //       // debugger;
  //       const obj = {};
  //       for (let i = 0; i < excelHeader.length; i++) {
  //         for (let j = 0; j < dataLine.length; j++) {
  //           const ki = this.capitalizeFirstLetter(excelHeader[i]);
  //           const kj = this.capitalizeFirstLetter(dataLine[j]);

  //           if (ki.toLowerCase() === kj.toLowerCase()) {

  //             if(ki.toLowerCase() === 'validdatefrom' || ki.toLowerCase() === 'validdateto')
  //             {
  //               // debugger;
  //               if(arr[i]!==undefined && arr[i]!==null && arr[i]!=='')
  //               {
  //                 let date = this.excelSrv.excelDateToJSDate(arr[i]);
  //                 obj[dataLine[j]] = date;// new Date(arr[i] * 1000);;
  //               }

  //             }
  //             else
  //             {
  //               obj[dataLine[j]] = arr[i];
  //             }


  //           }
  //         }
  //       }

  //       return <TGoodsReceiptLine>obj;
  //     });
  //     this.lines = importContent;
  //     // debugger
  //     // let promo = <PromotionViewModel>this.importContent[0];
  //     // promo.promoId = "ABC";

  //     // promo.promoBuys = buyX;
  //     // let NumX = 1;
  //     // promo.promoBuys.forEach(item => {
  //     //   if (item.lineType === 'ItemCode') {

  //     //     item.keyId = item.lineCode + item.lineUom;
  //     //   }
  //     //   if (item.lineNum === null || item.lineNum === undefined) {
  //     //     item.lineNum = NumX;
  //     //     NumX++;
  //     //   }
  //     // });
  //     // promo.promoGets = getX;
  //     // let NumX1 = 1;
  //     // promo.promoGets.forEach(item => {
  //     //   if (item.lineType === 'ItemCode') {
  //     //     item.keyId = item.lineCode + item.lineUom;
  //     //   }
  //     //   if (item.lineNum === null || item.lineNum === undefined) {
  //     //     item.lineNum = NumX1;
  //     //     NumX1++;
  //     //   }
  //     // });
  //     // // debugger;
  //     // promo.promoStores = storeX;
  //     // promo.promoCustomers = customerX;

  //     // this.bindPromotionToGrid(promo);
  //     // console.log(promo);
  //   };


  // }
  checkFormatQty(){
    let format = this.authService.loadFormat();
    if(format !==null || format !==undefined)
    {
      for(let i =0;i<parseInt(format.qtyDecimalPlacesFormat.toString());i++)
      {
        this.minnumber = this.minnumber/10;
      }
      let inputWithoutConfig = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'InputWithoutConfig');
      if (inputWithoutConfig !== null && inputWithoutConfig !== undefined) {
        
        this.inputWithoutConfig = inputWithoutConfig.settingValue;
      }
      if(this.inputWithoutConfig==='false')
      {
        this.qtyPattern = '^-?[0-9]\\d*(\\.\\d{1,'+ format.qtyDecimalPlacesFormat.toString()+'})?$';
      }
    }
  }
  checkInventorySerial = "true";
  loadSetting() {
    
    let checkInventorySerial = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'InventorySerialManage');
    // debugger;
    if (checkInventorySerial !== null && checkInventorySerial !== undefined) {
      this.checkInventorySerial = checkInventorySerial.settingValue;
    }
    let checkInventoryInShift = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'INVInShift');
    // debugger;
    if (checkInventoryInShift !== null && checkInventoryInShift !== undefined) {
      this.checkInventoryInShift = checkInventoryInShift.settingValue;
    }
  }
  ngOnInit() {
    this.checkFormatQty()
    this.loadSetting();
    this.loadMovementType();
    this.loadDefaultWhs(this.authService.storeSelected().whsCode);
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.canAdd = this.authService.checkRole(this.functionId, '', 'I');
    this.canEdit = this.authService.checkRole(this.functionId, '', 'E');
    this.dateFormat = this.authService.loadFormat().dateFormat;
    // debugger;
    this.route.params.subscribe(data => {
      this.mode = data['m'];
      this.receiptId = data['id'];
    })
    if (this.mode === 'e') {
      this.goodreceiptService.getReceipt(this.receiptId, this.storeSelected.storeId, this.storeSelected.companyCode).subscribe((response: any) => {
        this.goodreceipt = response.data;
        if (this.goodreceipt.status === 'C' && this.goodreceipt.isCanceled === 'Y') {
          this.goodreceipt.status = 'N';
        }
        debugger;
        console.log(response.data.lines)
        this.lines = response.data.lines;

        // this.getFilteredUom = this.getFilteredUom.bind(this.lines);
        this.isNew = false;
      });
    }
    else {
      this.goodreceipt = new TGoodsReceiptHeader();
      this.lines = [];
      // console.log(this.goodreceipt);
      this.isNew = true;

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
  lineTotalCellValue(rowData) {
    // debugger;
    if (rowData.quantity !== null && rowData.price !== null) {
      return rowData.quantity * rowData.price;// + rowData.taxAmt; 
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
            debugger;
            this.itemUom = response.data;
          }
          else {
            this.alertifyService.error(response.message);
          }
        });
      }

    }
    // this.uomService.getAll().subscribe((response: any)=>{
    //   // debugger;
    //   // return response;
    //   this.itemUom = response;
    // });
    this.uomService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      // debugger;
      if (response.success) {
        this.itemUom = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }
      // this.uomList = response;
      // console.log(this.uomList);
    });
  }
  onUoMSelectionChanged(e: any, data: any) {
    console.log(e);
    // debugger;
    if (e.selectedRowsData[0] !== null && e.selectedRowsData[0] !== undefined) {
      let itemCode = data.data.itemCode;
      let uomCode = e.selectedRowsData[0].uomCode;

      this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any) => {
        if (response.success) {
          debugger;
          this.itemUom = response.data;
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
        // this.itemUom = response; 
        // debugger;
        //


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
        debugger;
        this.itemUom = response.data;
      }
      else {
        this.alertifyService.error(response.message);
      }
    })
  }
  onRowPrepared(e) {
    if (e.data !== null && e.data !== undefined) {

      if (e.data.keyId !== null && e.data.keyId !== undefined && e.data.lineId !== null && e.data.lineId !== undefined) {
        if (e.rowType === "data" && (e.data.lines === null || e.data.lines === undefined || e.data.lines.length === 0 || e.data.lines === 'undefined')
          && (e.data.serialLines === null || e.data.serialLines === undefined || e.data.serialLines.length === 0 || e.data.serialLines === 'undefined')) {
          // debugger;
          if (e.rowElement.querySelector(".dx-command-expand") !== null && e.rowElement.querySelector(".dx-command-expand") !== undefined) {
            e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");
            e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");
          }


        }
      }

    }

  }
  onSelectionChanged(e: any, data: any): void {
    // debugger;  
    console.log(e);
    console.log(e.selectedRowsData);
    let itemCode = e.selectedRowsData[0].itemCode;
    // this.dataGrid.instance.cellValue(data.rowIndex, 'itemCode', itemCode);  
    this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any) => {
      debugger;
      if (response.success) {
        debugger;
        this.itemUom = response.data;

        let price = e.selectedRowsData[0].defaultPrice;
        // this.dataGrid.instance.cellValue(data.rowIndex, 'price', price);  
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

        let linetotal = price;//+ taxamt;  
        this.dataGrid.instance.cellValue(data.rowIndex, 'lineTotal', linetotal);
        // setTimeout(() => {  
        //   this.dataGrid.instance.repaintRows([data.rowIndex]);  
        // }, 200);  
        this.gridBox.instance.close();
      }
      else {

        this.alertifyService.error(response.message);
      }
      // this.itemUom = response;

      // console.log(this.itemList); 
      // console.log(this.itemUom);

    });


  }

  priceColumn_customizeText(cellInfo) {
    // debugger;
    return cellInfo.value + "$";
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
  
  
  loadItemList(itemCode,  uomcode,  barcode,  keyword) {
    this.itemService.GetItemWithoutPriceList(this.storeSelected.companyCode, this.storeSelected.storeId, itemCode,  uomcode,  barcode,  keyword, '').subscribe((response: any) => {
      debugger;
      if (response.data.length > 0) {
        this.itemList = response.data.filter(x => x.isBom !== true && x.customField4 === 'I');

        this.loadItem = true;
      }
      // 
    });

  }
  itemUom: any;
  loadItemUom(itemCode) {

    this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any) => {
      debugger;
      if (response.success) {
        debugger;
        this.itemUom = response.data;
      }
      else {
        this.alertifyService.error(response.message);
      }
      // this.itemUom = response;
      // console.log(this.itemList);
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
      // this.uomList = response;
      // console.log(this.uomList);
    });
  }

  loadTaxList() {

    this.taxService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      // debugger;
      if (response.success) {
        this.taxList = response.data;
        console.log(this.taxList);
      }
      else {
        this.alertifyService.warning(response.message);
      }
      // this.taxList = response;
      // console.log(this.taxList);
    });
  }
  loadStorageList() {
    if (this.configStorage) {
      this.whsService.GetWarehouseByWhsType(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any) => {
        if (response.success) {
          // S: Main W: Order
          this.arrWhsFrm = [];
          const arrByWhs = response.data.filter(s => (s.whsType === "S" || s.whsType === "W"));
          if (arrByWhs.length > 0) {
            arrByWhs.forEach(item => {
              this.arrWhsFrm.push({
                slocId: item.whsCode
              });
            });
            this.storageList = this.arrWhsFrm;
          }
        }
        else {
          this.alertifyService.warning(response.message);
        }
      })
    } else {
      this.storageService.getByStore(this.storeSelected.storeId, this.storeSelected.companyCode).subscribe((response: any) => {
        // debugger;
        if (response.success) {
          this.storageList = response.data;
        }
        else {
          this.alertifyService.warning(response.message);
        }
        // this.storageList = response;
        console.log(this.storageList);
      });
    }
  }

  // PrintDetail(data: any) {
  //   console.log("data", data);
  //   this.printService.changeParamGoodsReceipt(data);
  // }

  PrintDetail(data) {
    console.log("data", data);
    this.router.navigate(["admin/goodsreceipt/print", data.invtid]).then(() => {
      // window.location.reload();
    });
  }

  onFileChange(evt: any, template) {
    //  debugger;
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      // debugger;
      const bstr: string = e.target.result;
      const dataHeader = <any[]>this.excelSrv.importFromFile(bstr, 0);

      const header: string[] = Object.getOwnPropertyNames(new TGoodsReceiptLineTemplate());
      // console.log(header);
      //  debugger;
      // console.log(data);
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


        return <TGoodsReceiptLineTemplate>obj;
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
        // debugger;
        // let listtax = this.taxList.filter(x => x.taxCode === item.taxCode);
        // if (listtax.length == 0) {
        //   let index = new ErrorList();
        //   index.itemCode = item.itemCode;
        //   index.stt = item.stt;
        //   this.ListNullTax.push(index);
        // }
        // else {
        //   item.taxRate = listtax[0].taxPercent == null ? 0 : listtax[0].taxPercent;
        // }
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
        if (item.quantity == undefined || item.quantity == null || item.quantity <=0 ||(!this.authService.checkFormatNumber(item.quantity, 'quantity', item.uomCode) )) {
          this.ListNullQuantity.push(item.stt);
        }
        // let listItem = this.itemList.filter(x => x.itemCode == item.itemCode && x.barCode == item.barCode &&
        //   x.uomCode == item.uomCode)
        // if (listItem.length == 0) {
        //   if (item.itemCode != '' && item.barCode != '' && item.uomCode != '') {
        //     let index = new ErrorList();
        //     index.type = 'I';
        //     index.stt = item.stt;
        //     index.itemCode = "ItemCode: " + item.itemCode + " Barcode: " + item.barCode + " UomCode: " + item.uomCode;
        //     this.ListNotExitItem.push(index);
        //   }
        // }
        // else {
        //   item.description = listItem[0].itemName;
        //   // item.price = listItem[0].defaultPrice;
        //   item.lineTotal = item.price * item.quantity;
        //   let amount = item.quantity * item.price;
        //   //   if (amount !== null && amount !== undefined &&
        //   //     item.taxRate !== undefined && item.taxRate !== null) {
        //   //     let taxpercent = item.taxRate;

        //   //     item.taxAmt = amount * taxpercent / 100;
        //   //     item.lineTotal = amount + item.taxAmt;
        //   //   }
        // }
      });
      console.log(this.importContent);
      // console.log(this.ErrorRepair);
      // console.log(this.Erroreexcel);
      // console.log(this.ListNullItem);
      // console.log(this.ListNotExitItem);
      // if (this.ErrorRepair.length == 0 && this.Erroreexcel.length == 0 && this.ListNullItem.length == 0 &&
      //   this.ListNullBarcode.length == 0 && this.ListNullUom.length == 0 && this.ListNullSlocid.length == 0 &&
      //   this.ListNullQuantity.length == 0 && this.ListNotExitItem.length == 0)
      //   this.lines = this.lines.concat(this.importContent);
      // else {
      //   this.openModal(template);
      // }

      this.checkitemimport(this.importContent,template);
      this.clearFileInput();
    };
  }
  downloadTemplate() {
    setTimeout(() => {
      this.commonService.download('GoodsReceiptLines.xlsx');
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
      let taxCode = this.ListNullTax.filter(x => x.stt == item.stt)
      if (taxCode.length > 0) {
        item.listError = item.listError + "taxCode Not Found; "
      }
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
        item.listError = item.listError + "Quantity is Not Correct; Quantity  greater than 0"
      }
      delete item.description;
      delete item.stt;
      delete item.lineId;
      delete item.price;
      delete item.lineTotal;
      delete item.keyId;
      delete item.taxAmt;
      delete item.taxRate;
    });
    console.log(this.importContent);
    let day = new Date()
    let fileName = "GoodsReceiptLines" + day.toLocaleString();
    let fileWidth: any = [{ width: 15 }, { width: 10 }, { width: 20 }, { width: 15 }, { width: 15 },
    { width: 15 }, { width: 40 }, { width: 200 }];
    this.excelSrv.exportExcel(this.importContent, fileName, fileWidth);
  }
  checkitemimport(model: TGoodsReceiptLineTemplate[],template){
    this.inventoryService.checkImport(model).subscribe((respone:any) =>{
      if(respone.success === true)
      {
        // debugger;
        respone.data.forEach(x=>{
          // debugger;
          if(x.isNotfound)
          {
          let stt =  this.importContent.filter(y=>x.itemCode == y.itemCode && x.barCode == y.barCode &&
             x.uomCode == y.uomCode)[0].stt;
            let index = new ErrorList();
            index.type = 'I';
            index.stt = stt;
            index.itemCode = "ItemCode: " + x.itemCode + " Barcode: " + x.barCode + " UomCode: " + x.uomCode;
            this.ListNotExitItem.push(index);
          }
          else
          {
            this.importContent.forEach(y=>{
              // debugger;
              if(x.itemCode == y.itemCode && x.barCode == y.barCode && x.uomCode == y.uomCode){
                y.description = x.itemName;
                y.price = x.defaultPrice;
                y.lineTotal = x.price * x.quantity;
                // y.openQty = x.stock;
              }
            });
        
        
          }
        });
        setTimeout(() => {
          if (this.ErrorRepair.length == 0 && this.Erroreexcel.length == 0 && this.ListNullItem.length == 0 &&
            this.ListNullBarcode.length == 0 && this.ListNullUom.length == 0 && this.ListNullSlocid.length == 0 &&
            this.ListNullQuantity.length == 0 && this.ListNotExitItem.length == 0 )
            this.lines = this.lines.concat(this.importContent);
          else {
            this.openModal(template);
          }
        }, 100);
      }
      else
      {
        this.alertifyService.error(respone.message);
      }
    },error=>{
      this.alertifyService.error(error);
    });
  }
  validateNumber(e)
  {
    debugger;
    if(e.data.quantity !=undefined)
    {
      if(e.data.allowDecimal)
      return true;
      var str = e.value.toString();
      var decimalOnly = 0;
  
      if( str.indexOf('.') != -1 ){ //check if has decimal
          let decimalOnly: string = parseFloat(Math.abs(e.value).toString()).toString().split('.')[1];
          if(decimalOnly!==null && decimalOnly!==undefined)
          {
            let length = decimalOnly.toString()?.length;
            if(length > parseInt('0') )
            {
              return false;
            }
          }
          return  true
      }
      return true;
    }
    
    return true;
  }
}
