import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TGoodsReceiptPoheader } from 'src/app/_models/grpo';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { GrpoService } from 'src/app/_services/transaction/grpo.service';

@Component({
  selector: 'app-management-grpo-print',
  templateUrl: './management-grpo-print.component.html',
  styleUrls: ['./management-grpo-print.component.scss']
})
export class ManagementGRPOPrintComponent implements OnInit {

  constructor(private activedRoute: ActivatedRoute, private authService: AuthService, private grpoService: GrpoService, private companyService: CompanyService) { 
    
  }

  param = "";
  version = "en";
  companyName: string = '';
  arrDataPrintList: TGoodsReceiptPoheader;
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
    
    this.version = localStorage.getItem('language');
    this.GetData();
  }

  sumQuality: number = 0;
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
    this.grpoService.getBill(this.param, store.companyCode, store.storeId).subscribe((response: any) => {
      let resultStatus = this.statusOptions.filter(s => s.value.includes(response.data.status));
      this.arrDataPrintList = response.data;
      this.arrDataPrintList.status = resultStatus.length > 0 ? resultStatus[0].name : "";
      console.log("response", response.data);

      if (this.arrDataPrintList.lines.length > 0) {
        this.arrDataPrintList.lines.forEach(element => {
          debugger;
          if(element.priceBfVAT === null || element.priceBfVAT === undefined)
          {
            element.priceBfVAT = (element?.price??0) / ( 1 + ((element.vatPercent??0) /100));
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
          this.sumQuality += element.quantity != null ? element.quantity : 0;
          this.sumLineTotal += (element.price * element.quantity);
          this.sumLineTotalBfVAT += (element.priceBfVAT * element.quantity);
          this.sumTaxLineTotalBfVAT += (element.lineTotal - element.lineTotalBfVAT);
        });
        this.arrDataPrintList.sumQuality = this.sumQuality;
        this.arrDataPrintList.sumLineTotal = this.sumLineTotal;
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
