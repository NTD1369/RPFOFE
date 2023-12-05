import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MShortcutKeyboard } from 'src/app/_models/shortcut';
import { AuthService } from 'src/app/_services/auth.service';
import { ShortcutService } from 'src/app/_services/data/shortcut.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-shortcut',
  templateUrl: './management-shortcut.component.html',
  styleUrls: ['./management-shortcut.component.css']
})
export class ManagementShortcutComponent implements OnInit {



  lguAdd: string = "Add";
  list: MShortcutKeyboard[];
  modalRef: BsModalRef;
  model: MShortcutKeyboard;
  isNew: boolean = false;
  functionId = "Adm_Shortcut";
  openModal(isNew: boolean, model: MShortcutKeyboard, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.model = new MShortcutKeyboard();
    }
    else {
      this.model = model;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  constructor(private shortcutService: ShortcutService, private alertify: AlertifyService, private authService: AuthService,
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
  customizeText(e) {
    // debugger;
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  selectedDate;
  ngOnInit() {
    // let check =  this.authService.checkRole(this.functionId , '', 'V' );
    // if(check === false)
    // {
    //   this.router.navigate(["/admin/permission-denied"]);
    // }
    // this.selectedDate = new Date();
    // this.route
    // this.loadItems();
    // debugger;
    this.loadItems();
  }

  loadItems() {
    this.shortcutService.getAll(this.authService.storeSelected().companyCode).subscribe((res: any) => {
      // loadItems
      debugger;
      if (res.success) {
        this.list = res.data;
      }
      else {
        this.alertify.warning(res.message);
      }

      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }


  updateModel(model) {
    debugger;
    if (this.isNew) {

      this.shortcutService.create(model).subscribe((response: any) => {
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
      this.shortcutService.update(model).subscribe((response: any) => {
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
