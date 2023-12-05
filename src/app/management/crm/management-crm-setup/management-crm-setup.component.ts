import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { WindowService } from 'src/app/windowService';
import { MLoyaltyType, SLoyaltyBuy, SLoyaltyCustomer, SLoyaltyEarn, SLoyaltyExclude, SLoyaltyHeader, SLoyaltyStore } from 'src/app/_models/crm';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { MWICustomerModel } from 'src/app/_models/mwi/customer';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { CrmService } from 'src/app/_services/data/crm.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { Merchandise_categoryService } from 'src/app/_services/data/merchandise_category.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import { promotion, loyalty } from 'src/environments/environment';
import { LoyaltyrankService } from 'src/app/_services/data/loyaltyrank.service';
import { MStore } from 'src/app/_models/store';
import { StoreService } from 'src/app/_services/data/store.service';
import { SPromoStore } from 'src/app/_models/promotion/promotionstore';
import { ItemgroupService } from 'src/app/_services/data/itemgroup.service';
@Component({
  selector: 'app-management-crm-setup',
  templateUrl: './management-crm-setup.component.html',
  styleUrls: ['./management-crm-setup.component.scss']
})
export class ManagementCrmSetupComponent implements OnInit {
// @HostListener('window:resize', ['$event'])
value: any[] = [];
importContent: SLoyaltyHeader[] = [];
isResult = false; 
modalRef: BsModalRef;
CustomerSelected: string = '';
loyalty: SLoyaltyHeader;
header: SLoyaltyHeader;
customers: SLoyaltyCustomer[] = [];
 
getLines: SLoyaltyEarn[] = [];
buyLines: SLoyaltyBuy[] = [];
excludeLines: SLoyaltyExclude[] = [];
itemList: ItemViewModel[];
loyaltyType: MLoyaltyType[];
selectedKey = [];
allMode: string;
checkBoxesMode: string;
isMon = false;
isTue = false;
isWed = false;
isThu = false;
isFri = false;
isSat = false;
isSun = false;
isCombine = false;
isActive = false;
customerType: any = [
  { name: 'All Customer', value: 'A' },
  { name: 'Customer Code', value: 'C' },
  { name: 'Customer Rank', value: 'G' },

];
disableTotalMax= false;
storeList: MStore[] = [];
loadStore() {
  this.storeService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
    if(response.success)
    {
        this.storeList = response.data;
    } 
    else
    {
      this.alertifyService.warning(response.message);
    }
    
  })
}
getTotalValueChange(value)
{
  if(value==="Fixed Point")
  {
    this.disableTotalMax= true;
  }
  else
  {
    this.disableTotalMax= false;
  }
}
// discountType: any = [
//   { name: 'Percent', value:'percent'},
//   { name: 'Amount', value:'amount'},

// ]; 
customizeText (e) {
  // debugger;
    if( e.value!==null &&  e.value!== undefined)
    {
      return this.authService.formatCurrentcy( e.value);

    }
    return 0;
};
lineType: any = loyalty.lineType;
valueType: any = promotion.loyaltyValueType;
discountType: any = promotion.totalGetLoyaltyType;
// [
//   { name: 'Discount Amount', value:'DiscountAmount'},
//   { name: 'Discount Percent', value:'DiscountPercent'},
//   { name: 'Fixed Price', value:'FixedPrice'},
//   { name: 'Fixed Quantity', value:'FixedQuantity'},
// ]

conditionType: any = [
  { name: 'Amount', value: 'Amount' },
  { name: 'Quantity', value: 'Quantity' },
  { name: 'Accumulated', value: 'Accumulated' },

]

condition1Type: any = [
  { name: 'Equal', value: 'CE' },
  { name: 'From', value: 'FROM' },

]
condition2Type: any = [
  { name: '', value: '' },
  { name: 'To', value: 'TO' },
]


buyTab = true;
getTab = true;
buyTablineUom = true;
buyTablineName = true;
buyTabvalueType = true;
buyTabcondition1 = true;
buyTabcondition2 = true;
buyTabvalue1 = true;
buyTabvalue2 = true;
buyTabtotalText1 = true;
buyTabtotalText2 = true;



getTablineUom = true;
getTablineName = true;
getTabvalueType = true;
getTabconditionType = true;
getTabcondition1 = true;
getTabcondition2 = true;
getTabvalue1 = true;
getTabvalue2 = true;
getTabgetValue = true;
getTabSelected = 0;
getTabtotalText1 = true;
getTabtotalText2 = true;
showGrid=false;
resetBuyGrid() {
 
    this.buyTablineUom = true;
    this.buyTablineName = true;
    this.buyTabvalueType = true;
    this.buyTabcondition1 = true;
    this.buyTabcondition2 = true;
    this.buyTabvalue1 = true;
    this.buyTabvalue2 = true;
    this.buyTabtotalText1 = true;
    this.buyTabtotalText2 = true;
    this.buygridShow=true;
    this.showGrid=true;
   
}
resetGetGrid() {
  
  

    this.getTablineUom = true;
    this.getTablineName = true;
    this.getTabvalueType = true;
    this.getTabconditionType = true;
    this.getTabcondition1 = true;
    this.getTabcondition2 = true;
    this.getTabvalue1 = true;
    this.getTabvalue2 = true;
    this.getTabgetValue = true;
    this.getTabtotalText1 = true;
    this.getTabtotalText2 = true;
    this.getgridShow=true;
    this.showGrid=true;
  

}
focusColumn = 4;
onEditorPrepared(e) {
  if (e.row?.data !== null && e.row?.data !== undefined) {
    if ((e.row.data.condition1 === "FROM" || e.row.data.condition1 === "CE") && e.dataField === 'value1') {
      // debugger;
      // console.log(e.editorElement);
      setTimeout(function () {
        e.editorElement.focus();
        e.component.focus(e.editorElement);
      }, 100)

    }
    // { name: 'Bar Code', value:'BarCode'},
    // { name: 'Item Code', value:'ItemCode'},
    // { name: 'Item Group', value:'ItemGroup'},
    // { name: 'Collection', value:'Collection'},


  }

}
changeBuyLineTypeEditor(eventData, cellInfo: any) {
  // debugger;
  if (cellInfo.setValue) {
    cellInfo.setValue(eventData.value);
    // cellInfo.
  }
  let code = '';
  let name = '';
  let uom = '';
  // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
  this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
  this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
  this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);
  this.buytt.instance.saveEditData();
  this.buytt.instance.repaint();
}
changeGetLineTypeEditor(eventData, cellInfo: any) {
  // debugger;
  // if (cellInfo.setValue) {
  //   cellInfo.setValue(eventData.value);
  //   // cellInfo.
  // }

  // let code = '';
  // let name = '';
  // let uom= '';
  // // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
  // this.gett.instance.cellValue(cellInfo.rowIndex, 'lineCode', code); 
  // this.gett.instance.cellValue(cellInfo.rowIndex, 'lineName', name);  
  // this.gett.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);  
  // this.gett.instance.saveEditData();
  // this.gett.instance.repaint();
}
// changeGetCollectionEditor(eventData, cellInfo: any)
// {
//   debugger;
//   if (cellInfo.setValue) {
//     cellInfo.setValue(eventData.value);
//     // cellInfo.
//   }
// }
onEditorPreparing(e) {
  // debugger;
  // console.log()

  if (e.parentType === "dataRow" && (e.dataField === "condition2" || e.dataField === "value2") && e.row.data.condition1 === "CE") {
    e.editorOptions.readOnly = true;
    e.editorOptions.disabled = true;

  }
  if (e.parentType === "dataRow" && e.dataField === "lineType") {
    // e.editorOptions.disabled = (typeof e.row.data.lineType !== "number");

  }
  // 
  // if (e.dataField === 'lineType') {  
  //   debugger; 
  //   //  alert(e.row.data.lineType);
  // }  
  // if (e.parentType === "dataRow" && (e.dataField === "maxAmtDis") && e.row.data.condition1==="Discount Percent") { 
  //   e.editorOptions.readOnly = false;
  //   e.editorOptions.disabled = false;
  // }
  // else
  // {
  //   e.editorOptions.readOnly = true;
  //   e.editorOptions.disabled = true;
  // }
}
setBuyCodition1Value(rowData: any, value: any): void {
  // debugger;
  if (value === 'CE') {
    rowData.condition2 = '';
  }
  else {
    rowData.condition2 = 'TO';
  }
  (<any>this).defaultSetCellValue(rowData, value);

  //  let element = (<any>this).getCellElement(rowData.rowIndex, 'value1');
  //  (<any>this).focus(element);
}
// @ViewChild(DxDataGridComponent, { static: false }) gett: DxDataGridComponent;
deleteRowGet() {
  // debugger;
  let dataSelected = this.gett.instance.getSelectedRowKeys();
  dataSelected.forEach(element => {
    // debugger;
    let rowIndex = this.gett.instance.getRowIndexByKey(element);
    this.gett.instance.deleteRow(rowIndex);
  });
  // this.gett.instance.

}

deleteRowExclude() {
  // debugger;
  let dataSelected = this.excludeGrid.instance.getSelectedRowKeys();
  dataSelected.forEach(element => {
    // debugger;
    let rowIndex = this.excludeGrid.instance.getRowIndexByKey(element);
    this.excludeGrid.instance.deleteRow(rowIndex);
  });
  // this.gett.instance.

}

deleteRowBuy() {
  // debugger;
  let dataSelected = this.buytt.instance.getSelectedRowKeys();
  dataSelected.forEach(element => {
    // debugger;
    let rowIndex = this.buytt.instance.getRowIndexByKey(element);
    this.buytt.instance.deleteRow(rowIndex);
  });
  // this.gett.instance.

}
applyPromotion(event: any) {
  debugger;
  // let stt: number= this.dataGrid.instance.totalCount() + 1; 
  // Array.from(event).forEach((item: any)=>{
  //    const line = new SSchemaLine();
  //    line.lineNum = stt;
  //    line.promoId = item.promoId;
  //    line.description = item.promoName;
  //    line.priority = stt;
  //    line.isApply = 'Y';
  //    this.schemaLine.push(line);
  //    stt++;
  // });
  // this.modalRef.hide();
  // this.promotionList = event;
  // this.router.navigate(["admin/promotion/setup"]);
  // this.router.navigate(["admin/promotion","copy", event[0].promoId]);
  this.modalRef.hide();
  // window.location.reload();
  this.router.navigate(["admin/promotion", "copy", event[0].promoId]).then(() => {
    window.location.reload();
  });
  // this.redirectTo();
}
isWalkin = true;
isVoucher = false;
handleVoucherChange(value) {
  this.isVoucher = value;

}
@ViewChild('chkIsVoucher', { static: false }) chkIsVoucher;
@ViewChild('chkIsSchema', { static: false }) chkIsSchema;
@ViewChild('chkWakin', { static: false }) chkWakin;
@ViewChild('cbbCustomer', { static: false }) cbbCustomer;
@ViewChild('txtCustomer', { static: false }) txtCustomer;
@ViewChild('btnSearch', { static: false }) btnSearch;


handleValueChange(value) {
  // debugger;

  if (value === true) {
    this.isWalkin = true;
    let defaultCus = this.authService.getDefaultCustomer();
    if (this.sourceCRM === 'Capi') {
      this.loyalty.customerType = "C";
      this.CustomerSelected = defaultCus.mobile + ",";// "CUS00000,";
      let customer: SLoyaltyCustomer = new SLoyaltyCustomer();

      customer.customerType = this.loyalty.customerType;
      customer.customerValue = defaultCus.mobile;
      customer.companyCode = this.authService.storeSelected().companyCode;
      this.loyalty.loyaltyCustomers.push(customer);
    }
    else {
      let defCus=this.authService.storeSelected().defaultCusId;
      this.loyalty.customerType = "C";

      this.CustomerSelected = defCus+ ",";
      let customer: SLoyaltyCustomer = new SLoyaltyCustomer();

      customer.customerType = this.loyalty.customerType;
      customer.customerValue = defCus;
      customer.companyCode = this.authService.storeSelected().companyCode;
      this.loyalty.loyaltyCustomers.push(customer);
    }
    this.enableCustomer=true;
  }
  else {
    this.isWalkin = false;
    this.loyalty.customerType = "C";
    this.CustomerSelected = "";
    this.enableCustomer=false;
  }
  
}

getdataSource(type) {
  let result = null;
  if (type === 'ItemCode' || type === 'BarCode') {
    result = this.itemList;
  }
  if (type === 'Collection') {
    result = this.collectionItems;
  }
  if (type === 'ItemGroup') {
    result = this.itemGroup;
  }
  // if (type === 'ItemGroup') {
  //   result = this.merchandiseCategory;
  // }
  // this.gett.repaint();
  return result;
}
onToolbarPreparing(e) {
  var toolbarItems = e.toolbarOptions.items;
  toolbarItems.forEach(function (item) {
    if (item.name === "revertButton") {
      item.options.onClick = function (args) {
        e.component.cancelEditData();
        alert("Editing is cancelled");
      };
    }
  });
}
setGetLineTypeValue(rowData: any, value: any) {
  // debugger;
  rowData.keyId = null;
  rowData.lineCode = null;
  rowData.lineName = '';
  rowData.lineUom = '';
  // rowData.CityID = null;
  (<any>this).defaultSetCellValue(rowData, value);
  // this
}
setBuyLineTypeValue(rowData: any, value: any) {
  // debugger;
  rowData.keyId = null;
  rowData.lineCode = null;
  rowData.lineName = '';
  rowData.lineUom = '';
  // rowData.CityID = null;
  (<any>this).defaultSetCellValue(rowData, value);
  // this
}
setGetCodition1Value(rowData: any, value: any): void {
  // debugger;
  if (value === 'CE') {
    rowData.condition2 = '';
  }
  else {
    rowData.condition2 = 'TO';
  }
  (<any>this).defaultSetCellValue(rowData, value);
  // console.log(this);
  //  let element = (<any>this).getCellElement(rowData.rowIndex, 'value1');
  //  (<any>this).focus(element);
}
buygridShow = true;
getgridShow = true;
// public refresh() {
//   this.buygridShow = false;
//   this.getgridShow = false;
//   setTimeout(x=>this.isShowNumpadDiscount=true);
// }
promotionTypeChange(event) {
  debugger;
  if(event!==null && event!==undefined)
  {
    if ( this.promotionTypeChangeNum > 0) {
      setTimeout(() => {
        this.buyLines = [];
        this.getLines = [];
        this.loyalty.totalBuyFrom = null;
        this.loyalty.totalBuyTo = null;
        // this.loyalty.totalGetType = null;
        // this.loyalty.totalGetValue = 0; 
        // this.loyalty.maxTotalGetValue = null;
      }, 10)
    }

    this.resetGetGrid();
    this.resetBuyGrid();
    this.showGrid =false;
  
    this.getTabSelected = 0;
    if (event === 1  ) {
      this.conditionType = [
        { name: 'Amount', value: 'Amount' },
        { name: 'Quantity', value: 'Quantity' },
        // { name: 'Accumulated', value: 'Accumulated' },

      ]
    }
    else {
      this.conditionType = [
        { name: 'Amount', value: 'Amount' },
        { name: 'Quantity', value: 'Quantity' },

      ]
    }
    if (event === 1  ) //Product
    {
      this.buyTab = false;
      this.getTab = true;
      this.getTabSelected = 1;
      // this.buyTabtotalText1 = true;
      // this.buyTabtotalText2 = true;
      // this.getTabtotalText1 = true;
      // this.getTabtotalText2 = true;
      this.getTabcondition1 = true;
      this.getTabcondition2 = true;
      this.getTabvalue1 = true;
      this.getTabvalue2 = true;

      this.getTabconditionType = true;
      this.buyTabtotalText1 = false;
      this.buyTabtotalText2 = false;
      this.getTabtotalText1 = true;
      this.getTabtotalText2 = true;
      
      // this.valueType = this.loyalty.valueSingleType;
    }
    // if (event === 2) //Buy X Get Y
    // {
    //   this.buyTab = true;
    //   this.getTab = true;
    //   this.getTabconditionType = false;
    //   this.getTabcondition1 = false;
    //   this.getTabcondition2 = false;
    //   this.getTabvalue1 = false;
    //   this.getTabvalue2 = false;

    //   this.buyTabtotalText1 = true;
    //   this.buyTabtotalText2 = true;
    //   this.getTabtotalText1 = true;
    //   this.getTabtotalText2 = true;
    // }

    // if (event === 3) //Combo
    // {
    //   this.buyTab = true;
    //   this.getTab = true;
    //   this.getgridShow = false;
    //   this.getTabconditionType = false;
    //   this.getTabcondition1 = false;
    //   this.getTabcondition2 = false;
    //   this.getTabvalue1 = false;
    //   this.getTabvalue2 = false;

    //   this.buyTabtotalText1 = true;
    //   this.buyTabtotalText2 = true;
    //   this.getTabtotalText1 = false;
    //   this.getTabtotalText2 = false;
    // }
    if (event === 2  ) //Spend
    {
      this.buyTab = true;
      this.getTab = true;
      this.buygridShow = false;
      this.getgridShow = false;
      this.getTabcondition1 = false;
      this.getTabcondition2 = false;
      this.getTabvalue1 = false;
      this.getTabvalue2 = false;
      this.getTabconditionType = false;
      this.buyTabtotalText1 = false;
      this.buyTabtotalText2 = false;
      this.getTabtotalText1 = false;
      this.getTabtotalText2 = false;


    }
    
    if ( event === 3) //Lucky 
    {
      this.buyTab = true;
      this.getTab = false;
      this.buygridShow = true;
      this.getgridShow = false;
      this.getTabcondition1 = false;
      this.getTabcondition2 = false;
      this.getTabvalue1 = false;
      this.getTabvalue2 = false;
      this.getTabconditionType = false;
      this.buyTabtotalText1 = false;
      this.buyTabtotalText2 = false;
      this.getTabtotalText1 = false;
      this.getTabtotalText2 = false;
      this.isWalkin =false;
      setTimeout(x=> { 
        this.loyalty.customerType= "A";
      },10 );
    
    }
    debugger;

    // this.buyLines= [];
    // this.getLines= [];
    // this.excludeLines= [];
    // setTimeout(x=> { 
    //   this.showGrid=true;
    // } );
    setTimeout(x => {
      this.showGrid = true;
      this.promotionTypeChangeNum++;
    });
  }
  
}
promotionTypeChangeNum = 0;
// cols: any = [
//   { name: 'Buy Type', value:'Type'},
//   { name: 'Buy Item', value:'Item'},
//   { name: 'Buy Name', value:'Name'},
//   { name: 'Buy UOM', value:'UOM'},
//   { name: 'Value Type', value:'ValueType'},
//   { name: 'Condition 1', value:'Condition1'},
//   { name: 'Value 1', value:'Value1'},
//   { name: 'Condition 2', value:'Condition2'},
//   { name: 'Value 2', value:'Value2'}, 
//   { name: 'Get Value', value:'GetValue'},
// ];
@ViewChild('gett', { static: false }) gett;
@ViewChild('buytt', { static: false }) buytt;
@ViewChild('excludeGrid', { static: false }) excludeGrid;
merchandiseCategory: MMerchandiseCategory[] = [];
itemGroup: any = [];
loadMerchandiseCategory() {
  this.itemgroupService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {

    if (response.success) {
      this.itemGroup = [];
      response.data.forEach(cat => {
        cat.keyId = cat.igid;
        this.itemGroup.push({ keyId: cat.igid, id: cat.igid, name: cat.igname })
      });
      // this.merchandiseCategory = response.data;
    }
    else {
      this.alertifyService.warning(response.message);
    }

  })

  // this.merchandiseService.getByCompany(this.authService.getCurrentInfor().companyCode, '', '', '').subscribe((response: any) => {
  //   //   this.merchandiseCategory = response;
  //   //  debugger;
  //   if (response.success) {
  //     response.data.forEach(cat => {
  //       cat.keyId = cat.mcid;
  //     });
  //     this.merchandiseCategory = response.data;
  //   }
  //   else {
  //     this.alertifyService.warning(response.message);
  //   }

  // })
}
collectionItems: string[] = [];
loadItemCollection() {
  this.commonService.getItemCollectionList().subscribe((response: any) => {
    //   this.merchandiseCategory = response;
    //  debugger;
    if (response.success) {
      this.collectionItems = response.data;
    }
    else {
      this.alertifyService.warning(response.message);
    }

  })
}
 
 
treeDataSource: any;
treeBoxValue: string[];
gridDataSource: any;
gridBoxValue: string[] = [];
// rankTypes: string[] = [];

gridStoreDataSource: any;
gridStoreBoxValue: string[] = [];


loadRankType()
{
  this.rankService.getAll(this.authService.storeSelected().companyCode).subscribe((response: any)=>{
    if(response.success)
    {
      this.rankType = response.data;
    }
    else
    {
      
    }
   
    debugger;
  })
}
constructor(private authService: AuthService, private itemgroupService: ItemgroupService, private excelSrv: ExcelService, public storeService: StoreService, private rankService: LoyaltyrankService,  public commonService: CommonService, private merchandiseService: Merchandise_categoryService, 
  private windowService: WindowService, private modalService: BsModalService, private alertifyService: AlertifyService,
  private crmService: CrmService, private router: Router, private route: ActivatedRoute, private itemService: ItemService) {

  this.loyalty = new SLoyaltyHeader();
  this.allMode = 'allPages';
  this.checkBoxesMode = 'always'
  this.CustomerSelected = '';
  this.customizeText= this.customizeText.bind(this);
  this.getdataSource = this.getdataSource.bind(this);
  //subscribe to the window resize event
  //  windowService.height$.subscribe((value:any) => {
  //Do whatever you want with the value.
  //You can also subscribe to other observables of the service
  // this.buytt.in
  // });
}
redirectTo(uri: string) {
  this.router.navigate([uri]).then(() => {
    window.location.reload();
  });

}
downloadTemplate() {
  this.commonService.download('S_Promotion.xlsx');
}


capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// onFileChange(evt: any) {
//   // debugger;
//   const target: DataTransfer = <DataTransfer>(evt.target);
//   if (target.files.length !== 1) throw new Error('Cannot use multiple files');

//   const reader: FileReader = new FileReader();
//   reader.readAsBinaryString(target.files[0]);
//   reader.onload = (e: any) => {
//     // debugger;
//     const bstr: string = e.target.result;
//     const dataHeader = <any[]>this.excelSrv.importFromFile(bstr, 0);
//     const dataBuy = <any[]>this.excelSrv.importFromFile(bstr, 1);
//     const dataGet = <any[]>this.excelSrv.importFromFile(bstr, 2);
//     const dataCustomer = <any[]>this.excelSrv.importFromFile(bstr, 3);
//     const dataStore = <any[]>this.excelSrv.importFromFile(bstr, 4);


//     const header: string[] = Object.getOwnPropertyNames(new PromotionViewModel());
//     const buy: string[] = Object.getOwnPropertyNames(new SPromoBuy());
//     const get: string[] = Object.getOwnPropertyNames(new SPromoGet());
//     const customer: string[] = Object.getOwnPropertyNames(new SPromoCustomer());
//     const store: string[] = Object.getOwnPropertyNames(new SPromoStore());

//     // debugger;
//     // console.log(data);
//     const excelHeader = dataHeader[0];
//     const importedDataHeader = dataHeader.slice(1);//.slice(1, -2); 

//     const excelBuy = dataBuy[0];
//     const importedDataBuy = dataBuy.slice(1);//.slice(1, -2); 

//     const excelGet = dataGet[0];
//     const importedDataGet = dataGet.slice(1);//.slice(1, -2); 

//     const excelCustomer = dataCustomer[0];
//     const importedDataCustomer = dataCustomer.slice(1);//.slice(1, -2); 

//     const excelStore = dataStore[0];
//     const importedDataStore = dataStore.slice(1);//.slice(1, -2); 

//     this.importContent = importedDataHeader.map(arr => {
//       // debugger;
//       const obj = {};
//       for (let i = 0; i < excelHeader.length; i++) {
//         for (let j = 0; j < header.length; j++) {
//           const ki = this.capitalizeFirstLetter(excelHeader[i]);
//           const kj = this.capitalizeFirstLetter(header[j]);
         
//           if (ki.toLowerCase() === kj.toLowerCase()) {
           
//             if(ki.toLowerCase() === 'validdatefrom' || ki.toLowerCase() === 'validdateto')
//             {
//               // debugger;
//               if(arr[i]!==undefined && arr[i]!==null && arr[i]!=='')
//               {
//                 let date = this.excelSrv.excelDateToJSDate(arr[i]);
//                 obj[header[j]] = date;// new Date(arr[i] * 1000);;
//               }
             
//               // validDateFrom: Date | string | null=null;
//               // validDateTo: Date | string | null=null;
//               // var date = new Date(arr[i] * 1000);
             
//             }
//             else
//             {
//               obj[header[j]] = arr[i];
//             }
            
           
//           }
//         }
//       }

//       return <PromotionViewModel>obj;
//     });
//     let buyX = importedDataBuy.map(arr => {
//       // debugger;
//       const obj = {};
//       for (let i = 0; i < excelBuy.length; i++) {
//         for (let j = 0; j < buy.length; j++) {
//           const ki = this.capitalizeFirstLetter(excelBuy[i]);
//           const kj = this.capitalizeFirstLetter(buy[j]);
//           // debugger;
//           if (ki.toLowerCase() === kj.toLowerCase()) {
//             obj[buy[j]] = arr[i];
//           }
//         }
//       }
//       return <SPromoBuy>obj;
//     })
//     let getX = importedDataGet.map(arr => {
//       // debugger;
//       const obj = {};
//       for (let i = 0; i < excelGet.length; i++) {
//         for (let j = 0; j < get.length; j++) {
//           const ki = this.capitalizeFirstLetter(excelGet[i]);
//           const kj = this.capitalizeFirstLetter(get[j]);
//           // debugger;
//           if (ki.toLowerCase() === kj.toLowerCase()) {
//             obj[get[j]] = arr[i];
//           }
//         }
//       }
//       return <SPromoGet>obj;
//     })
//     let customerX = importedDataCustomer.map(arr => {
//       // debugger;
//       const obj = {};
//       for (let i = 0; i < excelCustomer.length; i++) {
//         for (let j = 0; j < customer.length; j++) {
//           const ki = this.capitalizeFirstLetter(excelCustomer[i]);
//           const kj = this.capitalizeFirstLetter(customer[j]);
//           // debugger;
//           if (ki.toLowerCase() === kj.toLowerCase()) {
//             obj[customer[j]] = arr[i];
//           }
//         }
//       }
//       return <SPromoCustomer>obj;
//     })
//     let storeX = importedDataStore.map(arr => {
//       // debugger;
//       const obj = {};
//       for (let i = 0; i < excelStore.length; i++) {
//         for (let j = 0; j < store.length; j++) {
//           const ki = this.capitalizeFirstLetter(excelStore[i]);
//           const kj = this.capitalizeFirstLetter(store[j]);
//           // debugger;
//           if (ki.toLowerCase() === kj.toLowerCase()) {
//             obj[store[j]] = arr[i];
//           }
//         }
//       }
//       return <SPromoStore>obj;
//     })
//     // debugger
//     let promo = <PromotionViewModel>this.importContent[0];
//     promo.promoId = "ABC";

//     promo.promoBuys = buyX;
//     let NumX = 1;
//     promo.promoBuys.forEach(item => {
//       if (item.lineType === 'ItemCode') {

//         item.keyId = item.lineCode + item.lineUom;
//       }
//       if (item.lineNum === null || item.lineNum === undefined) {
//         item.lineNum = NumX;
//         NumX++;
//       }
//     });
//     promo.promoGets = getX;
//     let NumX1 = 1;
//     promo.promoGets.forEach(item => {
//       if (item.lineType === 'ItemCode') {
//         item.keyId = item.lineCode + item.lineUom;
//       }
//       if (item.lineNum === null || item.lineNum === undefined) {
//         item.lineNum = NumX1;
//         NumX1++;
//       }
//     });
//     // debugger;
//     promo.promoStores = storeX;
//     promo.promoCustomers = customerX;
//     this.promotion = promo;
//     this.bindPromotionToGrid(promo);
//     // console.log(promo);
//   };


// }

onRowPrepared(e) {
  // console.log('onRowPrepared');
  // debugger;
  if (e.rowType == "data" && (e.data.lines === null || e.data.lines === undefined || e.data.lines.length === 0 || e.data.lines === 'undefined')) {
    // debugger;
    e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");
    e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");

  }
}
// onImportData() {
//   let data = new DataImport();
//   data.promotion = this.importContent;

//   this.promotionService.import(data).subscribe((response: any) => {
//     if (response.success === true) {
//       if (response.data !== null && response.data !== undefined && response.data.length > 0) {
//         this.isResult = true;
//         this.importContent = response.data;
//       }
//       this.alertifyService.success("Import completed succesfully.");
//     }
//     else {
//       // debugger;
//       if (response.data !== null && response.data !== undefined && response.data.length > 0) {
//         this.isResult = true;
//         this.importContent = response.data;
//       }
//       this.alertifyService.warning("Import failed" + response.message);
//     }
//   });
// }
rankType=[];

sourceCRM = 'Local';
defaultControl() {
  this.isActive = true;
  this.isFri = true;
  this.isMon = true;
  this.isSat = true;
  this.isSun = true;
  this.isThu = true;
  this.isTue = true;
  this.isWed = true;
  this.isWalkin = true;
  let defaultCus = this.authService.getDefaultCustomer();
  if (this.sourceCRM === 'Capi') {
    this.loyalty.customerType = "C";
    this.CustomerSelected = defaultCus.mobile + ",";// "CUS00000,";
    let customer: SLoyaltyCustomer = new SLoyaltyCustomer();

    customer.customerType = this.loyalty.customerType;
    customer.customerValue = defaultCus.mobile;
    customer.lineNum = 1;
    customer.companyCode = this.authService.storeSelected().companyCode;
    this.loyalty.loyaltyCustomers.push(customer);
  }
  else {
    let defCus=this.authService.storeSelected().defaultCusId;
    this.loyalty.customerType = "C";
    this.CustomerSelected = defCus +",";
    let customer: SLoyaltyCustomer = new SLoyaltyCustomer();
    customer.customerType = this.loyalty.customerType;
    customer.customerValue = defCus;
    customer.lineNum = 1;
    customer.companyCode = this.authService.storeSelected().companyCode;
    this.loyalty.loyaltyCustomers.push(customer);
  }

  var newDate = new Date("1/1/2020 12:00:00 AM");
  var toDate = new Date("1/1/2020 11:59:00 PM");
  this.validTimeFrom = newDate;
  this.validTimeTo = toDate;

}
addNewPromotion() {
  this.router.navigate(["admin/promotion/setup"]);
}
updateCustomerSelected(event: MWICustomerModel[]) {
  // debugger;
  this.CustomerSelected = '';
  this.modalRef.hide();
  this.loyalty.loyaltyCustomers = [];
  let customers = '';
  let num = 1;
  event.forEach((item) => {
    customers += item.mobile + ';';
    let customer: SLoyaltyCustomer = new SLoyaltyCustomer();

    customer.customerType = this.loyalty.customerType;
    customer.customerValue = item.mobile.toString();
    customer.companyCode = this.authService.storeSelected().companyCode;;
    customer.lineNum = num;
    this.loyalty.loyaltyCustomers.push(customer);
    num++;
  });
  this.CustomerSelected = customers.substring(0, customers.length - 1);
}
openModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
}
enableCustomer=  false;
showCustomerRank= false;
 
customerValueChange(value)
{
  debugger;
  this.loyalty.loyaltyCustomers=[];
  this.loyalty.customerType = value;
  this.CustomerSelected="";
  this.enableCustomer = false;
  switch(value) { 
    case 'A': { 
       //statements; 
       this.CustomerSelected="All";
       this.enableCustomer = true;
       break; 
    } 
    case 'C': { 
       //statements; 
       this.showCustomerRank= false;
       break; 
    } 
    default: { 
       //statements; 
       this.showCustomerRank= true;
       break; 
    } 
 } 

 
}
 
now: Date = new Date();
loyaltyId: string = '';
mode: string = "";
functionId ="Adm_LoyaltySetup";
ngOnInit() {
  this.loadRankType();
  // debugger;
  this.sourceCRM = this.authService.getCRMSource();

  this.loyalty.loyaltyCustomers = [];
  this.CustomerSelected = '';
  this.route.params.subscribe(data => {
    debugger;
    this.mode = data['m'];
    this.loyaltyId = data['loyaltyId'];
    if (this.mode === "edit" || this.mode === "copy") {
      if (this.loyaltyId !== null && this.loyaltyId !== undefined) {
        this.loadPromotion();
      }
    }
    else {
      this.mode = "setup";
      this.defaultControl();
    }
  });
   
  //  this.promotionId='PICP00100000001';

  this.loadItemList();
  this.loadPromotionType();
  this.loadMerchandiseCategory();
  this.loadItemCollection();
  this.loadStore();
  if(this.mode==='edit')
  {
    this.canUpdate =  this.authService.checkRole(this.functionId , '', 'E' ); 
  }
  if(this.mode==='setup' || this.mode==='copy')
  {
    this.isWalkin = true;
    this.canUpdate =  this.authService.checkRole(this.functionId , '', 'I' );
  }
}
canUpdate = false;
bindPromotionToGrid(loyalty: SLoyaltyHeader) {
  debugger;
  // this.buyLines = loyalty.promoBuys;
  this.buyLines = loyalty.loyaltyBuy;
  // console.log('loyaltyBuy', loyalty.loyaltyBuy);
  this.getLines = loyalty.loyaltyEarns;
  this.excludeLines = loyalty.loyaltyExcludes;
  let customerList = loyalty.loyaltyCustomers;
  this.CustomerSelected  ='';
  if (customerList !== null) {
    customerList.forEach(customer => {
      this.CustomerSelected += customer.customerValue + ",";
    })
  }
  if (loyalty.isMon === 'Y' || loyalty.isMon.toString() === "1") { this.isMon = true } else { this.isMon = false };
  if (loyalty.isMon === 'Y' || loyalty.isFri.toString() === "1") { this.isFri = true } else { this.isFri = false };
  if (loyalty.isMon === 'Y' || loyalty.isSat.toString() === "1") { this.isSat = true } else { this.isSat = false };
  if (loyalty.isMon === 'Y' || loyalty.isSun.toString() === "1") { this.isSun = true } else { this.isSun = false };
  if (loyalty.isMon === 'Y' || loyalty.isThu.toString() === "1") { this.isThu = true } else { this.isThu = false };
  if (loyalty.isMon === 'Y' || loyalty.isTue.toString() === "1") { this.isTue = true } else { this.isTue = false };
  if (loyalty.isMon === 'Y' || loyalty.isWed.toString() === "1") { this.isWed = true } else { this.isWed = false };
  if (loyalty.status === 'Y') this.isActive = true; 
  let now = new Date();
  let hf, mf, ht, mt;
  if (loyalty.validTimeFrom == 0) {
    hf = mf = 0;
  }
  else {
    let str = loyalty.validTimeFrom.toString();
    let min = str.substr(-2);
    let hou = str.substr(0, min.length);
    hf = hou;
    mf = min;
  }
  if (loyalty.validTimeTo == 0) {
    ht = mt = 0;
  }
  else {
    let str = loyalty.validTimeTo.toString();
    let min = str.substr(-2);
    let hou = str.substr(0, min.length);
    ht = hou;
    mt = min;
  }
  let timeF: Date = new Date(now.getFullYear(), now.getMonth(), now.getDay(), hf, mf);
  this.validTimeFrom = timeF;
  let timeT: Date = new Date(now.getFullYear(), now.getMonth(), now.getDay(), ht, mt);
  this.validTimeTo = timeT;
  // debugger;
  if (loyalty.loyaltyCustomers !== null && loyalty.loyaltyCustomers !== undefined && loyalty.loyaltyCustomers.length > 0) {
    this.gridBoxValue = [];
    loyalty.loyaltyCustomers.forEach(customer => {
      this.gridBoxValue.push(customer.customerValue);
    });

  }
  // debugger;
  if (loyalty.loyaltyStores !== null && loyalty.loyaltyStores !== undefined && loyalty.loyaltyStores.length > 0) {
    this.gridStoreBoxValue = [];
    loyalty.loyaltyStores.forEach(store => {
      this.gridStoreBoxValue.push(store.storeValue);
    });

  }
  // console.log(this.promotion);
}
loadPromotion() {
  debugger;
  let comp = this.authService.storeSelected().companyCode;

  this.crmService.getById(comp, this.loyaltyId).subscribe((response: any) => {
    if (response.success === true) {
      debugger
      this.loyalty = response.data;
      console.log('this.loyalty', this.loyalty);
      this.bindPromotionToGrid(response.data);
    }
    else {
      this.alertifyService.warning('get detail promotion id: ' + this.loyaltyId + ' failed. Message: ' + response.message);
    }
  })
}
validTimeFrom: any;
validTimeTo: any;
leftPad(number, targetLength) {
  var output = number + '';
  while (output.length < targetLength) {
    output = '0' + output;
  }
  return output;
}
checkVallid(promoType) {
  let result = true;
  if (promoType === 1) //Singe Discount
  {
    // this.buyTab = false;
    // this.getTab = true;
    // if (this.getLines === null || this.getLines === undefined || this.getLines.length === 0) {
    //   this.alertifyService.warning('Please input data to get grid');
    //   result = false;
    // }
  }
  // if (promoType === 2) //Buy X Get Y
  // {
  //   // this.buyTab = true;
  //   // this.getTab = true; 
  //   if (this.getLines === null || this.getLines === undefined || this.getLines.length === 0 || this.buyLines === null || this.buyLines === undefined || this.buyLines.length === 0) {
  //     this.alertifyService.success('Please input data to get grid');
  //     result = false;
  //   }
  // }
  // if (promoType === 3) //Combo
  // {
  //   // this.buyTab = true;
  //   // this.getTab = true;
  //   // this.getgridShow=false;
  //   if (this.buyLines === null || this.buyLines === undefined || this.buyLines.length === 0) {
  //     this.alertifyService.warning('Please input data to buy grid');
  //     result = false;
  //   }
  // }
  if (promoType === 2) //Total Bill
  {
    // this.buyTab = true;
    // this.getTab = true;
    // this.buygridShow=false;
    // if(this.getLines === null|| this.getLines === undefined || this.getLines.length ===0)
    // {
    //   this.alertifyService.success('Please input data to get grid');
    //   result = false;
    // }
  }
  // if (promoType === 6 || promoType === 7) //Mix and Match
  // {
  //   // this.buyTab = true;
  //   // this.getTab = true;
  //   if (this.getLines === null || this.getLines === undefined || this.getLines.length === 0 || this.buyLines === null || this.buyLines === undefined || this.buyLines.length === 0) {
  //     this.alertifyService.success('Please input data to get grid');
  //     result = false;
  //   }
  // }
  return result;
}

savePromotion() {

  // debugger;
  // let bT= this.GetDateFormat(this.promotion.validDateFrom);
  // let bF= this.GetDateFormat(this.promotion.validDateTo);

  // this.promotion.validDateFrom=bT;
  // this.promotion.validDateTo=bF;
  // debugger;

  // let promotion = new PromotionViewModel();

  if (this.loyalty.loyaltyType === null || this.loyalty.loyaltyType === undefined) {
    this.alertifyService.success('please select type');
  }
  else {
    if (this.loyalty.validDateFrom === null || this.loyalty.validDateFrom === undefined || this.loyalty.validDateTo === null || this.loyalty.validDateTo === undefined) {
      this.alertifyService.success('please input from date/to date');
    }
    else {
      if (this.checkVallid(this.loyalty.loyaltyType) === true) {
          Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to save!',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
              let buylines = [];
              this.buyLines.forEach((item) => { item.lineNum = 0; buylines.push(item) });
              let getlines = [];
              this.getLines.forEach((item) => { item.lineNum = 0; getlines.push(item) });
              // this.loyalty.promoBuys = buylines;
              this.loyalty.loyaltyEarns = getlines;

              let excludeLines = [];
              this.excludeLines.forEach((item) => { item.lineNum = 0; excludeLines.push(item) });
              this.loyalty.loyaltyBuy = buylines;
              this.loyalty.loyaltyExcludes = excludeLines;

              this.loyalty.companyCode = this.authService.storeSelected().companyCode;
              let hF = this.validTimeFrom.getHours();
              let mF = this.validTimeFrom.getMinutes();
              let hT = this.validTimeTo.getHours();
              let mT = this.validTimeTo.getMinutes();

              this.loyalty.validTimeFrom = parseInt(this.leftPad(hF, 2) + this.leftPad(mF, 2));
              this.loyalty.validTimeTo = parseInt(this.leftPad(hT, 2) + this.leftPad(mT, 2));
              if (this.isMon === true) {
                this.loyalty.isMon = 'Y';
              } else { this.loyalty.isMon = 'N'; }
              if (this.isTue === true) {
                this.loyalty.isTue = 'Y';
              } else { this.loyalty.isTue = 'N'; }
              if (this.isWed === true) {
                this.loyalty.isWed = 'Y';
              } else { this.loyalty.isWed = 'N'; }
              if (this.isThu === true) {
                this.loyalty.isThu = 'Y';
              } else { this.loyalty.isThu = 'N'; }
              if (this.isFri === true) {
                this.loyalty.isFri = 'Y';
              } else { this.loyalty.isFri = 'N'; }
              if (this.isSat === true) {
                this.loyalty.isSat = 'Y';
              } else { this.loyalty.isSat = 'N'; }
              if (this.isSun === true) {
                this.loyalty.isSun = 'Y';
              } else { this.loyalty.isSun = 'N'; }
              // if (this.isCombine === true) {
              //   this.loyalty.isCombine = 'Y';
              // } else { this.loyalty.isCombine = 'N'; }
              if (this.isActive === true) {
                this.loyalty.status = 'Y';
              } else { this.loyalty.status = 'N'; }

              if (this.mode === "copy") {
                this.loyalty.loyaltyId = "";
              }
              if (this.mode === "setup") {
                debugger
                let XDate= new Date(this.loyalty.validDateFrom.toString());
                let YDate= new Date(this.loyalty.validDateTo.toString());
                let bT = this.GetDateFormat(XDate);
                let bF = this.GetDateFormat(YDate);
                this.loyalty.validDateFrom = bT;
                this.loyalty.validDateTo = bF;
              }
              let storeNum = 1;
              if (this.gridBoxValue !== null && this.gridBoxValue !== undefined && this.gridBoxValue.length > 0) {
                this.loyalty.loyaltyCustomers = [];
                this.gridBoxValue.forEach(customerX => {
                  debugger;
                  let customer = new SLoyaltyCustomer();
                  customer.customerValue = customerX;
                  customer.lineNum = storeNum;
                  customer.customerType = this.loyalty.customerType;
                  this.loyalty.loyaltyCustomers.push(customer);
                  storeNum++;
                });
              }
              else {
                this.loyalty.loyaltyCustomers = [];
              }
              // let storeNum = 1;
              if (this.gridStoreBoxValue !== null && this.gridStoreBoxValue !== undefined && this.gridStoreBoxValue.length > 0) {
                this.loyalty.loyaltyStores = [];
                this.gridStoreBoxValue.forEach(storeSelected => {
                  // debugger;
                  let store = new SLoyaltyStore();
                  store.storeValue = storeSelected;
                  store.lineNum = storeNum.toString();
                  this.loyalty.loyaltyStores.push(store);
                  storeNum++;
                });
              }
              else {
                this.loyalty.loyaltyStores = [];
              }

              // if(this.mode==="edit")
              // {
              //   this.promotion.promoId="";
              // }
              // this.promotion.validDateFrom ="2020-03-03";
              // debugger;
              // let bT= this.GetDateFormat(this.promotion.validDateFrom);
              // let bF= this.GetDateFormat(this.promotion.validDateTo);
              // // 
              // // 
              // debugger;

              // console.log(a);
              // console.log(b);
              // let fD= this.validDateFrom.getDate();
              // let fM= this.validDateFrom.getMonth();
              // let fY= this.validDateFrom.getFullYear();

              // // this.promotion.validDateTo = 
              // console.log(fY +"/" + fM +"/" + fD);
              this.loyalty.createdBy = this.authService.getCurrentInfor().username;
              this.loyalty.modifiedBy = this.authService.getCurrentInfor().username;
              this.crmService.saveEntity(this.loyalty).subscribe((response: any) => {
                if (response.success) {
                  //  debugger;
                  // this.alertifyService.success('save completed successfully. ' + response.message);
                  Swal.fire('Setup Loyalty','save completed successfully','success').then(()=>{
                    this.router.navigate(["admin/crm/edit", response.data]).then(()=>{
                      window.location.reload();
                    });
                  })
                  
                }
                else {
                  // this.alertifyService.warning('save failed. Message: ' + response.message);
                  Swal.fire('Setup Loyalty', 'save failed. Message: ' + response.message, 'warning'); 
                }
              }, error =>{
                console.log('Loyalty error' , error)
                Swal.fire('Setup Loyalty', 'Failed to save Loyalty', 'error'); 
              });
          }
        });
        
      }

    }

  }


}
GetDateFormat(date) {
  var month = (date.getMonth() + 1).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return date.getFullYear() + '-' + month + '-' + (day);
}
 
validDateFrom: any;
loadPromotionType() {
  this.crmService.getType().subscribe((response:any) => {
    this.loyaltyType = response.data;
    console.log('this.loyaltyType');
    console.log(this.loyaltyType);
  });
}
loadItemList() {
  this.itemService.getItemViewList(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', '', '', '','')
    .subscribe((response: any) => {
    this.itemList = response.data;
  });
}
addRowBuy() {
  setTimeout(x=> { 
    this.buytt.instance.addRow();
  },300 );
  
}
addRowGet() {
  setTimeout(x=> { 
    this.gett.instance.addRow();
  },300 );
 
}
addRowExclude() {
  setTimeout(x=> { 
    this.excludeGrid.instance.addRow();
  },300 );
  
}
onItemBuySelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {

  console.log(cellInfo);
  cellInfo.setValue(selectedRowKeys[0]);

  if (selectedRowKeys.length > 0) {
    // debugger;
    let typeLine = event.selectedRowsData[0].lineType;
    
      dropDownBoxComponent.close();

      let code = event.selectedRowsData[0].itemCode;
      let name = event.selectedRowsData[0].itemName;
      let uom = event.selectedRowsData[0].uomCode;
      // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
      this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
      this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
      this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);
  

  }

}
onBarcodeItemBuySelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {

  console.log(cellInfo);
  cellInfo.setValue(selectedRowKeys[0]);

  if (selectedRowKeys.length > 0) {
    // debugger;
    let typeLine = event.selectedRowsData[0].lineType;
    
      dropDownBoxComponent.close();

      let code = event.selectedRowsData[0].barCode;
      let name = event.selectedRowsData[0].itemName;
      let uom = event.selectedRowsData[0].uomCode;
      // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
      this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
      this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
      this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);
   

  }

}
onCollectionBuySelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
  // debugger;
  console.log(cellInfo);
  cellInfo.setValue(selectedRowKeys[0]);

  if (selectedRowKeys.length > 0) {
    dropDownBoxComponent.close();
    // mcid: string="";
    // companyCode: string="";
    // mchier: string="";
    // mcname: string="";
    let code = event.selectedRowsData[0].keyId;
    let name = event.selectedRowsData[0].keyId;
    let uom = '';
    // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
    this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
    this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
    this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);

  }

}

onGroupBuySelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
  // debugger;
  console.log(cellInfo);
  cellInfo.setValue(selectedRowKeys[0]);

  if (selectedRowKeys.length > 0) {
    dropDownBoxComponent.close();
    // mcid: string="";
    // companyCode: string="";
    // mchier: string="";
    // mcname: string="";
    let code = event.selectedRowsData[0].id;
    let name = event.selectedRowsData[0].name;
    let uom = '';
    // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
    this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
    this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
    this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);

  }

}


onBarcodeItemGetSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
  // debugger;
  console.log(cellInfo);
  cellInfo.setValue(selectedRowKeys[0]);

  if (selectedRowKeys.length > 0) {
    let typeLine = cellInfo.data.lineType;
    dropDownBoxComponent.close();
    let code = event.selectedRowsData[0].barCode;
    let name = event.selectedRowsData[0].itemName;
    let uom = event.selectedRowsData[0].uomCode;
    // if (typeLine === "ItemCode") {

    // }
    // else {
    //   code = event.selectedRowsData[0].barCode;
    // }
    // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
    this.gett.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
    this.gett.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
    this.gett.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);
    

  }

}
onItemGetSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
  // debugger;
  console.log(cellInfo);
  cellInfo.setValue(selectedRowKeys[0]);

  if (selectedRowKeys.length > 0) {
    let typeLine = cellInfo.data.lineType;
    dropDownBoxComponent.close();
    let code = event.selectedRowsData[0].itemCode;
    let name = event.selectedRowsData[0].itemName;
    let uom = event.selectedRowsData[0].uomCode;
    // if (typeLine === "ItemCode") {

    // }
    // else {
    //   code = event.selectedRowsData[0].barCode;
    // }
    // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
    this.gett.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
    this.gett.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
    this.gett.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);
    // dropDownBoxComponent.close();

    // let code =event.selectedRowsData[0].itemCode;
    // let name = event.selectedRowsData[0].itemName;
    // let uom= event.selectedRowsData[0].uomCode;
    // // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
    // this.gett.instance.cellValue(cellInfo.rowIndex, 'lineCode', code); 
    // this.gett.instance.cellValue(cellInfo.rowIndex, 'lineName', name);  
    // this.gett.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);  

  }

}
onCollectionGetSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
  // debugger;
  console.log(cellInfo);
  cellInfo.setValue(selectedRowKeys[0]);

  if (selectedRowKeys.length > 0) {
    dropDownBoxComponent.close();
    // mcid: string="";
    // companyCode: string="";
    // mchier: string="";
    // mcname: string="";
    let code = event.selectedRowsData[0].keyId;
    let name = event.selectedRowsData[0].keyId;
    let uom = '';
    // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
    this.gett.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
    this.gett.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
    this.gett.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);

  }

}

onGroupGetSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
  debugger;
  console.log(cellInfo);
  cellInfo.setValue(selectedRowKeys[0]);

  if (selectedRowKeys.length > 0) {
    dropDownBoxComponent.close();
    // mcid: string="";
    // companyCode: string="";
    // mchier: string="";
    // mcname: string="";
    let code = event.selectedRowsData[0].id;
    let name = event.selectedRowsData[0].name;
    let uom = '';
    // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
    this.gett.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
    this.gett.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
    this.gett.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);

  }

}


onBarcodeItemExcludeSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
  // debugger;
  console.log(cellInfo);
  cellInfo.setValue(selectedRowKeys[0]);

  if (selectedRowKeys.length > 0) {
    let typeLine = cellInfo.data.lineType;
    dropDownBoxComponent.close();
    let code = event.selectedRowsData[0].barCode;
    let name = event.selectedRowsData[0].itemName;
    let uom = event.selectedRowsData[0].uomCode;
    // if (typeLine === "ItemCode") {

    // }
    // else {
    //   code = event.selectedRowsData[0].barCode;
    // }
    // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
    this.excludeGrid.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
    this.excludeGrid.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
    this.excludeGrid.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);
    

  }

}
onItemExcludeSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
  // debugger;
  console.log(cellInfo);
  cellInfo.setValue(selectedRowKeys[0]);

  if (selectedRowKeys.length > 0) {
    let typeLine = cellInfo.data.lineType;
    dropDownBoxComponent.close();
    let code = event.selectedRowsData[0].itemCode;
    let name = event.selectedRowsData[0].itemName;
    let uom = event.selectedRowsData[0].uomCode;
    // if (typeLine === "ItemCode") {

    // }
    // else {
    //   code = event.selectedRowsData[0].barCode;
    // }
    // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
    this.excludeGrid.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
    this.excludeGrid.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
    this.excludeGrid.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);
    // dropDownBoxComponent.close();

    // let code =event.selectedRowsData[0].itemCode;
    // let name = event.selectedRowsData[0].itemName;
    // let uom= event.selectedRowsData[0].uomCode;
    // // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
    // this.gett.instance.cellValue(cellInfo.rowIndex, 'lineCode', code); 
    // this.gett.instance.cellValue(cellInfo.rowIndex, 'lineName', name);  
    // this.gett.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);  

  }

}
onCollectionExcludeSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
  // debugger;
  console.log(cellInfo);
  cellInfo.setValue(selectedRowKeys[0]);

  if (selectedRowKeys.length > 0) {
    dropDownBoxComponent.close();
    // mcid: string="";
    // companyCode: string="";
    // mchier: string="";
    // mcname: string="";
    let code = event.selectedRowsData[0].keyId;
    let name = event.selectedRowsData[0].keyId;
    let uom = '';
    // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
    this.excludeGrid.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
    this.excludeGrid.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
    this.excludeGrid.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);

  }

}

onGroupExcludeSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
  debugger;
  console.log(cellInfo);
  cellInfo.setValue(selectedRowKeys[0]);

  if (selectedRowKeys.length > 0) {
    dropDownBoxComponent.close();
    // mcid: string="";
    // companyCode: string="";
    // mchier: string="";
    // mcname: string="";
    let code = event.selectedRowsData[0].id;
    let name = event.selectedRowsData[0].name;
    let uom = '';
    // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
    this.excludeGrid.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
    this.excludeGrid.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
    this.excludeGrid.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);

  }

}
}
