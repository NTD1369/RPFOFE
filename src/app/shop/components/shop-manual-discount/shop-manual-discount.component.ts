import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DxButtonComponent, DxTextBoxComponent } from 'devextreme-angular';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MStore } from 'src/app/_models/store';
import { IBasket, IBasketDiscountTotal, IBasketItem } from 'src/app/_models/system/basket';
import { NumpadDiscountParam } from 'src/app/_models/system/numpadDiscountParam';
import { TShiftHeader } from 'src/app/_models/tshiftheader';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { PermissionService } from 'src/app/_services/system/permission.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ShopApprovalInputComponent } from '../../tools/shop-approval-input/shop-approval-input.component';

@Component({
  selector: 'app-shop-manual-discount',
  templateUrl: './shop-manual-discount.component.html',
  styleUrls: ['./shop-manual-discount.component.scss']
})
export class ShopManualDiscountComponent implements OnInit {
  basket$: Observable<IBasket>;
  constructor(public commonService: CommonService,private env: EnvService, private modalService: BsModalService, private permissionService: PermissionService, 
    private alertify: AlertifyService, public authService: AuthService, private basketService: BasketService, private shiftService: ShiftService) { }
  storeSelected: MStore;
  currentShift: TShiftHeader;
  // selectedRow : number  ;
  discountSelectedRow: number;
  isShowNumpadDiscount: boolean = true;
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
  shortcuts: ShortcutInput[] = [];  
  shortcuts$: Observable<ShortcutInput[]>;
  
  showCheckInOut = "true";
  showOtherItem = "false";
  groceryMode = "false";
  @Output() outputDiscount = new EventEmitter<any>();
  @Input() discountApprove = "false";
  manualDiscountSetting = "All";
  otherItem() {

  }
  loadSetting() {
    debugger;
    if (this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId) !== null && this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId) !== undefined && this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId)?.length > 0) {
      debugger;
      let manualDiscountSetting = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'ManualDiscount');
      if (manualDiscountSetting !== null && manualDiscountSetting !== undefined) {
        this.manualDiscountSetting = manualDiscountSetting.settingValue;
        // this.manualDiscountSetting = 'Header';
      }
     
    }

 
  }
  production =  false;
  ngAfterViewInit() {
    this.production =  environment.production;
    let loginBarcode =   this.env.barcodeLogin ?? false;
    if(loginBarcode)
    {
      this.production = false;
    }
    this.commonService.setHotKeyToNull();
    this.loadShortcutManual();
    console.log('View init completed');
  }
  functionId = "Adm_Shop";
  ApplyDiscount() {
    this.ouputEvent(false, true, false);
    // let permissionModel= { functionId: this.functionId, functionName: 'Manual Discount', controlId: 'btnApproveDiscountX', permission: 'I'};
    // const initialState = {
    //     title: 'Manual Discount - ' + 'Permission denied', permissionModel : permissionModel
    // };
    // let modalApprovalRef = this.modalService.show(ShopApprovalInputComponent, {
    //   initialState,
    //   animated: true,
    //   keyboard: true,
    //   backdrop: true,
    //   ignoreBackdropClick: true,
    //   ariaDescribedby: 'my-modal-description',
    //   ariaLabelledBy: 'my-modal-title',
    //   class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
    // });
    // let checkAction =  this.authService.checkRole(this.functionId , 'btnApproveDiscount', 'I' );
    // if(checkAction)
    // {
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
    //       this.ouputEvent(true, true, false);
    //     }
    //   })
    // }
    // else
    // {
      
    
    //   if (this.discountApprove === 'false' || this.discountApprove === null || this.discountApprove === undefined) {

    //     Swal.fire({
    //       title: 'Apply discount to bill!',
    //       input: 'text',
    //       icon: 'question',
    //       text: 'Remark',
    //       inputAttributes: {
    //         autocapitalize: 'off'
    //       },
    //       showCancelButton: true,
    //       confirmButtonText: 'Yes',
    //       showLoaderOnConfirm: true,
    //       allowOutsideClick: () => !Swal.isLoading()
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //         this.inputNote(result.value); 
    //         this.basketService.applyDiscountPromotionToBasket(this.discountAllBillType, parseFloat(this.discountAllBill));
    //         Swal.fire('Completed Successfully', 'Discount applied!', 'success');
    //         this.ouputEvent(true, true, false);
    //       }
    //     })
    //   }
    //   else {
    //     this.approveDisplay = true; 
    //     setTimeout(() => {
    //       this.txtUserApprove.instance.focus();
    //     }, 5);
         
    //   }
    // }
    


  }
  printShow="ItemCode";
  // @ViewChild('txtUserApprove', { static: false }) txtUserApprove;
  @ViewChild('txtUserApprove', { static: false }) txtUserApprove: DxTextBoxComponent;
  @ViewChild('btnApprove', { static: false }) btnApprove: DxButtonComponent;
  
  @ViewChild('txtPassApprove', { static: false }) txtPassApprove;
  @ViewChild('txtCustomCode', { static: false }) txtCustomCode;
  @ViewChild('txtNote', { static: false }) txtNote;
  shortCutModel =  {};
  loadShortcutManual()
  {
    // this.shortcuts = this.commonService.getShortcutsTonull(false);
    this.shortcuts = null;
    this.shortcuts = [];
    setTimeout(() => {
      this.commonService.changeShortcuts(this.shortcuts, true);
     });
    for(let i= 1; i<= 10; i++)
    {
      let label="Row " + i;
     //  this.shortcuts = this.shortcuts.filter(x=>x.label !== label);
      this.shortcuts.push(
        {
          key: ["alt + " + i],
          label: label,
          description: "Row " + i,
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => {
           //  setTimeout(() => {
           //    this.removeFocusIndex();
           //  }, 50);
         
            setTimeout(() => {
              // debugger;
              let items= this.basketService.getCurrentBasket().promotionItems;
              // promoItemApply   
              let item: any=  items[i - 1];
             
              if(item!==null && item!==undefined)
              {
                this.discountSelectedRow = i - 1;
               //  console.log("payment" , payment); 
                 
              }
            }, 50);
          },
          preventDefault: true
        }
      )
    }
    
    this.shortcuts.push( 
      // {
      //   key: ["esc"],
      //   label: "Out of discount row" ,
      //   description: "Out of discount row",
      //   allowIn: [AllowIn.Textarea, AllowIn.Input],  
      //   command: (e) => { 
      //     this.discountSelectedRow = -1;
      //   },
      //   preventDefault: true
      // },
      {
        key: ["alt + p"],
        label: "Discount Percent" ,
        description: "Discount Percent",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          // debugger;
          // this.toggleMedthod('Discount Percent');
          // this.shortCutModel= { type : "ChangeToDiscountPercent" };
          this.commonService.changeDiscountNumberPad("ChangeToDiscountPercent");
        },
        preventDefault: true
      },
      {
        key: ["alt + a"],
        label: "Discount Amount" ,
        description: "Discount Amount",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          // debugger;
          // this.toggleMedthod('Discount Amount');
          // this.shortCutModel= { type : "ChangeToDiscountAmount" };
          // console.log('this.shortCutModel Amount', this.shortCutModel);
          this.commonService.changeDiscountNumberPad("ChangeToDiscountAmount");
        },
        preventDefault: true
      },
      {
        key: ["alt + c"],
        label: "Clear Discount" ,
        description: "Clear Discount",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          // debugger;
          // this.reset();
          // this.shortCutModel= { type : "Reset" };
          this.commonService.changeDiscountNumberPad("Reset");
        },
        preventDefault: true
      },
       
      {
        key: ["f1"],
        label: "Discount 1" ,
        description: "Discount 1",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          debugger;
          // this.toggleMedthod('Discount Percent')
          // this.shortCutModel= { type : "Discount1" };
          this.commonService.changeDiscountNumberPad("Discount1");
         
        },
        preventDefault: true
      },
      
      {
        key: ["f2"],
        label: "Discount 2" ,
        description: "Discount 2",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          // debugger;
          // this.shortCutModel= { type : "Discount2" };
          this.commonService.changeDiscountNumberPad("Discount2");
        },
        preventDefault: true
      },
      
      {
        key: ["f3"],
        label: "Discount 3" ,
        description: "Discount 3",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          // debugger;
          // this.shortCutModel= { type : "Discount3" };
          this.commonService.changeDiscountNumberPad("Discount3");
        },
        preventDefault: true
      },
      {
        key: ["f4"],
        label: "Discount 4" ,
        description: "Discount 4",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          // debugger;
          // this.shortCutModel= { type : "Discount4" };
          this.commonService.changeDiscountNumberPad("Discount4");
        },
        preventDefault: true
      },
      {
        key: ["alt + x"],
        label: "Close Modal" ,
        description: "Close Modal",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          // debugger;
          // if(this.approveDisplay)
          // {
          //   this.approveDisplay= false;
          // }
          this.ouputEvent(true, false, false);
        },
        preventDefault: true
      },
      
      {
        key: ["shift + n"],
        label: "Reset discount" ,
        description: "Reset discount",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => { 
          this.discountSelectedRow = -1;
          this.ouputEvent(true, false, true)
        },
        preventDefault: true
      },
      {
        key: ["enter"],
        label: "Apply discount" ,
        description: "Apply discount",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => { 
           if(this.approveDisplay===false)
           {
            this.ApplyDiscount();
           }
           else{
              // this.approveDiscount();
             this.btnApprove.instance.focus();
             this.approveDiscount(this.txtUserApprove.value, this.txtPassApprove.value, this.txtCustomCode.value,  this.txtNote.value);
           }
         
          // this.ouputEvent(false, true, false);
        },
        preventDefault: true
      },
      {
        key: ["alt + q"],
        label: "Focus discount input" ,
        description: "Focus discount input",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          debugger;
          if(this.discountSelectedRow!==null && this.discountSelectedRow!==undefined && this.discountSelectedRow!==-1 )
          {
            // this.setFocus(this.discountSelectedRow);
            let item = this.basketService.getCurrentBasket().promotionItems;
            // this.setDiscountClickedRow(this.discountSelectedRow,item[this.discountSelectedRow] );
            this.setFocus(this.discountSelectedRow);
          }
        },
        preventDefault: true
      },
      {
        key: ["cmd + p"],
        label: "",
        description: "",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => { 

        },
        preventDefault: true
      },
      {
        key: ["backspace"],
        label: "Back",
        description: "Back",
        command: (e) => {
          // this.itemSelectedRow = '';
         //  console.log(this.selectedRow);
         //  this.selectedRow=-1;
          // debugger;
        },
        preventDefault: true
      },
      
     //  {
     //    key: ["down"],
     //    label: "Down",
     //    description: "Down",
     //    command: (e) => {
     //      debugger;
          
     //    },
     //    preventDefault: true
     //  },
     //  {
     //    key: ["up"],
     //    label: "Up",
     //    description: "Up",
     //    command: (e) => {
     //      debugger;
           
     //    },
     //    preventDefault: true
     //  }
    )
    
   setTimeout(() => {
     console.log("set Shortcut", this.shortcuts);
    this.commonService.changeShortcuts(this.shortcuts, true);
   }, 150);
  
    
  }
  
  approveDiscount(username, password, customCode, note) {
    let model = new checkLogin();
    debugger;
    if(customCode!==null && customCode!==undefined && customCode?.length > 0)
    {
      model.userName = '';
      model.password = '';
      model.customCode = customCode;
    }
    else
    {
      model.userName = username;
      model.password = password;
      model.customCode = '';
    }
   
    this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, model.userName,  model.password, model.customCode,  'Adm_Shop', 'btnApproveDiscount', 'I' ).subscribe((response: any)=>{
      // const user = response;
      // debugger;
      if (response.success) 
      {
        let userApproval = model.userName;
        debugger;
        if (note !== null && note !== undefined && note !== '') {
          this.basketService.changeNote(note).subscribe((response) => {

          });
          this.alertify.success('Set note successfully completed.');
        }
        debugger;
        this.basketService.changeUserApproval(userApproval).subscribe((response) => {

        });

        // debugger;
        this.basketService.applyDiscountPromotionToBasket(this.discountAllBillType, parseFloat(this.discountAllBill));
        Swal.fire('Completed Successfully', 'Discount applied!', 'success');
        // // this.modalRef.hide();
        this.approveDisplay = false;
        this.ouputEvent(true, true, false);
      }
      else
      {
        this.alertify.warning(response.message);
      }
    
    }, error => {
      this.alertify.warning("Can't login");
    });
    // this.authService.loginAuth(model).subscribe((response: any) => {
    //   const user = response;
    //   debugger;
    //   if (user) {
    //     let userApproval = user.user.data;
    //     debugger;
    //     if (note !== null && note !== undefined && note !== '') {
    //       this.basketService.changeNote(note).subscribe((response) => {

    //       });
    //       this.alertify.success('Set note successfully completed.');
    //     }
    //     debugger;
    //     this.basketService.changeUserApproval(userApproval.username).subscribe((response) => {

    //     });

    //     // debugger;
    //     this.basketService.applyDiscountPromotionToBasket(this.discountAllBillType, parseFloat(this.discountAllBill));
    //     Swal.fire('Completed Successfully', 'Discount applied!', 'success');
    //     // // this.modalRef.hide();
    //     this.approveDisplay = false;
    //     this.ouputEvent(true, true, false);
    //   }
    //   else {
    //     this.alertify.warning("Can't login");
    //   }
    // }, error => {
    //   this.alertify.warning("Can't login");
    // });
  }
  setFocus(index) {
    setTimeout(() => {
      // debugger;
      if(this.refNumInputs.toArray()[index]!==null && this.refNumInputs.toArray()[index]!==undefined)
      { 
        if(this.refNumInputs.toArray()[index].nativeElement !== null   && this.refNumInputs.toArray()[index].nativeElement !==undefined)
        {
          // let value= this.inputs.toArray()[index].nativeElement.focus().val();
          // debugger;
          this.refNumInputs.toArray()[index].nativeElement.focus();//.val('').val(this.refNumInputs.toArray()[index]);  ;
        } 
      }
      else
      {
         
      }
     
    }, 4);
    // console.log('index focus' + index)
  }
  onloadShortcut = true;
  ngOnInit() {
    this.storeSelected = this.authService.storeSelected();
    this.basket$ = this.basketService.basket$;
    this.basketDiscountTotal$ = this.basketService.basketTotalDiscount$;
    this.currentShift = this.shiftService.getCurrentShip();
    this.shortcuts$ = this.commonService.Shortcuts$;
    this.loadSetting();
    let basket= this.basketService.getCurrentBasket();
    if(basket?.discountType)
    {
      this.discountAllBillType = basket.discountType;
    }
    if(basket?.discountValue)
    {
      this.discountAllBill = basket.discountValue.toString();
    }
     
  }
  approveDisplay = false;
  toogleDiscountBillType() {
    this.ispercentDiscountAllBill = !this.ispercentDiscountAllBill;

  }
  setDiscountClickedRow(index, item: IBasketItem) {
    // debugger;
    // discountSelectedRow
    if (item.promotionIsPromo !== '1' && (this.manualDiscountSetting === 'All' ||  this.manualDiscountSetting === 'Details')) {
      this.isShowNumpadDiscount = false;
      this.discountAmount = "";
      this.discountSelectedRow = index;
      this.itemPromotionSelected = item;
      this.IsDiscountAllBill = false;
      this.discountInLineAmount = "";

      // debugger;
      this.numpadParram = new NumpadDiscountParam();
      this.numpadParram.isline = true;
      this.numpadParram.replace = true;
      this.numpadParram.type = (item.discountType === "" || item.discountType === undefined || item.discountType.toString() === "undefined") ? "Discount Percent" : item.discountType;
      this.numpadParram.value = item.discountValue.toString();


      this.isShowNumpadDiscount = true;
      this.refresh();
      this.addNumToTextbox(this.numpadParram, false, false);
    }

  }
  
  discountTotalBill(value) {
    debugger;
    if (value === null || value === undefined || value === "") {
      value = "0";
    }
    else {
      value = value.toString().split(',').join('').toString();
    }
    let decimalPlacesFormat = parseFloat(this.authService.loadFormat().decimalPlacesFormat) ?? 0;
    var lastChar = value.substr(value.length - 1); 
    var last2Char = value.substr(value.length - decimalPlacesFormat); 
    if(lastChar === '.' || last2Char === '.0')
    {

    }
    else
    {
      let basket = this.basketService.getCurrentBasket();
      this.authService.setOrderLog("Order", "Discount Total", "", value);
      if (this.discountAllBillType === "Discount Amount") {
  
        let baskettotal = this.basketService.getTotalBasket();
        let ttAmount = baskettotal.amountLeft;
        if (value > ttAmount) {
          this.alertify.warning("Can't add more than total amount");
          this.discountAllBill = value.substring(0, value.length - 1);
        }
        else {
          this.discountAllBill = value;
          basket.discountTypeTemp = this.discountAllBillType;
          basket.discountValueTemp = value;
          this.basketService.setBasket(basket);
          // console.log('basker X');
          // console.log(basket);
          this.basketService.discountCalculateBasket(this.discountAllBillType, parseFloat(this.discountAllBill));
  
        }
  
      }
      else {
        if (value > 100) {
          this.alertify.warning("Percent can't more than 100%");
          this.discountAllBill = value.substring(0, value.length - 1);;
        }
        else {
          this.discountAllBill = value;
          basket.discountTypeTemp = this.discountAllBillType;
          basket.discountValueTemp = value;
          this.basketService.setBasket(basket);
          // console.log('basker XY');
          // console.log(basket);
          this.basketService.discountCalculateBasket(this.discountAllBillType, parseFloat(this.discountAllBill));
  
        }
  
      }
  
    }
   
  }
  @ViewChildren('inputDiscount') refNumInputs: QueryList<ElementRef>;
  keyUpValue(value: any, index, item, discount) {
    // debugger;
    if (value === null || value === undefined || value === "") {
      value = "0";
    }
    if (value !== null && value !== undefined) {
      value = value.toString().split(',').join('');
    }
     
     let decimalPlacesFormat = parseFloat(this.authService.loadFormat().decimalPlacesFormat) ?? 0;
     var lastChar = value.substr(value.length - 1); 
      var last2Char = value.substr(value.length - decimalPlacesFormat); 
      if(lastChar === '.' || last2Char === '.0')
      {
  
      }
      else
      {
      
        if (this.isNumber(value)) {
        this.numpadParram = new NumpadDiscountParam();
        this.numpadParram.isline = true;
        this.numpadParram.replace = true;
        this.numpadParram.type = (item.discountType === "" || item.discountType === undefined || item.discountType.toString() === "undefined") ? "Discount Percent" : item.discountType;
        if (value === null || value === undefined || value === "") {
          value = 0;
        }
        let inputValue = parseFloat(value.toString().split(',').join('')).toString();
        // this.isShowNumpadDiscount=true;
        // this.refresh();
        // debugger;
        if (this.numpadParram.type === 'Discount Percent') {
          if (item.lineTotal - (value * item.promotionLineTotal) / 100 >= 0) {
            if (parseFloat(inputValue) <= 100) {
              this.numpadParram.value = inputValue;
            }
            else {
              this.numpadParram.value = inputValue.substring(0, inputValue.length - 1);
              item.discountValue = parseFloat(inputValue.substring(0, inputValue.length - 1));
              this.alertify.warning("Discount value more than bill value.");
            }

          }
          else {
            //failed 
            this.numpadParram.value = inputValue.substring(0, inputValue.length - 1);
            item.discountValue = parseFloat(inputValue.substring(0, inputValue.length - 1));
            this.alertify.warning("Discount value more than bill value.");
            //  console.log('A');
          }
        }
        // debugger;
        if (this.numpadParram.type === 'Discount Amount') {

          if (item.lineTotal - parseFloat(inputValue) >= 0) {
            this.numpadParram.value = inputValue;

          }
          else {
            if (item.discountValue === parseFloat(inputValue)) {

            }
            else {
              this.numpadParram.value = inputValue.substring(0, inputValue.length - 1);
              item.discountValue = this.transform(inputValue.substring(0, inputValue.length - 1));
              this.alertify.warning("Discount value more than bill value.");
            }


          }
        }
        // debugger;
        this.addNumToTextbox(this.numpadParram, true, true);
      }
      else {
        item.discountValue = value.substring(0, value.length - 1);
      }

    }

  }
  ouputEvent(isClose?, isApply?, isReset?)
  {
    // this.outputDiscount
 
    let discountAllBillType = this.discountAllBillType;
    let discountAllBill = this.discountAllBill;
    let mess=  "isClose: " + isClose +  ",isApply: " + isApply +  ",isReset: " + isReset+  ",discountAllBillType: " + discountAllBillType+  ",discountAllBill: " + discountAllBill;
    this.authService.setOrderLog("Order", "Close Popup Discount", "", mess);
    this.outputDiscount.emit({isClose, isApply , isReset,  discountAllBillType, discountAllBill});
  }
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
  returnDiscountRow(row: IBasketItem) {
    // debugger;
    if (row.discountHistory !== null && row.discountHistory !== undefined && row.discountHistory.length > 0) {
      var newArray = row.discountHistory.filter(value => Object.keys(value).length !== 0);
      // debugger;
      row = newArray[newArray.length - 1];
      this.discountInline(row.discountValue.toString(), row.discountType, false, false);
    }
  }
  isShown: boolean;
  // togleSubmenu() {
  //   this.isShown = !this.isShown;
  //   this.maintainanceShow.emit(this.isShown);
  // }
  addNumToTextbox(result: NumpadDiscountParam, isKeyup, isInput) {
    
    if (result.value !== null && result.value !== undefined && result.value !== "") {
       
      result.value = result.value.toString().split(',').join('');
    }
    else {
      result.value = "0";
    } 
    // debugger;
    // this.isFastClick = false;
    if (result.isClose === true) {
      this.isShowNumpadDiscount = false;
      this.discountSelectedRow = null;
      this.IsDiscountAllBill = false;
    }
    else {
      // debugger;

      if (this.IsDiscountAllBill) {
        if (result.isFastClick) {
          this.discountAllBill = "";
        }
        if (this.discountAllBill === null || this.discountAllBill === undefined) {
          this.discountAllBill = "";
        }
        let total = 0;
        this.basketDiscountTotal$.subscribe(data => {
          if (data !== null && data !== undefined)
            total = data.subtotal
        });
        result.value = parseFloat(result.value).toString();
        if (parseFloat(result.value) > total) {
          this.alertify.warning("Discount value more than bill value.");
          this.discountAllBill =  result.value.substring(0, result.value.length - 1);
          this.numpadParram.value = this.discountAllBill;
          this.refresh();
        }
        else {
          this.discountAllBill = result.value;
          if (result.replace === true) {
            this.discountAllBill = result.value;
          }
          this.discountAllBillType = result.type;
          // console.log("Test");
          this.basketService.discountCalculateBasket(this.discountAllBillType, parseFloat(this.discountAllBill));
          this.authService.setOrderLog("Order", "Discount header Type: " + this.discountAllBillType + " discountAllBill value" + this.discountAllBill, "", "");
        }
        
      }
      else {
        this.discountInline(result.value, result.type, isKeyup, isInput);
        // debugger;
        this.authService.setOrderLog("Order","Discount line value " + result.value, "", "");
        if (result.isFastClick) {
          this.discountInLineAmount = "";
        }
        if (this.discountInLineAmount === null || this.discountInLineAmount === undefined) {
          this.discountInLineAmount = "";
        }
      }
    }

  }
  isNumber(value: string | number): boolean {
    return ((value != null) &&
      (value !== '') &&
      !isNaN(Number(value.toString())));
  }
  discountInline(value: string, type: string, isKeyup, isInput) {
    // debugger;
    // this.discountInLineAmount = "0";
    if (isKeyup === true) {
      this.discountInLineAmount = value;
    }
    else {
      this.discountInLineAmount += value;
    }
    let basket = this.basketService.getCurrentBasket();

    // console.log(this.discountInLineAmount);
    this.discountInLineType = type;
    this.discountAllBillType = basket.discountTypeTemp
    // if(this.ispercentDiscountAllBill)
    // {
    //   this.discountAllBillType= "Discount Percent";
    // }
    // else{
    //   this.discountAllBillType= "Discount Amount";
    // }
    // debugger;
    // this.basketService.discountCalculateBasket(this.discountAllBillType, parseFloat(this.discountAllBill) );
    const result = this.basketService.updateDiscountItemLine(this.itemPromotionSelected, this.discountInLineType, parseFloat(value), this.discountAllBillType, parseFloat(this.discountAllBill), isInput);
    if (result.isSuccess == false) {
      this.alertify.warning(result.errorMessage);
      this.numpadParram.isClear = true;
      this.refresh();
    }


    // this.basketService.discountCalculateBasket(this.discountAllBillType, parseFloat(this.discountAllBill));
  }
  selectedTab = 'user';
  selectTab(code)
  {
    if(code === 'customCode')
    {
      this.selectedTab = "customCode";
      this.txtCustomCode.value = '';
      setTimeout(() => {
      
        this.txtCustomCode.instance.focus();
      }, 10); 
    }
    else
    {
      this.selectedTab = "user";
      setTimeout(() => {
        this.txtUserApprove.instance.focus();
      }, 10); 
    }
  }
  public refresh() {
    this.isShowNumpadDiscount = false;
    this.onloadShortcut = false;
    setTimeout(x => this.isShowNumpadDiscount = true);
  }
  resetDiscountPromotion() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to reset discount!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.IsDiscountAllBill = null;
        this.discountAllBill = "";
        this.authService.setOrderLog("Discount", "reset", "", "");
        // this.basketService.resetDiscountPromotion();
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })

  }
  discountAllBillSelected() {
    this.IsDiscountAllBill = true;
    this.isShowNumpadDiscount = true;
    this.discountInLineAmount = "";
    this.discountSelectedRow = null;
    // debugger;
    this.numpadParram = new NumpadDiscountParam();
    this.numpadParram.isline = false;
    this.numpadParram.replace = true;
    this.numpadParram.type = this.discountAllBillType;
    this.numpadParram.value = this.discountAllBill;

    this.refresh();
  }
}

export class checkLogin {
  userName: string = '';
  password: string = '';
  customCode: string = '';
}
