import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { TPickupAmount } from 'src/app/_models/pickupamount';
import { SStoreClient } from 'src/app/_models/storeclient';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { PickupAmountService } from 'src/app/_services/data/pickupAmount.service';
import { StoreclientService } from 'src/app/_services/data/storeclient.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-management-pickup-print',
  templateUrl: './management-pickup-print.component.html',
  styleUrls: ['./management-pickup-print.component.css']
})
export class ManagementPickupPrintComponent implements OnInit {

 
  width: number;
  name: string;
  widthItem = [];
  widths = [
    // { value: 11, name: "80mm" },
    // { value: 26, name: "A4" },
    // 
    { value: 10.5, name: "80mm" },
    { value: 7, name: "50mm" },
    // { value: 26, name: "A4" },
  ];
 
  date = "";
  companyName: string = '';
  showItemSummary = "true";
  currentDate = new Date();

  constructor(public authService: AuthService,  private alertify: AlertifyService,   private storeClient: StoreclientService, 
    private pickupService: PickupAmountService, private activedRoute: ActivatedRoute, private commonService: CommonService,
     private companyService: CompanyService) {
    this.width = 10.5;
    this.name = '80mm'
  }
  pickupAmount = "false";
  @Input() pickupAmtList : TPickupAmount[]=[];
  loadGeneralSettingStore() {
    let result = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().storeId).find(x => x.settingId === 'EOSShowItemSummary');
    if (result !== null && result !== undefined) {
      this.showItemSummary = result.settingValue;
    }
    let pickupAmount =this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().storeId).find(x=>x.settingId==='PickupAmount');
    if(pickupAmount!==null && pickupAmount!==undefined)
    {
      this.pickupAmount = pickupAmount.settingValue;
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
        
      }
    }
  }
  payments = [];
  paymentShiftGroups = [];
  isNumeric(val: unknown): val is string | number {
    return (
      !isNaN(Number(Number.parseFloat(String(val)))) &&
      isFinite(Number(val))
    );
  }
  isValidDate(value) {
    var dateWrapper = new Date(value);
    return !isNaN(dateWrapper.getDate());
}
   counterId= "";
   shiftId= "";
   poleValue : SStoreClient;
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
  ngOnInit() {
    debugger;
    this.activedRoute.params.subscribe(data => {
      debugger;
      this.counterId = data['counterid'];
      this.shiftId = data['shiftid'];
    })
     
    this.loadGeneralSettingStore();
    this.GetData();
   
    this.poleValue =this.getPole(); 
    let size= "";
     if(this.poleValue?.printSize!==null && this.poleValue?.printSize!==undefined)
     {
       size = this.poleValue?.printSize;
     }
     if (size === '57') {
       this.width = 7;
     }
     else {
       this.width = 10.5;
     }
    
  }

  priceT = 0;
  fcAmountT = 0;
  quantityT = 0;
  lineTotalT = 0; 
  docBusiness: any;
  GetData() {
    this.pickupService.GetItems(this.authService.getCurrentInfor().companyCode, '','' , this.counterId, this.shiftId, '', '', '', '').subscribe((response: any) => {
      // loadItems
      debugger;
      if (response.success) {
        this.pickupAmtList = response.data;
        if(this.pickupAmtList!==null && this.pickupAmtList!==undefined && this.pickupAmtList?.length > 0)
        {
          this.docBusiness = this.pickupAmtList[0]?.createdOn;
          this.pickupAmtList = this.pickupAmtList.sort((a, b) => a.createdOn < b.createdOn ? -1 : 1 );
          this.pickTotal =  this.pickupAmtList.reduce((a,b) =>  b.amount + a, 0); 
          let stt=1;
          this.pickupAmtList.forEach(element => {
            element.collection = stt;
            stt++;
          });
        }
       
        // console.log('this.pickupAmtList', this.pickupAmtList);
      }
      else {
        this.alertify.warning(response.message);
      }
      // this.items = res;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
  //   let store = this.authService.storeSelected();
  //   this.enddateService.endDateSummary(store.companyCode, store.storeId, this.date).subscribe((response: any) => {

  //     if (response.data.payments.length > 0) {
  //       response.data.payments.forEach(element => {
  //         this.priceT += element.totalAmt === null ? 0 : element.totalAmt;
  //         this.fcAmountT += element.fcAmount;
  //         response.data.fcAmount = element.fcAmount === null ? 0 : element.fcAmount.toFixed(2)
  //         response.data.totalPrice = this.priceT;
  //         response.data.totalFCAmount = this.fcAmountT === null ? 0 : this.fcAmountT.toFixed(2);
  //       });
  //     }

  //     if (response.data.itemSumary.length > 0) {
  //       response.data.itemSumary.forEach(el => {
  //         this.quantityT += el.totalQty === null ? 0 : el.totalQty;
  //         this.lineTotalT += el.lineTotal === null ? 0 : el.lineTotal;
  //         response.data.totalQuantity = this.quantityT;
  //         response.data.totalLine = this.lineTotalT;
  //       });
  //     }

  //     this.header = response.data;
  //     console.log("end of day", this.header);

  //     if(this.header.payments?.length > 0)
  //     {
        
  //       var shiftPaymentGroups = this.header.payments.reduce(function (obj, item) {

  //         obj[item.shiftId] = obj[item.shiftId] || [];
  //         obj[item.shiftId].shiftId = item.shiftId;

  //         obj[item.shiftId].push({
  //             amount: item.amount,
  //             balance: item.balance,
  //             bankInAmt: item?.bankInAmt,
  //             bankInBalance: item?.bankInBalance,
  //             changeAmt: item.changeAmt,
  //             chargableAmount: item.chargableAmount,
  //             collectedAmount: item.collectedAmount,
  //             companyCode: item.companyCode,
  //             counterId: item?.counterId,
  //             createdBy: item.createdBy,
  //             currency: item.currency,
  //             endDateId:item.endDateId,
  //             eoD_Code: item?.eoD_Code,
  //             fcAmount: item.fcAmount,
  //             fcCollectedAmount: item?.fcCollectedAmount,
  //             fullName: item.fullName,
  //             id: item.id,
  //             lineId:item.lineId,
  //             openAmt: item.openAmt,
  //             paymentCode: item.paymentCode,
  //             paymentDiscount: item.paymentDiscount,
  //             shiftId: item.shiftId,
  //             shortName: item.shortName,
  //             status: item.status,
  //             storeId: item.storeId,
  //             totalAmt: item.totalAmt

  //         });

  //         return obj;
  //       }, {});
        
  //       let responseProps = Object.keys(shiftPaymentGroups);
        
  //       let cashierPaymentResponse = [];

  //       for (let prop of responseProps) {

  //         cashierPaymentResponse.push(shiftPaymentGroups[prop]);
  //       }

  //       this.paymentShiftGroups = cashierPaymentResponse.sort((a, b) => a.shiftId !== b.shiftId ? a.shiftId < b.shiftId ? -1 : 1 : 0);
  //       // this.paymentShiftGroups.forEach(element => { 
  //       //   element.totalAmt = element.reduce(
  //       //     (a, b) => b.totalAmt + a,
  //       //     0); 
  //       // });

  //       console.log('this.paymentsGroup', this.paymentShiftGroups);
  //     }
  //     this.loadPayment();
  //     if(this.pickupAmount === "true")
  //     {
  //       this.loadPickupAmountLst();
  //     }
      
    
  //   });

  //   this.companyService.getItem(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
  //     this.companyName = response.data.companyName;
  //     console.log("response", response);
  //   });
  // }
  pickTotal = 0;

  pickColection = [];
  // loadPickupAmountLst()
  // {
  //   debugger;
  //   this.pickupService.GetPickupAmountLst(this.authService.getCompanyInfor().companyCode, this.header.storeId, this.header.description, '').subscribe((response: any)=>{
  //     debugger;
  //     if(response.success)
  //     {
  //       this.pickupAmtList = response.data;

  //       if(this.pickupAmtList?.length > 0)
  //       {
  //         let firstRow = this.pickupAmtList[0];
  //         let totalPick = 0;
  //         if(firstRow?.customF1!==undefined && firstRow?.customF1!==null && firstRow?.customF1!== '' )
  //         {
            
  //           let pick = { collection: '1' , amount: firstRow?.customF1};
  //           this.pickColection.push(pick);
  //           totalPick+= parseFloat(pick?.amount);
  //         }
  //         if(firstRow?.customF2!==undefined && firstRow?.customF2!==null && firstRow?.customF2!== '' )
  //         {
  //           let pick = { collection: '2', amount: firstRow?.customF2};
  //           this.pickColection.push(pick);
  //           totalPick+= parseFloat(pick?.amount);
  //         }
  //         if(firstRow?.customF3!==undefined && firstRow?.customF3!==null && firstRow?.customF3!== '' )
  //         {
  //           let pick = { collection: '3' , amount: firstRow?.customF3};
  //           this.pickColection.push(pick);
  //           totalPick+= parseFloat(pick?.amount);
  //         }
  //         if(firstRow?.customF4!==undefined && firstRow?.customF4!==null && firstRow?.customF4!== '' )
  //         {
  //           let pick = { collection: '4' , amount: firstRow?.customF4};
  //           this.pickColection.push(pick);
  //           totalPick+= parseFloat(pick?.amount);
  //         }
  //         if(firstRow?.customF5!==undefined && firstRow?.customF5!==null && firstRow?.customF5!== '' )
  //         {
  //           let pick = { collection: '5' , amount: firstRow?.customF5};
  //           this.pickColection.push(pick);
  //           totalPick+= parseFloat(pick?.amount);
  //         }
  //         this.pickTotal = totalPick; 
  //       }
  //     }
  //     else
  //     {
  //       this.alertify.warning(response.message) ;
        
  //     }

  //   })
  // }

  // PrintPage() {
  //   window.print();
  // }

  onWidthChanged = (e) => {
    this.width = e.item.value;
    this.name = e.item.name
  }

  @ViewChild('mydiv') myDivRef: ElementRef;
  // @ViewChild('idName') idName: ElementRef;
  @ViewChild('pdfShift_1') pdfShift_1: ElementRef;
  printByPDF = "";  
  printByApp = "true";
  PrintPage() {
    var data = this.pdfShift_1.nativeElement.innerHTML;
    var versionUpdate = (new Date()).getTime();
    var myWindow = window.open('', 'my div', '');
    myWindow.document.write('<link rel="stylesheet" href="/assets/css/dev/bootstrap.min.css">');
    myWindow.document.write('<link rel="stylesheet" href="/assets/css/stylecustomer.css" type="text/css" />');
    myWindow.document.write('</head><body >');
    myWindow.document.write(data);
    myWindow.document.write('</body></html>');
    myWindow.document.close(); // necessary for IE >= 10

    // if (textExsit.length > 0) {
      // for (let i = 0; i < 2; i++)
      // {
        let titleGen =  uuidv4(); 
        var tempTitle = myWindow.document.title;
        myWindow.document.title = titleGen;
      setTimeout(async () => {
        console.log("print 3");
        myWindow.focus();
        myWindow.print();
        myWindow.document.title = tempTitle;
        myWindow.close(); 
      
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
          this.commonService.PrintByPDF(this.authService.getCurrentInfor().companyCode, "",  titleGen, this.poleValue?.printName, this.poleValue?.printSize, "").subscribe((response: any) => { 
              if (response.success) {
  
              }
              else {
                this.alertify.warning(response.message);
              }
               
            }, (error) => {
  
              this.alertify.error(error);
            }
          );
        }

      }, 500)

      // }


  }

}
