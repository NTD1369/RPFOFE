import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { MPaymentMethod } from 'src/app/_models/paymentmethod';
import { SFormatConfig } from 'src/app/_models/sformatconfig';
import { AuthService } from 'src/app/_services/auth.service';
import { FormatconfigService } from 'src/app/_services/data/formatconfig.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-format-list',
  templateUrl: './management-format-list.component.html',
  styleUrls: ['./management-format-list.component.scss']
})
export class ManagementFormatListComponent implements OnInit {

  formats: SFormatConfig[];
  pagination: Pagination;
  userParams: any = {};
  modalRef: BsModalRef;
  format: SFormatConfig;
  isNew: boolean = false;
  functionId = "Adm_FormatConfig";
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

  openModal(isNew: boolean, format: SFormatConfig, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.format = new SFormatConfig();
      this.format.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else {
      this.format = format;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  constructor(private formatService: FormatconfigService, private alertify: AlertifyService, private authService: AuthService,
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
    else {
      this.selectedDate = new Date();
      // this.route
      // this.loadItems();
      debugger;
      // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
      // this.loadItemPagedList();
      this.route.data.subscribe(data => {
        debugger;
        this.formats = data['formats'].result;
        this.pagination = data['formats'].pagination;
        // debugger;

        this.userParams.keyword = '';
        this.userParams.orderBy = 'byName';

        // data['items']
      });
    }

  }
  filterBy(txtFilter: any) {
    debugger;
    this.userParams.keyword = txtFilter;
    this.loadItemPagedList();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadItemPagedList();
  }
  loadItems() {
    this.formatService.getItemPagedList().subscribe((res: PaginatedResult<SFormatConfig[]>) => {
      // loadItems
      // debugger;
      this.formats = res.result;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
  loadItemPagedList() {
    this.formatService.getItemPagedList(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<SFormatConfig[]>) => {
        debugger;
        this.formats = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }
  getItem(item: MPaymentMethod) {
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
    //  this.router.navigate(["admin/masterdata/item", item.itemCode]);
  }

  updateModel(model) {
    debugger;
    if (this.isNew) {

      this.formatService.create(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Create completed successfully');
          this.loadItemPagedList();
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
      this.formatService.update(model).subscribe((response: any) => {
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
