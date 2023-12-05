import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemSearch } from 'src/app/shop/components/shop-search-item/shop-search-item.component';
import { MCustomer } from 'src/app/_models/customer';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { MUom } from 'src/app/_models/muom';
import { TPurchaseOrderHeader, TPurchaseOrderLine, TPurchaseOrderLineSerial } from 'src/app/_models/purchase';
import { MStorage } from 'src/app/_models/storage';
import { MStore } from 'src/app/_models/store';
import { MTax } from 'src/app/_models/tax';
import { MWarehouse } from 'src/app/_models/warehouse';
import { AuthService } from 'src/app/_services/auth.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { ItemuomService } from 'src/app/_services/data/itemuom.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { StorageService } from 'src/app/_services/data/storage.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { TaxService } from 'src/app/_services/data/tax.service';
import { UomService } from 'src/app/_services/data/uom.service';
import { WarehouseService } from 'src/app/_services/data/warehouse.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { PurchaseService } from 'src/app/_services/transaction/purchase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-purchase-detail',
  templateUrl: './management-purchase-detail.component.html',
  styleUrls: ['./management-purchase-detail.component.scss'],
  providers: [DatePipe] // Add this
})
export class ManagementPurchaseDetailComponent implements OnInit {

  currentValue: Date = new Date();
  purchase: TPurchaseOrderHeader;
  lines:TPurchaseOrderLine[];
  itemList: any;
  taxList: MTax[];
  storageList: MStorage[];
  serialList: MItemSerial[];
  uomList: MUom[];
  mode: string;
  issueId: string;
  isNew = false;
  gridBoxValue: string[]=[];
  storeList: MStore[];
  customerList: MCustomer[];
  isActive = false;
  storeSelected: MStore;
  isEditGrid=false;
  configStorage: boolean = true;
  arrWhsFrm = [];
  vendor:string ='';
  salesRotationConfig = "false";
  statusOptions = [
    {
      value: "O", name: "Open",
    },
    {
      value: "C", name: "Closed",
    },
    {
      value: "Canceled", name: "Canceled",
    },

  ];


  constructor(public authService: AuthService, private purchaseService: PurchaseService,  private whsService: WarehouseService,private alertifyService: AlertifyService, private datePipe: DatePipe,
    private uomService: UomService, private customerService: CustomerService, private formBuilder: FormBuilder, private controlService: ControlService, 
    private taxService: TaxService, private storeService: StoreService, private storageService: StorageService, public itemUomService: ItemuomService,
     private itemService: ItemService,private route: ActivatedRoute, private router: Router, private printService: PrintService) { 
      this.storeSelected = this.authService.storeSelected();
      // this.loadItemList();
    this.loadTaxList();
    this.loadStorageList();
    this.loadUom();
    this.loadStore();
    this.loadCustomer();
    this.getItemFilterControlList();
    this.customizeText= this.customizeText.bind(this);
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
  
  checkPermission(controlId: string, permission: string): boolean
  {
    
    return this.authService.checkRole(this.functionId , controlId, permission );
  }
  
  loadCustomer()
  {
    this.customerService.getByCompany(this.storeSelected.companyCode, "S").subscribe((response: any)=>{
      // this.customerList= response;
      if(response.success)
        {
          this.customerList = response.data;
        }
        else
        {
          this.alertifyService.warning(response.message)
        }
    });
  }
  customizeText (e) {
    // debugger;
     if( e.value!==null &&  e.value!== undefined)
     {
       return this.authService.formatCurrentcy( e.value);

     }
     return 0;
  };
  loadStore()
  {
     
    this.storeService.getByUser(this.authService.getCurrentInfor().username).subscribe((response: any)=>{
      if(response.success)
      {
        this.storeList = response.data;
        // this.storeList= response;
        if(this.storeList!==null && this.storeList!==undefined)
        {
           
          this.purchase.storeId= this.storeSelected.storeId; 
          this.storageService.getByStore(this.storeSelected.storeId, this.storeSelected.companyCode).subscribe((response: any)=>{
            // this.storageList = response;
            if(response.success)
            {
              this.storageList = response.data;
            }
            else
            {
              this.alertifyService.warning(response.message);
            }
          })
        }
      } 
      else
      {
        this.alertifyService.warning(response.message);
      }
     
    });
  }
  ngAfterViewInit() {
     
   
  } 
  onTaxSelectionChanged(selectedRowKeys, cellInfo,event, e, dropDownBoxComponent): void {  
    // debugger; 
     console.log(e);
     cellInfo.setValue(selectedRowKeys[0]); 
    
      if(selectedRowKeys.length > 0) {
        dropDownBoxComponent.close(); 
        // let code =event.selectedRowsData[0].itemCode;
        debugger;
        let price = this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price')
        let percent = event.selectedRowsData[0].taxPercent;
        
        let taxamt= price * percent / 100;
        let linetotal = price;// + taxamt;
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxAmt', taxamt);  
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxRate', percent);  
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxCode', selectedRowKeys[0]); 
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lineTotal', linetotal); 
        // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
         
    }
  }  
  getLastedPrice(itemCode, uomCode)
  {
     return this.purchaseService.GetLastPricePO(this.storeSelected.companyCode, this.storeSelected.storeId, itemCode, uomCode, '');
  }
  getItemPrice(itemCode, uomCode)
  {
     return this.itemService.GetItemPrice(this.storeSelected.companyCode, this.storeSelected.storeId, itemCode, uomCode, '');
  }
  onItemSelectionChanged(selectedRowKeys, cellInfo,event, e, dropDownBoxComponent) {
  
    console.log(cellInfo);
    cellInfo.setValue(selectedRowKeys[0]); 
    if(selectedRowKeys.length > 0) {
        dropDownBoxComponent.close(); 
        debugger;
        let code =event.selectedRowsData[0].itemCode;
        let name = event.selectedRowsData[0].itemName;
        let uom= event.selectedRowsData[0].uomCode;
        let barcode= event.selectedRowsData[0].barCode;
        let price= event.selectedRowsData[0].defaultPrice;
        // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'itemCode', code); 
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'description', name);  
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'currencyCode', this.storeSelected.currencyCode); 
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'uomCode', uom);   
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'barCode', barcode);    
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'quantity', '1');  
        this.getItemPrice(code, uom).subscribe((response: any)=> { 
          if(response.data!==null&& response.data!==undefined&&response.data!=='')
          {
             let priceAfterVAT= response.data.priceAfterTax
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price', priceAfterVAT);   
            this.getLastedPrice(code, uom).subscribe((response: any)=> { 
              if(response.data!==null&& response.data!==undefined&&response.data!=='')
              {
               this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lastPrice', response.data);  
              }
              else
              { 
               this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lastPrice', price);  
              }
              
           });
          }
          else
          { 
            this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price', 0);   
            this.getLastedPrice(code, uom).subscribe((response: any)=> { 
              if(response!==null&& response!==undefined&&response!=='')
              {
               this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lastPrice', response);  
              }
              else
              { 
               this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lastPrice', price);  
              }
              
           });
          }
          
       });
         
    }
    
  }
  onEditorPreparing(e) {
    debugger;
    if(e.parentType === "dataRow" && e.dataField === "uomCode") {
        
        // e.editorOptions.disabled = (typeof e.row.data.itemCode !== "number");
        this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, e.row.data.itemCode).subscribe((response: any)=>{ 
          // this.uomList = response; 
          if (response.success) {
            debugger;
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
  checkLines(lines)
  {
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
  checkInput()
  {
    let rs = true;
    if(this.purchase.cardCode===null || this.purchase.cardCode===undefined || this.purchase.cardCode==='')
    {
      rs= false;
      this.alertifyService.warning('Please input Vendor');
    }
    if(this.purchase.docDate===null || this.purchase.docDate===undefined || this.purchase.docDate==='')
    {
      rs= false;
      this.alertifyService.warning('Please input DocDate');
    }
    if(this.purchase.docDueDate===null || this.purchase.docDueDate===undefined || this.purchase.docDueDate==='')
    {
      rs= false;
      this.alertifyService.warning('Please input Doc Due Date');
    }
    if(this.purchase.storeId===null || this.purchase.storeId===undefined || this.purchase.storeId==='')
    {
      rs= false;
      this.alertifyService.warning('Please input store');
    }
   
    return rs;
  }
  closePO()
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to close PO!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.purchase.status ='C';
        this.purchase.modifiedBy= this.authService.getCurrentInfor().username;
        this.purchaseService.updateStatus(this.purchase).subscribe((response: any)=>{
          if(response.success===true)
          {
            this.alertifyService.success("Close transaction successfully completed.");

          }
          else
          {
            this.alertifyService.error(response.message);
          }
        });
      }
    });
  }
  
  saveModel()
  {
    if( this.checkInput())
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
          
          let VATTotal: number =0;
          let DocTotal: number =0;
          this.lines.forEach((item)=>{
           
            if(item.lineTotal!==null && item.lineTotal!==undefined)
            {
              DocTotal+= parseFloat(item.lineTotal.toString());
            } 
            else
            {
              let lineTotal = item.quantity * item.price;
              DocTotal+= lineTotal;
            }
            if(item.lineTotal!==null && item.lineTotal!==undefined && item.vatpercent!==null && item.vatpercent!==undefined)  
              VATTotal+= (parseFloat(item.vatpercent.toString()) /100) * parseFloat(item.lineTotal.toString());
           
          })
          // this.purchase.docDate = this.datePipe.transform(this.purchase.docDate, 'yyyy-MM-dd HH:mm:ss');
          this.purchase.storeId= this.storeSelected.storeId;
          this.purchase.storeName = this.storeSelected.storeName;
          this.purchase.companyCode = this.storeSelected.companyCode;
          this.purchase.vattotal= VATTotal;
          this.purchase.docTotal= DocTotal;
          this.purchase.lines = this.lines; 
          // this.purchase.isCanceled = 'N';
          this.purchase.isCanceled= 'N';
          if(this.isNew === true)
          {    
             this.purchase.dataSource = 'POS'; 
            this.purchase.status= 'O';
            this.purchase.docStatus= 'O';
             this.purchase.createdBy = this.authService.decodeToken?.unique_name ;
          }
          else
          {
            this.purchase.modifiedBy= this.authService.decodeToken?.unique_name ;
          }
          this.purchase.cardCode = this.purchase.cardCode[0];
          let checkLine= this.checkLines(this.purchase.lines);
          debugger;
          if(checkLine===true)
          { 
            this.purchaseService.SavePO(this.purchase).subscribe((response: any)=>{
              if(response.success===true)
              {
                this.alertifyService.success("Create successfully completed. Trans Id: " + response.message);
                this.router.navigate(["admin/purchase","edit", response.message]);
              }
              else
              {
                this.alertifyService.error(response.message);
              }
            });
          }
          else
          {
            this.alertifyService.warning('Please check price in line.');
          }
          
        }
      });
    }
    
    
  }
  onFromStoreChanged(store)
  {
    debugger;
    // console.log('AAA');
    if(store!==null && store!==undefined)
    {
      // this.fromStore= store;
      // this.purchase.storeId= this.storeSelected.storeId; 
      this.storageService.getByStore(store.storeId, store.companyCode).subscribe((response: any)=>{
        // this.storageList = response;
        if(response.success)
        {
          this.storageList = response.data;
        }
        else
        {
          this.alertifyService.warning(response.message);
        }
      }) 
      this.whsService.getItem(this.authService.getCurrentInfor().companyCode, store.whsCode).subscribe((response: any)=>{ 
        if (response.success) {
          this.whs = response.data;
         
        }
        else {
          this.alertifyService.error(response.message);
        }
        // this.whs= response;
      });
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
  loadDefaultWhs(whs)
  {
    this.whsService.getItem(this.authService.getCurrentInfor().companyCode,whs).subscribe((response: any)=>{
      // this.whs = response;
      if (response.success) {
        this.whs = response.data;
       
      }
      else {
        this.alertifyService.error(response.message);
      }
    });
  }
  dataSourceItem: any;
  dateFormat="";
  
  functionId="Adm_Purchase";
  canEdit=false;
  canAdd= false;
  onInitNewRow(e) {
    // debugger;
    // this.authService.storeSelected()
    // e.data.taxCode = 'S0'; 
    e.data.slocId = this.whs.defaultSlocId;// this.authService.storeSelected().whsCode; 
    // e.data.hireDate = new Date();
    // e.promise = this.getDefaultData().then((data: any) => {
    //     e.data.ID = data.ID;
    //     e.data.position = data.Position;
    // });
  }
  ngOnInit() {
    // debugger;
    this.checkFormatQty();
    if(this.configStorage)
    this.loadStorageList();
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    this.loadDefaultWhs(this.authService.storeSelected().whsCode);
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.canAdd=  this.authService.checkRole(this.functionId , '', 'I' );
    this.canEdit=  this.authService.checkRole(this.functionId , '', 'E' );
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.route.params.subscribe(data => {
      this.mode = data['m'];
      this.issueId = data['id'];
    })
    if(this.mode === 'edit')
    {

      this.purchaseService.getBill(this.issueId, this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any)=>{
        this.purchase = response;
          if(this.purchase.isCanceled==='1')
          this.purchase.status = 'Canceled'
          // this.purchase.status = this.statusOptions.filter(x => x.value == this.purchase.status)[0].name;
        debugger;
        this.lines = response.lines; 
        this.vendor = this.purchase.cardCode+' - ' + this.purchase.cardName;
        // console.log(this.purchase)
        // this.getFilteredUom = this.getFilteredUom.bind(this.lines);
        this.isNew= false;
      });
    }
    else
    {
      this.purchase = new TPurchaseOrderHeader();
      this.lines = [];
      // console.log(this.goodreceipt);
      this.isNew= true;
    
      // this.loadUom();
    }
    
  }
  
  @ViewChild('dataGrid' , { static: false}) dataGrid;  
  @ViewChild('gridBox') gridBox;  
  @ViewChild('gridTaxBox') gridTaxBox;  
  @ViewChild('gridUoMBox' , { static: false}) gridUoMBox;  
  @ViewChild('dropDownUoM') dropDownUoM;  
  taxAmtCellValue(rowData)
  {
    
    if(rowData.quantity !== undefined && rowData.price !== undefined)
    {
      // debugger;
      let amount = rowData.quantity * rowData.price;
      if(amount !== null && amount !== undefined  )
      {
        let taxpercent = rowData.taxRate;
         
        return amount * taxpercent / 100; 
      }
    }
    
    return 0; 
  }
 
  checkFormatQty() {
    let format = this.authService.loadFormat();
    if (format !== null || format !== undefined) {
      let salesRotationConfig = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'SalesRotation');
      if (salesRotationConfig !== null && salesRotationConfig !== undefined) {
        this.salesRotationConfig = salesRotationConfig.settingValue;
      }
    }
  }

  onRowValidating(e) {
    debugger;
    if(e.newData.price) {
      let amountX = e.oldData.lastPrice * 10 / 100;
      let fromAmt = e.oldData.lastPrice - amountX ;
      let toAmt = amountX + e.oldData.lastPrice;
      if(e.newData.price > toAmt || e.newData.price < fromAmt)
      {
        e.errorText = "Price can't more than 10% last price";
        e.isValid = false;
      }
       
      }
    }
    onCellPrepared(e) {
      
      if(e.rowType === "data" && e.column.dataField === "price") {
         debugger;
          let amountX = e.data.lastPrice * 10 / 100;
          let fromAmt = e.data.lastPrice - amountX ;
          let toAmt = amountX + e.data.lastPrice;
          e.cellElement.style.color = e.data.price >= fromAmt &&  e.data.price <= toAmt ? "green" : "red";
          // Tracks the `Amount` data field
          e.watch(function() {
              return e.data.price;
          }, function() {
              e.cellElement.style.color = e.data.price >= fromAmt &&  e.data.price <= toAmt? "green" : "red";
          })
      }
  }
  onRowPrepared(e) {  
    // if(e.data!==null && e.data!==undefined)
    // {
      
    //   if(e.data.keyId!==null && e.data.keyId!==undefined  &&  e.data.lineId!==null && e.data.lineId!==undefined )
    //   {
    //     if (e.rowType === "data" && (e.data.lines===null || e.data.lines===undefined || e.data.lines.length===0 || e.data.lines==='undefined'))  {  
    //       // debugger;
    //       e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");  
    //       e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");  
    
    //     }  
    //   }
      
    // }
    
    if(e.data!==null && e.data!==undefined)
    {
      
      if(e.data.keyId!==null && e.data.keyId!==undefined  &&  e.data.lineId!==null && e.data.lineId!==undefined )
      {
        if (e.rowType == "data" && (e.data.lines===null || e.data.lines===undefined || e.data.lines.length===0 || e.data.lines==='undefined'))  {  
      
          e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");  
          e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");  
    
        }  
      }
      
    }
}  
  lineTotalCellValue(rowData)
  {
   
    if(rowData.quantity !== null && rowData.price !== null)
    {
      return rowData.quantity * rowData.price; 
    }
    return 0; 
  }
  getFilteredUom(options): any {
    debugger;
    
    // console.log('options: ' + options);
    if(options!== null && options !== undefined)
    {
      if(options.data !== undefined && options.data !== null)
      {
        this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, options.data.itemCode).subscribe((response: any)=>{
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
    this.uomService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      debugger;
      // return response;
      if(response.success)
      {
        this.itemUom = response.data;
      }
      else
      {
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
   onUoMSelectionChanged(e: any, data: any){
    console.log(e);
    debugger;
    if(e.selectedRowsData[0] !== null && e.selectedRowsData[0] !== undefined)
    {
      let itemCode = data.data.itemCode;
      let uomCode = e.selectedRowsData[0].uomCode;
      
      this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any)=>{ 
        if (response.success) {
          debugger;
          this.itemUom = response.data;
          // this.itemUom = response; 
          // debugger;
          //
          if( this.itemUom === null ||  this.itemUom === undefined)
          {
            this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', '');
          }
          else{
            let itemuom = this.itemUom.find(x=>x.uomCode === uomCode);
            // debugger;
            if(itemuom !== null && itemuom !== undefined)
            {
              this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', itemuom.barCode);  
              
            }
            else
            {
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
  isDropDownBoxOpened(e , data)
  {
    debugger;
    // console.log(data.itemCode);
    setTimeout(() => {
      this.loadUomNew(data.itemCode)
    },2); 
    return true;
  }
  loadUomNew(itemCode)
  {
    this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any)=>{ 
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
  onSelectionChanged(e: any, data: any): void {  
    debugger;  console.log(e);
      console.log(e.selectedRowsData);
      let itemCode = e.selectedRowsData[0].itemCode;
      // this.dataGrid.instance.cellValue(data.rowIndex, 'itemCode', itemCode);  
      this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any)=>{
        debugger;
        if (response.success) {
          debugger;
          this.itemUom = response.data;
          // this.itemUom = response;
          
          // console.log(this.itemList); 
          // console.log(this.itemUom);
          let description =e.selectedRowsData[0].description;
          this.dataGrid.instance.cellValue(data.rowIndex, 'description', description); 
          let price =e.selectedRowsData[0].defaultPrice;
          this.dataGrid.instance.cellValue(data.rowIndex, 'price', price);  
          let uom = e.selectedRowsData[0].inventoryUom;
          this.dataGrid.instance.cellValue(data.rowIndex, 'uomCode', uom);   
          let itemuom = this.itemUom.find(x=>x.itemCode === itemCode && x.uomcode === uom);
        
          if(itemuom !== null && itemuom !== undefined)
          {
            this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', itemuom.barCode);  
          }
          let tax = e.selectedRowsData[0].purchaseTaxCode;
          this.dataGrid.instance.cellValue(data.rowIndex, 'quantity', 1);  
          let taxamt= 0;
          if(tax !== '' && tax !== undefined && tax !== null)
          {
            this.dataGrid.instance.cellValue(data.rowIndex, 'taxCode', tax);   
            let taxvalue = this.taxList.find(x=>x.taxCode === tax);
            if(taxvalue!== null && taxvalue !== undefined)
            {
              this.dataGrid.instance.cellValue(data.rowIndex, 'taxRate', taxvalue.taxPercent);  
            } 
            let taxSelected = this.taxList.filter(x=>x.taxCode === tax)[0];
            let percent = taxSelected.taxPercent;
            taxamt= price * percent/ 100;
            this.dataGrid.instance.cellValue(data.rowIndex, 'taxAmt', taxamt);  
          }
          // let uom = e.selectedRowsData[0].inventoryUom;
          this.dataGrid.instance.cellValue(data.rowIndex, 'currencyCode', this.storeSelected.currencyCode);  
          
          let linetotal = price;// + taxamt;
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
  
  priceColumn_customizeText (cellInfo) {
    // debugger;
    return cellInfo.value + "$";
  }
  
   
  loadItemList(itemCode,  uomcode,  barcode,  keyword)
  {
    this.itemService.GetItemInforList(this.storeSelected.companyCode,this.storeSelected.storeId, itemCode,  uomcode,  barcode,  keyword,'').subscribe((response: any)=>{
      this.itemList = response.data;
      debugger;
    });
    
     
  }
  itemUom: any;
  loadItemUom(itemCode)
  {
     
    this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any)=>{
      // debugger;
      // this.itemUom = response;
      // console.log(this.itemList);
      if (response.success) {
        debugger;
        this.itemUom = response.data;
      }
      else {
        this.alertifyService.error(response.message);
      }
    });
  }
  loadUom()
  {
    this.uomService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      // debugger;
      if(response.success)
      {
        this.uomList = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
      // this.uomList = response;
      // console.log(this.uomList);
    });
    // this.uomService.getAll().subscribe((response: any)=>{
    //   // debugger;
    //   this.uomList = response;
    //   console.log(this.uomList);
    // });
  }
  
  loadTaxList()
  {
    
    this.taxService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      // debugger;
      if(response.success)
      {
        this.taxList = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
      // this.taxList = response;
      // console.log(this.taxList);
    });
  }
  loadStorageList(store = null) {
    if(!this.configStorage)
    {
      this.storageService.getByStore(this.storeSelected.storeId, this.storeSelected.companyCode).subscribe((response: any)=>{
        // debugger;
        if(response.success)
        {
          this.storageList = response.data;
        }
        else
        {
          this.alertifyService.warning(response.message);
        }
        // this.storageList = response;
        console.log(this.storageList);
      });
    }
 else{
  if (store === null || store === undefined)
  {
    store = new MStore();
    store.storeId = this.storeSelected.storeId
  }
// this.storewarehouseService.getByWhsStore(this.storeSelected.companyCode, store.storeId).subscribe((response: any) => {
//   // debugger;
//   if (response.success) {
//     this.storageList = response.data;
//   }
//   else {
//     this.alertifyService.warning(response.message);
//   }
//   // this.storageList = response;
//   console.log(this.storageList);
// });
this.GetFromWarehouseByWhsType(this.storeSelected.companyCode, store.storeId)
 }
 
}
GetFromWarehouseByWhsType(comp, storeId) {
  this.whsService.GetWarehouseByWhsType(comp, storeId).subscribe((response: any) => {
    if (response.success) {
      // S: Main W: Order
      this.arrWhsFrm = [];
      const arrByWhs = response.data;
      if (arrByWhs.length > 0) {
        arrByWhs.forEach(item => {
          // this.arrWhsFrm.push(item.whsCode);
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
}

  PrintDetail(data) {
    debugger
    console.log("data", data);
    this.router.navigate(["admin/purchaseorder/print", data.purchaseId]).then(() => {
      // window.location.reload();
    });
  }

}
