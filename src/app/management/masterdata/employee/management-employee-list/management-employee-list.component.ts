import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MEmployee } from 'src/app/_models/employee';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { AuthService } from 'src/app/_services/auth.service';
import { EmployeeService } from 'src/app/_services/data/employee.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-employee-list',
  templateUrl: './management-employee-list.component.html',
  styleUrls: ['./management-employee-list.component.scss']
})
export class ManagementEmployeeListComponent implements OnInit {

  lguAdd: string = "Add";
  employees: MEmployee[];
  pagination: Pagination;
  userParams: any = {};
  modalRef: BsModalRef;
  employee: MEmployee;
  isNew: boolean = false;
  functionId = "Adm_EmployeesSetup";
  openModal(isNew: boolean, employee: MEmployee, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.employee = new MEmployee();
      this.employee.companyCode = this.authService.getCurrentInfor().companyCode;
      setTimeout(() => {
        this.modalRef = this.modalService.show(template, {
          ariaDescribedby: 'my-modal-description',
          ariaLabelledBy: 'my-modal-title',
          class: 'modal-dialog modal-dialog-centered modal-sm'
        });
      });
    }
    else {
      this.employeeService.getItem(this.authService.getCurrentInfor().companyCode, employee.employeeId).subscribe((response: any) => {
        // loadItems
        // debugger;
        if (response.success) {
  
          this.employee = response.data;
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
        // this.employees = res;
        // console.log(this.items);
        // console.log(this.items);
      }, error => {
        this.alertify.error(error);
      });
      // this.employee = employee;
    }
   

  }
  constructor(private employeeService: EmployeeService, private alertify: AlertifyService, private authService: AuthService,
    private router: Router, private modalService: BsModalService, private route: ActivatedRoute) {
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
    // , this.authService.getCurrentInfor().username
    this.employeeService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      // loadItems
      // debugger;
      if (response.success) {

        this.employees = response.data;
      }
      // this.employees = res;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
  loadItemPagedList() {
    this.employeeService.getItemPagedList(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<MEmployee[]>) => {
        debugger;
        this.employees = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }
  getItem(item: MEmployee) {
    this.employeeService.getItem(this.authService.getCurrentInfor().companyCode, item.employeeId).subscribe((response: any) => {
      // loadItems
      // debugger;
      if (response.success) {

        this.employees = response.data;
      }
      else
      {
        this.alertify.warning(response.message);
      }
      // this.employees = res;
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

      this.employeeService.create(model).subscribe((response: any) => {
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
      this.employeeService.update(model).subscribe((response: any) => {
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
