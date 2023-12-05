import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { TSalesHeader } from 'src/app/_models/tsaleheader';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service'; 
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-shop-return-list',
  templateUrl: './shop-return-list.component.html',
  styleUrls: ['./shop-return-list.component.css']
})
export class ShopReturnListComponent implements OnInit { 
  bills: TSalesHeader[];
  
  constructor( private alertify: AlertifyService, private routeNav: Router, private authService: AuthService,
              private route: ActivatedRoute) { 
                this.customizeText= this.customizeText.bind(this);
              }
    customizeText (e) {
      debugger;
        if( e.value!==null &&  e.value!== undefined)
        {
          return this.authService.formatCurrentcy( e.value);
  
        }
        return 0;
    };
  ngAfterViewInit()
  {
    debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function(item) {
      // Do stuff here
        if(item !== null && item !== undefined)
        {
          item.classList.add('hide');
          // console.log('return list');
        }
    });
    // paymentMenu
  
  } 
  ngOnInit() {
      
    this.route.data.subscribe(data => {
      debugger;
      this.bills = data['bills'];//.result;
     
    });
  }
    
  OpenOrder(order: Order)
  {
    debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
     this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
  }
   

}
