import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Pagination } from 'src/app/_models/pagination';
import { MTimeFrame } from 'src/app/_models/timeframe';
import { AuthService } from 'src/app/_services/auth.service';
import { TimeframeService } from 'src/app/_services/data/timeframe.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import * as moment from 'moment';
import { TimeSpan } from 'src/app/_models/system/timespan';
@Component({
  selector: 'app-management-timeframe',
  templateUrl: './management-timeframe.component.html',
  styleUrls: ['./management-timeframe.component.scss']
})
export class ManagementTimeframeComponent implements OnInit {

  lguAdd: string = "Add";
  functionId = "Adm_TimeFrame";
  items: MTimeFrame[];
  pagination: Pagination;
  userParams: any = {};
  isNew: boolean = false;
  constructor(private timeframeService: TimeframeService, private alertify: AlertifyService, private router: Router, private authService: AuthService,
    private modalService: BsModalService, private route: ActivatedRoute) {
    // Chuyển đổi ngôn ngữ
    const lgu = localStorage.getItem('language');
    if (lgu === "vi") {
      this.lguAdd = "Thêm";
    } else if (lgu === "en") {
      this.lguAdd = "Add";
    } else {
      console.log("error");
    }
  }

  ngOnInit() {
    // this.route
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.loadItems();
    // debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.items = data['whs'].result;
    //   this.pagination = data['whs'].pagination;
    //   // debugger;

    // this.userParams.keyword = ''; 
    // this.userParams.orderBy = 'byName';

    //   // data['items']
    // });
  }


  loadItems() {
    this.timeframeService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      // loadItems
      // debugger;
      if (response.success) {
        this.items = response.data;
      }
      else {
        this.alertify.warning(response.message);
      }
      // this.items = res;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
  modalRef: BsModalRef;
  timeFrame: MTimeFrame;
  openModal(isNew: boolean, timeFrame: MTimeFrame, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.timeFrame = new MTimeFrame();
      this.timeFrame.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else {
      this.timeFrame = timeFrame;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
      output = '0' + output;
    }
    return output;
  }
  fromString(timeSpan) {
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    if (timeSpan != null && typeof (timeSpan) == 'string' && timeSpan.indexOf('PT') > -1) {
      timeSpan = timeSpan.split("PT")[1].toLowerCase();
      var hourIndex = timeSpan.indexOf('h');
      if (hourIndex > -1) {
        hours = parseInt(timeSpan.slice(0, hourIndex));
        timeSpan = timeSpan.substring(hourIndex + 1);
      }

      var minuteIndex = timeSpan.indexOf('m');
      if (minuteIndex > -1) {
        minutes = parseInt(timeSpan.slice(0, minuteIndex));
        timeSpan = timeSpan.substring(minuteIndex + 1);
      }

      var secondIndex = timeSpan.indexOf('s');
      if (secondIndex > -1)
        seconds = parseInt(timeSpan.slice(0, secondIndex));

    }
    return [hours, minutes, seconds];
  }
  updateModel(model) {
    debugger;
    let hF = model.startTime.getHours();
    let mF = model.startTime.getMinutes();
    let sF = model.startTime.getSeconds();
    let hT = model.endTime.getHours();
    let mT = model.endTime.getMinutes();
    let sT = model.endTime.getSeconds();
    // let time =  new Date(model.startTime).toTimeString();
    // var x = moment.duration(2 ,"hours", 10, "minutes").asMilliseconds();
    //  var timespan = require('timespan');
    // var from = new timespan.TimeSpan(0, sF, mF , hF);
    // var to = new timespan.TimeSpan(0, sT, mT, hT);
    // let a = this.fromString(time); 
    // model.startTime = new TimeSpan(time) ;// parseInt(this.leftPad(hF, 2) + this.leftPad(mF, 2));
    // model.endTime = parseInt(this.leftPad(hT, 2) + this.leftPad(mT, 2));
    let stTime = { Hours: hF, Minutes: mF, Seconds: sF };
    // stTime.hours = hF;
    // stTime.minutes = mF;
    // stTime.seconds = sF;

    // let toTime = new TimeSpan();
    // toTime.hours = hT;
    // toTime.minutes = mT;
    // toTime.seconds = sT;
    model.startTime = null;
    model.endTime = null;
    model.startTimeStr = hF + ":" + mF + ":" + sF;
    model.endTimeStr = hT + ":" + mT + ":" + sT;
    if (this.isNew) {
      model.createdBy = this.authService.decodeToken?.unique_name;

      this.timeframeService.create(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Create completed successfully');
          this.loadItems();
          this.modalRef.hide();
        }
        else {
          this.alertify.error(response.message);
        }
      }, error => {
        this.alertify.error(error);
      });
    }
    else {
      model.ModifiedBy = this.authService.decodeToken?.unique_name;
      this.timeframeService.update(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Update completed successfully.');
          this.modalRef.hide();
        }
        else {
          this.alertify.error(response.message);
        }

      }, error => {
        this.alertify.error(error);
      });
    }

  }

  @ViewChild('template', { static: false }) template;
  onToolbarPreparing(e) {
    if (this.authService.checkRole(this.functionId, '', 'I')) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: this.lguAdd,
          onClick: this.openModal.bind(this, true, null, this.template)
        }
      });
    }
  }
}
