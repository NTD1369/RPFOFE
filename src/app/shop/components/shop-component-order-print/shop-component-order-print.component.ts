import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ThumbnailsPosition } from 'ng-gallery';
import { BsModalService } from 'ngx-bootstrap/modal';
import { error } from 'protractor';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MCompany } from 'src/app/_models/company';
import { SGeneralSetting } from 'src/app/_models/generalsetting';
import { SStoreClient } from 'src/app/_models/storeclient';
import { MStoreCurrency } from 'src/app/_models/storecurrency';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { StoreclientService } from 'src/app/_services/data/storeclient.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxQrcodeElementTypes } from '@techiediaries/ngx-qrcode';
import { DxSankeyComponent } from 'devextreme-angular';

@Component({
  selector: 'app-shop-component-order-print',
  templateUrl: './shop-component-order-print.component.html',
  styleUrls: ['./shop-component-order-print.component.css']
})
export class ShopComponentOrderPrintComponent implements OnInit {

  @Input() order: Order = new Order();
  @Input() typeOrder: string = '';
  @Input() autoPrint;
  @Input() poleValue: SStoreClient;
  @ViewChild(DxSankeyComponent, { static: false }) sankey: DxSankeyComponent;
  printSankey() {
    this.sankey.instance.print();
 };
 exportSankey() {
  this.sankey.instance.exportTo("exported_sankey", "PDF");
};
  companyName: string = '';
  transId: string = '';
  width: number;
  taxtDescrip = "Tax Amount";
  widthItem = [];
  widths = [
    { value: 10.5, name: "80mm" },
    { value: 7, name: "50mm" },
  ];
  cusDate: Date;
  orderType = "Normal";

  constructor(private alertify: AlertifyService, private authService: AuthService, private billService: BillService,
    private commonService: CommonService, private storeClient: StoreclientService, public env: EnvService,
    private router: Router, private companyService: CompanyService,) {
    this.width = 10.5;
    this.cusDate = new Date();
    // console.log("this.cusDate", this.cusDate);

  }

  @ViewChild('mydiv') myDivRef: ElementRef;
  @ViewChild('idName') idName: ElementRef;
  @ViewChild('pdfContainer_1') pdfContainer_1: ElementRef;
  @ViewChild('pdfContainer_2') pdfContainer_2: ElementRef;
  @ViewChild('pdfLuckyContainer') pdfLuckyContainer: ElementRef;
  @ViewChild('pdfVoucherHeader') pdfVoucherHeader: ElementRef;

  
  offPrint = false;
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
      this.PrintPage();
      
    }
  }
  discountLine = 0;
  bonusLine = 0;
 
  barcodeWidth = 1.2; // đơn vị tính cm 
  barcodeHeight= 50; // đơn vị tính mm
  storecurrency: MStoreCurrency[] = [];
  company: MCompany[] = [];
  totalQty = 0;

  printShow = "ItemCode";
  HoldBillPrintMode = 'Full';
  printByApp = "true";
  PrintTemplate = "Template1";
  OpenDrawer = "false";
  showTaxAmount = "false";
  printDelay = "100";
  printLuckyDelay = "500";
  printHeaderDelay = "500";
  BillReload = 10;
  voucherHeaderPrintRequest = false;
  // OpenDrawerOnReprint= "false";
  // OpenDrawerOnReceipt= "true";
  MWIEpay: any;
  printByPDF = "";  
  QtyWScaleToOne = false; 
  loadSetting() {
    let printShow = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'PrintItemShow');
    // debugger;
    if (printShow !== null && printShow !== undefined) {
      this.printShow = printShow.settingValue;
    }
    let printByApp = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'PrintByApp');
    if (printByApp !== null && printByApp !== undefined) {
      this.printByApp = printByApp.settingValue;
      if(this.printByApp !== null  && this.printByApp !== undefined && this.printByApp === "true")
      {
        if(printByApp.customField1 !== null && printByApp.customField1 !== undefined && printByApp.customField1 !== '' )
        {
          this.printByPDF = printByApp.customField1;
        }
        if(printByApp.customField2 !== null && printByApp.customField2 !== undefined && printByApp.customField2 !== '' )
        {
          this.printNum = printByApp.customField2;
          
        }
      }
      console.log('this.printNum After Load', this.printNum);
    }
    let QtyWScaleToOne = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'QtyWScaleToOne');
    if (QtyWScaleToOne !== null && QtyWScaleToOne !== undefined) {
      let rs = QtyWScaleToOne.settingValue;
      if(rs === 'true')
      {
        this.QtyWScaleToOne = true;
      }
      else
      {
        this.QtyWScaleToOne = false; 
      }
    }
    else
    {
      this.QtyWScaleToOne = false; 
    }
    let HoldBillPrintMode = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'HoldBillPrint');
    if (HoldBillPrintMode !== null && HoldBillPrintMode !== undefined) {
      this.HoldBillPrintMode = HoldBillPrintMode.settingValue;
    }
    let MWIEpay = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'MWIEpay');
        // debugger;
    if (MWIEpay !== null && MWIEpay !== undefined) {
      this.MWIEpay = MWIEpay;
    }
    let BillReloadNo = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'BillReloadNo');
    if (BillReloadNo !== null && BillReloadNo !== undefined) {

      let value = BillReloadNo.settingValue;
      if (value !== "" && value !== "0" && value !== undefined && value !== null && value !== "None") {
        this.BillReload = parseInt(value);
      }
      else
      {
        this.BillReload = 0;
      }
    }
    let PrintTemplate = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'PrintTemplate');
    if (PrintTemplate !== null && PrintTemplate !== undefined) {
      this.PrintTemplate = PrintTemplate.settingValue;
    }
    let showTaxAmount = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'PrintShowTax');
    if (showTaxAmount !== null && showTaxAmount !== undefined) {
      this.showTaxAmount = showTaxAmount.settingValue;
      this.taxtDescrip = showTaxAmount.customField1;
      if (this.taxtDescrip === null || this.taxtDescrip === undefined || this.taxtDescrip === '') {
        this.taxtDescrip = "Tax Amount";
      }
    }




    debugger;
    switch (this.typeOrder) {
      case "Receipt re-print": {
        //statements; 
        let OpenDrawer = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'OpenDrawerOnReprint');
        if (OpenDrawer !== null && OpenDrawer !== undefined) {
          this.OpenDrawer = OpenDrawer.settingValue;
        }
        break;
      }
      case "Hold": {
        //statements; 
        let OpenDrawer = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'OpenDrawerOnHold');
        if (OpenDrawer !== null && OpenDrawer !== undefined) {
          this.OpenDrawer = OpenDrawer.settingValue;
        }
        break;
      }
      default: {
        //statements; 
        let OpenDrawer = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'OpenDrawerOnReceipt');
        if (OpenDrawer !== null && OpenDrawer !== undefined) {
          this.OpenDrawer = OpenDrawer.settingValue;
        }
        break;
      }
    }

    //  console.log("this.OpenDrawer", this.OpenDrawer);
    // if(this.typeOrder)
    // {
    //   let OpenDrawer = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'OpenDrawerOnReceipt');
    //   if (OpenDrawer !== null && OpenDrawer !== undefined) {
    //     this.OpenDrawer = OpenDrawer.settingValue;
    //   }
    // }

    // let OpenDrawerOnHold = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'OpenDrawerOnHold');
    // if (OpenDrawerOnHold !== null && OpenDrawerOnHold !== undefined) {
    //   this.OpenDrawerOnHold = OpenDrawerOnHold.settingValue;
    // }
    // let OpenDrawerOnReprint = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'OpenDrawerOnReprint');
    // if (OpenDrawerOnReprint !== null && OpenDrawerOnReprint !== undefined) {
    //   this.OpenDrawerOnReprint = OpenDrawerOnReprint.settingValue;
    // }
  }
  terminalEpay = "";
  orderList: Order[] = [];
  myMath = Math;
  printNum = '1';
  printSerialNumberInSection = false;
  setBarcodeSize()
  {
    if(this.width === 10.5)
    {
      if(this.env?.printBarcodeHeight80mm?.length > 0)
      {
        this.barcodeHeight = parseFloat(this.env.printBarcodeHeight80mm);
      }
      if(this.env?.printBarcodeWidth80cm?.length > 0)
      {
        this.barcodeWidth = parseFloat(this.env.printBarcodeWidth80cm);
      }
      
    }
    else
    {
      if(this.env?.printBarcodeHeight50mm?.length > 0)
      {
        this.barcodeHeight = parseFloat(this.env.printBarcodeHeight50mm);
      }
      if(this.env?.printBarcodeWidth50cm?.length > 0)
      {
        this.barcodeWidth = parseFloat(this.env.printBarcodeWidth50cm);
      }
    }
    
     console.log('this.width init', this.width);
     console.log('this.barcodeWidth init cm', this.barcodeWidth);
     console.log('this.barcodeHeight init mm', this.barcodeHeight);

  }
  ngOnInit() {
     
    this.commonService.changePrinted(false);
    this.offPrint = this.env.enableDebug ?? false;
    this.printDelay = this.env.printDelay; 
    this.printLuckyDelay = this.env.printLuckyDelay;  
    this.printHeaderDelay = this.env.printHeaderDelay; 

    
    
     
   
    // debugger;
    // console.log("ng on in it" , this.order);
    // // debugger;
    // console.log("autoPrint", this.autoPrint);
    // localStorage.setItem("basketProcess", "");
    this.loadSetting();
    this.storecurrency = this.authService.getStoreCurrency();
    let company = this.authService.getCompanyInfor();
    if(company!==null && company!==undefined)
    {
      let checkC = company?.companyName?.toLowerCase().includes('servay');
      if(checkC)
      {
        this.currency = "RM";
      }
      
    }
    // console.log('Init Order Print' , this.order?.transId);
    // console.log('Order Print' , this.order);

    if (this.order != undefined && this.order !== null) {
      this.order.totalQty = 0;
      debugger;



      if (this.order.lines?.length > 0) {
        let line = this.order.lines[0];
        if ((line.itemType?.toLowerCase() === 'pn' || line.itemType?.toLowerCase() === 'pin') && this.orderType === "Normal") {
          this.orderType = "Epay";
          this.terminalEpay = this.order?.otherTerminalId ?? "" ;// this.MWIEpay?.customField3 ?? "";//  this.env.terminalID;// environment.terminalID;
        }
      }
      console.log('this.order.lines', this.order.lines);
      if (this.orderType === "Epay") {
        this.order.lines.forEach(line => {
          line.lineTotalBefDis = line.lineTotalBefDis != null ? line.lineTotalBefDis : (line.price * line.quantity);
          line.serialLines.forEach(epayLine => {
            var orderX = Object.assign({}, this.order);
            orderX.lines = [];

            var lineX = Object.assign({}, line);
            lineX.serialLines = [];
            epayLine.baseTransId = epayLine.baseTransId.split('|')[0];
            if(this.order?.pinSerialDisplayUpper?.toLowerCase()?.length > 0 &&  this.order?.pinSerialDisplayUpper?.toLowerCase() !== "serial" )
            { 
                var epayLineClone = Object.assign({}, epayLine);
                let baseTransId = epayLineClone.baseTransId;
                let serialNum = epayLineClone.serialNum;

                epayLine.serialNum = baseTransId;
                epayLine.baseTransId = serialNum;
            }
            lineX.serialLines.push(epayLine);
            // lineX.quantity = 1;
            // lineX.lineTotal = lineX.lineTotal / line.quantity;

            orderX.lines.push(lineX);
            orderX.remarkCustom1 = epayLine.customF3;
            this.orderList.push(orderX);
          })
        })
        console.log(' this.orderList', this.orderList);
      }
      else {
        this.order.lines.forEach(line => {

          line.lineTotalBefDis = line.lineTotalBefDis != null ? line.lineTotalBefDis : (line.price * line.quantity);
          
          if (line.itemType?.toLowerCase() === 'topup' || line.itemType?.toLowerCase() === 'tp' || line.itemType?.toLowerCase() === 'bp' || line.itemType?.toLowerCase() === 'billpayment') {
            line.custom3 = line.custom3.split('|')[0];
          }
          if (line.discountType !== "Bonus Amount") {
            this.discountLine += line.discountAmt === null ? 0 : line.discountAmt;
            this.order.discountLine = this.discountLine;
          } else {
            this.bonusLine += line.discountAmt === null ? 0 : line.discountAmt;
            this.order.bonusLine = this.bonusLine;
          }
          // debugger;
          if (line.quantity > 0) {
            if(this.QtyWScaleToOne===false)
            {
              this.order.totalQty += line.quantity;
            }
            else
            {
              this.order.totalQty += line.weightScaleBarcode?.length > 0 ? 1 : line.quantity;
            }
            
          } 

        });

      }
      // *ngIf="!item?.bookletNo && item.serialLines?.length > 0 && (item?.itemType?.toLowerCase()==='retail' )"
      if(this.printSerialNumberInSection === true)
      {
        this.order.lines.forEach(line => {
          if(!line?.bookletNo && line.serialLines?.length > 0 && (line?.itemType?.toLowerCase()==='retail' ))
          {
            line.serialLines.forEach(serialLine => {
              let serialModel:any= {};
              serialModel.serialNum = serialLine.serialNum;
              serialModel.expDate = serialLine.expDate;
  
              this.serialList.push(serialModel);
            });
            
          }
        });
      }
      
      if (this.order.status === 'Hold') {
        this.typeOrder = 'Hold';
      }
      if(this.order.luckyNo?.length > 0)
      {
        this.luckyPrintRequest = true;
      }
      if(this.order?.hasVoucher === true)
      {
        this.voucherHeaderPrintRequest = true;
      }
      // this.poleValue = this.authService.getPole();
      console.log("data", this.order);
      debugger;
      let size = "";
      if (this.poleValue === null || this.poleValue === undefined) {
        let currenInfor = this.authService.storeSelected();
        let localIp = this.authService.getLocalIP();
        this.storeClient.getById(currenInfor.companyCode, currenInfor.storeId, '', localIp, '').subscribe(async (response: any) => {
          if (response.success) {
            // result = response.data; 
            this.poleValue = response.data;
          }
          await timer(100).pipe(take(1)).toPromise();
          debugger;

          let size = "";
          if (this.poleValue !== null && this.poleValue !== undefined) {
            if (this.poleValue?.printSize !== null && this.poleValue?.printSize !== undefined) {
              size = this.poleValue?.printSize;
            }
          }
          if (size === '57') {
            this.width = 7;
          }
          else {
            this.width = 10.5;
          }
          this.setBarcodeSize();
          if (this.poleValue?.printName?.length > 0) {
            if(this.printByPDF !== 'PDF')
            {
              if (this.OpenDrawer === "true" && this.poleValue?.printName ) {
                this.commonService.OpenDrawer(this.poleValue?.printName, this.order?.transId).subscribe((response: any) => {

                }, (error) => {

                  this.alertify.error(error);
                }
                );
                
              }
            }
          }
        }, error => {
          if (this.poleValue !== null && this.poleValue !== undefined) {
            if (this.poleValue?.printSize !== null && this.poleValue?.printSize !== undefined) {
              size = this.poleValue?.printSize;
            }
          }
          if (size === '57') {
            this.width = 7;
          }
          else {
            this.width = 10.5;
          }
          this.setBarcodeSize();
          if (this.poleValue?.printName?.length > 0) {
            if(this.printByPDF !== 'PDF')
            {
              if (this.OpenDrawer === "true" && this.poleValue?.printName) {
                this.commonService.OpenDrawer(this.poleValue?.printName, this.order?.transId).subscribe((response: any) => {

                }, (error) => {

                  this.alertify.error(error);
                }
                );
                // await timer(300).pipe(take(1)).toPromise(); 
              }
            }
          }
          console.log("this.width", this.width);
        });
        // this.poleValue = this.getPole();
        // await timer(200).pipe(take(1)).toPromise(); 
      }
      else {
        if (this.poleValue !== null && this.poleValue !== undefined) {
          if (this.poleValue?.printSize !== null && this.poleValue?.printSize !== undefined) {
            size = this.poleValue?.printSize;
          }
        }
        if (size === '57') {
          this.width = 7;
        }
        else {
          this.width = 10.5;
        }
        this.setBarcodeSize();
        if (this.poleValue?.printName?.length > 0) {
          if(this.printByPDF !== 'PDF')
          {
            if (this.OpenDrawer === "true" && this.poleValue?.printName) {
              this.commonService.OpenDrawer(this.poleValue?.printName, this.order.transId).subscribe((response: any) => {

              }, (error) => {

                this.alertify.error(error);
              }
              );
              // await timer(300).pipe(take(1)).toPromise(); 
            }
          }
        }
      }

      // this.order.lines.reduce((a, b) => (b.quantity) + a, 0);




      // this.widthItem = 
    }



    //  this.PrintPage();
    // console.log("this.storecurrency", this.storecurrency);
    // console.log("this.order", this.order);
    //  = .reduce((a,b) => b.discountAmt ?? 0 + a, 0);
  }
  tryGetdata = 0;
  // getPole() : SStoreClient
  // {
  //   // debugger;
  //   // console.log('this.order', this.order )
  //   // let poleSetup = localStorage.getItem("poleSetup");
  //   // let result = null;
  //   // if(poleSetup!==null && poleSetup!==undefined)
  //   // {
  //   //   result = JSON.parse(poleSetup);
  //   // }
  //   // if(result===null || result===undefined)
  //   // {


  //   //   console.log("get Pole 1")
  //   //   if(this.tryGetdata === 0)
  //   //   {
  //   //     this.tryGetdata = 1;

  //   //   }


  //   // }

  //   return result;
  // }
  // loadCounterInfor() : SStoreClient
  // {
  //    let localIp =  this.authService.getLocalIP();
  //    let currentCounter : SStoreClient;
  //     currentCounter = this.authService.getStoreClient();
  //    debugger;
  //    if(currentCounter!== null && currentCounter!==undefined )
  //    {

  //    }
  //    else
  //    {
  //       currentCounter = new SStoreClient();
  //       currentCounter.localIP = localIp;
  //       currentCounter.companyCode = this.authService.storeSelected().companyCode;
  //       currentCounter.storeId = this.authService.storeSelected().storeId;
  //       currentCounter.status= 'A';
  //       currentCounter.publicIP = "";
  //    }

  //    let poleSetting = this.getPole();
  //    if(poleSetting!==null && poleSetting!==undefined)
  //    {
  //       currentCounter.poleName = poleSetting.poleName;
  //       currentCounter.poleBaudRate = poleSetting.poleBaudRate;
  //       currentCounter.poleDataBits = poleSetting.poleDataBits;
  //       currentCounter.poleParity = poleSetting.poleParity;
  //       currentCounter.printSize = poleSetting.printSize;
  //       currentCounter.printName = poleSetting.printName;
  //    }

  //    return currentCounter;
  // }
  printerMarkerClicked() {
    // const popupWinindow = window.open();
    // window.print();
    // popupWinindow.document.close();
  }

  // PrintPage() {
  //   // console.log(this.myDivRef.nativeElement);
  //   window.print();
  // }

  exportAsPDF(divId) {
    let data = document.getElementById(divId);
    debugger;
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png')  // 'image/jpeg' for lower quality output.
      // let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
      let pdf = new jspdf('p', 'mm', 'a4'); //Generates PDF in portrait mode
      pdf.addImage(contentDataURL, 'PNG', 0, 0, 1000, 100);
      // doc.addImage(contentDataURL, 'PNG', 0, position, docWidth, docHeight);
      pdf.save('Filename.pdf');
    });
  }
  currency="";


  async LuckyPrint()
  {
      var data = this.pdfLuckyContainer.nativeElement.innerHTML;
 
      var versionUpdate = (new Date()).getTime();
      var myWindow = window.open('', 'my div', '');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/dev/bootstrap.min.css"/>');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/stylecustomer.css?v="'+ versionUpdate+'" type="text/css" />');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/print.css?v="'+ versionUpdate+'" type="text/css" />');
      myWindow.document.write('</head><body >');
      myWindow.document.write(data);
      myWindow.document.write('</body></html>');
      myWindow.document.close(); // necessary for IE >= 10
      var tempTitle = myWindow.document.title;
      let printTitle =  this.order?.transId + "_" + this.order?.luckyNo;
      myWindow.document.title =  printTitle;
      let timeDelay = 500;
      let printNum = 1;
      if (this.printLuckyDelay !== null && this.printLuckyDelay !== undefined && this.printLuckyDelay !== '') {
        timeDelay = parseInt(this.printLuckyDelay);
      }
      console.log('print Lucky Delay Time', timeDelay)
      setTimeout(() => {
          console.log("print 3");
          myWindow.focus();
          myWindow.print();
         
          myWindow.document.title = tempTitle;
          myWindow.close();
          if(this.printByPDF === 'PDF')
          {
            setTimeout(() => {
              this.commonService.PrintByPDF(this.order.companyCode, this.order.storeId, printTitle, this.poleValue?.printName, this.poleValue?.printSize, '').subscribe((response: any) => { 
                  if (response.success) {
      
                  }
                  else {
                    this.alertify.warning(response.message);
                  }
                
                }, (error) => {
      
                  this.alertify.error(error);
                }
              );
            }, 100);
          }
         
      }, timeDelay)
  }
  serialList = [];

  async HeaderVoucherPrint()
  {
      var data = this.pdfVoucherHeader.nativeElement.innerHTML;
 
      var versionUpdate = (new Date()).getTime();
      var myWindow = window.open('', 'my div', '');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/dev/bootstrap.min.css"/>');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/stylecustomer.css?v="'+ versionUpdate+'" type="text/css" />');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/print.css?v="'+ versionUpdate+'" type="text/css" />');
      myWindow.document.write('</head><body >');
      myWindow.document.write(data);
      myWindow.document.write('</body></html>');
      myWindow.document.close(); // necessary for IE >= 10
      var tempTitle = myWindow.document.title;
      let printTitle =  this.order?.transId + "_Header";
      myWindow.document.title =  printTitle;
      let timeDelay = 500;
      let printNum = 1;
      if (this.printHeaderDelay !== null && this.printHeaderDelay !== undefined && this.printHeaderDelay !== '') {
        timeDelay = parseInt(this.printHeaderDelay);
      }
      setTimeout(() => {
          console.log("print 3");
          myWindow.focus();
          myWindow.print();
          myWindow.document.title = tempTitle;
          myWindow.close();
          if(this.printByPDF === 'PDF')
          {
            setTimeout(() => {
              this.commonService.PrintByPDF(this.order.companyCode, this.order.storeId, printTitle, this.poleValue?.printName, this.poleValue?.printSize, '').subscribe((response: any) => { 
                  if (response.success) {
      
                  }
                  else {
                    this.alertify.warning(response.message);
                  }
                
                }, (error) => {
      
                  this.alertify.error(error);
                }
              );
            }, 100);
          }
          
         
      }, timeDelay)
  }
  numOfPrinted = 0;
  luckyPrintRequest = false;
  async PrintPage() {
    // console.log("PrintTemplate", this.PrintTemplate);
    // console.log(this.pdfContainer.nativeElement);
    // console.log("this.printByApp", this.printByApp);
    console.log('this.width setprint', this.width);
    console.log('this.barcodeWidth setprint cm', this.barcodeWidth);
    console.log('this.barcodeHeight setprint mm', this.barcodeHeight);

    if (this.printByApp === "true") {
      if (this.PrintTemplate === 'Template1') {
        var data = this.pdfContainer_1.nativeElement.innerHTML;
      } else if (this.PrintTemplate === 'Template2') {
        var data = this.pdfContainer_2.nativeElement.innerHTML;
      } else {
        var data = this.pdfContainer_1.nativeElement.innerHTML;
      }


      var versionUpdate = (new Date()).getTime();
      var myWindow = window.open('', 'my div', '');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/dev/bootstrap.min.css"/>');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/stylecustomer.css?v="'+ versionUpdate+'" type="text/css" />');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/print.css?v="'+ versionUpdate+'" type="text/css" />');
      myWindow.document.write('</head><body >');
      myWindow.document.write(data);
      myWindow.document.write('</body></html>');
      myWindow.document.close(); // necessary for IE >= 10
 
      // this.exportAsPDF("printDiv");

      // console.log(' myWindow.document',  myWindow.document.getElementsByClassName("center-wrap")[0].innerHTML);
      // this.billService.testPrint( myWindow.document.getElementsByClassName("center-wrap")[0].innerHTML, "test").subscribe((response: any) =>{

      // });
      setTimeout(() => {
        console.log("print 3");
        myWindow.focus();
        var tempTitle = myWindow.document.title;
        myWindow.document.title = this.order?.transId;
        let timeDelay = 100;
        let printNum = 1;
        if (this.printDelay !== null && this.printDelay !== undefined && this.printDelay !== '') {
          timeDelay = parseInt(this.printDelay);
        }
        if (this.printNum !== null && this.printNum !== undefined && this.printNum !== '') {
          printNum = parseInt(this.printNum);
        }
        console.log('this.numOfPrinted', this.numOfPrinted);
        console.log('this.printNum', printNum);
        setTimeout(async () => {
          if (this.offPrint === false) {
            myWindow.print();
            myWindow.document.title = tempTitle;
            myWindow.close(); 
            
          }
         
          //chuyển lên trên để lấy pole Value
          if (this.poleValue === null || this.poleValue === undefined) {
            console.log("Pole Null")

            let currenInfor = this.authService.storeSelected();
            let localIp = this.authService.getLocalIP();
            this.storeClient.getById(currenInfor.companyCode, currenInfor.storeId, '', localIp, '').subscribe((response: any) => {

              if (response.success) {
                this.poleValue = response.data;
              }
            });
            await timer(200).pipe(take(1)).toPromise();
          }
          if(this.printByPDF === 'PDF')
          {
            this.commonService.PrintByPDF(this.order.companyCode, this.order.storeId,  this.order.transId, this.poleValue?.printName, this.poleValue?.printSize, this.typeOrder).subscribe((response: any) => { 
                if (response.success) {
                  this.LuckyPrint();
                }
                else {
                  this.alertify.warning(response.message);
                }
                 
              }, (error) => {
    
                this.alertify.error(error);
              }
            );
          }
          else
          {
            let cut = false;
            let interval = setInterval(async () => {
              if (cut === false) {
                 //chổ chuyển  pole Value lên trên  
                if (this.poleValue?.printName?.length > 0) {
                  // if(this.OpenDrawer === "true" && this.poleValue?.printName )
                  // {
                  //   this.commonService.OpenDrawer(this.poleValue?.printName).subscribe((response: any)=>{
  
                  //   },  (error) => {
  
                  //       this.alertify.error(error);
                  //     }
                  //   ); 
                  //   await timer(300).pipe(take(1)).toPromise(); 
                  // }
  
                  this.commonService.PaperCut(true, this.poleValue?.printName).subscribe((response: any) => {
                  }, (error) => {
                    this.alertify.error(error);
                  }
                  );
                  cut = true;
                }
                else {
  
                  cut = true;
                }
              }
              if (cut === true) {
                clearInterval(interval);
                if(this.luckyPrintRequest)
                {
                  this.LuckyPrint();
                }
                if(this.voucherHeaderPrintRequest === true)
                {
                  this.HeaderVoucherPrint();
                }
                this.commonService.changePrinted(true);
                if (this.order.status === "Hold" || this.order.status === "H") {
                  window.location.reload();
                }
                if(this.order?.amountChange !== null  && this.order?.amountChange !== undefined  && this.order?.amountChange !== 0 )
                {
  
                }
                else
                {
                  let billCount = this.commonService.getCurrentBillCount();
                  if (billCount >= this.BillReload &&  this.BillReload!== 0) {
                    this.commonService.changeBillCount(0);
                    window.location.reload();
                  }
                }
               
              }
            }, 800);
          }
          debugger
          if(this.typeOrder === 'Receipt' && printNum > 1)
          {
            setTimeout(async () => {
          
              if(this.numOfPrinted < printNum )
              {
                for (this.numOfPrinted = 1; this.numOfPrinted < printNum; this.numOfPrinted++) {
                
                  let awaitTime  = this.numOfPrinted * 1000;
                  setTimeout(() => {
                    this.PrintPageCoppies();
                  }, awaitTime);
  
                  await timer(awaitTime).pipe(take(1)).toPromise();  
                  
                }
                if(this.numOfPrinted >= printNum)
                {
                  this.numOfPrinted = 0;
                }
              }
              
            }, timeDelay);
          }
        
          
        }, timeDelay);

      }, 400);
      this.router.navigate(['admin/masterdata/place-info'])
    }
    else {
      let size = "";
      if (this.width === 7) {
        size = "57";
      }
      else {
        size = "80";
      }
      if (this.poleValue === null || this.poleValue === undefined) {
        this.poleValue = this.authService.getPole();
        await timer(200).pipe(take(1)).toPromise();

      }

      if (this.poleValue?.printName?.length > 0) {
        // 'Receipt Re-print', caasi nafy o cho type Order
        this.billService.PrintReceipt(this.order.companyCode, this.order.storeId, this.order.transId, this.typeOrder, size, this.poleValue?.printName).subscribe((response: any) => {

          if (response.success) {

          }
          else {
            this.alertify.warning(response.message);
          }
          if (this.order.status === "Hold" || this.order.status === "H") {
            window.location.reload();
          }
          this.commonService.changePrinted(true);
          if(this.order?.amountChange !== null  && this.order?.amountChange !== undefined  && this.order?.amountChange !== 0 )
          {

          }
          else
          {
            let billCount = this.commonService.getCurrentBillCount();
            if (billCount >= this.BillReload &&  this.BillReload!== 0) {
              this.commonService.changeBillCount(0);
              window.location.reload();
            }
          }
          // let billCount = this.commonService.getCurrentBillCount();
          // if (billCount === this.BillReload &&  this.BillReload!== 0) {
          //   this.commonService.changeBillCount(0);
          //   window.location.reload();
          // }
        }, (error) => {

          this.alertify.error(error);
        }
        );
      }

    }


  }
   
  async PrintPageCoppies() {
    // console.log("PrintTemplate", this.PrintTemplate);
    // console.log(this.pdfContainer.nativeElement);
    // console.log("this.printByApp", this.printByApp);
    if (this.printByApp === "true") {
      if (this.PrintTemplate === 'Template1') {
        var data = this.pdfContainer_1.nativeElement.innerHTML;
      } else if (this.PrintTemplate === 'Template2') {
        var data = this.pdfContainer_2.nativeElement.innerHTML;
      } else {
        var data = this.pdfContainer_1.nativeElement.innerHTML;
      }


      var versionUpdate = (new Date()).getTime();
      var myWindow = window.open('', 'my div', '');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/dev/bootstrap.min.css"/>');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/stylecustomer.css?v="'+ versionUpdate+'" type="text/css" />');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/print.css?v="'+ versionUpdate+'" type="text/css" />');
      myWindow.document.write('</head><body >');
      myWindow.document.write(data);
      myWindow.document.write('</body></html>');
      myWindow.document.close(); // necessary for IE >= 10
 
      // this.exportAsPDF("printDiv");

      // console.log(' myWindow.document',  myWindow.document.getElementsByClassName("center-wrap")[0].innerHTML);
      // this.billService.testPrint( myWindow.document.getElementsByClassName("center-wrap")[0].innerHTML, "test").subscribe((response: any) =>{

      // });
      setTimeout(() => {
        console.log("print 3");
        myWindow.focus();
        var tempTitle = myWindow.document.title;
        myWindow.document.title = this.order?.transId;
        let timeDelay = 100;
        
        if (this.printDelay !== null && this.printDelay !== undefined && this.printDelay !== '') {
          timeDelay = parseInt(this.printDelay);
        }
       
        
        setTimeout(async () => {
          if (this.offPrint === false) {
            myWindow.print();
            myWindow.document.title = tempTitle;
            myWindow.close(); 
            
           
          }
 
         
        }, timeDelay);

      }, 400);


    }
    else {
      let size = "";
      if (this.width === 7) {
        size = "57";
      }
      else {
        size = "80";
      }
      if (this.poleValue === null || this.poleValue === undefined) {
        this.poleValue = this.authService.getPole();
        await timer(200).pipe(take(1)).toPromise();

      }

      if (this.poleValue?.printName?.length > 0) {
        // 'Receipt Re-print', caasi nafy o cho type Order
        this.billService.PrintReceipt(this.order.companyCode, this.order.storeId, this.order.transId, this.typeOrder, size, this.poleValue?.printName).subscribe((response: any) => {

          if (response.success) {

          }
          else {
            this.alertify.warning(response.message);
          }
          if (this.order.status === "Hold" || this.order.status === "H") {
            window.location.reload();
          }
          this.commonService.changePrinted(true);
          if(this.order?.amountChange !== null  && this.order?.amountChange !== undefined  && this.order?.amountChange !== 0 )
          {

          }
          else
          {
            let billCount = this.commonService.getCurrentBillCount();
            if (billCount >= this.BillReload &&  this.BillReload!== 0) {
              this.commonService.changeBillCount(0);
              window.location.reload();
            }
          }
         
        }, (error) => {

          this.alertify.error(error);
        }
        );
      }

    }


  }
  @HostListener("window:afterprint", [])
  onWindowAfterPrint() {
    console.log('... afterprint');
  }
  onWidthChanged = (e) => {
    this.width = e.item.value;
    // { value: 10.5, name: "80mm" },
    // { value: 7, name: "50mm" },
    debugger;
    this.setBarcodeSize();
    // if(this.width === 10.5)
    // {
    //   this.barcodeWidth = 1.5; //đơn vị tính cm
    //   this.barcodeHeight = 50; // đơn vị tính mm
    //   if( this.env?.printBarcodeWidth80mm?.length > 0)
    //   {
    //     this.barcodeWidth = parseFloat(this.env.printBarcodeWidth80mm);

    //   }
    //   if( this.env?.printBarcodeHeight80mm?.length > 0)
    //   {
    //     this.barcodeHeight = parseFloat(this.env.printBarcodeHeight80mm); 
    //   }
    // }
    // else
    // {
    //   this.barcodeWidth = 1.2;
    //   this.barcodeHeight = 50;
    //   if( this.env?.printBarcodeWidth50mm?.length > 0)
    //   {
    //     this.barcodeWidth = parseFloat(this.env.printBarcodeWidth50mm);

    //   }
    //   if( this.env?.printBarcodeHeight50mm?.length > 0)
    //   {
    //     this.barcodeHeight = parseFloat(this.env.printBarcodeHeight50mm); 
    //   }
    // }
    
    // console.log('this.width change', this.width);
    // console.log('this.barcodeWidth change cm', this.barcodeWidth);
    // console.log('this.barcodeHeight change mm', this.barcodeHeight);
  }
}
