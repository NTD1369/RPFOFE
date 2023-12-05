import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CapacityService } from 'src/app/_services/data/capacity.service'; 
import { StoreareaService } from 'src/app/_services/data/storearea.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Query from 'devextreme/data/query';
import * as moment from 'moment';
import { DxSchedulerComponent } from 'devextreme-angular';
import { CapacityViewModel } from 'src/app/_models/viewmodel/CapacityViewModel';
@Component({
  selector: 'app-shop-capacity-calendar',
  templateUrl: './shop-capacity-calendar.component.html',
  styleUrls: ['./shop-capacity-calendar.component.css']
})
export class ShopCapacityCalendarComponent implements OnInit {

  constructor(private basketService: BasketService,   private capacityService: CapacityService , private storeAreaService: StoreareaService,
    public alertify: AlertifyService, private routeNav: Router,   public authService: AuthService,
   private modalService: BsModalService, private route: ActivatedRoute) { }
   showCalendar=false;
   currentDate: Date = new Date(); 
   toDate: Date = new Date(); 
   theatreData: TheatreData[]=[];
   data: any[];
   timezone: string;
  ngOnInit() {
    // debugger;
    // this.storeSelected = this.authService.storeSelected();
    // debugger;
    
    // this.quantity= this.basketModel.quantity ;
    if(this.quantity === undefined || this.quantity === null)
    {
      this.quantity =1;
    }
    // if(this.basketModel.customField5==='Y')
    // {
    //   let nextSat = this.getNextDayOfWeek(this.currentValue, 6);
    //   let nextSun = this.getNextDayOfWeek(this.currentValue, 0);
    //   if(nextSat!==this.currentValue && nextSun!==this.currentValue)
    //   { 
    //     this.currentValue = nextSat;
    //   }
    //   this.typeOfDate="Weekend";
    // }
    // // debugger;
    // if(this.basketModel.customField6==='Y')
    // { 
    //   let check = this.holidays.filter(x=>x.date === this.currentValue);
    //   if(check!==null && check.length > 0)
    //   {
    //     this.currentValue = check[0];
    //   }
    //   else
    //   {
    //     let nextSun = this.holidays[0];
    //     if(nextSun!==this.currentValue)
    //     { 
    //       this.currentValue = nextSun.date;
    //     }
    //   }
    //   this.typeOfDate="Holiday";
      
    // }
    // this.loadAreaStore();
    // this.loadCapacity();
   
    this.storeAreaService.GetStoreAreaCapacity(this.authService.storeSelected().storeId,this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      // this.theatreData = response;
      debugger;
      if(response.success)
      {
         // this.theatreData = response;
        response.data.forEach(item => {
          // let header = new TheatreData();
          // header.id = item.storeAreaId;
          // header.text= item.storeAreaName;
          // header.dataField = item.storeAreaName;
          this.theatreData.push({ id: item.storeAreaId, storeAreaId :item.storeAreaId, text: item.storeAreaName});
        });
        this.showCalendar=true;
        this.startTimeX = this.currentDate.getHours();
        this.loadCapacityNew();
      }
      else{
        this.alertify.warning(response.message);
      }
      // response.forEach(item => {
       
      //   this.theatreData.push({ id: item.storeAreaId, storeAreaId :item.storeAreaId, text: item.storeAreaName});
      // });
      // this.showCalendar=true;
      
    })
   
  
    // this.moviesData = moviesData;
     
     
    

  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  loadCapacityNew()
  {
    
    let fromDate = this.GetDateFormat(this.currentDate);//  this.currentDate.getFullYear() + '/' + this.currentDate.getMonth() + 1 + '/' + this.currentDate.getDate();
    debugger;
    let toDate = this.GetDateFormat(this.toDate);
    // if(this.quantity=== null || this.quantity === undefined)
    //   this.quantity =0;
    
    this.capacityService.getCapacityFromTo(this.authService.getCurrentInfor().companyCode, fromDate, toDate, this.quantity, this.authService.storeSelected().storeId ,'','').subscribe((response: any)=>{
      //  debugger;
       if(response.success)
       {
          
          this.capaList = response.data;
          
          this.capaList.forEach((capa: CapacityViewModel) => {
            capa.startDate = new Date(capa.startDate);
            capa.endDate = new Date(capa.endDate);
            if(capa.remainCapacity > 0)
            {
              capa.color ="#56ca85";
            }
            else
            {
              capa.color ="#1e90ff";
            }
            
          });
          console.log(this.capaList);
       }
       else
       {
         this.alertify.warning("load capacity data failed: " + response.message);
       }
       
      
    });
    
  }
  startTimeX = 0;
  capaHeaderList: any[];
  loadAreaStore()
  {
    this.capacityService.getCapacityAreaStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId ).subscribe((response: any)=>{
      // debugger;
      if(response.success)
      {
         this.capaHeaderList = response.data;
         console.log(this.capaHeaderList );
      }
      else
      {
        this.alertify.error(response.message);
      }
   });
  }
  // loadStoreArea()
  // {
  //   this.capacityService.getCapacityAreaStore(this.authService.getCurrentInfor().storeId,this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
  //     // this.theatreData = response;
  //     debugger;
  //     if(response.success)
  //     {
  //       response.data.forEach(item => {
  //         // let header = new TheatreData();
  //         // header.id = item.storeAreaId;
  //         // header.text= item.storeAreaName;
  //         // header.dataField = item.storeAreaName;
  //         this.theatreData.push({ id: item.storeAreaId, storeAreaId :item.storeAreaId, text: item.storeAreaName});
  //       });
  //       this.showCalendar=true;
  //       this.loadCapacity();
  //     }
  //     else
  //     {
  //          this.alertify.warning(response.message);
  //     }
     
  //   })
  
  // }
  // capaList: any[]=[{  
  //       companyCode: "CP001",
  //       currentCapacity: 0,
  //       duration: 30,
       
  //       maxCapacity: 50,
  //       remainCapacity: 0,
       
  //       storeAreaId: "SA001",
  //       storeId: "W0101",
  //       timeFrameId: "TF001",
      
  //       startDate: new Date("2021-03-31T09:00:00"), 
  //       endDate: new Date("2021-03-31T09:30:00"), 
  // }];
  capaList: any[] =[];
  quantity = 10;
 
  @ViewChild(DxSchedulerComponent, { static: false }) scheduler: DxSchedulerComponent;
  onOptionChanged(e){  
    if(e.name === 'currentDate'){  
        debugger;  
        //check value and previousValue properties  
        //and check navigation buttons  
    }  
  }
  updateModel(model) { 
    debugger; 
     
  
}
onAppointmentFormOpening = e => {
  e.cancel = true;
}
  // getDataObj(objData) {
  //     for(var i = 0; i < this.data.length; i++) {
  //         if(this.data[i].startDate.getTime() === objData.startDate.getTime() && this.data[i].storeAreaId === objData.storeAreaId)
  //             return this.data[i];
  //     }
  //     console.log('Có không');
  //     return null;
  // }

  // getMovieById(id) {
  //     return Query(this.moviesData).filter(["id", "=", id]).toArray()[0];
  // }
 
}
 
export class TheatreData {
  text: string;
  id: string;
  storeAreaId: string;
  
}

// export class Data {
//   storeAreaId: string;
//   // theatreId: number;
//   movieId: number;
//   price: number;
//   startDate: Date;
//   endDate: Date
// }
 
let theatreData: TheatreData[] = [
  // {
  //   id: "SA001",
  //   dataField: "SA001",
  //   text: "SA001",
    
  // },
  // {
  //   id:  "SA002",
  //   dataField: "SA002",
  //   text: "SA002",
   
  // }
   
];
 