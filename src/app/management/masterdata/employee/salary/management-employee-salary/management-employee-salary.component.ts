import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MEmployeeSalary } from 'src/app/_models/salestarget';
import { AuthService } from 'src/app/_services/auth.service';
import { EmployeeSalaryService } from 'src/app/_services/data/employee-salary.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-employee-salary',
  templateUrl: './management-employee-salary.component.html',
  styleUrls: ['./management-employee-salary.component.scss']
})
export class ManagementEmployeeSalaryComponent implements OnInit {

  constructor(private salaryService: EmployeeSalaryService, private alertify: AlertifyService, public authService: AuthService,
    private router: Router, private modalService: BsModalService, private route: ActivatedRoute) { }


  salaryList: MEmployeeSalary[] = [];
  loadSalary()
  {
    let currentInfor = this.authService.getCurrentInfor();
    this.salaryService.getItems(currentInfor.companyCode, '','','','','Current').subscribe((response: any)=>
    {
      if(response.success)
      {
         this.salaryList = response.data;
      }
      else
      {
        this.alertify.warning(response.message);
      }
    });
  }
  functionId = "Adm_EmployeeSalary";
  canView = false;
  canAdd = false;
  canEdit = false;
  model: MEmployeeSalary;
  isNew: boolean = false;
  modalRef: BsModalRef;
 
  openModal(isNew: boolean, model: MEmployeeSalary, template: TemplateRef<any>) {
    debugger;
    this.model = model;

    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
    // this.isNew = isNew;
    // if (isNew) {
    //   this.model = new MEmployeeSalary();
    //   this.model.companyCode = this.authService.getCurrentInfor().companyCode;
    //   setTimeout(() => {
    //     this.modalRef = this.modalService.show(template, {
    //       ariaDescribedby: 'my-modal-description',
    //       ariaLabelledBy: 'my-modal-title',
    //       class: 'modal-dialog modal-dialog-centered modal-sm'
    //     });
    //   });
    // }
    // else {
    //   this.salaryService.getItems(this.authService.getCurrentInfor().companyCode, model.employeeId, '','','','').subscribe((response: any) => { 
    //     if (response.success) {  
    //       setTimeout(() => {
    //         this.modalRef = this.modalService.show(template, {
    //           ariaDescribedby: 'my-modal-description',
    //           ariaLabelledBy: 'my-modal-title',
    //           class: 'modal-dialog modal-dialog-centered modal-sm'
    //         });
    //       });
    //     }
    //     else
    //     {
    //       this.alertify.warning(response.message);
    //     }
       
    //   }, error => {
    //     this.alertify.error(error);
    //   });
       
    // }
   

  }
  ngOnInit() {
    // this.canView = this.authService.permissions()
    this.canView = this.authService.checkRole(this.functionId, '', 'V');
    this.canAdd = this.authService.checkRole(this.functionId, '', 'I');
    this.canEdit = this.authService.checkRole(this.functionId, '', 'E');
    if(!this.canView)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.loadSalary();
  }

}
