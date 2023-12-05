import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'; 
import { MDenomination } from 'src/app/_models/denomination';
import { AuthService } from 'src/app/_services/auth.service';
import { DenominationService } from 'src/app/_services/data/denomination.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-denomination-list',
  templateUrl: './management-denomination-list.component.html',
  styleUrls: ['./management-denomination-list.component.scss']
})
export class ManagementDenominationListComponent implements OnInit {
  
  denominations: MDenomination[];  
  modalRef: BsModalRef;
  denomination: MDenomination;
  isNew:boolean = false;
  functionId = "Adm_Denomination";
  lguAdd: string = "Add";

  openModal(isNew: boolean, model: MDenomination, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if(isNew)
    {
      this.denomination = new MDenomination();
    }
    else
    {
      this.denomination = model;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title', 
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
 
  }
  constructor(private denominationService: DenominationService, private alertify: AlertifyService, private authService: AuthService, 
    private router: Router, private modalService: BsModalService, private route: ActivatedRoute) { 
      this.customizeText= this.customizeText.bind(this);

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
  customizeText (e) {
    // debugger;
      if( e.value!==null &&  e.value!== undefined)
      {
        return this.authService.formatCurrentcy( e.value);

      }
      return 0;
  };
    selectedDate;
  ngOnInit() {
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    // this.selectedDate = new Date();
    // this.route
    // this.loadItems();
    // debugger;
    this.loadItems();
  }
   
  loadItems() {
    this.denominationService.getAll(this.authService.storeSelected().currencyCode).subscribe((response: any) => {
      // loadItems
      debugger;
      if(response.success)
      { 
        this.denominations = response.data;
      }
      else
      {
         
        this.alertify.warning(response.message);
      }
      //  = res;
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
    
      this.denominationService.create(model).subscribe((response: any) => {
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
      this.denominationService.update(model).subscribe((response: any) => {
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


}
