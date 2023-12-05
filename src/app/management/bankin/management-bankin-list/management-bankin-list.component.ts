import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { TBankIn } from 'src/app/_models/bankin';
import { Pagination } from 'src/app/_models/pagination';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { BankinService } from 'src/app/_services/data/bankin.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { map, switchMap, debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-management-bankin-list',
  templateUrl: './management-bankin-list.component.html',
  styleUrls: ['./management-bankin-list.component.css']
})
export class ManagementBankinListComponent implements OnInit {

 
  lguAdd: string = "Add";
  bankIns: TBankIn[];
  pagination: Pagination;
  userParams: any = {};
  modalRef: BsModalRef;
  bankIn: TBankIn;
  isNew: boolean = false;
  functionId = "Adm_BankIn";
  openModal(isNew: boolean, bankIn: TBankIn, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.bankIn = new TBankIn();
      this.bankIn.companyCode = this.authService.getCurrentInfor().companyCode;
      if(this.bankIn.dailyId===null || this.bankIn.docDate ===undefined  || this.bankIn.docDate === "")
      {
        this.bankIn.dailyId = this.dailyId;
      }
      setTimeout(() => {
        this.modalRef = this.modalService.show(template, {
          ariaDescribedby: 'my-modal-description',
          ariaLabelledBy: 'my-modal-title',
          class: 'modal-dialog modal-dialog-centered modal-sm'
        });
      });
    }
    else {
      this.bankinService.getItem(this.authService.getCurrentInfor().companyCode, bankIn.storeId, bankIn.dailyId, bankIn.id).subscribe((response: any) => {
        // loadItems
        // debugger;
        if (response.success) {
  
          this.bankIn = response.data;
          if(this.bankIn.dailyId===null || this.bankIn.docDate ===undefined  || this.bankIn.docDate === "")
          {
            this.bankIn.dailyId = this.dailyId;
          }
          setTimeout(() => {
            this.modalRef = this.modalService.show(template, {
              ariaDescribedby: 'my-modal-description',
              ariaLabelledBy: 'my-modal-title',
              class: 'modal-dialog modal-dialog-centered modal-sm'
            });
          });
        }
        else
        {
          this.alertify.warning(response.message);
        }
        // this.employees = res;
        // console.log(this.items);
        // console.log(this.items);
      }, error => {
        this.alertify.error(error);
        console.log('error', error);
        Swal.fire({
          icon: 'error',
          title: 'Bankin Data',
          html: "Can't get bankin data"
        });
       
      });
      // this.employee = employee;
    }
   

  }
  storelist: MStore[];
  loadStore()
  {
    this.storeService.getByUser(this.authService.getCurrentInfor().username).subscribe((response: any)=>{
      if(response.success)
      {
        this.storelist= response.data;
        this.storelist.map((todo, i) => { todo.storeName = todo.storeId + ' - ' + todo.storeName;
        // if (todo.storeId == newRecordToUpdate.storeId){
           
        //  }
       });
      }
      else
      {
        this.alertify.warning(response.message);
      }
     
    });
  }

  constructor(private bankinService: BankinService,  private storeService: StoreService, private alertify: AlertifyService, public authService: AuthService, private commonService: CommonService,
    private router: Router, private modalService: BsModalService, private route: ActivatedRoute) {
    // Chuyển đổi ngôn ngữ
    const lgu = localStorage.getItem('language');
    console.log("lgu", lgu);
    if (lgu === "vi") {
      this.lguAdd = "Thêm";
    } else if (lgu === "en") {
      this.lguAdd = "Add";
    } else {
      console.log("error");
    }
  }
  selectedDate;
  dailyId = "";
  storeSelected: MStore;
  storeId ="";
  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.selectedDate = new Date();
    this.loadStore();

    this.storeSelected = this.authService.storeSelected();
    this.commonService.getDailyId(this.storeSelected.companyCode, this.storeSelected.storeId, '' ).subscribe((response: any)=>{
      if( response.success)
      {
        this.dailyId =  response.data;
        
        
      }
      else 
      {
       this.alertify.warning(response.message); 
      }
    })
    // this.route
    this.loadItems(this.storeSelected.storeId, "");
    debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.employees = data['employees'].result;
    //   this.pagination = data['employees'].pagination;
    //   // debugger;

    // this.userParams.keyword = ''; 
    // this.userParams.orderBy = 'byName';

    //   // data['items']
    // });
  }
  // filterBy(txtFilter: any) {
  //   debugger;
  //   this.userParams.keyword = txtFilter;
  //   this.loadItemPagedList();
  // }
  // pageChanged(event: any): void {
  //   this.pagination.currentPage = event.page;
  //   this.loadItemPagedList();
  // }
  loadItems(storeId, dailyId) {
    // , this.authService.getCurrentInfor().username
    this.storeId = storeId;
    this.bankinService.getAll(this.authService.getCurrentInfor().companyCode,  storeId,  dailyId).subscribe((response: any) => {
      // loadItems
      // debugger;
      if (response.success) {

        this.bankIns = response.data;
      }
      else
      {
        this.alertify.warning(response.message);
      }
      // this.employees = res;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
      console.log('error', error);
      Swal.fire({
        icon: 'error',
        title: 'Bankin Data',
        html: "Can't get bankin data"
      });
    });
  }
  // loadItemPagedList() {
  //   this.employeeService.getItemPagedList(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
  //     .subscribe((res: PaginatedResult<MEmployee[]>) => {
  //       debugger;
  //       this.employees = res.result;
  //       this.pagination = res.pagination;
  //     }, error => {
  //       this.alertify.error(error);
  //     });
  // }
  getItem(item: TBankIn) {
    this.bankinService.getItem(this.authService.getCurrentInfor().companyCode, item.storeId, item.dailyId, item.id).subscribe((response: any) => {
      // loadItems
      // debugger;
      if (response.success) {

        this.bankIn = response.data;
      }
      else
      {
        this.alertify.warning(response.message);
      }
      // this.employees = res;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
      console.log('error', error);
      Swal.fire({
        icon: 'error',
        title: 'Bankin Data',
        html: "Can't get bankin data"
      });
    });
  }

  @ViewChild('template', { static: false }) template;
  onToolbarPreparing(e) {
    if (this.authService.checkRole(this.functionId, '', 'I')) {
    
      e.toolbarOptions.items.unshift(
    {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: this.lguAdd,
          onClick: this.openModal.bind(this, true, null, this.template)
        }
      },{
        location: 'before',
        template: 'storeChange'
    });
    }
  }
  private clickStream = new Subject();
  updateModel(model) {
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
        if (this.isNew) {
          model.createdBy = this.authService.getCurrentInfor().username;
          this.clickStream.pipe(debounceTime(500)).pipe( e => this.bankinService.create(model))
          .subscribe((response: any) => {
            if (response.success) {
              this.alertify.success('Create completed successfully');
              // this.loadItems();
              this.loadItems(this.storeSelected.storeId, "");
              this.modalRef.hide();
            }
            else {
              // this.alertify.error(response.message);
              Swal.fire({
                icon: 'warning',
                title: 'Create Bankin',
                html: response.message
              });
            }
          }, error => {
            this.alertify.error(error);
            console.log('error', error);
            Swal.fire({
              icon: 'error',
              title: 'CreateBankin Data',
              html: "Can't get bankin data"
            });
          });
          
        }
        else {
          model.modifiedBy = this.authService.getCurrentInfor().username;
    
          this.clickStream.pipe(debounceTime(500)).pipe( e => this.bankinService.update(model))
          .subscribe((response: any) => {
            if (response.success) {
              this.alertify.success('Update completed successfully.');
              this.modalRef.hide();
              this.loadItems(this.storeSelected.storeId, "");
            }
            else {
              
              Swal.fire({
                icon: 'warning',
                title: 'Update Bankin',
                html: response.message
              });
            }
          }, error => {
            // this.alertify.error(error);
            console.log('error', error);
            Swal.fire({
              icon: 'error',
              title: 'Update Bankin',
              html: "Can't get bankin data"
            });
          });
           
        }
    
      }

    })

  
  }


}
