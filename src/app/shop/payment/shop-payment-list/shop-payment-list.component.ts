import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TPaymentHeader } from 'src/app/_models/tpayment';
import { AuthService } from 'src/app/_services/auth.service';
import { PaymentService } from 'src/app/_services/data/payment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-payment-list',
  templateUrl: './shop-payment-list.component.html',
  styleUrls: ['./shop-payment-list.component.scss']
})
export class ShopPaymentListComponent implements OnInit {
  lguAdd="";
  list: TPaymentHeader[] = [];
  constructor(private paymentService: PaymentService, public authService: AuthService, private router: Router) { }
  functionId="";
  ngOnInit() {
    this.loadData('','','','','');
  }
  statusOptions: any = [
    { name: 'All', value:''},
    { name: 'Active', value:'A'},
    { name: 'Inactive', value:'I'},
    
  ];
  onToolbarPreparing(e) {
    // if (this.authService.checkRole(this.functionId, '', 'I')) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: this.lguAdd,
          onClick: this.newPromotion.bind(this)
        }
      });
    // }
  }
  // payment/:m/:id
  newPromotion() {
    this.router.navigate(["shop/payment", 'create', 'new']);
  }
  viewDetail(data) {
    console.log('da', data);
    this.router.navigate(["shop/payment", 'edit', data.data.transId]);
  }
  loadData(cusId, frmDate, toDate, top, status)
  {
    let currentInfor = this.authService.getCurrentInfor();
    this.paymentService.getAll(currentInfor.companyCode, cusId, frmDate, toDate, top, status).subscribe((response: any)=>{
      if(response.success)
      {
        this.list = response.data;
      }
      else
      {
        Swal.fire({
          icon: 'warning',
          title: 'Update',
          text: 'Successfully Completed'
        });
      }
    })
  }

}
