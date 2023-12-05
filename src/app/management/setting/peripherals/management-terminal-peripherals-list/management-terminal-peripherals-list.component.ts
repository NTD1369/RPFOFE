import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Pagination } from 'src/app/_models/pagination';
import { MTerminalPeripherals } from 'src/app/_models/peripherals';
import { MStore } from 'src/app/_models/store';
import { SStoreClient } from 'src/app/_models/storeclient';
import { AuthService } from 'src/app/_services/auth.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { StoreclientService } from 'src/app/_services/data/storeclient.service';
import { TerminalPeripheralsService } from 'src/app/_services/data/terminal-peripherals.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { status } from 'src/environments/environment';

@Component({
  selector: 'app-management-terminal-peripherals-list',
  templateUrl: './management-terminal-peripherals-list.component.html',
  styleUrls: ['./management-terminal-peripherals-list.component.scss']
})
export class ManagementTerminalPeripheralsListComponent implements OnInit {

  functionId = "Adm_BankTerminalSetting";
   
  
  list: MTerminalPeripherals[];
  pagination: Pagination;
  userParams: any = {};
  modalRef: BsModalRef;
  model: MTerminalPeripherals;
  isNew:boolean = false; 
  counters: SStoreClient[]= []; 
  storeId="";
  loadCounter(store)
  {
   debugger;
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
    debugger;

    this.counterId = counter;
    this.terminalPeripheralsService.getAll(this.authService.getCurrentInfor().companyCode, this.storeId, this.counterId, 'Y').subscribe((response: any)=>{
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

  openModal(isNew: boolean, model: MTerminalPeripherals, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if(isNew)
    {
      this.model = new MTerminalPeripherals();
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
  constructor(private alertity: AlertifyService,private terminalPeripheralsService: TerminalPeripheralsService, private counterService: StoreclientService , private alertify: AlertifyService, 
    private storeService: StoreService, private router: Router, private authService: AuthService,
    private modalService: BsModalService, private route: ActivatedRoute) { 
      this.customizeText= this.customizeText.bind(this);
      this.onToolbarPreparing = this.onToolbarPreparing.bind(this);

      // this.list = [];
    

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
    this.loginInfor = this.authService.getCurrentInfor();

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
    // this.loadItems();
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
        this.terminalPeripheralsService.update(model).subscribe((response: any)=>{
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
        this.terminalPeripheralsService.create(model).subscribe((response: any)=>{
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
    this.terminalPeripheralsService.delete(model).subscribe((response: any)=>{
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
    this.terminalPeripheralsService.getAll(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '' , 'Y').subscribe((res: any) => {
    
      if(res.success)
      {
        this.list = res.data;
        console.log("list",this.list);
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
    
      this.terminalPeripheralsService.create(model).subscribe((response: any) => {
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
      this.terminalPeripheralsService.update(model).subscribe((response: any) => {
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
  apply(model){
    debugger
    this.terminalPeripheralsService.apply(model).subscribe((res:any)=>{
      if (res.success) {
    debugger

        this.alertity.success('Apply completed successfully.');
    
        this.selectCounter( this.counterId );

      
      }
      else {
        this.alertity.error(res.message);
      }
    })
 

   }

   listStatus: any=[
    {name:"Active",value:"A"},
    {name:"In Active",value:"I"}

  ]
  loginInfor;

  saveInfo(){
    debugger;
    this.model.companyCode = this.loginInfor.companyCode;
    this.model.createdBy = this.loginInfor.username;

    if(this.isNew){
      this.terminalPeripheralsService.create(this.model).subscribe((respon:any)=>{
        if(respon.success){
        this.alertity.success("thanh cong");
        this.modalRef.hide();
       
       
        }
        else{
        this.alertity.warning(respon.message)
  
        }
      })
    }else{
      this.terminalPeripheralsService.update(this.model).subscribe((respon:any)=>{
        if(respon.success){
        this.alertity.success("thanh cong");
        
        this.modalRef.hide();
        }
        else{
        this.alertity.warning(respon.message)
  
        }
      })
    }
  }



}
