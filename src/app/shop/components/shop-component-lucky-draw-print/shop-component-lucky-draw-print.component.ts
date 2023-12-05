import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SStoreClient } from 'src/app/_models/storeclient';
import { MStoreCurrency } from 'src/app/_models/storecurrency';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-shop-component-lucky-draw-print',
  templateUrl: './shop-component-lucky-draw-print.component.html',
  styleUrls: ['./shop-component-lucky-draw-print.component.css']
})
export class ShopComponentLuckyDrawPrintComponent implements OnInit {

 
  @Input() order: Order = new Order();
  @Input() typeOrder: string = '';
  @Input() autoPrint;
  companyName: string = '';
  transId: string = '';
  width: number;
  widthItem = [];
  widths = [
    { value: 11.5, name: "80mm" },
    { value: 8.5, name: "50mm" },
  ];
  cusDate: Date;

  constructor(private alertify: AlertifyService, private authService: AuthService, private billService: BillService,
    private router: Router, private companyService: CompanyService,) {
    this.width = 11.5;
    this.cusDate = new Date();
    // console.log("this.cusDate", this.cusDate);

  }

  @ViewChild('mydiv') myDivRef: ElementRef;
  @ViewChild('idName') idName: ElementRef;
  @ViewChild('pdfContainer_1') pdfContainer_1: ElementRef;
  @ViewChild('pdfContainer_2') pdfContainer_2: ElementRef;

  ngAfterViewInit() {
    // debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function (item) {
      // Do stuff here
      if (item !== null && item !== undefined) {
        // item.classList.add('hide');
        // console.log('Order print');
      }
    });
    // paymentMenu
    // debugger;
    //  
    if (this.order && this.autoPrint === true) {
      this.PrintPage(null);
    }
  }
  discountLine = 0;
  bonusLine = 0;
  storecurrency: MStoreCurrency[] = [];
  totalQty = 0;

  printShow = "ItemCode";
  HoldBillPrintMode = 'Full';
  printByApp = "true";
  PrintTemplate = "Template1";
  loadSetting() {
    let printShow = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'PrintItemShow');
    // debugger;
    if (printShow !== null && printShow !== undefined) {
      this.printShow = printShow.settingValue;
    }
    let printByApp = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'PrintByApp');
    if (printByApp !== null && printByApp !== undefined) {
      this.printByApp = printByApp.settingValue;
    }
    let HoldBillPrintMode = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'HoldBillPrint');
    if (HoldBillPrintMode !== null && HoldBillPrintMode !== undefined) {
      this.HoldBillPrintMode = HoldBillPrintMode.settingValue;
    }

    let PrintTemplate = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'PrintTemplate');
    if (PrintTemplate !== null && PrintTemplate !== undefined) {
      this.PrintTemplate = PrintTemplate.settingValue;
    }
  }
  poleValue: SStoreClient;
  ngOnInit() {
    // debugger;
    // console.log("ng on in it" , this.order);
    // // debugger;
    // console.log("autoPrint", this.autoPrint);
    if (this.order != undefined && this.order !== null) {
      this.order.totalQty = 0;
      this.order.lines.forEach(line => {
        if (line.discountType !== "Bonus Amount") {
          this.discountLine += line.discountAmt === null ? 0 : line.discountAmt;
          this.order.discountLine = this.discountLine;
        } else {
          this.bonusLine += line.discountAmt === null ? 0 : line.discountAmt;
          this.order.bonusLine = this.bonusLine;
        }
        // debugger;
        if (line.quantity > 0) {
          this.order.totalQty += line.quantity;
        }


      });

      if (this.order.status === 'Hold') {
        this.typeOrder = 'Hold';
      }
      this.poleValue = this.authService.getPole();
      console.log("this.poleValue", this.poleValue);
      let size = "";
      if (this.poleValue !== null && this.poleValue !== undefined) {
        if (this.poleValue?.printSize !== null && this.poleValue?.printSize !== undefined) {
          size = this.poleValue?.printSize;
        }
      }
      if (size === '57') {
        this.width = 8.5;
      }
      else {
        this.width = 11.5;
      }
      // this.order.lines.reduce((a, b) => (b.quantity) + a, 0);
      console.log("data", this.order);

      // this.widthItem = 
    }

    this.companyService.getItem(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      this.companyName = response.data.companyName;
    });

    this.loadSetting();
    this.storecurrency = this.authService.getStoreCurrency();

    //  this.PrintPage();
    // console.log("this.storecurrency", this.storecurrency);
    // console.log("this.order", this.order);
    //  = .reduce((a,b) => b.discountAmt ?? 0 + a, 0);
  }

  printerMarkerClicked() {
    // const popupWinindow = window.open();
    // window.print();
    // popupWinindow.document.close();
  }

  // PrintPage() {
  //   // console.log(this.myDivRef.nativeElement);
  //   window.print();
  // }
  PrintPage(numTem) {
    // console.log(this.pdfContainer.nativeElement);
    console.log("this.printByApp", this.printByApp);
    if (this.printByApp === "true") {
      if (numTem === 1) {
        var data = this.pdfContainer_1.nativeElement.innerHTML;
      } else if (numTem === 2) {
        var data = this.pdfContainer_2.nativeElement.innerHTML;
      } else {
        var data = this.pdfContainer_1.nativeElement.innerHTML;
      }


      // const textExsit = this.idName.nativeElement.innerHTML;
      // console.log("print 2", textExsit.length);
      var versionUpdate = (new Date()).getTime();
      var myWindow = window.open('', 'my div', '');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/dev/bootstrap.min.css"/>');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/stylecustomer.css" type="text/css" />');
      myWindow.document.write('</head><body >');
      myWindow.document.write(data);
      myWindow.document.write('</body></html>');
      myWindow.document.close(); // necessary for IE >= 10

      // if (textExsit.length > 0) {
      for (let i = 0; i < 2; i++) {
        setTimeout(() => {
          console.log("print 3");
          myWindow.focus();
          myWindow.print();
          myWindow.close();

        }, 500)

      }

      // } else {
      //   Swal.fire({
      //     icon: 'warning',
      //     title: 'Print bill',
      //     text: "Can't get data of order. Please manual print"
      //   }).then(() => {
      //     this.router.navigate(["shop/bills/print", this.order.transId, this.order.companyCode, this.order.storeId]).then(() => {
      //       window.location.reload();
      //     });
      //   });
      // }

    }
    else {
      let size = "";
      if (this.width === 8.5) {
        size = "57";
      }
      else {
        size = "80";
      }

      this.billService.PrintReceipt(this.order.companyCode, this.order.storeId, this.order.transId, 'Receipt Re-print', size, this.poleValue.printName).subscribe((response: any) => {

        if (response.success) {

        }
        else {
          this.alertify.warning(response.message);
        }

      })
    }


  }
  onWidthChanged = (e) => {
    this.width = e.item.value;
  }

}
