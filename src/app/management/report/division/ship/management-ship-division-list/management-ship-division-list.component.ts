import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Pagination } from 'src/app/_models/pagination';
import { TShippingDivisionHeader } from 'src/app/_models/ship-division';
import { AuthService } from 'src/app/_services/auth.service';
import { ShipDivisionService } from 'src/app/_services/data/ship-division.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
@Component({
  selector: 'app-management-ship-division-list',
  templateUrl: './management-ship-division-list.component.html',
  styleUrls: ['./management-ship-division-list.component.scss']
})
export class ManagementShipDivisionListComponent implements OnInit {



  functionId = "Adm_ShipDivision";
  items: TShippingDivisionHeader[];
  pagination: Pagination;
  userParams: any = {};
  isNew: boolean = false;
  lguAdd: string = "Add";

  constructor(private shipDivisionService: ShipDivisionService, private alertify: AlertifyService, private router: Router, 
    public authService: AuthService,  private modalService: BsModalService, private route: ActivatedRoute) {
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
    // let check = this.authService.checkRole(this.functionId, '', 'V');
    // if (check === false) {
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

  @ViewChild('template', { static: false }) template;
  onToolbarPreparing(e) {
    // if (this.authService.checkRole(this.functionId, '', 'I')) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: this.lguAdd, 
          onClick: this.newDivision.bind(this)
        }
      });
    // }
  }
  newDivision()
  {
    this.router.navigate(["admin/ship-division/create/new"]).then(() => {
      // window.location.reload();
    });
  }
  detailDivision(data)
  {
    this.router.navigate(["admin/ship-division/edit",  data.id]).then(() => {
      // window.location.reload();
    });
  }
  loadItems() {
    this.shipDivisionService.getAll(this.authService.getCurrentInfor().companyCode, "","").subscribe((response: any) => {
      // loadItems
      debugger;
      if (response.success) {
        this.items = response.data;
      }
      else {
        this.alertify.warning(response.message);
      }
      // this.items = res;
      console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
  modalRef: BsModalRef;
  model: TShippingDivisionHeader;
  openModal(isNew: boolean, model: any, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.model = new TShippingDivisionHeader();
      this.model.companyCode = this.authService.getCurrentInfor().companyCode;
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
      this.model.createdBy = this.authService.getCurrentInfor().username;
      this.shipDivisionService.create(model).subscribe((response: any) => {
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
      this.model.modifiedBy = this.authService.getCurrentInfor().username;
      this.shipDivisionService.update(model).subscribe((response: any) => {
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
