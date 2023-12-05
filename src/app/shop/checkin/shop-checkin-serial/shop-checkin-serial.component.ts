import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Lightbox } from 'ng-gallery/lightbox';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { MCustomer } from 'src/app/_models/customer';
import { TInvoiceHeader } from 'src/app/_models/invoice';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { Payment } from 'src/app/_models/payment';
import { MStore } from 'src/app/_models/store';
import { SStoreClient } from 'src/app/_models/storeclient';
import { IBasket } from 'src/app/_models/system/basket';
import { TSalesLine } from 'src/app/_models/tsaleline';
import { TSalesPayment } from 'src/app/_models/tsalepayment';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { BomService } from 'src/app/_services/data/bom.service';
import { ImageService } from 'src/app/_services/data/image.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { LicensePlateService } from 'src/app/_services/data/LicensePlate.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { StorePaymentService } from 'src/app/_services/data/store-payment.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InvoiceService } from 'src/app/_services/transaction/invoice.service';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-shop-checkin-serial',
  templateUrl: './shop-checkin-serial.component.html',
  styleUrls: ['./shop-checkin-serial.component.scss']
})
export class ShopCheckinSerialComponent implements OnInit {
  public webcamImage: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  modalRef: BsModalRef;
  showModal: boolean = false;
  invoice: TInvoiceHeader;
  discountModalShow: boolean = false;
  order: Order =new Order();
  items: ItemViewModel[];
  basket$: Observable<IBasket>;
  oldtype:string;
  oldvalue:string;
  constructor( private spinnerService: NgxSpinnerService, public lightbox: Lightbox, private sanitizer: DomSanitizer, private imageService: ImageService, private alertify: AlertifyService,
     private itemService: ItemService, private bomService: BomService,private LicensePlate: LicensePlateService, private invoiceService: InvoiceService,  
    private shiftService: ShiftService, private basketService: BasketService, public commonService: CommonService,  
    private authService: AuthService,private billService: BillService,private storePaymentService: StorePaymentService,
    //  private shiftService: ShiftService, 

    private route: ActivatedRoute, private modalService: BsModalService, private router: Router) {
    this.invoice = new TInvoiceHeader();
  }
  ngAfterViewInit() {
    this.invoice = new TInvoiceHeader();
    // debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function (item) {
      // Do stuff here
      if (item !== null && item !== undefined) {
        item.classList.add('hide');
        // console.log('check in voucher');
      }
    });
    // paymentMenu

  }

  getNewCode() {
    this.invoiceService.getNewOrderCode(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).subscribe(data => {
      console.log(data);
      this.invoice.transId = data;

    });
    // this.invoiceService.getNewOrderCode(this.invoice.companyCode, this.invoice.storeId).subscribe((response: any)=>{
    //   debugger;
    //    this.invoice.transId = response;

    // }); 
    // this.orderId = this.invoice.transId;
    this.basketService.getNewOrderCode(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).subscribe(data => {

      this.orderId = data;
    });
  }

  selectedCateFilter: string = "";
  merchandiseList: MMerchandiseCategory[];
  // pagination: Pagination;
  userParams: any = {};
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
  onSerialBlurMethod(item, serialItem, value) {
    // debugger;
    console.log("onSerialBlurMethod");
    if (value === null || value === undefined || value.toString() == "undefined" || value.toString() == "") {
      value = 0;
    }
    let itemX = item.serialLines.find(x => x.serialNum === serialItem.serialNum);
    itemX.quantity = value;
    let qty = item.serialLines.reduce((a, b) => parseInt(b.quantity) + a, 0);
    item.quantity = qty;

  }
  VirtualKey$: Observable<boolean>;
  storeSelected: MStore;
  poleDisplay="false";
  poleValue: SStoreClient;
  ngOnInit() {
    this.basket$ = this.basketService.basket$;
    this.VirtualKey$ = this.commonService.VirtualKey$;
    this.storeSelected = this.authService.storeSelected();
    this.poleValue = this.getPole();
    // this.route.data.subscribe(data => {
    //   this.order = data['order'];
    // });  
    this.getNewCode();
    this.loadItem();
    let date = new Date();
    this.invoice.createdOn = date;
    this.order.orderId = uuidv4();
  }
  openCamera = false;
  toggleCamera() {
    this.openCamera = !this.openCamera;
  }
  customerInvoice: MCustomer;
  NewcheckIn()
  {
    window.location.reload();
  }
  simpleProducts=[{
    value: 'lp', name:'License Plate'
  },
  {
    value: 'serial', name:'Card Num'
  }]
  itemByVoucher: ItemViewModel;
  getData(value)
  {
    // this.getBill("SOCHVW010606220001");
    // this.oldtype = type;
    // this.oldvalue = value;
    // if(type==='phone')
    // {
    //   this.findCustomer(value);
    // }
    // else
    // {  
    //   this.getMemberCard(value);
    // }
    value= value.replace(/\s/g, "");
    this.LicensePlate.getSerialInfo(this.authService.getCompanyInfor().companyCode,this.authService.storeSelected().storeId,value).subscribe((response: any) => {
          debugger;
          console.log("response", response);
          if (response !== null && response !== undefined) {
    
            if (response.success ==true) {
              this.customerInvoice = response.data.customerinfo[0];
              this.serialMemberList = response.data.vourcherDetail;
              // response.data.forEach(cus => {
              //   let customer = this.mapWMiCustomer2Customer(cus);
              //   this.customers.push(customer);
              //  });
              //  console.log(this.customer);
            }
            else {
              //Msg  MsgVN
              if(response.msg===null || response.msg === undefined || response.msg === '')
              {
                this.alertify.warning("Can't get customer");
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
  serialMemberList: any[]=[];

  isShowSlickSlider = false;
  public refreshSlickSlider() {
    this.isShowSlickSlider = false;
    setTimeout(x => this.isShowSlickSlider = true);
  }
  orderId = "";
  Redeem (item){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Redeem bill!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        debugger;
        // let selectitem:ItemViewModel;
       let selectitem = this.items.filter(x => x.itemCode ==item.itemCode);
      //  console.log(selectitem[0])
      //  console.log(item)
      this.basketService.getBasketLocal()
      let basket =this.basketService.getCurrentBasket()
     
       if(selectitem.length >0)
       {
         this.order = new Order();
        selectitem[0].defaultPrice = item.defaultPrice;
        let itemx = selectitem[0];
        let itemv =  this.basketService.mapProductItemtoBasket(itemx,1)
        let storeClient = this.authService.getStoreClient();
        if(storeClient!==null && storeClient!==undefined)
        {
          this.order.terminalId = this.authService.getStoreClient().publicIP;
        }
        else
        {
          // let test = this.authService.getLocalIP();
          this.order.terminalId = this.authService.getLocalIP();
          // console.log(test);
        }
        if(this.order.terminalId!==null && this.order.terminalId!==undefined && this.order.terminalId!== '')
        {
            let store = this.authService.storeSelected();
            let cancel = 'N';
            let isNegative = false;

            if (this.shiftService.getCurrentShip() == null || this.shiftService.getCurrentShip() === undefined) {
              console.log("You are not on the shift");
              this.alertify.warning("You are not on the shift. Please create your shift.");
      
            }
            else
            {
              
              
              // this.invoice.companyCode = this.storeSelected.companyCode;
              // this.invoice.createdBy = this.authService.getCurrentInfor().username;
              // this.invoice.storeId = this.storeSelected.storeId;
              // this.invoice.storeName = this.storeSelected.storeName;
              // this.invoice.salesMode = 'SALES';
              // this.invoice.shiftId = this.shiftService.getCurrentShip().shiftId;
              // this.invoice.invoiceType = "CheckIn";
              // this.invoice.posType = 'R';
              // this.invoice.salesType = 'Retail';
              // if (this.webcamImage !== null && this.webcamImage !== undefined) {
              //   this.invoice.image = this.webcamImage.imageAsBase64;
              // }
             
              // debugger;
              // this.invoice.cusId = this.customerInvoice.customerId;
              // this.invoice.cusAddress = this.customerInvoice.address;
              // this.invoice.phone = this.customerInvoice.phone;
              // this.invoice.cusAddress = this.customerInvoice.address;
              // this.invoice.dataSource = 'POS';
              // let invoice:TSalesInvoice = new TSalesInvoice()
              //   invoice.customerName = this.customerInvoice.customerName;
              //   invoice.address =      this.customerInvoice.address;
              //   invoice.companyCode =  this.storeSelected.companyCode;
              //   invoice.storeId =      this.storeSelected.storeId;
              //   invoice.storeName = this.storeSelected.storeName;
              //   invoice.email = this.customerInvoice.email;
              //   invoice.phone = this.customerInvoice.phone;
              //   invoice.transId = this.invoice.transId;
              // // this.order.invoice. = this.customerInvoice.phone;
              // // if (this.customerInvoice.first_name !== null && this.customerInvoice.first_name !== undefined) {
              // //   name += this.customerInvoice.first_name;
              // // }
              // // if (this.customerInvoice.last_name !== null && this.customerInvoice.last_name !== undefined) {
              // //   name += " " + this.customerInvoice.first_name;
              // // }
              // // name = customerName;
              // // this.invoice.cusName = this.customerInvoice.customerName;
              // this.order.invoice = invoice;

              this.order.cusId = this.customerInvoice.customerId;
              this.order.phone = this.customerInvoice.phone;
              this.order.cusName = this.customerInvoice.customerName;
              this.order.cusAddress = this.customerInvoice.address;
              this.order.cusGrpId = this.customerInvoice.customerGrpId ?? "";
              this.order.storeName = store.storeName;
              this.order.companyCode = store.companyCode;
              // this.order.contractNo = this.customerInvoice.contractNo;
              // this.order.posType = "E";
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

              this.order.shiftId = this.shiftService.getCurrentShip().shiftId;
              // this.order.invoice = basket.getValue().invoice;
              // this.order.delivery = basket.getValue().delivery;
              // this.order.approvalId = basket.getValue().userApproval;
              this.order.manualDiscount = '';
              this.order.refTransId = '';
              // this.order.orderId =this.orderId;
              // this.order.reason = basket.getValue().reason;
              // this.order.remarks = this.basket$.getValue().note;
              this.order.logs = this.authService.getOrderLog();
              this.order.status = 'C';
              // if(basket !=null)
              // {
              //   this.order.orderId = basket.id;

              // }
              this.order.orderId = uuidv4();
                this.order.salesMode = "CheckIn";//'HOLD''SALES';
              let employee = basket.employee;
              if (employee !== null && employee !== undefined) {
                this.order.salesPerson = employee.employeeId;
                this.order.salesPersonName = employee.employeeName;
              }
              else
              {
                this.order.salesPerson = this.authService.decodeToken?.unique_name;
                this.order.salesPersonName = this.authService.decodeToken?.unique_name;
              }
              this.order.createdBy = this.authService.decodeToken?.unique_name;
              this.order.chanel = this.authService.storeSelected().customField2;
              // this.order.omsId = basket.getValue().omsId;
              this.order.storeId = store.storeId;
              this.order.isCanceled = cancel;
              this.order.dataSource = 'POS';
              this.order.posType = 'm';
              let storeCurrency = this.authService.getStoreCurrency();
              debugger;
              let billTotal = item.defaultPrice * 1;
              if (storeCurrency !== null && storeCurrency !== undefined && storeCurrency.length > 0) {
      
                this.order.totalAmount = this.authService.roundingAmount(billTotal);
                this.order.totalDiscountAmt = 0;
                this.order.totalPayable = billTotal;
                this.order.totalReceipt = billTotal;
      
              }
              else {
                this.order.totalAmount = billTotal;
                this.order.totalDiscountAmt = 0;
                this.order.totalPayable = billTotal;
                this.order.totalReceipt =billTotal;
              }
              // debugger;
              // if(Math.abs(order.totalPayable) - Math.abs(order.totalAmount) - Math.abs(order.totalDiscountAmt) > 0)
              // {
                 this.order.roundingOff = 0;
    
              // }
              // else
              // {
              //   order.roundingOff =  isNegative === true ? -basketTotal.getValue().billRoundingOff : basketTotal.getValue().billRoundingOff;
              // }
              let amountChange = this.order.totalReceipt - this.order.totalPayable;
              // order.amountChange = isNegative === true ?  -this.basketTotal.getValue().changeAmount : this.basketTotal.getValue().changeAmount;
              this.order.amountChange = amountChange;
              this.order.paymentDiscount = 0;
              this.order.promoId = "";

                this.order.discountType ="Discount Percent"
                this.order.discountRate = 0;
                this.order.discountAmount = 0;
                this.order.totalTax = 0;

                let line = new TSalesLine();
                line.quantity = 1;
                line.itemCode = itemv.id;
                line.price = item.defaultPrice;
                line.lineTotal = line.price * line.quantity;
                  // debugger;
                  line.uomCode = itemv.uom;
                  line.barCode = itemv.barcode;
                  line.description = itemv.productName;
                  line.storeAreaId = itemv.storeAreaId;
                  line.timeFrameId = itemv.timeFrameId;
                  line.appointmentDate = itemv.appointmentDate;
                  line.promoId = itemv.promotionPromoCode;
                  line.remark = itemv.note;
                  line.baseLine = parseInt(item.baseLine);
                  line.baseTransId = item.baseTransId;
                  // line.promoType= item.promotionType;
                  // line.promoPercent= item.promotionDiscountPercent;
                  // line.promoPrice = item.promotionPriceAfDis;
                  // line.promoLineTotal = item.promotionLineTotal;
                  // line.promoDisAmt = item.promotionDisAmt;
                  line.openQty = itemv.quantity;
                  line.priceListId = itemv.priceListId;
                  line.isPromo = itemv.promotionIsPromo;
                  line.isSerial = itemv.isSerial;
                  line.isVoucher = itemv.isVoucher;
                  line.itemType = itemv.customField1;
                  line.discountType = "Discount Percent";
                  line.discountRate = 0;
                  line.discountAmt = 0;
                  line.lineTotalBefDis = line.lineTotal;
                  line.lineTotalDisIncludeHeader = line.lineTotal;
                  line.status = "C";
                  line.slocId = itemv.slocId;
                  line.prepaidCardNo = itemv.prepaidCardNo;
                  line.memberDate = itemv.memberDate;
                  line.memberValue = itemv.memberValue;
                  line.taxCode = itemv.salesTaxCode;
                  line.taxRate = itemv.salesTaxRate;
                  line.custom1 = this.customerInvoice.customF1;
                  line .custom2 = item.transId;
                  line.serialNum = item.serialNum;
                  // line.taxAmt = line.price * line.quantity * line.discountAmt * line.taxRate;
                  line.taxAmt = 0;
                  if (line.taxAmt === null || line.taxAmt === undefined) {
                    line.taxAmt = 0;
                  }
                  this.order.totalTax = 0;
                  this.order.lines.push(line);
                  //payment
                  let terminalId = "";
                  let storeClient = this.authService.getStoreClient();
                  if (storeClient !== null && storeClient !== undefined) {
                    terminalId = this.authService.getStoreClient().publicIP;
                  }
                  else {
                    terminalId = this.authService.getLocalIP();
                  }
           this.storePaymentService.getByStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, terminalId).subscribe((res: any) => {
                    debugger
                    if(res.success)
                    {
                      let defautPayment = res.data.filter(x=>x.paymentCode ===item.customField10);
                      if(defautPayment?.length>0)
                      {
                        let payment = new TSalesPayment();
                        payment.paymentCode = defautPayment[0].paymentCode;
                        payment.currency = defautPayment[0].currency;
                        payment.shortName = defautPayment[0].shortName;
                        payment.dataSource = "POS";
                        payment.paymentDiscount = 0;
                        
                        payment.lineId = "1";
                        payment.rate = 1;
                        payment.fcRoundingOff = 0;
                        payment.roundingOff = 0;
                        payment.customF2 = defautPayment[0].paymentType;
                          // this.payment.paymentCharged = data.subtotal - data.totalAmount;
                         payment.chargableAmount = this.order.totalPayable;
                         payment.collectedAmount =this.order.totalPayable;
                         this.order.payments.push(payment);
                         try
                         {
                           debugger;
                            
                           this.basketService.CreateOrderByOrder(this.order).subscribe(
                             async (response: any) => {
                               // console.log('respone 2' , this.basketService.getBasketResponseStatus());
                               // this.basketService.changeBasketResponseStatus(false); 
                               this.basketService.changeIsCreateOrder(false);
                              
                               if (response.success) {
                                
                                 // this.getBill(response.message, amountLeft);
                                 this.alertify.success(response.message);
                                 this.getNewCode();
                                 this.getData("");
                                 this.getBill(response.message);
                                //  setTimeout(() => { 
                                //               window.location.reload();
                                //               }, 500);

                                 // this.getBill(response.message);
                                 // await timer(1000).pipe(take(1)).toPromise(); 
                               }
                               else {
                                 if(response?.code === 2000 || response?.code === '2000')
                                 {
                                    this.basketService.changeDateTime(new Date());
                                   //  this.NewcheckIn();
                                 }
                                 this.basketService.changeBasketResponseStatus(true);
                                 // console.log("falied Order");
                                
                                 if(response.data !== null && response.data !== undefined && response.data !== '')
                                 {
                                   this.alertify.error(response.message);
                                   await timer(1000).pipe(take(1)).toPromise();  
                                   // this.getBill(response.data, amountLeft);
                                   // this.alertify.success(response.message);
                                   // this.NewcheckIn();
                                 }
                                 else
                                 {
                                   // this.NewcheckIn();
                                   this.alertify.error(response.message);
                                 }
                                
                               }
                       
                             },  (error) => {
                               this.basketService.changeIsCreateOrder(false);
                               this.basketService.changeBasketResponseStatus(true);
                               // console.log("error Order");
                               // this.NewcheckIn();
                               this.alertify.error(error);
                             }
                           ),  (error) => {
                             this.basketService.changeIsCreateOrder(false);
                             this.basketService.changeBasketResponseStatus(true);
                             // this.NewcheckIn();
                             // console.log("error Order");
                             this.alertify.error(error);
                           }
                         }
                         catch(e)
                         {
                           this.basketService.changeIsCreateOrder(false);
                           this.basketService.changeBasketResponseStatus(true);
                           // console.log("error Order");
                           this.alertify.error(e);
                         }
                      }
                     else
                     {
                       this.alertify.error("Payment "+item.customField10 + " Not found!")
                     }
                    }
                    else
                    {
                      this.alertify.error(res.message);
                    }
                  });
                
            }
          }
          else
    {
      console.log("Counter ID can't null ");
      // this.changeIsCreateOrder(false);
      // this.changeBasketResponseStatus(true);
      this.alertify.warning("Counter ID can't null please mapping value in Store Counter");
    }
       
      }
       else 
       {
         this.alertify.warning("The Item has Remove !")
       }
      }
      
    });
  }
  loadItem() {
    // debugger;
    this.itemService.getItemFilter(this.storeSelected.companyCode, this.storeSelected.storeId, '', '', '', '', '', '', '', '', '', '', '', '', '', ''
      , '', '', '', '', '', '', '', '', '', '', '', '','', '','','').subscribe((response: any) => {
        if (response.success) {

          this.items = response.data.filter(x => x.barCode !== '');
          this.items.map((todo, i) => { todo.responseTime = response.responseTime});
 
        }
        else {
          this.alertify.warning(response.message);
        }
      });
  }
  printByApp="true";
  outPutModel: Order;
  typeOrder: string = "Receipt";
  getBill(transId)
  {
    let loopNum =0;
    let waitingAPi = true;
    // this.router.navigate(["shop/bills/print", transId, this.store.companyCode, this.store.storeId]).then(() => {
    //   window.location.reload();
    // }); 
    // this.router.navigate(["shop/bills/print", 'SOCHVW010606220001', 'CP001', 'CHVW01']).then(() => {
    //   window.location.reload();
    // }); 
    if(this.printByApp==="true")
    {
      this.billService.getBill(transId, this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any) => {
        loopNum++;
        debugger;
        // this.basketService.changeBasketResponseStatus(true);
        // console.log("getBill");
        if (response.success) {
          response.data.totalQty = 0;
          // console.log('response.data print', response.data);
          response.data.lines.forEach(line => {
            // if(line.discountType !== "Bonus Amount"){
            //   this.discountLine += line.discountAmt === null ? 0 : line.discountAmt;
            //   this.order.discountLine = this.discountLine;
            //   // console.log("this.discountLine", this.discountLine);
            // }else{
            //   this.bonusLine += line.discountAmt === null ? 0 : line.discountAmt;
            //   this.order.bonusLine = this.bonusLine;
            //   // console.log("this.bonusLine", this.bonusLine);
            // }
            response.data.totalQty += line.quantity;
          
          }); 
          
          // console.log("this.outPutModel", this.outPutModel);
         
          if(response.data!==null && response.data!==undefined)
          {
            // console.log('this.outPutModel', this.outPutModel);
            waitingAPi = false;
            
                setTimeout(() => {
                  this.outPutModel = response.data;
                  // window.print(); 
                }, 200);

          }
          else{
            Swal.fire({
              icon: 'warning',
              title: 'Print bill',
              text: "Can't get data of order. Please manual print"
            }).then(() => {
              this.router.navigate(["shop/bills/print", transId, this.storeSelected.companyCode, this.storeSelected.storeId]).then(() => {
                window.location.reload();
              }); 
            });
          }
          // debugger;
        
          // this.printTemplate();
          
         
          // this.outPutModel = response.data;
         
          // setTimeout(() => {
          //   window.print();
          // }, 1000);
  
          // this.newOrder()
        }
        else {
          this.alertify.warning(response.message);
        }
        
      })
    }
    else
    {
      this.basketService.changeBasketResponseStatus(true);
      let reprint = false;
      let poleValue = this.getPole();
      let size = "";
      if(poleValue!==null && poleValue!==undefined)
      {
        if(poleValue?.printSize!==null && poleValue?.printSize!==undefined)
        {
          size = poleValue?.printSize;
        }
      }
      this.billService.PrintReceipt( this.storeSelected.companyCode, this.storeSelected.storeId, transId, 'Receipt', size, poleValue.printName ).subscribe((response: any) => {
        
        if (response.success) {
        }
        else {
          this.alertify.warning(response.message);
        }
        
      })
    }
  }
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
}

const data = [
  {
    srcUrl: 'https://preview.ibb.co/jrsA6R/img12.jpg',
    previewUrl: 'https://preview.ibb.co/jrsA6R/img12.jpg'
  },
  {
    srcUrl: 'https://preview.ibb.co/kPE1D6/clouds.jpg',
    previewUrl: 'https://preview.ibb.co/kPE1D6/clouds.jpg'
  },
  {
    srcUrl: 'https://preview.ibb.co/mwsA6R/img7.jpg',
    previewUrl: 'https://preview.ibb.co/mwsA6R/img7.jpg'
  },
  {
    srcUrl: 'https://preview.ibb.co/kZGsLm/img8.jpg',
    previewUrl: 'https://preview.ibb.co/kZGsLm/img8.jpg'
  }
];


