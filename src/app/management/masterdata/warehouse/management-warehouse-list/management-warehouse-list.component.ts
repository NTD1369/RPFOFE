import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { MWarehouse } from 'src/app/_models/warehouse';
import { AuthService } from 'src/app/_services/auth.service';
import { WarehouseService } from 'src/app/_services/data/warehouse.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-warehouse-list',
  templateUrl: './management-warehouse-list.component.html',
  styleUrls: ['./management-warehouse-list.component.scss']
})
export class ManagementWarehouseListComponent implements OnInit {

  functionId = "Adm_Warehouse";
  items: MWarehouse[];
  pagination: Pagination;
  userParams: any = {};
  isNew: boolean = false;
  lguAdd: string = "Add";

  constructor(private whsService: WarehouseService, private alertify: AlertifyService, private router: Router, private authService: AuthService,
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
    // this.loadItems();
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    this.route.data.subscribe(data => {
      debugger;
      this.items = data['whs'].result;
      this.pagination = data['whs'].pagination;
      // debugger;

      this.userParams.keyword = '';
      this.userParams.orderBy = 'byName';

      // data['items']
    });
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
    this.whsService.getItemPagedList().subscribe((res: PaginatedResult<MWarehouse[]>) => {
      // loadItems
      // debugger;
      this.items = res.result;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
  modalRef: BsModalRef;
  warehouse: MWarehouse;
  openModal(isNew: boolean, warehouse: MWarehouse, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.warehouse = new MWarehouse();
      this.warehouse.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else {
      this.warehouse = warehouse;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }

  updateModel(model) {
    debugger;
    if (this.isNew) {

      this.whsService.create(model).subscribe((response: any) => {
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
      this.whsService.update(model).subscribe((response: any) => {
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
  loadItemPagedList() {
    this.whsService.getItemPagedList(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<MWarehouse[]>) => {
        debugger;
        this.items = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }
  getItem(item: MWarehouse) {
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
    //  this.router.navigate(["admin/masterdata/item", item.itemCode]);
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
