import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal'; 
import { MPrepaidCard } from 'src/app/_models/prepaidcard';
import { IBasketItem } from 'src/app/_models/system/basket';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service'; 
import { ItemserialService } from 'src/app/_services/data/itemserial.service';
import { PrepaidcardService } from 'src/app/_services/data/prepaidcard.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { Sale } from 'src/app/_services/test/app.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-card-member-input',
  templateUrl: './shop-card-member-input.component.html',
  styleUrls: ['./shop-card-member-input.component.scss']
})
export class ShopCardMemberInputComponent implements OnInit {

  
  @Input() item: IBasketItem;
  // @Input() item: ItemViewModel;
  cardList: MPrepaidCard[]=[];
  card: MPrepaidCard;
  itemBasket: IBasketItem= new IBasketItem();
  // @Input() itemCode: string;
 
  @Output() outItem = new EventEmitter<any>();
  constructor(private authService: AuthService,    private itemserialService: ItemserialService, private alertify: AlertifyService, private basketService: BasketService , private prepaidService: PrepaidcardService, public modalRef: BsModalRef ) {
    this.card = new MPrepaidCard();
   }
  selectCard(card)
  {
    this.item.prepaidCardNo= card.prepaidCardNo;
    this.addToOrder();
  }
  loadCardList()
  {
    let storeSelected= this.authService.storeSelected();
    this.prepaidService.getAll(storeSelected.companyCode,'I').subscribe((response: any)=>{
      if(response.success)
      {
        this.cardList= response.data;
        console.log(this.cardList);
      }
      else
      {
        this.alertify.warning(response.message);
      }
      
      // this.cardList= response;
      // console.log(this.cardList);
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
  addNewCard()
  {
    debugger;

    if(this.card.prepaidCardNo===null || this.card.prepaidCardNo===undefined || this.card.prepaidCardNo==="")
    {
      this.alertify.warning("Prepaid Card Num is null. Please input Prepaid Card Num");
    }
    else
    {
      this.card.prepaidCardNo = this.card.prepaidCardNo.replace(/\s/g, "");
      if(this.card.prepaidCardNo==="")
      {
        this.alertify.warning("Prepaid Card Num is null. Please input Prepaid Card Num");
      }
      else
      {
        this.card.companyCode = this.authService.getCurrentInfor().companyCode;
        this.card.createdBy = this.authService.getCurrentInfor().username;
        this.card.duration = 1;
        this.card.startDate = new Date();
        this.card.status = "I";
        this.prepaidService.create(this.card).subscribe((response: any)=>{
          if(response.success)
          {
            debugger;
            this.loadCardList();
            this.alertify.success('save Prepaid Card completed successfully. ' + response.message);
              
          }
          else
          {
            this.alertify.warning('save Prepaid Card failed. Message: ' + response.message);
          }
        });
      }
     
        // this.item.memberValue = this.item.quantity;
        
        // this.basketService.addItemBasketToBasket(this.item, this.item.quantity , null );
        // this.modalRef.hide();

     
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
        debugger;
        this.basketService.addItemBasketToBasket(this.item, this.item.quantity , null );
        this.modalRef.hide();

      }
     
    }
   
    // this.basketService.addItemtoBasket(this.item, 1, response);
    // this.outItem.emit(this.item); 
  }


}
