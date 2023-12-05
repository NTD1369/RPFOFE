import { DatePipe, PercentPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { RPT_DasboardModel, RPT_SalesTopProductModel } from 'src/app/_models/common/report';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-dashboard',
  templateUrl: './management-dashboard.component.html',
  styleUrls: ['./management-dashboard.component.scss'],
  providers: [
    DatePipe, PercentPipe
  ],
})

export class ManagementDashboardComponent implements OnInit {
  salesTop: RPT_SalesTopProductModel[];
  dashboard: RPT_DasboardModel;
  public webcamImage: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();
  nameChartOrder: string = "";

  triggerSnapshot(): void {
    this.trigger.next();
  }
  removeSnapshot() {
    this.webcamImage = null;
  }
  handleImage(webcamImage: WebcamImage): void {
    console.info('Saved webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  constructor(public authService: AuthService, private resportService: ReportService, public datepipe: DatePipe, private alertify: AlertifyService) { }
  storeSelected: MStore;
  fromDate: Date;
  populationByRegions: PopulationByRegion[] = [];

  dataSource: DataChartPeriod[] = [];



  ngOnInit() {
    this.storeSelected = this.authService.storeSelected();
    // this.populationByRegions = [{
    //   region: "Asia",
    //   val: 4119626293
    // }, {
    //   region: "Africa",
    //   val: 1012956064
    // }, {
    //   region: "Northern America",
    //   val: 344124520
    // }, {
    //   region: "Latin America and the Caribbean",
    //   val: 590946440
    // }, {
    //   region: "Europe",
    //   val: 727082222
    // }, {
    //   region: "Oceania",
    //   val: 35104756
    // }];

    // this.getDaysInMonth(7,2021);

    

  }

  //  getDaysInMonth(month, year) {
  //   var date = new Date(year, month, 1);
  //   var days = [];
  //   while (date.getMonth() === month) {
  //     days.push(new Date(date));
  //     date.setDate(date.getDate() + 1);
  //   }
  //   // days.forEach(element => {
  //   //   console.log("days",new Date(element).getDate() );
  //   // });
  //   return days;
  // }
  @ViewChild('chart', { static: false }) chart;

  ngAfterViewInit() {
    debugger;
    if(this.storeSelected!== undefined && this.storeSelected!==null)
    {
      let now = new Date();
      this.fromDate = new Date();
      this.fromDate.setDate(this.fromDate.getDate() - 60);
      this.storeSelected = this.authService.storeSelected();
      this.loadSalesTop(this.datepipe.transform(this.fromDate, 'yyyy-MM-dd'), this.datepipe.transform(now, 'yyyy-MM-dd'), '10')
      // this.chart.instance.update();
      const paymentMenu = document.getElementsByClassName('paymentMenu');
      Array.prototype.forEach.call(paymentMenu, function (item) {
        // Do stuff here
        if (item !== null && item !== undefined) {
          item.classList.remove('show');
          item.classList.add('hide');
          // console.log('Dashboard');
        }
      });
      debugger;
      this.loadDasboard(this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
  
      this.loadChartOrderByPeriod(1);
    }
    
  }
  viewReport(from, to, top) {

    this.loadSalesTop(this.datepipe.transform(from, 'yyyy-MM-dd'), this.datepipe.transform(to, 'yyyy-MM-dd'), top);
  }
  customizeLabel(point) {
    return point.argumentText + ": " + point.valueText + "%";
  }
  customizeLabelX(point) {
    debugger;
    return point.argumentText + ": " + point.valueText;
  }
  onPointClick(e) {
    e.target.select();
  }
  pipe: any = new PercentPipe("en-US");
  customizeTooltip = (arg: any) => {
    // debugger;
    return {
      text: arg.valueText + " - " + this.pipe.transform(arg.totalQuantity, "1.2-2")
    };
  }
  loadSalesTop(fromDate, toDate, top) {
    if(this.storeSelected?.companyCode!==null && this.storeSelected?.companyCode!==undefined &&  this.storeSelected?.companyCode!=='')
    {
      this.resportService.Get_RPT_SalesTopProduct(this.storeSelected.companyCode, this.storeSelected.storeId, this.authService.getCurrentInfor().username, fromDate, toDate, top).subscribe((response: any) => {
        // debugger;
        if (response.success) {
          let sumQuality = 0;
          let perQuality = 0;
          this.salesTop = response.data;
          response.data.forEach(element => {
            sumQuality += element.totalQuantity;
          });
  
          this.salesTop.forEach(item => {
            item.precentQuantity = ((item.totalQuantity / sumQuality) * 100).toFixed(2);
            // console.log("item.precentQuantity", item.precentQuantity, " - ", item.itemCode);
          });
          console.log('this.salesTop ', this.salesTop );
        }
        else {
          this.alertify.warning(response.message);
        }
      });
    }
   
  }
  loadDasboard(date) {
    this.resportService.Get_RPT_Dashboard(this.storeSelected.companyCode, this.storeSelected.storeId, this.authService.getCurrentInfor().username, date).subscribe((response: any) => {
      // debugger;
      if (response.success) {
        this.dashboard = response.data[0];
      }
      else {
        this.alertify.warning(response.message);
      }


    });
  }

  loadChartOrderByPeriod(type) {
    this.dataSource = [];
    if (type == 1) {
      this.nameChartOrder = "Week Sales";

      this.resportService.Get_RPT_LoadChartOrderPeriodByWeek(this.storeSelected.companyCode, this.storeSelected.storeId, this.authService.getCurrentInfor().username).subscribe((response: any) => {
        if (response.success) {
          console.log( 'data', response.data);
          response.data.forEach(element => {
            this.dataSource.push({
              Name: this.datepipe.transform(element.Name, 'dd/MM'),
              Value: element.Value
            });
          });
          console.log("week", this.dataSource);
        }
        else {
          this.alertify.warning(response.message);
        }
      });
    } else if (type == 2) {
      this.nameChartOrder = "This Month Sale";

      this.resportService.Get_RPT_LoadChartOrderPeriodByMonth(this.storeSelected.companyCode, this.storeSelected.storeId, this.authService.getCurrentInfor().username, (new Date()).getFullYear(), (new Date()).getMonth() + 1).subscribe((response: any) => {
        // debugger;
        if (response.success) {
          response.data.forEach(element => {
            this.dataSource.push({
              Name: this.datepipe.transform(element.Name, 'dd/MM'),
              Value: element.Value
            });
          });
          // console.log("month", response.data);
          // console.log("month", this.dataSource);
        }
        else {
          this.alertify.warning(response.message);
        }

      });
    } if (type == 3) {
      this.nameChartOrder = "This Year Sale";
      this.resportService.Get_RPT_LoadChartOrderPeriodByYear(this.storeSelected.companyCode, this.storeSelected.storeId, this.authService.getCurrentInfor().username, (new Date()).getFullYear()).subscribe((response: any) => {
        // debugger;
        if (response.success) {
          response.data.forEach(element => {
            this.dataSource.push({
              Name: this.datepipe.transform(element.Name, 'MM/yyyy'),
              Value: element.Value
            });
          });
          // console.log("year", response.data);
          // console.log("year", this.dataSource);
        }
        else {
          this.alertify.warning(response.message);
        }

      });

    }
  }
}
class PopulationByRegion {
  region: string;
  val: number;
}

class DataChartPeriod {
  Name: string;
  Value: number;
}
