import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SchemaHeaderViewModel } from 'src/app/_models/promotion/schemaHeaderViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { PromotionService } from 'src/app/_services/promotion/promotion.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-promotion-schema',
  templateUrl: './management-promotion-schema.component.html',
  styleUrls: ['./management-promotion-schema.component.scss']
})
export class ManagementPromotionSchemaComponent implements OnInit {
  schemaList: SchemaHeaderViewModel[] = [];
  functionId = "Adm_PromotionSchema";
  lguAdd: string = "Add";

  constructor(private authService: AuthService, private router: Router,
    private promotionService: PromotionService, private alertifyService: AlertifyService) {
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
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.loadList();
  }

  onToolbarPreparing(e) {
    if (this.authService.checkRole(this.functionId, '', 'I')) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: this.lguAdd,
          onClick: this.newSchema.bind(this)
        }
      });
    }
  }
  newSchema() {

    this.router.navigate(["admin/promotion-schema/setup"]);
  }

  viewDetail(data) {
    debugger;
    this.router.navigate(["admin/promotion-schema/setup", data.schemaId]);
    //  this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
  }

  loadList() {
    let comp = this.authService.storeSelected().companyCode;
    this.promotionService.searchSchema(comp, '', '', '', '').subscribe((response: any) => {
      if (response.success == true) {
        this.schemaList = response.data
      }
      else {
        this.alertifyService.warning('load data failed. Message: ' + response.message);
      }
    });
  }
}
