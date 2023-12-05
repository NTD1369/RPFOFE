import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { MCustomer } from 'src/app/_models/customer';
import { TInvoiceHeader } from 'src/app/_models/invoice';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { Payment } from 'src/app/_models/payment';
import { MStore } from 'src/app/_models/store';
import { IBasket, IBasketDiscountTotal, IBasketItem, IBasketPayment, IBasketTotal } from 'src/app/_models/system/basket';
import { TSalesLine } from 'src/app/_models/tsaleline';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service'; 
import { CustomerService } from 'src/app/_services/data/customer.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InvoiceService } from 'src/app/_services/transaction/invoice.service';
import Swal from 'sweetalert2';
import { ShopCapacityComponent } from '../../capacity/shop-capacity/shop-capacity.component';
import { ShopCardInputComponent } from '../../components/shop-card-input/shop-card-input.component';
import { ShopMemberInputComponent } from '../../components/shop-member-input/shop-member-input.component';
import { ShopInvoiceInputComponent } from '../../tools/shop-invoice-input/shop-invoice-input.component';
import { ShopItemSerialComponent } from '../../tools/shop-item-serial/shop-item-serial.component';

@Component({
  selector: 'app-shop-order-checkout',
  templateUrl: './shop-order-checkout.component.html',
  styleUrls: ['./shop-order-checkout.component.scss']
})
export class ShopOrderCheckoutComponent implements OnInit {


  discountSelectedRow : number;

  isShowNumpadDiscount: boolean= false;
  itemPromotionSelected: IBasketItem; 

  formatNumber: string ="4.5-5";
  @Input() Invoice = new EventEmitter<TInvoiceHeader>();
  @Output() ItemType = new EventEmitter<any>();
  @ViewChildren('input') inputs: QueryList<ElementRef>; 
  
  onClick(index) {
    // debugger;
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.inputs.toArray()[index].nativeElement.focus();
    },0); 
     
  }
 
  enableEdit = false;
  enableEditIndex = null;
  amountCharge: string ="";
  selectedRow : number  ;
 
 setClickedRow(index, payment: Payment) {
    // debugger;
    this.amountCharge ="";
    this.selectedRow = index;

    this.payment = payment;
    
    this.payment.paymentCharged = parseFloat(this.payment.paymentCharged.toString().replace(',', ''));
    // this.payment.paymentDiscount = parseFloat(this.payment.paymentDiscount.toString().replace(',', ''));
    this.payment.paymentTotal = parseFloat(this.payment.paymentTotal.toString().replace(',', ''));
     
    this.basketService.changePaymentCharge(this.payment); 
    // this.basketService.addPaymentToBasket(this.payment);
  }
  changeValuePayment(value: any, index, payment: Payment )
  {
    // debugger;
    this.selectedRow = index; 
     this.payment = payment;
    // this.payment.paymentCharged = parseFloat(this.payment.paymentCharged.toString().replace(',', ''));
    // this.payment.paymentDiscount = parseFloat(this.payment.paymentDiscount.toString().replace(',', ''));
    this.payment.paymentTotal = parseFloat(this.payment.paymentTotal.toString().replace(',', ''));
    let valueX = parseFloat(value.toString().replace(',', ''));
    if(valueX != this.payment.paymentTotal)
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

  removeselect(index, payment: Payment)
  {
    // debugger;
    // this.selectedRow = null;

    this.payment = payment;
    this.basketService.changePaymentCharge(this.payment);
    this.basketService.addPaymentToBasket(this.payment, this.payment.paymentTotal);
  }
  withShadingOptionsVisible: boolean;
  toggleWithShadingOptions() {
    this.withShadingOptionsVisible = !this.withShadingOptionsVisible;
}
  
  removeDiscountSelect(index, item: IBasketItem)
  {
    // this.discountSelectedRow = null;
    // this.isShowNumpadDiscount=false;
    // this.basketService.changePaymentCharge(this.payment);
    // this.basketService.addPaymentToBasket(this.payment, this.payment.paymentTotal);
  }

  enableEditMethod(e, i) {
    // debugger;
    this.enableEdit = true;
    this.enableEditIndex = i;
    console.log(i, e);
    this.inputs.toArray()[i].nativeElement.focus();
    // this.input.nativeElement.focus();
  }
  @Output() checkOutAction = new EventEmitter<string>();
  checkOutActionForm(action)
  {
    this.checkOutAction.emit(action); 
  }
  myDate = new Date();
  orderNo: string ;
  @Output() getPaymentCharge = new EventEmitter<Payment>();
  VirtualKey$: Observable<boolean>;
  constructor(public authService: AuthService, private itemService: ItemService,   public commonService: CommonService, 
    private invoiceService: InvoiceService, private basketService: BasketService, private customerService: CustomerService, 
    private alertify: AlertifyService   ,private modalService: BsModalService, private activatedRoute: ActivatedRoute, private route: Router) {
    this.payment = new Payment();
    //this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.withShadingOptionsVisible = false;
   }
  modalRef: BsModalRef;
  selectRow(item)
  {
    // debugger;
    this.itemSelectedRow = item.id + item.uom + item.promotionPromoCode;
  }
  basket$: Observable<IBasket>;
  basketTotal$: Observable<IBasketTotal>;
  showModal: boolean=false;
  payment: Payment;
  discountModalShow: boolean = false;
  discountAmount: string;
  itemSelectedRow: string = "";
  openModal(template: TemplateRef<any>) {
    this.showModal = true;
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
       
        class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
      });
    });

    this.selectedRow = null;
    this.amountCharge =null;
    this.payment=null;
  }
  openInvoiceModal() {
    
    this.modalRef = this.modalService.show(ShopInvoiceInputComponent);
      // this.modalRef = this.modalService.show(template, {
      //   ariaDescribedby: 'my-modal-description',
      //   ariaLabelledBy: 'my-modal-title', 
      //   class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
      // });
   
  }
 
  ngAfterViewInit()
  {
    debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function(item) {
      // Do stuff here
        if(item !== null && item !== undefined)
        {
          item.classList.add('hide');
          // console.log('order chekout');
        }
    });
    // paymentMenu
    if(this.basket$!==null && this.basket$!==undefined)
    {
      this.basket$.subscribe(data => { 
        this.itemSelectedRow = "";
      });
    }
  }
  // selectedItem: IBasketItem;
  selectSerial(item: IBasketItem)
  {
    // debugger; 
    const initialState = {
      item:  item, title: 'Item Serial',
    };
    this.modalRef = this.modalService.show(ShopItemSerialComponent, {initialState});
  }
  SetSerialItem(serialList: MItemSerial[])
  {
    // debugger;
    console.log(serialList);
    //  this.alertify.warning("" +serialItem.serialNum);
  }
  orderId="";
  order: Order;
  changeCustomer(customer: MCustomer){
    this.basketService.changeCustomer(customer);
  }
  setItemToBasket(lines: TSalesLine[]){
    lines.forEach(async item => {
      // debugger;
      
      await this.itemService.getItemViewList(this.order.companyCode, this.order.storeId,  item.itemCode, item.uomCode, '', '','','').subscribe((response: any)=>{
        // debugger;
        if(response.data.length > 0)
        {
          let infor=response.data[0];
          infor.slocId= item.slocId;
          // console.log(ressponse[0]);
          this.basketService.addItemtoBasket(infor, item.quantity);
        }
       
      })
      //.toPromise();
     
      //
    });
  }
  removeBasket()
  {
      const basket = this.basketService.getCurrentBasket();
      this.basketService.deleteBasket(basket);
  }
  store: MStore;
  ngOnInit() {
   
    this.store= this.authService.storeSelected();
    // this.activatedRoute.params.subscribe(data => { 
    //   this.orderId = data['id'];
    // })
    this.basket$ = this.basketService.basket$;
    this.basketTotal$ = this.basketService.basketTotal$;
    this.basketDiscountTotal$  = this.basketService.basketTotalDiscount$;
    this.VirtualKey$ = this.commonService.VirtualKey$;
    const basket = this.basketService.getCurrentBasket();
    // debugger;
    if(basket===null || (basket.customer===null || basket.customer===undefined))
    {
      
         this.addNewOrder(); 
    }
    else
    {
       
     
      if(this.orderId==="" || this.orderId ===null || this.orderId===undefined || this.orderId.toString() ==="undefined")
      {
        this.invoiceService.getNewOrderCode(this.store.companyCode, this.store.storeId).subscribe(data => {
          
          this.orderNo = data;
        }); 
      }
      
    }
   
   
     
  }
   
  toggleModal()
  {
    // debugger;
    this.discountModalShow = !this.discountModalShow;
  }
  increment(item: IBasketItem)
  {
    this.basketService.incrementItemQty(item);
  }
  onBlurMethod(item: IBasketItem)
  {
    // debugger;
    if(item.quantity <= 0 || item.quantity === null || item.quantity === undefined || item.quantity.toString() === "")
    {
      item.quantity = 0;
    }
    this.basketService.updateItemQty(item);
  }
  updateNote(item: IBasketItem)
  {
    // debugger;
    if(item.quantity <= 0 || item.quantity === null || item.quantity === undefined || item.quantity.toString() === "")
    {
      item.quantity = 0;
    }
    this.basketService.updateRemark(item);
  }
  decrement(item: IBasketItem)
  {
    this.basketService.decrementItemQty(item);
  }
  remove(item: IBasketItem)
  {
    this.basketService.removeItem(item);
  }
  removeCapacityLine(item: IBasketItem)
  {
    this.basketService.removeCapacityLine(item);
  }
  editCapacityLine(item: IBasketItem)
  {
    
    const initialState = {
      basketModel:  item, title: 'Item Capacity',
    };
    this.modalRef = this.modalService.show(ShopCapacityComponent, {initialState});
  }
  editCardLine(item: IBasketItem)
  {
    const initialState = {
      item:  item, title: 'Item Capacity',
    };
    debugger;
    if(item.quantity===0 || item.quantity===null)
    {
      item.quantity= 1;
    }
    this.modalRef = this.modalService.show(ShopCardInputComponent, { initialState});
  }
  editMemberLine(item: IBasketItem)
  {
    const initialState = {
      item:  item, title: 'Item Capacity',
    };
    debugger;
    if(item.quantity===0 || item.quantity===null)
    {
      item.quantity= item.memberValue;
    }
    this.modalRef = this.modalService.show(ShopMemberInputComponent, { initialState});
  }
  removePayment(payment: IBasketPayment)
  {
    this.basketService.removePayment(payment);
    this.selectedRow = null;
    this.amountCharge =null; 
    this.payment = null;
  }
  clearAmount(i, payment: Payment)
  {
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
  addPayment(paymentId: string, isClose?: boolean)
  {
    // debugger;
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
      this.alertify.warning("Please Complete progress payment " + this.payment.id + "!");
      
    }
    else
    {
      this.amountCharge = "";
      let amountLeft=0;
      this.basketTotal$.subscribe(data => {
        console.log(data);
        amountLeft = data.subtotal - data.totalAmount;
      });
      if(amountLeft <= 0)
      {
        this.alertify.warning("Can't add new payment to bill.");
      }
      else
      {
        this.payment = new Payment();
        // let paymentX = new Payment();
        // .id=
        this.payment.id = paymentId;
        this.payment.refNum ="";
        this.payment.paymentDiscount = 0;
        this.payment.paymentTotal = 0 ;
        this.basketTotal$.subscribe(data => {
          console.log(data);
          this.payment.paymentCharged = data.subtotal - data.totalAmount;
        });
        let linenum = this.basketService.getCurrentBasket().payments.length + 1;
        this.payment.lineNum= linenum;
  
        this.basketService.changePaymentCharge(this.payment); 
        this.basketService.addPaymentToBasket(this.payment);
        var payments= this.basketService.getCurrentPayment();
        if(payments.length > 0)
        {
          this.selectedRow = this.basketService.getCurrentPayment().length - 1;
          this.setClickedRow(this.selectedRow, this.payment);
          for(let i = 0; i < payments.length ; i++)
          {
            if(payments[i].id === paymentId)
            {
              this.selectedRow = i;
              this.setClickedRow(this.selectedRow, this.payment);
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
  
  inputNum(num: string) {
    // debugger;
    if(!this.isFastClick)
    {
      this.amountCharge = "";
    }
    if(this.amountCharge === null || this.amountCharge === undefined)
    {
      this.amountCharge = "";
    }
    this.isFastClick = true;
   //  this.payment.paymentCharged =
   let currentX =this.amountCharge === "" ? 0 : parseFloat(this.amountCharge) ;
   let numX = num === "" ? 0 : parseFloat(num);
   let value =  currentX + numX;
   this.amountCharge = value.toString();
   // this.selectedRow = index;

   // this.payment.paymentCharged = parseFloat(this.amountCharge);
   this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
  
  //  this.selectedRow = null;
}
  isFastClick: boolean = false;
  pressKey(key: string) {
    if(this.isFastClick)
    {
      this.amountCharge = "";
    }
    if(this.amountCharge === null || this.amountCharge === undefined)
    {
      this.amountCharge = "";
    }
    this.isFastClick = false;
    // debugger;
    if(key==="000")
    {
      this.amountCharge = this.payment.paymentCharged.toString();
      // this.basketTotal$.subscribe(data => {
      //   debugger;
       
      // });
    }
    else
    { 
    //  this.payment.paymentCharged =
      this.amountCharge += key;
    }
   
    // this.selectedRow = index;
 
    // this.payment.paymentCharged = parseFloat(this.amountCharge);
    this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
 }
 
  submitPayment( )
  {
   
    // this.basketService.changePaymentCharge(this.payment); 
    this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
    this.amountCharge = "";
  }
  addNewOrder()
  {
    let test = this.basketService.getCurrentBasket()
    debugger;
    if(test===null)
    {
      this.invoiceService.getNewOrderCode(this.store.companyCode, this.store.storeId).subscribe(data => {
        // console.log(data);
        this.orderNo = data;
      }); 
      // this.alertify.success("AAAA");
      this.customerService.getItem(this.store.companyCode, this.store.defaultCusId).subscribe((reponse: any) => {
        debugger;
        this.basketService.changeCustomer(reponse.data,"Retail").subscribe(()=>{
          // this.route.navigate(['/shop/order']).then();
          if(this.authService.getShopMode()==='FnB')
          {
            this.route.navigate(["shop/order"]).then(() => {
              // window.location.reload();
            }); 
          }
          if(this.authService.getShopMode()==='Grocery')
          {
            this.route.navigate(["shop/order-grocery"]).then(() => {
              // window.location.reload();
            }); 
          
          }
        });
        // this.route.navigate(['/shop/order']);
      
      
      });
    }
  }
  onTypeChanged(type)
  {
    // debugger;
    if(type!==null && type!==undefined)
    {
      this.ItemType.emit(type); 
    } 
     
  }
  typeOptions = [
    {
      value: "", name: "All",
    },
    {
      value: "S", name: "Service",
    },
    {
      value: "I", name: "Inventory",
    },
   
  ];
  addOrder(value)
  {
    // debugger;
    if(value===true)
    {
      if(this.orderId==="" || this.orderId ===null || this.orderId===undefined || this.orderId.toString() ==="undefined")
      {
        this.orderNo= "";
      }
      // this.testRemoveBasket();
      this.basketService.addOrder(this.orderNo, "SALES").subscribe(
        (response: any) => {
          if(response.success)
          {
            this.alertify.success(response.message);
            const basket = this.basketService.getCurrentBasket();
            this.basketService.deleteBasket(basket).subscribe(()=>{
              this.basketService.getNewOrderCode(this.store.companyCode, this.store.storeId).subscribe(data => {
                // console.log(data);
                this.orderNo = data;
              }); 
             
              this.customerService.getItem(this.store.companyCode, this.store.defaultCusId).subscribe((reponse: any) => {
                setTimeout(() => {
                  if(reponse.data!==null && reponse.data!==undefined)
                  {
                    this.basketService.changeCustomer(reponse.data).subscribe(()=>{
                      this.route.navigate(['/shop/order']).then(() => {
                        window.location.reload();
                      });
                    });
                  }
                  else
                  {
                    this.route.navigate(['/shop/order']).then(() => {
                      window.location.reload();
                    });
                  }
                // this.route.navigate(['/shop/order']);
                
                }, 2); 
              
              });
            });
           
           
            // const basket = this.getCurrentBasket();
            // this.deleteBasket(basket);
            // this.newOrder();
            // this.route.navigate(['/shop/order']);
          }
          else
          {
           
            this.alertify.error(response.message);
          
            
          }
         
        },
        (error) => {
          this.alertify.error(error);
        }
      );
      this.modalRef.hide();
      
    }
    else
    {
      this.modalRef.hide();
      
    }
    
  }
  cancelOrder()
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
       
      const basket = this.basketService.getCurrentBasket();
      let currentType= basket.salesType;
      this.basketService.deleteBasket(basket).subscribe(()=>{
          // this.addNewOrder()
        // this.route.navigate(['/shop/sales-type']);
        this.basketService.getNewOrderCode(this.store.companyCode, this.store.storeId).subscribe(data => {
          // console.log(data);
          this.orderNo = data;
        });  
        this.customerService.getItem(this.store.companyCode, this.store.defaultCusId).subscribe((reponse: any) => {
          setTimeout(() => {
          this.basketService.changeCustomer(reponse.data, currentType);
           
            this.route.navigate(['/shop/order']).then(() => {
            
            });
          }, 2); 
        
        });
      });
     
       
    }});
  }
 

  basketDiscountTotal$: Observable<IBasketDiscountTotal>;
 
  
  
  
}
