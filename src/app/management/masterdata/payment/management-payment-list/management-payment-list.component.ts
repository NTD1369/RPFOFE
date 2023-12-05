import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { MPaymentMethod } from 'src/app/_models/paymentmethod';
import { AuthService } from 'src/app/_services/auth.service';
import { PaymentmethodService } from 'src/app/_services/data/paymentmethod.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-payment-list',
  templateUrl: './management-payment-list.component.html',
  styleUrls: ['./management-payment-list.component.scss']
})
export class ManagementPaymentListComponent implements OnInit {

  lguAdd: string = "Add";
  payments: MPaymentMethod[];
  pagination: Pagination;
  userParams: any = {};
  modalRef: BsModalRef;
  payment: MPaymentMethod;
  isNew: boolean = false;

  openModal(isNew: boolean, payment: MPaymentMethod, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.payment = new MPaymentMethod();
      this.payment.companyCode = this.authService.getCurrentInfor().companyCode;
      setTimeout(() => {
        this.modalRef = this.modalService.show(template, {
          ariaDescribedby: 'my-modal-description',
          ariaLabelledBy: 'my-modal-title',
          class: 'modal-dialog modal-dialog-centered modal-sm'
        });
      });
    }
    else {
    
      this.paymentService.getItem(payment.companyCode, '', payment.paymentCode).subscribe((response: any) =>{
        if(response.success)
        {
          this.payment = response.data;
          setTimeout(() => {
            this.modalRef = this.modalService.show(template, {
              ariaDescribedby: 'my-modal-description',
              ariaLabelledBy: 'my-modal-title',
              class: 'modal-dialog modal-dialog-centered modal-sm'
            });
          });
        }
        else
        {
          this.alertify.warning(response.message);
        }
      })
    
    }
   

  }
  constructor(private paymentService: PaymentmethodService, private alertify: AlertifyService, private authService: AuthService,
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
  functionId = "Adm_PaymentMaster";
  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.selectedDate = new Date();
    // this.route
    this.loadItems();
    // debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.payments = data['payments'].result;
    //   this.pagination = data['payments'].pagination;
    //   // debugger;

    // this.userParams.keyword = ''; 
    // this.userParams.orderBy = 'byName';

    //   // data['items']
    // });
  }
  // filterBy(txtFilter: any)
  // {
  //   debugger;
  //   this.userParams.keyword = txtFilter;
  //   this.loadItemPagedList();
  // }
  // pageChanged(event: any): void
  // {
  //   this.pagination.currentPage = event.page;
  //    this.loadItemPagedList();
  // }
  loadItems() {
    this.paymentService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      // loadItems
      // debugger;
      if (response.success) {
        this.payments = response.data;
      }
      else {
        this.alertify.warning(response.message);
      }

      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
  // loadItemPagedList() {
  //   this.paymentService.getItemPagedList(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
  //     .subscribe((res: PaginatedResult<MPaymentMethod[]>) => {
  //       debugger;
  //       this.payments = res.result;
  //       this.pagination = res.pagination;
  //   }, error => {
  //     this.alertify.error(error);
  //   });
  // }
  getItem(item: MPaymentMethod) {
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
    //  this.router.navigate(["admin/masterdata/item", item.itemCode]);
  }

  updateModel(model) {
    debugger;
    if (this.isNew) {

      this.paymentService.create(model).subscribe((response: any) => {
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
      this.paymentService.update(model).subscribe((response: any) => {
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
