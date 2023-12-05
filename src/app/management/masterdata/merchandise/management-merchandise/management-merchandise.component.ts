import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { Merchandise_categoryService } from 'src/app/_services/data/merchandise_category.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-merchandise',
  templateUrl: './management-merchandise.component.html',
  styleUrls: ['./management-merchandise.component.scss']
})
export class ManagementMerchandiseComponent implements OnInit {

  functionId = "Adm_Merchandise";
  merchandises: MMerchandiseCategory[]; 
  userParams: any = {};
  modalRef: BsModalRef;
  merchandise: MMerchandiseCategory;
  isNew:boolean = false;
  lguAdd: string = "Add";
 
  openModal(isNew: boolean, merchandise: MMerchandiseCategory, template: TemplateRef<any>) {
    // debugger;
    this.isNew = isNew;
    if(isNew)
    {
      this.merchandise = new MMerchandiseCategory();
      this.merchandise.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else
    {
      this.merchandise = merchandise;
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
  constructor(private merchandiseService: Merchandise_categoryService, private alertify: AlertifyService, private authService: AuthService,
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
    // this.storeSelected = this.authService.storeSelected();
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
  }
   
  loadItems() {
    
    this.merchandiseService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      // loadItems
      debugger;
      if(response.success)
      {
        this.merchandises = response.data;
      }
      else
      {
        this.alertify.warning(response.message);
      }
      // this.merchandises = res;
      // console.log(this.merchandises);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
   
  getItem(item: MMerchandiseCategory)
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
    
      this.merchandiseService.create(model).subscribe((response: any) => {
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
      this.merchandiseService.update(model).subscribe((response: any) => {
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
