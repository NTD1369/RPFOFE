import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TEndDate } from 'src/app/_models/enddate';
import { Payment } from 'src/app/_models/payment';
import { ShiftVM } from 'src/app/_models/viewmodel/shiftViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-open-shift-list',
  templateUrl: './management-open-shift-list.component.html',
  styleUrls: ['./management-open-shift-list.component.scss']
})
export class ManagementOpenShiftListComponent implements OnInit {

  constructor(public authService: AuthService,private shiftService: ShiftService, private activedRoute: ActivatedRoute, private alertify: AlertifyService, private route: Router) { }
  openShiftList: ShiftVM[] = [];
  loadOpenShift()
  { 
    this.shiftService.getOpenShiftSummary(this.companyCode, this.storeId, this.date).subscribe((response: any)=>{
      if(response.success)
      {
        this.openShiftList = response.data;
        this.openShiftList.forEach(shift => {
          
          shift.payments.forEach(payment => {
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
          
        });
        if(this.openShiftList?.length <= 0)
        {
          this.route.navigate(["admin/end-of-date/", this.date]);
        }
      }
      else
      {
        this.alertify.warning(response.message);
      }
      
    });
  }
  companyCode ="";
  storeId = "";
  date = "";
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
  showOption ="false";
  pickupAmount ="false";
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
  }
  ngOnInit() {
    this.activedRoute.params.subscribe(data => { 
      this.companyCode = data['companyCode'];
      this.storeId = data['storeId'];
      this.date = data['date'];
    });

    this.loadOpenShift();
    console.log('endDateList' , this.openShiftList);
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
//  checkEndShift()
//   {
//     let result = true;
//     let shift = this.header;//.getCurrentShip();

//       var newPayments = [];
    
//       debugger;
//       shift.payments.forEach(val => newPayments.push(Object.assign({}, val))); 
//       newPayments = newPayments.filter(x=>x.isLock === false);
//       let total = newPayments.reduce(
//         (a, b) =>  b.collectedAmount + a,
//         0);// subtotal + ship;
    
  
//     if(newPayments !== null && newPayments !== undefined && newPayments?.length > 0 && total <= 0)
//     {
//       result = false;
//       Swal.fire({
//         icon: 'info',
//         title: 'Collected amount',
//         text: "Collected amount can't null, please input collected amount!",
        
//       })
//     }
//     else
//     {
//       if(this.enableBankin==="true")
//       {
//         let bankinAmtList = newPayments.filter(x=>x.isLock === false && x?.bankInAmt <= 0 );
//         if(bankinAmtList!== null && bankinAmtList !== undefined && bankinAmtList?.length > 0)
//         {
//           result = false;
//           Swal.fire({
//             icon: 'info',
//             title: 'Bankin amount',
//             text: "Bankin amount can't null, please input Bankin amount!",
            
//           })
//         }
//       }
      
      
//     }
//     return result;
//   }

  endShift(shift)
  {
    setTimeout(() => {
      // let shift = this.header;//.getCurrentShip();
      var newPayments = [];
        
      shift.payments.forEach(val => newPayments.push(Object.assign({}, val))); 
      newPayments = newPayments.filter(x=>x.isLock === false);
      let total = newPayments.reduce(
        (a, b) =>  b.collectedAmount + a,
        0);// subtotal + ship;
      // const total = shift.payments.reduce(
      //   (a, b) =>  b.collectedAmount + a,
      //   0);// subtotal + ship;
      const totalAmt = shift.payments.reduce(
        (a, b) =>  b.totalAmt + a,
        0);// subtotal + ship;


        if(newPayments !== null && newPayments !== undefined && newPayments?.length > 0 && total <= 0)
        {
          Swal.fire({
            icon: 'info',
            title: 'Collected amount',
            text: "Collected amount can't null, please input collected amount!",
            
          })
        }
        else
        { 
          Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to end shift with Collected Amount: ' +  this.authService.formatCurrentcy( total),
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) { 
              shift.endAmt = total; 
              shift.shiftTotal = total + shift.openAmt;
              shift.status = 'C';
              shift.modifiedBy = this.authService.getCurrentInfor().username;
              this.shiftService.EndShiftNew(shift).subscribe(
                (response: any) => {
                  // debugger;
                  if(response.success)
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
                    
                      this.alertify.success("End shift " + shift.shiftId +" completed successfully!");
                      window.location.reload();
                      // this.route.navigate(["admin/shift/print", shift.shiftId]);
                    }, 50);
                
                    // localStorage.setItem("shift", JSON.stringify(this.shiftHeader));
                    // this.route.navigate(['/admin/shift/print/', shift.shiftId]).then(() => {
                    //   window.location.reload();
                    // }); 
                  }
                  else
                  {
                  
                    this.alertify.warning(response.message); 
                  }
                
                },
                (error) => {
                  // this.alertify.error(error);
                  Swal.fire({
                    icon: 'error',
                    title: 'End Shift',
                    text: "Failed to End Shift"
                  });
                }
              );
            }
          });
        }
    },50);
  }
}
