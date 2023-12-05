import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { SBarcodeSetup } from 'src/app/_models/barcodesetup';
import { MDenomination } from 'src/app/_models/denomination';
import { Item } from 'src/app/_models/item';
import { Payment } from 'src/app/_models/payment';
import { MPaymentMethod } from 'src/app/_models/paymentmethod';
import { MReason } from 'src/app/_models/reason';
import { MStore } from 'src/app/_models/store';
import { SStoreClient } from 'src/app/_models/storeclient';
import { IBasketItem } from 'src/app/_models/system/basket';
import { TSalesLine, TSalesLineSerial } from 'src/app/_models/tsaleline';
import { TSalesPayment } from 'src/app/_models/tsalepayment';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { StorePaymentViewModel } from 'src/app/_models/viewmodel/storepayment';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { BarcodesetupService } from 'src/app/_services/data/barcodesetup.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { PaymentmethodService } from 'src/app/_services/data/paymentmethod.service';
import { PrepaidcardService } from 'src/app/_services/data/prepaidcard.service';
import { ReasonService } from 'src/app/_services/data/reason.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { StorePaymentService } from 'src/app/_services/data/store-payment.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { PermissionService } from 'src/app/_services/system/permission.service';
import { VoidreturnsettingService } from 'src/app/_services/system/voidreturnsetting.service';
import { VoucherService } from 'src/app/_services/transaction/voucher.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ShopApprovalInputComponent } from '../tools/shop-approval-input/shop-approval-input.component';
import { ShopReasonInputComponent } from '../tools/shop-reason-input/shop-reason-input.component';

@Component({
  selector: 'app-shop-bill-detail',
  templateUrl: './shop-bill-detail.component.html',
  styleUrls: ['./shop-bill-detail.component.scss']
})
export class ShopBillDetailComponent implements OnInit {
  modalRef: BsModalRef;
  showModal: boolean = false;

  discountModalShow: boolean = false;
  order: Order;
  modelRejectBillHRV= new RejectBillHRV();
  isPrint = true;
  // tslint:disable-next-line: max-line-length
  constructor(private alertify: AlertifyService,private barcodeService: BarcodesetupService , private voidSettingService: VoidreturnsettingService, private routeNav: Router, private commonService: CommonService, private shiftService: ShiftService, private itemService: ItemService, private voucherService: VoucherService, private prepaidCardService: PrepaidcardService,
    private billService: BillService, private basketService: BasketService, public authService: AuthService, private storePaymentService: StorePaymentService,
    private route: ActivatedRoute, private modalService: BsModalService, private router: Router, private reasonService: ReasonService,private controlService: ControlService,
    private permissionService: PermissionService, private mwiService: MwiService, private alertifyService: AlertifyService,public datePipe: DatePipe) {
    this.customizeText = this.customizeText.bind(this);
    this.setBarcodeCellValue = this.setBarcodeCellValue.bind(this);
  }



  //Làm phần payment sẽ gom lại component sau
  private paymentTotal = new BehaviorSubject<BasketPayment>(null);
  paymentTotal$ = this.paymentTotal.asObservable();
  calculateTotalFirst() {
    debugger;
    let totalAmount = this.order.lines.reduce((a, b) => (b?.quantity * b?.price) + a, 0);
    let totalCollected = this.order.payments.reduce((a, b) => b.collectedAmount + a, 0);
    this.orderTotalAmt = totalAmount;
    this.orderTotalCollected = totalCollected;
    // this.orderchargableAmt = totalAmount- totalCollected;
    if (totalAmount - this.order.payments.reduce((a, b) => b.collectedAmount + a, 0) > 0) {
      this.orderchangeAmt = 0;
      this.orderLeftAmt = totalAmount - this.order.payments.reduce((a, b) => b.collectedAmount + a, 0);
    }
    else {
      this.orderchangeAmt = - (totalAmount - this.order.payments.reduce((a, b) => b.collectedAmount + a, 0));
      this.orderLeftAmt = 0;
    }
    // this.orderLeftAmt=0;
    this.orderchargableAmt = this.orderLeftAmt;

    let discountAmount = this.order.totalDiscountAmt;
    let chargableAmount = this.orderchargableAmt - discountAmount;
    let changeAmount = 0;
    let leftAmount = chargableAmount;
    if (leftAmount > 0) {
      this.isPayment = true;
    }
    this.orderchargableAmt = leftAmount;
    this.paymentTotal.next({ totalAmount, totalCollected, changeAmount, leftAmount, chargableAmount, discountAmount });
  }

  setBarcodeCellValue(newData, value, currentRowData) {
    debugger;
    if (value !== null && value !== undefined && value !== '') {
      if (currentRowData.pricelistId === null || currentRowData.pricelistId === undefined || currentRowData.pricelistId === '') {
        currentRowData.pricelistId = '';
      }
      let line = parseInt(currentRowData.lineId) - 1;
      this.itemService.GetItemInforList(this.authService.getCurrentInfor().companyCode, this.order.storeId, '', '', value, '', '', '', currentRowData.pricelistId).subscribe((response: any) => {
        debugger;
        if (response.success) {
          debugger;

          if (response.data !== null && response.data !== undefined && response.data?.length > 0) {
            debugger;
            let item = response.data[0];//.filter(x=>x.pricelistId === rowData.pricelistId);
            if (item !== null && item !== undefined) {
              newData.barCode = value;
              newData.uomCode = item.uomCode;

              this.dataGrid.instance.cellValue(line, 'barCode', value);
              this.dataGrid.instance.cellValue(line, 'uomCode', item.uomCode);

            }
            else {
              newData.barCode = '';
              newData.uomCode = '';
              this.dataGrid.instance.cellValue(line, 'barCode', '');
              this.dataGrid.instance.cellValue(line, 'uomCode', '');

            }
            // let item  = response.data[0] as ItemViewModel; 
          }
          else {
            debugger;
            newData.barCode = '';
            newData.uomCode = '';
            this.dataGrid.instance.cellValue(line, 'barCode', '');
            this.dataGrid.instance.cellValue(line, 'uomCode', '');
          }

        }
        else {
          debugger;
          newData.barCode = '';
          newData.uomCode = '';
          this.dataGrid.instance.cellValue(line, 'barCode', '');
          this.dataGrid.instance.cellValue(line, 'uomCode', '');
          this.alertify.warning(response.message);
        }
      })
    }


    // rowData.Full_Name = value;
  }

  setQtyValue(newData, value, currentRowData) {
    debugger;
    if (value !== null && value !== undefined && value !== '') {
      newData.quantity = value;
      newData.lineTotal = value * currentRowData.price;
    }


    // rowData.Full_Name = value;
  }
  isPayment = false;
  orderTotalAmt = 0;
  orderTotalCollected = 0;
  orderLeftAmt = 0;
  orderchangeAmt = 0;
  orderchargableAmt = 0;

  payment: TSalesPayment;
  selectedRow: number;
  enableEdit = false;
  enableEditIndex = null;
  amountCharge: string = "";

  inputType: string = "";
  refInput: string = "";
  paymentMethodShowList: StorePaymentViewModel[] = [];
  paymentMethodOtherList: StorePaymentViewModel[] = [];

  //  setClickedRow(index, payment: TSalesPayment) {
  //   debugger;
  //   this.amountCharge ="";
  //   this.selectedRow = index;

  //   this.payment = payment;
  //   // this.basketService.changePaymentCharge(this.payment); 
  //   // this.payment = payment;
  //   // this.basketService.changePaymentCharge(this.payment); 

  // }
  setClickedRow(index, payment: TSalesPayment, inputType) {
    console.log("setClickedRow");
    this.amountCharge = payment.collectedAmount.toString().split(',').join('');
    this.refInput = payment.refNumber;
    this.selectedRow = index;
    this.inputType = inputType;
    this.payment = payment;
    // this.isFastClick = true;
    this.payment.chargableAmount = parseFloat(this.payment.chargableAmount.toString().split(',').join(''));
    // this.payment.paymentDiscount = parseFloat(this.payment.paymentDiscount.toString().replace(',', ''));
    this.payment.totalAmt = parseFloat(this.payment.totalAmt.toString().split(',').join(''));

    // this.basketService.changePaymentCharge(this.payment); 

  }


  removePayment(payment: TSalesPayment) {
    // debugger;
    // this.removePayment(payment);
    this.order.payments = this.order.payments.filter(x => x.lineId !== payment.lineId)

    this.selectedRow = null;
    this.amountCharge = null;
    this.payment = null;
    this.inputType = "";
    this.calculateTotal();
  }
  clearAmount(i, payment: Payment) {
    console.log("clearAmount");
    this.amountCharge = "";
  }
  isShowOtherPayment: boolean = false;
  showOtherPayment() {
    this.isShowOtherPayment = !this.isShowOtherPayment;

  }
   
  saveModel() {
    // this.order.invoiceType = "CheckOut";
    // this.order.lines.forEach(line => {
    //   line.openQty = line.openQty - line.quantity;
    //   line.quantity = line.checkOutQty;
    //   if(line.serialLines!==null && line.serialLines!==undefined)
    //   {
    //     line.serialLines.forEach(serialLine => {
    //       debugger;
    //       serialLine.openQty = serialLine.openQty - serialLine.quantity;

    //     });
    //   }

    // });
    // console.log(this.invoice.lines);
    // this.invoice.invoiceType = "CheckOut";

     
    let shift = this.shiftService.getCurrentShip();
    if (shift !== null && shift !== undefined) {
      this.order.payments.forEach(payment => {
        payment.createdBy = this.authService.getCurrentInfor().username;
      });

      this.order.shiftId = shift.shiftId;
      this.order.dataSource = 'POS';
      this.order.createdBy = this.authService.getCurrentInfor().username;
      // this.order.counterId=
      let storeClient = this.authService.getStoreClient();
      if(storeClient!==null && storeClient!==undefined)
      {
        this.order.terminalId = this.authService.getStoreClient().publicIP;
      }
      else
      {
        this.order.terminalId = this.authService.getLocalIP();
      }
      if (this.order.terminalId !== null && this.order.terminalId !== undefined && this.order.terminalId !== '')
      {
        
        this.billService.addPayment(this.order).subscribe((response: any) => {
          if (response.success) {
            this.alertify.success('Payment completed successfully. ');
            this.router.navigate(["shop/bills/", this.order.transId, this.order.companyCode, this.order.storeId]);
            window.location.reload(); 
          }
          else {
            this.alertify.warning('Payment failed. Message: ' + response.message);
          }
        });
      }
      else
      {
        this.alertify.warning('Counter Id is null.');
      } 
      // xxx
    
    }
    else {
      this.alertify.warning('Not in shift. Please create / load shift');
    }

   

  }

  saveModelNew(value) {
    // this.order.invoiceType = "CheckOut";
    // this.order.lines.forEach(line => {
    //   line.openQty = line.openQty - line.quantity;
    //   line.quantity = line.checkOutQty;
    //   if(line.serialLines!==null && line.serialLines!==undefined)
    //   {
    //     line.serialLines.forEach(serialLine => {
    //       debugger;
    //       serialLine.openQty = serialLine.openQty - serialLine.quantity;

    //     });
    //   }

    // });
    // console.log(this.invoice.lines);
    // this.invoice.invoiceType = "CheckOut";

    if(value === true)
    {
      let shift = this.shiftService.getCurrentShip();
      if (shift !== null && shift !== undefined) {
        // this.order.payments.forEach(payment => {
        //   payment.createdBy = this.authService.getCurrentInfor().username;
        // });
        let basket = this.basketService.getCurrentBasket();
       let payments = basket.payments;  
        payments = payments.filter(x=> x.isPaid !== true);

        if (payments !== null && payments !== undefined && payments.length > 0) { 
          this.order.shiftId = shift.shiftId;
          this.order.dataSource = 'POS';
          this.order.createdBy = this.authService.getCurrentInfor().username;
          this.order.payments = [];
          // this.order.counterId=
          payments.forEach((paymentline) => {
            const payment = new TSalesPayment(); 
            payment.paymentCode = paymentline.id;
            payment.companyCode = this.order.companyCode;
            payment.refNumber = paymentline.refNum;
            payment.lineId = paymentline.lineNum.toString();
            payment.dataSource = 'POS'; 
            payment.cardNo = paymentline.cardNo;
            payment.cardHolderName = paymentline.cardHolderName;
            payment.cardType = paymentline.cardType;
            payment.paymentMode = paymentline.paymentMode;
            payment.chargableAmount =   paymentline.paymentCharged;
            payment.paymentDiscount = paymentline.paymentDiscount;
            payment.collectedAmount =   paymentline.paymentTotal;
            payment.createdBy =  this.order.createdBy;
            payment.roundingOff = paymentline.roundingOff;
            payment.fcRoundingOff = paymentline.fcRoundingOff;
            payment.forfeit = paymentline.forfeit;
            payment.forfeitCode = paymentline.forfeitCode;
            payment.customF1 = paymentline.customF1;
            payment.customF2 = paymentline.customF2;
            payment.customF3 = paymentline.customF3;
            payment.customF4 = paymentline.customF4;
            payment.customF5 = paymentline.customF5;
            if (paymentline.currency !== null && paymentline.currency !== undefined && paymentline.currency !== '') {
              payment.rate = paymentline.rate;
              payment.fcAmount =   paymentline.paymentTotal;
              payment.collectedAmount = payment.fcAmount * payment.rate;
              payment.currency = paymentline.currency; 
              payment.paidAmt = paymentline.paidAmt;
            }
            else {
              payment.rate = 1;
              payment.currency = this.authService.storeSelected().currencyCode;

            }
            if (Math.abs(payment.collectedAmount) - Math.abs(payment.chargableAmount) > 0) {
              payment.changeAmt = Math.abs(payment.collectedAmount) - Math.abs(payment.chargableAmount);
            }
            this.order.payments.push(payment);
          });
          let storeClient = this.authService.getStoreClient();
          if(storeClient!==null && storeClient!==undefined)
          {
            this.order.terminalId = this.authService.getStoreClient().publicIP;
          }
          else
          {
            this.order.terminalId = this.authService.getLocalIP();
          }
          if (this.order.terminalId !== null && this.order.terminalId !== undefined && this.order.terminalId !== '')
          {
          
            this.billService.addPayment(this.order).subscribe((response: any) => {
              if (response.success) {
                this.alertify.success('Payment completed successfully. ');
                this.router.navigate(["shop/bills/", this.order.transId, this.order.companyCode, this.order.storeId]);
                window.location.reload(); 
              }
              else {
                this.alertify.warning('Payment failed. Message: ' + response.message);
              }
            });
          }
          else
          {
            this.alertify.warning('Counter Id is null.');
          } 
        }
        else
        {
          this.alertify.warning('Payments is empty.');
        }
      
        // xxx
      
      }
      else {
        this.alertify.warning('Not in shift. Please create / load shift');
      }
  
    }
    else {
      this.modalRef.hide();
      this.loadShortcut();
    }
   

  }
  closeOtherPad() {
    this.isShowOtherPayment = !this.isShowOtherPayment;
  }
  addPayment(payment: MPaymentMethod, isClose?: boolean, isRequire?: boolean) {
    debugger;
    this.isPayment = true;
    let companyCode = this.order.companyCode;
    let paymentId = payment.paymentCode;
    if (isRequire) {
      if (paymentId === "PrepaidCard") {
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
            this.prepaidCardService.getItem(companyCode, result.value).subscribe((response: any) => {
              if (response.success) {
                if (response.data !== null) {

                  this.amountCharge = "";
                  let amountLeft = this.paymentTotal.value.leftAmount;

                  if (amountLeft <= 0) {
                    this.alertify.warning("Can't add new payment to bill.");
                  }
                  else {

                    // console.log(response);
                    this.payment = new TSalesPayment();
                    // let paymentX = new Payment();
                    // .id=
                    this.payment.isRequire = isRequire;
                    this.payment.paymentCode = paymentId;
                    this.payment.refNumber = result.value.toString();
                    this.payment.paymentDiscount = 0;
                    // this.payment.collectedAmount = result.value.toString();
                    this.payment.totalAmt = 0;
                    this.payment.chargableAmount = amountLeft;//this.basketService.getAmountLeft();
                    this.payment.receivedAmt = 0;
                    this.payment.mainBalance = response.data.mainBalance === null || response.data.mainBalance === undefined ? 0 : response.data.mainBalance;
                    this.payment.subBalance = response.data.subBalance === null || response.data.subBalance === undefined ? 0 : response.data.subBalance;
                    // this.payment.paymentCharged = 0;// this.basketService.getAmountLeft();

                    let linenum = this.order.payments.length + 1;
                    this.payment.lineId = linenum.toString();
                    // this.payment = payment;
                    // this.paymentCharge.next(payment);
                    // this.basketService.changePaymentCharge(this.payment); 
                    // this.basketService.addPaymentToBasket(this.payment);
                    this.addPaymentToBasket(this.payment);
                    var payments = this.order.payments;
                    if (payments.length > 0) {
                      this.selectedRow = this.order.payments.length - 1;
                      this.setClickedRow(this.selectedRow, this.payment, "");
                      for (let i = 0; i < payments.length; i++) {
                        if (payments[i].paymentCode === paymentId) {
                          this.selectedRow = i;
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

                  }

                  // }
                }
                else {
                  this.alertify.warning("Card No not found");
                }
              }
              else {
                this.alertify.warning(response.message);
              }


            })

          }

        })

      }
      if (paymentId === "Voucher") {
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
            this.voucherService.getByCode(companyCode, '', result.value, '').subscribe((response: any) => {
              if (response.success) {
                debugger;
                if (response.code === 0) {
                  let numCollected = 0;
                  if (this.payment !== null) {
                    let paymentX = this.order.payments.find(x => x.paymentCode === this.payment.paymentCode);
                    if (paymentX !== null && paymentX !== undefined) {
                      numCollected = paymentX.collectedAmount;
                    }
                  }
                  if (this.payment !== null && numCollected == 0) {
                    // this.alertify.warning("Please Complete progress payment " + this.payment.paymentCode + "!");
                    Swal.fire({
                      icon: 'warning',
                      title: 'Payment',
                      text: "Please Complete progress payment " + this.payment.paymentCode + "!"
                    });
                  }
                  else {
                    this.amountCharge = "";
                    let amountLeft = this.basketService.getAmountLeft();

                    if (amountLeft <= 0) {
                      this.alertify.warning("Can't add new payment to bill.");
                    }
                    else {

                      this.payment = new TSalesPayment();

                      this.payment.isRequire = isRequire;
                      this.payment.paymentCode = paymentId;
                      this.payment.refNumber = result.value.toString();
                      this.payment.paymentDiscount = 0;
                      this.payment.totalAmt = 0;
                      this.payment.chargableAmount = this.basketService.getAmountLeft();

                      // let linenum = this.basketService.getCurrentBasket().payments.length + 1;
                      // this.payment.lineNum= linenum;

                      let linenum = this.order.payments.length + 1;
                      this.payment.lineId = linenum.toString();
                      debugger;
                      if (payments.length > 0) {
                        this.selectedRow = this.order.payments.length - 1;
                        this.setClickedRow(this.selectedRow, this.payment, "");
                        for (let i = 0; i < payments.length; i++) {
                          if (payments[i].paymentCode === paymentId) {
                            this.selectedRow = i;
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
                      // this.basketService.changePaymentCharge(this.payment); 

                      // this.basketService.addPaymentToBasket(this.payment, parseFloat(response.data.voucherValue )); 
                      // var payments= this.basketService.getCurrentPayment();
                      // if(payments.length > 0)
                      // {
                      //   this.selectedRow = this.basketService.getCurrentPayment().length - 1;
                      //   this.setClickedRow(this.selectedRow, this.payment, "");
                      //   for(let i = 0; i < payments.length ; i++)
                      //   {
                      //     if(payments[i].id === paymentId)
                      //     {
                      //       this.selectedRow = i;
                      //       this.setClickedRow(this.selectedRow, this.payment, "");
                      //     }
                      //   }

                      // }
                      // else{
                      //   this.selectedRow =0;
                      // }
                      // if(isClose)
                      // {
                      //   this.closeOtherPad();
                      // }
                    }

                  }
                }
                else {
                  this.alertify.warning(response.message);
                }
              }
              else {
                this.alertify.warning(response.message);
              }
            })
            // result.value

          }

        })

      }


    }
    else {

      let numCollected = 0;
      if (this.payment !== null) {
        let paymentX = this.order.payments.find(x => x.paymentCode === payment.paymentCode);
        if (paymentX !== null && paymentX !== undefined) {
          numCollected = paymentX.collectedAmount;
        }
      }
      // let amountLeft = this.basketService.getAmountLeft();

      // // this.basketService.bas
      // // this.basketTotal$.subscribe(data => {
      // //   debugger;
      // //   console.log(data);
      // //   amountLeft = data.subtotal - data.totalAmount;
      // // });
      // if (amountLeft <= 0) {
      //   this.alertify.warning("Can't add new payment to bill.");
      // }
      // if(this.payment!==null && numCollected == 0)
      // {
      //   this.alertify.warning("Please Complete progress payment " + payment.paymentCode + "!");
      // }
      // else
      // {
      debugger;
      this.amountCharge = "";
      let currentotal = this.paymentTotal.value;
      let amountLeft = currentotal.leftAmount;// this.basketService.getAmountLeft();

      // this.basketService.bas
      // this.basketTotal$.subscribe(data => {
      //   debugger;
      //   console.log(data);
      //   amountLeft = data.subtotal - data.totalAmount;
      // });
      if (amountLeft <= 0) {
        this.alertify.warning("Can't add new payment to bill.");
      }
      else {
        debugger;
        this.payment = new TSalesPayment();
        // let paymentX = new Payment();
        // .id=
        this.payment.isRequire = isRequire;
        this.payment.paymentCode = paymentId;
        this.payment.refNumber = "";
        this.payment.paymentDiscount = 0;
        this.payment.totalAmt = 0;
        // this.paymentTotal
        this.payment.chargableAmount = amountLeft;//this.basketService.getAmountLeft();
        // this.basketTotal$.subscribe(data => {
        //   console.log(data);
        //   this.payment.paymentCharged  = data.subtotal - data.totalAmount;
        // });
        let linenum = this.order.payments.length + 1;
        this.payment.lineId = linenum.toString();
        // this.payment = payment;
        // this.paymentCharge.next(payment);
        // this.basketService.changePaymentCharge(this.payment); 
        // this.basketService.addPaymentToBasket(this.payment);
        this.addPaymentToBasket(this.payment);
        var payments = this.order.payments;
        if (payments.length > 0) {
          // this.selectedRow = this.order.payments.length - 1;
          // this.setClickedRow(this.selectedRow, this.payment, "");
          // for(let i = 0; i < payments.length ; i++)
          // {
          //   if(payments[i].paymentCode === paymentId)
          //   {
          //     this.selectedRow = i;
          //     this.setClickedRow(this.selectedRow, this.payment, "");
          //   }
          // }
          this.setClickedRow(linenum, this.payment, "");
        }
        else {
          this.selectedRow = 0;
        }
        if (isClose) {
          this.closeOtherPad();
        }
      }
      // }

      // }
    }

  }
  maxvalue = "";
  isFastClick = false;
  pressKey(key: string) {
    // debugger;
    console.log("pressKey");
    let billTotal = 0;
    // this.paymentTotal
    this.paymentTotal$.subscribe((data: any) => {
      console.log(data);
      billTotal = data.chargableAmount;
    })
    if (this.inputType === "refNum" || this.inputType === "customF1") {
      if (this.inputType === "refNum" )
      {
        this.payment.refNumber += key;
        let basket = this.basketService.getCurrentBasket();
        this.basketService.setBasket(basket);
      }
      if (this.inputType === "customF1" )
      {
        this.payment.customF1 += key;
        let basket = this.basketService.getCurrentBasket();
        this.basketService.setBasket(basket);
      }
 
    }
    // if (this.inputType === "refNum") {
    //   this.payment.refNumber += key;
    //   let basket = this.basketService.getCurrentBasket();
    //   this.basketService.setBasket(basket);
    // }
    else {

      if (this.isFastClick) {
        this.amountCharge = "";
      }
      if (this.amountCharge === null || this.amountCharge === undefined) {
        this.amountCharge = "";
      }
      this.isFastClick = false;
      debugger;
      if (this.maxvalue === "null" || this.maxvalue === "undefined") {
        this.maxvalue = null;
      }
      // || this.maxvalue !== "undefined"
      if (this.maxvalue !== null && this.maxvalue !== undefined) {
        let checkAmt = this.amountCharge + key;
        // if (parseInt(checkAmt) - billTotal > parseInt(this.maxvalue)) {
        //   this.alertify.warning("can't add num");
        // }
        // else {
        if (key === "000") {
          this.amountCharge = this.payment.chargableAmount.toString();

        }
        else {
          this.amountCharge += key;
        }
        if (this.payment.paymentCode === 'PrepaidCard') {
          let balance = parseFloat(this.payment.mainBalance.toString()) + parseFloat(this.payment.subBalance.toString());
          if (parseFloat(this.amountCharge) > balance) {
            if (balance > 0 && balance < parseFloat(this.amountCharge)) {
              this.addPaymentToBasket(this.payment, balance);
            }
            else {
              this.alertify.warning("Unavailable balance");
            }
          }
          else {
            this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
          }
        }
        else {
          this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
        }
        // }
      }
      else {

        debugger;
        if (key === "000") {
          this.amountCharge = this.payment.chargableAmount.toString();

        }
        else {

          this.amountCharge += key;
        }
        this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
        // this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));

      }
    }

    // this.setFocus(this.inputType, this.selectedRow);
  }
  // pressKey(key: string) {
  //   debugger;
  //   if(this.isFastClick)
  //     {
  //       this.amountCharge = "";
  //     }
  //     if(this.amountCharge === null || this.amountCharge === undefined)
  //     {
  //       this.amountCharge = "";
  //     }
  //     this.isFastClick = false;
  //   this.amountCharge += key;

  //   this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
  // } 
  inputNum(num: string) {
    debugger;
    if (!this.isFastClick) {
      this.amountCharge = "";
    }
    if (this.amountCharge === null || this.amountCharge === undefined) {
      this.amountCharge = "";
    }
    this.isFastClick = true;
    let currentX = this.amountCharge === "" ? 0 : parseFloat(this.amountCharge);
    let numX = num === "" ? 0 : parseFloat(num);
    let value = currentX + numX;
    this.amountCharge = value.toString();
    //  this.amountCharge = num;

    this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
    //  this.selectedRow = null;
  }
  inputNumFix(num: string, isDemo) {

    // console.log("clearAmount");
    if (num !== null && num !== undefined && num !== "") {
      num = num;
      num = num.toString().split(',').join('');
    }
    else {
      num = "0";
    }
    let billTotal = 0;
    this.paymentTotal$.subscribe((data: any) => {
      // console.log(data);
      billTotal = data.chargableAmount;
    })

    if (!this.isFastClick) {
      this.amountCharge = "";
    }
    if (this.amountCharge === null || this.amountCharge === undefined) {
      this.amountCharge = "";
    }
    this.isFastClick = true;
    debugger;
    if (this.maxvalue === "null" || this.maxvalue === "undefined") {
      this.maxvalue = null;
    }
    // || this.maxvalue !== "undefined"
    if (this.maxvalue !== null && this.maxvalue !== undefined) {
      let checkAmt = this.amountCharge + num;
      //   if (parseInt(checkAmt) - billTotal > parseInt(this.maxvalue)) {
      //     this.alertify.warning("can't add num");
      //   }

      // else {
      let value = 0;
      if (isDemo === true) {
        let currentX = this.amountCharge === "" ? 0 : parseFloat(this.amountCharge);
        let numX = num === "" ? 0 : parseFloat(num);

        value = currentX + numX;
      }
      else {
        let valuetmp = num === "" ? "0" : num;
        value = parseFloat(valuetmp);
      }

      this.amountCharge = value.toString();
      debugger;
      // this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
      this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge))
      // }
    }
    else {
      let currentX = this.amountCharge === "" ? 0 : parseFloat(this.amountCharge);
      let numX = num === "" ? 0 : parseFloat(num);
      let value = currentX + numX;
      this.amountCharge = value.toString();

      // this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
      this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge))

    }
  }

  addPaymentToBasket(payment: TSalesPayment, paymentCharged = 0) {
    debugger;

    if (payment.paymentCode !== null) {
      this.order.payments = this.addOrUpdatePayment(
        this.order.payments,
        payment,
        paymentCharged
      );
    }
    this.calculateTotal();
  }
  denolist: MDenomination[]
  loadDenolist() {
    this.denolist = this.authService.getDenomination();
    console.log(this.denolist);
  }
  chargedPayment: TSalesPayment[] = [];




  calculateTotal() {
    debugger;
    //  let orderTotalAmt = this.orderTotalAmt;
    //  let orderTotalCollected = this.orderTotalCollected; 
    //  let orderchangeAmt = this.orderchangeAmt ; 
    //  let orderLeftAmt = this.orderLeftAmt;
    let orderchargableAmt = this.orderchargableAmt;
    let totalAmount = this.order.lines.reduce((a, b) => (b?.quantity * b?.price) + a, 0);
    let totalCollected = this.order.payments.reduce((a, b) => b.collectedAmount + a, 0) + this.orderTotalCollected;
    let changeAmount = 0;
    let leftAmount = 0;
    let chargableAmount = orderchargableAmt;
    let discountAmount = this.order.totalDiscountAmt;
    // orderTotalCollected + 
    // let Left=0;
    if (totalAmount - discountAmount - totalCollected > 0) {
      changeAmount = 0;
      leftAmount = totalAmount - totalCollected - discountAmount;
    }
    else {
      changeAmount = Math.abs(totalAmount - discountAmount - totalCollected);
      leftAmount = 0;
    }
    // totalAmount: number= 0;
    // totalCollected: number =0;
    // ChangeAmount: number =0;
    // LeftAmount: number =0;
    this.paymentTotal.next({ totalAmount, totalCollected, changeAmount, leftAmount, chargableAmount, discountAmount });

  }
  isSave = true;
  private addOrUpdatePayment(payments: TSalesPayment[], paymenttoAdd: TSalesPayment, paymentTotal: number): TSalesPayment[] {
    debugger;
    console.log(payments);
    const totalBasket = this.paymentTotal;
    //  const totalPaymentBasket = this.basketPaymentTotal;
    const index = payments.findIndex((i) => i.paymentCode === paymenttoAdd.paymentCode && i.lineId === paymenttoAdd.lineId);
    if (index === -1) {

      paymenttoAdd.collectedAmount = paymentTotal;
      paymenttoAdd.chargableAmount = totalBasket.value.totalAmount - totalBasket.value.discountAmount - totalBasket.value.totalCollected;// (totalBasket.value.totalAmount - totalBasket.value.leftAmount) ;
      paymenttoAdd.totalAmt = paymentTotal;
      //  paymenttoAdd.paymentCharged = totalBasket.total - totalBasket.totalAmount;
      payments.push(paymenttoAdd);
    } else {
      payments[index].collectedAmount = paymentTotal;

    }
    return payments;
  }
  //End phần payment

  checkCanCheckIn(): boolean {
    // debugger;
     
      if (this.order?.payments !== null && this.order?.payments !== undefined && this.order?.payments.length > 0) {
        // basket.items.reduce((a, b) =>  b.promotionLineTotal + a, 0)  ;
        let collectedAmount = this.order?.payments.reduce((a, b) => b.collectedAmount + a, 0);
        let docTotal = this.order.totalPayable;
        if (collectedAmount < docTotal) {
          return false;
        }
        else {
          return true;
        }
      }
      else {
        return false;
      }
    
   
  }
  CheckOutOrder(order: Order) {
    debugger;
    if (order?.contractNo !== null && order?.contractNo !== undefined && order?.contractNo !== '') {
      this.routeNav.navigate(["shop/bills/checkout", order.transId, order.companyCode, order.storeId]);
    }
    else {
      this.alertify.warning('Event id undefined. Please check your order');

    }
    // ['MyCompB', {id: "someId", id2: "another ID"}]

  }
  DeliveryOrder(order: Order) {
    debugger;
    // if (order?.contractNo !== null && order?.contractNo !== undefined && order?.contractNo !== '') {
      
    // }
    // else {
    //   this.alertify.warning('Event id undefined. Please check your order');

    // }
    // ['MyCompB', {id: "someId", id2: "another ID"}]
    this.routeNav.navigate(["shop/bills/delivery", 'create', order.transId, order.companyCode, order.storeId]);
  }
  onEditorPreparing(e) {
    // debugger;
    if (e.parentType === "dataRow" && e.dataField.toLowerCase() === "barcode" && e.value !== null && e.value !== undefined && e.value !== '') {
      debugger;
      let line = parseInt(e.row.data.lineId) - 1;
      // e.editorOptions.disabled = (typeof e.row.data.itemCode !== "number"); this.authService.getCurrentInfor(). this.storeSelected.storeId
      this.itemService.GetItemInforList(e.row.data.companyCode, '1001', '', '', e.value, '', '', '', e.row.data.priceListId).subscribe((response: any) => {

        if (response.success) {
          if (response.data !== null && response.data !== undefined && response.data?.length > 0) {

            let item = response.data[0];//.filter(x=>x.pricelistId === rowData.pricelistId);
            if (item !== null && item !== undefined) {
              // newData.barCode = value;
              // newData.uomCode = item.uomCode;

              this.dataGrid.instance.cellValue(line, 'barCode', e.row.data.barCode);
              this.dataGrid.instance.cellValue(line, 'uomCode', item.uomCode);

            }
            else {
              this.dataGrid.instance.cellValue(line, 'barCode', '');
              this.dataGrid.instance.cellValue(line, 'uomCode', '');
              this.alertify.warning('Item code ');
            }
            // let item  = response.data[0] as ItemViewModel; 
          }
          else {
            debugger;
            this.dataGrid.instance.cellValue(line, 'barCode', '');
            this.dataGrid.instance.cellValue(line, 'uomCode', '');
            this.alertify.warning('Item code ');
          }

        }
        else {
          debugger;
          this.dataGrid.instance.cellValue(line, 'barCode', '');
          this.dataGrid.instance.cellValue(line, 'uomCode', '');
          this.alertify.warning(response.message);
        }
      })
    }
    // if(e.parentType === "dataRow" && (e.dataField === "itemCode" || e.dataField === "keyId")) {
    //   // e.editorOptions.readOnly = AppComponent.isChief(e.value);
    //   this.popupVisible = true;
    // }
  }
  // onEditorPreparing(evt: any): void {  
  //   if (evt.dataField?.toLowerCase() === "barcode") {  
  //       evt.editorOptions.onValueChanged = (e: any) => {  
  //         // console.log('valueChanged')  
  //         debugger;
  //         this.itemService.GetItemInforList(this.authService.getCurrentInfor().companyCode, this.storeSelected.storeId, '','','','','','' ).subscribe((response: any)=>{
  //           if(response.success)
  //           {
  //             debugger;
  //           }
  //           else
  //           {
  //             this.alertify.warning(response.message);
  //           }
  //         })
  //       }  
  //   }  
  // }  
  CheckInOrder(order: Order) {
    debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
    this.routeNav.navigate(["shop/checkin-by-orderid", order.transId, order.companyCode, order.storeId]);
  }
  production = false;
  ngAfterViewInit() {
    // debugger;
    this.production =  environment.production;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function (item) {
      // Do stuff here
      if (item !== null && item !== undefined) {
        item.classList.add('hide');
        // console.log('bill detail');
      }
    });
    // paymentMenu
    setTimeout(() => {
      this.loadShortcut();
    }, 100);
  }
  @ViewChild('dataGrid', { static: false }) dataGrid;
  inputBarcode(value) {
    debugger;
    // e.editorOptions.disabled = (typeof e.row.data.itemCode !== "number"); this.authService.getCurrentInfor(). this.storeSelected.storeId
    //  this.itemService.GetItemInforList(e.row.data.companyCode, '1001', '','', e.row.data.barCode,'','','', e.row.data.priceListId ).subscribe((response: any)=>{
    //   debugger;
    //   if(response.success)
    //   {  debugger;
    //     if(response.data!==null && response.data!==undefined && response.data?.length > 0)
    //     {
    //       debugger;
    //       let item = response.data[0];//.filter(x=>x.pricelistId === rowData.pricelistId);
    //       if(item!==null && item!==undefined)
    //       {
    //         // newData.barCode = value;
    //         // newData.uomCode = item.uomCode;
    //         let line = parseInt( e.row.data.lineId) -1;
    //         this.dataGrid.instance.cellValue( line, 'barCode', e.row.data.barCode); 
    //         this.dataGrid.instance.cellValue(line, 'uomCode', item.uomCode);  

    //       }
    //       else
    //       {
    //         // newData.barCode ='';
    //         // newData.uomCode = '';
    //         // this.alertify.warning('Item code ');
    //       }
    //       // let item  = response.data[0] as ItemViewModel; 
    //     }
    //     else
    //     {
    //       debugger;
    //       // newData.barCode ='';
    //       // newData.uomCode = '';
    //       // this.alertify.warning('Item code ');
    //     }

    //   }
    //   else
    //   {  debugger;
    //     // newData.barCode ='';
    //     // newData.uomCode = '';
    //     this.alertify.warning(response.message);
    //   }
    // })

  }
  showCheckInOut = "false";
  loadSetting() {
    // debugger;
    if (this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId) !== null && this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId) !== undefined && this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId)?.length > 0) {
      let showCheckInOut = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'CheckInOut');
      if (showCheckInOut !== null && showCheckInOut !== undefined) {
        this.showCheckInOut = showCheckInOut.settingValue;
      }

    }

  }
  onRowPrepared(e) {
    // debugger;
    if (e.data !== null && e.data !== undefined) {
      if (e.data.lineId !== null && e.data.lineId !== undefined) {
        //&& (e.data.lines===null || e.data.lines===undefined || e.data.lines.length===0 || e.data.lines==='undefined'
        // debugger;
        let a = e.data?.itemType;

        if (e.rowType === "data"
          && ((e.data.lines === null || e.data.lines === undefined || e.data.lines.length === 0)
            && (e.data.serialLines === null || e.data.serialLines === undefined || e.data.serialLines.length === 0)
            || (e.data?.itemType === 'Member' || e.data?.itemType === 'Class'))) {
          // debugger;
          if (e.rowElement.querySelector(".dx-command-expand")?.firstChild !== null && e.rowElement.querySelector(".dx-command-expand")?.firstChild !== undefined) {
            e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");
            e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");
          }


        }
      }

    }


  }
  // checkPermission(controlId: string, permission: string): boolean
  // { 
  //   // debugger;
  //   let result=false;
  //   let re= this.permissionDic.find(x=>x.controlId===controlId && x.permission===permission);
  //   if(re===null || re===undefined)
  //   {
  //     let rs= this.authService.checkRole(this.functionId , controlId, permission );
  //     let per=  new IPermission();
  //     per.controlId= controlId;
  //     per.permission = permission;
  //     per.result = rs; 
  //     this.permissionDic.push(per);
  //     result=true;
  //   }
  //   else
  //   {
  //     result=re.result;
  //   }

  //   return result;
  // }
  functionId = "Adm_BillSearch";

  checkBtnShow(controlId) {
    let rs = false;
    if (this.authService.checkRole(this.functionId, controlId, 'V')) {
      // debugger;
      if (this.order.isCanceled === 'N' && this.order.salesMode === 'SALES') {
        rs = true;
      }
      else {
        rs = false;
      }
      // if(require)
      // {
      //   if(data.isCanceled==='N' && data.salesMode==='SALES')
      //   {
      //     rs= true;
      //   }
      //   else
      //   {

      //     rs= false;
      //   }
      // }
      // else
      // {


      // }
    }
    return rs;
  }
  customizeText(e) {

    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  filterNotBOM(items: TSalesLine[]) {
    debugger;
    if (items !== null && items !== undefined) {
      let rs = items.filter(x => x.bomId === '' || x.bomId === null);
      return rs;
    }
  }
  filterBOM(items: TSalesLine[], itemCode, uomCode) {
    debugger;
    if (items !== null && items !== undefined) {
      let rs = items.filter(x => x.bomId === itemCode);
      return rs;
    }
  }
  filterSerial(items: TSalesLineSerial[], itemCode, uomCode) {
    debugger;
    if (items !== null && items !== undefined) {
      let rs = items.filter(x => x.itemCode === itemCode && x.uomCode === uomCode);
      return rs;
    }
  }
  storeSelected: MStore;
  checkPayment = false;
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
  barcodeSetup: SBarcodeSetup[];
   
  loadBarcodeList() {
    this.barcodeService.getAll(this.authService.getCurrentInfor().companyCode,'').subscribe((res:any) => {
      // loadItems
      // debugger;
      if(res.success)
      {
        this.barcodeSetup = res.data;
      }
      else
      {
        this.alertify.warning(res.message);
      }
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
  ngOnInit() {
    this.loadControl();
    this.loadBarcodeList();
    this.poleValue = this.getPole();
    this.loadReasonList();
    this.route.data.subscribe(data => {
      this.order = data['order'].data;
    });
    //
    this.checkDayOfOrder();
    if (this.order !== null && this.order !== undefined) {
      let check = this.checkCanCheckIn();
      this.checkPayment = check; 
      // || this.order.posType.toLowerCase() === 'e' (this.order.posType.toLowerCase() !== 'e' &&  ) 
      if (this.order.status.toLowerCase() !== 'hold' && this.order.collectedStatus.toLowerCase() !== 'closed' ) 
      {
        if (this.order.dataSource.toLowerCase() === 'ecom' && (this.order.posType.toLowerCase() !== 'e' && !check) || (this.order.posType.toLowerCase() === 'e' && !check)) {
          this.isSave = false;
          // Bổ sung để làm phần payment
          this.storeSelected = this.authService.storeSelected();

          this.order.payments.forEach(payment => {
            payment.isRemove = false;
          });
          this.loadSetting();

          this.paymentTotal$ = this.paymentTotal$;
          this.calculateTotalFirst();
          // this.calculateTotal();
          debugger;
          this.storePaymentService.getByStore(this.storeSelected.companyCode, this.storeSelected.storeId, '').subscribe((res: any) => {
            debugger;
            if (res.success) {
              this.paymentMethodShowList = res.data.filter(x => x.status === "A" && x.isShow === true);
              this.paymentMethodShowList = this.paymentMethodShowList.slice(0, 3);
              this.paymentMethodOtherList = res.data.filter(x => x.status === "A" && x.isShow === false);
            }
            else {
              this.alertify.warning(res.message);

            }

            // this.paymentMethodShowList = res.filter(x => x.status === "A" && x.isShow === true);
            // this.paymentMethodShowList = this.paymentMethodShowList.slice(0, 3);
            // this.paymentMethodOtherList = res.filter(x => x.status === "A" && x.isShow === false);

          }, error => {
            this.alertify.error(error);
          });
          this.maxvalue = this.authService.getmaxValueCurrency();
          this.chargedPayment = this.order.payments;
          this.order.payments = [];

          this.loadDenolist();
        }
      }
    }
    else {
      Swal.fire({
        icon: 'warning',
        title: 'Item',
        text: "Can't get order. Please check your order id."
      }).then(() => {

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

      });
    }


    console.log("this.order-bill-detail", this.order);
  }
  openPaymentModal(template: TemplateRef<any>) {
    this.showModal = true;
    debugger;
    var orderClone: Order = null; 
    orderClone = Object.assign({},  this.order);
    // orderClone.payments = orderClone.contractPayments;
     this.basketService.orderToBasket(orderClone, true , true, "AddPayment", null, this.barcodeSetup, true, false);
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

  openModal(template: TemplateRef<any>) {
    this.showModal = true;
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',

        class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
      });
    });
   
  }
  openDeliveryModal(template: TemplateRef<any>) {

    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',

        class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
      });
    });

  }
  openPromotionModal(template: TemplateRef<any>) {

    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',

        class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
      });
    });

    // this.resetDiscount();
  }

  rejectOrder() {
    let storeClient = this.authService.getStoreClient();
    if (storeClient !== null && storeClient !== undefined) {
      this.order.terminalId = this.authService.getStoreClient().publicIP;
    }
    else {
      this.order.terminalId = this.authService.getLocalIP();
    }
    if (this.order.terminalId !== null && this.order.terminalId !== undefined && this.order.terminalId !== '') {
      Swal.fire({
        title: 'Submit your reason',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Reject',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          // debugger;
          this.order.reason = result.value;
          // this.order.terminalId = this.authService.getLocalIP();
          this.order.modifiedBy = this.authService.getCurrentInfor().username;
          this.billService.rejectOrder(this.order).subscribe((response: any) => {
            if (response.success) {
              this.alertify.success('Reject completed successfully. ' + response.message);
              console.log("this.order.omsId", this.order.omsId)
              if (this.order.omsId != null) {
                // gởi lên haravan
                this.modelRejectBillHRV.note = result.value;
                this.mwiService.sendOrderIdCancelOrder(this.order.omsId, this.modelRejectBillHRV).subscribe((response: any) => {
                  if (response.success) {
                    this.alertify.success('Reject completed successfully. ');
                  }
                  else {
                    this.alertify.warning('Reject failed. Message: ' + response.message);
                  }
                })
              }
              window.location.reload();

            }
            else {
              this.alertify.warning('Reject failed. Message: ' + response.message);
            }
          })

        }
      })
    }
    else {
      this.alertify.warning("Counter ID can't null please mapping value in Store Counter");
    }

    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'Do you want to reject bill!',
    //   icon: 'question',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes',
    //   cancelButtonText: 'No'
    // }).then((result) => {
    //   if (result.value) {
    //     debugger;

    //   }
    // });
  }
  outPutModel: Order;
  checkCancelOrder() {
    let rs = true;
    let storeSetting = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId);
    if (storeSetting !== null && storeSetting !== undefined && storeSetting?.length > 0) {
      let voidSetting = storeSetting.find(x => x.settingId === 'VoidOrder');
      if (voidSetting !== null && voidSetting !== undefined) {
        if (voidSetting.settingValue === "BeforeSyncData" && this.order.syncMWIStatus === 'Y') {
          rs = false;
          this.alertify.warning("The order cannot be canceled because the order has been synced with MWI.");
        }
      }
    }

    return rs;
  }

  SummaryOrder()
  {
    this.router.navigate(["shop/bills/checkout-payment", this.order.transId, this.order.contractNo, this.order.companyCode, this.order.storeId]);
  }
  reasonList: MReason[];
  loadReasonList() {
    debugger;
    this.reasonService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      debugger;
      this.reasonList = response.data.filter(x => x.status === 'A' && x.type === 'Cancel');
    })
  }
  shortcuts: ShortcutInput[] = [];
  isPrintDetail = false;
  functionIdDetail = 'Adm_BillDetail';
  loadControl() {
    let rs = this.authService.checkRole(this.functionId, "btnPrint", 'V');
    if(!rs)
      this.isPrint = false;

    let rsPrintDetail = this.authService.checkRole(this.functionIdDetail, "btnPrintDetail", 'V');
   
    this.isPrintDetail = rsPrintDetail;
    if(this.isPrintDetail===null || this.isPrintDetail===undefined)
    {
      this.isPrintDetail = false;
    }
    // this.isPrintDetail = true;
  }

  loadShortcut() {

    this.shortcuts.push(

      {
        key: ["ctrl + r"],
        label: "Refund Order",
        description: "Refund Order",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          this.ReturnOrder(this.order)

        },
        preventDefault: true
      },
      {
        key: ["ctrl + o"],
        label: "Back to Order",
        description: "Backt to Order",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          this.ReOrder(this.order);
        },
        preventDefault: true
      },
      {
        key: ["ctrl + d"],
        label: "Cancel Order",
        description: "Cancel Order",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          this.cancelOrder();

        },
        preventDefault: true
      },
      {
        key: ["ctrl + e"],
        label: "Exchange Order",
        description: "Exchange Order",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {

          this.ExchangeOrder(this.order)



        },
        preventDefault: true
      },
      {
        key: ["ctrl + p"],
        label: "Print",
        description: "Print",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          this.PrintOrder(this.order)
        },
        preventDefault: true
      },


    )

    this.commonService.changeShortcuts(this.shortcuts, true);

  }
  redeemVoucherMemberTest()
  {
    // this.basketService.writeLogRedeem('CÚ1', "ABCNDXXXXXAEEYH", "Voucher Name XXYYY", this.authService.storeSelected().storeId, 1, "ABCXYU Test"??"");
  }

  dayOfCancel = 5;
  checkDayOfOrder() {
    debugger;
    console.log('this.authService.getVoidReturnSetting()',this.authService.getVoidReturnSetting());
    let setting = this.authService.getVoidReturnSetting().find(x => x.type.replace(/\s/g, "") === 'Retail' && x.code.replace(/\s/g, "") === 'SOVoidDay');
    if (setting !== null && setting !== undefined) {
      this.dayOfCancel = setting.value;
    }
  }
  cancelAction(approvalId) {
    let storeClient = this.authService.getStoreClient();
    if (storeClient !== null && storeClient !== undefined) {
      this.order.terminalId = this.authService.getStoreClient().publicIP;
    }
    else {
      this.order.terminalId = this.authService.getLocalIP();
    }
    if (this.order.terminalId !== null && this.order.terminalId !== undefined && this.order.terminalId !== '') {
      if (this.checkCancelOrder()) {
        if (this.reasonList !== null && this.reasonList !== undefined && this.reasonList?.length > 0) {
          let langOptions = [];
          this.reasonList.forEach(element => {
            debugger;
            if (langOptions.filter(x => x.value === element.language)?.length <= 0) {
              debugger;
              langOptions.push({ value: element.language, name: element.language })
            }

          });
          debugger;
          const initialState = {
            reasonList: this.reasonList,
            langs: langOptions
          };

          let modalRefX = this.modalService.show(ShopReasonInputComponent, {
            initialState, animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            ariaDescribedby: 'my-modal-description',
            ariaLabelledBy: 'my-modal-title',
            class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
          });

          modalRefX.content.outReason.subscribe((response: any) => {
            debugger;
            modalRefX.hide();
            if (response.selected) {
              
              
              this.order.reason = response.selectedReason;
              this.order.totalAmount = -this.order.totalAmount;
              this.order.totalDiscountAmt = -this.order.totalDiscountAmt;
              this.order.totalPayable = -this.order.totalPayable;
              this.order.totalReceipt = -this.order.totalReceipt;
              this.order.amountChange = -this.order.amountChange;
              if (approvalId !== null && approvalId !== undefined && approvalId !== '') {
                this.order.approvalId = approvalId;
              }
              this.order.lines.forEach(line => {
                line.baseLine = parseInt(line.lineId);
                line.baseTransId = line.transId;
                line.quantity = -line.quantity;
                line.lineTotal = -line.lineTotal;
              });

              this.order.payments.forEach(line => {
                line.totalAmt = -line.totalAmt;
                line.chargableAmount = -line.chargableAmount;
                line.collectedAmount = -line.collectedAmount;
              });
              this.order.lines.forEach(line => {
                let BomLine = line.lines;
                if (BomLine !== null && BomLine !== undefined && BomLine.length > 0) {
                  BomLine.forEach(lineBOM => {
                    lineBOM.quantity = -lineBOM.quantity;
                    lineBOM.lineTotal = -lineBOM.lineTotal;
                    this.order.lines.push(lineBOM);
                  });
                }
              });
              // debugger;
              let storeClient = this.authService.getStoreClient();
              if(storeClient!==null && storeClient!==undefined)
              {
                this.order.terminalId = this.authService.getStoreClient().publicIP;
              }
              else
              {
                this.order.terminalId = this.authService.getLocalIP();
              }
              this.order.shiftId = this.shiftService.getCurrentShip().shiftId;
              this.order.createdBy = this.authService.getCurrentInfor().username;
              if(this.order.terminalId!==null && this.order.terminalId!==undefined && this.order.terminalId!== '')
              {
                this.billService.cancelOrder(this.order).subscribe((response: any) => {
                  debugger;
                  if (response.success) {
                    this.order.transId = response.data.refTransId;
                    console.log("response.success", response.data);
                    response.data.isCanceled = "Y";
                    setTimeout(() => {
                      this.outPutModel = response.data;
                       
                    }, 10);
                     
                    Swal.fire({
                      icon: 'success',
                      title: 'Cancel Order',
                      text: 'Cancel completed successfully.'
                    }).then(() => {
                      window.location.reload();
                      
              
                    });
                    // setTimeout(() => {
                    //   window.print();
                    // }, 1000);
                    // setTimeout(() => {
                    //   // this.alertify.success('Cancel completed successfully. ' );
                    //   window.location.reload();
                    // }, 1000);
  
                  }
                  else {
                    // order.refTransId = order.transId;
                    // this.order.transId ='';
                    // this.order.isCanceled = 'C';
                    // this.alertify.warning(response.message);
                    
                    Swal.fire({
                      icon: 'warning',
                      title: 'Cancel Order',
                      text: response.message
                    }).then(() => {
                      window.location.reload();
                      
              
                    });
                  }
                })
              }
              else  
              {
                Swal.fire({
                  icon: 'warning',
                  title: 'Cancel Order',
                  text: "Counter ID can't null please mapping value in Store Counter"
                });
                // this.alertify.warning("Counter ID can't null please mapping value in Store Counter");
              }
            
            }
            else {
              modalRefX.hide();
            }
          });

        }
        else {

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
              this.order.reason = result.value;
              this.order.totalAmount = -this.order.totalAmount;
              this.order.totalDiscountAmt = -this.order.totalDiscountAmt;
              this.order.totalPayable = -this.order.totalPayable;
              this.order.totalReceipt = -this.order.totalReceipt;
              this.order.amountChange = -this.order.amountChange;
              // this.order.terminalId = this.authService.getLocalIP();

              this.order.lines.forEach(line => {
                line.baseLine = parseInt(line.lineId);
                line.baseTransId = line.transId;
                line.quantity = -line.quantity;
                line.lineTotal = -line.lineTotal;
              });

              this.order.payments.forEach(line => {
                line.totalAmt = -line.totalAmt;
                line.chargableAmount = -line.chargableAmount;
                line.collectedAmount = -line.collectedAmount;
              });
              this.order.lines.forEach(line => {
                let BomLine = line.lines;
                if (BomLine !== null && BomLine !== undefined && BomLine.length > 0) {
                  BomLine.forEach(lineBOM => {
                    this.order.lines.push(lineBOM);
                  });
                }
              });
              this.order.shiftId = this.shiftService.getCurrentShip().shiftId;
              this.billService.cancelOrder(this.order).subscribe((response: any) => {
                // debugger;
                if (response.success) {
                  console.log("response.success", response.data);
                  response.data.isCanceled = "Y";
                  setTimeout(() => {
                    this.outPutModel = response.data;
                     
                  }, 10);
                   
                  Swal.fire({
                    icon: 'success',
                    title: 'Cancel Order',
                    text: 'Cancel completed successfully.'
                  }).then(() => {
                    window.location.reload();
                    
                  });
                  // this.outPutModel = response.data;

                  // setTimeout(() => {
                  //   window.print();
                  // }, 1000);
                  // setTimeout(() => {
                  //   // this.alertify.success('Cancel completed successfully. ' );
                  //   window.location.reload();
                  // }, 1000);
                  // this.alertify.success('Cancel completed successfully. ' + response.message);
                  // window.location.reload();
                }
                else {
                   
                  // this.order.isCanceled = 'C';
                  // this.alertify.warning(response.message);


                  Swal.fire({
                    icon: 'warning',
                    title: 'Cancel Order',
                    text: response.message
                  }).then(() => {
                    window.location.reload();
                    
            
                  });
                }
              })
            }
          })
        }

      }
    }
    else {
      this.alertify.warning("Counter ID can't null please mapping value in Store Counter");
    }
  }
  addDays(days: number): Date {
    var futureDate = new Date(this.order.createdOn);
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate;
  }
  cancelOrder() {
    debugger;
    if (this.shiftService.getCurrentShip() == null || this.shiftService.getCurrentShip() === undefined) { 
      Swal.fire({
        icon: 'warning',
        title: 'Shift',
        text: "You are not on the shift. Please create your shift"
      });
    }
    else {
      let cancleLimitDate = this.addDays(this.dayOfCancel);// date.setDate(date.getDate() + );
       let now = new Date();
       let nowstring = this.datePipe.transform(now, 'yyyy/MM/dd');
       now = new Date(nowstring);
      //  now = new Date(now.getFullYear(),now.getMonth(),now.getDay(),0,0,0);
      //  cancleLimitDate = new Date(cancleLimitDate.getFullYear(),cancleLimitDate.getMonth(),cancleLimitDate.getDay(),0,0,0);
      console.log(now,"---",cancleLimitDate)
      if (this.order.status.toLocaleLowerCase()!=='h' && this.order.status.toLocaleLowerCase()!=='hold' && now > cancleLimitDate) {
        Swal.fire({
          icon: 'warning',
          title: 'Payment',
          text: "Cant void order. Because order date out of range!"
        });
      }
      else {
        let checkAction = this.authService.checkRole('Spc_CancelOrder', '', 'I');
        let checkApprovalRequire =  this.authService.checkRole('Spc_CancelOrder', '', 'A');
        if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
        {
          checkAction = false;
        }
        // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().username, '', 'Spc_CancelOrder', '', 'I').subscribe((response: any) => {
        //   // const user = response;
        //    debugger;
        //   if (response.success) {
          
        //   }
        //   else {
        //     Swal.fire({
        //       icon: 'warning',
        //       title: 'Cancel Order',
        //       text: response.message
        //     });
        //   }
        // })
        if (checkAction) {
          this.cancelAction('');
        }
        else {
          // const initialState = {
          //   title: 'Permission denied',
          // };
          let permissionModel= { functionId:'Spc_CancelOrder', functionName: "Cancel Order", controlId: '', permission: 'I'};
          const initialState = {
              title: 'Cancel Order - ' + 'Permission denied', 
              freeApprove : true,
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

              this.cancelAction(received.user);
              modalApprovalRef.hide();

              // let code = (received.customCode ?? '');
              // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, code, 'Spc_CancelOrder', '', 'I').subscribe((response: any) => {
               
              //   if (response.success) {
              //    let note = (received.note ?? '');
              //   if (note !== null && note !== undefined && note !== '') {
              //     this.basketService.changeNote(note).subscribe((response) => {
    
              //     });
              //     this.alertify.success('Set note successfully completed.');
              //   }
               
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
  
    }
   


  }
  confirmOrder() {


    let storeClient = this.authService.getStoreClient();
    if (storeClient !== null && storeClient !== undefined) {
      this.order.terminalId = this.authService.getStoreClient().publicIP;
    }
    else {
      this.order.terminalId = this.authService.getLocalIP();
    }
    if (this.order.terminalId !== null && this.order.terminalId !== undefined && this.order.terminalId !== '') {
      let shift = this.shiftService.getCurrentShip();
      if (shift !== null && shift !== undefined) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to confirm bill!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            debugger;
            this.order.shiftId = shift.shiftId;
            this.order.modifiedBy = this.authService.getCurrentInfor().username;
            // this.order.terminalId = this.authService.getLocalIP(); 
            this.billService.confirmOrder(this.order).subscribe((response: any) => {
              if (response.success) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Confirm Order',
                    text: "Confirm completed successfully. " + response.message
                  }).then(()=>{
                    window.location.reload();
                  });
                // this.alertify.success('Confirm completed successfully. ' + response.message);
                

              }
              else {
                this.alertify.warning('Confirm failed. Message: ' + response.message);
              }
            })
          }
        });
      }
      else {
        this.alertify.warning("Not in shift. Please create / load shift.");
      }
    }
    else {
      this.alertify.warning("Counter ID can't null please mapping value in Store Counter");
    }


  }

  createBasket() {
    const itemList: Item[] = [];
    this.basketService.changeCustomer(this.order.customer);
    // let basket = this.basketService.createBasket(this.order.customer);
    this.order.lines.forEach(async item => {

      var response = await this.itemService.getItem(item.itemCode).toPromise();
      debugger;
      this.basketService.addItemtoBasket(response.data, item.quantity);
      //
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
    // this.router.navigate(["shop/order"]);
    // this.basketService.addItemtoBasket();
    // itemList.forEach(item =>{
    //   setTimeout(() => {
    //     this.basketService.addItemtoBasket(item, 4);
    //   }, 10);

    // });
    // console.log(basket);
  }
  ExchangeOrder(order: Order) {
    debugger;
    let basket = this.basketService.getCurrentBasket();
    if (basket !== null && basket !== undefined) {
      this.basketService.deleteBasket(basket).subscribe(() => {
        if (this.authService.getShopMode() === 'FnB') {
          this.routeNav.navigate(["shop/order/exchange", order.transId]).then(() => {
            // window.location.reload();
          });
        }
        if (this.authService.getShopMode() === 'Grocery') {
          this.routeNav.navigate(["shop/order-grocery/exchange", order.transId]).then(() => {
            // window.location.reload();
          });

        }
      });
    }
    else {
      if (this.authService.getShopMode() === 'FnB') {
        this.routeNav.navigate(["shop/order/exchange", order.transId]).then(() => {
          // window.location.reload();
        });
      }
      if (this.authService.getShopMode() === 'Grocery') {
        this.routeNav.navigate(["shop/order-grocery/exchange", order.transId]).then(() => {
          // window.location.reload();
        });

      }
    }

    // ['MyCompB', {id: "someId", id2: "another ID"}]
    // this.routeNav.navigate(["shop/bills/exchange", order.transId, order.companyCode, order.storeId]);

  }
  PrintDetail() {
    window.print();
  }
  PrintOrder(order) {
    //  /shop/bills/print//:companycode/:storeid
    this.routeNav.navigate(["shop/bills/print", order.transId, order.companyCode, order.storeId]).then(() => {
      window.location.reload();
    });
  }
  async ReOrder(order: Order) {
    console.log("order back to order", order)
    let basket = this.basketService.getCurrentBasket();
    if (basket !== null && basket !== undefined) {
      this.basketService.deleteBasket(basket).subscribe(() => {
        if (this.authService.getShopMode() === 'FnB') {
          this.routeNav.navigate(["shop/order", order.transId]).then(() => {
            // window.location.reload();
          });
        }
        if (this.authService.getShopMode() === 'Grocery') {
          this.routeNav.navigate(["shop/order-grocery", order.transId]).then(() => {
            // window.location.reload();
          });

        }
      });
    }
    else {
      if (this.authService.getShopMode() === 'FnB') {
        this.routeNav.navigate(["shop/order", order.transId]).then(() => {
          // window.location.reload();
        });
      }
      if (this.authService.getShopMode() === 'Grocery') {
        this.routeNav.navigate(["shop/order-grocery", order.transId]).then(() => {
          // window.location.reload();
        });

      }

    }


    // this.routeNav.navigate(["shop/order/", order.transId]);

  }


  // ExchangeOrder(order: Order) {
  //   debugger;

  //   // ['MyCompB', {id: "someId", id2: "another ID"}]
  //   // this.routeNav.navigate(["shop/bills/exchange", order.transId, order.companyCode, order.storeId]);
  //   this.routeNav.navigate(["shop/order/exchange", order.transId]).then(() => {
  //     // window.location.reload();
  //   });
  // }
  checkPermissionOrder(type) {
    let FunctionId = "";
    if(type.toLowerCase() ==="ex")
    {
      FunctionId = "Spc_ExchangeOrder";
    }
    if(type.toLowerCase()==="return")
    {
      FunctionId = "Spc_ReturnOrder";
    }
    let checkAction =  this.authService.checkRole(FunctionId , '', 'I' );
    let checkApprovalRequire =  this.authService.checkRole(FunctionId , '', 'A' );
    if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
    {
      checkAction = false;
    }
    if(checkAction)
    {
      if(type.toLowerCase() ==="ex")
      {
        this.ExchangeOrder(this.order);
      }
      if(type.toLowerCase()==="return")
      {
        this.ReturnOrder(this.order);
      }
    }
    else
    {
      // const initialState = {
      //   title: 'Permission denied',
      //   };
        let permissionModel= { functionId: FunctionId, functionName: "Return / Exchange Order", controlId: '', permission: 'I'};
        const initialState = {
            title: type + ' - ' + 'Permission denied', freeApprove : true,
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
          if(received.isClose)
          {
            modalApprovalRef.hide();
          }
          else
          {
            debugger;

            if(type.toLowerCase() ==="ex")
            {
              this.ExchangeOrder(this.order);
            }
            if(type.toLowerCase()==="return")
            {
              this.ReturnOrder(this.order);
            }
            modalApprovalRef.hide();
           
            let code = (received.customCode ?? '');
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
            //         title: 'Return / Exchange Order',
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
  
  ReturnOrder(order: Order) {
    debugger;
    let basket = this.basketService.getCurrentBasket();
    if (basket !== null && basket !== undefined) {
      this.basketService.deleteBasket(basket).subscribe(() => {
        debugger;
        if (this.authService.getShopMode() === 'FnB') {
          this.routeNav.navigate(["shop/return", order.transId]).then(() => {
            // window.location.reload();
          });
        }
        if (this.authService.getShopMode() === 'Grocery') {
          this.routeNav.navigate(["shop/order-grocery/return", order.transId]).then(() => {
            // window.location.reload();
          });

        }
        // ['MyCompB', {id: "someId", id2: "another ID"}]
        //  this.routeNav.navigate(["shop/return", order.transId, order.companyCode, order.storeId]);
        // this.routeNav.navigate(["shop/return", order.transId]).then(() => {
        //   window.location.reload();
        // });
      })
    }
    else {
      if (this.authService.getShopMode() === 'FnB') {
        this.routeNav.navigate(["shop/return", order.transId]).then(() => {
          // window.location.reload();
        });
      }
      if (this.authService.getShopMode() === 'Grocery') {
        this.routeNav.navigate(["shop/order-grocery/return", order.transId]).then(() => {
          // window.location.reload();
        });

      }
      // this.routeNav.navigate(["shop/return", order.transId]).then(() => {
      //   window.location.reload();
      // });
    }

  }

  confirmPayooOrder() {


    let storeClient = this.authService.getStoreClient();
    if (storeClient !== null && storeClient !== undefined) {
      this.order.terminalId = this.authService.getStoreClient().publicIP;
    }
    else {
      this.order.terminalId = this.authService.getLocalIP();
    }
    if (this.order.terminalId !== null && this.order.terminalId !== undefined && this.order.terminalId !== '') {
      let shift = this.shiftService.getCurrentShip();
      if (shift !== null && shift !== undefined) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to confirm bill!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            debugger;
            this.order.shiftId = shift.shiftId;
            this.order.modifiedBy = this.authService.getCurrentInfor().username;
            // this.order.terminalId = this.authService.getLocalIP(); 
            this.billService.confirmPayooOrder(this.order).subscribe((response: any) => {
              if (response.success) {

                this.alertify.success('Confirm completed successfully. ' + response.message);
                window.location.reload();
              }
              else {
                this.alertify.warning('Confirm failed. Message: ' + response.message);
              }
            })
          }
        });
      }
      else {
        this.alertify.warning("Not in shift. Please create / load shift.");
      }
    }
    else {
      this.alertify.warning("Counter ID can't null please mapping value in Store Counter");
    }


  }
}


export class BasketPayment {
  // charged: number= 0;
  totalAmount: number = 0;
  totalCollected: number = 0;
  changeAmount: number = 0;
  leftAmount: number = 0;
  chargableAmount: number = 0;
  discountAmount: number = 0;
}

export class RejectBillHRV {
  reason: string = "customer";
  restock: boolean = true;
  email: boolean = true;
  note: string = "";
}