import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MLicensePlate } from 'src/app/_models/LicensePlate';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { LicensePlateService } from 'src/app/_services/data/LicensePlate.service';
import { LicensePlateLine } from 'src/app/_models/licensePlatemodel';

@Component({
  selector: 'app-shop-search-license-plate',
  templateUrl: './shop-search-license-plate.component.html',
  styleUrls: ['./shop-search-license-plate.component.scss']
})
export class ShopSearchLicensePlateComponent implements OnInit {

  @Output() dataSelected = new EventEmitter<any[]>();
  @Input() key:string ='';
  LicensePlates: LicensePlateLine[];
  userParams: any = {};
  modalRef: BsModalRef;
  LicensePlate: LicensePlateLine;
  isNew: boolean = false;
  lguAdd: string = "Add";

  openModal(isNew: boolean, LicensePlate: LicensePlateLine, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.LicensePlate = new LicensePlateLine();
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
    debugger;
    this.LicensePlateService.Search(this.authService.getCurrentInfor().companyCode, this.key).subscribe((response: any) => {
      if (response.success) {
        debugger;
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
  selected(data) {
    console.log("data count", data);
    // this.modalRef.hide();
    this.dataSelected.emit(data);
  }
  @ViewChild('template', { static: false }) template;
}
