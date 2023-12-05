import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { LicensePlateService } from 'src/app/_services/data/LicensePlate.service';
import { MLicensePlate } from 'src/app/_models/LicensePlate';


@Component({
  selector: 'app-management-licensePlate-view',
  templateUrl: './management-licensePlate-view.component.html',
  styleUrls: ['./management-licensePlate-view.component.css']
})
export class ManagementLicensePlateViewComponent implements OnInit {

  LicensePlates: MLicensePlate[];
  userParams: any = {};
  modalRef: BsModalRef;
  LicensePlate: MLicensePlate;
  isNew: boolean = false;
  lguAdd: string = "Add";

  openModal(isNew: boolean, LicensePlate: MLicensePlate, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.LicensePlate = new MLicensePlate();
      this.LicensePlate.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else {
      this.LicensePlate = LicensePlate;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  constructor(private LicensePlateService: LicensePlateService, private alertify: AlertifyService, public authService: AuthService,
    private router: Router, private modalService: BsModalService, private route: ActivatedRoute) {
    this.customizeText = this.customizeText.bind(this);
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
  @ViewChild('templateImport' , { static: false}) template1;  
  openModalImport() {
    setTimeout(() => {
      this.modalRef = this.modalService.show(this.template1, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  closeModalImport(){
    this.modalRef.hide();
    window.location.reload();
  }
  ngOnInit() {
    this.loadItems();

  }
  customizeText(e) {

    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  loadItems() {
    this.LicensePlateService.getAll(this.authService.getCurrentInfor().companyCode, '').subscribe((response: any) => {
      if (response.success) {
        this.LicensePlates = response.data;
        console.log(this.LicensePlates,"ssss");
      }
      else {
        this.alertify.warning(response.message);
      }

    }, error => {
      this.alertify.error(error);
    });
  }
  viewDetail(data: any) {
    debugger;
    this.router.navigate(["admin/masterdata/licensePlate/", 'e', data.transId]);
  }
}

