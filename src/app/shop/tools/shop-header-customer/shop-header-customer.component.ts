import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MCustomer } from 'src/app/_models/customer';
import { IBasket } from 'src/app/_models/system/basket';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service'; 
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-shop-header-customer',
  templateUrl: './shop-header-customer.component.html',
  styleUrls: ['./shop-header-customer.component.scss']
})
export class ShopHeaderCustomerComponent implements OnInit {
  customer$: Observable<MCustomer>;
  basket$: Observable<IBasket>; 
  constructor(public authService: AuthService, 
              private basketService: BasketService,  private alertify: AlertifyService)
              { }

  ngOnInit() {
    this.customer$ = this.basketService.customer$;
    this.basket$ = this.basketService.basket$;
  }

}
