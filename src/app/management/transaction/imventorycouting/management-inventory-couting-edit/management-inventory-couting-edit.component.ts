import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { rename } from 'fs';
import { now } from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemSerialComponent } from 'src/app/component/item-serial/item-serial.component';
import { ManagementItemSerialComponent } from 'src/app/management/shared/management-item-serial/management-item-serial.component';
import { ErrorList, TInventoryCountingHeader, TInventoryCountingLine, TInventoryCountingLineSerial, TInventoryCountingLineSerialTemPlate, TInventoryCountingTemplate } from 'src/app/_models/inventorycounting';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { MStorage } from 'src/app/_models/storage';
import { MStore } from 'src/app/_models/store';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { MWarehouse } from 'src/app/_models/warehouse';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { StorageService } from 'src/app/_services/data/storage.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { WarehouseService } from 'src/app/_services/data/warehouse.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventorycoutingService } from 'src/app/_services/transaction/inventorycouting.service';
import { status } from 'src/environments/environment';
import Swal from 'sweetalert2';
import saveAs from 'file-saver';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';
import { ItemSearch } from 'src/app/shop/components/shop-search-item/shop-search-item.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ControlService } from 'src/app/_services/data/control.service';
@Component({
  selector: 'app-management-inventory-couting-edit',
  templateUrl: './management-inventory-couting-edit.component.html',
  styleUrls: ['./management-inventory-couting-edit.component.scss'],
  providers: [DatePipe] // Add this
})
export class ManagementInventoryCoutingEditComponent implements OnInit {


  inventory: TInventoryCountingHeader;
  lines: TInventoryCountingLine[] = [];
  serialLines: TInventoryCountingLineSerial[] = [];
  importContent: TInventoryCountingTemplate[] = [];
  importContentSeri: TInventoryCountingLineSerialTemPlate[] = [];
  ErrorRepair: ErrorList[] = [];
  Erroreexcel: ErrorList[] = [];
  ListNotExitItem: ErrorList[] = [];
  ListNullItem = [];
  ListNullBarcode = [];
  ListNullUom = [];
  ListNullSlocid = [];
  ListNullQuantity = [];
  ListSerialError = [];
  invId = '';
  mode = '';
  isNew = false;
  isEditGrid = false;
  selectedStore: MStore;
  docStatus: any[] = status.InventoryDocument;
  minnumber: number = 0;
  nowDate: string;
  qtyPattern: any = '';
  inputWithoutConfig = "true";
  lguAdd: string = "Add";
  isSave = true;
  onToolbarPreparing(e) {
    if(!this.isCounted)
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
  onExporting(e) {
    const workbook = new Workbook();    
    const worksheet = workbook.addWorksheet('Main sheet');
    let nameOfRpt= 'InventoryCounting' ;
    var d = new Date();
    let dateFm = this.GetDateFormat(d);
  
    nameOfRpt = nameOfRpt + '_' + dateFm.replace(/\-/gi,'') + '_' + this.authService.getCurrentInfor().username;
    exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        customizeCell: function(options) {
          debugger;
            // const excelCell = options;
            const { gridCell, excelCell } = options;

            if(gridCell.rowType === 'data') {
              // debugger;
              //   excelCell.font = { color: { argb: 'FF0000FF' }, underline: true };
              //   excelCell.alignment = { horizontal: 'left' };
            }
        } 
    }).then(function() {
        workbook.xlsx.writeBuffer()
            .then(function(buffer: BlobPart) {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), nameOfRpt + '.xlsx');
            });
    });
    e.cancel = true; 
  }
  constructor(private authService: AuthService, private formBuilder: FormBuilder, private inventoryCountingService: InventorycoutingService, private whsService: WarehouseService, private storeService: StoreService, private router: Router,
    private itemService: ItemService, private modalService: BsModalService, private storageService: StorageService, private alertifyService: AlertifyService, private route: ActivatedRoute,
    private printService: PrintService, private commonService: CommonService, private controlService: ControlService, private excelSrv: ExcelService, private datePipe: DatePipe,private inventoryService: InventoryService) {
    this.inventory = new TInventoryCountingHeader();
    this.customizeText = this.customizeText.bind(this);
    this.getItemFilterControlList();
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
  
  storeList: MStore[] = [];
  SlocList: MStorage[];
  itemList: ItemViewModel[] = [];

  configStorage: boolean = true;
  arrWhsFrm = [];

  loadStore() {
    this.storeService.getByUser(this.authService.getCurrentInfor().username).subscribe((response: any) => {
      if (response.success) {
        this.storeList = response.data;
        // console.log(this.storeList);
        if (this.storeList !== null && this.storeList !== undefined) {
          this.inventory.storeId = this.selectedStore.storeId;
          if (this.configStorage) {
            this.GetDataWhsType(this.selectedStore.companyCode, this.selectedStore.storeId);
          } else {
            this.storageService.getByStore(this.selectedStore.storeId, this.selectedStore.companyCode).subscribe((response: any) => {
              if (response.success) {
                this.SlocList = response.data;
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


    })
  }

  GetDataWhsType(company, storeId) {
    this.whsService.GetWarehouseByWhsType(company, storeId).subscribe((response: any) => {
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
          this.SlocList = this.arrWhsFrm;
          if (this.countRow > 0) {
            for (var i = 0; i < this.countRow; i++) {
              this.dataGrid.instance.cellValue(i, 'Bins Code', this.arrWhsFrm[0].slocId);
            }
          }
        }
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
  }
  customizeText(e) {

    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  lineTotalCellValue(rowData) {
    if (rowData.quantity !== null && rowData.price !== null) {
      return rowData.quantity * rowData.price;
    }
    return 0;
  }
  loadSlocStore(storeId) {
    let comp = this.selectedStore.companyCode;
    if (this.configStorage) {
      this.GetDataWhsType(this.selectedStore.companyCode, this.selectedStore.storeId);
    } else {
      this.storageService.getByStore(storeId, comp).subscribe((response: any) => {
        if (response.success) {
          this.SlocList = response.data;
        }
        else {
          this.alertifyService.warning(response.message);
        }
      })
    }


  }
 
  counted() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to closed!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.inventoryCountingService.countingToCounted(this.invId, this.selectedStore.storeId, this.selectedStore.companyCode).subscribe((response: any) => {
          if (response.success === true) {
            // let rs= response.data;
            // setTimeout(() => {
            //   this.lines = rs.lines;   
            //   this.isCounted=true;
            //   console.log(rs);
            // },50); 

            this.alertifyService.success('Counted successfully completed');
            setTimeout(() => {
              this.router.navigate(["admin/inventory/counting", 'e', this.invId]);
              window.location.reload();
            }, 50);
            //
          }
          else {
            this.alertifyService.warning('update to counted failed. Message' + response.message);
          }

        });
      }
    });
  }
  isCounted = false;
  dateFormat = "";
  canEdit = false;
  canAdd = false;
  functionId = "Adm_InvCounting";
  
  whs: MWarehouse;
  defaultSlocId = "";
  loadDefaultWhs(whs) {
    this.whsService.getItem(this.authService.getCurrentInfor().companyCode, whs).subscribe((response: any) => {
      // this.whs = response;
      if (response.success) {
        this.whs = response.data;
        // console.log("this.whs", this.whs);
        this.defaultSlocId = response.data.whsCode
      }
      else {
        this.alertifyService.error(response.message);
      }
    });
  }

  countRow = 0;

  onInitNewRow(e) {
    this.countRow++;
    // console.log("this.defaultSlocId", this.defaultSlocId);
    e.data.slocId = this.defaultSlocId != null ? this.defaultSlocId : this.authService.storeSelected().whsCode;// this.authService.storeSelected().whsCode;// 'SL001'; 
    // e.data.hireDate = new Date();
    // e.promise = this.getDefaultData().then((data: any) => {
    //     e.data.ID = data.ID;
    //     e.data.position = data.Position;
    // });
  }
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
  inventoryWitouthBOM = "true";
  checkInventorySerial = "true";
  loadSetting() {
   
    let inventoryWitouthBOM = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'InventoryWithoutBOM');
    // debugger;
    if (inventoryWitouthBOM !== null && inventoryWitouthBOM !== undefined) {
      this.inventoryWitouthBOM = inventoryWitouthBOM.settingValue;
    }
    let checkInventorySerial = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'InventorySerialManage');
    // debugger;
    if (checkInventorySerial !== null && checkInventorySerial !== undefined) {
      this.checkInventorySerial = checkInventorySerial.settingValue;
    }
  }
  loadItemList(itemCode,  uomcode,  barcode,  keyword) {
    debugger
    this.itemService.GetItemWithoutPriceList(this.selectedStore.companyCode, this.selectedStore.storeId, itemCode, uomcode, barcode, keyword, '','',true).subscribe((response: any) => {
      this.itemList = response.data.filter(x=> x.isBom !==true && x.customField4==='I');
      debugger
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
     
    });
  }
  ngOnInit() {
    this.nowDate = this.datePipe.transform(new Date(), 'MM/dd/yyyy HH:mm:ss');
    this.checkFormatQty();
    this.loadSetting();
    // debugger;
    let check = this.authService.checkRole(this.functionId, '', 'V');

    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    else {
      this.loadDefaultWhs(this.authService.storeSelected().whsCode);
      this.canAdd = this.authService.checkRole(this.functionId, '', 'I');
      this.canEdit = this.authService.checkRole(this.functionId, '', 'E');
      this.dateFormat = this.authService.loadFormat().dateFormat;
      this.selectedStore = this.authService.storeSelected();
      // this.loadItemList();
      this.loadStore();
      // debugger;
      this.route.params.subscribe(data => {
        this.mode = data['m'];
        this.invId = data['id'];
      })

      if (this.mode === 'e') {
        this.isNew = false;
        this.inventoryCountingService.getInventoryCounting(this.invId, this.selectedStore.storeId, this.selectedStore.companyCode).subscribe((response: any) => {
          this.inventory = response.data;
          debugger;
          // console.log(response);
          this.loadSlocStore(this.inventory.storeId);
          if (this.inventory.status === 'C') {
            this.isCounted = true;
          }
          else {
            this.docStatus.push({
              value: "O", name: "Open",
            })
          }
          // this.inventory.status = 'O'; 
          // this.isCounted=false;
          if (this.inventory.isCanceled === 'Y' && this.inventory.status === 'C') {
            this.inventory.status = 'N';
            this.isCounted = false;
          }
          setTimeout(() => {
            this.lines = response.data.lines;
            // console.log(this.lines);
          }, 50);


        });
      }
      else {
        this.inventory = new TInventoryCountingHeader();
        this.lines = [];
        this.serialLines = [];
        // console.log(this.goodreceipt);
        this.isNew = true;
        this.isCounted = false;
        // this.loadUom();
      }

    }

    // console.log(this.isCounted);
  }
  onStoreChanged(store) {
    // debugger;
    if (store !== null && store !== undefined) {
      this.selectedStore = store;
    }
    this.loadSlocStore(this.selectedStore.storeId);
  }
  @ViewChild('ddlStatus', { static: false }) ddlStatus;
  saveModel() {
    debugger;
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
          let DocTotal: number = 0;
          this.lines.forEach((item) => {
            if (item.lineTotal !== null && item.lineTotal !== undefined) DocTotal += parseFloat(item.lineTotal.toString());
  
          })
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
          this.inventory.docTotal = DocTotal;
          this.inventory.lines = this.lines;
          this.inventory.companyCode = this.selectedStore.companyCode;
  
          this.inventory.isCanceled = 'N';
          this.inventory.storeId = this.selectedStore.storeId;
          this.inventory.storeName = this.selectedStore.storeName;
  
          if (this.isNew === true) {
            this.inventory.status = 'O';
            this.inventory.createdBy = this.authService.decodeToken?.unique_name;
  
            this.inventoryCountingService.create(this.inventory).subscribe((response: any) => {
              if (response.success === true) {
                this.isSave = true;
                this.alertifyService.success("Create successfully completed. Trans Id: " + response.message);
                setTimeout(() => {
                  this.router.navigate(["admin/inventory/counting", 'e', response.message]).then(() => { window.location.reload(); });
                
                }, 50);
              }
              else {
                this.isSave = true;
                this.alertifyService.error(response.message);
              }
            });
          }
          else {
            if (this.ddlStatus.value === "N") {
              this.inventory.refId = this.inventory.icid;
              this.inventory.icid = "";
              this.inventory.isCanceled = 'Y';
              this.inventory.status = "C";
  
              this.inventory.createdBy = this.authService.getCurrentInfor().username;
              this.inventoryCountingService.create(this.inventory).subscribe((response: any) => {
                this.isSave = true;
                if (response.success === true) {
                  // this.isSave = true;
                  this.alertifyService.success("Create successfully completed. Trans Id: " + response.message);
                  // this.router.navigate['goodissue'];
                  debugger;
                  setTimeout(() => {
                    this.router.navigate(["admin/inventory/counting", 'e', response.message]).then(() => { window.location.reload(); });
                     
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
            else {
              debugger;
              // console.log(this.lines);
              this.inventory.modifiedBy = this.authService.decodeToken?.unique_name;
              this.inventory.status = this.ddlStatus.value;
              this.inventoryCountingService.update(this.inventory).subscribe((response: any) => {
                this.isSave = true;
                if (response.success === true) {
                  // this.isSave = true;
                  this.alertifyService.success("Update successfully completed.");
                  setTimeout(() => {
                    this.router.navigate(["admin/inventory/counting", 'e', this.invId]).then(() => { window.location.reload(); });
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
      });
    }
  }
  onRowPrepared(e) {
    // console.log('onRowPrepared');
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
    debugger;
    let row = e.data;
    // console.log(row);
    if (this.serialLines !== null && this.serialLines.length > 0) {
      row.lines = this.serialLines;

      let quantityLine = 0;
      if (row.lines !== null) {
        row.lines.forEach(line => {
          debugger
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
  modalRef: BsModalRef;

  // serialList: MItemSerial[];
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
      let slocId = cellInfo.data.slocId;

      let allowDecimal = false;
      if(this.authService.checkFormatNumber(1.5,"quantity",uom))
      {
        allowDecimal = true;
      }
      // let toSlocId= cellInfo.data.toSlocId;
      // let taxCode = cellInfo.data.taxCode;
      // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
      let item = this.lines.filter(x => x.itemCode === code && x.uomCode === uom && x.barCode === barcode && x.slocId === slocId);
      if (item !== null && item !== undefined && item.length > 0) {
        this.alertifyService.warning("item already exists in the list");
        this.dataGrid.instance.deleteRow(cellInfo.rowIndex);
      }
      else {
        if (isSerial === true || isVoucher === true) {
          if(this.checkInventorySerial === "true")
          {
            let line = new TInventoryCountingLine();
            line.lineId = (this.lines.length + 1).toString();
            line.keyId = selectedRowKeys[0];
            line.itemCode = code;
            line.description = name;
            line.slocId = slocId;

            line.uomCode = uom;
            line.barCode = barcode;
            line.price = price;
            line.quantity = 1;
            // line.openQty = quantity;
            let Itemcheck = event.selectedRowsData[0];
            Itemcheck.slocId = slocId;
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
                  let serialLine = new TInventoryCountingLineSerial();
                  serialLine.serialNum = serial.serialNum;
                  serialLine.itemCode = line.itemCode;
                  serialLine.uomCode = line.uomCode;
                  serialLine.description = line.description;
                  // serialLine.slocId = line.slocId;
                  serialLine.slocId = line.slocId;
                  // serialLine.toSlocId= line.toSlocId;
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
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'currencyCode', this.selectedStore.currencyCode);
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'uomCode', uom);
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'barCode', barcode);
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price', price);
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'quantity', '1');
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lineTotal', price);
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'allowDecimal', allowDecimal);
          }

          
        }
        else {
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'itemCode', code);
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'description', name);
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'currencyCode', this.selectedStore.currencyCode);
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'uomCode', uom);
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'barCode', barcode);
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price', price);
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'quantity', '1');
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lineTotal', price);
          this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'allowDecimal', allowDecimal);
        }
      }
      setTimeout(() => {
        this.dataGrid.instance.saveEditData(); 
      }, 100);
    
    }

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
  
  PrintDetail(data) {
    // console.log("data", data);
    this.router.navigate(["admin/inventorycouting/print", data.icid]).then(() => {
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
      debugger;
      const bstr: string = e.target.result;
      const dataHeader = <any[]>this.excelSrv.importFromFile(bstr, 0);
      const header: string[] = Object.getOwnPropertyNames(new TInventoryCountingTemplate());

      //  debugger;
      // console.log(data);
      const excelHeader = dataHeader[0];
      
      const importedDataHeader = dataHeader.slice(1);//.slice(1, -2); 
      const dataHeaderSeri = <any[]>this.excelSrv.importFromFile(bstr, 1);
      const headerSeri: string[] = Object.getOwnPropertyNames(new TInventoryCountingLineSerialTemPlate());
      const excelHeaderSeri = dataHeaderSeri[0];
      const importedDataHeaderSeri = dataHeaderSeri.slice(1);
      var stt = 0;
      debugger;
      this.importContent = importedDataHeader.map(arr => {
        const obj = {};
        stt++;
        for (let i = 0; i < excelHeader.length; i++) {
          for (let j = 0; j < header.length; j++) {
            const ki = this.capitalizeFirstLetter(excelHeader[i]);
            const kj = this.capitalizeFirstLetter(header[j]);
            // debugger;
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


        return <TInventoryCountingTemplate>obj;
      })
      var stt1 = 0;
      debugger;
      this.importContentSeri = importedDataHeaderSeri.map(arr => {
        const obj = {};
        stt1++;
        debugger;
        for (let i = 0; i < excelHeaderSeri.length; i++) {
          for (let j = 0; j < headerSeri.length; j++) {
            const ki = this.capitalizeFirstLetter(excelHeaderSeri[i]);
            const kj = this.capitalizeFirstLetter(headerSeri[j]);
            debugger;
            if (kj.toLowerCase() === 'stt1') {
              obj[headerSeri[j]] = stt1;
            }
            if (ki.toLowerCase() === kj.toLowerCase()) {
              if (headerSeri[j].toLowerCase() === 'barcode' || headerSeri[j].toLowerCase() === 'itemcode' || headerSeri[j].toLowerCase() === 'uomcode' ||
                headerSeri[j].toLowerCase() === 'slocid') {
                obj[headerSeri[j]] = arr[i] == undefined ? '' : arr[i].toString();
              }
              else {
                obj[headerSeri[j]] = arr[i];
              }
            }
          }
        }


        return <TInventoryCountingLineSerialTemPlate>obj;
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
      this.ListSerialError = [];
      this.importContent.forEach(item => {
        item.storeId = this.authService.storeSelected().storeId;
        item.companyCode = this.authService.storeSelected().companyCode;
        item.keyId = item.itemCode + item.uomCode + item.barCode;
        item.lineId = (this.lines.length + item.stt).toString();
        if (this.lines.filter(x => x.itemCode === item.itemCode && x.barCode === item.barCode &&
          x.slocId === item.slocId && x.uomCode === item.uomCode).length > 0) {
          let index = new ErrorList();
          index.itemCode = item.itemCode;
          index.stt = item.stt;
          this.ErrorRepair.push(index);
        }
        let listStt = this.importContent.filter(x => x.itemCode === item.itemCode && x.itemCode != ''
          && x.barCode === item.barCode && x.slocId === item.slocId && x.uomCode === item.uomCode &&
          x.stt !== item.stt);
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
        if (item.quantity == undefined || item.quantity == null || item.quantity < 0 ||(!this.authService.checkFormatNumber(item.quantity, 'quantity', item.uomCode))) {
          this.ListNullQuantity.push(item.stt);
        }
        // debugger;
        // let listItem = this.itemList.filter(x => x.itemCode == item.itemCode && x.barCode == item.barCode && x.uomCode == item.uomCode)
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
        //   let serial = this.importContentSeri.filter(x=>x.itemCode ==item.itemCode);
        //   if(serial.length >0)
        //   {
        //     if(listItem[0].isSerial==true)
        //     {
        //       item.lines = [];
        //     //   this.itemService.getSerialByItem( this.selectedStore.companyCode,item.itemCode,"",item.slocId).subscribe((response: any) => {
        //     //     debugger
        //     //     if(response.success)
        //     //     {
        //           serial.forEach(x=>{
        //             // let checkSerrial = response.data.filter(a=>a.serialNum == x.serialNum);
        //             // if(checkSerrial?.length >0)
        //             // {
        //               let serialLine = new TInventoryCountingLineSerial();
        //               serialLine.serialNum = x.serialNum;
        //               serialLine.itemCode = item.itemCode;
        //               serialLine.uomCode = item.uomCode;
        //               serialLine.description = item.description;
        //               // serialLine.slocId = line.slocId;
        //               serialLine.slocId = item.slocId;
        //               // serialLine.toSlocId= line.toSlocId;
        //               serialLine.quantity = 1;
        //               item.lines.push(serialLine);
        //             // }
        //             // else
        //             // {
        //             //   this.ListSerialError.push(x.stt1);
        //             // }
                  
        //           });
        //     //     }
        //     //     else
        //     //     {
        //     //       this.alertifyService.error(response.message);
        //     //       return;
        //     //     }
        //     //     // this.itemSerials = res.result;
        //     //     // this.pagination = res.pagination;
        //     // }, error => {
        //     //   this.alertifyService.error(error);
        //     //   return;
        //     // });
        //     }
        //     else{
        //       serial.forEach(x=>{
        //         this.ListSerialError.push(x.stt1);
        //       });
        //     }
        //   }
         
        
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
      //   this.ListNullQuantity.length == 0 && this.ListNotExitItem.length == 0 && this.ListSerialError.length ==0)
      //   {
      //     this.lines = this.lines.concat(this.importContent);
      //     // console.log(this.lines);
      //   }
        
      // // }
      // else {
      //   this.openModal(template);
      // }


      this.clearFileInput();
    };
  }
  downloadTemplate() {
    setTimeout(() => {
      this.commonService.download('T_InventoryCount.xlsx');
    }, 2);

    // this.dowloadLine();

  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  @ViewChild('myInput')
  myInputVariable: ElementRef;
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

    });
debugger
    this.importContentSeri.forEach(item => {
      item.listError = "";
      if (this.ListSerialError.filter(x => x === item.stt1).length > 0) {
        item.listError = item.listError + "Serial not Found; "
      }
      delete item.stt1;
    });
    // console.log(this.importContent);
    let day = new Date()
    let fileName = "InventoryCount" + day.toLocaleString();
    let fileWidth: any = [{ width: 15 }, { width: 10 }, { width: 20 }, { width: 15 }, { width: 15 }, { width: 200 }];
    this.excelSrv.exportExcel(this.importContent, fileName, fileWidth,this.importContentSeri);
  }
  checkitemimport(model: TInventoryCountingTemplate[],template){
    model.forEach(x=>{
      x.iscount = true;
    });
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
  CancelModel() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.inventory.refId = this.inventory.icid;
        this.inventory.icid = "";
        this.inventory.isCanceled = 'Y';
        this.inventory.status = "C";

        this.inventory.createdBy = this.authService.getCurrentInfor().username;
        this.inventoryCountingService.create(this.inventory).subscribe((response: any) => {
          if (response.success === true) {
            this.alertifyService.success("Create successfully completed. Trans Id: " + response.message);
            setTimeout(() => {
              this.router.navigate(["admin/inventory/counting", 'e', response.message]).then(() => { window.location.reload(); });
            }, 50);
          }
          else {
            this.alertifyService.error(response.message);
          }
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Save Error',
            text: error
          });
        });
      }
    })

  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
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


