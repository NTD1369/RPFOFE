import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ManagementItemSerialComponent } from 'src/app/management/shared/management-item-serial/management-item-serial.component';
import { TInventoryLineTemplate } from 'src/app/_models/inventory';
import { ErrorList } from 'src/app/_models/inventorycounting';
import { TInventoryTransferHeader, TInventoryTransferLine, TInventoryTransferLineSerial, TInventoryTransferLineTemplate } from 'src/app/_models/inventorytransfer';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { MStorage } from 'src/app/_models/storage';
import { MStore } from 'src/app/_models/store';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { StorageService } from 'src/app/_services/data/storage.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { WarehouseService } from 'src/app/_services/data/warehouse.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventoryTransferService } from 'src/app/_services/transaction/inventorytransfer.service';
import { status } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-management-inventory-transfer-edit',
  templateUrl: './management-inventory-transfer-edit.component.html',
  styleUrls: ['./management-inventory-transfer-edit.component.scss']
})
export class ManagementInventoryTransferEditComponent implements OnInit {

  dateFormat = "";
  canEdit = false;
  canAdd = false;
  invId = '';
  mode = '';
  isNew = false;
  isEditGrid = false;

  editorOptions: any;

  storeList: MStore[] = [];
  storageList: MStorage[] = [];
  toStoreList: MStore[] = [];
  SlocFromList: MStorage[] = [];
  SlocToList: MStorage[] = [];
  itemList: ItemViewModel[] = [];
  docTypes: any = [
    { name: 'Shipment', value: 'S' },
    { name: 'Receipt', value: 'R' },

  ];

  inventory: TInventoryTransferHeader;
  lines: TInventoryTransferLine[] = [];
  serialLines: TInventoryTransferLineSerial[] = [];

  store: MStore;
  storeId: MStore;
  fromSloc: MStorage;
  toSloc: MStorage;
  functionId = "Adm_InventoryTransfer";
  docStatus: any[] = status.InventoryDocumentAdvance;
  importContent: TInventoryTransferLineTemplate[]=[];
  ErrorRepair:ErrorList[]=[];
  Erroreexcel:ErrorList[]=[];
  ListNotExitItem:ErrorList[] =[];
  ListNullItem =[];
  ListNullBarcode =[];
  ListNullUom =[];
  ListFrSlocidNull :ErrorList[]=[];
  ListNullQuantity =[];
  ListToSlocIdNull :ErrorList[]=[];
  async onCollectionGetSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
    cellInfo.setValue(selectedRowKeys[0]);
    if (selectedRowKeys.length > 0) {
      dropDownBoxComponent.close();
      let code = cellInfo.data.itemCode;
      let uom = cellInfo.data.uomCode;
      let barcode = cellInfo.data.barCode;

      await this.loadItemStock(selectedRowKeys[0], code, uom, barcode, cellInfo.rowIndex);
    }

  }

  async loadItemStock(sloc, itemcode, uomCode, Barcode, rowIndex) {
    let quantity = 0;
    this.itemService.getItemStock(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, sloc,
      itemcode, uomCode, Barcode, '').subscribe((response: any) => {
        let quantity = 0;
        if (response.data !== null && response.data !== undefined && response.data.length > 0) {
          quantity = response.data[0].quantity;
        }
        quantity = quantity;
      })
    return quantity;
  }

  constructor(public authService: AuthService, private inventoryService: InventoryTransferService, private whsService: WarehouseService, private storeService: StoreService, private routeNav: Router,
    private shiftService: ShiftService, private itemService: ItemService, private excelSrv: ExcelService,public commonService: CommonService,
    private modalService: BsModalService, private storageService: StorageService, private alertifyService: AlertifyService, private route: ActivatedRoute,
    private router: Router) {
    this.inventory = new TInventoryTransferHeader();

    this.PriceCellValue = this.PriceCellValue.bind(this);
    this.customizeText = this.customizeText.bind(this);
    this.customizeLineTotalText = this.customizeLineTotalText.bind(this);
    this.store = this.authService.storeSelected();
    this.loadItemList();
    this.loadStore();
  }


  SumLineTotalCellValue(rowData) {
    debugger;
    return "X";
  }


  onInitNewRow(e) {
    e.data.taxCode = 'S0';
    e.data.frSlocId = this.slocFromDefault;
    e.data.toSlocId = this.slocToDefault;
  }
  lineTotalCellValue(rowData) {
    if (rowData.quantity !== null && rowData.quantity !== undefined && rowData.price !== null && rowData.quantity !== undefined) {
      let value = rowData.quantity * rowData.price;
      return value;
    }
    return 0;
  }
  loadStore() {
    this.storeService.getByUser(this.authService.getCurrentInfor().username).subscribe((response: any) => {
      if (response.success) {
        this.storeList = response.data;
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
      }
      else {
        this.alertifyService.warning(response.message);
      }

    })
  }

  // modalRef: BsModalRef;
  // openModal(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template);
  // }
  transferSelected(data) {
    this.modalRef.hide();
    this.inventoryService.getInventoryTransfer(data.invtid, this.store.storeId, this.store.companyCode).subscribe((response: any) => {
      setTimeout(() => {
        this.lines = response.data.lines;
      }, 50);
    });
    console.log(data);
  }

  slocFromDefault = "";
  slocToDefault = "";
  loadSlocFromStore(store) {
    let comp = this.store.companyCode;
    this.storageService.getByStore(store.storeId, comp).subscribe((response: any) => {
      if (response.data.length > 0) {
        const arrByWhs = response.data.filter(s => (s.mappingType === "Main" || s.mappingType === "Order"));

        this.SlocFromList = arrByWhs;
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
  }
  loadSlocToStore(store) {
    let comp = this.store.companyCode;
    this.storageService.getByStore(store.storeId, comp).subscribe((response: any) => {
      if (response.data.length > 0) {
        const arrByWhs = response.data.filter(s => (s.mappingType === "Main"));

        this.SlocToList = arrByWhs;
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
  }

  loadItemList() {
    this.itemService.GetItemWithoutPriceList(this.store.companyCode, this.store.storeId, '', '', '', '', '', '').subscribe((response: any) => {
      this.itemList = response.data.filter(x => x.isBom !== true && x.customField4 === 'I');
    });
  }

  PriceCellValue(rowData) {
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
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);
    }
    return 0;
  };

  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.routeNav.navigate(["/admin/permission-denied"]);
    }

    this.canAdd = this.authService.checkRole(this.functionId, '', 'I');
    this.canEdit = this.authService.checkRole(this.functionId, '', 'E');
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.route.params.subscribe(data => {
      this.mode = data['m'];
      this.invId = data['id'];
    })
    this.loadToStore();
    if (this.mode === 'e') {
      this.isNew = false;
      this.inventoryService.getInventoryTransfer(this.invId, this.store.storeId, this.store.companyCode).subscribe((response: any) => {
        this.inventory = response.data;
        console.log(this.inventory);
        if (this.storageList !== null && this.storageList !== undefined) {
          this.fromSloc = this.storageList.find(x => x.whsCode === this.inventory.fromSloc);
          this.toSloc = this.storageList.find(x => x.whsCode === this.inventory.toSloc);
        }

        this.loadSlocFromStore(this.inventory.fromSloc);
        this.loadSlocToStore(this.inventory.toSloc);
        setTimeout(() => {
          this.lines = response.data.lines;
        }, 50);
      });
    }
    else {
      this.inventory = new TInventoryTransferHeader();
      this.inventory.status = 'C';
      this.lines = [];
      this.serialLines = [];
      this.isNew = true;
      this.inventory.storeId = this.authService.storeSelected().storeId;
      this.onFromStoreChanged(this.authService.storeSelected());

    }

  }
  onFromStoreChanged(store: MStore) {
    if (store !== null && store !== undefined) {
      this.loadSlocFromStore(store);
      this.loadSlocToStore(store);
      this.whsService.getItem(this.authService.getCurrentInfor().companyCode, this.store.whsCode).subscribe((response: any) => {
        if (response.success) {
          console.log("response.data", response.data);
          // this.slocFromDefault = response.data.defaultSlocId;
          this.inventory.transitWhs = store.customField1;
          this.inventory.fromWhs = store.whsCode;
        }
        else {
          this.alertifyService.error(response.message);
        }

      });
    }
  }

  onFromSlocChanged(fromSloc) {
    this.fromSloc = fromSloc;
    // if (fromSloc != null) {
    //   this.slocFromDefault = fromSloc.slocId;
    // }
  }

  onToSlocChanged(toSloc) {
    this.toSloc = toSloc;
    // if (toSloc != null) {
    //   this.slocToDefault = toSloc.slocId
    // }
    // console.log("toSloc", toSloc);
  }

  @ViewChild('ddlStatus', { static: false }) ddlStatus;
  saveModel() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        console.log("this.inventory", this.inventory);
        if (this.inventory.docType === null || this.inventory.docType === undefined || this.inventory.docType === "undefined") {
          this.inventory.docType = "S";
        }
        let quantity: number = 0;

        let shift = this.shiftService.getCurrentShip();
        if (shift !== null && shift !== undefined) {
          this.inventory.shiftId = this.shiftService.getCurrentShip().shiftId;
        }
        console.log("this.lines", this.lines);
        this.inventory.lines = this.lines;
        this.inventory.companyCode = this.store.companyCode;
        this.inventory.isCanceled = 'N';
        this.inventory.docType = "S";
        this.inventory.storeName = this.store.storeName;
        this.inventory.fromSloc = this.fromSloc.slocId;
        this.inventory.fromSlocName = this.fromSloc.slocName;
        this.inventory.toSloc = this.toSloc.slocId;
        this.inventory.toSlocName = this.toSloc.slocName;
        let msg = "";
        this.inventory.lines = this.inventory.lines.filter(x => x.quantity > 0);
        this.inventory.lines.forEach(line => {
          if (line.openQty === null || line.openQty === undefined || line.openQty < line.quantity) {
            msg += "Item: " + line.itemCode + ' - ' + line.uomCode + ", ";
          }
        });
        if (msg.length > 0) {
          let mes = "Please check onhand " + msg;
          this.alertifyService.warning(mes);
        }
        else {
          console.log("is nêw", this.isNew);
          if (this.isNew === true) {
            this.lines.forEach((line) => {
              line.openQty = line.quantity;
            })
            this.inventory.status = 'C';
            this.inventory.createdBy = this.authService.decodeToken?.unique_name;

            this.inventoryService.create(this.inventory).subscribe((response: any) => {
              if (response.success === true) {
                this.alertifyService.success("Create successfully completed. Trans Id: " + response.message);

                setTimeout(() => {
                  this.routeNav.navigate(["admin/inventory/inventorytransfer", 'e', response.message]);
                }, 50);
              }
              else {
                this.alertifyService.error(response.message);
              }
            });
          }
          else {
            this.inventory.modifiedBy = this.authService.decodeToken?.unique_name;
            this.inventory.status = this.ddlStatus.value;
            this.inventoryService.update(this.inventory).subscribe((response: any) => {
              if (response.success === true) {
                this.alertifyService.success("Update successfully completed.");
                setTimeout(() => {
                  this.routeNav.navigate(["admin/inventory/inventorytransfer", 'e', response.message]);
                }, 50);
              }
              else {
                this.alertifyService.error(response.message);
              }
            });
          }
        }

      }
    })
  }

  getDateFormat(date) {
    debugger;
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    var a = date.toLocalTime();
    var time = date.toISOString().split("T")[1];
    return date.getFullYear() + '-' + month + '-' + (day) + time;
  }
  onRowPrepared(e) {
    if (e.data !== null && e.data !== undefined) {
      if (e.data.keyId !== null && e.data.keyId !== undefined && e.data.lineId !== null && e.data.lineId !== undefined) {
        if (e.rowType === "data" && (e.data.lines === null || e.data.lines === undefined || e.data.lines.length === 0 || e.data.lines === 'undefined')) {
          e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");
          e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");
        }
      }
    }
  }

  onRowInserted(e) {
    let row = e.data;
    if (this.serialLines !== null && this.serialLines.length > 0) {
      row.lines = this.serialLines;
      let quantityLine = 0;
      if (row.lines !== null) {
        row.lines.forEach(line => {
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

  async onItemSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
    console.log(cellInfo);
    cellInfo.setValue(selectedRowKeys[0]);
    if (selectedRowKeys.length > 0) {
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

      let fromSloc = cellInfo?.data?.frSlocId;
      let quantity = 0;
      debugger;
      if (fromSloc !== null && fromSloc !== undefined) {
        this.itemService.getItemStock(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, fromSloc,
          code, uom, barcode, '').subscribe((response: any) => {
            // let quantity = 0;
            if (response.data !== null && response.data !== undefined && response.data.length > 0) {
              quantity = response.data[0].quantity;
            }
            quantity = quantity;
          })
        }
            if (isSerial === true || isVoucher === true) {
              let line = new TInventoryTransferLine();

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
                console.log('itemSerial', response) // here you will get the value
                // let rounded = Math.round(payment.value * 100.0 / 5.0) * 5.0 / 100.0;  
                // payment.afterExchange = rounded * payment.rate;
                if (response !== null && response !== undefined && response.length > 0) {
                  line.lines = [];
                  response.forEach(serial => {
                    let serialLine = new TInventoryTransferLineSerial();
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
            else {
              // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'itemCode', code);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'description', name);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'currencyCode', this.store.currencyCode);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'uomCode', uom);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'barCode', barcode);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price', price);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'quantity', '1');
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lineTotal', price);
              this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'openQty', quantity);

            }
    }

  }

  PrintDetail(data) {
    this.router.navigate(["admin/print/transfer-shipment", data.invtTransid]).then(() => {
    });
  }
  onFileChange(evt: any,template) {
    //  debugger;
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      // debugger;
      const bstr: string = e.target.result;
      const dataHeader = <any[]>this.excelSrv.importFromFile(bstr, 0);
      
      const header: string[] = Object.getOwnPropertyNames(new TInventoryTransferLineTemplate());
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
          for(let j = 0; j < header.length; j++)
          {
            const ki = this.capitalizeFirstLetter(excelHeader[i]);
            const kj = this.capitalizeFirstLetter(header[j]); 
            //  debugger;
            if(kj.toLowerCase()==='stt')
            {
              obj[header[j]] =stt;
            }
             if(ki.toLowerCase() ===kj.toLowerCase())
             {
               if(header[j].toLowerCase()==='barcode' || header[j].toLowerCase()==='itemcode' || header[j].toLowerCase()==='uomcode' || 
               header[j].toLowerCase()==='frslocid'|| header[j].toLowerCase()==='toslocid')
               {
                obj[header[j]] = arr[i]==undefined?'':arr[i].toString();
               }
               else
               {
                obj[header[j]] = arr[i];
               }
             }
          } 
        }
       

        return  <TInventoryTransferLineTemplate>obj;
      })
      //Check Error:
      this.ErrorRepair =[];
      this.Erroreexcel =[];
      this.ListNotExitItem =[];
      this.ListNullItem = [];
      this.ListNullBarcode =[];
      this.ListNullUom =[];
      this.ListFrSlocidNull =[];
      this.ListNullQuantity =[];
      this.ListToSlocIdNull = [];
      this.importContent.forEach(item => {
          item.keyId = item.itemCode +item.uomCode +item.barCode;
          item.lineId = (this.lines.length +item.stt).toString();
          if(this.lines.filter(x=> x.itemCode === item.itemCode).length>0)
          {
            let index = new ErrorList();
            index.itemCode = item.itemCode;
            index.stt = item.stt;
            this.ErrorRepair.push(index);
          }
          let listStt =this.importContent.filter(x=> x.itemCode === item.itemCode && x.itemCode!=''  && x.stt !==item.stt);
          if(listStt.length>0 && this.Erroreexcel.filter(x=>x.itemCode ===item.itemCode).length ==0 )
          {
            let index = new ErrorList();
            index.itemCode = item.itemCode;
            index.stt = item.stt;
            index.listStt.push(item.stt);
            listStt.forEach(e => {
              index.listStt.push(e.stt);
            });
            this.Erroreexcel.push(index);
          }
          let listfrsloc =this.SlocFromList.filter(x=> x.slocId === item.frSlocId);
          if(listfrsloc.length==0)
          {
            let index = new ErrorList();
            index.itemCode = item.frSlocId;
            index.stt = item.stt;
            this.ListFrSlocidNull.push(index);
          }
          let listtax =this.SlocToList.filter(x=> x.slocId === item.toSlocId);
          if(listtax.length==0)
          {
            let index = new ErrorList();
            index.itemCode = item.toSlocId;
            index.stt = item.stt;
            this.ListToSlocIdNull.push(index);
          }
          if(item.itemCode =='' || item.itemCode ==null)
          {
            this.ListNullItem.push(item.stt);
          }
          if(item.barCode ==''|| item.barCode ==null)
          {
            this.ListNullBarcode.push(item.stt);
          }
          if( item.uomCode==''|| item.uomCode ==null)
          {
            this.ListNullUom.push(item.stt);;
          }
          if(item.quantity ==undefined|| item.quantity ==null)
          {
            this.ListNullQuantity.push(item.stt);
          }
           let listItem =this.itemList.filter(x=>x.itemCode ==item.itemCode && x.barCode == item.barCode &&
            x.uomCode == item.uomCode)
          if(listItem.length==0)
          {
            if(item.itemCode !='' && item.barCode !='' && item.uomCode !='')
            {
              let index = new ErrorList();
              index.type = 'I';
              index.stt = item.stt;
              index.itemCode = "ItemCode: " +item.itemCode +" Barcode: "+ item.barCode+" UomCode: " +item.uomCode;
                this.ListNotExitItem.push(index);
            }
          }
          else
          {
            item.description = listItem[0].itemName;
            item.price = listItem[0].defaultPrice;
            item.lineTotal = item.price * item.quantity;
            let amount = item.quantity * item.price;
            this.itemService.getItemStock(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, item.frSlocId, 
            item.itemCode, item.uomCode, item.barCode, '').subscribe((response: any)=>{
                    let quantity = 0;
                    debugger;
                    if(response.data!==null && response.data!==undefined && response.data.length > 0)
                    {
                      quantity = response.data[0].quantity; 
                    }
                    item.openQty= quantity;
          });
        }
      });
      console.log(this.importContent);
      // console.log(this.ErrorRepair);
      // console.log(this.Erroreexcel);
      // console.log(this.ListNullItem);
      // console.log(this.ListNotExitItem);
      if(this.ErrorRepair.length ==0 && this.Erroreexcel.length == 0 && this.ListNullItem.length == 0 && 
        this.ListNullBarcode.length == 0 &&  this.ListNullUom.length == 0 &&  this.ListFrSlocidNull.length == 0 && 
        this.ListNullQuantity.length == 0 && this.ListNotExitItem.length == 0 && this.ListToSlocIdNull.length ==0)
      this.lines = this.lines.concat(this.importContent);
      else
      {
        this.openModal(template);
      }
      
       
     this.clearFileInput();
  };
}
  downloadTemplate()
  {
    setTimeout(() => {
      this.commonService.download('T_InventoryTransfer.xlsx');
      }, 2);
    
    // this.dowloadLine();
   
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  modalRef: BsModalRef; 
  clearFileInput() 
{ 
  this.myInputVariable.nativeElement.value = "";
}
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: 'static',
    });
  }
  exportExcel(){
    this.importContent.forEach(item=>{
      item.listError ="";
      if(this.ErrorRepair.filter(x=>x.stt == item.stt).length >0)
      {
        item.listError =item.listError +"Item already exists; "
      }
      let excelDulicate = this.Erroreexcel.filter(x=>x.stt == item.stt)
      if(excelDulicate.length >0)
      {
        item.listError =item.listError +"Item duplicate with row: "+excelDulicate[0].listStt.toString()+"; ";
      }
      let notExit = this.ListNotExitItem.filter(x=>x.stt == item.stt)
      if(notExit.length >0)
      {
        item.listError =item.listError + notExit[0].itemCode +" Not Found; "
      }
      let frslocid = this.ListFrSlocidNull.filter(x=>x.stt == item.stt)
      if(frslocid.length >0)
      {
        item.listError =item.listError + frslocid[0].itemCode +" FrSlocId Not Found; "
      }
      let ToSlocIdNull = this.ListToSlocIdNull.filter(x=>x.stt == item.stt)
      if(ToSlocIdNull.length >0)
      {
        item.listError =item.listError + ToSlocIdNull[0].itemCode +"ToSlocId Not Found; "
      }
      if(this.ListNullItem.filter(x=>x ===item.stt).length>0)
      {
        item.listError =item.listError +"ItemCode is Null; "
      }
      if(this.ListNullBarcode.filter(x=>x ===item.stt).length>0)
      {
        item.listError =item.listError +"BarCode is Null; "
      }
      if(this.ListNullUom.filter(x=>x ===item.stt).length>0)
      {
        item.listError =item.listError +"UomCode is Null; "
      }
      if(this.ListNullQuantity.filter(x=>x ===item.stt).length>0)
      {
        item.listError =item.listError +"Quantity is Not Correct; "
      }
        delete item.description;
        delete item.stt;
        delete item.lineId;
        delete item.price;
        delete item.lineTotal;
        delete item.keyId;
        delete item.openQty;
    });
    console.log(this.importContent);
    let day = new Date()
    let fileName = "InventoryTransfer"+day.toLocaleString();
    let fileWidth:any =[{ width: 15 }, { width: 10 }, { width: 20 } , { width: 15 }, { width: 15 },
      { width: 15 }, { width: 200 }];
    this.excelSrv.exportExcel(this.importContent,fileName,fileWidth);
  }
}
