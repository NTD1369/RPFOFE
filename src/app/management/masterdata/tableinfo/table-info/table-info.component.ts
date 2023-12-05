import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MTableInfor, MTableInforTemplate, ResponseTableInfo } from 'src/app/_models/tableinfo';
import { AuthService } from 'src/app/_services/auth.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { TableinfoService } from 'src/app/_services/data/tableinfo.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import { MUser } from 'src/app/_models/user';
import { EmunPermission } from 'src/app/_models/emun/emun-permission';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-table-info',
  templateUrl: './table-info.component.html',
  styleUrls: ['./table-info.component.scss']
})

export class TableInfoComponent implements OnInit {
  public isNew: boolean = false;
  public sourceData: Array<ResponseTableInfo>;
  public loginInfor: MUser = new MUser;
  public modalRef: BsModalRef = new BsModalRef;
  public table: MTableInfor = new MTableInfor;
  public storeId: string;
  public importContent: MTableInforTemplate[] = [];
  public isResult: boolean = false;
  public functionId: string = "Adm_TableInfor";

  public listStatus: any = [
    { name: "Active", value: "A" },
    { name: "In Active", value: "I" }
  ]

  public listSeat: any = [
    { name: "2", value: 2 },
    { name: "4", value: 4 },
    { name: "6", value: 6 },
    { name: "8", value: 8 },
    { name: "10", value: 10 },
    { name: "12", value: 12 },
    { name: "14", value: 14 },
    { name: "16", value: 16 },
    { name: "18", value: 18 },
    { name: "20", value: 20 },
    { name: "22", value: 22 },
    { name: "24", value: 24 },
    { name: "26", value: 26 },
    { name: "28", value: 28 },
    { name: "30", value: 30 }
  ]

  @ViewChild('template', { static: false }) template;
  @ViewChild('templateImportTale', { static: false }) templateImportTale;

  constructor(private storeServies: StoreService,
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute,
    private tableService: TableinfoService,
    private alertify: AlertifyService,
    private modalService: BsModalService) {
    this.loginInfor = authService.getCurrentInfor();
    this.table = new MTableInfor();
  }

  onToolbarPreparing(e) {
    if (this.authService.checkRole(this.functionId, '', EmunPermission.Insert)) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "tableproperties", type: "default", text: 'Table place',
          onClick: this.btnBackToTablePlace.bind(this, this.template, null)
        }
      });
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "fas fa-file-import", type: "default", text: 'Import',
          onClick: this.openModal.bind(this, this.templateImportTale, null)
        }
      });
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: 'Add',
          onClick: this.btnCreateModal.bind(this, this.template, null)
        }
      });

    }
  }

  ngOnInit() {
    let isCheckPermission: boolean = this.authService.checkRole(this.functionId, '', EmunPermission.View);
    if (!isCheckPermission) { this.router.navigate(["/admin/permission-denied"]) }
    this.firstPageLoading();
  }

  firstPageLoading() {
    this.storeId = this.authService.storeSelected().storeId;
    this.loadTableOfCompanyAndStore();
  }

  loadTableOfCompanyAndStore() {
    this.tableService.getAll(this.loginInfor.companyCode, this.storeId, "").subscribe((res: any) => {
      if (res.success) {
        this.sourceData = res.data;
      }
      else {
        this.alertify.warning(res.message)
      }
    })
  }

  btnCreateModal(template: TemplateRef<any>, newTable) {
    if (newTable !== null) {
      this.table = newTable;
      this.isNew = false;
    } else {
      this.table = new MTableInfor();
      this.table.status = "A";
      this.table.slot = this.listSeat[0].value;
      this.isNew = true;
    }

    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
  }

  saveInfo() {
    this.table.companyCode = this.loginInfor.companyCode;
    this.table.createdBy = this.loginInfor.username;
    this.table.storeId = this.storeId;
    this.createOrUpdate(this.isNew)
  }

  createOrUpdate(isCreateOrUpdate: boolean) {
    isCreateOrUpdate ?
      this.tableService.create(this.table).subscribe((respon: any) => {
        if (respon.success) {
          this.alertify.success('Creation completed successfully');
          this.modalRef.hide();       
        }
        else {
          this.alertify.warning(respon.message);
        }
        this.loadTableOfCompanyAndStore();
      })
      :
      this.tableService.update(this.table).subscribe((respon: any) => {
        if (respon.success) {
          this.alertify.success('Update completed successfully');
          this.modalRef.hide();
        }
        else {
          this.alertify.warning(respon.message);
        }
        this.loadTableOfCompanyAndStore();
     
      })
  }

  btnDelele(model, tableName) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delele ${tableName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.tableService.delete(model).subscribe((response: any) => {
          if (response.success) {
            this.alertify.success(`Deletion completed successfully`);
            this.loadTableOfCompanyAndStore();
          }
          else {
            this.alertify.error(response.message);
          }
        }, error => {
          this.alertify.error(error);
        });
      }
    })
  }

  openModal(templateImportTale: TemplateRef<any>) {
    setTimeout(() => {
      this.modalRef = this.modalService.show(templateImportTale, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
  }

  btnBackToTablePlace() {
    this.router.navigate(['/admin/masterdata/place-info']);
  }
}
