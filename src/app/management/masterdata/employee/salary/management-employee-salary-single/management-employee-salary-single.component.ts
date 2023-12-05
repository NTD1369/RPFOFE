import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MEmployeeSalary } from 'src/app/_models/salestarget';
import { AuthService } from 'src/app/_services/auth.service';
import { EmployeeSalaryService } from 'src/app/_services/data/employee-salary.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-employee-salary-single',
  templateUrl: './management-employee-salary-single.component.html',
  styleUrls: ['./management-employee-salary-single.component.scss']
})
export class ManagementEmployeeSalarySingleComponent implements OnInit {

  @Input() modelInput: MEmployeeSalary ; 
  constructor(private salaryService: EmployeeSalaryService, private alertify: AlertifyService, public authService: AuthService,
    private router: Router, private modalService: BsModalService, private route: ActivatedRoute) { }


  salaryList: MEmployeeSalary[] = [];
  loadSalary()
  {
    let currentInfor = this.authService.getCurrentInfor();
    this.salaryService.getItems(currentInfor.companyCode, this.modelInput.employeeId ,'','','','').subscribe((response: any)=>
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
  remove(e)
  {
    debugger;
    let model = e.data;
    
    // this.store= this.getStoreModel(this.storeSelected);
    // model.storeId = this.storeSelected;
    this.salaryService.delete(model).subscribe((response: any)=>{
      if(response.success)
      {
          this.alertify.success("Delete completed successfully");
      }
      else{
        this.alertify.warning("Delete failed: " + response.message);
      }
   });
  }
  @ViewChild('template' , { static: false}) template;  
  // onToolbarPreparing(e) {
  //   e.toolbarOptions.items.unshift( {
  //     location: 'before',
  //     widget: 'dxButton',
  //     options: {
  //         width: 136, 
  //         icon:"add", type:"default",  
  //         onClick: this.openModal.bind(this, true, null, this.template)
  //     } 
  // });
   
  // }
  mode:string="";
  save(e) {
    debugger; 
    let model = e.changes[0].data;
    model.employeeId = this.modelInput.employeeId;
    model.companyCode = this.modelInput.companyCode;
    // model.storeId = this.model.storeId;
    model.createdBy = this.authService.getCurrentInfor().username;
    model.modifiedBy = this.authService.getCurrentInfor().username;
    model.companyCode = this.authService.getCurrentInfor().companyCode;
    // model.currency = this.model.currency;
    if(this.mode==='E')
    {
      // let check =  this.authService.checkRole(this.functionId , '', 'E' );
      // if(check===true)
      // {
        this.salaryService.update(model).subscribe((response: any)=>{
          if(response.success)
          {
              this.alertify.success("update completed successfully");
              // this.selectCounter(this.counterId);
          }
          else{
            this.alertify.warning("update failed: " + response.message);
          }
       });
      // }
      // else
      // {
      //   this.alertify.success("Permission denied");
      // }
       
    }
    else
    {
      // let check =  this.authService.checkRole(this.functionId , '', 'I' );
      // if(check===true)
      // {
        this.salaryService.create(model).subscribe((response: any)=>{
          debugger;
          if(response.success)
          {
              this.alertify.success("insert completed successfully");
          }
          else{
            this.alertify.warning("insert failed: " + response.message);
          }
        });
     
    } 
  }
  openModal(isNew: boolean, model: MEmployeeSalary, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.model = new MEmployeeSalary();
      this.model.companyCode = this.authService.getCurrentInfor().companyCode;
      setTimeout(() => {
        this.modalRef = this.modalService.show(template, {
          ariaDescribedby: 'my-modal-description',
          ariaLabelledBy: 'my-modal-title',
          class: 'modal-dialog modal-dialog-centered modal-sm'
        });
      });
    }
    else {
      this.salaryService.getItems(this.authService.getCurrentInfor().companyCode, model.employeeId, '','','','').subscribe((response: any) => { 
        if (response.success) {  
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
       
      }, error => {
        this.alertify.error(error);
      });
      // this.employee = employee;
    }
   

  }
  ngOnInit() {
    // this.canView = this.authService.permissions()
    // this.canView = this.authService.checkRole(this.functionId, '', 'V');
    // this.canAdd = this.authService.checkRole(this.functionId, '', 'I');
    // this.canEdit = this.authService.checkRole(this.functionId, '', 'E');
    // if(!this.canView)
    // {
    //   this.router.navigate(["/admin/permission-denied"]);
    // }
    this.loadSalary();
  }
}
