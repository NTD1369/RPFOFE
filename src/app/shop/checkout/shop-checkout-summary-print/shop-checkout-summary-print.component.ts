import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { MCompany } from 'src/app/_models/company';
import { TInvoiceHeader, TInvoiceLine, TInvoiceLineSerial } from 'src/app/_models/invoice';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { MStore } from 'src/app/_models/store';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';  
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InvoiceService } from 'src/app/_services/transaction/invoice.service';

@Component({
  selector: 'app-shop-checkout-summary-print',
  templateUrl: './shop-checkout-summary-print.component.html',
  styleUrls: ['./shop-checkout-summary-print.component.scss']
})
export class ShopCheckoutSummaryPrintComponent implements OnInit {


  modalRef: BsModalRef;
  showModal: boolean = false;
  invoice: TInvoiceHeader;
  discountModalShow: boolean = false;
  order: Order;
  companyInfor: MCompany;
  constructor(private alertify: AlertifyService,   private invoiceService: InvoiceService,  
    private shiftService: ShiftService, private basketService: BasketService, public commonService: CommonService, 
    private authService: AuthService,
     

    private route: ActivatedRoute, private modalService: BsModalService, private router: Router) {
    this.invoice = new TInvoiceHeader();
    this.companyInfor = this.authService.getCompanyInfor();
    if(this.companyInfor.foreignName===null || this.companyInfor.foreignName===undefined || this.companyInfor.foreignName=== '')
    {
      this.companyInfor.foreignName = this.companyInfor.companyName;
    }
    // this.companyInfor.foreignName = "CÔNG TY CỔ PHẦN JUMP ARENA";
  
  }
  ngAfterViewInit() {
    // this.invoice = new TInvoiceHeader();
    // debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function (item) {
      // Do stuff here
      if (item !== null && item !== undefined) {
        item.classList.add('hide');
        // console.log('Sumary');
      }
    });
    // paymentMenu
    // this.invoice.storeName = "Test";
    if(this.invoice.storeName===null || this.invoice.storeName === undefined || this.invoice.storeName === '' || this.invoice.storeName?.length <=0)
    {
      if(this.invoice.storeId === this.authService.storeSelected().storeId )
      {
        this.invoice.storeName = this.authService.storeSelected().storeName;
      }
    }
  }
  totalQty = 0;
  getNewCode() {
    this.invoiceService.getNewOrderCode(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).subscribe(data => {
      console.log(data);
      this.invoice.transId = data;
    });

  }
  checkLine() {
    this.invoice.lines.forEach(line => {
      if (line.openQty > line.quantity) {
        return false;
      }
    });
    return true;
  }
  saveEntity() {
    debugger;
    // let basket= this.basketService.getCurrentBasket();
    if (this.invoice.posType === "Event") {
      if (!this.checkLine()) {
        this.alertify.warning("check Open qty ");
      }
      else {
        this.saveModel();

      }

    }
    else {
      this.saveModel();
    }

  }
  filterNotBOM(items: TInvoiceLine[]) {
    // debugger;
    if (items !== null && items !== undefined) {
      let rs = items.filter(x => x.bomId === '' || x.bomId === null);
      // console.log(rs);
      return rs;
    }

  }
  filterBOM(items: TInvoiceLine[], itemCode, uomCode) {
    // debugger;
    if (items !== null && items !== undefined) {
      let rs = items.filter(x => x.bomId === itemCode);
      return rs;
    }

  }
  filterSerial(items: TInvoiceLineSerial[], itemCode, uomCode) {
    if (items !== null && items !== undefined) {
      let rs = items.filter(x => x.itemCode === itemCode && x.uomCode === uomCode);
      return rs;
    }

    // debugger;

  }
  items: ItemViewModel[];
  selectedCateFilter: string = "";
  merchandiseList: MMerchandiseCategory[];
  // pagination: Pagination;
  userParams: any = {};
  // @HostListener('window:beforeunload', ['$event'])

  isVirtualKey = false;
  createNewOrder() {
    this.router.navigate(["shop/order/", "checkout", this.invoice.contractNo]);
  }
  saveModel() {
    this.invoice.invoiceType = "CheckOut";
    this.invoice.lines.forEach(line => {
      line.openQty = line.openQty - line.quantity;
      line.quantity = line.checkOutQty;
      if (line.serialLines !== null && line.serialLines !== undefined) {
        line.serialLines.forEach(serialLine => {
          debugger;
          serialLine.openQty = serialLine.openQty - serialLine.quantity;

        });
      }

    });
    console.log(this.invoice.lines);
    this.invoice.invoiceType = "CheckOut";
    this.invoiceService.create(this.invoice).subscribe((response: any) => {
      if (response.success) {

        this.alertify.success('Check In completed successfully. ' + response.message);
        // this.router.navigate(["/shop/detail", response.message]);
        this.router.navigate(["shop/invoices", response.message, this.invoice.companyCode, this.invoice.storeId]);
      }
      else {
        this.alertify.warning('Check In failed. Message: ' + response.message);
      }
    });
    // this.invoice= this.order;

  }

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
  ngOnInit() {
    this.VirtualKey$ = this.commonService.VirtualKey$;
    this.storeSelected = this.authService.storeSelected();

    this.route.data.subscribe(data => {
      this.invoice = data['invoice'].data;
    });
    console.log(this.invoice);
    this.invoice.lines = this.invoice.lines.filter(x=>x.bomId===null || x.bomId===undefined || x.bomId==='');
    this.totalQty = this.invoice?.lines.reduce((a, b) => b.price * b.quantity + a, 0)

    // this.invoice = this.invoiceService.mapOrder2Invoice(this.order);
    // this.getNewCode();
    // this.invoice.createdOn = new Date();

    this.loadDiscountData(this.invoice);

  }

  totalQuanlity = 0;
  totalLineTotal = 0;
  totalPromoLineTotal = 0;

  loadDiscountData(invoice) {
    invoice.lines.forEach(line => {
      if(line.itemName !== ''){
        line.promoPrice = line.price - ((line.price * line.discountRate / 100) ?? 0);
        line.promoLineTotal = line.promoPrice * (line?.checkedQty ?? line?.quantity);
        this.totalQuanlity += line?.quantity;
        this.totalLineTotal += line?.lineTotal;
        this.totalPromoLineTotal += line?.promoLineTotal;
      }
      // debugger;
    });
    invoice.totalQuanlity = this.totalQuanlity;
    invoice.totalLineTotal = this.totalLineTotal;
    invoice.totalPromoLineTotal = this.totalPromoLineTotal;
  }

  orderId = "";


  @ViewChild('ManualPromotion', { static: false }) ManualPromotion;
  @ViewChild('template', { static: false }) template;
  checkOutAction(result: any) {
    // debugger;
    if (result === "ShowPayment") {
      this.modalRef = this.modalService.show(this.template);
    }
    if (result === "CheckOut") {
      this.saveEntity();
    }
    if (result === "ShowDiscount") {
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
  @ViewChild('pdfContainer_1') pdfContainer_1: ElementRef;
  now = new Date();
  PrintPage() {
    window.print();
  //   var data = this.pdfContainer_1.nativeElement.innerHTML;
       


  //   var versionUpdate = (new Date()).getTime();
  //   var myWindow = window.open('', 'my div', '');
  //   myWindow.document.write('<link rel="stylesheet" href="/assets/css/dev/bootstrap.min.css"/>');
  //   myWindow.document.write('<link rel="stylesheet" href="/assets/css/dev/dist/css/dx.light.css"/>');
  //   myWindow.document.write('<link rel="stylesheet" href="/assets/css/custom.css" type="text/css" />');
  //   myWindow.document.write('<link rel="stylesheet" href="/assets/css/stylecustomer.css?v="'+ versionUpdate+'" type="text/css" />');
  //   myWindow.document.write('<link rel="stylesheet" href="/assets/css/print.css" type="text/css" />');
  //   myWindow.document.write('<link rel="stylesheet" href="/assets/css/printtable.css?v="'+ versionUpdate+'" type="text/css" />');
  //   myWindow.document.write('</head><body >');
  //   myWindow.document.write(data);
  //   myWindow.document.write('</body></html>');
  //   myWindow.document.close(); // necessary for IE >= 10
  //   // this.exportAsPDF("printDiv");

  //   // console.log(' myWindow.document',  myWindow.document.getElementsByClassName("center-wrap")[0].innerHTML);
  //   // this.billService.testPrint( myWindow.document.getElementsByClassName("center-wrap")[0].innerHTML, "test").subscribe((response: any) =>{

  //   // });
  //   setTimeout(() => {
  //     console.log("print 3");
  //     myWindow.focus();
  //     let timeDelay = 100;
  //     // if (this.printDelay !== null && this.printDelay !== undefined && this.printDelay !== '') {
  //     //   timeDelay = parseInt(this.printDelay);
  //     // }
     
  //     setTimeout(() => {
  //       // myWindow.print();
  //       // myWindow.close();

  //       // if (this.poleValue === null || this.poleValue === undefined) {
  //       //   console.log("Pole Null")

  //       //   let currenInfor = this.authService.storeSelected();
  //       //   let localIp = this.authService.getLocalIP();
  //       //   this.storeClient.getById(currenInfor.companyCode, currenInfor.storeId, '', localIp, '').subscribe((response: any) => {

  //       //     if (response.success) {
  //       //       this.poleValue = response.data;
  //       //     }
  //       //   });
  //       //   await timer(200).pipe(take(1)).toPromise();
  //       // }

  //     }, timeDelay);

  //   }, 400);
  }
}
