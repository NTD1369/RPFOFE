import { Component, ElementRef, EventEmitter, NgZone, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Payment } from 'src/app/_models/payment';
import { MPaymentMethod } from 'src/app/_models/paymentmethod';
import { MStore } from 'src/app/_models/store';
import { IBasket, IBasketPayment, IBasketTotal } from 'src/app/_models/system/basket';
import { StorePaymentViewModel } from 'src/app/_models/viewmodel/storepayment';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';  
import { PrepaidcardService } from 'src/app/_services/data/prepaidcard.service';
import { StorePaymentService } from 'src/app/_services/data/store-payment.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { VoucherService } from 'src/app/_services/transaction/voucher.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-tool-payment',
  templateUrl: './shop-tool-payment.component.html',
  styleUrls: ['./shop-tool-payment.component.scss']
})
export class ShopToolPaymentComponent implements OnInit {


  @ViewChildren('input') inputs: QueryList<ElementRef>;
  @ViewChildren('input2') refNumInputs: QueryList<ElementRef>;
  
  setFocus(type: string ,index) {
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      debugger;
      if(type ==="refNum")
      {
        this.refNumInputs.toArray()[index].nativeElement.focus();
      }
      else{
        this.inputs.toArray()[index].nativeElement.focus();
      }
      
    },4); 
   
  }
   stt=0;
  ngAfterContentInit() {
    // debugger;
    this.stt++;
    // console.log(this.stt);
    // this.zone.runOutsideAngular(() => setTimeout(() => {
    //      this.setFocus(this.inputType,this.selectedRow);
    // }, 0));
}
  enableEdit = false;
  enableEditIndex = null;
  amountCharge: string ="";
  selectedRow : number  ;
  inputType: string ="";
  refInput: string ="";
  paymentMethodShowList: StorePaymentViewModel[] = [];
  paymentMethodOtherList: StorePaymentViewModel[] = [];
 setClickedRow(index, payment: Payment, inputType) {
    console.log("setClickedRow");
    this.amountCharge = payment.paymentTotal.toString().split(',').join('');
    this.refInput = payment.refNum;
    this.selectedRow = index;
    this.inputType = inputType;
    this.payment = payment;
    // this.isFastClick = true;
    this.payment.paymentCharged = parseFloat(this.payment.paymentCharged.toString().split(',').join(''));
    // this.payment.paymentDiscount = parseFloat(this.payment.paymentDiscount.toString().replace(',', ''));
    this.payment.paymentTotal = parseFloat(this.payment.paymentTotal.toString().split(',').join(''));
     
    this.basketService.changePaymentCharge(this.payment); 
    // this.setFocus(inputType, index);
    // this.basketService.addPaymentToBasket(this.payment);
  }
  changeValuePayment(value: any, index, payment: Payment, type )
  {
   
    this.selectedRow = index; 
     this.payment = payment;
     if(type==="refNum")
     {
        // this.payment.refNum +=value;

     }
     else
     {
        // this.payment.paymentCharged = parseFloat(this.payment.paymentCharged.toString().replace(',', ''));
    // this.payment.paymentDiscount = parseFloat(this.payment.paymentDiscount.toString().replace(',', ''));
   
      this.payment.paymentTotal = parseFloat(this.payment.paymentTotal.toString().split(',').join(''));
      let str= value.toString().split(',').join('');
      // debugger;
      let valueX = parseFloat(str);
      if(valueX !== this.payment.paymentTotal)
      {
        this.payment.paymentTotal = valueX;
      }
      this.basketService.changePaymentCharge(this.payment); 
      if(value !=="" )
      {
        this.basketService.addPaymentToBasket(this.payment, this.payment.paymentTotal);
  
      }
      else
      {
        this.basketService.addPaymentToBasket(this.payment, 0);
  
      }
     }
    
    // this.setFocus(this.inputType, index);
  }

  removeselect(index, payment: Payment)
  {
    // debugger;
    // this.selectedRow = null; 
    // this.payment = payment;
    // this.basketService.changePaymentCharge(this.payment);
    // this.basketService.addPaymentToBasket(this.payment, this.payment.paymentTotal);
  }
 
   
  enableEditMethod(e, i) {
    debugger;
    this.enableEdit = true;
    this.enableEditIndex = i;
    console.log(i, e);
    this.inputs.toArray()[i].nativeElement.focus();
    // this.input.nativeElement.focus();
  }
   
 
  myDate = new Date();
  orderNo: string ;
  @Output() Modal = new EventEmitter<boolean>();
  constructor(private prepaidCardService: PrepaidcardService, private authService: AuthService, private storePaymentService: StorePaymentService, private basketService: BasketService,  private zone: NgZone, 
     private alertify: AlertifyService , private route: Router, private voucherService: VoucherService) {
    
   } 
   
  basket$: Observable<IBasket>;
  basketTotal$: Observable<IBasketTotal>;
   
  payment: Payment = null; 
  closeModal()
  {
    this.Modal.emit(false);
  }
  ngAfterViewInit() {
    this.stt++;
    console.log(this.stt);
    this.basket$.subscribe(data => {
      // debugger;
      // console.log(this.selectedRow + "_"+this.inputType);
      this.setFocus(this.inputType , this.selectedRow);
      
    });
  }
  maxvalue="";
  storeSelected: MStore;
  ngOnInit() {
    this.storeSelected = this.authService.storeSelected();
    // debugger;
    // this.payment = new Payment(); 
    this.basket$ = this.basketService.basket$;
    this.basketTotal$ = this.basketService.basketTotal$;
    this.storePaymentService.getByStore(this.storeSelected.companyCode, this.storeSelected.storeId,'').subscribe((res: any) => {
        debugger;
        if(res.success)
        {
          this.paymentMethodShowList = res.data.filter(x=>x.status === "A" && x.isShow === true);
          this.paymentMethodOtherList = res.data.filter(x=>x.status === "A" && x.isShow === false);
        }
        else
        {
          this.alertify.warning(res.message);
  
        }
      
     
    }, error => {
      // this.alertify.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Store Payment',
        text: "Can't get data"
      });
    });
    this.maxvalue = this.authService.getmaxValueCurrency();
    // this.basketDiscountTotal$  = this.basketService.basketTotalDiscount$;
    
  }
   
  removePayment(payment: IBasketPayment)
  {
    // debugger;
    this.basketService.removePayment(payment);
    this.selectedRow = null;
    this.amountCharge =null; 
    this.payment = null;
    this.inputType ="";
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
  clearAmountPayment(payment: Payment)
  {
    this.basketService.addPaymentToBasket(payment, 0);
  }
  clearRefNumPayment(payment: Payment)
  {
    this.payment.refNum = "";
  }
  checkCard(cardNo)
  {
    this.prepaidCardService.getItem(this.storeSelected.companyCode, cardNo).subscribe((response: any)=>{
        return response.data;
    })
    
  }
  addPayment(payment: MPaymentMethod, isClose?: boolean, isRequire?: boolean)
  {
    debugger;
    let companyCode= this.storeSelected.companyCode;
    let itemInBasket= this.basketService.getCurrentBasket().items;
    let paymentId = payment.paymentCode;
    // let itemReject = itemInBasket.filter(x=>x.rejectPayType===payment.paymentType);
    let itemReject = itemInBasket.filter(x => x.rejectPayType?.split(',')?.filter(x=>x!==null && x!==undefined && x!== '')?.includes(payment?.paymentType));

    if(itemReject !==null && itemReject!== undefined && itemReject.length > 0)
    {
      this.alertify.warning("Can't add payment "+ payment.paymentCode + " b/c item " + itemReject[0].productName + " has rejeted.");
    }
    else
    {
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
                      let numCollected =0;
                      if(this.payment!==null)
                      {
                        let paymentX = this.basketService.getCurrentBasket().payments.find(x=>x.id === this.payment.id);
                        if(paymentX!== null && paymentX !== undefined)
                        {
                          numCollected = paymentX.paymentTotal;
                        } 
                      } 
                      if(this.payment!==null && numCollected == 0)
                      {
                        // this.alertify.warning("Please Complete progress payment " + this.payment.id + "!");
                        Swal.fire({
                          icon: 'warning',
                          title: 'Payment',
                          text: "Please Complete progress payment " + this.payment.id + "!"
                        });
                      }
                      else
                      {
                        this.amountCharge = "";
                        let amountLeft = this.basketService.getAmountLeft();
                
                        // this.basketService.bas
                        // this.basketTotal$.subscribe(data => {
                        //   debugger;
                        //   console.log(data);
                        //   amountLeft = data.subtotal - data.totalAmount;
                        // });
                        if(amountLeft <= 0)
                        {
                          this.alertify.warning("Can't add new payment to bill.");
                        }
                        else
                        {
                        
                          // console.log(response);
                          this.payment = new Payment();
                          // let paymentX = new Payment();
                          // .id=
                          this.payment.isRequireRefNum = isRequire ;
                          this.payment.id = paymentId;
                          this.payment.refNum = result.value.toString();
                          this.payment.paymentDiscount = 0;
                          this.payment.paymentTotal = 0 ;
                          this.payment.mainBalance = response.data.mainBalance===null || response.data.mainBalance===undefined ? 0 : response.data.mainBalance ;
                          this.payment.subBalance = response.data.subBalance===null || response.data.subBalance===undefined ? 0 : response.data.subBalance;
                          this.payment.paymentCharged =  this.basketService.getAmountLeft();
                          // this.basketTotal$.subscribe(data => {
                          //   console.log(data);
                          //   this.payment.paymentCharged  = data.subtotal - data.totalAmount;
                          // });
                          let linenum = this.basketService.getCurrentBasket().payments.length + 1;
                          this.payment.lineNum= linenum;
                          debugger;
                          this.basketService.changePaymentCharge(this.payment); 
                          this.basketService.addPaymentToBasket(this.payment);
                          var payments= this.basketService.getCurrentPayment();
                          if(payments.length > 0)
                          {
                            this.selectedRow = this.basketService.getCurrentPayment().length - 1;
                            this.setClickedRow(this.selectedRow, this.payment, "");
                            for(let i = 0; i < payments.length ; i++)
                            {
                              if(payments[i].id === paymentId)
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
                      
                      }
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
              // result.value
              
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
                      let paymentX = this.basketService.getCurrentBasket().payments.find(x=>x.id === this.payment.id);
                      if(paymentX!== null && paymentX !== undefined)
                      {
                        numCollected = paymentX.paymentTotal;
                      } 
                    } 
                    if(this.payment!==null && numCollected == 0)
                    {
                      // this.alertify.warning("Please Complete progress payment " + this.payment.id + "!");
                      Swal.fire({
                        icon: 'warning',
                        title: 'Payment',
                        text: "Please Complete progress payment " + this.payment.id + "!"
                      });
                    }
                    else
                    {
                      this.amountCharge = "";
                      let amountLeft = this.basketService.getAmountLeft();
              
                      // this.basketService.bas
                      // this.basketTotal$.subscribe(data => {
                      //   debugger;
                      //   console.log(data);
                      //   amountLeft = data.subtotal - data.totalAmount;
                      // });
                      if(amountLeft <= 0)
                      {
                        this.alertify.warning("Can't add new payment to bill.");
                      }
                      else
                      {
                      
                        // console.log(response);
                        this.payment = new Payment();
                        // let paymentX = new Payment();
                        // .id=
                        this.payment.isRequireRefNum = isRequire ;
                        this.payment.id = paymentId;
                        this.payment.refNum = result.value.toString();
                        this.payment.paymentDiscount = 0;
                        this.payment.paymentTotal = 0;
                        // this.payment.mainBalance = response.mainBalance===null || response.mainBalance===undefined ? 0 : response.mainBalance ;
                        // this.payment.subBalance = response.subBalance===null || response.subBalance===undefined ? 0 : response.subBalance;
                        this.payment.paymentCharged =  this.basketService.getAmountLeft();
                        // this.basketTotal$.subscribe(data => {
                        //   console.log(data);
                        //   this.payment.paymentCharged  = data.subtotal - data.totalAmount;
                        // });
                        let linenum = this.basketService.getCurrentBasket().payments.length + 1;
                        this.payment.lineNum= linenum;
                        debugger;
                        this.basketService.changePaymentCharge(this.payment); 
                        // this.basketService.addPaymentToBasket(this.payment);
                        this.basketService.addPaymentToBasket(this.payment, parseFloat(response.data.voucherValue )); 
                        var payments= this.basketService.getCurrentPayment();
                        if(payments.length > 0)
                        {
                          this.selectedRow = this.basketService.getCurrentPayment().length - 1;
                          this.setClickedRow(this.selectedRow, this.payment, "");
                          for(let i = 0; i < payments.length ; i++)
                          {
                            if(payments[i].id === paymentId)
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
          let paymentX = this.basketService.getCurrentBasket().payments.find(x=>x.id === this.payment.id);
          if(paymentX!== null && paymentX !== undefined)
          {
            numCollected = paymentX.paymentTotal;
          } 
        } 
        if(this.payment!==null && numCollected == 0)
        {
          Swal.fire({
            icon: 'warning',
            title: 'Payment',
            text: "Please Complete progress payment " + this.payment.id + "!"
          });
          // this.alertify.warning("Please Complete progress payment " + this.payment.id + "!");
        }
        else
        {
          this.amountCharge = "";
          let amountLeft = this.basketService.getAmountLeft();
  
          // this.basketService.bas
          // this.basketTotal$.subscribe(data => {
          //   debugger;
          //   console.log(data);
          //   amountLeft = data.subtotal - data.totalAmount;
          // });
          if(amountLeft <= 0)
          {
            this.alertify.warning("Can't add new payment to bill.");
          }
          else
          {
            // debugger;
            this.payment = new Payment();
            // let paymentX = new Payment();
            // .id=
            this.payment.isRequireRefNum = isRequire ;
            this.payment.id = paymentId;
            this.payment.refNum ="";
            this.payment.paymentDiscount = 0;
            this.payment.paymentTotal = 0 ;
            this.payment.paymentCharged =  this.basketService.getAmountLeft();
            // this.basketTotal$.subscribe(data => {
            //   console.log(data);
            //   this.payment.paymentCharged  = data.subtotal - data.totalAmount;
            // });
            let linenum = this.basketService.getCurrentBasket().payments.length + 1;
            this.payment.lineNum= linenum;
      
            this.basketService.changePaymentCharge(this.payment); 
            this.basketService.addPaymentToBasket(this.payment);
            var payments= this.basketService.getCurrentPayment();
            if(payments.length > 0)
            {
              this.selectedRow = this.basketService.getCurrentPayment().length - 1;
              this.setClickedRow(this.selectedRow, this.payment, "");
              for(let i = 0; i < payments.length ; i++)
              {
                if(payments[i].id === paymentId)
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
        
        }
      }
    }
    
    
    // this.setFocus(this.inputType, this.selectedRow);
  }
  
  inputNum(num: string) {
    
    console.log("clearAmount");
    let changeAmt=0;
    this.basketTotal$.subscribe((data: any)=>{
        console.log(data);
        changeAmt= data.changeAmount;
    })
   
    if(!this.isFastClick)
    {
      this.amountCharge = "";
    }
    if(this.amountCharge === null || this.amountCharge === undefined)
    {
      this.amountCharge = "";
    }
    this.isFastClick = true; 
    debugger;
   if(this.maxvalue!==null || this.maxvalue!==undefined || this.maxvalue!=="undefined")
   {
     
     
     if(changeAmt+parseInt(num) > parseInt(this.maxvalue))
     {
        this.alertify.warning("can't add num");
     }
     else
     {
      let currentX =this.amountCharge === "" ? 0 : parseFloat(this.amountCharge) ;
      let numX = num === "" ? 0 : parseFloat(num);
      let value =  currentX + numX;
     
        this.amountCharge = value.toString(); 
        debugger;
         this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge)); 
       

     }
   }
   else
   {
      let currentX =this.amountCharge === "" ? 0 : parseFloat(this.amountCharge) ;
      let numX = num === "" ? 0 : parseFloat(num);
      let value =  currentX + numX;
      this.amountCharge = value.toString(); 
    
     this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge)); 

   }
}
  isFastClick: boolean = false;
  pressKey(key: string) {
    // debugger;
    console.log("pressKey"); 
    let billTotal=0;
    this.basketTotal$.subscribe((data: any)=>{
        console.log(data);
        billTotal= data.billTotal;
    })
    if(this.inputType==="refNum")
    {
       this.payment.refNum+=key;
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
      if(this.maxvalue!==null || this.maxvalue!==undefined || this.maxvalue!=="undefined")
      {
        let checkAmt=this.amountCharge + key;
        if(parseInt(checkAmt)-billTotal > parseInt(this.maxvalue))
        {
            this.alertify.warning("can't add num");
        }
        else
        {
          if(key==="000")
          {
            this.amountCharge = this.payment.paymentCharged.toString(); 
          }
          else
          {  
            this.amountCharge += key;
          } 
          if(this.payment.id==='PrepaidCard')
          {
            let balance= parseFloat(this.payment.mainBalance.toString()) + parseFloat(this.payment.subBalance.toString());
            if(parseFloat(this.amountCharge) > balance)
            {
              this.alertify.warning("Unavailable balance");
            }
            else
            {
              this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
            }
          }
          else
          {
            this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
          }
        }
      }
      else
      {
          
        debugger;
        if(key==="000")
        {
          this.amountCharge = this.payment.paymentCharged.toString();
          
        }
        else
        { 
        
          this.amountCharge += key;
        }
        
        this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));

      }
    }
    
    // this.setFocus(this.inputType, this.selectedRow);
 }
 
  submitPayment( )
  {
    console.log("submitPayment");
    // this.basketService.changePaymentCharge(this.payment); 
    this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
    this.amountCharge = "";
  }
  addOrder()
  {
    // this.basketService.addOrder("O");
    this.Modal.emit(true);
  }
   

}
