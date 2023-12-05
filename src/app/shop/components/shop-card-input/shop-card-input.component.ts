import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MPrepaidCard } from 'src/app/_models/prepaidcard';
import { IBasketItem } from 'src/app/_models/system/basket';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { PrepaidcardService } from 'src/app/_services/data/prepaidcard.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-shop-card-input',
  templateUrl: './shop-card-input.component.html',
  styleUrls: ['./shop-card-input.component.scss']
})
export class ShopCardInputComponent implements OnInit {

  @Input() item: IBasketItem;
  // @Input() item: ItemViewModel;
  cardList: MPrepaidCard[]=[];
  itemBasket: IBasketItem= new IBasketItem();
  // @Input() itemCode: string;
 
  @Output() outItem = new EventEmitter<any>();
  constructor(private authService: AuthService, private alertify: AlertifyService, private basketService: BasketService , private prepaidService: PrepaidcardService, public modalRef: BsModalRef ) { }
  selectCard(card)
  {
    this.item.prepaidCardNo= card.prepaidCardNo;
  }
  loadCardList()
  {
    let storeSelected= this.authService.storeSelected();
    this.prepaidService.getAll(storeSelected.companyCode, 'A').subscribe((response: any)=>{
      if(response.success)
      {
        this.cardList= response.data;
        console.log(this.cardList);
      }
      else
      {
        this.alertify.warning(response.message);
      }
      
    });
  }
  dateFormat="";
  ngOnInit() {
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.loadCardList();
    if(this.item.memberDate===null || this.item.memberDate===undefined)
    {
      this.item.memberDate= new Date();
    }
  
    if(this.item.quantity === undefined || this.item.quantity === null)
    {
      this.item.quantity =1;
    }
    
  }
  addToOrder()
  {
    debugger;
    if(this.item.prepaidCardNo===null || this.item.prepaidCardNo===undefined)
    {
      this.alertify.warning("Prepaid Card Num is null. Please input Prepaid Card Num");
    }
    else
    {
      if(this.item.quantity===null || this.item.quantity===undefined ||  this.item.quantity===0 )
      {
        this.alertify.warning("Quantity is null. Please input quantity");
      }
      else
      { 
        this.item.memberValue = this.item.quantity;
        // this.item.memberValue= this.quantity;
        // this.item.lineItems = [];
        // this.itemSerialSelected.forEach(serial => {
        //     const itemSerial = new  IBasketItem(); 
        //     itemSerial.serialNum = serial.serialNum;
        //     itemSerial.quantity = 1;
        //     itemSerial.lineItems = [];
        //     this.item.lineItems.push(itemSerial); 
        // });  
        this.basketService.addItemBasketToBasket(this.item, this.item.quantity , null );
        this.modalRef.hide();

      }
     
    }
   
    // this.basketService.addItemtoBasket(this.item, 1, response);
    // this.outItem.emit(this.item); 
  }

}
