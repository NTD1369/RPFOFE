import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { MPaymentMethod } from 'src/app/_models/paymentmethod';
import { MStore } from 'src/app/_models/store';
import { StorePaymentViewModel } from 'src/app/_models/viewmodel/storepayment';
import { AuthService } from 'src/app/_services/auth.service';
import { PaymentmethodService } from 'src/app/_services/data/paymentmethod.service';
import { StorePaymentService } from 'src/app/_services/data/store-payment.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-store-payment-setting',
  templateUrl: './management-store-payment-setting.component.html',
  styleUrls: ['./management-store-payment-setting.component.scss']
})
export class ManagementStorePaymentSettingComponent implements OnInit {

  // @Input() store: MStore;

  payments: StorePaymentViewModel[];
  pagination: Pagination;
  userParams: any = {};
  modalRef: BsModalRef;
  payment: StorePaymentViewModel;
  isNew: boolean = false;
  lguAdd: string = "Add";

  openModal(isNew: boolean, payment: StorePaymentViewModel, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.payment = new StorePaymentViewModel();
      this.payment.companyCode = this.authService.getCurrentInfor().companyCode;
      this.payment.storeId = this.storeId;
    }
    else {
      this.payment = payment;
      this.payment.storeId = this.storeId;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  storeSlected: MStore;
  constructor( private storePaymentService: StorePaymentService, private alertify: AlertifyService, private authService: AuthService,
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
    this.storeSlected = this.authService.storeSelected();
    this.route.params.subscribe(data => {
      this.storeId = data['storeid'];
    })
    // this.payment.s
    debugger;
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.payments =  data['payments'].result;
    //   console.log(this.payments);
    //   // if(data['payments'].success)
    //   // {

    //   // }
    //   // else{
    //   //   this.alertify.error(data['payments'].message);
    //   // }

    // });
    // this.loadItemPagedList();
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.payments = data['payments'].data;
    //   // this.pagination = data['payments'].pagination;
    //   // debugger;

    //   this.userParams.keyword = '';
    //   this.userParams.orderBy = 'byName';
    //   this.userParams.storeid = this.storeId;
    //   // data['items']
    // });
    this.loadItemPagedList();
  }

  @ViewChild('template', { static: false }) template;
  onToolbarPreparing(e) {
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

  filterBy(txtFilter: any) {
    debugger;
    this.userParams.keyword = txtFilter;
    this.loadItemPagedList();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadItemPagedList();
  }
  functionId = "Adm_StorePaymentSetup";
  // loadItems() {
  //   this.paymentService.getByStorePagedList(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams).subscribe((res: any) => {
  //     // loadItems
  //     debugger;
  //     // if(res.)
  //     // PaginatedResult<MPaymentMethod[]>
  //     // this.payments = res.result;
  //     // console.log(this.items);
  //     // console.log(this.items);
  //   }, error => {
  //     this.alertify.error(error);
  //   });
  // }
  storeId;
  loadItemPagedList() {
    debugger;

    this.userParams.store = this.storeId;
    this.storePaymentService.getByStore(this.storeSlected.companyCode, this.storeId, '' , true)
      .subscribe((response: any) => {
        debugger;
        if (response.success) {
          this.payments = response.data;
        }

        // this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }
  getItem(item: MPaymentMethod) {
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
    //  this.router.navigate(["admin/masterdata/item", item.itemCode]);
  }
  checkPermission(controlId: string, permission: string): boolean {

    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  deleteData(model: StorePaymentViewModel) {
    debugger;
    if(this.checkPermission("","E"))
    {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.storePaymentService.delete(this.storeId, model.paymentCode).subscribe((response: any) => {
            if (response.success) {
              this.alertify.success('Delete completed successfully.');
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
      });
    }
    else
    {
      this.alertify.error("Permission Denied");
      
    }
   
  }

  applyData(model) {
    debugger;
    if(this.checkPermission("","I"))
    {
      var item = Object.assign({}, model);  item.status = 'A';
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to Apply!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.storePaymentService.create(item).subscribe((response: any) => {
            if (response.success) {
              this.alertify.success('Apply completed successfully.');
              this.loadItemPagedList();
              // this.modalRef.hide();
  
            }
            else {
              this.alertify.error(response.message);
            }
  
          }, error => {
            this.alertify.error(error);
          });
        }
      });
    }
    else
    {
      this.alertify.error("Permission Denied");
      
    }
   
  }


  updateModel(model) {
    debugger;
    if (this.isNew) {
      // model.storeId = this.storeId;
      this.storePaymentService.create(model).subscribe((response: any) => {
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
      // model.storeId = this.storeId;
      this.storePaymentService.update(model).subscribe((response: any) => {
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
