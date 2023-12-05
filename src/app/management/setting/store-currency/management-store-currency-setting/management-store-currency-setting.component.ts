import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Pagination } from 'src/app/_models/pagination';
import { MStore } from 'src/app/_models/store';
import { MStoreCurrency } from 'src/app/_models/storecurrency';
import { AuthService } from 'src/app/_services/auth.service';
import { CurrencyService } from 'src/app/_services/data/currency.service';
import { StorecurrencyService } from 'src/app/_services/data/storecurrency.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-store-currency-setting',
  templateUrl: './management-store-currency-setting.component.html',
  styleUrls: ['./management-store-currency-setting.component.scss']
})
export class ManagementStoreCurrencySettingComponent implements OnInit {


  list: MStoreCurrency[];
  pagination: Pagination;
  userParams: any = {};
  modalRef: BsModalRef;
  model: MStoreCurrency;
  isNew:boolean = false;
  lguAdd: string = "Add";
 
  openModal(isNew: boolean, payment: MStoreCurrency, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if(isNew)
    {
      this.model = new MStoreCurrency(); 
      this.model.companyCode = this.authService.getCurrentInfor().companyCode;
      this.model.storeId = this.storeId;
    }
    else
    {
      this.model = payment; 
      this.model.storeId = this.storeId;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title', 
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
 
  }
  storeSlected: MStore;
  constructor(private currencyService: CurrencyService, private storeCurrenctService: StorecurrencyService, private alertify: AlertifyService,  private authService: AuthService,
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
    this.storeSlected=this.authService.storeSelected();
    this.route.params.subscribe(data => {
      this.storeId = data['storeid'];
    })
    // this.payment.s
    debugger;
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.payments =  data['payments'].result;
    //   console.log(this.payments);
    //   // if(data['payments'].success)
    //   // {
       
    //   // }
    //   // else{
    //   //   this.alertify.error(data['payments'].message);
    //   // }
      
    // });
    // this.loadItemPagedList();
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.list = data['payments'];
    //   // this.pagination = data['payments'].pagination;
    //   // debugger;
      
    // this.userParams.keyword = ''; 
    // this.userParams.orderBy = 'byName';
    // this.userParams.storeid = this.storeId; 
    //   // data['items']
    // });
    this.loadCurrencyByStore();
  }
  // storeId = "";
  loadCurrencyByStore()
  {
    this.storeCurrenctService.getAll(this.authService.getCurrentInfor().companyCode, this.storeId).subscribe((response: any)=>{
      if(response.success)
      {
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
 
 
  // loadItems() {
  //   this.paymentService.getByStorePagedList(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams).subscribe((res: any) => {
  //     // loadItems
  //     debugger;
  //     // if(res.)
  //     // PaginatedResult<MPaymentMethod[]>
  //     // this.payments = res.result;
  //     // console.log(this.items);
  //     // console.log(this.items);
  //   }, error => {
  //     this.alertify.error(error);
  //   });
  // }
  storeId;
 
  deleteData(model: MStoreCurrency)
  {
    debugger;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.storeCurrenctService.delete(this.model.companyCode, this.model.storeId, model.currency).subscribe((response: any) => {
          if(response.success)
          {
            this.alertify.success('Delete completed successfully.'); 
            this.loadCurrencyByStore();
            this.modalRef.hide();
            
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
  updateModel(model) {
    debugger; 
    if(this.isNew)
    {
      // model.storeId = this.storeId;
      this.storeCurrenctService.create(model).subscribe((response: any) => {
        if(response.success)
        {
          this.alertify.success('Create completed successfully'); 
          this.loadCurrencyByStore();
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
      // model.storeId = this.storeId;
      this.storeCurrenctService.update(model).subscribe((response: any) => {
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
