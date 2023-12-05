import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { NgxPrinterService } from 'ngx-printer';
import { Item } from 'src/app/_models/item';
import { SStoreClient } from 'src/app/_models/storeclient';
import { TSalesLine, TSalesLineSerial } from 'src/app/_models/tsaleline';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service'; 
import { ItemService } from 'src/app/_services/data/item.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-shop-bill-print',
  templateUrl: './shop-bill-print.component.html',
  styleUrls: ['./shop-bill-print.component.scss']
})
export class ShopBillPrintComponent implements OnInit {

  modalRef: BsModalRef;
  showModal: boolean = false;

  discountModalShow: boolean = false;
  order: Order;
  typeOrder: string = "Receipt re-print";
  // tslint:disable-next-line: max-line-length
  constructor(private alertify: AlertifyService, private authService: AuthService, private printerService: NgxPrinterService, private itemService: ItemService,   private basketService: BasketService,
    private route: ActivatedRoute, private modalService: BsModalService, private router: Router) { }
  ngAfterViewInit() {
    debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function (item) {
      // Do stuff here
      if (item !== null && item !== undefined) {
        item.classList.add('hide');
        // console.log('bill print');
      }
    });
    // paymentMenu

  }
  filterNotBOM(items: TSalesLine[]) {
    debugger;
    if (items !== null && items !== undefined) {
    let rs = items.filter(x => x.bomId === '' || x.bomId === null);
    return rs;
    }
  }
  filterBOM(items: TSalesLine[], itemCode, uomCode) {
    debugger;
    if (items !== null && items !== undefined) {
    let rs = items.filter(x => x.bomId === itemCode);
    return rs;
    }
  }
  filterSerial(items: TSalesLineSerial[], itemCode, uomCode) {
    debugger;
    if (items !== null && items !== undefined) {
    let rs = items.filter(x => x.itemCode === itemCode && x.uomCode === uomCode);
    return rs;
    }
  }
  ngOnInit() {
    console.log("order 1", this.order);
    this.route.data.subscribe(data => {
      this.order = data['order'].data;
    });
    this.poleValue = this.getPole();
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
  elementType = 'url';
  printerMarkerClicked() {
    // const popupWinindow = window.open();
    // window.print();
    // popupWinindow.document.close();
  }
  @ViewChild('PrintTemplate')
  private PrintTemplateTpl: TemplateRef<any>;

  printTemplate() {
    this.printerService.printAngular(this.PrintTemplateTpl);
  }
  outPutModel: Order;
  PrintPage()
  {
    
  }
  createBasket() {
    const itemList: Item[] = [];
    this.basketService.changeCustomer(this.order.customer);
    // let basket = this.basketService.createBasket(this.order.customer);
    this.order.lines.forEach(async item => {
      // debugger;
      var response = await this.itemService.getItem(item.itemCode).toPromise();
      this.basketService.addItemtoBasket(response.data, item.quantity);
      //
    });
    if (this.authService.getShopMode() === 'FnB') {
      this.router.navigate(["shop/order"]).then(() => {
        // window.location.reload();
      });
    }
    if (this.authService.getShopMode() === 'Grocery') {
      this.router.navigate(["shop/order-grocery"]).then(() => {
        // window.location.reload();
      });

    }
    // this.router.navigate(["shop/order"]);
    // this.basketService.addItemtoBasket();
    // itemList.forEach(item =>{
    //   setTimeout(() => {
    //     this.basketService.addItemtoBasket(item, 4);
    //   }, 10);

    // });
    // console.log(basket);
  }
}
