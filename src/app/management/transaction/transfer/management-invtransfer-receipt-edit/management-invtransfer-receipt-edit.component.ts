import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ItemSerialComponent } from 'src/app/component/item-serial/item-serial.component';
import { TInventoryHeader, TInventoryLine, TInventoryLineSerial } from 'src/app/_models/inventory';
import { MStorage } from 'src/app/_models/storage';
import { MStore } from 'src/app/_models/store';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { StorageService } from 'src/app/_services/data/storage.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';
import { DatePipe } from '@angular/common'  // Import this
import { status } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { PrintService } from 'src/app/_services/data/print.service';
@Component({
  selector: 'app-management-invtransfer-receipt-edit',
  templateUrl: './management-invtransfer-receipt-edit.component.html',
  styleUrls: ['./management-invtransfer-receipt-edit.component.scss'],
  providers: [DatePipe] // Add this
})
export class ManagementInvtransferReceiptEditComponent implements OnInit {

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
  lguAdd: string = "Add";
  isLoading = false;
  nowDate: string;
  isSave = true;

  constructor(public authService: AuthService, private inventoryService: InventoryService, private storeService: StoreService, private datePipe: DatePipe,
    private shiftService: ShiftService, private itemService: ItemService, private modalService: BsModalService, private storageService: StorageService
    , private alertifyService: AlertifyService, private route: ActivatedRoute, private routeNav: Router, private printService: PrintService) {
    this.inventory = new TInventoryHeader();
    this.customizeText = this.customizeText.bind(this);
    this.customizeLineTotalText = this.customizeLineTotalText.bind(this);
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
  storeList: MStore[] = [];
  SlocFromList: MStorage[] = [];
  SlocToList: MStorage[] = [];
  itemList: ItemViewModel[] = [];
  docTypes: any = [
    { name: 'Shipment', value: 'S' },
    { name: 'Receipt', value: 'R' },

  ];
  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
      location: 'before',
      widget: 'dxButton',
      options: {
        width: 136,
        icon: "add", type: "success", text: this.lguAdd,
        onClick: this.saveModel.bind(this)
      }
    });
  }

  loadStore() {
    this.storeService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      if (response.success) {
        this.storeList = response.data;
        console.log(this.storeList);
      }
      else {
        this.alertifyService.warning(response.message);
      }

      // this.storeList = response;
    })
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
  modalRef: BsModalRef;
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  transferSelected(data) {
    this.modalRef.hide();
    this.inventoryService.getInventoryTransfer(data.invtid, this.store.storeId, this.store.companyCode).subscribe((response: any) => {
      setTimeout(() => {
        this.inventory = response.data;
        debugger;
        this.lines = response.data.lines;
        this.lines.forEach(line => {
          line.quantity = line.openQty;
        });
        this.inventory.refInvtid = this.inventory.invtid;
        this.loadSlocFromStore(this.inventory.fromStore);
        this.loadSlocToStore(this.inventory.toStore);
        console.log("response", response.data);
      }, 50);
    });
    console.log("data", data);
  }

  loadSlocFromStore(storeId) {
    let comp = this.store.companyCode;
    this.storageService.getByStore(storeId, comp).subscribe((response: any) => {
      if (response.success) {
        this.SlocFromList = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }
      // this.SlocFromList = response;
    })
  }
  loadSlocToStore(storeId) {
    let comp = this.store.companyCode;
    this.storageService.getByStore(storeId, comp).subscribe((response: any) => {
      if (response.success) {
        this.SlocToList = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }
      // this.SlocToList = response;
    })
  }
  inventoryWitouthBOM = "true";
  checkInventoryInShift = "false";
  editRecipt= "false";
  loadSetting() {
    
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
    let editRecipt = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'editRecipt');
    // debugger;
    if (editRecipt !== null && editRecipt !== undefined) {
      this.editRecipt = editRecipt.settingValue;
    }
  }

  loadItemList() {
    this.itemService.getItemViewList(this.store.companyCode, this.store.storeId, '', '', '', '', '', '').subscribe((response: any) => {
      if (response.success) {
        this.isLoading = true;
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
    });

  }
  docStatus: any[] = status.InventoryDocument;
  dateFormat = "";
  canEdit = false;
  canAdd = false;
  functionId = "Adm_InvTransferReceipt";
  ngOnInit() {
    // debugger;
    this.loadSetting();
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.routeNav.navigate(["/admin/permission-denied"]);
    }
    else {
      this.nowDate = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
      this.canAdd = this.authService.checkRole(this.functionId, '', 'I');
      this.canEdit = this.authService.checkRole(this.functionId, '', 'E');

      this.dateFormat = this.authService.loadFormat().dateFormat;
      this.store = this.authService.storeSelected();
      this.loadStore();
      // debugger;
      this.route.params.subscribe(data => {
        this.mode = data['m'];
        this.invId = data['id'];
      })

      if (this.mode === 'e') {
        this.isNew = false;
        this.inventoryService.getInventoryTransfer(this.invId, this.store.storeId, this.store.companyCode).subscribe((response: any) => {
          this.inventory = response.data;
          debugger;
          console.log(this.inventory);
          if (this.inventory.status === 'C' && this.inventory.isCanceled === 'Y') {
            this.inventory.status = 'N';
          }
          this.nowDate = this.datePipe.transform(this.inventory.docDate, 'MM/dd/yyyy');
          this.loadSlocFromStore(this.inventory.fromStore);
          this.loadSlocToStore(this.inventory.toStore);
          setTimeout(() => {
            this.lines = response.data.lines;
            // console.log(this.lines);
          }, 50);


        });
      }
      else {
        this.inventory = new TInventoryHeader();
        this.lines = [];
        this.serialLines = [];
        // console.log(this.goodreceipt);
        this.isNew = true;
        if(this.invId !='' && this.invId != undefined && this.invId!= null)
        {
          this.transferSelectedFromNotify(this.invId);
        }

        // this.loadUom();
      }

      // GetItemWithoutPriceList
    }

    

    // console.log("aaa", this.nowDate);
  }
  onFromStoreChanged(store) {
    // debugger;
    this.fromStore = store;
    this.loadSlocFromStore(this.fromStore.storeId);
  }
  onToStoreChanged(store) {
    this.toStore = store;
    this.loadSlocToStore(this.fromStore.storeId);
  }
  @ViewChild('ddlStatus', { static: false }) ddlStatus;

  checkLine() {
    this.lines = this.lines.filter(x => x.quantity > 0);
    let check = this.lines.filter(x => x.openQty <= 0 || x.quantity > x.openQty);
    if (check !== undefined && check !== null && check.length > 0) {
      this.alertifyService.warning("Please check open quantity");
      return false;
    }
    else {
      return true;
    }
  }

  saveModel() {
    debugger;
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
    
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          console.log("this", this.inventory);
          let quantity: number = 0;
          
          // this.inventory.lines = this.inventory.lines.filter(x=>x.quantity > 0);
          if (this.checkLine() === true) {
            // this.goodreceipt.totalReceipt= quantity;
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
            // let shift = this.shiftService.getCurrentShip();
            if (shift !== null && shift !== undefined) {
              this.inventory.shiftId = this.shiftService.getCurrentShip().shiftId;
            }
            this.inventory.lines = this.lines;
            this.inventory.companyCode = this.store.companyCode;
            this.inventory.refInvtid = this.inventory.invtid;
            this.inventory.docType = "R";
            this.inventory.isCanceled = 'N';
            this.inventory.fromStore = this.fromStore.storeId;
            this.inventory.transitWhs = this.fromStore.customField1;
            this.inventory.fromWhs = this.fromStore.whsCode;
            this.inventory.fromStoreName = this.fromStore.storeName;
            this.inventory.toStore = this.toStore.storeId;
            this.inventory.toStoreName = this.toStore.storeName;
            this.inventory.toWhs = this.toStore.whsCode;

            this.inventory.docDate = this.datePipe.transform(this.nowDate, 'yyyy-MM-dd');
            if (this.isNew === true) {
              this.lines.forEach((line) => {
                // line.openQty = line.openQty - line.quantity;
                line.baseTransId = this.inventory.refInvtid;
                line.baseLine = line.lineId;
              })

              this.inventory.createdBy = this.authService.decodeToken?.unique_name;
              this.inventory.status = 'C';
              console.log(this.inventory);
              this.inventoryService.create(this.inventory).subscribe((response: any) => {
                this.isSave = true;
                if (response.success === true) {
                
                  this.alertifyService.success("Create successfully completed. Trans Id: " + response.message);
                  this.routeNav.navigate(["admin/inventory/transfer-receipt"]);
                  // window.location.reload();
                  // this.router.navigate['goodreceipt'];
                }
                else {
                  this.inventory.status = '';
                  this.alertifyService.error(response.message);
                }
              }, error => {
                this.isSave = true;
                this.inventory.status = '';
                Swal.fire({
                  icon: 'error',
                  title: 'Save Error',
                  text: error
                });
              });
            }
            else {
              debugger;
              console.log(this.lines);
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
                    // this.routeNav.navigate(["admin/inventory/transfer", 'e', response.message]);
                    this.routeNav.navigate(["admin/inventory/transfer-receipt", 'e', response.message]).then(() => { window.location.reload(); });
                  }
                  else {
                    // this.isSave = true;
                    this.inventory.status = '';
                    this.alertifyService.error(response.message);
                    // this.routeNav.navigate(["admin/inventory/transfer-receipt", 'e',  this.inventory.refId]);
                  }
                }, error => {
                  this.inventory.status = '';
                  this.isSave = true;
                  Swal.fire({
                    icon: 'error',
                    title: 'Save Error',
                    text: error
                  });
                });
              }
              else {
                this.inventory.status = this.ddlStatus.value;
                this.inventory.modifiedBy = this.authService.decodeToken?.unique_name;
                this.inventory.lines = this.lines;
                this.inventoryService.update(this.inventory).subscribe((response: any) => {
                  this.isSave = true;
                  if (response.success === true) {
                    this.alertifyService.success("Update successfully completed.");
                  }
                  else {
                    // this.isSave = true;
                    this.inventory.status = '';
                    this.alertifyService.error(response.message);
                  }
                }, error => {
                  this.isSave = true;
                  this.inventory.status = '';
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
      });
    }
  }
  onRowPrepared(e) {
    if (e.data !== null && e.data !== undefined) {

      if (e.data.keyId !== null && e.data.keyId !== undefined && e.data.lineId !== null && e.data.lineId !== undefined) {
        if (e.rowType === "data" && (e.data.lines === null || e.data.lines === undefined || e.data.lines.length === 0 || e.data.lines === 'undefined')) {
          debugger;
          e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");
          e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");

        }
      }

    }
    // if (e.rowType == "data" && (e.data.lines===null || e.data.lines===undefined || e.data.lines.length===0 || e.data.lines==='undefined'))  {  

    //   e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");  
    //   e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");  

    // }  
  }
  onRowInserted(e) {

    let row = e.data;

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


  }
  @ViewChild('dataGrid', { static: false }) dataGrid;

  // serialList: MItemSerial[];

  PrintDetail(data) {
    this.routeNav.navigate(["admin/invstransfer/receipt/print", data.invtid]).then(() => {
      // window.location.reload();
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
        if (this.inventory.docType === null || this.inventory.docType === undefined || this.inventory.docType === "undefined") {
          this.inventory.docType = "R";
        }
        debugger;
        let shift = this.shiftService.getCurrentShip();
        if (shift !== null && shift !== undefined) {
          this.inventory.shiftId = this.shiftService.getCurrentShip().shiftId;
        }
        debugger;
        this.inventory.lines = this.lines;
        this.inventory.companyCode = this.store.companyCode;
        this.inventory.docType = "R";
        this.inventory.fromStore = this.fromStore.storeId;
        this.inventory.fromStoreName = this.fromStore.storeName;
        this.inventory.toStore = this.toStore.storeId;
        this.inventory.toStoreName = this.toStore.storeName;
        this.inventory.refId = this.inventory.invtid;
        this.inventory.invtid = "";
        this.inventory.isCanceled = 'Y';
        this.inventory.status = "C";
        this.inventory.createdBy = this.authService.getCurrentInfor().username;
        this.inventoryService.create(this.inventory).subscribe((response: any) => {
          if (response.success === true) {
            this.alertifyService.success("Create successfully completed. Trans Id: " + response.message);
            this.routeNav.navigate(["admin/inventory/transfer-shipment", 'e', response.message]);
          }
          else {
            this.alertifyService.error(response.message);
          }
        });

      }
    })

  }
  transferSelectedFromNotify(invtid) {
    // this.modalRef.hide();
    this.inventoryService.getInventoryTransfer(invtid, this.store.storeId, this.store.companyCode).subscribe((response: any) => {
      setTimeout(() => {
        this.inventory = response.data;
        debugger;
        this.lines = response.data.lines;
        this.lines.forEach(line => {
          line.quantity = line.openQty;
        });
        this.inventory.refInvtid = this.inventory.invtid;
        this.loadSlocFromStore(this.inventory.fromStore);
        this.loadSlocToStore(this.inventory.toStore);
        console.log("response", response.data);
      }, 50);
    });
  }
  valiNumber(e)
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
  validateNumber(e) {
    debugger;
    let quantity = e.data.openQty;
    let vl = e.value;
    return quantity >= vl;
  }
}
