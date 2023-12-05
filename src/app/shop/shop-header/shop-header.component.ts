import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { MCustomer } from 'src/app/_models/customer';
import { IBasket, IBasketTotal } from 'src/app/_models/system/basket';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service'; 
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import themes from "devextreme/ui/themes";

import Swal from 'sweetalert2';
import { CommonService } from 'src/app/_services/common/common.service';

@Component({
  selector: 'app-shop-header',
  templateUrl: './shop-header.component.html',
  styleUrls: ['./shop-header.component.scss']
})
export class ShopHeaderComponent implements OnInit {
  modalRef: BsModalRef;
  customer$: Observable<MCustomer>;
  basket$: Observable<IBasket>; 
  basketTotal$: Observable<IBasketTotal>;
  countries: any[] = [ 
    {name: 'Vietnamese', code: 'vi', flag:'vn'},
    {name: 'United States', code: 'en', flag:'gb'}
  ];
  selectedCountry: any;
  ShowMenu$: Observable<boolean>;
  @Output() sideRightShow = new EventEmitter<any>();
  constructor(private commonService: CommonService, public authService: AuthService, public translate: TranslateService , 
     private basketService: BasketService,  private modalService: BsModalService, private alertify: AlertifyService,
    private router: Router) {
      // debugger;
      translate.addLangs(['en', 'vi']); 
      if (localStorage.getItem('language')) {   
        const browserLang = localStorage.getItem('language');   
        translate.use(browserLang.match(/en|vi/) ? browserLang : 'en');   
      } else {  

        localStorage.setItem('language', 'en');   
        translate.setDefaultLang('en');  
        translate.use('en');   
      }  
      if(translate.currentLang===undefined || translate.currentLang === null)
      {
        translate.currentLang = 'en';
      }
      this.selectedCountry = this.countries.find(x=>x.code===translate.currentLang);
  } 
// isShowMenu=true;
  toggleMenu()
  {
    // debugger;
    this.commonService.changeIsShowMenu(!this.commonService.getCurrentShowMenu());
  }
  darkMode: boolean= false;
  switchMode() {
    // debugger;
    this.darkMode=!this.darkMode;
    if(this.darkMode===true)
    {
      themes.current("generic.dark");
    }
    if(this.darkMode===false)
    {
      themes.current("generic.light");
    }
  }
  ngAfterViewInit()
  {
    // debugger;
    // const paymentMenu = document.getElementsByClassName('paymentMenu');
    // Array.prototype.forEach.call(paymentMenu, function(item) {
    //   // Do stuff here
    //     if(item !== null && item !== undefined)
    //     {
    //       item.classList.add('hide');
    //     }
    // });
    // paymentMenu
  
  }
  switchLang(lang) {
    // debugger;
    let codeLang= lang.changedOptions.value;
    localStorage.setItem('language', codeLang);  
    this.translate.use(codeLang);
    this.selectedCountry = this.countries.find(x=>x.code===codeLang);
  }
  ngOnInit() {
    
    this.customer$ = this.basketService.customer$;
    this.basket$ = this.basketService.basket$;
    this.ShowMenu$ = this.commonService.ShowMenu$;

    this.basketTotal$ = this.basketService.basketTotal$;
  }
  showSide()
  {
    this.sideRightShow.emit(false); 
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      ariaDescribedby: 'my-modal-description',
      ariaLabelledBy: 'my-modal-title',
      class: 'modal-dialog modal-dialog-centered modal-xl'
    });
  }
  cancelOrder()
  {
    // debugger;
    const basket = this.basketService.getCurrentBasket();
    this.basketService.deleteBasket(basket);
    this.router.navigate(['/shop']);
  }
 
  logout()
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        // localStorage.removeItem('token');
        // localStorage.removeItem('user');
        // localStorage.clear();
        // this.authService.decodeToken = null;
        // this.authService.currentUser = null;
        this.authService.logout();
        this.basketService.customer$ = null;
        this.basketService.basket$ = null;
       
      }});
  }
 
}
