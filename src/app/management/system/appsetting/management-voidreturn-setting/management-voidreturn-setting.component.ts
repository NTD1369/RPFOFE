import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SVoidOrderSetting } from 'src/app/_models/voidordersetting';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { VoidreturnsettingService } from 'src/app/_services/system/voidreturnsetting.service';

@Component({
  selector: 'app-management-voidreturn-setting',
  templateUrl: './management-voidreturn-setting.component.html',
  styleUrls: ['./management-voidreturn-setting.component.scss']
})
export class ManagementVoidreturnSettingComponent implements OnInit {


  items: SVoidOrderSetting[];

  userParams: any = {};
  modalRef: BsModalRef;
  item: SVoidOrderSetting;
  isNew: boolean = false;
  lguAdd: string = "Add";


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

  openModal(isNew: boolean, item: SVoidOrderSetting, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.item = new SVoidOrderSetting();
    }
    else {
      this.item = item;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  functionId = "Adm_VoidReturnSetting";
  constructor(private voidreturnsettingService: VoidreturnsettingService, private alertify: AlertifyService, private router: Router, private authService: AuthService,
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
  selectedDate;
  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.selectedDate = new Date();

    debugger;

    this.loadItems();
  }

  loadItems() {
    this.voidreturnsettingService.getAll().subscribe((response: any) => {
      if (response.success) {
        this.items = response.data;
        // result = response.data;
      }
      else {
        this.alertify.warning(response.message);
      }

    }, error => {
      this.alertify.error(error);
    });
  }

  getItem(item: SVoidOrderSetting) {

  }

  updateModel(model) {
    debugger;
    if (this.isNew) {

      this.voidreturnsettingService.create(model).subscribe((response: any) => {
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
      this.voidreturnsettingService.update(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Update completed successfully.');
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

  }

}
