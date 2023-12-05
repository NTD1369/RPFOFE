import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs'; 
import { Payment } from 'src/app/_models/payment';
import { MStore } from 'src/app/_models/store'; 
import { TSalesLine } from 'src/app/_models/tsaleline';
import { TSalesPayment } from 'src/app/_models/tsalepayment';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { BillService } from 'src/app/_services/data/bill.service'; 
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-return',
  templateUrl: './shop-return.component.html',
  styleUrls: ['./shop-return.component.scss']
})
export class ShopReturnComponent implements OnInit {

  modalRef: BsModalRef;
  showModal: boolean= false;
  
  discountModalShow: boolean = false;
  order: Order;
  
  private returnTotal = new BehaviorSubject<BasketPayment>(null);
  returnTotal$ = this.returnTotal.asObservable();
   storeSelected: MStore;
  payment: TSalesPayment;
  // tslint:disable-next-line: max-line-length
  constructor(private alertify: AlertifyService,public authService: AuthService, private shiftService: ShiftService,   private billService: BillService, private basketService: BasketService,
    private route: ActivatedRoute,private modalService: BsModalService, private router: Router) { }

  ngOnInit() {
    this.storeSelected= this.authService.storeSelected();
    this.route.data.subscribe(data => {
      this.order = data['order'].data;
    });
    this.order.payments = [];
    console.log(this.order);  
    this.returnTotal$ = this.returnTotal$;
    this.calculateTotal();
  }
  calculateTotal()
  {
    debugger;
    let lines = this.order.lines;
    let totalAmount = this.order.lines.reduce((a, b) =>  (b?.returnQty===undefined || b?.returnQty===null ? 0 : b?.returnQty * (b?.quantity * b?.price - b?.discountAmt)/b?.quantity ) + a, 0);
    let totalCollected = this.order.payments.reduce((a, b) => b.collectedAmount + a, 0);
    let ChangeAmount= 0;
    let LeftAmount=0;
    if(totalAmount - this.order.payments.reduce((a, b) => b.collectedAmount + a, 0) > 0)
    {
       ChangeAmount= 0 ;
       LeftAmount= totalAmount - this.order.payments.reduce((a, b) => b.collectedAmount + a, 0);
    }
    else{
       ChangeAmount=  - (totalAmount - this.order.payments.reduce((a, b) => b.collectedAmount + a, 0));
       LeftAmount= 0;
    }
    // totalAmount: number= 0;
    // totalCollected: number =0;
    // ChangeAmount: number =0;
    // LeftAmount: number =0;
    this.returnTotal.next({totalAmount, totalCollected, ChangeAmount, LeftAmount});
    
  }
  inputReturnQty()
  {
    debugger;
     
    this.calculateTotal();
  }
  increment(item: any)
  {
    debugger;
    const foundItemIndex = this.order.lines.findIndex((x) => x.itemCode === item.id); 
    if(item.returnQty==null || item.returnQty == undefined)
    {
      item.returnQty=0;
    }
    let returnQty= item.returnQty;
    let quantity= item.quantity;
    if (returnQty < quantity) {
      item.returnQty++; 
    }  
    this.inputReturnQty();
  }
  onBlurMethod(item: any)
  {
    debugger;
    // this.basketService.updayeItemQty(item);
  }

  addOrder(status: string) {
    debugger;
    if(status==="")
    {
      status ="O";
    } 
    // const customer = this.customer;
    let order = new Order();
    order = this.order;
    
    order.shiftId = this.shiftService.getCurrentShip().shiftId;
    order.manualDiscount = '';
    order.refTransId = this.order.transId;
    order.transId ='';
    order.remarks =''; 
    order.salesPerson = 'CP00100001';
    order.createdBy = this.authService.decodeToken?.unique_name;
    order.status = 'C';
    order.storeId = this.storeSelected.storeId;
    // Hold, Sales(-) , Sales Deposit(-), Exch (-), Exch Depo(-), Return + . 
    order.salesMode = 'RETURN';
    order.discountType = "";
    order.discountRate =0;
    order.discountAmount = 0;
    order.isCanceled = 'N';
    order.totalAmount = this.returnTotal.value.totalAmount;
    order.totalDiscountAmt =0;
    order.totalPayable = this.returnTotal.value.totalAmount;
    order.totalReceipt = this.returnTotal.value.totalCollected;
    order.amountChange = this.returnTotal.value.ChangeAmount;
    order.paymentDiscount = 0; 
    order.totalTax = 0; 
    order.createdBy = this.authService.getCurrentInfor().username;
    var items = this.order.lines.filter(x=>x.returnQty > 0);
    order.lines = [];
    items.forEach((item) => {
      let line = new TSalesLine();
      line = item;
      debugger;
      line.quantity = item.returnQty; 
     
      line.status = "C";
      line.price = item?.returnQty * (item?.quantity * item?.price - item?.discountAmt)/item?.quantity//  item.returnAmt / item.returnQty;  
      line.baseTransId = order.refTransId;
      line.baseLine =  parseInt(item.lineId);
      const value = 0;
      let discountType= item.discountType;
      line.discountRate = item.discountRate;
      line.discountAmt = item.discountAmt;
      line.discountType = discountType;
      line.lineTotal = line.price * item?.returnQty;
      order.lines.push(line);
    });
    order.payments.forEach(payment => {
      payment.totalAmt = -payment.totalAmt;
      payment.chargableAmount = -payment.chargableAmount;
      payment.collectedAmount = -payment.collectedAmount;
     

    });
    
    debugger;
    return this.billService.create(order)
      .subscribe(
        (response: any) => {
          if(response.success)
          { 
            this.alertify.success(response.message);
            this.router.navigate(['/shop/bills']);
          }
          else
          { 
            this.alertify.warning(response.message);  
          }
         
        },
        (error) => {
          // this.alertify.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Bill',
            text: "Failed to create data"
          });
        }
      );
  }

  inputNum(num: string) {
    debugger;
    if(!this.isFastClick)
    {
      this.amountCharge = "";
    }
    if(this.amountCharge === null || this.amountCharge === undefined)
    {
      this.amountCharge = "";
    }
    this.isFastClick = true;
    let currentX =this.amountCharge === "" ? 0 : parseFloat(this.amountCharge) ;
    let numX = num === "" ? 0 : parseFloat(num);
    let value =  currentX + numX;
    this.amountCharge = value.toString();
  //  this.amountCharge = num;
   
   this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
  //  this.selectedRow = null;
}
amountCharge: string ="";
  selectedRow : number  ;
 
 setClickedRow(index, payment: TSalesPayment) {
    debugger;
    this.amountCharge ="";
    this.selectedRow = index;

    this.payment = payment;
    // this.basketService.changePaymentCharge(this.payment); 
    // this.payment = payment;
    // this.basketService.changePaymentCharge(this.payment); 
   
  }
  isFastClick: boolean = false;
pressKey(key: string) {
  debugger;
  if(this.isFastClick)
    {
      this.amountCharge = "";
    }
    if(this.amountCharge === null || this.amountCharge === undefined)
    {
      this.amountCharge = "";
    }
    this.isFastClick = false;
  this.amountCharge += key;
  
  this.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
} 
  removePayment(payment: TSalesPayment)
  {
    if (this.order.payments.some((x) => x.paymentCode === payment.paymentCode)) {
      this.order.payments = this.order.payments.filter((i) => i.paymentCode !== payment.paymentCode);
      let paymentCurrent = this.order.payments;
    }  
    this.selectedRow = null;
    this.amountCharge =null;
    this.calculateTotal();
  }
  clearAmount(i, payment: Payment)
  {
    this.amountCharge = "";
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
   const totalBasket = this.returnTotal;
  //  const totalPaymentBasket = this.basketPaymentTotal;
   const index = payments.findIndex((i) => i.paymentCode === paymenttoAdd.paymentCode);
   if (index === -1) {

     paymenttoAdd.collectedAmount = paymentTotal;
     paymenttoAdd.chargableAmount = totalBasket.value.totalAmount - (totalBasket.value.totalAmount - totalBasket.value.LeftAmount) ;
     payments.push(paymenttoAdd);
   } else {
     payments[index].collectedAmount = paymentTotal;
      
   }
   return payments;
 }

  addPayment(paymentId: string)
  {
   
    this.amountCharge = "";
    this.payment = new TSalesPayment();
    // let paymentX = new Payment();
    // .id=
    this.payment.paymentCode = paymentId;
    this.payment.refNumber ="";
    this.payment.paymentDiscount = 0;
    this.payment.chargableAmount = 0 ;
    this.payment.collectedAmount = 0;
    debugger;
    // this.basketService.changePaymentCharge(this.payment); 
    this.addPaymentToBasket(this.payment);
    var payments= this.order.payments;
    if(payments.length > 0)
    {
      this.selectedRow = this.order.payments.length - 1;
      this.setClickedRow(this.selectedRow, this.payment);
      for(let i = 0; i < payments.length ; i++)
      {
        if(payments[i].paymentCode === paymentId)
        {
          this.selectedRow = i;
          this.setClickedRow(this.selectedRow, this.payment);
        }
      }
     
    }
    else{
      this.selectedRow =0;
    }
     
  }  
  decrement(item: any)
  {
    const foundItemIndex = this.order.lines.findIndex((x) => x.itemCode === item.id); 
    let returnQty= item.returnQty;
    let quantity= item.quantity;
    if (returnQty > 0) {
      item.returnQty--; 
    }  
    this.inputReturnQty();
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
  totalAmount: number= 0;
  totalCollected: number =0;
  ChangeAmount: number =0;
  LeftAmount: number =0;
}