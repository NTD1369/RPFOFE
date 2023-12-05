import { Route } from '@angular/compiler/src/core';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { asyncScheduler, BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { MCustomer } from 'src/app/_models/customer';
import { MEmployee } from 'src/app/_models/employee';
import { Item } from 'src/app/_models/item';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { MStore } from 'src/app/_models/store';
import { TSalesLine } from 'src/app/_models/tsaleline';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { LoadingService } from 'src/app/_services/common/loading.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { EmployeeService } from 'src/app/_services/data/employee.service';
import { ItemService } from 'src/app/_services/data/item.service';
// import { SerialPort, SerialOptions } from "../../serial";
import { SerialPort } from 'src/app/serial';
import { Merchandise_categoryService } from 'src/app/_services/data/merchandise_category.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ShopExchangeItemListComponent } from '../tools/shop-exchange-item-list/shop-exchange-item-list.component';
import { TShiftHeader } from 'src/app/_models/tshiftheader';
import { Basket, IBasket, IBasketItem } from 'src/app/_models/system/basket';
import Swal from 'sweetalert2';
import { LocalStorageService } from 'src/app/_services/system/LocalStorage.service';
import { ShortcutService } from 'src/app/_services/data/shortcut.service';
import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { ExchangerateService } from 'src/app/_services/data/exchangerate.service';
import { MExchangeRate } from 'src/app/_models/exchangerate';
import { MStoreCurrency } from 'src/app/_models/storecurrency';
import { async } from '@angular/core/testing';
import { TInventoryHeader } from 'src/app/_models/inventory';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';
import { LicensePlateService } from 'src/app/_services/data/LicensePlate.service';
import { ResponsiveSlickModel } from '../shop-slick-item/shop-slick-item.component';
import { DxDropDownButtonComponent } from 'devextreme-angular';
// import { BarcodeScannerLivestreamComponent } from 'ngx-barcode-scanner';
enum LoadingIndicator {
  OPERATOR,
  MANUAL,
  ASYNC_PIPE
}
declare const navigator: any;
@UntilDestroy()
@Component({
  selector: 'app-shop-order',
  templateUrl: './shop-order.component.html',
  styleUrls: ['./shop-order.component.scss']
})
export class ShopOrderComponent implements OnInit, AfterViewInit {

  subscriptionText = "";
  manualText = "";
  LoadingIndicator = LoadingIndicator;
  hasLoaded: boolean = false;
  loadCounter = 1;
    
  settingLocal: ResponsiveSlickModel[] = [
    { breakpoint: 1, slidesPerView: 4,  slidesPerGroup: 4,      slidesPerColumn: 2},
    { breakpoint: 1430, slidesPerView: 4,  slidesPerGroup: 4,      slidesPerColumn: 3},
    { breakpoint: 1200, slidesPerView: 3,  slidesPerGroup: 3,      slidesPerColumn: 2}, 
    { breakpoint: 991, slidesPerView: 3,  slidesPerGroup: 3,      slidesPerColumn: 2}, 
    { breakpoint: 768, slidesPerView: 3,  slidesPerGroup: 3,      slidesPerColumn: 2},
    { breakpoint: 576, slidesPerView: 1,  slidesPerGroup: 1,      slidesPerColumn: 1},
  ];
  
  @Output() finishedLoading: EventEmitter<boolean> = new EventEmitter<boolean>();

  // this.loadingService.doLoading is a special method which behaves like an observable creation operator
  asyncText$ = this.loadingService.doLoading(
    // .delay(...) simulates network delay
    of(`Peek-a-boo ${this.loadCounter++}`).pipe(delay(4000)),
    this,
    LoadingIndicator.ASYNC_PIPE
  );
  detectModel;
  selectedIndex: number;
  display: false;
  items: ItemViewModel[];
  selectedCateFilter: string = "";
  merchandiseList: MMerchandiseCategory[];
  pagination: Pagination;
  userParams: any = {};
  modalRef: BsModalRef;
  licensePlate:string = "";
  isCheckLicensePlate:boolean = true;
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
  inventoryListTS: TInventoryHeader[];
  inventoryListTR: TInventoryHeader[];
  functionId = "Adm_Shop";
  async checkLicensePlate(){
    // debugger
    let checkAction =  this.authService.checkRole(this.functionId , 'isCheckLicensePlate', 'V');
  //   if (this.shiftService.getCurrentShip() !== null && this.shiftService.getCurrentShip() !== undefined) {
  //   let basket = this.basketService.getBasketLocal();
  //   let saleMode = '';
  //   this.route.params.subscribe(data => {
  //     saleMode = data['m']; 

  //   })
  //   if(checkAction && (basket===null || basket === undefined || basket?.items?.length==0 )&& saleMode !== 'return' && saleMode !== 'exchange' && saleMode !== 'ex')
  //   {
  //     Swal.fire({
  //       title: 'Submit your License Plate Number',
  //       input: 'text',
  //       inputAttributes: {
  //         autocapitalize: 'off'
  //       },
  //       showCancelButton: true,
  //       confirmButtonText: 'Check License Plate',
  //       showLoaderOnConfirm: true,
  
  //       allowOutsideClick: () => !Swal.isLoading()
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //        let valueCheck = result.value.replace(/\s/g, "");
  //        if(valueCheck?.length > 0)
  //        {
  //          this.LicensePlate.checkLicensePlate(this.authService.getCurrentInfor().companyCode,valueCheck,1).subscribe((x:any)=>
  //           {
  //             if(x.success ==true)
  //             {
  //               this.licensePlate = valueCheck;
  //               let basket = this.basketService.getBasketLocal();
  //               basket.custom1 = this.licensePlate;
  //               this.basketService.setBasket(basket);
  //               // this.item.custom1 = valueCheck;
  //               // this.basketService.addItemtoBasket(this.item, isReturn ? -1 : 1);
  //               // this.items = this.items.filter(x=>x.custom1 == 'debt');
  //               // this.saveItems = null;
  //               this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', "", null, true,true)
  //             }
  //             else if(x.Message!=null || x.Message!=undefined|| x.Message!='' )
  //             {
  //               this.alertify.error("License Plate Not Found or too many times used today")
  //              setTimeout(() => {
  //               window.location.reload();
  //              }, 1000);
  //             }
  //             else{
  //               this.alertify.error(x.Message);
  //               this.licensePlate = "";
  //               setTimeout(() => {
  //                 window.location.reload();
  //                }, 1000);
  //             }
  //           })
  //        }
  //        }
  //        else
  //        {
  //         this.licensePlate = "";
  //        }
        
  //     })
  //   }
  // }
 }
  newOrder(noRedirect?) {
    let store = this.authService.storeSelected();
    let currentType = "Retail";
    // debugger;
    const basket = this.basketService.getCurrentBasket();
    if (basket !== null && basket !== undefined) {

      this.basketService.deleteBasket(basket).subscribe(() => {
        

      });
      let cus = this.authService.getDefaultCustomer();
      // debugger;
      if (cus !== null && cus !== undefined) {
        setTimeout(() => {
          this.basketService.changeCustomer(cus, currentType);
          // this.route.navigate(['/shop/order']);
          if(noRedirect !== true)
          {

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
          // this.routeNav.navigate(['/shop/order']).then(() => {
          //   // window.location.reload();
          // });
        }, 2);
      }
    }
    else {
      let cus = this.authService.getDefaultCustomer();
      // debugger;
      if (cus !== null && cus !== undefined) {
        setTimeout(() => {
          this.basketService.changeCustomer(cus, currentType);
          // this.route.navigate(['/shop/order']);
          if(noRedirect !== true)
          {
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
        
          // this.routeNav.navigate(['/shop/order']).then(() => {
          //   // window.location.reload();
          // });
        }, 2);
      }

    }


  }
  PopupCenter(url, title, w, h, opts) {
    var _innerOpts = '';
    if(opts !== null && typeof opts === 'object' ){
        for (var p in opts ) {
            if (opts.hasOwnProperty(p)) {
                _innerOpts += p + '=' + opts[p] + ',';
            }
        }
    }
    debugger;
      // Fixes dual-screen position, Most browsers, Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenLeft;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenTop;
 
    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
 
    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;

    var dualleft = w;
    var dualtop = 0;
    // + ', top=' + top + ', left=' + left
    var newWindow = window.open(url, title, _innerOpts + ' width=' + window.screen.availWidth + ', height=' + screen.availHeight+ 
    ', top=' + dualtop + ', left=' + dualleft);
    debugger;
 // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
       
    }
    // this.elem = newWindow.document.documentElement;
    // this.openFullscreen();
 }
 elem ;
 openFullscreen() {
  if (this.elem.requestFullscreen) {
    this.elem.requestFullscreen();
  } else if (this.elem.mozRequestFullScreen) {
    /* Firefox */
    this.elem.mozRequestFullScreen();
  } else if (this.elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    this.elem.webkitRequestFullscreen();
  } else if (this.elem.msRequestFullscreen) {
    /* IE/Edge */
    this.elem.msRequestFullscreen();
  }`]`
}
//  fullScreen() {
//   let elem = document.documentElement;
//   let methodToBeInvoked = elem.requestFullscreen ||
//     elem.webkitRequestFullScreen || elem['mozRequestFullscreen']
//     ||
//     elem['msRequestFullscreen'];
//   if (methodToBeInvoked) methodToBeInvoked.call(elem);
// }
 @HostListener('window:storage', ['$event'])
 onStorageChange(ev: StorageEvent) {
   // debugger;
    // console.log(ev.key);
    // console.log(ev.newValue);  
    this.updatedStatus = ev.newValue;
       
 }
 multipleScreenPopup(url, title, w, h, centered = true, moveRight = 0, moveDown = 0, resizable = "no") {
  // Fixes dual-screen position                         Most browsers      Firefox
  var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.width;
  var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.height;

  var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  var left = 0;
  var top = 0;
  if (centered === true) {
    left = ((width / 2) - (w / 2)) + dualScreenLeft;
    top = ((height / 2) - (h / 2)) + dualScreenTop;
  } else {
    left = dualScreenLeft + moveRight;
    top = dualScreenTop + moveDown;
  }

  var newWindow = window.open(url, title, 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=' + resizable + ', width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus();
    }

}


  openWindow() {

    this.multipleScreenPopup('https://yahoo.com', '_blank', 500, 500, false, 2100, 200);
    // this.elem = document.documentElement;
    // this.openFullscreen();
    // let num = parseFloat(this.updatedStatus) + 1 ;
    // let numstr = num.toString();
    // this.localStorage.setStatus(numstr);
    // this.localStorage.watchStorage().subscribe(() => {
    //   this.updatedStatus = this.localStorage.getStatus();
    //   console.log(this.updatedStatus);
    // })  
    // debugger;
    // var w = window.screen[2].width;
    // var h = 300;
    // var left = 1800;// (window.screen.width/2)-(w/2);
    // var top = (window.screen.height/2)-(h/2);
    
    // var win = window.open("http://www.google.com'", "_blank", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h);
    // win.moveTo(left, top);
    // this.PopupCenter('http://www.google.com','google.com','900','500', {toolbar:1, resizable:1, location:1, menubar:1, status:1}); 
    // var width = 650;
    // var left = 200;

    // left += window.screenX;

    // window.open("/shop",'windowName','resizable=1,scrollbars=1,fullscreen=0,height=200,width=' + width + '  , left=' + left + ', toolbar=0, menubar=0,status=1');    
    // return 0;

}

@ViewChild('input') input: ElementRef;  

@HostListener("window:resize", [])
public onResize() {
  this.detectScreenSize();
}
heightScreen = 0;
widthScreen = 0;
previewModel;
preview(slidesPerView, slidesPerColumn)
{
   let detectX = this.settingFnBList.find(x =>x.breakpoint === this.detectModel.breakpoint);
   detectX.slidesPerView = slidesPerView;
   detectX.slidesPerColumn = slidesPerColumn;
   this.previewModel = this.settingFnBList;
   
   this.refreshSlickSlider();
}
savePreview()
{ 
  setTimeout(() => {   
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        sessionStorage.removeItem('fnbSettingDisplay');
        setTimeout(() => {  
          debugger;
          sessionStorage.setItem('fnbSettingDisplay', JSON.stringify(this.previewModel));  
         
          setTimeout(() => {   
            window.location.reload();
          }, 100);
        }, 100);
      }
    })
  }, 50);
  
 
}
reloadPage()
{
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to dispose!',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.value) {
      setTimeout(() => {   
        window.location.reload();
      }, 50);
    }
  })
  
}
private detectScreenSize() {
    this.heightScreen = window.innerHeight;
    this.widthScreen = window.innerWidth;
    this.settingFnBList.forEach(element => {
      element.detected = false;
    });
    let detected =  this.settingFnBList.filter(x=>x.breakpoint < this.widthScreen).sort((a, b) => a.breakpoint < b.breakpoint ? 1 : -1)[0];
    detected.detected = true;
    this.detectModel = detected;
}
shortcuts: ShortcutInput[] = [];  
isMarkupDesign =  false;
@ViewChild(KeyboardShortcutsComponent) private keyboard: KeyboardShortcutsComponent;  

  storeSelected: MStore;
  VirtualKey$: Observable<boolean>;
  settingFnBList;
  onToolbarPreparing(e) {
    if (this.authService.checkRole(this.functionId, '', 'I')) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: "Save",
          onClick: this.saveSetting.bind(this)
        }
      });
    }
  }
  saveSetting()
  { 
    setTimeout(() => {   
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          sessionStorage.removeItem('fnbSettingDisplay');
          setTimeout(() => {  
            debugger;
            sessionStorage.setItem('fnbSettingDisplay', JSON.stringify(this.settingFnBList));  
           
            setTimeout(() => {   
              window.location.reload();
            }, 100);
          }, 100);
        }
      })
    }, 50);
    
   
  }
  constructor(public loadingService: LoadingService, private rateService: ExchangerateService,  private shortcutService: ShortcutService, private localStorage: LocalStorageService, private modalService: BsModalService, public mwiService: MwiService, public commonService: CommonService, private customerService: CustomerService, public authService: AuthService, private shiftService: ShiftService,
    private itemService: ItemService, private merchandiseService: Merchandise_categoryService, private basketService: BasketService, private alertify: AlertifyService,
    private billService: BillService, private route: ActivatedRoute, private routeNav: Router,private inventory: InventoryService,private LicensePlate: LicensePlateService) { 
    //  debugger;
      let settingFnB =    JSON.parse(sessionStorage.getItem("fnbSettingDisplay"));
      if(settingFnB===null || settingFnB===undefined || settingFnB?.length === 0 )
      {
        sessionStorage.setItem('fnbSettingDisplay', JSON.stringify(this.settingLocal)); 
      } 
      else
      {
        this.settingFnBList =  JSON.parse(sessionStorage.getItem("fnbSettingDisplay"));
        // this.settingFnBList = this.settingFnBList.filter(x=>x.breakpoint != 1);
        
      }
      this.selectedIndex = 0;

    
    }
    shortCutList : any=[];
   
    onTabDragStart(e) {
      e.itemData = e.fromData[e.fromIndex];
    }
  
    onTabDrop(e) {
      e.fromData.splice(e.fromIndex, 1);
      e.toData.splice(e.toIndex, 0, e.itemData);
    }
  
    addButtonHandler() {
      // const newItem = this.allEmployees.filter(employee => this.employees.indexOf(employee) === -1)[0];
  
      // this.selectedIndex = this.employees.length;
      // this.employees.push(newItem);
    }
    GetDateFormat(date) {
      var month = (date.getMonth() + 1).toString();
      month = month.length > 1 ? month : '0' + month;
      var day = date.getDate().toString();
      day = day.length > 1 ? day : '0' + day;
      return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
    }
    exchangeRateNull: MExchangeRate []= [];
  loadExchangeRateIsNull()
  {
    let datevl=this.GetDateFormat(new Date());
    this.rateService.getExchangeRateIsNullByDate(this.storeSelected.companyCode, this.storeSelected.storeId,datevl ).subscribe((response: any) =>{
      if(response.success)
      {
        this.exchangeRateNull = response.data;
      }
      else
      {
        this.alertify.warning(response.message);
      }
     
    });
  }
  port: any;
  ignorePoleDisplay=true;
  isSerialPortPoleOpen= false;
   
  ngAfterViewInit() {
    // 
    this.detectScreenSize();
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function (item) {
      // Do stuff here
      if (item !== null && item !== undefined) {
        item.classList.remove('hide');
        item.classList.add('show');
      }
    });
 
    // this.shortcuts.push(
    //   {
    //     key: "?",
    //     label: "Help",
    //     description: "Question mark",
    //     command: (e) => console.log("question mark clicked", { e }),
    //     preventDefault: true
    //   },
    //   // {
    //   //   key: ["up up down down left right left right b a enter"],
    //   //   label: "Sequences",
    //   //   description: "Konami code!",
    //   //   command: (output: ShortcutEventOutput) =>
    //   //     console.log("Konami code!!!", output)
    //   // },
    //   {
    //     key: ["cmd + b"],
    //     label: "Help",
    //     description: "Cmd + b",
    //     command: (e) => console.log(e),
    //     preventDefault: true
    //   },
      
    //   // {
    //   //   key: ["f5"],
    //   //   label: "Alo",
    //   //   description: "F5",
    //   //   command: (e) => {console.log(e)} ,
    //   //   preventDefault: true
    //   // }
    //   )
    // paymentMenu
    // this.barcodeScanner.start();

    //  if(this.poleDisplay==='true')
    //   {
        // this.connectSerial();
      // }
      if(this.poleDisplay==='true')
      {
        if(this.poleDisplayType?.toLowerCase()==='serialport')
        {
          this.commonService.connectSerial();
        } 
      }
      
  }
  updatedStatus= "1";
  refreshSubscription(): void {
    this.subscriptionExample();
  }

  refreshManual(): void {
    this.manualExample();
  }

  protected subscriptionExample(): void {
    this.loadingService
      .doLoading(
        of(`Peek-a-boo ${this.loadCounter++}`).pipe(delay(2000)),
        this,
        LoadingIndicator.OPERATOR
      )
      .pipe(untilDestroyed(this))
      .subscribe(text => (this.subscriptionText = text));
  }

  protected manualExample(): void {
    this.loadingService.startLoading(this, LoadingIndicator.MANUAL);

    // In case you need to mock your observables using of(...),
    // don't forget to make them async-scheduled in manual scenarios!
    of(`Peek-a-boo ${this.loadCounter++}`, asyncScheduler)
      .pipe(
        delay(6000),
        untilDestroyed(this)
      )
      .subscribe(text => {
        this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
        this.manualText = text;
      });
  }
  orderId: string = "";
  order: Order;
  checkCustomerInfor = true;
  async setItemToBasket(order) {
   let Lines = [];
    var newArray = []; 
    debugger;
    if( order.dataSource !== null &&  order.dataSource !== undefined  && order.dataSource !== "" && order.dataSource !== "POS")
    {
      this.basketService.changeDataSource(order.dataSource);
    }
    if( order.dataSource === "POS" &&  order.contractNo !== null &&  order.contractNo !== undefined  && order.contractNo?.length > 0 )
    {
      if( order.customF1 !== null &&  order.customF1 !== undefined  && order.customF1?.length > 0)
      {
        this.basketService.changeContract(order.contractNo, order.customF1 );
      } 
    }
    let basket = this.basketService.getBasketLocal();
    basket.saleschannel = this.order?.salesChanel;
    this.basketService.setBasket(basket);
    order.lines.forEach(val => newArray.push(Object.assign({}, val))); 
    newArray = newArray.filter(x=>x?.promotionIsPromo!=='1');
    let itemNum =0;
    for (let i = 0; i < newArray.length; i++) {
      try {
        // here candidate data is inserted into  
        let  item = newArray[i];
        // debugger;
        if(item.barCode===null || item.barCode===undefined)
        {
          item.barCode = '';
        } 
          await this.itemService.getItemFilter(this.storeSelected.companyCode, this.storeSelected.storeId, item.itemCode, item.uomCode, item.barCode,
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', this.order.cusGrpId,'' ,'','','').subscribe((response: any) => {
          debugger;
          itemNum++;
            if(response.success)
            {
              
                 let itemX = response.data[0];
              
                if (item.slocId !== undefined && item.slocId !== null) {
                  itemX.slocId = item.slocId;
                }
                else {
                  itemX.slocId = this.storeSelected.whsCode;
                }
                
                let itembasket = this.basketService.mapProductItemtoBasket(itemX, 1);
                // debugger;
                itembasket.weightScaleBarcode = item.weightScaleBarcode;
                if (itembasket.productName === null || itembasket.productName === undefined) {
                  itembasket.productName = itemX.itemDescription;
                }
                itembasket.lineItems = [];
                let BOMLine = item.lines;
                // debugger;
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
                  // if(item?.appointmentDate===null || item?.appointmentDate === undefined || item?.appointmentDate?.toString() === "")
                  // {
                  //   item.appointmentDate = new Date();
                  // }
                  // if(item?.timeFrameId===null ||item?.timeFrameId === undefined || item?.timeFrameId?.toString() === "")
                  // {
                  //   item.timeFrameId = new Date();
                  // }
                  // if(item?.storeAreaId===null || item?.storeAreaId === undefined || item?.storeAreaId?.toString() === "")
                  // {
                  //   item.storeAreaId = this.authService.storeSelected().sto
                  // }
                  itembasket.appointmentDate = item?.appointmentDate?.toString();
                  itembasket.timeFrameId = item?.timeFrameId?.toString();
                  itembasket.storeAreaId = item?.storeAreaId?.toString();
                  itembasket.quantity = item.openQty;
                  itembasket.note = item?.remark;
        
                }
                
                itembasket.prepaidCardNo = item?.prepaidCardNo;
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

                if(item.lineTotalBefDis === null || item.lineTotalBefDis === undefined  )
                {
                   item.lineTotalBefDis = item.quantity * item.price;
                  //  if(isChecked)
                  //  {
                  //    item.lineTotalBefDis = itembasket.quantity * item.price; 
                  //  }
                }
                if(item.lineTotalDisIncludeHeader === null || item.lineTotalDisIncludeHeader === undefined  )
                {
                  if(order.discountAmount !== null && order.discountAmount !== undefined && order.discountAmount !== 0)
                  {
                    
 
                      if (order.discountRate !== null && order.discountRate !== undefined && order.discountRate != 0) {
                        let discountVl = (item.lineTotal * order.discountRate / 100);
                        item.lineTotalDisIncludeHeader = item.lineTotal - this.authService.roundingValue(discountVl, "RoundUp" , 2);
                      } 
                  }
                  else
                  {
                    item.lineTotalDisIncludeHeader = item.lineTotalBefDis - item.discountAmt;
                  }
                    
                   
                }
                

                // debugger;
                let lineTotal = item.lineTotal;// item.quantity * item.price;
                let discountAmountLine = item.discountAmt ? item.discountAmt : 0;
                // let discountAmountLineAfterDis =lineTotal - item.discountAmt;
                debugger;
                

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

                // itembasket.price = itemX.price;
                // ẩn cái này đi
                // itembasket.lineTotal = itembasket.price * itembasket.quantity;
                
                // Mới thêm vào 
                itembasket.price = item.price; 
                itembasket.promotionLineTotal = itembasket.promotionPriceAfDis * itembasket.quantity; 


                debugger;
                // ẩn cái đống này đi 2022/07/20
                // let value = 0;
                // if(item.lineTotalDisIncludeHeader!==null && item.lineTotalDisIncludeHeader!== undefined )
                // {
                //   value= this.authService.roundingAmount(item.lineTotalDisIncludeHeader) / item.quantity;
                //   itembasket.promotionPriceAfDis = value;
                //   itembasket.promotionLineTotal = this.authService.roundingAmount(item.lineTotalDisIncludeHeader);
                // }
                // else
                // {
                  
                //   value= this.authService.roundingAmount(item.lineTotal) / item.quantity;
                //   itembasket.promotionPriceAfDis = value;
                //   itembasket.promotionLineTotal = this.authService.roundingAmount(item.lineTotal);
                // }
                // hết ẩn cái đống này đi 2022/07/20

                // let value1 = value / 10 ;
                // let value2 = this.authService.roundingAmount(value1);
                // let value3 = value2 * 10;
              

                
                // itembasket.price = item.price;
                // itembasket.promotionPriceAfDis = item.lineTotalDisIncludeHeader / item.quantity;
                // itembasket.promotionLineTotal = item.lineTotalDisIncludeHeader / item.quantity;
            
                //ẩn cái đống này đi 2022/07/20
                // itembasket.discountType = item.discountType === null || item.discountType === undefined ? "" : item.discountType;
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
                // itembasket.promotionDisAmt = item.discountAmt / item.quantity;
                // itembasket.promotionDisPrcnt = item.discountRate;
                // itembasket.promotionDiscountPercent = item.discountRate;

                // itembasket.promotionIsPromo = item.isPromo;
                // itembasket.salesTaxCode = item.taxCode;
                // itembasket.salesTaxRate = item.taxRate;
                // itembasket.taxAmt = item.taxAmt;
                // itembasket.promotionType = item.promoType;
                // itembasket.baseLine = item.lineId;
                // itembasket.baseTransId = item.transId;
                 //hết ẩn cái đống này đi 2022/07/20

                // mới thêm vào 2022/07/20
                itembasket.discountType = item.discountType === null || item.discountType === undefined ? "" : item.discountType;

                if(itembasket.discountType === null || itembasket.discountType === undefined || itembasket.discountType === "")
                {
                  itembasket.discountType = 'Discount Percent'
                }
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
                itembasket.promotionDisAmt = item.discountAmt / item.quantity;
                itembasket.promotionDisPrcnt = item.discountRate;
                itembasket.promotionDiscountPercent = item.discountRate;

            
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
        
                // this.basketService.addItemBasketToBasket(itembasket,  itembasket.quantity); 
                Lines.push(itembasket);
                // console.log('Lines', Lines);
                // return itembasket;
               
                if(itemNum>=newArray.length)
                { 
                  debugger;
                  if(this.backToOrderWithoutPromotion!=="true")
                  { 
                    this.basketService.addItemListBasketToBasket(Lines, false);  
                    let basket = this.basketService.getCurrentBasket();
                    this.basketService.applyPromotion(basket); 
                  } 
                  else
                  {
                    let basket = this.basketService.getCurrentBasket();
                    let newBasket = false;
                    if(basket===null || basket === undefined)
                    {
                      newBasket = true;
                      this.newOrder(true);
                    }
                    if(newBasket)
                    {
                      setTimeout(() => {
                        basket = this.basketService.getCurrentBasket();

                        if(order?.discountAmount!==null && order?.discountAmount!==undefined && order?.discountAmount!== 0 )
                        {
                          basket.discountType = order?.discountType;
                          if(order.discountType === "Discount Amount")
                          { 
                            basket.discountValue = order?.discountAmount;
                          }
                          else
                          {
                            basket.discountValue = order?.discountPercent;
                          } 
                          
                        } 
                        this.basketService.setBasket(basket);
                        this.basketService.addItemListBasketToBasket(Lines, false);  
                      }, 100);
                    
                    }
                    else
                    {
                      if(order?.discountAmount!==null && order?.discountAmount!==undefined && order?.discountAmount!== 0 )
                      {
                        basket.discountType = order?.discountType;
                        if(order.discountType === "Discount Amount")
                        { 
                          basket.discountValue = order?.discountAmount;
                        }
                        else
                        {
                          basket.discountValue = order?.discountPercent;
                        } 
                        
                      } 
                      this.basketService.setBasket(basket);
                      this.basketService.addItemListBasketToBasket(Lines, false);  
                    }
                  
                  
                    
                  } 
                  setTimeout(() => {
                    this.basketService.changeBasketResponseStatus(true);
                    debugger;
                    if(order?.contractNo !==null && order?.contractNo!==undefined && order?.contractNo !== '')
                    {
                      this.basketService.changeContract(order?.contractNo);
                    }
                  }, 100);
                
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
    
           
  
        });
        // insertResponse
        // and response need to be added into final response array 
        // console.log('insertResponse', insertResponse.ToPromise());
        // console.log('Lines', Lines);
        // generatedResponse.push(insertResponse)
      } catch (error) {
        console.log('error');
      }
    }

   
    // lines.forEach(async item => {

    //   // && x.barCode === item.barCode
    //   let itemX = this.items.find(x => x.itemCode === item.itemCode && x.uomCode === item.uomCode);
    //   // debugger;
    //   if (itemX !== null && itemX !== undefined) {
    //     // let infor=ressponse[0];
    //     if (item.slocId !== undefined && item.slocId !== null) {
    //       itemX.slocId = item.slocId;
    //     }
    //     else {
    //       itemX.slocId = this.storeSelected.whsCode;
    //     }
    //     let itembasket = this.basketService.mapProductItemtoBasket(itemX, 1);
    //     if (itembasket)
    //       if (itembasket.productName === null || itembasket.productName === undefined) {
    //         itembasket.productName = itemX.itemDescription;
    //       }
    //     if (itembasket.isCapacity) {
    //       itembasket.appointmentDate = item.appointmentDate.toString();
    //       itembasket.timeFrameId = item.timeFrameId.toString();
    //       itembasket.storeAreaId = item.storeAreaId.toString();
    //       itembasket.quantity = item.quantity;
    //       itembasket.note = item.remark;
    //       //   if(this.basketModel.appointmentDate.toString()===''||this.basketModel.appointmentDate===null)
    //       // {
    //       //   str+=" Appointment date,";
    //       // }
    //       // if(this.basketModel.timeFrameId.toString()===''||this.basketModel.timeFrameId===null)
    //       // {
    //       //   str+=" Time Frame,";
    //       // }
    //       // if(this.basketModel.storeAreaId.toString()===''||this.basketModel.storeAreaId===null)
    //       // {
    //       //   str+=" Store Area,";
    //       // }
    //       // if(this.basketModel.quantity.toString()===''||this.basketModel.quantity===null)
    //       // {
    //       //   str+=" Quantity,";
    //       // }
    //     }
    //     itembasket.prepaidCardNo = item.prepaidCardNo;
    //     // itembasket.appointmentDate = item.appointmentDate.toString();
    //     // itembasket.storeAreaId = item.storeAreaId;
    //     // itembasket.timeFrameId= item.timeFrameId;
    //     itembasket.isSerial = item.isSerial;
    //     itembasket.isVoucher = item.isVoucher;
    //     itembasket.memberDate = item.memberDate;
    //     itembasket.memberValue = item.memberValue;
    //     itembasket.startDate = item.startDate;
    //     itembasket.endDate = item.endDate;
    //     itembasket.itemType = item.itemType;
    //     itembasket.price = item.price;
    //     itembasket.discountType = item.discountType;
    //     itembasket.discountValue = item.discountAmt;
    //     itembasket.promotionIsPromo = item.isPromo;
    //     itembasket.salesTaxCode = item.taxCode;
    //     itembasket.salesTaxRate = item.taxRate;
    //     itembasket.taxAmt = item.taxAmt;
    //     itembasket.promotionType = item.promoType;
    //     itembasket.promotionType = item.promoType;

    //     // let itemMap = this.basketService.addItemBasketToBasketNoPromotion(itembasket,  item.quantity);
    //     Lines.push(itembasket);
    //     // this.basketService.addItemBasketToBasket(itembasket,  item.quantity);
    //     // console.log(ressponse[0]);
    //     // this.basketService.addItemtoBasket(itemX, item.quantity);
    //   }
      
    // });
    debugger;
    // if (Lines !== null && Lines !== undefined) {
    //   // debugger;
    //   this.basketService.addItemListBasketToBasket(Lines);
    // }
  }
  // lines: TSalesLine[]
  async setItemExchangeToBasket(order) {
    let Lines = [];
    // debugger;

    for (let i = 0; i < order.lines.length; i++) {
      try {
        // here candidate data is inserted into  
        let  item = order.lines[i];
        debugger;
          await this.itemService.getItemFilter(this.storeSelected.companyCode, this.storeSelected.storeId, '', '', item.barCode,
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', this.order.cusGrpId,'' ,'','','').subscribe((response: any) => {
          debugger;
          if(response.success)
            {
              
            let itemX = response.data[0];
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
                        bomLine.quantity = -line.quantity;
                        bomLine.uom = line.uomCode;
                        bomLine.price = line.price;
                        bomLine.lineTotal = -line.lineTotal;
                        itembasket.lineItems.push(bomLine);
                      });
                    } 
                    itembasket.quantity = -item.openQty;
                    itembasket.openQty = item.openQty;
                    if (itembasket.isCapacity) {
                      itembasket.appointmentDate = item.appointmentDate.toString();
                      itembasket.timeFrameId = item.timeFrameId.toString();
                      itembasket.storeAreaId = item.storeAreaId.toString();
                      itembasket.quantity = -item.openQty;
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
    
                    itembasket.promotionIsPromo = item.isPromo;
                    itembasket.salesTaxCode = item.taxCode;
                    itembasket.salesTaxRate = item.taxRate;
                    itembasket.taxAmt = item.taxAmt;
                    itembasket.promotionType = item.promoType;
                    itembasket.baseLine = item.lineId;
                    itembasket.baseTransId = item.transId;
                    
 

                    
                    Lines.push(itembasket);
                    // return itembasket;
                  }
                  else
                  {
                    this.alertify.warning('Item' + itemX.itemName + " can't return.");
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

    console.log('complete all', Lines ) ;// gets loged first
    debugger;
    if (this.exchangeItemMode.replace(' ', '') === 'FromOrder') {
     
        // this.itemBasketReturn = Lines as IBasketItem[];

   
      // debugger;
      console.log(Lines);
      const initialState = {
        items: Lines, title: 'Exchange Items',
      };
      this.modalRef = this.modalService.show(ShopExchangeItemListComponent, {
        initialState, animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
      });
      this.modalRef.content.outEvent.subscribe((receivedEntry) => {
        console.log('result', receivedEntry);
        debugger;
        if (receivedEntry !== null && receivedEntry != undefined) {
          this.modalRef.hide();
          if (receivedEntry.success === false) {
            this.newOrder();
          }
          else
          {
            console.log('result', receivedEntry.models);
            this.basketService.addItemListBasketToBasket(receivedEntry.models, false);
            this.basketService.calculateBasket();
            // this.basketService.addItemListBasketToTmpItemsBasket(Lines); 
            // receivedEntry.models.forEach(item => {
            //   this.onEnter(item.barcode);
            // });
            
          }
        }
      });


    }
    else {
      // this.exchangeItemsList =Lines;
    
      // this.basketService.addItemListBasketToTmpItemsBasket(Lines); 
      this.basketService.addItemListBasketToBasket(Lines, false);
      this.basketService.calculateBasket();
        // this.itemBasketReturn = Lines as IBasketItem[];

    

    }

    // if(this.items===null || this.items===undefined)
    // {
    //   this.alertify.warning('items not loaded');
      
    // }
    // else
    // {
    //   order.lines.forEach(async item => {
    //     // debugger;
    //    // && x.barCode === item.barCode
    //    let itemX = this.items.find(x => x.itemCode === item.itemCode && x.uomCode === item.uomCode);
    //    // debugger;
    //    // if (itemX !== null && itemX !== undefined && item.openQty > 0) {
    //    if (itemX !== null && itemX !== undefined  && item.openQty > 0 && (item.itemType.toLowerCase() === 'retail' || item.itemType.toLowerCase() === 'r')) {
    //      // let infor=ressponse[0];
 
    //      if (item.slocId !== undefined && item.slocId !== null) {
    //        itemX.slocId = item.slocId;
    //      }
    //      else {
    //        itemX.slocId = this.storeSelected.whsCode;
    //      }
    //      let itembasket = this.basketService.mapProductItemtoBasket(itemX, 1);
    //      if (itembasket.productName === null || itembasket.productName === undefined) {
    //        itembasket.productName = itemX.itemDescription;
    //      }
    //      itembasket.lineItems = [];
    //      let BOMLine = item.lines;
    //     //  debugger;
    //      if(BOMLine!==null && BOMLine!==undefined)
    //      {
    //        BOMLine.forEach(line => {
    //          let bomLine = new IBasketItem ();
    //          bomLine.id = line.itemCode;
    //          bomLine.productName = line.itemName;
    //          bomLine.quantity = -line.quantity;
    //          bomLine.uom = line.uomCode;
    //          bomLine.price = line.price;
    //          bomLine.lineTotal = -line.quantity;
    //          itembasket.lineItems.push(bomLine);
    //        });
    //      } 
    //      itembasket.quantity = -item.openQty;
    //      // itembasket.openQty=item.openQty;
    //      if (itembasket.isCapacity) {
    //        itembasket.appointmentDate = item.appointmentDate.toString();
    //        itembasket.timeFrameId = item.timeFrameId.toString();
    //        itembasket.storeAreaId = item.storeAreaId.toString();
    //        itembasket.quantity = -item.openQty;
    //        itembasket.note = item.remark;
 
    //      }
         
    //      itembasket.prepaidCardNo = item.prepaidCardNo;
    //      // itembasket.appointmentDate = item.appointmentDate.toString();
    //      // itembasket.storeAreaId = item.storeAreaId;
    //      // itembasket.timeFrameId= item.timeFrameId;
    //      itembasket.isSerial = item.isSerial;
    //      itembasket.isVoucher = item.isVoucher;
    //      itembasket.memberDate = item.memberDate;
    //      itembasket.memberValue = item.memberValue;
    //      itembasket.startDate = item.startDate;
    //      itembasket.endDate = item.endDate;
    //      itembasket.itemType = item.itemType;
    //      itembasket.price = item.price;
 
    //      let lineTotal = item.quantity * item.price;
    //      let discountAmountLine = item.discountAmt ? item.discountAmt : 0;
    //      // let discountAmountLineAfterDis =lineTotal - item.discountAmt;
 
    //      let discountTongBill = order.discountRate;
    //      if (discountAmountLine > 0) {
 
    //        let xRs = lineTotal - discountAmountLine;
    //        let resultLine = (xRs - (xRs * discountTongBill / 100)) / item.quantity;
    //        // resultLine= Math.abs(resultLine);
    //        itembasket.price = item.price;
    //        itembasket.promotionPriceAfDis = resultLine;
    //        itembasket.promotionLineTotal = itembasket.quantity * resultLine;
    //      }
    //      else {
 
    //        let resultLine = (lineTotal - (lineTotal * discountTongBill / 100)) / item.quantity;
    //        // resultLine= Math.abs(resultLine);
    //        itembasket.price = item.price;
    //        itembasket.promotionPriceAfDis = resultLine;
    //        itembasket.promotionLineTotal = itembasket.quantity * resultLine;
    //      }
    //      itembasket.discountType = item.discountType === null || item.discountType === undefined ? "" : item.discountType;
    //      if (itembasket.discountType === 'Discount Percent') {
    //        itembasket.discountValue = item.discountRate;
    //      }
    //      if (itembasket.discountType === 'Discount Amount') {
    //        itembasket.discountValue = item.discountAmt;
    //      }
    //      if (itembasket.discountType === 'Fixed Quantity') {
    //        itembasket.discountValue = item.discountAmt;
    //      }
    //      if(itembasket.discountType === 'Fixed Price')
    //      {
    //        itembasket.discountValue = item.discountAmt;
    //      }
         
 
 
    //      // itembasket.discountType = item.discountType;
    //      // itembasket.discountValue = item.discountAmt;
    //      itembasket.promotionIsPromo = item.isPromo;
    //      itembasket.salesTaxCode = item.taxCode;
    //      itembasket.salesTaxRate = item.taxRate;
    //      itembasket.taxAmt = item.taxAmt;
    //      itembasket.promotionType = item.promoType;
    //      itembasket.baseLine = item.lineId;
    //      itembasket.baseTransId = item.transId;
    //      // this.basketService.addItemBasketToBasket(itembasket,  -item.openQty);
    //      // debugger;
    //      Lines.push(itembasket);
    //    }
 
    //  });
 
    //  // debugger;
    
    // }
    // if (Lines !== null && Lines !== undefined && Lines.length > 0) {
    //   if (this.exchangeItemMode.replace(' ','') === 'FromOrder') {
    //     // debugger;
    //     this.basketService.addItemListBasketToBasket(Lines, false);
    //     this.basketService.calculateBasket();
    //     // debugger;
    //     console.log(Lines);
    //     const initialState = {
    //       items: Lines, title: 'Item Serial',
    //     };
    //     this.modalRef = this.modalService.show(ShopExchangeItemListComponent, {
    //       initialState, animated: true,
    //       keyboard: true,
    //       backdrop: true,
    //       ignoreBackdropClick: true,
    //       ariaDescribedby: 'my-modal-description',
    //       ariaLabelledBy: 'my-modal-title',
    //       class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
    //     });
    //     this.modalRef.content.outEvent.subscribe((receivedEntry) => {
    //       console.log('result', receivedEntry);
    //       if (receivedEntry !== null && receivedEntry != undefined) {
    //         this.modalRef.hide();
    //         if (receivedEntry === false) {
    //           this.newOrder();
    //         }

    //       }
    //     });


    //   }
    //   else {
    //     // this.exchangeItemsList =Lines;
    //     this.basketService.addItemListBasketToTmpItemsBasket(Lines);

    //   }

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
    //       this.clearOrder();
    //     } else if (result.dismiss === Swal.DismissReason.cancel) {

    //     }
    //   })

    // }
  }
  clearOrder() {
    debugger;
    const basket = this.basketService.getCurrentBasket();
    // let currentType = basket.salesType;
    if(basket!==null && basket!==undefined)
    {
      this.basketService.deleteBasket(basket).subscribe(() => {
        // this.addNewOrder()
        // this.route.navigate(['/shop/sales-type']);
  
  
      });
    }
  
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
  }
  exchangeItemsList = [];
  exchangeItemMode = 'FromOrder';
  setItemReturnToBasket(lines: TSalesLine[]) {
    let Lines = [];
    lines.forEach(async item => {

      // && x.barCode === item.barCode
      let itemX = this.items.find(x => x.itemCode === item.itemCode && x.uomCode === item.uomCode);
      // debugger;
      if (itemX !== null && itemX !== undefined && item.openQty > 0) {
        // let infor=ressponse[0];

        if (item.slocId !== undefined && item.slocId !== null) {
          itemX.slocId = item.slocId;
        }
        else {
          itemX.slocId = this.storeSelected.whsCode;
        }
        let itembasket = this.basketService.mapProductItemtoBasket(itemX, 1);
        if (itembasket.productName === null || itembasket.productName === undefined) {
          itembasket.productName = itemX.itemDescription;
        }
        itembasket.quantity = item.openQty;
        if (itembasket.isCapacity) {
          itembasket.appointmentDate = item.appointmentDate.toString();
          itembasket.timeFrameId = item.timeFrameId.toString();
          itembasket.storeAreaId = item.storeAreaId.toString();
          itembasket.quantity = item.quantity;
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
        itembasket.price = item.price;
        itembasket.discountType = item.discountType;
        itembasket.discountValue = item.discountAmt;
        itembasket.promotionIsPromo = item.isPromo;
        itembasket.salesTaxCode = item.taxCode;
        itembasket.salesTaxRate = item.taxRate;
        itembasket.taxAmt = item.taxAmt;
        itembasket.promotionType = item.promoType;
        itembasket.promotionType = item.promoType;

        // this.basketService.addItemBasketToBasket(itembasket,  item.openQty); 
        Lines.push(itembasket);
      }
    });
    if (Lines !== null && Lines !== undefined) {
      // debugger;
      this.basketService.addItemListBasketToBasket(Lines);
    }
  }
  removeBasket() {
    const basket = this.basketService.getCurrentBasket();
    this.basketService.deleteBasket(basket);
  }
  showShift = false;
  shiftList: TShiftHeader[];
  isNewShift = false;
  backToOrderWithoutPromotion = "false";
  poleDisplay="false";
  poleDisplayType="";
  loadSetting() {
    let exMode = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'ExchangeItems');
    if (exMode !== null && exMode !== undefined) {
      this.exchangeItemMode = exMode.settingValue;
    }
    let backToOrderWithoutPromotion = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'BackToOrderWithoutPromotion');
    if (backToOrderWithoutPromotion !== null && backToOrderWithoutPromotion !== undefined) {
      this.backToOrderWithoutPromotion = backToOrderWithoutPromotion.settingValue;
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
      if(response.success)
      { 
        this.shiftList = response.data;
        if (this.shiftList === null || this.shiftList === undefined || this.shiftList.length === 0) {
          this.isNewShift = true;
        }
        else {
          this.isNewShift = false;
        }
        this.showShift = true;
        if(this.authService.checkRole('Adm_InvNotification' , '', 'V' ))
        {
          this.loadListTranfer();
        }
        
      }
      else
      {
        this.alertify.warning(response.message);
      }
      
      // console.log(this.storeList);
    });
    // debugger;

    // }
  }
  changeShift(selected) {
    // debugger;
    if (selected.endShift === true) {
      // this.isNewShift=true;
      // this.shiftService.endShift(selected.shift);
      // this.routeNav.navigate(['/shop']).then(() => {
      //   window.location.reload();
      // }); 
      this.routeNav.navigate(["admin/shift/summary", selected.shift.shiftId]);
    }
    else {
      this.isNewShift = false;
      // localStorage.setItem("shift", JSON.stringify(selected.shift));
      var tomorrow = new Date();
      var now = new Date();
      tomorrow.setDate(tomorrow.getDate()+1);
      tomorrow.setHours(1);
      let value = tomorrow.getTime() - now.getTime();
      this.commonService.setLocalStorageWithExpiry("shift", selected.shift, value);
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
      // this.routeNav.navigate(['/shop/order']).then(() => {
      //   window.location.reload();
      // }); 

      // this.currentShift = selected.shift;
    }
    // this.shiftService.create().subscribe()

  }
  functionPage = 'Adm_ShopOrder';
  
  @ViewChild(SlickCarouselComponent) slickFilterModal: SlickCarouselComponent; 
  // @ViewChild(SlickCarouselComponent) filter: SlickCarouselComponent; 
 
  @ViewChild('filter' , { static: false}) filter: ElementRef;  
  loadShortcut()
  {
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
          if(shortcut.custom1 === 'Search' || shortcut.custom1 === 'Display' || shortcut.custom1 === 'NextMerchandise' || shortcut.custom1 === 'PreMerchandise')
          {
            
              this.shortcuts.push(
                {
                  key: [combokey],
                  label: shortcut.name,
                  description: shortcut.description,
                  command: (e) => { 
                    if(shortcut.custom1 === 'Search')
                    {
                     
                      this.filterBy(this.filter.nativeElement.value);
                    }
                    
                    if(shortcut.custom1 === 'Display')
                    {
                      this.changeDisplayMode();
                    }
                    if(shortcut.custom1 === 'NextMerchandise')
                    { 
                      debugger;
                      this.slickFilterModal.slickNext();
                    }
                    if(shortcut.custom1 === 'PreMerchandise')
                    {
                      this.slickFilterModal.slickPrev();
                    }
                  
                  },
                  preventDefault: true
                }
              )
            } ;
        // debugger;
        // console.log(this.shortCutList);
        })
      }
    })
  }
  storecurrency : MStoreCurrency[] = [];

   ngOnInit() {
    this.storeSelected = this.authService.storeSelected();
    this.storecurrency = this.authService.getStoreCurrency();


    if (this.authService.getShopMode() === 'Grocery') {
      this.routeNav.navigate(["shop/order-grocery"]).then(() => {
         window.location.reload();
      });

    }


    this.checkLicensePlate().then(()=>{
      if(this.storecurrency!==null && this.storecurrency!==undefined && this.storecurrency.length > 0)
      {
        let datevl=this.GetDateFormat(new Date());
        this.rateService.getExchangeRateIsNullByDate(this.storeSelected.companyCode, this.storeSelected.storeId,datevl ).subscribe((response: any) =>{
          if(response.success)
          {
            this.exchangeRateNull = response.data;
            if(this.exchangeRateNull!==null && this.exchangeRateNull!==undefined && this.exchangeRateNull.length > 0)
            {
                let currencies = "";
                this.exchangeRateNull.forEach(rateX => {
                  currencies+= rateX.currency + ",";
                });
                if(currencies!=="")
                {
                  Swal.fire({
                    icon: 'info',
                    title: 'Oops...',
                    text: 'Exchange rate ' +currencies.substring(0, currencies.length - 1) + ' not available. Please setup exchange rate to date', 
                  })
                }
                else
                {
                  this.initOrder();
                }
            }
            else
            {
              this.initOrder();
            }
          }
          else
          {
            this.alertify.warning(response.message);
          }
        
        });
      }
      else
      {
        this.initOrder();
      }
    })
    
  }
  IsGenOrderNo$: Observable<boolean>;
  initOrder()
  {

    let basket = this.basketService.getCurrentBasket();
    if(basket!==null && basket!==undefined && basket?.salesType?.toLowerCase() === "addpayment")
    {
      this.newOrder();
    }
     // this.shortcuts = this.authService.getShortcutWindown(this.functionPage, '');
     this.loadShortcut();
     
     this.VirtualKey$ = this.commonService.VirtualKey$;

     this.IsGenOrderNo$ = this.basketService.IsGenOrderNo$;

     if(this.basketService.getCurrentIsNewGenOrderNo())
     {
       console.log("Gen New Order");
     }
    //  this.IsGenOrderNo$ = new Promise<string>((resolve, reject) => {
    //   this.resolve = resolve;
    // });
     // this.displayMode$ = this.commonService.displayMode$;
     this.commonService.changeShortcuts(this.shortcuts);
     this.displayMode = this.commonService.getCurrentDisplayMode();
     // this.loading$ = this.loading;
     // debugger;
     this.loadSetting();
     
     if (this.shiftService.getCurrentShip() == null || this.shiftService.getCurrentShip() === undefined) {
 
       this.loadShiftOpenList();
     }
     else {
       // debugger;
       this.isShowSlickSlider = true;
       this.loadItemNew(this.storeSelected.companyCode, this.storeSelected.storeId, '', '', '', null, true).then(()=>{
         this.loadOrder();
       });
       this.merchandiseService.getByCompany(this.authService.storeSelected().companyCode, '', '', '').subscribe((response: any) => {
          // debugger;
         if (response.success) {
           this.merchandiseList = response.data;
           this.merchandiseList = this.merchandiseList.filter(x => x.isShow === true).sort((a, b) => a.orderNum > b.orderNum ? 1 : -1);
 
         }
         else {
           this.alertify.warning(response.message);
         }
 
       });
 
       this.userParams.keyword = '';
       this.userParams.orderBy = 'byName';
        
     }
  }

  mode = "";
  isEvent = false;

  newOrderExchange() {
    this.isEvent = false;
    let store = this.authService.storeSelected();
    let currentType = "Retail";
    const basket = this.basketService.getCurrentBasket();
    if (basket !== null && basket !== undefined) {
      this.basketService.deleteBasket(basket).subscribe(() => {

        let cus = this.authService.getDefaultCustomer();
        if (cus !== null && cus !== undefined) {
          this.basketService.changeCustomer(cus, currentType).subscribe(() => {
            this.basketService.changeContract(this.orderId);
          });
          // setTimeout(() => {
          //   this.basketService.changeCustomer(cus, currentType);
          //   // this.route.navigate(['/shop/order']);
          //     this.routeNav.navigate(['/shop/order']).then(() => {
          //       // window.location.reload();
          //     });
          //   }, 2); 
        }
       
      });
    }
    else {
      let cus = this.authService.getDefaultCustomer();
      if (cus !== null && cus !== undefined) {
        this.basketService.changeCustomer(cus, currentType).subscribe(() => {
          this.basketService.changeContract(this.orderId);
        });
        // setTimeout(() => {
        //   this.basketService.changeCustomer(cus, currentType);
        //   // this.route.navigate(['/shop/order']);
        //     this.routeNav.navigate(['/shop/order']).then(() => {
        //       // window.location.reload();
        //     });
        //   }, 2); 
      }
     
    }


  }

  newOrderCheckout() {
    this.isEvent = true;
    let store = this.authService.storeSelected();
    let currentType = "Retail";
    // debugger;
    const basket = this.basketService.getCurrentBasket();
    if (basket !== null && basket !== undefined) {

      this.basketService.deleteBasket(basket).subscribe(() => {
         
      });
    }
    else {
      
      // // debugger;
      // if (cus !== null && cus !== undefined) {
      //   setTimeout(() => {
      //     this.basketService.changeCustomer(cus, currentType).subscribe(() => {
          
      //     });
         
      //     // this.basketService.changeCustomer(cus, currentType);
      //     // // this.route.navigate(['/shop/order']);
      //     //   this.routeNav.navigate(['/shop/order']).then(() => {
      //     //     // window.location.reload();
      //     //   });
      //   }, 2);
      // }
      
    }
    let SalesType =  "Retail";
    // || this.mode?.toLowerCase() === 'preorder'
    if(this.mode?.toLowerCase() === 'table' )
    {
      SalesType = "Table";
    }
    let cus = this.authService.getDefaultCustomer();
    if (cus !== null && cus !== undefined) {
      setTimeout(() => {

        this.basketService.changeCustomer(cus, SalesType).subscribe(() => {
          // this.route.navigate(['/shop/order']).then(); 
        });
       
        if(this.mode?.toLowerCase() === 'preorder'  )
        {
          this.basketService.changeContract(this.orderId, this.placeid);
          
          setTimeout(() => {
            this.billService.getContractItem(this.storeSelected.companyCode, this.storeSelected.storeId,  this.placeid,  this.orderId, "",this.shiftService.getCurrentShip().shiftId).subscribe((response: any) =>{
              if(response.success)
              {
                if(response.data!=null && response.data!=undefined && response.data?.length >0)
                {
                    let listItem = [];
                    let sttItem = 1;
                    response.data.forEach(item => {
                      let itemaftermap = this.basketService.mapProductItemtoBasket(item, item.quantity);
                      listItem.push(itemaftermap);
    
                      // this.basketService.addItemtoBasket(item, item.quantity, null, null);
                      if(sttItem === response.data.length )
                      {
                          this.basketService.addItemListBasketToBasket(listItem, true);
                      }
                      sttItem++;
                    });
                    
                }
                else
                {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "Can't get Item in table " + this.orderId,
                    
                  })
                }
              }
              else
              {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.message,
                  
                })
              }
            }, error =>{
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
                
              })
            });
          }, 100);
        }
        else  
        {
          if(this.mode?.toLowerCase() === 'table' )
          {
            this.basketService.changeContract(this.orderId, this.placeid);
          }
          else
          {
            this.basketService.changeContract(this.orderId);
          }
          
        }
       
        // if (this.authService.getShopMode() === 'FnB') {
        //   this.routeNav.navigate(["shop/order"]).then(() => {
        //     // window.location.reload();
        //   });
        // }
        // if (this.authService.getShopMode() === 'Grocery') {
        //   this.routeNav.navigate(["shop/order-grocery"]).then(() => {
        //     // window.location.reload();
        //   });

        // }
      }, 2);

    }
    else {
      this.customerService.getItem(this.storeSelected.companyCode, this.storeSelected.defaultCusId).subscribe((response: any) => {
        // debugger;
        this.basketService.changeCustomer(response.data, SalesType).subscribe(() => {

        });
       
        if(this.mode?.toLowerCase() === 'preorder')
        {
          this.basketService.changeContract(this.orderId, this.placeid);
          setTimeout(() => {
            this.billService.getContractItem(this.storeSelected.companyCode, this.storeSelected.storeId,   this.placeid,  this.orderId, "",this.shiftService.getCurrentShip().shiftId).subscribe((response: any) =>{
              if(response.success)
              {
                if(response.data!=null && response.data!=undefined && response.data?.length >0)
                {
                    let listItem = [];
                    let sttItem = 1;
                    response.data.forEach(item => {
                      let itemaftermap = this.basketService.mapProductItemtoBasket(item, item.quantity);
                      listItem.push(itemaftermap);
    
                      // this.basketService.addItemtoBasket(item, item.quantity, null, null);
                      if(sttItem === response.data.length )
                      {
                          this.basketService.addItemListBasketToBasket(listItem, true);
                      }
                      sttItem++;
                    });
                    
                }
                else
                {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "Can't get Item in table " + this.orderId,
                    
                  })
                }
              }
              else
              {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.message,
                  
                })
              }
            }, error =>{
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
                
              })
            });
          }, 100);
        }
        else  
        {
          if(this.mode?.toLowerCase() === 'table' )
          {
            this.basketService.changeContract(this.orderId, this.placeid);
          }
          else
          {
            this.basketService.changeContract(this.orderId);
          }
        }
        // if (this.authService.getShopMode() === 'FnB') {
        //   this.routeNav.navigate(["shop/order"]).then(() => {
        //     // window.location.reload();
        //   });
        // }
        // if (this.authService.getShopMode() === 'Grocery') {
        //   this.routeNav.navigate(["shop/order-grocery"]).then(() => {
        //     // window.location.reload();
        //   });

        // }
        // this.route.navigate(['/shop/order']);


      });
    }

  }
  time: number = 0;
  timerDisplay ;
  interval;

 startTimer() {
    console.log("=====>");
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.timerDisplay=this.transform( this.time)
    }, 1000);
  }
  transform(value: number): string {
       const minutes: number = Math.floor(value / 60);
       return minutes  + ' minutes : ' + (value - minutes * 60) + ' seconds';
  }
  pauseTimer() {
    clearInterval(this.interval);
  }
  placeid = "";
  loadOrder() {
    this.route.params.subscribe(data => {
      this.orderId = data['id'];
      this.mode = data['m'];
      this.placeid = data['placeid'];
    })
    let basket = this.basketService.getCurrentBasket();
    if(basket!==null && basket!==undefined && basket?.salesType?.toLowerCase() === "addpayment")
    {
      this.newOrder();
    }
    else
    {
      if (this.mode === "checkout" || this.mode=== "table"  || this.mode=== "preorder") {
        if(this.orderId !==null && this.orderId!==undefined && this.orderId!=='')
        {
          this.newOrderCheckout();
        }
        else
        {
          Swal.fire({
            icon: 'info',
            title: 'Oops...',
            text: 'Contract No not available',
            
          })
        }
        
        //  this.basket.next(customer); 
  
      }
  
      else {
       
        if (this.orderId !== null && this.orderId !== undefined) {
          this.removeBasket();
          // debugger;
          this.billService.getBill(this.orderId, this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any)=> {
           
            if(response.success)
            {
              this.order = response.data;
              const itemList: Item[] = [];
              // console.log("ABC");
              switch(this.mode) { 
                case "exchange" || "ex": { 
                   //statements; 
                   if(this.order.totalDiscountAmt!==null && this.order.totalDiscountAmt !==undefined && this.order.totalDiscountAmt > 0)
                   {
                     Swal.fire({
                       title: "Order can't exchange because include Discount Amt",
                       icon: 'info',
                       showCancelButton: false,
                       confirmButtonText: 'OK',
                       cancelButtonText: 'No'
                     }).then((result) => {
                       if (result.value) {
                         this.clearOrder();
                       } else if (result.dismiss === Swal.DismissReason.cancel) {
               
                       }
                     })
                   }
                   else
                   {
                       //  
                     
                         debugger;
                         let check = this.authService.checkRole('Spc_ExchangeOrder', '', 'I');
                         if (check === false) {
                           this.routeNav.navigate(["/admin/permission-denied"]);
                         }
                         // this.order.refTransId = this.orderId;
                         this.order.refTransId = this.orderId;
                         let defCustomer  = this.authService.getDefaultCustomer();
                         if (this.authService.getCRMSource() === "Local" || (this.order.customer !== null && this.order.customer !== undefined)) {
         
                           this.basketService.changeCustomer(this.order.customer, "Exchange").subscribe(() => {
                             //  debugger; 
         
                           });
                           setTimeout(() => {
                            this.setItemExchangeToBasket(this.order);
                            if (this.exchangeItemMode.replace(' ','') !== "FromOrder") {
                              this.basketService.changeReturnMode(true);
                            }
                          }, 50);
                         
                         }
                         else {
                           let firstChar = this.order.phone?.toString()?.substring(0, 1);
                           if (firstChar === "0") {
                             this.order.phone = "84" + this.order.phone?.toString()?.substring(1, this.order.phone.length);
                           }
                           if(defCustomer.mobile ===  this.order.phone)
                           {
                             let cus = this.authService.mapWMiCustomer2Customer(defCustomer);// this.mapWMiCustomer2Customer(response.data); 
                             this.basketService.changeCustomer(cus, "Exchange").subscribe(() => {
                               // debugger;
       
                             });
                             setTimeout(() => {
                              this.setItemExchangeToBasket(this.order);
                              if (this.exchangeItemMode !== "FromOrder") {
                                this.basketService.changeReturnMode(true);
                              }
                              }, 50);
                           }
                           else
                           {
                             this.mwiService.getCustomerInformation(this.order.phone, this.storeSelected.storeId).subscribe((response: any) => {
                               debugger;
                               if (response !== null && response !== undefined) {
                                 if (response.status === 1) {
                                   let cus = this.authService.mapWMiCustomer2Customer(response.data);// this.mapWMiCustomer2Customer(response.data); 
                                   this.basketService.changeCustomer(cus, "Exchange").subscribe(() => {
                                     // debugger;
           
                                   });
                                   setTimeout(() => {
                                    this.setItemExchangeToBasket(this.order);
                                    if (this.exchangeItemMode !== "FromOrder") {
                                      this.basketService.changeReturnMode(true);
                                    }
                                    }, 50);
                                 }
                                 else {
                                   if(response.msg === '' ||response.msg === null || response.msg === undefined )
                                   { 
                                     // this.alertify.warning("Unable connect to CRM System");
                                     Swal.fire({
                                       icon: 'warning',
                                       title: 'CRM System',
                                       text: "Unable connect to CRM System"
                                     }).then(() => {
                                       this.newOrder();
                                     });
                                   }
                                   else
                                   {
                                     this.alertify.warning(response.msg);
                                   }
                                   // this.alertify.warning(response.msg);
                                 }
                               }
                               else {
                                 this.alertify.warning('Data not found');
                               }
                             });
                           }
                         
         
                         // }
                     }
                    
                   }
       
                   break; 
                } 
                case "return": { 
                   //statements; 
                   break; 
                } 
                
                default: { 
                   //statements; 
                   debugger;
                   this.checkCustomerInfor = false;
                  
                   let crmsrouce =this.authService.getCRMSource();
                   if (crmsrouce === "Local" || (this.order.customer !== null && this.order.customer !== undefined)) {
    
                    this.basketService.changeCustomer(this.order.customer, "Retail");
                    this.checkCustomerInfor = true;
                    // .subscribe(() => {
                      
                    // });
                    // this.basketService.changeRefTransId(this.orderId);
                    setTimeout(() => {
                      this.setItemToBasket(this.order);
                    }, 50);
                  }
                  else {
                    let firstChar = this.order.phone?.toString()?.substring(0, 1);
                    if (firstChar === "0") {
                      this.order.phone = "84" + this.order.phone.toString().substring(1, this.order.phone.length);
                    }
                    let defaultCus = this.authService.getDefaultCustomer();
                    if(this.order.phone !== defaultCus.phone)
                    {
                      this.startTimer() ;
                      this.mwiService.getCustomerInformation(this.order.phone, this.storeSelected.storeId).subscribe((response: any) => {
                        debugger;
                        if (response !== null && response !== undefined) {
                          this.checkCustomerInfor =true;
                          this.pauseTimer();
                          if (response.status === 1) {
                          
                            let cus = this.authService.mapWMiCustomer2Customer(response.data);// this.mapWMiCustomer2Customer(response.data); 
                            this.basketService.changeCustomer(cus, "Retail").subscribe(() => {
                              // debugger; 
                            });
                            // this.setItemToBasket(this.order);
                            // this.basketService.changeRefTransId(this.orderId);
                            setTimeout(() => {
                              this.setItemToBasket(this.order);
                            }, 50);
                          }
                          else {
                            if(response.msg === '' ||response.msg === null || response.msg === undefined )
                            { 
                              // this.alertify.warning("Unable connect to CRM System");
                              Swal.fire({
                                icon: 'warning',
                                title: 'CRM System',
                                text: "Unable connect to CRM System"
                              }).then(() => {
                                this.newOrder();
                              });
                            }
                            else
                            {
                              this.alertify.warning(response.msg);
                            }
                          
                          }
                        }
                        else {
                          this.alertify.warning('Data not found');
                        }
                      });
                    }
                    else
                    {
                      let cus = this.authService.mapWMiCustomer2Customer(defaultCus);// this.mapWMiCustomer2Customer(response.data); 
                      this.basketService.changeCustomer(cus, "Retail").subscribe(() => {
                        // debugger; 
                      });
                      // this.basketService.changeRefTransId(this.orderId);
                      setTimeout(() => {
                        this.setItemToBasket(this.order);
                      }, 50);
                      
                    }
                    // this.basketService.changeCustomer(this.order.customer, "Retail");
                  
                  }
                   break; 
                } 
             } 
              // if (this.mode === "exchange" || this.mode === "ex") {
                
             
    
              // }
              // else {
               
              
               
              //   //.subscribe(() => {
              //   //   debugger;
    
              //   // });
              //   // this.basketService.changeCustomer(this.order.customer, "Retail").subscribe(() => {
                  
              //   // });
               
              // }
            }
            else
            {
              this.alertify.warning(response.message);
            }
           
            // this.changeCustomer(this.order.customer);
  
  
          }, (error) => {
            this.alertify.error(error);
          }, () => {
  
          });
  
        }
        else {
          // debugger;
          if (this.mode !== 'Return') {
            let basketId = localStorage.getItem("basket_id");
            if (basketId !== null && basketId !== undefined) {
              let basket = this.basketService.getBasketLocal();
              if (basket.salesType === null || basket.salesType === undefined || basket.salesType === "Return" || basket.salesType === "return" || basket?.salesType.toLowerCase() === "exchange" || basket.salesType.toLowerCase() === "ex") {
                this.newOrder();
  
              }
              else {
                if (basket !== null && basket !== undefined) {
                  // if(basket?.salesType.toLowerCase() === "exchange" || basket.salesType.toLowerCase() === "ex")
                  // {
                  //   this.newOrder();
                  // }
                  // else
                  // {
                   
                  // }
                  this.basketService.setBasket(basket);
                }
                else {
                  this.newOrder();
  
                }
              }
  
  
  
              // this.basketService.getBasketById(basketId).subscribe((response: IBasket)=>{
  
              //   if(response===null || response===undefined )
              //   { 
              //     this.newOrder();
              //   }
              //   else
              //   {
              //     if(response.salesType.toLowerCase()==='ex' || response.salesType.toLowerCase()==='exchange')
              //     {
              //       this.newOrder();
              //     }
              //     else
              //     {
              //       this.basketService.setBasket(response);
              //     }
  
              //   }
              // });
            }
            else {
              this.newOrder();
            }
          }
          else {
            this.newOrder();
          }
  
  
  
          // debugger;
  
        }
      }
    }
   

  }
  dropSettings: any[] = [
    { value: 'switchDisplay', name: 'Switch Display', icon: 'expand', faicon:'fa fa-window-restore' },
    {
      value: 'setting', name: 'Setting (FnB)', icon: 'preferences',  faicon:'fa fa-cogs'
    },
    {
      value: 'settingCurrentScreen', name: 'Setting Current Screen', icon: 'preferences', faicon:'fa fa-cog'
    },
    { value: 'reloadItem', name: 'Reload Item (Clear - Reload)', icon: 'refresh', faicon:'fa fa-recycle' },
    
 ];
 isPopupVisible = false;
  onItemClick(e) {
    debugger;
    let value = e.itemData.value;
    if(value === 'switchDisplay')
    {
      this.changeDisplayMode();
    }
    if(value === 'setting')
    {
       this.isPopupVisible = true;
    }
    if(value === 'settingCurrentScreen')
    {
       if(this.displayMode === "slick")
       {
        this.isMarkupDesign = true;
       }
       else
       {
          Swal.fire({
            icon: 'info',
            title: 'Function',
            text: 'Function only support for slides mode. Please switch to slides mode.'
          })
       }
      
    }
    if(value === 'reloadItem')
    {
      this.saveItems = null; 
      //Remove FnB Item
      sessionStorage.setItem('fnbItems', null);
      sessionStorage.removeItem("fnbItems");
      setTimeout(() => {
        let storeSelected = this.authService.storeSelected();
         this.loadItemNew(storeSelected.companyCode, storeSelected.storeId, '', '', this.basketService.getCurrentBasket().salesType)

      }, 100);
      
    }
  }
  @ViewChild(DxDropDownButtonComponent) ddb;
  onItemClickNew(value) {
    debugger;
    // let value = e.itemData.value;
    if(value === 'switchDisplay')
    {
      this.changeDisplayMode();
    }
    if(value === 'setting')
    {
       this.isPopupVisible = true;
    }
    if(value === 'settingCurrentScreen')
    {
       if(this.displayMode === "slick")
       {
        this.isMarkupDesign = true;
       }
       else
       {
          Swal.fire({
            icon: 'info',
            title: 'Function',
            text: 'Function only support for slides mode. Please switch to slides mode.'
          })
       }
      
    }
    if(value === 'reloadItem')
    {
      this.saveItems = null; 
      //Remove FnB Item
      sessionStorage.setItem('fnbItems', null);
      sessionStorage.removeItem("fnbItems");
      setTimeout(() => {
        let storeSelected = this.authService.storeSelected();
         this.loadItemNew(storeSelected.companyCode, storeSelected.storeId, '', '', this.basketService.getCurrentBasket().salesType)

      }, 100);
      
    };

    setTimeout(() => {
      this.ddb.instance.close();
    }, 20);
  }
  filterBy(txtFilter: any) {
    // debugger;
    // this.userParams.merchandise="";
    // this.userParams.keyword = txtFilter;
    // this.loadItemPagedList(null, null);
    // this.selectedCateFilter = "";

debugger;
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
  isShowSlickSlider: boolean = false;
  public refreshSlickSlider() {
    this.isShowSlickSlider = false;
    setTimeout(x => this.isShowSlickSlider = true);
  }
 
  displayMode$: Observable<string>;
  removeSelected() {
    const merchandise = document.getElementsByClassName('custom-filter');
    Array.prototype.forEach.call(merchandise, function (item) {
      // Do stuff here
      if (item !== null && item !== undefined) {
        item.classList.remove('custom-filter-selected');
      }
    });
  }
  fetchAllData() {
    // debugger;
    this.selectedCateFilter = "";
    this.removeSelected();
    if (this.basketService.getCurrentBasket().salesType == "Retail") {
      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', '', null, true)
    }
    else {
      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', this.basketService.getCurrentBasket().salesType, null, true)

    }
  }
  saveItems: ItemViewModel[];
  displayMode = "slick";
  async changeDisplayMode() {
    // debugger;
    this.isShowSlickSlider = false;
    this.loadingService.startLoading(this, LoadingIndicator.MANUAL);
      await timer(1000).pipe(take(1)).toPromise();
    if (this.displayMode === "slick") {
      this.displayMode = "list";
      this.commonService.changeDisplayMode(this.displayMode);
    
    }
    else {
      this.displayMode = "slick";
      this.commonService.changeDisplayMode(this.displayMode);
     
    } 
    this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', this.basketService.getCurrentBasket().salesType)

   
  }
  prevKey = "";
  async loadItemNew(companyCode, storeId, Keyword, Merchandise, Type, subType?, isInit?, checkLicense?) {

    Keyword = Keyword?.toLowerCase();
    let basket = this.basketService.getBasketLocal();
    if(basket?.custom1 !== '' && basket?.custom1 !== undefined && basket?.custom1 !== null)
    {
      checkLicense = true;
    }
    // debugger;
    if (((Keyword !== null && Keyword !== undefined && Keyword !== "") || (Merchandise !== null && Merchandise !== undefined && Merchandise !== "")) || isInit === true) {
      // debugger;
     
      if (this.prevKey == "" || this.prevKey !== Keyword) {

        this.prevKey = Keyword;
        this.isShowSlickSlider = false;
      
        this.loadingService.startLoading(this, LoadingIndicator.MANUAL);
        await timer(1000).pipe(take(1)).toPromise(); 
        // debugger;
        if (this.saveItems !== null && this.saveItems !== undefined  && this.saveItems?.length > 0 && checkLicense !== true) {

          // debugger;
          this.items = this.saveItems;

          if (Keyword !== null && Keyword !== undefined && Keyword !== "") {
            this.items = this.items.filter(x => x.keyId?.toLowerCase().includes(Keyword) || x.itemCode?.toLowerCase().includes(Keyword) || x.barCode?.toLowerCase().includes(Keyword) || x.itemDescription?.toLowerCase().includes(Keyword) || x.itemName?.toLowerCase().includes(Keyword) || x.itemDescription?.toLowerCase().includes(Keyword));
          }
          else {
            if (Merchandise !== null && Merchandise !== undefined && Merchandise !== "") {
              this.items = this.items.filter(x => x.mcid === Merchandise);
            }

          }
         
          await timer(1000).pipe(take(1)).toPromise();
          this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
          // this.isShowSlickSlider = true;
          if (this.displayMode === "slick") {
            this.refreshSlickSlider();
          }
          else
          {
            this.isShowSlickSlider = true;
          }
        }
        else {
          let customerGrpId = "";
          if(this.basketService.getCurrentBasket()?.customer!==null && this.basketService.getCurrentBasket()?.customer !==undefined )
          {
            customerGrpId =  this.basketService.getCurrentBasket().customer.customerGrpId;
          }
          else
          {
            customerGrpId =  this.authService.getDefaultCustomer().customerGrpId;
           
          }
          if(customerGrpId===null || customerGrpId===undefined || customerGrpId==='')
          {
            customerGrpId ='';
          }
          // debugger;
          if(checkLicense!== true )
          {
            let fbItems = JSON.parse(sessionStorage.getItem("fnbItems"));
            if(fbItems!== null && fbItems!==undefined && fbItems?.length > 0)
            {
              if (subType !== null && subType !== undefined && subType !== "") {
                // debugger
                this.items = fbItems;
                this.saveItems = fbItems;
               
                this.items = this.items.filter(x => x.customField4 === subType);
              
              }
              else {
                this.items = fbItems;
                this.saveItems = fbItems;
               
              }
                
              this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
                   
              if (this.displayMode === "slick") {
                this.refreshSlickSlider();
              }
              else
              {
                this.isShowSlickSlider = true;
              }

            }
            else
            {
              this.itemService.getItemViewList(companyCode, storeId, '', '', '', Keyword, Merchandise, customerGrpId,null,null,basket?.custom1).subscribe((response: any) => {
                // debugger;
                if(response.success)
                {
                  if(response.data?.length ===0 && basket?.custom1 !==null && basket?.custom1 !=='' && basket?.custom1 !==undefined)
                  {
                    Swal.fire({
                      title: 'can not found item with License Plate!',
                      // input: 'text',
                      icon: 'warning',
                      // text: 'License Plate',
                      inputAttributes: {
                        autocapitalize: 'off'
                      },
                      showCancelButton: false,
                      // confirmButtonText: 'No',
                      showLoaderOnConfirm: true,
                      allowOutsideClick: () => !Swal.isLoading()
                    }).then((result) => {
                      if (result.isConfirmed) {
                        basket.custom1 = '';
                        this.basketService.setBasket(basket);
                        this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', "", null, true,true);
      
                      }
                    })
                  }
                  else
                  {
                    this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
                    if (this.displayMode === "slick") {
                      this.refreshSlickSlider();
                    }
                    else
                    {
                      this.isShowSlickSlider = true;
                    }
                    if (subType !== null && subType !== undefined && subType !== "") {
                      debugger
                      this.items = response.data;
                      this.saveItems = response.data;
                      sessionStorage.setItem('fnbItems', JSON.stringify(this.saveItems));
                      this.items = this.items.filter(x => x.customField4 === subType);
                      // console.log("Items");
                      //   console.log(this.saveItems);
                    }
                    else {
                      this.items = response.data;
                      this.saveItems = response.data;
                      sessionStorage.setItem('fnbItems', JSON.stringify(this.saveItems));
                      // this.saveItems = response;
                    }
                  
                    
                  }
                }
                else
                {
                  this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
                  if (this.displayMode === "slick") {
                    this.refreshSlickSlider();
                  }
                  else
                  {
                    this.isShowSlickSlider = true;
                  }
                  this.items = [];
                    this.saveItems = [];
                  Swal.fire({
                    icon: 'info',
                    title: 'Oops...',
                    text: response.message
                  })
               
                }
             
                 
                  // debugger;
                
              }, error =>{
                console.log('error Get Data Items', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: "Can't get items. Reload page or contact to support team"
                }).then(() => {
                  window.location.reload();
                });
              }); 
            }
           
          }
          else
          {
            // debugger
            this.itemService.getItemViewList(companyCode, storeId, '', '', '', Keyword, Merchandise, customerGrpId,null,null,basket?.custom1).subscribe((response: any) => {
              // debugger;
              if(response.success)
              {
                if(response.data?.length ===0 && basket?.custom1 !==null && basket?.custom1 !=='' && basket?.custom1 !==undefined)
                {
                  Swal.fire({
                    title: 'can not found item with License Plate!',
                    // input: 'text',
                    icon: 'warning',
                    // text: 'License Plate',
                    inputAttributes: {
                      autocapitalize: 'off'
                    },
                    showCancelButton: false,
                    // confirmButtonText: 'No',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: () => !Swal.isLoading()
                  }).then((result) => {
                    if (result.isConfirmed) {
                      basket.custom1 = '';
                      this.basketService.setBasket(basket);
                      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', "", null, true,true);
    
                    }
                  })
                }
                else
                {
                  
                  this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
                  if (this.displayMode === "slick") {
                    this.refreshSlickSlider();
                  }
                  else
                  {
                    this.isShowSlickSlider = true;
                  }
                  
                  if (subType !== null && subType !== undefined && subType !== "") {
                    // debugger
                    this.items = response.data;
                    this.saveItems = response.data; 
                    this.items = this.items.filter(x => x.customField4 === subType);
                    // console.log("Items");
                    //   console.log(this.saveItems);
                  }
                  else {
                    this.items = response.data;
                    this.saveItems = response.data; 
                    // this.saveItems = response;
                  }
                 
                }
              }
              else
              {
                
                this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
                if (this.displayMode === "slick") {
                  this.refreshSlickSlider();
                }
                else
                {
                  this.isShowSlickSlider = true;
                }
                
                this.items = [];
                  this.saveItems = [];
                Swal.fire({
                  icon: 'info',
                  title: 'Oops...',
                  text: response.message
                })
             
              }

                // debugger;
              
            }, error =>{
              console.log('error Get Data Items', error);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Can't get items. Reload page or contact to support team"
              }).then(() => {
                window.location.reload();
              });
            }); 
          }
        
        }
      }
    }
    else
    { 
        this.isShowSlickSlider = false;
        
        this.loadingService.startLoading(this, LoadingIndicator.MANUAL);
        await timer(1000).pipe(take(1)).toPromise();
        if (this.saveItems !== null && this.saveItems !== undefined && this.saveItems?.length > 0 ) 
        { 
            // debugger;
            this.items = this.saveItems; 
          
            this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
            if (this.displayMode === "slick") {
              this.refreshSlickSlider();
            }
            else
            {
              this.isShowSlickSlider = true;
            }
        }
        else { 
          let customerGrpId = "";
          if(this.basketService.getCurrentBasket()?.customer!==null && this.basketService.getCurrentBasket()?.customer !==undefined )
          {
            customerGrpId =  this.basketService.getCurrentBasket().customer.customerGrpId;
          }
          else
          {
            customerGrpId =  this.authService.getDefaultCustomer().customerGrpId;
           
          }
          if(customerGrpId===null || customerGrpId===undefined || customerGrpId==='')
          {
            customerGrpId ='';
          }
          
         
          if(checkLicense!== true)
          {
            let fbItems = JSON.parse(sessionStorage.getItem("fnbItems"));
            if(fbItems!== null && fbItems!==undefined && fbItems?.length > 0)
            {
              if (subType !== null && subType !== undefined && subType !== "") {
                debugger
                this.items = fbItems;
                this.saveItems = fbItems;
               
                this.items = this.items.filter(x => x.customField4 === subType);
                // console.log("Items");
                //   console.log(this.saveItems);
              }
              else {
                this.items = fbItems;
                this.saveItems = fbItems;
               
              }
                
              this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
                   
              if (this.displayMode === "slick") {
                this.refreshSlickSlider();
              }
              else
              {
                this.isShowSlickSlider = true;
              }
            }
            else
            {
              this.itemService.getItemViewList(companyCode, storeId, '', '', '', Keyword, Merchandise, customerGrpId,null,null,basket?.custom1).subscribe((response: any) => {
                debugger;
                if(response.success)
                {
                  if(response.data?.length ===0 && basket?.custom1 !==null && basket?.custom1 !=='' && basket?.custom1 !==undefined)
                  {
                    Swal.fire({
                      title: 'can not found item with License Plate!',
                      // input: 'text',
                      icon: 'warning',
                      // text: 'License Plate',
                      inputAttributes: {
                        autocapitalize: 'off'
                      },
                      showCancelButton: false,
                      // confirmButtonText: 'No',
                      showLoaderOnConfirm: true,
                      allowOutsideClick: () => !Swal.isLoading()
                    }).then((result) => {
                      if (result.isConfirmed) {
                      
                          basket.custom1 = '';
                          this.basketService.setBasket(basket);
                        this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', "", null, true,true);
                      }
                    })
                  }
                  else
                  {
                    
                    this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
                    if (this.displayMode === "slick") {
                      this.refreshSlickSlider();
                    }
                    else
                    {
                      this.isShowSlickSlider = true;
                    }
                    if (subType !== null && subType !== undefined && subType !== "") {
                      // debugger
                      this.items = response.data;
                      this.saveItems = response.data;
                      sessionStorage.setItem('fnbItems', JSON.stringify(this.saveItems));
                      this.items = this.items.filter(x => x.customField4 === subType); 
                    }
                    else {
                      this.items = response.data;
                      this.saveItems = response.data; 
                      sessionStorage.setItem('fnbItems', JSON.stringify(this.saveItems));
                    }
                  }
                }
                else
                {
                  this.items = [];
                  this.saveItems = [];
                  Swal.fire({
                    icon: 'info',
                    title: 'Oops...',
                    text: response.message
                  })
               
                  this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
                  if (this.displayMode === "slick") {
                    this.refreshSlickSlider();
                  }
                  else
                  {
                    this.isShowSlickSlider = true;
                  }
                }
          
              }, error =>{
                console.log('error Get Data Items', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: "Can't get items. Reload page or contact to support team"
                }).then(() => {
                  window.location.reload();
                });
              }); 
            }
          
          }
          else
          {
            this.itemService.getItemViewList(companyCode, storeId, '', '', '', Keyword, Merchandise, customerGrpId,null,null,basket?.custom1).subscribe((response: any) => {
              debugger;
              if(response.success)
              {
                if(response.data?.length ===0 && basket?.custom1 !==null && basket?.custom1 !=='' && basket?.custom1 !==undefined)
                {
                  Swal.fire({
                    title: 'can not found item with License Plate!',
                    // input: 'text',
                    icon: 'warning',
                    // text: 'License Plate',
                    inputAttributes: {
                      autocapitalize: 'off'
                    },
                    showCancelButton: false,
                    // confirmButtonText: 'No',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: () => !Swal.isLoading()
                  }).then((result) => {
                    if (result.isConfirmed) {
                    
                        basket.custom1 = '';
                        this.basketService.setBasket(basket);
                      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', "", null, true,true);
                    }
                  })
                }
                else
                {
                  if (subType !== null && subType !== undefined && subType !== "") {
                    // debugger
                    this.items = response.data;
                    this.saveItems = response.data; 
                    this.items = this.items.filter(x => x.customField4 === subType); 
                  }
                  else {
                    this.items = response.data;
                    this.saveItems = response.data;  
                  }
                }
              }
              else
              {
                this.items = [];
                this.saveItems = [];
                Swal.fire({
                  icon: 'info',
                  title: 'Oops...',
                  text: response.message
                })
             
              }
              this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
              if (this.displayMode === "slick") {
                this.refreshSlickSlider();
              }
              else
              {
                this.isShowSlickSlider = true;
              }
            }, error =>{
              console.log('error Get Data Items', error);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Can't get items. Reload page or contact to support team"
              }).then(() => {
                window.location.reload();
              });
            });
          }
         
        }
        
      
    }





    // .subscribe(text => (this.subscriptionText = text));;
  }
 
  getItemByCate(cate: MMerchandiseCategory) {
    this.selectedCateFilter = cate.mcid;
    // this.items= this.saveItems;
    // debugger;
    // this.items = this.items.filter(x=>x.customField4=== this.selectedCateFilter);
    if (this.basketService.getCurrentBasket().salesType == "Retail") {
      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', cate.mcid, '')
    }
    else {
      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', cate.mcid, this.basketService.getCurrentBasket().salesType)

    }
    // this.selectedCateFilter = cate.mcid;
    // this.userParams.merchandise= cate.mcid;
    
  }
  @ViewChild('template')
  private template: TemplateRef<any>;
  loadListTranfer() {
    // debugger;
    // if(!this.showShift)
    // {
    //   return;
    // }
    let store = this.authService.storeSelected();
    this.inventory.GetTranferNotify(store.companyCode,this.authService.storeSelected().storeId).subscribe((response: any) => {
      debugger;
      this.inventoryListTS = response.data.filter(x=>x.fromStore ==store.storeId && x.docType ==='S');
      this.inventoryListTR = response.data.filter(x=>x.toStore ==store.storeId && x.docType ==='S');
      // this.count = response.data.length;
      if(this.inventoryListTS.length>0 || this.inventoryListTR.length>0)
      {
      this.modalRef = this.modalService.show(this.template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
      });
    }
    });
  }
}
 