import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Item } from 'src/app/_models/item';
import { TSalesLine, TSalesLineSerial } from 'src/app/_models/tsaleline';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-exchange',
  templateUrl: './shop-exchange.component.html',
  styleUrls: ['./shop-exchange.component.css']
})
export class ShopExchangeComponent implements OnInit {

  modalRef: BsModalRef;
  showModal: boolean= false;
  
  discountModalShow: boolean = false;
  order: Order;
  // tslint:disable-next-line: max-line-length
  constructor(private alertify: AlertifyService, private itemService: ItemService, private billService: BillService, private basketService: BasketService, private authService: AuthService,
    private route: ActivatedRoute,private modalService: BsModalService, private router: Router) {  
      this.customizeText= this.customizeText.bind(this);
    }
  sttExchange=1000;
  selectedOpenMode: string = 'shrink';
  selectedPosition: string = 'left';
  selectedRevealMode: string = 'slide';
  isDrawerOpen: Boolean = false;
  itemList: any[] =[];
  loadItemList()
  {
    this.itemService.getItemViewList(this.authService.getCurrentInfor().companyCode,this.authService.storeSelected().storeId,'','','','','','')
      .subscribe((response: any)=>{
      this.itemList = response.data;
      debugger;
    });
     
  }
  selectItem(item)
  {
      let newLine = new TSalesLine();
       
  }
  exchangeItem(item) 
  {
    this.isDrawerOpen=true;
    this.loadItemList();
    // basket.items.forEach(val => newArray.push(Object.assign({}, val)));
    
    // let itemadd= Object.assign({}, item);
   
    // itemadd.isExchange = true;
    // itemadd.lineId= this.sttExchange;
    // this.order.lines.push(itemadd);
    // this.sttExchange++;
    // console.log(this.order.lines);
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
          // console.log('Shop exchage');
        }
    });
    // paymentMenu
  
  }
  onRowPrepared(e) {  
    
    if(e.data!==null && e.data!==undefined)
    { 
      if(e.data.lineId!==null && e.data.lineId!==undefined )
      {
        //&& (e.data.lines===null || e.data.lines===undefined || e.data.lines.length===0 || e.data.lines==='undefined'
        if (e.rowType === "data" && !e.data.isSerial)  {  
          // debugger;
          e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");  
          e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");  
    
        }  
      }
      
    }
    
    
}  
  customizeText (e) {
    
     if( e.value!==null &&  e.value!== undefined)
     {
       return this.authService.formatCurrentcy( e.value);

     }
     return 0;
  };
  filterNotBOM(items: TSalesLine[] )
  {
    debugger;
    let rs = items.filter(x=>x.bomId==='' || x.bomId===null);
    return rs;
  }
  filterBOM(items: TSalesLine[], itemCode, uomCode )
  {
    debugger;
    let rs = items.filter(x=>x.bomId===itemCode);
    return rs;
  }
  filterSerial(items: TSalesLineSerial[], itemCode, uomCode )
  {
    debugger;
    let rs = items.filter(x=>x.itemCode===itemCode&&x.uomCode===uomCode);
    return rs;
  }
  ngOnInit() {
     
    this.route.data.subscribe(data => {
      this.order = data['order'].data;
    });
    console.log(this.order);
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
  confirmOrder()
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to confirm bill!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        debugger;
        this.billService.confirmOrder(this.order).subscribe((response: any)=>{
          if(response.success)
          {
    
            this.alertify.success('Confirm completed successfully. ' + response.message);
            window.location.reload();
          }
          else
          {
           this.alertify.warning('Confirm failed. Message: ' + response.message);
          }
        })
      }
    });
    
  }

  createBasket()
  {
    const itemList: Item[] = [];
    this.basketService.changeCustomer(this.order.customer);
    // let basket = this.basketService.createBasket(this.order.customer);
    this.order.lines.forEach(async item => {
      // debugger;
      var response = await this.itemService.getItem(item.itemCode).toPromise();
      this.basketService.addItemtoBasket(response.data, item.quantity);
      //
    });
    // this.router.navigate(["shop/order"]);
    if(this.authService.getShopMode()==='FnB')
    {
      this.router.navigate(["shop/order"]).then(() => {
        // window.location.reload();
      }); 
    }
    if(this.authService.getShopMode()==='Grocery')
    {
      this.router.navigate(["shop/order-grocery"]).then(() => {
        // window.location.reload();
      }); 
    
    }
  }
}
