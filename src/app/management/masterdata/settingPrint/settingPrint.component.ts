import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EmunPermission } from 'src/app/_models/emun/emun-permission';
import { MPlaceInfor } from 'src/app/_models/placeinfor';
import { MUser } from 'src/app/_models/user';
import { ItemGroupModel } from 'src/app/_models/viewmodel/ItemGroup';
import { PlacePrintModel, SyncPrintNameViewModel, disPlayName } from 'src/app/_models/viewmodel/PlacePrintModel';
import { ViewItemByItemGroupModel } from 'src/app/_models/viewmodel/ViewItemByItemGroup';
import { AuthService } from 'src/app/_services/auth.service';
import { PlacePrintService } from 'src/app/_services/data/placePrint.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settingPrint',
  templateUrl: './settingPrint.component.html',
  styleUrls: ['./settingPrint.component.scss']
})

export class SettingPrintComponent implements OnInit {
  @ViewChild('template', { static: false }) template;
  @ViewChild('templatePrintName', { static: false }) templatePrintName;
  @ViewChild('templateImportTale', { static: false }) templateImportTale;
  @ViewChild('templateViewItemGroup', { static: false }) templateViewItemGroup;


  public loginInfor: MUser = new MUser;
  public storeId: string;
  public functionId: string = "Adm_SettingPrint";
  public modalRef: BsModalRef = new BsModalRef;
  public sourceData: Array<PlacePrintModel>;
  public placePrint: PlacePrintModel = new PlacePrintModel;
  public itemGourpList;
  public itemGourpList2: Array<disPlayName>;
  public syncPrintNameViewModel: Array<SyncPrintNameViewModel>;
  public place: MPlaceInfor;
  public storeList;
  public isNew: boolean = false;
  public listStatus: any = [
    { name: "Active", value: "A" },
    { name: "In Active", value: "I" }
  ]
  public itemByItemGroup : Array<ViewItemByItemGroupModel>;




  constructor(
    private storeServies: StoreService,
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private alertify: AlertifyService,
    private placePrintService: PlacePrintService
  ) {
    this.loginInfor = authService.getCurrentInfor();
    this.placePrint = new PlacePrintModel()
    this.place = new MPlaceInfor();
  }

  ngOnInit() {
    let isCheckPermission: boolean = this.authService.checkRole(this.functionId, '', EmunPermission.View);
    if (!isCheckPermission) { this.router.navigate(["/admin/permission-denied"]) }
    this.place.companyCode = this.loginInfor.companyCode;
    this.placePrint.StoreId = this.storeId;
    this.firstPageLoading();
  }

  firstPageLoading() {
    this.storeId = this.authService.storeSelected().storeId;
    this.loadPlacePrintAndStore();
    this.LoadListItemGroup();
    this.loadStore();
  }

  loadPlacePrintAndStore() {
    this.placePrintService.getAll(this.loginInfor.companyCode, this.storeId).subscribe((res: any) => {
      if (res.success) {
        this.sourceData = res.data;
      }
      else {
        this.alertify.warning(res.message)
      }
    })
  }

  LoadListItemGroup() {
    this.placePrintService.getListItemGroup(this.loginInfor.companyCode, this.storeId).subscribe((res: any) => {
      if (res.success) {
        this.itemGourpList = res.data;
      }
      else {
        this.alertify.warning(res.message)
      }
    })
  }

  btnCreateModal(template: TemplateRef<any>, newData) {
    this.syncPrintNameViewModel = [];
    if (newData !== null) {
      this.placePrint = newData;
      this.placePrint.groupItem = parseInt(newData.groupItem);
      this.placePrint.PrintName = newData.printName;
      this.isNew = false;
    } else {
      this.placePrint = new PlacePrintModel;
      this.isNew = true;
    }

    this.place.storeId = this.isNew ? this.storeId : newData.storeId;
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
  }

  onToolbarPreparing(e) {
    if (this.authService.checkRole(this.functionId, '', EmunPermission.Insert)) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "tableproperties", type: "success", text: 'Table place',
          onClick: this.btnBackToTablePlace.bind(this, this.template, null)
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

  loadStore() {
    this.storeServies.getAll(this.loginInfor.companyCode).subscribe((respon: any) => {
      if (respon.success) {
        this.storeList = respon.data;
      }
      else {
        this.alertify.warning(respon.message)
      }
    })
  }

  saveInfo() {
    this.placePrint.CompanyCode = this.loginInfor.companyCode;
    this.placePrint.CreatedBy = this.loginInfor.username;
    this.placePrint.StoreId = this.storeId;
    this.placePrint.groupItem = this.placePrint.groupItem?.toString();
    this.createOrUpdate(this.isNew)
  }

  createOrUpdate(isCreateOrUpdate: boolean) {
    isCreateOrUpdate ?
      this.placePrintService.create(this.placePrint).subscribe((respon: any) => {
        if (respon.success) {
          this.alertify.success('Create completed successfully');
          this.modalRef.hide();
          this.loadPlacePrintAndStore();

        }
        else {
          this.alertify.warning(respon.message);
        }
      })
      :
      this.placePrintService.update(this.placePrint).subscribe((respon: any) => {
        if (respon.success) {
          this.alertify.success('Update completed successfully');
          this.modalRef.hide();
        }
        else {
          this.alertify.warning(respon.message);
        }
        this.loadPlacePrintAndStore();

      })
  }

  btnDelele(model, itemPrint) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delele ${itemPrint}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.placePrintService.delete(model.printId).subscribe((response: any) => {
          if (response.success) {
            this.alertify.success(`Deletion completed successfully`);
            this.loadPlacePrintAndStore();
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

  btnBackToTablePlace() {
    this.router.navigate(['/admin/masterdata/place-info']);
  }

  btnSyncSytemPrintName() {
    this.placePrintService.getSystemPrintName().subscribe((res: any) => {
      if (res.errorMessage != null) {
        this.alertify.warning(res.message);
      }
      else {
        this.syncPrintNameViewModel = res;
      }
    })
  }

  onValueChanged($event) {
    this.placePrint.PrintName = $event.value;
  }

  btnViewModal(templateViewItemGroup: TemplateRef<any>, itemGroup) {
    debugger;
    this.placePrintService.viewItemByItemGroup(this.loginInfor.companyCode,this.storeId,itemGroup.groupItem,"A").subscribe((res: any) => {
      if (res.success) {
        this.itemByItemGroup = res.data;
      }
      else {
        this.alertify.warning(res.message)
      }
    })
    setTimeout(() => {
      this.modalRef = this.modalService.show(this.templateViewItemGroup, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
  }
}

