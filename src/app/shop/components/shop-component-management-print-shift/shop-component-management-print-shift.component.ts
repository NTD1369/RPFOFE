import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { TPickupAmount } from 'src/app/_models/pickupamount';
import { SStoreClient } from 'src/app/_models/storeclient';
import { ShiftVM } from 'src/app/_models/viewmodel/shiftViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { EnddateService } from 'src/app/_services/data/enddate.service';
import { PickupAmountService } from 'src/app/_services/data/pickupAmount.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { StoreclientService } from 'src/app/_services/data/storeclient.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-shop-component-management-print-shift',
  templateUrl: './shop-component-management-print-shift.component.html',
  styleUrls: ['./shop-component-management-print-shift.component.scss']
})
export class ShopComponentManagementPrintShiftComponent implements OnInit {

  constructor(public authService: AuthService, private shiftService: ShiftService, private route: Router, private pickupService: PickupAmountService,
    private alertify: AlertifyService, private commonService: CommonService, private storeClient: StoreclientService,  
    private activedRoute: ActivatedRoute, private companyService: CompanyService) {
    this.width = 10.5;
  }

  shiftId = "";
  header: ShiftVM;
  companyName: string = '';
  PrintTemplate = "Template1";

  pickupAmount = "false";
  showItemSummary = "true";
  printByPDF = "";  
  printByApp = "true";
  poleDisplay;

  ngOnInit() {
    this.loadGeneralSettingStore();
    this.activedRoute.params.subscribe(data => {
      this.shiftId = data['id'];
    })
    this.poleValue =this.getPole();
    debugger;
    if((this.width  ===null || this.width===undefined ) )
    {
      //  this.autoPrint = true;
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
    this.GetData();
   

  
    // this.shift = this.shift;
  }
  
  groupByCashier = "false";
  showSalesDepartment = "None"; //None , Normal, Group
  showSalesDepartmentGroup = "Group"; // All - Show cả detail, GroupHeader - Chỉ show header group
  loadGeneralSettingStore() {
    let result = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().storeId).find(x => x.settingId === 'EOSShowItemSummary');
    if (result !== null && result !== undefined) {
      this.showItemSummary = result.settingValue;
    }
    let salesDepartment = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().storeId).find(x => x.settingId === 'EOSShowSalesDepartment');
    if (salesDepartment !== null && salesDepartment !== undefined) {
      this.showSalesDepartment = salesDepartment.settingValue;
      if(salesDepartment?.customField1?.length > 0)
      {
        this.showSalesDepartmentGroup = salesDepartment?.customField1;
      }
    }
  
    let PrintTemplate = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'PrintTemplate');
    if (PrintTemplate !== null && PrintTemplate !== undefined) {
      this.PrintTemplate = PrintTemplate.settingValue;
    }
    let groupByCashier =this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().storeId).find(x=>x.settingId==='EOSGroupByCashier');
    if(groupByCashier!==null && groupByCashier!==undefined)
    {
      this.groupByCashier = groupByCashier.settingValue;
      
    }
    let pickupAmount =this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().storeId).find(x=>x.settingId==='PickupAmount');
    if(pickupAmount!==null && pickupAmount!==undefined)
    {
      this.pickupAmount = pickupAmount.settingValue;
    }
  }
  priceT = 0;
  quantityT = 0;
  lineTotalT = 0;
  fcAmountT = 0;
  collectedT = 0;
  onWidthChanged = (e) => {
    this.width = e.item.value;
  }
 
  pickColection = [];
  pickTotal = 0;
  pickupAmtList : TPickupAmount[]=[];
  loadPickupAmountLst()
  {
    this.pickupService.GetPickupAmountLst(this.authService.getCompanyInfor().companyCode, this.header.storeId, this.header.dailyId, this.header.shiftId).subscribe((response: any)=>{
      if(response.success)
      {
        debugger;
        this.pickupAmtList = response.data;
        console.log('pickupAmtList', this.pickupAmtList );
        if(this.pickupAmtList?.length > 0)
        {
          let firstRow = this.pickupAmtList[0];
          let totalPick = 0;
          if(firstRow?.customF1!==undefined && firstRow?.customF1!==null && firstRow?.customF1!== '' )
          {
            
            let pick = { collection: '1' , amount: firstRow?.customF1};
            this.pickColection.push(pick);
            totalPick+= parseFloat(pick?.amount);
          }
          if(firstRow?.customF2!==undefined && firstRow?.customF2!==null && firstRow?.customF2!== '' )
          {
            let pick = { collection: '2', amount: firstRow?.customF2};
            this.pickColection.push(pick);
            totalPick+= parseFloat(pick?.amount);
          }
          if(firstRow?.customF3!==undefined && firstRow?.customF3!==null && firstRow?.customF3!== '' )
          {
            let pick = { collection: '3' , amount: firstRow?.customF3};
            this.pickColection.push(pick);
            totalPick+= parseFloat(pick?.amount);
          }
          if(firstRow?.customF4!==undefined && firstRow?.customF4!==null && firstRow?.customF4!== '' )
          {
            let pick = { collection: '4' , amount: firstRow?.customF4};
            this.pickColection.push(pick);
            totalPick+= parseFloat(pick?.amount);
          }
          if(firstRow?.customF5!==undefined && firstRow?.customF5!==null && firstRow?.customF5!== '' )
          {
            let pick = { collection: '5' , amount: firstRow?.customF5};
            this.pickColection.push(pick);
            totalPick+= parseFloat(pick?.amount);
          }
          this.pickTotal = totalPick; 
        }
      }
      else
      {
        this.alertify.warning(response.message) ;
        
      }

    })
  }

  totalPOSNetSales= 0;
totalEcomNetSales= 0;
totalNetSales= 0;
GetDateFormat(date) {
  var month = (date.getMonth() + 1).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
}
loadSalesDepartment() {
  // this.header.description
  let now = this.GetDateFormat(new Date(this.header.createdOn) );
  debugger;
    
  this.shiftService.ShiftSummaryByDepartment(this.header.companyCode, this.header.storeId, this.authService.getCurrentInfor().username, now, now, this.header.dailyId, this.header.shiftId).subscribe((response: any) => {
    if(response.success)
    {
      console.log('Payment details', response.data);
      this.salesDepartment = response.data;
      // debugger;
      if(this.salesDepartment!==null && this.salesDepartment?.length>0)
      {
        this.totalPOSNetSales= this.salesDepartment.reduce(
              (a, b) => b.NetSalesAmount + a,
              0); 
              this.totalEcomNetSales= this.salesDepartment.reduce(
                (a, b) => b.EcomNetSalesAmount + a,
                0); 
              this.totalNetSales= this.salesDepartment.reduce(
                (a, b) => b.TotalNetSalesAmount + a,
                0); 
        
          if(this.showSalesDepartmentGroup === 'All')
          {
              // Group lại
              var salesDepatmentGroups = response.data.reduce(function (obj, item) {
              
                obj[item.SaleCategoryID] = obj[item.SaleCategoryID] || [];
                obj[item.SaleCategoryID].SaleCategoryID = item.SaleCategoryID;
                obj[item.SaleCategoryID].SaleCategoryName = item.SaleCategoryName; 
                obj[item.SaleCategoryID].Department = item.SaleCategoryName; 
                
                obj[item.SaleCategoryID].QuantitySold =  obj[item.SaleCategoryID].QuantitySold??0 + item.QuantitySold??0;
                obj[item.SaleCategoryID].TotalDiscount =  obj[item.SaleCategoryID].TotalDiscount??0 + item.TotalDiscount??0;
                obj[item.SaleCategoryID].NetSalesAmount =  obj[item.SaleCategoryID].NetSalesAmount??0 + item.NetSalesAmount??0; 
                obj[item.SaleCategoryID].EcomNetSalesAmount =  obj[item.SaleCategoryID].EcomNetSalesAmount??0 + item.EcomNetSalesAmount??0;
                obj[item.SaleCategoryID].TotalNetSalesAmount =  obj[item.SaleCategoryID].EcomNetSalesAmount??0 + obj[item.SaleCategoryID].NetSalesAmount??0;
                if(obj[item.SaleCategoryID].lines?.length > 0)
                {

                }
                else
                {
                  obj[item.SaleCategoryID].lines = [];
                } 
                obj[item.SaleCategoryID].lines.push(item);

                return obj;
              }, {});
              // debugger
              let responseProps = Object.keys(salesDepatmentGroups);
              
              let departmentPaymentResponse = [];

              for (let prop of responseProps) {

                departmentPaymentResponse.push(salesDepatmentGroups[prop]);
              }

              this.salesDepartmentGroup = departmentPaymentResponse.sort((a, b) => a.SaleCategoryID !== b.SaleCategoryID ? a.SaleCategoryID < b.SaleCategoryID ? -1 : 1 : 0);
            
              if(this.salesDepartmentGroup!==null && this.salesDepartmentGroup!==undefined && this.salesDepartmentGroup?.length > 0)
              {
                for (let index = 0; index < this.salesDepartmentGroup.length; index++) {
                  const element = this.salesDepartmentGroup[index];
                  if(element.lines?.length > 0)
                  {
                    element.NetSalesAmount = element.lines.reduce( (a, b) => ((b.NetSalesAmount??0) + a), 0); 
                    element.EcomNetSalesAmount = element.lines.reduce( (a, b) => ((b.EcomNetSalesAmount??0) + a), 0);
                  }
                  else
                  {
                    element.NetSalesAmount  = 0;
                    element.EcomNetSalesAmount  = 0;
                    
                  }
                  element.TotalNetSalesAmount  = element.NetSalesAmount +  element.EcomNetSalesAmount;

                  console.log('element' + index, element);
                }
                // this.salesDepartmentGroup.forEach(element => { 
                //   debugger;
                //   element.NetSalesAmount = element.reduce( (a, b) => (b.NetSalesAmount??0 + a), 0); 
                //   element.EcomNetSalesAmount = element.reduce( (a, b) => (b.EcomNetSalesAmount??0 + a), 0); 
                //   element.TotalNetSalesAmount = element.reduce( (a, b) => (b.TotalNetSalesAmount??0 + a), 0); 
                  
                // });
        
              }
          }
       
         
        
         

      }

    
    }
    else
    {
      Swal.fire('Summary Payment', response.message, 'warning'); 
    }
  


  });
}
salesDepartment = [];
salesDepartmentGroup = [];
  GetData() {
    let store = this.authService.storeSelected();
    this.shiftService.GetEndShiftSummary(store.companyCode, store.storeId, this.shiftId).subscribe((response: any) => {
      if (response.data.payments.length > 0) {
        response.data.payments.forEach(element => {
          this.priceT += element.totalAmt === null ? 0 : element.totalAmt;
          this.fcAmountT += element.fcAmount;
          this.collectedT += element.collectedAmount;
          response.data.totalPrice = this.priceT;
          response.data.totalFCAmount = this.fcAmountT;
          response.data.totalCollected = this.collectedT;
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

      this.companyService.getItem(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
        this.companyName = response.data.companyName;

      });

      // console.log("totalFCAmount", response.data.totalFCAmount);
      this.header = response.data;
      console.log("shift", this.header);

      if(this.showSalesDepartment!=="None")
      {
        this.loadSalesDepartment();
      } 


     if(this.groupByCashier === "true")
     {
        var cashierPaymentGroups = this.header.payments.reduce(function (obj, item) {

                obj[item.cashier] = obj[item.cashier] || [];
                obj[item.cashier].cashier = item.cashier;

                obj[item.cashier].push({
                  
                  paymentCode: item.paymentCode,
                  currency: item.currency,
                  shortName: item.shortName,
                  counterId: item.counterId,
                  totalAmt: item.totalAmt,
                  eodApply: item.eodApply,
                  collectedAmount: item.collectedAmount,
                  chargableAmount: item.chargableAmount,
                  changeAmt: item.changeAmt,
                  isLock: item.isLock,
                  bankInAmt: item.bankInAmt,
                  bankInBalance: item.bankInBalance,
                  createdBy: item.createdBy,
                  cashier: item.cashier,
                  customF1: item.customF1,
                  customF2: item.customF2,
                  customF3: item.customF3,
                  customF4: item.customF4,
                  customF5: item.customF5,

                });

                return obj;
              }, {});
              
              let responseProps = Object.keys(cashierPaymentGroups);
              
              let cashierPaymentResponse = [];
        
              for (let prop of responseProps) {

                cashierPaymentResponse.push(cashierPaymentGroups[prop]);
              }
        
              this.paymentsGroup = cashierPaymentResponse.sort((a, b) => a.cashier !== b.cashier ? a.cashier < b.cashier ? -1 : 1 : 0);
              this.paymentsGroup.forEach(element => { 
                element.totalAmt = element.reduce(
                  (a, b) => b.totalAmt + a,
                  0); 
              });

              console.log('this.paymentsGroup', this.paymentsGroup);
     }
     else
     {
      var groups = this.header.payments.reduce(function (obj, item) {

        obj[item.currency] = obj[item.currency] || [];
        obj[item.currency].currency = item.currency;

        obj[item.currency].push({
          totalAmt: item.totalAmt,
        });

        return obj;
      }, {});
      // Step 1. Get all the object keys.
      let evilResponseProps = Object.keys(groups);
      // Step 2. Create an empty array.
      let goodResponse = [];

      // Step 3. Iterate throw all keys.
      for (let prop of evilResponseProps) {

        goodResponse.push(groups[prop]);
      }

      // users.sort((a, b) => a.firstname !== b.firstname ? a.firstname < b.firstname ? -1 : 1 : 0);
      debugger;
      this.currencyGroup = goodResponse.sort((a, b) => a.currency !== b.currency ? a.currency < b.currency ? -1 : 1 : 0);
      this.currencyGroup.forEach(element => {
        // element.
        debugger;
        element.totalAmt = element.reduce(
          (a, b) => b.totalAmt + a,
          0);// subtotal + ship;
      });
     }
      
     if(this.header.itemInventorySumary !== null && this.header.itemInventorySumary !== undefined &&  this.header.itemInventorySumary?.length > 0 )
     {
      
        var cashierPaymentGroups = this.header.itemInventorySumary.reduce(function (obj, item) {

          obj[item.type] = obj[item.type] || [];
          obj[item.type].type = item.type;

          obj[item.type].push({
            
            type: item.type,
            itemCode: item.itemCode,
            description: item.description,
            totalQty: item.totalQty,
            uomCode: item.uomCode

          });

          return obj;
        }, {});
        debugger;
        let responseProps = Object.keys(cashierPaymentGroups);
        
        let cashierPaymentResponse = [];

        for (let prop of responseProps) {

          cashierPaymentResponse.push(cashierPaymentGroups[prop]);
        }

        this.itemInventorySumaryGroup = cashierPaymentResponse.sort((a, b) => a.type !== b.type ? a.type < b.type ? -1 : 1 : 0);
        // this.paymentsGroup.forEach(element => { 
        //   element.totalAmt = element.reduce(
        //     (a, b) => b.totalAmt + a,
        //     0); 
        // });

     }


     if(this.pickupAmount === "true")
     {
       this.loadPickupAmountLst();
     }
     
      // var cashierPaymentGroups = this.header.cashierPayments.reduce(function (obj, item) {

      //   obj[item.createdBy] = obj[item.createdBy] || [];
      //   obj[item.createdBy].createdBy = item.createdBy;

      //   obj[item.createdBy].push({
          
      //     paymentCode: paymentCode
      //     currency: currency;
      //     counterId: counterId;
      //     totalAmt: totalAmt;
      //     eodApply: eodApply;
      //     collectedAmount: collectedAmount;
      //     chargableAmount: chargableAmount;
      //     changeAmt: changeAmt;
      //     isLock: isLock;
      //     bankInAmt: bankInAmt;
      //     bankInBalance: bankInBalance;
      //     createdBy: createdBy;
      //   });

      //   return obj;
      // }, {});
       
      // let responseProps = Object.keys(cashierPaymentGroups);
      
      // let cashierPaymentResponse = [];
 
      // for (let prop of responseProps) {

      //   cashierPaymentResponse.push(cashierPaymentGroups[prop]);
      // }
 
      // this.paymentsGroup = cashierPaymentResponse.sort((a, b) => a.createdBy !== b.createdBy ? a.createdBy < b.createdBy ? -1 : 1 : 0);
      // this.paymentsGroup.forEach(element => { 
      //   element.totalAmt = element.reduce(
      //     (a, b) => b.totalAmt + a,
      //     0); 
      // });
      // console.log('this.currencyGroup', this.currencyGroup);

    });
    // totalAmt: number | null;
    // collectedAmount: number | null;
    // chargableAmount: number | null;
    // changeAmt: number | null;
  }
  currencyGroup: any = [];
  paymentsGroup: any = [];
  itemInventorySumaryGroup: any = [];
  // PrintPage() {


  //   window.print();
  // }
  width: number;
  widthItem = [];
  widths = [
    { value: 10.5, name: "80mm" },
    { value: 7, name: "50mm" },
  ];
  @ViewChild('mydiv') myDivRef: ElementRef;
  // @ViewChild('idName') idName: ElementRef;
  @ViewChild('pdfShift_1') pdfShift_1: ElementRef;
  @ViewChild('pdfShift_2') pdfShift_2: ElementRef;
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
  PrintPage() {

    console.log("PrintTemplate", this.PrintTemplate);
    console.log("this.pdfShift_2", this.pdfShift_2);
    if (this.PrintTemplate === 'Template1') {
      var data = this.pdfShift_1.nativeElement.innerHTML;
    } else if (this.PrintTemplate === 'Template2') {
      var data = this.pdfShift_2.nativeElement.innerHTML;
    } else {
      var data = this.pdfShift_1.nativeElement.innerHTML;
    }

    // console.log(this.pdfContainer.nativeElement);
    // const textExsit = this.idName.nativeElement.innerHTML;
    var versionUpdate = (new Date()).getTime();
    var myWindow = window.open('', 'my div', '');
    // myWindow.document.write('<link rel="stylesheet" href="/assets/css/dev/bootstrap.min.css">');
    // myWindow.document.write('<link rel="stylesheet" href="/assets/css/stylecustomer.css" type="text/css" />');
    myWindow.document.write('<link rel="stylesheet" href="/assets/css/dev/bootstrap.min.css"/>');
    myWindow.document.write('<link rel="stylesheet" href="/assets/css/stylecustomer.css?v="'+ versionUpdate+'" type="text/css" />');
    myWindow.document.write('<link rel="stylesheet" href="/assets/css/print.css" type="text/css" />');
    myWindow.document.write('</head><body >');
    myWindow.document.write(data);
    myWindow.document.write('</body></html>');
    myWindow.document.close(); // necessary for IE >= 10

    var tempTitle = myWindow.document.title;
    myWindow.document.title = uuidv4(); 
  
    // if (textExsit.length > 0) {
      // for (let i = 0; i < 2; i++)
      // {
      setTimeout(async () => {
        console.log("print 3");
        myWindow.focus();
        myWindow.print();
        myWindow.document.title = tempTitle;
        myWindow.close();
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
          this.commonService.PrintByPDF(this.authService.getCurrentInfor().companyCode, "",  tempTitle, this.poleValue?.printName, this.poleValue?.printSize, "").subscribe((response: any) => { 
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

      }, 1000)

      // }

    // }
    // else{
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Print bill',
    //     text: "Can't get data of order. Please manual print"
    //   }).then(() => {
    //     this.route.navigate(["shop/bills/print", this.order.transId, this.order.companyCode, this.order.storeId]).then(() => {
    //       window.location.reload();
    //     }); 
    //   });
    // }


  }
}
