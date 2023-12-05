import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TItemStorage } from 'src/app/_models/itemstorage';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { ItemstorageService } from 'src/app/_services/transaction/itemstorage.service';

@Component({
  selector: 'app-management-itemstorage',
  templateUrl: './management-itemstorage.component.html',
  styleUrls: ['./management-itemstorage.component.css']
})
export class ManagementItemstorageComponent implements OnInit {

  functionId="Adm_ItemStorage";
  items: TItemStorage[];
 
  userParams: any = {};
  isNew:boolean = false;
  lguAdd: string = "Add";
  constructor(private itemstorageService: ItemstorageService,private authService: AuthService, private alertify: AlertifyService, private router: Router,
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
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.loadItems();
    debugger;
  
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
                icon:"add", type:"success", text: this.lguAdd,
                // onClick: this.openModal.bind(this, true, null, this.template)
            } 
        });
      }
  }
   
  loadItems() {
    let company= this.authService.getCurrentInfor().companyCode;
    this.itemstorageService.getAll(company, "","","","").subscribe((response:any) => {
      // loadItems
      if(response.success)
      {
        this.items = response.data;
      }
      else
      {
        this.alertify.warning(response.message);
      }
      debugger;
      // this.items = res;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
  modalRef: BsModalRef;
  model: TItemStorage;
  // openModal(isNew: boolean, model: MStorage, template: TemplateRef<any>) {
  //   debugger;
  //   this.isNew = isNew;
  //   if(isNew)
  //   {
  //     this.model = new MStorage();
  //   }
  //   else
  //   {
  //     this.model = model;
  //   }
  //   setTimeout(() => {
  //     this.modalRef = this.modalService.show(template, {
  //       ariaDescribedby: 'my-modal-description',
  //       ariaLabelledBy: 'my-modal-title', 
  //       class: 'modal-dialog modal-dialog-centered modal-sm'
  //     });
  //   });
 
  // }
  mode:string="";
  updateModel(e) {
    debugger; 
    let model = e.changes[0].data;
    model.companycode = this.authService.getCurrentInfor().companyCode;
    if(this.mode==='E')
    // if(this.isNew)
    {
      this.itemstorageService.update(model).subscribe((response: any) => {
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
    else{
      this.itemstorageService.create(model).subscribe((response: any) => {
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
   
  }
   


}
