import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { TInvoiceHeader, TInvoiceLine, TInvoiceLineSerial, TInvoicePayment, TInvoicePromo } from 'src/app/_models/invoice';
import { Item } from 'src/app/_models/item';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { MStore } from 'src/app/_models/store';
import { IBasketItem } from 'src/app/_models/system/basket';
import { TSalesLine, TSalesLineSerial, TSalesPromo } from 'src/app/_models/tsaleline';
import { TSalesPayment } from 'src/app/_models/tsalepayment';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { BillService } from 'src/app/_services/data/bill.service'; 
import { ItemService } from 'src/app/_services/data/item.service';
import { Merchandise_categoryService } from 'src/app/_services/data/merchandise_category.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InvoiceService } from 'src/app/_services/transaction/invoice.service';

@Component({
  selector: 'app-shop-bill-checkout',
  templateUrl: './shop-bill-checkout.component.html',
  styleUrls: ['./shop-bill-checkout.component.scss']
})
export class ShopBillCheckoutComponent implements OnInit {

  modalRef: BsModalRef;
  showModal: boolean= false;
  invoice: TInvoiceHeader;
  discountModalShow: boolean = false;
  order: Order; 
  constructor(private alertify: AlertifyService, private itemService: ItemService,  private invoiceService: InvoiceService,private billService: BillService,
   private shiftService: ShiftService,   private basketService: BasketService, public commonService: CommonService,  private authService: AuthService, 
    //  private shiftService: ShiftService,
      private merchandiseService: Merchandise_categoryService, 
      
    private route: ActivatedRoute,private modalService: BsModalService, private router: Router) {
      this.invoice = new TInvoiceHeader();
     }
  ngAfterViewInit()
  {
    // debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function(item) {
      // Do stuff here
        if(item !== null && item !== undefined)
        {
          item.classList.add('hide');
          // console.log('check out');
        }
    });
    // paymentMenu
    this.getNewCode();
    let date= new Date();
    this.invoice.createdOn = date;
  }
  getNewCode()
  {
    this.invoiceService.getNewOrderCode(this.invoice.companyCode, this.invoice.storeId).subscribe(data => {
      console.log(data);
      this.invoice.transId = data;
    }); 
    // this.invoiceService.getNewOrderCode(this.invoice.companyCode, this.invoice.storeId).subscribe((response: any)=>{
    //   debugger;
    //    this.invoice.transId = response;
      
    // }); 
  }
  checkLine()
  {
    this.invoice.lines.forEach(line => {
      if(line.openQty>line.quantity)
      {
        return false;
      } 
    });
    return true;
  }
  saveEntity()
  {
    debugger;
    // let basket= this.basketService.getCurrentBasket();
    if(this.invoice.posType==="Event")
    {
      if(!this.checkLine())
      {
        this.alertify.warning("check Open qty ");
      }
      else
      {
        this.saveModel('', this.order.salesType);
      
      }
       
    }
    else
    {
      this.saveModel('', this.order.salesType);
    }
    
  }
  items: ItemViewModel[]; 
  selectedCateFilter: string ="";
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
  saveModel(TransId, Type: string) {
    let store = this.authService.storeSelected(); 
    
    // debugger;
    if(Type==="")
    {
      Type ="SALES";
    }
    if(this.shiftService.getCurrentShip()== null || this.shiftService.getCurrentShip() === undefined )
    {
      this.alertify.warning("You are not on the shift. Please create your shift.");
     
    }
    else
    {
      const basket = this.basketService.getCurrentBasket();
      const basketTotal = this.basketService.getTotalBasket();
      // const customer = this.customer;
      let order = new TInvoiceHeader();
      order = this.invoice;
      // order.transId= TransId;
      // order.cusId = basket.customer.customerId;
      // order.storeName = store.storeName;
      // order.companyCode = store.companyCode;
      order.shiftId = this.shiftService.getCurrentShip().shiftId;
      // order.invoice = basket.invoice;
      // order.manualDiscount = '';
      order.refTransId = this.orderId;
      // order.remarks = '';
      // order.salesMode = Type;//'HOLD''SALES';
      // order.salesPerson = 'CP00100001';
       order.createdBy = this.authService.decodeToken?.unique_name;
      // order.status = 'O';
      order.storeId = store.storeId;
      // order.isCanceled = false;
      // order.salesType= basket.salesType;
      // order.dataSource= 'POS';
      // order.discountType = basket.discountType;
      if(basket.discountType === 'Discount Percent')
      {
        order.discountRate = basket.discountValue;
        order.discountAmount = 0;
      }
      if(basket.discountType === 'Discount Amount')
      {
        order.discountRate = 0;
        order.discountAmount = basket.discountValue;
      }
     
      order.totalAmount =  basketTotal.billTotal;
      order.totalDiscountAmt = basketTotal.discountBillValue;
      order.totalPayable = basketTotal.total;
      order.totalReceipt = basketTotal.totalAmount;
      order.amountChange = basketTotal.changeAmount;
      order.paymentDiscount = 0;
  
  
      order.totalTax = 0;
      order.lines = [];
      order.payments = [];
      order.serialLines = [];
      order.promoLines = [];
      order.invoice= null;
      debugger;
      var items = basket.items.filter(x=>x.quantity > 0);
      items.forEach((item) => {
        if(!item.isVoucher && !item.isSerial)
        {
          var lineItem = item.lineItems;
          lineItem.forEach((item) => {

            const line = new TInvoiceLine();
            // debugger;
            if(item.customField1==="Card")
            {
              line.prepaidCardNo=item.prepaidCardNo;
            }
            if(item.customField1==="Member" )
            {
             
              line.memberDate=item.memberDate;
              line.memberValue=item.memberValue;
                
            }
            line.itemCode = item.id;
            line.price = item.price; 
            line.quantity = item.quantity;
            line.lineTotal =  item.price * item.quantity;
            line.uomCode = item.uom;
            
            line.storeAreaId = item.storeAreaId;
            line.timeFrameId = item.timeFrameId;
            line.appointmentDate = item.appointmentDate; 
            line.promoId = item.promotionPromoCode;
            line.promoType= item.promotionType;
            line.promoPercent= item.promotionDiscountPercent; 
            line.promoPrice = item.promotionPriceAfDis; 
            line.promoLineTotal = item.promotionLineTotal;
            line.openQty =  item.quantity;
            line.promoDisAmt = item.promotionDisAmt;
            line.isPromo = item.promotionIsPromo;
            line.isSerial = item.isSerial;
            line.itemType = item.customField1;
           
            const value = 0;
            let discountType= item.type;
            line.discountType = discountType;
            if (discountType == 'Discount Percent') {
              line.discountRate = item.discountValue;
              line.discountAmt = item.quantity * item.price - item.lineTotal;
            }
            if (discountType == 'Discount Amount') {
              line.discountRate = (item.quantity * item.price - item.lineTotal) *  (item.quantity * item.price)/ 100;
              line.discountAmt = item.quantity * item.price - item.lineTotal;
            }
            line.status = "O";
            line.slocId = item.slocId;
           
          
            order.lines.push(line);
            if(item.isSerial===true)
            {
              var serialLines = item.lineItems;
              if(serialLines!==null && serialLines.length >0)
              {
                serialLines.forEach((item) => {
                  const serialline = new TInvoiceLineSerial();
                  serialline.itemCode = line.itemCode;
                  serialline.serialNum = item.serialNum;
                  serialline.slocId =  line.slocId;
                  serialline.uomCode = line.uomCode; 
                  serialline.quantity = item.quantity; 
                  serialline.status = "O"; 
                  serialline.createdBy= order.createdBy;
                  order.serialLines.push(serialline);
                });
              }
             
            }
            if(item.isBOM===true)
            {
              var bomLines = item.lineItems;
              if(bomLines!==null && bomLines.length >0)
              {
                bomLines.forEach((item) => {
                  const BOMline = new TInvoiceLine();
                  BOMline.itemCode = item.id;
                  BOMline.price = item.price; 
                  BOMline.quantity = item.quantity;
                  BOMline.uomCode = item.uom;
                  BOMline.storeAreaId = item.storeAreaId;
                  BOMline.timeFrameId = item.timeFrameId;
                  BOMline.appointmentDate = item.appointmentDate;
                  const value = 0;
                  let discountType= item.type;
                  BOMline.discountType = discountType;
                  if (discountType === 'percent' || discountType === 'Discount Percent') {
                    BOMline.discountRate = item.discountValue;
                    BOMline.discountAmt = item.quantity * item.price - item.lineTotal;
                  }
                  if (discountType === 'amount' || discountType === 'Discount Amount') {
                    BOMline.discountRate = (item.quantity * item.price - item.lineTotal) *  (item.quantity * item.price)/ 100;
                    BOMline.discountAmt = item.quantity * item.price - item.lineTotal;
                  }
                  BOMline.status = "O";
                  BOMline.slocId = this.authService.storeSelected().whsCode;//"SL001";
                  BOMline.bomId=line.itemCode;
                  order.lines.push(BOMline);
                });
              }
                 
            }
            // debugger;
            if(item.promotionPromoCode!==null && item.promotionPromoCode!==undefined && item.promotionPromoCode!=="")
            {
                
              const promoLine = new TSalesPromo();
              promoLine.itemCode = item.id;
              promoLine.barCode = item.id+item.uom;
              promoLine.value = item.quantity;
              promoLine.uomCode = item.uom;
              promoLine.promoId = item.promotionPromoCode;
              promoLine.itemGroupId = item.promotionItemGroup;
              promoLine.createdBy= order.createdBy;
              promoLine.promoAmt= item.promotionDisAmt;
              promoLine.promoPercent= item.promotionDiscountPercent;
              promoLine.promoType= item.promotionType;
              // const value = 0;
              // let discountType= ; 
              promoLine.status = "O"; 
              order.promoLines.push(promoLine);
            }
          });
        }
       
        
      });
      items.forEach((item) => {
        const line = new TInvoiceLine();
        if(item.customField1!=="Member" && item.customField1!=='Card')
        {
           debugger;
            line.itemCode = item.id;
            line.price = item.price; 
            line.quantity = item.quantity;
            line.lineTotal =  item.price * item.quantity;
            line.uomCode = item.uom;
            
            line.storeAreaId = item.storeAreaId;
            line.timeFrameId = item.timeFrameId;
            line.appointmentDate = item.appointmentDate; 
            line.promoId = item.promotionPromoCode;
            line.promoType= item.promotionType;
            line.promoPercent= item.promotionDiscountPercent; 
            line.promoPrice = item.promotionPriceAfDis; 
            line.promoLineTotal = item.promotionLineTotal;
            line.openQty =  item.quantity;
            line.promoDisAmt = item.promotionDisAmt;
            line.isPromo = item.promotionIsPromo;
            line.isSerial = item.isSerial;
            line.itemType = item.customField1;
          
            const value = 0;
            let discountType= item.type;
            line.discountType = discountType;
            if (discountType === 'Discount Percent') {
              line.discountRate = item.discountValue;
              line.discountAmt = item.quantity * item.price - item.lineTotal;
            }
            if (discountType === 'Discount Amount') {
              line.discountRate = (item.quantity * item.price - item.lineTotal) *  (item.quantity * item.price)/ 100;
              line.discountAmt = item.quantity * item.price - item.lineTotal;
            }
            line.status = "O";
            line.slocId = item.slocId;
            line.prepaidCardNo=item.prepaidCardNo;
            line.memberDate=item.memberDate;
            line.memberValue=item.memberValue;
          
            order.lines.push(line);
            if(item.isSerial===true)
            {
              var serialLines = item.lineItems;
              if(serialLines!==null && serialLines.length >0)
              {
                serialLines.forEach((item) => {
                  const serialline = new TSalesLineSerial();
                  serialline.itemCode = line.itemCode;
                  serialline.serialNum = item.serialNum;
                  serialline.slocId =  line.slocId;
                  serialline.uomCode = line.uomCode; 
                  serialline.quantity = item.quantity; 
                  serialline.status = "O"; 
                  serialline.createdBy= order.createdBy;
                  order.serialLines.push(serialline);
                });
              }
            
            }
            if(item.isBOM===true)
            {
              var bomLines = item.lineItems;
              if(bomLines!==null && bomLines.length >0)
              {
                bomLines.forEach((item) => {
                  const BOMline = new TInvoiceLine();
                  BOMline.itemCode = item.id;
                  BOMline.price = item.price; 
                  BOMline.quantity = item.quantity;
                  BOMline.uomCode = item.uom;
                  BOMline.storeAreaId = item.storeAreaId;
                  BOMline.timeFrameId = item.timeFrameId;
                  BOMline.appointmentDate = item.appointmentDate;
                  const value = 0;
                  let discountType= item.type;
                  BOMline.discountType = discountType;
                  if (discountType === 'percent' || discountType === 'Discount Percent') {
                    BOMline.discountRate = item.discountValue;
                    BOMline.discountAmt = item.quantity * item.price - item.lineTotal;
                  }
                  if (discountType === 'amount' || discountType === 'Discount Amount') {
                    BOMline.discountRate = (item.quantity * item.price - item.lineTotal) *  (item.quantity * item.price)/ 100;
                    BOMline.discountAmt = item.quantity * item.price - item.lineTotal;
                  }
                  BOMline.status = "O";
                  BOMline.slocId = this.authService.storeSelected().whsCode;//"SL001";
                  BOMline.bomId=line.itemCode;
                  order.lines.push(BOMline);
                });
              }
                
            }

            if(item.promotionPromoCode!==null && item.promotionPromoCode!==undefined && item.promotionPromoCode!=="")
            {
                
              const promoLine = new TSalesPromo();
              promoLine.itemCode = item.id;
              promoLine.barCode = item.id+item.uom;
              promoLine.value = item.quantity;
              promoLine.uomCode = item.uom;
              promoLine.promoId = item.promotionPromoCode;
              promoLine.itemGroupId = item.promotionItemGroup;
              promoLine.createdBy= order.createdBy;
              promoLine.promoAmt= item.promotionDisAmt;
              promoLine.promoPercent= item.promotionDiscountPercent;
              promoLine.promoType= item.promotionType;
              // const value = 0;
              // let discountType= ; 
              promoLine.status = "O"; 
              order.promoLines.push(promoLine);
            }
        }
       
      });
  
  
      var promoitems = basket.promoItemApply;
      promoitems.forEach((item) => {
        const line = new TInvoiceLine();
        line.itemCode = item.id;
        line.price = item.price; 
        line.quantity = item.quantity;
        line.lineTotal =  item.price * item.quantity;
        line.uomCode = item.uom;
        line.storeAreaId = item.storeAreaId;
        line.timeFrameId = item.timeFrameId;
        line.appointmentDate = item.appointmentDate;
  
        // line.price = item.promotionPriceAfDis; 
        // line.lineTotal = item.promotionLineTotal;
        line.promoId = item.promotionPromoCode;
        line.promoType= item.promotionType;
        line.promoPercent= item.promotionDiscountPercent; 
        const value = 0;
        let discountType= item.type;
        line.discountType = discountType;
        if (discountType == 'Discount Percent') {
          line.discountRate = item.discountValue;
          line.discountAmt = item.quantity * item.price - item.lineTotal;
        }
        if (discountType == 'Discount Amount') {
          line.discountRate = (item.quantity * item.price - item.lineTotal) *  (item.quantity * item.price)/ 100;
          line.discountAmt = item.quantity * item.price - item.lineTotal;
        }
        line.status = "O";
        line.slocId = item.slocId;
        order.lines.push(line);
        if(item.isSerial===true)
        {
          var serialLines = item.lineItems;
          if(serialLines!==null && serialLines.length >0)
          {
            serialLines.forEach((item) => {
              const serialline = new TSalesLineSerial();
              serialline.itemCode = line.itemCode;
              serialline.serialNum = item.serialNum;
              serialline.slocId =  line.slocId;
              serialline.uomCode = line.uomCode; 
              serialline.quantity = item.quantity; 
              serialline.status = "O"; 
              serialline.createdBy= order.createdBy;
              order.serialLines.push(serialline);
            });
          }
         
        }
        if(item.isBOM===true)
        {
          var bomLines = item.lineItems;
          if(bomLines!==null && bomLines.length >0)
          {
            bomLines.forEach((item) => {
              const BOMline = new TInvoiceLine();
              BOMline.itemCode = item.id;
              BOMline.price = item.price; 
              BOMline.quantity = item.quantity;
              BOMline.uomCode = item.uom;
              BOMline.storeAreaId = item.storeAreaId;
              BOMline.timeFrameId = item.timeFrameId;
              BOMline.appointmentDate = item.appointmentDate;
              const value = 0;
              let discountType= item.type;
              BOMline.discountType = discountType;
              if (discountType == 'percent') {
                BOMline.discountRate = item.discountValue;
                BOMline.discountAmt = item.quantity * item.price - item.lineTotal;
              }
              if (discountType == 'amount') {
                BOMline.discountRate = (item.quantity * item.price - item.lineTotal) *  (item.quantity * item.price)/ 100;
                BOMline.discountAmt = item.quantity * item.price - item.lineTotal;
              }
              BOMline.status = "O";
              BOMline.slocId = this.authService.storeSelected().whsCode;//"SL001";
              BOMline.bomId=line.itemCode;
              order.lines.push(BOMline);
            });
          }
             
        }
    
        const promoLine = new TInvoicePromo();
        promoLine.itemCode = item.id;
        promoLine.barCode = item.id+item.uom;
        promoLine.value = item.quantity;
        promoLine.uomCode = item.uom;
        promoLine.promoId = item.promotionPromoCode;
        promoLine.itemGroupId = item.promotionItemGroup; 
        promoLine.createdBy= order.createdBy;
        promoLine.promoAmt= item.promotionDisAmt;
        promoLine.promoPercent= item.promotionDiscountPercent;
        promoLine.promoType= item.promotionType;
        // const value = 0;
        // let discountType= ; 
        promoLine.status = "O"; 
        order.promoLines.push(promoLine);
      });
  
      var payments = basket.payments;
      payments.forEach((paymentline) => {
        const payment = new TInvoicePayment();
        payment.paymentCode = paymentline.id;
        payment.companyCode = order.companyCode;
        payment.refNumber = paymentline.refNum;
        payment.lineId = paymentline.lineNum.toString();
        payment.chargableAmount = paymentline.paymentCharged;
        payment.paymentDiscount = paymentline.paymentDiscount;
        payment.collectedAmount = paymentline.paymentTotal;
        payment.createdBy= order.createdBy;
        order.payments.push(payment);
      });
      // debugger;
      // return this.http.post(this.baseUrl + 'Sale/CreateSaleOrder', order);
      this.invoiceService.create(this.invoice).subscribe((response:any)=>{
        if(response.success)
        {
  
          this.alertify.success('Checkout completed successfully. ' + response.message);
          // this.router.navigate(["/shop/detail", response.message]);
          this.router.navigate(["shop/invoices", response.message, this.invoice.companyCode, this.invoice.storeId]);
        }
        else
        {
         this.alertify.warning('Checkout failed. Message: ' + response.message);
        }
       });
    }
    
      
  }
  // saveModel()
  // {
  //   this.invoice.lines.forEach(line => {
  //     line.openQty = line.openQty - line.quantity;
  //     line.quantity = line.checkOutQty;
  //     if(line.serialLines!==null && line.serialLines!==undefined)
  //     {
  //       line.serialLines.forEach(serialLine => {
  //         debugger;
  //         serialLine.openQty = serialLine.openQty - serialLine.quantity;
          
  //       });
  //     }
     
  //   });
  //   console.log(this.invoice.lines);
    
  //   // this.invoice= this.order;
    
  // }
  filterNotBOM(items: TInvoiceLine[] )
  {
    // debugger;
    if (items !== null && items !== undefined) {
    let rs = items.filter(x=>x.bomId==='' || x.bomId===null);
    // console.log(rs);
    return rs;
    }
  }
  filterBOM(items: TInvoiceLine[], itemCode, uomCode )
  {
    // debugger;
    if (items !== null && items !== undefined) {
    let rs = items.filter(x=>x.bomId===itemCode);
    return rs;
    }
  }
  filterSerial(items: TInvoiceLineSerial[], itemCode, uomCode )
  {
    // debugger;
    if (items !== null && items !== undefined) {
    let rs = items.filter(x=>x.itemCode===itemCode&&x.uomCode===uomCode);
    return rs;
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
  ngOnInit() {
    this.VirtualKey$ = this.commonService.VirtualKey$;
    this.storeSelected= this.authService.storeSelected();
    // debugger;
    // const basket = this.basketService.getCurrentBasket();
    // // debugger;
    // if(basket===null || (basket.customer===null || basket.customer===undefined))
    // {
    //   // this.routeNav.navigate(['/shop/sales-type']);
    //   this.newOrder();
    //   // this.manora();
    // }
   
    // this.isShowSlickSlider=true;
    this.loadItemNew(this.storeSelected.companyCode, this.storeSelected.storeId, '', '','' );
    this.merchandiseService.getByCompany(this.authService.storeSelected().companyCode,'','','').subscribe((response: any) => {
      //  debugger;
       if(response.success)
       {

        this.merchandiseList = response.data;
        this.merchandiseList = this.merchandiseList.filter(x=>x.isShow===true).sort(( a, b ) => a.orderNum > b.orderNum ? 1 : -1  );
        
        
       }
       else
       {
        this.alertify.warning(response.message);
       }
     
     }  );
    this.route.data.subscribe(data => {
      this.order = data['order'];
    });
    this.loadOrder();
    this.invoice = this.invoiceService.mapOrder2Invoice(this.order);
    // console.log(this.invoice);
    // console.log(this.invoice.lines);
  }
  isShowSlickSlider=false;
  public refreshSlickSlider() {
    this.isShowSlickSlider=false;
    setTimeout(x=>this.isShowSlickSlider=true);
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
  loadOrder()
  {
    this.route.params.subscribe(data => { 
      this.orderId = data['id'];
    })
    if(this.orderId!==null && this.orderId!==undefined)
    {
        this.removeBasket();
        this.billService.getBill(this.orderId, this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any) => { 
          if(response.success)
          {
            this.order = response.data;
            const itemList: Item[] = []; 
            this.basketService.changeCustomer(this.order.customer, "Retail").subscribe(()=>{ 
              this.setItemToBasket(this.order.lines);
            }); 
          }
          else
          {
            this.alertify.warning(response.message);
          }
          
        },(error) => {
          this.alertify.error(error);
        }, () => {
          
        });
      
    }
  }
  // orderId: string="";
  // order: Order;

  mapItemSaleLineToItemBasket(itemline: TSalesLine)
  {
     
     let itemX = this.items.find(x=>x.itemCode === itemline.itemCode && x.uomCode===itemline.uomCode);
      debugger;
      if(itemX!==null && itemX!==undefined)
      {
        // let infor=ressponse[0];
        if(itemline.slocId!==undefined&& itemline.slocId!==null)
        {
          itemX.slocId= itemline.slocId;
        }
        else
        {
          itemX.slocId= this.storeSelected.whsCode;
        }
        let itembasket = this.basketService.mapProductItemtoBasket(itemX, 1);
        if(itembasket.productName===null || itembasket.productName===undefined)
        {
          itembasket.productName = itemX.itemDescription;
        }
        itembasket.openQty = itemline.openQty;
        itembasket.oriQty = itemline.quantity;
        itembasket.canRemove = false;
        itembasket.memberDate = itemline.memberDate;
        itembasket.memberValue = itemline.memberValue;
        itembasket.prepaidCardNo = itemline.prepaidCardNo;
        return itembasket;
        // itembasket.itemType = itemline.itemType;
        // itembasket.description = itemline.description;
      

        // this.basketService.addItemBasketToBasket(itembasket,  item.quantity);
        // console.log(ressponse[0]);
        // this.basketService.addItemtoBasket(itemX, item.quantity);
      } 
      return null;
  }
  setItemToBasket(lines: TSalesLine[]){
    let list = [];
    lines = lines.filter(x=>x.isPromo!=="1");
    lines.forEach(async item => {
      let itemX = this.mapItemSaleLineToItemBasket(item);
      if(itemX!==null && itemX!==undefined)
      {
        list.push(itemX);
      }
      // && x.barCode === item.barCode
      // let itemX = this.items.find(x=>x.itemCode === item.itemCode && x.uomCode===item.uomCode);
      // // debugger;
      // if(itemX!==null && itemX!==undefined)
      // {
      //   // let infor=ressponse[0];
      //   if(item.slocId!==undefined&& item.slocId!==null)
      //   {
      //     itemX.slocId= item.slocId;
      //   }
      //   else
      //   {
      //     itemX.slocId= this.storeSelected.whsCode;
      //   }
      //   let itembasket = this.basketService.mapProductItemtoBasket(itemX, 1);
      //   if(itembasket.productName===null || itembasket.productName===undefined)
      //   {
      //     itembasket.productName = itemX.itemDescription;
      //   }
      //   itembasket.openQty = item.openQty;
      //   itembasket.oriQty = item.quantity;
      //   itembasket.canRemove = false;
      //   list.push(itembasket);
      //   // this.basketService.addItemBasketToBasket(itembasket,  item.quantity);
      //   // console.log(ressponse[0]);
      //   // this.basketService.addItemtoBasket(itemX, item.quantity);
      // } 
      
    });
    this.basketService.addItemListBasketToBasket(list);
  }
  removeBasket()
  {
      const basket = this.basketService.getCurrentBasket();
      this.basketService.deleteBasket(basket);
  }
  filterBy(txtFilter: any)
  {
    // debugger;
    // this.userParams.merchandise="";
    // this.userParams.keyword = txtFilter;
    // this.loadItemPagedList(null, null);
    // this.selectedCateFilter = "";
    if(this.basketService.getCurrentBasket().salesType =="Retail")
    {
      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, txtFilter,'', '')
    }
    else{
      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, txtFilter, '', this.basketService.getCurrentBasket().salesType )
    
    }
  }
  filterByType(value)
  {
    // debugger;
    if(this.basketService.getCurrentBasket().salesType =="Retail")
    {
      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '','', '', value);
      
      
    }
    else{
      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', this.basketService.getCurrentBasket().salesType )
    
    }
  }
  fetchAllData()
  {
    // debugger;
    if(this.basketService.getCurrentBasket().salesType =="Retail")
    {
      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '','', '')
    }
    else{
      this.loadItemNew(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', '', this.basketService.getCurrentBasket().salesType )
    
    }
  }
  loadItemNew(companyCode, storeId, Keyword, Merchandise, Type, subType?)
  {
      this.itemService.getItemViewList(companyCode, storeId, '','','', Keyword, Merchandise,'', Type).subscribe((response: any)=>{
        // debugger;
        if(subType!==null && subType!==undefined && subType!=="")
        {
          this.items = response.data;
          this.items = this.items.filter(x=>x.customField4===subType);
        }
       else
       {
        this.items = response.data;
       }
        this.refreshSlickSlider();
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
