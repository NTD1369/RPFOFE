import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MBankTerminal } from 'src/app/_models/bank-terminal';
import { Pagination } from 'src/app/_models/pagination';
import { MStore } from 'src/app/_models/store';
import { SStoreClient } from 'src/app/_models/storeclient';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { BankTerminalService } from 'src/app/_services/data/bank-terminal.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { StoreclientService } from 'src/app/_services/data/storeclient.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { status } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-bank-terminal',
  templateUrl: './management-bank-terminal.component.html',
  styleUrls: ['./management-bank-terminal.component.scss']
})
export class ManagementBankTerminalComponent implements OnInit {

 
  functionId = "Adm_BankTerminalSetting";
   
  
  list: MBankTerminal[];
  pagination: Pagination;
  userParams: any = {};
  modalRef: BsModalRef;
  model: MBankTerminal;
  isNew:boolean = false; 
  counters: SStoreClient[]= []; 
  storeId="";
  loadCounter(store)
  {
   
    this.storeId = store.value;
     this.counterService.getAll(this.authService.getCurrentInfor().companyCode, this.storeId, '','').subscribe((response: any)=>{
       if(response.success)
       {
          this.counters = response.data.filter(x=>x.publicIP !== null && x.publicIP !== undefined && x.publicIP !== '');
       }
       else
       {
          this.alertify.warning(response.message);
       }
     })
  }
  counterId="";
  selectCounter(counter)
  {
    this.counterId = counter;
    this.bankTerminalService.GetByCounter(this.authService.getCurrentInfor().companyCode, this.storeId, this.counterId).subscribe((response: any)=>{
      if(response.success)
      {
        debugger;
         this.list = response.data;
      }
      else
      {
         this.alertify.warning(response.message);
      }
    })
  }
  @ViewChild('template' , { static: false}) template;  
  onToolbarPreparing(e) {
    // if(this.authService.checkRole(this.functionId , '', 'I'))
    // {
      e.toolbarOptions.items.unshift( 
        {
          location: 'before',
          template: 'totalGroupCount'
      }, 
        {
          location: 'before',
          template: 'counterTemplate'
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
 
  openModal(isNew: boolean, model: MBankTerminal, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if(isNew)
    {
      this.model = new MBankTerminal();
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
  constructor(private bankTerminalService: BankTerminalService, private counterService: StoreclientService , private alertify: AlertifyService, private storeService: StoreService, private router: Router, private authService: AuthService,
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
        this.bankTerminalService.update(model).subscribe((response: any)=>{
          if(response.success)
          {
              this.alertify.success("update completed successfully");
              this.selectCounter(this.counterId);
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
        this.bankTerminalService.create(model).subscribe((response: any)=>{
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
        this.storelist.map((todo, i) => { todo.storeName = todo.storeId + ' - ' + todo.storeName;
        // if (todo.storeId == newRecordToUpdate.storeId){
           
        //  }
       });
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
    this.bankTerminalService.delete(model).subscribe((response: any)=>{
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
    this.bankTerminalService.GetByCounter(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '').subscribe((res: any) => {
      // loadItems
      // debugger;
      if(res.success)
      {
        this.list = res.data;
      }
      else
      {
        // this.alertify.warning(res.message);
        Swal.fire({
          icon: 'warning',
          title: 'Bank Terminal',
          text: res.message
          // response.message
        });
      }
      // this.items = res.result;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      // this.alertify.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Bank Terminal',
        text: "Failed to get data"
      });
    });
  }
    
  updateModel(model) {
    debugger; 
    if(this.isNew)
    {
    
      this.bankTerminalService.create(model).subscribe((response: any) => {
        if(response.success)
        {
          this.alertify.success('Create completed successfully'); 
          this.loadItems();
          this.modalRef.hide();
        }
        else{
          // this.alertify.warning(response.message);
          Swal.fire({
            icon: 'warning',
            title: 'Bank Terminal',
            text: response.message
            // response.message
          });
        } 
      }, error => {
        // this.alertify.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Bank Terminal',
          text: "Failed to create data"
        });
      });
    }
    else{
      this.bankTerminalService.update(model).subscribe((response: any) => {
        if(response.success)
        {
          this.alertify.success('Update completed successfully.'); 
          this.modalRef.hide();
        }
        else{
          // this.alertify.error(response.message);
          Swal.fire({
            icon: 'warning',
            title: 'Bank Terminal',
            text: response.message
            // response.message
          });
        }
       
      }, error => {
        // this.alertify.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Bank Terminal',
          text: "Failed to update data"
        });
      });
    }
   
  }
}
