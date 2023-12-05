import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SDatasourceEdit } from 'src/app/_models/datasourceedit';
import { Pagination } from 'src/app/_models/pagination';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { DatasourceEditService } from 'src/app/_services/data/datasource-edit.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { status } from 'src/environments/environment';
@Component({
  selector: 'app-management-datasource-edit',
  templateUrl: './management-datasource-edit.component.html',
  styleUrls: ['./management-datasource-edit.component.scss']
})
export class ManagementDatasourceEditComponent implements OnInit {

 
  list: SDatasourceEdit[];
  pagination: Pagination;
  userParams: any = {};
  modalRef: BsModalRef;
  model: SDatasourceEdit;
  isNew:boolean = false;
  functionId = "Adm_StoreClient";

 
  @ViewChild('template' , { static: false}) template;  
  onToolbarPreparing(e) {
    // if(this.authService.checkRole(this.functionId , '', 'I'))
    // {
      e.toolbarOptions.items.unshift( 
        {
          location: 'before',
          template: 'totalGroupCount'
      },
      //   {
      //     location: 'before',
      //     widget: 'dxSelectBox',
      //     options: {
      //         width: 200,
      //         items: this.storelist,
      //         displayExpr: 'storeName',
      //         valueExpr: 'storeId',
      //         value: 'storeId',
      //         onValueChanged: this.selectStore.bind(this)
      //     }
      // },
      // {
      //       location: 'before',
      //       widget: 'dxButton',
      //       options: {
      //           width: 136, 
      //           icon:"add", type:"default", text:"Add",
      //           onClick: this.openModal.bind(this, true, null, this.template)
      //       } 
      //   }
        );
      // }
  }
 
  openModal(isNew: boolean, model: SDatasourceEdit, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if(isNew)
    {
      this.model = new SDatasourceEdit();
      // this.model.companyCode = this.authService.getCurrentInfor().companyCode;
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
  constructor(private datasource: DatasourceEditService, private alertify: AlertifyService, private storeService: StoreService, private router: Router, private authService: AuthService,
    private modalService: BsModalService, private route: ActivatedRoute) { 
      this.customizeText= this.customizeText.bind(this);
      this.onToolbarPreparing = this.onToolbarPreparing.bind(this);
    }
    customizeText (e) {
    
      if( e.value!==null &&  e.value!== undefined)
      {
        return this.authService.formatCurrentcy( e.value);
  
      }
      return 0;
   };
    selectedDate;
  ngOnInit() {
    debugger;
    this.loadStoreList();
    // let check =  this.authService.checkRole(this.functionId , '', 'V' );
    // if(check === false)
    // {
    //   this.router.navigate(["/admin/permission-denied"]);
    // }
    this.selectedDate = new Date();
    // this.route
    // this.loadItems();
    debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.items = data['stores'].result;
    //   this.pagination = data['stores'].pagination;
    //   // debugger;
      
    // this.userParams.keyword = ''; 
    // this.userParams.orderBy = 'byName';

    //   // data['items']
    // });
    this.loadItems();
  }
  mode:string="";
  status = status.active;
  dateFormat = "";
  fromDate: Date;
  toDate: Date;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  selectStore(data)
  {
    if (data.value === "All" || data.value === "" || data.value === null || data.value === undefined) {
      this.dataGrid.instance.clearFilter();
    } else {
        this.dataGrid.instance.filter(["storeId", "=", data.value]);
    }
  }
  save(e) {
    debugger; 
    let model = e.changes[0].data;
    // model.storeId = this.model.storeId;
    model.companyCode = this.authService.getCurrentInfor().companyCode;
    // model.currency = this.model.currency;
    if(this.mode==='E')
    {
      // let check =  this.authService.checkRole(this.functionId , '', 'E' );
      // if(check===true)
      // {
        this.datasource.update(model).subscribe((response: any)=>{
          if(response.success)
          {
              this.alertify.success("update completed successfully");
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
        this.datasource.create(model).subscribe((response: any)=>{
          debugger;
          if(response.success)
          {
              this.alertify.success("insert completed successfully");
          }
          else{
            this.alertify.warning("insert failed: " + response.message);
          }
        });
      // }
      // else
      // {
      //   this.alertify.success("Permission denied.");
      // }
    }
    // this.events.unshift(eventName);
  }
  storelist : MStore[];
  loadStoreList()
  {
    this.storeService.getByUser(this.authService.getCurrentInfor().username).subscribe((response: any)=>{
      if(response.success)
      {
        this.storelist = response.data;
       
      } 
      else
      {
        this.alertify.warning(response.message);
      }
      // this.storelist = response;
    })
  }
  remove(e)
  {
    debugger;
    let model = e.data;
    
    // this.store= this.getStoreModel(this.storeSelected);
    // model.storeId = this.storeSelected;
    this.datasource.delete(model.companyCode, model.id).subscribe((response: any)=>{
      if(response.success)
      {
          this.alertify.success("Delete completed successfully");
      }
      else{
        this.alertify.warning("Delete failed: " + response.message);
      }
   });
  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  loadItems() {
    this.datasource.getAll(this.authService.storeSelected().companyCode, ''  ).subscribe((res: any) => {
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
      // this.items = res.result;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
    
  updateModel(model) {
    debugger; 
    if(this.isNew)
    {
    
      this.datasource.create(model).subscribe((response: any) => {
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
      this.datasource.update(model).subscribe((response: any) => {
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
