import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SLoyaltyRank } from 'src/app/_models/crm';
import { AuthService } from 'src/app/_services/auth.service';
import { LoyaltyrankService } from 'src/app/_services/data/loyaltyrank.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-loyaltyrank',
  templateUrl: './management-loyaltyrank.component.html',
  styleUrls: ['./management-loyaltyrank.component.css']
})
export class ManagementLoyaltyrankComponent implements OnInit {

  dateFormat = "";
  functionId = "Adm_LoyaltyRank";
  list: SLoyaltyRank[];
  lguAdd: string = "Add";

  constructor(private authService: AuthService, private rankService: LoyaltyrankService, private alertifyService: AlertifyService, private modalService: BsModalService
    , private router: Router) {
      this.customizeText = this.customizeText.bind(this);
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
    // let check =  this.authService.checkRole(this.functionId , '', 'V' );
    // if(check === false)
    // {
    //   this.router.navigate(["/admin/permission-denied"]);
    // }
    // else
    // {

    // }
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.loadList();
  }
  customizeText(e) {
    // debugger;
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
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

  delPromotion(data) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this promotion',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.rankService.delete(this.authService.storeSelected().companyCode, data.data.promoId).subscribe((response: any) => {
          // debugger;
          if (response.success) {
            // debugger;
            this.alertifyService.success('Remove promotion ' + data.data.promoId + ' completed successfully. ');
            this.loadList();
          }
          else {
            this.alertifyService.warning('Remove promotion failed. Message: ' + response.message);
          }
        });

      }
    });
  }
  modalRef: BsModalRef;
  model: SLoyaltyRank;
  isNew = false;
  openModal(isNew: boolean, model: SLoyaltyRank, template: TemplateRef<any>) {
    debugger;

    if (isNew) {
      this.model = new SLoyaltyRank();
      this.model.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else {
      this.model = model;
    }
    this.isNew = isNew;
    setTimeout(() => {
      const initialState = {
        isNew: isNew, ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      };
      this.modalRef = this.modalService.show(template, { initialState });
      // this.modalRef = this.modalService.show(template, {
      //   ariaDescribedby: 'my-modal-description',
      //   ariaLabelledBy: 'my-modal-title', 
      //   class: 'modal-dialog modal-dialog-centered modal-sm'
      // });
    });

  }

  updateModel(model) {
    debugger;
    if (this.isNew) {

      this.rankService.create(model).subscribe((response: any) => {
        if (response.success) {
          this.alertifyService.success('Create completed successfully');
          this.loadList();
          this.modalRef.hide();
        }
        else {
          this.alertifyService.error(response.message);
        }
      }, error => {
        this.alertifyService.error(error);
      });
    }
    else {
      this.rankService.update(model).subscribe((response: any) => {
        if (response.success) {
          this.alertifyService.success('Update completed successfully.');
          this.modalRef.hide();
        }
        else {
          this.alertifyService.error(response.message);
        }

      }, error => {
        this.alertifyService.error(error);
      });
    }

  }

  loadList() {
    let comp = this.authService.storeSelected().companyCode;
    this.rankService.getAll(comp).subscribe((response: any) => {
      if (response.success == true) {
        // debugger;
        this.list = response.data
      }
      else {
        this.alertifyService.warning('load data failed. Message: ' + response.message);
      }

    });
  }

}
