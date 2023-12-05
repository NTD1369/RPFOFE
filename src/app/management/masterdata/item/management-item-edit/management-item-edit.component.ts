import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/_models/item';
import { MItemSerialStock } from 'src/app/_models/itemserialstock';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { BOMViewModel } from 'src/app/_models/viewmodel/BOMViewModel';
import { BomService } from 'src/app/_services/data/bom.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { ItemserialService } from 'src/app/_services/data/itemserial.service';
import { ItemserialstockService } from 'src/app/_services/data/itemserialstock.service';
import { StorageService } from 'src/app/_services/data/storage.service';
import { UomService } from 'src/app/_services/data/uom.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { Merchandise_categoryService } from 'src/app/_services/data/merchandise_category.service';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { PaymentmethodService } from 'src/app/_services/data/paymentmethod.service';
import { ItemlistingService } from 'src/app/_services/data/itemlisting.service';
import { MItemStoreListing } from 'src/app/_models/itemstorelisting';
import { MItemGroup } from 'src/app/_models/mitemgroup';
import { ItemgroupService } from 'src/app/_services/data/itemgroup.service';
import { TaxService } from 'src/app/_services/data/tax.service';
import { MTax } from 'src/app/_models/tax';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-management-item-edit',
  templateUrl: './management-item-edit.component.html',
  styleUrls: ['./management-item-edit.component.scss']
})
export class ManagementItemEditComponent implements OnInit {
  item: Item;
  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['$event'])
  itemSerials: MItemSerial[];
  bomModel: BOMViewModel;
  itemSerialStock: MItemSerialStock[];
  mode: string = "";
  uomList: any;
  storage: any;
  itemList: any;
  marked = false;
  change = false;
  dateFormat = "";
  theCheckbox = false;
  lguAdd: string = "Generate Serial";
  config = {
    displayKey: "name", // if objects array passed which key to be displayed defaults to description
    search: false,
    limitTo: 1,
  };
  statusOptions = [
    {
      value: "A",
      index: 0,
      name: "Active",
    },
    {
      value: "I",
      index: 1,
      name: "Inactive",
    },
  ];
  custom4Options = [
    {
      value: "",
      index: 0,
      name: "N/A",
    },
    {
      value: "S",
      index: 1,
      name: "Service",
    },
    {
      value: "I",
      index: 2,
      name: "Inventory",
    },
  ];
  paymentTypes = [];
  ngAfterViewInit() {
    setTimeout(() => {
      debugger
      this.editForm.reset(this.item);
    }, 1000);
    
  }
 
  loadPaymentType() {
    this.paymentService.getPaymentType().subscribe((response: any) => {
      this.paymentTypes = response.data;
      if(this.item?.rejectPayType!==null && this.item?.rejectPayType!==undefined  && this.item?.rejectPayType !== '' && this.item?.rejectPayType?.length > 0 )
      {
        this.rejectPayTypeList = this.item?.rejectPayType.split(',');
      }
      

      console.log(this.paymentTypes);
    });
  }
  rejectPayTypeList: any;
  loadUomList() {
    this.uomService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      if (response.success) {
        this.uomList = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }

    });
  }
  itemListing: MItemStoreListing[] = []
  loadItemListing() {
    this.itemLisstingService.getItemListingStore(this.authService.storeSelected().companyCode, this.item.itemCode, this.authService.getCurrentInfor().username).subscribe((response: any) => {

      if (response.success) {
        this.itemListing = response.data;
        this.itemListing.forEach(itemListing => {
          itemListing.statusTemp = Boolean(JSON.parse(itemListing.status));
        });
        console.log(this.itemListing);
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
  }
  updateListing(data) {
    debugger;
    data.companyCode = this.authService.storeSelected().companyCode;
    data.itemCode = this.item.itemCode;
    // data.status= !data.status;
    if (data.statusTemp === true || data.statusTemp === 1) {
      data.status = 'A';
    }
    else {
      data.status = 'I';
    }
    data.createdBy = this.authService.getCurrentInfor().username;
    data.modifiedBy = this.authService.getCurrentInfor().username;
    this.itemLisstingService.update(data).subscribe((response: any) => {

      if (response.success) {
        // this.itemListing = response.data;
        // console.log(this.itemListing);
        this.alertifyService.success("Update successfully completed.");
      }
      else {
        this.alertifyService.warning("Update faled. " + response.message);
      }
    })
  }
  @ViewChild('template', { static: false }) template;
  onToolbarPreparing(e) {
    if (this.authService.checkRole(this.functionId, '', 'I')) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: this.lguAdd,
          onClick: this.openModal.bind(this)
        }
      });
    }
  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return date.getFullYear() + '-' + month + '-' + (day);
  }
  generateSerial(prefix, numOfGen, randomNumberLen, runingNumberLen, expDate) {
    expDate = this.GetDateFormat(expDate);
    this.itemSerialService.GenerateSerial(this.authService.getCurrentInfor().companyCode, '', expDate, this.authService.getCurrentInfor().username, prefix, this.item.itemCode, numOfGen, randomNumberLen, runingNumberLen).subscribe((response: any) => {
      if (response.success) {
        this.itemSerials = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
  }
  genSerial = false;
  openModal() {
    debugger;
    this.genSerial = !this.genSerial;
  }
  // tslint:disable-next-line: max-line-length
  constructor(private itemService: ItemService, private itemLisstingService: ItemlistingService, private groupSerice: ItemgroupService, private itemSerialService: ItemserialService, private merchandiseService: Merchandise_categoryService,
    private alertifyService: AlertifyService, private storageService: StorageService, private paymentService: PaymentmethodService,
    private bomService: BomService, private authService: AuthService, private uomService: UomService, private taxService: TaxService,
    private itemserialtockService: ItemserialstockService, private route: ActivatedRoute, private router: Router) {
    // this.setItemValue = this.setItemValue.bind(this);
    // this.usersGrid is an ArrayStore instance  
    // Chuyển đổi ngôn ngữ
    const lgu = localStorage.getItem('language');
    if (lgu === "vi") {
      this.lguAdd = "Tạo Seri";
    } else if (lgu === "en") {
      this.lguAdd = "Generate Serial";
    } else {
      console.log("error");
    }

  }
  merchandise: MMerchandiseCategory[] = [];
  loadMerchandise() {
    this.merchandiseService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      if (response.success) {
        this.merchandise = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }

    });
  }
  itemGroupList: MItemGroup[] = [];
  taxList: MTax[] = [];
  loadTax() {
    this.taxService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      if (response.success) {
        this.taxList = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }

    });
  }
  loadItemGroup() {
    this.groupSerice.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      if (response.success) {
        this.itemGroupList = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }
      // this.itemGroupList = response;
    });
  }
  canUpdate = false;
  functionId = "Adm_ItemSetup";
  ngOnInit() {

    this.canUpdate = this.authService.checkRole(this.functionId, '', 'E');
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.dropDownOptions = { width: 500 };
    this.route.data.subscribe(data => {
      this.item = data['item'].data;
      debugger
    });
    if(this.item!== null && this.item!==undefined && this.item.itemCode?.length > 0)
    {
      console.log(this.item,'item');
      if (this.item !== null && this.item !== undefined) {
        this.loadItemListing();
        this.loadTax();
  
        if (this.item.isSerial) {
          debugger;
          this.itemSerialService.getByItem(this.authService.getCompanyInfor().companyCode, '', this.item.itemCode).subscribe((response) => {
            this.itemSerials = response;
          });
        }
        if (this.item.isBom) {
          this.loadBOMModel();
        }
        this.loadStorage();
        this.loadSerialStockByItem();
        this.loadItemList();
        this.loadPaymentType();
        this.loadUomList();
        this.loadMerchandise();
        this.loadItemGroup();
      }
  
    }
    else
    {
      this.alertifyService.error("Data not found.");
    }
    
  }

  dropDownOptions: object;
  @ViewChild('dataGrid', { static: false }) dataGrid;
  @ViewChild('itemGrid', { static: false }) itemGrid;


  onSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
    debugger;
    console.log(cellInfo);
    cellInfo.setValue(selectedRowKeys[0]);

    if (selectedRowKeys.length > 0) {
      dropDownBoxComponent.close();

      let code = event.selectedRowsData[0].itemCode;
      let name = event.selectedRowsData[0].itemName;
      let uom = event.selectedRowsData[0].uomCode;
      // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'itemCode', code);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'itemName', name);
      this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'uomCode', uom);

    }

  }

  loadItemList() {
    let companyCode = this.authService.getCurrentInfor().companyCode;
    this.itemService.getItemViewList(companyCode, this.authService.storeSelected().storeId, '', '', '', '', '', '').subscribe((response: any) => {
      this.itemList = response.data;
      debugger;
    });
  }
  loadBOMModel() {
    this.bomService.GetByItemCode(this.authService.getCurrentInfor().companyCode, this.item.itemCode).subscribe((response: any) => {
      if (response.success) {
        this.bomModel = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }

    });
  }
  loadSerialStockByItem() {
    this.itemserialtockService.getByItem(this.authService.getCurrentInfor().companyCode, this.item.itemCode).subscribe((response: any) => {

      // this.itemSerialStock = response;
      if (response.success) {
        this.itemSerialStock = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }

    });
  }
  loadSerialStock(sloc) {
    this.itemserialtockService.getBySlocItem(this.authService.getCurrentInfor().companyCode, sloc, this.item.itemCode).subscribe((response: any) => {
      if (response.success) {
        this.itemSerialStock = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }


    });
  }
  loadStorage() {
    this.storageService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      if (response.success) {
        this.storage = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }

    });
  }
  saveSerial(e) {

    let model = e.changes[0].data;
    model.itemCode = this.item.itemCode;
    if (this.mode === 'E') {
      this.itemSerialService.update(model).subscribe((response: any) => {
        if (response.success) {
          this.alertifyService.success("update completed successfully");
        }
        else {
          this.alertifyService.warning("update failed: " + response.message);
        }
      });
    }
    else {
      this.itemSerialService.create(model).subscribe((response: any) => {
        if (response.success) {
          this.alertifyService.success("insert completed successfully");
        }
        else {
          this.alertifyService.warning("insert failed: " + response.message);
        }
      });
    }
    // this.events.unshift(eventName);
  }
  saveBOM(e) {
    debugger;
    let model = e.changes[0].data;
    model.bomId = this.item.itemCode;
    if (this.mode === 'E') {
      this.bomService.updateLine(model).subscribe((response: any) => {
        if (response.success) {
          this.alertifyService.success("update completed successfully");
        }
        else {
          this.alertifyService.warning("update failed: " + response.message);
        }
      });
    }
    else {
      model.status = 'A';
      this.bomService.createLine(model).subscribe((response: any) => {
        if (response.success) {
          this.alertifyService.success("insert completed successfully");
        }
        else {
          this.alertifyService.warning("insert failed: " + response.message);
        }
      });
    }
    // this.events.unshift(eventName);
  }
  deleteBomLine(e) {
    debugger;
    let Id = e.data.id;
    let bomId = this.item.itemCode;
    this.bomService.deleteLine(Id, bomId).subscribe((response: any) => {
      if (response.success) {
        this.alertifyService.success("remove bom completed successfully");
      }
      else {
        this.alertifyService.warning("remove bom failed: " + response.message);
      }
    });
  }
  deleteBom() {
    this.bomService.delete(this.item.itemCode).subscribe((response: any) => {
      if (response.success) {
        this.alertifyService.success("remove bom completed successfully");
      }
      else {
        this.alertifyService.warning("remove bom failed: " + response.message);
      }
    });
  }
  saveSerialStock(e) {
    debugger;
    let model = e.changes[0].data;
    model.itemCode = this.item.itemCode;
    if (this.mode === 'E') {
      this.itemserialtockService.update(model).subscribe((response: any) => {
        if (response.success) {
          this.alertifyService.success("update completed successfully");
        }
        else {
          this.alertifyService.warning("update failed: " + response.message);
        }
      });
    }
    else {
      this.itemserialtockService.create(model).subscribe((response: any) => {
        if (response.success) {
          this.alertifyService.success("insert completed successfully");
        }
        else {
          this.alertifyService.warning("insert failed: " + response.message);
        }
      });
    }
    // this.events.unshift(eventName);
  }

  onRejectPayTypeListSelectionChanged(e)
  {
    debugger;
    this.change = true;
    this.editForm.controls['rejectPayType'].markAsDirty(); 
  }
  updateItem() {
    console.log(this.item);

    let rejectPayTypeArr: any = this.rejectPayTypeList;
    if(rejectPayTypeArr !== null && rejectPayTypeArr !== undefined && rejectPayTypeArr?.length > 0 )
    {
      this.item.rejectPayType = rejectPayTypeArr.join(',');
    }
    else
    {
      this.item.rejectPayType ="";
    }
    debugger;
    this.itemService.update(this.item).subscribe((response:any) => {
      if (response.success === true) {
        this.alertifyService.success('Item detail updated successfully');
        setTimeout(() => {
          window.location.reload();
        }, 50);
      }
      else {
        this.alertifyService.error(response.message);
      }
      // this.alertifyService.success('Item detail updated successfully');
      // this.editForm.reset(this.item);
      // setTimeout(() => {
      //   this.editForm.reset(this.item);
      // }, 1000);
      // window.location.reload();
    }, error => {
      this.alertifyService.error(error);
    });
  }
  toggleVisibility(e) {
    this.marked = e.target.checked;
  }
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
}
