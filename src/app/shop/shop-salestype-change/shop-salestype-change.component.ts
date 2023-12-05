import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CustomerService } from 'src/app/_services/data/customer.service';

@Component({
  selector: 'app-shop-salestype-change',
  templateUrl: './shop-salestype-change.component.html',
  styleUrls: ['./shop-salestype-change.component.scss']
})
export class ShopSalestypeChangeComponent implements OnInit {

  storeSelected: MStore;
  constructor(private authService: AuthService, private route: Router, private customerService: CustomerService, private basketService: BasketService, private router: Router) { }

  ngOnInit() {
    this.storeSelected=this.authService.storeSelected();
  }
  addNewOrder(saleType)
  {
    debugger;
    const basket = this.basketService.getCurrentBasket();
    if(basket===null)
    {
      this.customerService.getItem(this.storeSelected.companyCode, this.storeSelected.defaultCusId).subscribe((response: any) => {
        debugger;
        setTimeout(() => {
          
        let basket = this.basketService.getCurrentBasket();
        if (basket === null) {
          if(saleType!==null&& saleType!==undefined)
          {
            basket = this.basketService.createBasket(response.data);
            basket.salesType= saleType;
          } 
        }
        basket.customer = response.data;
        this.basketService.setBasket(basket).subscribe((resonse: any)=>{
          if(saleType==="Event")
          {
            this.route.navigate(['/shop/bills']);
          }
          else
          { 
            if(this.authService.getShopMode()==='FnB')
            {
              this.route.navigate(["shop/order"]).then(() => {
                window.location.reload();
              }); 
            }
            if(this.authService.getShopMode()==='Grocery')
            {
              this.route.navigate(["shop/order-grocery"]).then(() => {
                window.location.reload();
              }); 
            
            }
            // this.route.navigate(['/shop/order']).then(()=>{
            //   window.location.href= "/shop/order";
            // });
          }
        });
        
         
        }, 2); 
      
      });
    }
    else
    {
      this.basketService.deleteBasket(basket).subscribe(()=>{
        this.customerService.getItem(this.storeSelected.companyCode, this.storeSelected.defaultCusId).subscribe((response: any) => {
          debugger;
          setTimeout(() => {
            
          let basket = this.basketService.getCurrentBasket();
          if (basket === null) {
            if(saleType!==null&& saleType!==undefined)
            {
              basket = this.basketService.createBasket(response.data);
              basket.salesType= saleType;
            } 
          }
          basket.customer = response.data;
          this.basketService.setBasket(basket).subscribe((resonse: any)=>{
            if(saleType==="Event")
            {
              this.route.navigate(['/shop/bills']);
            }
            else
            {
              debugger;
              if(this.authService.getShopMode()==='FnB')
              {
                this.route.navigate(["shop/order"]).then(() => {
                  // window.location.reload();
                }); 
              }
              if(this.authService.getShopMode()==='Grocery')
              {
                this.route.navigate(["shop/order-grocery"]).then(() => {
                  // window.location.reload();
                }); 
              
              }
              // this.route.navigate(['/shop/order']).then(()=>{
              //   window.location.href= "/shop/order";
              // });
            }
          });
         
           
          }, 2); 
        
        });
      }); 
    }
  
    
     
  }
   
  chooseType(saleType)
  {
     this.addNewOrder(saleType);
    
  }
}
