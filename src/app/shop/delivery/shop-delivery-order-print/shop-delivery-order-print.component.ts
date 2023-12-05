import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TDeliveryHeader } from 'src/app/_models/deliveryOrder';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { DeliveryOrderService } from 'src/app/_services/data/delivery-order.service';

@Component({
  selector: 'app-shop-delivery-order-print',
  templateUrl: './shop-delivery-order-print.component.html',
  styleUrls: ['./shop-delivery-order-print.component.scss']
})
export class ShopDeliveryOrderPrintComponent implements OnInit {


  constructor(private activedRoute: ActivatedRoute, private authService: AuthService, private deliveryService: DeliveryOrderService,
     private companyService: CompanyService) { 
    
  }

  param = "";
  version = "vi";
  companyName: string = '';
  deliveryOrder: TDeliveryHeader;
  date:Date =new Date;
  statusOptions = [
    {
      value: "O", name: "Open",
    },
    {
      value: "A", name: "Open",
    },
    {
      value: "C", name: "Closed",
    },
    {
      value: "P", name: "Partial",
    },
  ];
  showPriceBfVATGRPO = "false";
  beforeVATReplacePrice = ""; // Replace = Thay thế giá price = giá trước thuế và line total sum lại // Only Price = Show thêm cột Price Bf VAT  // All = Show thêm cột Price Bf VAT và Line Price Bf VAT
  loadSetting() {
     
    let showPriceBfVATGRPO = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'ShowPriceBfVATGRPO');
    if (showPriceBfVATGRPO !== null && showPriceBfVATGRPO !== undefined) {
      this.showPriceBfVATGRPO = showPriceBfVATGRPO.settingValue;
      // if(this.showPriceBfVATGRPO === "true")
      // {
      //   this.beforeVATReplacePrice = showPriceBfVATGRPO.customField1;
      // }
      // debugger;
      // this.showPriceBfVATGRPO = "true";
      // this.beforeVATReplacePrice = "All";
    }
   
  }
  ngOnInit() {
    this.activedRoute.params.subscribe(data => {
      this.param = data['id'];
    })
    this.loadSetting();
    
    // this.version = localStorage.getItem('language');
    this.GetData();
  }

  sumQuantity: number = 0;
  sumLineTotal: number = 0;
  sumLineTotalBfVAT: number = 0;
  sumTaxLineTotalBfVAT: number = 0;

  isShowHeader = false;
  customizeText(value) {
    // debugger;
    // NoRounding
    // RoundUp
    // RoundToFiveHundredth
    // RoundToTenHundredth
    // RoundToOne
    // RoundToTen 

    return this.authService.roundingValue(value, "NoRounding", 6);
    // return this.authService.formatCurrentcy(value);
  };
  GetData() {
    let store = this.authService.storeSelected();
    this.deliveryService.getBill(this.param, store.companyCode, store.storeId).subscribe((response: any) => {
      let resultStatus = this.statusOptions.filter(s => s.value.includes(response.data.status));
      this.deliveryOrder = response.data;
      this.deliveryOrder.status = resultStatus.length > 0 ? resultStatus[0].name : "";
      console.log("response", response.data);

      if (this.deliveryOrder.lines.length > 0) {
        this.deliveryOrder.lines.forEach(element => {
          debugger;
          if(element.priceBfVAT === null || element.priceBfVAT === undefined)
          {
            element.priceBfVAT = (element?.price??0) / ( 1 + ((element.taxRate??0) /100));
          }
          if(element.lineTotalBfVAT === null || element.lineTotalBfVAT === undefined)
          {
            // element.priceBfVAT = element.price??0 - (element.price??0 * element.vatPercent??0) /100;
            element.lineTotalBfVAT = (element?.priceBfVAT??0) * (element?.quantity??0);
          }
         
          // if( this.showPriceBfVATGRPO === "true" && this.beforeVATReplacePrice === "Replace")
          // {
          //   element.price = element.priceBfVAT;
          //   element.lineTotal = element.priceBfVAT * element.price;
          // }
          this.sumQuantity += element.quantity != null ? element.quantity : 0;
          this.sumLineTotal += (element.price * element.quantity);
          this.sumLineTotalBfVAT += (element.priceBfVAT * element.quantity);
          this.sumTaxLineTotalBfVAT += (element.lineTotal - element.lineTotalBfVAT);
        });
        this.deliveryOrder.sumQuantity = this.sumQuantity;
        this.deliveryOrder.sumLineTotal = this.sumLineTotal;
      }
      // if( this.showPriceBfVATGRPO === "true" && this.beforeVATReplacePrice === "Replace")
      // {
      //   this.showPriceBfVATGRPO = 'false' ;
      //   this.beforeVATReplacePrice = '';
         
      // }
      
    });

    this.companyService.getItem(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      this.companyName = response.data.companyName;
     
    });
  }

  switchVersion() {
    if (this.version === 'vi') {
      this.version = 'en';
    }
    else {
      this.version = 'vi';
    }
  }

  PrintPage() {
    window.print();
  }
}
