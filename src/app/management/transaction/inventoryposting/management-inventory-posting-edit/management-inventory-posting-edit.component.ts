import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ItemSerialComponent } from 'src/app/component/item-serial/item-serial.component';
import { TInventoryCountingHeader, TInventoryCountingLine, TInventoryCountingLineSerial } from 'src/app/_models/inventorycounting';
import { TInventoryPostingHeader, TInventoryPostingLine, TInventoryPostingLineSerial } from 'src/app/_models/inventoryposting';
import { MStorage } from 'src/app/_models/storage';
import { MStore } from 'src/app/_models/store';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { StorageService } from 'src/app/_services/data/storage.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { WarehouseService } from 'src/app/_services/data/warehouse.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventorycoutingService } from 'src/app/_services/transaction/inventorycouting.service';
import { InventorypostingService } from 'src/app/_services/transaction/inventoryposting.service';
import { status } from 'src/environments/environment';
import Swal from 'sweetalert2';
import saveAs from 'file-saver';
@Component({
  selector: 'app-management-inventory-posting-edit',
  templateUrl: './management-inventory-posting-edit.component.html',
  styleUrls: ['./management-inventory-posting-edit.component.scss']
})
export class ManagementInventoryPostingEditComponent implements OnInit {


  inventory: TInventoryPostingHeader;
  lines: TInventoryPostingLine[] = [];
  serialLines: TInventoryPostingLineSerial[] = [];
  invId = '';
  mode = '';
  isNew = false;
  isEditGrid = false;
  storeSelected: MStore;
  functionId = "Adm_InvPosting";
  arrWhsFrm = [];
  configStorage: boolean = true;

  docStatus: any[] = status.InventoryDocument;
  isSave = true;
  onExporting(e) {
    const workbook = new Workbook();    
    const worksheet = workbook.addWorksheet('Main sheet');
    let nameOfRpt= 'InventoryPosting' ;
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
  constructor(private authService: AuthService, private inventoryCountingService: InventorycoutingService, private inventorypostingService: InventorypostingService,
    private storeService: StoreService, private router: Router,
    private itemService: ItemService, private modalService: BsModalService, private storageService: StorageService, private alertifyService: AlertifyService,
    private route: ActivatedRoute, private printService: PrintService, private whsService: WarehouseService) {

    this.customizeText = this.customizeText.bind(this);
  }
  storeList: MStore[] = [];
  SlocList: MStorage[] = [];
  itemList: ItemViewModel[] = [];
  customizeText(e) {
    debugger;
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  loadStore() {
    this.storeService.getAllByWhsType(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      if (response.success) {
        const arrByWhs = response.data.filter(s => (s.mappingType === "Main" || s.mappingType === "Order"));
        this.storeList = arrByWhs;
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
  }

  loadSlocStore(storeId) {
    console.log()
    let comp = this.storeSelected.companyCode;
    this.storageService.getByStore(storeId, comp).subscribe((response: any) => {
      if (response.success) {
        console.log("response.data", response.data);
        this.SlocList = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }
      // this.SlocList = response;
      console.log(this.SlocList);
    })

    // if (this.configStorage) {
    //   this.GetDataWhsType(this.storeSelected.companyCode, this.storeSelected.storeId);
    // } else {
    //   let comp = this.storeSelected.companyCode;
    //   this.storageService.getByStore(storeId, comp).subscribe((response: any) => {
    //     if (response.success) {
    //       this.SlocList = response.data;
    //     }
    //     else {
    //       this.alertifyService.warning(response.message);
    //     }
    //     // this.SlocList = response;
    //     console.log(this.SlocList);
    //   })
    // }

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
          console.log("this.SlocList posting", this.SlocList);
        }
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
  }

  onRowPrepared(e) {
    // console.log('onRowPrepared');
    debugger;
    if (e.rowType == "data" && (e.data.lines === null || e.data.lines === undefined || e.data.lines.length === 0 || e.data.lines === 'undefined')) {
      debugger;
      e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");
      e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");

    }
  }

  loadItemList() {
    this.itemService.GetItemWithoutPriceList(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', '', '', '').subscribe((response: any) => {
      this.itemList = response.data;
      // debugger;
    });

  }
  @ViewChild('ddlStatus', { static: false }) ddlStatus;
  isCounted = false;
  dateFormat = "";
  canEdit = false;
  canAdd = false;
  ngOnInit() {
    // debugger;
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.canAdd = this.authService.checkRole(this.functionId, '', 'I');
    this.canEdit = this.authService.checkRole(this.functionId, '', 'E');
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.storeSelected = this.authService.storeSelected();
    // this.loadItemList();
    this.loadStore();
    debugger;
    this.route.params.subscribe(data => {
      this.mode = data['m'];
      this.invId = data['id'];
    })

    if (this.mode === 'e') {
      this.isNew = false;
      this.inventorypostingService.getInventoryPosting(this.storeSelected.companyCode, this.storeSelected.storeId, this.invId).subscribe((response: any) => {
        this.inventory = response.data;
        debugger;
        this.loadSlocStore(this.inventory.storeId);
        // if(this.inventory.status==='C')
        // {
        //   this.isCounted=true;
        // }
        if (this.inventory.isCanceled === 'Y' && this.inventory.status === 'C') {
          this.inventory.status = 'N';
        }
        setTimeout(() => {
          this.lines = response.data.lines;
          console.log(this.lines);
        }, 50);


      });
    }
    else {
      this.inventory = new TInventoryPostingHeader();
      this.lines = [];
      this.serialLines = [];
      // console.log(this.goodreceipt);
      this.isNew = true;

      // this.loadUom();
    }

    console.log(this.isNew);
  }
  onStoreChanged(store) {
    // debugger;
    this.storeSelected = store;
    console.log("on store", store);
    this.modalRef.hide();
    // this.loadSlocStore(this.storeSelected.storeId);
  }
  modalRef: BsModalRef;
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  countedSelected(data: TInventoryCountingHeader) {
    this.inventoryCountingService.getInventoryCounting(data.icid, data.storeId, data.companyCode).subscribe((response: any) => {
      this.inventory = response.data;
      this.inventory.refId = data.icid;

      console.log("count select", this.inventory);
      response.data.lines.forEach(line => {
        debugger;
        line.quantity = line.totalDifferent;
        //  let linePosting = new TInventoryPostingLine();
        //  linePosting.
        // this.lines.push();
      });
      console.log("response.data.lines", response.data.lines);
      this.lines = response.data.lines;
      this.modalRef.hide();
    });
  }
  saveModel() {

    // if(this.isEditGrid===true)
    // {
    //   this.alertifyService.error("please complete edit data");
    // }
    // else
    // {
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
        debugger;
        this.isSave = false;
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
        this.inventory.companyCode = this.storeSelected.companyCode;

        this.inventory.isCanceled = 'N';
        this.inventory.storeId = this.storeSelected.storeId;
        this.inventory.storeName = this.storeSelected.storeName;
        // this.inventory.status = this.ddlStatus.value;
        if (this.isNew === true) {
          this.inventory.status = 'C';
          this.inventory.createdBy = this.authService.decodeToken?.unique_name;
          this.inventorypostingService.create(this.inventory).subscribe((response: any) => {
            this.isSave = true;
            if (response.success === true) {
              this.alertifyService.success("Create successfully completed. Trans Id: " + response.message);

              // this.router.navigate['goodreceipt'];
              setTimeout(() => {
                this.router.navigate(["admin/inventory/posting", 'e', response.message]).then(() => {
                  window.location.reload();
                });
               
              }, 50);
            }
            else {
              // this.isSave = true;
              this.alertifyService.error(response.message);
            }
          });
        }
        else {
          debugger;
          if (this.ddlStatus.value === "N") {
            this.inventory.refId = this.inventory.ipid;
            this.inventory.ipid = "";
            this.inventory.isCanceled = 'Y';
            this.inventory.status = "C";

            this.inventory.createdBy = this.authService.getCurrentInfor().username;
            this.inventorypostingService.create(this.inventory).subscribe((response: any) => {
              this.isSave = true;
              if (response.success === true) {
                // this.isSave = true;
                this.alertifyService.success("Create successfully completed. Trans Id: " + response.message);
                // this.router.navigate['goodissue'];

                setTimeout(() => {
                  this.router.navigate(["admin/inventory/posting", 'e', response.message]).then(() => {
                    window.location.reload();
                  });
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

            this.inventory.modifiedBy = this.authService.decodeToken?.unique_name;
            this.inventory.status = this.ddlStatus.value;
            this.inventorypostingService.update(this.inventory).subscribe((response: any) => {
              this.isSave = true;
              if (response.success === true) {
                // this.isSave = true;
                this.alertifyService.success("Update successfully completed.");
                setTimeout(() => {
                  this.router.navigate(["admin/inventory/posting", 'e', this.invId]).then(() => {
                    window.location.reload();
                  });
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
    // }



  }

  onRowInserted(e) {
    debugger;
    let row = e.data;
    console.log(row);
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
      // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'itemCode', code);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'description', name);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'currencyCode', this.storeSelected.currencyCode);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'uomCode', uom);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'barCode', barcode);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price', price);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'quantity', '1');
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lineTotal', price);

      if (isSerial === true) {
        const initialState = {
          itemCode: code, title: 'Item Serial',
        };
        this.modalRef = this.modalService.show(ItemSerialComponent, { initialState });
        this.modalRef.content.onClose.subscribe(result => {
          console.log('rowIndex', cellInfo.rowIndex);
          console.log(this.dataGrid.instance);
          if (result !== null && result != undefined) {
            result.forEach(item => {
              let lineSerial = new TInventoryPostingLineSerial();
              lineSerial.itemCode = code;
              lineSerial.serialNum = item.serialNum;
              lineSerial.quantity = 1;
              lineSerial.uomCode = uom;
              lineSerial.slocId = '';
              lineSerial.totalStock = 0;
              lineSerial.totalCount = 0;
              lineSerial.totalDifferent = 0;

              debugger;
              // let itemAddIndex = this.lines.findIndex(x=>x.itemCode===code&&x.uomCode===uom);
              // let row =this.dataGrid.instance.totalCount();
              // if(itemAddIndex===-1)
              // {
              //   itemAddIndex = row;
              // }
              this.serialLines.push(lineSerial);
              // itemAdd.lines.push(lineSerial);
              // this.lines[cellInfo.rowIndex].lines.push(lineSerial);
            });
          }

        })
      }
    }

  }

  PrintDetail(data) {
    this.router.navigate(["admin/inventoryposting/print", data.ipid]).then(() => {
      // window.location.reload();
    });
  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
}


