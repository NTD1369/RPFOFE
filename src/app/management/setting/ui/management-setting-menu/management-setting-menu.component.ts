import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxTreeViewComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MFunction } from 'src/app/_models/mfunction';
import { MPermission } from 'src/app/_models/mpermission';
import { MRole } from 'src/app/_models/mrole';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { FunctionService } from 'src/app/_services/system/function.service'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-setting-menu',
  templateUrl: './management-setting-menu.component.html',
  styleUrls: ['./management-setting-menu.component.css']
})
export class ManagementSettingMenuComponent implements OnInit {

  functionId = "Adm_GeneralSetting";
  selectNodesRecursive: boolean = true;
  selectByClick: boolean = false;

  isRecursiveDisabled: boolean = false;
  isSelectionModeDisabled: boolean = false;
  files5: any;
  cols: any[];
  isNew= false;
  modalRef: BsModalRef;
  functions: MFunction[];
  pagination: Pagination;
  userParams: any = {};
  function: any={};
  @ViewChild(DxTreeViewComponent, { static: false }) treeView: DxTreeViewComponent;
  constructor(private functionService: FunctionService, private alertify: AlertifyService, private router: Router, private authService: AuthService,
    private modalService: BsModalService, private route: ActivatedRoute) { 
      
    }

  ngOnInit() {
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    
    this.loadFunctionOnShow();
    this.loadNodeFunction();

    // debugger;
   

  }
  loadFunctionOnShow()
  {
    this.functionService.getFuntionMenuShow(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => { 
      // this.selectedEmployees=data;
      if(response.success)
      { 
        this.selectedEmployees=response.data; 
      }
      else
      {
        this.alertify.warning(response.message);
      }
    });
  }
  loadNodeFunction()
  {

    this.functionService.getFunctionExpandAll(this.authService.getCurrentInfor().companyCode, this.authService.decodeToken?.unique_name).subscribe((response: any) => {
      if(response.success)
      { 
        this.files5=response.data; 
      }
      else
      {
        this.alertify.warning(response.message);
      }
      // this.files5=data;
      // console.log(this.files5);
    });
  }
  onDragStart(e) {
    e.itemData = e.fromData[e.fromIndex];
  }

  onAdd(e) {
      e.toData.splice(e.toIndex, 0, e.itemData);
  }

  onRemove(e) {
      e.fromData.splice(e.fromIndex, 1);
  }    
  treeViewContentReady(e) {
    this.syncSelection(e.component);
  }
  treeViewSelectionChanged(e) {
    this.syncSelection(e.component);
  }
  selectedEmployees: MFunction[] = [];
  syncSelection(treeView) {
    const selectedEmployees = treeView.getSelectedNodes()
        .map(node => node.itemData); 
    this.selectedEmployees = selectedEmployees;
    // console.log(this.selectedEmployees);
  }
  loadFunction()
  {
    this.functionService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)  => {
      if(response.success)
      { 
        this.files5 = response.data;
        console.log(this.files5);
        this.files5.forEach(item => {
           
         });
      }
      else
      {
        this.alertify.warning(response.message);
      }
     
    });
  }
  
     
  
  updateFunction() {
    debugger; 
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.selectedEmployees.forEach((item, index) => {
          item.isShowMenu= true;
          item.menuOrder =index;
        });
        this.functionService.updateMenuShow(this.selectedEmployees).subscribe((response: any) => {
          if(response.success)
          {
            this.alertify.success('Function create completed successfully'); 
            this.loadFunctionOnShow();
            // this.modalRef.hide();
          }
          else{
            this.alertify.error(response.message);
          } 
        }, error => {
          this.alertify.error(error);
        });
      }
    });
    
   
  }
}
