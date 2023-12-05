import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MEmployee } from 'src/app/_models/employee';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { MStoreCurrency } from 'src/app/_models/storecurrency';
import { AuthService } from 'src/app/_services/auth.service';
import { StorecurrencyService } from 'src/app/_services/data/storecurrency.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-store-currency',
  templateUrl: './management-store-currency.component.html',
  styleUrls: ['./management-store-currency.component.scss']
})
export class ManagementStoreCurrencyComponent implements OnInit {


  list: MStoreCurrency[];
  pagination: Pagination;
  userParams: any = {};
  modalRef: BsModalRef;
  model: MStoreCurrency;
  isNew: boolean = false;
  functionId = "Adm_StoreCurrency";
  lguAdd: string = "Add";

  openModal(isNew: boolean, model: MStoreCurrency, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.model = new MStoreCurrency();
      this.model.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else {
      this.model = model;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  constructor(private storecurrencyService: StorecurrencyService, private alertify: AlertifyService, private authService: AuthService,
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
    this.selectedDate = new Date();
    // this.route
    this.loadItems();
    debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.employees = data['employees'].result;
    //   this.pagination = data['employees'].pagination;
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
    this.storecurrencyService.getAll(this.authService.getCurrentInfor().companyCode, '').subscribe((res: any) => {
      // loadItems
      // debugger;
      if (res.success) {
        this.list = res;
      }
      else {
        this.alertify.warning(res.message);
      }

      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
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

  updateModel(model) {
    debugger;
    if (this.isNew) {

      this.storecurrencyService.create(model).subscribe((response: any) => {
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
      this.storecurrencyService.update(model).subscribe((response: any) => {
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
