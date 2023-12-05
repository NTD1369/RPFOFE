import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MStore } from 'src/app/_models/store';
import { SStoreClient } from 'src/app/_models/storeclient';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { BillService } from 'src/app/_services/data/bill.service';

@Component({
  selector: 'app-print-shop',
  templateUrl: './print-shop.component.html',
  styleUrls: ['./print-shop.component.scss'],

})
export class PrintShopComponent implements OnInit {

  orderId = "";
  order: Order;
  storeSelected: MStore;

  constructor(public authService: AuthService, private billService: BillService, private activatedRoute: ActivatedRoute, private basketService: BasketService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(data => {
      this.orderId = data['id'];
    });
    this.poleValue = this.getPole();
    this.GetData();
  }
  poleValue: SStoreClient;
  getPole() : SStoreClient
  {
    let poleSetup = localStorage.getItem("poleSetup");
    let result = null;
    if(poleSetup!==null && poleSetup!==undefined)
    {
      result = JSON.parse(poleSetup);
    }
    return result;
  }
  discountLine = 0;
  bonusLine = 0;
  orderNo: string;

  GetData() {
    this.storeSelected = this.authService.storeSelected();
    this.basketService.getNewOrderCode(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe(data => {
      this.orderNo = data;
      console.log("this.orderNo", this.orderNo);
    });

    this.billService.getBill(this.orderNo, this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any) => {
      if(response.success)
      {

        console.log("response get bilol", response.data);
        response.data.lines.forEach(line => {
          if (line.discountType !== "Bonus Amount") {
            this.discountLine += line.discountAmt === null ? 0 : line.discountAmt;
            response.data.discountLine = this.discountLine;
          } else {
            this.bonusLine += line.discountAmt === null ? 0 : line.discountAmt;
            response.data.bonusLine = this.bonusLine;
          }
        });
        this.order = response.data;
      }
     
    });
  }
}
