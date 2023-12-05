import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Item } from 'src/app/_models/item';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { ItemService } from 'src/app/_services/data/item.service';

@Component({
  selector: 'app-shop-search-item-voucher',
  templateUrl: './shop-search-item-voucher.component.html',
  styleUrls: ['./shop-search-item-voucher.component.scss']
})
export class ShopSearchItemVoucherComponent implements OnInit {

  modalRef: BsModalRef;
  @Input() model: ItemViewModel[] = [];
  itemByVoucher: ItemViewModel;
  constructor(private itemService: ItemService, private authService: AuthService, private basketService: BasketService) { }

  ngOnInit() {
    debugger;
    console.log("this.model", this.model);
  }

  closeModal(close) {
    if (close === true) {
      this.modalRef.hide();
    }
  }


  ApplyData(data) {
    if (data.uomName != null) {
      data.uomName = data.uomName;
    } else {
      data.uomName = '';
    }

    this.itemService.getItemViewList(data.companyCode, this.authService.storeSelected().storeId, data.itemCode, data.uomName, '', '', '', '', '', '').subscribe((response: any) => {
      // debugger;
      if (response.success == true) {
        // response.data.forEach(element => {
        //   element.defaultPrice = 0;
        //   element.priceBeforeTax = 0;
        //   element.priceAfterTax = 0;
        // });

        this.itemByVoucher = response.data[0];
        // this.basketService.addItemtoBasket(this.itemByVoucher, 1);
        debugger;
        this.itemByVoucher.defaultPrice = 0;
        this.itemByVoucher.priceAfterTax =0;
        this.itemByVoucher.priceBeforeTax =0;
        let itemBasket = this.basketService.mapProductItemtoBasket(this.itemByVoucher, 1);
        itemBasket.price = 0;
         
        itemBasket.promotionLineTotal = 0;
        itemBasket.promotionPriceAfDis = 0;
        itemBasket.discountType = "Fixed Quantity";
        // console.log("itemBasket lươi", itemBasket); 
        this.basketService.addPromotionItemToSimulation(itemBasket);
      }
    });
  }

}
