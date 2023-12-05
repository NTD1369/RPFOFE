import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TInvoiceHeader, TInvoiceLine, TInvoiceLineSerial, TInvoicePayment, TInvoicePromo } from 'src/app/_models/invoice';
import { Item } from 'src/app/_models/item';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { SFormatConfig } from 'src/app/_models/sformatconfig';
import { MStore } from 'src/app/_models/store';
import { TSalesLine, TSalesLineSerial, TSalesPromo } from 'src/app/_models/tsaleline';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { BillService } from 'src/app/_services/data/bill.service'; 
import { FormatconfigService } from 'src/app/_services/data/formatconfig.service'; 
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InvoiceService } from 'src/app/_services/transaction/invoice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-bill-checkin',
  templateUrl: './shop-bill-checkin.component.html',
  styleUrls: ['./shop-bill-checkin.component.scss']
})
export class ShopBillCheckinComponent implements OnInit {


  modalRef: BsModalRef;
  showModal: boolean= false;
  invoice: TInvoiceHeader;
  discountModalShow: boolean = false;
  order: Order; 
  constructor(private alertify: AlertifyService,private formatService: FormatconfigService,   private invoiceService: InvoiceService,private billService: BillService,
   private shiftService: ShiftService,   private basketService: BasketService, public commonService: CommonService,  
    private authService: AuthService, 
    //  private shiftService: ShiftService, 
      
    private route: ActivatedRoute,   private modalService: BsModalService, private router: Router) {
      this.invoice = new TInvoiceHeader();
     }
  ngAfterViewInit()
  {
    this.invoice = new TInvoiceHeader();
    // debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function(item) {
      // Do stuff here
        if(item !== null && item !== undefined)
        {
          item.classList.add('hide');
          // console.log('Checkin');
        }
    });
    // paymentMenu
  
  }
  getNewCode()
  {
    this.invoiceService.getNewOrderCode(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).subscribe(data => {
      console.log(data);
      this.invoice.transId = data;
    }); 
     
  }
  checkLine()
  {
    debugger
    let result = false;
    let lines =  this.invoice.lines.filter(x=> x.openQty > 0 &&  x.openQty >= x.quantity );
    if(lines!==null  && lines !== undefined && lines.length > 0)
    {
      result= true;
      this.invoice.lines = lines;
    }
    else
    {
      result= false;
    }
    return result;
    // this.invoice.lines.forEach(line => {
    //   debugger;
    //   if(line.openQty === 0 || line.openQty < line.quantity)
    //   {
    //     return false;
        
    //   } 
    // });
    // return true;
  }
  saveEntity()
  {
    debugger;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        if(this.invoice?.posType?.toLowerCase()==="event" || this.invoice?.posType?.toLowerCase()==="e" )
        {
          this.saveModel();
        }
        else
        {
        
          if(this.checkLine()=== false)
          {
            this.alertify.warning("check Open qty ");
          }
          else
          {
            this.saveModel();
          
          }
           
        }

      }
    });
    // let basket= this.basketService.getCurrentBasket();
   
    
  }
  filterNotBOM(items: TInvoiceLine[] )
  {
    // debugger;
    if(items!==null&& items!==undefined)
    {
      let rs = items.filter(x=>x.bomId==='' || x.bomId===null);
     
      return rs;
    }
  
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
  private clickStream = new Subject();
  isCreating = false;
  saveModel()
  {
    if(this.isCreating)
    {
      Swal.fire('Save Bill', "Bill In Process, Please wait to complete data", 'info');
    }
    else
    {
      this.invoice.salesMode = 'SALES';
      this.invoice.invoiceType = "CheckIn";
      this.invoice.lines.forEach(line => {
        line.openQty = line.openQty - line.quantity;
        line.quantity = line.quantity;
        if(line.serialLines!==null && line.serialLines!==undefined)
        {
          line.serialLines.forEach(serialLine => {
            debugger;
            serialLine.openQty = serialLine.openQty - serialLine.quantity;
            
          });
        }
      
      });
      // console.log(this.invoice.lines);
      this.invoice.refTransId = this.oderId; 
      this.invoice.salesType = 'Bill';
      let shift = this.shiftService.getCurrentShip();
      if(shift!==null && shift!==undefined)
      {
        this.invoice.shiftId = this.shiftService.getCurrentShip().shiftId; 
      }
      this.invoice.createdBy = this.authService.getCurrentInfor().username;
      this.isCreating = true
      this.clickStream.pipe(debounceTime(1000)).pipe( e =>  this.invoiceService.create(this.invoice)).subscribe((response:any)=>{
        this.isCreating = false;
        if(response.success)
        {

          this.alertify.success('Check In completed successfully. ' + response.message);
          // this.router.navigate(["/shop/detail", response.message]);
          this.router.navigate(["shop/invoices", response.message, this.invoice.companyCode, this.invoice.storeId]);
        }
        else
        {
        this.alertify.warning('Check In failed. Message: ' + response.message);
        }
      }, error => {
        this.isCreating = false;
        console.log('errorResponse',error);
        Swal.fire('Check In',"Can't connect to system",'error');
        // this.alertify.warning('Check In failed. Message: ' + error);
      });
      // this.invoice= this.order;
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
  oderId="";
  companyX="";
  storeIdX ="";
  dateFormat="";
  loadFormat(): SFormatConfig
  {
    // debugger;
    let format = localStorage.getItem("formatConfig");
    let result;
    if(format === null || format === 'null' || format === undefined)
    {
       
      this.formatService.getByStore(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any) => {
        if(response.success)
        {
          localStorage.setItem('formatConfig',  JSON.stringify(response.data));
          result = response.data;
        }
        else
        {
          this.alertify.warning(response.message);
        }
       
      });
    }
    else
    {
      result = JSON.parse(format);
    }
    return result;
  }
  ngOnInit() {
    this.VirtualKey$ = this.commonService.VirtualKey$;
    this.storeSelected= this.authService.storeSelected();
   debugger;
   this.route.params.subscribe(data => {
    this.oderId = data['id'];
    this.companyX = data['companycode'];
    this.storeIdX = data['storeid']; 
  })

    if(this.oderId!==null && this.oderId!==undefined)
    {
      this.findOrderDetail(this.oderId);
   
    }
    this.dateFormat = this.loadFormat().dateFormat;
    // console.log(this.invoice);
    // console.log(this.invoice.lines);
  }
  findOrderDetail(orderid)
  {
    this.oderId = orderid;
    this.billService.getBillCheckIn(orderid, this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).subscribe((response: any)=>{
      if(response.success)
      {
        if(response.data!==null)
        {
          debugger;
          this.order = response.data;
          if(response.data.status ==='O')
          {
            console.log(this.order);
            this.invoice = this.invoiceService.mapOrder2Invoice(this.order); 
            this.getNewCode();
            let date= new Date();
            this.invoice.createdOn = date;
          }
          else
          {
            if(response.data.status==='H')
            {
              // this.alertify.warning("Please check confirm your order");
              Swal.fire('Bill Detail',"Please check confirm your order",'info');

            }
            else
            {
              // this.alertify.warning("Please check your status order");
              Swal.fire('Bill Detail',"Please check your status order",'warning');
            }
            
          }

        
        }
        else
        {
          // this.alertify.warning("Data not found. Please check your Bill No");
          Swal.fire('Bill Detail',"Data not found. Please check your Bill No",'info');
        }
      }
      else
      {
        // this.alertify.warning(response.message);
        Swal.fire('Bill Detail',response.message,'warning');
      }
     
    }, error =>{
      console.log('error', error);
      Swal.fire('Bill Detail','Failed to get data','error');
    });
    // this.getNewCode();
    // let date= new Date();
    // this.invoice.createdOn = date;
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
