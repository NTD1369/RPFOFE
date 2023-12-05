import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MUom } from 'src/app/_models/muom';
import { AuthService } from 'src/app/_services/auth.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { UomService } from 'src/app/_services/data/uom.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-test-uom',
  templateUrl: './test-uom.component.html',
  styleUrls: ['./test-uom.component.scss']
})
export class TestUomComponent implements OnInit {

  isNew: boolean = false;
  constructor(private modalService: BsModalService, private reportService: ReportService, private alertify: AlertifyService, private router: Router, public authService: AuthService,
    private uomService: UomService) { }
  dataList;

  ngOnInit() {
    this.loadItems();
  }
  loadItems() {
    this.uomService.getAll("CP001").subscribe((response: any) => {
      if (response.success) {
        this.dataList = response.data
        console.log("dataList", this.dataList);
      }
      else {
        console.log(this.alertify.warning);
      }
    })
  }


  modalRef: BsModalRef;
  uom: MUom;
  @ViewChild('template', { static: false }) template;
  onToolbarPreparing(e) {
    // if (this.authService.checkRole(this.functionId, '', 'I')) {
    // }
    e.toolbarOptions.items.unshift({
      location: 'before',
      widget: 'dxButton',
      options: {
        width: 136,
        icon: "add", type: "default", text: 'Add',
        onClick: this.openModal.bind(this, true, null, this.template)
      }
    });
  }
  updateModel(model) {
    if (this.isNew) {
      this.uomService.create(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Create completed successfully');
          this.modalRef.hide();
          this.loadItems();
        }
        else {
          this.alertify.error(response.message);
        }
      }, error => {
        this.alertify.error(error);
      });
    }
    else {
      this.uomService.update(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Create completed successfully');
          this.modalRef.hide();
          this.loadItems();
        }
        else {
          this.alertify.error(response.message);
        }
      }, error => {
        this.alertify.error(error);
      });
    }
  }
  openModal(isNew: boolean, uom: MUom, template: TemplateRef<any>) {
    this.isNew = isNew;
    if (isNew) {
      this.uom = new MUom();
    }
    else {
      this.uom = uom;
    }
    this.uom.companyCode = this.authService.getCurrentInfor().companyCode;
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  delele(model) {
    this.uomService.delete(model.uomCode).subscribe((response: any) => {
      if (response.success) {
        this.alertify.success('Create completed successfully');
        this.modalRef.hide();
        this.loadItems();
      }
      else {
        this.alertify.error(response.message);
      }
    }, error => {
      this.alertify.error(error);
    });
  }

}
