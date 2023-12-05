import { Component, OnInit } from '@angular/core';
import { MCustomer } from 'src/app/_models/customer';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';

@Component({
  selector: 'app-shop-customer-detail',
  templateUrl: './shop-customer-detail.component.html',
  styleUrls: ['./shop-customer-detail.component.scss']
})
export class ShopCustomerDetailComponent implements OnInit {

  customer: MCustomer;
  storeSelected: MStore;
  constructor(private authService: AuthService, private basketService: BasketService,private mwiService : MwiService) { }

  ngOnInit() {
    this.storeSelected = this.authService.storeSelected();
    this.customer = this.basketService.getCurrentBasket().customer;
    this.loadVoucherList(this.customer);
  }
  loadVoucherList(customer)
  {
    debugger;
    this.mwiService.getVoucherListByCustomer(customer.id,this.storeSelected.storeId).subscribe((response: any)=>{
       console.log(response);
       if(response.status===1)
       { 
         
          this.customer = customer;
          this.customer.vouchers= response.data;
       }
      //  else
      //  {
      //     this.alertify.warning(response.msg);
      //  }
    });
    
  }
}
