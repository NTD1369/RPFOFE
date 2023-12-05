import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MCustomerGroup } from 'src/app/_models/customer';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { CustomergroupService } from 'src/app/_services/data/customergroup.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-customer-group-list',
  templateUrl: './management-customer-group-list.component.html',
  styleUrls: ['./management-customer-group-list.component.scss']
})
export class ManagementCustomerGroupListComponent implements OnInit {
  functionId = "Adm_CustomerGroup";
  customersGroups: MCustomerGroup[];
  userParams: any = {};
  modalRef: BsModalRef;
  customerGroup: MCustomerGroup;
  isNew: boolean = false;
  lguAdd: string = "Add";

  openModal(isNew: boolean, customerGroup: MCustomerGroup, template: TemplateRef<any>) {
    // debugger;
    this.isNew = isNew;
    console.log("isNew", this.isNew);
    if (isNew) {
      this.customerGroup = new MCustomerGroup();
      this.customerGroup.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else {
      this.customerGroup = customerGroup;
      console.log("customerGroup", this.customerGroup);
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  storeSelected: MStore;
  constructor(private customerGroupService: CustomergroupService, private alertify: AlertifyService, private authService: AuthService,
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


  customizeText(e) {
    // debugger;
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  selectedDate;
  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.storeSelected = this.authService.storeSelected();

    this.loadItems();
    this.canView = this.checkPermission('', 'V');
  }

  loadItems() {

    this.customerGroupService.getAll(this.storeSelected.companyCode).subscribe((response: any) => {
      // loadItems
      // debugger;
      if (response.success) {
        this.customersGroups = response.data;
      }
      else {
        this.alertify.warning(response.message)
      }

    }, error => {
      this.alertify.error(error);
    });
  }

  @ViewChild('template', { static: false }) template;
  show = false;
  checkPermission(controlId: string, permission: string): boolean {
    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  canView = false;


  onToolbarPreparing(e) {

    if (this.checkPermission('', 'I')) {
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

  updateModel(model) {
    debugger; 
    if (this.isNew) {
      let store = this.authService.storeSelected();
      // debugger;
      //  model.storeId = store.storeId;
      model.companyCode = store.companyCode;
      model.createdBy = this.authService.decodeToken?.unique_name;
      this.customerGroupService.create(model).subscribe((response: any) => {
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
      let store = this.authService.storeSelected();
      // debugger;
      //  model.storeId = store.storeId;
      model.companyCode = store.companyCode;
      model.modifiedBy = this.authService.decodeToken?.unique_name;
      this.customerGroupService.update(model).subscribe((response: any) => {
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


}
