import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IPermission } from 'src/app/shop/shop-another-source-bill/shop-another-source-bill.component';
import { RPT_InventoryOnHandModel } from 'src/app/_models/common/report';
import { AuthService } from 'src/app/_services/auth.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { StoreService } from 'src/app/_services/data/store.service';
@Component({
  selector: 'app-rpt-inventoryonhand',
  templateUrl: './rpt-inventoryonhand.component.html',
  styleUrls: ['./rpt-inventoryonhand.component.scss']
})
export class RptInventoryonhandComponent implements OnInit {

  list: RPT_InventoryOnHandModel[] = [];
  storeOptions: any = [];
  controlList: any[];
  permissionDic: IPermission[] = [];

  isNew: boolean = false;
  isLoadingData = true;
  dateFormat = "";
  functionId = "RPT_InventoryOnhand";

  constructor(public authService: AuthService, private reportService: ReportService, private alertify: AlertifyService, private router: Router,
    private controlService: ControlService, private modalService: BsModalService, private route: ActivatedRoute, private storeService: StoreService) {
  }

  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');
    let nameOfRpt = 'InventoryOnHand';
    var d = new Date();
    let dateFm = this.GetDateFormat(d);

    nameOfRpt = nameOfRpt + '_' + dateFm.replace(/\-/gi, '') + '_' + this.authService.getCurrentInfor().username;
    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      // customizeCell: function(options) {
      //     const excelCell = options;
      //     excelCell.font = { name: 'Arial', size: 12 };
      //     excelCell.alignment = { horizontal: 'left' };
      // } 
    }).then(function () {
      workbook.xlsx.writeBuffer()
        .then(function (buffer: BlobPart) {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), nameOfRpt + '.xlsx');
        });
    });
    e.cancel = true;
  }

  ngOnInit() {
    this.dateFormat = this.authService.loadFormat().dateFormat;
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    else {
      this.loadControl();
      // this.loadItems("", "", this.authService.getCurrentInfor().username);
      this.loadStore();
    }
  }

  checkPermission(controlId: string, permission: string): boolean {
    // debugger;
    let result = false;
    let re = this.permissionDic.find(x => x.controlId === controlId && x.permission === permission);
    if (re === null || re === undefined) {
      let rs = this.authService.checkRole(this.functionId, controlId, permission);
      let per = new IPermission();
      per.controlId = controlId;
      per.permission = permission;
      per.result = rs;
      this.permissionDic.push(per);
      result = true;
    }
    else {
      result = re.result;
    }

    return result;
  }

  loadControl() {
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
      if (response.data.length > 0) {
        debugger;
        this.controlList = response.data.filter(x => x.custom2 !== 'button' && x.controlType === 'GridColumn');
        this.controlList = this.controlList.sort((a, b) => a.orderNum > b.orderNum ? 1 : -1);
      }
    });
  }

  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return date.getFullYear() + '-' + month + '-' + (day);
  }
  viewReport(storeSearch) {
    this.loadItems(this.authService.storeSelected().companyCode, storeSearch.value, this.authService.getCurrentInfor().username);
  }
  loadItems(companycode, store, user) {
    this.reportService.get_RPT_InventoryOnHand(companycode, store, user).subscribe((res: any) => {
      // loadItems
      debugger;
      if (res.success) {
        this.list = res.data;
      }
      else {
        this.alertify.error(res.message);
      }

      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }

  loadStore() {
    this.storeService.getByUserWithStatus(this.authService.decodeToken?.unique_name).subscribe((response: any) => {
      // debugger;
      if (response.success) {
        response.data.forEach(item => {
          // let data = { name: item.storeName, value: item.storeId }
          let data = {
            name: item.status === 'I' ? item.storeName + " (Inactive)" : item.storeName, 
            value:item.storeId
         }
          console.log("item", item);
          this.storeOptions.push(data);
        });;
        this.storeOptions.unshift({ name: 'All', value: '' });
      }
      else {
        this.alertify.warning(response.message);
      }
    });
  }


}
