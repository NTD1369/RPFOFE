import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxPrinterService } from 'ngx-printer';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { TEndDate } from 'src/app/_models/enddate';
import { TPickupAmount } from 'src/app/_models/pickupamount';
import { MStore } from 'src/app/_models/store';
import { SStoreClient } from 'src/app/_models/storeclient';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { EnddateService } from 'src/app/_services/data/enddate.service';
import { PickupAmountService } from 'src/app/_services/data/pickupAmount.service';
import { StoreclientService } from 'src/app/_services/data/storeclient.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-management-endofdate-print',
  templateUrl: './management-endofdate-print.component.html',
  styleUrls: ['./management-endofdate-print.component.scss']
})
export class ManagementEndofdatePrintComponent implements OnInit {

  width: number;
  name: string;
  widthItem = [];
  widths = [
    // { value: 11, name: "80mm" },
    // { value: 26, name: "A4" },
    // 
    { value: 10.5, name: "80mm" },
    { value: 7.8, name: "50mm" },
    { value: 26, name: "A4" },
  ];
  header: TEndDate;
  date = "";
  companyName: string = '';
  showItemSummary = "true";
  currentDate = new Date();

  constructor(public authService: AuthService, private enddateService: EnddateService,   private reportService: ReportService,private storeClient: StoreclientService, private commonService: CommonService,
    private alertify: AlertifyService,  private pickupService: PickupAmountService, private activedRoute: ActivatedRoute, private companyService: CompanyService) {
    this.width = 10.5;
    this.name = '80mm'
  }
  pickupAmount = "false";
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
  salesDepartment = [];
  salesDepartmentGroup = [];
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
GetDateFormat(date) {
  var month = (date.getMonth() + 1).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
}
totalPOSNetSales= 0;
totalEcomNetSales= 0;
totalNetSales= 0;
loadSalesDepartment() {
  // this.header.description
  let now = this.GetDateFormat( new Date());
  debugger;
  this.enddateService.EndDateSummaryByDepartment(this.header.companyCode, this.header.storeId, this.authService.getCurrentInfor().username, this.date, this.date, this.header.description).subscribe((response: any) => {
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
  loadPayment() {
    this.enddateService.SummaryPaymentPrint(this.header.companyCode, this.header.storeId, this.header.description).subscribe((response: any) => {
      if(response.success)
      {
        console.log('Payment details', response.data);
        this.payments = response.data;
      }
      else
      {
        Swal.fire('Summary Payment', response.message, 'warning'); 
      }
    


    });
  }
  ngOnInit() {
    this.activedRoute.params.subscribe(data => {
      this.date = data['id'];
    })
    this.getPole();
    this.loadGeneralSettingStore();
    this.GetData();
    

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

      if(this.header.payments?.length > 0)
      {
        
        var shiftPaymentGroups = this.header.payments.reduce(function (obj, item) {

          obj[item.shiftId] = obj[item.shiftId] || [];
          obj[item.shiftId].shiftId = item.shiftId;

          obj[item.shiftId].push({
              amount: item.amount,
              balance: item.balance,
              bankInAmt: item?.bankInAmt,
              bankInBalance: item?.bankInBalance,
              changeAmt: item.changeAmt,
              chargableAmount: item.chargableAmount,
              collectedAmount: item.collectedAmount,
              companyCode: item.companyCode,
              counterId: item?.counterId,
              createdBy: item.createdBy,
              currency: item.currency,
              endDateId:item.endDateId,
              eoD_Code: item?.eoD_Code,
              fcAmount: item.fcAmount,
              fcCollectedAmount: item?.fcCollectedAmount,
              fullName: item.fullName,
              id: item.id,
              lineId:item.lineId,
              openAmt: item.openAmt,
              paymentCode: item.paymentCode,
              paymentDiscount: item.paymentDiscount,
              shiftId: item.shiftId,
              shortName: item.shortName,
              status: item.status,
              storeId: item.storeId,
              totalAmt: item.totalAmt

          });

          return obj;
        }, {});
        
        let responseProps = Object.keys(shiftPaymentGroups);
        
        let cashierPaymentResponse = [];

        for (let prop of responseProps) {

          cashierPaymentResponse.push(shiftPaymentGroups[prop]);
        }

        this.paymentShiftGroups = cashierPaymentResponse.sort((a, b) => a.shiftId !== b.shiftId ? a.shiftId < b.shiftId ? -1 : 1 : 0);
        // this.paymentShiftGroups.forEach(element => { 
        //   element.totalAmt = element.reduce(
        //     (a, b) => b.totalAmt + a,
        //     0); 
        // });

        console.log('this.paymentsGroup', this.paymentShiftGroups);
      }
      this.loadPayment();
    //     showSalesDepartment = "None"; //None , Normal, Group
    // showSalesDepartmentGroup = "Group"; // All - Show cả detail, GroupHeader - Chỉ show header group
      if(this.showSalesDepartment!=="None")
      {
        this.loadSalesDepartment();
      } 
      if(this.pickupAmount === "true")
      {
        this.loadPickupAmountLst();
        
      }
      
    
    });

    this.companyService.getItem(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      this.companyName = response.data.companyName;
      console.log("response", response);
    });
  }
  pickTotal = 0;
  pickupAmtList : TPickupAmount[]=[];
  pickColection = [];
  loadPickupAmountLst()
  {
    debugger;
    this.pickupService.GetPickupAmountLst(this.authService.getCompanyInfor().companyCode, this.header.storeId, this.header.description, '').subscribe((response: any)=>{
      debugger;
      if(response.success)
      {
        this.pickupAmtList = response.data;

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
    var data = this.pdfShift_1.nativeElement.innerHTML;
    var versionUpdate = (new Date()).getTime();
    var myWindow = window.open('', 'my div', '');
    // myWindow.document.write('<link rel="stylesheet" href="/assets/css/dev/bootstrap.min.css">');
    // myWindow.document.write('<link rel="stylesheet" href="/assets/css/stylecustomer.css" type="text/css" />');
    myWindow.document.write('<link rel="stylesheet" href="/assets/css/dev/bootstrap.min.css"/>');
    myWindow.document.write('<link rel="stylesheet" href="/assets/css/stylecustomer.css?v="'+ versionUpdate+'" type="text/css" />');
    myWindow.document.write('<link rel="stylesheet" href="/assets/css/print.css" type="text/css" />');
    myWindow.document.write('<link rel="stylesheet" href="/assets/css/printtable.css?v="'+ versionUpdate+'" type="text/css" />');
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

      }, 1000)

      // }


  }
}
