import { DatePipe } from '@angular/common';
import { BindingScope } from '@angular/compiler/src/render3/view/template';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemSerialComponent } from 'src/app/component/item-serial/item-serial.component';
import { CurrencyFormat } from 'src/app/currencyFormat.pipe';
import { ManagementItemSerialComponent } from 'src/app/management/shared/management-item-serial/management-item-serial.component';
import { ItemSearch } from 'src/app/shop/components/shop-search-item/shop-search-item.component';
import { TInventoryHeader, TInventoryLine, TInventoryLineSerial, TInventoryLineTemplate } from 'src/app/_models/inventory';
import { ErrorList } from 'src/app/_models/inventorycounting';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { MStorage } from 'src/app/_models/storage';
import { MStore } from 'src/app/_models/store';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { MWarehouse } from 'src/app/_models/warehouse';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { StorageService } from 'src/app/_services/data/storage.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { WarehouseService } from 'src/app/_services/data/warehouse.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';
import { status } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-management-invtransfer-edit',
  templateUrl: './management-invtransfer-edit.component.html',
  styleUrls: ['./management-invtransfer-edit.component.scss'],
  providers: [DatePipe] // Add this
})
export class ManagementInvtransferEditComponent implements OnInit {

  inventory: TInventoryHeader;
  lines: TInventoryLine[] = [];
  serialLines: TInventoryLineSerial[] = [];
  invId = '';
  mode = '';
  isNew = false;
  isEditGrid = false;
  store: MStore;
  fromStore: MStore;
  toStore: MStore;
  isReceipt = false;
  functionId = "Adm_InvTransfer";
  docStatus: any[] = status.InventoryDocumentAdvance;
  importContent: TInventoryLineTemplate[] = [];
  ErrorRepair: ErrorList[] = [];
  Erroreexcel: ErrorList[] = [];
  ListNotExitItem: ErrorList[] = [];
  ListNullItem = [];
  ListNullBarcode = [];
  ListNullUom = [];
  ListNullSlocid = [];
  ListNullQuantity = [];
  ListToSlocIdNull: ErrorList[] = [];
  configStorage: boolean = true;
  arrWhsFrm = [];
  arrWhsTo = [];
  minnumber: number = 1;
  manageStock = "false";
  nowDate: string;
  qtyPattern: any = '';
  inputWithoutConfig = "true";
  lguAdd: string = "Add";
  isSave = true;
  onToolbarPreparing(e) {
    if(this.inventory.status==='O')
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
  async onCollectionGetSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
    cellInfo.setValue(selectedRowKeys[0]);

    if (selectedRowKeys.length > 0) {
      dropDownBoxComponent.close();

      // mcid: string="";
      // companyCode: string="";
      // mchier: string="";
      // mcname: string="";
      let code = cellInfo.data.itemCode;
      let uom = cellInfo.data.uomCode;
      let barcode = cellInfo.data.barCode;

      await this.loadItemStock(selectedRowKeys[0], code, uom, barcode, cellInfo.rowIndex);
      // debugger;
      // let uom='';
      // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 

      // this.gett.instance.cellValue(cellInfo.rowIndex, 'lineName', name);  
      // this.gett.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);  

    }

  }

  async loadItemStock(sloc, itemcode, uomCode, Barcode, rowIndex) {
    let quantity = 0;
    this.itemService.getItemStock(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, sloc,
      itemcode, uomCode, Barcode, '').subscribe((response: any) => {
        let quantity = 0;
        debugger;
        if (response.data !== null && response.data !== undefined && response.data.length > 0) {
          quantity = response.data[0].quantity;
        }
        quantity = quantity;
        this.dataGrid.instance.cellValue(rowIndex, 'openQty', quantity);
      })
    return quantity;
  }
  constructor(public authService: AuthService, private inventoryService: InventoryService,private datePipe: DatePipe, private formBuilder: FormBuilder, 
    private whsService: WarehouseService, private storeService: StoreService, private routeNav: Router, private spinnerService: NgxSpinnerService, private controlService: ControlService, 
    private shiftService: ShiftService, private itemService: ItemService, private modalService: BsModalService, private storageService: StorageService, private alertifyService: AlertifyService, private route: ActivatedRoute,
    private printService: PrintService, private router: Router, private excelSrv: ExcelService, public commonService: CommonService) {
    this.inventory = new TInventoryHeader();

    this.PriceCellValue = this.PriceCellValue.bind(this);
    this.customizeText = this.customizeText.bind(this);
    this.customizeLineTotalText = this.customizeLineTotalText.bind(this);
    this.store = this.authService.storeSelected();
    // this.loadItemList('','','','');
    this.getItemFilterControlList();
    this.loadStore();
  }
  storeList: MStore[] = [];
  toStoreList: MStore[] = [];
  SlocFromList: MStorage[] = [];
  SlocToList: MStorage[] = [];
  itemList: ItemViewModel[] = [];
  docTypes: any = [
    { name: 'Shipment', value: 'S' },
    { name: 'Receipt', value: 'R' },
    { name: 'Transfer', value: 'T' },

  ];
  SumLineTotalCellValue(rowData) {
    debugger;
    return "X";
  }
  editorOptions: any;
  inventoryWitouthBOM = "true";
  checkInventoryInShift = "false";
  checkInventorySerial = "true";
  loadSetting() {
    let manageStock = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'ManageStock');
    // debugger;
    if (manageStock !== null && manageStock !== undefined) {
      this.manageStock = manageStock.settingValue;
    }
    let inventoryWitouthBOM = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'InventoryWithoutBOM');
    // debugger;
    if (inventoryWitouthBOM !== null && inventoryWitouthBOM !== undefined) {
      this.inventoryWitouthBOM = inventoryWitouthBOM.settingValue;
    }
    let checkInventoryInShift = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'INVInShift');
    // debugger;
    if (checkInventoryInShift !== null && checkInventoryInShift !== undefined) {
      this.checkInventoryInShift = checkInventoryInShift.settingValue;
    }
    let checkInventorySerial = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'InventorySerialManage');
    // debugger;
    if (checkInventorySerial !== null && checkInventorySerial !== undefined) {
      this.checkInventorySerial = checkInventorySerial.settingValue;
    }
  }


  countRow = 0;
  onInitNewRow(e) {
    // debugger;
    this.countRow++;
    e.data.taxCode = 'S0';
    e.data.frSlocId = this.slocFromDefault;
    e.data.toSlocId = this.slocToDefault;// this.authService.storeSelected().whsCode;// 'SL001'; 
    // console.log("this.slocToDefault", this.slocToDefault);
    // e.data.hireDate = new Date();
    // e.promise = this.getDefaultData().then((data: any) => {
    //     e.data.ID = data.ID;
    //     e.data.position = data.Position;
    // });
  }
  lineTotalCellValue(rowData) {
    debugger;
    if (rowData.quantity !== null && rowData.quantity !== undefined && rowData.price !== null && rowData.quantity !== undefined) {
      //+ rowData.taxAmt
      let value = rowData.quantity * rowData.price;
      return value;// this.authService.formatCurrentcy(value);; 
    }
    return 0;
  }
  loadStore() {
    this.storeService.getByUser(this.authService.getCurrentInfor().username).subscribe((response: any) => {
      if (response.success) {
        this.storeList = response.data;
        // console.log(this.storeList);
      }
      else {
        this.alertifyService.warning(response.message);
      }


    })
  }
  loadToStore() {
    this.storeService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      if (response.success) {
        this.toStoreList = response.data;
        // console.log("this.toStoreList" + this.toStoreList);
      }
      else {
        this.alertifyService.warning(response.message);
      }

    })
  }

  // modalRef1: BsModalRef;
  // openModal1(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template);
  // }
  transferSelected(data) {
    this.modalRef.hide();
    this.inventoryService.getInventoryTransfer(data.invtid, this.store.storeId, this.store.companyCode).subscribe((response: any) => {
      setTimeout(() => {
        this.lines = response.data.lines;
        // console.log(this.lines);
      }, 50);
    });
    console.log(data);
  }
  onTypeChanged(value) {
    if (value === "S") {
      this.isReceipt = false;
    }
    else {
      this.isReceipt = true;
    }
  }
  slocFromDefault = "";
  slocToDefault = "";
  loadSlocFromStore(storeId) {
    let comp = this.store.companyCode;
    debugger;
    this.whsService.GetWarehouseByWhsType(comp, storeId).subscribe((response: any) => {
      if (response.success) {
        // S: Main W: Order
        this.arrWhsFrm = [];
        const arrByWhs = response.data.filter(s => s.whsType !== "T");
        if (arrByWhs.length > 0) {
          arrByWhs.forEach(item => {
            this.arrWhsFrm.push({
              slocId: item.whsCode,
              slocName: item.whsName
            });
          });
          this.SlocFromList = this.arrWhsFrm;

          if (this.countRow > 0) {
            for (var i = 0; i < this.countRow; i++) {
              this.dataGrid.instance.cellValue(i, 'From Bins', this.arrWhsFrm[0].slocId);
            }
          }
          // console.log("from", this.SlocFromList);
        }
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
  }
  loadSlocToStore(storeId) {
    let comp = this.store.companyCode;
    this.whsService.GetWarehouseByWhsType(comp, storeId).subscribe((response: any) => {
      if (response.success) {
        this.arrWhsTo = [];
        console.log("response.data to", response.data)
        const arrByWhs = response.data.filter(s => s.whsType !== "T");
        console.log("arrByWhs to", arrByWhs)
        if (arrByWhs.length > 0) {
          arrByWhs.forEach(item => {
            this.arrWhsTo.push({
              slocId: item.whsCode,
              slocName: item.whsName
            });
          });

          this.SlocToList = this.arrWhsTo;
          if (this.countRow > 0) {
            for (var i = 0; i < this.countRow; i++) {
              this.dataGrid.instance.cellValue(i, 'To Bins', this.arrWhsTo[0].slocId);
            }
          }
        }
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
  }

  isLoading = false;
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
  loadItemList(itemcode, uomcode, barcode, keyword) {
    // this.spinnerService.show();
    this.itemService.GetItemWithoutPriceList(this.store.companyCode, this.store.storeId, itemcode, uomcode, barcode, keyword, '', '').subscribe((response: any) => {
      if (response.success) {
        // this.isLoading = true;
        this.itemList = response.data.filter(x=> x.isBom !==true && x.customField4==='I');
        if(this.inventoryWitouthBOM === 'false')
        {
          if(response.data!==null && response.data!==undefined && response.data?.length > 0)
          {
            let itemListBOM=[];
            itemListBOM =  response.data.filter(x=>x.isBom ===true );
            if(itemListBOM!==null && itemListBOM!==undefined &&itemListBOM?.length > 0)
            {
              this.itemList.push(...itemListBOM);
            }
          
          }
          // this.itemList =  this.itemList.filter(x=>x.isBom!==true );
        }
      }
      // this.spinnerService.hide();
    });

  }


  PriceCellValue(rowData) {
    // debuggerl
    if (rowData.price !== null && rowData.price !== undefined && rowData.price.toString() !== "undefined") {
      return this.authService.formatCurrentcy(rowData.price);
    }
    return 0;
  }
  customizeLineTotalText(e) {
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  }
  customizeText(e) {
    debugger;
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  dateFormat = "";
  canEdit = false;
  canAdd = false;

  checkFormatQty() {
    let format = this.authService.loadFormat();
    if (format !== null || format !== undefined) {
      for (let i = 0; i < parseInt(format.qtyDecimalPlacesFormat.toString()); i++) {
        this.minnumber = this.minnumber / 10;
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

  ngOnInit() {
    this.nowDate = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
    this.loadSetting();
    // debugger;
    this.checkFormatQty();
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.routeNav.navigate(["/admin/permission-denied"]);
    }

    this.canAdd = this.authService.checkRole(this.functionId, '', 'I');
    this.canEdit = this.authService.checkRole(this.functionId, '', 'E');
    this.dateFormat = this.authService.loadFormat().dateFormat;
    // debugger;
    this.route.params.subscribe(data => {
      this.mode = data['m'];
      this.invId = data['id'];
    })
    this.loadToStore();
    if (this.mode === 'e') {
      this.isNew = false;
      this.inventoryService.getInventoryTransfer(this.invId, this.store.storeId, this.store.companyCode).subscribe((response: any) => {
        this.inventory = response.data;
        this.lines = this.inventory.lines;
        console.log(" this.inventory",  this.inventory);
        this.GetFromBinsEdit(this.inventory.fromStore, this.inventory.fromWhs);
        this.GetToBinsEdit(this.inventory.fromStore, this.inventory.toWhs);

        // this.inventory.frSlocId = response.data.fromWhs;
        // this.inventory.toSlocId = response.data.toWhs;
        // console.log("this.inventory", this.inventory);

        // if (this.inventory.status === 'C' && this.inventory.isCanceled === 'Y') {
        //   this.inventory.status = 'N';
        // }
        // else {
        //   this.docStatus.push({
        //     value: "O", name: "Open",
        //   })
        // }
        // if (this.storeList !== null && this.storeList !== undefined) {
        //   this.fromStore = this.storeList.find(x => x.storeId === this.inventory.fromStore);
        //   this.toStore = this.storeList.find(x => x.storeId === this.inventory.fromStore);
        //   //  = this.store;

        //   // this.inventory.fromStore= this.store.storeId; 
        //   // this.storageService.getByStore(this.store.storeId, this.store.companyCode).subscribe((response)=>{
        //   //   this.SlocFromList = response;

        //   // })
        // }
        
        // this.loadSlocFromStore(this.inventory.fromStore);
        // this.loadSlocToStore(this.inventory.fromStore);

        // setTimeout(() => {
        //   this.lines = response.data.lines;
        // }, 50);


      });

      
    }
    else {
      this.inventory = new TInventoryHeader();
      this.inventory.status = 'O';
      this.lines = [];
      this.serialLines = [];
      // console.log(this.goodreceipt);
      this.isNew = true;
      this.inventory.fromStore = this.authService.storeSelected().storeId;
      //  this.loadSlocFromStore(this.authService.storeSelected().storeId);
      this.onFromStoreChanged(this.authService.storeSelected());
      this.onToStoreChanged(this.authService.storeSelected());
      // this.loadUom();
    }

  }

  frSlocIdEdit: string;
  GetFromBinsEdit(storeId, frSlocId){
    let comp = this.store.companyCode;
    this.whsService.GetWarehouseByWhsType(comp, storeId).subscribe((response: any) => {
      if (response.success) {
        console.log("response.data from", response.data)
        this.frSlocIdEdit = response.data.filter(s => s.whsCode === frSlocId)[0].whsName;
        console.log("this.frSlocIdEdit", this.frSlocIdEdit)
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
  }

  toSlocIdEdit: string;
  GetToBinsEdit(storeId, toSlocId){
    let comp = this.store.companyCode;
    this.whsService.GetWarehouseByWhsType(comp, storeId).subscribe((response: any) => {
      if (response.success) {
        console.log("response.data to", response.data)
        console.log("toSlocId", toSlocId);
        this.toSlocIdEdit = response.data.filter(s => s.whsCode === toSlocId)[0].whsName;
        console.log("this.toSlocIdEdit", this.toSlocIdEdit)
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
  }

  changeFromBins(bins: onBins) {
    // console.log("store", bins);
    debugger;
    if(bins?.slocId?.length > 0)
    {
      this.inventory.fromWhs = bins.slocId;
      this.slocFromDefault = bins.slocId;
      if (this.countRow > 0) {
        for (var i = 0; i < this.countRow; i++) {
          this.dataGrid.instance.cellValue(i, 'From Bins', bins.slocId);
        }
        this.dataGrid.instance.saveEditData();
      }
    }
   
  }

  changeToBins(bins: onBins) {
    // console.log("store", bins);
    if(bins?.slocId?.length > 0)
    {
      this.inventory.toWhs = bins.slocId;
      this.slocToDefault = bins.slocId;
      if (this.countRow > 0) {
        for (var i = 0; i < this.countRow; i++) {
          this.dataGrid.instance.cellValue(i, 'To Bins', bins.slocId);
         
        }
        this.dataGrid.instance.saveEditData();
      }
    }
  }

  onFromStoreChanged(store: MStore) {
    debugger;
    // console.log('AAA');
    if (store !== null && store !== undefined) {
      this.fromStore = store;
      this.loadSlocFromStore(this.fromStore.storeId);
      this.loadSlocToStore(this.fromStore.storeId);

      this.whsService.getItem(this.authService.getCurrentInfor().companyCode, this.fromStore.whsCode).subscribe((response: any) => {
        if (response.success) {
          // this.whs = response.data;
          // console.log("response.data", response.data);
          this.slocFromDefault = response.data.defaultSlocId !== null ? response.data.defaultSlocId : response.data.whsCode;
          this.inventory.transitWhs = store.customField1;
          this.inventory.fromWhs = store.whsCode;
        }
        else {
          this.alertifyService.error(response.message);
        }

      });
    }


  }

  // loadItemFilter()
  // {
  //   this.whsService.getItem(this.authService.getCurrentInfor().companyCode, this.fromStore.whsCode).subscribe((response: any) => {
  //     if (response.success) {
  //       // this.whs = response.data;
  //       // console.log("response.data", response.data);
  //       this.slocFromDefault = response.data.defaultSlocId !== null ? response.data.defaultSlocId : response.data.whsCode;
  //       this.inventory.transitWhs = this.fromStore.customField1;
  //       this.inventory.fromWhs = this.fromStore.whsCode;
  //     }
  //     else {
  //       this.alertifyService.error(response.message);
  //     }

  //   });
  // }
  onToStoreChanged(store) {
    if (store !== null && store !== undefined) {
      this.toStore = store;
      this.loadSlocToStore(this.toStore.storeId);
      this.whsService.getItem(this.authService.getCurrentInfor().companyCode, this.toStore.whsCode).subscribe((response: any) => {
        debugger;
        if (response.success) {
          this.slocToDefault = response.data.defaultSlocId !== null ? response.data.defaultSlocId : response.data.whsCode;
          this.inventory.toWhs = this.inventory.toWhs;
        }
        else {
          this.alertifyService.error(response.message);
        }

      });
    }

  }
  @ViewChild('ddlStatus', { static: false }) ddlStatus;
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
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to save!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            if (this.inventory.docType === null || this.inventory.docType === undefined || this.inventory.docType === "undefined") {
              this.inventory.docType = "T";
            }
            debugger;
            let quantity: number = 0;
            let storeClient = this.authService.getStoreClient();
            if(storeClient!==null && storeClient!==undefined)
            {
              this.inventory.terminalId = this.authService.getStoreClient().publicIP;
            }
            else
            {
              this.inventory.terminalId = this.authService.getLocalIP();
            }
            this.isSave = false;
            let shift = this.shiftService.getCurrentShip();
            if (shift !== null && shift !== undefined) {
              this.inventory.shiftId = this.shiftService.getCurrentShip().shiftId;
            }
            debugger;
            console.log("this.inventory", this.inventory);
            // this.goodreceipt.totalReceipt= quantity;
            this.inventory.lines = this.lines;
            this.inventory.companyCode = this.store.companyCode;
            // this.ddlStatus.value
            this.inventory.isCanceled = 'N';
            this.inventory.docType = "T";
            this.inventory.fromStore = this.fromStore.storeId;
            this.inventory.fromStoreName = this.fromStore.storeName;
            this.inventory.toStore = this.fromStore.storeId;
            this.inventory.toStoreName = this.fromStore.storeName;
            this.inventory.fromWhs = this.inventory.fromWhs !== undefined ? this.inventory.fromWhs : this.slocFromDefault;
            this.inventory.toWhs = this.inventory.toWhs !== undefined ? this.inventory.toWhs : this.slocToDefault;

            // console.log("aaa", this.inventory.fromWhs, this.inventory.toWhs);
            // this.inventory.docDate = this.convertUTCDateToLocalDate(this.inventory.docDate);
            let msg = "";
            this.inventory.lines = this.inventory.lines.filter(x => x.quantity > 0);
            this.inventory.lines.forEach(line => {
              if (line.openQty === null || line.openQty === undefined || line.openQty < line.quantity) {
                msg += "Item: " + line.itemCode + ' - ' + line.uomCode + ", ";
              }
            });
            if (this.manageStock === "true" && msg.length > 0) {
              let mes = "Please check onhand " + msg;
              this.alertifyService.warning(mes);
            }
            else {
              if (this.isNew === true) {
                this.lines.forEach((line) => {
                  line.openQty = line.quantity;
                })
                this.inventory.status = 'C';
                this.inventory.createdBy = this.authService.decodeToken?.unique_name;
    
                this.inventoryService.create(this.inventory).subscribe((response: any) => {
                  this.isSave = true;
                  if (response.success === true) {
                    this.alertifyService.success("Create successfully completed. Trans Id: " + response.message);

                    setTimeout(() => {
                      this.routeNav.navigate(["admin/inventory/transfer", 'e', response.message]).then(() => { window.location.reload(); });
                    }, 50);
                    // this.router.navigate['goodreceipt'];
                  }
                  else {
                    // this.isSave = true;
                    this.alertifyService.error(response.message);
                  }
                }, error => {
                  this.isSave = true;
                  Swal.fire({
                    icon: 'error',
                    title: 'Save Error',
                    text: error
                  });
                });
              }
              else {
                debugger;
                if (this.ddlStatus.value === "N") {
                  this.inventory.refId = this.inventory.invtid;
                  this.inventory.invtid = "";
                  this.inventory.isCanceled = 'Y';
                  this.inventory.status = "C";
                  this.inventory.createdBy = this.authService.getCurrentInfor().username;
                  this.inventoryService.create(this.inventory).subscribe((response: any) => {
                    this.isSave = true;
                    if (response.success === true) {
                     
                      this.alertifyService.success("Create successfully completed. Trans Id: " + response.message);
                      // this.router.navigate['goodissue'];
                      // this.router.navigate(["admin/goodreceipt", 'e', response.message]);
                      this.routeNav.navigate(["admin/inventory/transfer", 'e', response.message]).then(() => { window.location.reload(); });
                    }
                    else {
                      // this.isSave = true;
                      this.alertifyService.error(response.message);
                    }
                  }, error => {
                    this.isSave = true;
                    Swal.fire({
                      icon: 'error',
                      title: 'Save Error',
                      text: error
                    });
                  });
                }
                else {
                  this.inventory.modifiedBy = this.authService.decodeToken?.unique_name;
                  this.inventory.status = this.ddlStatus.value;
                  this.inventoryService.update(this.inventory).subscribe((response: any) => {
                    this.isSave = true;
                    if (response.success === true) {
                      this.alertifyService.success("Update successfully completed.");
                      // this.routeNav.navigate(["admin/inventory/transfer", 'e', response.message]);
                      setTimeout(() => {
                        this.routeNav.navigate(["admin/inventory/transfer", 'e', response.message]);
                      }, 50);
                    }
                    else {
                      // this.isSave = true;
                      this.alertifyService.error(response.message);
                    }
                  }, error => {
                    this.isSave = true;
                    Swal.fire({
                      icon: 'error',
                      title: 'Save Error',
                      text: error
                    });
                  });
                }
    
    
              }
            }
    
          }
        })
      }
    }
  }
  //  convertUTCDateToLocalDate(date) {
  //   var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
  //   return newDate;   
  // }
  getDateFormat(date) {
    debugger;
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    var a = date.toLocalTime();
    var time = date.toISOString().split("T")[1];
    // var hours= (date.getHours()).toString();
    // var min= (date.getMinutes()).toString();
    // var sec= (date.getSeconds()).toString();
    // var time = "T" +hours+min+sec;
    return date.getFullYear() + '-' + month + '-' + (day) + time;
  }
  onRowPrepared(e) {
    // console.log('onRowPrepared');
    // debugger;
    if (e.data !== null && e.data !== undefined) {

      if (e.data.keyId !== null && e.data.keyId !== undefined && e.data.lineId !== null && e.data.lineId !== undefined) {
        if (e.rowType === "data" && (e.data.lines === null || e.data.lines === undefined || e.data.lines.length === 0 || e.data.lines === 'undefined')) {
          // debugger;
          e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");
          e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");

        }
      }

    }


  }
  onRowInserted(e) {
    // debugger;
    let row = e.data;

    if (this.serialLines !== null && this.serialLines.length > 0) {
      row.lines = this.serialLines;

      let quantityLine = 0;
      if (row.lines !== null) {
        row.lines.forEach(line => {
          // debugger
          quantityLine++;
          line.frSlocId = e.data.frSlocId;
          line.toSlocId = e.data.toSlocId;
        });
        e.data.quantity = quantityLine;
      }
      this.serialLines = null;
    }

    // if (e.parentType === "dataRow" && (e.dataField === "itemCode" ) ) { 
    //   // e.row.data.condition1==="CE"

    //   let lines = row.data.lines;  
    //   console.log(lines);
    // }
  }
  @ViewChild('dataGrid', { static: false }) dataGrid;

  // serialList: MItemSerial[];
  async onItemSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
    
    cellInfo.setValue(selectedRowKeys[0]);
    if (selectedRowKeys.length > 0) {
      debugger;
      dropDownBoxComponent.close();
      let code = event.selectedRowsData[0].itemCode;
      let name = event.selectedRowsData[0].itemName;
      let uom = event.selectedRowsData[0].uomCode;
      let barcode = event.selectedRowsData[0].barCode;
      let price = event.selectedRowsData[0].defaultPrice;
      let frSlocId = cellInfo.data.frSlocId;
      let toSlocId = cellInfo.data.toSlocId;
      let taxCode = cellInfo.data.taxCode;
      let isSerial = event.selectedRowsData[0].isSerial;
      let isVoucher = event.selectedRowsData[0].isVoucher;
      let allowDecimal = false;
      if(this.authService.checkFormatNumber(1.5,"quantity",uom))
      {
        allowDecimal = true;
      }
      // let fromSloc = cellInfo?.data?.frSlocId;
      let fromSloc = this.slocFromDefault;
      let quantity = 0;
      if (fromSloc !== null && fromSloc !== undefined) {
        await this.itemService.getItemStock(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, fromSloc,
          code, uom, barcode, '').subscribe((response: any) => {
            // let quantity = 0;
            debugger;
            if (response.data !== null && response.data !== undefined && response.data.length > 0) {
              quantity = response.data[0].quantity;
            }

            quantity = quantity;
            // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'openQty', quantity);
            if (isSerial === true || isVoucher === true) {

              if(this.checkInventorySerial === "true")
              {
                let line = new TInventoryLine();

                line.lineId = (this.lines.length + 1).toString();
                line.keyId = selectedRowKeys[0];
                line.itemCode = code;
                line.description = name;
                line.frSlocId = frSlocId;
                line.toSlocId = toSlocId;
                // line.currencyCode= this.store.currencyCode;
                // line.tax = taxCode;
                // line.curr = this.storeSelected.currencyCode;
                line.uomCode = uom;
                line.barCode = barcode;
                line.price = price;
                line.quantity = 1;
                line.openQty = quantity;
                // line.taxCode = 'S0';
                // line.slocId = this.storeSelected.whsCode;
                // line.taxAmt = taxamt;
                // line.taxRate = percent;
                // line.lineTotal = linetotal;

                // this.dataGrid.instance.refresh();

                // let xxx =false;
                let Itemcheck = event.selectedRowsData[0];
                Itemcheck.slocId = frSlocId;
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
                  // console.log('itemSerial', response) // here you will get the value
                  // let rounded = Math.round(payment.value * 100.0 / 5.0) * 5.0 / 100.0;  
                  // payment.afterExchange = rounded * payment.rate;
                  if (response !== null && response !== undefined && response.length > 0) {
                    line.lines = [];
                    response.forEach(serial => {
                      let serialLine = new TInventoryLineSerial();
                      serialLine.serialNum = serial.serialNum;
                      serialLine.itemCode = line.itemCode;
                      serialLine.uomCode = line.uomCode;
                      serialLine.description = line.description;
                      // serialLine.slocId = line.slocId;
                      serialLine.frSlocId = line.frSlocId;
                      serialLine.toSlocId = line.toSlocId;
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
                this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'itemCode', code);
                this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'description', name);
                this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'currencyCode', this.store.currencyCode);
                this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'uomCode', uom);
                this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'barCode', barcode);
                this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price', price);
                this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'quantity', '1');
                this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lineTotal', price);
                this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'toSlocId', this.slocToDefault);
                this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'frSlocId', this.slocFromDefault);
                this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'openQty', quantity);
                this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'allowDecimal', allowDecimal);
              }
            }
            else {
              debugger;
              // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'itemCode', code);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'description', name);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'currencyCode', this.store.currencyCode);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'uomCode', uom);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'barCode', barcode);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price', price);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'quantity', '1');
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lineTotal', price);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'toSlocId', this.slocToDefault);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'frSlocId', this.slocFromDefault);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'openQty', quantity);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'allowDecimal', allowDecimal);
              // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'openQty', quantity);

            }
          })
         
      }

      setTimeout(() => {
        this.dataGrid.instance.saveEditData();
      }, 100); 

      // if(isSerial===true)
      // {
      //   const initialState = {
      //     itemCode:  code, title: 'Item Serial',
      //   };
      //   this.modalRef = this.modalService.show(ItemSerialComponent, {initialState}); 
      //   this.modalRef.content.onClose.subscribe(result => {
      //     console.log('rowIndex', cellInfo.rowIndex);
      //     console.log(this.dataGrid.instance);
      //     if(result!==null && result !=undefined)
      //     { 
      //       result.forEach(item => {
      //       let lineSerial= new TInventoryLineSerial();
      //       lineSerial.itemCode = code;
      //       lineSerial.serialNum= item.serialNum;
      //       lineSerial.quantity= 1;
      //       lineSerial.uomCode= uom;
      //       lineSerial.frSlocId= '';
      //       lineSerial.toSlocId= '';
      //       // debugger;
      //       // let itemAddIndex = this.lines.findIndex(x=>x.itemCode===code&&x.uomCode===uom);
      //       // let row =this.dataGrid.instance.totalCount();
      //       // if(itemAddIndex===-1)
      //       // {
      //       //   itemAddIndex = row;
      //       // }
      //       this.serialLines.push(lineSerial);
      //       // itemAdd.lines.push(lineSerial);
      //       // this.lines[cellInfo.rowIndex].lines.push(lineSerial);
      //      });
      //     }

      //   })
      // }
    }

  }

  PrintDetail(data) {
    this.router.navigate(["admin/invstransfer/transfer/print", data.invtid]).then(() => {
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

      const header: string[] = Object.getOwnPropertyNames(new TInventoryLineTemplate());
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
                header[j].toLowerCase() === 'frslocid' || header[j].toLowerCase() === 'toslocid') {
                obj[header[j]] = arr[i] == undefined ? '' : arr[i].toString();
              }
              else {
                obj[header[j]] = arr[i];
              }
            }
          }
        }


        return <TInventoryLineTemplate>obj;
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
      this.ListToSlocIdNull = [];
      this.importContent.forEach(item => {
        item.isOnhand = true;
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
        let listtax = this.SlocToList.filter(x => x.slocId === item.toSlocId);
        if (listtax.length == 0) {
          let index = new ErrorList();
          index.itemCode = item.toSlocId;
          index.stt = item.stt;
          this.ListToSlocIdNull.push(index);
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
        if (item.frSlocId == '' || item.frSlocId == null) {
          this.ListNullSlocid.push(item.stt);
        }
        if (item.quantity == undefined || item.quantity == null || item.quantity <=0 ||(!this.authService.checkFormatNumber(item.quantity, 'quantity', item.uomCode))) {
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
        //   item.price = listItem[0].defaultPrice;
        //   item.lineTotal = item.price * item.quantity;
        //   let amount = item.quantity * item.price;
        //   this.itemService.getItemStock(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, item.frSlocId,
        //     item.itemCode, item.uomCode, item.barCode, '').subscribe((response: any) => {
        //       let quantity = 0;
        //       debugger;
        //       if (response.data !== null && response.data !== undefined && response.data.length > 0) {
        //         quantity = response.data[0].quantity;
        //       }
        //       item.openQty = quantity;
        //     });
        // }
      });
      // console.log(this.importContent);
      // console.log(this.ErrorRepair);
      // console.log(this.Erroreexcel);
      // console.log(this.ListNullItem);
      // console.log(this.ListNotExitItem);
      this.checkitemimport(this.importContent,template);
      // if (this.ErrorRepair.length == 0 && this.Erroreexcel.length == 0 && this.ListNullItem.length == 0 &&
      //   this.ListNullBarcode.length == 0 && this.ListNullUom.length == 0 && this.ListNullSlocid.length == 0 &&
      //   this.ListNullQuantity.length == 0 && this.ListNotExitItem.length == 0 && this.ListToSlocIdNull.length == 0)
      //   this.lines = this.lines.concat(this.importContent);
      // else {
      //   this.openModal(template);
      // }


      this.clearFileInput();
    };
  }
  downloadTemplate() {
    setTimeout(() => {
      this.commonService.download('InventoryTranfer.xlsx');
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
      let ToSlocIdNull = this.ListToSlocIdNull.filter(x => x.stt == item.stt)
      if (ToSlocIdNull.length > 0) {
        item.listError = item.listError + ToSlocIdNull[0].itemCode + "ToSlocId Not Found; "
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
        item.listError = item.listError + "FrSlocId is Null; "
      }
      if (this.ListNullQuantity.filter(x => x === item.stt).length > 0) {
        item.listError = item.listError + "Quantity is Not Correct; Quantity  greater than 0 "
      }
      delete item.description;
      delete item.stt;
      delete item.lineId;
      delete item.price;
      delete item.lineTotal;
      delete item.keyId;
      delete item.openQty;
    });
    // console.log(this.importContent);
    let day = new Date()
    let fileName = "InventoryTranfer" + day.toLocaleString();
    let fileWidth: any = [{ width: 15 }, { width: 10 }, { width: 20 }, { width: 15 }, { width: 15 },
    { width: 15 }, { width: 200 }];
    this.excelSrv.exportExcel(this.importContent, fileName, fileWidth);
  }
  checkitemimport(model: TInventoryLineTemplate[],template){
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
                y.openQty = x.stock;
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

export class onBins {
  slocId: string = "";
  slocName: string = "";
}
