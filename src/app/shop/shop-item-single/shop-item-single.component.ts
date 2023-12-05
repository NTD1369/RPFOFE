import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSortHeader } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal'; 
import { Observable } from 'rxjs';
import { Item } from 'src/app/_models/item';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { IBasket, IBasketItem } from 'src/app/_models/system/basket';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { BomService } from 'src/app/_services/data/bom.service'; 
import { LicensePlateService } from 'src/app/_services/data/LicensePlate.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import { ShopCapacityComponent } from '../capacity/shop-capacity/shop-capacity.component';
import { ShopCardInputComponent } from '../components/shop-card-input/shop-card-input.component';
import { ShopCardMemberInputComponent } from '../components/shop-card-member-input/shop-card-member-input.component';
import { ShopMemberInputComponent } from '../components/shop-member-input/shop-member-input.component';
import { ShopItemSerialComponent } from '../tools/shop-item-serial/shop-item-serial.component';

@Component({
  selector: 'app-shop-item-single',
  templateUrl: './shop-item-single.component.html',
  styleUrls: ['./shop-item-single.component.scss']
})
export class ShopItemSingleComponent implements OnInit {

  @Input() item: ItemViewModel;
  @Input() mode: string = 'slick';
  @Input()  poleDisplay="false";
  @Input()  poleDisplayType="";
  display= false;
  basketItem: IBasketItem;
  basket$: Observable<IBasket>;
  isShown: boolean = false;
  @Output() itemModel = new EventEmitter<any>();
  modalRef: BsModalRef; 
  
 constructor(private bomService: BomService, private modalService: BsModalService,private commonService: CommonService, private alertify: AlertifyService,
  private route: ActivatedRoute ,private authService: AuthService,private basketService: BasketService,private licensePlateService :LicensePlateService) { }
  
  quantity= 0;
  showRemoveItem = false;
  showIncrementItem = false;
  showDerementItem = false;
  showAddToBasket = false;
  
  ngOnInit() {
    // this.item =;
    // console.log(this.item);
    // debugger;
    let basket= this.basketService.getCurrentBasket(); 
    const foundItem  = basket?.items?.find((x) => x.id === this.item?.itemCode && x.uom === this.item?.uomCode); 
    if(this.item?.customField9==="Y" && (foundItem === null || foundItem === undefined))
    {
      this.addToBag(false,true);
    }
    
    this.basket$ = this.basketService.basket$;

    if((this.item.isSerial===true && this.item?.customField1==='Retail') || this.item.capacityValue > 0 || this.item.customField1==='Member' || this.item.customField1==='Card')
    {
      this.showRemoveItem = true;
    }
    if(this.item.capacityValue > 0 || this.item.customField1==='Member'  || this.item.customField1==='Card' )
    {
      this.showAddToBasket= true;
    }
    if((this.item.isSerial!==true || this.item.isVoucher !== true)  && (this.item.capacityValue === 0 || this.item.capacityValue === null || this.item.capacityValue===undefined ) && this.item.customField1!=='Member' && this.item.customField1!=='Card')
    {
      this.showDerementItem= true;
    }
    if((this.item.isSerial!==true || this.item.isVoucher !== true) && (this.item.capacityValue === 0 || this.item.capacityValue === null || this.item.capacityValue===undefined  )
       && this.item.customField1!=='Member' && this.item.customField1!=='Card')
    {
      this.showIncrementItem = true;
    }
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
              // this.isShown = true;
              this.quantity = val.items.filter(x=>x.id === this.item.itemCode).reduce((a, b) => b.quantity + a, 0);
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
    
    if(items!==null && items!== undefined)
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
    debugger
    const basket = this.basketService.getCurrentBasket();
    const foundItem  = basket.items.find((x) => x.id === this.item.itemCode && x.uom === this.item.uomCode); 
    const quantity = foundItem.quantity;
    // basket.discountValue = 0;
    // this.basketService.setBasket(basket);
    if(this.item.customField9==="Y")
    {
      this.licensePlateService.checkLicensePlate(this.authService.getCurrentInfor().companyCode,basket.custom1,quantity+1).subscribe((x:any)=>
      {
        if(x.success ==true)
        {
          this.basketService.incrementItemQty(item);
          return;
        }
        else if(x.Message!=null || x.Message!=undefined|| x.Message!='' )
        {
          // this.alertify.error("Too many times used today")
                Swal.fire({
        title: 'Too many times used today',
        // input: 'text',
        icon:"warning",
        inputAttributes: {
          autocapitalize: 'off'
        },
        // showCancelButton: true,
        confirmButtonText: 'OK',
        // showLoaderOnConfirm: true,
  
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {});
          return;
        }
        else{
          this.alertify.error(x.Message);
          return;
        }
      })
    }
    else
    this.basketService.incrementItemQty(item);
  }
  decrement(item: IBasketItem)
  {
    // debugger
    // const basket = this.basketService.getCurrentBasket();
    // basket.discountValue = 0;
    // this.basketService.setBasket(basket);
    this.basketService.decrementItemQty(item);
  }
  removeItem(item: IBasketItem)
  {
    // const basket = this.basketService.getCurrentBasket();
    // basket.discountValue = 0;
    // this.basketService.setBasket(basket);
    this.basketService.removeItem(item);
  }
  
  addToBag(ispromo=false,isLoading = false)
  {
    let basket= this.basketService.getCurrentBasket(); 
    const foundItem  = basket.items.find((x) => x.id === this.item.itemCode && x.uom === this.item.uomCode); 
    // let debt  = basket.items.find((x) => x.custom1 === 'debt'); 
    // if (debt !== null && debt !== undefined)
    // {

    // }
    if(this.item.customField9==="Y")
    {
      this.licensePlateService.checkLicensePlate(this.authService.getCurrentInfor().companyCode,basket.custom1,1).subscribe((x:any)=>
      {
        if(x.success ==true)
        {
          this.addNewItemToBasket(basket,ispromo);
          return;
        }
        else if(x.Message!=null || x.Message!=undefined|| x.Message!='' )
        {
          // this.alertify.error("Too many times used today")
                Swal.fire({
        title: 'Too many times used today',
        // input: 'text',
        icon:"warning",
        inputAttributes: {
          autocapitalize: 'off'
        },
        // showCancelButton: true,
        confirmButtonText: 'OK',
        // showLoaderOnConfirm: true,
  
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if(isLoading)
        basket.custom1 = '';
        this.basketService.setBasket(basket);
        window.location.reload();
      });
          return;
        }
        else{
          this.alertify.error(x.Message);
          return;
        }
      })
    }
    else
    {
      if(foundItem !== null && foundItem !== undefined)
      {
        if((this.item.capacityValue !== null && this.item.capacityValue !== undefined && this.item.capacityValue > 0) || this.item.customField1==="Member" || this.item.customField1==="Class" 
        || this.item.isSerial || this.item.isVoucher || this.item.customField1==="Card" )
        {

          this.addNewItemToBasket(basket,ispromo)
        }
        else
        {
          this.increment(foundItem);
        }
       
      }
      else
      { 
        this.addNewItemToBasket(basket,ispromo)
        
      }
    }
   
    
  }

  
  // loadSetting() {
    
  //   let poleDisplay = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'PoleDisplay');
  //   if (poleDisplay !== null && poleDisplay !== undefined) {
  //     // this.ignorePoleDisplay=false;
  //     this.poleDisplay = poleDisplay.settingValue;
  //     let cusF1 = poleDisplay.customField1; 
  //     if(cusF1!==null && cusF1!==undefined && cusF1?.toLowerCase() ==='serialport')
  //     {
  //       this.poleDisplayType = "serialport";
  //     }
  //     else
  //     {
  //       this.poleDisplayType = "";
  //     }
  //   }
    
  // }
  addNewItemToBasket(basket,ispromo = false)
  {

    // if(this.poleDisplay==='true')
    // {
       
    //   let storeSelected = this.authService.storeSelected();
    //   if(this.poleDisplayType?.toLowerCase()==='serialport')
    //   {
    //     this.commonService.WritePoleValue(storeSelected.companyCode, storeSelected.storeId, null, this.poleDisplayType, 
          
    //      this.item?.itemName, "(" + storeSelected?.currencyCode + ") " + this.authService.formatCurrentcy(this.item?.defaultPrice), false);
    //   }
     
    // }

      this.basketService.changeDiscountValue(basket,0);
      let isReturn= basket.returnMode;
      let tmpItems = basket.tmpItems;
      let mode = basket.salesType;
      let check = false;
      debugger;
      if(mode.toLowerCase()==="ex" || mode.toLowerCase() ==="exchange" && isReturn)
      {
        if(tmpItems.some(x=>x.id=== this.item.itemCode && x.uom === this.item.uomCode) )
        {
            check = true;
        }
      }
      else
      {
        check =true;
      }
      if(check)
      {
        if(basket.customer!==null || basket!==undefined)
        {
          if(this.item.customField9 ==="Y")
          {
            this.item.custom1 = basket.custom1;
          }
          // if(this.item.customField1 ==="debt")
          // {
          //   Swal.fire({
          //     title: 'Submit your License Plate Number',
          //     input: 'text',
          //     inputAttributes: {
          //       autocapitalize: 'off'
          //     },
          //     showCancelButton: true,
          //     confirmButtonText: 'Check License Plate',
          //     showLoaderOnConfirm: true,
  
          //     allowOutsideClick: () => !Swal.isLoading()
          //   }).then((result) => {
          //     if (result.isConfirmed) {
          //      let valueCheck = result.value.replace(/\s/g, "");
          //      if(valueCheck?.length > 0)
          //      {
          //        this.licensePlateService.checkLicensePlate(this.authService.getCurrentInfor().companyCode,valueCheck,1).subscribe((x:any)=>
          //         {
          //           if(x.success ==true)
          //           {
          //             this.item.custom1 = valueCheck;
          //             this.basketService.addItemtoBasket(this.item, isReturn ? -1 : 1);
          //           }
          //           else if(x.Message!=null || x.Message!=undefined|| x.Message!='' )
          //           {
          //             this.alertify.error("License Plate Not Found or too many times used today")
          //             return;
          //           }
          //           else{
          //             this.alertify.error(x.Message);
          //             return;
          //           }
          //         })
          //      }
          //      }
          //      else
          //      {
          //        Swal.fire({
          //          icon: 'warning',
          //          title: 'Card Number',
          //          text: "Please input Card Number"
          //        });
          //        return;
          //      }
              
          //   })
          // }
          // else 
          if(this.item.customField1==="Member" || this.item.customField1==="Class" )
          {
           
            let itembasket = this.basketService.mapProductItemtoBasket(this.item, 1); 
            itembasket.memberValue = 1;
            const initialState = {
              item:  itembasket, title: 'Item Serial'
             
            };
            this.modalRef = this.modalService.show(ShopMemberInputComponent, {initialState ,  animated: true,
              keyboard: true,
              backdrop: true,
              ignoreBackdropClick: false, 
              ariaDescribedby: 'my-modal-description',
              ariaLabelledBy: 'my-modal-title', 
              class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'});
          }
          else
          {
            if(this.item.customField1==="Card"   )
            {
              if(this.item.isSerial || this.item.isVoucher)
              {
                  let itembasket = this.basketService.mapProductItemtoBasket(this.item, isReturn ? -1 : 1);
                  
                  const initialState = {
                    item:  itembasket, title: 'Item Serial',
                  };
                  this.modalRef = this.modalService.show(ShopCardMemberInputComponent, {initialState});
              }
              else
              {
                let itembasket = this.basketService.mapProductItemtoBasket(this.item, isReturn ? -1 : 1); 
                itembasket.memberValue = 1;
                const initialState = {
                  item:  itembasket, title: 'Item Serial',
                };
                this.modalRef = this.modalService.show(ShopCardInputComponent, {initialState});
              }
           
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
                    this.bomService.GetByItemCode(this.authService.getCurrentInfor().companyCode,  this.item.itemCode).subscribe((response: any)=>{
                      debugger;
                      if(response.success)
                      {
                        this.basketService.addItemtoBasket(this.item, isReturn ? -1 : 1, response.data);
                      }
                      else
                      {
                        this.alertify.warning(response.message);
                      }
                      
                    });
                  }
                  else
                  {
                    if(this.item.isSerial || this.item.isVoucher)
                    {
                        let itembasket = this.basketService.mapProductItemtoBasket(this.item, isReturn ? -1 : 1);
                        
                        const initialState = {
                          item:  itembasket, title: 'Item Serial',
                        };
                        this.modalRef = this.modalService.show(ShopItemSerialComponent, {initialState});
                    }
                    else
                    {
                      
                      
                        if((this.item.capacityValue !== null && this.item.capacityValue !== undefined && this.item.capacityValue > 0) )
                        
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
                              itembasket.quantity =  isReturn ? -result.value : Math.abs(result.value);
                              itembasket.storeAreaId = '';
                              itembasket.timeFrameId = ''; 
                              itembasket.appointmentDate = '';
                              itembasket.isCapacity = true;
                              let modeZ ;
                              this.route.params.subscribe(data => {
                                debugger;
                                let mode = data['m']; 
                                 if(mode?.toLowerCase()==="checkout")
                                 {
                                  modeZ = "checkout";
                                  
                                 }
                              })
                              // 
                              const initialState = {
                                basketModel:  itembasket, 
                                title: 'Item Capacity',
                                 mode: modeZ,
                                ispromo:ispromo
                              };
                              this.modalRef = this.modalService.show(ShopCapacityComponent, {initialState});
                            }
                          })
                          // debugger;
                        
                          // this.router.navigate(["shop/capacity", this.item.itemCode]);
                        }
                        else
                        {
                          this.basketService.addItemtoBasket(this.item, isReturn ? -1 : 1);

                        } 
                      
                      }
    
                  
                  }
                // }
               
            }
          }
         
        }
        
      }
      if((mode.toLowerCase()==="ex" || mode.toLowerCase() ==="exchange") && isReturn && check===false)
      {
        this.alertify.warning("Item is not existed in the order");
      }
  }
}
