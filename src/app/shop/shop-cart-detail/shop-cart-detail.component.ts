import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MStore } from 'src/app/_models/store';
import { IBasket, IBasketTotal } from 'src/app/_models/system/basket';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { fadeSlideGrowKeyframe } from '../route.animation';

@Component({
  selector: 'app-shop-cart-detail',
  templateUrl: './shop-cart-detail.component.html',
  styleUrls: ['./shop-cart-detail.component.scss'],
  animations:[
    fadeSlideGrowKeyframe,
    // trigger('fadeSlideGrowKeyframe', [
    //   transition(':enter', [
    //       style({ opacity: 0, transform: 'scale(0.5) translateY(50px)' }),
    //       animate(
    //           '500ms',
    //           keyframes([
    //               style({ opacity: 1, offset: 0.3 }),
    //               style({ transform: 'translateY(0)', offset: 0.6 }),
    //               style({ transform: 'scale(1)', offset: 1 }),
    //           ])
    //       ),
    //   ])
    // ]),
    // trigger('fadeInOut', [
    //   state('void', style({
    //     transform: 'rotate(-360deg)',
    //     opacity: 0
    //   })),
    //   transition('void <=> *', animate(500)),
    // ]),
  ]
})
export class ShopCartDetailComponent implements OnInit {

  basket$: Observable<IBasket>;
  basketTotal$: Observable<IBasketTotal>;
  
  constructor(private basketService: BasketService, private authService: AuthService) { }
  withTotalDiscountVisible = false;
  toggleTotalDiscountOptions() {
    this.withTotalDiscountVisible = !this.withTotalDiscountVisible;
  }
  store: MStore;
  loadSetting() {
    // let mode = this.authService.getGeneralSettingStore(this.store.companyCode, this.store.storeId).find(x => x.settingId === 'CustomerDisplayMode');
    // if (mode !== null && mode !== undefined) {
    //   this.customerMode = mode.settingValue;
    // }
    // let exMode = this.authService.getGeneralSettingStore(this.store.companyCode, this.store.storeId).find(x => x.settingId === 'ExchangeItems');
    // if (exMode !== null && exMode !== undefined) {
    //   this.exchangeItemMode = exMode.settingValue;

    // }
    let eInvoice = this.authService.getGeneralSettingStore(this.store.companyCode, this.store.storeId).find(x => x.settingId === 'Invoice');
    if (eInvoice !== null && eInvoice !== undefined) {
      this.eInvoice = eInvoice.settingValue;

    }
    // let loyalty = this.authService.getGeneralSettingStore(this.store.companyCode, this.store.storeId).find(x => x.settingId === 'Loyalty');
    // if (loyalty !== null && loyalty !== undefined) {
    //   this.loyalty = loyalty.settingValue;

    // }
    // let printByApp = this.authService.getGeneralSettingStore(this.store.companyCode, this.store.storeId).find(x => x.settingId === 'PrintByApp');
    // if (printByApp !== null && printByApp !== undefined) {
    //   this.printByApp = printByApp.settingValue; 
    // }
    // let printShow = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'CustomerDisplayMode');
    // if (printShow !== null && printShow !== undefined) {
    //   this.printShow = printShow.settingValue;
    // }
    // let allowNegativeExchange = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'AllowNegativeExchange');
    // if (allowNegativeExchange !== null && allowNegativeExchange !== undefined) {
    //   this.allowNegativeExchange = allowNegativeExchange.settingValue;
    // }
    // let poleDisplay = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'PoleDisplay');
    // if (poleDisplay !== null && poleDisplay !== undefined) {
    //   this.ignorePoleDisplay=false;
    //   this.poleDisplay = poleDisplay.settingValue;
    // }
  }
  eInvoice = "false";
  ngOnInit() {
    this.loadSetting();
    setTimeout(() => {
      this.store= this.authService.storeSelected();
      this.basket$ = this.basketService.basket$;
      this.basketTotal$ = this.basketService.basketTotal$; 
      let basket = this.basketService.getCurrentBasket();
      console.log('this.basket$', basket); 

    }, 100);
   
  }

}
