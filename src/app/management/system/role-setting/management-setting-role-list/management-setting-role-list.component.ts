import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MRole } from 'src/app/_models/mrole';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { RoleService } from 'src/app/_services/system/role.service';

@Component({
  selector: 'app-management-setting-role-list',
  templateUrl: './management-setting-role-list.component.html',
  styleUrls: ['./management-setting-role-list.component.scss']
})
export class ManagementSettingRoleListComponent implements OnInit {

  
  roles: MRole[];
  pagination: Pagination;
  userParams: any = {};
  role: any={};
  constructor(private roleService: RoleService, public authService: AuthService, private alertify: AlertifyService, private router: Router,  private route: ActivatedRoute) { }
  functionId = "Adm_SettingRole";
  ngOnInit() {
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    else
    {
  // this.route
      // this.loadItems();
      debugger;
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
   
  loadItemPagedList() {
    this.roleService.getItemPagedList(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<MRole[]>) => {
        debugger;
        console.log("aaa", this.roles);
        // this.roles = res.result.filter(s => s.status);
        this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }
  getItem(role: MRole)
  {
    debugger;
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
     this.router.navigate(["admin/setting-roles/", role.roleId]);
    
  }

}
