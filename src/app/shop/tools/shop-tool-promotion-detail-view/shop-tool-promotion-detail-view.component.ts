import { Component, Input, OnInit } from '@angular/core';
import { PromotionViewModel } from 'src/app/_models/promotion/promotionViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { PromotionService } from 'src/app/_services/promotion/promotion.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-shop-tool-promotion-detail-view',
  templateUrl: './shop-tool-promotion-detail-view.component.html',
  styleUrls: ['./shop-tool-promotion-detail-view.component.css']
})
export class ShopToolPromotionDetailViewComponent implements OnInit {
  @Input() promotionCode: string='';
  promotion: PromotionViewModel = new PromotionViewModel() ;
  constructor(private basketService: BasketService, private promotionService: PromotionService,  private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    // console.log(this.basketService.getCurrentBasket().promotionApply);
    // console.log(this.promotionCode);
    this.loadPromotion();
  }
  loadPromotion()
  {
    this.promotionService.getPromotion(this.authService.getCurrentInfor().companyCode, this.promotionCode).subscribe((response: any)=>{
      console.log(response);
      if(response.success)
      {
        this.promotion= response.data;
      }
      else
      {
        this.alertify.warning(response.message);
      }
      // this.promotion = response;
    })
  }
}
