import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateFormat } from 'src/app/dateFormat.pipe';
import { TEndDate } from 'src/app/_models/enddate';
import { AuthService } from 'src/app/_services/auth.service';
import { EnddateService } from 'src/app/_services/data/enddate.service';
import { PromotionService } from 'src/app/_services/promotion/promotion.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-endofdate-list',
  templateUrl: './management-endofdate-list.component.html',
  styleUrls: ['./management-endofdate-list.component.scss']
})
export class ManagementEndofdateListComponent implements OnInit {


  list: TEndDate[];
  lguAdd: string = "Add";

  constructor(public authService: AuthService, private enddateService: EnddateService, private alertifyService: AlertifyService
    , private router: Router) {
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
  functionId = "Adm_ShiftEndDate";
  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    else {
      this.dateFormat = this.authService.loadFormat().dateFormat;
      this.loadList();
    }

  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
      location: 'before',
      widget: 'dxButton',
      options: {
        width: 136,
        icon: "add", type: "success", text: this.lguAdd,
        onClick: this.newPromotion.bind(this)
      }
    });
  }

  newPromotion() {
    this.router.navigate(["admin/promotion/setup"]);
  }
  dateFormat = "";
  transform(value: string) {

    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, this.dateFormat);
    return value;
  }
  EndOfDate(data) {
    debugger;
    Swal.fire({
      title: 'Do you want to end date: ' + this.transform(data.date),
      // text: 'End of date' + this.transform(data.date)  ,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        let store = this.authService.storeSelected();
        let model = new TEndDate();
        model.companyCode = store.companyCode;
        model.storeId = store.storeId;
        model.date = data.date;
        model.createBy = this.authService.getCurrentInfor().username;
        this.enddateService.create(model).subscribe((response: any) => {
          debugger;
          if (response.success) {
            debugger;
            this.alertifyService.success('End of day ' + this.transform(data.date) + ' completed successfully. ');
            this.loadList();
          }
          else {
            this.alertifyService.warning('End of day ' + this.transform(data.date) + ' failed. ' + response.message);
          }
        });

      }
    });
  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return date.getFullYear() + '-' + month + '-' + (day);
  }
  top = "30";
  onTopChanged(e)
  {
    debugger;
    this.top = e.value;
    this.loadList();

  }
  topList=[ 
    { topId: '30', topName: '30'},
    { topId: '50', topName: '50'},
    { topId: '100', topName: '100'},
    { topId: '250', topName: '250'}, 
    { topId: '1000', topName: '1000'}, 
    { topId: '', topName: 'All'}
  ]

  viewDetail(data) {
    debugger;
    let date = this.GetDateFormat(new Date(data.date.toString()));
    this.router.navigate(["admin/end-of-date/", date]);
    //  this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
  }
  PrintPage(data) {
    // window.print();
    let date = this.GetDateFormat(new Date(data.date.toString()));
    this.router.navigate(["admin/end-of-date/print/", date]);
  }
  loadList() {
    let comp = this.authService.storeSelected().companyCode;
    this.enddateService.getAll(comp, this.authService.storeSelected().storeId, this.top).subscribe((response: any) => {
      debugger;

      if (response.success) {
        this.list = response.data;
      }
      else {
        this.alertifyService.warning('load data failed. Message: ' + response.message);
      }

    });
  }
}
