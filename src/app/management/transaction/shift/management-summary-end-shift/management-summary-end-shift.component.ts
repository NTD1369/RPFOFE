import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TPickupAmount } from 'src/app/_models/pickupamount';
import { ShiftVM } from 'src/app/_models/viewmodel/shiftViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { PickupAmountService } from 'src/app/_services/data/pickupAmount.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import saveAs from 'file-saver';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { ExcuteFunctionService } from 'src/app/_services/common/excuteFunction.service';
@Component({
  selector: 'app-management-summary-end-shift',
  templateUrl: './management-summary-end-shift.component.html',
  styleUrls: ['./management-summary-end-shift.component.scss']
})
export class ManagementSummaryEndShiftComponent implements OnInit {

 
 showOption="false";
  // list: TShiftLine[];
  header: ShiftVM;
  shiftId="";
  // shift: TShiftLine;
  constructor(public authService: AuthService,private shiftService: ShiftService, private pickupService: PickupAmountService, private excuteFunction: ExcuteFunctionService,
     private activedRoute: ActivatedRoute, private alertify: AlertifyService, private route: Router) { this.customizeText= this.customizeText.bind(this);}
  // transTotalQty: number;
  // transTotalAmt: number;
  // completedTotalQty: number;
  // completedTotalAmt: number;
  // canceledTotalQty: number;
  // canceledTotalAmt: number;
  // itemInventorySumary: EndShiftItemSumary[]; 
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  onExporting(e, name) {
    const workbook = new Workbook();    
    const worksheet = workbook.addWorksheet('Main sheet');
    let nameOfRpt= name ;
    var d = new Date();
    let dateFm = this.GetDateFormat(d);
  
    nameOfRpt = nameOfRpt + '_' + dateFm.replace(/\-/gi,'') + '_' + this.authService.getCurrentInfor().username;
    exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        customizeCell: function(options) {
          debugger;
            // const excelCell = options;
            const { gridCell, excelCell } = options;

            if(gridCell.rowType === 'data') {
              // debugger;
              //   excelCell.font = { color: { argb: 'FF0000FF' }, underline: true };
              //   excelCell.alignment = { horizontal: 'left' };
            }
        } 
    }).then(function() {
        workbook.xlsx.writeBuffer()
            .then(function(buffer: BlobPart) {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), nameOfRpt + '.xlsx');
            });
    });
    e.cancel = true; 
  }
customizeText (e) {
  debugger;
  if(this.showOption==="true"  )
  {
    if( e.value!==null &&  e.value!== undefined)
    {
      return this.authService.formatCurrentcy( e.value);
    }
    return 0;
  }
  else
  {
     return '***';
  }
};
enableBankin= "false";
groupByCashier = "false";
openDrawer ='false';
loadGeneralSettingStore()
{
  let result =this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().storeId).find(x=>x.settingId==='DisplayAmountBeforeEndShift');
  if(result!==null && result!==undefined)
  {
    this.showOption = result.settingValue;
  }
  let pickupAmount =this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().storeId).find(x=>x.settingId==='PickupAmount');
  if(pickupAmount!==null && pickupAmount!==undefined)
  {
    this.pickupAmount = result.settingValue;
  }
  let enableBankin =this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().storeId).find(x=>x.settingId==='EnableBankIn');
  if(enableBankin!==null && enableBankin!==undefined)
  {
    this.enableBankin = enableBankin.settingValue;
    console.log('this.enableBankin', this.enableBankin);
  }
  let groupByCashier =this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().storeId).find(x=>x.settingId==='EOSGroupByCashier');
  if(groupByCashier!==null && groupByCashier!==undefined)
  {
    this.groupByCashier = groupByCashier.settingValue;
    
  }
  let OpenDrawer = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'OpenDrawerOnEndShift');
    if (OpenDrawer !== null && OpenDrawer !== undefined) {
      this.openDrawer = OpenDrawer.settingValue;
    }
}
totalAmountDiff = 0;
pickupAmount="false";
pickupAmt : TPickupAmount[]=[];
loadPickupAmountLst()
{
  debugger;
  this.pickupService.GetPickupAmountLst(this.authService.getCompanyInfor().companyCode, this.header.storeId, this.header.dailyId , this.header.shiftId).subscribe((response: any)=>{
    if(response.success)
    {
      this.pickupAmt = response.data;
    }
    else
    {
      this.alertify.warning(response.message) ;
      
    }

  })
}

 
checkEndShift()
{
  let result = true;
  let shift = this.header;//.getCurrentShip();

    var newPayments = [];
   
    debugger;
    shift.payments.forEach(val => newPayments.push(Object.assign({}, val))); 
    newPayments = newPayments.filter(x=>x.isLock === false && (x?.collectedAmount === null  || x?.collectedAmount === undefined || x?.collectedAmount === '') );
    let total = newPayments.reduce(
      (a, b) =>  (b.collectedAmount ?? 0) + a,
      0);// subtotal + ship;
   
 
  if(newPayments !== null && newPayments !== undefined && newPayments?.length > 0 )
  {
    result = false;
    Swal.fire({
      icon: 'info',
      title: 'Collected amount',
      text: "Collected amount can't null, please input collected amount!",
      
    })
  }
  else
  {
     if(this.enableBankin==="true")
     {
        let bankinAmtList = newPayments.filter(x=>x.isLock === false && (x?.bankInAmt === null ||  x?.bankInAmt === undefined) );
        if(bankinAmtList!== null && bankinAmtList !== undefined && bankinAmtList?.length > 0)
        {
          result = false;
          Swal.fire({
            icon: 'info',
            title: 'Bankin amount',
            text: "Bankin amount can't null, please input Bankin amount!",
            
          })
        }
     }
    
    
  }
  return result;
}
shifttoNull(shiftId)
{
  localStorage.removeItem("shift");
  localStorage.setItem("shift", null);
  this.shiftService.changeShift(null);
  this.alertify.success("End shift completed successfully!");
  this.route.navigate(["admin/shift/print",  shiftId]);
}
endShift()
{
  setTimeout(() => {
    let shift = this.header;//.getCurrentShip();

    var newPayments = [];
   
    debugger;
    shift.payments.forEach(val => newPayments.push(Object.assign({}, val))); 
    newPayments = newPayments.filter(x=>x.isLock === false);
    let total = newPayments.reduce(
      (a, b) =>  b.collectedAmount + a,
      0);// subtotal + ship;
    let bankinAmtList = newPayments.filter(x=>x.isLock === false && x?.bankInAmt <= 0 );

    let totalAmt = newPayments.reduce(
    (a, b) =>  b.totalAmt + a,
    0);// subtotal + ship;
    
    if(this.checkEndShift())
    {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to end shift with Collected Amount: ' +  this.authService.formatCurrentcy(total)  ,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        
        if (result.value) { 
          debugger;
          shift.endAmt = total; 
        
          shift.shiftTotal = total + shift.openAmt;
          shift.status = 'C';
          shift.modifiedBy = this.authService.getCurrentInfor().username;
          // shift.payments.forEach(line => {
          //   if(line.isLock === false)
          //   {
          //     line.bankInAmt = line.collectedAmount + line.bankInAmt;
          //   }
             
          // });
          this.shiftService.EndShiftNew(shift).subscribe(
            (response: any) => {
              // debugger;
              if(response.success)
              {
                
                if(this.openDrawer==='true')
                {
                  if(totalAmt !== total)
                  {
                    let diff = Math.abs(totalAmt - total); 
                    Swal.fire({
                      icon: 'info',
                      title: 'Different Amount: ' + this.authService.formatCurrentcy(diff),
                      // text: 'Something went wrong!',
                      
                    }).then(()=>{
                      Swal.fire({
                        title: 'Are you sure?',
                        text: 'Do you want to open drawer',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                      }).then((result) => {
                        if (result.value) {
                          this.excuteFunction.openDrawer();   
                          setTimeout(() => {
                            this.shifttoNull(shift.shiftId);
                            // localStorage.removeItem("shift");
                            // localStorage.setItem("shift", null);
                            // this.shiftService.changeShift(null);
                            // this.alertify.success("End shift completed successfully!");
                            // this.route.navigate(["admin/shift/print", ]);
                          }, 50); 
                        } 
                        else
                        {
                          setTimeout(() => {
                            this.shifttoNull(shift.shiftId);
                            // localStorage.removeItem("shift");
                            // localStorage.setItem("shift", null);
                            // this.shiftService.changeShift(null);
                            // this.alertify.success("End shift completed successfully!");
                            // this.route.navigate(["admin/shift/print", shift.shiftId]);
                          }, 50); 
                        }
                      })
                    })
                  }
                  else
                  {
                    Swal.fire({
                      title: 'Are you sure?',
                      text: 'Do you want to open drawer',
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonText: 'Yes',
                      cancelButtonText: 'No'
                    }).then((result) => {
                      if (result.value) {
                        this.excuteFunction.openDrawer();   

                        setTimeout(() => {
                          this.shifttoNull(shift.shiftId);
                          // localStorage.removeItem("shift");
                          // localStorage.setItem("shift", null);
                          // this.shiftService.changeShift(null);
                          // this.alertify.success("End shift completed successfully!");
                          // this.route.navigate(["admin/shift/print", shift.shiftId]);
                        }, 50); 
                      }
                      else
                      {
                        this.shifttoNull(shift.shiftId);
                      } 
                    })
                  }
                  
                }
                else
                {
                  if(totalAmt !== total)
                  {
                    let diff = Math.abs(totalAmt - total); 
                    Swal.fire({
                      icon: 'info',
                      title: 'Different Amount: ' + this.authService.formatCurrentcy(diff),
                      // text: 'Something went wrong!',
                      
                    })
                  }
                  
                  setTimeout(() => {
                    localStorage.removeItem("shift");
                    localStorage.setItem("shift", null);
                    this.shiftService.changeShift(null);
                    this.alertify.success("End shift completed successfully!");
                    this.route.navigate(["admin/shift/print", shift.shiftId]);
                  }, 50);
              
                }
               
                // localStorage.setItem("shift", JSON.stringify(this.shiftHeader));
                // this.route.navigate(['/admin/shift/print/', shift.shiftId]).then(() => {
                //   window.location.reload();
                // }); 
              }
              else
              {
                Swal.fire({
                  icon: 'warning',
                  title: 'End Shift',
                  text: response.message,
                  
                })
                // this.alertify.warning(response.message); 
              }
            
            },
            (error) => {
              // this.alertify.error(error);
              console.log('End Shift error', error);
                Swal.fire({
                  icon: 'error',
                  title: 'End Shift',
                  text: "Can't connect to Server, Please try again or contact to support team!",
                  
                })
            }
          );
        }
      });
    }
    // if(newPayments !== null && newPayments !== undefined && newPayments?.length > 0 && total <= 0)
    // {
    //   Swal.fire({
    //     icon: 'info',
    //     title: 'Collected amount',
    //     text: "Collected amount can't null, please input collected amount!",
        
    //   })
    // }
    // else
    // {
    //   if(bankinAmtList!== null && bankinAmtList !== undefined && bankinAmtList?.length > 0)
    //   {
    //     Swal.fire({
    //       icon: 'info',
    //       title: 'Bankin amount',
    //       text: "Bankin amount can't null, please input Bankin amount!",
          
    //     })
    //   }
    //   else
    //   {
       
    //   }
       
     
   
    // }
   
     }, 50);
 
  // Swal.fire({
  //   title: 'Submit your amount',
  //   input: 'number',
  //   inputAttributes: {
  //     autocapitalize: 'off'
  //   },
  //   showCancelButton: true,
  //   confirmButtonText: 'Submit',
  //   showLoaderOnConfirm: true, 
  //   allowOutsideClick: () => !Swal.isLoading()
  // }).then((result) => {
  //   if (result.isConfirmed) {
  //     debugger;
     
     
     
  //     // let itembasket= this.basketService.mapProductItemtoBasket(this.item, 1 );
  //     // itembasket.quantity = result.value;
  //     // itembasket.storeAreaId = '';
  //     // itembasket.timeFrameId = ''; 
  //     // itembasket.appointmentDate = '';
  //     // itembasket.isCapacity = true;
  //     // // 
  //     // const initialState = {
  //     //   basketModel:  itembasket, title: 'Item Capacity',
  //     // };
  //     // this.modalRef = this.modalService.show(ShopCapacityComponent, {initialState});
  //   }
  // })
  
}
  functionId = "Adm_Shift";
  canEndShift=true;
  canViewShift = true;
  ngOnInit() {
  // this.loadShiftOpenList();
  
    debugger;
    this.activedRoute.params.subscribe(data => { 
      this.shiftId = data['id'];
    });
    this.loadGeneralSettingStore();
    this.loadData();
    this.canEndShift = this.authService.checkRole(this.functionId , '', 'E' ); 
    this.canViewShift = this.authService.checkRole(this.functionId , '', 'V' ); 
    if(this.canViewShift !== true)
    {
      this.showOption = "false";
    }
    else
    {
     this.showOption = "true";
    }
  }
  
  editorPreparing(e) {
    debugger;
    if(e?.row!==null && e?.row!==undefined)
    {
      let rowdata = e.row.data;
      if(e.parentType === "dataRow" && rowdata!== null && rowdata!==undefined && rowdata.isLock === true) {
          if(e.dataField === "collectedAmount" ||  e.dataField === "bankInAmt")
          {
            e.editorOptions.readOnly =  true;
            e.editorOptions.cancel = true;
          }
        
      }
    }
    
 }
  loadData()
  {
    let store= this.authService.storeSelected();
    this.shiftService.GetEndShiftSummary(store.companyCode,store.storeId, this.shiftId).subscribe((response: any)=>{ 
      this.header= response.data;
      debugger;
      console.log("this.header", this.header);
      if(this.header.openAmt!==null && this.header.openAmt!==undefined)
      {

      }
      else
      {
        this.header.openAmt = 0;
      }
      if(this.header.status!=='C')
      {
        this.header.payments.forEach(payment => {
          // payment.collectedAmount =  0;
          if(payment.eodApply===false)
          {
            // payment.bankInAmt = payment.collectedAmount;
            payment.bankInBalance= 0;
            payment.isLock = true;
          }
          else
          {
            // payment.bankInAmt = payment.bankInAmt;
            payment.isLock = false;
          }
         
         });
      }
      else
      {
        this.showOption = "true";
      }
      if(this.pickupAmount === "true")
      {
        this.loadPickupAmountLst();
      }
       
      // console.log(this.header);
    });
  }
}
