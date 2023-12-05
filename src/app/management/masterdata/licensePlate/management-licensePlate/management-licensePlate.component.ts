import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { listenerCount } from 'process';
import { MLicensePlate } from 'src/app/_models/LicensePlate';
import { AuthService } from 'src/app/_services/auth.service';
import { LicensePlateService } from 'src/app/_services/data/LicensePlate.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-licensePlate',
  templateUrl: './management-licensePlate.component.html',
  styleUrls: ['./management-licensePlate.component.scss']
})
export class ManagementLicensePlateComponent implements OnInit {

  functionId = "Adm_LicensePlate";

  LicensePlates: MLicensePlate[];
  userParams: any = {};
  modalRef: BsModalRef;
  LicensePlate: MLicensePlate;
  isNew: boolean = false;
  lguAdd: string = "Import";

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
  @ViewChild('template' , { static: false}) template;  
  onToolbarPreparing(e) {
  debugger
    e.toolbarOptions.items.unshift( {
            location: 'before',
            widget: 'dxButton',
            options: {
                width: 136, 
                icon:"Import", type:"default", text:this.lguAdd,
                onClick: this.openModalImport(this.template)
            } 
        });
}
  openModalImport(  template: TemplateRef<any>) {
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

  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
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
}
