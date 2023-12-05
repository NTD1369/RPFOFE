import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { parseNumber } from 'devextreme/localization';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { TPickupAmount } from 'src/app/_models/pickupamount';
import { SStoreClient } from 'src/app/_models/storeclient';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { PickupAmountService } from 'src/app/_services/data/pickupAmount.service';
import { StoreclientService } from 'src/app/_services/data/storeclient.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-management-pickup-print-template',
  templateUrl: './management-pickup-print-template.component.html',
  styleUrls: ['./management-pickup-print-template.component.scss']
})
export class ManagementPickupPrintTemplateComponent implements OnInit {

  constructor(public authService: AuthService, private commonService: CommonService, private storeClient: StoreclientService,  private pickupService: PickupAmountService, private alertify: AlertifyService) { }


  @Input() pickAmount: TPickupAmount; 
  @Input() width;
  pickupAmount = "false";
  showItemSummary = "true";
  printByPDF = "";  
  printByApp = "true";
  poleDisplay;
  // ignorePoleDisplay = true;
  @Input() pickupAmtList : TPickupAmount[]=[];
  loadGeneralSettingStore() {
    // let result = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().storeId).find(x => x.settingId === 'EOSShowItemSummary');
    // if (result !== null && result !== undefined) {
    //   this.showItemSummary = result.settingValue;
    // }
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
  autoPrint = false;
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      if(this.autoPrint)
      {
        this.PrintPage();
      }
    }, 50);
   
  
  }
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
  poleValue : SStoreClient;
 ngOnInit() {
   debugger;
  console.log('this.pickAmount', this.pickAmount);
   this.loadGeneralSettingStore();
  //  this.GetData();
  this.poleValue =this.getPole();
   debugger;
   if((this.width  ===null || this.width===undefined || this.width==='') )
   {
    this.autoPrint = true;
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
    // else
    // {
    //   pole.printSize = "10.5";
    // }
    // this.width =size;
    
   }
  
 }
 @ViewChild('mydiv') myDivRef: ElementRef;
 @ViewChild('idName') idName: ElementRef;
 @ViewChild('pdfContainer_1') pdfContainer_1: ElementRef;
 @ViewChild('pdfContainer_2') pdfContainer_2: ElementRef;
 async PrintPage() {

  debugger;
  var data = this.pdfContainer_1.nativeElement.innerHTML;
  var versionUpdate = (new Date()).getTime();
  var myWindow = window.open('', 'my div', '');
  myWindow.document.write('<link rel="stylesheet" href="/assets/css/dev/bootstrap.min.css"/>');
  myWindow.document.write('<link rel="stylesheet" href="/assets/css/stylecustomer.css?v="'+ versionUpdate+'" type="text/css" />');
  myWindow.document.write('<link rel="stylesheet" href="/assets/css/print.css" type="text/css" />');
  myWindow.document.write('</head><body >');
  myWindow.document.write(data);
  myWindow.document.write('</body></html>');
  myWindow.document.close(); // necessary for IE >= 10
  // this.exportAsPDF("printDiv");

  // console.log(' myWindow.document',  myWindow.document.getElementsByClassName("center-wrap")[0].innerHTML);
  // this.billService.testPrint( myWindow.document.getElementsByClassName("center-wrap")[0].innerHTML, "test").subscribe((response: any) =>{

  // });
  let titleGen =  uuidv4(); 
  var tempTitle = myWindow.document.title;
  myWindow.document.title = titleGen; 

  setTimeout(async () => {
    console.log("print 3");
    myWindow.focus();
    myWindow.print();
    myWindow.document.title = tempTitle;
    myWindow.close();

    let timeDelay = 100;
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
      this.commonService.PrintByPDF(this.authService.getCurrentInfor().companyCode, "",  titleGen, this.poleValue?.printName, this.poleValue?.printSize, "pickup").subscribe((response: any) => { 
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
    // if (this.printDelay !== null && this.printDelay !== undefined && this.printDelay !== '') {
    //   timeDelay = parseInt(this.printDelay);
    // }
   
  
  }, 400);


}
 pickTotal = 0;
//  GetData() {
//   this.pickupService.GetItems(this.authService.getCurrentInfor().companyCode, '','' , this.counterId, this.shiftId, '', '', '', '').subscribe((response: any) => {
//     // loadItems
//     debugger;
//     if (response.success) {
//       this.pickupAmtList = response.data;
//       if(this.pickupAmtList!==null && this.pickupAmtList!==undefined && this.pickupAmtList?.length > 0)
//       {
//         this.pickTotal =  this.pickupAmtList.reduce((a,b) =>  b.amount + a, 0); 
//         let stt=1;
//         this.pickupAmtList.forEach(element => {
//           element.collection = stt;
//           stt++;
//         });
//       }
     
//       // console.log('this.pickupAmtList', this.pickupAmtList);
//     }
//     else {
//       this.alertify.warning(response.message);
//     }
   
//   }, error => {
//     this.alertify.error(error);
//   });
// }
}
