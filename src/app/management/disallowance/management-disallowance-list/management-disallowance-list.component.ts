import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SClientDisallowance } from 'src/app/_models/clientDisallowance';
import { Pagination } from 'src/app/_models/pagination';
import { AuthService } from 'src/app/_services/auth.service';
import { ClientDisallowanceService } from 'src/app/_services/data/client-disallowance.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-disallowance-list',
  templateUrl: './management-disallowance-list.component.html',
  styleUrls: ['./management-disallowance-list.component.css']
})
export class ManagementDisallowanceListComponent implements OnInit {

  constructor(public authService: AuthService,  private alertify: AlertifyService,  private modalService: BsModalService, private disallowanceService: ClientDisallowanceService) { 
    const lgu = localStorage.getItem('language');
    if (lgu === "vi") {
      this.lguAdd = "Thêm";
    } else if (lgu === "en") {
      this.lguAdd = "Add";
    } else {
      console.log("error");
    }
  }
  lguAdd: string = "Add";
  ngOnInit() {
    this.loadData();
  }
  
  list=[];
  initDataCompleted = false;
  functionId = "Adm_ClientDisallowance";
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
  modalRef: BsModalRef;
  model: SClientDisallowance;
  pagination: Pagination;
  userParams: any = {};
  isNew: boolean = false;
  openModal(isNew: boolean, model: SClientDisallowance, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.model = new SClientDisallowance();
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

  updateModel(model) {
    debugger;
    if (this.isNew) {
      model.createdBy = this.authService.getCurrentInfor().username; 
      this.disallowanceService.create(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Create completed successfully');
          this.loadData();
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
      model.modifiedBy = this.authService.getCurrentInfor().username;
      this.disallowanceService.update(model).subscribe((response: any) => {
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


  loadData()
  {
    this.disallowanceService.getAll(this.authService.storeSelected().companyCode,'','','','').subscribe((response: any)=>{
      if(response.success)
      {
          this.list= response.data;
      }
      else
      {
        Swal.fire('Disallowance', response.message ,'warning');
      }
    }, error =>{
      Swal.fire('Disallowance', "Can't get disallowance data",'error');
    })
  }
}
