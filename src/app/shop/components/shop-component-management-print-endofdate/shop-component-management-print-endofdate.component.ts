import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TEndDate } from 'src/app/_models/enddate';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { EnddateService } from 'src/app/_services/data/enddate.service';

@Component({
  selector: 'app-shop-component-management-print-endofdate',
  templateUrl: './shop-component-management-print-endofdate.component.html',
  styleUrls: ['./shop-component-management-print-endofdate.component.scss']
})
export class ShopComponentManagementPrintEndOfDateComponent implements OnInit {

  width: number;
  name: string;
  widthItem = [];
  widths = [
    { value: 10.5, name: "80mm" },
    { value: 21, name: "A4" },
  ];
  header: TEndDate;
  date = "";
  companyName: string = '';
  showItemSummary = "true";
  currentDate = new Date();

  constructor(public authService: AuthService, private enddateService: EnddateService, private activedRoute: ActivatedRoute, private companyService: CompanyService) {
    this.width = 10.5;
    this.name = '80mm'
  }


  loadGeneralSettingStore() {
    let result = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().storeId).find(x => x.settingId === 'EOSShowItemSummary');
    if (result !== null && result !== undefined) {
      this.showItemSummary = result.settingValue;
    }
  }
  payments = [];
  loadPayment() {
    this.enddateService.SummaryPaymentPrint(this.header.companyCode, this.header.storeId, this.header.id).subscribe((data: any) => {
      console.log('Payment details', data);
      this.payments = data.data;
    });
  }
  ngOnInit() {
    this.activedRoute.params.subscribe(data => {
      this.date = data['id'];
    })

    this.GetData();
    this.loadGeneralSettingStore();

  }

  priceT = 0;
  fcAmountT = 0;
  quantityT = 0;
  lineTotalT = 0;

  GetData() {
    let store = this.authService.storeSelected();
    this.enddateService.endDateSummary(store.companyCode, store.storeId, this.date).subscribe((response: any) => {

      if (response.data.payments.length > 0) {
        response.data.payments.forEach(element => {
          this.priceT += element.totalAmt === null ? 0 : element.totalAmt;
          this.fcAmountT += element.fcAmount;
          response.data.fcAmount = element.fcAmount === null ? 0 : element.fcAmount.toFixed(2)
          response.data.totalPrice = this.priceT;
          response.data.totalFCAmount = this.fcAmountT === null ? 0 : this.fcAmountT.toFixed(2);
        });
      }

      if (response.data.itemSumary.length > 0) {
        response.data.itemSumary.forEach(el => {
          this.quantityT += el.totalQty === null ? 0 : el.totalQty;
          this.lineTotalT += el.lineTotal === null ? 0 : el.lineTotal;
          response.data.totalQuantity = this.quantityT;
          response.data.totalLine = this.lineTotalT;
        });
      }

      this.header = response.data;
      console.log("end of day", this.header);
      this.loadPayment();
    });

    this.companyService.getItem(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      this.companyName = response.data.companyName;
      console.log("response", response);
    });
  }



  PrintPage() {
    window.print();
  }

  onWidthChanged = (e) => {
    console.log("ietm", e.item);
    this.width = e.item.value;
    this.name = e.item.name
  }
}
