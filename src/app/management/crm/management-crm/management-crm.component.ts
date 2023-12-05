import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SLoyaltyHeader } from 'src/app/_models/crm';
import { AuthService } from 'src/app/_services/auth.service';
import { CrmService } from 'src/app/_services/data/crm.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-crm',
  templateUrl: './management-crm.component.html',
  styleUrls: ['./management-crm.component.scss']
})
export class ManagementCrmComponent implements OnInit {

  dateFormat = "";
  functionId = "Adm_LoyaltyList";
  list: SLoyaltyHeader[];
  lguAdd: string = "Add";

  constructor(private authService: AuthService, private crmService: CrmService, private alertifyService: AlertifyService
    , private router: Router) {
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
    // let check =  this.authService.checkRole(this.functionId , '', 'V' );
    // if(check === false)
    // {
    //   this.router.navigate(["/admin/permission-denied"]);
    // }
    // else
    // {

    // } 
    this.dateFormat = this.authService.loadFormat().dateFormat;
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
          onClick: this.newPromotion.bind(this)
        }
      });
    }
  }

  newPromotion() {
    this.router.navigate(["admin/crm/setup"]);
  }
  del(data) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this promotion',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.crmService.remove(data.data.loyaltyId, this.authService.storeSelected().companyCode).subscribe((response: any) => {
          // debugger;
          if (response.success) {
            // debugger;
            this.alertifyService.success('Remove promotion ' + data.data.loyaltyId + ' completed successfully. ');
            this.loadList();
          }
          else {
            this.alertifyService.warning('Remove promotion failed. Message: ' + response.message);
          }
        });

      }
    });
  }
  viewDetail(data) {
    // debugger;
    this.router.navigate(["admin/crm", "edit", data.data.loyaltyId]);
    //  this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
  }
  loadList() {
    let comp = this.authService.storeSelected().companyCode;
    this.crmService.search(comp, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '').subscribe((response: any) => {
      if (response.success == true) {
        // debugger;
        this.list = response.data
      }
      else {
        this.alertifyService.warning('load data failed. Message: ' + response.message);
      }

    });
  }

}
