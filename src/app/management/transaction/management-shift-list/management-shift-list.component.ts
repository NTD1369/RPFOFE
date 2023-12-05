import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TShiftHeader } from 'src/app/_models/tshiftheader';
import { ShiftVM } from 'src/app/_models/viewmodel/shiftViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-management-shift-list',
  templateUrl: './management-shift-list.component.html',
  styleUrls: ['./management-shift-list.component.scss']
})
export class ManagementShiftListComponent implements OnInit {
  list: TShiftHeader[];
  shift: TShiftHeader;
  top = "30";
  onTopChanged(e)
  {
    debugger;
    this.top = e.value;
    this.loadData();

  }
  topList=[ 
  { topId: '30', topName: '30'},
  { topId: '50', topName: '50'},
  { topId: '100', topName: '100'},
  { topId: '250', topName: '250'}, 
  { topId: '1000', topName: '1000'}, 
  { topId: '', topName: 'All'}]
  constructor(private shiftService: ShiftService, private authService: AuthService,  private router: Router) { this.customizeText= this.customizeText.bind(this);}
  @ViewChild('template' , { static: false}) template;  
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
  dateFormat="";
  ngOnInit() {
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.loadData();
    
  }
  customizeText (e) {
    debugger;
     if( e.value!==null &&  e.value!== undefined)
     {
       return this.authService.formatCurrentcy( e.value);

     }
     return 0;
  };
  loadData()
  {
    let store= this.authService.storeSelected();
    this.shiftService.getByStore(this.authService.getCurrentInfor().companyCode, store.storeId, this.top).subscribe((response: any)=>{ 
      if(response.success)
      {
        this.list= response.data;
        console.log(this.list);
      }
      else
      {
          Swal.fire({
            icon: 'warning',
            title: 'Shift Data',
            text: response.message
          });
      }
      // this.list= response;
      // console.log(this.list);
    }, error =>{
      console.log('error', error)
      Swal.fire({
        icon: 'error',
        title: 'Shift Data',
        text: "Can't get data"
      });
    });
  }
  
  viewDetail(data: any)
  {
   
    this.router.navigate(["admin/shift/summary", data.shiftId]);
    // shift/summary/W01012106060075
  }
  print(data: any)
  { 
    this.router.navigate(["admin/shift/print", data.shiftId]);
  }
}
