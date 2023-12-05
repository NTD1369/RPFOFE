import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MItemUom } from 'src/app/_models/mitemuom';
import { Pagination } from 'src/app/_models/pagination';
import { AuthService } from 'src/app/_services/auth.service';
import { ItemuomService } from 'src/app/_services/data/itemuom.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-item-uom',
  templateUrl: './management-item-uom.component.html',
  styleUrls: ['./management-item-uom.component.css']
})
export class ManagementItemUomComponent implements OnInit {


  items: MItemUom[];
  pagination: Pagination;
  userParams: any = {};
  isNew: boolean = false;
  functionId = "Adm_ItemUoM";
  lguAdd: string = "Add";

  constructor(private itemuomService: ItemuomService, private alertify: AlertifyService, private router: Router, private authService: AuthService,
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
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
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

  loadItems() {
    this.itemuomService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      // loadItems
      if (response.success) {
        debugger;
        this.items = response.data;
      }
      else {
        this.alertify.error(response.message);
      }

      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
  modalRef: BsModalRef;
  model: MItemUom;
  openModal(isNew: boolean, model: MItemUom, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.model = new MItemUom();

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

  updateModel(model) {
    debugger;
    if (this.isNew) {

      this.itemuomService.create(model).subscribe((response: any) => {
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
      this.itemuomService.update(model).subscribe((response: any) => {
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


}
