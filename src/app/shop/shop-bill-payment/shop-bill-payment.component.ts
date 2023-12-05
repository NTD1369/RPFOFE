import { AfterContentInit, AfterViewInit, Component, Directive, ElementRef, EventEmitter, HostListener, NgZone, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { SCurrencyRoundingOff } from 'src/app/_models/currencyRoundingOff';
import { MCustomer } from 'src/app/_models/customer';
import { MDenomination } from 'src/app/_models/denomination';
import { MWISarawakModel } from 'src/app/_models/mwi/sarawakModel';
import { Payment } from 'src/app/_models/payment';
import { MPaymentMethod } from 'src/app/_models/paymentmethod';
import { MStore } from 'src/app/_models/store';
import { MStoreCurrency } from 'src/app/_models/storecurrency';
import { IBasket, IBasketCurrencyTotal, IBasketDiscountTotal, IBasketPayment, IBasketTotal } from 'src/app/_models/system/basket';
import { ResultModel } from 'src/app/_models/system/resultModel';
import { StorePaymentViewModel } from 'src/app/_models/viewmodel/storepayment';
import { TapTapVoucherDetails } from 'src/app/_models/voucherdetail';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { CurrencyRoundingOffService } from 'src/app/_services/data/currencyRoundingOff.service';
import { DenominationService } from 'src/app/_services/data/denomination.service';
import { PrepaidcardService } from 'src/app/_services/data/prepaidcard.service';
import { StorePaymentService } from 'src/app/_services/data/store-payment.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { VoucherService } from 'src/app/_services/transaction/voucher.service';
import Swal from 'sweetalert2';
import { interval } from 'rxjs';
import { ShopPaymentCurrencyComponent } from '../tools/shop-payment-currency/shop-payment-currency.component';
import { LoadingService } from 'src/app/_services/common/loading.service';
import { EpayModel } from 'src/app/_models/mwi/epay';
import { PermissionService } from 'src/app/_services/system/permission.service';
import { ShortcutService } from 'src/app/_services/data/shortcut.service';
import { AllowIn, KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { isBuffer } from 'util';
import { CrmService } from 'src/app/_services/data/crm.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { BankTerminalService } from 'src/app/_services/data/bank-terminal.service';
import { EnvService } from 'src/app/env.service';
import { PayooModel } from 'src/app/_models/mwi/payooModel';



enum LoadingIndicator {
  OPERATOR,
  MANUAL,
  ASYNC_PIPE
}


@Component({
  selector: 'app-shop-bill-payment',
  templateUrl: './shop-bill-payment.component.html',
  styleUrls: ['./shop-bill-payment.component.scss']
})


export class ShopBillPaymentComponent implements OnInit, AfterContentInit, AfterViewInit {

  @ViewChildren('input') inputs: QueryList<ElementRef>;
  @ViewChildren('input2') refNumInputs: QueryList<ElementRef>;
  @ViewChildren('customF1') ref1Inputs: QueryList<ElementRef>;
  LoadingIndicator = LoadingIndicator;
  hasLoaded: boolean = false;
  loadCounter = 1;
  asyncText$ = this.loadingService.doLoading(
    // .delay(...) simulates network delay
    of(`Peek-a-boo ${this.loadCounter++}`).pipe(delay(4000)),
    this,
    LoadingIndicator.ASYNC_PIPE
  );
  focus = false;
  customValue1 = ""; customValue2 = ""; customValue3 = "";
  refValue1 = ""; refValue2 = ""; refValue3 = "";
  customValueControl1 = new FormControl({ value: this.customValue1, disabled: false });
  customValueControl2 = new FormControl({ value: this.customValue2, disabled: false });
  customValueControl3 = new FormControl({ value: this.customValue3, disabled: false });
  refValueControl1 = new FormControl({ value: this.refValue1, disabled: false });
  refValueControl2 = new FormControl({ value: this.refValue1, disabled: false });
  refValueControl3 = new FormControl({ value: this.refValue1, disabled: false });
  customValueControl: FormControl[] = [];
  refValueControl: FormControl[] = [];
  production = false;
  createList() {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let num of numbers) {
      this.customValueControl.push(new FormControl({ value: "", disabled: false }));
      this.refValueControl.push(new FormControl({ value: "", disabled: false }));
    }

  }
  // productForm: FormGroup;
  // createRowcontrol()
  // {
  //   this.productForm = this.fb.group({
  //     title: [],
  //     selling_points: this.fb.array([this.fb.group({value:''})])
  //   })
  // }

  // addSellingPoint() {
  //   this.basket.payments.push(this.fb.group({point:''}));
  // }

  // deleteSellingPoint(index) {
  //   this.sellingPoints.removeAt(index);
  // }

  setFocus(type: string, index) {
    if (type !== null && type !== undefined && type?.length > 0) {
      console.log('payment.lineNum', type + "_" + index);
      setTimeout(() => {
        debugger;
        if (type === "refNum") {

          if (this.refNumInputs.toArray()[index] !== null && this.refNumInputs.toArray()[index] !== undefined) {
            if (this.refNumInputs.toArray()[index].nativeElement !== null && this.refNumInputs.toArray()[index].nativeElement !== undefined) {
              this.refNumInputs.toArray()[index].nativeElement.focus();
            }
            this.focus = true;
          }
          else {
            this.refNumInputs.toArray().forEach((item) => {
              item.nativeElement.blur();
            })
          }
        }
        else {
          if (type === "customF1") {

            if (this.ref1Inputs.toArray()[index] !== null && this.ref1Inputs.toArray()[index] !== undefined) {
              if (this.ref1Inputs.toArray()[index].nativeElement !== null && this.ref1Inputs.toArray()[index].nativeElement !== undefined) {
                this.ref1Inputs.toArray()[index].nativeElement.focus();
              }
              this.focus = true;
            }
            else {
              this.ref1Inputs.toArray().forEach((item) => {
                item.nativeElement.blur();
              })
            }
          }
          else {

            if (this.inputs.toArray()[index] !== null && this.inputs.toArray()[index] !== undefined) {


              if (this.inputs.toArray()[index].nativeElement !== null && this.inputs.toArray()[index].nativeElement !== undefined) {
                // let value= this.inputs.toArray()[index].nativeElement.focus().val();
                // // debugger;
                this.inputs.toArray()[index].nativeElement.focus();//.val('').val(this.refNumInputs.toArray()[index]);  ;
              }

              this.focus = true
            }
            else {
              this.inputs.toArray().forEach((item) => {
                item.nativeElement.blur();
              })
            }
          }
        }


      }, 4);
    }

    // console.log('index focus' + index)
  }
  stt = 0;
  VirtualKey$: Observable<boolean>;
  ngAfterContentInit() {
    // // debugger;
    this.stt++;
    // console.log(this.stt);
    // this.zone.runOutsideAngular(() => setTimeout(() => {
    //      this.setFocus(this.inputType,this.selectedRow);
    // }, 0));
  }
  enableEdit = false;
  enableEditIndex = null;
  amountCharge: string = "";
  selectedRow: number;
  inputType: string = "";
  refInput: string = "";

  paymentMethodShowList: StorePaymentViewModel[] = [];
  paymentMethodOtherList: StorePaymentViewModel[] = [];
  setClickedRow(index, payment: Payment, inputType, isFocus?) {

    this.amountCharge = "";
    if (this.payment?.canEdit === true || this.payment?.canEdit === null || this.payment?.canEdit === undefined) {
      if (payment.id !== null && payment.id !== undefined && payment.id !== "Point") {
        this.amountCharge = payment.paymentTotal.toString().split(',').join('');
        // console.log(this.amountCharge);
        this.refInput = payment.refNum;
        this.selectedRow = index;
        this.inputType = inputType;
        this.payment = payment;
        // this.isFastClick = true;
        this.payment.paymentCharged = parseFloat(this.payment.paymentCharged.toString().split(',').join(''));
        // this.payment.paymentDiscount = parseFloat(this.payment.paymentDiscount.toString().replace(',', ''));
        this.payment.paymentTotal = parseFloat(this.payment.paymentTotal.toString().split(',').join(''));

        this.basketService.changePaymentCharge(this.payment);
        this.basketService.refreshPayment(this.basketService.getCurrentPayment());


        // debugger;
        if (isFocus) {
          setTimeout(() => {
            if (inputType === null || inputType === undefined || inputType === '') {
              inputType = 'amountInput'
            }
            this.setFocus(inputType, payment.lineNum - 1);
          }, 50);
        }

        // this.setFocus(inputType, index);
        // this.basketService.addPaymentToBasket(this.payment);
      }
    }
    else {
      this.selectedRow = null;
      this.payment = null;

    }


  }
  changeValuePayment(value: any, index, payment: Payment, type) {
    // console.log(value);
    // this.selectedRow = null;
    // this.amountCharge = null;
    // this.payment = null;
    // this.inputType = "";
    // debugger;
    if (this.payment?.canEdit === true || this.payment?.canEdit === null || this.payment?.canEdit === undefined) {

      if (payment.id !== null && payment.id !== undefined && payment.id !== "Point") {
        this.selectedRow = index;
        this.payment = payment;

        if (type === "refNum" || type === "customF1") {
          // debugger;

          if (type === "refNum") {
            this.payment.refNum = value;
          }

          if (type === "customF1") {
            this.payment.customF1 = value;
          }
          // 

        }
        else {
          // this.payment.paymentCharged = parseFloat(this.payment.paymentCharged.toString().replace(',', ''));
          // this.payment.paymentDiscount = parseFloat(this.payment.paymentDiscount.toString().replace(',', ''));

          this.payment.paymentTotal = parseFloat(this.payment.paymentTotal.toString().split(',').join(''));
          let str = value.toString().split(',').join('');
          // debugger;
          let valueX = parseFloat(str);
          if (valueX !== this.payment.paymentTotal) {
            this.payment.paymentTotal = valueX;
          }
          this.basketService.changePaymentCharge(this.payment);
          // if (value !== "") {
          //   this.basketService.addPaymentToBasket(this.payment, this.payment.paymentTotal);

          // }
          // else {
          //   this.basketService.addPaymentToBasket(this.payment, 0);

          // }
          this.setClickedRow(this.selectedRow, payment, type);
        }
      }
    }
    else {
      this.selectedRow = null;
      this.payment = null;
    }

    // this.setFocus(this.inputType, index);
  }
  testControlValue = new FormControl({ value: "", disabled: false });
  removeselect(index, payment: Payment) {
    // // debugger;
    // this.selectedRow = null; 
    // this.payment = payment;
    // this.basketService.changePaymentCharge(this.payment);
    // this.basketService.addPaymentToBasket(this.payment, this.payment.paymentTotal);
  }


  enableEditMethod(e, i) {
    // // debugger;
    this.enableEdit = true;
    this.enableEditIndex = i;
    // console.log(i, e);
    this.inputs.toArray()[i].nativeElement.focus();
    // this.input.nativeElement.focus();
  }

  // nextToChangeAmount() {

  //   this.basketService.changePaymentModeBasket("Change");
  //   let paymentChange = this.paymentMethods.find(x => x.allowChange === true);
  //   if (paymentChange !== null && paymentChange !== undefined) {

  //   }
  //   else {
  //     paymentChange = this.paymentMethods.filter(x => x.paymentType === 'C')[0];

  //   }
  //   this.addPaymentClick(paymentChange, false, false);


  // }
  myDate = new Date();
  orderNo: string;
  returnAmountMultiPaymentMethod = "true";
  roudingOffList: SCurrencyRoundingOff[] = []
  loadRoundingOff() {
    this.roundingOffService.getAll(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any) => {
      if (response.success) {
        this.roudingOffList = response.data.filter(x => x.status === 'A');
      }
    })
  }
  @Output() Modal = new EventEmitter<boolean>();
  constructor(private permissionService: PermissionService, public env: EnvService, private fb: FormBuilder, private bankTerminalService: BankTerminalService, private crmService: CrmService, private elRef: ElementRef, private prepaidCardService: PrepaidcardService, public loadingService: LoadingService, private denominationService: DenominationService,
    private roundingOffService: CurrencyRoundingOffService, private modalService: BsModalService, private mwiService: MwiService, private authService: AuthService, private storePaymentService: StorePaymentService, public basketService: BasketService, private zone: NgZone,
    private alertify: AlertifyService, private route: Router, private shortcutService: ShortcutService, private voucherService: VoucherService, private commonService: CommonService) {

  }
  shortCutList: any = [];

  basket$: Observable<IBasket>;
  basketTotal$: Observable<IBasketTotal>;
  basketCurrencyTotal$: Observable<IBasketCurrencyTotal>;
  payment: Payment = null;
  closeModal() {
    // this.waitingAPi= true;
    let basketStatus = this.waitingAPi;
    let basketresponeStatus = this.basketService.getBasketResponseStatus();// !(this.isResponseBasket$ | async);
    if (basketStatus === true || basketresponeStatus === false) {
      Swal.fire({
        title: 'Are you sure?',
        text: "Order is in progress. May lead to incorrect data if the window is closed",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        // cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Close it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.basketService.changeIsCreateOrder(false);
          this.basketService.changeBasketResponseStatus(true);
          this.basketService.changeDateTime(new Date());
          setTimeout(() => {
            this.Modal.emit(false);
          }, 20);
        }
      })
    }
    else {
      // this.basketService.changeBasketResponseStatus(true);
      this.Modal.emit(false);


    }

  }
  functionPage = "Payment";
  shortcuts: ShortcutInput[] = [];
  // componentName = "OtherPayment";
  loadShortcut() {
    // this.shortcuts= this.commonService.getCurrentShortcutKey();
    // this.shortcutService.getByFunction(this.authService.getCurrentInfor().companyCode , this.functionPage).subscribe((response: any) =>{
    //   // // debugger;
    //   this.shortCutList = response.data;

    //     // Get item in grid

    // })

    for (let i = 1; i <= 10; i++) {
      let label = "Row " + i;
      this.shortcuts = this.shortcuts.filter(x => x.label !== label);
      this.shortcuts.push(
        {
          key: ["alt + " + i],
          label: label,
          description: "Payment Row " + i,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: (e) => {
            setTimeout(() => {
              this.removeFocusIndex();
            }, 50);
            setTimeout(() => {
              let items = this.basketService.getCurrentBasket().payments;
              let payment: any = items[i - 1];
              if (payment !== null && payment !== undefined) {
                this.selectedRow = payment.lineNum;
                console.log("payment", payment);

                // this.setClickedRow(payment.lineNum ,  payment, '');
                // this.setFocus(this.inputType, -1);

              }
            }, 50);
          },
          preventDefault: true
        }
      )
    }

    // if(this.typeOfPaymentMode !== 'BankTerminal')
    // {


    // }
    // else
    // {
    //   for (let i = 2; i <= 4; i++) {
    //     this.shortcuts.push(
    //       {
    //         key: ["f" + i],
    //         label: "Payment " + i,
    //         description: "Payment " + i,
    //         allowIn: [AllowIn.Textarea, AllowIn.Input],
    //         command: (e) => {
    //           // debugger;
    //           // let payment= this.basketService.getCurrentBasket().payments.find(x=>x.lineNum===(i-1));   
    //           let payments = this.fatherPayment;
    //           var group: any = Object.assign({}, payments[i - 1]);
    //           if (group !== null && group !== undefined) {
    //             this.showPaymentList(group.fatherId, group.fatherName)
    //             // let payment = a as MPaymentMethod;
    //             // this.setClickedRow(i - 1, payment, '' );
    //             // this.addPaymentClick(payment, null, payment.isRequireRefnum)
    //             // console.log(payments);
    //           }

    //         },
    //         preventDefault: true
    //       }
    //     )

    //   }

    //   this.shortcuts.push(
    //     // {
    //     //   key: ["esc"],
    //     //   label: "Out of payment" ,
    //     //   description: "Out of payment",
    //     //   allowIn: [AllowIn.Textarea, AllowIn.Input],  
    //     //   command: (e) => {
    //     //     // debugger;
    //     //     console.log('Out of payment');
    //     //     this.selectedRow = -1;
    //     //   },
    //     //   preventDefault: true
    //     // },
    //     {
    //       key: ["cmd + p"],
    //       label: "",
    //       description: "",
    //       allowIn: [AllowIn.Textarea, AllowIn.Input],
    //       command: (e) => { 

    //       },
    //       preventDefault: true
    //     },
    //     {
    //       key: ["f1"],
    //       label: "Other Payment",
    //       description: "Other Payment",
    //       allowIn: [AllowIn.Textarea, AllowIn.Input],
    //       command: (e) => {
    //         this.removeFocusIndex();
    //         // this.showOtherPayment();
    //         let payments = this.fatherPayment;
    //         if(payments!==null && payments!==undefined && payments?.length > 0)
    //         {
    //           this.showPaymentList('Other', 'Other');
    //         }

    //       },
    //       preventDefault: true
    //     },
    //     {
    //       key: ["enter"],
    //       label: "Submit Order",
    //       description: "Submit Order",
    //       allowIn: [AllowIn.Textarea, AllowIn.Input],
    //       command: (e) => {
    //         console.log('Submit Order');
    //         console.log('e', e);
    //         if(this.isShowSubmitQRScan)
    //         {
    //           this.alertify.warning("Please Complete progress payment or remove payment");
    //         }
    //         else
    //         {
    //           this.authService.setOrderLog("Order", "Enter Submit Order", "", "");
    //           if (this.basketService.getBasketResponseStatus()) {
    //             this.basketService.changeBasketResponseStatus(false); 
    //             this.addOrder();
    //           }
    //         }


    //       },
    //       preventDefault: true
    //     },
    //     {
    //       key: ["alt + q"],
    //       label: "Focus Quantity",
    //       description: "Focus Quantity",
    //       allowIn: [AllowIn.Textarea, AllowIn.Input],
    //       command: (e) => {
    //         if (this.selectedRow !== -1) {
    //           let items = this.basketService.getCurrentBasket().payments;
    //           let payment = items.find(x => x.lineNum === this.selectedRow);
    //           if (payment !== null && payment !== undefined) {
    //             // this.inputs[this.selectedRow].
    //             this.inputs.toArray()[this.selectedRow - 1].nativeElement.focus();
    //             // xxx
    //           }

    //         }
    //       },
    //       preventDefault: true
    //     },
    //     {
    //       key: ["alt + n"],
    //       label: "Focus ref number",
    //       description: "Focus ref number",
    //       allowIn: [AllowIn.Textarea, AllowIn.Input],
    //       command: (e) => {
    //         if (this.selectedRow !== -1) {
    //           let items = this.basketService.getCurrentBasket().payments;
    //           let payment = items.find(x => x.lineNum === this.selectedRow);
    //           if (payment !== null && payment !== undefined) {
    //             // this.inputs[this.selectedRow].
    //             this.refNumInputs.toArray()[this.selectedRow - 1].nativeElement.focus();
    //             // xxx
    //           }

    //         }
    //       },
    //       preventDefault: true
    //     },
    //     {
    //       key: ["alt + c"],
    //       label: "Focus ref1",
    //       description: "Focus ref1",
    //       allowIn: [AllowIn.Textarea, AllowIn.Input],
    //       command: (e) => {
    //         if (this.selectedRow !== -1) {
    //           let items = this.basketService.getCurrentBasket().payments;
    //           let payment = items.find(x => x.lineNum === this.selectedRow);
    //           if (payment !== null && payment !== undefined) {
    //             // this.inputs[this.selectedRow].
    //             this.ref1Inputs.toArray()[this.selectedRow - 1].nativeElement.focus();
    //             // xxx
    //           }

    //         }
    //       },
    //       preventDefault: true
    //     },
    //     {
    //       key: [">"],
    //       label: "All Balance Due",
    //       description: "All Balance Due",
    //       allowIn: [AllowIn.Textarea, AllowIn.Input],
    //       command: (e) => {
    //         if (this.selectedRow !== -1) {
    //           this.pressKey("000000");

    //         }

    //       },
    //       preventDefault: true
    //     },
    //     {
    //       key: ["backspace"],
    //       label: "Back",
    //       description: "Back",
    //       command: (e) => {
    //         // this.itemSelectedRow = '';
    //         console.log(this.selectedRow);
    //         this.selectedRow = -1;
    //         // // debugger;
    //       },
    //       preventDefault: true
    //     },
    //     {
    //       key: ["del"],
    //       label: "Delete",
    //       description: "Delete",
    //       allowIn: [AllowIn.Textarea, AllowIn.Input],
    //       command: (e) => {
    //         // debugger;
    //         if (this.selectedRow !== -1) {
    //           let items = this.basketService.getCurrentBasket().payments;
    //           let payment = items.find(x => x.lineNum === this.selectedRow);
    //           if (payment !== null && payment !== undefined) {
    //             this.removePayment(payment);
    //             this.selectedRow = -1;
    //           }

    //         }
    //         console.log(this.selectedRow);
    //       },
    //       preventDefault: true
    //     },

    //     {
    //       key: ["down"],
    //       label: "Down",
    //       description: "Down",
    //       command: (e) => {
    //         // debugger;
    //         if (this.selectedRow !== -1) {
    //           let items = this.basketService.getCurrentBasket().payments;
    //           let row = this.selectedRow;
    //           if (row > items.length - 1) {
    //             row = 0;
    //           }
    //           this.selectedRow = row + 1;
    //           let payment: any = items[row];
    //           this.setClickedRow(this.selectedRow, payment, '');
    //           if (this.selectedRow > items.length) {
    //             this.selectedRow = items.length;
    //           }
    //         }
    //         console.log(this.selectedRow);
    //       },
    //       preventDefault: true
    //     },
    //     {
    //       key: ["up"],
    //       label: "Up",
    //       description: "Up",
    //       command: (e) => {
    //         // debugger;
    //         console.log(this.selectedRow);
    //         let row = this.selectedRow;
    //         if (this.selectedRow === -1) {
    //           row = 0;
    //         }
    //         let items = this.basketService.getCurrentBasket().payments;

    //         if (row <= 0) {
    //           row = 0;
    //         }
    //         this.selectedRow = row - 1;
    //         let payment: any = items[row - 1];
    //         this.setClickedRow(this.selectedRow, payment, '');
    //         if (this.selectedRow < 1) {
    //           this.selectedRow = 1;
    //         }
    //       },
    //       preventDefault: true
    //     }
    //   )
    // }

    for (let i = 1; i <= 3; i++) {
      this.shortcuts.push(
        {
          key: ["f" + i],
          label: "Payment " + i,
          description: "Payment " + i,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: (e) => {
            // debugger;
            // let payment= this.basketService.getCurrentBasket().payments.find(x=>x.lineNum===(i-1));   
            let payments = this.paymentMethodShowList;
            var a: any = Object.assign({}, payments[i - 1]);
            if (a !== null && a !== undefined) {
              let payment = a as MPaymentMethod;
              // this.setClickedRow(i - 1, payment, '' );
              this.addPaymentClick(payment, null, payment.isRequireRefnum)
              // console.log(payments);
            }

          },
          preventDefault: true
        }
      )

    }

    this.shortcuts.push(
      // {
      //   key: ["esc"],
      //   label: "Out of payment" ,
      //   description: "Out of payment",
      //   allowIn: [AllowIn.Textarea, AllowIn.Input],  
      //   command: (e) => {
      //     // debugger;
      //     console.log('Out of payment');
      //     this.selectedRow = -1;
      //   },
      //   preventDefault: true
      // },
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
        key: ["f4"],
        label: "Other Payment",
        description: "Other Payment",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          this.removeFocusIndex();
          this.showOtherPayment();

        },
        preventDefault: true
      },
      {
        key: ["enter"],
        label: "Submit Order",
        description: "Submit Order",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          console.log('Submit Order');
          console.log('e', e);
          if (this.isShowSubmitQRScan) {
            this.alertify.warning("Please Complete progress payment or remove payment");
          }
          else {
            this.authService.setOrderLog("Order", "Enter Submit Order", "", "");
            if (this.basketService.getBasketResponseStatus()) {
              this.basketService.changeBasketResponseStatus(false);
              this.addOrder();
            }
          }


        },
        preventDefault: true
      },
      {
        key: ["alt + q"],
        label: "Focus Quantity",
        description: "Focus Quantity",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          if (this.selectedRow !== -1) {
            let items = this.basketService.getCurrentBasket().payments;
            let payment = items.find(x => x.lineNum === this.selectedRow);
            if (payment !== null && payment !== undefined) {
              // this.inputs[this.selectedRow].
              this.inputs.toArray()[this.selectedRow - 1].nativeElement.focus();
              // xxx
            }

          }
        },
        preventDefault: true
      },
      {
        key: ["alt + n"],
        label: "Focus ref number",
        description: "Focus ref number",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          if (this.selectedRow !== -1) {
            let items = this.basketService.getCurrentBasket().payments;
            let payment = items.find(x => x.lineNum === this.selectedRow);
            if (payment !== null && payment !== undefined) {
              // this.inputs[this.selectedRow].
              this.refNumInputs.toArray()[this.selectedRow - 1].nativeElement.focus();
              // xxx
            }

          }
        },
        preventDefault: true
      },
      {
        key: ["alt + c"],
        label: "Focus ref1",
        description: "Focus ref1",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          if (this.selectedRow !== -1) {
            let items = this.basketService.getCurrentBasket().payments;
            let payment = items.find(x => x.lineNum === this.selectedRow);
            if (payment !== null && payment !== undefined) {
              // this.inputs[this.selectedRow].
              this.ref1Inputs.toArray()[this.selectedRow - 1].nativeElement.focus();
              // xxx
            }

          }
        },
        preventDefault: true
      },
      {
        key: [">"],
        label: "All Balance Due",
        description: "All Balance Due",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          if (this.selectedRow !== -1) {
            this.pressKey("000000");

          }

        },
        preventDefault: true
      },
      {
        key: ["backspace"],
        label: "Back",
        description: "Back",
        command: (e) => {
          // this.itemSelectedRow = '';
          console.log(this.selectedRow);
          this.selectedRow = -1;
          // // debugger;
        },
        preventDefault: true
      },
      {
        key: ["del"],
        label: "Delete",
        description: "Delete",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          // debugger;
          if (this.selectedRow !== -1) {
            let items = this.basketService.getCurrentBasket().payments;
            let payment = items.find(x => x.lineNum === this.selectedRow);
            if (payment !== null && payment !== undefined) {
              this.removePayment(payment);
              this.selectedRow = -1;
            }

          }
          console.log(this.selectedRow);
        },
        preventDefault: true
      },

      {
        key: ["down"],
        label: "Down",
        description: "Down",
        command: (e) => {
          // debugger;
          if (this.selectedRow !== -1) {
            let items = this.basketService.getCurrentBasket().payments;
            let row = this.selectedRow;
            if (row > items.length - 1) {
              row = 0;
            }
            this.selectedRow = row + 1;
            let payment: any = items[row];
            this.setClickedRow(this.selectedRow, payment, '');
            if (this.selectedRow > items.length) {
              this.selectedRow = items.length;
            }
          }
          console.log(this.selectedRow);
        },
        preventDefault: true
      },
      {
        key: ["up"],
        label: "Up",
        description: "Up",
        command: (e) => {
          // debugger;
          console.log(this.selectedRow);
          let row = this.selectedRow;
          if (this.selectedRow === -1) {
            row = 0;
          }
          let items = this.basketService.getCurrentBasket().payments;

          if (row <= 0) {
            row = 0;
          }
          this.selectedRow = row - 1;
          let payment: any = items[row - 1];
          this.setClickedRow(this.selectedRow, payment, '');
          if (this.selectedRow < 1) {
            this.selectedRow = 1;
          }
        },
        preventDefault: true
      }
    )

    setTimeout(() => {
      this.isShowSC = true;
      console.log('this.shortcuts payment', this.shortcuts);
      this.commonService.changeShortcuts(this.shortcuts, true);

    }, 100);
    // this.keyboard.select("del").subscribe(e => {
    //   // debugger;
    // }); 
  }
  // @ViewChild('input') input: ElementRef;  
  // @ViewChild(KeyboardShortcutsComponent) private keyboard: KeyboardShortcutsComponent;  
  isShowSC = false;
  ngAfterViewInit() {
    this.stt++;
    // console.log(this.stt);
    // // debugger;
    // this.basket$.subscribe(data => {

    //   if (this.inputType === undefined || this.inputType === null || this.inputType === '') {
    //     this.inputType = "amountInput";
    //   }
    //   if (this.selectedRow === undefined || this.selectedRow === null) {
    //     this.selectedRow = 0;
    //   }

    //   this.setFocus(this.inputType, this.selectedRow);

    // });

    this.loadShortcut();
    // xx
  }
  maxvalue = "";
  // BankTerminal
  typeOfPaymentMode = "Normal";
  storeSelected: MStore;
  storecurrency: MStoreCurrency[] = [];
  paymentMethods: MPaymentMethod[] = [];
  message = "";
  showCouponInput = true;
  isShowPaymentHistory = false;
  paymentHitories: IBasketPayment[] = [];
  showPaymentHistory() {
    this.isShowPaymentHistory = true;
    let basket = this.basketService.getCurrentBasket();
    this.paymentHitories = basket.paymentHistories;


  }
  addBasketPaymentToPayment(payment) {
    debugger;
    this.isShowPaymentHistory = false;
    if (payment.isCloseModal === true) {
      if (this.storecurrency !== null && this.storecurrency !== undefined && this.storecurrency.length > 0) {
        this.isShowCurrency = false;
        this.isShowPayment = true;
        this.isShowOtherPayment = false;
        this.isQRScan = false;
        this.isShowSubmitQRScan = false;
      }
      else {

        this.isShowPayment = true;
        this.isShowOtherPayment = false;
        this.isShowCurrency = false;
        this.isQRScan = false;
        this.isShowSubmitQRScan = false;
      }
      // this.removePayment(this.payment);
    }
    else {
      let paymentCharge = payment.paymentCharged;
      let paymentAdd = this.paymentMethods.find(x => x.paymentCode = payment.id);
      if (paymentAdd !== null && paymentAdd !== undefined) {
        // this.addPayment(false, paymentAdd, true, paymentAdd.isRequireRefnum);
        // this.basketService.addPaymentToBasket(paymentAdd, parseFloat(paymentAdd.discount_value), paymentAdd.ref);
        this.basketService.addPaymentBasketToBasket(payment, paymentCharge, '');
      }
      else {
        this.alertify.warning("can't add payment method");
      }

    }

    setTimeout(() => {
      this.loadShortcut();
    }, 100);


  }
  fatherPayment = [];
  terminalId = "";
  merchantId = "";
  isResponseBasket$: Observable<boolean>;
  ngOnInit() {
    // debugger;
    // this.waitingAPi = true;
    // this.message = "Wait for minutes. <br /> Bank Name: A ( Port: A)";
    this.isResponseBasket$ = this.basketService.ResponeBasket$;

    this.production = environment.production;
    // this.terminalId = environment.production === true ? this.env.terminalID : environment.terminalID;// environment.terminalID ?? "20000835";
    // this.merchantId = environment.production === true ? this.env.merchantID : environment.merchantID;// environment.merchantID ?? "302255";
    // console.log('this.terminalId environment', this.env.terminalID );
    // console.log('this.merchandId environment',this.env.merchantID );


    // console.log('this.terminalId', this.terminalId);
    // console.log('this.merchandId', this.merchantId);
    this.createList();
    // let code = (received.customCode ?? '');
    this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().username, this.authService.getCurrentInfor().password, '', "Adm_Shop", 'isShowCoupon', 'V').subscribe((response: any) => {
      // const user = response;
      // // debugger;
      // if (response.success) {

      // }
      this.showCouponInput = response.success;
      // else {
      //     Swal.fire({
      //       icon: 'warning',
      //       title: 'Remove item',
      //       text: response.message
      //     });
      // }
    })
    // this.loadingService.startLoading(this, LoadingIndicator.MANUAL);
    this.storeSelected = this.authService.storeSelected();
    this.basketService.changePaymentModeBasket("");
    this.storecurrency = this.authService.getStoreCurrency();
    // console.log("this.storeSelected",this.storeSelected);
    // // debugger;
    // this.payment = new Payment(); 
    let basket = this.basketService.getCurrentBasket();
    this.basket$ = this.basketService.basket$;
    this.basketTotal$ = this.basketService.basketTotal$;
    this.VirtualKey$ = this.commonService.VirtualKey$;
    this.basketCurrencyTotal$ = this.basketService.basketCurrencyTotal$;
    let storeClient = this.authService.getStoreClient();
    let terminalId = "";
    if (storeClient !== null && storeClient !== undefined) {
      terminalId = this.authService.getStoreClient().publicIP;
    }
    else {
      terminalId = this.authService.getLocalIP();
    }
    this.storePaymentService.getByStore(this.storeSelected.companyCode, this.storeSelected.storeId, terminalId).subscribe((res: any) => {
      // debugger;
      if (res.success) {
        // console.log('res.data', res.data);
        // this.paymentMethodShowList = res.filter(x=>x.status === "A" && x.isShow === true);
        // this.paymentMethodShowList = this.paymentMethodShowList.slice(0,3);
        // this.paymentMethodOtherList = res.filter(x=>x.status === "A" && x.isShow === false);
        // debugger;
        this.paymentMethods = res.data;
        // if(this.typeOfPaymentMode === "BankTerminal")
        // {
        //   debugger;
        //   let showList = res.data.filter(x => x.status === "A" && x.isShow === true);
        //   // this.paymentMethodShowList = showList;
        //   if (basket?.salesType.toLowerCase() === "return") {
        //     showList = res.data.filter(x => x.status === "A" && x.isShow === true && (x?.allowRefund === true ||  x?.rejectReturn === false)); 
        //   }

        //   if (basket?.salesType.toLowerCase() === "ex" || basket?.salesType.toLowerCase() === "exchange") {
        //     showList = res.data.filter(x => x.status === "A" && x.isShow === true && x?.rejectExchange === false) ; 
        //   }
        //   let newArray = []; 
        //   showList.forEach(val => newArray.push(Object.assign({}, val))); 
        //   var  groups = showList.reduce(function (obj, item) {

        //     if(item.fatherId===null || item.fatherId === undefined || item.fatherId=== '')
        //     {
        //       item.fatherId = 'Other';
        //     }
        //     obj[item.fatherId] = obj[item.fatherId] || [];
        //     obj[item.fatherId].fatherId = item.fatherId;
        //     obj[item.fatherId].portName = item.bankCustomF1;
        //     obj[item.fatherId].timeOut = item?.bankCustomF2;
        //     let fatherItem = newArray.find(x=>x.paymentCode === item.fatherId);
        //     if(fatherItem!==null && fatherItem!==undefined)
        //     {
        //       obj[item.fatherId].fatherName = fatherItem.paymentDesc;
        //       obj[item.fatherId].orderNum = fatherItem.orderNum;

        //       if(item.paymentCode !== fatherItem.paymentCode)
        //       {
        //         obj[item.fatherId].push({

        //           paymentCode:  item?.paymentCode,
        //           companyCode:  item?.companyCode,
        //           paymentDesc:  item?.paymentDesc,
        //           forfeitCode:  item?.forfeitCode,
        //           createdBy: item?.createdBy,
        //           createdOn:  item?.createdOn,
        //           modifiedBy:  item?.modifiedBy,
        //           modifiedOn: item?.modifiedOn,
        //           status: item?.status,
        //           accountCode: item?.accountCode,
        //           isRequireRefnum: item?.isRequireRefnum,
        //           eodApply: item?.eodApply,
        //           eodCode: item?.eodCode,
        //           paymentType:  item?.paymentType,
        //           value: item?.value,
        //           rate: item?.rate,
        //           fcAmount: item?.fcAmount,
        //           currency:  item?.currency,
        //           shortName: item?.shortName,
        //           roundingMethod:  item?.roundingMethod,
        //           allowChange: item?.allowChange,
        //           rejectReturn: item?.rejectReturn,
        //           rejectVoid: item?.rejectVoid,
        //           apiUrl: item?.apiUrl,
        //           isCloseModal: item?.isCloseModal,
        //           orderNum: item?.orderNum,
        //           customF1:  item?.customF1,
        //           customF2:  item?.customF2,
        //           customF3: item?.customF3,
        //           customF4:  item?.customF4,
        //           customF5: item?.customF5,

        //           bankCustomF1:  item?.bankCustomF1,
        //           bankCustomF2:  item?.bankCustomF2,
        //           bankCustomF3: item?.bankCustomF3,
        //           bankCustomF4:  item?.bankCustomF4,
        //           bankCustomF5: item?.bankCustomF5,

        //           ///
        //           allowMix: item?.allowMix,
        //           allowRefund: item?.allowRefund,
        //           requireTerminal: item?.requireTerminal,
        //           terminalIdDefault: item?.terminalIdDefault,
        //           voucherCategory: item?.voucherCategory,
        //           isFatherShow: item?.isFatherShow,
        //           fatherId: item?.fatherId,
        //           isShow: item?.isShow,
        //           bankPaymentType: item?.bankPaymentType
        //         });
        //       }

        //     }
        //     else 
        //     {
        //       // item.fatherId = 'Other';
        //       if(item.fatherId !== 'Other')
        //       {
        //         obj[item.fatherId].fatherName = item.fatherId;
        //         obj[item.fatherId].orderNum = 5;
        //       }
        //       else
        //       {
        //         obj[item.fatherId].fatherName = 'Other';
        //         obj[item.fatherId].orderNum = 10;
        //       }


        //         obj[item.fatherId].push({

        //           paymentCode:  item?.paymentCode,
        //           companyCode:  item?.companyCode,
        //           paymentDesc:  item?.paymentDesc,
        //           forfeitCode:  item?.forfeitCode,
        //           createdBy: item?.createdBy,
        //           createdOn:  item?.createdOn,
        //           modifiedBy:  item?.modifiedBy,
        //           modifiedOn: item?.modifiedOn,
        //           status: item?.status,
        //           accountCode: item?.accountCode,
        //           isRequireRefnum: item?.isRequireRefnum,
        //           eodApply: item?.eodApply,
        //           eodCode: item?.eodCode,
        //           paymentType:  item?.paymentType,
        //           value: item?.value,
        //           rate: item?.rate,
        //           fcAmount: item?.fcAmount,
        //           currency:  item?.currency,
        //           shortName: item?.shortName,
        //           roundingMethod:  item?.roundingMethod,
        //           allowChange: item?.allowChange,
        //           rejectReturn: item?.rejectReturn,
        //           rejectVoid: item?.rejectVoid,
        //           apiUrl: item?.apiUrl,
        //           isCloseModal: item?.isCloseModal,
        //           orderNum: item?.orderNum,
        //           customF1:  item?.customF1,
        //           customF2:  item?.customF2,
        //           customF3: item?.customF3,
        //           customF4:  item?.customF4,
        //           customF5: item?.customF5,

        //           bankCustomF1:  item?.bankCustomF1,
        //           bankCustomF2:  item?.bankCustomF2,
        //           bankCustomF3: item?.bankCustomF3,
        //           bankCustomF4:  item?.bankCustomF4,
        //           bankCustomF5: item?.bankCustomF5,

        //           ///
        //           allowMix: item?.allowMix,
        //           allowRefund: item?.allowRefund,
        //           requireTerminal: item?.requireTerminal,
        //           terminalIdDefault: item?.terminalIdDefault,
        //           voucherCategory: item?.voucherCategory,
        //           isFatherShow: item?.isFatherShow,
        //           fatherId: item?.fatherId,
        //           isShow: item?.isShow,
        //           bankPaymentType: item?.bankPaymentType
        //         });

        //     }

        //     return obj;
        //   }, {});

        //   let responseProps = Object.keys(groups);

        //   let cashierPaymentResponse = [];

        //   for (let prop of responseProps) { 
        //     cashierPaymentResponse.push(groups[prop]);
        //   }

        //   this.fatherPayment = cashierPaymentResponse.sort((a, b) => a.orderNum > b.orderNum ? -1 : 1 );
        //   if(this.fatherPayment?.length < 4)
        //   {
        //     if(this.fatherPayment?.length === 1)
        //     {
        //       this.fatherPayment.push({

        //         fatherId:  '',
        //         fatherName:  ''

        //       });
        //       this.fatherPayment.push({

        //         fatherId:  '',
        //         fatherName:  ''

        //       });
        //       this.fatherPayment.push({

        //         fatherId:  '',
        //         fatherName:  ''

        //       });
        //     }
        //     if(this.fatherPayment?.length === 2)
        //     {
        //       this.fatherPayment.push({

        //         fatherId:  '',
        //         fatherName:  ''

        //       });
        //       this.fatherPayment.push({

        //         fatherId:  '',
        //         fatherName:  ''

        //       });
        //     }
        //     if(this.fatherPayment?.length === 3)
        //     {
        //       this.fatherPayment.push({

        //         fatherId:  '',
        //         fatherName:  ''

        //       });

        //     }
        //   }
        //   console.log('fatherPayment', this.fatherPayment);

        //   // if (res.data.length > 3) {
        //   //   this.paymentMethodOtherList = showList.slice(3, showList.length);
        //   //   let other = res.data.filter(x => x.status === "A" && x.isShow === false);
        //   //   if (basket?.salesType.toLowerCase() === "return") {
        //   //     other = other.filter(x => x.allowRefund === true);

        //   //   }
        //   //   if (other !== null && other !== undefined) {
        //   //     other.forEach(element => {
        //   //       this.paymentMethodOtherList.push(element);
        //   //     });
        //   //   }

        //   // }
        //   // else {

        //   //   this.paymentMethodOtherList = res.data.filter(x => x.status === "A" && x.isShow === false);
        //   //   if (basket?.salesType.toLowerCase() === "return") {
        //   //     this.paymentMethodOtherList = res.data.filter(x => x.status === "A" && x.isShow === false && x.allowRefund === true);

        //   //   }
        //   // }
        // }
        // else
        // {
        debugger;
        // let checkAction = this.authService.checkRole('isCheckLicensePlate' , '', 'V' );
        res.data = res.data.filter(x => (x?.paymentType.toLowerCase() !== 'd'));
        let childrenList = res.data.filter(x => x.status === "A" && (x?.fatherId !== null && x?.fatherId !== undefined && x.fatherId?.length > 0));
        // x.status === "A" && x.isShow === true &&
        res.data = res.data.filter(x => (x?.fatherId === null || x?.fatherId === undefined || x.fatherId?.length <= 0));

        res.data.forEach(payment => {
          let chilLines = childrenList.filter(x => x.fatherId === payment.paymentCode);
          // if(chilLines?.length > 0 && chilLines!==undefined && chilLines!==null)
          // {
          //   chilLines.forEach(element => {
          //     let chilLinesX  = childrenList.filter(x=>x.fatherId === element.paymentCode);
          //     element.custom2 = payment.custom2;
          //     element.lines = chilLinesX;
          //   });
          // }

          payment.lines = chilLines;
        });
        let bankManualFather = res.data.filter(x => x.paymentType?.toLowerCase() === 'b' && x.customF2 !== null && x.customF2 !== undefined && x.customF2 !== '')
        if (bankManualFather !== null && bankManualFather !== undefined && bankManualFather?.length > 0) {

          bankManualFather.forEach(payment => {
            debugger;

            var paymentClone = Object.assign({}, payment);
            let fatherLine = res.data.find(x => x.paymentCode === payment.customF2);
            if (fatherLine !== null && fatherLine !== undefined) {
              if (fatherLine?.lines === null || fatherLine?.lines === undefined) {
                fatherLine.lines = [];
              }
              paymentClone.bankSelectedMode = "Manual";
              fatherLine.bankSelectedMode = "Manual";
              fatherLine.lines.push(paymentClone);
            }


          });
        }
        //   res.data.forEach(payment => {
        //     let chilLines  = childrenList.filter(x=>x.fatherId === payment.paymentCode);


        //     payment.lines = chilLines;
        //  });



        let showList = res.data.filter(x => x.status === "A" && x.isShow === true);
        this.paymentMethodShowList = showList.slice(0, 3);
        if (basket?.salesType.toLowerCase() === "return") {
          showList = res.data.filter(x => x.status === "A" && x.isShow === true && (x?.allowRefund === true || x?.rejectReturn === false));
          this.paymentMethodShowList = showList.slice(0, 3);

        }
        if (basket?.salesType.toLowerCase() === "ex" || basket?.salesType.toLowerCase() === "exchange") {
          showList = res.data.filter(x => x.status === "A" && x.isShow === true && x?.rejectExchange !== true);
          this.paymentMethodShowList = showList.slice(0, 3);
        }
        if (res.data.length > 3) {
          this.paymentMethodOtherList = showList.slice(3, showList.length);
          let other = res.data.filter(x => x.status === "A" && x.isShow === false);
          if (basket?.salesType.toLowerCase() === "return") {
            // other = other.filter(x => x.allowRefund === true);
            other = other.filter(x => (x?.allowRefund === true || x?.rejectReturn === false));
          }
          if (basket?.salesType.toLowerCase() === "ex" || basket?.salesType.toLowerCase() === "exchange") {
            // other = other.filter(x => x.allowRefund === true);
            other = other.filter(x => x?.rejectExchange !== true);
          }
          if (other !== null && other !== undefined) {
            other.forEach(element => {
              this.paymentMethodOtherList.push(element);
            });
          }

        }
        else {

          this.paymentMethodOtherList = res.data.filter(x => x.status === "A" && x.isShow === false);
          if (basket?.salesType.toLowerCase() === "return") {
            // this.paymentMethodOtherList = res.data.filter(x => x.status === "A" && x.isShow === false &&   x.allowRefund === true);
            this.paymentMethodOtherList = res.data.filter(x => x.status === "A" && x.isShow === false && (x?.allowRefund === true || x?.rejectReturn === false));

          }
          if (basket?.salesType.toLowerCase() === "ex" || basket?.salesType.toLowerCase() === "exchange") {
            this.paymentMethodOtherList = res.data.filter(x => x.status === "A" && x.isShow === true && x?.rejectExchange !== true);
          }
        }

        this.paymentMethodOtherList.forEach(val => this.dataInitOrtherPaymentList.push(Object.assign({}, val)));
        // console.log('this.paymentMethodOtherList', this.paymentMethodOtherList);
        // console.log('showList', showList);
        // }

      }


      else {
        this.alertify.warning(res.message);

      }




    }, error => {
      this.alertify.error(error);
    });
    this.maxvalue = this.authService.getmaxValueCurrency();
    // let basket = this.basketService.getCurrentBasket();
    basket.voucherApply = basket.voucherApply.filter(x => x.discount_code !== 'xyz_123');

    this.basketService.setBasket(basket);
    // this.basketDiscountTotal$  = this.basketService.basketTotalDiscount$;
    this.loadDenolist();
    if (this.storecurrency !== null && this.storecurrency !== undefined && this.storecurrency.length > 0) {
      this.loadRoundingOff();
    }
    this.loadSetting();

  }
  // @ViewChild('lblBillAmount') lblBillAmount: ElementRef;  
  dataInitOrtherPaymentList = [];
  removeFocusIndex() {
    this.selectedRow = null;
    this.amountCharge = null;
    this.payment = null;
    this.inputType = "";

    // // debugger;
    this.setFocus("", -1);
    // document?.getElementById("lblBillAmount")?.focus();
    // // debugger;
    // const element = document.querySelector("#lblBillAmount");
    // element.;
    this.resetPaymentInput();

  }
  removePayment(payment: IBasketPayment) {
    // // debugger;
    this.authService.setOrderLog("Order", "Remove Payment Click", "", payment?.id);
    this.basketService.removePayment(payment);
    this.selectedRow = null;
    this.amountCharge = null;
    this.payment = null;
    this.inputType = "";
    this.resetPaymentInput();

  }
  resetPaymentInput() {
    this.isQRScan = false;
    this.isShowCurrency = false;
    this.isShowPayment = true;
    this.isShowOtherPayment = false;
    this.isShowSubmitQRScan = false;
  }
  clearAmount(i, payment: Payment) {
    // console.log("clearAmount");

    this.amountCharge = "";
  }
  isShowOtherPayment: boolean = false;
  saveOtherPaymentList: any[] = [];
  showOtherPayment() {
    if (this.isShowSubmitQRScan) {
      this.alertify.warning("Please Complete progress payment or remove payment");
    }
    else {

      this.authService.setOrderLog("Order", "Other Payment Click", "", "");
      // xxx

      let payments = this.basketService.getCurrentPayment();
      if (payments !== null && payments !== undefined) {
        payments = payments.filter(x => x?.paymentTotal === 0);
      }
      if (payments?.length > 0) {
        // this.alertify.warning("Please Complete progress payment " + this.payment.id + "!");
        Swal.fire({
          icon: 'warning',
          title: 'Payment',
          text: "Please Complete progress payment " + payments[0].id + "!"
        }).then(() => {
          setTimeout(() => {
            this.inputs.toArray()[this.payment.lineNum - 1].nativeElement.focus();
          }, 100);

        });
      }
      else {
        if (this.isShowOtherPayment === true) {
          this.isShowOtherPayment = false;
          this.isShowCurrency = false;
          this.isQRScan = false;
          // !this.isShowOtherPayment;
          this.isShowPayment = true;
        }
        else {
          // if(this.saveOtherPaymentList !==null && this.saveOtherPaymentList !==undefined && this.saveOtherPaymentList?.length > 0)
          // {
          this.paymentMethodOtherList = this.dataInitOrtherPaymentList;
          // }
          this.isShowOtherPayment = true;
          this.isShowCurrency = false;
          this.isQRScan = false;
          // !this.isShowOtherPayment;
          this.isShowPayment = false;
        }
      }

    }

  }
  titleOtherPayment = "";
  // bankTerminalType Auto | Manual, bankPaymentType
  showPaymentList(fatherId, fatherName, bankPaymentType) {
    let bankMode = bankPaymentType ?? 'Auto';
    if (this.isShowSubmitQRScan) {
      this.alertify.warning("Please Complete progress payment or remove payment");
    }
    else {

      this.authService.setOrderLog("Order", "Other payment click", "", "");
      // xxx
      // debugger;
      let payments = this.basketService.getCurrentPayment();
      if (payments !== null && payments !== undefined) {
        payments = payments.filter(x => x?.paymentTotal === 0);
      }
      if (payments?.length > 0) {
        // this.alertify.warning("Please Complete progress payment " + this.payment.id + "!");
        Swal.fire({
          icon: 'warning',
          title: 'Payment',
          text: "Please Complete progress payment " + payments[0].id + "!"
        }).then(() => {
          setTimeout(() => {
            this.inputs.toArray()[this.payment.lineNum - 1].nativeElement.focus();
          }, 100);

        });
      }
      else {
        debugger;
        // this.paymentMethodOtherList = this.fatherPayment.find(x=>x.fatherId === fatherId);
        let paymentGrps = [];

        this.fatherPayment.forEach(element => {
          paymentGrps.push(element.fatherId);
        });
        // this.bankSelectMode
        if (fatherId !== 'Other' && bankMode === "Auto") {

          let totalpayment = this.basketService.getTotalBasket();
          // debugger;

          // thi
          console.log('this.fatherPayment', this.fatherPayment);
          let bankInfor = this.fatherPayment.find(x => x.fatherId === fatherId);
          // switch (bankInfor.paymentType) {
          //   case 'E': {
          //     //statements; 
          //     this.isShowCurrency = false;
          //     this.isShowPayment = true;
          //     this.isShowSubmitQRScan = true;
          //     // this.isQRScan = true;
          //     break;
          //   }
          //   case 'B': {
          //statements;  
          if (bankInfor !== null && bankInfor !== undefined) {
            console.log('Bank Infor', bankInfor)
            let portName = bankInfor?.portName;
            let timeOut = bankInfor?.timeOut;
            // let compBank = environment.production === true ? this.env.bankTerminalCOM : environment.bankTerminalCOM;
            if (portName !== null && portName !== undefined && portName?.length > 0) {
              this.waitingAPi = true;
              this.message = "Wait for minutes. <br /> Bank Name: " + fatherId + "( Port:" + portName + ')';
              if (timeOut === null || timeOut === undefined || timeOut === '' || timeOut === "NaN" || timeOut === "undefined") {
                timeOut = 60;
              }
              let basket = this.basketService.getCurrentBasket();
              this.bankTerminalService.SendPayment('1', fatherId, portName, totalpayment.amountLeft, "", basket.id, timeOut).subscribe((response: any) => {

                this.waitingAPi = false;
                this.message = "";
                if (response.success) {
                  // debugger;

                  // approvalCode: "PYTEST" // Mã Approve của ngân hàng
                  // cardHolderName: "" // Tên khách hàng thẻ
                  // cardIssuerID: "08" // Loại thẻ mapping
                  // cardIssuerName: null    // 
                  // cardNumber: "550989******1885"  // Mã số thẻ
                  // invoiceNumber: "000002"    // Transaction Id
                  // merchantNumber: "6601248584"  // Mã định danh
                  // statusCode: "00"     // Trạng thái
                  // terminalID: "40041761" // Mã thiết bị
                  let responeData = response.data;
                  if (responeData.statusCode !== '00') {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Payment (Bank Terminal)',
                      text: "Can't payment. Please try again."
                    });
                  }
                  else {
                    if (responeData !== null && responeData !== undefined) {
                      console.log('responeData', responeData);

                      console.log('this.paymentMethodOtherList', this.paymentMethodOtherList);
                      let payment: any = this.paymentMethods.find(x => x.bankPaymentType === responeData.cardIssuerID && x.fatherId === fatherId);// this.paymentMethodOtherList.find(x=>x.bankPaymentType === responeData.cardIssuerID);
                      console.log('payment', payment);
                      if (payment !== null && payment !== undefined) {
                        // let basket = this.basketService.getCurrentBasket();
                        this.payment = new Payment();
                        // let paymentX = new Payment();
                        // .id=
                        this.payment.isRequireRefNum = false;
                        this.payment.id = payment.paymentCode;// taptap.paymentCode;
                        this.payment.shortName = payment.paymentDesc ?? payment.paymentCode;// taptap.paymentCode;

                        this.payment.refNum = responeData.invoiceNumber;
                        this.payment.paymentDiscount = 0;
                        this.payment.paymentTotal = 0;
                        this.payment.mainBalance = 0;
                        this.payment.subBalance = 0;
                        this.payment.paymentCharged = totalpayment.amountLeft;//voucher.discount_value;
                        this.payment.canEdit = false;
                        this.payment.paymentMode = "BankTerminal";
                        this.payment.cardType = responeData?.cardIssuerID;
                        this.payment.cardNo = responeData?.cardNumber;
                        this.payment.cardHolderName = responeData?.cardHolderName;
                        this.payment.customF1 = responeData?.approvalCode;
                        this.payment.customF2 = payment?.paymentType;
                        this.payment.customF3 = payment?.forfeitCode;
                        this.payment.customF4 = responeData?.terminalID;
                        this.payment.customF5 = fatherId;
                        // this.payment.customF5 = voucherGet?.vouchercategory;
                        // this.basketTotal$.subscribe(data => {
                        //   console.log(data);
                        //   this.payment.paymentCharged  = data.subtotal - data.totalAmount;
                        // });
                        let linenum = this.basketService.getCurrentBasket().payments.length + 1;
                        this.payment.lineNum = linenum;
                        this.basketService.addPaymentToBasket(this.payment, totalpayment.amountLeft);

                        let payments = this.basketService.getCurrentPayment();
                        console.log('payments', payments);
                        setTimeout(() => {
                          let basketTotal = this.basketService.getTotalBasket();
                          if (basketTotal.amountLeft === 0) {
                            setTimeout(() => {
                              this.addOrder();
                            }, 100)
                            // this.addOrder();
                          }
                        }, 200);



                        // this.basketService.addOrUpdatePayment(basket.payments, payment, payment.paymentTotal);
                      }
                      else {
                        Swal.fire({
                          icon: 'warning',
                          title: 'Payment (Bank Terminal)',
                          text: "Can't found data from store payment."
                        });
                      }

                      // let paymentShow = this.paymentMethodShowList.filter(x=>x.fatherId === fatherId);
                      // if(paymentShow!==null && paymentShow?.length > 0)
                      // {

                      // }
                      // else
                      // {
                      //   Swal.fire({
                      //     icon: 'warning',
                      //     title: 'Payment (Bank Terminal)',
                      //     text: "Can't found bank data."
                      //   });
                      // }

                    }
                    else {
                      Swal.fire({
                        icon: 'warning',
                        title: 'Payment (Bank Terminal)',
                        text: "Can't get data from bank device"
                      });

                    }
                  }


                }
                else {
                  // this.alertify.warning(response.message);
                  Swal.fire({
                    icon: 'warning',
                    title: 'Payment (Bank Terminal)',
                    text: response.message
                  });

                }
              }, error => {
                debugger;
                this.waitingAPi = false;
                this.message = "";

                Swal.fire({
                  icon: 'error',
                  title: 'Payment (Bank Terminal)',
                  text: error
                });
              });
            }
            else {
              Swal.fire({
                icon: 'warning',
                title: 'Payment (Port)',
                text: "Please check setup " + fatherId + " port device"
              });
            }

          }
          else {
            Swal.fire({
              icon: 'warning',
              title: 'Bank information',
              text: "can't found data of " + fatherId
            })
          }
          //     break;
          //   }
          //   default: {
          //     //statements; 
          //     this.resetPaymentInput();
          //     break;
          //   }
          // }




          //  if(thissSendPaymentToTerminal)

        }
        else {
          debugger;
          setTimeout(() => {
            var newArray = [];

            this.paymentMethodOtherList.forEach(val => newArray.push(Object.assign({}, val)));
            this.saveOtherPaymentList = newArray;

            this.paymentMethodOtherList = this.paymentMethodOtherList.filter(x => !paymentGrps.includes(x.paymentCode));

            this.titleOtherPayment = fatherName;
            if (this.isShowOtherPayment === true) {
              this.isShowOtherPayment = false;
              this.isShowCurrency = false;
              this.isQRScan = false;
              // !this.isShowOtherPayment;
              this.isShowPayment = true;
            }
            else {
              this.isShowOtherPayment = true;
              this.isShowCurrency = false;
              this.isQRScan = false;
              // !this.isShowOtherPayment;
              this.isShowPayment = false;
            }

          }, 20);

        }

      }

    }

  }
  denolist: MDenomination[]
  loadDenolist() {
    // // debugger;
    this.denolist = this.authService.getDenomination().filter(x => x.showOnPayment === true && x.status === 'A');
    if (this.denolist === null || this.denolist === undefined || this.denolist?.length === 0) {
      this.denominationService.getAll(this.authService.storeSelected().currencyCode).subscribe((response: any) => {
        // debugger;
        if (response.success) {
          this.denolist = response.data.filter(x => x.showOnDiscount === true);
          let length = response.data.length;
          if (response.data.length > 5) {
            length = 5;
          }
          // debugger;
          this.denolist = response.data.slice(0, length);;
          this.denolist.forEach(deno => {
            deno.value = this.authService.roundingAmount(parseFloat(deno.value)).toString();
          });
        }
        else {

          this.alertify.warning(response.message);
        }

      })

    }
    // console.log(this.denolist);
  }
  // loadDenomination()
  // {
  //   this.denominationService.getAll(this.authService.storeSelected().currencyCode).subscribe((response: any)=>{

  //     this.denoList= response.filter(x=>x.showOnDiscount===true);

  //   })
  // }
  closeOtherPad() {
    this.isShowOtherPayment = false;// !this.isShowOtherPayment;
    this.isShowPayment = true;
    this.isShowCurrency = false;
    this.isQRScan = false;
  }
  clearAmountPayment(payment: Payment) {
    // this.changeValuePayment(0, payment.lineNum, payment, '');

    let payments = this.basketService.getCurrentPayment();
    payments = this.basketService.addOrUpdatePayment(payments, this.payment, 0);
    this.basketService.refreshPayment(payments);

    this.setClickedRow(payment.lineNum, payment, "amountInput", true);



    this.basketService.calculateBasket();
    if (this.storecurrency !== null && this.storecurrency !== undefined && this.storecurrency.length > 0) {
      this.basketService.calculateCurrencyBasket(payment.currency, payment.rate);
    }
    // this.basketService.addPaymentToBasket(payment, 0);
  }
  clearRefNumPayment(payment: Payment) {
    this.payment.refNum = "";
    setTimeout(() => {
      this.setFocus('refNum', payment.lineNum - 1);
    }, 50);
  }
  clearCustom1Payment(payment: Payment) {
    this.payment.customF1 = "";
    setTimeout(() => {
      this.setFocus('customF1', payment.lineNum - 1);
    }, 50);
  }
  checkCard(cardNo) {
    this.prepaidCardService.getItem(this.storeSelected.companyCode, cardNo).subscribe((response: any) => {
      return response.data;

    })

  }
  findVoucherDetail(voucherText, payment) {
    let basket = this.basketService.getCurrentBasket();
    this.authService.setOrderLog("Order", "Find Voucher", "", voucherText);
    // basket.customer.customerId
    voucherText = voucherText.replace(/\s/g, "");

    this.mwiService.validateVoucher(basket.customer.id, voucherText, this.storeSelected.storeId).subscribe((response: any) => {
      // console.log(response);
      if (response.status === 1) {
        let voucher = response.data;
        // debugger;
        if (voucher.discount_code !== "xyz_123") {
          let mes = "Voucher cannot be used to payment. Please check your voucher.";
          this.alertify.warning(mes);
          Swal.fire({
            icon: 'warning',
            title: 'Validate Voucher (TAPTAP)',
            text: mes
          });
        }
        else {
          let code = "";
          let defaultPayment = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'CRMSystem');
          if (defaultPayment !== null && defaultPayment !== undefined && defaultPayment.customField1 !== undefined && defaultPayment.customField1 !== null) {
            // let taptap = this.paymentMethodOtherList.find(x => x.paymentCode === defaultPayment.customField1);
            code = defaultPayment.customField1;
          }
          // else {
          //   this.alertify.warning("Can't found payment method default with TapTap voucher");
          // }
          let selectedPayment;
          let paymentType = "";
          if (payment !== null && payment !== undefined) {
            selectedPayment = payment;
            code = selectedPayment?.paymentCode;
            paymentType = selectedPayment?.paymentType;
          }

          console.log('Selected Payment ', this.payment);
          debugger;
          let basketpayments = this.basketService.getCurrentPayment();
          let paymentMethodCheck = this.paymentMethods.find(x => x.paymentCode === code);
          if (paymentMethodCheck !== null && paymentMethodCheck !== undefined) {
            let checkVoucher = basketpayments.find(x => x.refNum === voucher.voucher_code && x.id === code);
            if (checkVoucher !== null && checkVoucher !== undefined) {
              this.alertify.warning("Can't add coupon voucher existed in payment list.");
            }
            else {
              // let desc = 'Tap Tap Voucher';
              this.payment = new Payment();
              // let paymentX = new Payment();
              // .id=
              this.payment.isRequireRefNum = false;
              this.payment.id = code;// taptap.paymentCode;
              this.payment.shortName = code;// taptap.paymentCode;
              this.payment.voucherSerial = voucher.voucher_code;
              this.payment.refNum = voucher.voucher_code;
              this.payment.paymentDiscount = 0;
              this.payment.paymentTotal = 0;
              this.payment.mainBalance = 0;
              this.payment.subBalance = 0;
              this.payment.paymentCharged = voucher.discount_value;
              this.payment.canEdit = false;
              this.payment.paymentType = paymentType;
              //2023-01-04 copy code từ payment voucher qua
              if (parseFloat(voucher.discount_value) - this.basketService.getAmountLeft() > 0) {
                this.payment.forfeit = parseFloat(voucher.discount_value) - this.basketService.getAmountLeft();
              }
              // if (this.payment.currency !== null && this.payment.currency !== undefined && this.payment.currency !== '') {
              //   this.payment.rate = this.payment.rate;
              //   this.payment.fcAmount = this.payment.fcAmount;
              //   this.payment.currency = this.payment.currency;
              //   this.payment.paidAmt = this.payment.value;
              // }

              this.payment.paymentCharged = this.basketService.getAmountLeft();

              let valueCollected = parseFloat(voucher.discount_value) - this.basketService.getAmountLeft();
              if (valueCollected > 0) {
                valueCollected = this.basketService.getAmountLeft();
                this.alertify.warning("The transaction cannot settlement");
              }
              else {
                valueCollected = parseFloat(voucher.discount_value)
              }

              //2023-01-04 hết đoạn copy code từ payment voucher qua

              let linenum = this.basketService.getCurrentBasket().payments.length + 1;
              this.payment.lineNum = linenum;

              //thay valueCollected vào parseFloat(voucher.discount_value)
              this.basketService.addPaymentToBasket(this.payment, valueCollected, voucher);
            }
          }
          else {
            this.alertify.warning("Can't found payment method: " + code);
          }
        }


      }
      else {
        // this.alertify.warning(response.msg);
        Swal.fire({
          icon: 'warning',
          title: 'Validate Voucher (TAPTAP)',
          text: response.msg
        });
      }

    }, error => {
      console.log('error', error);
      Swal.fire({
        icon: 'error',
        title: 'Validate Voucher (TAPTAP)',
        text: "Can't connect to Voucher System"
      });
    });

  }


  findTeraVoucherDetail(apiURL, voucherText, payment) {
    let basket = this.basketService.getCurrentBasket();
    this.authService.setOrderLog("Order", "Find Voucher", "", voucherText);
    // basket.customer.customerId
    voucherText = voucherText.replace(/\s/g, "");

    this.mwiService.validateVoucherTera(apiURL, voucherText).subscribe((response: any) => {
      // console.log(response);
      debugger;
      if (response.success) {
        let voucher = response.data;
        let code = "";
        let defaultPayment = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'CRMSystem');
        if (defaultPayment !== null && defaultPayment !== undefined && defaultPayment.customField1 !== undefined && defaultPayment.customField1 !== null) {
          // let taptap = this.paymentMethodOtherList.find(x => x.paymentCode === defaultPayment.customField1);
          code = defaultPayment.customField1;
        }
        // else {
        //   this.alertify.warning("Can't found payment method default with TapTap voucher");
        // }
        let selectedPayment;
        let paymentType = "";
        if (payment !== null && payment !== undefined) {
          selectedPayment = payment;
          code = selectedPayment?.paymentCode;
          paymentType = selectedPayment?.paymentType;
        }
        console.log('Selected Payment ', this.payment);
        debugger;
        let basketpayments = this.basketService.getCurrentPayment();
        let paymentMethodCheck = this.paymentMethods.find(x => x.paymentCode === code);
        if (paymentMethodCheck !== null && paymentMethodCheck !== undefined) {
          let checkVoucher = basketpayments.find(x => x.refNum === voucher.code && x.id === code);
          if (checkVoucher !== null && checkVoucher !== undefined) {
            this.alertify.warning("Can't add coupon voucher existed in payment list.");
          }
          else {
            // let desc = 'Tap Tap Voucher';
            this.payment = new Payment();
            // let paymentX = new Payment();
            // .id=
            this.payment.isRequireRefNum = false;
            this.payment.id = code;// taptap.paymentCode;
            this.payment.shortName = code;// taptap.paymentCode;
            this.payment.voucherSerial = voucher.code;
            this.payment.refNum = voucher.code;
            this.payment.paymentDiscount = 0;
            this.payment.paymentTotal = 0;
            this.payment.mainBalance = 0;
            this.payment.subBalance = 0;
            this.payment.paymentCharged = voucher.value;
            this.payment.canEdit = false;
            this.payment.paymentType = paymentType;
            //2023-01-04 copy code từ payment voucher qua
            if (parseFloat(voucher.value) - this.basketService.getAmountLeft() > 0) {
              this.payment.forfeit = parseFloat(voucher.value) - this.basketService.getAmountLeft();
            }
            // if (this.payment.currency !== null && this.payment.currency !== undefined && this.payment.currency !== '') {
            //   this.payment.rate = this.payment.rate;
            //   this.payment.fcAmount = this.payment.fcAmount;
            //   this.payment.currency = this.payment.currency;
            //   this.payment.paidAmt = this.payment.value;
            // }

            this.payment.paymentCharged = this.basketService.getAmountLeft();

            let valueCollected = parseFloat(voucher.value) - this.basketService.getAmountLeft();
            if (valueCollected > 0) {
              valueCollected = this.basketService.getAmountLeft();
              this.alertify.warning("The transaction cannot settlement");
            }
            else {
              valueCollected = parseFloat(voucher.value)
            }

            //2023-01-04 hết đoạn copy code từ payment voucher qua

            let linenum = this.basketService.getCurrentBasket().payments.length + 1;
            this.payment.lineNum = linenum;

            //thay valueCollected vào parseFloat(voucher.discount_value)
            if (voucher !== null && voucher !== undefined) {
              voucher.voucherPartner = "Tera";
            }
            this.basketService.addPaymentToBasket(this.payment, valueCollected, voucher);
          }
        }
        else {
          this.alertify.warning("Can't found payment method: " + code);
        }

      }
      else {
        // this.alertify.warning(response.msg);
        Swal.fire({
          icon: 'warning',
          title: 'Validate Voucher (Tera)',
          text: response.message
        });
      }

    }, error => {
      console.log('error', error);
      Swal.fire({
        icon: 'error',
        title: 'Validate Voucher (Tera)',
        text: "Can't connect to Voucher System"
      });
    });

  }
  addOtherPayment(payment) {
    debugger;


    if (payment.isCloseModal === true) {
      if (this.storecurrency !== null && this.storecurrency !== undefined && this.storecurrency.length > 0) {
        this.isShowCurrency = false;
        this.isShowPayment = true;
        this.isShowOtherPayment = false;
        this.isQRScan = false;
        this.isShowSubmitQRScan = false;
      }
      else {

        this.isShowPayment = true;
        this.isShowOtherPayment = false;
        this.isShowCurrency = false;
        this.isQRScan = false;
        this.isShowSubmitQRScan = false;
        if (this.saveOtherPaymentList !== null && this.saveOtherPaymentList !== undefined && this.saveOtherPaymentList?.length > 0) {
          this.paymentMethodOtherList = this.saveOtherPaymentList;
        }
      }
      // this.removePayment(this.payment);
    }
    else {
      this.isShowOtherPayment = false;
      this.isShowPayment = true;
      this.addPaymentClick(payment, true, payment.isRequireRefnum);
    }

    setTimeout(() => {
      this.loadShortcut();
    }, 100);
  }
  addMultiCurrencyPayment(payment, isRequire) {
    // debugger;
    if (payment.isCloseModal === true) {
      this.isShowCurrency = false;
      this.isShowPayment = true;
      this.isShowOtherPayment = false;
      this.isQRScan = false;
      this.isShowSubmitQRScan = false;
    }
    else {
      payment.fcAmount = this.authService.roundingValue(payment.value * payment.rate, payment.roundingMethod);
      //Math.round((payment.value * payment.rate ) * 100.0 / 5.0) * 5.0 / 100.0;  

      this.addPayment(true, payment, false, isRequire);



    }


  }
  closePadMultiCurrency(payment) {
    this.inputNum(payment.value.toString(), false);
    this.basketService.calculateCurrencyBasket(payment.currency, payment.rate);
    this.isShowCurrency = false;
    this.isShowPayment = true;
    this.isQRScan = false;
    this.isShowSubmitQRScan = false;

  }
  // selectCurrency(currency: MStoreCurrency, )
  // {
  //   this.payment.rate = currency.rate;
  //   this.payment.currency = currency.currency;
  //   this.payment.value = 0;
  //   this.payment.isCloseModal = false;
  //   // this.outPayment.emit(this.payment);
  // }
  closePadOtherPayment(payment) {
    // debugger;
    if (this.storecurrency !== null && this.storecurrency !== undefined && this.storecurrency.length > 0 && (payment.currency === null || payment.currency === undefined || payment.currency === '')) {
      this.isShowCurrency = true;
      this.isShowPayment = false;
      this.isShowOtherPayment = false;
      this.isQRScan = false;
      switch (payment.paymentType) {
        case 'E': {
          //statements; 
          this.isShowCurrency = false;
          this.isShowPayment = true;
          this.isShowSubmitQRScan = true;
          // this.isQRScan = true;
          break;
        }
        case 'C': {
          //statements; 

          if (payment.currency === this.storeSelected.currencyCode) {
            this.resetPaymentInput();
          }
          else {
            this.isShowCurrency = true;
            this.isShowPayment = false;
            this.isShowOtherPayment = false;
            this.isQRScan = false;
          }
          break;
        }
        default: {
          //statements; 
          this.resetPaymentInput();
          break;
        }
      }
    }
    else {
      this.isShowPayment = true;
      this.isShowOtherPayment = false;
      this.isShowCurrency = false;
      this.isQRScan = false;
      this.isShowSubmitQRScan = false;

      switch (payment.paymentType) {
        case 'E': {
          //statements; 
          this.isShowCurrency = false;
          this.isShowPayment = true;
          this.isShowSubmitQRScan = true;
          // this.isQRScan = true;
          break;
        }
        // case 'C': { 
        //    //statements; 

        //    if(payment.currency === this.storeSelected.currencyCode)
        //    {
        //     this.resetPaymentInput();
        //    }
        //    else
        //    {
        //       this.isShowCurrency = false;
        //       this.isShowPayment= false;
        //       this.isShowOtherPayment = false;
        //       this.isQRScan = false;
        //    }
        //    break; 
        // } 
        default: {
          //statements; 
          this.resetPaymentInput();
          break;
        }
      }
    }


  }
  isShowPayment = true;
  modalRef: BsModalRef;
  paymentTmp: IBasketPayment;
  paymentSelectTemp: MPaymentMethod;
  isShowCurrency = false;
  checkMultiPayment(basket) {
    let currenpayment = basket?.payments?.length ?? 0;
    if (currenpayment > 0) {
      return true;
    }
    else {
      return false;
    }
  }
  withPaymentDiscountVisible = false;
  toggleTotalDiscountOptions(promotionId) {

    this.withPaymentDiscountVisible = !this.withPaymentDiscountVisible;
    let basket = this.basketService.getCurrentBasket();
    if (basket !== null && basket !== undefined) {
      let promotionX = promotionId.trim();
      debugger;
      promotionX = promotionX.substring(0, promotionId?.length - 2);

      let promos = basket.promotionApply.filter(x => x.promoId === promotionX);
      if (promos !== null && promos !== undefined) {
        let promo = promos[0];
        this.paymentDetailPromotion = promo;
      }
      else {
        this.paymentDetailPromotion.promoId = promotionX;
      }
    }


  }
  openPromotion(promotionId) {
    window.open('admin/promotion/edit/' + promotionId, "_blank");
    // debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
    //  this.routeNav.navigate(["shop/bills", this.order.transId, this.order.companyCode, this.order.storeId]).then(() => {
    //   window.location.reload();
    // }); 
  }
  runSimulate = false;
  paymentDetailPromotion;
  runPaymentSimualation() {
    let basket = this.basketService.getCurrentBasket();
    let payments = basket.payments;

    let amountLeft = (this.basketService.getAmountLeft() ?? 0);
    amountLeft = this.authService.roundingAmount(amountLeft);
    if (amountLeft !== 0) {
      Swal.fire({
        title: 'Due amount',
        text: 'Due amount ' + this.authService.formatCurrentcy(amountLeft),
        icon: 'info',
        confirmButtonText: 'Ok',
      })
    }
    else {
      debugger;
      if (this.basketService.checkPayment(payments)) {
        if (this.checkPaymetInput(basket)) {
          this.basketService.applyPromotion(basket, null, null, true);
          this.runSimulate = true;
        }
      }
    }


  }
  clearSimualation() {


    let basket = this.basketService.getCurrentBasket();
    let source = basket.payments;
    if (source !== null && source !== undefined && source?.length > 0) {
      source.forEach(paymentInbasket => {
        if (paymentInbasket.id !== 'Point') {
          paymentInbasket.paymentDiscount = null;
          paymentInbasket.promoId = null;
          if (paymentInbasket.promoId?.length > 0) {
            basket.promotionApply = basket.promotionApply.filter(x => x.promoId !== paymentInbasket.promoId);
          }
        }

      });

      basket.promotionApply = basket.promotionApply.filter(x => x.promoType !== 10);
      this.basketService.setBasket(basket);
    }
    setTimeout(() => {
      this.runSimulate = false;

    }, 200);

  }
  addPaymentClick(payment: MPaymentMethod, isClose?: boolean, isRequire?: boolean) {
    debugger;
    if (this.isShowSubmitQRScan) {
      this.alertify.warning("Please Complete progress payment or remove payment");
    }
    else {
      let bankInfor = {
        portName: payment.bankCustomF1, timeOut: payment?.bankCustomF2, paymentType: payment.paymentType, apiURL: payment.apiUrl,
        bankSelectedMode: payment.bankSelectedMode,
      }
      // null;// this.fatherPayment.find(x=>x.fatherId === fatherId);
      //     obj[item.fatherId].portName = item.bankCustomF1;
      //     obj[item.fatherId].timeOut = item?.bankCustomF2;

      // switch (bankInfor.paymentType) {
      //   case 'E': {
      //     //statements; 
      //     this.isShowCurrency = false;
      //     this.isShowPayment = true;
      //     this.isShowSubmitQRScan = true;
      //     // this.isQRScan = true;
      //     break;
      //   }
      //   case 'B': {

      //   }
      // }
      if (payment?.lines === null || payment?.lines === undefined) {
        payment.lines = [];
      }
      if (payment?.paymentType === null || payment?.paymentType === undefined) {
        payment.paymentType === ''
      }
      if (payment.paymentType === 'E' && payment.apiUrl === 'PAYOO') {

        let payment1 = new Payment();
        payment1.id = payment.paymentCode;
        payment1.currency = payment.currency;
        payment1.shortName = payment.shortName;
        payment1.refNum = "";
        payment1.paymentDiscount = 0;

        payment1.lineNum = 1;
        payment1.rate = 1;
        payment1.fcRoundingOff = 0;
        payment1.roundingOff = 0;
        payment1.customF2 = payment.paymentType;
        payment1.paymentType = payment.paymentType;
        this.basketTotal$.subscribe(data => {
          console.log(data);
          // this.payment.paymentCharged = data.subtotal - data.totalAmount;
          //  payment.paymentTotal = data.billTotal;
          payment1.paymentCharged = data.billTotal;
          data.totalAmount = data.billTotal;
        });
        // payment.
        this.basketService.addPaymentToBasket(payment1, payment1.paymentCharged);
        this.addOrder();
        // let newOrder = new PayooModel();
        // var yourDate = new Date();  // for example 
        // var orderExpiredDate = yourDate.getFullYear().toString() +yourDate.getMonth().toString()+
        // yourDate.getDay().toString()+yourDate.getHours().toString()+yourDate.getMinutes().toString();
        // // calculate the total number of .net ticks for your date
        // let totalpayment = this.basketService.getTotalBasket();
        // newOrder.orderCode = '';//"M100004203";//
        // newOrder.orderAmount = totalpayment.amountLeft;//
        // newOrder.orderExpiredDate = orderExpiredDate;
        // newOrder.orderLinkNotify = "http://113.161.79.71:8090/Payoo/Notify";
        // newOrder.accountName = "";
        // newOrder.staffCode = "";
        // newOrder.customerName = "";
        // newOrder.customerAddress = "";
        // newOrder.customerPhone = "";
        // newOrder.customerEmail = "";
        // newOrder.orderNote = "Thanh toan don hang";
        // newOrder.orderDetail = "plus";
        // newOrder.terminalID = "Onlineterminal";// teminal online
        // newOrder.createShopCode = "";
        // newOrder.createDate = "";
        // newOrder.status = false;

        // this.waitingAPi = true;
        // this.message = "Wait for minutes.";
        // let timeOut = 60;
        // let basket = this.basketService.getCurrentBasket();

        // this.mwiService.payooCreateOrder(newOrder).subscribe((response: any)=>{

        //   this.waitingAPi = false;
        //   this.message = "";
        //   if(response.success)
        //   {
        //     let responeData = response.data;
        //       if(responeData!==null && responeData!==undefined )
        //       {
        //           // let basket = this.basketService.getCurrentBasket();
        //           this.payment = new Payment();
        //           // let paymentX = new Payment();
        //           // .id=
        //           // this.payment.isRequireRefNum = false;
        //           // this.payment.id = paymentBankterminal.paymentCode;// taptap.paymentCode;
        //           // this.payment.shortName = paymentBankterminal.paymentDesc ?? paymentBankterminal.paymentCode;// taptap.paymentCode;
        //           this.payment.id = payment.paymentCode
        //           this.payment.isRequireRefNum = true;
        //           this.payment.shortName = payment.paymentDesc;
        //           this.payment.refNum = responeData?.responseData;
        //           this.payment.paymentDiscount = 0;
        //           this.payment.paymentTotal = 0;
        //           this.payment.mainBalance = 0;
        //           this.payment.subBalance = 0;
        //           this.payment.paymentCharged = totalpayment.amountLeft ;//voucher.discount_value;
        //           this.payment.canEdit = false; 
        //           this.payment.paymentMode = "Payoo";
        //           // this.payment.cardType =  responeData?.cardIssuerID;
        //           // this.payment.cardNo =  responeData?.cardNumber;
        //           // this.payment.cardHolderName =  responeData?.cardHolderName; 
        //           this.payment.customF1 =  "";
        //           // this.payment.customF5 = voucherGet?.vouchercategory;
        //           // this.basketTotal$.subscribe(data => {
        //           //   console.log(data);
        //           //   this.payment.paymentCharged  = data.subtotal - data.totalAmount;
        //           // });
        //           let linenum = this.basketService.getCurrentBasket().payments.length + 1;
        //           this.payment.lineNum = linenum;
        //           this.basketService.addPaymentToBasket(this.payment, totalpayment.amountLeft );

        //           let payments = this.basketService.getCurrentPayment();
        //           console.log('payments', payments);
        //           setTimeout(() => {
        //             let basketTotal = this.basketService.getTotalBasket();
        //             if(basketTotal.amountLeft === 0)
        //             {
        //               this.addOrder();
        //             }
        //           }, 200);
        //       }
        //       else
        //       {
        //         Swal.fire({
        //           icon: 'warning',
        //           title: 'Payment (Bank Terminal)',
        //           text: "Can't get data from bank device"
        //         });

        //       }
        //     }
        //   else
        //   {
        //     console.log("Đạt óc chó")
        //   }
        //   },(error)=>{
        //     this.waitingAPi=false;
        //     this.alertify.error(error)
        //   });
      }
      else if (payment.lines?.length > 0 && payment.paymentType === 'B') {

        let bankMode = payment.bankSelectedMode ?? 'Auto';
        if (bankMode === "Auto") //this.bankSelectMode
        {
          // if( payment.paymentType === 'B' )
          // {

          // }
          // switch (payment.paymentType) {
          //   case 'E': {

          //     // this.isQRScan = true;
          //     break;
          //   }
          //   case 'B': {

          //     break;
          //   }
          // }
          let totalpayment = this.basketService.getTotalBasket();
          debugger;

          console.log('this.fatherPayment', this.fatherPayment);

          if (bankInfor !== null && bankInfor !== undefined) {
            console.log('Bank Infor', bankInfor)
            let portName = bankInfor?.portName;
            let timeOutStr = bankInfor?.timeOut;
            // let compBank = environment.production === true ? this.env.bankTerminalCOM : environment.bankTerminalCOM;
            let fatherId = payment.paymentCode;
            debugger;
            if (portName !== null && portName !== undefined && portName?.length > 0) {
              this.waitingAPi = true;
              this.message = "Wait for minutes.";
              let timeOut = 60;
              if (timeOutStr === null || timeOutStr === undefined || timeOutStr === '' || timeOutStr === "NaN" || timeOutStr === "undefined") {
                timeOut = 60;
              }
              else {
                timeOut = parseFloat(timeOutStr);
              }
              let basket = this.basketService.getCurrentBasket();

              this.bankTerminalService.SendPayment('1', fatherId, portName, totalpayment.amountLeft, "", basket.id, timeOut).subscribe((response: any) => {

                this.waitingAPi = false;
                this.message = "";
                if (response.success) {
                  // debugger;

                  // approvalCode: "PYTEST" // Mã Approve của ngân hàng
                  // cardHolderName: "" // Tên khách hàng thẻ
                  // cardIssuerID: "08" // Loại thẻ mapping
                  // cardIssuerName: null    // 
                  // cardNumber: "550989******1885"  // Mã số thẻ
                  // invoiceNumber: "000002"    // Transaction Id
                  // merchantNumber: "6601248584"  // Mã định danh
                  // statusCode: "00"     // Trạng thái
                  // terminalID: "40041761" // Mã thiết bị
                  let responeData = response.data;
                  if (responeData.statusCode !== '00') {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Payment (Bank Terminal)',
                      text: "Can't payment. Please try again."
                    });
                  }
                  else {
                    if (responeData !== null && responeData !== undefined) {
                      console.log('responeData', responeData);

                      console.log('this.paymentMethodOtherList', this.paymentMethodOtherList);
                      let paymentBankterminal: any = payment.lines.find(x => x.bankPaymentType === responeData.cardIssuerID);//this.paymentMethodOtherList.find(x=>x.bankPaymentType === responeData.cardIssuerID);
                      // console.log('payment', payment);
                      if (paymentBankterminal !== null && paymentBankterminal !== undefined) {
                        // let basket = this.basketService.getCurrentBasket();
                        this.payment = new Payment();
                        // let paymentX = new Payment();
                        // .id=
                        this.payment.isRequireRefNum = false;
                        this.payment.id = paymentBankterminal.paymentCode;// taptap.paymentCode;
                        this.payment.shortName = paymentBankterminal.paymentDesc ?? paymentBankterminal.paymentCode;// taptap.paymentCode;

                        this.payment.refNum = responeData?.invoiceNumber;
                        this.payment.paymentDiscount = 0;
                        this.payment.paymentTotal = 0;
                        this.payment.mainBalance = 0;
                        this.payment.subBalance = 0;
                        this.payment.paymentCharged = totalpayment.amountLeft;//voucher.discount_value;
                        this.payment.canEdit = false;
                        this.payment.paymentMode = "BankTerminal";
                        this.payment.cardType = responeData?.cardIssuerID;
                        this.payment.cardNo = responeData?.cardNumber;
                        this.payment.cardHolderName = responeData?.cardHolderName;
                        this.payment.customF1 = responeData?.approvalCode;
                        this.payment.customF2 = paymentBankterminal?.paymentType;
                        this.payment.customF3 = paymentBankterminal?.forfeitCode;
                        this.payment.customF4 = responeData?.terminalID;
                        this.payment.customF5 = fatherId;
                        // this.payment.customF5 = voucherGet?.vouchercategory;
                        // this.basketTotal$.subscribe(data => {
                        //   console.log(data);
                        //   this.payment.paymentCharged  = data.subtotal - data.totalAmount;
                        // });
                        let linenum = this.basketService.getCurrentBasket().payments.length + 1;
                        this.payment.lineNum = linenum;
                        this.basketService.addPaymentToBasket(this.payment, totalpayment.amountLeft);

                        let payments = this.basketService.getCurrentPayment();
                        console.log('payments', payments);
                        setTimeout(() => {
                          let basketTotal = this.basketService.getTotalBasket();
                          if (basketTotal.amountLeft === 0) {
                            // this.addOrder();
                            setTimeout(() => {
                              this.addOrder();
                            }, 100)
                          }
                        }, 200);



                        // this.basketService.addOrUpdatePayment(basket.payments, payment, payment.paymentTotal);
                      }
                      else {
                        Swal.fire({
                          icon: 'warning',
                          title: 'Payment (Bank Terminal)',
                          text: "Can't found data from store payment."
                        });
                      }
                    }
                    else {
                      Swal.fire({
                        icon: 'warning',
                        title: 'Payment (Bank Terminal)',
                        text: "Can't get data from bank device"
                      });

                    }
                  }


                }
                else {
                  // this.alertify.warning(response.message);
                  Swal.fire({
                    icon: 'warning',
                    title: 'Payment (Bank Terminal)',
                    text: response.message
                  });

                }
              }, error => {
                debugger;
                this.waitingAPi = false;
                this.message = "";

                Swal.fire({
                  icon: 'error',
                  title: 'Payment (Bank Terminal)',
                  text: error
                });
              });
            }
            else {
              Swal.fire({
                icon: 'warning',
                title: 'Payment (Port)',
                text: "Please check setup " + fatherId + " port device"
              });
            }



          }
          else {
            Swal.fire({
              icon: 'warning',
              title: 'Bank information',
              text: "can't found data of " + payment.shortName
            })
          }
        }
        else {

          debugger;
          setTimeout(() => {
            var newArray = [];

            this.paymentMethodOtherList.forEach(val => newArray.push(Object.assign({}, val)));
            this.saveOtherPaymentList = newArray;
            this.paymentMethodOtherList = payment.lines;// this.paymentMethodOtherList.filter(x=>  !paymentGrps.includes(x.paymentCode));

            this.titleOtherPayment = payment.shortName;

            this.isShowOtherPayment = true;
            this.isShowCurrency = false;
            this.isQRScan = false;
            // !this.isShowOtherPayment;
            this.isShowPayment = false;
          }, 20);




          // if (this.isShowOtherPayment === true) {
          //   this.isShowOtherPayment = false;
          //   this.isShowCurrency = false;
          //   this.isQRScan = false;
          //   // !this.isShowOtherPayment;
          //   this.isShowPayment = true;
          // }
          // else {

          // }
        }


      }
      else {
        debugger;
        let paymentCustom = Object.assign({}, payment);
        let basket = this.basketService.getCurrentBasket();
        let amountLeft = this.basketService.getAmountChange();
        let basketTotal = this.basketService.getTotalBasket();
        if (basketTotal !== null || basketTotal !== undefined) {
          this.authService.setOrderLog("Order", "Add Payment", "", payment.paymentCode + ' - ' + payment.paymentDesc, basketTotal?.billTotal?.toString());
        }
        else {
          this.authService.setOrderLog("Order", "Add Payment", "", payment.paymentCode + ' - ' + payment.paymentDesc);
        }


        this.paymentSelectTemp = paymentCustom;
        let generalSetting = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId);
        let checkSerial = generalSetting.find(x => x.settingId === "MultiPayment");
        let chekPayment = true;
        if (checkSerial !== null && checkSerial !== undefined && checkSerial?.settingValue !== "true") {
          chekPayment = this.checkMultiPayment(basket);
        }
        if (chekPayment) {
          let checkAllowMix = true;
          let paymentInBasket = this.basketService.getCurrentBasket().payments;

          if (paymentCustom?.allowMix === false && paymentInBasket !== null && paymentInBasket !== undefined && paymentInBasket.length > 0) {
            checkAllowMix = false;
          }
          else {
            if (paymentInBasket !== null && paymentInBasket !== undefined && paymentInBasket?.length > 0) {
              let firstLine = this.paymentMethods.find(x => x.paymentCode === paymentInBasket[0].id);
              if (firstLine?.allowMix === false) {
                checkAllowMix = false;
              }
            }
          }

          if (checkAllowMix === false) {
            this.alertify.warning("Can't add new payment. Payment does not alow mix with another payment.");
            this.resetPaymentInput();
          }
          else {
            // debugger;
            if (amountLeft <= 0 || basket?.negativeOrder) {
              // && payment.paymentType === 'C' 
              if (this.storecurrency !== null && this.storecurrency !== undefined && this.storecurrency.length > 0 && payment.paymentType === 'C' && (paymentCustom.currency === null || paymentCustom.currency === undefined || paymentCustom.currency === '')) {
                this.isShowCurrency = true;
                this.isShowPayment = false;
                this.isShowOtherPayment = false;
              }
              else {
                if (paymentCustom?.currency != this.storeSelected.currencyCode) {
                  let currency = this.storecurrency.filter(x => x.currency === paymentCustom.currency)
                  if (currency !== null && currency !== undefined && currency?.length > 0) {
                    paymentCustom.rate = currency[0].rate;
                    paymentCustom.currency = paymentCustom.currency;
                    paymentCustom.value = 0;
                    paymentCustom.isCloseModal = false;
                    this.addMultiCurrencyPayment(paymentCustom, false);
                  }
                  else {
                    this.addPayment(false, paymentCustom, isClose, isRequire);
                  }
                }
                else {
                  this.addPayment(false, paymentCustom, isClose, isRequire);
                }

              }
            }
            else {
              this.alertify.warning("Can't add new payment");
            }
          }

        }
        else {
          this.alertify.warning("Can't add new payment. Payment store setting is single.");
        }
      }

    }



  }
  isQRScan: boolean = null;
  randomString(length) {
    //abcdefghijklmnopqrstuvwxyz0123456789
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }
  waitingAPi = false;
  confirmResult = false;
  filterPayment(isPaid): IBasketPayment[] {
    let basket = this.basketService.getCurrentBasket();
    let result = [];

    if (basket !== null && basket !== undefined) {
      if (basket.payments?.length > 0) {
        if (isPaid) {
          result = basket.payments.filter(x => x.isPaid === true);
        }
        else {

          result = basket.payments.filter(x => x.isPaid !== true);
        }
      }
      if (isPaid === true && basket?.salesType?.toLowerCase() === 'addpayment' && result?.length <= 0 && basket?.paidPayments?.length > 0) {
        result = basket?.paidPayments;
      }
    }

    return result;
  }

  applyQrPayment(payment: IBasketPayment) {
    debugger;
    setTimeout(() => {
      this.loadShortcut();
    }, 100);
    if (payment.isCloseModal) {
      this.isQRScan = false;
      this.isShowCurrency = false;
      this.isShowPayment = true;
      this.isShowOtherPayment = false;
      this.isShowSubmitQRScan = true;
    }
    else {

      switch (payment.apiUrl) {
        case 'Sarawak': {
          //statements; 
          if (this.MWISarawak !== null && this.MWISarawak !== undefined && this.MWISarawak?.customField1?.length > 0) {
            let MerchantID = this.MWISarawak?.customField2;
            if (MerchantID !== null && MerchantID !== undefined && MerchantID?.length > 0) {
              let newOrder = new MWISarawakModel();
              var yourDate = new Date();  // for example 
              // the number of .net ticks at the unix epoch
              var epochTicks = 621355968000000000;
              // there are 10000 .net ticks per millisecond
              var ticksPerMillisecond = 10000;
              // calculate the total number of .net ticks for your date
              var yourTicks = epochTicks + (yourDate.getTime() * ticksPerMillisecond);
              let date = new Date();
              // new Date(netTicks);
              let newTick = ((date.getTime() * 10000) + 621355968000000000) - (date.getTimezoneOffset() * 600000000);
              newOrder.merchantId = MerchantID;//"M100004203";//
              newOrder.orderAmt = payment.paymentTotal;//
              newOrder.curType = "RM";
              payment.canEdit = false;
              newOrder.qrCode = payment.refNum;
              newOrder.notifyURL = "https://google.com";
              newOrder.merOrderNo = this.randomString(2) + newTick.toString();
              newOrder.transactionType = "1";
              newOrder.remark = "";
              newOrder.goodsName = "";
              // // debugger;
              // payment.customF1 = "1234";
              this.basketService.changeOMSId(newOrder.merOrderNo);

              this.loadingService.startLoading(this, LoadingIndicator.MANUAL);
              this.mwiService.sarawakPayCreateOrder(newOrder).subscribe((response: any) => {
                // // debugger;
                if (response.success) {

                  this.waitingAPi = true;
                  let checkModel = { merchantId: newOrder.merchantId, merOrderNo: newOrder.merOrderNo, orderNo: response.data };
                  let loopNum: number = 0;
                  //in 10 seconds do something
                  interval(10000).subscribe(x => {
                    if (loopNum < 3 && this.waitingAPi === true) {
                      this.mwiService.sarawakPayQueryOrders(checkModel).subscribe((responseCheck: any) => {

                        if (responseCheck.success) {
                          // // debugger; 
                          // 0 – Order Pending
                          // 1 – Order Paid
                          // 2 – Order Failed
                          // 4 – Order Closed
                          if (responseCheck.data === "1") {
                            this.alertify.success("Payment sarawak successfully");
                            // // debugger; 
                            var paymentClone1 = Object.assign({}, payment);
                            let customFieldX = (paymentClone1?.customF1 === null || paymentClone1?.customF1 === undefined || paymentClone1?.customF1 === '') ? '' : paymentClone1?.customF1;


                            if (customFieldX?.length <= 0) {
                              payment.customF1 = payment.refNum;
                              payment.refNum = response.data;
                              payment.customF3 = payment.apiUrl;
                              payment.canEdit = false;

                              let basket = this.basketService.getCurrentBasket();
                              setTimeout(() => {
                                this.basketService.addOrUpdatePayment(basket.payments, payment, payment.paymentTotal);
                                this.isShowSubmitQRScan = false;
                                this.resetPaymentInput();
                                this.selectedRow = null;
                                this.payment = null;
                                this.confirmResult = true;
                                this.waitingAPi = false;
                                this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
                                let basketTotal = this.basketService.getTotalBasket();
                                if (basketTotal.amountLeft === 0) {
                                  setTimeout(() => {
                                    this.addOrder();
                                  }, 100)
                                }
                              }, 100);
                            }
                            else {
                              let paymentResponse = response.data[customFieldX];
                              // let paymentX: any = payment; 
                              let paymentInsert = this.paymentMethods.find(x => x.paymentCode === paymentResponse);;

                              if (paymentInsert !== null && paymentInsert !== undefined) {
                                // var paymentClone = Object.assign({}, payment); 
                                // paymentClone.id = responseCheck.data[]
                                paymentClone1.id = payment.id;
                                paymentClone1.shortName = payment?.shortName;
                                paymentClone1.paymentTotal = payment.paymentTotal;
                                paymentClone1.customF1 = payment.refNum;
                                paymentClone1.customF3 = payment.apiUrl;
                                paymentClone1.refNum = response.data;
                                paymentClone1.canEdit = false;
                                this.basketService.removePayment(payment);
                                let basket = this.basketService.getCurrentBasket();
                                setTimeout(() => {
                                  this.basketService.addOrUpdatePayment(basket.payments, paymentClone1, paymentClone1.paymentTotal);
                                  this.isShowSubmitQRScan = false;
                                  this.resetPaymentInput();
                                  this.selectedRow = null;
                                  this.payment = null;
                                  this.confirmResult = true;
                                  this.waitingAPi = false;
                                  this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
                                  let basketTotal = this.basketService.getTotalBasket();
                                  if (basketTotal.amountLeft === 0) {
                                    setTimeout(() => {
                                      this.addOrder();
                                    }, 100)

                                  }
                                }, 50);

                              }
                              else {
                                Swal.fire({
                                  icon: 'warning',
                                  title: 'Sarawak Payment Method',
                                  text: "Please check Payment Method: " + paymentResponse
                                });
                              }
                            }



                          }


                        }

                      });
                      loopNum++;

                    }
                    else {
                      this.waitingAPi = false;
                      this.confirmResult = false;
                      payment.refNum = "";
                      payment.customF1 = "";
                      let basket = this.basketService.getCurrentBasket();
                      this.basketService.addOrUpdatePayment(basket.payments, payment, payment.paymentTotal);
                      this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
                      this.refreshQRScan();
                    }
                  });
                }
                else {
                  this.alertify.warning(response.message);
                  this.refreshQRScan();
                }
              })
            }
            else {
              Swal.fire({
                icon: 'warning',
                title: 'Sarawak Setup',
                text: "Please check Sarawak Merchant Id Setup."
              });
            }

          }
          else {
            Swal.fire({
              icon: 'warning',
              title: 'Sarawak Setup',
              text: "Please check Sarawak setup."
            });
          }

          break;
        }
        case 'EWallet': {
          //statements; 
          //  this.alertify.warning('Payment ' + payment.shortName + ' building. Please try later.');
          debugger;
          let newOrder = new EpayModel();


          // if( this.merchandId === null || this.merchandId === null || this.merchandId === "") 
          // {
          //   this.merchandId = "302255";
          // }  
          // if( this.terminalId === null || this.terminalId === null || this.terminalId === "") 
          // {
          //   this.terminalId = "20000835";
          // }  
          if (this.MWIEpay !== null && this.MWIEpay !== undefined && this.MWIEpay?.customField1?.length > 0) {
            let merchantId = this.MWIEpay?.customField2;
            let terminalId = this.MWIEpay?.customField3;
            if (merchantId?.length > 0 && terminalId?.length > 0) {
              newOrder.merchantID = merchantId;//"302255";//this.authService.storeSelected().storeId; //1001
              newOrder.terminalID = terminalId;// "20000835";//this.authService.getStoreClient().publicIP; //Counter02 
              newOrder.amount = payment.paymentTotal * 100;
              newOrder.operatorID = 'SALES'; // Default Epay
              newOrder.product = '';
              newOrder.transId = this.basketService.getCurrentBasket().id + "-" + payment.lineNum;
              newOrder.accountNo = payment.refNum;
              payment.canEdit = false;



              this.mwiService.EpayPayment(newOrder).subscribe((response: any) => {

                // response = {
                //   "code": 0,
                //   "data": {
                //     "transRef": "EPA000127835|a1925404-2fd8-4650-a237-5d70b28bafbc-1",
                //     "product": "SHOPEEPAY",
                //     "customField1": "GrabPay more. Get more rewards."
                //   },
                //   "success": true,
                //   "message": null,
                //   "error": null
                // }
                debugger;
                if (response.success) {
                  // this.waitingAPi=true;
                  // let checkModel = {merchantId: newOrder.merchantId, merOrderNo: newOrder.merOrderNo, orderNo: response.data};
                  // let loopNum:number =0;
                  //in 10 seconds do something
                  this.alertify.success("Payment Epay successfully");

                  let productCode = response.data?.product ?? response.data?.productCode;


                  // let customFieldX = (paymentClone1?.customF1 === null || paymentClone1?.customF1 === undefined || paymentClone1?.customF1 === '') ? '' : paymentClone1?.customF1;


                  if (productCode !== null && productCode !== undefined && productCode?.length > 0) {
                    // let paymentResponse = response.data[customFieldX]; 
                    // paymentResponse
                    // let paymentInsert = this.paymentMethods.find(x=>x.paymentCode === paymentResponse);
                    let paymentInserts = this.payment.lines.filter(x => x.bankPaymentType === productCode);
                    let paymentInsert;
                    if (paymentInserts?.length > 0) {
                      paymentInsert = paymentInserts[0];
                    }
                    if (paymentInsert !== null && paymentInsert !== undefined) {
                      var paymentClone1 = Object.assign({}, payment);
                      paymentClone1.id = paymentInsert.paymentCode;// payment.id;
                      paymentClone1.shortName = paymentInsert.shortName;// payment?.shortName;
                      paymentClone1.paymentTotal = payment.paymentTotal;
                      paymentClone1.paymentCharged = payment.paymentCharged;
                      paymentClone1.customF1 = payment.refNum;
                      paymentClone1.customF3 = payment.apiUrl;
                      paymentClone1.refNum = response.data?.transRef;
                      paymentClone1.customF4 = response.data?.product ?? response.data?.productCode;
                      paymentClone1.canEdit = false;


                      // var paymentClone = Object.assign({}, payment); 
                      // paymentClone.id = paymentInsert?.id;
                      // paymentClone.shortName = paymentInsert?.shortName;
                      this.basketService.removePayment(payment);
                      setTimeout(() => {
                        debugger;
                        this.payment = new Payment();
                        this.payment.isRequireRefNum = true;
                        this.payment.id = paymentInsert.paymentCode;
                        this.payment.shortName = paymentInsert.shortName;
                        this.payment.refNum = response.data?.transRef;
                        this.payment.customF4 = response.data?.product ?? response.data?.productCode;
                        this.payment.paymentDiscount = 0;
                        this.payment.paymentTotal = 0;
                        this.payment.apiUrl = paymentClone1?.apiUrl;

                        // if (paymentClone1.currency !== null && paymentClone1.currency !== undefined && paymentClone1.currency !== '') {
                        //   this.payment.rate = paymentClone1.rate;
                        //   this.payment.fcAmount = paymentClone1.fcAmount;
                        //   this.payment.currency = paymentClone1.currency; 
                        // }
                        this.payment.customF1 = payment?.refNum;
                        this.payment.customF2 = payment?.customF2;
                        this.payment.customF3 = payment?.apiUrl;
                        this.payment.paymentCharged = this.basketService.getAmountLeft();
                        this.payment.canEdit = false;
                        let linenum = this.basketService.getCurrentBasket().payments.length + 1;
                        this.payment.lineNum = linenum;
                        this.basketService.addPaymentToBasket(this.payment, paymentClone1.paymentTotal);
                        // this.basketService.addOrUpdatePayment(basket.payments, paymentClone1, paymentClone1.paymentTotal);
                        setTimeout(() => {
                          debugger;
                          this.isShowSubmitQRScan = false;
                          this.resetPaymentInput();
                          this.selectedRow = null;
                          this.payment = null;
                          this.confirmResult = true;
                          this.waitingAPi = false;
                          this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
                          let basketTotal = this.basketService.getTotalBasket();
                          if (basketTotal.amountLeft === 0) {
                            setTimeout(() => {
                              this.addOrder();
                            }, 100)

                          }
                        }, 100);

                      }, 10);

                    }
                    else {
                      Swal.fire({
                        icon: 'warning',
                        title: 'E-Wallet Payment Method',
                        text: "Can't get payment " + productCode // paymentResponse
                      }).then(() => {
                        // this.alertify.warning(response.message);
                        this.waitingAPi = false;
                        payment.customF1 = "";
                        payment.customF3 = "";
                        payment.refNum = "";
                        let basket = this.basketService.getCurrentBasket();
                        this.basketService.addOrUpdatePayment(basket.payments, payment, payment.paymentTotal);
                        this.basketService.changeDateTime(new Date());
                        this.refreshQRScan();
                      });
                    }

                  }
                  else {
                    payment.customF1 = payment.refNum;
                    payment.customF3 = payment.apiUrl;
                    payment.refNum = response.data?.transRef ?? "";
                    payment.customF4 = (response.data?.product ?? response.data?.productCode) ?? "";
                    // debugger; 

                    // var paymentClone = Object.assign({}, payment); 
                    // paymentClone.id = paymentInsert?.id;
                    // paymentClone.shortName = paymentInsert?.shortName;
                    // this.basketService.removePayment(payment);
                    let basket = this.basketService.getCurrentBasket();

                    setTimeout(() => {

                      this.basketService.addOrUpdatePayment(basket.payments, payment, payment.paymentTotal);
                      setTimeout(() => {
                        this.isShowSubmitQRScan = false;
                        this.resetPaymentInput();
                        this.selectedRow = null;
                        this.payment = null;
                        this.confirmResult = true;
                        this.waitingAPi = false;
                        this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
                        let basketTotal = this.basketService.getTotalBasket();
                        if (basketTotal.amountLeft === 0) {
                          // this.addOrder();
                          setTimeout(() => {
                            this.addOrder();
                          }, 100)
                        }
                      }, 100);

                    }, 10);
                  }

                }
                else {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Epay Transaction',
                    text: response.message
                  }).then(() => {
                    // this.alertify.warning(response.message);
                    this.waitingAPi = false;
                    payment.customF1 = "";
                    payment.customF3 = "";
                    payment.refNum = "";
                    let basket = this.basketService.getCurrentBasket();
                    this.basketService.addOrUpdatePayment(basket.payments, payment, payment.paymentTotal);
                    this.basketService.changeDateTime(new Date());
                    this.refreshQRScan();
                  });

                }
              }, error => {
                debugger;

                Swal.fire({
                  icon: 'error',
                  title: 'Epay Transaction',
                  text: error
                }).then(() => {
                  this.basketService.changeDateTime(new Date());
                  // this.alertify.warning(error);
                  this.waitingAPi = false;
                  payment.customF1 = "";
                  payment.customF3 = "";
                  payment.refNum = "";
                  let basket = this.basketService.getCurrentBasket();
                  this.basketService.addOrUpdatePayment(basket.payments, payment, payment.paymentTotal);
                  this.refreshQRScan();
                });

              })

            }
            else {
              Swal.fire({
                icon: 'warning',
                title: 'EWallet Setup',
                text: "Please check ewallet setup."
              });

            }

          }
          else {
            Swal.fire({
              icon: 'warning',
              title: 'EWallet Setup',
              text: "Please check ewallet setup."
            });
          }

          break;
        }
        default: {
          //statements; 
          this.alertify.warning('Please setup api url link for ' + payment.id + " - " + payment.shortName);
          break;
        }
      }



    }

  }

  // epayResponse(response)
  // {

  //   if (response.success) {
  //     // this.waitingAPi=true;
  //     // let checkModel = {merchantId: newOrder.merchantId, merOrderNo: newOrder.merOrderNo, orderNo: response.data};
  //     // let loopNum:number =0;
  //     //in 10 seconds do something
  //     this.alertify.success("Payment Epay successfully");
  //     var paymentClone1 = Object.assign({}, payment); 
  //     let productCode = response.data?.product??response.data?.productCode;


  //     // let customFieldX = (paymentClone1?.customF1 === null || paymentClone1?.customF1 === undefined || paymentClone1?.customF1 === '') ? '' : paymentClone1?.customF1;


  //     if(productCode !==null && productCode!==undefined && productCode?.length > 0)
  //     {
  //       // let paymentResponse = response.data[customFieldX]; 
  //       // paymentResponse
  //       let paymentInsert = this.paymentMethods.find(x=>x.paymentCode ===  productCode);

  //       if(paymentInsert!==null && paymentInsert!== undefined)
  //       {
  //         paymentClone1.id= paymentInsert.paymentCode;// payment.id;
  //         paymentClone1.shortName= paymentInsert.shortName;// payment?.shortName;
  //         paymentClone1.paymentTotal= payment.paymentTotal;

  //         paymentClone1.customF1 = payment.refNum;
  //         paymentClone1.customF3 = payment.apiUrl; 
  //         paymentClone1.refNum = response.data?.transRef;
  //         paymentClone1.customF4 = response.data?.product??response.data?.productCode;
  //         paymentClone1.canEdit = false;
  //         // debugger; 

  //         // var paymentClone = Object.assign({}, payment); 
  //         // paymentClone.id = paymentInsert?.id;
  //         // paymentClone.shortName = paymentInsert?.shortName;
  //         this.basketService.removePayment(payment);
  //         let basket = this.basketService.getCurrentBasket();
  //         setTimeout(() => {

  //           this.basketService.addOrUpdatePayment(basket.payments, paymentClone1, paymentClone1.paymentTotal);
  //           this.isShowSubmitQRScan = false;
  //           this.resetPaymentInput();
  //           this.selectedRow = null;
  //           this.payment = null;
  //           this.confirmResult = true;
  //           this.waitingAPi = false;
  //           this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
  //           let basketTotal = this.basketService.getTotalBasket();
  //           if(basketTotal.amountLeft === 0)
  //           {
  //             this.addOrder();
  //           }
  //         }, 10);

  //       }
  //       else
  //       {
  //         Swal.fire({
  //           icon: 'warning',
  //           title: 'E-Wallet Payment Method',
  //           text:"Can't get payment " + productCode // paymentResponse
  //         });
  //       }

  //     }
  //     else
  //     {
  //       payment.customF1 = payment.refNum;
  //       payment.customF3 = payment.apiUrl; 
  //       payment.refNum = response.data?.transRef;
  //       payment.customF4 = response.data?.product;
  //       // debugger; 

  //       // var paymentClone = Object.assign({}, payment); 
  //       // paymentClone.id = paymentInsert?.id;
  //       // paymentClone.shortName = paymentInsert?.shortName;
  //       // this.basketService.removePayment(payment);
  //       let basket = this.basketService.getCurrentBasket();
  //       setTimeout(() => {

  //         this.basketService.addOrUpdatePayment(basket.payments, payment, payment.paymentTotal);
  //         this.isShowSubmitQRScan = false;
  //         this.resetPaymentInput();
  //         this.selectedRow = null;
  //         this.payment = null;
  //         this.confirmResult = true;
  //         this.waitingAPi = false;
  //         this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
  //         let basketTotal = this.basketService.getTotalBasket();
  //         if(basketTotal.amountLeft === 0)
  //         {
  //           this.addOrder();
  //         }
  //       }, 10);
  //     }

  //   }
  //   else {
  //     Swal.fire({
  //       icon: 'warning',
  //       title: 'Epay Transaction',
  //       text: response.message
  //     }).then(()=>{
  //         // this.alertify.warning(response.message);
  //         this.waitingAPi = false; 
  //         payment.customF1 = "";
  //         payment.customF3 = "";
  //         payment.refNum = "";
  //         let basket = this.basketService.getCurrentBasket();
  //         this.basketService.addOrUpdatePayment(basket.payments, payment, payment.paymentTotal);
  //         this.basketService.changeDateTime(new Date());
  //         this.refreshQRScan();
  //     });

  //   }
  // }
  public refreshQRScan() {
    this.isQRScan = false;
    setTimeout(x => this.isQRScan = true);
  }
  checkApiApply(payments): boolean {
    if (payments === null || payments === undefined || payments?.length == 0) {
      return true;
    }
    else {
      payments.forEach(payment => {
        switch (payment.apiUrl) {
          case 'Sarawak': {
            //statements; 
            this.waitingAPi = true;
            if (this.MWISarawak !== null && this.MWISarawak !== undefined && this.MWISarawak?.customField1?.length > 0) {
              let MerchantID = this.MWISarawak?.customField2;
              if (MerchantID !== null && MerchantID !== undefined && MerchantID?.length > 0) {
                let checkModel = { merchantId: MerchantID, merOrderNo: payment.refNum, orderNo: payment.customF1 };
                console.log(checkModel)
                this.mwiService.sarawakPayQueryOrders(checkModel).subscribe((responseCheck: any) => {
                  // debugger;  
                  if (responseCheck.success) {
                    // debugger;  
                    if (responseCheck.data !== "1") {
                      this.alertify.success("Payment " + payment.id + " - " + payment.shortName + " completed.");
                      return false;
                    }


                  }
                  else {
                    // debugger;  
                    this.alertify.warning("Payment " + payment.id + " - " + payment.shortName + " not completed.");
                    return false;
                  }
                });
              }
              else {
                Swal.fire({
                  icon: 'warning',
                  title: 'Sarawak Setup',
                  text: "Please check Merchant ID setup."
                });
              }
            }
            else {
              Swal.fire({
                icon: 'warning',
                title: 'Sarawak Setup',
                text: "Please check Sarawak setup."
              });
            }

            break;
          }
          case 'EWallet': {
            //statements; 

            //  this.alertify.warning('Payment ' + payment.shortName + ' building. Please try later.');
            break;
          }
          default: {
            //statements; 
            this.alertify.warning('Please setup api url link for ' + payment.id + " - " + payment.shortName);
            break;
          }
        }
      });

    }

    return true;
  }

  isShowSubmitQRScan = false;
  isShowChangeAmtInPayment = "false";
  bankSelectMode = "Manual";
  checkVoucherWClause = "true";
  enablePaymentPromotion = "false";
  MWIEpay: any;
  MWIGrab: any;
  MWISarawak: any;
  MWICRM: any;
  MWIVoucherCheck: any;

  loadSetting() {
    let isShowChangeAmtInPayment = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'ShowChangeAmtInPayment');
    if (isShowChangeAmtInPayment !== null && isShowChangeAmtInPayment !== undefined) {
      this.isShowChangeAmtInPayment = isShowChangeAmtInPayment.settingValue;
    }
    let ReturnAmountMultiPaymentMethod = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'ReturnAmountMultiPaymentMethod');
    if (ReturnAmountMultiPaymentMethod !== null && ReturnAmountMultiPaymentMethod !== undefined) {
      this.returnAmountMultiPaymentMethod = ReturnAmountMultiPaymentMethod.settingValue;
    }
    let CheckVoucherWClause = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'CheckVoucherWClause');
    if (CheckVoucherWClause !== null && CheckVoucherWClause !== undefined) {

      this.checkVoucherWClause = CheckVoucherWClause.settingValue;
    }
    let EnablePaymentPromotion = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'EnablePaymentPromotion');
    if (EnablePaymentPromotion !== null && EnablePaymentPromotion !== undefined) {

      this.enablePaymentPromotion = EnablePaymentPromotion.settingValue;

    }
    // this.enablePaymentPromotion= "true";
    let PaymentMode = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'PaymentMode');
    if (PaymentMode !== null && PaymentMode !== undefined) {
      this.typeOfPaymentMode = PaymentMode.settingValue;
      if (this.typeOfPaymentMode !== "Normal") {
        if (PaymentMode.customField1 === "Auto") {
          this.bankSelectMode = "Auto";
        }
        else {
          this.bankSelectMode = "Manual";
        }
      }
      else {
        // this.bankSelectMode = "Manual";
        if (PaymentMode.customField1 === "Auto") {
          this.bankSelectMode = "Auto";
        }
        else {
          this.bankSelectMode = "Manual";
        }
      }

    }
    let checkValueNonCash = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'CheckValueNonCash');
    if (checkValueNonCash !== null && checkValueNonCash !== undefined) {
      this.checkValueNonCash = checkValueNonCash.settingValue;
    }
    let MWIEpay = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'MWIEpay');
    // debugger;
    if (MWIEpay !== null && MWIEpay !== undefined) {
      this.MWIEpay = MWIEpay;
    }
    let MWIGrab = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'MWIGrab');
    // debugger;
    if (MWIGrab !== null && MWIGrab !== undefined) {
      this.MWIGrab = MWIGrab;
    }
    let MWISarawak = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'MWISarawak');
    // debugger;
    if (MWISarawak !== null && MWISarawak !== undefined) {
      this.MWISarawak = MWISarawak;
    }
    let MWICRM = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'CRMSystem');

    if (MWICRM !== null && MWICRM !== undefined) {
      this.MWICRM = MWICRM;
    }

    let MWIVoucherCheck = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'SerialCheck');

    if (MWIVoucherCheck !== null && MWIVoucherCheck !== undefined) {
      this.MWIVoucherCheck = MWIVoucherCheck;
    }
  }

  checkItemInList(checkList: string[], itemList: string[], type) {
    let result = false;
    console.log('checkList', checkList);
    console.log('itemList', itemList);
    debugger;
    // let groCheck
    for (let groCheck of checkList) {
      let check = itemList.includes(groCheck);
      if (check === true) {
        result = true;
        break;
      }


    }
    if (result === false) {
      if (type === "MA") {
        this.alertify.warning("MA Type: Can't apply voucher because Item code invalid.");
      }
      else {
        this.alertify.warning("MAGType: Can't apply voucher because Item group invalid.");
      }
    }

    return result;
  }

  checkS4VoucherGap(amountLeft, minPurchase, Gap, CountNum, matgrP_MAT_LIST) {

    let result = true;
    debugger;
    if (this.checkVoucherWClause === 'false') {
      result = true;
    }
    else {
      // if(CountNum < 1)
      // {

      //   if(result === true  && amountLeft < minPurchase)
      //   {
      //     result = false;
      //     this.alertify.warning("Min purchase more then amount left.");
      //   }
      // }
      // if(CountNum >= 1)
      // {
      //   if(result === true && amountLeft < Gap)
      //   {
      //     result = false;
      //     this.alertify.warning("GAP more then amount left.");
      //   }
      // }

      //comptype / compnum
      if (result === true && matgrP_MAT_LIST !== null && matgrP_MAT_LIST !== undefined && matgrP_MAT_LIST?.length > 0) {
        debugger;
        let MAList = matgrP_MAT_LIST.filter(x => x.comptype === 'MA');
        var dataItemMA: string[] = MAList.map(t => t.compnum);


        let MGList = matgrP_MAT_LIST.filter(x => x.comptype === 'MG');
        var dataItemMG: string[] = MGList.map(t => t.compnum);


        let MGLSList = matgrP_MAT_LIST.filter(x => x.comptype === 'MGLS');
        var dataItemMGLS: string[] = MGLSList.map(t => t.compnum);

        let items = this.basketService.getCurrentBasket().items;


        var itemInBasket = items.map(t => t.id);
        var itemGroupInBasket = items.map(t => t.itemGroupId);

        if (dataItemMA !== null && dataItemMA !== undefined && dataItemMA?.length > 0) {
          // const checkItemCodeInList = dataItemMA.some(r=> itemInBasket.includes(r)); 
          // if(!checkItemCodeInList)
          // {
          //   result= false;
          //   this.alertify.warning("Can't apply voucher because. Item code invalid.");
          // }
          if (!this.checkItemInList(dataItemMA, itemInBasket, 'MA')) {
            result = false;
          }
          else {
            let amountinList = 0;
            items.forEach(item => {
              let check = itemInBasket.includes(item.id);
              if (check === true) {
                amountinList += item?.promotionLineTotal ?? item.lineTotal;
              }
            });
            if (CountNum < 1) {

              if (result === true && amountinList < minPurchase) {
                result = false;
                Swal.fire({
                  icon: 'warning',
                  title: 'S4 Voucher',
                  text: "Min purchase more then amount left."
                });
                // this.alertify.warning("Min purchase more then amount left.");
              }
            }
            if (CountNum >= 1) {
              if (result === true && amountinList < Gap) {
                result = false;
                Swal.fire({
                  icon: 'warning',
                  title: 'S4 Voucher',
                  text: "GAP more then amount left."
                });
                // this.alertify.warning("GAP more then amount left.");
              }
            }
          }


        }

        if (dataItemMG !== null && dataItemMG !== undefined && dataItemMG?.length > 0) {

          // const checkItemCodeInGroup = dataItemMG.some(r=> itemGroupInBasket.includes(r));

          if (!this.checkItemInList(dataItemMG, itemGroupInBasket, "MG")) {
            result = false;
            // this.alertify.warning("Can't apply voucher because. Item group invalid.");
          }
          else {
            let amountinList = 0;
            items.forEach(item => {
              let check = itemGroupInBasket.includes(item.itemGroupId);
              if (check === true) {
                amountinList += item?.promotionLineTotal ?? item.lineTotal;
              }
            });
            // if(amountLeft < minPurchase)
            // {
            //   result = false;
            //   this.alertify.warning("Min purchase more then amount left.");
            // }

            if (CountNum < 1) {

              if (result === true && amountinList < minPurchase) {
                result = false;
                Swal.fire({
                  icon: 'warning',
                  title: 'S4 Voucher',
                  text: "Min purchase more then amount left."
                });
                // this.alertify.warning("Min purchase more then amount left.");
              }
            }
            if (CountNum >= 1) {
              if (result === true && amountinList < Gap) {
                result = false;
                Swal.fire({
                  icon: 'warning',
                  title: 'S4 Voucher',
                  text: "GAP more then amount left."
                });
                // this.alertify.warning("GAP more then amount left.");
              }
            }
          }
        }


      }
    }


    // dataItemMA.forEach(MAItem => {
    //   if( items.some(x=> x.id === MAItem))
    //   {
    //     result = true;
    //   }
    // });
    // dataItemMG.forEach(MGItem => {
    //   if( items.some(x=> x.itemGroupId === MGItem))
    //   {
    //     result = true;
    //   }
    // });
    // dataItemMGLS.forEach(MGItem => {
    //   if( items.some(x=> x.itemGroupId === MGItem))
    //   {
    //     result = true;
    //   }
    // });


    // if(result = true && amountLeft < minPurchase)
    // {
    //   result = false;
    //   this.alertify.warning("Min purchase more then amount left.");
    // }

    return result;
  }
  addPayment(isMulti: boolean, payment: MPaymentMethod, isClose?: boolean, isRequire?: boolean, inputNumber?: number) {

    console.log('payment', payment);
    console.log('isClose', isClose);
    console.log('isRequire', isRequire);
    console.log('inputNumber', inputNumber);
    console.log('isMulti', isMulti);

    let companyCode = this.storeSelected.companyCode;
    let itemInBasket = this.basketService.getCurrentBasket().items;
    let paymentInBasket = this.basketService.getCurrentBasket().payments;
    let paymentId = payment.paymentCode;

    let paymetType = payment.paymentType;
    debugger;
    //2023-01-05 Thay đổi cách lấy require cho voucher
    let defaultPayment = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'CRMSystem');
    if (defaultPayment !== null && defaultPayment !== undefined && defaultPayment.customField1 !== undefined && defaultPayment.customField1 !== null) {
      if (payment.paymentCode === defaultPayment.customField1) {
        isRequire = true;
      }
    }

    let paymentApi = payment?.apiUrl;
    debugger;
    let itemReject = itemInBasket.filter(x => x.rejectPayType?.split(',')?.filter(x => x !== null && x !== undefined && x !== '')?.includes(payment?.paymentType));

    if (paymetType === "V" || paymetType === "P") {
      isRequire = true;
    }
    if (itemReject !== null && itemReject !== undefined && itemReject.length > 0 && payment.paymentType !== null && payment.paymentType !== undefined) {
      // this.alertify.warning("Can't add payment " + payment.paymentCode + " " + payment.paymentDesc  + " .b/c item " + itemReject[0].productName + " has rejeted.");
      Swal.fire({
        icon: 'warning',
        title: 'Payment',
        text: "Can't add payment " + payment.paymentCode + " - " + payment.paymentDesc + ". B/c item " + itemReject[0].productName + " has rejeted."
      });


      // xxxx
    }
    else {
      switch (paymetType) {
        case "P": {
          //statements; 
          //  let itemReject = itemInBasket.filter(x => x.rejectPayType === payment.paymentType);
          //  if (itemReject.length > 0 && payment.paymentType !== null && payment.paymentType !== undefined) {
          //    this.alertify.warning("Can't add payment " + payment.paymentCode + " b/c item " + itemReject[0].productName + " has rejeted.");
          //  }
          //  else {

          //  }

          Swal.fire({
            title: 'Submit your card Number',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Look up',
            showLoaderOnConfirm: true,

            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
              let valueCheck = result.value.replace(/\s/g, "");
              if (valueCheck?.length > 0) {
                if (paymentInBasket.some(x => x.id === paymentId && x.refNum === result.value)) {
                  this.alertify.warning("Can't add payment " + payment.paymentCode + " - with ref Number: " + result.value);
                }
                else {
                  this.prepaidCardService.getItem(companyCode, result.value).subscribe((response: any) => {
                    if (response.success) {
                      if (response.data !== null) {
                        let mainBalance = 0;
                        let subBalance = 0;
                        if (response.data.mainBalance !== null && response.data.mainBalance !== undefined && response.data.mainBalance > 0) {
                          mainBalance = response.data.mainBalance;
                        }
                        if (response.data.subBalacnce !== null && response.data.subBalacnce !== undefined && response.data.subBalacnce > 0) {
                          subBalance = response.data.subBalacnce;
                        }
                        if (mainBalance > 0 || subBalance > 0) {
                          let numCollected = 0;
                          if (this.payment !== null) {
                            let paymentX = this.basketService.getCurrentBasket().payments.find(x => x.id === this.payment.id);
                            if (paymentX !== null && paymentX !== undefined) {
                              numCollected = paymentX.paymentTotal;
                            }
                          }
                          if ((this.payment !== null && numCollected == 0) || ((this.payment?.customF2 === 'B' || this.payment?.paymentType === 'B') && (this.payment?.refNum === '' || this.payment?.customF1 === ''))) {
                            // this.alertify.warning("Please Complete progress payment " + this.payment.id + "!");
                            Swal.fire({
                              icon: 'warning',
                              title: 'Payment',
                              text: "Please Complete progress payment " + this.payment.id + "!"
                            });
                          }
                          else {
                            this.amountCharge = "";
                            let amountLeft = this.basketService.getAmountLeft();
                            if (amountLeft <= 0) {
                              this.alertify.warning("Can't add new payment to bill.");
                            }
                            else {
                              // console.log(response);
                              this.payment = new Payment();
                              // let paymentX = new Payment();
                              // .id=
                              this.payment.isRequireRefNum = isRequire;
                              this.payment.id = paymentId;
                              this.payment.shortName = payment.shortName;
                              this.payment.refNum = result.value.toString();
                              this.payment.cardNo = result.value.toString();
                              this.payment.customF4 = payment.terminalIdDefault;
                              this.payment.paymentDiscount = 0;
                              this.payment.paymentTotal = 0;
                              this.payment.apiUrl = payment.apiUrl;
                              if (payment.currency !== null && payment.currency !== undefined && payment.currency !== '') {
                                this.payment.rate = payment.rate;
                                this.payment.fcAmount = payment.fcAmount;
                                this.payment.currency = payment.currency;
                                this.payment.paidAmt = payment.value;
                              }
                              this.payment.mainBalance = response.data.mainBalance === null || response.data.mainBalance === undefined ? 0 : response.data.mainBalance;
                              this.payment.subBalance = response.data.subBalance === null || response.data.subBalance === undefined ? 0 : response.data.subBalance;
                              this.payment.paymentCharged = this.basketService.getAmountLeft();
                              // this.basketTotal$.subscribe(data => {
                              //   console.log(data);
                              //   this.payment.paymentCharged  = data.subtotal - data.totalAmount;
                              // });
                              let linenum = this.basketService.getCurrentBasket().payments.length + 1;
                              this.payment.lineNum = linenum;
                              // debugger;

                              this.basketService.addPaymentToBasket(this.payment);
                              // this.basketService.changePaymentCharge(this.payment);
                              var payments = this.basketService.getCurrentPayment();
                              // console.log(payments);
                              if (payments.length > 0) {
                                // this.selectedRow = this.basketService.getCurrentPayment().length - 1;
                                // this.setClickedRow(this.selectedRow, this.payment, "");
                                for (let i = 0; i < payments.length; i++) {
                                  if (payments[i].id === paymentId && payments[i].lineNum == linenum) {
                                    this.selectedRow = linenum;
                                    this.setClickedRow(this.selectedRow, this.payment, "");

                                  }
                                }
                                // this.setClickedRow(linenum  , this.payment, "");
                              }
                              else {
                                this.selectedRow = 0;
                              }
                              if (isClose) {
                                this.closeOtherPad();
                              }
                              if (isMulti) {
                                this.closePadMultiCurrency(payment);
                              }
                              else {
                                this.closePadOtherPayment(payment);
                              }
                            }

                          }
                        }
                        else {
                          //  this.alertify.warning("Balance not available");
                          Swal.fire({
                            icon: 'warning',
                            title: "Card Data",
                            text: "Balance not available"
                          });
                        }

                      }
                      else {
                        //  this.alertify.warning("Card No not found");
                        Swal.fire({
                          icon: 'warning',
                          title: "Card Data",
                          text: "Card No not found"
                        });
                      }
                    }
                    else {
                      //  this.alertify.warning(response.message);
                      Swal.fire({
                        icon: 'warning',
                        title: "Card Data",
                        text: response.message
                      });
                    }


                  })
                }
              }
              else {
                Swal.fire({
                  icon: 'warning',
                  title: 'Card Number',
                  text: "Please input Card Number"
                });
              }


            }

          })
          break;
        }
        case "V": {
          //statements; 
          Swal.fire({
            title: 'Submit your voucher Number',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Look up',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
              let valueCheck = result.value.replace(/\s/g, "");
              if (valueCheck?.length > 0) {
                if (paymentInBasket.some(x => x.id === paymentId && x.refNum === result.value)) {
                  this.alertify.warning("Can't add payment " + payment.paymentCode + " - with ref Number: " + result.value);
                }
                else {
                  let checkSerrial = false;
                  debugger;
                  let generalSetting = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId);
                  let checkVoucher = generalSetting.find(x => x.settingId === "VoucherCheck");
                  if (checkVoucher === null || checkVoucher === undefined) {
                    checkVoucher = generalSetting.find(x => x.settingId === "SerialCheck");
                  }

                  if (checkVoucher !== null && checkVoucher !== undefined && checkVoucher?.settingValue?.toLowerCase() === "mwi.s4sv") {
                    this.mwiService.S4GetVoucher(valueCheck, this.authService.storeSelected().storeId).subscribe((response: any) => {
                      debugger;
                      if (response.success) {
                        let voucherGet = response.data[0];
                        if (voucherGet !== null && voucherGet !== undefined) {
                          let voucherValue = response.data[0]?.cardvalue;
                          // redeemTransId: string;
                          // redeemDate: Date | string | null; 
                          let allowAdd = true;
                          if (payment.voucherCategory !== null && payment.voucherCategory !== undefined && payment.voucherCategory !== '') {
                            let splitValue = payment.voucherCategory.split(',');
                            if (splitValue !== null && splitValue !== undefined && splitValue?.length > 0) {
                              let checkInclude = splitValue.includes(voucherGet.vouchercategory);
                              if (checkInclude) {
                                allowAdd = true;
                              }
                              else {
                                allowAdd = false;
                                Swal.fire({
                                  icon: 'warning',
                                  title: "Voucher Category",
                                  text: valueCheck + " Voucher valueCheckCategory (" + voucherGet.vouchercategory + ") doesn't matching data with payment (" + payment.voucherCategory + ")"
                                });
                              }
                            }

                          }
                          if (allowAdd) {
                            if (voucherGet?.statuscode !== 'ACTI' && voucherGet?.statuscode !== null && voucherGet?.statuscode !== undefined) {
                              let msg = "";
                              switch (voucherGet?.statuscode) {
                                case 'EXPI': {
                                  //statements; 
                                  msg = "Voucher " + valueCheck + " expired";
                                  break;
                                }
                                case 'BLCK': {
                                  //statements; 
                                  msg = "Voucher " + valueCheck + " blocked";
                                  break;
                                }
                                case 'INAC': {
                                  //statements; 
                                  msg = "Voucher " + valueCheck + " inactive";
                                  break;
                                }
                                case 'REDE': {
                                  //statements; 
                                  msg = "Voucher " + valueCheck + " redeemed";
                                  break;
                                }

                                default: {
                                  //statements; 
                                  msg = "Voucher " + valueCheck + " " + voucherGet.message;
                                  break;
                                }
                              }
                              // this.alertify.warning(msg);
                              Swal.fire({
                                icon: 'warning',
                                title: "Voucher data",
                                text: msg
                              });
                            }
                            else {
                              if (voucherValue !== null && voucherValue !== undefined && parseFloat(voucherValue) > 0) {
                                let numCollected = 0;

                                if (this.payment !== null) {
                                  let paymentX = this.basketService.getCurrentBasket().payments.find(x => x.id === this.payment.id);
                                  if (paymentX !== null && paymentX !== undefined) {
                                    numCollected = paymentX.paymentTotal;
                                  }
                                }
                                if ((this.payment !== null && numCollected == 0) || ((this.payment?.customF2 === 'B' || this.payment?.paymentType === 'B') && (this.payment?.refNum === '' || this.payment?.customF1 === ''))) {
                                  // this.alertify.warning("Please Complete progress payment " + this.payment.id + "!");
                                  Swal.fire({
                                    icon: 'warning',
                                    title: 'Payment',
                                    text: "Please Complete progress payment " + this.payment.id + "!"
                                  });
                                }
                                else {
                                  this.amountCharge = "";
                                  let amountLeft = this.basketService.getAmountLeft();

                                  if (amountLeft <= 0) {
                                    this.alertify.warning("Can't add new payment to bill.");
                                  }
                                  else {
                                    debugger;
                                    console.log('voucher', voucherGet);
                                    let minPurchase = parseFloat(voucherGet?.minpurchase ?? 0);
                                    let maxUsage = parseFloat(voucherGet?.maxusage ?? 0);
                                    let GAPAMOUNT4NEXT = parseFloat(voucherGet?.gapamounT4NEXT ?? 0);
                                    let voucherInBasket = this.basketService.getCurrentBasket().voucherApply;
                                    let matgrP_MAT_LIST = voucherGet.matgrP_MAT_LIST; //Danh sách mapping comptype / compnum

                                    let countVoucher = voucherInBasket.filter(x => x.materialnumber === voucherGet.materialnumber)?.length ?? 0;
                                    if (countVoucher < maxUsage || maxUsage == 0) {
                                      if (this.checkS4VoucherGap(amountLeft, minPurchase, GAPAMOUNT4NEXT, countVoucher, matgrP_MAT_LIST)) {
                                        // console.log(response);
                                        this.payment = new Payment();
                                        // let paymentX = new Payment();
                                        // .id=
                                        this.payment.isRequireRefNum = isRequire;
                                        this.payment.id = paymentId;
                                        this.payment.shortName = payment.shortName;
                                        this.payment.refNum = valueCheck.toString();
                                        this.payment.paymentDiscount = 0;
                                        this.payment.paymentTotal = 0;
                                        this.payment.forfeitCode = payment.forfeitCode;
                                        this.payment.customF2 = payment.paymentType;
                                        this.payment.customF3 = payment.forfeitCode;
                                        this.payment.customF4 = payment.terminalIdDefault;
                                        this.payment.customF5 = voucherGet?.vouchercategory;
                                        this.payment.apiUrl = payment.apiUrl;
                                        if (parseFloat(voucherValue) - this.basketService.getAmountLeft() > 0) {
                                          this.payment.forfeit = parseFloat(voucherValue) - this.basketService.getAmountLeft();
                                        }
                                        this.payment.canEdit = false;
                                        if (payment.currency !== null && payment.currency !== undefined && payment.currency !== '') {
                                          this.payment.rate = payment.rate;
                                          this.payment.fcAmount = payment.fcAmount;
                                          this.payment.currency = payment.currency;
                                          this.payment.paidAmt = payment.value;
                                        }

                                        this.payment.paymentCharged = this.basketService.getAmountLeft();

                                        let linenum = this.basketService.getCurrentBasket().payments.length + 1;
                                        this.payment.lineNum = linenum;
                                        // debugger;
                                        let valueCollected = parseFloat(voucherValue) - this.basketService.getAmountLeft();
                                        if (valueCollected >= 0) {
                                          valueCollected = this.basketService.getAmountLeft();
                                          this.alertify.warning("The transaction cannot settlement");
                                        }
                                        else {
                                          valueCollected = parseFloat(voucherValue)
                                        }
                                        let voucherSet = new TapTapVoucherDetails();
                                        voucherSet = voucherGet;
                                        // voucherSet.materialCode = voucherGet.materialnumber
                                        voucherSet.code = voucherGet.serialnumber;
                                        voucherSet.discount_code = voucherGet.serialnumber;
                                        voucherSet.discount_value = valueCollected.toString();
                                        voucherSet.source = checkVoucher?.settingValue;
                                        voucherSet.voucherType = "Payment";
                                        if (maxUsage !== null && maxUsage !== undefined) {
                                          voucherSet.max_redemption = maxUsage;
                                        }
                                        // voucherSet.
                                        this.basketService.addPaymentToBasket(this.payment, valueCollected, voucherSet);
                                        var payments = this.basketService.getCurrentPayment();
                                        if (payments.length > 0) {

                                          for (let i = 0; i < payments.length; i++) {
                                            if (payments[i].id === paymentId && payments[i].lineNum == linenum) {
                                              this.selectedRow = linenum;
                                              this.setClickedRow(this.selectedRow, this.payment, "");
                                            }
                                          }
                                        }
                                        else {
                                          this.selectedRow = 0;
                                        }
                                        if (isClose) {
                                          this.closeOtherPad();
                                        }
                                        if (isMulti) {
                                          this.closePadMultiCurrency(payment);
                                        }
                                        else {
                                          this.closePadOtherPayment(payment);
                                        }
                                      }
                                    }
                                    else {
                                      //  this.alertify.warning("Max usage.");
                                      Swal.fire({
                                        icon: 'warning',
                                        title: "Voucher data",
                                        text: 'Max usage value'
                                      });
                                    }
                                    // basket.voucherApply

                                    // else
                                    // {

                                    // }


                                  }

                                }
                              }
                              else {
                                // this.alertify.warning("Value of voucher not available");
                                Swal.fire({
                                  icon: 'warning',
                                  title: "Voucher data",
                                  text: 'Value of voucher not available'
                                });
                              }
                            }
                          }
                        }
                        else {
                          Swal.fire({
                            icon: 'warning',
                            title: "Voucher data",
                            text: 'Voucher data is null'
                          });
                        }


                      }
                      else {
                        // this.alertify.warning(response.message);
                        Swal.fire({
                          icon: 'warning',
                          title: "Voucher data",
                          text: response.message
                        });
                      }

                    }, error => {
                      debugger;

                      Swal.fire({
                        icon: 'warning',
                        title: checkVoucher?.settingValue + " - Voucher ",
                        text: error
                      });
                    });

                  }
                  else {
                    let checkAPI = false;
                    if (paymentApi !== null && paymentApi !== undefined && paymentApi?.length > 0 && paymentApi?.toLowerCase() === 'taptap' || paymentApi?.toLowerCase() === 'mwi.taptap' || paymentApi?.toLowerCase() === 'mwi.tera') {
                      checkAPI = true;
                    }
                    if (checkVoucher !== null && checkVoucher !== undefined && checkVoucher?.settingValue?.toLowerCase() === "mwi.taptap" && checkAPI === true) {
                      this.findVoucherDetail(valueCheck, payment);
                    }
                    if (checkVoucher !== null && checkVoucher !== undefined && checkVoucher?.settingValue?.toLowerCase() === "mwi.tera" && checkAPI === true) {
                      this.findTeraVoucherDetail(checkVoucher.customField1, valueCheck, payment);
                    }
                    else {
                      this.voucherService.getByCode(companyCode, '', valueCheck, '').subscribe((response: any) => {
                        if (response.success) {
                          // debugger;
                          if (response.code === 0) {
                            let voucherValue = response.data?.voucherValue;
                            // redeemTransId: string;
                            // redeemDate: Date | string | null; 
                            if (voucherValue.redeemTransId !== null && voucherValue.redeemTransId !== undefined && voucherValue.redeemTransId !== '') {
                              // this.alertify.warning("Voucher has been redeemed");
                              Swal.fire({
                                icon: 'warning',
                                title: "Voucher Data",
                                text: "Voucher has been redeemed"
                              });
                            }
                            else {
                              if (voucherValue !== null && voucherValue !== undefined && parseFloat(voucherValue) > 0) {
                                let numCollected = 0;

                                if (this.payment !== null) {
                                  let paymentX = this.basketService.getCurrentBasket().payments.find(x => x.id === this.payment.id);
                                  if (paymentX !== null && paymentX !== undefined) {
                                    numCollected = paymentX.paymentTotal;
                                  }
                                }
                                if ((this.payment !== null && numCollected == 0) || ((this.payment?.customF2 === 'B' || this.payment?.paymentType === 'B') && (this.payment?.refNum === '' || this.payment?.customF1 === ''))) {
                                  // this.alertify.warning("Please Complete progress payment " + this.payment.id + "!");
                                  Swal.fire({
                                    icon: 'warning',
                                    title: 'Payment',
                                    text: "Please Complete progress payment " + this.payment.id + "!"
                                  });
                                }
                                else {
                                  this.amountCharge = "";
                                  let amountLeft = this.basketService.getAmountLeft();

                                  if (amountLeft <= 0) {
                                    this.alertify.warning("Can't add new payment to bill.");
                                  }
                                  else {

                                    // console.log(response);
                                    this.payment = new Payment();
                                    // let paymentX = new Payment();
                                    // .id=
                                    this.payment.isRequireRefNum = isRequire;
                                    this.payment.id = paymentId;
                                    this.payment.shortName = payment.shortName;
                                    this.payment.refNum = valueCheck.toString();
                                    this.payment.paymentDiscount = 0;
                                    this.payment.paymentTotal = 0;
                                    this.payment.forfeitCode = payment.forfeitCode;
                                    this.payment.customF2 = payment.paymentType;
                                    this.payment.customF3 = payment.forfeitCode;
                                    this.payment.customF4 = payment.terminalIdDefault;
                                    this.payment.apiUrl = payment.apiUrl;
                                    this.payment.canEdit = false;
                                    if (this.payment?.paymentType === null || this.payment?.paymentType === undefined) {
                                      this.payment.paymentType = payment?.paymentType;
                                    }

                                    if (parseFloat(voucherValue) - this.basketService.getAmountLeft() > 0) {
                                      this.payment.forfeit = parseFloat(voucherValue) - this.basketService.getAmountLeft();
                                    }

                                    if (payment.currency !== null && payment.currency !== undefined && payment.currency !== '') {
                                      this.payment.rate = payment.rate;
                                      this.payment.fcAmount = payment.fcAmount;
                                      this.payment.currency = payment.currency;
                                      this.payment.paidAmt = payment.value;
                                    }
                                    let valueCollected = parseFloat(voucherValue) - this.basketService.getAmountLeft();
                                    if (valueCollected >= 0) {
                                      valueCollected = this.basketService.getAmountLeft();
                                      this.alertify.warning("The transaction cannot settlement");
                                    }
                                    else {
                                      valueCollected = parseFloat(voucherValue)
                                    }
                                    this.payment.paymentCharged = this.basketService.getAmountLeft();

                                    let linenum = this.basketService.getCurrentBasket().payments.length + 1;
                                    this.payment.lineNum = linenum;
                                    // debugger;

                                    this.basketService.addPaymentToBasket(this.payment, valueCollected);
                                    var payments = this.basketService.getCurrentPayment();
                                    if (payments.length > 0) {

                                      for (let i = 0; i < payments.length; i++) {
                                        if (payments[i].id === paymentId && payments[i].lineNum == linenum) {
                                          this.selectedRow = linenum;
                                          this.setClickedRow(this.selectedRow, this.payment, "");
                                        }
                                      }
                                    }
                                    else {
                                      this.selectedRow = 0;
                                    }
                                    if (isClose) {
                                      this.closeOtherPad();
                                    }
                                    if (isMulti) {
                                      this.closePadMultiCurrency(payment);
                                    }
                                    else {
                                      this.closePadOtherPayment(payment);
                                    }
                                  }

                                }
                              }
                              else {
                                // this.alertify.warning("Value of voucher not available");
                                Swal.fire({
                                  icon: 'warning',
                                  title: "Voucher data",
                                  text: "Value of voucher not available"
                                });
                              }
                            }


                          }
                          else {
                            // this.alertify.warning(response.message);
                            Swal.fire({
                              icon: 'warning',
                              title: "Voucher data",
                              text: response.message
                            });
                          }
                        }
                        else {
                          // this.alertify.warning(response.message);
                          Swal.fire({
                            icon: 'warning',
                            title: "Voucher data",
                            text: response.message
                          });
                        }
                      })
                    }

                  }

                }

              }
              else {
                Swal.fire({
                  icon: 'warning',
                  title: 'Voucher',
                  text: "Please input voucher value"
                });
              }

              // result.value

            }

          })
          break;
        }
        default: {
          //statements; 
          if (defaultPayment.customField1 !== undefined && defaultPayment.customField1 !== null && payment.paymentCode === defaultPayment.customField1) {
            Swal.fire({
              title: 'Submit your coupon',
              input: 'text',
              inputAttributes: {
                autocapitalize: 'off'
              },
              showCancelButton: true,
              confirmButtonText: 'Search',
              showLoaderOnConfirm: true,
              allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
              if (result.isConfirmed) {
                let valueCheck = result.value.replace(/\s/g, "");
                if (valueCheck?.length > 0) {
                  this.findVoucherDetail(result.value, payment);
                }
                else {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Coupon',
                    text: "Please input coupon value"
                  });
                }

              }
            })

          }
          else {
            if (isRequire) {
              Swal.fire({
                title: 'Submit your value',
                input: 'text',
                inputAttributes: {
                  autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'OK',
                showLoaderOnConfirm: true,
                allowOutsideClick: () => !Swal.isLoading()
              }).then((result) => {
                if (result.isConfirmed) {
                  let valueCheck = result.value.replace(/\s/g, "");
                  if (valueCheck?.length > 0) {
                    this.addPaymentAction(isMulti, payment, isClose, isRequire, result.value);
                  }
                  else {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Input',
                      text: "Please input value"
                    });
                  }

                }
              })
            }
            else {
              this.addPaymentAction(isMulti, payment, isClose, isRequire);
            }


          }
          break;
        }
      }
    }


    // else {
    //   if (isRequire) {
    //     if (paymetType === "P") {




    //     }
    //     else {

    //       else {
    //         if (paymetType === "V") {


    //         }
    //         else {

    //           this.alertify.warning("Please check your payment setting!");

    //         }
    //       }

    //     }


    //   }
    //   else {


    //   }

    // }




    // this.setFocus(this.inputType, this.selectedRow);
  }
  addPaymentAction(isMulti: boolean, payment: MPaymentMethod, isClose?: boolean, isRequire?: boolean, refNum?: string) {
    let numCollected = 0;
    if (this.payment !== null) {
      let paymentX = this.basketService.getCurrentBasket().payments.find(x => x.id === this.payment.id);
      if (paymentX !== null && paymentX !== undefined) {
        numCollected = paymentX.paymentTotal;
      }
    }
    if ((this.payment !== null && numCollected == 0) || ((this.payment?.customF2 === 'B' || this.payment?.paymentType === 'B') && (this.payment?.refNum === '' || this.payment?.customF1 === ''))) {
      // this.alertify.warning("Please Complete progress payment " + this.payment.id + "!");
      Swal.fire({
        icon: 'warning',
        title: 'Payment',
        text: "Please Complete progress payment " + this.payment.id + "!"
      });
    }
    else {
      this.amountCharge = "";
      let amountLeft = this.basketService.getAmountLeft();

      let salesType = this.basketService.getCurrentBasket().salesType;
      let basket = this.basketService.getCurrentBasket();
      // // debugger;
      // &&  salesType.toLowerCase()!=='exchange' && this.storecurrency.length <= 0
      if (amountLeft <= 0 && basket?.negativeOrder === false) {
        this.alertify.warning("Can't add new payment to bill.");

      }
      else {
        if (amountLeft === 0) {
          this.alertify.warning("Can't add new payment to bill. Amount Left is zero");
        }
        else {
          let paymentId = payment.paymentCode;
          let paymetType = payment.paymentType;
          debugger;
          this.payment = new Payment();
          // let paymentX = new Payment();
          // .id=
          this.payment.isRequireRefNum = isRequire;
          this.payment.id = paymentId;
          this.payment.shortName = payment.shortName;
          if (refNum === null || refNum == undefined || refNum === "") {
            refNum = "";
          }
          this.payment.refNum = refNum;
          this.payment.paymentDiscount = 0;
          if (this.returnAmountMultiPaymentMethod === "false") {
            if (basket.negativeOrder) {
              this.payment.paymentTotal = amountLeft;
              this.payment.canEdit = false;
              // this.payment.isRequireRefNum = true;
            }
            else {
              this.payment.paymentTotal = 0;
            }
          }
          else {
            this.payment.paymentTotal = 0;
          }
          if (paymetType !== null && paymetType !== undefined && paymetType === 'B') {
            this.payment.paymentMode = "BankManual";
            this.payment.cardType = payment?.bankPaymentType;
            this.payment.customF5 = payment?.fatherId;
          }
          if (paymetType !== null && paymetType !== undefined && paymetType === 'E' && payment.lines?.length > 0) {
            this.payment.lines = payment.lines;
          }
          this.payment.customF2 = payment.paymentType;
          this.payment.customF3 = payment.forfeitCode;
          this.payment.customF4 = payment.terminalIdDefault;
          this.payment.apiUrl = payment.apiUrl;
          if (payment.currency !== null && payment.currency !== undefined && payment.currency !== '') {
            this.payment.rate = payment.rate;
            this.payment.fcAmount = payment.fcAmount;
            this.payment.currency = payment.currency;
            this.payment.paidAmt = payment.value;

          }
          // // debugger;
          this.payment.paymentCharged = this.basketService.getAmountLeft();
          // this.basketTotal$.subscribe(data => {
          //   console.log(data);
          //   this.payment.paymentCharged  = data.subtotal - data.totalAmount;
          // });

          let linenum = this.basketService.getCurrentBasket().payments.length + 1;
          this.payment.lineNum = linenum;

          this.basketService.addPaymentToBasket(this.payment, this.payment.paymentTotal);
          // this.basketService.changePaymentCharge(this.payment);
          var payments = this.basketService.getCurrentPayment();
          debugger
          if (payments.length > 0) {
            // this.selectedRow = this.basketService.getCurrentPayment().length;
            // this.setClickedRow(this.selectedRow, this.payment, "");
            // for (let i = 0; i < payments.length; i++) {
            //   if (payments[i].id === paymentId && payments[i].lineNum === linenum) {
            //     this.selectedRow = i ; 
            //   }
            // }
            // this.selectedRow =linenum -1;
            // this.setClickedRow(linenum  , this.payment, "");
            for (let i = 0; i < payments.length; i++) {
              if (payments[i].id === paymentId && payments[i].lineNum == linenum) {
                this.selectedRow = linenum;
                let index = payments[i].lineNum - 1;
                this.setClickedRow(index, this.payment, "", true);

                // setTimeout(() => {
                //   this.setFocus('amountInput' , payments[i].lineNum - 1);
                //  }, 50);

              }
            }
          }
          else {
            this.selectedRow = 0;
          }
          if (isClose) {
            this.closeOtherPad();
          }

          // debugger;
          if (isMulti) {

            this.closePadMultiCurrency(payment);
          }
          else {
            this.closePadOtherPayment(payment);
          }
        }


      }

    }
  }
  usePoint(customer: MCustomer) {
    debugger;
    let payments = this.basketService.getCurrentPayment();
    let paymentNoneCash = payments.filter(x => x.customF2 !== 'C');

    let AmountLeft = this.basketService.getAmountLeft();
    let basket = this.basketService.getCurrentBasket();
    if (basket?.negativeOrder === true || basket?.salesType?.toLowerCase() === 'return') {
      Swal.fire({
        icon: 'warning',
        title: 'Point',
        text: "Can't use point with Negative Order"
      });
    }
    else {
      // if(AmountLeft <= 0 && paymentNoneCash?.length > 0)
      // {
      //   this.alertify.warning("Can't add point because Collected amount more than total amount");
      // }
      // else
      // {
      Swal.fire({
        title: 'Submit points',
        input: 'number',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,

        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {

          let customerPoint = customer.rewardPoints;
          if (result.value > customerPoint) {
            this.alertify.warning("Unavailable customer reward points");
          }
          else {
            if (customerPoint !== null && customerPoint !== undefined && customerPoint > 0) {
              let inputValue = result.value;
              this.crmService.RedeemPoint(this.storeSelected.companyCode, this.storeSelected.storeId, inputValue).subscribe((response: any) => {
                if (response.success) {
                  debugger;
                  inputValue = response.data;
                  if (inputValue !== 0) {
                    let payment = payments.find(x => x.id === 'Point');

                    if (payment !== null && payment !== undefined) {
                      debugger;
                      payment.refNum = parseFloat(result.value).toString();
                      let valueAdd = parseFloat(inputValue) * 1;
                      this.basketService.addOrUpdatePayment(payments, payment, valueAdd, true);
                      this.basketService.calculateBasket();
                      // this.selectedRow = 0;
                      this.selectedRow = null;
                      this.payment = null;
                      // }
                      // this.payment.paymentCharged = this.basketService.getAmountLeft();
                      // this.changeValuePayment(valueAdd, payment.lineNum -1, this.payment, '');

                    }
                    else {

                      this.payment = new Payment();

                      this.payment.isRequireRefNum = false;
                      this.payment.id = "Point";
                      this.payment.shortName = "Point";
                      this.payment.refNum = result.value;
                      this.payment.paymentDiscount = 0;
                      this.payment.paymentTotal = 0;

                      let selectedRow = this.basketService.getCurrentPayment().length + 1;
                      this.payment.lineNum = selectedRow;
                      this.basketService.addPaymentToBasket(this.payment, parseFloat(inputValue) * 1, null, true);
                      payments = this.basketService.getCurrentPayment();
                      // this.selectedRow = 0;
                      this.selectedRow = null;
                      this.payment = null;
                      // debugger
                      // if (payments.length > 0) {
                      //   // this.selectedRow = this.basketService.getCurrentPayment().length;
                      //   // this.setClickedRow(this.selectedRow, this.payment, "");
                      //   // for (let i = 0; i < payments.length; i++) {
                      //   //   if (payments[i].id === this.payment.id) {
                      //   //     this.selectedRow = i;

                      //   //   }
                      //   // }
                      //   this.setClickedRow(this.payment.lineNum, this.payment, "");
                      // }
                      // else {
                      //   this.selectedRow = 0;
                      // }
                    }

                  }
                  else {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Point convert',
                      text: 'Value convert is 0'
                    });
                  }


                }
                else {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Point',
                    text: response.message
                  });
                }

              })


            }
            else {
              this.alertify.warning("Unavailable customer reward points");
            }
          }


          // result.value

        }

      });

      // }
    }






  }
  addPaymentToBasket(payment: Payment, amountCharge) {
    if (this.payment !== null && this.payment !== undefined) {
      let roundingOff = 0;
      let amountChargeNumber = parseFloat(amountCharge);
      let bfRound = this.payment.paymentCharged / (this.payment.rate ?? 1);
      roundingOff = bfRound - amountChargeNumber;
      let roundingCurrency: SCurrencyRoundingOff;
      if (this.roudingOffList !== null && this.roudingOffList !== undefined && this.roudingOffList?.length > 0) {
        roundingCurrency = this.roudingOffList.filter(x => x.currencyCode === this.payment.currency)[0];
      }
      if (roundingCurrency !== null && roundingCurrency !== undefined && roundingCurrency.roundingOff >= Math.abs(roundingOff)) {
        payment.roundingOff = roundingOff * this.payment.rate ?? 1;
        payment.fcRoundingOff = roundingOff ?? 0;
      }
      else {
        payment.roundingOff = 0;
        payment.fcRoundingOff = 0;
      }
      // if(payment?.allowChange!== null && payment?.allowChange!== undefined && payment?.allowChange===true)
      // {
      //   if(amountChargeNumber > payment.paymentTotal)
      //   {
      //     Swal.fire('Payment',"Can't add collected amount more than chargable amount",'warning');
      //   }
      // }
      this.basketService.addPaymentToBasket(payment, amountCharge);
      this.numSave = amountCharge;
      this.changeValuePayment(amountCharge, payment.lineNum, payment, this.inputType);
      // this.setClickedRow(payment.lineNum-1, payment, '');
      debugger;
      // this.setFocus(this.inputType, payment.lineNum - 1);


    }

  }
  checkDecimalLength(num) {
    let result = true;
    let numberSplit = num.split('.');
    if (numberSplit[1] !== null && numberSplit[1] !== undefined && numberSplit[1] !== '') {
      let numOfDecimal = parseInt(this.authService.loadFormat().decimalPlacesFormat);
      if (numberSplit[1].length > numOfDecimal && numOfDecimal > 0) {
        result = false;
      }
    }
    if (result) {
      var numericNumberReg = '^-?[0-9]\\d*(\\.\\d{1,6})?$';
      result = num.match(numericNumberReg);
    }
    return result;
  }
  checkNumber(num): boolean {
    let result = true;
    debugger;
    var numericNumberReg = '^-?[0-9]\\d*(\\.\\d{1,6})?$';
    result = num.match(numericNumberReg);
    return result;
  }
  isNumeric(val: any): boolean {
    return !(val instanceof Array) && (val - parseFloat(val) + 1) >= 0;
  }
  checkValueNonCash = "false";
  numSave = 0;
  blurNum(num: string) {
    debugger;
    let decimalPlacesFormat = parseFloat(this.authService.loadFormat().decimalPlacesFormat) ?? 0;
    var lastChar = num.substr(num.length - 1);
    var last2Char = num.substr(num.length - decimalPlacesFormat);
    if (lastChar === '.' || last2Char === '.0') {
      if (lastChar === '.') {
        num = num.substr(0, num.length - 1);
      }
      if (last2Char === '.0') {
        num = num.substr(0, num.length - decimalPlacesFormat);
      }
      this.inputNum(num, false);
    }
  }
  inputNum(num: string, isDemo) {
    // debugger;
    if (num !== null && num !== undefined && num !== 'NaN') {
      // console.log("clearAmount");

      // var matchOnlyNumberRe = new RegExp(numericNumberReg);
      // matchOnlyNumberRe.test(num)
      // debugger;
      if (num !== null && num !== undefined && num !== "") {
        num = num;
        num = num.toString().split(',').join('');
      }
      else {
        num = "0";
      }
      let decimalPlacesFormat = parseFloat(this.authService.loadFormat().decimalPlacesFormat) ?? 0;
      var lastChar = num.substr(num.length - 1);
      var last2Char = num.substr(num.length - decimalPlacesFormat);
      if (lastChar === '.' || last2Char === '.0') {

      }
      else {
        // let checkNumber = this.checkNumber(num);

        let checkNumber = this.isNumeric(num);
        // console.log('checkNumber', checkNumber);
        // console.log('checkNumberX', checkNumberX);
        // console.log('num', num);

        if (checkNumber) {

          if (this.checkDecimalLength(num)) {
            let changeAmt = 0;
            let amountLeft = this.basketService.getAmountLeft();
            let total = this.basketService.getTotalBasket();
            this.basketTotal$.subscribe((data: any) => {

              changeAmt = data.changeAmount;
            })

            if (!this.isFastClick) {
              this.amountCharge = "";
            }
            if (this.amountCharge === null || this.amountCharge === undefined) {
              this.amountCharge = "";
            }
            this.isFastClick = true;
            if (this.maxvalue === "null" || this.maxvalue === "undefined") {
              this.maxvalue = null;
            }

            let checkAmt = parseFloat(num);
            // debugger;

            if ((this.payment.customF2 !== 'C' && this.payment.customF2 !== 'V' && checkAmt > (this.authService.roundingAmount(this.payment?.paymentCharged) ?? 0)) && this.checkValueNonCash === "true") {
              debugger
              this.alertify.warning("can't add value more than amount left with payment method " + this.payment.shortName);
              if (this.amountCharge === undefined || this.amountCharge === null || this.amountCharge === '') {
                this.amountCharge = "0";
              }
              this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
            }
            else {

              let basket = this.basketService.getCurrentBasket();
              let canAddNumber = true;
              if (basket.negativeOrder || basket.salesType.toLowerCase() === "return") {
                let checkNm = amountLeft + parseFloat(this.amountCharge);
                if (checkAmt > checkNm) {
                  canAddNumber = false;
                }
              }
              console.log('canAddNumber', canAddNumber);


              if (canAddNumber) {
                if (this.maxvalue !== null || this.maxvalue !== undefined) {
                  debugger;


                  if ((num > this.amountCharge && (checkAmt - total.total) > parseFloat(this.maxvalue))) {

                    this.alertify.warning("can't add num ");
                    this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
                  }
                  else {
                    let value = 0;
                    let checkIsDeno = true;
                    if (isDemo === true) {
                      let currentX = this.amountCharge === "" ? 0 : parseFloat(this.amountCharge);
                      let numX = num === "" ? 0 : parseFloat(num);

                      value = currentX + numX;
                      if ((this.payment.customF2 !== 'C' && this.payment.customF2 !== 'V' && value > (this.payment?.paymentCharged ?? 0)) && this.checkValueNonCash === "true") {
                        checkIsDeno = false;
                      }
                    }
                    else {
                      let valuetmp = num === "" ? "0" : num;
                      value = parseFloat(valuetmp);
                    }
                    if (checkIsDeno) {
                      this.amountCharge = value.toString();

                      if (this.payment?.paymentType?.toLowerCase() === 'p') {
                        let numBalance = this.payment.mainBalance ?? 0 + this.payment.subBalance ?? 0;
                        if (parseFloat(this.amountCharge) > numBalance) {
                          this.alertify.warning("can't add num");
                          this.amountCharge = this.amountCharge.substr(0, this.amountCharge.length - 1);

                          this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
                        }
                        else {
                          this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
                        }
                      }
                      else {
                        this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
                      }
                    }
                    else {
                      debugger
                      this.alertify.warning("can't add value more than amount left with payment method " + this.payment.shortName);
                      this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
                    }

                  }
                }
                else {
                  let currentX = this.amountCharge === "" ? 0 : parseFloat(this.amountCharge);
                  let numX = num === "" ? 0 : parseFloat(num);
                  let value = currentX + numX;
                  this.amountCharge = value.toString();
                  if (this.payment?.paymentType?.toLowerCase() === 'p') {
                    let numBalance = this.payment.mainBalance ?? 0 + this.payment.subBalance ?? 0;
                    if (parseFloat(this.amountCharge) > numBalance) {
                      this.alertify.warning("can't add num");
                      this.amountCharge = this.amountCharge.substr(0, this.amountCharge.length - 1);
                      this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
                    }
                    else {
                      this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
                    }
                  }
                  else {
                    this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
                  }

                }
              }
              else {
                debugger;
                if (this.numSave !== checkAmt) {
                  this.alertify.warning("can't add value more than due amount");
                  this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
                }


              }


            }


          }
          else {

            this.alertify.error("Wrong format")

            setTimeout(() => {

              this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
            })

          }
        }
        else {
          console.log(num + ' Wrong format, Not alphabet');
          this.alertify.error("Wrong format, Not alphabet");

          this.amountCharge = num.substr(0, num.length - 1);
          this.amountCharge = this.amountCharge + '1';

          this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
          setTimeout(() => {

            this.amountCharge = this.amountCharge.substr(0, this.amountCharge.length - 1);
            this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
          })

        }




      }
    }


  }

  isFastClick: boolean = false;
  pressKey(key: string) {
    // // debugger;
    // console.log("pressKey");
    let billTotal = 0;
    this.basketTotal$.subscribe((data: any) => {
      // console.log(data);
      billTotal = data.billTotal;
    })
    if (this.inputType === "refNum" || this.inputType === "customF1") {
      if (this.inputType === "refNum") {
        this.payment.refNum += key;
        let basket = this.basketService.getCurrentBasket();
        this.basketService.setBasket(basket);
      }
      if (this.inputType === "customF1") {
        this.payment.customF1 += key;
        let basket = this.basketService.getCurrentBasket();
        this.basketService.setBasket(basket);
      }

    }
    else {

      if (this.isFastClick) {
        this.amountCharge = "";
      }
      if (this.amountCharge === null || this.amountCharge === undefined) {
        this.amountCharge = "";
      }
      this.isFastClick = false;
      // debugger;
      let amountLeft = this.basketService.getAmountLeft();
      let basket = this.basketService.getCurrentBasket();
      // if(amountLeft=== null || amountLeft===undefined)
      // {
      //   amountLeft=0;
      // }
      // var lastChar = num.substr(num.length - 1); 
      // var last2Char = num.substr(num.length - decimalPlacesFormat); 
      // if(lastChar === '.' || last2Char === '.0')
      // {
      //   key += '.';
      //   this.amountCharge += ".";
      // }
      // else
      // {
      //   if(this.checkNumber(num))
      //   {
      //     if( this.checkDecimalLength(num))
      //     {
      //     }
      //   }
      // }
      // var last2Char = num.substr(num.length - decimalPlacesFormat); 
      debugger;
      let lastChar = '';
      let decimalPlacesFormat = parseFloat(this.authService.loadFormat().decimalPlacesFormat) ?? 0;
      if (this.amountCharge !== null && this.amountCharge !== undefined && this.amountCharge?.length > 0) {
        lastChar = this.amountCharge.substr(this.amountCharge.length - 1);
      }
      if (key === '.' || (key === '0' && lastChar === '.')) {

        if (lastChar === '.' && key === '0') {
          key += '0';
          this.amountCharge += "0";
        }
        else {
          key += '.';
          this.amountCharge += ".";
          this.amountCharge = this.amountCharge.replace('..', '.');
        }
      }
      else {
        let roundingOff = 0;
        let total = this.basketService.getTotalBasket();
        // if(this.maxvalue === "null" || this.maxvalue === "undefined" )
        // {
        //   this.maxvalue = 0;
        // }
        debugger;
        let checkAmt = this.amountCharge + key;
        // Bổ sung thêm Voucher
        if ((this.payment.customF2 !== 'C' && this.payment.customF2 !== 'V' && parseFloat(checkAmt) > (this.authService.roundingAmount(this.payment?.paymentCharged) ?? 0) && this.checkValueNonCash === "true")) {
          debugger;
          this.alertify.warning("can't add value more than amount left with payment method " + this.payment.shortName);
        }
        else {
          let passFlag = false;
          let canAddNumber = true;
          if (basket.negativeOrder || basket.salesType.toLowerCase() === "return") {

            let checkNm = amountLeft + parseFloat(this.amountCharge);
            if (parseFloat(checkAmt) > checkNm) {
              canAddNumber = false;
            }
          }
          if (key === "000000") {
            passFlag = true;
          }
          if (this.checkDecimalLength(checkAmt) || passFlag) {
            if (canAddNumber) {
              if (this.maxvalue !== null && this.maxvalue !== undefined && this.maxvalue !== "undefined" && this.maxvalue !== "null") {
                // debugger;

                if (parseFloat(checkAmt) - billTotal > parseFloat(this.maxvalue) || amountLeft <= 0) {

                  this.alertify.warning("can't add num ");

                }
                else {
                  if (key === "000000") {

                    if (this.storecurrency !== null && this.storecurrency !== undefined && this.storecurrency.length > 0) {
                      let type = this.storecurrency.find(x => x.currency === this.payment.currency);

                      this.amountCharge = this.authService.roundingAmount((this.authService.roundingValue(this.payment.paymentCharged / (this.payment.rate ?? 1), type?.roundingMethod))).toString();

                    }
                    else {
                      //20220421 Rouding value change
                      // this.amountCharge =  this.payment.paymentCharged.toString();
                      this.amountCharge = this.authService.roundingAmount(this.payment.paymentCharged).toString();
                    }
                  }
                  else {
                    this.amountCharge += key;
                  }

                  // debugger;
                  if (this.payment.paymentType === 'P') {
                    let balance = parseFloat(this.payment.mainBalance.toString()) + parseFloat(this.payment.subBalance.toString());
                    if (parseFloat(this.amountCharge) > balance) {
                      if (balance > 0 && balance < parseFloat(this.amountCharge)) {
                        // this.basketService.addPaymentToBasket(this.payment, balance);
                        this.addPaymentToBasket(this.payment, balance)
                      }
                      else {
                        this.alertify.warning("Unavailable balance");
                      }
                    }
                    else {
                      // this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
                      this.addPaymentToBasket(this.payment, Math.abs(parseFloat(this.amountCharge)))
                    }
                  }
                  else {
                    // if(this.payment.id==='Point')
                    // {
                    //   // debugger;
                    //   let z = parseFloat(this.amountCharge)  * 1000 ;
                    //   this.basketService.addPaymentToBasket(this.payment, z);
                    // }
                    // else
                    // {
                    // this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
                    this.addPaymentToBasket(this.payment, Math.abs(parseFloat(this.amountCharge)))
                    // }

                  }
                }
              }
              else {

                // debugger;
                if (key === "000000") {
                  // this.amountCharge = this.payment.paymentCharged.toString();
                  if (this.storecurrency !== null && this.storecurrency !== undefined && this.storecurrency.length > 0) {
                    // let type = this.storecurrency.find(x=>x.currency=== this.payment.currency);
                    // this.amountCharge = this.authService.roundingAmount((this.authService.roundingValue(this.payment.paymentCharged / (this.payment.rate ?? 1), type?.roundingMethod) )).toString();
                    let type = this.storecurrency.find(x => x.currency === this.payment.currency);
                    let amountCharge = this.authService.roundingAmount((this.authService.roundingValue(this.payment.paymentCharged / (this.payment.rate ?? 1), type?.roundingMethod)));
                    this.amountCharge = amountCharge.toString();

                  }
                  else {
                    this.amountCharge = this.authService.roundingAmount(this.payment.paymentCharged).toString();
                  }
                }
                else {

                  this.amountCharge += key;
                }

                this.addPaymentToBasket(this.payment, Math.abs(parseFloat(this.amountCharge)))
              }
            }
            else {
              this.alertify.warning("can't add value more than due amount");
            }
          }
          else {

            this.alertify.error("Wrong format")

            setTimeout(() => {

              this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
            })

          }


        }

      }

    }

  }

  submitPayment() {
    // console.log("submitPayment");
    // this.basketService.changePaymentCharge(this.payment); 
    this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
    this.amountCharge = "";
  }
  checkPaymetInput(basket: IBasket) {

    let payments = basket.payments;
    if (payments !== null && payments !== undefined && payments?.length > 0) {
      let checkBPayment = payments.filter(x => (x.customF2 === 'B' || x.paymentType === 'B') && (x?.refNum === '' || x?.customF1 === ''));
      if (checkBPayment !== null && checkBPayment !== undefined && checkBPayment?.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Payment',
          text: "Please Complete progress payment " + this.payment.id + "!"
        });
        // this.alertify.warning("Please Complete progress payment " + this.payment.id + "!");
        return false;
      }
      let checkPaymentValue0 = payments.filter(x => x.paymentTotal === null || x.paymentTotal === undefined || x.paymentTotal === 0);
      if (checkPaymentValue0 !== null && checkPaymentValue0 !== undefined && checkPaymentValue0?.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Payment',
          text: "Please complete progress or remove payment zero value!"
        });
        // this.alertify.warning("Please Complete progress payment " + this.payment.id + "!");
        return false;
      }
    }
    else {
      if (basket?.contractNo === null || basket?.contractNo === undefined || basket?.contractNo?.length < 0) {
        let amountLeft = this.basketService.getAmountLeft() ?? 0;
        amountLeft = this.authService.roundingAmount(amountLeft);
        if (amountLeft !== 0) {
          Swal.fire({
            title: 'Due amount',
            text: 'Due amount ' + amountLeft,
            icon: 'info',
            confirmButtonText: 'Ok',
          })
          return false;
        }
      }

    }
    return true;

  }
  // checkPayment(payments)
  // {
  //   let patmentCheck = payments.filter(x=> (x.paymentType==='B' || x.customF2==='B') && (x?.refNum==='' || x?.customF1===''));
  //   if (patmentCheck!==null && patmentCheck!==undefined && patmentCheck?.length > 0) {
  //     // this.alertify.warning("Please Complete progress payment!");
  //     Swal.fire({
  //       icon: 'warning',
  //       title: 'Payment',
  //       text: "Please Complete progress payment!"
  //     });
  //     return false;
  //   }
  //   else  
  //   {
  //     return true;
  //   }
  // }
  async addOrder() {
    let payments = this.basketService.getCurrentPayment();
    if (payments[0].paymentTotal < payments[0].paymentCharged) {
      debugger;
      this.alertify.warning("Payment is missing");     
    }
    else{
      if (this.basketService.checkPayment(payments)) {
        if (this.isShowSubmitQRScan) {  
          if (this.payment.paymentTotal > 0) {
            setTimeout(() => {  
              this.commonService.changeShortcuts(null, true);  
            }, 100);
            this.isQRScan = true;
            this.isShowPayment = false;
            this.paymentTmp = this.payment;
          }
          else {
            Swal.fire({
              icon: 'warning',
              title: 'Payment value',
              text: "Please Complete progress payment or remove payment"
            });
          }
          // this.paymentTmp. = this.payment.paymentTotal;
        }
        else {
          let paymentsAPI = this.basketService.getCurrentPayment().filter(x => x.apiUrl?.length > 0);
          if (await this.checkApiApply(paymentsAPI)) {
            debugger;  
            let changeAmount: number;
            this.basketTotal$.subscribe((data) => {
              changeAmount = data.changeAmount;
            });
            let basket = this.basketService.getCurrentBasket();
            if (this.checkPaymetInput(basket)) {
              basket = this.basketService.getCurrentBasket();
              let mode = basket.salesType;
              debugger;
              if (mode === 'Return') {
                if (changeAmount !== null && changeAmount !== undefined && changeAmount > 0) {
  
                  Swal.fire({
                    title: 'The amount to change is ' + changeAmount,
                    // text: 'Do you want to clear this bill',
                    icon: 'info',
                    // showCancelButton: true,
                    confirmButtonText: 'Confirm',
                    // cancelButtonText: 'No'
                  }).then((result) => {
                    if (result.value) {
                      this.Modal.emit(true);
                    }
                  });
                }
                else {
                  this.Modal.emit(true);
                }
              }
              else {
                this.Modal.emit(true);
                // let amountLeft = this.basketService.getAmountLeft() ?? 0;
                // amountLeft = this.authService.roundingAmount(amountLeft);
                // if(amountLeft > 1)
                //   {
                //     let basket = this.basketService.getCurrentBasket();
  
                //     if(basket.negativeOrder)
                //     {
                //       amountLeft = -amountLeft;
                //     }
                //     Swal.fire({
                //       title: 'Due amount',
                //       text: 'Due amount ' + amountLeft,
                //       icon: 'info', 
                //       confirmButtonText: 'Ok', 
                //     })
                //   }
                //   else
                //   {
  
                //   }
                // if (mode?.toLowerCase() === 'ex' || mode?.toLowerCase() === 'exchange')
                // {
  
  
                // }
                // else
                // {
                //   this.Modal.emit(true);
                // }
  
  
              }
            }
            else {
  
              // this.basketService.changeIsCreateOrder(false);
              this.basketService.changeBasketResponseStatus(true);
            }
            // if(this.authService.roundingAmount(amountLeft)  > 0 && this.storecurrency!==null && this.storecurrency!==undefined && this.storecurrency.length > 0)
            // { 
            //   this.nextToChangeAmount();
            // }
            // else
            // {
  
            // }
  
  
            // this.basketService.addOrder("O");
          }
          // else
          // {
          //   else
          //   {
  
          //     this.basketService.changeIsCreateOrder(false);
          //     this.basketService.changeBasketResponseStatus(true);
          //   }
          // }
        }
  
      }
    }       
  }
}
