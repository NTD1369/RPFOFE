import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Item } from 'src/app/_models/item';
import { MStoreCapacity } from 'src/app/_models/mstorecapacity';
import { MStore } from 'src/app/_models/store';
import { IBasketItem } from 'src/app/_models/system/basket';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CapacityService } from 'src/app/_services/data/capacity.service'; 
import { AlertifyService } from 'src/app/_services/system/alertify.service'; 
import Query from 'devextreme/data/query';
import { StoreareaService } from 'src/app/_services/data/storearea.service';
import { DxSchedulerComponent } from 'devextreme-angular';
import { CapacityViewModel } from 'src/app/_models/viewmodel/CapacityViewModel';
@Component({
  selector: 'app-shop-capacity',
  templateUrl: './shop-capacity.component.html',
  styleUrls: ['./shop-capacity.component.scss']
})
export class ShopCapacityComponent implements OnInit {
  currentValue: Date = new Date();
  // @Input() itemCode: string;
  @Input() mode: string;
  quantity: number;
  capaList: any[];
  capaHeaderList: any[];
  isNew= false;
  timeFrameSelected: any;
  model: Item;
  // @Input() itemcode: string;
  @Input() basketModel: IBasketItem;
  @Input() ispromo: boolean;
  itemSelected: IBasketItem;
  storeSelected: MStore;
  constructor(private basketService: BasketService,   private capacityService: CapacityService , private storeAreaService: StoreareaService,
    private alertify: AlertifyService, private routeNav: Router, public modalRef: BsModalRef , public authService: AuthService,
    private modalService: BsModalService, private route: ActivatedRoute) {
      // this.basketModel= new IBasketItem();
     
      this.isDateDisabledNotHoliday= this.isDateDisabledNotHoliday.bind(this);
       
  }
  
  getNextDayOfWeek(date, dayOfWeek) {
    var resultDate = new Date(date.getTime());
      resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay() - 1) % 7 +1);
      return resultDate;
  }
  isDateDisabled({ date, view }) {
      const day = date.getDay();
      const isWeekend = (day === 0 || day === 6);
      return view === "month" && isWeekend;
  };
  isDateDisabledNotHoliday({ date, view }) {
    const day = date.getDay();
    let dateX= this.GetDateFormat(date);
    const isWeekend = (day === 0 || day === 6);
    let isHoliday=false;
    let check = this.holidays.filter(x=> x.date === dateX);
    if(check!==null && check.length > 0)
    { debugger;
      isHoliday=true;
    }
    return view === "month" && !isHoliday;
  };
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  isDateDisabledWorking({ date, view }) {
    const day = date.getDay();
    const isWeekend = (day === 0 || day === 6);
    return view === "month" && !isWeekend;
  };

  holidays:any[]=[{ code: 1003, date:"2021-04-20" ,name:"giổ tổ" }, { code: 3004, date:"2021-04-30" ,name:"30 tháng 4" }, { code: 105, date:"2021-5-1" ,name:"1 tháng 5" }];
  typeOfDate="Normal";
  startTimeX = 0;
  ngAfterViewInit()
  {
    
  }
  ngOnInit() {
   
    this.storeSelected = this.authService.storeSelected();
   
    let basket = this.basketService.getCurrentBasket();
    if(this.mode === null || this.mode === undefined)
    {
      this.mode = basket.salesType;
    }
  
    console.log('this.mode', this.mode);
    this.quantity= this.basketModel.quantity ;
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
    debugger;
    this.storeAreaService.GetStoreAreaCapacity(this.authService.storeSelected().storeId,this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
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
      }
      else{
        this.alertify.warning(response.message);
      }
     
    })
    this.startTimeX = this.currentDate.getHours();
  
    // this.moviesData = moviesData;
     
     
    this.loadCapacityNew();
  }
  
 
  loadCapacityNew()
  {
    
    let formattedDate = this.GetDateFormat(this.currentDate);//  this.currentDate.getFullYear() + '/' + this.currentDate.getMonth() + 1 + '/' + this.currentDate.getDate();
    debugger;
    // if(this.quantity=== null || this.quantity === undefined)
    //   this.quantity =0;
    
    this.capacityService.getCapacity(this.authService.getCurrentInfor().companyCode, formattedDate, 0,this.authService.storeSelected().storeId ,'','').subscribe((response: any)=>{
       debugger;
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
  @ViewChild(DxSchedulerComponent, { static: false }) scheduler: DxSchedulerComponent;
  
  // data: Data[];
  // currentDate: Date = new Date(2021, 4, 25);
  // moviesData: MovieData[];
  // theatreData: TheatreData[];
 

  // onAppointmentFormOpening(data) {
  //     var that = this,
  //         form = data.form,
  //         movieInfo = that.getMovieById(data.appointmentData.movieId) || {},
  //         startDate = data.appointmentData.startDate;

  //     form.option("items", [{
  //         label: {
  //             text: "Movie"
  //         },
  //         editorType: "dxSelectBox",
  //         dataField: "movieId",
  //         editorOptions: {
  //             items: that.moviesData,
  //             displayExpr: "text",
  //             valueExpr: "id",
  //             onValueChanged: function(args) {
  //                 movieInfo = that.getMovieById(args.value);

  //                 form.updateData("director", movieInfo.director);
  //                 form.updateData("endDate", new Date(startDate.getTime() + 60 * 1000 * movieInfo.duration));
  //             }.bind(this)
  //         }
  //     }, {
  //         label: {
  //             text: "Director"
  //         },
  //         name: "director",
  //         editorType: "dxTextBox",
  //         editorOptions: {
  //             value: movieInfo.director,
  //             readOnly: true
  //         }
  //     }, {
  //         dataField: "startDate",
  //         editorType: "dxDateBox",
  //         editorOptions: {
  //             width: "100%",
  //             type: "datetime",
  //             onValueChanged: function(args) {
  //                 startDate = args.value;
  //                 form.updateData("endDate", new Date(startDate.getTime() + 60 * 1000 * movieInfo.duration));
  //             }
  //         }
  //     }, {
  //         name: "endDate",
  //         dataField: "endDate",
  //         editorType: "dxDateBox",
  //         editorOptions: {
  //             width: "100%",
  //             type: "datetime",
  //             readOnly: true
  //         }
  //     }, {
  //         dataField: "price",
  //         editorType: "dxRadioGroup",
  //         editorOptions: {
  //             dataSource: [5, 10, 15, 20],
  //             itemTemplate: function(itemData) {
  //                 return "$" + itemData;
  //             }
  //         }
  //     }]);
  // }

  // getDataObj(objData) {
  //     for(var i = 0; i < this.data.length; i++) {
  //         if(this.data[i].startDate.getTime() === objData.startDate.getTime() && this.data[i].dataField === objData.dataField)
  //             return this.data[i];
  //     }
  //     return null;
  // }

  // getMovieById(id) {
  //     return Query(this.moviesData).filter(["id", "=", id]).toArray()[0];
  // }
  loadAreaStore()
  {
    this.capacityService.getCapacityAreaStore(this.storeSelected.companyCode, this.storeSelected.storeId ).subscribe((response: any)=>{
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
  loadCapacity()
  {
    let formattedDate = (moment(this.currentValue)).format('YYYY-MM-DD')
    // debugger;
    if(this.quantity=== null || this.quantity === undefined)
      this.quantity =0;
      
    this.capacityService.getCapacityByStore(this.storeSelected.companyCode, formattedDate, this.quantity,this.storeSelected.storeId ).subscribe((response: any)=>{
      //  debugger;
       if(response.success)
       {
          this.capaList = response.data;
          console.log(this.capaList);
       }
       else
       {
         this.alertify.error(response.message);
       }
    });
    
  }
  formatX(value)
  { 
      let leng= value.hours.toString().length;
      var hourse = value.hours.toString().length>= 2 ? value.hours  : '0' + value.hours;
      var minute = value.minutes.toString().length >= 2 ? value.minutes  : '0' + value.minutes; 
      var display= hourse + ":" + minute;
      return display;
   
  }
  openModal(model: any, col , template: TemplateRef<any>) {
    debugger;
    if  (this.quantity=== null || this.quantity === undefined)
      {
        this.quantity = 0;
      }
    // let itembasket= this.basketService.mapProductItemtoBasket(this.model, this.quantity );
    this.basketModel.quantity = this.quantity;
    this.basketModel.storeAreaId = col;
    this.basketModel.timeFrameId = model.timeFrameId; 
    this.basketModel.appointmentDate = model.transDate;
    this.basketModel.note = this.formatX(model.startTime) + " ~ " + this.formatX(model.endTime);
    // this.basketModel.serialNum = model.EndTime;
    this.basketModel.isCapacity = true;
    // this.basketModel = itembasket;
    // this.itemSelected = itembasket;
    // setTimeout(() => {
    //   this.modalRef = this.modalService.show(template, {
    //     ariaDescribedby: 'my-modal-description',
    //     ariaLabelledBy: 'my-modal-title', 
    //     class: 'modal-dialog modal-dialog-centered modal-sm'
    //   });
    // });
 
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
 
    showCalendar=false;
   currentDate: Date = new Date();
  
   theatreData: TheatreData[]=[];
   data: any[];
   timezone: string;
  updateModel(model) { 
      // debugger; 
      if(this.basketModel.appointmentDate.toString()===''||this.basketModel.appointmentDate===null
      ||this.basketModel.timeFrameId.toString()===''||this.basketModel.timeFrameId===null
      ||this.basketModel.storeAreaId.toString()===''||this.basketModel.storeAreaId===null
      ||this.basketModel.quantity.toString()===''||this.basketModel.quantity===null)
      {
        let str="";
        if(this.basketModel.appointmentDate.toString()===''||this.basketModel.appointmentDate===null)
        {
          str+=" Appointment date,";
        }
        if(this.basketModel.timeFrameId.toString()===''||this.basketModel.timeFrameId===null)
        {
          str+=" Time Frame,";
        }
        if(this.basketModel.storeAreaId.toString()===''||this.basketModel.storeAreaId===null)
        {
          str+=" Store Area,";
        }
        if(this.basketModel.quantity.toString()===''||this.basketModel.quantity===null)
        {
          str+=" Quantity,";
        }
          this.alertify.warning("Please input/select" + str.slice(0, str.length-1));
      }
      else
      {
       
        // this.basketService.addItemBasketToBasket(model, parseInt(model.quantity.toString()),null, this.ispromo); 
        this.basketService.addItemBasketToBasket(model, parseInt(model.quantity.toString()),null); 
        this.modalRef.hide();
        // this.routeNav.navigate['shop/order'];
          // this.routeNav.navigate(['/shop/order']);
          debugger;
            if(this.authService.getShopMode()==='FnB')
            {
              if(this.mode?.toLowerCase() === "checkout")
              {
                // window.location.reload();
              }
              else
              {
                if(this.mode?.toLowerCase() !== "ex" && this.mode?.toLowerCase() !== "exchange")
                {
                  this.routeNav.navigate(["shop/order"]).then(() => {
                    // window.location.reload();
                  }); 
                }
              }
            }
            if(this.authService.getShopMode()==='Grocery')
            {
              if(this.mode?.toLowerCase() === "checkout")
              {
                // window.location.reload();
              }
              else
              {
                if( this.mode?.toLowerCase() !== "ex" && this.mode?.toLowerCase() !== "exchange" )
                {
                  this.routeNav.navigate(["shop/order-grocery"]).then(() => {
                    // window.location.reload();
                  }); 
                }
              }
              
               
            
            }
      }
    
  }
}
export class TheatreData {
  text: string;
  id: string;
  storeAreaId: string;
  
}
