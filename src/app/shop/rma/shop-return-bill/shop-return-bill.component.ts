import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { MCustomer } from 'src/app/_models/customer';
import { MEmployee } from 'src/app/_models/employee';
import { Item } from 'src/app/_models/item';
import { timer } from 'rxjs';
import { MBomline } from 'src/app/_models/mbomline';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { Payment } from 'src/app/_models/payment';
import { MReason } from 'src/app/_models/reason';
import { MStore } from 'src/app/_models/store';
import { IBasket, IBasketDiscountTotal, IBasketItem, IBasketPayment, IBasketTotal } from 'src/app/_models/system/basket';
import { TSalesLine } from 'src/app/_models/tsaleline';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
 
import { CommonService } from 'src/app/_services/common/common.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { EmployeeService } from 'src/app/_services/data/employee.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { PaymentmethodService } from 'src/app/_services/data/paymentmethod.service';
import { ReasonService } from 'src/app/_services/data/reason.service';
import { StorePaymentService } from 'src/app/_services/data/store-payment.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import { ShopCapacityComponent } from '../../capacity/shop-capacity/shop-capacity.component';
import { ShopCardInputComponent } from '../../components/shop-card-input/shop-card-input.component';
import { ShopMemberInputComponent } from '../../components/shop-member-input/shop-member-input.component';
import { ShopExchangeItemListComponent } from '../../tools/shop-exchange-item-list/shop-exchange-item-list.component';
import { ShopInvoiceInputComponent } from '../../tools/shop-invoice-input/shop-invoice-input.component';
import { ShopItemSerialComponent } from '../../tools/shop-item-serial/shop-item-serial.component';
import { ShopReasonInputComponent } from '../../tools/shop-reason-input/shop-reason-input.component';
import { take } from 'rxjs/operators';
import { SStoreClient } from 'src/app/_models/storeclient';

@Component({
  selector: 'app-shop-return-bill',
  templateUrl: './shop-return-bill.component.html',
  styleUrls: ['./shop-return-bill.component.scss']
})
export class ShopReturnBillComponent implements OnInit {

  discountSelectedRow: number;

  isShowNumpadDiscount: boolean = false;
  itemPromotionSelected: IBasketItem;

  formatNumber: string = "4.5-5";
  @Input() IsEvent = false;
  @Output() ItemType = new EventEmitter<any>();
  @ViewChildren('input') inputs: QueryList<ElementRef>;
  functionId = 'Spc_ReturnOrder';
  functionIdX = 'Spc_ReturnOrderW';

  onClick(index) {
    // debugger;
    setTimeout(() => { // this will make the execution after the above boolean has changed
      this.inputs.toArray()[index].nativeElement.focus();
    }, 0);

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
  enableEdit = false;
  enableEditIndex = null;
  amountCharge: string = "";
  selectedRow: number;

  setClickedRow(index, payment: Payment) {
    // debugger;
    this.amountCharge = "";
    this.selectedRow = index;

    this.payment = payment;

    this.payment.paymentCharged = parseFloat(this.payment.paymentCharged.toString().replace(',', ''));
    // this.payment.paymentDiscount = parseFloat(this.payment.paymentDiscount.toString().replace(',', ''));
    this.payment.paymentTotal = parseFloat(this.payment.paymentTotal.toString().replace(',', ''));

    this.basketService.changePaymentCharge(this.payment);
    // this.basketService.addPaymentToBasket(this.payment);
  }
  changeValuePayment(value: any, index, payment: Payment) {
    // debugger;
    this.selectedRow = index;
    this.payment = payment;
    // this.payment.paymentCharged = parseFloat(this.payment.paymentCharged.toString().replace(',', ''));
    // this.payment.paymentDiscount = parseFloat(this.payment.paymentDiscount.toString().replace(',', ''));
    this.payment.paymentTotal = parseFloat(this.payment.paymentTotal.toString().replace(',', ''));
    let valueX = parseFloat(value.toString().replace(',', ''));
    if (valueX != this.payment.paymentTotal) {
      this.payment.paymentTotal = valueX;
    }
    this.basketService.changePaymentCharge(this.payment);
    if (value !== "") {
      this.basketService.addPaymentToBasket(this.payment, this.payment.paymentTotal);

    }
    else {
      this.basketService.addPaymentToBasket(this.payment, 0);

    }
  }

  removeselect(index, payment: Payment) {
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

  removeDiscountSelect(index, item: IBasketItem) {
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


  myDate = new Date();
  orderNo: string;
  @Output() getPaymentCharge = new EventEmitter<Payment>();
  VirtualKey$: Observable<boolean>;
  constructor(public authService: AuthService,public reasonService: ReasonService, private mwiService: MwiService, private storePaymentService: StorePaymentService, private itemService: ItemService, private billService: BillService, public commonService: CommonService,
    private basketService: BasketService, private customerService: CustomerService, public datePipe: DatePipe,
    private employeeService: EmployeeService, private alertify: AlertifyService, private modalService: BsModalService, private activatedRoute: ActivatedRoute, private route: Router) {
    this.payment = new Payment();
    //this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.withShadingOptionsVisible = false;
    this.order = new Order();
  }
  modalRef: BsModalRef;
  selectRow(item) {
    // debugger;
    this.itemSelectedRow = item.id + item.uom + item.promotionPromoCode;
  }
  basket$: Observable<IBasket>;
  basketTotal$: Observable<IBasketTotal>;
  showModal: boolean = false;
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
    this.amountCharge = null;
    this.payment = null;
  }
  openInvoiceModal() {

    this.modalRef = this.modalService.show(ShopInvoiceInputComponent);
    // this.modalRef = this.modalService.show(template, {
    //   ariaDescribedby: 'my-modal-description',
    //   ariaLabelledBy: 'my-modal-title', 
    //   class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
    // });

  }
  ngAfterViewInit() {

    // console.log("afterinit");
    if (this.basket$ !== null && this.basket$ !== undefined) {
      this.basket$.subscribe(data => {
        this.itemSelectedRow = "";
      });
    }
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function (item) {
      // Do stuff here
      if (item !== null && item !== undefined) {
        item.classList.add('hide');
        // console.log('return bill');
      }
    });
    // debugger;
    //  const paymentMenu = document.getElementsByClassName('paymentMenu');
    //  Array.prototype.forEach.call(paymentMenu, function(item) {
    //    // Do stuff here
    //      if(item !== null && item !== undefined)
    //      {
    //        item.classList.add('hide');
    //      }
    //  });
    // setTimeout(() => {
    //   console.log(this.inputs.toArray()[0].nativeElement.focus()); // throws an error
    // }, 1000);
   
  
    
  }
   
  // selectedItem: IBasketItem;
  selectSerial(item: IBasketItem) {
    // debugger; 
    const initialState = {
      item: item, title: 'Item Serial',
    };
    this.modalRef = this.modalService.show(ShopItemSerialComponent, { initialState });
  }
  SetSerialItem(serialList: MItemSerial[]) {
    // debugger;
    console.log(serialList);
    //  this.alertify.warning("" +serialItem.serialNum);
  }
  orderId = "";
  order: Order;
  changeCustomer(customer: MCustomer) {
    this.basketService.changeCustomer(customer);
  }
  // setItemToBasket(lines: TSalesLine[]) {
  //   lines.forEach(async item => {
  //     // debugger;
       
  //     await this.itemService.getItemViewList(this.order.companyCode, this.order.storeId, item.itemCode, item.uomCode, '', '', '', this.order.cusId).subscribe((response: any) => {
  //       // debugger;
  //       if (response.data.length > 0) {
  //         let infor = response.data[0];
  //         infor.slocId = item.slocId;
  //         // console.log(ressponse[0]);
  //         this.basketService.addItemtoBasket(infor, item.quantity);
  //       }

  //     })
      
  //   });
  // }
  removeBasket() {
    const basket = this.basketService.getCurrentBasket();
    this.basketService.deleteBasket(basket);
  }
  store: MStore;
  newOrderReturn() {
    // this.isEvent=false;
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
        }
      });
    }
    else {
      let cus = this.authService.getDefaultCustomer();
      if (cus !== null && cus !== undefined) {
        this.basketService.changeCustomer(cus, currentType).subscribe(() => {
          this.basketService.changeContract(this.orderId);
        });

      }
    }

  }
  storeSelected: MStore;
  canReturn = false;
  canReturnW = false;
  checkCanReturn()
  {
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
            this.clearOrder();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
  
          }
        })
        return false;
      }
    }
    return true;
  }
  reasonList: MReason[];
  loadReasonList()
  {
    // debugger;
    this.reasonService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      debugger;
      this.reasonList = response.data.filter(x=>x.status==='A' && x.type==='Return');
    })
  }
  ngOnInit() {
    // debugger;
    this.poleValue = this.getPole();
    this.loadReasonList();
    // this.startTimer();
    // this.checkCustomerInfor= false;
    let check = this.authService.checkRole(this.functionId, '', 'I');
    this.canReturn = check;
    this.canReturnW = this.authService.checkRole(this.functionIdX, '', 'I');
    if (this.canReturn === false) {
      if (this.canReturnW === false) {
        this.route.navigate(["/admin/permission-denied"]);
      }

    }
    this.storeSelected = this.authService.storeSelected();
    if(this.checkCanReturn())
    {
      if (this.canReturn || this.canReturnW) {
        // this.activatedRoute.data.subscribe(data => {
        //   this.order = data['order'];
        // });
        this.activatedRoute.params.subscribe(data => {
          this.orderId = data['id'];
  
        });
  
    
  
        this.basket$ = this.basketService.basket$;
        this.basketTotal$ = this.basketService.basketTotal$;
        this.basketDiscountTotal$ = this.basketService.basketTotalDiscount$;
        this.VirtualKey$ = this.commonService.VirtualKey$;
        // this.loadItemNew(this.storeSelected.companyCode, this.storeSelected.storeId, '', '', '');
  
        this.loadEmployee();
        this.basketService.getNewOrderCode(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe(data => {
          this.orderNo = data;
        });
        this.loadOrder();
      }
  
    }
    
  
  }
  loadItemNew(companyCode, storeId, Keyword, Merchandise, Type, subType?) {
    this.itemService.getItemViewList(companyCode, storeId, '', '', '', Keyword, Merchandise,'', Type).subscribe((response: any) => {
      // debugger;
      if (subType !== null && subType !== undefined && subType !== "") {
        this.items = response.data;
        this.items = this.items.filter(x => x.customField4 === subType);
      }
      else {
        this.items = response.data;
      }
      this.loadOrder();
    });
  }
  time: number = 0;
  display ;
  interval;

 startTimer() {
    console.log("=====>");
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.display=this.transform( this.time)
    }, 1000);
  }
  transform(value: number): string {
       const minutes: number = Math.floor(value / 60);
       return minutes  + ' minutes : ' + (value - minutes * 60) + ' seconds';
  }
  pauseTimer() {
    clearInterval(this.interval);
  }
  loadOrder() {

    // this.removeBasket();

    if (this.orderId !== null && this.orderId !== undefined) {
    
      console.log(this.order.lines);
      this.billService.getBill(this.orderId, this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any) => {
        // 
        if(response.success)
        {
          this.order = response.data;
          this.storePaymentService.getByStore(this.storeSelected.companyCode, this.storeSelected.storeId, '').subscribe((res: any) => {
            // debugger;
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
                    Swal.fire({
                      icon: 'warning',
                      title: 'Warning', 
                      text: "Bill with payment " + element.shortName + " is not allowed to return."
                    });
                  }
                 
                 });
               });
             }
            
            
            }
            else
            {
              this.alertify.warning(res.message);
  
            }
          
          
          });
          // debugger;
          if(this.canReturn)
          {
            if(response.data!==null && response.data!=undefined)
            {
              if(this.order.createdOn!==null && this.order.createdOn!==undefined)
              {
                
              }
              else
              {
                this.order.createdOn = new Date();
              }
              // debugger;
              let setting = this.authService.getVoidReturnSetting();
              let NumOfDay=0;
              if(setting!==null && setting!==undefined)
              {
                let returnSetting = setting.find(x=>x.type.replace(/\s/g, "").toLowerCase() === this.order.salesType.replace(/\s/g, "").toLowerCase() && x.code === 'SOReturnDay');
                if(returnSetting!==null && returnSetting!==undefined)
                {
                  NumOfDay = returnSetting.value;
                }
              }
              
              let date = new Date(this.order.createdOn); 
              if(NumOfDay!==0)
              {
                date.setDate(date.getDate() + NumOfDay);
              }
              let createDateSte = this.datePipe.transform(date, 'yyyy/MM/dd');
              let now = this.datePipe.transform(new Date(), 'yyyy/MM/dd');
              if (date >= new Date()  || this.canReturnW === true) {
                this.canReturn = true;
              }
              else {
                this.canReturn = false;
                Swal.fire({
                  icon: 'warning',
                  title: 'Warning',
                  text: "Bill can't return. Created On :" + createDateSte + " not valid."
                });
              }
              const itemList: Item[] = [];
              console.log(this.order);
              this.removeBasket();
              this.order.refTransId = this.orderId;
              if (this.authService.getCRMSource() === "Local" || (this.order.customer !== null && this.order.customer !== undefined)) {
                this.checkCustomerInfor = true;
                this.basketService.changeCustomer(this.order.customer, "Return").subscribe(() => {
                  debugger;
      
                });
                this.setItemReturnToBasket(this.order);
                // let basket = this.basketService.getCurrentBasket();
                // if (basket.items.length <= 0) {
                //   this.alertify.warning("Order can't return");
                // }
              }
              else {
                // debugger;
                this.checkCustomerInfor = true;
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
                        this.setItemReturnToBasket(this.order);
                        let value = this.order.discountAmount;
                        if(this.order.discountType === "Discount Percent")
                        {
                          value = this.order.discountRate;
                        }
                        this.basketService.changeDiscountValueNew( this.order.discountType, value);
                        // let basket = this.basketService.getCurrentBasket();
                        // console.log('basket' , basket);
                        // if (basket.items.length <= 0) {
                        //   this.alertify.warning("Order can't return");
                        // }
                      }, 1500);
                       
                    }
                    else
                    {
                      this.alertify.warning(response.message);
                    }
                    
                  }, (error) => {
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
                  // this.inputCustomer(this.order.cusId);
                  // let basket= this.basketService.getCurrentBasket();
                
                  
                }
                else  
                {
                  let firstChar = this.order.phone?.toString()?.substring(0, 1);
                  if (firstChar === "0") {
                    this.order.phone = "84" + this.order.phone?.toString()?.substring(1, this.order.phone.length);
                  }
                  let defaultCus = this.authService.getDefaultCustomer();
                  if(this.order.phone !== defaultCus.phone)
                  {
                    this.startTimer();
                    this.mwiService.getCustomerInformation(this.order.phone, this.storeSelected.storeId).subscribe((response: any) => {
                      if (response !== null && response !== undefined) {
                        this.checkCustomerInfor = true;
                        if (response.status === 1) {
                         
                          this.pauseTimer();
                          let cus = this.authService.mapWMiCustomer2Customer(response.data);// this.mapWMiCustomer2Customer(response.data); 
                          this.basketService.changeCustomer(cus, "Return").subscribe(() => {
          
                          });
                          debugger;
                         
                          this.setItemReturnToBasket(this.order); 
                          // let value = this.order.discountAmount;


                          // if(this.order.discountType === "Discount Percent")
                          // {
                          //   value = this.order.discountRate;
                          // }
                          // this.basketService.changeDiscountValueNew( this.order.discountType, value);



                          // let basket = this.basketService.getCurrentBasket();
                          // console.log('basket' , basket);
                          // if (basket.items.length <= 0) {
                          //   this.alertify.warning("Order can't return");
                          // }
                        }
                        else {
                          debugger;
                          this.alertify.warning(response.msg);
                        }
                      }
                      else {
                        this.alertify.warning('Data not found');
                      }
                    } , error=>{
                      debugger;
                      
                      Swal.fire({
                        icon: 'warning',
                        title:  "Customer from CRM System",
                        text:  error
                      });
                    });
                  }
                  else
                  {
                    this.checkCustomerInfor = true;
                    let cus = this.authService.mapWMiCustomer2Customer(defaultCus);// this.mapWMiCustomer2Customer(response.data); 
                    this.basketService.changeCustomer(cus, "Return").subscribe(() => {
      
                    });
                    debugger;
                    this.setItemReturnToBasket(this.order);
                    let value = this.order.discountAmount;
                    if(this.order.discountType === "Discount Percent")
                    {
                      value = this.order.discountRate;
                    }
                    this.basketService.changeDiscountValueNew( this.order.discountType, value);
                    // let basket = this.basketService.getCurrentBasket();
                    // console.log('basket' , basket);
                    // if (basket.items.length <= 0) {
                    //   this.alertify.warning("Order can't return");
                    // }
                  }
                }
               
              
      
              }
      
            }
            else
            {
              this.alertify.warning("Can't found TransId " + this.orderId +  " in store " + this.storeSelected.storeId);
            }
          }
        }
        else
        {
          this.alertify.warning(response.message);
        }
      
        
        
       
      }, (error) => {
        // this.alertify.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Bill Information',
          text: "Failed to get data"
        });
      }, () => {

      });

    }

  }


  // async setItemToBasket(lines: TSalesLine[]) {

    
  //   let itemNum=0;
  //   let oldItem = [];
 
  //   var newArray = []; 
  //   lines.forEach(val => newArray.push(Object.assign({}, val))); 
  //   newArray = newArray.filter(x=>x?.promotionIsPromo!=='1');
  //   newArray.forEach(async item => {
  //     // debugger;
  //     console.log('await barcode' , item.barCode);
  //     console.log('await  this.order.cusGrpId' ,  this.order.cusGrpId);
  //     this.basketService.changeBasketResponseStatus(false);
    
  //     if(item.weightScaleBarcode!==null &&  item.weightScaleBarcode!==undefined &&  item.weightScaleBarcode!== '')
  //     {
  //       item.barCode = item.weightScaleBarcode;
  //     }
      
  //     await this.itemService.getItemFilter(this.storeSelected.companyCode, this.storeSelected.storeId, item.itemCode, item.uomCode , item.barCode,
  //     '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', this.order.cusGrpId,'').subscribe(async (response: any) => {
  //       debugger;
  //       itemNum++;
  //       console.log('response barcode' , response);
  //       if(response.success)
  //        {

  //           let itemX = response.data[0];
  //           itemX.responseTime = response.responseTime;
  //           if(itemX!==undefined && itemX!==null)
  //           {
  //             if (item.slocId !== undefined && item.slocId !== null) {
  //               itemX.slocId = item.slocId;
  //             }
  //             else {
  //               itemX.slocId = this.storeSelected.whsCode;
  //             }
              
  //             let itembasket = this.basketService.mapProductItemtoBasket(itemX, 1);
  //             itembasket.weightScaleBarcode = item.weightScaleBarcode;
  //             if (itembasket.productName === null || itembasket.productName === undefined) {
  //               itembasket.productName = itemX.itemDescription;
  //             }
  //             itembasket.lineItems = [];
  //             let BOMLine = item.lines;
  //             debugger;
  //             if(BOMLine!==null && BOMLine!==undefined)
  //             {
  //               BOMLine.forEach(line => {
  //                 let bomLine = new IBasketItem ();
  //                 bomLine.id = line.itemCode;
  //                 bomLine.productName = line.itemName;
  //                 bomLine.quantity = line.quantity;
  //                 bomLine.uom = line.uomCode;
  //                 bomLine.price = line.price;
  //                 bomLine.lineTotal = line.lineTotal;
  //                 itembasket.lineItems.push(bomLine);
  //               });
  //             } 
  //             itembasket.quantity = item.openQty;
  //             itembasket.openQty = item.openQty;
  //             if (itembasket.isCapacity) {
  //               itembasket.appointmentDate = item.appointmentDate.toString();
  //               itembasket.timeFrameId = item.timeFrameId.toString();
  //               itembasket.storeAreaId = item.storeAreaId.toString();
  //               itembasket.quantity = item.openQty;
  //               itembasket.note = item.remark;
      
  //             }
              
  //             itembasket.prepaidCardNo = item.prepaidCardNo;
             
  //             itembasket.isSerial = item.isSerial;
  //             itembasket.isVoucher = item.isVoucher;
  //             itembasket.memberDate = item.memberDate;
  //             itembasket.memberValue = item.memberValue;
  //             itembasket.startDate = item.startDate;
  //             itembasket.endDate = item.endDate;
  //             itembasket.itemType = item.itemType;
  //             itembasket.promotionPromoCode = item?.promoId;
            
  //             let lineTotal = item.lineTotal;// item.quantity * item.price;
  //             let discountAmountLine = item.discountAmt ? item.discountAmt : 0;
             
  //             if (discountAmountLine > 0) {
      
  //               let xRs = lineTotal;// - discountAmountLine;
  //               let resultLine = xRs/ item.quantity; // (xRs - (xRs * discountTongBill / 100)) 
  //               itembasket.price =  resultLine;//item.price;
  //               itembasket.promotionPriceAfDis = resultLine;
  //               itembasket.promotionLineTotal = 1 * resultLine;
  //             }
  //             else { 
  //               let resultLine = lineTotal / item.quantity; // (lineTotal - (lineTotal * discountTongBill / 100))
  //               itembasket.price = item.price;
  //               itembasket.promotionPriceAfDis = resultLine;
  //               itembasket.promotionLineTotal = 1 * resultLine;
  //             }
  //             itembasket.price = item.price;
  //             itembasket.promotionPriceAfDis = item.lineTotalDisIncludeHeader / item.quantity;
  //             itembasket.promotionLineTotal = item.lineTotalDisIncludeHeader / item.quantity;
            
  //             itembasket.discountType = item.discountType === null || item.discountType === undefined ? "" : item.discountType;
  //             if (itembasket.discountType === 'Discount Percent') {
  //               itembasket.discountValue = item.discountRate;
  //             }
  //             if (itembasket.discountType === 'Discount Amount') {
  //               itembasket.discountValue = item.discountAmt/item.quantity;
  //             }
  //             if (itembasket.discountType === 'Fixed Quantity') {
  //               itembasket.discountValue = item.discountAmt/item.quantity;
  //             }
  //             if(itembasket.discountType === 'Fixed Price')
  //             {
  //               itembasket.discountValue = item.discountAmt/item.quantity;
  //             }
  //             itembasket.promotionDisAmt = item.discountAmt / item.quantity;
  //             itembasket.promotionDisPrcnt = item.discountRate;


  //             itembasket.promotionIsPromo = item.isPromo;
  //             itembasket.salesTaxCode = item.taxCode;
  //             itembasket.salesTaxRate = item.taxRate;
  //             itembasket.taxAmt = item.taxAmt;
  //             itembasket.promotionType = item.promoType;
  //             itembasket.baseLine = item.lineId;
  //             itembasket.baseTransId = item.transId;
              

  //             debugger;
  //             oldItem.push(itembasket);
            
  //           }
  //           else
  //           {
  //             Swal.fire({
  //               icon: 'warning',
  //               title: 'Data item ' + item.description + '  not found',
  //               text: response.message
  //             });
  //           }
              
  //        }
  //        else
  //        {
  //         Swal.fire({
  //           icon: 'warning',
  //           title: 'Data item ' + item.description + '  not found',
  //           text: response.message
  //         });
  //        }
 
  //        if(itemNum>=newArray.length)
  //        {
  //         debugger;
  //          this.basketService.addItemListBasketToBasket(oldItem, false);
  //          let basket = this.basketService.getCurrentBasket();
  //          this.basketService.applyPromotion(basket);
  //         this.basketService.changeBasketResponseStatus(true);
  //        }
  //     })
      
  //   });
   
  // }


  returnItemMode="FromOrder";
  checkCustomerInfor = false;
  // itemBasketReturn: IBasketItem[] = [];
  setItemReturnToBasket(order: Order) {
    let Lines = [];
    // lines: TSalesLine[]
   
    order.lines.forEach(async item => {
      // debugger;
      debugger;
      await this.itemService.getItemFilter(this.storeSelected.companyCode, this.storeSelected.storeId, '', '', item.barCode,
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', this.order.cusGrpId,'','','','').subscribe(async (response: any) => {
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
                let discountAmountLine = item.discountAmt ? item.discountAmt : 0;
                // let discountAmountLineAfterDis =lineTotal - item.discountAmt;
        
                let discountTongBill = order.discountRate;
                if (discountAmountLine > 0) {
        
                  let xRs = lineTotal;// - discountAmountLine;
                  let resultLine =  (xRs - (xRs * discountTongBill / 100))  / item.quantity ; 
                  // xRs / item.quantity; //
                  itembasket.price =  resultLine;//item.price;
                  itembasket.promotionPriceAfDis = resultLine;
                  itembasket.promotionLineTotal = 1 * resultLine;
                }
                else { 
                  let resultLine = (lineTotal - (lineTotal * discountTongBill / 100)) / item.quantity;// lineTotal / item.quantity; // (lineTotal - (lineTotal * discountTongBill / 100))
                  itembasket.price = item.price;
                  itembasket.promotionPriceAfDis = resultLine;
                  itembasket.promotionLineTotal = 1 * resultLine;
                }

                itembasket.price = item.price;
                itembasket.promotionPriceAfDis = item.lineTotalDisIncludeHeader / item.quantity;
                itembasket.promotionLineTotal = item.lineTotalDisIncludeHeader / item.quantity;
            
                itembasket.discountType = item.discountType === null || item.discountType === undefined ? "" : item.discountType;
                if (itembasket.discountType === 'Discount Percent') {
                  let discountRate = 100 - ((item.lineTotalDisIncludeHeader * 100) / item.lineTotalBefDis);
                  itembasket.discountValue =discountRate;// item.discountRate;
                }
                if (itembasket.discountType === 'Discount Amount') {
                  itembasket.discountValue =  item.discountAmt/item.quantity;
                }
                if (itembasket.discountType === 'Fixed Quantity') {
                  itembasket.discountValue = item.discountAmt/item.quantity;
                }
                if(itembasket.discountType === 'Fixed Price')
                {
                  itembasket.discountValue = item.discountAmt/item.quantity;
                }

                itembasket.promotionDisAmt = (item.lineTotalBefDis - item.lineTotalDisIncludeHeader) / item.quantity; //item.discountAmt / item.quantity
                itembasket.promotionDisPrcnt = itembasket.discountValue;// item.discountRate;


                itembasket.promotionIsPromo = item.isPromo;
                itembasket.salesTaxCode = item.taxCode;
                itembasket.salesTaxRate = item.taxRate;
                itembasket.taxAmt = item.taxAmt;
                itembasket.promotionType = item.promoType;
                itembasket.baseLine = item.lineId;
                itembasket.baseTransId = item.transId;
                 
                // this.basketService.addItemBasketToBasket(itembasket,  item.openQty); 
                Lines.push(itembasket);
                
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

      })
      console.log(Lines);
      // && x.barCode === item.barCode
      // let itemX = this.items.find(x => x.itemCode === item.itemCode && x.uomCode === item.uomCode);
      // debugger;
     
    });
    debugger;
    if(this.returnItemMode==="FromOrder")
    {
      this.basketService.addItemListBasketToTmpItemsBasket(Lines); 
      this.itemBasketReturn = Lines as IBasketItem[];
      debugger;
      // this.basketService.addItemListBasketToBasket(Lines, false);
    
      // debugger;
      console.log(Lines);
      const initialState = {
        items: Lines, title: 'Return Items',
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
            this.addNewOrder(); 
          }
          else
          {
            console.log('result', receivedEntry.models);
            if(receivedEntry.models?.length > 0)
            {
              this.basketService.addItemListBasketToBasket(receivedEntry.models, false);
              // this.basketService.changeDiscountValueNew(order.discountType, order.discountRate);
              this.basketService.calculateBasket();
            }
          
            // this.basketService.addItemListBasketToTmpItemsBasket(receivedEntry);
            // receivedEntry.models.forEach(item => {
            //   this.onEnter(item.barcode);
            // });
            
          }
        }
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

  // async setItemReturnToBasket(order: Order) {
  //   let Lines = [];
  //   // lines: TSalesLi
  //   let itemNum= 0;
   
  //   var newArray = []; 
  //   order.lines.forEach(val => newArray.push(Object.assign({}, val))); 
  //   newArray = newArray.filter(x=>x?.promotionIsPromo!=='1');
  //   for(let i= 0; i < newArray.length ; i++ )
  //   {
  //     let item  = newArray[i];
  //     // await timer(1000).pipe(take(1)).toPromise();
  //     // this.basketService.changeBasketResponseStatus(false);
  //     await this.itemService.getItemFilter(this.storeSelected.companyCode, this.storeSelected.storeId, '', '', item.barCode,
  //     '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', this.order.cusGrpId,'','','','').subscribe(async (response: any) => {
  //       itemNum++; 
      
  //       if(response.success)
  //        {
  //         debugger;
  //         let itemX = response.data[0];
  //         itemX.responseTime = response.responseTime;
  //         if (itemX !== null && itemX !== undefined && item.openQty > 0 && (item.itemType.toLowerCase() === 'retail' || item.itemType.toLowerCase() === 'r')) {
  //           // if (itemX !== null && itemX !== undefined) {
  //             // let infor=ressponse[0];
            
  //             if(itemX?.returnable!==null && itemX?.returnable!==undefined && itemX?.returnable===true)
  //             {
  //               if (item.slocId !== undefined && item.slocId !== null) {
  //                 itemX.slocId = item.slocId;
  //               }
  //               else {
  //                 itemX.slocId = this.storeSelected.whsCode;
  //               }
                
  //               let itembasket = this.basketService.mapProductItemtoBasket(itemX, 1);
  //               itembasket.weightScaleBarcode = item.weightScaleBarcode;
  //               if (itembasket.productName === null || itembasket.productName === undefined) {
  //                 itembasket.productName = itemX.itemDescription;
  //               }
  //               itembasket.lineItems = [];
  //               let BOMLine = item.lines;
  //               itembasket.quantity = item.openQty;
  //               itembasket.openQty = item.openQty;
  //               // debugger;
  //               if(BOMLine!==null && BOMLine!==undefined)
  //               {
  //                 BOMLine.forEach(line => {
  //                   let bomLine = new IBasketItem ();
  //                   bomLine.id = line.itemCode;
  //                   bomLine.productName = line.itemName;
  //                   bomLine.quantity = line.quantity / item.quantity;
  //                   bomLine.uom = line.uomCode;
  //                   bomLine.price = line.price;
  //                   bomLine.lineTotal = line.lineTotal;
  //                   itembasket.lineItems.push(bomLine);
  //                 });
  //               } 
             
  //               if (itembasket.isCapacity) {
  //                 itembasket.appointmentDate = item.appointmentDate.toString();
  //                 itembasket.timeFrameId = item.timeFrameId.toString();
  //                 itembasket.storeAreaId = item.storeAreaId.toString();
  //                 itembasket.quantity = item.openQty;
  //                 itembasket.note = item.remark;
        
  //               }
                
  //               itembasket.prepaidCardNo = item.prepaidCardNo;
  //               // itembasket.appointmentDate = item.appointmentDate.toString();
  //               // itembasket.storeAreaId = item.storeAreaId;
  //               // itembasket.timeFrameId= item.timeFrameId;
        
  //               itembasket.isSerial = item.isSerial;
  //               itembasket.isVoucher = item.isVoucher;
  //               itembasket.memberDate = item.memberDate;
  //               itembasket.memberValue = item.memberValue;
  //               itembasket.startDate = item.startDate;
  //               itembasket.endDate = item.endDate;
  //               itembasket.itemType = item.itemType;
  //               itembasket.promotionPromoCode = item?.promoId;
                
  //               let lineTotal = item.lineTotal;// item.quantity * item.price;
  //               let discountAmountLine = item.discountAmt ? item.discountAmt : 0;
  //               // let discountAmountLineAfterDis =lineTotal - item.discountAmt;
        
  //               let discountTongBill = order.discountRate;
  //               if (discountAmountLine > 0) {
        
  //                 let xRs = lineTotal;// - discountAmountLine;
  //                 let resultLine = xRs/ item.quantity; // (xRs - (xRs * discountTongBill / 100)) 
  //                 itembasket.price =  resultLine;//item.price;
  //                 itembasket.promotionPriceAfDis = resultLine;
  //                 itembasket.promotionLineTotal = 1 * resultLine;
  //               }
  //               else { 
  //                 let resultLine = lineTotal / item.quantity; // (lineTotal - (lineTotal * discountTongBill / 100))
  //                 itembasket.price = item.price;
  //                 itembasket.promotionPriceAfDis = resultLine;
  //                 itembasket.promotionLineTotal = 1 * resultLine;
  //               }

  //               itembasket.price = item.price;
  //               debugger;
  //               let value = this.authService.roundingAmount(item.lineTotalDisIncludeHeader) / item.quantity;
  //               // let value1 = value / 10 ;
  //               // let value2 = this.authService.roundingAmount(value1);
  //               // let value3 = value2 * 10;
  //               itembasket.promotionPriceAfDis = value;
  //               itembasket.promotionLineTotal = value;
            
  //               itembasket.discountType = item.discountType === null || item.discountType === undefined ? "" : item.discountType;
  //               if (itembasket.discountType === 'Discount Percent') {
  //                 itembasket.discountValue = item.discountRate;
  //               }
  //               if (itembasket.discountType === 'Discount Amount') {
  //                 itembasket.discountValue = item.discountAmt/item.quantity;
  //               }
  //               if (itembasket.discountType === 'Fixed Quantity') {
  //                 itembasket.discountValue = item.discountAmt/item.quantity;
  //               }
  //               if(itembasket.discountType === 'Fixed Price')
  //               {
  //                 itembasket.discountValue = item.discountAmt/item.quantity;
  //               }
  //               itembasket.promotionDisAmt = item.discountAmt / item.quantity;
  //               itembasket.promotionDisPrcnt = item.discountRate;


  //               itembasket.promotionIsPromo = item.isPromo;
  //               itembasket.salesTaxCode = item.taxCode;
  //               itembasket.salesTaxRate = item.taxRate;
  //               itembasket.taxAmt = item.taxAmt;
  //               itembasket.promotionType = item.promoType;
  //               itembasket.baseLine = item.lineId;
  //               itembasket.baseTransId = item.transId;
               
  //               // this.basketService.addItemBasketToBasket(itembasket,  item.openQty); 
  //               Lines.push(itembasket);
                
                
  //             }
  //             else
  //             {
                
  //               Swal.fire({
  //                 icon: 'warning',
  //                 title: 'Item',
  //                 text: 'Item ' + itemX.itemName + " can't return."
  //               });
  //             }
            
  //           }
  //       }
  //       else
  //       {
  //           Swal.fire({
  //             icon: 'warning',
  //             title: 'Data item ' + item.description + '  not found',
  //             text: response.message
  //           });
  //       }
       
  //       if(itemNum>=newArray.length)
  //       {
  //         debugger;
      
  //         if(this.returnItemMode==="FromOrder")
  //         {
  //           console.log('Lines', Lines);
  //           // this.basketService.addItemListBasketToTmpItemsBasket(Lines); 
  //           this.itemBasketReturn = Lines as IBasketItem[];
  //           debugger;
       
  //           // debugger;
  //           console.log('Lines X', Lines);
  //           const initialState = {
  //             items: Lines, title: 'Return Items',
  //           };
  //           this.modalRef = this.modalService.show(ShopExchangeItemListComponent, {
  //             initialState, animated: true,
  //             keyboard: true,
  //             backdrop: true,
  //             ignoreBackdropClick: true,
  //             ariaDescribedby: 'my-modal-description',
  //             ariaLabelledBy: 'my-modal-title',
  //             class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
  //           });
  //           this.modalRef.content.outEvent.subscribe((receivedEntry) => {
  //             console.log('result', receivedEntry);
  //             debugger;
  //             if (receivedEntry !== null && receivedEntry != undefined) {
  //               this.modalRef.hide();
  //               if (receivedEntry.success === false) {
  //                 this.addNewOrder();
  //               }
  //               else
  //               {
  //                 console.log('result', receivedEntry.models);
                  
  //                 this.basketService.addItemListBasketToBasket(receivedEntry.models, false);
  //                 this.basketService.calculateBasket();
  //                 // receivedEntry.models.forEach(item => {
  //                 //   this.onEnter(item.barcode);
  //                 // });
                  
  //               }
  //             }
  //           });
      
  //           // if (Lines !== null && Lines !== undefined && Lines.length > 0) {
            
        
  //           // }
  //           // else {
  //           //   Swal.fire({
  //           //     title: "Items in Order can't return/exchange",
  //           //     icon: 'info',
  //           //     showCancelButton: false,
  //           //     confirmButtonText: 'OK',
  //           //     cancelButtonText: 'No'
  //           //   }).then((result) => {
  //           //     if (result.value) {
  //           //       this.newOrder();
  //           //     } else if (result.dismiss === Swal.DismissReason.cancel) {
        
  //           //     }
  //           //   })
  //           // }
  //         }
  //         else
  //         {
  //           this.basketService.addItemListBasketToTmpItemsBasket(Lines); 
  //           this.itemBasketReturn = Lines as IBasketItem[];
  //           console.log('this.itemBasketReturn',this.itemBasketReturn);
  //         }
  //       }
  //     });
  //     await timer(1000).pipe(take(1)).toPromise();
  //   }
  //   // newArray.forEach(async item => {
  //   //   // debugger;
  //   //   console.log('item return ', item);
    
  //   //   debugger;
     
  //   // });
  //   // debugger; 
  // }
  itemBasketReturn: IBasketItem[] = [];
  // canReturnPayment=true;
  items: ItemViewModel[];
  // setItemReturnToBasket(order: Order) {
  //   let Lines = [];
  //   // lines: TSalesLine[]
   
  //   order.lines.forEach(async item => {
  //     // debugger;
  //     // && x.barCode === item.barCode
  //     let itemX = this.items.find(x => x.itemCode === item.itemCode && x.uomCode === item.uomCode);
  //     debugger;
  //     if (itemX !== null && itemX !== undefined && item.openQty > 0 && (item.itemType.toLowerCase() === 'retail' || item.itemType.toLowerCase() === 'r')) {
  //     // if (itemX !== null && itemX !== undefined) {
  //       // let infor=ressponse[0];
  //       if(itemX?.returnable!==null && itemX?.returnable!==undefined && itemX?.returnable===true)
  //       {
  //         if (item.slocId !== undefined && item.slocId !== null) {
  //           itemX.slocId = item.slocId;
  //         }
  //         else {
  //           itemX.slocId = this.storeSelected.whsCode;
  //         }
          
  //         let itembasket = this.basketService.mapProductItemtoBasket(itemX, 1);
  //         if (itembasket.productName === null || itembasket.productName === undefined) {
  //           itembasket.productName = itemX.itemDescription;
  //         }
  //         itembasket.lineItems = [];
  //         let BOMLine = item.lines;
  //         debugger;
  //         if(BOMLine!==null && BOMLine!==undefined)
  //         {
  //           BOMLine.forEach(line => {
  //             let bomLine = new IBasketItem ();
  //             bomLine.id = line.itemCode;
  //             bomLine.productName = line.itemName;
  //             bomLine.quantity = line.quantity;
  //             bomLine.uom = line.uomCode;
  //             bomLine.price = line.price;
  //             bomLine.lineTotal = line.lineTotal;
  //             itembasket.lineItems.push(bomLine);
  //           });
  //         } 
  //         itembasket.quantity = item.openQty;
  //         itembasket.openQty = item.openQty;
  //         if (itembasket.isCapacity) {
  //           itembasket.appointmentDate = item.appointmentDate.toString();
  //           itembasket.timeFrameId = item.timeFrameId.toString();
  //           itembasket.storeAreaId = item.storeAreaId.toString();
  //           itembasket.quantity = item.openQty;
  //           itembasket.note = item.remark;
  
  //         }
          
  //         itembasket.prepaidCardNo = item.prepaidCardNo;
  //         // itembasket.appointmentDate = item.appointmentDate.toString();
  //         // itembasket.storeAreaId = item.storeAreaId;
  //         // itembasket.timeFrameId= item.timeFrameId;
  
  //         itembasket.isSerial = item.isSerial;
  //         itembasket.isVoucher = item.isVoucher;
  //         itembasket.memberDate = item.memberDate;
  //         itembasket.memberValue = item.memberValue;
  //         itembasket.startDate = item.startDate;
  //         itembasket.endDate = item.endDate;
  //         itembasket.itemType = item.itemType;
          
  //         debugger;
  //         let lineTotal = item.lineTotal;// item.quantity * item.price;
  //         let discountAmountLine = item.discountAmt ? item.discountAmt : 0;
  //         // let discountAmountLineAfterDis =lineTotal - item.discountAmt;
  
  //         let discountTongBill = order.discountRate;
  //         if (discountAmountLine > 0) {
  
  //           let xRs = lineTotal;// - discountAmountLine;
  //           let resultLine = xRs/ item.quantity; // (xRs - (xRs * discountTongBill / 100)) 
  //           itembasket.price = item.price;
  //           itembasket.promotionPriceAfDis = resultLine;
  //           itembasket.promotionLineTotal = item.openQty * resultLine;
  //         }
  //         else {
  
  //           let resultLine = lineTotal / item.quantity; // (lineTotal - (lineTotal * discountTongBill / 100))
  //           itembasket.price = item.price;
  //           itembasket.promotionPriceAfDis = resultLine;
  //           itembasket.promotionLineTotal = item.openQty * resultLine;
  //         }
  //         itembasket.discountType = item.discountType === null || item.discountType === undefined ? "" : item.discountType;
  //         if (itembasket.discountType === 'Discount Percent') {
  //           itembasket.discountValue = item.discountRate;
  //         }
  //         if (itembasket.discountType === 'Discount Amount') {
  //           itembasket.discountValue = item.discountAmt;
  //         }
  //         if (itembasket.discountType === 'Fixed Quantity') {
  //           itembasket.discountValue = item.discountAmt;
  //         }
  //         if(itembasket.discountType === 'Fixed Price')
  //         {
  //           itembasket.discountValue = item.discountAmt;
  //         }
          
  //         itembasket.promotionIsPromo = item.isPromo;
  //         itembasket.salesTaxCode = item.taxCode;
  //         itembasket.salesTaxRate = item.taxRate;
  //         itembasket.taxAmt = item.taxAmt;
  //         itembasket.promotionType = item.promoType;
  //         itembasket.baseLine = item.lineId;
  //         itembasket.baseTransId = item.transId;
  
  //         // this.basketService.addItemBasketToBasket(itembasket,  item.openQty); 
  //         Lines.push(itembasket);
  //       }
  //       else
  //       {
  //         this.alertify.warning('Item' + itemX.itemName + " can't return.");
  //       }
      
  //     }
  //   });
  //   debugger;
  //   if (Lines !== null && Lines !== undefined && Lines.length > 0) {
  //     debugger;
  //     this.basketService.addItemListBasketToBasket(Lines, false);
  //   }
  //   else {
  //     Swal.fire({
  //       title: "Items in Order can't return/exchange",
  //       icon: 'info',
  //       showCancelButton: false,
  //       confirmButtonText: 'OK',
  //       cancelButtonText: 'No'
  //     }).then((result) => {
  //       if (result.value) {
  //         this.clearOrder();
  //       } else if (result.dismiss === Swal.DismissReason.cancel) {

  //       }
  //     })
  //   }
  // }

  




  // setItemReturnToBasket(lines: TSalesLine[]){
  //   lines.forEach(async item => {
  //     debugger;
  //     // && x.barCode === item.barCode
  //     let itemX = this.items.find(x=>x.itemCode === item.itemCode && x.uomCode===item.uomCode);

  //     if(itemX!==null && itemX!==undefined && item.openQty > 0)
  //     {
  //       // let infor=ressponse[0];

  //       if(item.slocId!==undefined&& item.slocId!==null)
  //       {
  //         itemX.slocId= item.slocId;
  //       }
  //       else
  //       {
  //         itemX.slocId= this.storeSelected.whsCode;
  //       }
  //       let itembasket = this.basketService.mapProductItemtoBasket(itemX, 1);
  //       if(itembasket.productName===null || itembasket.productName===undefined)
  //       {
  //         itembasket.productName = itemX.itemDescription;
  //       }
  //       if(itembasket.isCapacity)
  //       {
  //         itembasket.appointmentDate = item.appointmentDate.toString();
  //         itembasket.timeFrameId = item.timeFrameId.toString();
  //         itembasket.storeAreaId = item.storeAreaId.toString();
  //         itembasket.quantity = item.quantity;
  //         itembasket.note = item.remark;

  //       }
  //       itembasket.prepaidCardNo = item.prepaidCardNo;
  //       // itembasket.appointmentDate = item.appointmentDate.toString();
  //       // itembasket.storeAreaId = item.storeAreaId;
  //       // itembasket.timeFrameId= item.timeFrameId;
  //       itembasket.isSerial = item.isSerial;
  //       itembasket.isVoucher = item.isVoucher;
  //       itembasket.memberDate = item.memberDate;
  //       itembasket.memberValue = item.memberValue;
  //       itembasket.startDate = item.startDate;
  //       itembasket.endDate = item.endDate;
  //       itembasket.itemType = item.itemType;
  //       itembasket.openQty = item.openQty;
  //       itembasket.price = item.price;
  //       itembasket.discountType = item.discountType === null ? null : item.discountType.toString();
  //       itembasket.discountValue = item.discountAmt;
  //       itembasket.promotionIsPromo = item.isPromo;
  //       itembasket.salesTaxCode = item.taxCode;
  //       itembasket.salesTaxRate = item.taxRate;
  //       itembasket.taxAmt = item.taxAmt;
  //       itembasket.promotionType = item.promoType;
  //       itembasket.promotionType = item.promoType; 
  //       itembasket.baseLine = item.lineId === null ? null : item.lineId.toString();
  //       itembasket.baseTransId = this.order.transId;
  //       // debugger;
  //       this.basketService.addItemBasketToBasket(itembasket,  item.openQty); 
  //     }  
  //   });
  // }
  onValueChanged(e) {
    const previousValue = e.previousValue;
    const newValue = e.value;
    // Event handling commands go here
    // debugger;
    let employee: MEmployee = this.employees.find(x => x.employeeId === newValue);
    this.basketService.changeEmployee(employee);
    let basket = this.basketService.getCurrentBasket();
    basket.employee = employee;
  }
  employees: MEmployee[];
  loadEmployee() {
    this.employeeService.getByStore(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any) => {
      if(response.success)
      {

        this.employees = response.data;
      }
    });
  }

  toggleModal() {
    // debugger;
    this.discountModalShow = !this.discountModalShow;
  }
  increment(item: IBasketItem) {
    this.basketService.incrementItemQty(item);
  }
  onBlurMethod(item: IBasketItem) {
    // debugger;
    if (item.quantity <= 0 || item.quantity === null || item.quantity === undefined || item.quantity.toString() === "") {
      item.quantity = 0;
    }
    if (item.quantity > item.openQty) {
      item.quantity = item.openQty;
      this.alertify.warning("Return number can't more than open qty");
    }
    this.basketService.updateItemQtyWPromotion(item);
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
  remove(item: IBasketItem) {
    this.basketService.removeItemWiththoutPromotion(item);
  }
  removeCapacityLine(item: IBasketItem) {
    this.basketService.removeCapacityLineWiththoutPromotion(item);
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
    debugger;
    if (item.quantity === 0 || item.quantity === null) {
      item.quantity = 1;
    }
    this.modalRef = this.modalService.show(ShopCardInputComponent, { initialState });
  }
  editMemberLine(item: IBasketItem) {
    const initialState = {
      item: item, title: 'Item Capacity',
    };
    debugger;
    if (item.quantity === 0 || item.quantity === null) {
      item.quantity = item.memberValue;
    }
    this.modalRef = this.modalService.show(ShopMemberInputComponent, { initialState });
  }
  removePayment(payment: IBasketPayment) {
    this.basketService.removePayment(payment);
    this.selectedRow = null;
    this.amountCharge = null;
    this.payment = null;
  }
  clearAmount(i, payment: Payment) {
    this.amountCharge = "";
  }
  isShowOtherPayment: boolean = false;
  showOtherPayment() {
    this.isShowOtherPayment = !this.isShowOtherPayment;

  }
  closeOtherPad() {
    this.isShowOtherPayment = !this.isShowOtherPayment;
  }
  clearAmountPayment(payment: Payment) {
    this.basketService.addPaymentToBasket(payment, 0);
  }
  addPayment(paymentId: string, isClose?: boolean) {
    // debugger;
    let numCollected = 0;
    if (this.payment !== null) {
      let paymentX = this.basketService.getCurrentBasket().payments.find(x => x.id === this.payment.id);
      if (paymentX !== null && paymentX !== undefined) {
        numCollected = paymentX.paymentTotal;
      }
    }
    if (this.payment !== null && numCollected == 0) {
      // this.alertify.warning("Please Complete progress payment " + this.payment.id + "!");
      Swal.fire({
        icon: 'warning',
        title: 'Payment',
        text: "Please Complete progress payment " + this.payment.id + "!"
      });
    }
    else {
      this.amountCharge = "";
      let amountLeft = 0;
      this.basketTotal$.subscribe(data => {
        console.log(data);
        amountLeft = data.subtotal - data.totalAmount;
      });
      if (amountLeft <= 0) {
        this.alertify.warning("Can't add new payment to bill.");
      }
      else {
        this.payment = new Payment();
        // let paymentX = new Payment();
        // .id=
        this.payment.id = paymentId;
        this.payment.refNum = "";
        this.payment.paymentDiscount = 0;
        this.payment.paymentTotal = 0;
        this.basketTotal$.subscribe(data => {
          console.log(data);
          this.payment.paymentCharged = data.subtotal - data.totalAmount;
        });
        let linenum = this.basketService.getCurrentBasket().payments.length + 1;
        this.payment.lineNum = linenum;

        this.basketService.changePaymentCharge(this.payment);
        this.basketService.addPaymentToBasket(this.payment);
        var payments = this.basketService.getCurrentPayment();
        if (payments.length > 0) {
          this.selectedRow = this.basketService.getCurrentPayment().length - 1;
          this.setClickedRow(this.selectedRow, this.payment);
          for (let i = 0; i < payments.length; i++) {
            if (payments[i].id === paymentId) {
              this.selectedRow = i;
              this.setClickedRow(this.selectedRow, this.payment);
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

    }

  }

  inputNum(num: string) {
    // debugger;
    if (!this.isFastClick) {
      this.amountCharge = "";
    }
    if (this.amountCharge === null || this.amountCharge === undefined) {
      this.amountCharge = "";
    }
    this.isFastClick = true;
    //  this.payment.paymentCharged =
    let currentX = this.amountCharge === "" ? 0 : parseFloat(this.amountCharge);
    let numX = num === "" ? 0 : parseFloat(num);
    let value = currentX + numX;
    this.amountCharge = value.toString();
    // this.selectedRow = index;

    // this.payment.paymentCharged = parseFloat(this.amountCharge);
    this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));

    //  this.selectedRow = null;
  }
  isFastClick: boolean = false;
  pressKey(key: string) {
    if (this.isFastClick) {
      this.amountCharge = "";
    }
    if (this.amountCharge === null || this.amountCharge === undefined) {
      this.amountCharge = "";
    }
    this.isFastClick = false;
    // debugger;
    if (key === "000") {
      this.amountCharge = this.payment.paymentCharged.toString();
      // this.basketTotal$.subscribe(data => {
      //   debugger;

      // });
    }
    else {
      //  this.payment.paymentCharged =
      this.amountCharge += key;
    }

    // this.selectedRow = index;

    // this.payment.paymentCharged = parseFloat(this.amountCharge);
    this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
  }

  submitPayment() {

    // this.basketService.changePaymentCharge(this.payment); 
    this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
    this.amountCharge = "";
  }
  addNewOrder() {
    let test = this.basketService.getCurrentBasket()
    debugger;
    if (test === null) {
      this.basketService.getNewOrderCode(this.store.companyCode, this.store.storeId).subscribe(data => {
        // console.log(data);
        this.orderNo = data;
      });
      // this.alertify.success("AAAA");
      let cus = this.authService.getDefaultCustomer();
      debugger;
      
      if (cus !== null && cus !== undefined) {
        setTimeout(() => {
          if (this.authService.getShopMode() === 'FnB') {
            this.route.navigate(["shop/order"]).then(() => {
              // window.location.reload();
            });
          }
          if (this.authService.getShopMode() === 'Grocery') {
            this.route.navigate(["shop/order-grocery"]).then(() => {
              // window.location.reload();
            });

          }
          // this.basketService.changeCustomer(cus,"Retail").subscribe(()=>{
          //   this.route.navigate(['/shop/order']).then();
          // });
        }, 2);
      }
      else {
        this.customerService.getItem(this.store.companyCode, this.store.defaultCusId).subscribe((reponse: any) => {
          debugger;
          this.basketService.changeCustomer(reponse.data, "Retail").subscribe(() => {
            if (this.authService.getShopMode() === 'FnB') {
              this.route.navigate(["shop/order"]).then(() => {
                // window.location.reload();
              });
            }
            if (this.authService.getShopMode() === 'Grocery') {
              this.route.navigate(["shop/order-grocery"]).then(() => {
                // window.location.reload();
              });

            }
          });
          // this.route.navigate(['/shop/order']);


        });
      }

    }
  }
  onTypeChanged(type) {
    // debugger;
    if (type !== null && type !== undefined) {
      this.ItemType.emit(type);
    }

  }
  voucherVisible = false;
  toggleVoucherVisible() {
    this.voucherVisible = !this.voucherVisible;
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
  withTotalDiscountVisible = false;
  toggleTotalDiscountOptions() {
    this.withTotalDiscountVisible = !this.withTotalDiscountVisible;
  }
  
  checkLines()
  {
    debugger;
    let checkRs = false;
    let basket = this.basketService.getCurrentBasket();
    basket.items = basket.items.filter(x=>x.quantity > 0);
    let rs = basket.items.filter(x=>x.openQty > 0 && x.openQty >= x.quantity);
    if(rs!==null && rs!==undefined && rs.length > 0)
    {
      checkRs= true;
    }
    // basket.items.forEach(line => {
    //   let amountX = line.lastPrice * 10 / 100;
    //   let fromAmt = line.lastPrice - amountX ;
    //   let toAmt = amountX + line.lastPrice;
    //   if(line.price > toAmt || line.price < fromAmt)
    //   {
    //     rs = false;
    //     return rs;
    //   }
    // });
    return checkRs;
  }
  outPutModel: Order;
  discountLine = 0;
  bonusLine = 0;
  typeOrder: string = "Return";
  getBill(transId) {
    return this.billService.getBill(transId, this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any) => {
      debugger;
      if(response.success)
      {
        response.data.lines.forEach(line => {
          if(line.discountType !== "Bonus Amount"){
            this.discountLine += line.discountAmt === null ? 0 : line.discountAmt;
            this.order.discountLine = this.discountLine;
            console.log("this.discountLine", this.discountLine);
          }else{
            this.bonusLine += line.discountAmt === null ? 0 : line.discountAmt;
            this.order.bonusLine = this.bonusLine;
            console.log("this.bonusLine", this.bonusLine);
          }
        });
  
        this.outPutModel = response.data;
        console.log("response aaa", response.data);
        // debugger;
        // this.printTemplate();
        setTimeout(() => {
          window.print();
        }, 1000);
        setTimeout(() => {
          this.route.navigate(["shop/bills", transId, this.storeSelected.companyCode, this.storeSelected.storeId]).then(() => { window.location.reload(); });
                
        }, 1000);
      }
      else
      {
        this.alertify.warning(response.message);
      }
     
     
    })
  }
  addOrder(value) {
    debugger;
    if (value === true) {
      if (this.orderId === "" || this.orderId === null || this.orderId === undefined || this.orderId.toString() === "undefined") {
        this.orderNo = "";
      }

     
    
      // this.testRemoveBasket();
      let basket = this.basketService.getCurrentBasket();
      let saleMode = "RETURN";

      if( this.checkLines())
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
          debugger;
          const initialState = {
            reasonList:  this.reasonList,
            langs: langOptions
        };
    
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
                debugger;
                this.order.reason = response.selectedReason;
                let cusId = basket.customer.id;
                let contractNo = basket.contractNo;
                this.basketService.addOrder(this.order.transId, saleMode).subscribe(
                  (response: any) => {
                    if (response.success) {
          
                      this.alertify.success(response.message);
                      this.getBill(response.message);
                      // this.route.navigate(["shop/bills", this.orderId, this.storeSelected.companyCode, this.storeSelected.storeId]).then(() => { window.location.reload(); });
                      
                      debugger;
          
                    }
                    else { 
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
              else  
              {
                modalRefX.hide();
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
              this.order.reason = result.value;
              let cusId = basket.customer.id;
              let contractNo = basket.contractNo;
              this.basketService.addOrder(this.order.transId, saleMode).subscribe(
                (response: any) => {
                  if (response.success) {
        
                    this.alertify.success(response.message);
                    this.getBill(response.message);
                    // this.route.navigate(["shop/bills", this.orderId, this.storeSelected.companyCode, this.storeSelected.storeId]).then(() => { window.location.reload(); });
                    
                    debugger;
        
                  }
                  else {
        
                    this.alertify.warning(response.message);
        
        
                  }
        
                },
                (error) => {
                  // this.alertify.error(error);
                  Swal.fire({
                    icon: 'error',
                    title: 'Bill Information',
                    text: "Failed to create data"
                  });
                }
              );
            }
          })
        }
      
        
      }
      else
      {
          this.alertify.warning('Quantity not available');
      }
      this.modalRef.hide();
      // const customer = this.customer;
      // let order = new Order();
      // order = this.order;

      // order.shiftId = this.shiftService.getCurrentShip().shiftId;
      // order.manualDiscount = '';
      // order.refTransId = this.order.transId;
      // order.transId ='';
      // order.remarks =''; 
      // order.salesPerson = 'CP00100001';
      // order.createdBy = this.authService.decodeToken?.unique_name;
      // order.status = 'C';
      // order.storeId = this.storeSelected.storeId;
      // // Hold, Sales(-) , Sales Deposit(-), Exch (-), Exch Depo(-), Return + . 
      // order.salesMode = 'RETURN';
      // order.discountType = "";
      // order.discountRate =0;
      // order.discountAmount = 0;
      // order.isCanceled = 'N';
      // order.totalAmount = this.returnTotal.value.totalAmount;
      // order.totalDiscountAmt =0;
      // order.totalPayable = this.returnTotal.value.totalAmount;
      // order.totalReceipt = this.returnTotal.value.totalCollected;
      // order.amountChange = this.returnTotal.value.ChangeAmount;
      // order.paymentDiscount = 0; 
      // order.totalTax = 0; 
      // order.createdBy = this.authService.getCurrentInfor().username;
      // var items = this.order.lines.filter(x=>x.returnQty > 0);
      // order.lines = [];
      // items.forEach((item) => {
      //   let line = new TSalesLine();
      //   line = item;
      //   debugger;
      //   line.quantity = item.returnQty; 

      //   line.status = "C";
      //   line.price = item?.returnQty * (item?.quantity * item?.price - item?.discountAmt)/item?.quantity//  item.returnAmt / item.returnQty;  
      //   line.baseTransId = order.refTransId;
      //   line.baseLine =  parseInt(item.lineId);
      //   const value = 0;
      //   let discountType= item.discountType;
      //   line.discountRate = item.discountRate;
      //   line.discountAmt = item.discountAmt;
      //   line.discountType = discountType;
      //   line.lineTotal = line.price * item?.returnQty;
      //   order.lines.push(line);
      // });



    }
    else {
      this.modalRef.hide();

    }

  }
  clearOrder() {



    const basket = this.basketService.getCurrentBasket();
    if(basket!==undefined && basket!==null)
    {
      this.basketService.deleteBasket(basket).subscribe(() => {
 
      });
    }
   
    setTimeout(() => {
      if (this.authService.getShopMode() === 'FnB') {
        this.route.navigate(["shop/order"]).then(() => {
          window.location.reload();
        });
      }
      if (this.authService.getShopMode() === 'Grocery') {
        this.route.navigate(["shop/order-grocery"]).then(() => {
          window.location.reload();
        });

      }
    }, 2);


  }

  cancelOrder() {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want new order',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {

        const basket = this.basketService.getCurrentBasket();
        let currentType = basket.salesType;
        this.basketService.deleteBasket(basket).subscribe(() => {

          

        });
        setTimeout(() => {
          if (this.authService.getShopMode() === 'FnB') {
            this.route.navigate(["shop/order"]).then(() => {
              window.location.reload();
            });
          }
          if (this.authService.getShopMode() === 'Grocery') {
            this.route.navigate(["shop/order-grocery"]).then(() => {
              window.location.reload();
            });

          }
        }, 2);
        

      }
    });
  }


  basketDiscountTotal$: Observable<IBasketDiscountTotal>;

}
