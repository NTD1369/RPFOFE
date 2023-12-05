import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TPurchaseOrderHeader } from 'src/app/_models/purchase';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { PurchaseService } from 'src/app/_services/transaction/purchase.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { DxDateBoxComponent, DxSelectBoxComponent, DxTextBoxComponent } from 'devextreme-angular';

@Component({
  selector: 'app-management-po-search',
  templateUrl: './management-po-search.component.html',
  styleUrls: ['./management-po-search.component.scss']
})
export class ManagementPoSearchComponent implements OnInit {


  list: TPurchaseOrderHeader[];
  lguAdd: string = "Add";
  fromdate = "";
  todate = "";
  production = false;


  constructor(private authService: AuthService, private purchaseService: PurchaseService, private alertifyService: AlertifyService, private router: Router, public datepipe: DatePipe) {
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

   @ViewChild('transId', { static: false }) transId: DxTextBoxComponent;
   @ViewChild('toCalendar', { static: false }) toCalendar: DxDateBoxComponent;
   @ViewChild('fromCalendar', { static: false }) fromCalendar: DxDateBoxComponent;
   @ViewChild('cbbStatus', { static: false }) cbbStatus: DxSelectBoxComponent;

  ngOnInit() {
    // this.loadList();
    this.production = environment.production;
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift( {
            location: 'before',
            widget: 'dxButton',
            options: {
                width: 136, 
                icon:"add", type:"success", text: this.lguAdd,
                onClick: this.newPromotion.bind(this)
            } 
        });
}

  newPromotion()
  { 
    this.router.navigate(["admin/purchase/new"]);
  }
  delPromotion(data)
  {
    this.alertifyService.warning('Function not response.');
    
  }
  Select(data)
  {
    debugger;
     this.router.navigate(["admin/purchase","edit", data.data.purchaseId]);
    //  this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
  }

  ngAfterViewInit() {
    let now = new Date();
    let from = now.setDate(1);
    this.fromdate = this.datepipe.transform(from, 'yyyy-MM-dd');
    this.todate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    setTimeout(() => {
      console.log("1");
      this.loadList();
    }, 50);
  }

  loadList()
  {
    let fromStr = '';
    let toStr = '';
    let key = '';
    let status = '';
    // if (this.production === false) {
      let from = this.fromCalendar.value;
      let to = this.toCalendar.value;
      status = this.cbbStatus.value;
      key = this.transId.value;
      if (from !== null && from !== undefined) {
        fromStr = this.datepipe.transform(from, 'yyyy-MM-dd');
      }

      if (to !== null && to !== undefined) {
        toStr = this.datepipe.transform(to, 'yyyy-MM-dd');
      }
    // }

    let comp= this.authService.storeSelected();
    this.purchaseService.getAll(comp.companyCode, comp.storeId, fromStr, toStr, key, status).subscribe((response: any)=>{
      
        this.list = response;
      
    });
  }
}
