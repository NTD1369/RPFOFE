import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { Pagination } from 'src/app/_models/pagination';
import { AuthService } from 'src/app/_services/auth.service';
import { ItemserialService } from 'src/app/_services/data/itemserial.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service'; 
import Swal from 'sweetalert2';
@Component({
  selector: 'app-management-item-serial-list',
  templateUrl: './management-item-serial-list.component.html',
  styleUrls: ['./management-item-serial-list.component.css']
})
export class ManagementItemSerialListComponent implements OnInit {

  
  items: MItemSerial[];
  pagination: Pagination;
  userParams: any = {};
  isNew: boolean = false;
  functionId = "Adm_ItemSerial";
  lguAdd: string = "Add";
  isLoadingData = false;
  storeOptions=[];
  display:number =20;
  loadStore(){
    debugger;
    this.storeService.getByUserWithStatus(this.authService.decodeToken?.unique_name).subscribe((response: any) => {
     // debugger;
      if(response.success)
      {
       response.data.forEach(item => {
        //  let data = {name:item.storeName,value:item.storeId}
         let data = {
          name: item.storeId + " - " + (item.status === 'I' ? item.storeName + " (Inactive)" : item.storeName), 
          value:item.storeId
         }
         this.storeOptions.push(data);
       });;
       this.storeOptions.unshift({name:'All',value:''});
      } 
      else
      {
        this.alertify.warning(response.message);
      }
     
      // this.storeList = response;
      // console.log(this.storeList);
    });
}
  constructor(private itemSerialService: ItemserialService,  private alertify: AlertifyService, private router: Router, private authService: AuthService,
    private modalService: BsModalService, private route: ActivatedRoute, private storeService: StoreService) {
    // Chuyển đổi ngôn ngữ
    const lgu = localStorage.getItem('language');
    if (lgu === "vi") {
      this.lguAdd = "Thêm";
    } else if (lgu === "en") {
      this.lguAdd = "Add";
    } else {
      console.log("error");
    }
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always';

    // let check = this.authService.checkRole(this.functionId, '', 'V');
    // if (check === false) {
    //   this.router.navigate(["/admin/permission-denied"]);
    // }
    // this.isUpdate = this.authService.checkRole(this.functionId, '', 'E');
   
    this.allowEditing = this.allowEditing.bind(this);
  }
  isUpdate = false;
  ngOnInit() {
    // this.route
    this.loadStore();
    console.log("this.isUpdate", this.isUpdate);
    this.loadItems("","","","");
    debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.items = data['whs'].result;
    //   this.pagination = data['whs'].pagination;
    //   // debugger;

    // this.userParams.keyword = ''; 
    // this.userParams.orderBy = 'byName';

    //   // data['items']
    // });
  }
  status =   [
    { name: 'N/A', value:'N/A'},
    { name: 'Active', value:'A'},
    { name: 'Inactive', value:'I'}, //
    { name: 'Redeemed', value:'R'},
    { name: 'Expired', value:'E'}
  ];
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  deleteRowGet()
  {
    setTimeout(() => { 
      // this will make the execution after the above boolean has changed
      console.log("Items " ,this.selectedKey )  ;
      if(this.selectedKey !== null && this.selectedKey !==undefined && this.selectedKey?.length > 0)
      { 
        let itemsStatus =  this.selectedKey.filter(x=>x.status === 'R');
        if(itemsStatus!==null && itemsStatus!==undefined && itemsStatus?.length > 0)
        {
          Swal.fire({
            icon: 'warning', 
            title: 'Item Serial Status Wrong',
            text: "Can't Change Item selected: " + itemsStatus[0].serialNum
          });
        }
        else
        {
          Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to change status selected items!',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
              // this.selectedKey.
              this.selectedKey.map((todo, i) => { todo.status = 'N/A';})
              this.itemSerialService.updateWithStock(this.selectedKey).subscribe((response: any)=>{
                if(response.success)
                {
                    this.alertify.success("Change to 'N/A' completed successfully");
                    this.loadItems( this.storeFilter , this.slocId ,this.itemCode, this.keyword );
                }
                else{
                  this.alertify.warning("Change to 'N/A' failed: " + response.message);
                }
             });
            }
          });
        }
      }
      else
      {
        Swal.fire({
          icon: 'warning', 
          title: 'Items Selected',
          text: "List of selected is empty"  
        });
      }
     
    });
 
  }

  changeToInactive()
  {
    setTimeout(() => { 
      // this will make the execution after the above boolean has changed
      console.log("Items " ,this.selectedKey )  ;
      if(this.selectedKey !== null && this.selectedKey !==undefined && this.selectedKey?.length > 0)
      { 
        let itemsStatus =  this.selectedKey.filter(x=>x.status === 'R' || x.status === 'E');
        if(itemsStatus!==null && itemsStatus!==undefined && itemsStatus?.length > 0)
        {
          Swal.fire({
            icon: 'warning', 
            title: 'Item Serial Status Wrong',
            text: "Can't Change Item selected: " + itemsStatus[0].serialNum
          });
        }
        else
        {
          Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to change status selected items!',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
              // this.selectedKey.
              this.selectedKey.map((todo, i) => { todo.status = 'I';})
              this.itemSerialService.updateWithStock(this.selectedKey).subscribe((response: any)=>{
                if(response.success)
                {
                    this.alertify.success("Change to Inactive completed successfully");
                    this.loadItems( this.storeFilter , this.slocId ,this.itemCode, this.keyword );
                }
                else{
                  this.alertify.warning("Change to Inactive failed: " + response.message);
                }
             });
            }
          });
        }
      }
      else
      {
        Swal.fire({
          icon: 'warning', 
          title: 'Items Selected',
          text: "List of selected is empty"  
        });
      }
     
    });
 
  }
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
  storeFilter = "";
  itemCode ="";
  keyword ="";
  slocId = "";
  loadItems(store,slocId, itemCode, keyword) {
    this.storeFilter = store;
    this.itemCode = itemCode;
    this.keyword = keyword;

    this.slocId = slocId;
    if(this.storeFilter=== null || this.storeFilter===undefined)
    {
      this.storeFilter = ""; 
    }
    if(this.slocId=== null || this.slocId===undefined)
    {
      this.slocId = ""; 
    }
    if(this.itemCode=== null || this.itemCode===undefined)
    {
      this.itemCode = ""; 
    }
    if(this.keyword=== null || this.keyword===undefined)
    {
      this.keyword = "";
    }
    this.isLoadingData = true;
    this.itemSerialService.getAll(this.authService.getCurrentInfor().companyCode, this.storeFilter,  this.slocId, this.itemCode, this.keyword,this.display).subscribe((response: any) => {
      // loadItems
      this.isLoadingData = false;
      if (response.success) {
        debugger;
        this.items = response.data;
        // this.items = this.items.slice(0,this.display)
      }
      else {
        this.alertify.error(response.message);
      }

      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.isLoadingData = false;
      this.alertify.error(error);
    });
  }
  modalRef: BsModalRef;
  model: MItemSerial;
  openModal(isNew: boolean, model: MItemSerial, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.model = new MItemSerial();

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
  remove(e)
  {
    debugger;
    let model = e.data;
    if(model?.status==="A")
    {
      let list: MItemSerial[] = [];
      list.push(model);
      this.itemSerialService.delete(list).subscribe((response: any)=>{
        if(response.success)
        {
            this.alertify.success("Delete completed successfully");
            
            this.loadItems( this.storeFilter , this.slocId , this.itemCode, this.keyword );
        }
        else{
          this.alertify.warning("Delete failed: " + response.message);
        }
     });
    }
    else
    {
      this.alertify.warning("Can't remove serial");
    }
   
  }
  selectedKey = [];
  allMode: string;
  checkBoxesMode: string;
  allowDeleting(e) {
    // if(e.row?.data?.status==='A')
    // {
    //   return true;
    // }
    // else
    // {
    //    return false;
    // }
    return false;
  }
  allowEditing(e) {
   
   
    if(e!==null && e!==undefined && e.row!==undefined && e.row!==undefined)
    {
      if(e.row?.data?.status==='I' || e.row?.data?.status==='N/A')
      {
        debugger;
        if(this?.isUpdate !== undefined && this?.isUpdate !== null && this?.isUpdate === true )
        { 
          return true;
        }
        else
        {
          return false;
        }
       
      }
      else
      {
        return false;
      }
    }
   
    
  }
  editorPreparing(e) {
   
    if (e.parentType === 'dataRow' && e.row?.data?.status !== 'I' && e.row?.data?.status !=='N/A' ) {
     
      e.editorOptions.readOnly = true;
    }
  }
  updateModel(e) {
    debugger;
    let model = e.changes[0].data;
    let list: MItemSerial[] = [];
      list.push(model);
    this.itemSerialService.updateWithStock(list).subscribe((response: any) => {
      if (response.success) {
        this.alertify.success('Update completed successfully.');
        // this.modalRef.hide();
      }
      else {
        this.alertify.error(response.message);
      }

    }, error => {
      this.alertify.error(error);
    });
  }
  changedisplay(e){
    debugger
    this.display = e.value;
  }

}
