import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { MDenomination } from 'src/app/_models/denomination';
import { TInvoiceHeader, TInvoiceLine, TInvoiceLineSerial } from 'src/app/_models/invoice';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { Payment } from 'src/app/_models/payment';
import { MPaymentMethod } from 'src/app/_models/paymentmethod';
import { MStore } from 'src/app/_models/store';
import { IBasket, IBasketTotal } from 'src/app/_models/system/basket';
import { TSalesHeader } from 'src/app/_models/tsaleheader';
import { TSalesPayment } from 'src/app/_models/tsalepayment';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { StorePaymentViewModel } from 'src/app/_models/viewmodel/storepayment';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { BillService } from 'src/app/_services/data/bill.service';  
import { PrepaidcardService } from 'src/app/_services/data/prepaidcard.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { StorePaymentService } from 'src/app/_services/data/store-payment.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InvoiceService } from 'src/app/_services/transaction/invoice.service';
import { VoucherService } from 'src/app/_services/transaction/voucher.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-checkout-payment',
  templateUrl: './shop-checkout-payment.component.html',
  styleUrls: ['./shop-checkout-payment.component.scss']
})
export class ShopCheckoutPaymentComponent implements OnInit {
 
  modalRef: BsModalRef;
  showModal: boolean= false;
  // order: TSalesHeader;
  discountModalShow: boolean = false;
  order: Order; 
 
  constructor(private alertify: AlertifyService,    private invoiceService: InvoiceService,private billService: BillService,
   private shiftService: ShiftService,   private basketService: BasketService, public commonService: CommonService, 
    public authService: AuthService, private voucherService: VoucherService , private prepaidCardService: PrepaidcardService, private storePaymentService: StorePaymentService,
    //  private shiftService: ShiftService, 
      
    private route: ActivatedRoute,private modalService: BsModalService, private router: Router) {
      this.order = new Order();
     }
  ngAfterViewInit()
  {
    // this.invoice = new TInvoiceHeader();
    // debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function(item) {
      // Do stuff here
        if(item !== null && item !== undefined)
        {
          item.classList.add('hide');
          // console.log('check out payment');
        }
    });
    // paymentMenu
  
  }
  getNewCode()
  {
    this.invoiceService.getNewOrderCode(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).subscribe(data => {
      console.log(data);
      this.order.transId = data;
    }); 
    
  }
  checkLine()
  {
    this.order.lines.forEach(line => {
      if(line.openQty>line.quantity)
      {
        return false;
      } 
    });
    return true;
  }
  saveEntityNew(value)
  {
    debugger;
    if(value === true)
    {
    // let basket= this.basketService.getCurrentBasket();
        if(this.order.posType==="Event")
        {
          if(!this.checkLine())
          {
            this.alertify.warning("check Open qty ");
          }
          else
          {
            this.saveModel();
          
          }
          
        }
        else
        {
          this.saveModel();
        }
      }
      else {
      this.modalRef.hide();
      // this.loadShortcut();
    }
  }
  saveEntity()
  {
    debugger;
    // let basket= this.basketService.getCurrentBasket();
    if(this.order.posType==="Event")
    {
      if(!this.checkLine())
      {
        this.alertify.warning("check Open qty ");
      }
      else
      {
        this.saveModel();
      
      }
       
    }
    else
    {
      this.saveModel();
    }
    
  }
  filterNotBOMBasket(items)
  {
    //
    if(items!==null&& items!==undefined)
    { 
      // debugger;
      let rs = items.filter(x=>x?.bomId==='' || x?.bomId===null);
      // console.log(rs);
      return rs;
    }
  
  }

  filterNotBOM(items: TInvoiceLine[] )
  {
    // debugger;
    if(items!==null&& items!==undefined)
    {
      let rs = items.filter(x=>x.bomId==='' || x.bomId===null);
      // console.log(rs);
      return rs;
    }
  
  }
  print()
  {
    this.router.navigate(["shop/bills/checkout-summary-print", this.order.transId, this.order.contractNo, this.order.companyCode, this.order.storeId]);
  }

  backpage()
  {

    this.router.navigate(["shop/bills/checkout", this.order.transId, this.order.companyCode, this.order.storeId]);
  }

  filterBOM(items: TInvoiceLine[], itemCode, uomCode )
  {
    // debugger;
    if(items!==null&& items!==undefined)
    {
      let rs = items.filter(x=>x.bomId===itemCode);
    return rs;
    }
   
  }
  filterSerial(items: TInvoiceLineSerial[], itemCode, uomCode )
  {
    if(items!==null&& items!==undefined)
    {
      let rs = items.filter(x=>x.itemCode===itemCode&&x.uomCode===uomCode);
      return rs;
    }
   
    // debugger;
  
  }
  items: ItemViewModel[]; 
  selectedCateFilter: string ="";
  merchandiseList: MMerchandiseCategory[];
  // pagination: Pagination;
  userParams: any = {};
  // @HostListener('window:beforeunload', ['$event'])
  
  isVirtualKey = false;
  createNewOrder()
  {
    this.router.navigate(["shop/order/", "checkout" , this.order.contractNo]);
  }


  saveModel()
  {
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
    if(shift!==null && shift!==undefined)
    {
      this.order.shiftId = this.shiftService.getCurrentShip().shiftId; 
      this.order.dataSource = 'POS';
      this.order.createdBy = this.authService.getCurrentInfor().username;
      let basket = this.basketService.getCurrentBasket();
      let payments = basket.payments;  
       payments = payments.filter(x=> x.isPaid !== true);
       if (payments !== null && payments !== undefined && payments.length > 0) { 
         this.order.shiftId = shift.shiftId;
         this.order.dataSource = 'POS';
         this.order.createdBy = this.authService.getCurrentInfor().username;
         // this.order.counterId=
         this.order.payments = [];
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
         this.billService.addPayment(this.order).subscribe((response:any)=>{
          if(response.success)
          { 
            this.alertify.success('Payment completed successfully.'); 
            setTimeout(() => {
              // this.basketService.changeCustomer(data, currentType);
              // this.route.navigate(['/shop/order']);
                window.location.reload();
              }, 2);     
            // this.router.navigate(["shop/invoices", response.message, this.invoice.companyCode, this.invoice.storeId]);
          }
          else
          {
           this.alertify.warning('Payment failed. Message: ' + response.message);
          }
         });
        }
        else
        {
          this.alertify.warning('Payments is empty.');
        }
    
    }
    else
    {
      this.alertify.warning("Not in shift. Please create / load shift.");
    }
    
   
    
  }
   
  onSerialBlurMethod(item, serialItem, value)
  {
    // debugger;
    console.log("onSerialBlurMethod");
    if(value===null || value===undefined || value.toString()=="undefined" || value.toString()=="")
    {
      value=0;
    }
     let itemX = item.serialLines.find(x=>x.serialNum === serialItem.serialNum);
     itemX.quantity= value;
    let qty= item.serialLines.reduce((a, b) => parseInt(b.quantity)   + a, 0);
    item.quantity= qty;
  }
  VirtualKey$: Observable<boolean>;
  storeSelected: MStore;
  private paymentTotal = new BehaviorSubject<BasketPayment>(null);
  paymentTotal$ = this.paymentTotal.asObservable();
  maxvalue="";
  loadDiscountData()
  {
    let format = this.authService.loadFormat();
    let decimalPlacesFormat = 2;
    if(format!==null && format!==undefined)
    {
      let checkFm = format.decimalPlacesFormat;
      if(checkFm !== null && checkFm !== undefined && checkFm !== '')
      {
        decimalPlacesFormat = parseInt(checkFm);
      }
    }
    this.order.lines.forEach(line => {
      // debugger;
      let rate = line.discountRate;
      let calPrice =  line.price -( this.authService.roundingValue(line.price * (rate /100), "RoundUp", decimalPlacesFormat) ?? 0);
      line.promoPrice = this.authService.roundingValue(calPrice , "RoundUp", decimalPlacesFormat) ; 
      let calLineTotal =  line.promoPrice * (line?.checkedQty ?? line?.quantity) ;
      line.promoLineTotal = this.authService.roundingValue(calLineTotal , "RoundUp", decimalPlacesFormat)  ;
    });

    // this.order.lines.forEach(line => {
    //   // debugger;
    //   let rate = line.discountRate;
    //   let calPrice =  line.price -(  (line.price * (rate /100) ) ?? 0);
    //   line.promoPrice = this.authService.roundingAmount(calPrice) ; 
    //   let calLineTotal =  line.promoPrice * (line?.checkedQty ?? line?.quantity) ;
    //   line.promoLineTotal = this.authService.roundingAmount(calLineTotal)  ;
    // });
  }
  basket$: Observable<IBasket>;
  basketTotal$: Observable<IBasketTotal>;

  ngOnInit() {


    this.VirtualKey$ = this.commonService.VirtualKey$;
    this.storeSelected= this.authService.storeSelected();
     
    this.route.data.subscribe(data => {
      this.order = data['invoice'].data;
    });

    this.basket$ = this.basketService.basket$;
    this.basketTotal$ = this.basketService.basketTotal$;
    // this.basketDiscountTotal$ = this.basketService.basketTotalDiscount$;

    var orderClone: Order = null; 
    orderClone = Object.assign({},  this.order);
    let lines = orderClone.lines.filter(x => (x.bomId ?? '') === '');
    lines.forEach(line => {
        let bomlines = orderClone.lines.filter(x => (x.bomId ?? '') === line.itemCode);
        line.lines = [];
        line.lines = bomlines;
     });
     orderClone.lines = lines;
    // orderClone.payments = this.chargedPayment;// orderClone.contractPayments;
    this.basketService.orderToBasket(orderClone, false, true, "AddPayment", null, null, true, true); 

    // this.loadDiscountData();

    
    // this.order.payments.forEach(payment => {
    //   payment.isRemove = false;
    // });

    // this.paymentTotal$ = this.paymentTotal$;
    // this.calculateTotalFirst();
    
    // this.storePaymentService.getByStore(this.storeSelected.companyCode, this.storeSelected.storeId, '').subscribe((res: any) => {
    //   debugger;
    //   if(res.success)
    //   {
    //     this.paymentMethodShowList = res.data.filter(x=>x.status === "A" && x.isShow === true);
    //     this.paymentMethodShowList = this.paymentMethodShowList.slice(0,3);
    //     this.paymentMethodOtherList = res.data.filter(x=>x.status === "A" && x.isShow === false);
    //   }
    //   else
    //   {
    //     this.alertify.warning(res.message);

    //   }
   
   
    // }, error => {
    //   this.alertify.error(error);
    // });
    // this.maxvalue = this.authService.getmaxValueCurrency();
    // this.chargedPayment = this.order.payments;
    // this.order.payments=[];
     
    // console.log(this.order);
    // this.loadDenolist();


    
  }
  denolist: MDenomination[]
  loadDenolist() {
    this.denolist = this.authService.getDenomination();
    // console.log(this.denolist);
  }
  chargedPayment: TSalesPayment[]=[];
  
  payment: TSalesPayment;
  selectedRow : number  ;
  enableEdit = false;
  enableEditIndex = null;
  amountCharge: string ="";
  
  inputType: string ="";
  refInput: string ="";
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
 
  
  removePayment(payment: TSalesPayment)
  {
    // debugger;
    // this.removePayment(payment);
    this.order.payments = this.order.payments.filter(x=>x.lineId!==payment.lineId)
    
    this.selectedRow = null;
    this.amountCharge =null; 
    this.payment = null;
    this.inputType ="";
    this.calculateTotal();
  }
  clearAmount(i, payment: Payment)
  {
    console.log("clearAmount");
    this.amountCharge = "";
  }
  isShowOtherPayment: boolean= false;
  showOtherPayment()
  {
    this.isShowOtherPayment = !this.isShowOtherPayment;

  }
  closeOtherPad()
  {
    this.isShowOtherPayment = !this.isShowOtherPayment;
  }
  addPayment(payment: MPaymentMethod, isClose?: boolean, isRequire?: boolean)
  {
    debugger;
    this.isPayment=true;
    let companyCode= this.storeSelected.companyCode;
    let paymentId = payment.paymentCode;
    if(isRequire)
    {
      if(paymentId==="PrepaidCard")
      {
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
            this.prepaidCardService.getItem(companyCode, result.value).subscribe((response: any)=>{
              if(response.success)
              {
                if(response.data!==null) 
                {
                   
                    this.amountCharge = "";
                    let amountLeft = this.paymentTotal.value.leftAmount;
             
                    if(amountLeft <= 0)
                    {
                      this.alertify.warning("Can't add new payment to bill.");
                    }
                    else
                    {
                    
                      // console.log(response);
                      this.payment = new TSalesPayment();
                      // let paymentX = new Payment();
                      // .id=
                      this.payment.isRequire = isRequire;
                      this.payment.paymentCode = paymentId;
                      this.payment.refNumber = result.value.toString();
                      this.payment.paymentDiscount = 0;
                      // this.payment.collectedAmount = result.value.toString();
                      this.payment.totalAmt = 0 ;
                      this.payment.chargableAmount =  amountLeft;//this.basketService.getAmountLeft();
                      this.payment.receivedAmt = 0 ;
                      this.payment.mainBalance = response.data.mainBalance===null || response.data.mainBalance===undefined ? 0 : response.data.mainBalance ;
                      this.payment.subBalance = response.data.subBalance===null || response.data.subBalance===undefined ? 0 : response.data.subBalance;
                      // this.payment.paymentCharged = 0;// this.basketService.getAmountLeft();
                      
                      let linenum = this.order.payments.length + 1;
                      this.payment.lineId= linenum.toString() ;
                      // this.payment = payment;
                      // this.paymentCharge.next(payment);
                      // this.basketService.changePaymentCharge(this.payment); 
                      // this.basketService.addPaymentToBasket(this.payment);
                      this.addPaymentToBasket(this.payment);
                      var payments= this.order.payments;
                      if(payments.length > 0)
                      {
                        this.selectedRow = this.order.payments.length - 1;
                        this.setClickedRow(this.selectedRow, this.payment, "");
                        for(let i = 0; i < payments.length ; i++)
                        {
                          if(payments[i].paymentCode === paymentId)
                          {
                            this.selectedRow = i;
                            this.setClickedRow(this.selectedRow, this.payment, "");
                          }
                        }
                      
                      }
                      else{
                        this.selectedRow =0;
                      }
                      if(isClose)
                      {
                        this.closeOtherPad();
                      }
                     
                    }
                  
                  // }
                }
                else
                {
                  this.alertify.warning("Card No not found");
                }
              }
              else
              {
                this.alertify.warning(response.message);
              }
             
            })
            
          }
          
        })
        
      }
      if(paymentId==="Voucher")
      {
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
            this.voucherService.getByCode(companyCode,'' , result.value, '').subscribe((response: any)=>{
              if(response.success) 
              {
                debugger;
                if(response.code===0)
                {
                  let numCollected =0;
                  if(this.payment!==null)
                  {
                    let paymentX = this.order.payments.find(x=>x.paymentCode === this.payment.paymentCode);
                    if(paymentX!== null && paymentX !== undefined)
                    {
                      numCollected = paymentX.collectedAmount;
                    } 
                  } 
                  if(this.payment!==null && numCollected == 0)
                  {
                    this.alertify.warning("Please Complete progress payment " + this.payment.paymentCode + "!");
                  }
                  else
                  {
                    this.amountCharge = "";
                    let amountLeft = this.basketService.getAmountLeft();
              
                    if(amountLeft <= 0)
                    {
                      this.alertify.warning("Can't add new payment to bill.");
                    }
                    else
                    {
                      
                      this.payment = new TSalesPayment();
                    
                      this.payment.isRequire = isRequire;
                      this.payment.paymentCode = paymentId;
                      this.payment.refNumber = result.value.toString();
                      this.payment.paymentDiscount = 0;
                      this.payment.totalAmt = 0; 
                      this.payment.chargableAmount =  this.basketService.getAmountLeft(); 

                      // let linenum = this.basketService.getCurrentBasket().payments.length + 1;
                      // this.payment.lineNum= linenum;

                      let linenum = this.order.payments.length + 1;
                      this.payment.lineId= linenum.toString() ;
                      debugger;
                      if(payments.length > 0)
                      {
                        this.selectedRow = this.order.payments.length - 1;
                        this.setClickedRow(this.selectedRow, this.payment, "");
                        for(let i = 0; i < payments.length ; i++)
                        {
                          if(payments[i].paymentCode === paymentId)
                          {
                            this.selectedRow = i;
                            this.setClickedRow(this.selectedRow, this.payment, "");
                          }
                        }
                      
                      }
                      else{
                        this.selectedRow =0;
                      }
                      if(isClose)
                      {
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
                else
                {
                  this.alertify.warning(response.message);
                }
              }
              else
              {
                this.alertify.warning(response.message);
              }
            })
            // result.value
            
          }
          
        })
        
      }

      
    }
    else
    {
      
      let numCollected =0;
      if(this.payment!==null)
      {
        let paymentX = this.order.payments.find(x=>x.paymentCode === payment.paymentCode);
        if(paymentX!== null && paymentX !== undefined)
        {
          numCollected = paymentX.collectedAmount;
        } 
      } 
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
        // if(amountLeft <= 0)
        // {
        //   this.alertify.warning("Can't add new payment to bill.");
        // }
        // else
        // {
          debugger;
          this.payment = new TSalesPayment();
          // let paymentX = new Payment();
          // .id=
          this.payment.isRequire = isRequire;
          this.payment.paymentCode = paymentId;
          this.payment.refNumber ="";
          this.payment.paymentDiscount = 0;
          this.payment.totalAmt = 0 ;
          // this.paymentTotal
          this.payment.chargableAmount =  amountLeft;//this.basketService.getAmountLeft();
          // this.basketTotal$.subscribe(data => {
          //   console.log(data);
          //   this.payment.paymentCharged  = data.subtotal - data.totalAmount;
          // });
          let linenum = this.order.payments.length + 1;
          this.payment.lineId= linenum.toString() ;
          // this.payment = payment;
          // this.paymentCharge.next(payment);
          // this.basketService.changePaymentCharge(this.payment); 
          // this.basketService.addPaymentToBasket(this.payment);
          this.addPaymentToBasket(this.payment);
          var payments= this.order.payments;
          if(payments.length > 0)
          {
            this.selectedRow = this.order.payments.length - 1;
            this.setClickedRow(this.selectedRow, this.payment, "");
            for(let i = 0; i < payments.length ; i++)
            {
              if(payments[i].paymentCode === paymentId)
              {
                this.selectedRow = i;
                this.setClickedRow(this.selectedRow, this.payment, "");
              }
            }
          
          }
          else{
            this.selectedRow =0;
          }
          if(isClose)
          {
            this.closeOtherPad();
          }
        // }
      
      // }
    }
   
  }
  isPayment=false;
  isFastClick = false;
  pressKey(key: string) {
    // debugger;
    console.log("pressKey"); 
    let billTotal=0;
    this.paymentTotal$.subscribe((data: any)=>{
        console.log(data);
        billTotal= data.chargableAmount;
    })
    if(this.inputType==="refNum")
    {
       this.payment.refNumber+=key;
       let basket = this.basketService.getCurrentBasket();
       this.basketService.setBasket(basket);
    }
    else
    {
     
      if(this.isFastClick)
      {
        this.amountCharge = "";
      }
      if(this.amountCharge === null || this.amountCharge === undefined)
      {
        this.amountCharge = "";
      }
      this.isFastClick = false;
      debugger;
      let amountLeft = this.paymentTotal.value.leftAmount;
      if(this.maxvalue === "null" || this.maxvalue === "undefined" )
      {
        this.maxvalue = null;
      }
      if(this.maxvalue!==null && this.maxvalue!==undefined)
      {
        // basket.to
        let checkAmt=this.amountCharge + key;

        // if(parseInt(checkAmt)-billTotal > parseInt(this.maxvalue) && amountLeft <=0 )
        // {
        //     this.alertify.warning("can't add num");
        // }
        // else
        // {
          if(key==="000")
          {
            this.amountCharge = this.payment.chargableAmount.toString();
            
          }
          else
          {  
            this.amountCharge += key;
          } 
          if(this.payment.paymentCode==='PrepaidCard')
          {
            let balance= parseFloat(this.payment.mainBalance.toString()) + parseFloat(this.payment.subBalance.toString());
            if(parseFloat(this.amountCharge) > balance)
            {
              if(balance > 0 && balance < parseFloat(this.amountCharge))
              {
                this.addPaymentToBasket(this.payment, balance);
              }
              else
              {
                this.alertify.warning("Unavailable balance");
              }
            }
            else
            { 
                this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge)); 
            }
          }
          else
          {
            this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
          }
        // }
      }
      else
      {
          
        debugger;
        if(key==="000")
        {
          this.amountCharge = this.payment.chargableAmount.toString();
          
        }
        else
        { 
        
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
 
inputNumFix(num: string, isDemo) {

  // console.log("clearAmount");
  if(num!==null && num!==undefined && num!=="")
  {
    num=num;
    num=num.toString().split(',').join('');
  }
  else
  {
    num="0";
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

  if(this.maxvalue === "null" || this.maxvalue === "undefined" )
  {
    this.maxvalue = null;
  }
  if(this.maxvalue!==null && this.maxvalue!==undefined)
  {
    let checkAmt=  num;

    // if(parseInt(checkAmt)-billTotal > parseInt(this.maxvalue)  )
    // {
    //     this.alertify.warning("can't add num");
    //     this.amountCharge = this.amountCharge.substr(0, checkAmt.length -1);
    //     this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
    // }
    // else {
      let value = 0;
      if(isDemo===true)
      {
        let currentX = this.amountCharge === "" ? 0 : parseFloat(this.amountCharge);
        let numX = num === "" ? 0 : parseFloat(num);
      
        value = currentX + numX;
      }
      else
      {
        let  valuetmp =  num === "" ? "0" :num;
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
 

  addPaymentToBasket(payment: TSalesPayment, paymentCharged = 0 ) {
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
 private addOrUpdatePayment( payments: TSalesPayment[], paymenttoAdd: TSalesPayment, paymentTotal: number): TSalesPayment[] {
   debugger;
   console.log(payments);
   const totalBasket = this.paymentTotal;
  //  const totalPaymentBasket = this.basketPaymentTotal;
   const index = payments.findIndex((i) => i.paymentCode === paymenttoAdd.paymentCode && i.lineId === paymenttoAdd.lineId);
   if (index === -1) {
    paymenttoAdd.collectedAmount = paymentTotal;
    paymenttoAdd.chargableAmount =  totalBasket.value.totalAmount - totalBasket.value.discountAmount - totalBasket.value.totalCollected;// (totalBasket.value.totalAmount - totalBasket.value.leftAmount) ;
    paymenttoAdd.totalAmt = paymentTotal;
    //  paymenttoAdd.collectedAmount = paymentTotal;
    //  paymenttoAdd.chargableAmount = totalBasket.value.totalAmount   - totalBasket.value.totalCollected; 
     payments.push(paymenttoAdd);
   } else {
     payments[index].collectedAmount = paymentTotal;
      
   }
   return payments;
 }
   
  // addPaymentTo(payment: Payment, paymentCharged = 0 ) {
    
  //   const paymentAdd: IBasketPayment = this.mapPaymenttoBasket(
  //     payment,
  //     paymentCharged
  //   );
 
  //   let basket = this.getCurrentBasket();
    
     
  //   if (paymentAdd.id !== null) {
  //     basket.payments = this.addOrUpdatePayment(
  //       basket.payments,
  //       paymentAdd,
  //       paymentCharged
  //     );
     
  //     this.refreshPayment(basket.payments);  
     
  //     this.setBasket(basket);
     
  // }
  // addPayment(paymentId: string)
  // {
   
  //   this.amountCharge = "";
  //   this.payment = new TSalesPayment();
    
  //   this.payment.paymentCode = paymentId;
  //   this.payment.refNumber ="";
  //   this.payment.paymentDiscount = 0;
  //   this.payment.chargableAmount = 0 ;
  //   this.payment.collectedAmount = 0;
  //   debugger;
     
  //   this.addPaymentToBasket(this.payment);
  //   var payments= this.order.payments;
  //   if(payments.length > 0)
  //   {
  //     this.selectedRow = this.order.payments.length - 1;
  //     this.setClickedRow(this.selectedRow, this.payment);
  //     for(let i = 0; i < payments.length ; i++)
  //     {
  //       if(payments[i].paymentCode === paymentId)
  //       {
  //         this.selectedRow = i;
  //         this.setClickedRow(this.selectedRow, this.payment);
  //       }
  //     }
     
  //   }
  //   else{
  //     this.selectedRow =0;
  //   }
     
  // }  
   
  calculateTotalFirst()
  {
    debugger;
    let oriTotalAmount =  this.authService.roundingAmount(this.order.lines.reduce((a, b) =>  ((b?.checkedQty ?? b?.quantity) * b?.price) + a, 0));
    let oriDiscountAmount =  this.authService.roundingAmount( this.order.totalDiscountAmt);
    let totalAmount =  this.authService.roundingAmount(this.order.lines.reduce((a, b) =>  ((b?.checkedQty ?? b?.quantity) * (b?.promoPrice ?? b?.price) ) + a, 0));
    let totalCollected =  this.authService.roundingAmount(this.order.payments.reduce((a, b) => b.collectedAmount + a, 0));
    this.orderTotalAmt=totalAmount;
    this.orderTotalCollected=totalCollected; 
    // this.orderchargableAmt = totalAmount- totalCollected;
    if(totalAmount - this.order.payments.reduce((a, b) => b.collectedAmount + a, 0) > 0)
    {
      this.orderchangeAmt = 0 ;
      this.orderLeftAmt= totalAmount - this.order.payments.reduce((a, b) => b.collectedAmount + a, 0);
    }
    else{
      this.orderchangeAmt=  this.authService.roundingAmount( - (totalAmount - this.order.payments.reduce((a, b) => b.collectedAmount + a, 0)));
      this.orderLeftAmt= 0;
    }
    // this.orderLeftAmt=0;
    this.orderchargableAmt =  this.authService.roundingAmount(this.orderLeftAmt);
    
    let discountAmount = 0; ;
    let chargableAmount =  this.authService.roundingAmount(this.orderchargableAmt - discountAmount);
    let changeAmount=  this.authService.roundingAmount( totalCollected - totalAmount);
    let leftAmount = chargableAmount;
    if(leftAmount > 0)
    {
      this.isPayment=true;
    }
    this.orderchargableAmt = leftAmount;
    this.paymentTotal.next({oriTotalAmount, oriDiscountAmount ,totalAmount,  totalCollected, changeAmount, leftAmount, chargableAmount, discountAmount});
  }
  // calculateTotalFirst()
  // {
  //   debugger;
  //   let totalAmount = this.order.lines.reduce((a, b) =>  (b?.checkedQty * b?.price ) + a, 0);
  //   let totalCollected = this.order.payments.reduce((a, b) => b.collectedAmount + a, 0);
  //   this.orderTotalAmt=totalAmount;
  //   this.orderTotalCollected=totalCollected; 
  //   // this.orderchargableAmt = totalAmount- totalCollected;
  //   if(totalAmount - this.order.payments.reduce((a, b) => b.collectedAmount + a, 0) > 0)
  //   {
  //     this.orderchangeAmt = 0 ;
  //     this.orderLeftAmt= totalAmount - this.order.payments.reduce((a, b) => b.collectedAmount + a, 0);
  //   }
  //   else{
  //     this.orderchangeAmt=  - (totalAmount - this.order.payments.reduce((a, b) => b.collectedAmount + a, 0));
  //     this.orderLeftAmt= 0;
  //   }
  //   // this.orderLeftAmt=0;
  //   this.orderchargableAmt = this.orderLeftAmt;
  //   let leftAmount = this.orderLeftAmt;
  //   if(leftAmount > 0)
  //   {
  //     this.isPayment=true;
  //   }
  //   let chargableAmount = this.orderchargableAmt;
  //   let changeAmount= 0;
  //   let discountAmount =0;
  //   this.paymentTotal.next({totalAmount,  totalCollected, changeAmount, leftAmount, chargableAmount, discountAmount});
  // }
  orderTotalAmt=0;
  orderTotalCollected=0;
  orderLeftAmt =0;
  orderchangeAmt =0;
  orderchargableAmt =0;
  // calculateTotal()
  // {
  //   debugger;
  //   let orderTotalAmt = this.orderTotalAmt;
  //   let orderTotalCollected = this.orderTotalCollected; 
  //   let orderchangeAmt = this.orderchangeAmt ; 
  //   let orderLeftAmt = this.orderLeftAmt;
  //   let orderchargableAmt =this.orderchargableAmt;
  //   let totalAmount = this.order.lines.reduce((a, b) =>  (b?.checkedQty * b?.price ) + a, 0);
  //   let totalCollected = this.order.payments.reduce((a, b) => b.collectedAmount + a, 0) + this.orderTotalCollected;
  //   let changeAmount= 0;
  //   let leftAmount= 0;
  //   let chargableAmount= orderchargableAmt;
  //   let discountAmount=0;
  //   // orderTotalCollected + 
  //   // let Left=0;
  //   if(totalAmount - totalCollected > 0)
  //   {
  //     changeAmount= 0 ;
  //     leftAmount= totalAmount  - totalCollected;
  //   }
  //   else{
  //     changeAmount=  - (totalAmount  - totalCollected);
  //     leftAmount= 0;
  //   }
  //   // totalAmount: number= 0;
  //   // totalCollected: number =0;
  //   // ChangeAmount: number =0;
  //   // LeftAmount: number =0;
  //   this.paymentTotal.next({totalAmount,  totalCollected, changeAmount, leftAmount, chargableAmount, discountAmount});
    
  // }
  
 calculateTotal()
 {
   debugger;
  //  let orderTotalAmt = this.orderTotalAmt;
  //  let orderTotalCollected = this.orderTotalCollected; 
  //  let orderchangeAmt = this.orderchangeAmt ; 
  //  let orderLeftAmt = this.orderLeftAmt;
  let oriTotalAmount =  this.authService.roundingAmount(this.order.lines.reduce((a, b) =>  ((b?.checkedQty ?? b?.quantity) * b?.price) + a, 0));
  let oriDiscountAmount =  this.authService.roundingAmount(this.order.totalDiscountAmt);
   let orderchargableAmt = this.authService.roundingAmount(this.orderchargableAmt);
   let totalAmount =  this.authService.roundingAmount(this.order.lines.reduce((a, b) =>  ((b?.checkedQty ?? b?.quantity) *  (b?.promoPrice ?? b?.price)  ) + a, 0));
   let totalCollected =  this.authService.roundingAmount(this.order.payments.reduce((a, b) => b.collectedAmount + a, 0) + this.orderTotalCollected);
   let changeAmount= 0;
   let leftAmount= 0;
   let chargableAmount= orderchargableAmt;
   let discountAmount= 0;// this.order.totalDiscountAmt;
   // orderTotalCollected + 
   // let Left=0;
   if(totalAmount - discountAmount - totalCollected > 0)
   {
     changeAmount= 0 ;
     leftAmount= this.authService.roundingAmount( totalAmount  - totalCollected - discountAmount);
   }
   else{
     changeAmount= this.authService.roundingAmount( Math.abs(totalAmount  - discountAmount - totalCollected));
     leftAmount= 0;
   }
   // totalAmount: number= 0;
   // totalCollected: number =0;
   // ChangeAmount: number =0;
   // LeftAmount: number =0;
   this.paymentTotal.next({oriTotalAmount, oriDiscountAmount, totalAmount,  totalCollected, changeAmount, leftAmount, chargableAmount, discountAmount});
   
 }
  orderId="";


  @ViewChild('ManualPromotion' , { static: false}) ManualPromotion;  
  @ViewChild('template' , { static: false}) template;  
  checkOutAction(result: any)
  {
    // debugger;
    if(result==="ShowPayment")
    {
      this.modalRef = this.modalService.show(this.template);
    }
    if(result==="CheckOut")
    {
       this.saveEntity();
    }
    if(result==="ShowDiscount")
    {
      this.modalRef = this.modalService.show(this.ManualPromotion);
    }
  }
   
  openPaymentModal(template: TemplateRef<any>) {
    this.showModal = true;
    debugger;
    // var orderClone: Order = null; 
    // orderClone = Object.assign({},  this.order);
    // orderClone.payments = this.chargedPayment;// orderClone.contractPayments;
    //  this.basketService.orderToBasket(orderClone, true, "AddPayment", null, null, true, true);
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
    this.order.payments = [];
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
  
}
export class BasketPayment{
  // charged: number= 0;
  oriTotalAmount: number= 0;
  oriDiscountAmount: number= 0; 
  totalAmount: number= 0; 
  totalCollected: number =0;
  changeAmount: number =0;
  leftAmount: number =0;
  chargableAmount: number =0;
  discountAmount: number =0;
}