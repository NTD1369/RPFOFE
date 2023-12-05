import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem } from 'src/app/_models/system/basket';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { BomService } from 'src/app/_services/data/bom.service'; 
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import { ShopCapacityComponent } from '../../capacity/shop-capacity/shop-capacity.component';
import { ShopCardInputComponent } from '../../components/shop-card-input/shop-card-input.component';
import { ShopMemberInputComponent } from '../../components/shop-member-input/shop-member-input.component';
import { ShopItemSerialComponent } from '../../tools/shop-item-serial/shop-item-serial.component';

@Component({
  selector: 'app-shop-item-check-single',
  templateUrl: './shop-item-check-single.component.html',
  styleUrls: ['./shop-item-check-single.component.scss']
})
export class ShopItemCheckSingleComponent implements OnInit {

 
  @Input() item: ItemViewModel;
  display= false;
  basketItem: IBasketItem;
  basket$: Observable<IBasket>;
  isShown: boolean = false;
  @Output() itemModel = new EventEmitter<any>();
  modalRef: BsModalRef; 

 constructor(private bomService: BomService, private modalService: BsModalService,private commonService: CommonService, private alertify: AlertifyService,
  private router: Router ,private authService: AuthService,private basketService: BasketService) { }

  ngOnInit() {
    // this.item =;
    // console.log(this.item);
    // debugger;
    this.basket$ = this.basketService.basket$;
    if(this.basket$!==null && this.basket$!== undefined)
    {
      // debugger;
      this.basket$.subscribe(val => {
        // debugger;
        if(val==null || val==undefined)
        {

        }
        else
        {
          if(val.items===null || val.items === undefined)
          {
    
          }
          else
          {
            if(val.items.filter(x=>x.id === this.item.itemCode).length > 0)
            {
              this.isShown = true;
            }
          }
         
        }
        
      });
    }
    if(this.item.imageUrl!==null && this.item.imageUrl!== undefined && this.item.imageUrl!=="" && this.item.imageUrl!=="undefined")
    {
      let checkUrlImage = this.commonService.doesFileExist(this.item.imageUrl);
      if(!checkUrlImage)
      {
        this.item.imageUrl= "";
      }
    } 
  }
 filter(itemCheck: string,itemUom: string, items: IBasketItem[]) 
  {
    // debugger;
    
    if(items!==null|| items!== undefined)
    {
      if(items.filter(x=>x.id === itemCheck && x.uom===itemUom && x.promotionIsPromo!=='1').length > 0)
      {
        // debugger;
        // console.log(items);
        // console.log(itemCheck , itemUom);
        return true;
      }
      else{
        return false;
      }
    }
    else
    {
      return false;
    }
   
    
  }
  showDialog()
  {
    //  debugger;
    this.itemModel.emit(this.item); 

  }
 
  increment(item: IBasketItem)
  {
    this.basketService.incrementItemQty(item);
  }
  decrement(item: IBasketItem)
  {
    this.basketService.decrementItemQty(item);
  }
  removeItem(item: IBasketItem)
  {
    this.basketService.removeItem(item);
  }
 
  addToBag()
  {
    let basket= this.basketService.getCurrentBasket();
    if(basket.customer!==null || basket!==undefined)
    {
      if(this.item.customField1==="Member")
      {
       
        let itembasket = this.basketService.mapProductItemtoBasket(this.item, 1); 
        itembasket.memberValue = 1;
        const initialState = {
          item:  itembasket, title: 'Item Serial',
        };
        this.modalRef = this.modalService.show(ShopMemberInputComponent, {initialState});
      }
      else
      {
        if(this.item.customField1==="Card")
        {
        
          let itembasket = this.basketService.mapProductItemtoBasket(this.item, 1); 
          itembasket.memberValue = 1;
          const initialState = {
            item:  itembasket, title: 'Item Serial',
          };
          this.modalRef = this.modalService.show(ShopCardInputComponent, {initialState});
        }
        else
        {
          debugger;
            let type = "";
            if(basket.items.length > 0)
            {
               type = basket.items[0].customField4; 
            }
            // if(type!==this.item.customField4 && type!== "")
            // {
            //    this.alertify.warning("Can't add different item type");
            // }
            // else
            // {
               // debugger;
              if(this.item.isBom)
              {
                this.bomService.GetByItemCode(this.authService.getCurrentInfor().companyCode, this.item.itemCode).subscribe((response: any)=>{
                  // debugger;
                  this.basketService.addItemtoBasket(this.item, 1, response.data);
                });
              }
              else
              {
                if(this.item.isSerial)
                {
                    let itembasket = this.basketService.mapProductItemtoBasket(this.item, 1);
                    
                    const initialState = {
                      item:  itembasket, title: 'Item Serial',
                    };
                    this.modalRef = this.modalService.show(ShopItemSerialComponent, {initialState});
                }
                else
                {
                  
                  
                    if(this.item.capacityValue !== null && this.item.capacityValue !== undefined && this.item.capacityValue > 0)
                    { 
                      Swal.fire({
                        title: 'Submit your quantity',
                        input: 'number',
                        inputAttributes: {
                          autocapitalize: 'off'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Look up',
                        showLoaderOnConfirm: true, 
                        allowOutsideClick: () => !Swal.isLoading()
                      }).then((result) => {
                        if (result.isConfirmed) {
                          debugger;
                          let itembasket= this.basketService.mapProductItemtoBasket(this.item, 1 );
                          itembasket.quantity = result.value;
                          itembasket.storeAreaId = '';
                          itembasket.timeFrameId = ''; 
                          itembasket.appointmentDate = '';
                          itembasket.isCapacity = true;
                          // 
                          const initialState = {
                            basketModel:  itembasket, title: 'Item Capacity',
                          };
                          this.modalRef = this.modalService.show(ShopCapacityComponent, {initialState});
                        }
                      })
                      // debugger;
                    
                      // this.router.navigate(["shop/capacity", this.item.itemCode]);
                    }
                    else
                    {
                      this.basketService.addItemtoBasket(this.item);
                    } 
                  
                  }

              
              }
            // }
           
        }
      }
     
    }
    else
    {
      
    }
   
  }


}
