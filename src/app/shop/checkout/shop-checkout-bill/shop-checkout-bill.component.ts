import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ConsoleReporter } from 'jasmine';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TInvoiceHeader, TInvoiceLine, TInvoiceLineSerial } from 'src/app/_models/invoice';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { MReason } from 'src/app/_models/reason';
import { MStore } from 'src/app/_models/store';
import { IBasketItem } from 'src/app/_models/system/basket';
import { ItemCheckModel, ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { BillService } from 'src/app/_services/data/bill.service';  
import { ItemService } from 'src/app/_services/data/item.service';
import { ReasonService } from 'src/app/_services/data/reason.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InvoiceService } from 'src/app/_services/transaction/invoice.service'; 
import Swal from 'sweetalert2';
import { ShopReasonInputComponent } from '../../tools/shop-reason-input/shop-reason-input.component';

@Component({
  selector: 'app-shop-checkout-bill',
  templateUrl: './shop-checkout-bill.component.html',
  styleUrls: ['./shop-checkout-bill.component.scss']
})

export class ShopCheckoutBillComponent implements OnInit {


  modalRef: BsModalRef;
  showModal: boolean= false;
  invoice: TInvoiceHeader;
  discountModalShow: boolean = false;
  order: Order; 
  constructor(private alertify: AlertifyService,  private reasonService: ReasonService,  private invoiceService: InvoiceService,private billService: BillService,
   private shiftService: ShiftService,   private basketService: BasketService, public commonService: CommonService,  
   public authService: AuthService, private itemService: ItemService,  
    //  private shiftService: ShiftService, 
      
    private route: ActivatedRoute,private modalService: BsModalService, private router: Router) {
      this.invoice = new TInvoiceHeader();
     }
     invoices: TInvoiceHeader[] = [];
    loadCheckedListByDate()
    {
     
      this.invoiceService.getCheckOutByEvent(this.invoice.contractNo, this.invoice.companyCode, this.invoice.storeId).subscribe((response: any)=>{
        // debugger;
        this.invoices = response.data;
      })
    }
  OpenInvoice(invoice: TInvoiceHeader)
  {
    // debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
      this.router.navigate(["shop/invoices", invoice.transId, invoice.companyCode, invoice.storeId]);
  }
  PrintInvoice(invoice)
  {
    this.router.navigate(["shop/invoices/print", invoice.transId, invoice.companyCode, invoice.storeId]);
  }

  backpage()
  {
    this.router.navigate(["shop/bills", this.order.transId, this.order.companyCode, this.order.storeId]);
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
          // console.log('check out boill');
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
    this.invoice.lines.forEach(line => {
      if(line.openQty>line.quantity)
      {
        return false;
      } 
    });
    return true;
  }
  reasonList: MReason[];
  loadReasonList()
  {
    debugger;
    this.reasonService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      debugger;
      this.reasonList = response.data.filter(x=>x.status==='A' && x.type==='Checkout');
    })
  }
  saveEntity()
  {
    // debugger;
    // let basket= this.basketService.getCurrentBasket();


   

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        if(this.invoice.posType==="Event")
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
    });
   
    
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
    this.router.navigate(["shop/order/", "checkout" , this.invoice.contractNo]).then(()=>{
      location.reload();
    });
  }
  saveModel()
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
            this.saveAction();
            
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
          this.saveAction();
        }
      })
    }
        

    
  }
  private clickStream = new Subject();
  saveAction()
  {
      let shift = this.shiftService.getCurrentShip();
        if(shift!==null && shift!==undefined)
        {
           var invoice = Object.assign({}, this.invoice);
           invoice.transId = '';
           invoice.shiftId = this.shiftService.getCurrentShip().shiftId; 

           invoice.invoiceType = "CheckOut";
           invoice.lines = this.invoice.lines.filter(x=>x.quantity !== 0);
  
          if( invoice.lines!==undefined && invoice.lines!==null &&  invoice.lines?.length > 0)
          {
             
            // var invoiceAdd = Object.assign({},  this.invoice);
  
            invoice.lines.forEach(line => {
            debugger;
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
             invoice.payments=[];
            console.log(invoice.lines);
            invoice.invoiceType = "CheckOut";
            invoice.createdBy = this.authService.getCurrentInfor().username;
            invoice.status = 'C'; 
             this.clickStream.pipe(debounceTime(500)).pipe( e =>  this.invoiceService.create(invoice)).subscribe((response:any)=>{
              if(response.success)
              {
        
                this.alertify.success('Check In completed successfully. ' + response.message);
              
                this.router.navigate(["shop/invoices", response.message, this.invoice.companyCode, this.invoice.storeId]);
              }
              else
              {
              this.alertify.warning('Check In failed. Message: ' + response.message);
              }
            });
          }
          else
          {
            this.alertify.warning('Please input number check out');
          }
        }
        else
        {
          this.alertify.warning('Not in shift');
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
  storeIdX ="";companyX="";  

  ngOnInit() {
    this.VirtualKey$ = this.commonService.VirtualKey$;
    this.storeSelected= this.authService.storeSelected();
   
    this.route.params.subscribe(data => {
      this.orderId = data['id'];
      this.companyX = data['companycode'];
      this.storeIdX = data['storeid']; 
    })
    this.loadOrder();
   
    console.log("invoice",this.invoice);

    console.log(this.invoice);
    this.loadReasonList();
    // console.log(this.invoice.lines);
    // this.loadCheckedListByDate();
  }
  onBlurMethod(item) {
    debugger;
    if (item.quantity <= 0 || item.quantity === null || item.quantity === undefined || item.quantity.toString() === "") {
      item.quantity = 0;
    }
     
    this.invoice.lines.filter(x=>x.bomId === item?.itemCode).map(x=>x.quantity = item.quantity * x.oriQty);
    
    // if (item.quantity > item.openQty) {
    //   item.quantity = item.openQty;
    //   this.alertify.warning("Return number can't more than open qty");
    // }
    // this.basketService.updateItemQtyWPromotion(item);
  }
  loadOrder()
  {
    
    this.billService.getCheckOutById(this.orderId, this.companyX, this.storeIdX).subscribe((response: any)=>{
      if(response.success)
      {
        debugger;
        if(response.data!==null && response.data!==undefined)
        {
          this.order = response.data;
          console.log('order', this.order);

          this.invoice = this.invoiceService.mapOrder2Invoice(this.order);

          let storeSelected = this.authService.storeSelected();
          let items:ItemCheckModel[] = [];
          console.log(this.invoice);
          this.getNewCode();
          this.invoice.createdOn = new Date();

          // this.itemService.GetItemFilterByList(storeSelected.companyCode, storeSelected.storeId, '','', items).subscribe((response: any) =>{
          //   if(response.success)
          //   {
          //     if(response.data!==null && response.data!== undefined && response.data?.length > 0)
          //     {

          //     }
          //     else
          //     {
          //       Swal.fire({
          //         icon: 'warning',
          //         title: 'Item Data',
          //         text: response.message
          //       }).then(() => {
                   
          //       });
          //     }
          //   }
          //   else
          //   {
          //     Swal.fire({
          //       icon: 'warning',
          //       title: 'Item Data',
          //       text: response.message
          //     }).then(() => {
                 
          //     });
          //   }
          // }, error=>{
          //   Swal.fire({
          //     icon: 'error',
          //     title: 'Item Data',
          //     text: 'Get Item Data Failed'
          //   }).then(() => {
               
          //   });
          // })
         
        }
        else
        {
          this.alertify.warning("Can't found data");
         
        }
      }
      else
      {
        this.alertify.warning(response.message);
      }
      
     

    })
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
  openCheckedModal(template: TemplateRef<any>) {
    this.loadCheckedListByDate();
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
       
        class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
      });
    });

    // this.resetDiscount();
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
  paymentCheckout()
  {
    debugger;
    this.router.navigate(["shop/bills/checkout-payment", this.order.transId, this.order.contractNo, this.order.companyCode, this.order.storeId]).then( ()=>{
        location.reload();
    });
  }

}
