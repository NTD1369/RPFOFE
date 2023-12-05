import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MRole } from 'src/app/_models/mrole';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { RoleService } from 'src/app/_services/system/role.service';

@Component({
  selector: 'app-management-role',
  templateUrl: './management-role.component.html',
  styleUrls: ['./management-role.component.scss']
})
export class ManagementRoleComponent implements OnInit {

  modalRef: BsModalRef;
  roles: MRole[];
  pagination: Pagination;
  userParams: any = {};
  role: any={};
  lguAdd: string = "Add";

  constructor(private roleService: RoleService, private alertify: AlertifyService, private router: Router, private authService:AuthService,
    private modalService: BsModalService, private route: ActivatedRoute) {
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
    functionId="Adm_Role";
  ngOnInit() {
    // this.route
    // this.loadItems();
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    this.route.data.subscribe(data => {
      debugger;
      this.roles = data['items'].result;
      this.pagination = data['items'].pagination;
      // debugger;
      
    this.userParams.keyword = ''; 
    this.userParams.orderBy = 'byName';

      // data['items']
    });
  }
  openModal(isNew: boolean, role: MRole, template: TemplateRef<any>) {
    debugger;
    if(isNew)
    {
      this.role = new MRole();
    }
    else
    {
      this.role = role;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title', 
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
 
  }
  filterBy(txtFilter: any)
  {
    debugger;
    this.userParams.keyword = txtFilter;
    this.loadItemPagedList();
  }
  pageChanged(event: any): void
  {
    this.pagination.currentPage = event.page;
     this.loadItemPagedList();
  }
  loadItems() {
    this.roleService.getItemPagedList().subscribe((res: PaginatedResult<MRole[]>) => {
      // loadItems
      // debugger;
      this.roles = res.result;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
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

  loadItemPagedList() {
    this.roleService.getItemPagedList(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<MRole[]>) => {
        debugger;
        this.roles = res.result;
        this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }
  getItem(role: MRole)
  {
    debugger;
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
    //  this.router.navigate(["admin/roles/", role.roleId]);
    
  }
  updateRole(role: MRole) {
    if(role.roleId===null || role.roleId === undefined)
    {
      debugger; 
      role.companyCode = this.authService.storeSelected().companyCode;
      role.createdBy = this.authService.decodeToken?.unique_name ;
      this.roleService.create(role).subscribe((response: any) => {
        if(response.success)
        {
          this.alertify.success('Created successfully completed.'); 
          this.loadItemPagedList();
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
      role.companyCode = this.authService.storeSelected().companyCode;
      role.modifiedBy = this.authService.decodeToken?.unique_name ;
      this.roleService.update(role).subscribe((response: any) => {
        if(response.success)
        {
          this.alertify.success('Updated successfully completed.'); 
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
