import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDiagramComponent } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';
import { confirm } from 'devextreme/ui/dialog';
import { MPlaceInfor } from 'src/app/_models/placeinfor';
import { MTableInfor } from 'src/app/_models/tableInfor';
import { AuthService } from 'src/app/_services/auth.service';
import { PlaceService } from 'src/app/_services/data/place.service';
import { TablePlaceService } from 'src/app/_services/data/table-place.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { DomSanitizer } from '@angular/platform-browser';
import { v4 as uuidv4 } from 'uuid';
import { EnvService } from 'src/app/env.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { table } from 'console';
@Component({
  selector: 'app-Management-table-design',
  templateUrl: './Management-table-design.component.html',
  preserveWhitespaces: true,
  styleUrls: ['./Management-table-design.component.scss']
})

export class ManagementTableDesignComponent implements OnInit {
  public apiUrl: string = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  public currentTableInfor: MTableInfor = new MTableInfor();
  public placeInfor: MPlaceInfor;
  public tableInforList: MTableInfor[] = [];
  public tableInfors: MTableInfor[];
  public dataSource: ArrayStore;
  public popupVisible: boolean = false;
  public reload: boolean = false;
  public generatedID: number = 100;
  public placeList: Array<any> = [];
  public placeName: string = null;

  public detail;
  public itemselected;
  public sourceC;
  public loginInfo;
  public placeId;
  public storeId;
  public urlImage;

  @ViewChild(DxDiagramComponent, { static: false }) diagram: DxDiagramComponent;

  constructor(http: HttpClient, private tablePlace: TablePlaceService, private placeService:
    PlaceService, public authService: AuthService, private router: Router,
    public env: EnvService, private route: ActivatedRoute, private sanitizer: DomSanitizer,
    private alertity: AlertifyService) {

    let sef = this;
    this.itemStyleExpr = this.itemStyleExpr.bind(this);
    this.loginInfo = this.authService.getCurrentInfor();

    this.placeId = this.route.snapshot.params.placeid;
    this.storeId = this.route.snapshot.params.storeid;

    this.dataSource = new ArrayStore({
      key: 'tableId',
      data: [],
      onInserting(values) {
        values.id = uuidv4();
        // let id = values.text.split('-')[0];
        // debugger;
        let tableInfor = sef.tableInforList.find(x => x.tableId === values.tableId);
        if (tableInfor !== undefined && tableInfor !== null) {
          values.dataItem = tableInfor;
          values.tableId = tableInfor.tableId || "";
          values.tableName = tableInfor.tableName || "";
          values.slot = tableInfor.slot || "";
          values.displayName = `TableName:${tableInfor.tableName || ""}-Seat:${tableInfor.slot || ""}`
          values.status = values.status || "A";
          values.isOrdered = values.isOrdered || false;
        }
      },
    });
  }

  ngOnInit() {
    this.loadTableData();
  }

  loadTableData() {
    this.tablePlace.getAll(this.authService.getCompanyInfor().companyCode, this.storeId, '', this.placeId, "", "Y", "Y").subscribe((res: any) => {
      if (res.success) {
        this.tableInforList = res.data.filter(x => x.status === 'A');
        this.getByCode(this.placeId);
      } else {
        this.alertity.warning("Error");
      }
    })
  }

  filterAvailable() {
    let arrSave = this.diagram.instance.getItems();
    arrSave.forEach(element => {
      if (element.dataItem?.isOrdered === true) {
        this.dataSource.push([{ type: 'remove', key: element.dataItem.tableId }]);
      }
    });
  }

  contentReadyHandler(e) {
    const diagram = e.component;
    const items = diagram.getItems().filter((item) => item.itemType === 'shape' && (item.text.toLowerCase().includes('bàn')));
    if (items.length > 0) {
      diagram.setSelectedItems(items);
      diagram.scrollToItem(items[0]);
      diagram.focus();
    }
  }

  selectionChangedHandler(e) {
    this.itemselected = e.items.filter((item) => item.itemType === 'shape');
  }

  detailSelected() {
    console.log("this.itemselect", this.itemselected);
    // let b = this.itemselected.find((item)=>item.itemType === 'shape'); tìm ra 1 phần tử
    // this.detail = b;

    let b = this.itemselected[0];//lấy ra phần tử thứ nhất [0]
    //toLowerCase : chữ hoa thành chữ trong data
    // let c = this.tableInforList.find((item)=>item.tableName.toLowerCase() === "bàn 1");
    // let c = this.tableInforList.find((item)=>item.tableName.toLowerCase() === b.text.toLowerCase());

    let id = b.text.split('-')[0].toLowerCase();

    // let c = this.tableInforList.find((item)=>item.tableName.toLowerCase() === b.text.toLowerCase());
    let c = this.tableInforList.find((item) => item.tableId.toLowerCase() === id.toLowerCase());
    this.detail = c;
    console.log("b", b);
    console.log("c", c);
  }

  itemTypeExpr(obj) {
    return 'employee';
  }

  itemCustomDataExpr(obj, value) {
    if (value === undefined) {
      return {
        id: obj.id,
        tableId: obj.tableId,
        tableName: obj.tableName,
        remark: obj.remark,
        storeId: obj.storeId,
        isOrdered: obj.isOrdered,
      };
    }
    obj.id = value.id;
    obj.tableId = value.tableId;
    obj.tableName = value.tableName;
    obj.remark = value.remark;
    obj.storeId = value.storeId;
    obj.isOrdered = value.isOrdered;

  }

  requestLayoutUpdateHandler(e) {
    // for (let i = 0; i < e.changes.length; i++) {
    //   if (e.changes[i].type === 'remove') { e.allowed = true; } 
    //   else 
    //   if (e.changes[i].data.tableId !== undefined && e.changes[i].data.tableId !== null) { e.allowed = true; }
    // }
  }

  editTable(table) {
    this.currentTableInfor = { ...table };
    this.popupVisible = true;
  }

  deleteTable(table) {
    this.dataSource.push([{ type: 'remove', key: table.tableId }]);
  }

  updateTable() {
    this.dataSource.push([{
      type: 'update',
      key: this.currentTableInfor.tableId,
      data: {
        tableId: this.currentTableInfor.tableId,
        tableName: this.currentTableInfor.tableName,

        remark: this.currentTableInfor.remark,
        storeId: this.currentTableInfor.storeId,
        isOrdered: this.currentTableInfor.isOrdered
      },
    }]);
    this.popupVisible = false;
  }

  AssignModel(table) {
    this.reload = false;
    this.currentTableInfor = { ...table };
    if (this.currentTableInfor !== null && this.currentTableInfor !== undefined) {
      let value = !this.currentTableInfor.isOrdered;
      this.dataSource.push([{
        type: 'update',
        key: this.currentTableInfor.tableId,
        data: {
          tableId: this.currentTableInfor.tableId,
          tableName: this.currentTableInfor.tableName,
          remark: this.currentTableInfor.remark,
          storeId: this.currentTableInfor.storeId,
          slot: this.currentTableInfor.slot,
          isOrdered: value
        },
      }]);

      let currenX: any = this.currentTableInfor;
      let tableInlist = this.tableInforList.find(x => x.tableId === currenX?.tableId);
      if (tableInlist !== null && tableInlist !== undefined) {
        tableInlist.isOrdered = value;
        this.currentTableInfor.isOrdered = value;
      }
    }

    this.itemStyleExpr(this.currentTableInfor);
  }

  HideModel() {
  }

  itemStyleExpr(obj) {
    if (!this.reload) {
      if (obj.isOrdered) { return { fill: '#ffcfc3' }; }
      return { fill: '#bbefcb' };
    }
    else {
      let idText = obj?.text;
      if (idText !== '' && idText !== undefined && idText !== null) {
        if (this.tableInforList !== null && this.tableInforList !== undefined && this.tableInforList?.length > 0) {
          let id = obj?.text.split('-')[0].toLowerCase();
          let getObj = this.tableInforList.find(x => x?.tableId === id);
          if (getObj !== null && getObj !== undefined) {
            obj.isOrdered = getObj.isOrdered;
          }
        }
      }
    }
  }

  cancelEditEmployee() {
    this.currentTableInfor = new MTableInfor();
    this.popupVisible = false;
  }

  clearDesign() {
    setTimeout(() => {
      this.diagram.instance.import(null);
    }, 100);
  }

  saveModel() {
    this.diagram.instance.endUpdate();
    this.sourceC = this.diagram.instance.export();
    this.placeInfor.assignMap = this.sourceC;
    this.placeInfor.modifiedBy = this.loginInfo.username;
    this.updatePlace(this.placeInfor);
  }

  updatePlace(model) {
    this.placeService.update(model).subscribe((rep: any) => {
      if (rep.success) {
        Swal.fire('Save Design', 'save  completed successfully. ', 'success').then(() => {
          this.reloadModel();
        });
      }
      else {
        this.alertity.error(rep.message);
        this.loadTableData();
      }
    })
  }

  reloadModel() {
    if (this.diagram !== undefined && this.diagram !== null) {
      this.reload = true;
      this.diagram.instance.import(this.placeInfor.assignMap);
    }
  }

  onCustomCommand(e) {
    if (e.name === 'clear') {
      const result = confirm('Are you sure you want to clear the diagram? This action cannot be undone.', 'Warning');
      result.then(
        (dialogResult) => {
          if (dialogResult) {
            e.component.import('');
          }
        },
      );
    }
  }

  getByCode(code) {
    this.placeService.getByCode(this.authService.getCompanyInfor().companyCode, this.storeId, code).subscribe((res: any) => {
      if (res.success) {
        this.placeInfor = res.data;
        if (this.placeInfor.urlImageSave !== null && this.placeInfor.urlImageSave !== undefined && this.placeInfor.urlImageSave.toString() !== "" && this.placeInfor.urlImageSave.toString() !== "undefined") {
          this.urlImage = this.apiUrl.replace('api', '') + this.placeInfor.urlImageSave;
        }
        this.reloadModel();
      } else {
        this.alertity.error(res.message)
      }
    })
  }

  backtoList() {
    this.router.navigate(['/admin/masterdata/place-info']);
  }
}