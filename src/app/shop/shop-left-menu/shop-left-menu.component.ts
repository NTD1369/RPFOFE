import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DxTextBoxComponent } from 'devextreme-angular';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxPrinterService } from 'ngx-printer';
import { Observable } from 'rxjs';
import { checkLogin } from 'src/app/auth/changepassword/changepassword.component';
import { MEmployee } from 'src/app/_models/employee';
import { TInventoryHeader } from 'src/app/_models/inventory';
import { Item } from 'src/app/_models/item';
import { MFunction } from 'src/app/_models/mfunction';
import { MStore } from 'src/app/_models/store';
import { SStoreClient } from 'src/app/_models/storeclient';
import { IBasket, IBasketDiscountTotal, IBasketItem } from 'src/app/_models/system/basket';
import { NumpadDiscountParam } from 'src/app/_models/system/numpadDiscountParam';
import { TShiftHeader } from 'src/app/_models/tshiftheader';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { TapTapVoucherDetails } from 'src/app/_models/voucherdetail';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcuteFunctionService } from 'src/app/_services/common/excuteFunction.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { PickupAmountService } from 'src/app/_services/data/pickupAmount.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { UserService } from 'src/app/_services/data/user.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { PromotionService } from 'src/app/_services/promotion/promotion.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { FunctionService } from 'src/app/_services/system/function.service';
import { PermissionService } from 'src/app/_services/system/permission.service';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';
import Swal from 'sweetalert2';
import { ShopPopupUserComponent } from '../shop-popup-user/shop-popup-user.component';
import { ShopApprovalInputComponent } from '../tools/shop-approval-input/shop-approval-input.component';
import { ShopPickupAmountInputComponent } from '../tools/shop-pickup-amount-input/shop-pickup-amount-input.component';
import { ShopToolClearCacheComponent } from '../tools/shop-tool-clear-cache/shop-tool-clear-cache.component';
import { ShopToolPromotionDetailViewComponent } from '../tools/shop-tool-promotion-detail-view/shop-tool-promotion-detail-view.component';
import { ShopToolsSettlementComponent } from '../tools/shop-tools-settlement/shop-tools-settlement.component';

@Component({
  selector: 'app-shop-left-menu',
  templateUrl: './shop-left-menu.component.html',
  styleUrls: ['./shop-left-menu.component.scss']
})
export class ShopLeftMenuComponent implements OnInit, AfterViewInit {
  // @ViewChildren('inputDiscount') inputDiscount: QueryList<ElementRef>;
  @Output() maintainanceShow = new EventEmitter<any>();
  @Input() currentShow;
  modalRef: BsModalRef;
  modalItemListRef: BsModalRef;
  basket$: Observable<IBasket>;
  moreOptionsVisible: boolean;
  withCheckInCheckOutVisible: boolean;
  withDiscountVisible: boolean;
  itemByVouchers: ItemViewModel[] = [];
  itemByVoucher: ItemViewModel;
  inventoryListTS: TInventoryHeader[];
  inventoryListTR: TInventoryHeader[];
  count :number = 0;
  notification:boolean = false;
  promolist = [];
  schemalist = [];
  checkInbyMenber:boolean = false;
  LicensePlate:string;
  checkInbySerial:boolean = false;
  ShowLicenseKey :string = 'false';
  // loadPromoList() {
  //   let basket = this.basketService.getCurrentBasket();
  //   let totalBasket = this.basketService.getTotalBasket();
  //   let now = new Date();
  //   let date = this.GetDateFormat(now);
  //   let customerCode= "";
  //   let customerGroup= "";
  //   let source = this.authService.getCRMSource();
  //   if (basket.customer.mobile !== null && basket.customer.mobile !== undefined && source === 'Capi') {
  //     customerCode = basket.customer.mobile;
  //   }
  //   else {
  //     customerCode = basket.customer.customerId;
  //     customerGroup= basket.customer.customerGrpId;
  //   }
  //   this.promotionService.getPromoList(this.storeSelected.companyCode, this.storeSelected.storeId, 0, customerCode, customerGroup, totalBasket.billTotal, date).subscribe((response: any) => {

  //     if (response.success) {
  //       this.promolist = response.data;
  //       // console.log('this.promolist');
  //       // console.log(this.promolist);
  //     }
  //     // else
  //     // {
  //     //   this.alertify.warning("Promo " + response.message);
  //     // }
  //   })

  // }

  @ViewChild('ManualPromotion', { static: false }) ManualPromotion;
  @ViewChild('ManualDiscount', { static: false }) ManualDiscount;
  @ViewChild('OtherItem', { static: false }) OtherItem;

  // applyPromotionDiscount(discountPromotion) {
  //   // debugger;
  //   let basket = this.basketService.getCurrentBasket();
  //   // this.openPromotionModal(this.ManualPromotion, true , true);
  //   this.resetPromotionModal();
  //   this.basketService.applyPromotionSimulation(basket, null, discountPromotion).subscribe((response: any) => {
  //     debugger;

  //   });
  //   setTimeout(() => { // this will make the execution after the above boolean has changed
  //     basket = this.basketService.getCurrentBasket();
  //     this.discountAllBillType = basket.discountType;
  //     this.discountAllBill = basket.discountValueTemp.toString();
  //   }, 500);
  //   // 

  // }
  // selectedIndex = 0;
  shortcuts: ShortcutInput[] = [];
  shortcuts$: Observable<ShortcutInput[]>;
  tempShortcuts: ShortcutInput[] = [];

  showUserTab = false;
  loadShortcut() {
    // Get item in grido
    //  this.shortcuts = this.commonService.getCurrentShortcutKey();
    // this.shortcuts = [];

    // if(!this.router?.url?.toString().includes('/shop/order-display'))
    // {
      
    // }
    
    for (let i = 2; i <= 12; i++) {
      switch (i) {
        case 2: {
          //statements; 
          this.shortcuts.push(
            {
              key: ["f" + i],
              label: "Cancel Order",
              description: "Cancel Order",
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: (e) => {
                this.toggleModeOptions('Cancel');
              },
              preventDefault: true
            }
          )

          break;
        }
        case 3: {
          //statements; 
          this.shortcuts.push(
            {
              key: ["f" + i],
              label: "Return Order",
              description: "Return Order",
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: (e) => {
                this.toggleModeOptions('Return');
              },
              preventDefault: true
            }
          )


          break;
        }
        case 4: {
          //statements; 
          this.shortcuts.push(
            {
              key: ["f" + i],
              label: "Exchange Order",
              description: "Exchange Order",
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: (e) => {
                this.toggleModeOptions('Exchange');
              },
              preventDefault: true
            }
          )

          break;
        }
        case 5: {
          //statements; 

          this.shortcuts.push(
            {
              key: ["f" + i],
              label: "INSHOP",
              description: "INSHOP",
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: (e) => {
                this.newOrder();
              },
              preventDefault: true
            }
          )
          break;
        }
        case 6: {
          //statements; 
          this.shortcuts.push(
            {
              key: ["f" + i],
              label: "Manual Promotion",
              description: "Manual Promotion",
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: (e) => {
                if (this.router?.url?.toString() === '/shop/order-grocery') {
                  this.openPromotionModal(this.ManualPromotion, false, false);
                }

              },
              preventDefault: true
            }
          )

          break;
        }
        case 7: {
          //statements; 
          this.shortcuts.push(
            {
              key: ["f" + i],
              label: "Manual Discount",
              description: "Manual Discount",
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: (e) => {
                // this.openPromotionModal(this.ManualDiscount, false,false);
                if (this.router?.url?.toString() === '/shop/order-grocery') {
                  this.openPromotionModal(this.ManualDiscount, false, false);
                }
              },
              preventDefault: true
            }
          )

          break;
        }
        case 8: {
          //statements; 
          this.shortcuts.push(
            {
              key: ["f" + i],
              label: "Hold Order",
              description: "Hold Order",
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: (e) => {
                if (this.router?.url?.toString() === '/shop/order-grocery') {
                  this.holdOrder();
                }

              },
              preventDefault: true
            }
          )


          break;
        }
        case 9: {
          //statements; 
          this.shortcuts.push(
            {
              key: ["f" + i],
              label: "Other Item",
              description: "Other Item",
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: (e) => {
                // this.otherItem();
                if (this.router?.url?.toString() === '/shop/order-grocery') {
                  this.openModal(this.OtherItem);
                }

              },
              preventDefault: true
            }
          )
          break;
        }
        case 10: {
          //statements; 
          this.shortcuts.push(
            {
              key: ["f" + i],
              label: "Online",
              description: "Online",
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: (e) => {
                this.router.navigate(['/shop/bills/ecom-bill']).then(() => {
                  // window.location.reload();
                });
              },
              preventDefault: true
            }
          )
          break;
        }
        case 11: {
          //statements; 
          this.shortcuts.push(
            {
              key: ["f" + i],
              label: "Hold list",
              description: "Hold list",
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: (e) => {
                this.router.navigate(['/shop/bills/holdinglist']).then(() => {
                  // window.location.reload();
                });
              },
              preventDefault: true
            }
          )
          break;
        }
        case 12: {
          //statements; 
          this.shortcuts.push(
            {
              key: ["f" + i],
              label: "Bill Search",
              description: "Bill Search",
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: (e) => {
                //  this.route.
                this.router.navigate(['/shop/bills']).then(() => {
                  // window.location.reload();
                });
              },
              preventDefault: true
            }
          )
          break;
        }
        default: {
          //statements; 
          break;
        }
      }
      // let label="f" + i;
      // this.shortcuts = this.shortcuts.filter(x=>x.label !== label);

    }
    this.shortcuts.push(
      {
        key: ["home"],
        label: "User tab",
        description: "User tab",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          // this.showSide();
          // if(this.currentShow === false)
          // {
          //   this.sideRightShow.emit(false);
          // }
          // else
          // {
          //   this.sideRightShow.emit(false);
          // }
          // this.sideRightShow.emit(false);

          // this.openModal(this.OtherItem);
          // const initialState = {
          //   title: 'Permission denied',
          // };
          if (this.showUserTab === false) {

            debugger;
            let modalApprovalRef = this.modalService.show(ShopPopupUserComponent, {
              // initialState, 
              animated: true,
              keyboard: true,
              backdrop: true,
              ignoreBackdropClick: true,
              ariaDescribedby: 'my-modal-description',
              ariaLabelledBy: 'my-modal-title',
              class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
            });
            modalApprovalRef.content.outEvent.subscribe((received: any) => {
              modalApprovalRef.hide();
              this.showUserTab = false;
            });
            modalApprovalRef.onHide.subscribe((reason: string) => {
              this.showUserTab = false;
              // this.commonService.TempShortcuts$.subscribe((data)=>{
              //   this.commonService.changeShortcuts(data, true);
              //   console.log('Old Shorcut' , data );
              // });
            })
          }


        },
        preventDefault: true
      }
    )
    this.shortcuts.push(
      {
        key: ["?"],
        label: "More",
        description: "More",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          this.toggleMoreOptions();
        },
        preventDefault: true
      }
    )

    //  console.log('this.shortcuts X', this.shortcuts);
    this.commonService.changeShortcuts(this.shortcuts, true);
    this.commonService.changeMainShortcuts(this.shortcuts);
  }
  // applySchemaDiscount(schema) {
  //   this.basketService.changeManualSchema(schema);
  //   let basket = this.basketService.getCurrentBasket();
  //   // this.selectedIndex = 0;
  //   this.basketService.applyPromotionSimulation(basket, null, null, schema).subscribe((response: any) => {
  //     debugger;

  //   });
  //   setTimeout(() => { // this will make the execution after the above boolean has changed
  //     basket = this.basketService.getCurrentBasket();
  //     this.discountAllBillType = basket.discountType;
  //     this.discountAllBill = basket.discountValueTemp.toString();
  //   }, 500);
  // }
  // loadSchemaList() {
  //   // debugger;
  //   let basket = this.basketService.getCurrentBasket();
  //   let totalBasket = this.basketService.getTotalBasket();
  //   let now = new Date();
  //   let date = this.GetDateFormat(now);
  //   let customerCode= "";
  //   let customerGroup= "";
  //   let source = this.authService.getCRMSource();
  //   if (basket.customer.mobile !== null && basket.customer.mobile !== undefined && source === 'Capi') {
  //     customerCode = basket.customer.mobile;
  //   }
  //   else {
  //     customerCode = basket.customer.customerId;
  //     customerGroup= basket.customer.customerGrpId;
  //   }
  //   this.promotionService.getSchemaList(this.storeSelected.companyCode, customerCode, customerGroup, totalBasket.billTotal, date).subscribe((response: any) => {
  //     // debugger;
  //     if (response.success) {
  //       this.schemalist = response.data;
  //       console.log('this.schemalist');
  //       console.log(this.schemalist);
  //     }
  //     // else
  //     // {
  //     //   this.alertify.warning("Schema " +response.message);
  //     // }

  //   })

  // }
  // GetDateFormat(date) {
  //   var month = (date.getMonth() + 1).toString();
  //   month = month.length > 1 ? month : '0' + month;
  //   var day = date.getDate().toString();
  //   day = day.length > 1 ? day : '0' + day;

  //   var hours = (date.getHours()).toString();
  //   var min = (date.getMinutes()).toString();
  //   var sec = (date.getSeconds()).toString();
  //   var time = "T" + hours + min + sec;
  //   return date.getFullYear() + '-' + month + '-' + (day);
  // }
  constructor(private pickupService: PickupAmountService, public commonService: CommonService, public authService: AuthService, private basketService: BasketService, private printerService: NgxPrinterService, private billService: BillService,
    private mwiService: MwiService, private promotionService: PromotionService, private userService: UserService, private permissionService: PermissionService,
    private router: Router, private alertify: AlertifyService, private functionService: FunctionService, private shiftService: ShiftService, private excuteFunction: ExcuteFunctionService,
    private customerService: CustomerService, private modalService: BsModalService, private modalService2: BsModalService, private route: ActivatedRoute, private itemService: ItemService,private inventory: InventoryService) {
    this.moreOptionsVisible = false;
    this.withCheckInCheckOutVisible = false;
  }
  showCheckInOut = "true";
  showOtherItem = "false";
  groceryMode = "false";
  discountApprove = "false";
  manualDiscountSetting = "All";
  showToolBox = "false";
  showLeft = false;
  otherItem() {

  }
  onFileChange(evt: any) {
    // debugger;
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    //  if (target.files.length === 0) {
    //   return;
    // }
    let fileToUpload = <File>target.files[0];
    debugger;
    this.commonService.uploadFile(fileToUpload, this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      if(response.success)
      {
        Swal.fire('Upload License', 'Upload License Successfully Completed','success'); 
      }
      else
      {
        Swal.fire('Upload License', response.message,'warning');
      }

    }, error => {
      console.log('Upload License Error', error);
        Swal.fire('Upload License','','error')
    })
 
  }
  pickUpAmount() {
    // const initialState = {
    //   title: 'Permission denied',
    // };
    let permissionModel= { functionId: 'Spc_CancelOrder', functionName: 'Pickup Amount', controlId: '', permission: 'I'};
      const initialState = {
          title: 'Pickup Amount - ' + 'Permission denied',
          // freeApprove : true,
          permissionModel : permissionModel
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
      if (received.isClose) {
        modalApprovalRef.hide();
      }
      else {
        debugger;
        modalApprovalRef.hide();
        // let code = (received.customCode ?? '');
        // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, code, 'Spc_CancelOrder', '', 'I').subscribe((response: any) => {

        //   if (response.success) {
        //     let note = (received.note ?? '');
        //     if (note !== null && note !== undefined && note !== '') {
        //       this.basketService.changeNote(note).subscribe((response) => {

        //       });
        //       this.alertify.success('Set note successfully completed.');
        //     }
           

        //     const initialState = {
        //       pickupBy: received.user
        //     };
        //     // let modalPickupRef = this.modalService.show(ShopPickupAmountInputComponent, {
        //     //   initialState, 
        //     //   animated: true,
        //     //   keyboard: true,
        //     //   backdrop: true,
        //     //   ignoreBackdropClick: true,
        //     //   ariaDescribedby: 'my-modal-description',
        //     //   ariaLabelledBy: 'my-modal-title',
        //     //   class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
        //     // });

        //     // modalPickupRef.content.outPickUp.subscribe((received: any) => {
        //     //   if(received.isClose)
        //     //   {
        //     //     modalPickupRef.hide();
        //     //   }
        //     //   else  
        //     //   {
        //     //     this.createPickup(received);
        //     //     modalPickupRef.hide();
        //     //   } 
        //     // });
        //     // modalPickupRef.onHide.subscribe(() => {
        //     //   modalPickupRef.hide();
        //     //   this.commonService.TempShortcuts$.subscribe((data)=>{
        //     //     this.commonService.changeShortcuts(data, true);
        //     //     console.log('Old Shorcut' , data );
        //     //   });
        //     // })
        //   }
        //   else {
        //     Swal.fire({
        //       icon: 'warning',
        //       title: 'Cancel Order',
        //       text: response.message
        //     });
        //   }
        // })
      }

    });
    modalApprovalRef.onHide.subscribe((reason: string) => {
      this.commonService.TempShortcuts$.subscribe((data) => {
        this.commonService.changeShortcuts(data, true);
        console.log('Old Shorcut', data);
      });
    })
  }
  createPickup(model) {
    this.pickupService.create(model).subscribe((response: any) => {
      if (response.success) {
        this.alertify.success("Pickup amount " + model.amount + " successfully completed");
      }
      else {

        this.alertify.error(response.message);
      }
    })
  }
  printShow = "ItemCode";
  salesDummy = "false";
  async ReOrder(transId) {
    console.log("order back to order", transId)
    let basket = this.basketService.getCurrentBasket();
    if (basket !== null && basket !== undefined) {
      debugger;
      this.basketService.deleteBasket(basket).subscribe(() => {
        debugger;
        
      });
      if (this.authService.getShopMode() === 'FnB') {
        this.router.navigate(["shop/order/receive", transId]).then(() => {
          window.location.reload();
        });
      }
      if (this.authService.getShopMode() === 'Grocery') {
        this.router.navigate(["shop/order-grocery/receive", transId]).then(() => {
          window.location.reload();
        });

      }
    }
    else {
      debugger;
      if (this.authService.getShopMode() === 'FnB') {
        this.router.navigate(["shop/order/receive", transId]).then(() => {
          window.location.reload();
        });
      }
      if (this.authService.getShopMode() === 'Grocery') {
        this.router.navigate(["shop/order-grocery/receive", transId]).then(() => {
          window.location.reload();
        });

      }

    }
  }

    // this.routeNav.navigate(["shop/order/", order.transId]);

  checkInTrans()
  {
    Swal.fire({
      title: 'Receive order!',
      input: 'text',
      icon: 'question',
      text: 'Order Id',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Yes',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value !== null && result.value !== undefined && result.value !== '') {
          this.ReOrder(result.value);
        }
        else {

        }
      }
    })
  }
  // shopMode = "FnB";
  loadSetting() {
    // debugger;
    if (this.storeSelected !== null && this.storeSelected !== undefined) {
      if (this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId) !== null && this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId) !== undefined && this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId)?.length > 0) {
        let showCheckInOut = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'CheckInOut');
        if (showCheckInOut !== null && showCheckInOut !== undefined) {
          this.showCheckInOut = showCheckInOut.settingValue;
        }
        let ShowToolBox = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'ShowToolBox');
        if (ShowToolBox !== null && ShowToolBox !== undefined) {
          let showToolBoxX = ShowToolBox.settingValue; 
          if(showToolBoxX==='true')
          {
            let typeToolBoxX = ShowToolBox.customField1;
            if(typeToolBoxX?.toLowerCase() === 'drag')
            {
              this.showToolBox = 'false';
            } 
            else
            {
              this.showToolBox = 'true';
            }
          }
          // this.showTools = true;
        }

        let showOtherItem = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'SalesPIN');
        if (showOtherItem !== null && showOtherItem !== undefined) {
          this.showOtherItem = showOtherItem.settingValue;
        }
        let salesDummy = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'SalesDummy');
        if (salesDummy !== null && salesDummy !== undefined) {
          this.salesDummy = salesDummy.settingValue;
        }

        let discountApprove = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'DiscountApprove');
        if (discountApprove !== null && discountApprove !== undefined) {
          this.discountApprove = discountApprove.settingValue;
        }

        let groceryMode = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'GroceryMode');
        if (groceryMode !== null && groceryMode !== undefined) {
          this.groceryMode = groceryMode.settingValue;
        }

        let manualDiscountSetting = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'ManualDiscount');
        if (manualDiscountSetting !== null && manualDiscountSetting !== undefined) {
          this.manualDiscountSetting = manualDiscountSetting.settingValue;
          // this.manualDiscountSetting = 'Header';
        }
        let printShow = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'CustomerDisplayMode');
        if (printShow !== null && printShow !== undefined) {
          this.printShow = printShow.settingValue;
        }
        let ShowLicenseKey = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'ShowLicenseKey');
        if (ShowLicenseKey !== null && ShowLicenseKey !== undefined) {
          this.ShowLicenseKey = ShowLicenseKey.settingValue;
        }
      }
    }

 
  }
  toggleMoreOptions() {
    // if(this.moreOptionsVisible)
    // this.commonService.changeShortcuts([], true);
    this.authService.setOrderLog("Click", "More Click", "", "");
    this.moreOptionsVisible = !this.moreOptionsVisible;
  }
  toggleCheckInOptions() {
    this.withCheckInCheckOutVisible = !this.withCheckInCheckOutVisible;
  }
  withToolsVisible= false;
  toggleToolsOptions() {
    this.withToolsVisible = !this.withToolsVisible;
  }
  toolList: any;
  showTool_ClearCache= false;
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
      console.log('this.toolList', this.toolList);
      //Name 
      //functionId
      //CustomF2

    }
  }
  async detectMultiMonitor()
  {
    // Detect if the device has more than one screen.
    

      if (window.screen.isExtended) {
        debugger;

        // this.permissionStatus =   navigator.permissions;
       
        // Request information required to place content on specific screens.
        const screenDetails = await window.getScreenDetails();
 
        console.log('screenDetails', screenDetails.screens);
        // // Detect when a screen is added or removed.
        // screenDetails.addEventListener('screenschange', onScreensChange);

        // // Detect when the current <code data-opaque bs-autolink-syntax='`ScreenDetailed`'>ScreenDetailed</code> or an attribute thereof changes.
        // screenDetails.addEventListener('currentscreenchange', onCurrentScreenChange);

        // Find the primary screen, show some content fullscreen there.
        const primaryScreen = screenDetails.screens.find(s => s.isPrimary);
        // document.documentElement.requestFullscreen({screen : primaryScreen});

        // Find a different screen, fill its available area with a new window.
        const otherScreen = screenDetails.screens.find(s => !s.isPrimary);
        // let fullscreenOptions = { navigationUI: "auto" };

        window.open("shop/order-display", '_blank', `menubar=no,location=no,resizable=no,scrollbars=no,status=yes,left=${otherScreen.availLeft},` +
                                  `top=${otherScreen.availTop},` +
                                  `width=${otherScreen.availWidth},` +
                                  `height=${otherScreen.availHeight}`); 
                                  
                                  // setTimeout(() => {
                                  //   myWindow.focus()
                                  // })
      
      } else {
        // Detect when an attribute of the legacy <code data-opaque bs-autolink-syntax='`Screen`'>Screen</code> interface changes.
        // window.screen.addEventListener('change', onScreenChange);

        // Arrange content within the traditional single-screen environment... 
       
        // Request information required to place content on specific screens.
        const screenDetails = await window.getScreenDetails();
 
        console.log('screenDetails', screenDetails.screens);
        // // Detect when a screen is added or removed.
        // screenDetails.addEventListener('screenschange', onScreensChange);

        // // Detect when the current <code data-opaque bs-autolink-syntax='`ScreenDetailed`'>ScreenDetailed</code> or an attribute thereof changes.
        // screenDetails.addEventListener('currentscreenchange', onCurrentScreenChange);

        // Find the primary screen, show some content fullscreen there.
        const otherScreen = screenDetails.screens.find(s => s.isPrimary);
        document.documentElement.requestFullscreen({screen : otherScreen});

        // Find a different screen, fill its available area with a new window.
        // const otherScreen = screenDetails.screens.find(s => !s.isPrimary);
        // let fullscreenOptions = { navigationUI: "auto" };

         window.open("shop/order-display", '_blank', `resizable=yes,status=no,toolbar=no,scrollbars=yes,location=no,menubar=no,left=${otherScreen.availLeft},` +
                                  `top=${otherScreen.availTop},` +
                                  `width=${otherScreen.availWidth},` +
                                  `height=${otherScreen.availHeight}`); 


                                  
      }
  }
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
        this.withToolsVisible = false;
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
      case 'poleSerialPort': {
        //statements; 
        this.withToolsVisible = false;
        let checkAction = this.authService.checkRole('Tool_PoleSerrialPort', '', 'I');
        if (checkAction) {
            this.commonService.connectSerial(); 
        }
        else
        {
          msg = "Permission denied.";
        } 
        break;
      }
      case 'sendbankeod': {

        this.withToolsVisible = false;
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
  ModeVisible = false;
  toggleModeOptions(mode) {
    this.ModeVisible = !this.ModeVisible;
    this.authService.setOrderLog("Order", mode + " Selected", "Success", "");
    if (mode === 'Return') {
      let checkAction = this.authService.checkRole('Spc_ReturnOrder', '', 'I');
      let checkApprovalRequire =  this.authService.checkRole('Spc_ReturnOrder', '', 'A');
      if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
      {
        checkAction = false;
      }
      if (checkAction) {
        Swal.fire({
          title: 'Return order!',
          input: 'text',
          icon: 'question',
          text: 'Order Id',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Yes',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
            if (result.value !== null && result.value !== undefined && result.value !== '') {
              this.authService.setOrderLog("Order", mode + " Bill no input", "Success", result.value);
              if (this.authService.getShopMode() === 'FnB') {
                this.router.navigate(["shop/return", result.value]).then(() => {
                  window.location.reload();
                });
              }
              if (this.authService.getShopMode() === 'Grocery') {
                this.router.navigate(["shop/order-grocery/return", result.value]).then(() => {
                  window.location.reload();
                });

              }

            }
            else {
              this.authService.setOrderLog("Order", "Close popup " + mode, "Success", "");
            }

          }
        })
      }
      else {
        // const initialState = {
        //   title: 'Return - Permission denied',
        // };
        let permissionModel= { functionId: 'Spc_ReturnOrder', functionName: 'Return', controlId: '', permission: 'I'};
        const initialState = {
            title: 'Return - ' + 'Permission denied',
            // freeApprove : true,
            permissionModel : permissionModel
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
          if (received.isClose) {
            modalApprovalRef.hide();
          }
          else {
            debugger;
            Swal.fire({
              title: 'Return order!',
              input: 'text',
              icon: 'question',
              text: 'Order Id',
              inputAttributes: {
                autocapitalize: 'off'
              },
              showCancelButton: true,
              confirmButtonText: 'Yes',
              showLoaderOnConfirm: true,
              allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
              if (result.isConfirmed) {
                if (result.value !== null && result.value !== undefined && result.value !== '') {
                  this.authService.setOrderLog("Order", mode + " Bill no input", "Success", result.value);
                  if (this.authService.getShopMode() === 'FnB') {
                    this.router.navigate(["shop/return", result.value]).then(() => {
                      window.location.reload();
                    });
                  }
                  if (this.authService.getShopMode() === 'Grocery') {
                    this.router.navigate(["shop/order-grocery/return", result.value]).then(() => {
                      window.location.reload();
                    });

                  }

                }
                else {
                  this.authService.setOrderLog("Order", "Close popup " + mode, "Success", "");
                }

              }
            })
            modalApprovalRef.hide();

            // let code = (received.customCode ?? '');
            // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, code, 'Spc_ReturnOrder', '', 'I').subscribe((response: any) => {
            
            //   if (response.success) {
            //     let note = (received.note ?? '');
            //     if (note !== null && note !== undefined && note !== '') {
            //       this.basketService.changeNote(note).subscribe((response) => {
    
            //       });
            //       this.alertify.success('Set note successfully completed.');
            //     }
              
            //   }
            //   else {
            //     Swal.fire({
            //       icon: 'warning',
            //       title: 'Return Order',
            //       text: response.message
            //     });
            //   }
            // })
          }

        });
        modalApprovalRef.onHide.subscribe((reason: string) => {
          this.commonService.TempShortcuts$.subscribe((data) => {
            this.commonService.changeShortcuts(data, true);
            console.log('Old Shorcut', data);
          });
        })
      }

    }
    if (mode === 'Exchange') {
      let checkAction = this.authService.checkRole('Spc_ExchangeOrder', '', 'I');
      let checkApprovalRequire =  this.authService.checkRole('Spc_ExchangeOrder', '', 'A');
      if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
      {
        checkAction = false;
      }
      if (checkAction) {

        Swal.fire({
          title: 'Exchange order!',
          input: 'text',
          icon: 'question',
          text: 'Order Id',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Yes',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
            if (result.value !== null && result.value !== undefined && result.value !== '') {
              this.authService.setOrderLog("Order", mode + " Bill no input", "Success", result.value);
              if (this.authService.getShopMode() === 'FnB') {
                this.router.navigate(["shop/order/exchange", result.value]).then(() => {
                  window.location.reload();
                });
              }
              if (this.authService.getShopMode() === 'Grocery') {
                this.router.navigate(["shop/order-grocery/exchange", result.value]).then(() => {
                  window.location.reload();
                });

              }
            }
            else {
              this.authService.setOrderLog("Order", "Close popup " + mode, "Success", "");
            }
          }
        })
      }
      else {
        // const initialState = {
        //   title: 'Exchange - Permission denied',
        // };
        let permissionModel= { functionId: 'Spc_ExchangeOrder', functionName: 'Exchange', controlId: '', permission: 'I'};
        const initialState = {
            title: 'Exchange - ' + 'Permission denied',
            // freeApprove : true,
            permissionModel : permissionModel
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
          if (received.isClose) {
            modalApprovalRef.hide();
          }
          else {
            debugger;
            Swal.fire({
              title: 'Exchange order!',
              input: 'text',
              icon: 'question',
              text: 'Order Id',
              inputAttributes: {
                autocapitalize: 'off'
              },
              showCancelButton: true,
              confirmButtonText: 'Yes',
              showLoaderOnConfirm: true,
              allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
              if (result.isConfirmed) {
                if (result.value !== null && result.value !== undefined && result.value !== '') {
                  this.authService.setOrderLog("Order", mode + " Bill no input", "Success", result.value);
                  if (this.authService.getShopMode() === 'FnB') {
                    this.router.navigate(["shop/order/exchange", result.value]).then(() => {
                      window.location.reload();
                    });
                  }
                  if (this.authService.getShopMode() === 'Grocery') {
                    this.router.navigate(["shop/order-grocery/exchange", result.value]).then(() => {
                      window.location.reload();
                    });

                  }
                }
                else {
                  this.authService.setOrderLog("Order", "Close popup " + mode, "Success", "");
                }
              }
            })
            modalApprovalRef.hide();
            // let code = (received.customCode ?? '');
            // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, code, 'Spc_ExchangeOrder', '', 'I').subscribe((response: any) => {
             
            //   if (response.success) {
            //     let note = (received.note ?? '');
            //     if (note !== null && note !== undefined && note !== '') {
            //       this.basketService.changeNote(note).subscribe((response) => {
    
            //       });
            //       this.alertify.success('Set note successfully completed.');
            //     }
              
            //   }
            //   else {
            //     Swal.fire({
            //       icon: 'warning',
            //       title: 'Exchange Order',
            //       text: response.message
            //     });
            //   }
            // })
          }

        });

      }

    }
    if (mode === 'Cancel') {
      let checkAction = this.authService.checkRole('Spc_CancelOrder', '', 'I');
      let checkApprovalRequire =  this.authService.checkRole('Spc_CancelOrder', '', 'A');
      if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
      {
        checkAction = false;
      }
      if (checkAction) {

        Swal.fire({
          title: 'Cancel order!',
          input: 'text',
          icon: 'question',
          text: 'Order Id',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Yes',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
            if (result.value !== null && result.value !== undefined && result.value !== '') {
              this.authService.setOrderLog("Order", mode + " Bill no input", "Success", result.value);
              this.router.navigate(["shop/bills", result.value, this.authService.getCurrentInfor().companyCode, this.storeSelected.storeId]).then(() => {
                window.location.reload();
              });
            }
            else {
              this.authService.setOrderLog("Order", "Close popup " + mode, "Success", "");
            }
          }
        })
      }
      else {
        // const initialState = {
        //   title: 'Cancel - Permission denied',
        // };
        let permissionModel= { functionId: 'Spc_CancelOrder',  functionName: 'Cancel', controlId: '', permission: 'I'};
        const initialState = {
            title: 'Cancel - ' + 'Permission denied',
            // freeApprove : true,
            permissionModel : permissionModel
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
          if (received.isClose) {
            modalApprovalRef.hide();
          }
          else {
            debugger;

            Swal.fire({
              title: 'Cancel order!',
              input: 'text',
              icon: 'question',
              text: 'Order Id',
              inputAttributes: {
                autocapitalize: 'off'
              },
              showCancelButton: true,
              confirmButtonText: 'Yes',
              showLoaderOnConfirm: true,
              allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
              if (result.isConfirmed) {
                if (result.value !== null && result.value !== undefined && result.value !== '') {
                  this.authService.setOrderLog("Order", mode + " Bill no input", "Success", result.value);
                  this.router.navigate(["shop/bills", result.value, this.authService.getCurrentInfor().companyCode, this.storeSelected.storeId]).then(() => {
                    window.location.reload();
                  });
                }
                else {
                  this.authService.setOrderLog("Order", "Close popup " + mode, "Success", "");
                }
              }
            })
            modalApprovalRef.hide();

            
            // let code = (received.customCode ?? '');
            // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass,code, 'Spc_CancelOrder', '', 'I').subscribe((response: any) => {
             
            //   if (response.success) {
            //     let note = (received.note ?? '');
            //     if (note !== null && note !== undefined && note !== '') {
            //       this.basketService.changeNote(note).subscribe((response) => {
    
            //       });
            //       this.alertify.success('Set note successfully completed.');
            //     }
               
            //   }
            //   else {
            //     Swal.fire({
            //       icon: 'warning',
            //       title: 'Cancel Order',
            //       text: response.message
            //     });
            //   }
            // })
          }

        });

      }

    }
    if (mode === 'CheckLicensePlate') {
      let checkAction = this.authService.checkRole('isCheckLicensePlate' , '', 'V' );
      let checkApprovalRequire =  this.authService.checkRole('isCheckLicensePlate', '', 'A');
      if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
      {
        checkAction = false;
      }
      if (checkAction) {
        Swal.fire({
          title: 'Check License Plate!',
          input: 'text',
          icon: 'question',
          text: 'License Plate',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Yes',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
           if (result.value !== null && result.value !== undefined && result.value !== '') {
              // this.authService.setOrderLog("Order", mode + " Bill no input", "Success", result.value);
              // this.router.navigate(["shop/order"]).then(() => {
              //   // window.location.reload();
              // });
              this.LicensePlate = result.value;
              this.openModelCheckLicense();
            }
            else {
              // this.authService.setOrderLog("Order", "Close popup " + mode, "Success", "");
            }

          }
        })
      }
      else {
      }

    }
  }
  toggleDiscountOptions() {
    this.withDiscountVisible = !this.withDiscountVisible;
  }
  storeSelected: MStore;
  currentShift: TShiftHeader;
  ngAfterViewInit() {

    setTimeout(() => { this.loadSetting(), this.loadFunctionOnShow(); 
      if(this.showToolBox === 'true')
      {
        this.showTool_ClearCache = false;
        this.loadTools();
      }
    }, 1000)
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function (item) {
      // Do stuff here
      if (item !== null && item !== undefined) {
        item.classList.remove('hide');
        item.classList.add('show');
      }
    });
    // setTimeout(() => { 
    //   // this will make the execution after the above boolean has changed

    // },500);
    this.loadShortcut();

  }
  employees: MEmployee[];
  userLicense = "";

  ngOnInit() {
    // debugger;

    this.showTool_ClearCache =  this.authService.checkRole('Tool_ClearCache' , '', 'V' );
    this.checkInbyMenber = this.authService.checkRole('Adm_CheckinBymember' , '', 'V' );
    this.checkInbySerial = this.authService.checkRole('Adm_CheckinBySerial' , '', 'V' );
    this.storeSelected = this.authService.storeSelected();
    this.basket$ = this.basketService.basket$;
    this.basketDiscountTotal$ = this.basketService.basketTotalDiscount$;
    
    this.currentShift = this.shiftService.getCurrentShip();
    this.shortcuts$ = this.commonService.Shortcuts$;
    // debugger;
    let test = this.route;

    this.poleValue = this.getPole();
    if(this.authService.checkRole('Adm_InvNotification' , '', 'V' ))
    {
      this.notification = true;
      this.loadList();
    }
    
    let user = this.authService.getCurrentInfor();
    this.userLicense = user?.license??'';
    
    // this.route.data.subscribe(data => {
    
    //   this.employees = data['employees'].data;
    //   console.log('this.employees', this.employees);
    // });

    // 
  }
  // isShown: boolean;
  // returnDiscountRow(row: IBasketItem) {

  //   if (row.discountHistory !== null && row.discountHistory !== undefined && row.discountHistory.length > 0) {
  //     var newArray = row.discountHistory.filter(value => Object.keys(value).length !== 0);

  //     row = newArray[newArray.length - 1];
  //     this.discountInline(row.discountValue.toString(), row.discountType, false, false);
  //   }
  // }
  // togleSubmenu() {
  //   this.isShown = !this.isShown;
  //   this.maintainanceShow.emit(this.isShown);
  // }
  menuList: MFunction[] = [];
  redirectUrl(functionId, url, name)
  {
    /// Check quyền nha
    // functionId
    debugger;
    this.authService.setOrderLog("Order", "Redirect", "", name);
    let checkAction = this.authService.checkRole(functionId, '', 'I');
    let checkApprovalRequire =  this.authService.checkRole(functionId, '', 'A');
    if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
    {
      checkAction = false;
    }
    if (checkAction) {

      this.redirectTo(url);
    }
    else {
      // const initialState = {
      //   title: name + ' - Permission denied',
      // };
      let permissionModel= { functionId: functionId,  functionName: name, controlId: '', permission: 'I'};
      const initialState = {
          title: name  + ' - Permission denied', 
          // freeApprove : true,
          permissionModel : permissionModel
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
        if (received.isClose) {
          modalApprovalRef.hide();
        }
        else { 
          this.authService.setOrderLog("Order", "Redirect", "Success", url);
          this.redirectTo(url);
          modalApprovalRef.hide();

          // let code = (received.customCode ?? '');
          // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, code, functionId, '', 'I').subscribe((response: any) => {
            
          //   if (response.success) {
          //     let note = (received.note ?? '');
          //     if (note !== null && note !== undefined && note !== '') {
          //       this.basketService.changeNote(note).subscribe((response) => {
  
          //       });
          //       this.alertify.success('Set note successfully completed.');
          //     }
            
          //   }
          //   else {
          //     Swal.fire({
          //       icon: 'warning',
          //       title: name ,
          //       text: response.message
          //     });
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
    
  }
  loadFunctionOnShow() {
    this.functionService.getFuntionMenuShow(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      // this.menuList=data;
      if (response.success) {
        if (response.data !== null && response.data !== undefined && response.data?.length > 0) {
          response.data.forEach(menu => {
            this.menuList.push(menu);
            // let check = this.authService.checkRole(menu.functionId, '', 'V');
            // if (check === true) {
            // }
            // else {
            // }
          });
        }
      }

    });
  }
  // removeVoucher(voucher) {
  //   let basket = this.basketService.getCurrentBasket();
  //   if (basket.voucherXApply.some(x => x.discount_code === voucher.discount_code)) {
  //     basket.voucherXApply = basket.voucherXApply.filter(x => x.discount_code !== voucher.discount_code);
  //     this.basketService.setBasket(basket);
  //   }

  // }
  // checkVoucherInBasket(voucherCode) {
  //   // debugger;
  //   let basketCheck = this.basketService.getCurrentBasket();
  //   if (basketCheck.voucherXApply == null || basketCheck.voucherXApply === undefined) {
  //     return true;
  //   }
  //   else {
  //     if (basketCheck.voucherXApply.some(x => x.voucher_code === voucherCode)) {
  //       return false;
  //     }
  //   }
  //   return true;;
  // }
  closeModal(close) {
    if (close === true) {
      this.modalRef.hide();
    }

    let basketCheck = this.basketService.getCurrentBasket();
    debugger;
    basketCheck.voucherApply = [];
    // basketCheck.promotionApply = [];
    this.basketService.setBasket(basketCheck);
  }
  // voucherValue: string = '';
  // @ViewChild('txtVoucher', { static: false }) txtVoucher;
  // findVoucherDetail(voucher, template) {
  //   // this.txtVoucher.value = "";
  //   // basket.customer.customerId
  //   let basket = this.basketService.getCurrentBasket();
  //   if (voucher !== null && voucher !== undefined && voucher !== '') {
  //     voucher = voucher.replace(/\s/g, "");
  //     if (!this.checkVoucherInBasket(voucher)) {
  //       this.alertify.warning("Can't add voucher. Please check your voucher.");
  //     }
  //     else {
  //       this.mwiService.validateVoucher(basket.customer.id, voucher, this.storeSelected.storeId).subscribe((response: any) => {
  //         console.log("response find", response);
  //         if (response.status === 1) {
  //           debugger;
  //           this.voucherValue = '';
  //           let voucher = new TapTapVoucherDetails(); voucher = response.data as TapTapVoucherDetails;

  //           voucher.discount_type = voucher.discount_type.toString();
  //           voucher.discount_value = voucher.discount_value.toString();
  //           voucher.discount_upto = voucher.discount_upto.toString();
  //           voucher.discount_code = voucher.discount_code.toString();
  //           voucher.max_redemption = voucher.max_redemption;
  //           voucher.min_bill_amount = voucher.min_bill_amount.toString();
  //           voucher.redemption_count = voucher.redemption_count;

  //           console.log("voucher", voucher);

  //           let twoChar = voucher.discount_code.substring(0, 2);
  //           if (twoChar !== ("PR" || "PI") || voucher.discount_code !== ("xyz_123" || 'MC')) {
  //             if (twoChar === "BL") {
  //               this.ShowAllItemByVoucher(voucher, template);
  //             } else {
  //               this.alertify.warning("Voucher cannot be used to promotion. Please check your voucher.");
  //             }
  //           }
  //           else {
  //             // if (voucher.discount_code === 'MC') {
  //             //   this.mwiService.redeemVoucher(cusId, voucher, this.storeSelected.storeId, '').subscribe((response: any) => {
  //             //     console.log(response);
  //             //     if (response.status === 1) {

  //             //       this.alertify.success(response.message);
  //             //     }
  //             //     else {
  //             //       this.alertify.success(response.message);
  //             //     }
  //             //   })
  //             // }
  //             // else
  //             // {
  //             let basket = this.basketService.getCurrentBasket();
  //             // basket.customer.id = basket.customer.mobile;
  //             this.basketService.applyPromotionSimulation(basket, voucher);
  //             setTimeout(() => { // this will make the execution after the above boolean has changed
  //               basket = this.basketService.getCurrentBasket();
  //               this.discountAllBillType = basket.discountType;
  //               this.discountAllBill = basket.discountValueTemp.toString();
  //             }, 500);
  //             // this.discountAllBill = this.basketService.getCurrentBasket().discountValue.toString();
  //             // this.discountAllBillType =  this.basketService.getCurrentBasket().discountType.toString();
  //             // }


  //           }

  //         }
  //         else {
  //           if(response.msg==='' || response.msg===undefined || response.msg===null)
  //           {
  //             response.msg = "Can't found data. Please check your voucher number";
  //           }
  //           this.alertify.warning(response.msg);
  //         }

  //       });

  //     }
  //   }
  //   else {
  //     this.alertify.warning('Voucher code is null. Please input voucher');
  //   }


  // }
  // voucherListTemp:any =[];
  // vouchertemp = {};
  // ShowAllItemByVoucher(voucher, template) {
  //   // voucher = 'VO_SIZE_SML';
  //   if (voucher !== null && voucher !== undefined && voucher !== '') {
  //     let vouchercode = voucher.discount_code;
  //     let store = this.authService.storeSelected();
  //     this.itemService.GetItemByVoucherCollection(store.companyCode, vouchercode).subscribe((response: any) => {
  //       if (response.data.length > 0) {
  //         this.itemByVouchers = response.data;
  //         this.vouchertemp = voucher;
  //         console.log("this.itemByVouchers", this.itemByVouchers);
  //         setTimeout(() => {
  //           this.modalItemListRef = this.modalService.show(template, {
  //             ariaDescribedby: 'my-modal-description',
  //             ariaLabelledBy: 'my-modal-title',
  //             class: 'modal-dialog modal-dialog-centered modal-sm'
  //           });
  //         });
  //       } else {
  //         this.alertify.warning('Voucher code not item. Please input item voucher');
  //       }

  //     });


  //   }
  // }

  // ApplyData(data ) {
  //   if (data.uomName != null) {
  //     data.uomName = data.uomName;
  //   } else {
  //     data.uomName = '';
  //   }

  //   this.itemService.getItemViewList(data.companyCode, this.authService.storeSelected().storeId, data.itemCode, data.uomName, '', '', '', '', '', '').subscribe((response: any) => {
  //     // debugger;
  //     if (response.success == true) {
  //       this.itemByVoucher = response.data[0];
  //       debugger;
  //       this.itemByVoucher.defaultPrice = 0;
  //       this.itemByVoucher.priceAfterTax =0;
  //       this.itemByVoucher.priceBeforeTax =0;
  //       let itemBasket = this.basketService.mapProductItemtoBasket(this.itemByVoucher, 1);
  //       itemBasket.price = 0;
  //       itemBasket.promotionIsPromo = "1";
  //       itemBasket.promotionLineTotal = 0;
  //       itemBasket.promotionPriceAfDis = 0;
  //       itemBasket.discountType = "Fixed Quantity";
  //       itemBasket.promotionType = "Fixed Quantity";
  //       this.basketService.addPromotionItemToSimulation(itemBasket);
  //       // voucherListTemp:any =[];
  //       // vouchertemp = {};
  //       this.basketService.addVoucherToBasket(this.vouchertemp);
  //       this.vouchertemp = {};
  //       this.modalItemListRef.hide();
  //     }
  //   });
  // }

  // openPromotionDetail(item) {

  //   const initialState = {
  //     promotionCode: item.discount_code
  //   };
  //   this.modalRef = this.modalService.show(ShopToolPromotionDetailViewComponent, { initialState });
  // }
  // @ViewChildren('discount') discount: QueryList<DxTextBoxComponent>;


  // loadShortcutManual()
  // {
  //   for(let i= 1; i<= 10; i++)
  //   {
  //     let label="Row " + i;

  //     this.shortcuts.push(
  //       {
  //         key: ["alt + " + i],
  //         label: label,
  //         description: "Row " + i,
  //         allowIn: [AllowIn.Textarea, AllowIn.Input],  
  //         command: (e) => {

  //           setTimeout(() => {
  //             debugger;
  //             let items= this.basketService.getCurrentBasket().promotionItems;

  //             let item: any=  items[i - 1];

  //             if(item!==null && item!==undefined)
  //             {
  //               this.discountSelectedRow = i - 1;

  //             }
  //           }, 50);
  //         },
  //         preventDefault: true
  //       }
  //     )
  //   }

  //   this.shortcuts.push( 
  //     {
  //       key: ["esc"],
  //       label: "Out of discount row" ,
  //       description: "Out of discount row",
  //       allowIn: [AllowIn.Textarea, AllowIn.Input],  
  //       command: (e) => { 
  //         this.discountSelectedRow = -1;
  //       },
  //       preventDefault: true
  //     },
  //     {
  //       key: ["alt + q"],
  //       label: "Focus discount input" ,
  //       description: "Focus discount input",
  //       allowIn: [AllowIn.Textarea, AllowIn.Input],  
  //       command: (e) => {
  //         debugger;
  //         if(this.discountSelectedRow!==null && this.discountSelectedRow!==undefined && this.discountSelectedRow!==-1 )
  //         {

  //           let item = this.basketService.getCurrentBasket().promotionItems;
  //           this.setDiscountClickedRow(this.discountSelectedRow,item[this.discountSelectedRow] );
  //           this.setFocus(this.discountSelectedRow);
  //         }
  //       },
  //       preventDefault: true
  //     },

  //     {
  //       key: ["backspace"],
  //       label: "Back",
  //       description: "Back",
  //       command: (e) => {

  //       },
  //       preventDefault: true
  //     },


  //   )

  //   this.commonService.changeShortcuts(this.shortcuts, true);

  // }
  openModal(template: TemplateRef<any>) {
    let basket = this.basketService.getCurrentBasket();
    console.log("basket", basket);
    debugger;

    let canAddItem = true;
    if (basket.items !== null && basket.items !== undefined && basket.items?.length === 0) {
      canAddItem = true;
    }
    else {
      let item = basket.items[0];
      let typeOfItem = item.customField1?.toLowerCase();

      if (typeOfItem === 'pn' || typeOfItem === 'pin' || typeOfItem === 'topup' || typeOfItem === 'tp' || typeOfItem === 'bp') {
        let itemBasket = basket.items.filter(x => x.customField1?.toLowerCase() !== 'pn' && x.customField1?.toLowerCase() !== 'pin'
          && x.customField1?.toLowerCase() !== 'topup' && x.customField1?.toLowerCase() !== 'tp' && x.customField1?.toLowerCase() !== 'bp')
        if (itemBasket !== null && itemBasket !== undefined && itemBasket.length > 0) {
          canAddItem = false;
          Swal.fire({
            icon: 'warning',
            title: 'Item',
            text: "Can't add item PIN / TOPUP / Bill Payment with Retail item"
          });
        }
      }
      else {
        canAddItem = false;
        Swal.fire({
          icon: 'warning',
          title: 'Item',
          text: "Can't add item PIN / TOPUP / Bill Payment with Retail item"
        });

      }
    }
    if (canAddItem) {
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
          this.commonService.TempShortcuts$.subscribe((data) => {
            this.commonService.changeShortcuts(data, true);
            console.log('Old Shorcut', data);
          });
        })
      });
      // xxxxx
    }



    // this.selectedRow = null;
    // this.amountCharge =null;
    // this.payment=null;
  }
  // openOtherModal(template: TemplateRef<any>)
  // {

  //   setTimeout(() => {
  //     this.modalRef = this.modalService.show(template, {
  //       ariaDescribedby: 'my-modal-description',
  //       ariaLabelledBy: 'my-modal-title', 
  //       class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
  //     });
  //   });

  // }
  @ViewChild('popup', { static: false }) popup;
  onResized(e) {
    setTimeout(() => {
      if (this.popup != null && this.popup.instance != null) {
        this.popup.instance.option('position', { at: 'center' });
      }
    })
  }

  newOrder() {
    // debugger;
    let shopmode = this.authService.getShopMode();

    let ShopModeData = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'ShopMode');
    
    // this.router.navigate(['/shop/order']).then(() => {
    //   // window.location.reload();
    // });
    if (shopmode === 'FnB') {
      if(ShopModeData.customField1?.length > 0 && ShopModeData.customField1 === 'Table')
      {
        if(this.shiftService.getCurrentShip()!==null && this.shiftService.getCurrentShip()!==undefined)
        {
          this.router.navigate(["shop/placeInfo", this.authService.storeSelected().storeId]).then(()=>{
            // setTimeout(() => {
            //   window.location.reload();
            // }, 1000);
          });
        }
        else
        {
          this.router.navigate(['/shop/order']).then(() => {

          });
        }
      
      }
      else
      {
        this.router.navigate(['/shop/order']).then(() => {

        });
      }
    
    }
    if (shopmode === 'FnBTable') {
      
      if(this.shiftService.getCurrentShip()!==null && this.shiftService.getCurrentShip()!==undefined)
      {
        this.router.navigate(["shop/placeInfo", this.authService.storeSelected().storeId]).then(()=>{
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
      }
      else
      {
        this.router.navigate(['/shop/order']).then(() => {

        });
      }  
    }
    if (shopmode === 'Grocery') {

      this.router.navigate(['/shop/order-grocery']).then(() => {

      });
    }


  }
  redirectTo(uri: string) {
    this.router.navigate([uri]).then(() => {
      // window.location.reload();
    });
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>


  }
  holdOrder() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to hold this bill!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        // this.basketService.addOrder("","HOLD");
        this.holdOrderX();
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })

  }
  returnMode = true;
  @ViewChild('PrintTemplate')
  private PrintTemplateTpl: TemplateRef<any>;

  printTemplate() {
    this.printerService.printAngular(this.PrintTemplateTpl);
  }
  outPutModel: Order;
  getBill(transId) {
    return this.billService.getBill(transId, this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any) => {
      this.basketService.changeIsCreateOrder(false);
      this.basketService.changeBasketResponseStatus(true);   
      if (response.success) {
        if (response.data !== null && response.data !== undefined) {
          console.log('this.outPutModel', this.outPutModel);
          // clearInterval(this.interval);
          setTimeout(() => {
            this.outPutModel = response.data;
          }, 100);
          setTimeout(() => {
            this.clearOrder();
          }, 300);
         
          // this.printTemplate();
        }
        else {
          this.alertify.warning(response.message);
        }
      }
    })
  }
  clearOrder() {
    debugger;
 
    const basket = this.basketService.getCurrentBasket();
    let currentType = basket.salesType;
    this.employees = this.basketService.getCurrentEmployeeList();
    this.basketService.deleteBasket(basket).subscribe(() => {

    });
    this.basketService.changeIsGenOrderNo(true);
    let cus = this.authService.getDefaultCustomer();

    if (cus !== null && cus !== undefined) {
      debugger;
      // setTimeout(() => {
      this.basketService.changeCustomer(cus, "Retail").subscribe(() => {
        // this.route.navigate(['/shop/order']).then();

      });
     
      let defEmployee = this.authService.getCurrentInfor()?.defEmployee;
      if (defEmployee !== null && defEmployee !== undefined && defEmployee !== '') {
        // debugger;
        if(this.employees!==null && this.employees!==undefined && this.employees?.length > 0)
        {
          let employee = this.employees.find(x => x.employeeId === defEmployee);
          if (employee !== null && employee !== undefined) { 
            this.basketService.changeEmployee(employee);
            // this.basketService.changeEmployee(employee);
          }
          else {
            if (this.employees.length > 0) {
              this.basketService.changeEmployee(this.employees[0]);
              // this.order.salesPerson = this.employees[0].employeeId;
            }
            // this.alertify.warning("Can't set default employee. B/c employee " + defEmployee + " has not existed in store " + this.storeSelected.storeId);
          }
        }
      }
      if (this.authService.getShopMode() === 'FnB') {
        this.router.navigate(["shop/order"]).then(() => {
          // window.location.reload();
        });
      }
      if (this.authService.getShopMode() === 'Grocery') {
        this.router.navigate(["shop/order-grocery"]).then(() => {
          // window.location.reload();
        });

      }
      // }, 2); 
    }
    else {
      this.customerService.getItem(this.storeSelected.companyCode, this.storeSelected.defaultCusId).subscribe((response: any) => {
        debugger;
        this.basketService.changeCustomer(response.data, "Retail").subscribe(() => {

        });
        let defEmployee = this.authService.getCurrentInfor()?.defEmployee;
        if (defEmployee !== null && defEmployee !== undefined && defEmployee !== '') {
          // debugger;
          if(this.employees!==null && this.employees!==undefined && this.employees?.length > 0)
          {
            let employee = this.employees.find(x => x.employeeId === defEmployee);
            if (employee !== null && employee !== undefined) { 
              this.basketService.changeEmployee(employee);
              // this.basketService.changeEmployee(employee);
            }
            else {
              if (this.employees.length > 0) {
                this.basketService.changeEmployee(this.employees[0]);
                // this.order.salesPerson = this.employees[0].employeeId;
              }
              // this.alertify.warning("Can't set default employee. B/c employee " + defEmployee + " has not existed in store " + this.storeSelected.storeId);
            }
          }
         
        }
        if (this.authService.getShopMode() === 'FnB') {
          this.router.navigate(["shop/order"]).then(() => {
            // window.location.reload();
          });
        }
        if (this.authService.getShopMode() === 'Grocery') {
          this.router.navigate(["shop/order-grocery"]).then(() => {
            // window.location.reload();
          });

        }
        // this.route.navigate(['/shop/order']);


      });
    }
  }
  holdOrderX() {
    this.basketService.addOrder("", "HOLD").subscribe(
      (response: any) => {
        this.basketService.changeIsCreateOrder(false);
        this.basketService.changeBasketResponseStatus(true);   
        if (response.success) {
          this.alertify.success(response.message);
          this.getBill(response.message);

        }
        else {
          this.basketService.changeIsCreateOrder(false);
          this.basketService.changeBasketResponseStatus(true);   
          this.alertify.error(response.message);


        }

      },
      (error) => {
        this.basketService.changeIsCreateOrder(false);
        this.basketService.changeBasketResponseStatus(true);   
        this.alertify.error(error);

      }
    );
  }
  // selectedRow : number  ;
  discountSelectedRow: number;
  isShowNumpadDiscount: boolean = false;
  itemPromotionSelected: IBasketItem;

  basketDiscountTotal$: Observable<IBasketDiscountTotal>;
  IsDiscountAllBill: boolean = false;
  discountAllBill: string = "0";
  discountAllBillType: string = "Discount Percent";
  ispercentDiscountAllBill: boolean = true;
  discountInLineType: string = "Discount Percent";
  discountInLineAmount: string = "0";
  discountModalShow: boolean = false;
  discountAmount: string;
  numpadParram: NumpadDiscountParam;


  openPromotionModal(template: TemplateRef<any>, clearPromo, reset) {

    // this.commonService.Shortcuts$.subscribe((data) => {
    //   if(data!==null && data!==undefined)
    //   {
    //     debugger;
    //     this.commonService.changeTempShortcuts(data);
    //   }

    // });
    // this.commonService.Shortcuts$.forEach
    // this.commonService.Shortcuts$.subscribe((element) => {
    //   debugger;
    //   element.forEach(elementX => {
    //     debugger;
    //     this.tempShortcuts.push(elementX);
    //   });

    //   this.commonService.changeTempShortcuts(this.tempShortcuts);
    // });

    // debugger;
    let basket = this.basketService.getCurrentBasket();
    debugger;
    var newArray = [];
    basket.voucherApplyTemp = [];
    if(basket.voucherApply!==null && basket.voucherApply!==undefined && basket.voucherApply?.length > 0)
    {
      basket.voucherApply.forEach(val => newArray.push(Object.assign({}, val))); 
      basket.voucherApplyTemp = newArray;
    } 
    
    // this.loadShortcutManual();
    let canAddItem = true;
    if (basket.items !== null && basket.items !== undefined && basket.items?.length > 0) {
      let item = basket.items[0];
      let typeOfItem = item.customField1?.toLowerCase();

      if (typeOfItem === 'pn' || typeOfItem === 'pin' || typeOfItem === 'topup' || typeOfItem === 'tp' || typeOfItem === 'bp') {

        canAddItem = false;
        Swal.fire({
          icon: 'warning',
          title: 'Item',
          text: "Can't Run Promotion / Discount for  PIN / TOPUP / Bill Payment items"
        });

      }
      else {
        canAddItem = true;
        // Swal.fire({
        //   icon: 'warning',
        //   title: 'Item',
        //   text: "Can't add item PIN / TOPUP / Bill Payment with Retail item"
        // });

      }
    }

    this.approveDisplay = false;
    if (canAddItem) {
      if (reset === true) {
        this.modalRef.hide();
        
        this.closeModal(false);
      }
      else {
        // this.toggleDiscountOptions();
      }
      this.discountModalShow = true;
      this.discountSelectedRow = null;
      this.discountAmount = null;
      this.IsDiscountAllBill = false;
      this.isShowNumpadDiscount = false;
      this.discountInLineAmount = "";
      // this.loadPromoList();
      // this.loadSchemaList();
    
      if (clearPromo === true) {

        setTimeout(() => {
          this.basketService.resetDiscountPromotion(true, false);
        }, 2);

        setTimeout(() => {
          this.IsDiscountAllBill = true;
          // // this.isShowNumpadDiscount=true;
          this.discountInLineAmount = "";
          this.discountSelectedRow = null;
          // // debugger;
          // this.numpadParram = new NumpadDiscountParam();
          // this.numpadParram.isline=false;
          // this.numpadParram.replace= true;
          // this.numpadParram.type = "Discount Percent";
          // this.numpadParram.value = "0";
          let model = {
            isClear: false,
            isClose: false,
            isFastClick: undefined,
            isline: false,
            replace: undefined,
            type: "Discount Percent",
            value: "0"
          }

          // this.addNumToTextbox(model, false, false);
          
          
          this.modalRef = this.modalService.show(template, {
            ariaDescribedby: 'my-modal-description',
            ariaLabelledBy: 'my-modal-title',
            keyboard: true,
            backdrop: 'static',
            ignoreBackdropClick: false,
            class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
          });
          this.modalRef.onHide.subscribe((reason: string) => {
            this.commonService.TempShortcuts$.subscribe((data) => {
              this.commonService.changeShortcuts(data, true);
              console.log('Old Shorcut', data);
            });
          })
        }, 100);
        
      } else {
        //No giữ nguyên promotion 
        debugger;
        setTimeout(() => {
          this.basketService.resetDiscountPromotion(false, false);
        }, 2);
        debugger;
        setTimeout(() => {
          this.discountAllBill = this.basketService.getCurrentBasket()?.discountValue?.toString();
          this.discountAllBillType = this.basketService.getCurrentBasket()?.discountType?.toString();
  
          this.modalRef = this.modalService.show(template, {
            ariaDescribedby: 'my-modal-description',
            ariaLabelledBy: 'my-modal-title',
            keyboard: true, backdrop: 'static',
            ignoreBackdropClick: false,
            class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
          });
          this.modalRef.onHide.subscribe((reason: string) => {
            this.commonService.TempShortcuts$.subscribe((data) => {
              this.commonService.changeShortcuts(data, true);
              console.log('Old Shorcut', data);
            });
          })
        }, 20);
       
      }


    }

  }
  // this.modalRef = this.modalService.show(template, {
  //   ariaDescribedby: 'my-modal-description',
  //   ariaLabelledBy: 'my-modal-title',
  //   keyboard: true,
  //   backdrop: 'static',
  //   ignoreBackdropClick: false, 
  //   class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
  // });

  // this.modalRef.onHide.subscribe((reason: string) => {
  //   this.loadShortcut();
  // })
  resetPromotionModal() {
    // debugger;

    this.discountModalShow = true;
    this.discountSelectedRow = null;
    this.discountAmount = null;
    this.IsDiscountAllBill = false;
    this.isShowNumpadDiscount = false;
    this.discountInLineAmount = "";

 
    // this.loadPromoList();
    // this.loadSchemaList();


    setTimeout(() => {
      this.basketService.resetDiscountPromotion(true, false);
    }, 2);

    this.IsDiscountAllBill = true;
    // // this.isShowNumpadDiscount=true;
    this.discountInLineAmount = "";
    this.discountSelectedRow = null;
    // // debugger;
    // this.numpadParram = new NumpadDiscountParam();
    // this.numpadParram.isline=false;
    // this.numpadParram.replace= true;
    // this.numpadParram.type = "Discount Percent";
    // this.numpadParram.value = "0";
    let model = {
      isClear: false,
      isClose: false,
      isFastClick: undefined,
      isline: false,
      replace: undefined,
      type: "Discount Percent",
      value: "0"
    }

    // this.addNumToTextbox(model, false, false);



  }
  isFastClick: boolean = false;
  @Output() sideRightShow = new EventEmitter<any>();
  showSide() {
    // debugger;
    this.sideRightShow.emit(true);
  }
  // keyUpValue(value: any, index, item, discount) {
  //   debugger;
  //   if (value === null || value === undefined || value === "") {
  //     value = "0";
  //   }
  //   if (value !== null && value !== undefined) {
  //     value = value.toString().split(',').join('');
  //   }

  //   if (this.isNumber(value)) {
  //     this.numpadParram = new NumpadDiscountParam();
  //     this.numpadParram.isline = true;
  //     this.numpadParram.replace = true;
  //     this.numpadParram.type = (item.discountType === "" || item.discountType === undefined || item.discountType.toString() === "undefined") ? "Discount Percent" : item.discountType;
  //     if (value === null || value === undefined || value === "") {
  //       value = 0;
  //     }
  //     let inputValue = parseFloat(value.toString().split(',').join('')).toString();
  //     // this.isShowNumpadDiscount=true;
  //     // this.refresh();
  //     // debugger;
  //     if (this.numpadParram.type === 'Discount Percent') {
  //       if (item.lineTotal - (value * item.promotionLineTotal) / 100 >= 0) {
  //         if (parseFloat(inputValue) <= 100) {
  //           this.numpadParram.value = inputValue;
  //         }
  //         else {
  //           this.numpadParram.value = inputValue.substring(0, inputValue.length - 1);
  //           item.discountValue = parseFloat(inputValue.substring(0, inputValue.length - 1));
  //           this.alertify.warning("Discount value more than bill value.");
  //         }

  //       }
  //       else {
  //         //failed 
  //         this.numpadParram.value = inputValue.substring(0, inputValue.length - 1);
  //         item.discountValue = parseFloat(inputValue.substring(0, inputValue.length - 1));
  //         this.alertify.warning("Discount value more than bill value.");
  //         //  console.log('A');
  //       }
  //     }
  //     debugger;
  //     if (this.numpadParram.type === 'Discount Amount') {

  //       if (item.lineTotal - parseFloat(inputValue) >= 0) {
  //         this.numpadParram.value = inputValue;

  //       }
  //       else {
  //         if (item.discountValue === parseFloat(inputValue)) {

  //         }
  //         else {
  //           this.numpadParram.value = inputValue.substring(0, inputValue.length - 1);
  //           item.discountValue = this.transform(inputValue.substring(0, inputValue.length - 1));
  //           this.alertify.warning("Discount value more than bill value.");
  //         }


  //       }
  //     }
  //     // debugger;
  //     this.addNumToTextbox(this.numpadParram, true, true);
  //   }
  //   else {
  //     item.discountValue = value.substring(0, value.length - 1);
  //   }


  // }
  onFocusOutEvent(event: any) {
    // console.log(event.target.value);
    // this.isShowNumpadDiscount=false;
    // this.discountAmount ="";
    // this.discountSelectedRow = 0;  
    // this.IsDiscountAllBill=false;
    // this.discountInLineAmount ="";


    // this.isShowNumpadDiscount=false;

  }
  transform(val) {
    if (val) {
      val = this.format_number(val.toString(), '');
    }
    return val;
  }

  format_number(number, prefix) {
    // debugger;
    let thousand_separator = ',',
      decimal_separator = '.',
      regex = new RegExp('[^' + decimal_separator + '\\d]', 'g'),
      number_string = number.replace(regex, '').toString(),
      split = number_string.split(decimal_separator),
      rest = split[0].length % 3,
      result = split[0].substr(0, rest),
      thousands = split[0].substr(rest).match(/\d{3}/g);

    if (thousands) {
      let separator = rest ? thousand_separator : '';
      result += separator + thousands.join(thousand_separator);
    }
    result = split[1] != undefined ? result + decimal_separator + split[1] : result;
    return prefix == undefined ? result : (result ? prefix + result : '');
  };
  inputNote(value) {
    // debugger;
    if (value !== null && value !== undefined && value !== '') {
      this.basketService.changeNote(value).subscribe((response) => {

      });
      this.alertify.success('Set note successfully completed.');
      ;
      // console.log( this.basketService.getCurrentBasket());
    }

  }
  // discountTotalBill(value) {
  //   debugger;
  //   if (value === null || value === undefined || value === "") {
  //     value = 0;
  //   }
  //   else {
  //     value = value.toString().split(',').join('').toString();
  //   }
  //   let decimalPlacesFormat = parseFloat(this.authService.loadFormat().decimalPlacesFormat) ?? 0;
  //   var lastChar = value.substr(value.length - 1); 
  //   var last2Char = value.substr(value.length - decimalPlacesFormat); 
  //   if(lastChar === '.' || last2Char === '.0')
  //   {

  //   }
  //   else
  //   {
  //     let basket = this.basketService.getCurrentBasket();
  //     if (this.discountAllBillType === "Discount Amount") {

  //       let baskettotal = this.basketService.getTotalBasket();
  //       let ttAmount = baskettotal.amountLeft;
  //       if (value > ttAmount) {
  //         this.alertify.warning("Can't add more than total amount");
  //         this.discountAllBill = value.substring(0, value.length - 1);
  //       }
  //       else {
  //         this.discountAllBill = value;
  //         basket.discountTypeTemp = this.discountAllBillType;
  //         basket.discountValueTemp = value;
  //         this.basketService.setBasket(basket);
  //         console.log('basker X');
  //         console.log(basket);
  //         this.basketService.discountCalculateBasket(this.discountAllBillType, parseFloat(this.discountAllBill));

  //       }

  //     }
  //     else {
  //       if (value > 100) {
  //         this.alertify.warning("Percent can't more than 100%");
  //         this.discountAllBill = value.substring(0, value.length - 1);;
  //       }
  //       else {
  //         this.discountAllBill = value;
  //         basket.discountTypeTemp = this.discountAllBillType;
  //         basket.discountValueTemp = value;
  //         this.basketService.setBasket(basket);
  //         console.log('basker XY');
  //         console.log(basket);
  //         this.basketService.discountCalculateBasket(this.discountAllBillType, parseFloat(this.discountAllBill));

  //       }

  //     }

  //   }

  // }
  // addNumToTextbox(result: NumpadDiscountParam, isKeyup, isInput) {

  //   // debugger;
  //   // this.isFastClick = false;
  //   if (result.isClose === true) {
  //     this.isShowNumpadDiscount = false;
  //     this.discountSelectedRow = null;
  //     this.IsDiscountAllBill = false;
  //   }
  //   else {
  //     // debugger;

  //     if (this.IsDiscountAllBill) {
  //       if (result.isFastClick) {
  //         this.discountAllBill = "";
  //       }
  //       if (this.discountAllBill === null || this.discountAllBill === undefined) {
  //         this.discountAllBill = "";
  //       }
  //       let total = 0;
  //       this.basketDiscountTotal$.subscribe(data => {
  //         if (data !== null && data !== undefined)
  //           total = data.subtotal
  //       });
  //       if (parseFloat(result.value) > total) {
  //         this.alertify.warning("Discount value more than bill value.");
  //         this.discountAllBill = result.value.substring(0, result.value.length - 1);
  //         this.numpadParram.value = this.discountAllBill;
  //         this.refresh();
  //       }
  //       else {
  //         this.discountAllBill = result.value;
  //         if (result.replace === true) {
  //           this.discountAllBill = result.value;
  //         }
  //         this.discountAllBillType = result.type;
  //         // console.log("Test");
  //         this.basketService.discountCalculateBasket(this.discountAllBillType, parseFloat(this.discountAllBill));
  //       }

  //     }
  //     else {
  //       this.discountInline(result.value, result.type, isKeyup, isInput);
  //       // debugger;
  //       if (result.isFastClick) {
  //         this.discountInLineAmount = "";
  //       }
  //       if (this.discountInLineAmount === null || this.discountInLineAmount === undefined) {
  //         this.discountInLineAmount = "";
  //       }
  //     }
  //   }

  // }
  // isNumber(value: string | number): boolean {
  //   return ((value != null) &&
  //     (value !== '') &&
  //     !isNaN(Number(value.toString())));
  // }
  // discountInline(value: string, type: string, isKeyup, isInput) {
  //   // debugger;
  //   // this.discountInLineAmount = "0";
  //   if (isKeyup === true) {
  //     this.discountInLineAmount = value;
  //   }
  //   else {
  //     this.discountInLineAmount += value;
  //   }
  //   let basket = this.basketService.getCurrentBasket();

  //   // console.log(this.discountInLineAmount);
  //   this.discountInLineType = type;
  //   this.discountAllBillType = basket.discountTypeTemp
  //   // if(this.ispercentDiscountAllBill)
  //   // {
  //   //   this.discountAllBillType= "Discount Percent";
  //   // }
  //   // else{
  //   //   this.discountAllBillType= "Discount Amount";
  //   // }
  //   // debugger;
  //   // this.basketService.discountCalculateBasket(this.discountAllBillType, parseFloat(this.discountAllBill) );
  //   const result = this.basketService.updateDiscountItemLine(this.itemPromotionSelected, this.discountInLineType, parseFloat(value), this.discountAllBillType, parseFloat(this.discountAllBill), isInput);
  //   if (result.isSuccess == false) {
  //     this.alertify.warning(result.errorMessage);
  //     this.numpadParram.isClear = true;
  //     this.refresh();
  //   }


  //   // this.basketService.discountCalculateBasket(this.discountAllBillType, parseFloat(this.discountAllBill));
  // }
  // discountAllBillSelected() {
  //   this.IsDiscountAllBill = true;
  //   this.isShowNumpadDiscount = true;
  //   this.discountInLineAmount = "";
  //   this.discountSelectedRow = null;
  //   // debugger;
  //   this.numpadParram = new NumpadDiscountParam();
  //   this.numpadParram.isline = false;
  //   this.numpadParram.replace = true;
  //   this.numpadParram.type = this.discountAllBillType;
  //   this.numpadParram.value = this.discountAllBill;

  //   this.refresh();
  // }
  approveDisplay = false;
  approveDiscount(username, password, note) {
    let model = new checkLogin();

    model.userName = username;
    model.password = password;

    this.authService.loginAuth(model).subscribe((response: any) => {
      const user = response;
      debugger;
      if (user) {
        let userApproval = user.user.data;
        debugger;
        if (note !== null && note !== undefined && note !== '') {
          this.basketService.changeNote(note).subscribe((response) => {

          });
          this.alertify.success('Set note successfully completed.');
        }
        debugger;
        this.basketService.changeUserApproval(userApproval.username).subscribe((response) => {

        });

        // debugger;
        this.basketService.applyDiscountPromotionToBasket(this.discountAllBillType, parseFloat(this.discountAllBill));
        Swal.fire('Completed Successfully', 'Discount applied!', 'success');
        this.modalRef.hide();
        this.approveDisplay = false;
      }
      else {
        this.alertify.warning("Can't login");
      }
    }, error => {
      this.alertify.warning("Can't login");
    });
  }
  ShowClearModal()
  {
      let checkAction = this.authService.checkRole('Tool_ClearCache', '', 'I');
      let checkApprovalRequire =  this.authService.checkRole('Tool_ClearCache', '', 'A');
      if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
      {
        checkAction = false;
      }
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
        
      }
      else
      {
        let permissionModel= { functionId: 'Tool_ClearCache',  functionName: "Clear Cache", controlId: '', permission: 'I'};
        const initialState = {
            title: 'Clear Cache'  + ' - Permission denied',
            // freeApprove: true,
            permissionModel : permissionModel
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
          if (received.isClose) {
            modalApprovalRef.hide();
          }
          else { 
            // this.authService.setOrderLog("Order", "Redirect", "Success", url);
            // this.redirectTo(url);

            modalApprovalRef.hide();


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


            // let code = (received.customCode ?? '');
            // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, code, functionId, '', 'I').subscribe((response: any) => {
              
            //   if (response.success) {
            //     let note = (received.note ?? '');
            //     if (note !== null && note !== undefined && note !== '') {
            //       this.basketService.changeNote(note).subscribe((response) => {
    
            //       });
            //       this.alertify.success('Set note successfully completed.');
            //     }
              
            //   }
            //   else {
            //     Swal.fire({
            //       icon: 'warning',
            //       title: name ,
            //       text: response.message
            //     });
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
        // msg = "Permission denied.";
        // Swal.fire('Permission denied', '', 'warning'); 
      } 
  }
  ApplyPromotion(event) {
    debugger;
    // isClose, isApply , isReset
    // this.commonService.TempShortcuts$.subscribe((data) => {
    //   this.commonService.changeShortcuts(data, true);
    //   console.log('Old Shorcut', data);
    // });
    if (event.isClose) {
      this.modalRef.hide();
    }
    if (event.isReset) {
      this.modalRef.hide();
      this.openPromotionModal(this.ManualPromotion, true, true);
    }
    if (event.isApply) {
      // this.modalRef.hide();
      // this.closeModal(false);
      // this.modalRef.hide();

      let functionId = "Adm_Shop";
      let checkAction =  this.authService.checkRole(functionId , 'btnApprovePromotion', 'I' );
      let checkApprovalRequire =  this.authService.checkRole(functionId , 'btnApprovePromotion', 'A' );
      if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
      {
        checkAction = false;
      }
      if(checkAction)
      {
        Swal.fire({
          title: 'Apply Manual Promotion to bill!',
          input: 'text',
          icon: 'question',
          text: 'Remark',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Yes',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
            this.inputNote(result.value); 
            // let basket = this.basketService.getCurrentBasket();
            debugger;
            let discountAllBillType =  event?.discountAllBillType;
            let discountAllBillAmount = parseFloat(event?.discountAllBill??0);
            setTimeout(() => {
              this.basketService.applyDiscountPromotionToBasket(discountAllBillType, discountAllBillAmount);
              setTimeout(() => { 
                this.modalRef.hide();
                this.basketService.writeLogApromotion("Apply Manual Promotion", "", discountAllBillType, discountAllBillAmount);
                Swal.fire('Completed Successfully', 'Manual Promotion applied!', 'success'); 
              }, 200);
            }, 30);
           
        
           
          }
        })
      }
      else
      { 
        // this.modalRef.hide();

        let currentShortcut = this.commonService.getCurrentShortcutKey();
        var newArray = []; 
        if(currentShortcut!==null && currentShortcut!==undefined && currentShortcut?.length > 0)
        {
          currentShortcut.forEach(val => newArray.push(Object.assign({}, val))); 
        }
        
       
        let permissionModel= { functionId: functionId, functionName: 'Manual Promotion', controlId: 'btnApprovePromotion', permission: 'I'};
        const initialState = {
            title: 'Manual Promotion - ' + 'Permission denied', permissionModel : permissionModel
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
        let aplplyData = false;

        modalApprovalRef.content.outEvent.subscribe((received: any) => {
          debugger;
          if (received.isClose) {
            modalApprovalRef.hide();
            this.modalRef.hide();
            this.modalRef = null;
            aplplyData = false;  
          }
          else {
            // debugger;
            aplplyData = true;
            let discountAllBillType = event?.discountAllBillType;
            let discountAllBillAmount = parseFloat(event?.discountAllBill??0); 
            setTimeout(() => {
              this.basketService.applyDiscountPromotionToBasket(discountAllBillType, discountAllBillAmount);
              setTimeout(() => { 
                modalApprovalRef.hide();
                this.modalRef.hide();
                this.closeModal(false);
                this.basketService.writeLogApromotion("Apply Manual Promotion","", discountAllBillType, discountAllBillAmount);
              }, 200);
            }, 30);
          }
  
        });
  
        modalApprovalRef.onHide.subscribe((reason: string) => {
          // this.commonService.changeShortcuts(null); 
          if(aplplyData===false)
          {
            setTimeout(() => {
            
              this.modalRef = this.modalService.show(this.ManualPromotion , {
                ariaDescribedby: 'my-modal-description',
                ariaLabelledBy: 'my-modal-title',
                keyboard: true,
                backdrop: 'static',
                ignoreBackdropClick: false,
                class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
              });
              this.modalRef.onHide.subscribe((reason: string) => {
                this.commonService.TempShortcuts$.subscribe((data) => {
                  this.commonService.changeShortcuts(data, true);
                  console.log('Old Shorcut', data);
                });
              })
  
             
            }, 120); 
          }
             
         
        })
      }
    }

  }
  ApplyDiscount(event) {
    // debugger;
    // isClose, isApply , isReset
    // this.commonService.TempShortcuts$.subscribe((data) => {
    //   this.commonService.changeShortcuts(data, true);
    //   console.log('Old Shorcut', data);
    // });
    if (event.isClose) {
      this.modalRef.hide();
  
    }
    if (event.isReset) {
      this.modalRef.hide();
      this.openPromotionModal(this.ManualDiscount, true, true);
    }
    if (event.isApply) {
      // this.modalRef.hide();
      // this.closeModal(false);

      // this.modalRef.hide();
      let functionId = "Adm_Shop";
      let checkAction =  this.authService.checkRole(functionId , 'btnApproveDiscount', 'I' );
      let checkApprovalRequire =  this.authService.checkRole(functionId , 'btnApproveDiscount', 'A' );
      if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
      {
        checkAction = false;
      }
      if(checkAction)
      {
        Swal.fire({
          title: 'Apply discount to bill!',
          input: 'text',
          icon: 'question',
          text: 'Remark',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Yes',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
            this.inputNote(result.value); 
            let discountAllBillType = event?.discountAllBillType;
            let discountAllBillAmount = parseFloat(event?.discountAllBill??0);
            this.basketService.applyDiscountPromotionToBasket(discountAllBillType, discountAllBillAmount);
            this.modalRef.hide();
            this.basketService.writeLogApromotion("Apply Manual Discount","", discountAllBillType, discountAllBillAmount);
            Swal.fire('Completed Successfully', 'Discount applied!', 'success'); 
          }
        })
      }
      else
      { 
        // this.modalRef.hide();

        let currentShortcut = this.commonService.getCurrentShortcutKey();
        var newArray = []; 
        if(currentShortcut!==null && currentShortcut!==undefined && currentShortcut?.length > 0)
        {
          currentShortcut.forEach(val => newArray.push(Object.assign({}, val))); 
        }
       
       
        let permissionModel= { functionId: functionId, functionName: 'Manual Discount', controlId: 'btnApproveDiscount', permission: 'I'};
        const initialState = {
            title: 'Manual Discount - ' + 'Permission denied', permissionModel : permissionModel
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
        let aplplyData = false;

        modalApprovalRef.content.outEvent.subscribe((received: any) => {
          debugger;
          if (received.isClose) {
            modalApprovalRef.hide();
            this.modalRef.hide();
            this.modalRef = null;
            aplplyData = false;  
          }
          else {
            // debugger;
            aplplyData = true;
            let discountAllBillType = event?.discountAllBillType;
            let discountAllBillAmount = parseFloat(event?.discountAllBill??0);
            this.basketService.applyDiscountPromotionToBasket(discountAllBillType, discountAllBillAmount);
            setTimeout(() => {
              modalApprovalRef.hide();
              this.modalRef.hide();
              this.closeModal(false);
              this.basketService.writeLogApromotion("Apply Manual Discount","", discountAllBillType, discountAllBillAmount);
            }, 30);
           
          }
  
        });
  
        modalApprovalRef.onHide.subscribe((reason: string) => {
          // this.commonService.changeShortcuts(null); 
          if(aplplyData===false)
          {
            setTimeout(() => {
            
              this.modalRef = this.modalService.show(this.ManualDiscount , {
                ariaDescribedby: 'my-modal-description',
                ariaLabelledBy: 'my-modal-title',
                keyboard: true,
                backdrop: 'static',
                ignoreBackdropClick: false,
                class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
              });
              this.modalRef.onHide.subscribe((reason: string) => {
                this.commonService.TempShortcuts$.subscribe((data) => {
                  this.commonService.changeShortcuts(data, true);
                  console.log('Old Shorcut', data);
                });
              })
  
             
            }, 120); 
          }
             
         
        })
      }
     
    }


    // this.closeModal(false);
    // if (this.discountApprove === 'false' || this.discountApprove === null || this.discountApprove === undefined) {
    //   Swal.fire({
    //     title: 'Apply discount to bill!',
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
    //       this.inputNote(result.value); 
    //       this.basketService.applyDiscountPromotionToBasket(this.discountAllBillType, parseFloat(this.discountAllBill));
    //       Swal.fire('Completed Successfully', 'Discount applied!', 'success');
    //       debugger;
    //       this.modalRef.hide();
    //     }
    //   })
    // }
    // else {
    //   this.approveDisplay = true;
    // }
    // }



  }
  // toogleDiscountBillType() {
  //   this.ispercentDiscountAllBill = !this.ispercentDiscountAllBill;

  // }
  // setDiscountClickedRow(index, item: IBasketItem) {

  //   if (item.promotionIsPromo !== '1' && (this.manualDiscountSetting === 'All' ||  this.manualDiscountSetting === 'Details')) {
  //     this.isShowNumpadDiscount = false;
  //     this.discountAmount = "";
  //     this.discountSelectedRow = index;
  //     this.itemPromotionSelected = item;
  //     this.IsDiscountAllBill = false;
  //     this.discountInLineAmount = ""; 
  //     this.numpadParram = new NumpadDiscountParam();
  //     this.numpadParram.isline = true;
  //     this.numpadParram.replace = true;
  //     this.numpadParram.type = (item.discountType === "" || item.discountType === undefined || item.discountType.toString() === "undefined") ? "Discount Percent" : item.discountType;
  //     this.numpadParram.value = item.discountValue.toString();


  //     this.isShowNumpadDiscount = true;
  //     this.refresh();
  //     this.addNumToTextbox(this.numpadParram, false, false);
  //   }

  // }
  // public refresh() {
  //   this.isShowNumpadDiscount = false;
  //   setTimeout(x => this.isShowNumpadDiscount = true);
  // }
  // resetDiscountPromotion() {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'Do you want to reset discount!',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No'
  //   }).then((result) => {
  //     if (result.value) {
  //       this.IsDiscountAllBill = null;
  //       this.discountAllBill = "";
  //       // this.basketService.resetDiscountPromotion();
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {

  //     }
  //   })

  // }

  openModelNotifyTransfer(template: TemplateRef<any>)
  {
      this.loadList();
    this.modalRef = this.modalService.show(template, {
      ariaDescribedby: 'my-modal-description',
      ariaLabelledBy: 'my-modal-title',
      class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
    });
  }
  loadList() {
    // debugger;
    let store = this.authService.storeSelected();
    this.inventory.GetTranferNotify(store.companyCode,this.authService.storeSelected().storeId).subscribe((response: any) => {
      debugger;
      this.inventoryListTS = response.data.filter(x=>x.fromStore ==store.storeId && x.docType ==='S');
      this.inventoryListTR = response.data.filter(x=>x.toStore ==store.storeId && x.docType ==='S');
      this.count = this.inventoryListTS.length + this.inventoryListTR.length;

    });
  }
  @ViewChild('CheckLicensePlate')
  private CheckLicensePlate: TemplateRef<any>;
  openModelCheckLicense()
  {
    // let basket = this.basketService.getBasketLocal();
    // if (basket !== null && basket !== undefined) {
    //   basket.custom1 = '';
    //   this.basketService.setBasket(basket);
    //   // this.router.navigate(["shop/order"]).then(() => {
    //   //   window.location.reload();
    //   // });
    // }
      // this.loadList();
    this.modalRef = this.modalService.show(this.CheckLicensePlate, {
      ariaDescribedby: 'my-modal-description',
      ariaLabelledBy: 'my-modal-title',
      class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
    });
  }
  SelectLicense(License:string){
    debugger
    let basket = this.basketService.getBasketLocal();
      if (basket !== null && basket !== undefined) {
        basket.custom1 = License;
        this.basketService.setBasket(basket);
        this.router.navigate(["shop/order"]).then(() => {
          window.location.reload();
        });
      }
    this.modalRef.hide();
  }
}
