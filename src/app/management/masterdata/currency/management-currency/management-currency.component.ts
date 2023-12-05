import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MCurrency } from 'src/app/_models/currency';
import { Pagination } from 'src/app/_models/pagination';
import { AuthService } from 'src/app/_services/auth.service';
import { CurrencyService } from 'src/app/_services/data/currency.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-currency',
  templateUrl: './management-currency.component.html',
  styleUrls: ['./management-currency.component.scss']
})
export class ManagementCurrencyComponent implements OnInit {



  list: MCurrency[];
  pagination: Pagination;
  userParams: any = {};
  modalRef: BsModalRef;
  model: MCurrency;
  isNew: boolean = false;
  functionId = "Adm_OUTLETSETUP";
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

  openModal(isNew: boolean, model: MCurrency, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.model = new MCurrency();
      // this.model.companyCode = this.authService.getCurrentInfor().companyCode;
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
  constructor(private currencyService: CurrencyService, private alertify: AlertifyService, private router: Router, private authService: AuthService,
    private modalService: BsModalService, private route: ActivatedRoute) {
    this.customizeText = this.customizeText.bind(this);

    // Chuyển đổi ngôn ngữ
    const lgu = localStorage.getItem('language');
    console.log("lgu", lgu);
    if (lgu === "vi") {
      this.lguAdd = "Thêm";
    } else if (lgu === "en") {
      this.lguAdd = "Add";
    } else {
      console.log("error");
    }
  }
  customizeText(e) {

    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  selectedDate;
  ngOnInit() {
    debugger;
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.selectedDate = new Date();
    // this.route
    // this.loadItems();
    debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.items = data['stores'].result;
    //   this.pagination = data['stores'].pagination;
    //   // debugger;

    // this.userParams.keyword = ''; 
    // this.userParams.orderBy = 'byName';

    //   // data['items']
    // });
    this.loadItems();
  }

  loadItems() {
    this.currencyService.getAll().subscribe((res: any) => {
      // loadItems
      // debugger;
      if (res.success) {
        this.list = res.data;
      }
      else {
        this.alertify.warning(res.message);

      }
      // this.items = res.result;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }

  updateModel(model) {
    debugger;
    if (this.isNew) {

      this.currencyService.create(model).subscribe((response: any) => {
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
      this.currencyService.update(model).subscribe((response: any) => {
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
