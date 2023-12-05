import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { MStore } from 'src/app/_models/store';
import { MStoreGroup } from 'src/app/_models/storegroup';
import { MWarehouse } from 'src/app/_models/warehouse';
import { AuthService } from 'src/app/_services/auth.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-store-list',
  templateUrl: './management-store-list.component.html',
  styleUrls: ['./management-store-list.component.scss']
})
export class ManagementStoreListComponent implements OnInit {


  items: MStore[];
  pagination: Pagination;
  userParams: any = {};
  modalRef: BsModalRef;
  store: MStore;
  isNew: boolean = false;
  functionId = "Adm_OUTLETSETUP";
  lguAdd: string = "Add";


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

  openModal(isNew: boolean, store: MStore, template: TemplateRef<any>) {
    // debugger;
    this.isNew = isNew;
    if (isNew) {
      this.store = new MStore();
      this.store.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else {
      this.store = store;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  constructor(private storeService: StoreService, private alertify: AlertifyService, private router: Router, private authService: AuthService,
    private modalService: BsModalService, private route: ActivatedRoute,private customerService: CustomerService, private basketService: BasketService) {
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
    // debugger;
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.selectedDate = new Date();
    // this.route
    // this.loadItems();
    // debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    this.route.data.subscribe(data => {
      // debugger;
      this.items = data['stores'].result;
      // .filter(s => s.status === 'A');
      console.log("this.items", this.items);

      this.pagination = data['stores'].pagination;
      // debugger;

      this.userParams.keyword = '';
      this.userParams.orderBy = 'byName';

      // data['items']
    });
  }
  filterBy(txtFilter: any) {
    // debugger;
    this.userParams.keyword = txtFilter;
    this.loadItemPagedList();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadItemPagedList();
  }
  isShowContent = false;
  public refreshSlickSlider() {
    this.isShowContent = false;
    setTimeout(x => this.isShowContent = true);
  }
  listSelectionChanged = (e) => {
    // debugger;
    setTimeout(() => {
      if (e.addedItems.length > 0) {
        this.isNew = false;
        this.currentStore = e.addedItems[0];
        // this.items = this.currentStore.;
        console.log('selected Store', this.currentStore );
        this.refreshSlickSlider();
      }
    }, 500);
  };
  dataSource: MStore[] = [];
  currentStore: MStore;
  loadItems() {
    this.storeService.getItemPagedList().subscribe((res: PaginatedResult<MStore[]>) => {
      // loadItems
      // debugger;
      this.items = res.result;
      
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }

  loadItemPagedList() {
    this.storeService.getItemPagedList(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<MStore[]>) => {
        // debugger;
        this.items = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }
  getItem(item: MStore) {
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
    //  this.router.navigate(["admin/masterdata/item", item.itemCode]);
  }
  getPayment(item: MStore) {
    this.router.navigate(["admin/masterdata/store-payment/", item.storeId]);
  }
  getCurrency(item: MStore) {
    this.router.navigate(["admin/masterdata/store-currency/", item.storeId]);
  }
  addNew() {
    this.currentStore = new MStore();
    this.currentStore.companyCode = this.authService.getCurrentInfor().companyCode;
    this.isNew = true;
    this.refreshSlickSlider();
  }

  updateModel(model) {
    
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

          this.storeService.create(model).subscribe((response: any) => {
            if (response.success) {
              this.alertify.success('Create completed successfully');
              // localStorage.setItem("defaultCustomer", JSON.stringify(model));
              this.loadItemPagedList();
              this.modalRef.hide();
            }
            else {
              // this.alertify.error(response.message);
              Swal.fire('Create Store', response.message,'warning');

            }
          }, error => {
            this.alertify.error(error);
            Swal.fire('Create Store','Failed connect to system','error');
          });
        }
        else {
         
          this.storeService.update(model).subscribe((response: any) => {
            if (response.success) {
              this.alertify.success('Update completed successfully.');
              
              this.customerService.getByCompanyFilter(model.companyCode, "", "", model.defaultCusId, "", "", "", "", "","", "").subscribe((res: any) => {
                if (res.data.length > 0) {
                  let basket = this.basketService.getCurrentBasket();
                  // localStorage.setItem('basket', JSON.stringify(res.data))
                  this.basketService.changeCustomer(res.data[0], basket.salesType);
                }
              })
              this.modalRef.hide();
            }
            else {
              this.alertify.error(response.message);
              Swal.fire('Update Store', response.message, 'warning');

            }
    
          }, error => {
          
            this.alertify.error(error);
            Swal.fire('Update Store','Failed connect to system','error');
          });
        }
      }
    })
    

  }
}
