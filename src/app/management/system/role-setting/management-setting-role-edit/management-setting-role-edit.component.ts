import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'; 
import { MFunction } from 'src/app/_models/mfunction';
import { MPermission } from 'src/app/_models/mpermission';
import { MRole } from 'src/app/_models/mrole';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { FunctionService } from 'src/app/_services/system/function.service';
import { PermissionService } from 'src/app/_services/system/permission.service';
import { RoleService } from 'src/app/_services/system/role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-setting-role-edit',
  templateUrl: './management-setting-role-edit.component.html',
  styleUrls: ['./management-setting-role-edit.component.scss']
})
export class ManagementSettingRoleEditComponent implements OnInit { 
  // functionList: MFunction[];
  functionList: any;
  cols: any[];
  selectedNodes: any;
  height: number;
  modalRef: BsModalRef; 
  roleList: MRole[];
  getHeight()  {
    this.height = window.innerHeight / 1.5;
  }
  loadRoleList()
  {
    this.roleService.getAll().subscribe((response: any) => {
      if(response.success)
      {
        this.roleList = response.data;
        if(this.roleList!==null && this.roleList!==undefined && this.roleList?.length>0)
        {
          this.roleList = this.roleList.filter(x=>x.roleId!==this.role.roleId);
        }
        
      }
      else
      {
        this.alertify.warning(response.message);
      }
    })
  }
  saveDefault(value)
  {
    debugger;
    let check =  this.authService.checkRole(this.functionId , '', 'E' );
    if(check)
    {
      let valueRoute = value;
      let models = this.functionRouteList.filter(x=>x.url === value);
      debugger;
      this.role.defaultScreen = value;
      if(models!==null && models!==undefined && models?.length > 0)
      {
        valueRoute = models[0]?.name +'(' + value + ')';
      }
      Swal.fire({
        title: 'Are you sure?',
        html: 'Do you want to set  <span style="font-weight:600;">' + valueRoute +'</span> is default screen?' ,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.roleService.update(this.role).subscribe((response: any) =>{
            if(response.success)
            {
               this.alertify.success("Update Successfully completed");
            }
            else
            {
              // this.alertify.warning(response.message);
              Swal.fire('Update Role', response.message, 'warning');
  
            }
        }, error =>{
          // Swal.fire('Update Role', response.message, 'warning');
          console.log('error Copy Role', error);
          Swal.fire('Update Role','Failed to update data','error');
        })
        }
      })
      
    }
    else
    {
      // this.alertify.warning("Can't update. B/c permission denied.");
      Swal.fire('Update Role',"Can't update. B/c permission denied.",'warning');

    }
   
  }
  copyMode = false;
  switchCopyMode(value)
  {
    this.copyMode= value; 
  }
  onToolbarPreparing(e)
  {
    e.toolbarOptions.items.unshift( 
        {
          location: 'before',
          template: 'switchCopyModeButton'
      });
  }
  saveCopy(value, event)
  {
    debugger;
    if(value?.length > 0)
    {
      let check =  this.authService.checkRole(this.functionId , '', 'E' );
      if(check)
      {
        let roleSelected = this.roleList.find(x=>x.roleId === value);//.roleName;
        let valueName = roleSelected?.roleName;
        Swal.fire({
          title: 'Do you want to apply permission?',
          html: 'from <span style="font-weight:600;">' +  (valueName??value) + '</span> to <span style="font-weight:600;">' + this.role.roleName + '</span>!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            let storeSelect = this.authService.storeSelected();
            let username = this.authService.getCurrentInfor().username;
            this.permissionService.CopyFromRole(storeSelect.companyCode,  value, this.roleId ,  username).subscribe((response: any) =>{
                if(response.success)
                {
                  //  this.alertify.success("Update Successfully completed");
                   Swal.fire('Copy Role','Update Successfully completed','success').then(()=>{
                      window.location.reload();
                   })
                }
                else
                {
                  // this.alertify.warning(response.message);
                  Swal.fire('Copy Role', response.message,'warning');

                }
            }, error =>{
              console.log('error Copy Role', error);
              Swal.fire('Copy Role','Failed to copy data','error');
            });
          }
        })

       
      }
      else
      {
        // this.alertify.warning("Can't update. B/c permission denied.");
        Swal.fire('Copy Role',"Can't update. B/c permission denied.",'warning');

      }
    }
    else
    {
      // this.alertify.warning("Role to null.");
      Swal.fire('Copy Role','Please select role to copy','warning');

    }
   
  }
  functionId = "Adm_SettingRole";
  roleId = "";
  onchange(dataRow, col, value)
  {
    let check =  this.authService.checkRole(this.functionId , '', 'E' );
    if(check === false)
    {
      // this.router.navigate(["/admin/permission-denied"]);
      // this.alertify.warning("Can't update. B/c permission denied.");
      Swal.fire('Update Role',"Can't update. B/c permission denied.",'warning');

    }
    else
    {
    //  debugger;
    // 
      let RoleId = ""; //= this.route.params['id'];
      this.route.params.subscribe(data => {
        RoleId = data['id'];
      })
      let model = new MPermission();
      this.roleId = RoleId;
      model.roleId = RoleId;
      model.controlId = dataRow.ControlId;
      model.functionId = dataRow.functionId;
      model.companyCode = this.authService.storeSelected().companyCode;
      model.permissions = col;
      if(value === true)
      {
        model.status = "A";
      }
      else{
        model.status = "I";
      } 
      this.permissionService.updateNode(model).subscribe((response: any) => {
       debugger;
         if(!response.success)
         {
            // this.alertify.error(response.message);
            Swal.fire('Update Role', response.message, 'warning');

         }
      }, error => {
          console.log('error Update Role', error);
          Swal.fire('Update Role','Failed to Update data','error');
      });
    }
  }
  functionRouteList: MFunction[];
  loadFunction()
  {
    this.functionService.getAll( this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
        if(response.success)
        {
          this.functionRouteList = response.data;
          this.functionRouteList = this.functionRouteList.filter(x=>x.status === 'A' && (x.url!=='' && x.url!==null && x.url!==undefined));
          console.log('this.functionRouteLis', this.functionRouteList);
        }
        else
        {
          this.alertify.warning(response.message);
        }
       
    })
  }

  constructor(private roleService: RoleService, private functionService: FunctionService, private authService: AuthService, private permissionService: PermissionService, private modalService: BsModalService,
     private alertify: AlertifyService, private router: Router,  private route: ActivatedRoute) { }
    role: MRole;
  
  ngOnInit() {
   
    // this.loadData();
    // this.loadheader();
    this.getHeight() ;
    this.loadRoleList();
    console.log(this.height);
    this.route.params.subscribe(data => {
      this.roleId = data['id'];
       
    })
    // let id = this.route.params['id'];
    this.route.data.subscribe(data => {
      // debugger;
      
      if(data['items'].success)
      {
        this.functionList =  data['items'].data;
        // console.log(this.functionList);
      
        this.loadheader();
      }
      else{
        this.alertify.error(data['items'].message);
      }
      
    });
     this.roleService.getById(this.roleId).subscribe((response: any)=>{
       if(response.success)
       {
        this.role = response.data;
       }
       else
       {
        this.alertify.warning(response.message);
       }
      
     });
     this.loadFunction();
  }
  // fullNameColumn_calculateCellValue (rowData) {
  //   setTimeout(() => {
  //     this.modalRef = this.modalService.show(template, {
  //       ariaDescribedby: 'my-modal-description',
  //       ariaLabelledBy: 'my-modal-title', 
  //       class: 'modal-dialog modal-dialog-centered modal-sm'
  //     });
  //   });
  //   // return rowData.firstName + " " + rowData.lastName;
  // }
  loadheader()
  {
    this.permissionService.getHeaderGrid().subscribe((response: any) => {
      // debugger;
      if(response.success)
      {
        this.cols = response.data; 
      }
      else
      {
        this.alertify.error(response.message);
      }
      // this.cols = data;
      console.log('this.cols', this.cols);
    });
  }
  selectedFunctionNode = "";
  openModal(isNew: boolean, func: any, template: TemplateRef<any>) {
      debugger;
      this.selectedNodes = func;
      this.selectedFunctionNode = func?.Name;
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title', 
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
 
  }
  // loadData()
  // {
  //   this.permissionService.GetPermissionByRole("").subscribe((response: any)=>{
  //     debugger;
  //     if(response.success)
  //     {
  //       this.functionList = response.data;
  //       console.log(this.functionList);
  //       // this.cols = [
  //       //   { field: 'functionId', header: 'FunctionId' },
  //       //   { field: 'a', header: 'Name' }, 
  //       // ];
  //       this.loadheader();
  //     }
  //     else{
  //       this.alertify.error(response.message);
  //     }
     
      
  //   });
  // }

}
