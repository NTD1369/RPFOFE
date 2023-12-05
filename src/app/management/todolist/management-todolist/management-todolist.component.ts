import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SToDoList } from 'src/app/_models/company copy';
import { MCustomer } from 'src/app/_models/customer';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { TodolistService } from 'src/app/_services/data/todolist.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-todolist',
  templateUrl: './management-todolist.component.html',
  styleUrls: ['./management-todolist.component.css']
})
export class ManagementTodolistComponent implements OnInit {

  functionId = "Adm_ToDoList";
  list: SToDoList[]; 
  userParams: any = {};
  modalRef: BsModalRef;
  model: SToDoList;
  isNew:boolean = false;
  lguAdd: string = "Add";
 
  openModal(isNew: boolean, model: SToDoList, template: TemplateRef<any>) {
    // debugger;
    this.isNew = isNew;
    if(isNew)
    {
      this.model = new SToDoList();
  
    }
    else
    {
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
  storeSelected: MStore;
  constructor(private todolistService: TodolistService, private alertify: AlertifyService, private authService: AuthService,
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
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    // this.selectedDate = new Date();
    this.storeSelected = this.authService.storeSelected();
    // this.route
    // this.loadItems();
    // debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.customers = data['customers'].result; 
      
    // // this.userParams.keyword = ''; 
    // // this.userParams.orderBy = 'byName';

    //   // data['items']
    // });
    this.loadItems();
    this.canView = this.checkPermission('','V');
  }
   
  loadItems() {
    
    this.todolistService.getAll('','','','','','','','','','','').subscribe((res: any) => {
      // loadItems
      // debugger;
      if(res.success)
      {
        this.list = res;
      }
      else
      {
        this.alertify.warning(res.message);
      }
      
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
   
  getItem(item: MCustomer)
  {
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
    //  this.router.navigate(["admin/masterdata/item", item.itemCode]);
  }
 
  @ViewChild('template' , { static: false}) template;  
  show=false;
  checkPermission(controlId: string, permission: string): boolean
  { 
    return this.authService.checkRole(this.functionId , controlId, permission );
  }
  canView= false;
  onToolbarPreparing(e) {
    if(this.checkPermission('','I'))
    {
      e.toolbarOptions.items.unshift( {
              location: 'before',
              widget: 'dxButton',
              options: {
                  width: 136, 
                  icon:"add", type:"default", text: this.lguAdd,
                  onClick: this.openModal.bind(this, true, null, this.template)
              } 
          });
      }
  }

  updateModel(model) {
    // debugger; 
    if(this.isNew)
    {
     
 
      model.createdBy = this.authService.decodeToken?.unique_name ;
      this.todolistService.create(model).subscribe((response: any) => {
        if(response.success)
        {
          this.alertify.success('Create completed successfully'); 
          this.loadItems();
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
  
      
      model.modifiedBy = this.authService.decodeToken?.unique_name ;
      this.todolistService.update(model).subscribe((response: any) => {
        if(response.success)
        {
          this.alertify.success('Update completed successfully.'); 
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
