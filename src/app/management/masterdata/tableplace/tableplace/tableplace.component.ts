import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { PlaceService } from 'src/app/_services/data/place.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { TablePlaceService } from 'src/app/_services/data/table-place.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { EmunPermission } from 'src/app/_models/emun/emun-permission';
import { MTableInfor, ResponseTableInfo } from 'src/app/_models/tableinfo';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TableinfoService } from 'src/app/_services/data/tableinfo.service';
import { MPlaceInfor } from 'src/app/_models/table-place';
@Component({
  selector: 'app-tableplace',
  templateUrl: './tableplace.component.html',
  styleUrls: ['./tableplace.component.scss']
})
export class TableplaceComponent implements OnInit {
  public dataGrid;
  public placeId;
  public storeId;
  public loginInfor;
  public placeName: string = null;
  public functionId: string = "Adm_TableInfor";
  public table: MTableInfor = new MTableInfor;
  public isNew: boolean = false;
  public modalRef: BsModalRef = new BsModalRef;
  public sourceData: Array<ResponseTableInfo>;

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
  constructor(public authService: AuthService,
    private alertity: AlertifyService,
    private route: ActivatedRoute,
    private router: Router,
    private tablePlace: TablePlaceService,
    private placeService: PlaceService,
    private modalService: BsModalService,
    private tableService: TableinfoService
  ) { }

  ngOnInit() {
    this.loginInfor = this.authService.getCurrentInfor();
    this.loadingFirstData();
  }

  apply(model) {
    this.tablePlace.apply(model).subscribe((res: any) => {
      if (res.success) {
        this.loadData()
        this.alertity.success('Apply completed successfully.');
      }
      else {
        this.alertity.error(res.message);
      }
    })
  }

  saveInfo() {
    this.table.companyCode = this.loginInfor.companyCode;
    this.table.createdBy = this.loginInfor.username;
    this.table.storeId = this.storeId;
    this.createTable();
  }

  createTable() {
    this.tableService.create(this.table).subscribe((respon: any) => {
      if (respon.success) {

        const mPlaceInfor = new MPlaceInfor();
        mPlaceInfor.placeId = this.placeId;
        mPlaceInfor.tableId = respon.data?.tableId;
        mPlaceInfor.companyCode = this.table.companyCode;
        mPlaceInfor.storeId = this.table.storeId;
        mPlaceInfor.slot = this.table.slot;
        this.apply(mPlaceInfor);

        this.alertity.success('Creation completed successfully');
        this.modalRef.hide();
        this.loadTableOfCompanyAndStore();
      }
      else {
        this.alertity.warning(respon.message);
      }
    })
  }

  loadTableOfCompanyAndStore() {
    this.tableService.getAll(this.loginInfor.companyCode, this.storeId, "").subscribe((res: any) => {
      if (res.success) {
        this.sourceData = res.data;
      }
      else {
        this.alertity.warning(res.message)
      }
    })
  }

  loadingFirstData() {
    this.route.params.subscribe(data => {
      let placeid = data['placeid'];
      let storeId = data['storeid'];
      this.storeId = storeId;
      this.placeId = placeid;
    })

    this.loadData();
    this.loadPlaceByPlaceId();
  }

  loadData() {
    this.tablePlace.GetAllTableNoActiveInPlace(this.authService.getCompanyInfor().companyCode, this.storeId, '', this.placeId, "", "Y", "").subscribe((res: any) => {
      if (res.success) {
        this.dataGrid = res.data;
      } else {
        this.alertity.warning(res.message)
      }
    })
  }

  loadPlaceByPlaceId() {
    this.placeService.getByCode(this.authService.getCompanyInfor().companyCode, this.storeId, this.placeId).subscribe((res: any) => {
      if (res.success) {
        this.placeName = res.data.placeName;
      } else {
        this.alertity.warning(res.message)
      }
    })
  }

  backtoList() {
    this.router.navigate(['/admin/masterdata/place-info']);
  }

  btnCreateModal(template: TemplateRef<any>, newTable) {
    if (newTable !== null) {
      this.table = newTable;
      this.isNew = false;
    } else {
      this.table = new MTableInfor();
      this.table.status = "A"
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

  onToolbarPreparing(e) {
    if (this.authService.checkRole(this.functionId, '', EmunPermission.Insert)) {
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

  btnBackToTablePlace() {
    this.router.navigate(['/admin/masterdata/place-info']);
  }
}
