import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MPrepaidCard, TPrepaidCardTrans } from 'src/app/_models/prepaidcard';
import { AuthService } from 'src/app/_services/auth.service';
import { PrepaidcardService } from 'src/app/_services/data/prepaidcard.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-prepaid',
  templateUrl: './management-prepaid.component.html',
  styleUrls: ['./management-prepaid.component.scss']
})
export class ManagementPrepaidComponent implements OnInit {

  functionId = "Adm_PrepaidCard";

  cards: MPrepaidCard[];
  userParams: any = {};
  modalRef: BsModalRef;
  card: MPrepaidCard;
  isNew: boolean = false;
  lguAdd: string = "Add";

  openModal(isNew: boolean, card: MPrepaidCard, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.card = new MPrepaidCard();
      this.card.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else {
      this.card = card;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }

  openHistoryModal(card: MPrepaidCard, template: TemplateRef<any>) {
    this.card = card;
    this.modalRef = this.modalService.show(template, {
      ariaDescribedby: 'my-modal-description',
      ariaLabelledBy: 'my-modal-title',
      class: 'modal-dialog modal-dialog-centered modal-sm'
    });

  }


  constructor(private prepaidService: PrepaidcardService, private alertify: AlertifyService, public authService: AuthService,
    private router: Router, private modalService: BsModalService, private route: ActivatedRoute) {
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
  selectedDate;

  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.loadItems();

  }
  customizeText(e) {

    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  loadItems() {
    this.prepaidService.getAll(this.authService.getCurrentInfor().companyCode, '').subscribe((response: any) => {
      if (response.success) {
        this.cards = response.data;
        console.log(this.cards);
      }
      else {
        this.alertify.warning(response.message);
      }

    }, error => {
      this.alertify.error(error);
    });
  }

  getItem(item: MPrepaidCard) {
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
    //  this.router.navigate(["admin/masterdata/item", item.itemCode]);
  }

  updateModel(model) {
    debugger;
    if (this.isNew) {

      this.prepaidService.create(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Create completed successfully');
          this.loadItems();
          this.modalRef.hide();
        }
        else {
          this.alertify.error(response.message);
        }
      }, error => {
        this.alertify.error(error);
      });
    }
    else {
      this.prepaidService.update(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Update completed successfully.');
          this.modalRef.hide();
        }
        else {
          this.alertify.error(response.message);
        }

      }, error => {
        this.alertify.error(error);
      });
    }

  }
  @ViewChild('historyTemplate', { static: false }) historyTemplate;
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



}
