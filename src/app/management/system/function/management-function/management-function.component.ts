import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'; 
import { MFunction } from 'src/app/_models/mfunction';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { FunctionService } from 'src/app/_services/system/function.service';
// import { Node, Options } from "ng-material-treetable";
@Component({
  selector: 'app-management-function',
  templateUrl: './management-function.component.html',
  styleUrls: ['./management-function.component.scss']
})
export class ManagementFunctionComponent implements OnInit {

   
  files5: any;
  cols: any[];
  isNew= false;
  modalRef: BsModalRef;
  functions: MFunction[];
  pagination: Pagination;
  userParams: any = {};
  function: any={};
  constructor(private authService: AuthService, private functionService: FunctionService, private alertify: AlertifyService, private router: Router,
    private modalService: BsModalService, private route: ActivatedRoute) { }

  ngOnInit() {
    
    this.loadFunction();
    // debugger;
   

  }
  loadFunction()
  {
    this.functionService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      if(response.success)
      {
        this.files5 = response.data;
        console.log(this.files5);
        debugger;
        this.cols = [
          { field: 'functionId', header: 'FunctionId' },
          { field: 'name', header: 'Name' },
          { field: 'url', header: 'Url' },
          { field: 'status', header: 'Status' }
        ];
      }
      else{
        this.alertify.error(response.message);
      } 
     
    });
  }
  openModal(isNew: boolean, func: any, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if(isNew)
    { 
      this.function = new MFunction();
    }
    else
    {
      this.function = func;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title', 
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
 
  }
     
  
  updateFunction(func: MFunction) {
    if(this.isNew)
    {
      debugger; 
      this.functionService.create(func).subscribe((response: any) => {
        if(response.success)
        {
          this.alertify.success('Function create completed successfully'); 
          this.loadFunction();
          this.modalRef.hide();
        }
        else{
          this.alertify.error(response.message);
        } 
      }, error => {
        this.alertify.error(error);
      });
    }
    else{
      this.functionService.update(func).subscribe((response: any) => {
        if(response.success)
        {
          this.alertify.success('Function update completed successfully.'); 
          this.modalRef.hide();
        }
        else{
          this.alertify.error(response.message);
        }
       
      }, error => {
        this.alertify.error(error);
      });
    }
   
  }
}

export interface Task {
  name: string;
  completed: boolean;
  owner: string;
}
