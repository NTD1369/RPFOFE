import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TPickupAmount } from 'src/app/_models/pickupamount';
import { TShiftHeader } from 'src/app/_models/tshiftheader';
import { TShiftLine } from 'src/app/_models/tshiftline';
import { ShiftVM } from 'src/app/_models/viewmodel/shiftViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { PickupAmountService } from 'src/app/_services/data/pickupAmount.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-ManagementPrintShift',
  templateUrl: './ManagementPrintShift.component.html',
  styleUrls: ['./ManagementPrintShift.component.css']
})
export class ManagementPrintShiftComponent implements OnInit {

 
  // list: TShiftLine[];
  header: ShiftVM;
  shiftId="";
  // shift: TShiftLine;
  constructor(public authService: AuthService,private shiftService: ShiftService, private pickupService: PickupAmountService,  
    private alertify: AlertifyService,
    private activedRoute: ActivatedRoute) { this.customizeText= this.customizeText.bind(this);}

customizeText (e) {
  // debugger;
   if( e.value!==null &&  e.value!== undefined)
   {
     return this.authService.formatCurrentcy( e.value);

   }
   return 0;
};

  ngOnInit() {
    // debugger;
    this.activedRoute.params.subscribe(data => { 
      this.shiftId = data['id'];
    })
    this.loadData();
    
  }
  loadData()
  {
    let store= this.authService.storeSelected();
    this.shiftService.GetEndShiftSummary(store.companyCode, store.storeId ,this.shiftId).subscribe((response: any)=>{ 
      debugger;
      this.header= response.data;
      console.log(this.header);
    });
  }

  PrintPage(){
    window.print();
  }
  
}
