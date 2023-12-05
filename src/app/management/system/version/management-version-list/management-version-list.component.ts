import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MStore } from 'src/app/_models/store';
import { SVersion } from 'src/app/_models/system/version';
import { AuthService } from 'src/app/_services/auth.service';
import { VersionService } from 'src/app/_services/data/version.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-version-list',
  templateUrl: './management-version-list.component.html',
  styleUrls: ['./management-version-list.component.scss']
})
export class ManagementVersionListComponent implements OnInit {

  
  functionId = "Adm_Version";
  list: SVersion[]; 
  userParams: any = {};
  modalRef: BsModalRef;
  model: SVersion;
  isNew:boolean = false;
  lguAdd: string = "Add";
 
  openModal(isNew: boolean, model: SVersion, template: TemplateRef<any>) {
    // debugger;
    this.isNew = isNew;
    if(isNew)
    {
      this.model = new SVersion();
  
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
  constructor(private versionService: VersionService, private alertify: AlertifyService, private authService: AuthService,
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
    
    this.versionService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((res: any) => {
      // loadItems
      // debugger;
      if(res.success)
      {
        this.list = res.data;
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
      this.versionService.create(model).subscribe((response: any) => {
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
      this.versionService.update(model).subscribe((response: any) => {
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
