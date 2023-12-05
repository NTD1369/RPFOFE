import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TShiftLine } from 'src/app/_models/tshiftline';
import { AuthService } from 'src/app/_services/auth.service';
import { ShiftService } from 'src/app/_services/data/shift.service';

@Component({
  selector: 'app-management-shift-detail',
  templateUrl: './management-shift-detail.component.html',
  styleUrls: ['./management-shift-detail.component.scss']
})
export class ManagementShiftDetailComponent implements OnInit {

  list: TShiftLine[];
  shiftId="";
  // shift: TShiftLine;
  constructor(public authService: AuthService,private shiftService: ShiftService, private activedRoute: ActivatedRoute) { this.customizeText= this.customizeText.bind(this);}
  // @ViewChild('template' , { static: false}) template;  
  onToolbarPreparing(e) {
    // e.toolbarOptions.items.unshift( {
    //         location: 'before',
    //         widget: 'dxButton',
    //         options: {
    //             width: 136, 
    //             icon:"add", type:"success", text:"Add",
    //             onClick: this.newGoodReceipt.bind(this)
    //         } 
    //     });
}
customizeText (e) {
  debugger;
   if( e.value!==null &&  e.value!== undefined)
   {
     return this.authService.formatCurrentcy( e.value);

   }
   return 0;
};

  ngOnInit() {
    this.activedRoute.params.subscribe(data => { 
      this.shiftId = data['id'];
    })
    this.loadData();
  }
  loadData()
  {
    let companyCode= this.authService.storeSelected().companyCode;
    this.shiftService.getItem(companyCode, this.shiftId).subscribe((response: any)=>{ 
      debugger;
      if(response.success)
      {
        this.list= response.data.lines;
        console.log(this.list);
      }
      else
      {
        // this.al
      }
     
    });
  }
  
}
