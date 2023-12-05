import { ChangeDetectionStrategy, Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { parseDate } from 'ngx-bootstrap/chronos';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemSearch } from 'src/app/shop/components/shop-search-item/shop-search-item.component';
import { WindowService } from 'src/app/windowService';
import { MCustomerGroup } from 'src/app/_models/customer';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { MWICustomerModel } from 'src/app/_models/mwi/customer';
import { SPromoBuy } from 'src/app/_models/promotion/promotionbuy';
import { SPromoCustomer } from 'src/app/_models/promotion/promotioncus';
import { SPromoGet } from 'src/app/_models/promotion/promotionget';
import { SPromoHeader } from 'src/app/_models/promotion/promotionheader';
import { SPromoStore } from 'src/app/_models/promotion/promotionstore';
import { MPromoType } from 'src/app/_models/promotion/promotiontype';
import { InActivePromoViewModel, PromotionViewModel } from 'src/app/_models/promotion/promotionViewModel';
import { MStore } from 'src/app/_models/store';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { CustomergroupService } from 'src/app/_services/data/customergroup.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { ItemgroupService } from 'src/app/_services/data/itemgroup.service';
import { LoyaltyrankService } from 'src/app/_services/data/loyaltyrank.service';
import { Merchandise_categoryService } from 'src/app/_services/data/merchandise_category.service';
import { PaymentmethodService } from 'src/app/_services/data/paymentmethod.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { PromotionService } from 'src/app/_services/promotion/promotion.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { promotion } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { isBuffer } from 'util';
import { ManagementPromotionInputOtComponent } from '../management-promotion-input-ot/management-promotion-input-ot.component';

@Component({
  selector: 'app-management-promotion-setup',
  templateUrl: './management-promotion-setup.component.html',
  styleUrls: ['./management-promotion-setup.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementPromotionSetupComponent implements OnInit {
  // @HostListener('window:resize', ['$event'])
  value: any[] = [];
  importContent: PromotionViewModel[] = [];
  isResult = false;

  modalRef: BsModalRef;
  CustomerSelected: string = '';
  promotion: PromotionViewModel;
  header: SPromoHeader;
  customers: SPromoCustomer[] = [];
  stores: SPromoStore[] = [];
  getLines: SPromoGet[] = [];
  buyLines: SPromoBuy[] = [];
  itemList: ItemViewModel[];
  promtionType: MPromoType[];
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
    { name: 'Customer Code', value: 'C' },
    // { name: 'Customer Group', value: 'G' },
    { name: 'All Customer', value: 'A' },
    // { name: 'Customer Rank', value: 'R' },

  ];
  maxApplyTypes: any = [
    { name: 'Max Quantity By Receipt', value: 'MQR' },
    { name: 'Max Quantity By Store', value: 'MQS' },
    { name: 'Max Quantity By Period', value: 'MQP' },

  ];

  // discountType: any = [
  //   { name: 'Percent', value:'percent'},
  //   { name: 'Amount', value:'amount'},

  // ]; 
  rankType = [];
  loadRankType() {
    this.rankService.getAll(this.authService.storeSelected().companyCode).subscribe((response: any) => {
      if (response.success) {
        this.rankType = response.data;
        console.log('this.customerGroups', this.customerGroups);
        if (this.customerGroups !== null && this.customerGroups !== undefined && this.customerGroups.length > 0) {
          this.customerType.push({ name: 'Customer Rank', value: 'R' });
        }
      }
      else {

      }

      debugger;
    })
  }
  customerGroups: MCustomerGroup[] = [];
  formatColumn(rowData) {
    debugger;
    console.log("rowData", rowData);
    if (rowData?.valueType === "Discount Percent" || rowData?.valueType === "DiscountPercent") {
      return this.authService.formatCurrentcy(rowData.getValue)
    }
    else {
      return rowData.getValue;
    }
    // if( e.value!==null &&  e.value!== undefined)
    // {

    //   return this.authService.formatCurrentcy( e.value);

    // }
    // return 0;
  }
  formatStr = "#,##0.######";
  setfortStr() {
    let format = this.authService.loadFormat();
    debugger;
    let newFm = "";
    if (format !== null && format !== undefined) {

      if (format.thousandFormat?.length > 0) {
        newFm += "#" + format.thousandFormat + "##0";
      }
      if (format.decimalFormat?.length > 0) {
        newFm += format.decimalFormat + "######";
      }


    }
    if (newFm?.length > 0) {
      this.formatStr = newFm;
    }
  }
  customizeText(e) {

    if (e.value !== null && e.value !== undefined) {

      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  lineType: any = promotion.lineType;
  valueType: any = promotion.valueType;
  discountType: any = promotion.totalGetType;
  // [
  //   { name: 'Discount Amount', value:'DiscountAmount'},
  //   { name: 'Discount Percent', value:'DiscountPercent'},
  //   { name: 'Fixed Price', value:'FixedPrice'},
  //   { name: 'Fixed Quantity', value:'FixedQuantity'},
  // ]

  conditionType: any = [
    { name: 'Amount', value: 'Amount' },
    { name: 'Quantity', value: 'Quantity' },
    // { name: 'Accumulated', value: 'Accumulated' },

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
  showGrid = false;
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
    this.buygridShow = true;
    this.showGrid = true;

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
    this.getgridShow = true;
    this.showGrid = true;


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
  showPoupInputOT() {
    const initialState = {
      items: this.itemList
    };

    let modalRefX = this.modalService.show(ManagementPromotionInputOtComponent, {
      initialState, animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false,
      ariaDescribedby: 'my-modal-description',
      ariaLabelledBy: 'my-modal-title',
      class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
    });

    modalRefX.content.outItem.subscribe((response: any) => {
      // debugger; 
      modalRefX.hide();
      response.keyId = response.lineCode;
      response.lineNum = this.buyLines.length + 1;
      this.buyLines.push(response);
      console.log(response);
      //  if(response!==null && response !==undefined && response.length > 0)
      //  {
      //   line.lines=[];
      //     response.forEach(serial => {
      //       let  serialLine = new TGoodsReceiptLineSerial();
      //         serialLine.serialNum = serial.serialNum;
      //         serialLine.itemCode = line.itemCode;
      //         serialLine.uomCode = line.uomCode;
      //         serialLine.description = line.description;
      //         serialLine.slocId = line.slocId;
      //         serialLine.quantity = 1;
      //       line.lines.push(serialLine);

      //     });
      //     line.quantity = response.length;
      //    
      //     modalRefX.hide();
      //  }
      //  else
      //  {
      //    this.alertifyService.warning('Serial line isnull');

      //  }
    });
    this.buytt.instance.deleteRow(0);
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

    // console.log()

    if (e.parentType === "dataRow" && (e.dataField === "condition2" || e.dataField === "value2") && e.row.data.condition1 === "CE") {
      e.editorOptions.readOnly = true;
      e.editorOptions.disabled = true;

    }
    if (e.parentType === "dataRow" && e.dataField === "lineType") {
      // e.editorOptions.disabled = (typeof e.row.data.lineType !== "number");

    }
    // if (e.dataField === "lineType") {  
    //   e.editorOptions.onValueChanged = (e: any) => {  
    //     debugger;
    //      console.log(e)  
    //       if(e.value === "OTGroup")
    //       {
    //         // e.editorOptions.readOnly = true;
    //         // e.editorOptions.disabled = true;
    //         // this.showPoupInputOT();
    //         this.alertifyService.warning('Function comming soon. Please select another type');
    //       }
    //     }  
    // } 
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
    // debugger;
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
  isWalkin = false;
  isVoucher = false;
  handleVoucherChange(value) {
    this.isVoucher = value;

  }
  enableCustomer = false;

  customerValueChange(value, isLoad) {
    // debugger;
    this.promotion.promoCustomers = [];
    this.promotion.customerType = value;
    if (value === 'A') {

      setTimeout(() => {
        this.promotion.customerType = value;
        this.CustomerSelected = "All";
        this.enableCustomer = true;
      }, 20);


    }
    else {
      if (value === 'G') {
        if (!isLoad) {
          this.CustomerSelected = "";
        }
        // this.CustomerSelected="";
        this.promotion.customerType = "G";
      }
      else {
        if (value === 'R') {
          if (!isLoad) {
            this.CustomerSelected = "";
          }
          // this.CustomerSelected="";
          this.promotion.customerType = "R";
        }
        else {
          // debugger;
          if (!isLoad) {
            this.CustomerSelected = "";
          }

          let defaultCus = this.authService.getDefaultCustomer();
          this.promotion.customerType = "C";
          if (this.isWalkin) {
            if (this.sourceCRM === 'Capi') {

              if (defaultCus !== undefined && defaultCus !== null && defaultCus.mobile !== undefined && defaultCus.mobile !== null && defaultCus.mobile !== "") {
                this.CustomerSelected = defaultCus.mobile + ",";// "CUS00000,";
                let promoCustomer: SPromoCustomer = new SPromoCustomer();

                promoCustomer.customerType = this.promotion.customerType;
                promoCustomer.customerValue = defaultCus.mobile;
                promoCustomer.lineNum = 1;
                promoCustomer.companyCode = this.authService.storeSelected().companyCode;
                let checkId = this.promotion?.promoCustomers.filter(x => x.customerValue === promoCustomer.customerValue);
                if (checkId === null || checkId === undefined || checkId?.length <= 0) {
                  this.promotion.promoCustomers.push(promoCustomer);
                }

              }

            }
            else {
              let defCus = this.authService.storeSelected().defaultCusId;
              if (defCus !== null && defCus !== undefined && defCus !== "" && defCus !== undefined && defCus !== null && defCus !== "") {

                this.CustomerSelected = defCus + ",";
                let promoCustomer: SPromoCustomer = new SPromoCustomer();

                promoCustomer.customerType = this.promotion.customerType;
                promoCustomer.customerValue = defCus;
                promoCustomer.companyCode = this.authService.storeSelected().companyCode;
                promoCustomer.lineNum = 1;
                let checkId = this.promotion?.promoCustomers.filter(x => x.customerValue === promoCustomer.customerValue);
                if (checkId === null || checkId === undefined || checkId?.length <= 0) {
                  this.promotion.promoCustomers.push(promoCustomer);
                }
              }

            }

            this.enableCustomer = true;
          }
          else {
            this.enableCustomer = false;

            let splString = this.CustomerSelected.split(',');
            let sttNum = 1;
            splString.forEach(customer => {
              if (customer !== null && customer !== undefined && customer !== "") {
                let promoCustomer: SPromoCustomer = new SPromoCustomer();

                promoCustomer.customerType = this.promotion.customerType;
                promoCustomer.customerValue = customer;
                promoCustomer.lineNum = sttNum;
                promoCustomer.companyCode = this.authService.storeSelected().companyCode;
                let checkId = this.promotion?.promoCustomers.filter(x => x.customerValue === promoCustomer.customerValue);
                if (checkId === null || checkId === undefined || checkId?.length <= 0) {
                  this.promotion.promoCustomers.push(promoCustomer);
                }
                sttNum++;
              }

            });


          }
        }

      }

      // console.log('this.isLoadingData', this.isLoadingData)


    }
  }
  @ViewChild('chkIsVoucher', { static: false }) chkIsVoucher;
  @ViewChild('chkIsSchema', { static: false }) chkIsSchema;
  @ViewChild('chkWakin', { static: false }) chkWakin;
  @ViewChild('cbbCustomer', { static: false }) cbbCustomer;
  @ViewChild('txtCustomer', { static: false }) txtCustomer;
  @ViewChild('btnSearch', { static: false }) btnSearch;

  isLoadingData = false;

  handleValueChange(value) {
    // debugger;
    let defCus = this.authService.storeSelected().defaultCusId;
    if (value === true) {
      this.isWalkin = true;
      this.enableCustomer = true;
      let defaultCus = this.authService.getDefaultCustomer();
      if (this.sourceCRM === 'Capi') {
        this.promotion.customerType = "C";
        this.CustomerSelected = defaultCus.mobile + ",";// "CUS00000,";
        let promoCustomer: SPromoCustomer = new SPromoCustomer();

        promoCustomer.customerType = this.promotion.customerType;
        promoCustomer.customerValue = defaultCus.mobile;
        promoCustomer.lineNum = 1;
        promoCustomer.companyCode = this.authService.storeSelected().companyCode;
        // this.promotion.promoCustomers.push(promoCustomer);
        let checkId = this.promotion?.promoCustomers.filter(x => x.customerValue === promoCustomer.customerValue);
        if (checkId === null || checkId === undefined || checkId?.length <= 0) {
          this.promotion.promoCustomers.push(promoCustomer);
        }
      }
      else {


        this.promotion.customerType = "C";

        this.CustomerSelected = defCus + ",";
        let promoCustomer: SPromoCustomer = new SPromoCustomer();

        promoCustomer.customerType = this.promotion.customerType;
        promoCustomer.customerValue = defCus;
        promoCustomer.lineNum = 1;
        promoCustomer.companyCode = this.authService.storeSelected().companyCode;
        let checkId = this.promotion?.promoCustomers.filter(x => x.customerValue === promoCustomer.customerValue);
        if (checkId === null || checkId === undefined || checkId?.length <= 0) {
          this.promotion.promoCustomers.push(promoCustomer);
        }
      }

    }
    else {
      this.enableCustomer = false;
      this.isWalkin = false;
      this.promotion.customerType = "C";
      this.CustomerSelected = "";
      this.promotion.promoCustomers = [];
      // if(this.CustomerSelected === defCus+ ",")
      // {
      // 
      // }

    }
    console.log('this.CustomerSelected XAAA', this.CustomerSelected)
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
    if (type === 'PaymentCode') {
      result = this.paymentMethods;
    }
    if (type === 'PaymentType') {
      result = this.paymentTypes;
    }
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
    
    // rowData.keyId = null;
    // rowData.lineCode = null;
    // rowData.lineName = '';
    // rowData.lineUom = '';
     
    // (<any>this).defaultSetCellValue(rowData, value);

    if(value === 'OneTimeGroup')
    {
      rowData.keyId = 'OneTimeGroup';
      rowData.lineCode = 'OneTimeGroup';
      rowData.lineUom = '';
   
      rowData.lineName = 'OneTimeGroup';
      rowData.lines = [];
      let line = {lineNum: 1};
      rowData.lines.push(line);
    
      (<any>this).defaultSetCellValue(rowData, value);
    
    //   rowData.keyId = 'OneTimeGroup';
    //   rowData.lineCode = 'OneTimeGroup';
    //   rowData.lineUom = '';
    //   (<any>this).defaultSetCellValue(rowData, value);
    //   Swal.fire({
    //     title: 'Apply Manual Promotion to bill!',
    //     input: 'text',
    //     icon: 'question',
    //     text: 'Remark',
    //     inputAttributes: {
    //       autocapitalize: 'off'
    //     },
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes',
    //     showLoaderOnConfirm: true,
    //     allowOutsideClick: () => !Swal.isLoading()
    //   }).then((result) => {
    //     if (result.isConfirmed) {
           
    // // this.inputNote(result.value); 
    //             // let discountAllBillType = event?.discountAllBillType;
    //             // let discountAllBillAmount = parseFloat(event?.discountAllBill??0);
    //             // this.basketService.applyDiscountPromotionToBasket(discountAllBillType, discountAllBillAmount);
    //             // this.modalRef.hide();
    //             // Swal.fire('Completed Successfully', 'Manual Promotion applied!', 'success'); 
    //             // rowData.keyId = 'OneTimeGroup';
    //             // rowData.lineCode = 'OneTimeGroup';
    //             rowData.lineName = result.value;
    //             // rowData.lineUom = '';
    //             // rowData.valueType = 'Amount';
    //             // rowData.condition1 = 'CE';
    //             // rowData.value1 = '1';
    //             rowData.lines = [];
    //             let line = {lineNum: 1};
    //             rowData.lines.push(line);
    //             // rowData.CityID = null; 
    //             (<any>this).defaultSetCellValue(rowData, value);
           
          
    //     }
    //   })
     
    }
    else
    { 
      rowData.keyId = null;
      rowData.lineCode = null;
      rowData.lineName = '';
      rowData.lineUom = '';
      // rowData.CityID = null;
  
      (<any>this).defaultSetCellValue(rowData, value);
    }
    // this
  }
  setBuyLineTypeValue(rowData: any, value: any) {
    debugger;
    if(value === 'OneTimeGroup')
    {
      rowData.keyId = 'OneTimeGroup';
      rowData.lineCode = 'OneTimeGroup';
      rowData.lineUom = '';
   
      rowData.lineName = 'OneTimeGroup';
      rowData.lines = [];
      let line = {lineNum: 1};
      rowData.lines.push(line);
      // rowData.valueType = 'Amount';
      // rowData.condition1 = 'CE';
      // rowData.value1 = '1';
      // rowData.keyId = 'OneTimeGroup';
      (<any>this).defaultSetCellValue(rowData, value);
    
      
      // Swal.fire({
      //   title: 'Apply Manual Promotion to bill!',
      //   input: 'text',
      //   icon: 'question',
      //   text: 'Remark',
      //   inputAttributes: {
      //     autocapitalize: 'off'
      //   },
      //   showCancelButton: true,
      //   confirmButtonText: 'Yes',
      //   showLoaderOnConfirm: true,
      //   allowOutsideClick: () => !Swal.isLoading()
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     (<any>this).remove(rowData);
      //     rowData.keyId = 'OneTimeGroup';
      //     rowData.lineCode = 'OneTimeGroup';
      //     rowData.lineUom = '';
       
      //     rowData.lineName = result.value;
         
      //     // rowData.valueType = 'Amount';
      //     // rowData.condition1 = 'CE';
      //     // rowData.value1 = '1';
      //     // rowData.keyId = 'OneTimeGroup';
      //     // rowData.lineCode = '';
      //     // rowData.lineName = '';
      //     // rowData.lineUom = '';
      //     // rowData.valueType = '';
      //     // rowData.condition1 = '';
      //     // rowData.value1 = '';
      //     rowData.lines = [];
      //     let line = {lineNum: 1};
      //     rowData.lines.push(line);
      //     // rowData.CityID = null;
      
      //     (<any>this).defaultSetCellValue(rowData, value);
           
          
      //   }
      // })
    
    }
    else
    { 
      rowData.keyId = null;
      rowData.lineCode = null;
      rowData.lineName = '';
      rowData.lineUom = '';
      // rowData.CityID = null;
  
      (<any>this).defaultSetCellValue(rowData, value);
    }
   
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
  promotionTypeChangeNum = 0;
  promotionTypeChange(event) {
    // debugger;
    // console.log('promotionTypeChangeNum', isLoad + ' ' + event)
    // xxxx
    if ((this.buyLines?.length > 0 || this.getLines?.length > 0) && this.promotionTypeChangeNum > 0) {
      // !== "edit"
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to change another type. Data in grid will be clear',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {

          this.promotionTypeChangeAction(event);
        }

      });
    }
    else {

      this.promotionTypeChangeAction(event);

    }

  }
  validateNumber(e) {
    return e.value % 2 == 0;
  }
  lineTypeOT= [
    { name: 'Barcode', value:'BarCode'},
    { name: 'Item Code', value:'ItemCode'} 
  ];
  promotionTypeChangeAction(event) {
    // this.promotion.totalGetType = null;
    debugger;
    // (this.buyLines?.length > 0 || this.getLines?.length > 0) &&
    if ( this.promotionTypeChangeNum > 0) {
      setTimeout(() => {
        this.buyLines = [];
        this.getLines = [];
        this.promotion.totalBuyFrom = null;
        this.promotion.totalBuyTo = null;
        this.promotion.totalGetType = null;
        this.promotion.totalGetValue = 0; 
        this.promotion.maxTotalGetValue = null;
      }, 10)
    }


    this.resetGetGrid();
    this.resetBuyGrid();
    var newArray = [];
   
    debugger;
    promotion.totalGetType.forEach(val => newArray.push(Object.assign({}, val)));

    this.discountType = newArray;//promotion.totalGetType;
    this.showGrid = false;
    this.lineType = promotion.lineType;
    this.getTabSelected = 0;
    if (event === 1) {
      this.conditionType = [
        { name: 'Amount', value: 'Amount' },
        { name: 'Quantity', value: 'Quantity' },
        { name: 'Accumulated', value: 'Accumulated' }, 
      ]
    }
    else {
      if (event === 10) {
        this.conditionType = [
          { name: 'Amount', value: 'Amount' } 
        ]
      }
      else {
        this.conditionType = [
          { name: 'Amount', value: 'Amount' },
          { name: 'Quantity', value: 'Quantity' },

        ]
      }
    }
    if (event === 1) //Singe Discount
    {
      this.buyTab = false;
      this.getTab = true;
      this.getTabSelected = 1;
      this.buyTabtotalText1 = true;
      this.buyTabtotalText2 = true;
      this.getTabtotalText1 = true;
      this.getTabtotalText2 = true;
      this.valueType = promotion.valueSingleType;
    }
    if (event === 2) //Buy X Get Y
    {
      this.buyTab = true;
      this.getTab = true;
      this.getTabconditionType = false;
      this.getTabcondition1 = false;
      this.getTabcondition2 = false;
      this.getTabvalue1 = false;
      this.getTabvalue2 = false;

      this.buyTabtotalText1 = true;
      this.buyTabtotalText2 = true;
      this.getTabtotalText1 = true;
      this.getTabtotalText2 = true;
    }

    if (event === 3) //Combo
    {
      this.buyTab = true;
      this.getTab = true;
      this.getgridShow = false;
      this.getTabconditionType = false;
      this.getTabcondition1 = false;
      this.getTabcondition2 = false;
      this.getTabvalue1 = false;
      this.getTabvalue2 = false;
      this.discountType.push(
        { name: 'Fixed Price', value: 'Fixed Price' },
      );
      this.buyTabtotalText1 = true;
      this.buyTabtotalText2 = true;
      this.getTabtotalText1 = false;
      this.getTabtotalText2 = false;
      this.lineType = promotion.lineTypeCombo;
    }
    if (event === 4) //Total Bill
    {
      this.buyTab = true;
      this.getTab = true;
      this.buygridShow = false;
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
    if (event === 6) //Mix and Match
    {
      this.buyTab = true;
      this.getTab = true;
      this.getTabconditionType = false;
      this.getTabcondition1 = false;
      this.getTabcondition2 = false;
      this.getTabvalue1 = false;
      this.getTabvalue2 = false;
      this.buyTabtotalText1 = false;
      this.buyTabtotalText2 = false;
      this.getTabtotalText1 = false;
      this.getTabtotalText2 = false;
      this.valueType = promotion.mixMatchvalueType;
    }
    if (event === 7) //Prepaid Card
    {
      this.buyTab = true;
      this.getTab = true;
      this.getTabconditionType = false;
      this.getTabcondition1 = false;
      this.getTabcondition2 = false;
      this.getTabvalue1 = false;
      this.getTabvalue2 = false;
      this.buyTabtotalText1 = true;
      this.buyTabtotalText2 = true;
      this.getTabtotalText1 = true;
      this.getTabtotalText2 = true;
      this.valueType = promotion.valueCardType;
      this.itemService.getItemViewList(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', '', '', '', 'Card').subscribe((response: any) => {
        this.itemList = response.data;
      });
    }
    if (event === 10) //Payment
    {
      this.buyTab = false;
      this.getTab = true;
      this.getTabSelected = 1;
      this.buyTabtotalText1 = true;
      this.buyTabtotalText2 = true;
      this.getTabtotalText1 = true;
      this.getTabtotalText2 = true;
      this.valueType = promotion.valuePayment;
      this.lineType = promotion.lineTypePayment;

    }
    setTimeout(x => {
      this.showGrid = true;
      this.promotionTypeChangeNum++;
    });

  }
  //1 Singe Discount
  // 2Buy X Get Y
  //3 Combo
  //4 Total Bill
  //6 Mix and Match
  //7 Prepaid Card
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
  @ViewChild('buyot', { static: false }) buyot;
  @ViewChild('getot', { static: false }) getot;
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
  paymentMethods=[];
  paymentTypes = [];
  loadPaymentMethod() {
    let infor = this.authService.getCompanyInfor();
    this.paymentService.getAll(infor.companyCode).subscribe((response: any) => {
      //   this.merchandiseCategory = response;
      //  debugger;
      if (response.success) {
        this.paymentMethods = response.data.filter(x=>x.status === 'A');
      }
      else {
        this.alertifyService.warning(response.message);
      }

    })
  }
  loadPaymentType() {
    this.paymentService.getPaymentType().subscribe((response: any) => {
      //   this.merchandiseCategory = response;
       debugger;
      if (response.success) {
        this.paymentTypes = response.data.filter(x=>x.Status === 'A');
      }

      else {
        this.alertifyService.warning(response.message);
      }

    })
  }
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
  storeList: MStore[] = [];
  loadStore() {
    this.storeService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      if (response.success) {
        this.storeList = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }
      // this.storeList = response;
    })
  }
  // @ViewChild(DxTreeViewComponent, { static: false }) treeView;
  treeDataSource: any;
  treeBoxValue: string[];
  gridDataSource: any;
  gridBoxValue: string[] = [];
  cusGrpIdBoxValue: string[] = [];
  // functionId = "Adm_Holiday"; 
 
    
  loadCustomerGroup() {
    this.customerGroupService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      if (response.success) {
        this.customerGroups = response.data;
        if (this.customerGroups !== null && this.customerGroups !== undefined && this.customerGroups.length > 0) {
          this.customerGroups = this.customerGroups.filter(x => x.status === 'A');
        }
        console.log('this.customerGroups', this.customerGroups);
        if (this.customerGroups !== null && this.customerGroups !== undefined && this.customerGroups.length > 0) {
          this.customerType.push({ name: 'Customer Group', value: 'G' });
        }
      }
      else {
        this.alertifyService.warning(response.message);
      }


    })
  }
  maxQtyByReceiptView = false;
  maxQtyByReceiptEdit = false;
  maxQtyByReceiptAdd = false;

  maxQtyByStoreView = false;
  maxQtyByStoreEdit = false;
  maxQtyByStoreAdd = false;

  constructor(private customerGroupService: CustomergroupService, private controlService: ControlService,  private paymentService: PaymentmethodService, private rankService: LoyaltyrankService, public authService: AuthService, private excelSrv: ExcelService, public storeService: StoreService, public commonService: CommonService,
    private merchandiseService: Merchandise_categoryService, private formBuilder: FormBuilder,  private itemgroupService: ItemgroupService, private windowService: WindowService, private modalService: BsModalService, private alertifyService: AlertifyService,
    private promotionService: PromotionService, private router: Router, private route: ActivatedRoute, private itemService: ItemService) {

    this.promotion = new PromotionViewModel();
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always'
    this.CustomerSelected = '';
    this.customizeText = this.customizeText.bind(this);
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
  inactiveLine(line, type)
  { 
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to inactive line ' + line?.lineNum + '!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        let lineInactive: InActivePromoViewModel = new InActivePromoViewModel();
        lineInactive.companyCode= line.companyCode;
        lineInactive.promoId= this.promotion.promoId;
        lineInactive.promoLineType= type;
        lineInactive.lineNum= line.lineNum;
        lineInactive.inActive= "Y";
        // promoId: string;
        // companyCode: string;
        // promoLineType: string;
        // lineNum: number; 
        // inActive: string=''; // Y/N
    
        this.promotionService.InActiveLine(lineInactive).subscribe((response: any)=>{
          if(response.success)
          {
            Swal.fire('Inactive Promotion Line', "Update data completed successfully.", 'success').then(() =>{
              window.location.reload();
            }); 
          }
          else
          { 
            Swal.fire('Inactive Promotion Line', response.message, 'warning'); 
          }
        }, error =>{
          Swal.fire('Inactive Promotion Line', error, 'error'); 
        });
         
      }
    });
   
  }
  downloadTemplate() {
    this.commonService.download('S_Promotion.xlsx');
  }


  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  onFileChange(evt: any) {
    // debugger;
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      // debugger;
      const bstr: string = e.target.result;
      const dataHeader = <any[]>this.excelSrv.importFromFile(bstr, 0);
      const dataBuy = <any[]>this.excelSrv.importFromFile(bstr, 1);
      const dataGet = <any[]>this.excelSrv.importFromFile(bstr, 2);
      const dataCustomer = <any[]>this.excelSrv.importFromFile(bstr, 3);
      const dataStore = <any[]>this.excelSrv.importFromFile(bstr, 4);


      const header: string[] = Object.getOwnPropertyNames(new PromotionViewModel());
      const buy: string[] = Object.getOwnPropertyNames(new SPromoBuy());
      const get: string[] = Object.getOwnPropertyNames(new SPromoGet());
      const customer: string[] = Object.getOwnPropertyNames(new SPromoCustomer());
      const store: string[] = Object.getOwnPropertyNames(new SPromoStore());

      // debugger;
      // console.log(data);
      const excelHeader = dataHeader[0];
      const importedDataHeader = dataHeader.slice(1);//.slice(1, -2); 

      const excelBuy = dataBuy[0];
      const importedDataBuy = dataBuy.slice(1);//.slice(1, -2); 

      const excelGet = dataGet[0];
      const importedDataGet = dataGet.slice(1);//.slice(1, -2); 

      const excelCustomer = dataCustomer[0];
      const importedDataCustomer = dataCustomer.slice(1);//.slice(1, -2); 

      const excelStore = dataStore[0];
      const importedDataStore = dataStore.slice(1);//.slice(1, -2); 

      this.importContent = importedDataHeader.map(arr => {
        // 
        const obj = {};
        for (let i = 0; i < excelHeader.length; i++) {
          for (let j = 0; j < header.length; j++) {
            const ki = this.capitalizeFirstLetter(excelHeader[i]);
            const kj = this.capitalizeFirstLetter(header[j]);

            if (ki.toLowerCase() === kj.toLowerCase()) {

              if (ki.toLowerCase() === 'validdatefrom' || ki.toLowerCase() === 'validdateto') {
                // debugger;
                if (arr[i] !== undefined && arr[i] !== null && arr[i] !== '') {
                  let date = this.excelSrv.excelDateToJSDate(arr[i]);
                  obj[header[j]] = date;// new Date(arr[i] * 1000);;
                }

                // validDateFrom: Date | string | null=null;
                // validDateTo: Date | string | null=null;
                // var date = new Date(arr[i] * 1000);

              }
              else {
                if (arr[i] !== null && arr[i] !== undefined) {
                  obj[header[j]] = arr[i].toString();
                }
                else {
                  obj[header[j]] = null;
                }

              }


            }
          }
        }

        return <PromotionViewModel>obj;
      });
      // debugger;
      let buyX = importedDataBuy.map(arr => {
        // debugger;
        const obj = {};
        for (let i = 0; i < excelBuy.length; i++) {
          for (let j = 0; j < buy.length; j++) {
            const ki = this.capitalizeFirstLetter(excelBuy[i]);
            const kj = this.capitalizeFirstLetter(buy[j]);
            // debugger;
            if (ki.toLowerCase() === kj.toLowerCase()) {

              if (ki.toLowerCase() === 'promoid' || ki.toLowerCase() === 'linecode') {
                // debugger; 
                // obj[buy[j]] = arr[i]?.toString();
                if (arr[i] !== null && arr[i] !== undefined) {
                  obj[buy[j]] = arr[i].toString();
                }
                else {
                  obj[buy[j]] = null;
                }
              }
              else {
                obj[buy[j]] = arr[i];
              }

            }
          }
        }
        return <SPromoBuy>obj;
      })
      let getX = importedDataGet.map(arr => {
        // debugger;
        const obj = {};
        for (let i = 0; i < excelGet.length; i++) {
          for (let j = 0; j < get.length; j++) {
            const ki = this.capitalizeFirstLetter(excelGet[i]);
            const kj = this.capitalizeFirstLetter(get[j]);
            // debugger;
            if (ki.toLowerCase() === kj.toLowerCase()) {
              if (ki.toLowerCase() === 'promoid' || ki.toLowerCase() === 'linecode') {
                // debugger; 
                // obj[get[j]] = arr[i]?.toString();
                if (arr[i] !== null && arr[i] !== undefined) {
                  obj[get[j]] = arr[i].toString();
                }
                else {
                  obj[get[j]] = null;
                }
              }
              else {
                obj[get[j]] = arr[i];
              }
              // obj[get[j]] = arr[i];
            }
          }
        }
        return <SPromoGet>obj;
      })
      let customerX = importedDataCustomer.map(arr => {
        // debugger;
        const obj = {};
        for (let i = 0; i < excelCustomer.length; i++) {
          for (let j = 0; j < customer.length; j++) {
            const ki = this.capitalizeFirstLetter(excelCustomer[i]);
            const kj = this.capitalizeFirstLetter(customer[j]);
            // debugger;
            if (ki.toLowerCase() === kj.toLowerCase()) {
              // if(ki.toLowerCase() === 'promoid' || ki.toLowerCase() === 'customerValue')
              // {
              //   // debugger; 
              //   obj[customer[j]] = arr[i].toString();
              // }
              // else
              // {
              //   obj[customer[j]] = arr[i];
              // }
              // obj[customer[j]] = arr[i]?.toString();
              if (arr[i] !== null && arr[i] !== undefined) {
                obj[customer[j]] = arr[i].toString();
              }
              else {
                obj[customer[j]] = null;
              }
            }
          }
        }
        return <SPromoCustomer>obj;
      })
      let storeX = importedDataStore.map(arr => {
        // debugger;
        const obj = {};
        for (let i = 0; i < excelStore.length; i++) {
          for (let j = 0; j < store.length; j++) {
            const ki = this.capitalizeFirstLetter(excelStore[i]);
            const kj = this.capitalizeFirstLetter(store[j]);
            // debugger;
            if (ki.toLowerCase() === kj.toLowerCase()) {
              if (arr[i] !== null && arr[i] !== undefined) {
                obj[store[j]] = arr[i].toString();
              }
              else {
                obj[store[j]] = null;
              }
              // obj[store[j]] = arr[i]?.toString();
            }
          }
        }
        return <SPromoStore>obj;
      })
      // debugger
      let promo = <PromotionViewModel>this.importContent[0];
      promo.promoId = "";
      promo.promoType = parseInt(promo.promoType.toString());
      promo.promoBuys = buyX;
      let NumX = 1;
      promo.promoBuys.forEach(item => {
        if (item.lineType === 'ItemCode') {
          item.keyId = item.lineCode + item.lineUom;
          // item.keyId = item.lineCode;
        }
        if (item.lineNum === null || item.lineNum === undefined) {
          item.lineNum = NumX;
          NumX++;
        }
      });
      promo.promoGets = getX;
      let NumX1 = 1;

      promo.promoGets.forEach(item => {
        if (item.lineType === 'ItemCode') {
          item.keyId = item.lineCode + item.lineUom;
        }
        if (item.lineNum === null || item.lineNum === undefined) {
          item.lineNum = NumX1;
          NumX1++;
        }

      });
      debugger;
      promo.promoGets = promo.promoGets.filter(x => x.keyId?.length > 0);
      promo.promoBuys = promo.promoBuys.filter(x => x.keyId?.length > 0);

      promo.promoStores = storeX;
      promo.promoCustomers = customerX;
      this.promotion = promo;
      this.bindPromotionToGrid(promo);

      // console.log(promo);
    };


  } 
  itemSearchForm: FormGroup;
  functionIdFilter = "Cpn_ItemFilter";
  controlList: any[];
  groupControlList = {};
  searchModel: ItemSearch;
  customerId = "";
  searchItem()
  {
  
    let filter = this.searchModel;
    let itemCode =  (filter.itemCode === null || filter.itemCode === undefined) ? '' : filter.itemCode;
    let uomcode =  (filter.uomcode === null || filter.uomcode === undefined) ? '' : filter.uomcode;
    let barcode =  (filter.barcode === null || filter.barcode === undefined) ? '' : filter.barcode;
    let keyword =   (filter.keyword === null || filter.keyword === undefined ) ? '' : filter.keyword;
    debugger;
    this.loadItemList(itemCode,  uomcode,  barcode,  keyword);
  }
  // customerSearchForm: FormGroup;
  getItemFilterControlList() {

    // this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionIdFilter).subscribe((response: any)=>{
    //   if(response.data.length > 0)
    //   {
       
    //    this.controlList= response.data.filter(x=>x.controlType !== 'Button');
    //    console.log(this.controlList);
    //     let group: any = {  };
    //     response.data.forEach(item=>{
         
    //       if(item.controlType ==="DateTime")
    //       {

            
    //        let date = new Date(this.searchModel[item.controlId]);
    //        this.searchModel[item.controlId] = new Date(this.searchModel[item.controlId]);
            
    //          group[item.controlId] = new FormControl({ value: date, disabled: false })
           
    //          console.log(this.searchModel[item.controlId]);
             
    //       }
    //       else{
            
    //          group[item.controlId] = [''];
           
    //       }
    //     });
    //   debugger;
     
    //    this.itemSearchForm = this.formBuilder.group(group);
      
    //    if (this.controlList.length > 0) {
    //      console.log("controlList", this.controlList);
    //        this.controlList.forEach(item=>{
    //        item.isView= this.checkPermission(item.controlId,'V'),
    //        item.isEdit=  item?.readOnly ? false : this.checkPermission(item.controlId,'E'),
    //        item.isInsert=  item?.readOnly ? false : this.checkPermission(item.controlId,'I')
    //      });
    //      var groups = this.controlList.reduce(function (obj, item) {
    //        obj[item.controlType] = obj[item.controlType] || [];

    //        obj[item.controlType].push({
    //          controlId: item.controlId,
    //          companyCode: item.companyCode,
    //          controlName: item.controlName,
    //          functionId: item.functionId,
    //          action: item.action,
    //          controlType: item.controlType,
    //          createdBy: item.createdBy,
    //          createdOn: item.createdOn,
    //          optionName: item.optionName,
    //          require: item.require,
    //          optionKey: item.optionKey,
    //          custom1: item.custom1,
    //          custom2: item.custom2,
    //          optionValue: item.optionValue,
    //          status: item.status,
    //          orderNum: item.orderNum,
    //          isView:item.isView,
    //          isEdit:item.isEdit,
    //          isInsert:item.isInsert,
    //        });
    //        return obj;
    //      }, {});
    //      this.groupControlList = Object.keys(groups).map(function (key) {
    //        let indexKey = 0;
    //        if (key === "CheckBox") {
    //          indexKey = 6;
    //        } else if (key === "DateTime") {
    //          indexKey = 2;
    //        } else if (key === "TextBox") {
    //          indexKey = 3;
    //        } else if (key === "DropDown") {
    //          indexKey = 4;
    //        }
    //        return { controlType: key, arrayGroup: groups[key], index: indexKey, len: groups[key].length };
    //      }).sort((a, b) => a.index > b.index ? 1 : -1);

    //      console.log("this.groupControlList", this.groupControlList);
    //    }

       
    //   }
    //  });


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
  onRowPrepared(e) {
    // console.log('onRowPrepared');
    // debugger;
    if (e.rowType == "data" && (e.data.lines === null || e.data.lines === undefined || e.data.lines.length === 0 || e.data.lines === 'undefined')) {
      // debugger;
      // e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");
      // e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");
      if (e.rowElement.querySelector(".dx-command-expand") !== null && e.rowElement.querySelector(".dx-command-expand") !== undefined) {
        let firstChild = e.rowElement.querySelector(".dx-command-expand").firstChild?.classList;
        if(firstChild!==null && firstChild!==undefined )
        {
          e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");
          e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");
        }
       
       
      }

    }
  }

  onImportData() {
    let data = new DataImport();
    data.promotion = this.importContent;

    this.promotionService.import(data).subscribe((response: any) => {
      if (response.success === true) {
        if (response.data !== null && response.data !== undefined && response.data.length > 0) {
          this.isResult = true;
          this.importContent = response.data;
        }
        this.alertifyService.success("Import completed succesfully.");
      }
      else {
        // debugger;
        if (response.data !== null && response.data !== undefined && response.data.length > 0) {
          this.isResult = true;
          this.importContent = response.data;
        }
        this.alertifyService.warning("Import failed" + response.message);
      }
    });
  }

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
    this.enableCustomer = true;
    // debugger;
    let defaultCus = this.authService.getDefaultCustomer();
    if (this.sourceCRM === 'Capi') {
      this.promotion.customerType = "C";
      this.CustomerSelected = defaultCus.mobile + ",";// "CUS00000,";
      let promoCustomer: SPromoCustomer = new SPromoCustomer();

      promoCustomer.customerType = this.promotion.customerType;
      promoCustomer.customerValue = defaultCus.mobile;
      promoCustomer.lineNum = 1;
      promoCustomer.companyCode = this.authService.storeSelected().companyCode;
      let checkId = this.promotion?.promoCustomers.filter(x => x.customerValue === promoCustomer.customerValue);
      if (checkId === null || checkId === undefined || checkId?.length <= 0) {
        this.promotion.promoCustomers.push(promoCustomer);
      }
    }
    else {
      let defCus = this.authService.storeSelected().defaultCusId;
      this.promotion.customerType = "C";
      this.CustomerSelected = defCus + ",";
      let promoCustomer: SPromoCustomer = new SPromoCustomer();
      promoCustomer.customerType = this.promotion.customerType;
      promoCustomer.customerValue = defCus;
      promoCustomer.lineNum = 1;
      promoCustomer.companyCode = this.authService.storeSelected().companyCode;
      let checkId = this.promotion?.promoCustomers.filter(x => x.customerValue === promoCustomer.customerValue);
      if (checkId === null || checkId === undefined || checkId?.length <= 0) {
        this.promotion.promoCustomers.push(promoCustomer);
      }
      // this.promotion.promoCustomers.push(customer);
    }

    var newDate = new Date("1/1/2020 12:00:00 AM");
    var toDate = new Date("1/1/2020 11:59:00 PM");
    this.validTimeFrom = newDate;
    this.validTimeTo = toDate;

  }
  addNewPromotion() {
    this.router.navigate(["admin/promotion/setup"]);
  }
  checkPermission(controlId: string, permission: string): boolean
  { 
    return this.authService.checkRole(this.functionId , controlId, permission );
  }
  updateCustomerSelected(event: MWICustomerModel[]) {

    this.CustomerSelected = '';
    this.modalRef.hide();
    this.promotion.promoCustomers = [];
    let customers = '';
    let num = 1;
    // debugger;
    event.forEach((item) => {
      // debugger;

      let promoCustomer: SPromoCustomer = new SPromoCustomer();

      promoCustomer.customerType = this.promotion.customerType;
      if (this.sourceCRM === 'Capi') {
        promoCustomer.customerValue = item.mobile.toString();
        customers += item.mobile + ';';
      }
      else {
        promoCustomer.customerValue = item.customerId.toString();
        customers += item.customerId + ';';
      }

      promoCustomer.companyCode = this.authService.storeSelected().companyCode;;
      promoCustomer.lineNum = num;
      let checkId = this.promotion?.promoCustomers.filter(x => x.customerValue === promoCustomer.customerValue);
      if (checkId === null || checkId === undefined || checkId?.length <= 0) {
        this.promotion.promoCustomers.push(promoCustomer);
      }
      // this.promotion.promoCustomers.push(customer);
      num++;
    });
    this.CustomerSelected = customers.substring(0, customers.length - 1);

    // console.log('this.CustomerSelected XA', this.CustomerSelected)
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  now: Date = new Date();
  promotionId: string = '';
  mode: string = "";
  functionId = "Adm_Promotion";
  ngAfterViewInit() {
    // this.isLoadingData = false;
    console.log('this.isLoadingData affter', this.isLoadingData)
  }
  loadSetting() {
    let inactiveLine = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'PromotionInactiveLine');
    // debugger;
    if (inactiveLine !== null && inactiveLine !== undefined) {
      if(inactiveLine.settingValue?.toLowerCase() === 'true')
      {
        this.canInactive = true;
      }
      else
      {
        this.canInactive = false;
      }
     
    } 
    else
    {
      this.canInactive = false;
    }
  }
  ngOnInit() {
    this.loadSetting();
    this.isLoadingData = true;
    this.setfortStr();
    this.loadPaymentMethod();
    this.loadPaymentType();

    this.loadCustomerGroup();

    this.loadRankType();

    this.getItemFilterControlList();

    this.maxQtyByReceiptAdd = this.checkPermission("maxQtyByReceipt", "I");
    this.maxQtyByReceiptEdit = this.checkPermission("maxQtyByReceipt", "E");
    this.maxQtyByReceiptView = this.checkPermission("maxQtyByReceipt", "V");


    this.maxQtyByStoreAdd = this.checkPermission("maxQtyByStore", "I");
    this.maxQtyByStoreEdit = this.checkPermission("maxQtyByStore", "E");
    this.maxQtyByStoreView = this.checkPermission("maxQtyByStore", "V");



    // debugger;
    this.sourceCRM = this.authService.getCRMSource();

    this.promotion.promoCustomers = [];
    // this.CustomerSelected = '';
    this.route.params.subscribe(data => {
      // debugger;
      this.mode = data['m'];
      if (this.mode === undefined || this.mode === null || this.mode === "") {
        this.mode = 'setup';
      }
      this.promotionId = data['promotionId'];

    });
    console.log('this.isLoadingData loading', this.isLoadingData)
    //  this.promotionId='PICP00100000001';

    // this.loadItemList();
    this.loadPromotionType();
    this.loadMerchandiseCategory();
    this.loadItemCollection();
  

    this.loadStore();
    debugger;
    if (this.mode === 'edit') {
      this.canUpdate = this.authService.checkRole(this.functionId, '', 'E');
    }
    if (this.mode === 'setup' || this.mode === 'copy') {
      this.canUpdate = this.authService.checkRole(this.functionId, '', 'I');
    }
    if (this.mode === "edit" || this.mode === "copy") {
      if (this.promotionId !== null || this.promotionId !== undefined) {
        this.loadPromotion();

      }
    }
    else {
      this.mode = "setup";
      this.defaultControl();
    }
    // debugger;
    // if(this.promotion.sapPromoId!==null && this.promotion.sapPromoId!==undefined && this.promotion.sapPromoId!=='')
    // {
    //   this.promotion.isUsed = 'Y';
    // }
    // console.log('promotion',this.promotion);
  }
  canInactive = false;
  canUpdate = false;
  storeApply = [];
  showApplyStoreFlag=  false;
  showApplyStore()
  {
    this.showApplyStoreFlag = true;
    this.promotion.promoStores.forEach(store => {
       let storeInfor = this.storeList.find(x=>x.storeId === store.storeValue);
       if(storeInfor!==null && storeInfor!==undefined)
       {
        this.storeApply.push(storeInfor); 
       }
    });

  }
  bindPromotionToGrid(promotion) {

    
    if (this.promotion.sapPromoId !== null && this.promotion.sapPromoId !== undefined && this.promotion.sapPromoId !== '') {
      this.promotion.isUsed = 'Y';
      this.canUpdate = false;
    }
    this.buyLines = promotion.promoBuys;
    this.getLines = promotion.promoGets;
    let customerList = promotion.promoCustomers;
    promotion.promoCustomers = [];
    // debugger;
    if (promotion.customerType === 'G' || promotion.customerType === 'R') {
      if (customerList !== null && customerList !== undefined && customerList?.length > 0) {
        customerList.forEach(customer => {
          this.cusGrpIdBoxValue.push(customer.customerValue);
        });
        this.isWalkin = false;
      }
    }
    // debugger;
    if (promotion.customerType === 'C') {
      this.CustomerSelected = '';
      if (customerList !== null && customerList !== undefined && customerList?.length > 0) {
        customerList.forEach(customer => {
          this.CustomerSelected += customer.customerValue + ",";
        });
        this.isWalkin = false;
      }
      if (this.CustomerSelected !== '' && (this.CustomerSelected === this.authService.getDefaultCustomer().customerId + "," || this.CustomerSelected === this.authService.getDefaultCustomer()?.mobile + "," || this.CustomerSelected === this.authService.getDefaultCustomer()?.phone + ",")) {
        this.isWalkin = true;
      }
    }
    if (promotion.customerType === 'A') {
      this.isWalkin = false;
    }



    if (promotion.isMon === 'Y' || promotion.isMon === 1) { this.isMon = true } else { this.isMon = false };
    if (promotion.isFri === 'Y' || promotion.isFri === 1) { this.isFri = true } else { this.isFri = false };
    if (promotion.isSat === 'Y' || promotion.isSat === 1) { this.isSat = true } else { this.isSat = false };
    if (promotion.isSun === 'Y' || promotion.isSun === 1) { this.isSun = true } else { this.isSun = false };
    if (promotion.isThu === 'Y' || promotion.isThu === 1) { this.isThu = true } else { this.isThu = false };
    if (promotion.isTue === 'Y' || promotion.isTue === 1) { this.isTue = true } else { this.isTue = false };
    if (promotion.isWed === 'Y' || promotion.isWed === 1) { this.isWed = true } else { this.isWed = false };

    if (promotion.status === 'Y') this.isActive = true;
    if (promotion.isCombine === 'Y') this.isCombine = true;

    let now = new Date();
    let hf, mf, ht, mt;
    debugger;
    if (promotion.validTimeFrom === 0) {
      hf = mf = 0;
    }
    else {
      let str = promotion.validTimeFrom.toString();
      if (str.length === 1) {
        str = "000" + str;
      }
      if (str.length === 2) {
        str = "00" + str;
      }
      if (str.length === 3) {
        str = "0" + str;
      }
      let min = str.substr(-2);
      let hou = str.substr(0, min.length);
      hf = hou;
      mf = min;
    }
    if (promotion.validTimeTo === 0) {
      ht = mt = 0;
    }
    else {
      let str = promotion.validTimeTo.toString();
      if (str.length === 1) {
        str = "000" + str;
      }
      if (str.length === 2) {
        str = "00" + str;
      }
      if (str.length === 3) {
        str = "0" + str;
      }
      let min = str.substr(-2);
      let hou = str.substr(0, min.length);
      ht = hou;
      mt = min;
    }

    let timeF: Date = new Date(now.getFullYear(), now.getMonth(), now.getDay(), hf, mf);
    this.validTimeFrom = timeF;
    let timeT: Date = new Date(now.getFullYear(), now.getMonth(), now.getDay(), ht, mt);
    this.validTimeTo = timeT;
    console.log(' this.validTimeFrom', this.validTimeFrom);
    console.log(' this.validTimeTo', this.validTimeTo);
    // debugger;

    console.log("promotion", promotion);
    if (promotion.totalGetType === 'Discount Percent' && this.promotion.promoType === 6) {
      this.disableTotalMax = true;
    }
    else {
      this.disableTotalMax = false;
    }
    // debugger;
    if (promotion.promoStores !== null && promotion.promoStores !== undefined && promotion.promoStores.length > 0) {
      this.gridBoxValue = [];
      this.storeApply = [];
      promotion.promoStores.forEach(store => {
        this.gridBoxValue.push(store.storeValue); 
      });

    }
    debugger;
    this.customerValueChange(this.promotion.customerType, true);

    if (this.mode === 'copy') {
      this.promotion.promoId = "";
      this.promotion.isUsed = 'N';
      this.promotion.createdOn = null;
      this.isCombine = false;
    }
    // this.promotionTypeChange(this.promotion.promoType, this.isLoadingData);



    // console.log(this.promotion);
  }


  
  loadPromotion() {
    // debugger;
    let comp = this.authService.storeSelected().companyCode;

    this.promotionService.getPromotion(comp, this.promotionId).subscribe((response: any) => {
      if (response.success === true) {
        this.promotion = response.data;
        this.bindPromotionToGrid(response.data);

      }
      else {
        this.alertifyService.warning('get detail promotion id: ' + this.promotionId + ' failed. Message: ' + response.message);
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
  disableTotalMax = true;
  getTotalValueChange(value) {
    debugger;
    if (value === 'Discount Percent' && this.promotion.promoType === 6) {
      this.disableTotalMax = true;
    }
    else {
      this.promotion.maxTotalGetValue = null;
      this.disableTotalMax = false;
    }

    this.promotion.totalGetValue = 0;
  }
  checkVallid(promoType) {
    let result = true;
    if (promoType === 1) //Singe Discount
    {
      // this.buyTab = false;
      // this.getTab = true;
      if (this.getLines === null || this.getLines === undefined || this.getLines.length === 0) {
        this.alertifyService.success('Please input data to get grid');
        result = false;
      }
    }
    if (promoType === 2) //Buy X Get Y
    {
      // this.buyTab = true;
      // this.getTab = true; 
      if (this.getLines === null || this.getLines === undefined || this.getLines.length === 0 || this.buyLines === null || this.buyLines === undefined || this.buyLines.length === 0) {
        this.alertifyService.success('Please input data to get grid');
        result = false;
      }
    }
    if (promoType === 3) //Combo
    {
      // this.buyTab = true;
      // this.getTab = true;
      // this.getgridShow=false;
      if (this.buyLines === null || this.buyLines === undefined || this.buyLines.length === 0) {
        this.alertifyService.success('Please input data to buy grid');
        result = false;
      }
    }
    if (promoType === 4) //Total Bill
    {

    }
    if (promoType === 6) //Mix and Match
    {

    }
    if (promoType === 7) {
      if (this.getLines === null || this.getLines === undefined || this.getLines.length === 0 || this.buyLines === null || this.buyLines === undefined || this.buyLines.length === 0) {
        this.alertifyService.success('Please input data to get grid');
        result = false;
      }
    }

    return result;
  }
  checkCustomer() {
    // debugger;
    let rs = false;
    if (this.promotion.customerType == "C" || this.promotion.customerType == "R" || this.promotion.customerType == "G") {
      if (this.promotion.promoCustomers === null || this.promotion.promoCustomers === null || this.promotion?.promoCustomers?.length <= 0) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
    return rs;
  }
  savePromotion() {

    setTimeout(() => {
      if (this.promotion.promoType === null || this.promotion.promoType === undefined) {
        this.alertifyService.success('please select promo type');
      }
      else {
        if (this.isVoucher === false && (this.promotion.validDateFrom === null || this.promotion.validDateFrom === undefined || this.promotion.validDateTo === null || this.promotion.validDateTo === undefined)) {
          this.alertifyService.success('please input from date/to date');
        }
        else {
          if (this.checkVallid(this.promotion.promoType) === true) {
            // debugger;
            if (this.promotion.customerType === "G" || this.promotion.customerType === "R") {
              let groupLineNum = 1;
              if (this.cusGrpIdBoxValue !== null && this.cusGrpIdBoxValue !== undefined && this.cusGrpIdBoxValue.length > 0) {
                this.promotion.promoCustomers = [];
                this.cusGrpIdBoxValue.forEach(groupId => {
                  // debugger;
                  // let checkGroupId = this.promotion?.promoCustomers.filter(x=>x.customerValue === groupId);
                  // if(checkGroupId!==null && checkGroupId !==undefined && checkGroupId.length > 0)
                  // {

                  // }
                  // else
                  // {
                  let promoCustomer = new SPromoCustomer();
                  promoCustomer.customerType = this.promotion.customerType;
                  promoCustomer.customerValue = groupId;
                  promoCustomer.lineNum = groupLineNum;
                  promoCustomer.companyCode = this.authService.storeSelected().companyCode;
                  let checkId = this.promotion?.promoCustomers.filter(x => x.customerValue === promoCustomer.customerValue);
                  if (checkId === null || checkId === undefined || checkId?.length <= 0) {
                    this.promotion.promoCustomers.push(promoCustomer);
                  }
                  // this.promotion.promoCustomers.push(customer);
                  groupLineNum++;
                  // }

                  // this.promotion.promoCustomers.push(store);

                });
              }
              else {
                this.promotion.promoCustomers = [];
              }
            }

            if (this.checkCustomer()) {
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
                  let numOfBuy= 1;
                  this.buyLines.forEach((item) => { item.lineNum = numOfBuy; buylines.push(item);
                    debugger;
                    if(item.lines!==null && item.lines!==undefined && item.lines?.length > 0 )
                    {
                      let NameOfOT = item?.lineCode;
                      if(NameOfOT===null || NameOfOT === undefined || NameOfOT === '' || NameOfOT === 'OneTimeGroup' )
                      {
                        NameOfOT = 'OTBuy_' + item.lineNum;
                      }
                      item.lineCode = NameOfOT;
                      let sttRow= 1;
                      item.lines.forEach((lineItem) =>{
                        lineItem.lineNum = sttRow;
                        lineItem.groupID = NameOfOT;
                        sttRow++;
                      })
                    }
                    numOfBuy++;
                  });
                  let getlines = [];
                  let numOfGet= 1;
                  this.getLines.forEach((item) => { item.lineNum = numOfGet; getlines.push(item) 
                    if(item.lines!==null && item.lines!==undefined && item.lines?.length > 0 )
                    {
                      let NameOfOT = item?.lineCode;
                      if(NameOfOT===null || NameOfOT === undefined || NameOfOT === '' || NameOfOT === 'OneTimeGroup' )
                      {
                        NameOfOT = 'OTGet_' + item.lineNum;
                      }
                      item.lineCode = NameOfOT;
                      let sttRow= 1;
                      item.lines.forEach((lineItem) =>{
                        lineItem.lineNum = sttRow;
                        lineItem.groupID = NameOfOT;
                        sttRow++;
                      })
                    }
                    numOfGet++;
                  });
                  this.promotion.promoBuys = buylines;

                  this.promotion.promoGets = getlines;
                  this.promotion.companyCode = this.authService.storeSelected().companyCode;
                  let hF = this.validTimeFrom.getHours();
                  let mF = this.validTimeFrom.getMinutes();
                  let hT = this.validTimeTo.getHours();
                  let mT = this.validTimeTo.getMinutes();

                  this.promotion.validTimeFrom = parseInt(this.leftPad(hF, 2) + this.leftPad(mF, 2));
                  this.promotion.validTimeTo = parseInt(this.leftPad(hT, 2) + this.leftPad(mT, 2));
                  if (this.isMon === true) {
                    this.promotion.isMon = 'Y';
                  } else { this.promotion.isMon = 'N'; }
                  if (this.isTue === true) {
                    this.promotion.isTue = 'Y';
                  } else { this.promotion.isTue = 'N'; }
                  if (this.isWed === true) {
                    this.promotion.isWed = 'Y';
                  } else { this.promotion.isWed = 'N'; }
                  if (this.isThu === true) {
                    this.promotion.isThu = 'Y';
                  } else { this.promotion.isThu = 'N'; }
                  if (this.isFri === true) {
                    this.promotion.isFri = 'Y';
                  } else { this.promotion.isFri = 'N'; }
                  if (this.isSat === true) {
                    this.promotion.isSat = 'Y';
                  } else { this.promotion.isSat = 'N'; }
                  if (this.isSun === true) {
                    this.promotion.isSun = 'Y';
                  } else { this.promotion.isSun = 'N'; }
                  if (this.isCombine === true) {
                    this.promotion.isCombine = 'Y';
                  } else { this.promotion.isCombine = 'N'; }
                  if (this.isActive === true) {
                    this.promotion.status = 'Y';
                  } else { this.promotion.status = 'N'; }

                  if (this.mode === "copy") {
                    this.promotion.promoId = "";
                    this.promotion.isCombine = 'N';

                  }
                  if (this.mode === "setup") {
                    debugger
                    let XDate = new Date(this.promotion.validDateFrom.toString());
                    let YDate = new Date(this.promotion.validDateTo.toString());
                    let bT = this.GetDateFormat(XDate);
                    let bF = this.GetDateFormat(YDate);
                    this.promotion.validDateFrom = bT;
                    this.promotion.validDateTo = bF;
                  }
                  let storeNum = 1;
                  if (this.gridBoxValue !== null && this.gridBoxValue !== undefined && this.gridBoxValue.length > 0) {
                    this.promotion.promoStores = [];
                    this.gridBoxValue.forEach(storeSelected => {
                      // debugger;
                      let store = new SPromoStore();
                      store.storeValue = storeSelected;
                      store.lineNum = storeNum;
                      this.promotion.promoStores.push(store);
                      storeNum++;
                    });
                  }
                  else {
                    this.promotion.promoStores = [];
                  }

                  // // this.promotion.validDateTo = 
                  // console.log(fY +"/" + fM +"/" + fD);
                  if (this.promotion.maxTotalGetValue !== null && this.promotion.maxTotalGetValue !== undefined) {
                    if (this.promotion.maxTotalGetValue <= 0) {
                      this.promotion.maxTotalGetValue = null;
                      // this.alertifyService.success("Max get value can't equal 0");
                      // result = false;
                    }
                  }
                  this.promotion.createdBy = this.authService.getCurrentInfor().username;
                  this.promotion.modifiedBy = this.authService.getCurrentInfor().username;
                  // this.promotion.createdOn = null;
                  // this.promotion.modifiedOn = null;
                  // debugger;
                  this.promotionService.saveEntity(this.promotion).subscribe((response: any) => {
                    if (response.success) {
                      // console.log(response.data)
                      // let  response.data
                      // this.alertifyService.success('save promotion completed successfully. ' + response.data);
                      Swal.fire('Setup Promotion','save promotion completed successfully. ','success').then(()=>{
                        this.router.navigate(["admin/promotion/edit", response.data]).then(()=>{
                          window.location.reload();
                        });
                      }); 
                      // this.router.navigate(["admin/crm/edit", response.data]).then(()=>{
                      //   window.location.reload();
                      // });
                    }
                    else {
                      // this.alertifyService.warning('save promotion failed. Message: ' + response.message);
                      Swal.fire('Save Promotion', 'save promotion failed. Message: ' + response.message, 'warning'); 
                    }
                  }, error =>{
                    console.log('Promotion error' , error)
                    Swal.fire('Save Promotion', 'Failed to save Promotion', 'error'); 
                  });
                }
              });

            }
            else {
              this.alertifyService.warning('Please input customer');
            }


          }

        }

      }

    }, 5);
    // xxx


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
    this.promotionService.getPromotionsType().subscribe((response: any) => {
      this.promtionType = response.data;
      console.log(this.promtionType);
    });
  }
  loadingItem=true;
  loadItemList(itemcode, uomcode, barcode, keyword) {
    this.itemService.GetItemWithoutPriceList(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, itemcode, uomcode, barcode, keyword, '')
      .subscribe((response: any) => {
        // debugger;
        this.loadingItem = false;
        this.itemList = response.data;
      }, error =>{
        this.loadingItem = false;
      });
  }
  addRowBuy() {
    setTimeout(x => {
      this.buytt.instance.addRow();
    }, 300);
  }
  addRowGet() {
    setTimeout(x => {
      this.gett.instance.addRow();
    }, 300);
  }
  // 
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
  onInitNewOTGETRow(e) {
    debugger;
     
    // if(this.whs.defaultSlocId?.length > 0 ||  this.authService.storeSelected().whsCode?.length > 0)
    // {

    // }
   
         setTimeout(() => {
        // this.popupVisible = true;
        let stt: number= this.getot.instance.totalCount()??0 + 1; 
        e.data.lineNum = stt;
        // e.data.slocId = this.whs.defaultSlocId != null ? this.whs.defaultSlocId : this.authService.storeSelected().whsCode;
      }, 10);
 
  }
  onInitNewOTBUYRow(e)
  {
    
    setTimeout(() => {
        // this.popupVisible = true;
        debugger;
        let stt: number= this.buyot.instance.totalCount()??0 + 1; 
        e.data.lineNum = stt + 1;
        // e.data.slocId = this.whs.defaultSlocId != null ? this.whs.defaultSlocId : this.authService.storeSelected().whsCode;
      }, 10);
 
  }
  onOTItemBuySelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {

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
      this.buyot.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
      this.buyot.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
      this.buyot.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);


    }

  }
  onOTBarcodeItemBuySelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {

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
      this.buyot.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
      this.buyot.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
      this.buyot.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);


    }

  }
  onOTItemGetSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {

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
      this.getot.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
      this.getot.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
      this.getot.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);


    }

  }
  onOTBarcodeItemGetSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {

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
      this.getot.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
      this.getot.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
      this.getot.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);


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
      this.gett.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
      this.gett.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
      this.gett.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);

    }

  }
  onPaymentCodeGetSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
    // debugger;
    console.log(cellInfo);
    cellInfo.setValue(selectedRowKeys[0]);

    if (selectedRowKeys.length > 0) {
      dropDownBoxComponent.close();
      // mcid: string="";
      // companyCode: string="";
      // mchier: string="";
      // mcname: string="";
      let code = event.selectedRowsData[0].paymentCode;
      let name = event.selectedRowsData[0]?.paymentDesc;
      let uom = '';
      // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
      this.gett.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
      this.gett.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
      this.gett.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);

    }

  }
  onPaymentTypeGetSelectionChanged(selectedRowKeys, cellInfo, event, e, dropDownBoxComponent) {
    // debugger;
    console.log(cellInfo);
    cellInfo.setValue(selectedRowKeys[0]);

    if (selectedRowKeys.length > 0) {
      dropDownBoxComponent.close();
      // mcid: string="";
      // companyCode: string="";
      // mchier: string="";
      // mcname: string="";
      let code = event.selectedRowsData[0].Code;
      let name = event.selectedRowsData[0]?.Name;
      let uom = '';
      // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
      this.gett.instance.cellValue(cellInfo.rowIndex, 'lineCode', code);
      this.gett.instance.cellValue(cellInfo.rowIndex, 'lineName', name);
      this.gett.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);

    }

  }
}
