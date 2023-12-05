import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MHoliday } from 'src/app/_models/holiday';
import { AuthService } from 'src/app/_services/auth.service';
import { HolidayService } from 'src/app/_services/data/holiday.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-holiday',
  templateUrl: './management-holiday.component.html',
  styleUrls: ['./management-holiday.component.scss']
})
export class ManagementHolidayComponent implements OnInit {



  lguAdd: string = "Add";
  holidays: MHoliday[];
  modalRef: BsModalRef;
  holiday: MHoliday;
  isNew: boolean = false;
  functionId = "Adm_Holiday";
  openModal(isNew: boolean, holiday: MHoliday, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.holiday = new MHoliday();
      this.holiday.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else {
      this.holiday = holiday;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  constructor(private holidayService: HolidayService, private alertify: AlertifyService, private authService: AuthService,
    private router: Router, private modalService: BsModalService, private route: ActivatedRoute) {
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
  selectedDate;
  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.selectedDate = new Date();
    // this.route
    // this.loadItems();
    debugger;
    this.loadItems();
  }

  loadItems() {
    this.holidayService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((res: any) => {
      // loadItems
      // debugger;
      this.holidays = res.data;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }


  updateModel(model) {
    debugger;
    if (this.isNew) {

      this.holidayService.create(model).subscribe((response: any) => {
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
      this.holidayService.update(model).subscribe((response: any) => {
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
