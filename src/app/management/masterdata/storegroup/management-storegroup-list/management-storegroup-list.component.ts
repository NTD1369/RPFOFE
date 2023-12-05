import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { MStoreGroup } from 'src/app/_models/storegroup';
import { AuthService } from 'src/app/_services/auth.service';
import { StoregroupService } from 'src/app/_services/data/storegroup.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-storegroup-list',
  templateUrl: './management-storegroup-list.component.html',
  styleUrls: ['./management-storegroup-list.component.scss']
})
export class ManagementStoregroupListComponent implements OnInit {

  items: MStoreGroup[];
  pagination: Pagination;
  userParams: any = {};
  functionId = "Adm_OUTLETGROUPSETUP";
  lguAdd: string = "Add";
  isNew: boolean = false;
  constructor(private storegroupService: StoregroupService, private alertify: AlertifyService, private router: Router, private authService: AuthService,
    private modalService: BsModalService, private route: ActivatedRoute) { 
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

  ngOnInit() {
    // this.route
    // this.loadItems();
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    this.route.data.subscribe(data => {
      debugger;
      this.items = data['groups'].result;
      this.pagination = data['groups'].pagination;
      // debugger;
      
    this.userParams.keyword = ''; 
    this.userParams.orderBy = 'byName';

      // data['items']
    });
  }
  filterBy(txtFilter: any)
  {
    debugger;
    this.userParams.keyword = txtFilter;
    this.loadItemPagedList();
  }
  pageChanged(event: any): void
  {
    this.pagination.currentPage = event.page;
     this.loadItemPagedList();
  }
  loadItems() {
    this.storegroupService.getItemPagedList().subscribe((res: PaginatedResult<MStoreGroup[]>) => {
      // loadItems
      // debugger;
      this.items = res.result;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
  modalRef: BsModalRef;
  storegroup: MStoreGroup;
  openModal(isNew: boolean, storeGroup: MStoreGroup, template: TemplateRef<any>) {
    debugger;
    this.isNew= isNew;
    if(isNew)
    {
      this.storegroup = new MStoreGroup();
      this.storegroup.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else
    {
      this.storegroup = storeGroup;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title', 
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
 
  }
  loadItemPagedList() {
    this.storegroupService.getItemPagedList(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<MStoreGroup[]>) => {
        debugger;
        this.items = res.result;
        this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }
  getItem(item: MStoreGroup)
  {
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
    //  this.router.navigate(["admin/masterdata/item", item.itemCode]);
  }
   
  @ViewChild('template' , { static: false}) template;  
  onToolbarPreparing(e) {
    if(this.authService.checkRole(this.functionId , '', 'I'))
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
    debugger;
    if(this.isNew)
    {
      debugger; 
      this.storegroupService.create(model).subscribe((response: any) => {
        if(response.success)
        {
          this.alertify.success('Create completed successfully'); 
          this.loadItemPagedList();
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
      this.storegroupService.update(model).subscribe((response: any) => {
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

