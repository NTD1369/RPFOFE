import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SBarcodeSetup } from 'src/app/_models/barcodesetup';
import { Pagination } from 'src/app/_models/pagination';
import { MTax } from 'src/app/_models/tax';
import { AuthService } from 'src/app/_services/auth.service';
import { BarcodesetupService } from 'src/app/_services/data/barcodesetup.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-barcode-setup-list',
  templateUrl: './management-barcode-setup-list.component.html',
  styleUrls: ['./management-barcode-setup-list.component.scss']
})
export class ManagementBarcodeSetupListComponent implements OnInit {

  functionId = "Adm_BarcodeSetup";
 
  items: SBarcodeSetup[];
  pagination: Pagination;
  userParams: any = {};
  isNew:boolean = false;
  lguAdd: string = "Add";
  
  constructor(private barcodesetupService: BarcodesetupService, private alertify: AlertifyService, private router: Router, private authService: AuthService,
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
    splitBarcode(value)
    {
      if(this.barcodesetupService.barcodeCheck(value))
      {
        this.barcode = this.barcodesetupService.splitBarcode(value,this.items);
        if( this.barcode ===null ||  this.barcode ===undefined)
        {
          this.alertify.warning('Invalid code');
        }
      }
      else
      {
        this.alertify.warning('Invalid checkcode');
      }
      // result.prefix = arr.find(x=>x.name === 'prefix')?.str; 
      //     result.pluStr = arr.find(x=>x.name === 'pluStr')?.str;
      //     result.weightStr = arr.find(x=>x.name === 'weightStr')?.str;
      //     result.barCodeStr = arr.find(x=>x.name === 'barCodeStr')?.str;
      //     result.qtyStr = arr.find(x=>x.name === 'qtyStr')?.str;
      //     result.checkCode = arr.find(x=>x.name === 'checkCode')?.str;
      //     result.amountStr = arr.find(x=>x.name === 'amountStr')?.str;
  
      //     result.barCodeLength = numOfString;
      
    }
  ngOnInit() {
    // this.route
    // let check =  this.authService.checkRole(this.functionId , '', 'V' );
    // if(check === false)
    // {
    //   this.router.navigate(["/admin/permission-denied"]);
    // }
    this.loadItems();
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
  
  @ViewChild('template' , { static: false}) template;  
  onToolbarPreparing(e) {
    // if(this.authService.checkRole(this.functionId , '', 'I'))
    // {
      // debugger;
      // if(this.items!==null && this.items!==undefined && this.items.length> 0)
      // {
       
      // }
      // else
      // {
        e.toolbarOptions.items.unshift( {
          location: 'before',
          widget: 'dxButton',
          options: {
              width: 136, 
              icon:"add", type:"default", text: this.lguAdd,
              onClick: this.openModal.bind(this, true, null, this.template)
          } 
      });
      // }
      // }
  }
  loadItems() {
    this.barcodesetupService.getAll(this.authService.getCurrentInfor().companyCode,'').subscribe((res:any) => {
      // loadItems
      debugger;
      if(res.success)
      {
        this.items = res.data;
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
  modalRef: BsModalRef;
  barcode: SBarcodeSetup;
  openModal(isNew: boolean, model: SBarcodeSetup, template: TemplateRef<any>) {
    debugger;
    if(this.isNew && this.items!==null && this.items!==undefined && this.items.length> 0)
    {
      this.alertify.warning("Company barcode has already. Can't add new");
    }
    else
    {
      this.isNew = isNew;
      if(isNew)
      {
        this.barcode = new SBarcodeSetup();
      
      }
      else
      {
        this.barcode = model;
      }
      this.barcode.companyCode = this.authService.getCurrentInfor().companyCode;
      setTimeout(() => {
        this.modalRef = this.modalService.show(template, {
          ariaDescribedby: 'my-modal-description',
          ariaLabelledBy: 'my-modal-title', 
          class: 'modal-dialog modal-dialog-centered modal-sm'
        });
      });
  
    }
    
  }
  
  updateModel(model) {
    debugger; 
    if(this.isNew)
    {
    
      this.barcodesetupService.create(model).subscribe((response: any) => {
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
      this.barcodesetupService.update(model).subscribe((response: any) => {
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
