// import {
//   serial as polyfill, SerialPort, SerialPort as SerialPortPolyfill,
// } from 'web-serial-polyfill';

import { DatePipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, HostListener, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { DxSelectBoxComponent, DxSwitchComponent, DxTextBoxComponent, DxTreeViewComponent } from 'devextreme-angular';
import { AllowIn, KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxPrinterService } from 'ngx-printer';
import { interval, Observable, timer } from 'rxjs';
import { SBarcodeSetup } from 'src/app/_models/barcodesetup';
import { MCustomer } from 'src/app/_models/customer';
import { MEmployee } from 'src/app/_models/employee';
import { SGeneralSetting } from 'src/app/_models/generalsetting';
import { Item } from 'src/app/_models/item';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { Payment } from 'src/app/_models/payment';
import { MStore } from 'src/app/_models/store';
import { IBasket, IBasketDiscountTotal, IBasketItem, IBasketPayment, IBasketTotal } from 'src/app/_models/system/basket';
import { TSalesLine } from 'src/app/_models/tsaleline';
import { TShiftHeader } from 'src/app/_models/tshiftheader';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { BarcodesetupService } from 'src/app/_services/data/barcodesetup.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { BomService } from 'src/app/_services/data/bom.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
// import { EmployeeService } from 'src/app/_services/data/employee.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { ShortcutService } from 'src/app/_services/data/shortcut.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { PermissionService } from 'src/app/_services/system/permission.service';
import Swal from 'sweetalert2';
import { ShopCapacityComponent } from '../capacity/shop-capacity/shop-capacity.component';
import { ShopCardInputComponent } from '../components/shop-card-input/shop-card-input.component';
import { ShopCardMemberInputComponent } from '../components/shop-card-member-input/shop-card-member-input.component';
import { ShopMemberInputComponent } from '../components/shop-member-input/shop-member-input.component';
import { ShopApprovalInputComponent } from '../tools/shop-approval-input/shop-approval-input.component';
import { ShopExchangeItemListComponent } from '../tools/shop-exchange-item-list/shop-exchange-item-list.component';
import { ShopInvoiceInputComponent } from '../tools/shop-invoice-input/shop-invoice-input.component';
import { ShopItemSerialComponent } from '../tools/shop-item-serial/shop-item-serial.component';
import BarcodeScanner from "simple-barcode-scanner"; 
// import { SerialPort, SerialOptions } from "../../serial";
// import { PaymentmethodService } from 'src/app/_services/data/paymentmethod.service';
import { StorePaymentService } from 'src/app/_services/data/store-payment.service';
import { MReason } from 'src/app/_models/reason';
import { ShopReasonInputComponent } from '../tools/shop-reason-input/shop-reason-input.component';
import { ReasonService } from 'src/app/_services/data/reason.service';
import { take } from 'rxjs/operators';
import { LoadingService } from 'src/app/_services/common/loading.service';
import { SerialPort } from 'src/app/serial';
import { SStoreClient } from 'src/app/_models/storeclient';
import { FormControl } from '@angular/forms';
import { createMask } from '@ngneat/input-mask';
import { environment } from 'src/environments/environment';
import { fadeSlideGrowKeyframe } from '../route.animation';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { KeyboardService } from 'src/app/component/shared/virtual-keyboard/virtual-keyboard.service';
import { ShopToolsAssignStaffComponent } from '../tools/shop-tools-assign-staff/shop-tools-assign-staff.component';
import { MSalesChannel } from 'src/app/_models/msaleschannel';
import { SalesChannelService } from 'src/app/_services/data/sales-channel.service';
import * as $ from "jquery";
import 'jqueryui';
import { ShopToolsSettlementComponent } from '../tools/shop-tools-settlement/shop-tools-settlement.component';
import { ShopToolClearCacheComponent } from '../tools/shop-tool-clear-cache/shop-tool-clear-cache.component';
import { ExcuteFunctionService } from 'src/app/_services/common/excuteFunction.service';
import { stringify } from 'querystring';
import { OrderLogModel } from 'src/app/_models/orderlogModel';
import { ExcelService } from 'src/app/_services/common/excel.service';

enum LoadingIndicator {
  OPERATOR,
  MANUAL,
  ASYNC_PIPE
}



// declare const navigator: any;
@Component({
  selector: 'app-shop-order-grocery',
  templateUrl: './shop-order-grocery.component.html',
  styleUrls: ['./shop-order-grocery.component.scss'],
  animations:[
    fadeSlideGrowKeyframe,
    // trigger('fadeSlideGrowKeyframe', [
    //   transition(':enter', [
    //       style({ opacity: 0, transform: 'scale(0.5) translateY(50px)' }),
    //       animate(
    //           '500ms',
    //           keyframes([
    //               style({ opacity: 1, offset: 0.3 }),
    //               style({ transform: 'translateY(0)', offset: 0.6 }),
    //               style({ transform: 'scale(1)', offset: 1 }),
    //           ])
    //       ),
    //   ])
    // ]),
    trigger('fadeInOut', [
      state('void', style({
        transform: 'rotate(-360deg)',
        opacity: 0
      })),
      transition('void <=> *', animate(500)),
    ]),
  ]
})
export class ShopOrderGroceryComponent implements OnInit, AfterViewChecked  {

  display: false;
  items: ItemViewModel[];
  selectedCateFilter: string = "";
  merchandiseList: MMerchandiseCategory[];
  pagination: Pagination;
  userParams: any = {};
  typeOrder: string = "Receipt";
  showShift = false;
  // @HostListener('window:beforeunload', ['$event'])
  slideFilterConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 3,
    "rows": 1,
    // "prevArrow": '<button type="button" id="scrollLeft" class="scroll-btn"> <span class="arrow arrow-left"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="17.085" viewBox="0 0 10 17.085"> <g id="surface1" opacity="0.9"> <path class="arrow-icon" id="Path_10" data-name="Path 10" d="M25.437,8.246,26.895,9.7l-7.1,7.087,7.1,7.1-1.441,1.439L17.63,17.508l-.736-.72.736-.72Z" transform="translate(-16.895 -8.246)" /> </g> </svg> </span> </button>',
    // "nextArrow": '<button type="button" id="scrollRight" class="scroll-btn"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="17.085" viewBox="0 0 10 17.085"> <g id="surface1" opacity="0.9"><path class="arrow-icon" id="Path_10" data-name="Path 10" d="M25.437,8.246,26.895,9.7l-7.1,7.087,7.1,7.1-1.441,1.439L17.63,17.508l-.736-.72.736-.72Z" transform="translate(-16.895 -8.246)"/></g></svg></button>',
    dots: false,
    "infinite": false,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1430,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },]
  };
  isVirtualKey = false;
  isGenNewOrderNo = false;
  isSerialPortPoleOpen= false;
  chanel = "false";

  async newOrder() {

    let store = this.authService.storeSelected();
    let currentType = "Retail";
    this.typeOrder = "Receipt";
    // debugger;
    this.inputOMSMode = false;
    let num = this.commonService.getCurrentBillCount();
    if(num !== 0)
      num +=1;
    console.log("numX", num);
    this.commonService.changeBillCount(num);
    this.basketService.changeIsCreateOrder(false);
    this.basketService.changeBasketResponseStatus(true);
    // console.log("newOrder");
    let defEmployee = this.authService.getCurrentInfor()?.defEmployee;
    this.order = new Order();
    this.outPutModel = null;
    this.order.salesPerson = null;
  
    const basket = this.basketService.getCurrentBasket();
    if (basket !== null && basket !== undefined) {
      this.basketService.getNewOrderCode(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe(data => {

        this.orderNo = data;
      });
      this.basketService.deleteBasket(basket, this.orderNo).subscribe(() => { 
      });
      let version = localStorage.getItem("currenVersion");
      let userName = this.authService.getCurrentInfor()?.username;
      this.authService.setOrderLog("Order", "New Order", "Success " , version,  userName?.toString());
      let cus = this.authService.getDefaultCustomer();
      // cus.customerGrpId = '1';
      // cus.customerId = '2888018899249995';
      // cus.customerName = 'SOENIZAL BIN AWANG MOKHTAR'; 
      // this.basketService.setBasket(basket);
      // debugger;
      if (cus !== null && cus !== undefined) {
        setTimeout(() => {
          this.basketService.changeCustomer(cus, currentType);
        
          // debugger;
          // this.route.navigate(['/shop/order']);
          if (defEmployee !== null && defEmployee !== undefined && defEmployee !== '') {
            // debugger;
            let employee = this.employees.find(x => x.employeeId === defEmployee);
            if (employee !== null && employee !== undefined) {
              this.order.salesPerson = defEmployee;
              this.basketService.changeEmployee(employee);
              // this.basketService.changeEmployee(employee);
              
            }
            else {
              if (this.employees.length > 0) {
                this.order.salesPerson = this.employees[0].employeeId;
              }
              // this.alertify.warning("Can't set default employee. B/c employee " + defEmployee + " has not existed in store " + this.storeSelected.storeId);
            }
          }
          if (this.authService.getShopMode() === 'FnB') {
            this.routeNav.navigate(["shop/order"]).then(() => {
              // window.location.reload();
            });
          }
          if (this.authService.getShopMode() === 'Grocery') {
            this.routeNav.navigate(["shop/order-grocery"]).then(() => {
              // window.location.reload();
            });

          }
          // this.routeNav.navigate(['/shop/order']).then(() => {
          //   // window.location.reload();
          // });
        }, 2);
      }
      // this.basketService.writeLogRemove(this.orderNo).subscribe((response: any)=>{
      //   debugger;
      //   if(response.success)
      //   { 
          
      //   }
      //   else
      //   {
      //       Swal.fire({
      //           icon: 'warning',
      //           title: 'Log Remove Basket',
      //           text: response.message
      //         });
      //   }
      // }, error=>{
      //   console.log('Log Remove Basket Error', error);
      //     Swal.fire({
      //       icon: 'error',
      //       title: 'Log Remove Basket',
      //       text:"Failed to connect System. Please Try again or contact to support team."
      //     });
      // })
   
    
      
    }
    else {
      let version = localStorage.getItem("currenVersion");
      this.authService.setOrderLog("Order", "New Order", "Success", version);
      let cus = this.authService.getDefaultCustomer();
      // cus.customerGrpId = '1';
      // cus.customerId = '2888018899249995';
      // cus.customerName = 'SOENIZAL BIN AWANG MOKHTAR'; 
      // debugger;
      if (cus !== null && cus !== undefined) {
        setTimeout(() => {
          this.basketService.changeCustomer(cus, currentType);
        
          // this.route.navigate(['/shop/order']);
          if (defEmployee !== null && defEmployee !== undefined && defEmployee !== '') {
            let employee = this.employees.find(x => x.employeeId === defEmployee);
            if (employee !== null && employee !== undefined) {
              this.order.salesPerson = defEmployee;
              this.basketService.changeEmployee(employee);
              // this.basketService.changeEmployee(employee);
            }
            else {
              if (this.employees.length > 0) {
                this.order.salesPerson = this.employees[0].employeeId;
              }
              // this.alertify.warning("Can't set default employee. B/c employee " + defEmployee + " has not existed in store " + this.storeSelected.storeId);
            }
          }
          if (this.authService.getShopMode() === 'FnB') {
            this.routeNav.navigate(["shop/order"]).then(() => {
              
              // window.location.reload();
            });
          }
          if (this.authService.getShopMode() === 'Grocery') {
            this.routeNav.navigate(["shop/order-grocery"]).then(() => {
             
              // window.location.reload();
            });

          }
          // this.routeNav.navigate(['/shop/order']).then(() => {
          //   // window.location.reload();
          // });
        }, 2);
      }

    }
    setTimeout(() => { 
      
      this.txtSearch.nativeElement.focus();
      this.loadShortcut();
    }, 500);
    debugger;
    if(this.poleDisplay==='true')
    {  
       this.WriteValue("     WELCOME TO", this.authService.getCompanyInfor().companyName, false);
      //  await
    }
    debugger;
    let getkey= localStorage.getItem("customerDisplay");
    if(getkey===null || getkey===undefined || getkey ==="")
    {
      getkey = "false"; 
      // setTimeout(() => {
      //   localStorage.setItem("customerDisplay", "false");
      // }, 10);
    }
    if(this.customerDisplay === 'true' && getkey ==="false")
    {
      setTimeout(() => { 
        this.detectMultiMonitor();
      }, 30);
    }


    // this.basketService.changeBasketResponseStatus(true);

    
  
  }
  // valueChanged(data) {
  //   this.emailValue = data.value.replace(/\s/g, "").toLowerCase() + "@corp.com";
  // }
  customerInput = "";
  customerChanged(data) {
    this.customerInput = data.value;
  }

  selectedRow = null;
  amountCharge = null;
  payment = null;
  port: any;
  fullscreen()
  {
    setTimeout(() => {
    localStorage.setItem('customerDisplay', "false");
      
    }, 10);
  }
  async connectSerial() {
 
  
    if (navigator.permissions) {   // Typescript is happy now
      // debugger;
      // let ports = await navigator.serial.getPorts();
      // console.log(ports);
      // // debugger;
      // navigator.serial.requestPort({ filters: usbVendorId: 1659}).then((port) => {
      //   // Connect to `port` or add it to the list of available ports.
      // }).catch((e) => {
      //   // The user didn't select a port.
      // });
      // let usbVendorId= 1659;
     
      // this.port = await navigator.serial.requestPort({
           
      // }) 
      let usbVendorIdX = this.commonService.getPoleDisplayValue();// localStorage.getItem('usbVendorId');
      // console.log('usbVendorIdX', usbVendorIdX);
      if (usbVendorIdX!==null && usbVendorIdX!==undefined && usbVendorIdX!=='' && usbVendorIdX!=="undefined"  && usbVendorIdX!=="null") {
        // const filter = { usbVendorId: usbVendorIdX };
        // const port = await navigator.serial.requestPort();
        // let port = await navigator.serial.requestPort({ filters: [filter] }) ;
        
        let ports = await navigator.serial.getPorts();
     
          if ((ports !== null) && (Array.isArray(ports)) && (ports?.length > 0)) {
             
            for (let i = 0; i < ports.length; i++) {
             
              let usbVendorId = ports[i].getInfo()?.usbVendorId?.toString();
              
              if(usbVendorId !==null && usbVendorId !== undefined && usbVendorId === usbVendorIdX.toString())
              {
              
                this.port = ports[i];
              } 
            } 
          }
          else
          {
            this.port = await navigator.serial.requestPort({
           
            }) 
          }
          // console.log(this.port.getInfo()) ;
      } else { 
        // debugger;
        this.port = await navigator.serial.requestPort({
           
        }) 
      }
      debugger;
      if(this.port===null || this.port===undefined)
      {
        this.port = await navigator.serial.requestPort({
           
        }) 
      }
      
      try {
        
         this.ignorePoleDisplay =false;
        //  if(this.port.getInfo().vendorId!==null && this.port.getInfo().vendorId!==undefined && this.port.getInfo().vendorId!=='')
        //  {
           
        //  }
        //  else
        //  {
          
        //  }
        // console.log(this.port.IsOpen)  ;
         await  this.port.open({
          baudRate: 9600,
          // dataBits: 8,
          // stopBits: 1,
          // parity: "none"
         }).then(async (err: any) => {
            if (err) return console.dir( 'Error' + err);
            console.log('serial port opened');
            // // console.dir( this.port);
            // console.log( this.port.getInfo());

            // console.log('serial port opened', this.port.getInfo());
            debugger;
            let id: any = this.port.getInfo().usbVendorId;
            if(id!== null && id!==undefined && id!=='null' && id!=='undefined' && id!=='')
            {
              this.isSerialPortPoleOpen = true;
              this.commonService.setPoleDisplayValue(id);
            }
          
            // await this.WriteValue("     WELCOME TO", this.authService.getCompanyInfor().companyName, false);
            // localStorage.setItem('usbVendorId', id  )
          });
          
      } catch (error) {
        debugger;
        console.log(error);
        if(this.port===null || this.port===undefined)
        {
          this.connectSerial();
        }
       
        // this.ignorePoleDisplay=true;
        // this.alertify.warning(error);
      }
       
      
      
      
      
    }
     
     
      
  }
  reasonList: MReason[] =[];
  FocusSearch()
  {
    this.inputBarcode = true;
    setTimeout(() => {
      this.loadShortcut();
      this.txtSearch.nativeElement.value = '';
      this.txtSearch.nativeElement.focus();
    }, 10);
  
  }
  permissionStatus ;
  async detectMultiMonitor()
  {
    // Detect if the device has more than one screen.
    

      if (window.screen.isExtended) {
        debugger;

        // this.permissionStatus =   navigator.permissions;
       
        // Request information required to place content on specific screens.
        const screenDetails = await window.getScreenDetails();
 
        // console.log('screenDetails', screenDetails.screens);
        // // Detect when a screen is added or removed.
        // screenDetails.addEventListener('screenschange', onScreensChange);

        // // Detect when the current <code data-opaque bs-autolink-syntax='`ScreenDetailed`'>ScreenDetailed</code> or an attribute thereof changes.
        // screenDetails.addEventListener('currentscreenchange', onCurrentScreenChange);

        // Find the primary screen, show some content fullscreen there.
        const primaryScreen = screenDetails.screens.find(s => s.isPrimary);
        // document.documentElement.requestFullscreen({screen : primaryScreen});

        // Find a different screen, fill its available area with a new window.
        const otherScreen = screenDetails.screens.find(s => !s.isPrimary); 
        document.documentElement.requestFullscreen({screen : otherScreen});
        // let fullscreenOptions = { navigationUI: "auto" };
        
        window.open("shop/order-display", '_blank', `channelmode=1,scrollbars=1,status=0,titlebar=0,toolbar=0,resizable=1,left=${otherScreen.availLeft},` +
                                  `top=${otherScreen.availTop},` +
                                  `width=${otherScreen.availWidth},` +
                                  `height=${otherScreen.availHeight}`);
                                  // .focus();
        // document.documentElement.requestFullscreen({screen : otherScreen});
        // window.moveTo(0,0); window.resizeTo(otherScreen.width,otherScreen.height-40);
                                  
                                  // setTimeout(() => {
                                  //   myWindow.focus()
                                  // })
      
      } 
      // else {
         
      //   const screenDetails = await window.getScreenDetails();
 
      //   console.log('screenDetails', screenDetails.screens);
      //   // // Detect when a screen is added or removed.
      //   // screenDetails.addEventListener('screenschange', onScreensChange);

      //   // // Detect when the current <code data-opaque bs-autolink-syntax='`ScreenDetailed`'>ScreenDetailed</code> or an attribute thereof changes.
      //   // screenDetails.addEventListener('currentscreenchange', onCurrentScreenChange);

      //   // Find the primary screen, show some content fullscreen there.
      //   const otherScreen = screenDetails.screens.find(s => s.isPrimary);
      //   document.documentElement.requestFullscreen({screen : otherScreen});

      //   // Find a different screen, fill its available area with a new window.
      //   // const otherScreen = screenDetails.screens.find(s => !s.isPrimary);
      //   // let fullscreenOptions = { navigationUI: "auto" };

      //   var myWindow = window.open("shop/order-display", '_blank', `fullscreen=yes,left=${otherScreen.availLeft},` +
      //                             `top=${otherScreen.availTop},` +
      //                             `width=${otherScreen.availWidth},` +
      //                             `height=${otherScreen.availHeight}`).focus();; 

         
      // }
  }
 
  loadReasonList()
  {
    // debugger;
    this.reasonService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      // debugger;
      this.reasonList = response.data.filter(x=>x.status==='A' && x.type==='Cancel');
    })
  }
  openModal(template: TemplateRef<any>) {
    let basketTotal = this.basketService.getTotalBasket();
    if(basketTotal!==null || basketTotal!==undefined)
    {
      this.authService.setOrderLog("Order", "Payment click", "", basketTotal?.billTotal?.toString());
    }
    else
    {
      this.authService.setOrderLog("Order", "Payment click", "", "");
    }
    
    let basket = this.basketService.getCurrentBasket();
    this.basketService.removePayments(basket);
   if(this.checkOrderBefInsert())
   {
//
    // When disabling open immediately.
    // create an empty modbus client

    if(this.ManualRunPromotion === 'true' && basket?.isApplyPromotion !== true)
    {
      this.runManualPromotion();
    }
    else
    {

      this.basketService.changeNegativeOrder(false);
      let basketInfor= this.basketService.getTotalBasket(); 
      let checkAction =  this.authService.checkRole(this.functionId , 'fnApproveLimitAmount', 'I');
      let checkApprovalRequire =  this.authService.checkRole(this.functionId , 'fnApproveLimitAmount', 'A');
      if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
      {
        checkAction = false;
      }
      debugger;
      let limitOrder = 0;
      if(this.orderAmountLimit !== null && this.orderAmountLimit !== undefined && this.orderAmountLimit !== 0 )
      {
        limitOrder= this.orderAmountLimit;
      }
      if(basketInfor.billTotal > limitOrder && limitOrder != 0 && checkAction === false)
      {
        // const initialState = {
        //   title: 'Limit Amount - Permission denied',
        //   };
          let permissionModel= { functionId: this.functionId,  functionName: 'Limit Amount',  controlId: 'fnApproveLimitAmount', permission: 'I'};
          const initialState = {
              title:  'Limit Amount - Permission denied', permissionModel : permissionModel
          };
          let modalApprovalRef = this.modalService.show(ShopApprovalInputComponent, {
            initialState, 
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: true,
            ariaDescribedby: 'my-modal-description',
            ariaLabelledBy: 'my-modal-title',
            class: 'modal-dialog modal-xl medium-center-modal'
            // class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
          });
          modalApprovalRef.content.outEvent.subscribe((received: any) => {
            if(received.isClose)
            { 
              modalApprovalRef.hide();
            }
            else
            {
              debugger;
 
              this.authService.setOrderLog("Order", "Approve Limit Amount", "", "Approve by " + received.user);
              this.beforeShowPayment(template)
              modalApprovalRef.hide();

              // let code = (received.customCode ?? '');
              // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, code, this.functionId, 'fnApproveLimitAmount', 'I' ).subscribe((response: any)=>{
               
              //   if (response.success) {
              //     let note = (received.note ?? '');
              //     if (note !== null && note !== undefined && note !== '') {
              //       this.basketService.changeNote(note).subscribe((response) => {
      
              //       });
              //       this.alertify.success('Set note successfully completed.');
              //     }

                 
              //   }
              //   else {
              //       Swal.fire({
              //         icon: 'warning',
              //         title: 'Limit Amount',
              //         text: response.message
              //       });
                     
              //   }
              // })
            }
          
          });
          modalApprovalRef.onHide.subscribe((reason: string) => { 
            this.commonService.TempShortcuts$.subscribe((data)=>{
              this.commonService.changeShortcuts(data, true);
              // console.log('Old Shorcut' , data );
            });
          })
      }
      else
      {
        this.beforeShowPayment(template)
      }
    }


   }
    
    
  
   
  }
  
  beforeShowPayment(template)
  {
    let basket = this.basketService.getCurrentBasket();
    if((basket?.salesType.toLowerCase() === "ex" || basket?.salesType.toLowerCase() === "exchange"
     || basket?.salesType.toLowerCase() === "return") && (basket.reason===null || basket.reason===undefined || basket.reason=== ''))
     {
      if(this.reasonList!==null && this.reasonList!==undefined && this.reasonList?.length > 0)
      {
        let langOptions = [];
        this.reasonList.forEach(element => {
          debugger;
          if(langOptions.filter(x=>x.value===element.language)?.length <= 0)
          {
            debugger;
            langOptions.push({value: element.language, name: element.language})
          }
        
        });
        // debugger;
        const initialState = {
          reasonList:  this.reasonList,
          langs: langOptions
      }
     
      
      let modalRefX = this.modalService.show(ShopReasonInputComponent, {initialState ,  animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false, 
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title', 
        class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'});
        
        modalRefX.content.outReason.subscribe((response: any) => {
          debugger; 
            modalRefX.hide();
            if(response.selected)
            {
              this.authService.setOrderLog("Order", "Reason Input", "Success", response.selectedReason);
              this.basketService.changeReason(response.selectedReason);
              this.showPayment(basket, template);
            }
             
        });
  
     }
     else
     {
        Swal.fire({
          title: 'Submit your reason',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Submit',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
            this.authService.setOrderLog("Order", "Reason Input", "Success", result.value);
            this.basketService.changeReason(result.value);
            this.showPayment(basket, template);
          }
        })
     }
    }
    else
    {
       
        this.showPayment(basket, template);
      
     
    }
   
  }

  checkItemPriceInvalid()
  {

  }
 
  async showPayment(basket, template)
  {
    console.log(this.shortcuts);

    // this.commonService.changeShortcuts([], true);
    let basketInfor= this.basketService.getTotalBasket(); 

    console.log(this.mode);
    debugger;
    
    if(this.poleDisplay==='true')
    {
      if(basketInfor?.total !== 0)
      { 
          await this.WriteValue("TOTAL PAYABLE", "(" + this.storeSelected.currencyCode + ") " + this.authService.formatCurrentcy(basketInfor.total), false);
      }
     
    }
    
    if(basketInfor.subtotal < 0 )
    {
      this.basketService.changeNegativeOrder(true);
    }

    // this.showModal = true; 
    if (this.basketService.checkSerialValidLine())
    {
      if(this.basketService.checkItemInValidLine())
      {
        debugger;
     
        let employee = basket.employee;
    
     
        if(this.salesPersonalMandatory==='true')
        {
          if (employee !== null && employee !== undefined) 
          {
            this.showModal = true;
            setTimeout(() => {
              this.modalRef = this.modalService.show(template, {
                ariaDescribedby: 'my-modal-description',
                ariaLabelledBy: 'my-modal-title',
                keyboard: true,
                backdrop: 'static',
                ignoreBackdropClick: false, 
                class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
              });
             
              this.modalRef.onHide.subscribe((reason: string) => {
                this.loadShortcut();
                this.showModal= false;
                this.basketService.changeBasketResponseStatus(true);
                // console.log("Hide ShowPayment");
              })
            });
      
            this.selectedRow = null;
            this.amountCharge = null;
            this.payment = null;
          }
          else {
            
            Swal.fire({
              icon: 'warning',
              title: 'Employee',
              text: "Please select employee"
            });
          }
        }
        else
        {
          this.showModal = true;
          setTimeout(() => {
            this.modalRef = this.modalService.show(template, {
              ariaDescribedby: 'my-modal-description',
              ariaLabelledBy: 'my-modal-title',
              keyboard: true,
              backdrop: 'static',
              ignoreBackdropClick: false, 
              class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
            });
           
            this.modalRef.onHide.subscribe((reason: string) => {
              this.loadShortcut();
              this.showModal= false;
              this.basketService.changeBasketResponseStatus(true);
              // console.log("Hide ShowPayment 2");
            })
          });
    
          this.selectedRow = null;
          this.amountCharge = null;
          this.payment = null;
        }
        
      }
      else
      {
        Swal.fire({
          icon: 'warning',
          title: 'Item Price Invalid',
          text: "Can't completed order. Price of item invalid"
        });
      }
      
    }
    else
    {
      Swal.fire({
        icon: 'warning',
        title: 'Serial Item',
        text: "Please input serial number to item."
      });
    }
     
  }

  withTotalDiscountVisible = false;
  toggleTotalDiscountOptions() {
    this.withTotalDiscountVisible = !this.withTotalDiscountVisible;
  }
  storeSelected: MStore;
  VirtualKey$: Observable<boolean>;
  IsGenOrderNo$: Observable<boolean>;
  isResponseBasket$: Observable<boolean>;
  LoadingIndicator = LoadingIndicator;
  hasLoaded: boolean = false;
  loadCounter = 1; 
  // asyncText$ = this.loadingService.doLoading(
  //   // .delay(...) simulates network delay
  //   of(`Peek-a-boo ${this.loadCounter++}`).pipe(delay(4000)),
  //   this,
  //   LoadingIndicator.ASYNC_PIPE
  // );
  constructor( public commonService: CommonService, private keyboardService: KeyboardService, public loadingService: LoadingService, private barcodeService: BarcodesetupService, private storePaymentService: StorePaymentService, private shortcutService: ShortcutService, 
    public datePipe: DatePipe, public mwiService: MwiService, private printerService: NgxPrinterService, private customerService: CustomerService, private shiftService: ShiftService, public authService: AuthService, private bomService: BomService, private modalService: BsModalService,
    private permissionService: PermissionService, private itemService: ItemService, private basketService: BasketService, private alertify: AlertifyService,
    private billService: BillService, private excuteFunction: ExcuteFunctionService,  private route: ActivatedRoute, private routeNav: Router,  private reasonService: ReasonService,private SalesPlanService: SalesChannelService) {
    this.order = new Order();
    // window.addEventListener('beforeunload', (event: BeforeUnloadEvent) => {
    //   let basketresponeStatus = this.basketService.getBasketResponseStatus();
    //   if (basketresponeStatus === false) {
    //    event.preventDefault(); // for Firefox
    //    event.returnValue = ''; // for Chrome
    //    return '';
    //   }
    //   return false;
    //  });
  }
  myDate = new Date();
  functionId = "Adm_Shop";
  ngAfterViewChecked() {        
    // this.scrollToBottomList();        
  } 
  @ViewChild('myScrollContainer') private myScrollContainer: ElementRef;
  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }
  // keyboardShow = false;
  // topS= -200;
  // @ViewChild('grocery-cashier-page') container: ElementRef;
  ngAfterViewInit() {


    // debugger;
    setTimeout(() => { 
      const paymentMenu = document.getElementsByClassName('paymentMenu');
        // debugger;
        Array.prototype.forEach.call(paymentMenu, function (item) {
          // Do stuff here
          // debugger;
          if (item !== null && item !== undefined) {
            item.classList.remove('hide');
            item.classList.add('show');
          }
        });
        if(this.poleDisplay==='true')
        {
          if(this.poleDisplayType?.toLowerCase()==='serialport')
          {
            this.connectSerial();
          } 
        } 
    }, 1000);
    setTimeout(() => { 
      if(this.txtSearch!==null && this.txtSearch!==undefined)
      {
        this.txtSearch.nativeElement.focus();
      }
     
    }, 500);
    setTimeout(() => {  
      this.loadShortcut();
   
    }, 1100);
   
    // paymentMenu
    if (this.basket$ !== null && this.basket$ !== undefined) {
      this.basket$.subscribe(data => {
        this.itemSelectedRow = "";
      });
    };
    console.log('user', this.authService.getCurrentInfor());

  }
 

  orderId: string = "";
  order: Order;
  employees: MEmployee[];
  // loadEmployee() {
  //   this.employeeService.getAll().subscribe((response: any) => {
  //     this.employees = response;
  //   });
  // }
  toolList: any;
  loadTools()
  {
    let permissions = JSON.parse(localStorage.getItem("permissions"));
    if(permissions!==null && permissions!==undefined && permissions?.length > 0)
    {
      debugger;
      let filter =  permissions.filter(x=> x.ParentId === 'Adm_Tools' && x.V === 1 && x.I === 1);
      if(filter!==null && filter!==undefined && filter?.length > 0)
      {
        this.toolList = filter;
      }
      //Name 
      //functionId
      //CustomF2

    }
  }
  channels:MSalesChannel[];
  loadChannel(){
    this.SalesPlanService.getAll(this.authService.storeSelected().companyCode,'').subscribe(res=>
      {
        if(res.success = true)
        {
          this.channels = res.data;
          console.log(res)
        }
        else
        {
          // this.alertify.error(res.message);
          Swal.fire({
            icon: 'warning',
            title: 'Channel',
            text: res.message
          });
        }
       
      });
  }
  onchannelChanged(e){
    if (e !== null && e !== undefined && this.channels !== null && this.channels !== undefined && this.channels?.length > 0) {
      const previousValue = e.previousValue;
      const newValue = e.value;
      // Event handling commands go here
      // debugger;
            let basket = this.basketService.getBasketLocal();
            basket.saleschannel = e.value;
            this.basketService.setBasket(basket);
    }
  }
  shiftList: TShiftHeader[];
  isNewShift = false;
  changeShift(selected) {

    if (selected.endShift === true) {

      this.routeNav.navigate(["admin/shift/summary", selected.shift.shiftId]);
    }
    else {
      this.isNewShift = false;
      var tomorrow = new Date();
      var now = new Date();
      tomorrow.setDate(tomorrow.getDate()+1);
      tomorrow.setHours(1);
      let value = tomorrow.getTime() - now.getTime();
      this.commonService.setLocalStorageWithExpiry("shift", selected.shift, value);
      // localStorage.setItem("shift", JSON.stringify(selected.shift));
      this.shiftService.changeShift(selected.shift);
      if (this.authService.getShopMode() === 'FnB') {
        this.routeNav.navigate(["shop/order"]).then(() => {
          window.location.reload();
        });
      }
      if (this.authService.getShopMode() === 'Grocery') {
        this.routeNav.navigate(["shop/order-grocery"]).then(() => {
          window.location.reload();
        });

      }
      // this.routeNav.navigate(['/shop/order-grocery']).then(() => {
      //   window.location.reload();
      // }); 

    }

  }
  droppedData: string;

  dragEnd(event) {
    console.log('Element was dragged', event);
  }
  loadShiftOpenList() {

    let store = this.authService.storeSelected();
    let now = new Date();
    let month = now.getMonth() + 1;
    if (month === 13) {
      month = 1;
    }
    let dateFormat = now.getFullYear() + "/" + month + "/" + now.getDate();
    // if(store === null || store=== undefined)
    // {
      let storeClient = this.authService.getStoreClient();
      let terminalId ="";
      if(storeClient!==null && storeClient!==undefined)
      {
        terminalId = this.authService.getStoreClient().publicIP;
      }
      else
      {
        terminalId = this.authService.getLocalIP();
      }
    this.shiftService.loadOpenShift(this.authService.getCurrentInfor().companyCode, store.storeId, dateFormat, this.authService.getCurrentInfor().username, terminalId).subscribe((response: any) => {
      // debugger;
      if (response.success) {
        this.shiftList = response.data;
        if (this.shiftList === null || this.shiftList === undefined || this.shiftList.length === 0) {
          // this.isNewShift = true;
          this.routeNav.navigate(["shop/shifts"]).then(() => {
            window.location.reload();
          });
        }
        else {
          this.isNewShift = false;
        }
        this.showShift = true;
      }
      else {
        this.alertify.warning(response.message);
      }

      // console.log(this.storeList);
    });
    // debugger;

    // }
  }
  inputOMSMode=false;
  inputBarcode = false;

  switchShopMode()
  {
    debugger;
    
    let basket  = this.basketService.getCurrentBasket();
    if(basket.items!==null && basket.items!==undefined && basket.items?.length > 0)
    { 
      Swal.fire({
        icon: 'warning', 
        title: 'Reference / Member mode',
        text: "Can't switch Reference / Member mode. Please clear bill."
      });

    }
    else
    {
      let logs = [];
      let log= new OrderLogModel();
      log.type = "SwitchMode";
      log.action = "Request" ;
      log.time = new Date();
      log.result = "";
      log.value = "" ; 
      log.createdBy = this.authService.getCurrentInfor()?.username;
      // log.customF1 = transId ; 
      // log.customF2 = basket?.id;
      logs.push(log);
      // this.authService.writeLog(this.orderNo,"","", logs, null);
      if(this.inputOMSMode)
      {
        let defCustomer  = this.authService.getDefaultCustomer();
        // this.changeCustomer(defCustomer);
        this.basketService.changeOMSSource('');
        this.basketService.changeCustomer(defCustomer, basket.salesType);
       
        this.inputOMSMode= false;
        this.authService.writeLog(this.orderNo,"","", logs, null);
      }
      else
      {
        if(this.omsInputDefault?.settingValue!=='')
        {
          this.customerService.getItem(this.authService.getCurrentInfor().companyCode, this.omsInputDefault?.settingValue).subscribe((response: any)=>{
            if(response.success)
            {
              debugger;
              if(this.omsInputDefault.settingValue !=='N/A')
              {
                this.basketService.changeOMSSource(this.omsInputDefault.settingValue);
              }
              // this.changeCustomer(response.data, basket.);
              this.basketService.changeCustomer(response.data, basket.salesType);
              
              this.inputOMSMode= true;

              let log= new OrderLogModel();
              log.type = "SwitchMode";
              log.action = "Change OMS Source" ;
              log.time = new Date();
              log.result = "";
              log.value = this.omsInputDefault?.settingValue ; 
              log.createdBy = this.authService.getCurrentInfor()?.username;

              // log.customF1 = transId ; 
              // log.customF2 = basket?.id;
              logs.push(log);
              this.authService.writeLog(this.orderNo,"","", logs, null);
            }
            else
            {
              this.alertify.warning(response.message);
            }
          })
        }
       
      }
    }
   
  }
  inputCustomerFocusOut(value)
  {
    if (value !== null && value !== undefined && value !== '') {
      
       this.inputCustomer(value);

   }
   
  }
  inputCustomer(value) {
    if (value !== null && value !== undefined && value !== '') {
      
       let basket = this.basketService.getCurrentBasket();
       let getData=  false;
       if(basket.customer!==null && basket.customer!==undefined)
       {
         if(basket.customer.customerId !== value)
         {
           getData= true;
         }
       }
       else
       {
          getData= true;
       }
       if(getData)
       {
        this.basketService.changeBasketResponseStatus(false);
        this.mwiService.crmMembervalidate(value).subscribe((response: any) => {
          debugger;
          
          if(response.success)
          {
           
            if(response.message!==null && response.message!==undefined && response.message!=="" )
            {
              this.basketService.changeBasketResponseStatus(true);
              Swal.fire({
                icon: 'warning', 
                title: 'Member Id',
                text:  response.message
              });
            }
            else
            {
              let data = response.data[0];
              if(data!==null && data!==undefined)
              {
                let customer = new MCustomer();
                customer.customerId = data.cardno;
                customer.customerName = data.name;
                customer.rewardPoints = data.point;
                customer.status = data.Status ?? data.status;
                customer.customerGrpId = data.customerGroup;
                customer.customerGrpName = data.customerGroupName;
                customer.expiryDate = data.expirydate; 
                // let customer = new MCustomer();
                customer.mobile = "";
                // customer.customerId = value;
                customer.phone = "";
                // customer.customerName = value;
                customer.name = data.name;
                // customer.status = response.Status;
                debugger;
              
                customer.cusType = 'M';
                if(basket===null || basket===undefined)
                {
                  basket = this.basketService.createBasket(customer);
                  this.basketService.setBasket(basket);
                  // basket = this.basketService.getCurrentBasket();
                }
                let type = basket.salesType;
                if (type === null || type === undefined || type === '') {
                  type = "Retail";
                }
              
                this.basketService.changeCustomer(customer, type, false);
      
                // console.log('xxx', this.basketService.getCurrentBasket());
                this.alertify.success("Change member card " + data.cardno + " successfully completed.");
               
                let numOfItem = 0;
                if( basket.items?.length > 0)
                {
                  this.basketService.changeBasketResponseStatus(false);
                  setTimeout(() => {
                    var newArray = []; 
                    basket.items.forEach(val => newArray.push(Object.assign({}, val))); 
      
                    let NotRunPromo = newArray.filter(x => x.quantity <= 0 || x.isNegative === true );
             
                    // debugger;
                 
                    newArray.forEach(async itemLine => {
                      if(itemLine.quantity <= 0 || itemLine.isNegative === true)
                      {
                        numOfItem++;
                      }
                      else
                      {
                        await this.itemService.getItemFilter(this.storeSelected.companyCode, this.storeSelected.storeId, '', '', '',
                        itemLine.barcode, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', customer.customerGrpId,'' ,'','','').subscribe((response: any) => {
                            numOfItem++;
                            this.basketService.changeBasketResponseStatus(false);
                            if (response.success) {
                              if (response.data !== null && response.data !== undefined && response.data.length > 0) {
                                let item = response.data[0];
                                item.responseTime = response.responseTime;
                                
                                itemLine.price = item.defaultPrice; 
                                // this.onBlurMethod(itemLine);
                              }
                              else {
                                this.alertify.warning("Can't found item " + itemLine.productName + ' in group ' + customer.customerGrpId);
            
                              }
            
                            }
                            else {
            
                              this.alertify.warning(response.message);
            
                            
                            }
                            if(numOfItem >= newArray.length)
                            {
                              debugger;
                              newArray.forEach(item => {
                                item.lineTotal = item.quantity * item.price;
                              });
                              // let newListItem = this.basketService.repaintItemBasket(basket);
                              basket.items = newArray;
                              setTimeout(() => {
                                this.txtCustomer.value = '';
                                this.txtCustomer.instance.focus();
                               }, 10);
                              setTimeout(() => {
                                
                                this.basketService.applyPromotion(basket);
                              }, 50);
                              // setTimeout(() => {
                              //   this.basketService.changeBasketResponseStatus(true);
                                
                              // }, 1000);
                             
                            }
                          }, error =>{
                            console.log('error', error);
                            this.basketService.changeBasketResponseStatus(true);
                            Swal.fire({
                              icon: 'error', 
                              title: 'Get Data Item',
                              text:  'Failed to get data. Try again, Please!!'
                            });
                          })
                      }
                    
                    });
                  }, 20);
                
                  
                }
                else
                {
                  this.basketService.changeBasketResponseStatus(true);
                }
              }
              else
              {
                this.basketService.changeBasketResponseStatus(true);
                Swal.fire({
                  icon: 'warning', 
                  title: 'Member Id',
                  text:  "Data not found."
                });
              }
          
            }
           
           
            // this.basketService.setBasket();
          }
          else
          {
            
            // this.alertify.warning(response.message + ", try connect to local customer.");
            this.customerService.getItem(this.authService.getCurrentInfor().companyCode, value).subscribe((response: any)=>{
              this.basketService.changeBasketResponseStatus(true);
              if(response.success)
              {
                if(response.data!==null && response.data!==undefined)
                {
                  basket = this.basketService.getCurrentBasket();
                  this.basketService.changeCustomer(response.data, basket.salesType);  
                  this.alertify.success("Change customer " + value + " successfully completed.");
                }
                else
                {
                  // this.alertify.warning("Customer " + value + " not found.");
                  Swal.fire({
                    icon: 'warning', 
                    title: 'Member',
                    text:  "Customer " + value + " not found."
                  });
                }
              
              }
              else
              {
                // this.alertify.warning(response.message);
                Swal.fire({
                  icon: 'warning', 
                  title: 'Member',
                  text: response.message
                });
              }
            }, error=>{
              this.basketService.changeBasketResponseStatus(true);
              console.log('Failed to get customer data error: ', error);
              Swal.fire({
                icon: 'error', 
                title: 'Customer Infor',
                text: 'Failed to get customer data'
              });
            })
          }
          // if (response.msg !== null && response.msg !== undefined && response.msg !== '') {
          //   this.alertify.warning(response.msg);
          // }
          // else {
            
          // }
        }, error =>{
          let basket = this.basketService.getCurrentBasket();
          if(basket !==null && basket!==undefined)
          {
            this.basketService.changeBasketResponseStatus(true);
          } 
          console.log(error);
          Swal.fire({
            icon: 'error', 
            title: 'Member Id',
            text:  "Can not connect to CRM . Please try again"
          });
        })
       }

    }
    else {
      Swal.fire({
        icon: 'warning',
        title: 'Customer/Member value',
        text: "Please input customer / member value."
      });
      // this.alertify.warning("Please input customer value");
    }

    // this.modalRef.hide();
  }
  orderCount = 0;
  changeToWalkin()
  {
    this.authService.setOrderLog("Order", "Change To Walkin", "",  "");
    let defCustomer  = this.authService.getDefaultCustomer();
    let basket = this.basketService.getCurrentBasket();
    // this.basketService.changeCustomer(defCustomer, ); 
    if(defCustomer!==null && defCustomer!==undefined && defCustomer?.customerId !== basket?.customer?.customerId)
    {
      this.basketService.changeCustomer(defCustomer, basket.salesType, false);
      if( basket.items?.length > 0)
      {
        let numOfItem = 0;
        var newArray = []; 
        basket.items.forEach(val => newArray.push(Object.assign({}, val))); 
        // debugger;
        this.basketService.changeBasketResponseStatus(false);
        newArray.forEach(async itemLine => { 
          await this.itemService.getItemFilter(this.storeSelected.companyCode, this.storeSelected.storeId, '', '', '',
          itemLine.barcode, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', defCustomer.customerGrpId,'','','','').subscribe((response: any) => {
            this.basketService.changeBasketResponseStatus(false);
              numOfItem++;
              if (response.success) {
                if (response.data !== null && response.data !== undefined && response.data.length > 0) {
                  let item = response.data[0];
                  item.responseTime = response.responseTime;
                  // debugger;
                  itemLine.price = item.defaultPrice; 
                  // this.onBlurMethod(itemLine);
                }
                else {
                  this.alertify.warning("Can't found item " + itemLine.productName + ' in group ' + defCustomer.customerGrpId);
  
                }
  
              }
              else {
  
                this.alertify.warning(response.message);
  
              
              }
              if(numOfItem >= newArray.length)
              {
                debugger;
                console.log(numOfItem);
                 newArray.forEach(item => {
                  item.lineTotal = item.quantity * item.price;
                 });
                 basket.items = newArray;
                 setTimeout(() => {
                  this.txtCustomer.value = '';
                  this.txtCustomer.instance.focus();
                 }, 10);
                 setTimeout(() => {
                   this.basketService.applyPromotion(basket);
                 }, 50);
                // let newListItem = this.basketService.repaintItemBasket(basket);
                // basket.items = newArray;
                // this.basketService.applyPromotion(basket);
                // setTimeout(() => {
                //   this.basketService.changeBasketResponseStatus(true);
                  
                // }, 1000);
                
              }
               
            })
        });
        
      }
    }
   
  }
  inputOMSIdFocusOut(value)
  {
    debugger;
    if (value !== null && value !== undefined && value !== '') {
      debugger;
       this.inputOMSId(value);

   }
   
  }
  inputOMSId(value) {
    debugger;
    if (value !== null && value !== undefined && value !== '') {
      debugger;
      this.authService.setOrderLog("Order", "Input OMS Id", "",  value);
      this.billService.checkOMSIDAlready(this.authService.getCurrentInfor().companyCode, value).subscribe((response: any) => {
         
        if(response.success)
        {
           this.basketService.changeOMSId(value);
           if(this.omsInputDefault.settingValue !=='N/A')
           {
            this.basketService.changeOMSSource(this.omsInputDefault.settingValue);
           }
           this.alertify.success("Reference Id changed");
        }
        else
        {
          this.basketService.changeOMSId("");
          // this.alertify.warning(response.message); 
          Swal.fire({
            icon: 'warning',
            title: 'Reference Id',
            text: response.message
          })
        

        }
       
      })

    }
    else {
      Swal.fire({
        icon: 'warning',
        title: 'Reference Id',
        text: "Please input Reference value."
      });
      
    }

    // this.modalRef.hide();
  }

  mode = "";
  checkCanExchange()
  {
    let setting = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId);
    let checkReturnWithPromotion = setting.find(x=>x.settingId === 'CanExchangeWithPromo')?.settingValue;
    if(checkReturnWithPromotion==='false')
    {
      if((this.order?.discountAmount ?? 0) !== 0) 
      {
        Swal.fire({
          title: "Promotional orders cannot be exchange",
          icon: 'info',
          showCancelButton: false,
          confirmButtonText: 'OK',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            this.newOrder();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
  
          }
        })
        return false;
      }
    }

    
    return true;
  }
  
  openOrder()
  {
    window.open('shop/bills/' + this.order.transId+ '/' +this.order.companyCode+ '/' + this.order.storeId, "_blank");
    // debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
    //  this.routeNav.navigate(["shop/bills", this.order.transId, this.order.companyCode, this.order.storeId]).then(() => {
    //   window.location.reload();
    // }); 
  }
  openPromotion(promotionId)
  {
    window.open('admin/promotion/edit/' + promotionId, "_blank");
    // debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
    //  this.routeNav.navigate(["shop/bills", this.order.transId, this.order.companyCode, this.order.storeId]).then(() => {
    //   window.location.reload();
    // }); 
  }
  setEmployee(defEmployee)
  {
    if(this.salesPersonalMandatory==='true' )
    {
      // debugger;
      if (defEmployee !== null && defEmployee !== undefined && defEmployee !== '') {
        // debugger;
        let employee = this.employees.find(x => x.employeeId === defEmployee);
        if (employee !== null && employee !== undefined) {
          this.order.salesPerson = defEmployee;
          this.basketService.changeEmployee(employee); 
        }
        else {
          if (this.employees.length > 0) {
            this.order.salesPerson = this.employees[0].employeeId;
          }
          // this.alertify.warning("Can't set default employee. B/c employee " + defEmployee + " has not existed in store " + this.storeSelected.storeId);
        }
      }
    }
 
  }
  canReturn = true;
  printShow="ItemCode";
  private data = '';
  formatStr= "#,##0.######";
  setfortStr()
  {
    let format = this.authService.loadFormat(); 
    let newFm ="";
    if(format!==null && format!==undefined)
    {
       
      if(format.thousandFormat?.length > 0)
      {
        newFm += "#" + format.thousandFormat +"##0";
      }
      if(format.decimalFormat?.length > 0)
      {
        newFm += format.decimalFormat +"######";
      }
       
       
    }
    if(newFm?.length > 0)
    {
      this.formatStr = newFm;
    }
  }
  loadOrder() {
     
    this.route.params.subscribe(data => {
      this.orderId = data['id'];
      this.mode = data['m']; 
       
    })
    let defEmployee = this.authService.getCurrentInfor()?.defEmployee;
    debugger;
    if (this.orderId !== null && this.orderId !== undefined) {
      this.removeBasket();
      let orderId = this.orderId;
      let companyCode = this.storeSelected.companyCode;
      let storeId = this.storeSelected.storeId;
      if(this.mode?.toLowerCase() === 'receive')
      {
        storeId = ""; 
      }
      this.billService.getBill(orderId, companyCode, storeId).subscribe((response: any) => {
        // debugger;
        if (response.success) {
          this.order = response.data;
          const itemList: Item[] = [];
          if(this.order.isCanceled === 'Y' || this.order.isCanceled === 'C')
          {
            Swal.fire({
              icon: 'warning',
                title: 'Warning',
                text: "Bill " +  this.orderId + " not available. Because bill canceled or refference order.",
              allowEscapeKey : false,
              allowOutsideClick: false,
              showConfirmButton:true,
              confirmButtonText: 'Ok',
              focusConfirm:true
            }).then(()=>{
              this.newOrder();
            }) 
            
          }
          else
          {
            switch(this.mode?.toLowerCase()) { 
              case "exchange" || "ex": { 
                 //statements; 
                 if(this.checkCanExchange())
                 { 
                  let storeClient = this.authService.getStoreClient();
                  let terminalId ="";
                  if(storeClient!==null && storeClient!==undefined)
                  {
                    terminalId = this.authService.getStoreClient().publicIP;
                  }
                  else
                  {
                    terminalId = this.authService.getLocalIP();
                  }
                  let canExchange = true;
                  this.storePaymentService.getByStore(this.storeSelected.companyCode, this.storeSelected.storeId, terminalId).subscribe((res: any) => {
                    debugger;
                     if(res.success)
                    {
                      let checkRejectExchange = res.data.filter(x=>x.rejectExchange===true);
                    
                      if(checkRejectExchange!==null && checkRejectExchange!==undefined && checkRejectExchange?.length > 0 )
                      {
                        this.order.payments.forEach(paymentLine => { 
                            checkRejectExchange.forEach(element => {
                              if(paymentLine.paymentCode === element.paymentCode)
                              { 
                                canExchange = false; 
                                let shopmode = this.authService.getShopMode();
                                Swal.fire({
                                  icon: 'warning',
                                  title: 'Warning', 
                                  text: "Bill with payment " + element.shortName + " is not allowed to exchange."
                                }).then(() =>{
                                  if(shopmode==='FnB')
                                  {
                                    this.routeNav.navigate(["shop/order"]).then(() => {
                                      window.location.reload();
                                    }); 
                                  }
                                  if(shopmode==='Grocery')
                                  {
                                    this.routeNav.navigate(["shop/order-grocery"]).then(() => {
                                      window.location.reload();
                                    }); 
                                  
                                  }
                                }) 
                              };
                              
                            
                            });
                          });
                        }  
                      }
                      else
                      {
                        this.alertify.warning(res.message); 
                      } 
                    });
                    
                    if(canExchange)
                    {
                      let setting = this.authService.getVoidReturnSetting();
                      // let returnSetting = setting.find(x=>x.type.toLowerCase() === this.order.salesType.toLowerCase() && x.code === 'SOReturnDay');
                      let returnSetting: any;
                      if(setting!==null && setting!==undefined)
                      {
                        returnSetting = setting.find(x=>x.type.replace(/\s/g, "").toLowerCase() === this.order.salesType.replace(/\s/g, "").toLowerCase() && x.code === 'SOReturnDay');
                      }
                      let NumOfDay=0;
                      if(returnSetting!==null && returnSetting!==undefined)
                      {
                        NumOfDay = returnSetting.value;
         
                      } 
                      let date = new Date(this.order.createdOn); 
                      if(NumOfDay!==0)
                      {
                        date.setDate(date.getDate() + NumOfDay);
         
                      }
                      debugger;
                      
                      let createDateSte = this.datePipe.transform(date, 'yyyy/MM/dd');
                      let now = this.datePipe.transform(new Date(), 'yyyy/MM/dd');
                      //
                      let dateSS = new Date(createDateSte);
                      if (dateSS >= new Date(now) ) {
                      // if (date >= new Date() ) {
                      
                        this.basketService.getNewOrderCode(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe(data => {
              
                          this.orderNo = data;
                        });
                        // this.order.refTransId = this.orderId;
                        this.order.refTransId = this.orderId;
                        
                        let defCustomer  = this.authService.getDefaultCustomer();
                        
                        if (this.authService.getCRMSource() === "Local" || (this.order.customer !== null && this.order.customer !== undefined)) {
                          
                          this.basketService.changeCustomer(this.order.customer, "Exchange").subscribe(() => {
                            //  debugger;  
                          });
                          this.setItemExchangeToBasket(this.order);
                          this.basketService.changeReturnMode(true);
                          // if (this.exchangeItemMode.replace(' ','') !== "FromOrder") {
                          //   this.basketService.changeReturnMode(true);
                          // }
                          this.setEmployee(defEmployee);
                        } 
                        else { 
                          debugger;
                          if(this.authService.getCRMSource()?.toString()==='Input')
                          {
                            debugger;
                            this.mwiService.crmMembervalidate(this.order.cusId).subscribe((response: any) => {
                 
                              if(response.success)
                              {
                               
                                let data = response.data[0];
                                let customer = new MCustomer();
                                customer.customerId = data.cardno;
                                customer.customerName = data.name;
                                customer.rewardPoints = data.point;
                                customer.status = data.Status;
                                customer.customerGrpId = data.customerGroup;
                                customer.customerGrpName = data.customerGroupName;
                                 // let customer = new MCustomer();
                                 customer.mobile = this.order.cusId;
                                 // customer.customerId = value;
                                 customer.phone = this.order.cusId;
                                 // customer.customerName = value;
                                 customer.name = data.name;
                                // customer.status = response.Status;
                                debugger;
                               
                                let basket = this.basketService.getCurrentBasket();
                                if(basket===null || basket===undefined)
                                {
                                  basket = this.basketService.createBasket(customer);
                                  this.basketService.setBasket(basket);
                                  // basket = this.basketService.getCurrentBasket();
                                }
                                let type = "Exchange";
                                if (type === null || type === undefined || type === '') {
                                  type = "Retail";
                                }
                               
                                this.basketService.changeCustomer(customer, type, false);
                               basket = this.basketService.getCurrentBasket();
                                debugger;
                                this.alertify.success(type + " Change customer card " + data.cardno + " successfully completed.");
                                setTimeout(() => { 
                                  debugger;
                                  this.setItemExchangeToBasket(this.order);
                                  this.basketService.changeReturnMode(true);
                                  // if (this.exchangeItemMode !== "FromOrder") {
                                   
                                  // }
                                  this.setEmployee(defEmployee);
                                }, 1500);
                               
                              }
                              else
                              {
                                this.alertify.warning(response.message);
                              }
                              
                            }, error =>{
                              let basket = this.basketService.getCurrentBasket();
                              if(basket !==null && basket!==undefined)
                              {
                                this.basketService.changeBasketResponseStatus(true);
                              } 
                              console.log(error);
                              Swal.fire({
                                icon: 'error', 
                                title: 'Member Id',
                                text:  "Can not connect to CRM . Please try again"
                              });
                            });
                          
                          }
                          else
                          {
                            let firstChar = this.order.phone?.toString()?.substring(0, 1);
                            if (firstChar === "0") {
                              this.order.phone = "84" + this.order.phone?.toString()?.substring(1, this.order.phone.length);
                            }
                            if(defCustomer.mobile ===  this.order.phone)
                            {
                              let cus = this.authService.mapWMiCustomer2Customer(defCustomer);// this.mapWMiCustomer2Customer(response.data); 
                              this.basketService.changeCustomer(cus, "Exchange").subscribe(() => {
                                
                              });
                              this.setItemExchangeToBasket(this.order);
                              this.basketService.changeReturnMode(true);
                              // if (this.exchangeItemMode !== "FromOrder") {
                              //   this.basketService.changeReturnMode(true);
                              // }
                              this.setEmployee(defEmployee);
                            }
                            else
                            {
                              this.mwiService.getCustomerInformation(this.order.phone, this.storeSelected.storeId).subscribe((response: any) => {
                                if (response !== null && response !== undefined) {
                                  if (response.status === 1) {
                                    let cus = this.authService.mapWMiCustomer2Customer(response.data);// this.mapWMiCustomer2Customer(response.data); 
                                    this.basketService.changeCustomer(cus, "Exchange").subscribe(() => {
                                      // debugger; 
                  
                                    });
                                    this.setItemExchangeToBasket(this.order);
                                    this.basketService.changeReturnMode(true);
                                    // if (this.exchangeItemMode !== "FromOrder") {
                                    //   this.basketService.changeReturnMode(true);
                                    // }
                                    this.setEmployee(defEmployee);
                                  }
                                  else {
                                    this.alertify.warning(response.msg);
                                  }
                                }
                                else {
                                  this.alertify.warning('Data not found');
                                }
           
                              })
                  
                            }
                          } 
                        } 
                      }
                      else {
                        Swal.fire({
                          icon: 'warning',
                          title: 'Warning',
                          text: "Bill can't exchange. Created On :" + createDateSte + " not valid.",
                          allowEscapeKey : false,
                          allowOutsideClick: false,
                          showConfirmButton:true,
                          confirmButtonText: 'Ok',
                          focusConfirm:true
                        }).then(()=>{
                          this.newOrder();
                        }) 
                        
                        // Swal.fire({
                        
                        // });
                      }
                    }
                  
                 }
                 break; 
              } 
              case "return": { 
                 //statements; 
                 if(this.checkCanReturn())
                 { 
                    let storeClient = this.authService.getStoreClient();
                    let terminalId ="";
                    if(storeClient!==null && storeClient!==undefined)
                    {
                      terminalId = this.authService.getStoreClient().publicIP;
                    }
                    else
                    {
                      terminalId = this.authService.getLocalIP();
                    }
                     
                    this.storePaymentService.getByStore(this.storeSelected.companyCode, this.storeSelected.storeId, terminalId).subscribe((res: any) => {
                      debugger;
                      if(res.success)
                      {
                        let checkRejectReturn = res.data.filter(x=>x.rejectReturn===true);
                        
                      if(checkRejectReturn!==null && checkRejectReturn!==undefined && checkRejectReturn?.length > 0 )
                      {
                        this.order.payments.forEach(paymentLine => { 
                            checkRejectReturn.forEach(element => {
                              if(paymentLine.paymentCode === element.paymentCode)
                              { 
                                this.canReturn = false; 
                                let shopmode = this.authService.getShopMode();
                                Swal.fire({
                                  icon: 'warning',
                                  title: 'Warning', 
                                  text: "Bill with payment " + element.shortName + " is not allowed to return."
                                }).then(() =>{
                                  if(shopmode==='FnB')
                                  {
                                    this.routeNav.navigate(["shop/order"]).then(() => {
                                      window.location.reload();
                                    }); 
                                  }
                                  if(shopmode==='Grocery')
                                  {
                                    this.routeNav.navigate(["shop/order-grocery"]).then(() => {
                                      window.location.reload();
                                    }); 
                                  
                                  }
                                }) 
                              };
                               
                            
                            });
                          });
                        }  
                      }
                      else
                      {
                        this.alertify.warning(res.message); 
                      } 
                    });
                    if(this.canReturn)
                    {
                      // let setting = this.authService.getVoidReturnSetting(); 
                      let setting = this.authService.getVoidReturnSetting();
                      // let returnSetting = setting.find(x=>x.type.toLowerCase() === this.order.salesType.toLowerCase() && x.code === 'SOReturnDay');
                      let returnSetting: any;
                      if(setting!==null && setting!==undefined)
                      {
                        returnSetting = setting.find(x=>x.type.replace(/\s/g, "").toLowerCase() === this.order.salesType.replace(/\s/g, "").toLowerCase() && x.code === 'SOReturnDay');
                      }
                      // let returnSetting = setting.find(x=>x.type.replace(/\s/g, "").toLowerCase() === this.order.salesType.replace(/\s/g, "").toLowerCase() && x.code === 'SOReturnDay');
                      let NumOfDay=0;
                      if(returnSetting!==null && returnSetting!==undefined)
                      {
                        NumOfDay = returnSetting.value; 
                      } 
                      let date = new Date(this.order.createdOn); 
                      if(NumOfDay!==0)
                      {
                        date.setDate(date.getDate() + NumOfDay); 
                      }
                      debugger;
                      
                      let createDateSte = this.datePipe.transform(date, 'yyyy/MM/dd');
                      let now = new Date();
                      let nowstring = this.datePipe.transform(now, 'yyyy/MM/dd');
                      let returnLimitDate = new Date(createDateSte);
                      now = new Date(nowstring);
                      // let now = this.datePipe.transform(new Date(), 'yyyy/MM/dd'); 
                      let canReturnWithClause = this.authService.checkRole('Spc_ReturnOrderW', '', 'I');
                      // now = new Date(now.getFullYear(),now.getMonth(),now.getDay(),0,0,0);
                      // returnLimitDate = new Date(returnLimitDate.getFullYear(),returnLimitDate.getMonth(),returnLimitDate.getDay(),0,0,0);
                      console.log(returnLimitDate,now)
                      // if (date >= new Date() || canReturnWithClause === true) {
                        if (returnLimitDate >= now || canReturnWithClause === true) {
                        //  if ((returnLimitDate.getUTCDay()>=now.getUTCDay() && returnLimitDate.getUTCMonth()>=now.getUTCMonth() && returnLimitDate.getUTCFullYear()>=now.getUTCFullYear()) || canReturnWithClause === true) {
                        //  let check = this.authService.checkRole('Spc_ExchangeOrder', '', 'I');
                        //  if (check === false) {
                        //    this.routeNav.navigate(["/admin/permission-denied"]);
                        //  } 
                        this.basketService.getNewOrderCode(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe(data => {
              
                          this.orderNo = data;
                        });
                        
                        this.order.refTransId = this.orderId;
                        
                        let defCustomer  = this.authService.getDefaultCustomer();
                        
                        if (this.authService.getCRMSource() === "Local" || (this.order.customer !== null && this.order.customer !== undefined)) {
                          
                          this.basketService.changeCustomer(this.order.customer, "Return").subscribe(() => {
                            //  debugger;  
                          });
                          setTimeout(() => { 
                            debugger;
                            // console.log('Set Item Return 4');
                            this.setItemReturnToBasket(this.order);
                            // if (this.returnItemMode !== "FromOrder") {
                            //   this.basketService.changeReturnMode(true);
                            // }
                            this.setEmployee(defEmployee);
                          }, 1500);
                          // this.setItemReturnToBasket(this.order);
                          // if (this.returnItemMode.replace(' ','') !== "FromOrder") {
                          //   this.basketService.changeReturnMode(true);
                          // }
                          // this.setEmployee(defEmployee);
                        } 
                        else {  
                          if(this.authService.getCRMSource()?.toString()==='Input')
                          { 
                            this.mwiService.crmMembervalidate(this.order.cusId).subscribe((response: any) => {
                  
                              if(response.success)
                              {
                                let data = response.data[0];
                                let customer = new MCustomer();
                                customer.customerId = data.cardno;
                                customer.customerName = data.name;
                                customer.rewardPoints = data.point;
                                customer.status = data.Status;
                                customer.customerGrpId = data.customerGroup;
                                customer.customerGrpName = data.customerGroupName;
                                  // let customer = new MCustomer();
                                  customer.mobile = this.order.cusId;
                                  // customer.customerId = value;
                                  customer.phone = this.order.cusId;
                                  // customer.customerName = value;
                                  customer.name = data.name;
                                // customer.status = response.Status;
                                debugger;
                                
                                let basket = this.basketService.getCurrentBasket();
                                if(basket===null || basket===undefined)
                                {
                                  basket = this.basketService.createBasket(customer);
                                  this.basketService.setBasket(basket);
                                  // basket = this.basketService.getCurrentBasket();
                                }
                                let type = "Return";
                                if (type === null || type === undefined || type === '') {
                                  type = "Retail";
                                }
                                
                                this.basketService.changeCustomer(customer, type, false);
                                basket = this.basketService.getCurrentBasket();
                                debugger;
                                this.alertify.success(type + " Change customer card " + data.cardno + " successfully completed.");
                                setTimeout(() => { 
                                  debugger;
                                  // console.log('Set Item Return 3');
                                  this.setItemReturnToBasket(this.order);
                                  // if (this.returnItemMode !== "FromOrder") {
                                  //   this.basketService.changeReturnMode(true);
                                  // }
                                  this.setEmployee(defEmployee);
                                }, 1500);
                                
                              }
                              else
                              {
                                this.alertify.warning(response.message);
                              }
                              
                            }, error =>{
                              let basket = this.basketService.getCurrentBasket();
                              if(basket !==null && basket!==undefined)
                              {
                                this.basketService.changeBasketResponseStatus(true);
                              } 
                              console.log(error);
                              Swal.fire({
                                icon: 'error', 
                                title: 'Member Id',
                                text:  "Can not connect to CRM . Please try again"
                              });
                            });
                          
                          }
                          else
                          {
                            let firstChar = this.order.phone?.toString()?.substring(0, 1);
                            if (firstChar === "0") {
                              this.order.phone = "84" + this.order.phone.toString().substring(1, this.order.phone.length);
                            }
                            if(defCustomer.mobile ===  this.order.phone)
                            {
                              let cus = this.authService.mapWMiCustomer2Customer(defCustomer);// this.mapWMiCustomer2Customer(response.data); 
                              this.basketService.changeCustomer(cus, "Return").subscribe(() => {
                                
                              });
                             
                              setTimeout(() => { 
                                debugger;
                                // console.log('Set Item Return 1');
                                this.setItemReturnToBasket(this.order);
                                // if (this.returnItemMode !== "FromOrder") {
                                //   this.basketService.changeReturnMode(true);
                                // }
                                this.setEmployee(defEmployee);
                              }, 1500);
                              // this.setItemReturnToBasket(this.order);
                              // // if (this.returnItemMode !== "FromOrder") {
                              // //   this.basketService.changeReturnMode(true);
                              // // }
                              // this.setEmployee(defEmployee);
                            }
                            else
                            {
                              this.mwiService.getCustomerInformation(this.order.phone, this.storeSelected.storeId).subscribe((response: any) => {
                                if (response !== null && response !== undefined) {
                                  if (response.status === 1) {
                                    let cus = this.authService.mapWMiCustomer2Customer(response.data);// this.mapWMiCustomer2Customer(response.data); 
                                    this.basketService.changeCustomer(cus, "Return").subscribe(() => {
                                      // debugger; 
                  
                                    });
                                    console.log('Set Item Return 2');
                                    setTimeout(() => { 
                                      debugger;
                                      console.log('Set Item Return 2');
                                      this.setItemReturnToBasket(this.order);
                                      // if (this.returnItemMode !== "FromOrder") {
                                      //   this.basketService.changeReturnMode(true);
                                      // }
                                      this.setEmployee(defEmployee);
                                    }, 1500);
                                    // this.setItemReturnToBasket(this.order);
                                   
                                    // this.setEmployee(defEmployee);
                                  }
                                  else {
                                    this.alertify.warning(response.msg);
                                  }
                                }
                                else {
                                  this.alertify.warning('Data not found');
                                }
            
                              })
                  
                            }
                          }
                        
                          
          
                        } 
                      }
                      else {
                        Swal.fire({
                          icon: 'warning',
                          title: 'Warning',
                          text: "Bill can't return. Created On :" + createDateSte + " not valid.",
                          allowEscapeKey : false,
                          allowOutsideClick: false,
                          showConfirmButton:true,
                          confirmButtonText: 'Ok',
                          focusConfirm:true
                        }).then(()=>{
                          this.newOrder();
                        }) 
                        // Swal.fire({
                        //   icon: 'warning',
                        //   title: 'Warning',
                        //   text: "Bill can't return. Created On :" + createDateSte + " not valid."
                        // });
                      }
                    }
                   
                 }
                 break; 
              } 
              case "receive": { 
                //statements; 
                   let storeClient = this.authService.getStoreClient();
                   let terminalId ="";
                   if(storeClient!==null && storeClient!==undefined)
                   {
                     terminalId = this.authService.getStoreClient().publicIP;
                   }
                   else
                   {
                     terminalId = this.authService.getLocalIP();
                   }
                   this.basketService.getNewOrderCode(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe(data => {
          
                    this.orderNo = data;
                  });
                  
                  this.order.refTransId = this.orderId;
                  
                  let defCustomer  = this.authService.getDefaultCustomer();
                  
                  if (this.authService.getCRMSource() === "Local" || (this.order.customer !== null && this.order.customer !== undefined)) {
                    
                    this.basketService.changeCustomer(this.order.customer, "Receive").subscribe(() => {
                      //  debugger;  
                    });
                    setTimeout(() => { 
                      debugger;
                    
                      this.setItemReturnToBasket(this.order);
                     
                      this.setEmployee(defEmployee);
                    }, 1500);
                   
                  } 
                  else {  
                    if(this.authService.getCRMSource()?.toString()==='Input')
                    { 
                      this.mwiService.crmMembervalidate(this.order.cusId).subscribe((response: any) => {
            
                        if(response.success)
                        {
                          let data = response.data[0];
                          let customer = new MCustomer();
                          customer.customerId = data.cardno;
                          customer.customerName = data.name;
                          customer.rewardPoints = data.point;
                          customer.status = data.Status;
                          customer.customerGrpId = data.customerGroup;
                          customer.customerGrpName = data.customerGroupName;
                            // let customer = new MCustomer();
                            customer.mobile = this.order.cusId;
                            // customer.customerId = value;
                            customer.phone = this.order.cusId;
                            // customer.customerName = value;
                            customer.name = data.name;
                          // customer.status = response.Status;
                          debugger;
                          
                          let basket = this.basketService.getCurrentBasket();
                          if(basket===null || basket===undefined)
                          {
                            basket = this.basketService.createBasket(customer);
                            this.basketService.setBasket(basket);
                            // basket = this.basketService.getCurrentBasket();
                          }
                          let type = "Receive";
                          if (type === null || type === undefined || type === '') {
                            type = "Retail";
                          }
                          
                          this.basketService.changeCustomer(customer, type, false);
                          basket = this.basketService.getCurrentBasket();
                          debugger;
                          this.alertify.success(type + " Change customer card " + data.cardno + " successfully completed.");
                          setTimeout(() => { 
                            debugger;
                            // console.log('Set Item Return 3');
                            this.setItemReturnToBasket(this.order);
                            
                            this.setEmployee(defEmployee);
                          }, 1500);
                          
                        }
                        else
                        {
                          this.alertify.warning(response.message);
                        }
                        
                      }, error =>{
                        let basket = this.basketService.getCurrentBasket();
                        if(basket !==null && basket!==undefined)
                        {
                          this.basketService.changeBasketResponseStatus(true);
                        } 
                        console.log(error);
                        Swal.fire({
                          icon: 'error', 
                          title: 'Member Id',
                          text:  "Can not connect to CRM . Please try again"
                        });
                      });
                    
                    }
                    else
                    {
                      let firstChar = this.order.phone?.toString()?.substring(0, 1);
                      if (firstChar === "0") {
                        this.order.phone = "84" + this.order.phone.toString().substring(1, this.order.phone.length);
                      }
                      if(defCustomer.mobile ===  this.order.phone)
                      {
                        let cus = this.authService.mapWMiCustomer2Customer(defCustomer);// this.mapWMiCustomer2Customer(response.data); 
                        this.basketService.changeCustomer(cus, "Receive").subscribe(() => {
                          
                        });
                       
                        setTimeout(() => { 
                          debugger;
                          // console.log('Set Item Return 1');
                          this.setItemReturnToBasket(this.order);
                         
                          this.setEmployee(defEmployee);
                        }, 1500);
                       
                      }
                      else
                      {
                        this.mwiService.getCustomerInformation(this.order.phone, this.storeSelected.storeId).subscribe((response: any) => {
                          if (response !== null && response !== undefined) {
                            if (response.status === 1) {
                              let cus = this.authService.mapWMiCustomer2Customer(response.data);// this.mapWMiCustomer2Customer(response.data); 
                              this.basketService.changeCustomer(cus, "Receive").subscribe(() => {
                                // debugger; 
            
                              });
                           
                              setTimeout(() => { 
                                debugger;
                              
                                this.setItemReturnToBasket(this.order);
                            
                                this.setEmployee(defEmployee);
                              }, 1500);
                             
                            }
                            else {
                              this.alertify.warning(response.msg);
                            }
                          }
                          else {
                            this.alertify.warning('Data not found');
                          }
      
                        }, error =>{
                          let basket = this.basketService.getCurrentBasket();
                          if(basket !==null && basket!==undefined)
                          {
                            this.basketService.changeBasketResponseStatus(true);
                          } 
                          console.log(error);
                          Swal.fire({
                            icon: 'error', 
                            title: 'Member Id',
                            text:  "Can not connect to CRM . Please try again"
                          });
                        }); 
            
                      }
                    }
                  
                    
    
                  } 
                break; 
              } 
              default: { 
                 //statements; 
                 
              if (this.order !== null && this.order !== undefined) {
                this.orderNo = this.orderId;
                
                debugger;
                let defCustomer = this.authService.getDefaultCustomer();
                if (this.order?.customer !== null && this.order?.customer !== undefined) {
                  this.basketService.changeCustomer(this.order.customer, "Retail", false).subscribe(() => {
  
                  });
  
                }
                else {
                  this.basketService.changeCustomer(defCustomer, "Retail", false).subscribe(() => {
  
                  });
                }
                if (this.order?.lines !== null && this.order?.lines !== undefined && this.order?.lines.length > 0) {
                  this.setItemToBasket(this.order.lines);
                }
                this.setEmployee(defEmployee);

                let basket = this.basketService.getBasketLocal();
                basket.saleschannel = this.order?.salesChanel;
                this.basketService.setBasket(basket);
              }
              else {
                this.newOrder();
              }
  
                 break; 
              } 
           } 
          }
        

          // if (this.mode === "exchange" || this.mode === "ex") {

           
 
          //   if(this.checkCanExchange())
          //   { 
          //     let setting = this.authService.getVoidReturnSetting();
          //     // let returnSetting = setting.find(x=>x.type.toLowerCase() === this.order.salesType.toLowerCase() && x.code === 'SOReturnDay');
          //     let returnSetting = setting.find(x=>x.type.replace(/\s/g, "").toLowerCase() === this.order.salesType.replace(/\s/g, "").toLowerCase() && x.code === 'SOReturnDay');
          //     let NumOfDay=0;
          //     if(returnSetting!==null && returnSetting!==undefined)
          //     {
          //       NumOfDay = returnSetting.value;
 
          //     } 
          //     let date = new Date(this.order.createdOn); 
          //     if(NumOfDay!==0)
          //     {
          //       date.setDate(date.getDate() + NumOfDay);
 
          //     }
          //     debugger;
              
          //     let createDateSte = this.datePipe.transform(date, 'yyyy/MM/dd');
          //     let now = this.datePipe.transform(new Date(), 'yyyy/MM/dd');
          //     if (date >= new Date() ) {
          //       let check = this.authService.checkRole('Spc_ExchangeOrder', '', 'I');
          //       if (check === false) {
          //         this.routeNav.navigate(["/admin/permission-denied"]);
          //       } 
          //       this.basketService.getNewOrderCode(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe(data => {
      
          //         this.orderNo = data;
          //       });
          //       // this.order.refTransId = this.orderId;
          //       this.order.refTransId = this.orderId;
                
          //       let defCustomer  = this.authService.getDefaultCustomer();
                
          //       if (this.authService.getCRMSource() === "Local" || (this.order.customer !== null && this.order.customer !== undefined)) {
                  
          //         this.basketService.changeCustomer(this.order.customer, "Exchange").subscribe(() => {
          //           //  debugger;  
          //         });
          //         this.setItemExchangeToBasket(this.order.lines);
          //         if (this.exchangeItemMode.replace(' ','') !== "FromOrder") {
          //           this.basketService.changeReturnMode(true);
          //         }
          //         this.setEmployee(defEmployee);
          //       } 
          //       else { 
          //         debugger;
          //         if(this.authService.getCRMSource()?.toString()==='Input')
          //         {
          //           debugger;
          //           this.mwiService.crmMembervalidate(this.order.cusId).subscribe((response: any) => {
         
          //             if(response.success)
          //             {
                       
          //               let data = response.data[0];
          //               let customer = new MCustomer();
          //               customer.customerId = data.cardno;
          //               customer.customerName = data.name;
          //               customer.rewardPoints = data.point;
          //               customer.status = data.Status;
          //               customer.customerGrpId = data.customerGroup;
          //               customer.customerGrpName = data.customerGroupName;
          //                // let customer = new MCustomer();
          //                customer.mobile = this.order.cusId;
          //                // customer.customerId = value;
          //                customer.phone = this.order.cusId;
          //                // customer.customerName = value;
          //                customer.name = data.name;
          //               // customer.status = response.Status;
          //               debugger;
                       
          //               let basket = this.basketService.getCurrentBasket();
          //               if(basket===null || basket===undefined)
          //               {
          //                 basket = this.basketService.createBasket(customer);
          //                 this.basketService.setBasket(basket);
          //                 // basket = this.basketService.getCurrentBasket();
          //               }
          //               let type = "Exchange";
          //               if (type === null || type === undefined || type === '') {
          //                 type = "Retail";
          //               }
                       
          //               this.basketService.changeCustomer(customer, type, false);
          //              basket = this.basketService.getCurrentBasket();
          //               debugger;
          //               this.alertify.success(type + " Change customer card " + data.cardno + " successfully completed.");
          //               setTimeout(() => { 
          //                 debugger;
          //                 this.setItemExchangeToBasket(this.order.lines);
          //                 if (this.exchangeItemMode !== "FromOrder") {
          //                   this.basketService.changeReturnMode(true);
          //                 }
          //                 this.setEmployee(defEmployee);
          //               }, 1500);
          //               // basket.items.forEach(async itemLine => {
          //               //   await this.itemService.getItemFilter(this.storeSelected.companyCode, this.storeSelected.storeId, '', '', '',
          //               //   itemLine.barcode, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', customer.customerGrpId,'').subscribe((response: any) => {
              
                            
          //               //       if (response.success) {
          //               //         if (response.data !== null && response.data !== undefined && response.data.length > 0) {
          //               //           let item = response.data[0];
          //               //           itemLine.price = item.defaultPrice;
          //               //         }
          //               //         else {
          //               //           this.alertify.warning("Can't found item " + itemLine.productName + ' int group ' + customer.customerGrpId);
              
          //               //         }
              
          //               //       }
          //               //       else {
          //               //         this.alertify.warning(response.message);
              
          //               //       }
          //               //     })
          //               // });
          //               // this.basketService.setBasket(basket);
          //             }
          //             else
          //             {
          //               this.alertify.warning(response.message);
          //             }
          //             // if (response.msg !== null && response.msg !== undefined && response.msg !== '') {
          //             //   this.alertify.warning(response.msg);
          //             // }
          //             // else {
                        
          //             // }
          //           })
          //           // this.inputCustomer(this.order.cusId);
          //           // let basket= this.basketService.getCurrentBasket();
                  
                   
          //         }
          //         else
          //         {
          //           let firstChar = this.order.phone.toString().substring(0, 1);
          //           if (firstChar === "0") {
          //             this.order.phone = "84" + this.order.phone.toString().substring(1, this.order.phone.length);
          //           }
          //           if(defCustomer.mobile ===  this.order.phone)
          //           {
          //             let cus = this.authService.mapWMiCustomer2Customer(defCustomer);// this.mapWMiCustomer2Customer(response.data); 
          //             this.basketService.changeCustomer(cus, "Exchange").subscribe(() => {
                        
          //             });
          //             this.setItemExchangeToBasket(this.order.lines);
          //             if (this.exchangeItemMode !== "FromOrder") {
          //               this.basketService.changeReturnMode(true);
          //             }
          //             this.setEmployee(defEmployee);
          //           }
          //           else
          //           {
          //             this.mwiService.getCustomerInformation(this.order.phone, this.storeSelected.storeId).subscribe((response: any) => {
          //               if (response !== null && response !== undefined) {
          //                 if (response.status === 1) {
          //                   let cus = this.authService.mapWMiCustomer2Customer(response.data);// this.mapWMiCustomer2Customer(response.data); 
          //                   this.basketService.changeCustomer(cus, "Exchange").subscribe(() => {
          //                     // debugger; 
          
          //                   });
          //                   this.setItemExchangeToBasket(this.order.lines);
          //                   if (this.exchangeItemMode !== "FromOrder") {
          //                     this.basketService.changeReturnMode(true);
          //                   }
          //                   this.setEmployee(defEmployee);
          //                 }
          //                 else {
          //                   this.alertify.warning(response.msg);
          //                 }
          //               }
          //               else {
          //                 this.alertify.warning('Data not found');
          //               }
   
          //             })
          
          //           }
          //         }
                
                 
 
          //       } 
          //     }
          //     else {
                
          //       Swal.fire({
          //         icon: 'warning',
          //         title: 'Warning',
          //         text: "Bill can't exchange. Created On :" + createDateSte + " not valid."
          //       });
          //     }
          //   }
  

          // }
          // else {


          //   if (this.order !== null && this.order !== undefined) {
          //     this.orderNo = this.orderId;
              
          //     debugger;
          //     let defCustomer = this.authService.getDefaultCustomer();
          //     if (this.order?.customer !== null && this.order?.customer !== undefined) {
          //       this.basketService.changeCustomer(this.order.customer, "Retail").subscribe(() => {

          //       });

          //     }
          //     else {
          //       this.basketService.changeCustomer(defCustomer, "Retail").subscribe(() => {

          //       });
          //     }
          //     if (this.order?.lines !== null && this.order?.lines !== undefined && this.order?.lines.length > 0) {
          //       this.setItemToBasket(this.order.lines);
          //     }
          //     this.setEmployee(defEmployee);
          //   }
          //   else {
          //     this.newOrder();
          //   }

          // }
          // debugger;
        }
        else {
          // this.alertify.warning(response.message);
          let shopmode = this.authService.getShopMode();
          Swal.fire({
            icon: 'warning',
            title: 'Order',
            text: response.message
          }).then(() =>{
            if(shopmode==='FnB')
            {
              this.routeNav.navigate(["shop/order"]).then(() => {
                window.location.reload();
              }); 
            }
            if(shopmode==='Grocery')
            {
              this.routeNav.navigate(["shop/order-grocery"]).then(() => {
                window.location.reload();
              }); 
            
            }
          }) 
        }



      }, (error) => {
        // this.alertify.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Bill Detail',
          text: "Can't get bill detail"
        });
      }, () => {

      });

    }
    else {
      // debugger;
      this.basketService.getNewOrderCode(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe(data => {

        this.orderNo = data;
      });
     


      let basketId = localStorage.getItem("basket_id");
     
      if (basketId !== null && basketId !== undefined) {
         
        let basket = this.basketService.getBasketLocal(); 
        if (basket !== null && basket !== undefined) {
          debugger;
          // basket.omsid === null || basket.omsid === undefined ||
          if ( basket.salesType === null || basket.salesType === undefined || basket.salesType === "Return" || basket.salesType === "return" || basket?.salesType.toLowerCase() === "exchange" || basket.salesType.toLowerCase() === "ex") {
            this.newOrder();
            if (this.authService.getShopMode() === 'FnB') {
              this.routeNav.navigate(["shop/order"]).then(() => {
                // window.location.reload();
              });
            }
            if (this.authService.getShopMode() === 'Grocery') {
              this.routeNav.navigate(["shop/order-grocery"]).then(() => {
                // window.location.reload();
              });

            }
          }
          else {
            if(basket.omsSource!=='' && basket.omsSource!==null && basket.omsSource!==undefined)
            {
              this.inputOMSMode = true; 
              if(this.omsInputDefault?.settingValue!=='')
              {
                this.customerService.getItem(this.authService.getCurrentInfor().companyCode, this.omsInputDefault?.settingValue).subscribe((response: any)=>{
                  if(response.success)
                  {
                    debugger;
                    if(this.omsInputDefault.settingValue !=='N/A')
                    {
                      this.basketService.changeOMSSource(this.omsInputDefault.settingValue);
                    }
                    // this.changeCustomer(response.data, basket.);
                    this.basketService.changeCustomer(response.data, basket.salesType);
                    
                    this.inputOMSMode= true;
                  }
                  else
                  {
                    this.alertify.warning(response.message);
                  }
                })
              }
            //   if(basket.omsId !== null && basket.omsId !== undefined  && basket.omsId !== '')
            // {
            
            // }
            }
            
            this.basketService.setBasket(basket); 
            if (defEmployee !== null && defEmployee !== undefined && defEmployee !== '') {

              let employee = this.employees.find(x => x.employeeId === defEmployee);
              if (employee !== null && employee !== undefined) {
                this.order.salesPerson = defEmployee;
                // this.basketService.changeEmployee(employee);
              }
              else {
                if (this.employees.length > 0) {
                  this.order.salesPerson = this.employees[0].employeeId;
                }
                // this.alertify.warning("Can't set default employee. B/c employee " + defEmployee + " has not existed in store " + this.storeSelected.storeId);
              }
            }
          }

        }
        else {
          this.newOrder();

        }
      }
      else {
        this.newOrder();
      }

    }


  }
  exchangeItems = 'FromOrder';
  switchValueChanged(e) {
    const previousValue = e.previousValue;
    const newValue = e.value;
    debugger;
    console.log(newValue);
   
    let items = this.basketService.getCurrentBasket().items;
    if(!newValue)
    {
      items.forEach(item => {
        if(item.isNegative)
        {
          item.isLock = true;
        }
        else
        {
          item.isLock = false;
        }
      });
    }
    else
    {
      items.forEach(item => {
        if(!item.isNegative)
        {
          item.isLock = true;
        }
        else
        {
          item.isLock = false;
        }
      });
    }
    this.basketService.changeReturnMode(newValue);
    // Event handling commands go here
  }
  switchMode(newValue) {
    // debugger;
 
     this.returnExchangeSwitch.value = newValue;
     debugger;
     this.authService.setOrderLog("Order", "Switch Mode(Re/Ex)", "", newValue?.toString());
    let items = this.basketService.getCurrentBasket().items;
    if(!newValue)
    {
      items.forEach(item => {
        if(item.isNegative)
        {
          item.isLock = true;
        }
        else
        {
          item.isLock = false;
        }
      });
    }
    else
    {
      items.forEach(item => {
        if(!item.isNegative)
        {
          item.isLock = true;
        }
        else
        {
          item.isLock = false;
        }
      });
    }
    this.basketService.changeReturnMode(newValue);
    // Event handling commands go here
  }
  returnMode = true;
  
  checkCanReturn()
  {
    debugger;
    let setting = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.storeSelected.storeId);
    let checkReturnWithPromotion = setting.find(x=>x.settingId === 'CanRefundWithPromo')?.settingValue;
    if(checkReturnWithPromotion==='false')
    {
      if((this.order?.discountAmount ?? 0) !== 0) 
      {
        Swal.fire({
          title: "Promotional orders cannot be returned",
          icon: 'info',
          showCancelButton: false,
          confirmButtonText: 'OK',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            this.newOrder();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
  
          }
        })
        return false;
      }
    }
    return true;
  }
  onEmployeeChanged(e) {

    if (e !== null && e !== undefined && this.employees !== null && this.employees !== undefined && this.employees?.length > 0) {
      const previousValue = e.previousValue;
      const newValue = e.value;
      // Event handling commands go here
      // debugger;
      let employee: MEmployee = this.employees.find(x => x.employeeId === newValue);
      if (employee !== null && employee !== undefined) {
        this.basketService.changeEmployee(employee);
        let basket = this.basketService.getCurrentBasket();
        basket.employee = employee;
      }

    }

  }
 
  exchangeItemsList = [];
  exchangeItemMode = 'FromOrder';
  returnItemMode = 'FromOrder';
  eInvoice = "false"; loyalty = "false";
  customerName="";
  testControlValue = new FormControl({value: this.data, disabled: false});
  scannerProfile: any;

  toolFunction(functionAction)
  {
    debugger;
    let msg = "";
    switch (functionAction?.toLowerCase()) {
      case 'opendrawer': {
        //statements; 
        let checkAction = this.authService.checkRole('Spc_OpenDrawer', '', 'I');
        if (checkAction) {
          this.excuteFunction.openDrawer();
        }
        else
        {
          msg = "Permission denied.";
        } 
        break;
      }
      case 'castdisplay': {
        //statements; 
        let checkAction = this.authService.checkRole('Spc_CastDisplay', '', 'I');
        if (checkAction) {
          this.detectMultiMonitor();
        }
        else
        {
          msg = "Permission denied.";
        } 
        break;
      }
      case 'clearcache': {
        //statements;  
        let checkAction = this.authService.checkRole('Tool_ClearCache', '', 'I');
        if (checkAction) {

          this.modalService.show(ShopToolClearCacheComponent, {
            // initialState, 
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: true,
            ariaDescribedby: 'my-modal-description',
            ariaLabelledBy: 'my-modal-title',
            class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
          });
          // const { value: formValues } = await Swal.fire({
          //   title: 'Multiple inputs',
          //   html:
          //     'Key: <input id="swal-input1" class="swal2-input">' +
          //     'Prefix: <input id="swal-input2" class="swal2-input">',
          //   focusConfirm: false,
          //   preConfirm: () => {
          //     return [
          //       document.getElementById('swal-input1').value,
          //       document.getElementById('swal-input2').value
          //     ]
          //   }
          // })
          
         
          // this.excuteFunction.clearCache();
        }
        else
        {
          msg = "Permission denied.";
        } 
        break;
      }
      case 'sendbankeod': {
 
        let checkAction = this.authService.checkRole('Tool_SendBankEOD', '', 'I');
        if (checkAction) {

          this.modalService.show(ShopToolsSettlementComponent, {
            // initialState, 
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: true,
            ariaDescribedby: 'my-modal-description',
            ariaLabelledBy: 'my-modal-title',
            class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
          });
          // const { value: formValues } = await Swal.fire({
          //   title: 'Multiple inputs',
          //   html:
          //     'Key: <input id="swal-input1" class="swal2-input">' +
          //     'Prefix: <input id="swal-input2" class="swal2-input">',
          //   focusConfirm: false,
          //   preConfirm: () => {
          //     return [
          //       document.getElementById('swal-input1').value,
          //       document.getElementById('swal-input2').value
          //     ]
          //   }
          // })
          
         
          // this.excuteFunction.clearCache();
        }
        else
        {
          msg = "Permission denied.";
        } 
        break;

        // let checkAction = this.authService.checkRole('Tool_SendBankEOD', '', 'I');
        // if (checkAction) {
        //   this.excuteFunction.sendBankEOD();
        // }
        // else
        // {
        //   msg = "Permission denied.";
        // } 
        // break;
       
      }
      default: {
        //statements; 
        msg = "Function maintainace or building.";
        break;
      }
    }
    if(msg?.length > 0)
    {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: msg
      });
    }
  }
  positionDragButton: any;
  getAsetDraButton()
  {
    const position = JSON.parse(localStorage.getItem("positionDragButton"));
    if(position!== null && position !== undefined)
    {
      const box = document.getElementById('btnToolBox');
      // debugger;
      // box.style.position = 'absolute';
      if(box!==null && box!==undefined)
      {
        box.style.top = position.yPos + 'px';
        box.style.left =  position.xPos + 'px';
        this.setPositionExpandBox();
      }
     
    }
  }
  setPositionExpandBox()
  {
    const position = JSON.parse(localStorage.getItem("positionDragButton"));
    // if(position!== null && position !== undefined)
    // {
      
    // }
    const box = document.getElementById('divExpandTools');
      debugger;
    if(box!==null && box!==undefined)
    {
      // box.style.position = 'absolute';
      let haftInnerWidth = this.innerWidth/2;
      let haftInnerHeight = this.innerHeight/2;
      // box.style.top = position.yPos + 'px';
      // box.style.left =  position.xPos + 'px';
      if(position.xPos <= haftInnerWidth)
      {
        box.style.left = '110%';
        box.style.width = "200px";
        // left: -350%;
        // bottom: 10px;
        /* top: -50%; */
      }
      if(position.yPos <= haftInnerHeight)
      {
        box.style.top = '50%';
        // box.style.width = "200px";
        // left: -350%;
        // bottom: 10px;
        /* top: -50%; */
      }
      // else
      // {

      // }
    }
    
     
  }
  btnToolBoxClick()
  {
    this.getAsetDraButton();
  }
  ngOnInit() {

    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    if(this.showToolBox === 'true')
    {
      $(document).ready(function(){
        $('.custom-btn-container').draggable({
            stop: function() {
              var finalOffset = $(this).offset();
              var finalxPos = finalOffset.left;
              var finalyPos = finalOffset.top;
              console.log('finalxPos', finalxPos);
              console.log('finalyPos', finalyPos);
              this.positionDragButton = { xPos:finalxPos ,  yPos: finalyPos };
              localStorage.setItem('positionDragButton', JSON.stringify(this.positionDragButton)); 
              // this.getAsetDraButton();
              // $('#finalX > span').text(finalxPos);
              // $('#finalY > span').text(finalyPos);
              // $('#width > span').text($(this).width());
              // $('#height > span').text($(this).height());
          },
        });
  
        $('.custom-btn-container').click(function() {
            $(this).toggleClass('active');
        })
      });
      this.loadTools();
      setTimeout(() => {
        this.getAsetDraButton();
      }, 300);
     
    }
    this.production =  environment.production;
    if (this.authService.getShopMode() === 'FnB') {
      this.routeNav.navigate(["shop/order"]).then(() => {
         window.location.reload();
      });
    }
    let basket = this.basketService.getCurrentBasket();
    if(basket!==null && basket!==undefined && basket?.salesType?.toLowerCase() === "addpayment")
    {
      this.newOrder();
    }
    
    this.setfortStr();
    this.poleValue = this.getPole();
    //
    this.basket$ = this.basketService.basket$;
    this.basketTotal$ = this.basketService.basketTotal$;
    // this.basketDiscountTotal$  = this.basketService.basketTotalDiscount$;
    this.VirtualKey$ = this.commonService.VirtualKey$;
    this.IsGenOrderNo$ = this.basketService.IsGenOrderNo$;

    if(this.basketService.getCurrentIsNewGenOrderNo())
    {
      console.log("Gen New Order");
    }

    this.isResponseBasket$ = this.basketService.ResponeBasket$;
    this.basketService.changeIsCreateOrder(false);
    this.basketService.changeBasketResponseStatus(true);

    this.loadBarcodeList();
    this.storeSelected = this.authService.storeSelected();
    if (this.shiftService.getCurrentShip() == null || this.shiftService.getCurrentShip() === undefined) {
      // this.routeNav.navigate(['/shop']).then(() => {
      //   window.location.reload();
      // }); 
      this.routeNav.navigate(["shop/shifts"]).then(() => {
        window.location.reload();
      });
      // this.loadShiftOpenList();
    }
    else {

      this.loadSetting();
    
      // this.loadEmployee();
      this.route.data.subscribe(data => {
        // debugger;
        this.employees = data['employees'].data;
        this.basketService.changeEmployeeList(this.employees);
      });

      // console.log('Load Order');

      this.loadOrder();
      
      // this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', '')



      // // debugger;

      //   this.userParams.keyword = ''; 
      //   this.userParams.orderBy = 'byName';

      // this.isShowSlickSlider=true;
      // const basket = this.basketService.getCurrentBasket();
      // this.fetchAllData();
      // if(basket===null || (basket.customer===null || basket.customer===undefined))
      // {

      //     this.addNewOrder(); 
      // }
      // else
      // { 
      //     if(basket.salesType=="Retail")
      //     {
      //       
      //     }
      //     else
      //     {

      //       this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', basket.salesType )
      //     }
      //   if(this.orderId==="" || this.orderId ===null || this.orderId===undefined || this.orderId.toString() ==="undefined")
      //   {
      //     this.basketService.getNewOrderCode(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe(data => {

      //       this.orderNo = data;
      //     }); 
      //   }
      //   else
      //   {
      //     this.orderNo = this.orderId;
      //     this.removeBasket();
      //     this.billService.getBill(this.orderNo, this.storeSelected.companyCode, this.storeSelected.storeId).subscribe(data => {
      //         // debugger;
      //         this.order = data;
      //         const itemList: Item[] = [];

      //         this.changeCustomer(this.order.customer);
      //         this.setItemToBasket(this.order.lines);

      //       },(error) => {
      //         this.alertify.error(error);
      //       }, () => {

      //       });
      //   }
      // }

      // this.connectSerial();
    }

    this.basketService.changeBasketResponseStatus(true);
    this.initScanner();
    // this.scannerProfile = scanner;
    this.loadReasonList();
    this.mainShortcuts$ = this.commonService.MainShortcuts$;
    this.loadChannel();

    setTimeout(() => {
      let getkey= localStorage.getItem("customerDisplay");
      if(getkey===null || getkey===undefined || getkey ==="")
      {
        getkey = "false"; 
        // setTimeout(() => {
        //   localStorage.setItem("customerDisplay", "false");
        // }, 10);
      }
      if(this.customerDisplay === 'true' && getkey ==="false")
      {
        setTimeout(() => { 
          this.detectMultiMonitor();
        }, 30);
      } 
    }, 200);
    
    // this.basketService.
  }
  innerWidth = 0;
  innerHeight = 0;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    // if (this.innerWidth > 1024) {
    //   this.minWidthAction = 480;
    // }
    // else {
    //   this.minWidthAction = 150;
    // }
  }
  closeSerial(event)
  {
   debugger;
   this.showItemSerialComponent=false;
    // this.showTools = true ;
    this.loadShortcut();
    // this.commonService.TempShortcuts$.subscribe((data)=>{
    //   this.commonService.changeShortcuts(data, true);
    //   // console.log('Old Shorcut' , data );
    // });
  }
  initScanner()
  {
    this.scannerProfile = null;
    this.scannerProfile = BarcodeScanner();
    // this.basketService.changeBasketResponseStatus(true);
    this.scannerProfile.on( async (code, event: any) => {
      event.preventDefault();
      console.log(code); 
      debugger;
      var source = event.target;
      var sourceElement = event.srcElement;
      let nameOfInput = source['name'];
      console.log('Begin Scan', new Date().getMilliseconds());
      let classnameOfInput = sourceElement['className'];
      // nameOfInput === '' || nameOfInput === undefined ||nameOfInput === null ||
      if( nameOfInput === 'txtCustomer' || nameOfInput === 'txtOMSId' || nameOfInput === 'txtNote' || nameOfInput === 'txtSerialNumber' || nameOfInput === 'txtBookletNumber' ||  nameOfInput === 'txtQrCode' ||   classnameOfInput === 'txtQrCode' || classnameOfInput === 'swal2-input' )
      {
          if( nameOfInput === 'txtQrCode' ||   classnameOfInput === 'txtQrCode')
          {
            return false;
          }
      }
      else
      { 
          if(this.basketService.getBasketResponseStatus())
          {
           
            if(code!==null && code !==undefined && code !=='')
            {
              this.txtSearch.nativeElement.value = '';
              let enterKey = '%0A';
              // code.includes()
              if(code.indexOf(enterKey) !== -1)
              {
                code = code.replace(enterKey,'');
              } 
              this.itemSelectedIndex = -1;
              this.itemSelectedRow = '';
              this.onEnter(code, true);
             
            } 
          }
          else
          {
          //  this.alertify.warning('System running progress. Please try again.');
            this.txtSearch.nativeElement.value = '';
          }
      }
        
      
    });
    this.commonService.scannerProfile = this.scannerProfile;
  }

  // mainShortcuts$: Observable<boolean>;
  addNewOrder() {
    let test = this.basketService.getCurrentBasket()
    // debugger;
    if (test === null) {
      this.basketService.getNewOrderCode(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe(data => {
        // console.log(data);
        this.orderNo = data;
      });
      // this.alertify.success("AAAA");
      this.customerService.getItem(this.storeSelected.companyCode, this.storeSelected.defaultCusId).subscribe((response: any) => {
        // debugger;
        this.basketService.changeCustomer(response.data, "Retail").subscribe(() => {
          // this.routeNav.navigate(['/shop/order-grocery']).then();

        });
        if (this.authService.getShopMode() === 'FnB') {
          this.routeNav.navigate(["shop/order"]).then(() => {
            // window.location.reload();
          });
        }
        if (this.authService.getShopMode() === 'Grocery') {
          this.routeNav.navigate(["shop/order-grocery"]).then(() => {
            // window.location.reload();
          });

        }
        // this.route.navigate(['/shop/order']);


      });
    }
  }
  changeCustomer(customer: MCustomer) {
    this.basketService.changeCustomer(customer);
  }
  applyToBasket(lines) {
    lines.forEach(async item => {
      // debugger;
      var response = await this.itemService.getItem(item.itemCode).toPromise();
      if (response.success) {
        let itemBasket = this.basketService.mapProductItemtoBasket(response.data, 1);
        this.basketService.addItemBasketToBasketNoPromotion(itemBasket, item.quantity);
      }
      else {
        this.alertify.warning(response.message);
      }

      //
    });
  }
  async setItemToBasket(lines: TSalesLine[]) {

    // xxxxxx
    // let Lines = [];
    
    // debugger;
    let itemNum=0;
    let oldItem = [];

    
    var newArray = []; 
    lines.forEach(val => newArray.push(Object.assign({}, val))); 
    newArray = newArray.filter(x=>x?.promotionIsPromo!=='1');
    newArray.forEach(async item => {
      // debugger;
      console.log('await barcode' , item.barCode);
      console.log('await  this.order.cusGrpId' ,  this.order.cusGrpId);
      this.basketService.changeBasketResponseStatus(false);
       let PLU= "";
       let canGetData= true;
      if(item.weightScaleBarcode!==null &&  item.weightScaleBarcode!==undefined &&  item.weightScaleBarcode!== '')
      {
        item.barCode = "";debugger;
        if(this.barcodeSetup!==null && this.barcodeSetup!==undefined && this.barcodeSetup?.length > 0)
        {
           let value = item.weightScaleBarcode;
           let barcode = this.barcodeService.splitBarcode(value, this.barcodeSetup);
       
          // if(barcode.prefix === this.barcodeSetup[0].prefix)
          // { 
          // }
          if(barcode!==null && barcode!==undefined)
          {
            if(barcode.barCodeLength === value.length)
            {
              if(this.barcodeService.barcodeCheck(value))
              {
                PLU = barcode.pluStr;
                // barcodeReplace= true;
              }
              else
              {
                // this.alertify.warning('Check digit failed.');
                Swal.fire({
                  icon: 'warning',
                  title: 'Item',
                  text: value + " Check digit failed"
                });
                canGetData= false;
                this.basketService.changeBasketResponseStatus(true);
                // console.log("Check digit failed");
              }
            }
            else
            {
              // this.alertify.warning('Invalid barcode length.');
              Swal.fire({
                icon: 'warning',
                title: 'Item',
                text: value + " Invalid barcode length"
              });
              canGetData= false;
              this.basketService.changeBasketResponseStatus(true);
              // console.log("Invalid barcode length");
            }
          }
         
         
        }
        
      }
      
      if(canGetData)
      {
        await this.itemService.getItemFilter(this.storeSelected.companyCode, this.storeSelected.storeId, item.itemCode, item.uomCode , item.barCode,
          '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', this.order.cusGrpId, '',PLU,'','').subscribe(async (response: any) => {
            debugger;
            itemNum++;
            console.log('response barcode' , response);
            if(response.success)
              {
                  
                  let itemX = response.data[0]; 
                  if(itemX!==undefined && itemX!==null)
                  {
                    console.log('response.responseTime',  response.responseTime);
                    itemX.responseTime = response.responseTime;
                    if (item.slocId !== undefined && item.slocId !== null) {
                      itemX.slocId = item.slocId;
                    }
                    else {
                      itemX.slocId = this.storeSelected.whsCode;
                    }
                    
                    let itembasket = this.basketService.mapProductItemtoBasket(itemX, 1);
                    itembasket.weightScaleBarcode = item.weightScaleBarcode;
                    if (itembasket.productName === null || itembasket.productName === undefined) {
                      itembasket.productName = itemX.itemDescription;
                    }
                    itembasket.lineItems = [];
                    let BOMLine = item.lines;
                    debugger;
                    if(BOMLine!==null && BOMLine!==undefined)
                    {
                      BOMLine.forEach(line => {
                        let bomLine = new IBasketItem ();
                        bomLine.id = line.itemCode;
                        bomLine.productName = line.itemName;
                        bomLine.quantity = line.quantity;
                        bomLine.uom = line.uomCode;
                        bomLine.price = line.price;
                        bomLine.lineTotal = line.lineTotal;
                        itembasket.lineItems.push(bomLine);
                      });
                    } 
                    itembasket.quantity = item.openQty;
                    itembasket.openQty = item.openQty;
                    if (itembasket.isCapacity) {
                      itembasket.appointmentDate = item.appointmentDate.toString();
                      itembasket.timeFrameId = item.timeFrameId.toString();
                      itembasket.storeAreaId = item.storeAreaId.toString();
                      itembasket.quantity = item.openQty;
                      itembasket.note = item.remark;
            
                    }
                    
                    itembasket.prepaidCardNo = item.prepaidCardNo;
                    
                    itembasket.isSerial = item.isSerial;
                    itembasket.isVoucher = item.isVoucher;
                    itembasket.memberDate = item.memberDate;
                    itembasket.memberValue = item.memberValue;
                    itembasket.startDate = item.startDate;
                    itembasket.endDate = item.endDate;
                    itembasket.itemType = item.itemType;
                    itembasket.promotionPromoCode = item?.promoId;
                  
                    let lineTotal = item.lineTotal;// item.quantity * item.price;
                    let discountAmountLine = item.discountAmt ? item.discountAmt : 0;
                    
                    if (discountAmountLine > 0) {
            
                      let xRs = lineTotal;// - discountAmountLine;
                      let resultLine = xRs/ item.quantity; // (xRs - (xRs * discountTongBill / 100)) 
                      itembasket.price =  resultLine;//item.price;
                      itembasket.promotionPriceAfDis = resultLine;
                      itembasket.promotionLineTotal = 1 * resultLine;
                    }
                    else { 
                      let resultLine = lineTotal / item.quantity; // (lineTotal - (lineTotal * discountTongBill / 100))
                      itembasket.price = item.price;
                      itembasket.promotionPriceAfDis = resultLine;
                      itembasket.promotionLineTotal = 1 * resultLine;
                    }
                    itembasket.price = item.price;
                    itembasket.promotionPriceAfDis = item.lineTotalDisIncludeHeader / item.quantity;
                    itembasket.promotionLineTotal = item.lineTotalDisIncludeHeader / item.quantity;
                  
                    itembasket.discountType = item.discountType === null || item.discountType === undefined ? "" : item.discountType;
                    if (itembasket.discountType === 'Discount Percent') {
                      itembasket.discountValue = item.discountRate;
                    }
                    // if (itembasket.discountType === 'Discount Amount') {
                    //   itembasket.discountValue = item.discountAmt/item.quantity;
                    // }
                    if (itembasket.discountType === 'Fixed Quantity') {
                      itembasket.discountValue = item.discountAmt/item.quantity;
                    }
                    if(itembasket.discountType === 'Fixed Price')
                    {
                      itembasket.discountValue = item.discountAmt/item.quantity;
                    }
                    itembasket.promotionDisAmt = item.discountAmt / item.quantity;
                    if (itembasket.discountType === 'Discount Amount') { 
                      itembasket.discountValue = item.discountAmt;
                      itembasket.promotionDisAmt = item.discountAmt;
                    }

                    itembasket.promotionDisPrcnt = item.discountRate;
                    itembasket.promotionDiscountPercent = item.discountRate;
      
                    itembasket.promotionIsPromo = item.isPromo;
                    itembasket.salesTaxCode = item.taxCode;
                    itembasket.salesTaxRate = item.taxRate;
                    itembasket.taxAmt = item.taxAmt;
                    itembasket.promotionType = item.promoType;
                    itembasket.baseLine = item.lineId;
                    itembasket.baseTransId = item.transId;
                    itembasket.weightScaleBarcode = item.weightScaleBarcode;
                    if(itembasket.weightScaleBarcode?.length >0)
                    {
                      itembasket.isWeightScaleItem = true;
                    }
                    debugger;
                    oldItem.push(itembasket);
                  
                  }
                  else
                  {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Data item ' + item.description + '  not found',
                      text: response.message
                    });
                  }
                
              }
              else
              {
                Swal.fire({
                  icon: 'warning',
                  title: 'Data item ' + item.description + '  not found',
                  text: response.message
                });
              }
      
              if(itemNum>=newArray.length)
              {
              debugger;
                this.basketService.addItemListBasketToBasket(oldItem, false);
                let basket = this.basketService.getCurrentBasket();
                this.basketService.applyPromotion(basket);
                this.basketService.changeBasketResponseStatus(true);
                // console.log("Set data");
              }
          })
      }
      
     
      // console.log(Lines);
      // && x.barCode === item.barCode
      // let itemX = this.items.find(x => x.itemCode === item.itemCode && x.uomCode === item.uomCode);
      // debugger;
     
    });
    // setTimeout(()=>{
    //   Lines.forEach(item => {
    //     debugger;
    //     if(item.weightScaleBarcode!==null &&  item.weightScaleBarcode!==undefined &&  item.weightScaleBarcode!== '')
    //     {
    //       this.onEnter(item.weightScaleBarcode);
    //     }
    //     else
    //     {
    //       this.onEnter(item.barcode);
    //     }
        
    //   });
      // this.basketService.addItemListBasketToTmpItemsBasket(Lines); 
      // this.itemBasketReturn = Lines as IBasketItem[];
      // debugger;
      // this.basketService.addItemListBasketToBasket(Lines, false);
      // this.basketService.addItemListBasketToBasket(Lines, false);
      // this.basketService.calculateBasket();
      // // debugger;
      // console.log(Lines);
      // const initialState = {
      //   items: Lines, title: 'Buy back Items',
      // };
      // this.modalRef = this.modalService.show(ShopExchangeItemListComponent, {
      //   initialState, animated: true,
      //   keyboard: true,
      //   backdrop: true,
      //   ignoreBackdropClick: true,
      //   ariaDescribedby: 'my-modal-description',
      //   ariaLabelledBy: 'my-modal-title',
      //   class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
      // });
      // this.modalRef.content.outEvent.subscribe((receivedEntry) => {
      //   console.log('result', receivedEntry);
      //   debugger;
      //   if (receivedEntry !== null && receivedEntry != undefined) {
      //     this.modalRef.hide();
      //     if (receivedEntry.success === false) {
      //       this.newOrder();
      //     }
      //     else
      //     {
      //       console.log('result', receivedEntry.models);
      //       receivedEntry.models.forEach(item => {
      //         if(item.weightScaleBarcode!==null &&  item.weightScaleBarcode!==undefined &&  item.weightScaleBarcode!== '')
      //         {
      //           this.onEnter(item.weightScaleBarcode);
      //         }
      //         else
      //         {
      //           this.onEnter(item.barcode);
      //         }
              
      //       });
            
      //     }
      //   }
      // });
    // }, 100)
    // setTimeout(()=>{
    //   this.basketService.addItemListBasketToBasket(Lines, true);
    // }, 100)
    // console.log(Lines);
    // this.basketService.addItemListBasketToBasket(Lines, true);
    // if (Lines !== null && Lines !== undefined) {
    //   // debugger;
      
    // }
  }

  removeBasket() {
    const basket = this.basketService.getCurrentBasket();
    this.basketService.deleteBasket(basket);
  }
  filterBy(txtFilter: any) {
    // debugger;
    // this.userParams.merchandise="";
    // this.userParams.keyword = txtFilter;
    // this.loadItemPagedList(null, null);
    // this.selectedCateFilter = "";
    if (this.basketService.getCurrentBasket().salesType == "Retail") {
      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, txtFilter, '', '')
    }
    else {
      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, txtFilter, '', this.basketService.getCurrentBasket().salesType)

    }
  }
  filterByType(value) {
    // debugger;
    if (this.basketService.getCurrentBasket().salesType == "Retail") {
      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', '', value);


    }
    else {
      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', this.basketService.getCurrentBasket().salesType)

    }
  }
  treeBoxValue: string[];
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
      //check your comment box value to show message
      // console.log('window:beforeunload', event);
      // debugger;
      let basketresponeStatus = this.basketService.getBasketResponseStatus();// !(this.isResponseBasket$ | async);
      // basketresponeStatus= false;
      if(basketresponeStatus=== false)
      {
        event.returnValue = 'You have unfinished changes!';
        console.log('Show message Close browse');
        // Swal.fire({
        //   title: 'Are you sure?',
        //   text: 'You have unfinished changes!',
        //   icon: 'question',
        //   showCancelButton: true,
        //   confirmButtonText: 'Yes',
        //   cancelButtonText: 'No'
        // }).then((result) => {
        //   if (result.value) {
        //     // window.stop();
        //     return true;
        //   }
        //   else
        //   {
        //     window.stop();
        //     return false;
        //   }
        // });
      }
      // else
      // {
      //   window.stop();
      //   return false;
     
      // }
  }
  @ViewChild(DxTreeViewComponent, { static: false }) treeView;
  syncTreeViewSelection(e) {
    var component = (e && e.component) || (this.treeView && this.treeView.instance);

    if (!component) return;

    if (!this.treeBoxValue) {
      component.unselectAll();
    }

    if (this.treeBoxValue) {
      this.treeBoxValue.forEach((function (value) {
        component.selectItem(value);
      }).bind(this));
    }
  }

  treeView_itemSelectionChanged(e) {
    if (e.itemData !== null && e.itemData !== undefined) {
      this.addToBag(e.itemData);
    }

  }
  modalRef: BsModalRef;
  basket$: Observable<IBasket>;
  basketTotal$: Observable<IBasketTotal>;
  showModal: boolean = false;
  customerMode = "Link";
  searchBarcodeOnly="false";
  allowNegativeExchange="false";
  poleDisplay="false";
  poleDisplayType="";
  printByApp="true";
  salesPersonalMandatory = "true";
  omsInputDefault: SGeneralSetting= new SGeneralSetting();
  checkVoucherWClause= "true";
  orderAmountLimit = 0;
  BillReload = 10;
  ManualRunPromotion = "false";
  AssignStaff = "false";
  AssignType = "OnBill";
  customerDisplay = "false"; 
  showToolBox = "true";
  serialViewMode = '';
  showTools = false;
  QtyWScaleToOne = false;
  sendToPole()
  {

  }
  priceWScaleWithCfg ="false";
  loadSetting() {
   
    let mode = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'CustomerDisplayMode');
    if (mode !== null && mode !== undefined) {
      this.customerMode = mode.settingValue;
    }
    let exMode = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'ExchangeItems');
    if (exMode !== null && exMode !== undefined) {
      this.exchangeItemMode = exMode.settingValue;

    }
  
    let ShowToolBox = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'ShowToolBox');
    if (ShowToolBox !== null && ShowToolBox !== undefined) {
      let showToolBoxX = ShowToolBox.settingValue;  
      if(showToolBoxX==='true')
      {
        let typeToolBoxX = ShowToolBox.customField1;
        if(typeToolBoxX?.toLowerCase() ==='drag')
        {
          this.showToolBox = 'true';
          this.showTools = true;
        } 
        else
        {
          this.showToolBox = 'false';
          this.showTools = false;
        }
      }
    }
    let CustomerDisplay = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'CustomerDisplay');
    if (CustomerDisplay !== null && CustomerDisplay !== undefined) {
      this.customerDisplay = CustomerDisplay.settingValue;
      
    }
    let returnMode = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'ReturnItems');
    if (returnMode !== null && returnMode !== undefined) {
      this.returnItemMode = returnMode.settingValue;
      
    }
    let BillReloadNo = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'BillReloadNo');
    if (BillReloadNo !== null && BillReloadNo !== undefined) {

      let value = BillReloadNo.settingValue;
      if (value !== "" && value !== "0" && value !== undefined && value !== null && value !== "None") {
        this.BillReload = parseInt(value);
      }
      else
      {
        this.BillReload = 0;
      }
    }
    let generalSetting = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId);
    let checkSerial = generalSetting.find(x=>x.settingId==="SerialCheck");
    if(checkSerial!==null && checkSerial!==undefined )
    {
      this.serialViewMode = checkSerial?.customField2;
      if(this.serialViewMode === 'Expand' || this.serialViewMode === 'Replace')
      {
        this.showSerialExpand = true;
      }
      else
      {
        this.showSerialExpand = false;
      }
    }

    
    let printByApp = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'PrintByApp');
    if (printByApp !== null && printByApp !== undefined) {
      this.printByApp = printByApp.settingValue; 
    }
    let assignStaff = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'AssignStaff');
    if (assignStaff !== null && assignStaff !== undefined) {
      this.AssignStaff = assignStaff.settingValue; 
      if(this.AssignStaff === "true")
      {
        if(assignStaff.customField2 !== undefined && assignStaff.customField2 !== null && assignStaff.customField2 !== "")
        {
          this.AssignType = assignStaff.customField2; 
        }
        else  
        {
          this.AssignType = "OnBill"; 
        }
      }
     
    }

    let ManualRunPromotion = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'ManualRunPromotion');
    if (ManualRunPromotion !== null && ManualRunPromotion !== undefined) {
      this.ManualRunPromotion = ManualRunPromotion.settingValue; 
    }
    
    let eInvoice = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'Invoice');
    if (eInvoice !== null && eInvoice !== undefined) {
      this.eInvoice = eInvoice.settingValue;

    }

    let priceWScaleWithCfg = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'PriceWScaleWithCfg');
    if (priceWScaleWithCfg !== null && priceWScaleWithCfg !== undefined) { 
      this.priceWScaleWithCfg = priceWScaleWithCfg.settingValue; 
    }
    let loyalty = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'Loyalty');
    if (loyalty !== null && loyalty !== undefined) {
      this.loyalty = loyalty.settingValue;

    }
    let SalesPersonalMandatory = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'SalesPersonalMandatory');
    if (SalesPersonalMandatory !== null && SalesPersonalMandatory !== undefined) {
      this.salesPersonalMandatory = SalesPersonalMandatory.settingValue;

    }
    let searchBarcodeOnly = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'SearchOnlyBarcode');
    if (searchBarcodeOnly !== null && searchBarcodeOnly !== undefined) {
      this.searchBarcodeOnly = searchBarcodeOnly.settingValue;

    }
    let omsInputDefault = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'OMSInputMode');
    if (omsInputDefault !== null && omsInputDefault !== undefined) {
      this.omsInputDefault = omsInputDefault;
      // debugger;
    }
    let printShow = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'CustomerDisplayMode');
    if (printShow !== null && printShow !== undefined) {
      this.printShow = printShow.settingValue;
    }
    let allowNegativeExchange = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'AllowNegativeExchange');
    if (allowNegativeExchange !== null && allowNegativeExchange !== undefined) {
      this.allowNegativeExchange = allowNegativeExchange.settingValue;
    }
    let poleDisplay = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'PoleDisplay');
    if (poleDisplay !== null && poleDisplay !== undefined) {
      this.ignorePoleDisplay=false;
      this.poleDisplay = poleDisplay.settingValue;
      let cusF1 = poleDisplay.customField1; 
      if(cusF1!==null && cusF1!==undefined && cusF1?.toLowerCase() ==='serialport')
      {
        this.poleDisplayType = "serialport";
      }
      else
      {
        this.poleDisplayType = "";
      }
    }

    let inputWithoutConfig = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'InputWithoutConfig');
    if (inputWithoutConfig !== null && inputWithoutConfig !== undefined) {
  
      this.inputWithoutConfig = inputWithoutConfig.settingValue;
    }
  
    this.showSearchkey =this.authService.checkRole(this.functionId , 'isShowSearchKey', 'V' );
    // debugger;
    let orderAmountLimit = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'OrderLimitAmount');
    if (orderAmountLimit !== null && orderAmountLimit !== undefined) { 
      this.orderAmountLimit = parseFloat(orderAmountLimit.settingValue);
    }
    // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().username, '', "Adm_Shop", 'isShowSearchKey', 'V').subscribe((response: any) => {
    //   debugger;
    //   if(response.success)
    //   {
    //     this.showSearchkey = response.success;
    //   }
    //   else  
    //   {
    //     console.log(response.message);
    //   }
      
      
    // })
    // debugger;
    let chanel = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().storeId).find(x => x.settingId === 'chanel');
    if (chanel !== null && chanel !== undefined) {
      this.chanel = chanel.settingValue;

    }
  }
  searchKey ="";
  
  runManualPromotion()
  {
    let basket = this.basketService.getCurrentBasket();
    var newArray = []; 
    if( basket.items!==null &&  basket.items!==undefined &&  basket.items?.length > 0)
    {
      basket.items.forEach(val => newArray.push(Object.assign({}, val))); 
      basket.orginalItems = newArray;
      this.basketService.applyPromotion(basket, null, true);
    }
   
  }
  removePromotion()
  { 
   
    let basket = this.basketService.getCurrentBasket(); 
    basket.items = basket.orginalItems;
    basket.isApplyPromotion = false;
    basket.items.forEach(item => {
      item.lineTotal = item.price * item.quantity;
      item.promotionDisAmt = 0;
      item.promotionDisPrcnt = 0;
      item.promotionDiscountPercent = 0; 
      item.promotionLineTotal = item.price * item.quantity;
      item.promotionPriceAfDis = item.price;
      item.discountType = "Discount Percent";
      item.discountValue = 0; 
    });
    debugger;
    this.basketService.setBasket(basket);
    
  } 
  openInvoiceModal() {

    this.modalRef = this.modalService.show(ShopInvoiceInputComponent);
    // this.modalRef = this.modalService.show(template, {
    //   ariaDescribedby: 'my-modal-description',
    //   ariaLabelledBy: 'my-modal-title', 
    //   class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
    // });

  }
  selectCustomer(customer) {
    let basket = this.basketService.getCurrentBasket();
    let type = basket.salesType;
    if (type === null || type === undefined || type === '') {
      type = "Retail";
    }
    this.basketService.changeCustomer(customer, type);
    this.modalRef.hide();
  }
  viewCustomer(template: TemplateRef<any>, arrCompany) {
    if (this.customerMode === 'Link') {
      this.routeNav.navigate(['/shop/customer']);
    }
    else {
      this.showModal = true;
      setTimeout(() => {
        this.modalRef = this.modalService.show(template, {
          ariaDescribedby: 'my-modal-description',
          ariaLabelledBy: 'my-modal-title',

          class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
        });
        this.modalRef.onHide.subscribe(() => { 
          this.showModal= false; 
        })
      });
    }
  }
  public amount: number | string = ''
  addToBag(item) {
    let basket = this.basketService.getCurrentBasket();
    console.log("basket", basket);
    if (basket.customer !== null || basket !== undefined) {
      if (item.customField1 === "Member") {

        let itembasket = this.basketService.mapProductItemtoBasket(item, 1);
        itembasket.memberValue = 1;
        const initialState = {
          item: itembasket, title: 'Item Serial',
        };
        this.modalRef = this.modalService.show(ShopMemberInputComponent, { initialState });
      }
      else {
        if (item.customField1 === "Card") {

          let itembasket = this.basketService.mapProductItemtoBasket(item, 1);
          itembasket.memberValue = 1;
          const initialState = {
            item: itembasket, title: 'Item Serial',
          };
          this.modalRef = this.modalService.show(ShopCardInputComponent, { initialState });
        }
        else {
          // debugger;
          let type = "";
          if (basket.items.length > 0) {
            type = basket.items[0].customField4;
          }
          if (type !== item.customField4 && type !== "") {
            this.alertify.warning("Can't add different item type");
          }
          else {
            // debugger;
            if (item.isBom) {
              this.bomService.GetByItemCode(this.authService.getCurrentInfor().companyCode, item.itemCode).subscribe((response: any) => {
                // debugger;
                this.basketService.addItemtoBasket(item, 1, response.data);
              });
            }
            else {
              if (item.isSerial) {
                let itembasket = this.basketService.mapProductItemtoBasket(item, 1);

                const initialState = {
                  item: itembasket, title: 'Item Serial',
                };
                if(this.showSerialExpand===false)
                {
                  this.modalRef = this.modalService.show(ShopItemSerialComponent, { initialState });
                  setTimeout(() => {
                    this.basketService.changeBasketResponseStatus(true);
                  }, 100);
                }
                else
                {
                  this.itemSerialSelected = itembasket;
                  this.showItemSerialComponent = true;
                  this.showTools = false;
                   this.commonService.changeShortcuts([], true);
                }
                // this.modalRef = this.modalService.show(ShopItemSerialComponent, { initialState });
              }
              else {

                if (item.capacityValue !== null && item.capacityValue !== undefined && item.capacityValue > 0) {
                  Swal.fire({
                    title: 'Submit your quantity',
                    input: 'number',
                    inputAttributes: {
                      autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Look up',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: () => !Swal.isLoading()
                  }).then((result) => {
                    if (result.isConfirmed) {
                      // debugger;
                      let itembasket = this.basketService.mapProductItemtoBasket(item, 1);
                      itembasket.quantity = result.value;
                      itembasket.storeAreaId = '';
                      itembasket.timeFrameId = '';
                      itembasket.appointmentDate = '';
                      itembasket.isCapacity = true;
                      // 
                      const initialState = {
                        basketModel: itembasket, title: 'Item Capacity',
                      };
                      this.modalRef = this.modalService.show(ShopCapacityComponent, { initialState });
                    }
                  })
                  // debugger;

                  // this.router.navigate(["shop/capacity", this.item.itemCode]);
                }
                else {
                  this.basketService.addItemtoBasket(item);
                }

              }


            }
          }

        }
      }

    }
    else {

    }

  }


  increment(item: IBasketItem) {
    this.basketService.incrementItemQty(item);
  }
  inputWithoutConfig = "true";
  currencyInputMask = createMask({
    alias: 'numeric',
    // groupSeparator: ',',
    // digits: 2,
    // digitsOptional: false,
    prefix: '-',
    placeholder: '0',
  });
  currencyFC = new FormControl('');
  onBlurMethod(item: IBasketItem, inputPrice?, inputQuantity?) {
    // console.log("item", item);
    // console.log("inputPrice", inputPrice);
    let basket = this.basketService.getCurrentBasket();
    this.itemSelectedIndex = -1;
    
    debugger;

    this.authService.setOrderLog("Order", "Update Qty", "", "Item Code:" + item.id + ", Item Name:" + item?.productName +', qty ' + item.quantity );
   
    if(inputQuantity!==null && inputQuantity!==undefined && inputQuantity!=='')
    {
      item.quantity = parseFloat(inputQuantity) ;
    }
    
    if(inputPrice === true)
    {
      if(this.authService.checkFormatNumber(item.price, 'amount') || this.inputWithoutConfig === 'true')
      {
          if ( item.price === null || item.price === undefined || item.price.toString() === "") {
            item.price = 0;
          }
          if( item.price >= 0)
          { 
            this.updateQuantity(basket, item);
          }
          else
          {
            Swal.fire({
              icon: 'warning',
              title: 'Price Invalid',
              text: "Can't input negative price."
            }).then(()=>{
              item.price = item.oldPrice;
            }) 
          }
      }
      else
      {
        Swal.fire({
          icon: 'warning',
          title: 'Quantity format invalid',
          text: "Can't input value wrong format."
        }).then(()=>{
          item.quantity = item.oldQuantity;
        }) 
      }
    }
    else
    {
      if ( item.quantity === null || item.quantity === undefined || item.quantity.toString() === "") {
        item.quantity = 0;
      }
      if(item?.allowSalesNegative && item.quantity > 0 )
      {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: "Can't input value to quantity."
        }).then(()=>{
          item.quantity = item.oldQuantity;
        }) 
      }
      else
      {
        // || this.inputWithoutConfig === 'true'
        if(this.authService.checkFormatNumber(item.quantity, 'quantity', item.uom ) )
        {
          
          if(item.quantity <= 0 && (basket.salesType.toLowerCase() !== 'ex' &&  basket.salesType.toLowerCase() !== 'exchange') )
          {
            if(item?.allowSalesNegative)
            {
              // item.quantity = 0;
            }
            else  
            {
              item.quantity = 0;
            }
          
          }
         debugger;
          if( item.quantity === 0)
          {
            item.quantity = item.oldQuantity; 
           
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: "Can't input zero to quantity."
            }).then(()=>{
              // if(inputQuantity==='0')
              // { 
              //   this.onBlurMethod(item); 
              // }
  
            }) 
            
          }
          else
          {
            // debugger;
            if(item.quantity !== (item.oldQuantity??0))
            {
              if(item.quantity < item.oldQuantity)
              {
                let checkAction =  this.authService.checkRole(this.functionId , 'fnUpdateQuantity', 'I' );
                let checkApprovalRequire =  this.authService.checkRole(this.functionId , 'fnUpdateQuantity', 'A' );
                if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
                {
                  checkAction = false;
                }
                if(checkAction)
                {
                  this.updateQuantity(basket, item);
                }
                else
                {
                    // const initialState = {
                    // title: 'Update Quantity - Permission denied',
                    // };
                    let permissionModel= { functionId: this.functionId, functionName: 'Update Quantity', controlId: 'fnUpdateQuantity', permission: 'I'};
                    const initialState = {
                        title:  'Update Quantity - Permission denied', permissionModel : permissionModel
                    };
                    let modalApprovalRef = this.modalService.show(ShopApprovalInputComponent, {
                      initialState, 
                      animated: true,
                      keyboard: true,
                      backdrop: true,
                      ignoreBackdropClick: true,
                      ariaDescribedby: 'my-modal-description',
                      ariaLabelledBy: 'my-modal-title',
                      class: 'modal-dialog modal-xl medium-center-modal'
                      // class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
                    });
                    modalApprovalRef.content.outEvent.subscribe((received: any) => {
                      if(received.isClose)
                      {
                        item.quantity = item.oldQuantity;
                        modalApprovalRef.hide();
                      }
                      else
                      {

                        
                            
                        this.authService.setOrderLog("Order", "Approve Update Qty", "",   item.id +' qty ' + item.quantity + " by " + received.user);
                        this.updateQuantity(basket, item);
                        modalApprovalRef.hide();


                        // // debugger;
                        // let code = (received.customCode ?? '');
                        // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, code, this.functionId, 'fnUpdateQuantity', 'I' ).subscribe((response: any)=>{
                        //   // const user = response;
                        //   // debugger;
                        //   if (response.success) {
                        //     let note = (received.note ?? '');
                        //     if (note !== null && note !== undefined && note !== '') {
                        //       this.basketService.changeNote(note).subscribe((response) => {
                
                        //       });
                        //       this.alertify.success('Set note successfully completed.');
                        //     }

                        //   }
                        //   else {
                        //       Swal.fire({
                        //         icon: 'warning',
                        //         title: 'Change Quantity',
                        //         text: response.message
                        //       });
                        //       // item.quantity = item.oldQuantity;
                        //   }
                        // })
                      }
                    
                    });
                    modalApprovalRef.onHide.subscribe((reason: string) => {
                      item.quantity = item.oldQuantity;
                      this.commonService.TempShortcuts$.subscribe((data)=>{
                        this.commonService.changeShortcuts(data, true);
                        // console.log('Old Shorcut' , data );
                      });
                    })
                }
              }
              else
              {
                this.updateQuantity(basket, item);
              }
            }
            
            
          
          
          }
        }
        else
        {
          Swal.fire({
            icon: 'warning',
            title: 'Quantity format invalid',
            text: "Can't input value wrong format."
          }).then(()=>{
            item.quantity = item.oldQuantity;
          }) 
        }

      }
     
    }
   
  }
  @ViewChild('myScrollContainer') content: ElementRef;
  scrollToBottomFix()
  {
    try {
      setTimeout(() => { 
        this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
      }, 10);
    } 
    catch (err) { 
    }
  }

  scrollToBottomList(index?)
  {
    if(index!==null && index!==undefined && index >= 0)
    {
      const scrollTo = document.querySelector(".kselected");
      if (scrollTo) {
        setTimeout(() => { 
          scrollTo.scrollIntoView({ behavior: 'smooth', block: "center" });
        }, 10);
        // behavior: 'smooth', block: 'center'
      
            // debugger;2080000113809

          // scrollTo.scrollIntoView({ block: "center" });
        //  this.scrollToBottomFix();
        // this.basketService.changeBasketResponseStatus(true);
      }
    }
    else
    {
      setTimeout(() => {
        if(this.basketService.getBasketResponseStatus()) 
        {
         let basket = this.basketService.getCurrentBasket();
          if(basket!==null && basket!==undefined && basket?.items?.length > 0)
          {
            this.itemSelectedIndex = basket?.items?.length - 1;
          } 
          setTimeout(() => {
            const scrollTo = document.querySelector(".kselected");
            if (scrollTo) {
              // setTimeout(() => { 
              //   scrollTo.scrollIntoView({ block: "center" });
              // }, 10);
              // behavior: 'smooth', block: 'center'
            
                  // debugger;2080000113809
    
                // scrollTo.scrollIntoView({ block: "center" });
               this.scrollToBottomFix();
              // this.basketService.changeBasketResponseStatus(true);
            }
            else
            {
              let basket = this.basketService.getCurrentBasket();
              if(basket!==null && basket!==undefined && basket?.items?.length > 0)
              {
                this.itemSelectedIndex = basket?.items?.length - 1;
                this.scrollToBottomList();
                // this.scrollToBottomFix();
                // this.basketService.changeBasketResponseStatus(true);
              }
             
            }
          }, 50);
  
        
       
        }
      },80)
      setTimeout(() => {
        if(this.content.nativeElement.scrollTop !== this.content.nativeElement.scrollHeight){
          // this.scrollToBottomList();
          this.scrollToBottomFix();
        } 
      }, 100)
    }
   
    // setTimeout(() => {
      
    //   this.scrollToBottomFix();

    // }, 100)
    // this.basketService.changeBasketResponseStatus(false);
  
   
  }
  intervalSetSelected;
  
  updateQuantity(basket, item)
  {
    debugger;
    console.log('item Update',item);
    if(this.ManualRunPromotion?.toLowerCase() === "true" ) 
    {
      // && basket.isApplyPromotion === true
      this.removePromotion();
      basket = this.basketService.getCurrentBasket();
    }
    if(basket.salesType?.toLowerCase() ==='return' || basket.salesType?.toLowerCase() ==='receive')
    {
         if(this.itemBasketReturn!==null && this.itemBasketReturn!==undefined && this.itemBasketReturn?.length > 0)
        {
          let itemCheck = this.itemBasketReturn.find(x=> x.barcode === item.barcode);
          if(itemCheck.openQty >= item.quantity)
          {
            
            this.basketService.SetQuantityItemBasket(item, item.quantity);
            this.txtSearch.nativeElement.focus();
            this.txtSearch.nativeElement.value = '';
          }
          else
          {
            // console.log("3");
            Swal.fire({
              icon: 'warning',
              title: 'Item',
              text: "Can't add to basket. Item return can't more than sales quantity"
            });
            // this.basketService.removeItem(itemCheck);
            setTimeout(() => {
              this.basketService.SetQuantityItemBasket(item, item.oldQuantity);
              // this.txtSearch.nativeElement.focus();
              // this.txtSearch.nativeElement.value = '';
            }, 200);
           
          }
          
        }
        else
        {
          Swal.fire({
            icon: 'warning',
            title: 'Item',
            text: "Item can't return"
          });
          setTimeout(() => {
            this.basketService.SetQuantityItemBasket(item, item.oldQuantity);
            // this.txtSearch.nativeElement.focus();
            // this.txtSearch.nativeElement.value = '';
          }, 200);
         
        }
    }
    else
    {
     
      if (basket.salesType?.toLowerCase() === "ex" || basket.salesType?.toLowerCase() === "exchange") 
      {
        let check = false;
        let isReturn = basket.returnMode;
        let tmpItems = this.itemBasketReturn;
        let lst = [];
        if ((basket.salesType.toLowerCase() === "ex" || basket.salesType.toLowerCase() === "exchange"  ) && isReturn) 
        {
          if (tmpItems.some(x => x.id === item.id && x.uom === item.uom  && x.barcode === item.barcode)) 
          {
            check = true;
          }
        }
        else {
          check = true;
        }
        if (check) 
        {
          let itemInBasket = basket.items.find(x => x.id === item.id && x.uom === item.uom  && x.barcode === item.barcode && x.isNegative === item.isNegative);
          let itemInOrder = tmpItems.find(x => x.id === item.id && x.uom === item.uom  && x.barcode === item.barcode);
          
          debugger;
          if(itemInBasket!==null && itemInBasket!==undefined && isReturn===true)
          {
              if(Math.abs(itemInBasket.quantity) >= itemInOrder.quantity)
              {
                console.log("4");
                Swal.fire({
                  icon: 'warning',
                  title: 'Item',
                  text: "Can't add to basket. Item return can't more than sales quantity"
                });
                item.quantity = item.oldQuantity;
                this.basketService.updateItemQty(item);
              }
              else  
              {
                
                this.basketService.updateItemQty(item);
              }
          }
          else
          {
            
            this.basketService.updateItemQty(item);
            
          }
          
        }
        // else
        // {

        //   this.basketService.updateItemQty(item);
        // }
      }
      else  
      {
       
       
        if(item?.allowSalesNegative && item.quantity < 0)
        {
          item.promotionPriceAfDis = item.price;
          this.basketService.SetQuantityItemBasket(item, item.quantity);
        }
        else
        {
          item.oldQuantity = item.quantity;
          this.basketService.updateItemQty(item);
        }
        
       
      }
    }

    debugger;
    setTimeout(() => {
      this.intervalSetSelected = setInterval(() => {
        let status = this.basketService.getBasketResponseStatus();
        if(status === true)
        {
          if(item?.lineNum!==null !== item?.lineNum!==undefined)
          { 
            debugger;
            let index =  item?.lineNum;
            this.itemSelectedIndex = index - 1;
            this.scrollToBottomList(index);
            setTimeout(() => {
              clearInterval(this.intervalSetSelected);
            }, 300); 
          }
        }
        
      }, 350);
    }, 300);

  }
  updateNote(item: IBasketItem) {
    // debugger;
    if (item.quantity <= 0 || item.quantity === null || item.quantity === undefined || item.quantity.toString() === "") {
      item.quantity = 0;
    }
    this.basketService.updateRemark(item);
  }
  decrement(item: IBasketItem) {
    this.basketService.decrementItemQty(item);
  }
  // remove(item: IBasketItem) {

  //   this.basketService.removeItem(item);
  // }
  removeCapacityLine(item: IBasketItem) {
    this.basketService.removeCapacityLine(item);
  }
  editCapacityLine(item: IBasketItem) {

    const initialState = {
      basketModel: item, title: 'Item Capacity',
    };
    this.modalRef = this.modalService.show(ShopCapacityComponent, { initialState });
  }
  editCardLine(item: IBasketItem) {
    const initialState = {
      item: item, title: 'Item Capacity',
    };
    // debugger;
    if (item.quantity === 0 || item.quantity === null) {
      item.quantity = 1;
    }
    this.modalRef = this.modalService.show(ShopCardInputComponent, { initialState });
  }
  editMemberLine(item: IBasketItem, itemFather) {
   
    const initialState = {
      item: itemFather, title: 'Item Capacity',
    };
    debugger;
    if (item.quantity === 0 || item.quantity === null) {
      item.quantity = item.memberValue;
    }
    this.modalRef = this.modalService.show(ShopMemberInputComponent, {
      initialState, animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false,
      ariaDescribedby: 'my-modal-description',
      ariaLabelledBy: 'my-modal-title',
      class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
    });
    // this.modalRef = this.modalService.show(ShopMemberInputComponent, { initialState });
  }

  isShowSlickSlider: boolean = false;
  public refreshSlickSlider() {
    this.isShowSlickSlider = false;
    setTimeout(x => this.isShowSlickSlider = true);
  }
  fetchAllData() {
    // debugger;
    // if(this.basketService.getCurrentBasket().salesType =="Retail")
    // {

    // }
    // else{
    //   this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', '')

    // }
    this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', '')
  }
  loadItemNew(companyCode, storeId, Keyword, Merchandise, Type, subType?) {
    let customerGrpId = "";
    if (this.basketService.getCurrentBasket()?.customer !== null && this.basketService.getCurrentBasket()?.customer !== undefined) {
      customerGrpId = this.basketService.getCurrentBasket().customer.customerGrpId;
    }
    else {
      customerGrpId = this.authService.getDefaultCustomer().customerGrpId;

    }
    if (customerGrpId === null || customerGrpId === undefined || customerGrpId === '') {
      customerGrpId = '';
    }
    this.itemService.getItemViewList(companyCode, storeId, '', '', '', Keyword, Merchandise, customerGrpId, Type).subscribe((response: any) => {
      // debugger;
      if (subType !== null && subType !== undefined && subType !== "") {
        this.items = response.data;
        this.items = this.items.filter(x => x.customField4 === subType);

      }
      else {
        this.items = response.data;
      }
      this.loadOrder();
      // this.refreshSlickSlider();
    });
  }
  async addItemToBasketX(receivedEntry) {
    
    console.log("aaa",receivedEntry);
    this.searchKey = "";
    this.authService.setOrderLog("Order", "Add Item list to basket", "",  "");
    let basket = this.basketService.getCurrentBasket();
    let isReturn = basket.returnMode;
    let tmpItems = basket.tmpItems;
    let mode = basket.salesType;
    let check = false;
    debugger;
    let canAddItem = true;
    // if(basket.salesType.toLowerCase() ==='return')
    // {
    //   if(this.itemBasketReturn!==null && this.itemBasketReturn!==undefined && this.itemBasketReturn?.length > 0)
    //   {
    //     let item = this.itemBasketReturn.find(x=> x.barcode === value);
    //     let itemInBasket = basket.items.find(x => x.id === item.id && x.uom === item.uom  && x.barcode === item.barcode);
    //     if(itemInBasket!==null && itemInBasket!==undefined)
    //     {
    //       if(item.openQty > itemInBasket.quantity)
    //       {
    //         this.basketService.addItemBasketToBasketNoPromotion(item, 1);
    //         this.txtSearch.nativeElement.focus();
    //         this.txtSearch.nativeElement.value = '';
    //       }
    //       else
    //       {
    //         Swal.fire({
    //           icon: 'warning',
    //           title: 'Item',
    //           text: "Can't add to basket. Item return can't more than sales quantity"
    //         });
    //         this.txtSearch.nativeElement.focus();
    //           this.txtSearch.nativeElement.value = '';
    //       }
    //     }
    //     else
    //     {
    //       this.basketService.addItemBasketToBasketNoPromotion(item, 1);
    //       this.txtSearch.nativeElement.focus();
    //           this.txtSearch.nativeElement.value = '';
    //     }
       
       
        
    //   }
    //   else
    //   {
    //     Swal.fire({
    //       icon: 'warning',
    //       title: 'Item',
    //       text: "Item can't return"
    //     });
    //   }
    
    // }
    // else
    // {
     
      if(basket.items!==null && basket.items!==undefined && basket.items?.length === 0)
      {
        canAddItem = true;
      }
      else
      {
        let item = basket.items[0];
        let typeOfItem = item.customField1?.toLowerCase();
  
        if(typeOfItem === 'pn' || typeOfItem === 'pin' || typeOfItem === 'topup' || typeOfItem === 'tp' || typeOfItem === 'bp')
        {
          canAddItem = false;
          Swal.fire({
            icon: 'warning',
            title: 'Item',
            text: "Can't add item PIN / TOPUP / Bill Payment with Retail item"
          });
        }
       
      }
      if(canAddItem)
      {

       
        if(this.ManualRunPromotion?.toLowerCase() === "true" && basket.isApplyPromotion === true) 
        {
          this.removePromotion();
        }

        if (receivedEntry !== null && receivedEntry != undefined) {
          let lst = [];
         
          // console.log(this.itemBasketReturn);
          receivedEntry.forEach(item => {
            // debugger; 
            if (((mode.toLowerCase() === "ex" || mode.toLowerCase() === "exchange") && isReturn ) || mode.toLowerCase() === "return" ) {
 
              if (this.itemBasketReturn.some(x => x.id === item.itemCode && x.uom === item.uomCode)) {
                check = true;
                
              }
              
            }
            else {
              check = true;
            }
            if (check) {
              // isReturn ? -1 : 1
              let basketItem = null;
              // debugger;
              if (((mode.toLowerCase() === "ex" || mode.toLowerCase() === "exchange") && isReturn )|| mode.toLowerCase() === "return" ) {
                var newArray = []; 
                this.itemBasketReturn.forEach(val => newArray.push(Object.assign({}, val))); 
                basketItem = newArray.find(x => x.id === item.itemCode && x.uom === item.uomCode && x.barcode === item.barCode);
                
                if((mode.toLowerCase() === "ex" || mode.toLowerCase() === "exchange") && isReturn )
                {
                  basketItem.isNegative = true; 
                } 
                basketItem.quantity = 1;
                if(item?.isFixedQty && item.defaultFixedQty !== null && item.defaultFixedQty !== undefined && item.defaultFixedQty !== 0 )
                {
                  basketItem.quantity = item.defaultFixedQty;
                }
                 
              }
             
              else
              {
                let quantityIns =1;
                if(item?.isFixedQty && item.defaultFixedQty !== null && item.defaultFixedQty !== undefined && item.defaultFixedQty !== 0 )
                {
                  quantityIns = item.defaultFixedQty;
                }
                basketItem = this.basketService.mapProductItemtoBasket(item, quantityIns );
              }
              lst.push(basketItem);

            }
            else
            {
              Swal.fire({
                icon: 'warning',
                title: 'Item',
                text: "Can't add item received"
              });
            }
            if ((mode.toLowerCase() === "ex" || mode.toLowerCase() === "exchange") && isReturn && check === false) {
              // this.alertify.warning("Item " + item.itemCode + " is not existed in the order");
              let dataSear = item?.barCode ?? (item?.barcode ?? item?.itemCode) ;
              Swal.fire({
                icon: 'warning',
                title: 'Search item',
                text: "Item " + dataSear + " is not existed in the order"
              });
            }
            check = false;
          });
          lst.forEach(item=>{
            // debugger
            if (item.isBOM) {
              this.bomService.GetByItemCode(this.authService.getCurrentInfor().companyCode, item.productId).subscribe((response: any) => {
                // debugger;
                // this.basketService.addItemtoBasket(item, quantity, response.data);
                if(response.data!==null && response.data !== undefined)
                    {
                      response.data.lines.forEach(itemx=>{
                        const itemBOM: IBasketItem = this.basketService.mapProductBOMItemtoBasket(itemx, item.quantity);
                        item.lineItems.push(itemBOM);
                    });
                    }
              });
            }
          });
          // debugger;
          this.basketService.addItemListBasketToBasket(lst, false);
          await timer(200).pipe(take(1)).toPromise(); 
          let basket = this.basketService.getCurrentBasket();
          
          this.basketService.applyPromotion(basket);
          console.log('itemIn List ', lst);
          if(this.poleDisplay==='true'   && lst?.length > 0)
          {
            // + quantity + " x "  lst[lst.length - 1].price.toString()
            await this.WriteValue(lst[lst.length - 1]?.productName ,"(" + this.storeSelected.currencyCode + ") " +  this.authService.formatCurrentcy(lst[lst.length - 1]?.price) + "", true );
          }
          
          basket = this.basketService.getCurrentBasket();
          if(basket?.items?.length > 0)
          {  
            setTimeout(() => {
              if(lst?.length > 0)
              {
                let itemAdd = lst[lst.length - 1];
                let aX = Object.assign({}, itemAdd);
                let itemX: IBasketItem = new IBasketItem();
                itemX.productName =  aX.productName;
                itemX.price =  aX.price; 
                itemX.id = aX.id;
                itemX.lineNum = aX.lineNum; 
                // debugger;
                // let itemXA =  basket.items.find(x=>x.id=== itemAdd.id && x?.barcode === itemAdd?.barcode);
                // let quantityX = 1;
                // if(itemXA !==null && itemXA!==undefined)
                // {
                //   quantityX = itemXA.quantity??1;
                // } 
                itemX.quantity = 1;
                itemX.type = "Add";
                basket.lastedItem = itemX;
                // await this.WriteValue(lst[lst.length - 1]?.productName ,"(" + this.storeSelected.currencyCode + ") " +  this.authService.formatCurrentcy(lst[lst.length - 1]?.price) + "", true );
              }
            }, 100);
            setTimeout(() => {
              this.itemSelectedIndex = basket?.items?.length - 1;
              // const index = basket?.items.findIndex((i) => i.id === item.itemCode && i.uom === item.uomCode   && i.barcode === item.barCode 
              // && i?.custom1 === item?.custom1   
              // && ( (i.promotionIsPromo !== '1' && i.promotionType !=='Fixed Quantity') ||  (i.promotionIsPromo === '1' && i.isVoucher && i.isVoucher === item.isVoucher ))
              // );
              // if(index!=-1)
              // {
              //   this.itemSelectedIndex = index;
              // }
             
              this.scrollToBottomList();
            }, 200)
          }
         
          this.modalRef.hide();
        }
      }
      else
      {
        Swal.fire({
          icon: 'warning',
          title: 'Item',
          text: "Can't add item"
        });
      }
    // }
  
  }
  selectSerial(item: IBasketItem) {
    debugger; 
    const initialState = {
      item: item, title: 'Item Serial',
    };
    this.authService.setOrderLog("Order", "Select Serial", "",  "");
    if(this.showSerialExpand===false)
    {
        this.modalRef = this.modalService.show(ShopItemSerialComponent, { initialState,
          animated: true,
          keyboard: true,
          backdrop: true,
          ignoreBackdropClick: true, }
        
        );
        setTimeout(() => {
          this.basketService.changeBasketResponseStatus(true);
        }, 100);
    }
    else
    {
      this.itemSerialSelected = item;
      this.showItemSerialComponent = true;
      this.showTools = false;
       this.commonService.changeShortcuts([], true);
    }
   
  }
  selectMember(itembasket) {
    // let itembasket = this.basketService.mapProductItemtoBasket(item, quantity);
    // itembasket.memberValue = quantity;
    const initialState = {
      item: itembasket, title: 'Item Member',

    };
    this.modalRef = this.modalService.show(ShopMemberInputComponent, {
      initialState, animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false,
      ariaDescribedby: 'my-modal-description',
      ariaLabelledBy: 'my-modal-title',
      class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
    });
  }
  SetSerialItem(serialList: MItemSerial[]) {
    // debugger;
    console.log(serialList);
    //  this.alertify.warning("" +serialItem.serialNum);
  }
  showAssignStaff(item)
  {
    const initialState = {
     item: item, 
     AssignType : this.AssignType
    };
    this.modalService.show(ShopToolsAssignStaffComponent, {
      initialState, 
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      ariaDescribedby: 'my-modal-description',
      ariaLabelledBy: 'my-modal-title',
      class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
    });
  }
  showFilter(template: TemplateRef<any>) {
    // debugger;
    // console.log(this.searchKey);
  
      this.authService.setOrderLog("Order", "Search Item Click", "",  "");
      let checkAction =  this.authService.checkRole(this.functionId , 'btnSearchItem', 'V');
      let checkApprovalRequire =  this.authService.checkRole(this.functionId , 'btnSearchItem', 'A');
      if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
      {
        checkAction = false;
      }
      if(checkAction)
      {
        setTimeout(() => { 
          this.commonService.changeShortcuts([], true);
          this.modalRef = this.modalService.show(template, {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: true,
            ariaDescribedby: 'my-modal-description',
            ariaLabelledBy: 'my-modal-title',
            class: 'modal-dialog modal-dialog-centered modal-sm'
          });
          this.modalRef.onHide.subscribe((reason: string) => {
            this.loadShortcut();
            this.searchKey = "";
          });
        });
      }
      else
      {
        this.scannerProfile.off();
        // const initialState = {
        //   title: 'Filter - Permission denied',
        // };
        let permissionModel= { functionId: this.functionId, functionName: "Item Filter", controlId: 'btnSearchItem', permission: 'V'};
        const initialState = {
            title:  'Item Filter - Permission denied', permissionModel : permissionModel
        };
        let modalApprovalRef = this.modalService.show(ShopApprovalInputComponent, {
          initialState, 
          animated: true,
          keyboard: true,
          backdrop: true,
          ignoreBackdropClick: true,
          ariaDescribedby: 'my-modal-description',
          ariaLabelledBy: 'my-modal-title',
          class: 'modal-dialog modal-xl medium-center-modal'
          // class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
        });
        // let searchPopup = false;
        modalApprovalRef.content.outEvent.subscribe((received: any) => {
          if(received.isClose)
          {
            modalApprovalRef.hide();
            setTimeout(() => {
              this.commonService.TempShortcuts$.subscribe((data)=>{
                this.commonService.changeShortcuts(data, true); 
                console.log('Old Shorcut' , data );
              });
            }, 100);
            
          }
          else
          {

              this.authService.setOrderLog("Order", "Approve Search Item", "",  " by " + received.user);
              setTimeout(() => { 
                this.modalRef = this.modalService.show(template, {
                  animated: true,
                  keyboard: true,
                  backdrop: true,
                  ignoreBackdropClick: true,
                  ariaDescribedby: 'my-modal-description',
                  ariaLabelledBy: 'my-modal-title',
                  class: 'modal-dialog modal-dialog-centered modal-sm'
                });
                this.modalRef.onHide.subscribe((reason: string) => {
                  this.loadShortcut();
                  this.searchKey = "";
                });
              });
              modalApprovalRef.hide();



            // let code = (received.customCode ?? '');
            // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, code, this.functionId, 'btnSearchItem', 'V' ).subscribe((response: any)=>{
            //   if (response.success) {
            //     let note = (received.note ?? '');
            //     if (note !== null && note !== undefined && note !== '') {
            //       this.basketService.changeNote(note).subscribe((response) => {
    
            //       });
            //       this.alertify.success('Set note successfully completed.');
            //     }

                

            //   }
            //   else {
            //       Swal.fire({
            //         icon: 'warning',
            //         title: 'Approve Search Item ',
            //         text: response.message
            //       });
            //   }
            // })
          
          }
        
        });
        modalApprovalRef.onHide.subscribe((reason: string) => {
         this.initScanner();
          console.log(reason);
          if(reason==='esc')
          {
            this.commonService.TempShortcuts$.subscribe((data)=>{
              this.commonService.changeShortcuts(data, true);
              console.log('Old Shorcut' , data );
            });
          }
         
        })
      }
     
    // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().username, this.authService.getCurrentInfor().password, this.functionId, 'btnSearchItem', 'V' ).subscribe((response: any)=>{
    //   debugger;
    //   if (response.success) {
       
    //   }
    //   else {
       
         
    //   }
    // })
 
  }
  // loadItemList()
  // {
  //   let com= this.storeSelected.companyCode;
  //   let store= this.storeSelected.storeId;
  //    
  // }
  @ViewChild('input') input: ElementRef;  

  shortCutList : any=[];
  shortcuts: ShortcutInput[] = [] ;
  // @ViewChild(KeyboardShortcutsComponent) private keyboard: KeyboardShortcutsComponent; 
  // @ViewChild('itemTemplate',{static: false}) itemTemplate: any; 
  functionPage = 'Adm_ShopOrder';
  @ViewChild('template') template: TemplateRef<any>;
  @ViewChild('itemTemplate') itemTemplate: TemplateRef<any>;
  @ViewChild(DxSelectBoxComponent)  ddlEmployee: DxSelectBoxComponent;  
  itemSelectedIndex = -1;
  mainShortcuts$: Observable<ShortcutInput[]>;
  @ViewChildren('txtQuantity') txtQuantity: QueryList<ElementRef>;
  setFocus(index) {
    setTimeout(() => {
      debugger;
      if(this.txtQuantity.toArray()[index]!==null && this.txtQuantity.toArray()[index]!==undefined)
      { 
        if(this.txtQuantity.toArray()[index].nativeElement !== null   && this.txtQuantity.toArray()[index].nativeElement !==undefined)
        {
          // let value= this.inputs.toArray()[index].nativeElement.focus().val();
          // debugger;
          this.txtQuantity.toArray()[index].nativeElement.focus();//.val('').val(this.refNumInputs.toArray()[index]);  ;
          this.itemSelectedIndex = index;
        } 
      }
      else
      {
         
      }
     
    }, 4);
    // console.log('index focus' + index)
  }
  onF1Key()
  {
    
  }
  loadShortcut()
  {
    if(this.mainShortcuts$!==null && this.mainShortcuts$!== undefined )
    {
      this.mainShortcuts$.forEach((data)=>{
        this.shortcuts= data;
        if(data===null && data===undefined && data?.length === 0)
        {
          this.shortcuts = [];
        }  
      })
      // this.shortcuts= this.commonService.getMainShortcutKey();
       // this.commonService.getCurrentShortcutKey();
      this.shortCutList =[];
      this.shortcutService.getByFunction(this.authService.getCurrentInfor().companyCode , this.functionPage).subscribe((response: any) =>{
        // debugger;
        
        this.shortCutList = response.data;
        if(this.shortCutList!==null && this.shortCutList!==undefined && this.shortCutList.length > 0)
        { 
          this.shortCutList.forEach(shortcut => {
            let combokey = '';
            if(shortcut.key1==='ctrl')
            {
              shortcut.key1 = 'cmd' ;
            }
            if(shortcut.key1!==undefined && shortcut.key1!==null && shortcut.key1!=='' )
            {
              combokey += shortcut.key1;
            }
            if(shortcut.key2!==undefined && shortcut.key2!==null && shortcut.key2!=='' )
            {
              combokey += " + " +  shortcut.key2;
            }
            if(shortcut.key3!==undefined && shortcut.key3!==null && shortcut.key3!=='' )
            {
              combokey += " + " +  shortcut.key3;
            }
            if(shortcut.key4!==undefined && shortcut.key4!==null && shortcut.key4!=='' )
            {
              combokey += " + " +  shortcut.key4;
            }
            if(shortcut.key5!==undefined && shortcut.key5!==null && shortcut.key5!=='' )
            {
              combokey += " + " +  shortcut.key5;
            }
            // debugger;
            // this.shortcuts = this.shortcuts.filter(x=>x.key !== combokey);
            this.shortcuts.push(
              {
                key: [combokey],
                label: shortcut.name,
                description: shortcut.description,
                allowIn: [AllowIn.Textarea, AllowIn.Input],  
                command: (e) => { 
                  if(shortcut.custom1 === 'Search')
                  { 
                    // this.filterBy(this.filter.nativeElement.value);
                    this.showFilter(this.itemTemplate);
                  }
                  if(shortcut.custom1 === 'Invoice')
                  {
                    this.openInvoiceModal();
                  }
                  if(shortcut.custom1 === 'NewOrder')
                  {
                    debugger;
                    this.createNewOrder();
                  }
                  if(shortcut.custom1 === 'Employee')
                  {
                    this.ddlEmployee.instance.focus();
                    this.ddlEmployee.instance.open();
                  }
                  if(shortcut.custom1 === 'Payment')
                  {
                    if(this.basketService.getIsCreateOrder()=== false)
                    {
                      let basket = this.basketService.getCurrentBasket();
                      if(basket.omsSource!=="" && basket.omsSource!==null && basket.omsSource!==undefined )
                      {
                        if(basket.omsId!=="" && basket.omsId!==null && basket.omsId!== undefined)
                        {
                          Swal.fire({
                            title: 'Are you sure?',
                            text: 'Do you want add order reference id ' + basket.omsId,
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: 'Yes',
                            cancelButtonText: 'No'
                          }).then((result) => {
                            if (result.value) {
                              // debugger;
                              // this.newOrder();
                              this.addOrder(true);
                            }
                          });
                        }
                        else
                        {
                          Swal.fire({
                            icon: 'warning',
                            title: 'OMS reference id',
                            text: 'Please input OMS reference id'
                          })
                        }
                       
                       
                      }
                      else  
                      {
                        this.openModal(this.template);
                      }
                    } 
                   
                  
                  }
                  
                  // if(shortcut.custom1 === 'Display')
                  // {
                  //   this.changeDisplayMode();
                  // }
                  // if(shortcut.custom1 === 'NextMerchandise')
                  // { 
                  //   debugger;
                  //   this.slickFilterModal.slickNext();
                  // }
                  // if(shortcut.custom1 === 'PreMerchandise')
                  // {
                  //   this.slickFilterModal.slickPrev();
                  // }
                
                },
                preventDefault: true
              }
            )
          
            // if(shortcut.custom1 === 'Search' || shortcut.custom1 === 'Display' || shortcut.custom1 === 'NextMerchandise' || shortcut.custom1 === 'PreMerchandise')
            // {
              
               
            //   } ;
          // debugger;
          // console.log(this.shortCutList);
          })
         
        }
        // debugger;
          // Get item in grid
          for(let i= 1; i<= 10; i++)
          {
            //  let combokey = "alt + " + i;
            let label="Row " + i;
            this.shortcuts = this.shortcuts.filter(x=>x.label !== label);
            this.shortcuts.push(
              {
                key: ["alt + " + i],
                label: "Row " + i,
                description: "Row " + i,
                allowIn: [AllowIn.Textarea, AllowIn.Input],  
                command: (e) => {
                  let items= this.basketService.getCurrentBasket().items;  
                  if(items.length >= i)
                  {
                    this.itemSelectedIndex = i - 1;
                    // this.selectRow(items[i - 1]);
                    // this.scrollToBottomList();
                    setTimeout(() => {
                      
                      this.scrollToBottomList(this.itemSelectedIndex);
                    }, 200)
                  }
                  // this.setFocus(i-1);
                },
                preventDefault: true
              }
            )
          }
          
          this.shortcuts.push(
            {
              key: ["cmd + b"],
              label: "Focus Customer Input",
              description: "Focus Customer Input",
              allowIn: [AllowIn.Textarea, AllowIn.Input],  
              command: (e) => {
                //  debugger;
                // this.txtCustomer.nativeElement.value = '';
                // this.txtCustomer.nativeElement.focus();
                // this.txtCustomer.instance.focus();
                  if(this.inputOMSMode)
                {
                  setTimeout(() => {
                    this.txtOMSId.instance.focus();
                  })
                 
                }
                else
                {
                  setTimeout(() => {
                    this.txtCustomer.instance.focus();
                  })
                }
              },
              preventDefault: true
            },
            {
              key: ["cmd + s"],
              label: "Focus Customer Input",
              description: "Focus Customer Input",
              allowIn: [AllowIn.Textarea, AllowIn.Input],  
              command: (e) => {
                  
                  setTimeout(() => {
                    this.FocusSearch();
                  })
                
              },
              preventDefault: true
            },
            {
              key: ["alt + w"],
              label: "Change to Walkin",
              description: "Change to Walkin",
              allowIn: [AllowIn.Textarea, AllowIn.Input],  
              command: (e) => {
                this.changeToWalkin();
              },
              preventDefault: true
            },
            {
              key: ["alt + x"],
              label: "Discount Amount",
              description: "Discount Amount",
              allowIn: [AllowIn.Textarea, AllowIn.Input],  
              command: (e) => {
              
                this.toggleTotalDiscountOptions();
              },
              preventDefault: true
            },
            {
              key: ["alt + o"],
              label: "Food panda input",
              description: "Food panda input",
              allowIn: [AllowIn.Textarea, AllowIn.Input],  
              command: (e) => {
                this.switchShopMode();
                // this.inputOMSMode=!this.inputOMSMode;
                // if(this.inputOMSMode)
                // {
                //   setTimeout(() => {
                //     this.txtOMSId.instance.focus();
                //   })
                 
                // }
                // else
                // {
                //   setTimeout(() => {
                //     this.txtCustomer.instance.focus();
                //   })
                // }
                // this.toggleTotalDiscountOptions();
              },
              preventDefault: true
            },
            {
              key: ["alt + r"],
              label: "Return / Exchange Mode",
              description: "Return / Exchange Mode",
              allowIn: [AllowIn.Textarea, AllowIn.Input],  
              command: (e) => {
                let aa= !this.basketService.getCurrentBasket().returnMode;
                debugger;
                this.switchMode(aa);
                // this.switchValueChanged();
              },
              preventDefault: true
            },
            {
              key: ["alt + q"],
              label: "Focus item quantity",
              description: "Focus item quantity",
              allowIn: [AllowIn.Textarea, AllowIn.Input],  
              command: (e) => {
                debugger;
              
                if(this.itemSelectedIndex!==null && this.itemSelectedIndex!==undefined && this.itemSelectedIndex!==-1 )
                {
                  // let items= this.basketService.getCurrentBasket().items;  
                  // if(items.length >= this.itemSelectedIndex)
                  // {
                  //   // this.itemSelectedIndex = i - 1;
                  //   this.selectRow(items[this.itemSelectedIndex ]);
                  // }
  
                  let xxx = this.itemSelectedIndex;
  
                  this.itemSelectedRow = '';
                  this.itemSelectedIndex=-1;
                 
                  this.setFocus(xxx);
  
                
                  // debugger;
                }
                // this.toggleTotalDiscountOptions();
              },
              preventDefault: true
            },
            {
              key: ["alt + i"],
              label: "Detail item",
              description: "Detail item",
              allowIn: [AllowIn.Textarea, AllowIn.Input],  
              command: (e) => {
                debugger;
              
                if(this.itemSelectedIndex!==null && this.itemSelectedIndex!==undefined && this.itemSelectedIndex!==-1 )
                {
                  let items= this.basketService.getCurrentBasket().items;  
                  if(items.length >= this.itemSelectedIndex)
                  {
                    // this.itemSelectedIndex = i - 1;
                    this.selectRow(this.itemSelectedIndex, items[this.itemSelectedIndex ]);
                    // this.onBlurMethod(items[this.itemSelectedIndex ]);
                  }
                  
                  // let xxx = this.itemSelectedIndex;
  
                  // this.itemSelectedRow = '';
                  // this.itemSelectedIndex=-1;
                 
                  // this.setFocus(xxx);
  
                
                  // debugger;
                }
                // this.toggleTotalDiscountOptions();
              },
              preventDefault: true
            },
            {
              key: ["alt + m"],
              label: "Remark Item",
              description: "Remark Item",
              allowIn: [AllowIn.Textarea, AllowIn.Input],  
              command: (e) => {
                debugger;
                // this.txtCustomer.nativeElement.value = '';
                // this.txtCustomer.nativeElement.focus();
                if(this.itemSelectedIndex!==null && this.itemSelectedIndex!==undefined && this.itemSelectedIndex!==-1 )
                {
                  let note = this.txtNote.toArray()[this.itemSelectedIndex];
                  if(note!==null && note !==undefined)
                  { 
                    note.instance.focus();
                  }
                }
              },
              preventDefault: true
            },
            //  {
            //   key: ["cmd + p"],
            //   label: "Open payment",
            //   description: "Open payment",
            //   command: (e) => {
            //      this.openModal(this.template); 
            //   },
            //   preventDefault: true
            // },
            {
              key: ["cmd + i"],
              label: "Open Serial",
              description: "Open Serial",
              allowIn: [AllowIn.Textarea, AllowIn.Input],  
              command: (e) => {
                debugger;
                // this.txtCustomer.nativeElement.value = '';
                // this.txtCustomer.nativeElement.focus();
                if(this.itemSelectedIndex!==null && this.itemSelectedIndex!==undefined && this.itemSelectedIndex!==-1 )
                {
                  let items= this.basketService.getCurrentBasket().items;  
                  // this.itemSelectedIndex = i - 1;
                  // this.selectRow(items[i - 1]);
                  let item = items[this.itemSelectedIndex];
                  if(item.isSerial || item.isVoucher )
                  {
                    this.selectSerial(item);
                  }
                  
                  // let note = this.txtNote.toArray()[this.itemSelectedIndex];
                  // if(note!==null && note !==undefined)
                  // { 
                  //   note.instance.focus();
                  // }
                }
              },
              preventDefault: true
            },
          
            {
              key: ["backspace"],
              label: "Back",
              description: "Back",
              command: (e) => {
                this.itemSelectedRow = '';
                this.itemSelectedIndex=-1;
                 
                debugger;
              },
              preventDefault: true
            },
            {
              key: ["del"],
              label: "Delete",
              description: "Delete",
              allowIn: [AllowIn.Textarea, AllowIn.Input],  
              command: (e) => {
                //  debugger;
                if(this.itemSelectedIndex!==-1)
                {
                  let items= this.basketService.getCurrentBasket().items; 
                  let item  = items[this.itemSelectedIndex];
                  if(item!==null && item!==undefined && item.promotionIsPromo !== '1')
                  {
                    this.remove(this.itemSelectedIndex, item); 
                  }
                
                }
                
              },
              preventDefault: true
            },
            {
              key: ["down"],
              label: "Down",
              description: "Down",
              allowIn: [AllowIn.Textarea, AllowIn.Input],  
              command: (e) => {
                debugger;
                if(this.itemSelectedIndex!==-1)
                {
                  let items= this.basketService.getCurrentBasket().items; 
                  let row = this.itemSelectedIndex + 1;
                  if(row > items.length - 1)
                  {
                    row = 0;
                  }
                  this.itemSelectedIndex = row;
                  this.itemSelectedRow = '';
                  setTimeout(() => {
                    const scrollTo = document.querySelector(".kselected");
                    if (scrollTo) {
                      scrollTo.scrollIntoView();
                    }
                  })
                  // this.selectRow(items[row]);
                }
                
                // this.selectRow(items[1]);
              },
              preventDefault: true
            },
            {
              key: ["up"],
              label: "Up",
              description: "Up",
              allowIn: [AllowIn.Textarea, AllowIn.Input],  
              command: (e) => {
                debugger;
                if(this.itemSelectedIndex!==-1)
                {
                  let items= this.basketService.getCurrentBasket().items; 
                  let row = this.itemSelectedIndex - 1;
                  if(row <= 0)
                  {
                    row=0;
                  }
                  this.itemSelectedIndex = row;
                  this.itemSelectedRow = '';
  
                  setTimeout(() => {
                    const scrollTo = document.querySelector(".kselected");
                    if (scrollTo) {
                      scrollTo.scrollIntoView();
                    }
                  })
                  // this.selectRow(items[row]);
                }
                
                // this.selectRow(items[1]);
              },
              preventDefault: true
            }
          )
          //  debugger;
          // console.log('this.shortcuts Already', this.shortcuts);
          this.commonService.changeShortcuts(this.shortcuts, true);
          this.commonService.changeTempShortcuts(this.shortcuts);
      })
    }
   
 
  }
  loadItemPagedList(currenpage, itemper) {

    this.itemService.GetItemWPriceList(1, 50, this.userParams)
      .subscribe((res: PaginatedResult<ItemViewModel[]>) => {
        // debugger;
        this.items = res.result;
        this.pagination = res.pagination;
        this.refreshSlickSlider();
      }, error => {
        this.alertify.error(error);
        
      });
  }
  orderNo = "";
  redirectTo(uri: string) {
    this.routeNav.navigate([uri]).then(() => {
      // window.location.reload();
    });
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>


  }
  clearOrder() {
    debugger;
    this.basketService.changeIsCreateOrder(false);
     this.authService.setOrderLog("Order", "Clear Order", "",  "");
    const basket = this.basketService.getCurrentBasket();

    this.basketService.changeBasketResponseStatus(true);

    let currentType = basket.salesType;
    this.basketService.deleteBasket(basket).subscribe(() => {
      // this.addNewOrder()
      // this.route.navigate(['/shop/sales-type']);
     
    });
    this.basketService.getNewOrderCode(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe(data => {
      // console.log(data);
      this.orderNo = data;
    });
    let cus = this.authService.getDefaultCustomer();
   
    if (cus !== null && cus !== undefined) {
      setTimeout(() => {
        this.basketService.changeCustomer(cus, "Retail").subscribe(() => {

        });
      }, 2);
    }
    else {
      this.customerService.getItem(this.storeSelected.companyCode, this.storeSelected.defaultCusId).subscribe((response: any) => {
        debugger;
        this.basketService.changeCustomer(response.data, "Retail").subscribe(() => {

        });

      });
    }

  }

  @ViewChild('PrintTemplate')
  private PrintTemplateTpl: TemplateRef<any>;
  printTemplate() {
    this.printerService.printAngular(this.PrintTemplateTpl);
  }
  
  outPutModel: Order;
  discountLine = 0;
  bonusLine = 0;
  interval = null;  
  // triggerAlert(amount, message){
  //   setTimeout(()=>{
  //     Swal.fire({
  //       icon: 'info',
  //       title: 'Amount Change: ' + this.authService.formatCurrentcy(amount),
  //       text: 'Order Id: ' + message,
  //       allowEscapeKey : false,
  //       allowOutsideClick: false,
  //       showConfirmButton:true,
  //       confirmButtonText: 'Ok',
  //       focusConfirm:true
  //     }).then(()=>{
  //       this.getBill(message);
  //     }) 
  //   },10)
 
  // }
 
  getBill(transId, ChangeAmount ) {
    let loopNum =0;
    let waitingAPi = true;
    let basket = this.basketService.getCurrentBasket();
    this.commonService.changePrinted(false);
    debugger;
    // this.interval = setInterval(()=>{
    //   if(loopNum < 3 && waitingAPi===true)
    //   {  
      // console.log('respone 3' , this.basketService.getBasketResponseStatus());
      this.basketService.changeIsCreateOrder(false);
      if(this.printByApp==="true")
      {
        this.billService.getBill(transId, this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any) => {
          loopNum++;
          this.basketService.changeBasketResponseStatus(true);
          // console.log("getBill");
          if (response.success) {
            response.data.totalQty = 0;
            // console.log('response.data print', response.data);
            response.data.lines.forEach(line => {
              if(line.discountType !== "Bonus Amount"){
                this.discountLine += line.discountAmt === null ? 0 : line.discountAmt;
                this.order.discountLine = this.discountLine;
                // console.log("this.discountLine", this.discountLine);
              }else{
                this.bonusLine += line.discountAmt === null ? 0 : line.discountAmt;
                this.order.bonusLine = this.bonusLine;
                // console.log("this.bonusLine", this.bonusLine);
              }
              response.data.totalQty += line.quantity;
            
            }); 
            
            // console.log("this.outPutModel", this.outPutModel);
           
            if(response.data!==null && response.data!==undefined)
            {
              // console.log('this.outPutModel', this.outPutModel);
              waitingAPi = false;
              // clearInterval(this.interval);
            
              if(basket.salesType?.toLowerCase() === 'return' 
                || basket.salesType?.toLowerCase() === 'ex' 
                || basket.salesType?.toLowerCase() === 'exchange')
                {
                 
                  // setTimeout(() => {
                  //   this.outPutModel = response.data;
                  //   // window.print(); 
                  // }, 200);
                
                  setTimeout(() => {
                    this.outPutModel = response.data;
                    // window.print(); 
                  }, 100);
                  Swal.fire({
                    title: 'This is Return / Exchange Bill?',
                    text: 'Do you want to have a copy',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No'
                  }).then((result) => {
                    if (result.value) {
                      debugger;
                      setTimeout(() => {
                        this.outPutModel = null;
                        
                      }, 10);
                      setTimeout(() => {
                        // this.outPutModel = null;
                        this.outPutModel = response.data; 
                        this.typeOrder = "Receipt re-print";
                        setTimeout(() => { 
                          this.authService.deleteOrderLog();
                          this.newOrder();
                        }, 100);
                      }, 50);
                    }
                    else
                    {
                      if(ChangeAmount!==null && ChangeAmount!==undefined && ChangeAmount !== 0)
                      {
                         
                        if(this.poleDisplay==='true'   )
                        {
                          if(ChangeAmount !== 0)
                          {
                            
                            this.WriteValue("CHANGE AMOUNT", "(" + this.storeSelected.currencyCode + ") " + this.authService.formatCurrentcy(ChangeAmount), false);
                          }
                         
                        }
                        setTimeout(()=>{
                          Swal.fire({
                            icon: 'info',
                            title: 'Amount Change: ' + this.authService.formatCurrentcy(ChangeAmount),
                            text: 'Order Id: ' + transId,
                            allowEscapeKey : false,
                            allowOutsideClick: false,
                            showConfirmButton:true,
                            confirmButtonText: 'Ok',
                            focusConfirm:true
                          }).then(()=>{
                            this.authService.deleteOrderLog();
                            this.newOrder();
                          }) 
                        },10)
                      }
                      else
                      {
                        this.authService.deleteOrderLog();
                        this.newOrder();
                      }
                      // setTimeout(() => {
                      //   this.outPutModel = response.data;
                      //   // window.print(); 
                      // }, 200);
                     
                    }
                  });
                }
                else
                {
                  // setTimeout(() => {
                  //   this.authService.deleteOrderLog();
                  //   this.newOrder();
                  //   this.outPutModel = response.data;
                  //   // window.print(); 
                  // }, 70);

                  setTimeout(() => { 
                    console.log("Print Data Infor",  response.data)
                    if(ChangeAmount!==null && ChangeAmount!==undefined && ChangeAmount !== 0)
                    {
                      setTimeout(() => {
                        this.outPutModel = null; 
                        this.authService.deleteOrderLog();
                        this.newOrder();  
                      });
                      setTimeout(() => {
                        
                        this.outPutModel = response.data;
                        // window.print(); 
                      },10);    
                      setTimeout(()=>{
                        Swal.fire({
                          icon: 'info',
                          title: 'Amount Change: ' + this.authService.formatCurrentcy(ChangeAmount),
                          text: 'Order Id: ' + transId,
                          allowEscapeKey : false,
                          allowOutsideClick: false,
                          showConfirmButton:true,
                          confirmButtonText: 'Ok',
                          focusConfirm:true
                        }).then(()=>{ 
                          this.checkReloadBillManual();
                          // this.authService.deleteOrderLog();
                          // this.newOrder();  
                        }) 
                      },120)

                      if(this.poleDisplay==='true')
                      { 
                          this.WriteValue("CHANGE AMOUNT", "(" + this.storeSelected.currencyCode + ") " + this.authService.formatCurrentcy(ChangeAmount), false);
                      }  
                    }
                    else
                    {

                      this.authService.deleteOrderLog();
                      this.newOrder();
                      setTimeout(() => {
                        this.outPutModel = response.data;
                        // window.print(); 
                      },100);
                      // this.checkReloadBill();
                    }
                    
                  }, 100);

                }
              
               
              // setTimeout(() => {
              
              //   this.newOrder();
              // }, 600);
            }
            else{
              Swal.fire({
                icon: 'warning',
                title: 'Print bill',
                text: "Can't get data of order. Please manual print"
              }).then(() => {
                this.routeNav.navigate(["shop/bills/print", transId, this.storeSelected.companyCode, this.storeSelected.storeId]).then(() => {
                  window.location.reload();
                }); 
              });
            }
            // debugger;
          
            // this.printTemplate();
            
           
            // this.outPutModel = response.data;
           
            // setTimeout(() => {
            //   window.print();
            // }, 1000);
    
            // this.newOrder()
          }
          else {
            this.alertify.warning(response.message);
          }
          
        })
      }
      else
      {
        this.basketService.changeBasketResponseStatus(true);
        let reprint = false;
        if(basket.salesType?.toLowerCase() === 'return' 
        || basket.salesType?.toLowerCase() === 'ex' 
        || basket.salesType?.toLowerCase() === 'exchange')
        {
          reprint = true;
        }
        setTimeout(() => {
          if(ChangeAmount!==null && ChangeAmount!==undefined && ChangeAmount !== 0)
          {
            setTimeout(()=>{
              if(this.poleDisplay==='true'   )
              {
                if(ChangeAmount !== 0)
                {
                  
                  this.WriteValue("CHANGE AMOUNT", "(" + this.storeSelected.currencyCode + ") " + this.authService.formatCurrentcy(ChangeAmount), false);
                }
               
              }

              Swal.fire({
                icon: 'info',
                title: 'Amount Change: ' + this.authService.formatCurrentcy(ChangeAmount),
                text: 'Order Id: ' + transId,
                allowEscapeKey : false,
                allowOutsideClick: false,
                showConfirmButton:true,
                confirmButtonText: 'Ok',
                focusConfirm:true
              }).then(()=>{
                this.authService.deleteOrderLog();
                this.newOrder();
              }) 
            },10)
          }
          else
          {
            this.authService.deleteOrderLog();
            this.newOrder();
          } 
          // this.newOrder();
        }, 5);
       
        let poleValue = this.getPole();
        let size = "";
        if(poleValue!==null && poleValue!==undefined)
        {
          if(poleValue?.printSize!==null && poleValue?.printSize!==undefined)
          {
            size = poleValue?.printSize;
          }
        }
        this.billService.PrintReceipt( this.storeSelected.companyCode, this.storeSelected.storeId, transId, 'Receipt', size, poleValue.printName ).subscribe((response: any) => {
          
          if (response.success) {
            if(reprint)
            {
              Swal.fire({
                title: 'This is Return / Exchange Bill?',
                text: 'Do you want to have a copy',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
              }).then((result) => {
                if (result.value) {
                  this.billService.PrintReceipt( this.storeSelected.companyCode, this.storeSelected.storeId, transId, 'Receipt copy', size, poleValue.printName ).subscribe((response: any) => {
                    if (response.success) {
                    }
                    else
                    {
                      this.alertify.warning(response.message);
                    }
                  })
                }
               
              });
            }
            
          }
          else {
            this.alertify.warning(response.message);
          }
          
        })
      }
       
      // }
    // }, 600);
    // var handleinterval = interval(500).subscribe(x => {
     
      
    //   // else
    //   // {
    //   //   this.waitingAPi= false;
    //   //   this.confirmResult =false;
    //   //   payment.refNum ="";
    //   //   payment.customF1 = "";
    //   //   let basket = this.basketService.getCurrentBasket();
    //   //   this.basketService.addOrUpdatePayment(basket.payments, payment, payment.paymentTotal);
    //   //   this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
        
    //   // }
    // }); 
    // if(loopNum > 3 && waitingAPi)
    // {
    //   // this.alertify.warning("Can't get data of order. Please manual print");
    //   clearInterval(this.interval);
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Print bill',
    //     text: "Can't get data of order. Please manual print"
    //   }).then(() => {
    //     this.routeNav.navigate(["shop/bills/print", transId, this.storeSelected.companyCode, this.storeSelected.storeId]).then(() => {
    //       window.location.reload();
    //     }); 
    //   });
     
     
     
    // }
 
  }
  checkReloadBillManual()
  {
    
    let isPrinted =   this.commonService.getPrinted(); 
    if(isPrinted=== true)
    {
      let billCount = this.commonService.getCurrentBillCount();
      if (billCount >= this.BillReload &&  this.BillReload!== 0) {
        this.commonService.changeBillCount(0);
        window.location.reload();
      }
    }
   
  }
  checkReloadBill()
  {
    
  
    this.commonService.Printed$.subscribe((data: any)=>{
      debugger;
      let change = this.outPutModel?.amountChange ?? 0;
      console.log("change Amt", change);
      if(data === true && change!==null && change!==undefined && change!==0)
      {
        let billCount = this.commonService.getCurrentBillCount();
        if (billCount >= this.BillReload &&  this.BillReload!== 0) {
          this.commonService.changeBillCount(0);
          window.location.reload();
        }
      }
    })
     
    
  }
  checkPermissionOrder(type) {
    let FunctionId = "";
    let FunctioNName = "";
    if(type.toLowerCase() ==="ex")
    {
      FunctionId = "Spc_ExchangeOrder";
      FunctioNName = "Exchange";
    }
    if(type.toLowerCase()==="return")
    {
      FunctionId = "Spc_ReturnOrder";
      FunctioNName = "Return";
    }
    if(type.toLowerCase()==="receive")
    {
      FunctionId = "Spc_ReceiveOrder";
      FunctioNName = "Receive";
    }
    
    let checkAction =  this.authService.checkRole(FunctionId , '', 'I' );
    let checkApprovalRequire =  this.authService.checkRole(FunctionId , '', 'A' );
    if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
    {
      checkAction = false;
    }
    if(checkAction)
    {
       this.orderAction(type, '');
    }
    else
    {
      // const initialState = {
      //   title: FunctioNName +' Permission denied',
      //   };
        let permissionModel= { functionId: FunctionId, functionName: FunctioNName, controlId: '', permission: 'I'};
        const initialState = {
            title: FunctioNName +' Permission denied', permissionModel : permissionModel
        };
        let modalApprovalRef = this.modalService.show(ShopApprovalInputComponent, {
          initialState, 
          animated: true,
          keyboard: true,
          backdrop: true,
          ignoreBackdropClick: true,
          ariaDescribedby: 'my-modal-description',
          ariaLabelledBy: 'my-modal-title',
          class: 'modal-dialog modal-xl medium-center-modal'
          // class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
        });
        modalApprovalRef.content.outEvent.subscribe((received: any) => {
          if(received.isClose)
          {
            modalApprovalRef.hide();
          }
          else
          {
            debugger;
            this.authService.setOrderLog("Order", FunctioNName, "", "Approve by " + received.user);
            this.orderAction(type, received.user); 
            modalApprovalRef.hide();

            // let modelLogin = {
            //   username: received.user, password: received.pass
            // }
            // let code = (received.customCode ?? '');
            // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, code, FunctionId, '', 'I' ).subscribe((response: any)=>{
             
            //   if (response.success) {
            //     let note = (received.note ?? '');
            //     if (note !== null && note !== undefined && note !== '') {
            //       this.basketService.changeNote(note).subscribe((response) => {
    
            //       });
            //       this.alertify.success('Set note successfully completed.');
            //     }

            //   }
            //   else {
            //       Swal.fire({
            //         icon: 'warning',
            //         title: 'Return Exchange Order',
            //         text: response.message
            //       });
            //   }
            // })
          }
         
        });
        modalApprovalRef.onHide.subscribe((reason: string) => {
          this.commonService.TempShortcuts$.subscribe((data)=>{
            this.commonService.changeShortcuts(data, true);
            console.log('Old Shorcut' , data );
          });
        })
    }
    
    
  }
  addOrder(value) {
   
    if (value === true) 
    {
       
        if (this.orderId === "" || this.orderId === null || this.orderId === undefined || this.orderId.toString() === "undefined") {
          this.orderNo = "";
        }
        // this.testRemoveBasket();
        let basket = this.basketService.getCurrentBasket();
        let userName = this.authService.getCurrentInfor()?.username;
        this.authService.setOrderLog("Order", "Add order", "",  basket.id, userName?.toString() );
        let saleMode = "SALES";
        let checkPermission = false;
      
        if (basket.salesType === "Exchange") {
          saleMode = "EX";
          this.orderNo = this.orderId; 
          checkPermission= true;
        }
        if (basket.salesType === "Receive") {
          saleMode = "Receive";
          this.orderNo = this.orderId; 
          checkPermission= true;
        }
        if(basket.salesType==="Return")
        {
           saleMode = "RETURN";
           this.orderNo = this.orderId;
           checkPermission= true;
        }
        
        if (basket.customer === null || basket.customer === undefined) {
          let defCustomer = this.authService.getDefaultCustomer();
          this.basketService.changeCustomer(defCustomer);
        }
        if(this.inputOMSMode===true)
        {
          this.order.payments = [];
          basket.payments = [];
          this.basketService.setBasket(basket);
          this.payment = new Payment();
          // let paymentX = new Payment();
          // .id=
          this.payment.isRequireRefNum = false;
          this.payment.id =this.omsInputDefault.customField1;// "DV00";// taptap.paymentCode;
          this.payment.shortName = this.omsInputDefault.settingValue;// "FOODPANDA";// taptap.paymentCode; 
          this.payment.refNum = basket.omsId;
          this.payment.paymentDiscount = 0;
          this.payment.paymentTotal = 0;
          this.payment.mainBalance = 0;
          this.payment.subBalance = 0;
          this.payment.paymentCharged = this.basketService.getTotalBasket().total;
          this.payment.canEdit = false;
          
          let linenum = this.basketService.getCurrentBasket().payments.length + 1;
          this.payment.lineNum = linenum;
          this.basketService.addPaymentToBasket(this.payment, this.payment.paymentCharged , null);
          
        }
        if(checkPermission)
        {
          this.checkPermissionOrder(saleMode);
        }
        else
        {
          this.orderAction(saleMode, '');
        }
        
       
      }
      else {
        this.modalRef.hide();
        this.loadShortcut();
      }

  }
  checkOrderBefInsert()
  {
    let result =  true;
    let basket = this.basketService.getCurrentBasket();
    let storeClient = this.authService.getStoreClient();
    let terminalId = "";
    if(storeClient!==null && storeClient!==undefined)
    {
      terminalId = this.authService.getStoreClient().publicIP;
    }
    else
    {
      terminalId = this.authService.getLocalIP();
    }
    if(terminalId===null || terminalId===undefined || terminalId=== '')
    {
    
      this.alertify.warning("Counter ID can't null please mapping value in Store Counter");
      result = false;
    }

    if(  this.basketService.checkSerialValidLine() === false){ 
      this.alertify.warning("Please input serial number");
      result = false;
    }
    if (this.shiftService.getCurrentShip() == null || this.shiftService.getCurrentShip() === undefined) {
      this.alertify.warning("You are not on the shift. Please create your shift.");
      result = false;
    }
    if(basket!==null && basket!==undefined )
    {
      // if(basket.payments !== null && basket.payments !== undefined && basket.payments?.length > 0)
      // {

      // }
     
      if(this.basketService.checkPayment(basket.payments) === false)
      {
   
        Swal.fire({
          icon: 'warning',
          title: 'Payment',
          html: "Please Complete progress payment! <br /> (Input Amount/ Ref number...)"
        });
       
      }
  
      if(basket?.items?.length <= 0)
      {
        this.alertify.warning("Item is empty. Please check your bill.");
        result = false;
      }
      let negateExchange = false;
      let itemExchange = false;
      debugger;
      if (basket?.salesType === "Exchange" || basket?.salesType === "EX") {
  
        basket.items.forEach(line => {
          if (line.quantity < 0 || line.isNegative === true) {
            negateExchange = true;
            return;
          }
        });
        
      }
      if (basket?.salesType === "Exchange" || basket?.salesType === "EX") {

        basket.items.forEach(line => {
          if (line.quantity > 0 && line?.isNegative !== true ) {
            itemExchange = true;
            return;
          }
        });
      }
      if ((basket?.salesType === "Exchange" || basket?.salesType === "EX") && (negateExchange === false || itemExchange === false)) {
      
        if(negateExchange === false)
        {
          this.alertify.warning("Return item not found");
        }
        if(itemExchange === false)
        {
          this.alertify.warning("Sales item not found");
        }
        result = false;
      }
    }
    else
    {
      this.alertify.warning("Basket not existed. Please try again");
      result = false;
    }
    


    if(result===false)
    {
      this.basketService.changeIsCreateOrder(false);
      this.basketService.changeBasketResponseStatus(true);
    }
  
    return result;
  }
  showSearchkey = false;
  OpenDrawer = "false";
 
  async orderAction(saleMode, approvalId)
  {
    // let cusId = basket.customer.id;
    // let contractNo = basket.contractNo;
    if(approvalId!==null && approvalId!==undefined && approvalId!=='')
    {
      this.basketService.changeUserApproval(approvalId);
    }
    let amountLeft = this.basketService.getAmountChange(); 

    if(this.basketService.getIsCreateOrder()=== true) 
    {
      this.alertify.warning("Order is being processing");
    }
    else
    {
      this.basketService.changeBasketResponseStatus(false);
      this.basketService.changeIsCreateOrder(true);
      // console.log('respone 1' , this.basketService.getBasketResponseStatus());
      try
      {
        debugger;
         
          this.basketService.addOrder(this.orderNo, saleMode).subscribe(
            async (response: any) => {
            // console.log('respone 2' , this.basketService.getBasketResponseStatus());
            // this.basketService.changeBasketResponseStatus(false); 
            this.basketService.changeIsCreateOrder(false);
           
            if (response.success) {
              this.modalRef.hide();
              this.getBill(response.message, amountLeft);
              // this.alertify.success(response.message);
              // this.getBill(response.message);
              // await timer(1000).pipe(take(1)).toPromise(); 
            }
            else {
              if(response?.code === 2000 || response?.code === '2000')
              {
                 this.basketService.changeDateTime(new Date());
              }
              this.basketService.changeBasketResponseStatus(true);
              // console.log("falied Order");
             
              if(response.data !== null && response.data !== undefined && response.data !== '')
              {
                // this.alertify.error(response.message);
                Swal.fire({
                  icon: 'error',
                  title: 'Add Order',
                  text: response.message
                });
                await timer(1000).pipe(take(1)).toPromise(); 
                this.modalRef.hide(); 
                this.getBill(response.data, amountLeft);
              }
              else
              {
                // this.alertify.error(response.message);
                Swal.fire({
                  icon: 'warning',
                  title: 'Add Order',
                  text: response.message
                });
              }
             
            }
    
          },  (error) => {
            this.basketService.changeIsCreateOrder(false);
            this.basketService.changeBasketResponseStatus(true);
            // console.log("error Order");
            // this.alertify.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Add Order',
              text: error
            });
          }
        ),  (error) => {
          this.basketService.changeIsCreateOrder(false);
          this.basketService.changeBasketResponseStatus(true);
       
          // console.log("error Order");
          // this.alertify.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Add Order',
            text: error
          });
        }
      }
      catch(e)
      {
        this.basketService.changeIsCreateOrder(false);
        this.basketService.changeBasketResponseStatus(true);
        // console.log("error Order");
        // this.alertify.error(e);
        Swal.fire({
          icon: 'error',
          title: 'Add Order',
          text: "Add Order failed. Please Try again"
        });
      }
     
     
    }
  

  }

  itemSelectedRow = "";
  itemSelectedRowShortcuts = "";
  selectRow(index, item) {
    debugger;
    
    this.itemSelectedRow = index + item.id + item.uom + item.barcode + item.promotionPromoCode + item?.isNegative + item.custom1;
  }
  remove(index, itemRemove: IBasketItem) {
    debugger;
//     this.authService.setOrderLog("Order", "New Order Click", "",  "");
// xxxx
    let item: IBasketItem =   Object.assign({}, itemRemove);
    let checkAction =  this.authService.checkRole(this.functionId , 'btnRemoveItem', 'V');
    // item.lineNum = index;
    let checkApprovalRequire =  this.authService.checkRole(this.functionId , 'btnRemoveItem', 'A');
    if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
    {
      checkAction = false;
    }
   
    if(checkAction)
    { 
    
      this.basketService.writeLogRemoveItem(this.orderNo, item)
      .subscribe((response: any)=>{
        console.log('response delete', response);
        if(response.success)
        {
          this.basketService.removeItem(item);
          this.itemSelectedIndex = - 1;
        }
        else
        {
          Swal.fire({
            icon: 'warning',
            title: 'Remove Item',
            text: response.message
          });
          // Swal.fire('Remove Item', response.message, 'warning');
        }
      });
    }
    else
    {
      // const initialState = {
      //     title: 'Remove Item -' + 'Permission denied',
      // };
      let permissionModel= { functionId: this.functionId, functionName: 'Remove Item', controlId: 'btnRemoveItem', permission: 'V'};
      const initialState = {
          title:  'Remove Item -' +' Permission denied', permissionModel : permissionModel
      };
      let modalApprovalRef = this.modalService.show(ShopApprovalInputComponent, {
        initialState, 
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-xl medium-center-modal'
        // class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
      });
      modalApprovalRef.content.outEvent.subscribe((received: any) => {
        if(received.isClose)
        {
          modalApprovalRef.hide();
        }
        else
        {
        
          this.basketService.writeLogRemoveItem(this.orderNo, item)
          .subscribe((response: any)=>{
            if(response.success)
            {
              debugger;
              this.authService.setOrderLog("Order", 'Remove Item', "", "Approve by " + received.user); 
              this.basketService.removeItem(item);
              this.itemSelectedIndex = - 1;
              modalApprovalRef.hide();
            }
            else
            {
              Swal.fire({
                icon: 'warning',
                title: 'Remove Item',
                text: response.message
              });
            }
          }, error =>{
            console.log('Remove Item error', error); 
            Swal.fire({
              icon: 'error',
              title: 'Remove Item',
              text: "Failed to connect System, Please try again or contact to support team"
            });
          } );
         

          // let modelLogin = {
          //   username: received.user, password: received.pass
          // }
          // let code = (received.customCode ?? '');
          // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, code, this.functionId, 'btnRemoveItem', 'V' ).subscribe((response: any)=>{
          //   // const user = response;
          //   // debugger;
          //   if (response.success) {
          //     let note = (received.note ?? '');
          //     if (note !== null && note !== undefined && note !== '') {
          //       this.basketService.changeNote(note).subscribe((response) => {
  
          //       });
          //       this.alertify.success('Set note successfully completed.');
          //     }

            
          //   }
          //   else {
          //       Swal.fire({
          //         icon: 'warning',
          //         title: 'Remove item',
          //         text: response.message
          //       });
          //   }
          // })
        }
       
      });
      modalApprovalRef.onHide.subscribe((reason: string) => {
        this.commonService.TempShortcuts$.subscribe((data)=>{
          this.commonService.changeShortcuts(data, true);
          console.log('Old Shorcut' , data );
        });
      })
    }
   
  }
  createNewOrder() {
    let checkAction =  this.authService.checkRole(this.functionId , 'btnClearBill', 'V');
    debugger;
    let checkApprovalRequire =  this.authService.checkRole(this.functionId , 'btnClearBill', 'A');
    if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
    {
      checkAction = false;
    }
    this.authService.setOrderLog("Order", "New Order Click", "",  "");
    if(checkAction)
    {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to clear this bill',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          // debugger;
          this.basketService.writeLogClearBill(this.orderNo).subscribe((response: any)=>{
              debugger;
              if(response.success)
              { 
                this.newOrder();
              }
              else
              {
                  Swal.fire({
                      icon: 'warning',
                      title: 'Log Remove Basket',
                      text: response.message
                    });
              }
            }, error=>{
              console.log('Log Remove Basket Error', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Log Remove Basket',
                  text:"Failed to connect System. Please Try again or contact to support team."
                });
            })
           
          // })
          
  
        }
      });
    }
    else
    {
      let permissionModel= { functionId: this.functionId,  functionName: 'Clear bill',controlId: 'btnClearBill', permission: 'V'};
      const initialState = {
          title: 'Clear bill - ' + 'Permission denied', permissionModel : permissionModel
      };
      let modalApprovalRef = this.modalService.show(ShopApprovalInputComponent, {
        initialState, 
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-xl medium-center-modal'
      });
      //modal-dialog-centered 
      modalApprovalRef.content.outEvent.subscribe((received: any) => {
        if(received.isClose)
        {
          modalApprovalRef.hide();
        }
        else
        {
          this.authService.setOrderLog("Order", 'Clear bill', "", "Approve by " + received.user);
          this.basketService.writeLogClearBill(this.orderNo).subscribe((response: any)=>{
            debugger;
            if(response.success)
            { 
              this.newOrder();
              modalApprovalRef.hide();
            }
            else
            {
                Swal.fire({
                    icon: 'warning',
                    title: 'Log Remove Basket',
                    text: response.message
                  });
            }
          }, error=>{
            console.log('Log Remove Basket Error', error);
              Swal.fire({
                icon: 'error',
                title: 'Log Remove Basket',
                text:"Failed to connect System. Please Try again or contact to support team."
              });
          })
       

          // let code = (received.customCode ?? '');
          // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass,code, this.functionId, 'btnClearBill', 'V' ).subscribe((response: any)=>{
             
          //   if (response.success) {
          //     let note = (received.note ?? '');
          //     if (note !== null && note !== undefined && note !== '') {
          //       this.basketService.changeNote(note).subscribe((response) => {
  
          //       });
          //       this.alertify.success('Set note successfully completed.');
          //     }

            
          //   }
          //   else {
          //       Swal.fire({
          //         icon: 'warning',
          //         title: 'Clear Bill',
          //         text: response.message
          //       });
          //   }
          // })
          // this.authService.loginAuth(modelLogin).subscribe((response: any)=>{
          //   const user = response;
          //   debugger;
          //   if (user) {
          //     this.newOrder();
          //   }
          //   else {
          //     this.alertify.warning("Can't login");
          //   }
          // })
        }
        // console.log('result', receivedEntry);
        // if (receivedEntry !== null && receivedEntry != undefined) {
         
        //   if (receivedEntry === false) {
        //     this.newOrder();
        //   }

        // }
      });
      modalApprovalRef.onHide.subscribe((reason: string) => {
        this.commonService.TempShortcuts$.subscribe((data)=>{
          this.commonService.changeShortcuts(data, true);
          console.log('Old Shorcut' , data );
        });
      })
      // Swal.fire({
      //   icon: 'warning',
      //   title: 'Clear Bill',
      //   text: "Permission denied"
      // });
    }

  
  }

  createNewOrderLocal() {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to clear this bill',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        debugger;
        this.newOrder();


      }
    });
  }
 
 
  async setItemExchangeToBasket(order : Order) {
    let Lines = [];
    // Lines = 
    //  await this.procesMultipleCandidates(order);
    // Parallel loop
    for (let i = 0; i < order.lines.length; i++) {
      try {
        // here candidate data is inserted into  
        let  item = order.lines[i];
          await this.itemService.getItemFilter(this.storeSelected.companyCode, this.storeSelected.storeId, '', '', item.barCode,
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', this.order.cusGrpId,'','','','').subscribe((response: any) => {
            if(response.success)
            {
              let itemX = response.data[0];
              itemX.responseTime = response.responseTime;
              if (itemX !== null && itemX !== undefined && item.openQty > 0 && (item.itemType.toLowerCase() === 'retail' || item.itemType.toLowerCase() === 'r')) {
                // if (itemX !== null && itemX !== undefined) {
                  // let infor=ressponse[0];
                  if(itemX?.returnable!==null && itemX?.returnable!==undefined && itemX?.returnable===true)
                  {
                    if (item.slocId !== undefined && item.slocId !== null) {
                      itemX.slocId = item.slocId;
                    }
                    else {
                      itemX.slocId = this.storeSelected.whsCode;
                    }
                    
                    let itembasket = this.basketService.mapProductItemtoBasket(itemX, 1);
                    debugger;
                    itembasket.weightScaleBarcode = item.weightScaleBarcode;
                    if (itembasket.productName === null || itembasket.productName === undefined) {
                      itembasket.productName = itemX.itemDescription;
                    }
                    itembasket.lineItems = [];
                    let BOMLine = item.lines;
                    debugger;
                    if(BOMLine!==null && BOMLine!==undefined)
                    {
                      BOMLine.forEach(line => {
                        let bomLine = new IBasketItem ();
                        bomLine.id = line.itemCode;
                        bomLine.productName = line.itemName;
                        bomLine.quantity = line.quantity;
                        bomLine.uom = line.uomCode;
                        bomLine.price = line.price;
                        bomLine.lineTotal = line.lineTotal;
                        itembasket.lineItems.push(bomLine);
                      });
                    } 
                    itembasket.quantity = item.openQty;
                    itembasket.openQty = item.openQty;
                    if (itembasket.isCapacity) {
                      itembasket.appointmentDate = item.appointmentDate.toString();
                      itembasket.timeFrameId = item.timeFrameId.toString();
                      itembasket.storeAreaId = item.storeAreaId.toString();
                      itembasket.quantity = item.openQty;
                      itembasket.note = item.remark;
            
                    }
                    
                    itembasket.prepaidCardNo = item.prepaidCardNo;
                    // itembasket.appointmentDate = item.appointmentDate.toString();
                    // itembasket.storeAreaId = item.storeAreaId;
                    // itembasket.timeFrameId= item.timeFrameId;
            
                    itembasket.isSerial = item.isSerial;
                    itembasket.isVoucher = item.isVoucher;
                    itembasket.memberDate = item.memberDate;
                    itembasket.memberValue = item.memberValue;
                    itembasket.startDate = item.startDate;
                    itembasket.endDate = item.endDate;
                    itembasket.itemType = item.itemType;
                    itembasket.promotionPromoCode = item?.promoId;
                    debugger;
                    let lineTotal = item.lineTotal;// item.quantity * item.price;
                    if(item.lineTotalDisIncludeHeader !==null && item.lineTotalDisIncludeHeader !== undefined && item.lineTotal != item.lineTotalDisIncludeHeader )
                    {
                      lineTotal = item.lineTotalDisIncludeHeader;
                    }

                    let discountAmountLine = item.discountAmt ? item.discountAmt : 0;
                    // let discountAmountLineAfterDis =lineTotal - item.discountAmt;
            
                    

                    let discountTongBill = order.discountRate;
                    if (discountAmountLine > 0) {
            
                      let xRs = lineTotal;// - discountAmountLine;
                      let resultLine = xRs/ item.quantity; // (xRs - (xRs * discountTongBill / 100)) 
                      itembasket.price =  resultLine;//item.price;
                      itembasket.promotionPriceAfDis = resultLine;
                      itembasket.promotionLineTotal = 1 * resultLine;
                    }
                    else { 
                      let resultLine = lineTotal / item.quantity; // (lineTotal - (lineTotal * discountTongBill / 100))
                      itembasket.price = item.price;
                      itembasket.promotionPriceAfDis = resultLine;
                      itembasket.promotionLineTotal = 1 * resultLine;
                    }
                    debugger;
                    itembasket.price = item.price;
                    itembasket.promotionPriceAfDis = item.lineTotalDisIncludeHeader / item.quantity;
                    itembasket.promotionLineTotal = item.lineTotalDisIncludeHeader / item.quantity;
                
                    itembasket.discountType = item.discountType === null || item.discountType === undefined ? "" : item.discountType;
                    if (itembasket.discountType === 'Discount Percent') {
                      itembasket.discountValue = item.discountRate;
                    }
                    if (itembasket.discountType === 'Discount Amount') {
                      itembasket.discountValue = item.discountAmt/item.quantity;
                    }
                    if (itembasket.discountType === 'Fixed Quantity') {
                      itembasket.discountValue = item.discountAmt/item.quantity;
                    }
                    if(itembasket.discountType === 'Fixed Price')
                    {
                      itembasket.discountValue = item.discountAmt/item.quantity;
                    }
                    itembasket.promotionDisAmt = item.discountAmt / item.quantity;
                    itembasket.promotionDisPrcnt = item.discountRate;
                    itembasket.promotionDiscountPercent = item.discountRate;
    
                    if(item.lineTotalDisIncludeHeader !==null && item.lineTotalDisIncludeHeader !== undefined && item.lineTotal != item.lineTotalDisIncludeHeader )
                    {
                      itembasket.discountType = 'Discount Percent';
                      itembasket.discountValue = ((item.quantity * item.price) -  item.lineTotalDisIncludeHeader) / (item.quantity * item.price) * 100 ;
    
                      itembasket.promotionDisPrcnt = itembasket.discountValue;
                      itembasket.promotionDiscountPercent = itembasket.discountValue; 
                   
                      itembasket.promotionDisAmt = ((item.quantity * item.price) -  item.lineTotalDisIncludeHeader) / item.quantity;
                    }
                    
                    itembasket.promotionIsPromo = item.isPromo;
                    itembasket.salesTaxCode = item.taxCode;
                    itembasket.salesTaxRate = item.taxRate;
                    itembasket.taxAmt = item.taxAmt;
                    itembasket.promotionType = item.promoType;
                    itembasket.baseLine = item.lineId;
                    itembasket.baseTransId = item.transId;
                    
 

                    // let discountTongBill = order.discountRate;
                    // if (discountAmountLine > 0) {
            
                    //   let xRs = lineTotal;// - discountAmountLine;
                    //   let resultLine = xRs/ item.quantity; // (xRs - (xRs * discountTongBill / 100)) 
                    //   itembasket.price = resultLine;//item.price;
                    //   itembasket.promotionPriceAfDis = resultLine;
                    //   itembasket.promotionLineTotal = 1 * resultLine;
                    // }
                    // else {
            
                    //   let resultLine = lineTotal / item.quantity; // (lineTotal - (lineTotal * discountTongBill / 100))
                    //   itembasket.price = item.price;
                    //   itembasket.promotionPriceAfDis = resultLine;
                    //   itembasket.promotionLineTotal = 1 * resultLine;
                    // }

                    // itembasket.price = item.price;
                    // itembasket.promotionPriceAfDis = item.lineTotalDisIncludeHeader / item.quantity;
                    // itembasket.promotionLineTotal = item.lineTotalDisIncludeHeader / item.quantity;
                    // // itembasket.price = item.price;
                   
                    // // itembasket.promotionPriceAfDis = item.price;
                    // // itembasket.promotionLineTotal = item.lineTotalDisIncludeHeader / item.quantity;
                    
                    // itembasket.discountType = item.discountType === null || item.discountType === undefined ? "" : item.discountType;
                    // // if (itembasket.discountType === 'Discount Percent') {
                    // //   itembasket.discountValue = item.discountRate;
                    // // }
                    // // if (itembasket.discountType === 'Discount Amount') {
                    // //   itembasket.discountValue = item.discountAmt;
                    // // }
                    // // if (itembasket.discountType === 'Fixed Quantity') {
                    // //   itembasket.discountValue = item.discountAmt;
                    // // }
                    // // if(itembasket.discountType === 'Fixed Price')
                    // // {
                    // //   itembasket.discountValue = item.discountAmt;
                    // // }
                    // if (itembasket.discountType === 'Discount Percent') {
                    //   itembasket.discountValue = item.discountRate;
                    // }
                    // if (itembasket.discountType === 'Discount Amount') {
                    //   itembasket.discountValue = item.discountAmt/item.quantity;
                    // }
                    // if (itembasket.discountType === 'Fixed Quantity') {
                    //   itembasket.discountValue = item.discountAmt/item.quantity;
                    // }
                    // if(itembasket.discountType === 'Fixed Price')
                    // {
                    //   itembasket.discountValue = item.discountAmt/item.quantity;
                    // }
                    
                    // itembasket.promotionIsPromo = item.isPromo;
                    // itembasket.salesTaxCode = item.taxCode;
                    // itembasket.salesTaxRate = item.taxRate;
                    // itembasket.taxAmt = item.taxAmt;
                    // itembasket.promotionType = item.promoType;
                    // itembasket.baseLine = item.lineId;
                    // itembasket.baseTransId = item.transId;
            
                    // this.basketService.addItemBasketToBasket(itembasket,  item.openQty); 
                    Lines.push(itembasket);
                    // return itembasket;
                  }
                  else
                  {
                    // this.alertify.warning('Item' + itemX.itemName + " can't return.");
                    Swal.fire({
                      icon: 'warning',
                      title: 'Item data',
                      text: 'Item' + itemX.itemName + " can't return."
                    });
                  }
                
              }
            }
            else
            {
  
            }
  
        });
        // insertResponse
        // and response need to be added into final response array 
        // console.log('insertResponse', insertResponse.ToPromise());
        // console.log('Lines', Lines);
        // generatedResponse.push(insertResponse)
      } catch (error) {
        console.log('error'+ error);
      }
    }
    
    // Lines = await this.procesMultipleCandidates(order);
    console.log('complete all', Lines ) ;// gets loged first
    debugger;
    if (this.exchangeItemMode.replace(' ', '') === 'FromOrder') {
      this.basketService.addItemListBasketToTmpItemsBasket(Lines); 
        this.itemBasketReturn = Lines as IBasketItem[];

      // this.basketService.addItemListBasketToBasket(Lines, false);
      // this.basketService.calculateBasket();
      // debugger;
      console.log(Lines);
      const initialState = {
        items: Lines, title: 'Exchange Items',
      };
      this.commonService.changeShortcuts([], true);
      this.modalRef = this.modalService.show(ShopExchangeItemListComponent, {
        initialState, animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
        // ariaDescribedby: 'my-modal-description',
        // ariaLabelledBy: 'my-modal-title',
        // class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
      });
      this.modalRef.content.outEvent.subscribe((receivedEntry) => {
        console.log('result', receivedEntry);
        debugger;
        if (receivedEntry !== null && receivedEntry != undefined) {
          this.modalRef.hide();
          if (receivedEntry.success === false) {
            // this.newOrder();
            debugger;

            this.createNewOrder();
          }
          else
          { 
            if(receivedEntry.models?.length > 0)
            {
              
              receivedEntry.models.map((todo, i) => { todo.isNegative = true;
              
             });
              this.basketService.addItemListBasketToBasket(receivedEntry.models, false);
              this.basketService.calculateBasket();
            }
           

            // console.log('result', receivedEntry.models);
            // receivedEntry.models.forEach(item => {
            //   this.onEnter(item.barcode);
            // });
            
          }
        }
      });
      this.modalRef.onHide.subscribe((reason: string) => {
        this.loadShortcut(); 
      });

    }
    else {
      // this.exchangeItemsList =Lines;
    
      this.basketService.addItemListBasketToTmpItemsBasket(Lines); 
        this.itemBasketReturn = Lines as IBasketItem[];
      console.log('this.itemBasketReturn',this.itemBasketReturn);
    

    }
     
    
  }
  openPaymentModal(template: TemplateRef<any>) {
    this.showModal = true;
  
    var orderClone: Order = null; 
    orderClone = Object.assign({},  this.order);
    debugger;
    orderClone.payments = [];
     this.basketService.orderToBasket(orderClone, false , true, "AddPayment", null, this.barcodeSetup, true, false);
     setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        keyboard: true,
        backdrop: 'static',
        ignoreBackdropClick: false, 
        class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
      });
     
      // this.modalRef.onHide.subscribe((reason: string) => {
      //   this.loadShortcut();
      //   this.basketService.changeBasketResponseStatus(true);
      //   // console.log("Hide ShowPayment");
      // })
    });
  }
  itemBasketReturn: IBasketItem[] = [];
  // showItemReturnExchange = false;
  setItemReturnToBasket(order: Order) {
    let Lines = [];
    // lines: TSalesLine[]
    // this.showItemReturnExchange = false;
    let basket= this.basketService.getCurrentBasket();
    let salesType =  basket?.salesType;
    order.lines.forEach(async item => {
      // debugger;
      // debugger;
      let barcode = item.barCode;
      if(salesType === 'Receive')
      {
        barcode = item.custom5;
      }
      await this.itemService.getItemFilter(this.storeSelected.companyCode, this.storeSelected.storeId, '', '', barcode,
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', this.order.cusGrpId,'','','','').subscribe(async (response: any) => {
         if(response.success)
         {
          // debugger;
          let itemX = response.data[0];
          itemX.responseTime = response.responseTime;
            if (itemX !== null && itemX !== undefined && item.openQty > 0 && (item.itemType.toLowerCase() === 'retail' || item.itemType.toLowerCase() === 'r')) {
            // if (itemX !== null && itemX !== undefined) {
              // let infor=ressponse[0];
              if((itemX?.returnable!==null && itemX?.returnable!==undefined && itemX?.returnable===true) || salesType === 'Receive')
              {
                if (item.slocId !== undefined && item.slocId !== null) {
                  itemX.slocId = item.slocId;
                }
                else {
                  itemX.slocId = this.storeSelected.whsCode;
                }
                
                let itembasket = this.basketService.mapProductItemtoBasket(itemX, 1);
                itembasket.weightScaleBarcode = item.weightScaleBarcode;
                if (itembasket.productName === null || itembasket.productName === undefined) {
                  itembasket.productName = itemX.itemDescription;
                }
                itembasket.lineItems = [];
                let BOMLine = item.lines;
                debugger;
                if(BOMLine!==null && BOMLine!==undefined)
                {
                  BOMLine.forEach(line => {
                    let bomLine = new IBasketItem ();
                    bomLine.id = line.itemCode;
                    bomLine.productName = line.itemName;
                    bomLine.quantity = line.quantity;
                    bomLine.uom = line.uomCode;
                    bomLine.price = line.price;
                    bomLine.lineTotal = line.lineTotal;
                    itembasket.lineItems.push(bomLine);
                  });
                } 
                itembasket.quantity = item.openQty;
                itembasket.openQty = item.openQty;
                if (itembasket.isCapacity) {
                  itembasket.appointmentDate = item.appointmentDate.toString();
                  itembasket.timeFrameId = item.timeFrameId.toString();
                  itembasket.storeAreaId = item.storeAreaId.toString();
                  itembasket.quantity = item.openQty;
                  itembasket.note = item.remark;
        
                }
                
                itembasket.prepaidCardNo = item.prepaidCardNo;
                // itembasket.appointmentDate = item.appointmentDate.toString();
                // itembasket.storeAreaId = item.storeAreaId;
                // itembasket.timeFrameId= item.timeFrameId;
        
                itembasket.isSerial = item.isSerial;
                itembasket.isVoucher = item.isVoucher;
                itembasket.memberDate = item.memberDate;
                itembasket.memberValue = item.memberValue;
                itembasket.startDate = item.startDate;
                itembasket.endDate = item.endDate;
                itembasket.itemType = item.itemType;
                itembasket.promotionPromoCode = item?.promoId;
                debugger;
                let lineTotal = item.lineTotal;// item.quantity * item.price;
                if(item.lineTotalDisIncludeHeader !==null && item.lineTotalDisIncludeHeader !== undefined && item.lineTotal != item.lineTotalDisIncludeHeader )
                {
                  lineTotal = item.lineTotalDisIncludeHeader;
                }
             
                let discountAmountLine = item.discountAmt ? item.discountAmt : 0;
                // let discountAmountLineAfterDis =lineTotal - item.discountAmt;
        
                let discountTongBill = order.discountRate;
                if (discountAmountLine > 0) {
        
                  let xRs = lineTotal;// - discountAmountLine;
                  let resultLine = xRs/ item.quantity; // (xRs - (xRs * discountTongBill / 100)) 
                  itembasket.price =  resultLine;//item.price;
                  itembasket.promotionPriceAfDis = resultLine;
                  itembasket.promotionLineTotal = 1 * resultLine;
                }
                else { 
                  let resultLine = lineTotal / item.quantity; // (lineTotal - (lineTotal * discountTongBill / 100))
                  itembasket.price = item.price;
                  itembasket.promotionPriceAfDis = resultLine;
                  itembasket.promotionLineTotal = 1 * resultLine;
                }
              
                itembasket.price = item.price;
                itembasket.promotionPriceAfDis = item.lineTotalDisIncludeHeader / item.quantity;
                itembasket.promotionLineTotal = item.lineTotalDisIncludeHeader / item.quantity;
            
              
                itembasket.discountType = item.discountType === null || item.discountType === undefined ? "" : item.discountType;
                if (itembasket.discountType === 'Discount Percent') {
                  itembasket.discountValue = item.discountRate;
                 
                }
                // if (itembasket.discountType === 'Discount Amount') {
                //   // itembasket.discountValue = item.discountAmt / item.quantity;
                //   itembasket.discountValue = item.discountAmt;
                // }
                if (itembasket.discountType === 'Fixed Quantity') {
                  itembasket.discountValue = item.discountAmt/item.quantity;
                 
                }
                if(itembasket.discountType === 'Fixed Price')
                {
                  itembasket.discountValue = item.discountAmt/item.quantity;
                } 
                itembasket.promotionDisAmt = item.discountAmt / item.quantity;

                if (itembasket.discountType === 'Discount Amount') { 
                  itembasket.discountValue = item.discountAmt;
                  itembasket.promotionDisAmt = item.discountAmt;
                }

               

                itembasket.promotionDisPrcnt = item.discountRate;
                itembasket.promotionDiscountPercent = item.discountRate;
                itembasket.promotionIsPromo = item.isPromo;
                if(item.lineTotalDisIncludeHeader !==null && item.lineTotalDisIncludeHeader !== undefined && item.lineTotal != item.lineTotalDisIncludeHeader )
                {
                  itembasket.discountType = 'Discount Percent';
                  itembasket.discountValue = ((item.quantity * item.price) -  item.lineTotalDisIncludeHeader) / (item.quantity * item.price) * 100 ;

                  itembasket.promotionDisPrcnt = itembasket.discountValue;
                  itembasket.promotionDiscountPercent = itembasket.discountValue; 
               
                  itembasket.promotionDisAmt = ((item.quantity * item.price) -  item.lineTotalDisIncludeHeader) / item.quantity;
                }

                if(salesType === 'Receive')
                {
                  itembasket.discountValue = 100; 
                  itembasket.discountType = 'Discount Percent';
                  itembasket.promotionPriceAfDis = 0;
                  itembasket.promotionLineTotal = 0;

                  itembasket.promotionDisAmt =  item.price;
                  itembasket.promotionDisPrcnt =  100;
                  itembasket.promotionDiscountPercent = 100;
                  

                  itembasket.isSerial = itemX.isSerial;
                  itembasket.isVoucher = itemX.isVoucher;
                  
                }

                itembasket.salesTaxCode = item.taxCode;
                itembasket.salesTaxRate = item.taxRate;
                itembasket.taxAmt = item.taxAmt;
                itembasket.promotionType = item.promoType;
                itembasket.baseLine = item.lineId;
                itembasket.baseTransId = item.transId;
                 
                if(itembasket.id === "I0004618")
                {
                  debugger;
                  console.log('itembasket', itembasket);
                }
                // this.basketService.addItemBasketToBasket(itembasket,  item.openQty); 
                Lines.push(itembasket);
                console.log('Item Lines', Lines);
              }
              else
              {
                // this.alertify.warning('Item' + itemX.itemName + " can't return.");
                Swal.fire({
                  icon: 'warning',
                  title: 'Item Selected',
                  text: 'Item' + itemX.itemName + " can't return."
                });
               
              }
            
            }
         }
         else
         {

         }

      })
      console.log(Lines);
      // && x.barCode === item.barCode
      // let itemX = this.items.find(x => x.itemCode === item.itemCode && x.uomCode === item.uomCode);
      // debugger;
     
    });
    // debugger;
   
    if(this.returnItemMode==="FromOrder" && basket?.salesType !== 'Receive' )
    {
      this.basketService.addItemListBasketToTmpItemsBasket(Lines); 
      this.itemBasketReturn = Lines as IBasketItem[];
      debugger;
      // console.log("Show Popup");
    
      // console.log('this.showItemReturnExchange', this.showItemReturnExchange);
      // this.showItemReturnExchange = true;
      // this.basketService.addItemListBasketToBasket(Lines, false);
    
      // debugger;
      console.log(Lines);
      const initialState = {
        items: Lines, title: 'Return Items',
      };
      this.commonService.changeShortcuts([], true);
      this.modalRef = this.modalService.show(ShopExchangeItemListComponent, {
        initialState, 
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
        // ariaDescribedby: 'my-modal-description',
        // ariaLabelledBy: 'my-modal-title',
        // class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
      });
      this.modalRef.content.outEvent.subscribe((receivedEntry) => {
        console.log('result', receivedEntry);
        debugger;
        if (receivedEntry !== null && receivedEntry != undefined) {
          this.modalRef.hide();
          if (receivedEntry.success === false) {
            // this.newOrder();
            debugger;

            this.createNewOrder();
          }
          else
          {
            console.log('result', receivedEntry.models);
            if(receivedEntry.models?.length > 0)
            {
              this.basketService.addItemListBasketToBasket(receivedEntry.models, false);
              this.basketService.calculateBasket();
            }
          
            // this.basketService.addItemListBasketToTmpItemsBasket(receivedEntry);
            // receivedEntry.models.forEach(item => {
            //   this.onEnter(item.barcode);
            // });
            
          }
        }
      });
      this.modalRef.onHide.subscribe((reason: string) => {
        this.loadShortcut(); 
      });
      // if (Lines !== null && Lines !== undefined && Lines.length > 0) {
       
  
      // }
      // else {
      //   Swal.fire({
      //     title: "Items in Order can't return/exchange",
      //     icon: 'info',
      //     showCancelButton: false,
      //     confirmButtonText: 'OK',
      //     cancelButtonText: 'No'
      //   }).then((result) => {
      //     if (result.value) {
      //       this.newOrder();
      //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  
      //     }
      //   })
      // }
    }
    else
    {
      this.basketService.addItemListBasketToTmpItemsBasket(Lines); 
      this.itemBasketReturn = Lines as IBasketItem[];
      console.log('this.itemBasketReturn',this.itemBasketReturn);
    }
    
  }
  
  @ViewChild('returnExchangeSwitch', { static: false }) returnExchangeSwitch: DxSwitchComponent;
  @ViewChild('txtSearch', { static: false }) txtSearch: ElementRef;
  @ViewChild('txtCustomer', { static: false }) txtCustomer: DxTextBoxComponent;
  // @ViewChild('txtNote', { static: false }) txtNote: QueryList<DxTextBoxComponent>; 
  @ViewChildren('txtNote') txtNote: QueryList<DxTextBoxComponent>;
  @ViewChild('txtOMSId', { static: false }) txtOMSId: DxTextBoxComponent;
  // @ViewChildren('input2') refNumInputs: QueryList<ElementRef>;
  // @ViewChild("name", { static: false }) inputName: DxTextBoxComponent;
  portReader;
  keepReading = true;
  reader;
  async readUntilClosed() {
    while (this.port.readable && this.keepReading) {
      this.reader = this.port.readable.getReader();
      try {
        while (true) {
          const { value, done } = await this.reader.read();
          if (done) {
            // |reader| has been canceled.
            break;
          }
          // Do something with |value|...
        }
      } catch (error) {
        // Handle |error|...
      } finally {
        this.reader.releaseLock();
      }
    }
  
    await this.port.close();
  }
  poleValue: SStoreClient;
  getPole() : SStoreClient
  {
    let poleSetup = localStorage.getItem("poleSetup");
    let result = null;
    if(poleSetup!==null && poleSetup!==undefined)
    {
      result = JSON.parse(poleSetup);
    }
    return result;
  }
  async WriteValue(string1, string2, tryConnect) {
    if(this.poleDisplayType==='')
    {
      let poleValue = this.getPole();
      if(poleValue!==null && poleValue!==undefined )
      {
        if(poleValue?.poleName?.toString()!== '' && poleValue?.poleBaudRate?.toString()!== '' )
        {
          this.commonService.PoleShowMess(poleValue?.poleName?.toString(), poleValue?.poleBaudRate?.toString() , poleValue?.poleParity?.toString(), '', '', '', this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, poleValue.publicIP, string1, string2).subscribe((response: any)=>{
            if(response.success)
            {
              // this.alertifyService.success("Connect pole display completed successfully.");
            }
            else
            {
              // this.alertify.warning(response.message);
            }
          });
        }
       
      }
    }
    else
    {
      this.WritePoleSerial(string1, string2, tryConnect);
    }
   
    // this.commonService.PoleShowMess()
    // // if(this.ignorePoleDisplay)
    // // {
      
    // // }
    // if(this.port===null || this.port===undefined && this.ignorePoleDisplay===false)
    // {
    //   await this.connectSerial();
    // }
  
    // try {
    //   await  this.port.open({
    //     baudRate: 9600,
    //     // dataBits: 8,
    //     // stopBits: 1,
    //     // parity: "none"
    //     }).then((err: any) => {
    //       if (err) return console.dir(err);

    //       console.log('serial port opened');
    //       console.dir( this.port);
          
    //     });
    // } catch (error) {
    //   // this.alertify.warning(error);
    // }
    // const textEncoder = new TextEncoderStream();
    // const writableStreamClosed = textEncoder.readable.pipeTo(this.port.writable);
    
    // const writer = textEncoder.writable.getWriter(); 
    // // await writer.writeLine();
    // if(string1?.length > 20)
    // {
    //   string1= string1.substring(0, 20);
    // }
    // let str="";
    // if(string1?.length < 20)
    // {
    //   let space = 20 - string1?.length ;
     
    //   if(space > 0)
    //   {
    //     for(let i=0; i< space ;i++)
    //     {
    //       str+=" ";
    //     }
    //   }
    //   string1= string1.substring(0, string1?.length) +  str;
    // }
    // if(string2?.length > 20)
    // {
    //   string2= string2.substring(0, 20);
    // }
    // let str2="";
    // if(string2?.length < 20)
    // {
    //   let space = 20 - string2?.length ;
     
    //   if(space > 0)
    //   {
    //     for(let i=0; i< space ;i++)
    //     {
    //       str2+=" ";
    //     }
    //   }
    //   string2= string2.substring(0, string2?.length) +  str2;
    // }
    // await writer.write(string1);
    // await writer.write(string2);
    // // writer.releaseLock();
    // await writer.close();
  }
  async WritePoleSerial(string1, string2, tryConnect) {
    // let poleValue = this.getPole();
    // if(poleValue!==null && poleValue!==undefined )
    // {
    //   if(poleValue?.poleName?.toString()!== '' && poleValue?.poleBaudRate?.toString()!== '' )
    //   {
    //     this.commonService.PoleShowMess(poleValue?.poleName?.toString(), poleValue?.poleBaudRate?.toString() , poleValue?.poleParity?.toString(), '', '', '', this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, poleValue.publicIP, string1, string2).subscribe((response: any)=>{
    //       if(response.success)
    //       {
    //         // this.alertifyService.success("Connect pole display completed successfully.");
    //       }
    //       else
    //       {
    //         // this.alertify.warning(response.message);
    //       }
    //     });
    //   }
     
    // }
    // this.commonService.PoleShowMess()
    // if(this.ignorePoleDisplay)
    // {
      
    // }
    if(this.port===null || this.port===undefined && this.ignorePoleDisplay===false)
    {
      await this.connectSerial();
    }
  
    try {
      await  this.port.open({
        baudRate: 9600,
        // dataBits: 8,
        // stopBits: 1,
        // parity: "none"
        }).then((err: any) => {
          if (err) return console.dir(err);

          console.log('serial port opened');
          console.dir( this.port);
          
        });
    } catch (error) {
      // this.alertify.warning(error);
    }
    const textEncoder = new TextEncoderStream();
    const writableStreamClosed = textEncoder.readable.pipeTo(this.port.writable);
    
    const writer = textEncoder.writable.getWriter(); 
    // await writer.writeLine();
    if(string1?.length > 20)
    {
      string1= string1.substring(0, 20);
    }
    let str="";
    if(string1?.length < 20)
    {
      let space = 20 - string1?.length ;
     
      if(space > 0)
      {
        for(let i=0; i< space ;i++)
        {
          str+=" ";
        }
      }
      string1= string1.substring(0, string1?.length) +  str;
    }
    if(string2?.length > 20)
    {
      string2= string2.substring(0, 20);
    }
    let str2="";
    if(string2?.length < 20)
    {
      let space = 20 - string2?.length ;
     
      if(space > 0)
      {
        for(let i=0; i< space ;i++)
        {
          str2+=" ";
        }
      }
      string2= string2.substring(0, string2?.length) +  str2;
    }
    await writer.write(string1);
    await writer.write(string2);
    // writer.releaseLock();
    await writer.close();
  }
  ignorePoleDisplay=true;
  production = false;
  async onEnter(value, isScanner?: boolean, quantityInput?: number ) { 
    debugger;
    this.itemSelectedIndex = -1;
    this.itemSelectedRow = '';
    this.basketService.changeBasketResponseStatus(false);
    if(this.showModal!== null && this.showModal!== undefined && this.showModal === true)
    {
      this.basketService.changeBasketResponseStatus(true);
      this.authService.setOrderLog("Order", "onEnter", "Blocked",   value + ' isScanner: ' + isScanner, "Payment is on");
        Swal.fire({
          icon: 'warning',
          title: 'Input item data',
          text: "This operation cannot be performed while in the payment screen. Please exit the payment screen and try again."
        });
    }
    else
    {
        
        console.log("On Enter", value);
      // console.log("On barcodeScan", barcodeScan);
      debugger;
      this.inputBarcode= false;
      this.authService.setOrderLog("Order", "onEnter", "",   value + ' isScanner: ' + isScanner);
      if(value!==null && value!==undefined && value!=='')
      {
        if(quantityInput=== null || quantityInput===undefined || quantityInput.toString() === '')
        {
          quantityInput=1;
        }
        let basket = this.basketService.getCurrentBasket();
        let isReturn = basket.returnMode;
        let tmpItems = basket.tmpItems;
        let mode = basket.salesType;
       
        let customer = basket.customer.customerGrpId;
        let check = false;
        if (customer === null || customer === undefined || customer === '') {
          customer = '';
        }
        // if(basket.salesType.toLowerCase() ==='return' )
        // {
        //   if(this.itemBasketReturn!==null && this.itemBasketReturn!==undefined && this.itemBasketReturn?.length > 0)
        //   {
        //     let item = this.itemBasketReturn.find(x=> x.barcode === value);
        //     let itemInBasket = basket.items.find(x => x.id === item.id && x.uom === item.uom  && x.barcode === item.barcode);
        //     if(itemInBasket!==null && itemInBasket!==undefined)
        //     {
        //       if(item.openQty > itemInBasket.quantity)
        //       {
        //         this.basketService.addItemBasketToBasketNoPromotion(item, 1);
        //         this.txtSearch.nativeElement.focus();
        //         this.txtSearch.nativeElement.value = '';
        //       }
        //       else
        //       {
        //         Swal.fire({
        //           icon: 'warning',
        //           title: 'Item',
        //           text: "Can't add to basket. Item return can't more than sales quantity"
        //         });
        //         this.txtSearch.nativeElement.focus();
        //         this.txtSearch.nativeElement.value = '';
        //       }
        //     }
        //     else
        //     {
        //       this.basketService.addItemBasketToBasketNoPromotion(item, quantityInput);
        //       this.txtSearch.nativeElement.focus();
        //           this.txtSearch.nativeElement.value = '';
        //     }
            
        //   }
        //   else
        //   {
        //     Swal.fire({
        //       icon: 'warning',
        //       title: 'Item',
        //       text: "Item can't return"
        //     });
        //   }
        
        // }
        // else
        // {
          let barcodeReplace= false;
          let canGetData = true;
          let barcode: SBarcodeSetup;
          let barcodeString = value;
          debugger;
          if(this.barcodeSetup!==null && this.barcodeSetup!==undefined && this.barcodeSetup?.length > 0)
          {
            barcode = this.barcodeService.splitBarcode(value, this.barcodeSetup); 
            
            // if(barcode.prefix === this.barcodeSetup[0].prefix)
            // { 
            // }
            if(barcode !== null &&  barcode !== undefined)
            {
              if(barcode.barCodeLength === value.length)
              {
                if(this.barcodeService.barcodeCheck(value))
                {
                  value = barcode.pluStr;
                  barcodeReplace= true;
                }
                else
                {
                  // this.alertify.warning('Check digit failed.');
                  Swal.fire({
                    icon: 'warning',
                    title: 'Item',
                    text: barcodeString + " Check digit failed"
                  });
                  canGetData= false;
                  this.basketService.changeBasketResponseStatus(true);
                }
              }
              else
              {
                // this.alertify.warning('Invalid barcode length.');
                Swal.fire({
                  icon: 'warning',
                  title: 'Item',
                  text: barcodeString + " Invalid barcode length"
                });
                canGetData= false;
                this.basketService.changeBasketResponseStatus(true);
              }
            }
           
           
          }
          let barcodeFilter =value;
          let keyFilter ="";
          let plu ="";
          console.log('After check barcode', new Date().getMilliseconds());
          if( this.searchBarcodeOnly?.toLowerCase()!=="true")
          {
            barcodeFilter = "";
            keyFilter =value;
            plu = "";
          }
          if(barcodeReplace )
          {
            // keyFilter= "";
            //Lập chỉnh sửa ngày 2022/03/18
            keyFilter = "";//barcodeString;
            barcodeFilter = barcodeString;// "";
            plu =value;
          }
          // if(barcodeReplace || this.searchBarcodeOnly?.toLowerCase()!=="true")
          // {
          //   barcodeFilter = "";
          //   keyFilter =value;
          // }
         
          if(canGetData)
          {
            if(this.ManualRunPromotion?.toLowerCase() === "true" && basket.isApplyPromotion === true) 
            {
              this.removePromotion();
            }
  
            if(basket.salesType?.toLowerCase() ==='return' || basket.salesType?.toLowerCase() ==='receive' )
            {
              if(this.itemBasketReturn!==null && this.itemBasketReturn!==undefined && this.itemBasketReturn?.length > 0)
              {
                let item:IBasketItem; //= this.itemBasketReturn.find(x=> x.barcode === value);
                // debugger
                let itemInBasket:IBasketItem; // = basket.items.find(x => x.id === item.id && x.uom === item.uom  && x.barcode === item.barcode);
                if(barcodeReplace)
                {
                  // debugger;
                  let PLUitem = this.itemBasketReturn.find(x=> x.weightScaleBarcode === barcodeString);
                  if(PLUitem!==null && PLUitem !==undefined)
                  {
                    // itemInBasket = basket.items.find(x => x.id === item.itemCode && x.uom === item.uomCode  && x.weightScaleBarcode === item.weightScaleBarcode);
                    itemInBasket = basket.items.find(x => x.id === PLUitem.id && x.uom === PLUitem.uom  && x.weightScaleBarcode === PLUitem.weightScaleBarcode);
                    debugger;
                    if(PLUitem!==null && PLUitem !==undefined)
                    {
                      item = PLUitem;
                      item.isWeightScaleItem = true;
                      quantityInput = parseFloat(barcode.weightStr) ;
                      if(barcode.amountStr!==null && barcode.amountStr!==undefined && barcode.amountStr!=='')
                      {
                        item.promotionLineTotal = parseFloat(barcode.amountStr) ;
                      }
                      else
                      {
                        item.promotionLineTotal = PLUitem.price * quantityInput ;
                      }
                      // item.lineTotal = barcode.amountValue ;
                    
                    }
                  }
                }
                else
                {
                  item = this.itemBasketReturn.find(x=> x.barcode === value);
                  if(item!==null && item !==undefined)
                  {
                    itemInBasket = basket.items.find(x => x.id === item.id && x.uom === item.uom  && x.barcode === item.barcode);
                  }
                 
                }
                // item.baseLine = item.lineId.toString();
                // item.baseTransId = this.order.transId;
               
                if(itemInBasket!==null && itemInBasket!==undefined)
                {
                  if(item.openQty > itemInBasket.quantity)
                  {
                    this.basketService.addItemBasketToBasketNoPromotion(item, 1);
                    this.txtSearch.nativeElement.focus();
                    this.txtSearch.nativeElement.value = '';
                    debugger;
                    if(this.poleDisplay==='true' )
                    {
                      // + quantity + " x " 
                      await this.WriteValue(item.productName ,"(" + this.storeSelected.currencyCode + ") " + this.authService.formatCurrentcy(item?.price)  + "", true );
                    }
                    this.itemSelectedIndex = basket.items.length-1;
                  }
                  else
                  {
                    console.log("one");
                    Swal.fire({
                      icon: 'warning',
                      title: 'Item',
                      text: "Can't add to basket. Item return can't more than sales quantity"
                    }).then(() => {
                      // window.location.reload();
                      this.txtSearch.nativeElement.focus();
                      this.txtSearch.nativeElement.value = '';
                      this.basketService.changeBasketResponseStatus(true);
  
                    });
                   
                  }
                }
                else
                {
                  debugger;
                  if(item!==null && item !==undefined)
                  {
                    debugger;
                 
                    this.basketService.addItemBasketToBasketNoPromotion(item, quantityInput);
                    
                    this.txtSearch.nativeElement.focus();
                        this.txtSearch.nativeElement.value = '';
                        debugger;
                        if(this.poleDisplay==='true' )
                        {
                          // + quantity + " x "  item.price.toString()
                          await this.WriteValue(item.productName ,"(" + this.storeSelected.currencyCode + ") " +  this.authService.formatCurrentcy(item?.price) + "", true );
                        }
                  }
                  else
                  {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Item',
                      text: "Can't found item in order"
                    });
                    this.basketService.changeBasketResponseStatus(true);
                    // this.txtSearch.nativeElement.focus();
                    // this.txtSearch.nativeElement.value = '';
                  }
                
                }
                
              }
              else
              {
                Swal.fire({
                  icon: 'warning',
                  title: 'Item',
                  text: "Item can't return"
                });
                this.basketService.changeBasketResponseStatus(true);
              }
            
            }
            else
            {
                // console.log('Begin Filter', new Date().getMilliseconds());
                let getInforByAPI = true;
                
                if(plu!== null && plu!==undefined && plu?.length > 0)
                {
                  getInforByAPI = true;
                }
                else
                {
                  let basket = this.basketService.getCurrentBasket();
                  if(basket!==null && basket!==undefined )
                  {
                    let mode = basket.salesType;
                    if(mode?.toLowerCase()==='retail' || mode?.toLowerCase()==='sales') 
                    {
                      let items = basket?.items;
                      if(items!==null && items!==undefined && items?.length > 0 )
                      {
                        let itemCheck = items.filter(x=>x.barcode === barcodeFilter);
                        if(itemCheck!==null && itemCheck!==undefined && itemCheck?.length > 0 )
                        { 
                          getInforByAPI = false;
                          if(itemCheck!==null && itemCheck!==undefined && itemCheck?.length > 0 )
                          {
                            let itemInBas = itemCheck[0];
                            if(itemInBas!==null && itemInBas!==undefined )
                            {
                              var itemInsert = Object.assign({}, itemInBas);
                              let quantity =   itemInsert.quantity + 1;
                              debugger;
                              // this.basketService.addItemBasketToBasket(itemInsert, 1) ;
                              this.onBlurMethod(itemInsert, null, quantity); 
                              setTimeout(() => {
                                this.txtSearch.nativeElement.value = '';
                              }, 50);
                              // this.txtSearch.nativeElement.focus(); 
                              // this.basketService.changeBasketResponseStatus(true);
                            }
                            else
                            {
                              getInforByAPI = true;
                            }
                         
                          }
                          else
                          {
                            getInforByAPI = true;
                          }
                         
                        }
                        else
                        {
                          getInforByAPI = true;
                        }
                      }
                      else
                      {
                        getInforByAPI = true;
                      }
                    }
                    else
                    {
                      getInforByAPI = true;
                    }
                  }
                  else
                  {
                    getInforByAPI = true;
                  }

                }
                if(getInforByAPI)
                {
                  
                  this.itemService.getItemFilter(this.storeSelected.companyCode, this.storeSelected.storeId, '', '', barcodeFilter,
                  keyFilter, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', customer, '', plu,'','', isScanner).subscribe( async (response: any) => {
                    // console.log(response); 
                    // console.log('After Filter Data', new Date().getMilliseconds())
                    if (response.success) {
                      if (response.data !== null && response.data !== undefined && response.data.length > 0) {
                        let item = response.data[0] as ItemViewModel;
                        item.responseTime = response.responseTime;
                        let typeOfItem = item.customField1?.toLowerCase();
                        let canAddItem = true;
                        
                        // if(item?.isWeightScaleItem === true)
                        // {
                        //   item.isWeightScaleItem = true
                        // }
                        // else
                        // {
                        //   item.isWeightScaleItem = false;
                        // }
                        item.isWeightScaleItem = false;
                        if(basket.items!==null && basket.items!==undefined && basket.items?.length === 0)
                        {
                          canAddItem = true;
                        }
                        else
                        {
                          if(typeOfItem === 'pn' || typeOfItem === 'pin' || typeOfItem === 'topup' || typeOfItem === 'tp' || typeOfItem === 'bp')
                          {
                            let itemBasket = basket.items.filter(x=>x.customField1?.toLowerCase() !== 'pn' && x.customField1?.toLowerCase() !== 'pin' 
                                && x.customField1?.toLowerCase() !== 'topup' && x.customField1?.toLowerCase() !== 'tp' && x.customField1?.toLowerCase() !== 'bp' )
                            if(itemBasket!==null && itemBasket!==undefined && itemBasket.length > 0)
                            {
                              canAddItem = false;
                              Swal.fire({
                                icon: 'warning',
                                title: 'Item',
                                text: "Can't add item PIN / TOPUP / Bill Payment with Retail item"
                              });
                              this.basketService.changeBasketResponseStatus(true);
                            }
                          }
                          else
                          {
                            let itemBasket = basket.items.filter(x=>x.customField1?.toLowerCase() === 'pn' || x.customField1?.toLowerCase() === 'pin' 
                            || x.customField1?.toLowerCase() === 'topup' || x.customField1?.toLowerCase() === 'tp' || x.customField1?.toLowerCase() === 'bp' )
                            if(itemBasket!==null && itemBasket!==undefined && itemBasket.length > 0)
                            {
                              canAddItem = false;
                              Swal.fire({
                                icon: 'warning',
                                title: 'Item',
                                text: "Can't add item PIN / TOPUP / Bill Payment with Retail item"
                              });
                              this.basketService.changeBasketResponseStatus(true);
                            }
                          }
                        }
                        debugger;
                        if(canAddItem)
                        { 
                          let quantity =  quantityInput;// isReturn ? -quantityInput : quantityInput;
                          if(item?.isFixedQty && item?.defaultFixedQty != null && item?.defaultFixedQty != undefined && item?.defaultFixedQty != 0)
                          {
                            quantity = item?.defaultFixedQty;
                          }
                          // && item.isWeightScaleItem
                          if(barcodeReplace )
                          {
                            quantity =  parseFloat(barcode.weightStr);// isReturn ? -parseFloat(barcode.weightStr): parseFloat(barcode.weightStr);
                            if(barcode?.isOrgPrice!==null && barcode?.isOrgPrice!==undefined && barcode?.isOrgPrice===true)
                            { 
                              item.defaultPrice = item.defaultPrice;
                            }
                            else
                            {
                              if(barcode.amountStr!==null && barcode.amountStr!==undefined && barcode.amountStr!=='' )
                              {
                                // 
                                item.defaultPrice =  parseFloat(barcode.amountStr) / parseFloat(barcode.weightStr);
                                if(this.priceWScaleWithCfg?.toLowerCase() === 'true')
                                {
                                  if(item?.defaultPrice!==null && item?.defaultPrice!=undefined)
                                  {
                                    item.defaultPrice = this.authService.roundingAmount(item.defaultPrice);
                                  }
                                } 
                              }
                            } 
                            item.weightScaleBarcode= barcodeString;
                            item.isWeightScaleItem = true;
                          }
                          if(quantity===0)
                          {
                            // this.alertify.warning("Amount can't be zero");
                            Swal.fire({
                              icon: 'warning',
                              title: 'Item',
                              text: "Amount can't be zero"
                            });
                            this.basketService.changeBasketResponseStatus(true);
                          }
                          else
                          {
                            if (mode.toLowerCase() === "ex" || mode.toLowerCase() === "exchange" || mode.toLowerCase() === "return") 
                            {
                              let lst = [];
                              if ((mode.toLowerCase() === "ex" || mode.toLowerCase() === "exchange" || mode.toLowerCase() === "return") && isReturn) 
                              {
                                if(barcodeReplace)
                                {
                                  if (this.itemBasketReturn.some(x => x.id === item.itemCode && x.uom === item.uomCode  && x.weightScaleBarcode === barcodeString)) 
                                  {
                                    check = true;
                                  }
                                }
                                else
                                {
                                  debugger;
                                  // let aaa = this.itemBasketReturn.filter(x => x.id === item.itemCode && x.uom === item.uomCode  && x.barcode === item.barCode);
      
                                  if (this.itemBasketReturn.some(x => x.id === item.itemCode && x.uom === item.uomCode  && x.barcode === item.barCode)) 
                                  {
                                    check = true;
                                  }
                                }
                                
                              }
                              else {
                                check = true;
                              }
                              if (check) 
                              {
                                
                                let itemInBasket = basket.items.find(x => x.id === item.itemCode && x.uom === item.uomCode  && x.barcode === item.barCode);
                                // let itemInOrder = this.order.lines.find(x => x.itemCode === item.itemCode && x.uomCode === item.uomCode  && x.barCode === item.barCode);
                                let itemInOrder = this.itemBasketReturn.find(x => x.id === item.itemCode && x.uom === item.uomCode  && x.barcode === item.barCode);
                              
                                if(barcodeReplace)
                                {
      
                                  itemInBasket = basket.items.find(x => x.id === item.itemCode && x.uom === item.uomCode  && x.weightScaleBarcode === item.weightScaleBarcode);
                                  itemInOrder = this.itemBasketReturn.find(x => x.id === item.itemCode && x.uom === item.uomCode  && x.weightScaleBarcode === item.weightScaleBarcode);
                                
                                }
                                debugger;
                              //   &&
                                if( isReturn===true)
                                {
                                  if(itemInBasket!==null && itemInBasket!==undefined)
                                  {
                                    if(Math.abs(itemInBasket.quantity) >= itemInOrder.quantity)
                                    {
                                      console.log("two");
                                      Swal.fire({
                                        icon: 'warning',
                                        title: 'Item',
                                        text: "Can't add to basket. Item return can't more than sales quantity"
                                      }).then(() => {
                                        // window.location.reload();
                                        this.txtSearch.nativeElement.focus();
                                        this.txtSearch.nativeElement.value = '';
                                        this.basketService.changeBasketResponseStatus(true);
                                      });
                                    }
                                    else  
                                    {
                                      // if(mode.toLowerCase() === "return")
                                      // {
                                      //   quantity = Math.abs(quantity);
                                      // }
                                      // let basketItem = itemInOrder;
                                      // item= this.basketService.map
                                      var itemInsert = Object.assign({}, itemInOrder);
                                      itemInsert.isNegative = true;
                                      //20220402 chỉnh lại số exchange
                                      let basketItem = this.basketService.replaceQuantityItemtoBasket(itemInsert, quantity );
                                      // let basketItem = this.basketService.replaceQuantityItemtoBasket(itemInsert, itemInsert.quantity);
                                      lst.push(basketItem);
                                    }
                                  }
                                  else
                                  {
                                    var itemInsert = Object.assign({}, itemInOrder);
                                    itemInsert.isNegative = true;
                                    //20220402 chỉnh lại số exchange
                                    let basketItem = this.basketService.replaceQuantityItemtoBasket(itemInsert, quantity );
                                    // let basketItem = this.basketService.replaceQuantityItemtoBasket(itemInsert, itemInsert.quantity);
                                  
                                    lst.push(basketItem);
                                  }
                                    
                                }
                                else
                                {
                                  debugger;
                                  // if(mode.toLowerCase() === "return")
                                  // {
                                  //   quantity = Math.abs(quantity);
                                  // }
                                  // let basketItem = this.basketService.mapProductItemtoBasket(item, quantity);
                                  var itemInsert = Object.assign({}, itemInOrder);
                                  // itemInsert.isNegative = true;
                                  // let basketItem = this.basketService.replaceQuantityItemtoBasket(itemInsert, quantity);
                                  // let basketItem = itemInOrder;
                                  // lst.push(basketItem);
                                  // this.addNewItemToBasket(itemInsert, quantity);
                                  this.addNewItemToBasket(item, quantity);
      
                                  if(basket?.items?.length > 0)
                                  { 
                                    
                                    setTimeout(() => {
                                      this.itemSelectedIndex = basket?.items?.length - 1;
                                      // const index = basket?.items.findIndex((i) => i.id === item.itemCode && i.uom === item.uomCode   && i.barcode === item.barCode 
                                      // && i?.custom1 === item?.custom1   
                                      // && ( (i.promotionIsPromo !== '1' && i.promotionType !=='Fixed Quantity') ||  (i.promotionIsPromo === '1' && i.isVoucher && i.isVoucher === item.isVoucher ))
                                      // );
                                      // if(index!=-1)
                                      // {
                                      //   this.itemSelectedIndex = index;
                                      // }
                                      
                                      this.scrollToBottomList();
                                    }, 200)
                                    // this.itemSelectedIndex = basket?.items?.length - 1;
                                    // this.scrollToBottomList();
                                  }
                                }
                              
                              }
                              if ((mode.toLowerCase() === "ex" || mode.toLowerCase() === "exchange" || mode.toLowerCase() === "return") && isReturn && check === false) {
                                let barcode = item?.barCode ?? item?.itemCode;
                                Swal.fire({
                                  icon: 'warning',
                                  title: 'Item',
                                  text:  "Item " +barcode+ " not enough quantity for Return/Exchange " 
                                  // "Item " + barcode + " is not existed in the order or
                                }).then(() => {
                                  // window.location.reload();
                                  // this.txtSearch.nativeElement.focus();
                                  this.txtSearch.nativeElement.value = '';
                                  this.basketService.changeBasketResponseStatus(true);
                                });
                                // Swal.fire({
                                //   icon: 'warning',
                                //   title: 'Item',
                                //   text: "Data not found"
                                // }).then(() => {
                                //   // window.location.reload();
                                //   // this.txtSearch.nativeElement.focus();
                                //   this.txtSearch.nativeElement.value = '';
                                //   this.basketService.changeBasketResponseStatus(true);
                                // });
                                // this.basketService.changeBasketResponseStatus(true);
                              }
                              check = false;
                              debugger;
                              this.basketService.addItemListBasketToBasket(lst, false);
                              this.txtSearch.nativeElement.value = ''; 
                             
                              if(this.poleDisplay==='true')
                              {
                                // + quantity + " x " 
                                // await this.WriteValue(lst[lst.length - 1].productName ,"(" + this.storeSelected.currencyCode + ") " +  lst[lst.length - 1].price.toString() + "", true );
                                await this.WriteValue(lst[lst.length - 1]?.productName ,"(" + this.storeSelected.currencyCode + ") " + this.authService.formatCurrentcy(lst[lst.length - 1]?.price)  + "", true );
                                
                              }
                              // this.itemSelectedIndex = basket.items.length-1;
                              if(basket?.items?.length > 0)
                              { 
                                // this.itemSelectedIndex = basket?.items?.length - 1;
                                // this.scrollToBottomList();
                                setTimeout(() => {
                                  this.itemSelectedIndex = basket?.items?.length - 1;
                                  this.scrollToBottomList();
                                }, 200)
                              }
                            }
                            else {
                              this.addNewItemToBasket(item, quantity);
                              // setTimeout(() => { 
                              //   if(item.isSerial || item.isVoucher)
                              //   {
                              //       let itembasket = this.basketService.mapProductItemtoBasket(item, isReturn ? -1 : 1); 
                              //       const initialState = {
                              //         item:  itembasket, title: 'Item Serial',
                              //       };
                              //       this.modalRef = this.modalService.show(ShopItemSerialComponent, {initialState});
                              //   } 
                              // },100);
                              this.itemSelectedIndex = basket?.items?.length - 1;
                         
                              // this.basketService.addItemtoBasket(item, quantity);
                              this.txtSearch.nativeElement.value = '';
                              debugger;
                              if(this.poleDisplay==='true')
                              {
                                // + quantity + " x "  item.defaultPrice.toString()
                                await this.WriteValue(item.itemName,"(" + this.storeSelected.currencyCode + ") " +  this.authService.formatCurrentcy(item?.defaultPrice)  + "", true );
                              }
                              // this.itemSelectedIndex = basket.items.length-1;
                              if(basket?.items?.length > 0)
                              { 
                                
                                setTimeout(() => {
                                  this.itemSelectedIndex = basket?.items?.length - 1;
                                  // const index = basket?.items.findIndex((i) => i.id === item.itemCode && i.uom === item.uomCode   && i.barcode === item.barCode 
                                  // && i?.custom1 === item?.custom1   
                                  // && ( (i.promotionIsPromo !== '1' && i.promotionType !=='Fixed Quantity') ||  (i.promotionIsPromo === '1' && i.isVoucher && i.isVoucher === item.isVoucher ))
                                  // );
                                  // if(index!=-1)
                                  // {
                                  //   this.itemSelectedIndex = index;
                                  // }
                                   
                                 
                                  this.scrollToBottomList();
                                }, 200)
                                // this.itemSelectedIndex = basket?.items?.length - 1;
                                // this.scrollToBottomList();
                              }
                              // this..nativeElement.
                            }
                          }
                        
                        }
                        // this.txtSearch.nativeElement.focus();
                    
            
                      }
                      else {
                        // this.alertify.warning("Data not found");
                        // Swal.fire({
                        //   icon: 'warning',
                        //   title: 'Item',
                        //   text: "Data not found."
                        // });
                        // this.txtSearch.nativeElement.value = '';
                        // this.basketService.changeBasketResponseStatus(true);
                        let dataFilter = barcodeFilter ?? keyFilter;
                        let messageShow= "Data " + dataFilter + " not found ";
                        let url = this.authService.storeSelected().storeId +'/'+ dataFilter +'/' + customer;
                        let html = '<a target="_blank" href="/admin/tools/item-check/'+ url+'"> <i class="fas fa-question"></i> Why do I have this issue?</a>'
                      
                        if(plu?.length > 0)
                        {
                          html="";
                          messageShow= "Data (PLU) " + plu + "(" +dataFilter + ") not found ";
                        }
                        // else
                        // {
                        //   messageShow =  messageShow + '<br /> ' + html;
                        // }
                        
                        
                        Swal.fire({
                          icon: 'warning',
                          title: 'Item',
                          text: messageShow,
                          footer: html
                        }).then(() => {
                          // window.location.reload();
                          // this.txtSearch.nativeElement.focus();
                          this.txtSearch.nativeElement.value = '';
                          this.basketService.changeBasketResponseStatus(true);
                        });
                      }
            
                    }
                    else {
                      // this.getItemByBarcodeSplit(value);
                      this.alertify.warning(response.message);
                      this.txtSearch.nativeElement.value = '';
                      this.basketService.changeBasketResponseStatus(true);
                      console.log("add Item");
                    }
                  });
                }
                else
                {

                }
                
              
            
            }
          }
        // }
      
      
      }
      else
      {
        this.basketService.changeBasketResponseStatus(true);
      }
    }
    
    // else
    // {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Input data',
    //     text: "Please input value"
    //   });
    // }
    
  }
  
 

  barcodeSetup: SBarcodeSetup[];
   
  loadBarcodeList() {
    this.barcodeService.getAll(this.authService.getCurrentInfor().companyCode,'').subscribe((res:any) => {
      // loadItems
      // debugger;
      if(res.success)
      {
        if(res?.data!==null && res?.data!==undefined && res?.data?.length > 0)
        {
          this.barcodeSetup = res.data.filter(x=>x.status === 'A');
        }
       
      }
      else
      {
        this.alertify.warning(res.message);
      }
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      // this.alertify.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Barcode',
        text: "Can't get barcode"
      });
    });
  }
  basketDiscountTotal$: Observable<IBasketDiscountTotal>;
  showSerialExpand = false;
  showItemSerialComponent= false;
  itemSerialSelected;
  addNewItemToBasket(item, quantity) {
    let basket = this.basketService.getCurrentBasket();
    this.basketService.changeDiscountValue(basket, 0);
    let isReturn = basket.returnMode;
    let tmpItems = basket.tmpItems;
    let mode = basket.salesType;
    let check = false;
    debugger;
     
    quantity= isReturn ? -quantity : quantity;
    if (mode.toLowerCase() === "ex" || mode.toLowerCase() === "exchange" && isReturn) {
      if (tmpItems.some(x => x.id === item.itemCode && x.uom === item.uomCode)) {
        check = true;
      }
    }
    else {
      check = true;
    }
    if (check) {
      if (basket.customer !== null || basket !== undefined) {

        if (item.customField1 === "Member" || item.customField1 === "Class") {

          let itembasket = this.basketService.mapProductItemtoBasket(item, quantity);
          itembasket.memberValue = quantity;
          const initialState = {
            item: itembasket, title: 'Item Serial',

          };
          this.modalRef = this.modalService.show(ShopMemberInputComponent, {
            initialState, animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            ariaDescribedby: 'my-modal-description',
            ariaLabelledBy: 'my-modal-title',
            class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
          });
          setTimeout(() => {
            this.basketService.changeBasketResponseStatus(true);
          }, 100);
        }
        else {
          if (item.customField1 === "Card") {
            if (item.isSerial || item.isVoucher) {
              let itembasket = this.basketService.mapProductItemtoBasket(item, quantity);

              const initialState = {
                item: itembasket, title: 'Item Serial',
              };
              this.modalRef = this.modalService.show(ShopCardMemberInputComponent, { initialState });
              setTimeout(() => {
                this.basketService.changeBasketResponseStatus(true);
              }, 100);
            }
            else {
              let itembasket = this.basketService.mapProductItemtoBasket(item, quantity);
              itembasket.memberValue = quantity;
              const initialState = {
                item: itembasket, title: 'Item Serial',
              };
              this.modalRef = this.modalService.show(ShopCardInputComponent, { initialState });
              setTimeout(() => {
                this.basketService.changeBasketResponseStatus(true);
              }, 100);
            }

          }
          else {
            debugger;
            let type = "";
            if (basket.items.length > 0) {
              type = basket.items[0].customField4;
            }
            // if(type!==this.item.customField4 && type!== "")
            // {
            //    this.alertify.warning("Can't add different item type");
            // }
            // else
            // {
            // debugger;
            if (item.isBom) {
              this.bomService.GetByItemCode(this.authService.getCurrentInfor().companyCode, item.itemCode).subscribe((response: any) => {
                // debugger;
                this.basketService.addItemtoBasket(item, quantity, response.data);
              });
            }
            else {
              if (item.isSerial || item.isVoucher) {
                let itembasket = this.basketService.mapProductItemtoBasket(item, quantity);

                const initialState = {
                  item: itembasket, title: 'Item Serial',
                };
                if(this.showSerialExpand===false)
                {
                  this.modalRef = this.modalService.show(ShopItemSerialComponent, { initialState });
                  setTimeout(() => {
                    this.basketService.changeBasketResponseStatus(true);
                  }, 100);
                }
                else
                {
                  this.itemSerialSelected = itembasket;
                  this.showItemSerialComponent = true;
                  this.showTools = false;
                   this.commonService.changeShortcuts([], true);
                }
                
              }
              else {


                if ((item.capacityValue !== null && item.capacityValue !== undefined && item.capacityValue > 0)) {
                  Swal.fire({
                    title: 'Submit your quantity',
                    input: 'number',
                    inputAttributes: {
                      autocapitalize: 'off',
                      mode :mode
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Look up',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: () => !Swal.isLoading()
                  }).then((result) => {
                    if (result.isConfirmed) {
                      debugger;
                      let itembasket = this.basketService.mapProductItemtoBasket(item, quantity);
                      itembasket.quantity = isReturn ? -result.value : Math.abs(result.value);
                      itembasket.storeAreaId = '';
                      itembasket.timeFrameId = '';
                      itembasket.appointmentDate = '';
                      itembasket.isCapacity = true;
                      // 
                      const initialState = {
                        basketModel: itembasket, title: 'Item Capacity',
                      };
                      this.modalRef = this.modalService.show(ShopCapacityComponent, { initialState });
                    }
                  })

                }
                else {
                  this.basketService.addItemtoBasket(item, quantity);
                }

              }


            }

          }
        }

      }

    }
    if ((mode.toLowerCase() === "ex" || mode.toLowerCase() === "exchange") && isReturn && check === false) {
      this.alertify.warning("Item is not existed in the order");
      this.basketService.changeBasketResponseStatus(true);

    }
  }

}

