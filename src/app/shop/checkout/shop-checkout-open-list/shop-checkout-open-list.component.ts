import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { TSalesHeader } from 'src/app/_models/tsaleheader';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-shop-checkout-open-list',
  templateUrl: './shop-checkout-open-list.component.html',
  styleUrls: ['./shop-checkout-open-list.component.scss']
})
export class ShopCheckoutOpenListComponent implements OnInit {

 
  bills: TSalesHeader[]; 
  userParams: any = {};
  
  constructor(private billService: BillService, private alertify: AlertifyService, private routeNav: Router, private authService: AuthService,
              private route: ActivatedRoute) { 
                this.customizeText= this.customizeText.bind(this);
                
              }
    customizeText (e) {
      // debugger;
        if( e.value!==null &&  e.value!== undefined)
        {
          return this.authService.formatCurrentcy( e.value);
  
        }
        return 0;
    };
  ngAfterViewInit()
  {
    debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function(item) {
      // Do stuff here
        if(item !== null && item !== undefined)
        {
          item.classList.add('hide');
          // console.log('chek out open');
        }
    });
    // paymentMenu
  
  }
  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
        location: 'before',
        template: 'totalGroupCount'
    }, {
            location: 'before',
            widget: 'dxSelectBox',
            options: {
                width: 200,
                items: [{
                    value: 'POS',
                    text: 'POS'
                }, {
                    value: '',
                    text: 'Others'
                }],
                displayExpr: 'text',
                valueExpr: 'value',
                value: 'dataSource',
                onValueChanged: this.groupChanged.bind(this)
            } 
        });
  }
  totalCount: number;
  groupChanged(e) {
    // this.dataGrid.instance.clearGrouping();
    // this.dataGrid.instance.columnOption(e.value, 'groupIndex', 0);
    // this.totalCount = this.getGroupCount(e.value);
    debugger;
    this.dataGrid.instance.columnOption('dataSource', "=", e.value);
  }
  // getGroupCount(groupField) {
  //   debugger;
  //   let abc= query(this.bills)
  //   .groupBy(groupField)
  //   .toArray().length;
  //     return abc;
  // }
  expanded = true;
  // routerLink="printOrder(cell.data)/shop/bills/print/{{}}/:companycode/:storeid">
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  ngOnInit() {
     
    // this.route
    // this.loadItems();
    // debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.bills = data['bills'];//.result;
    //   // this.totalCount = this.getGroupCount('dataSource');
    //   console.log(this.bills);
    // //   this.pagination = data['bills'].pagination;
    // //   // debugger;
    // //   this.userParams.status = ''; 
    // // this.userParams.keyword = ''; 
    // // this.userParams.orderBy = 'byName';

    //   // data['items']
    // });
    this.loadItems();
  }
 
  loadItems() {

    this.billService.getCheckoutOpentList(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, 'SALES','','', 
        this.authService.getCurrentInfor().username).subscribe((response: any) => {
      // loadItems
      // debugger;
      if(response.success)
      {
        this.bills = response.data;
        console.log(this.bills);
      }
      else
      {
        this.alertify.warning(response.message);
      }
     
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
   
  OpenOrder(order: Order)
  {
    debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
     this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
  }
  // PrintOrder(order)
  // {
  //   //  /shop/bills/print//:companycode/:storeid
  //    this.routeNav.navigate(["shop/bills/print", order.transId, order.companyCode, order.storeId]);
  // }
  CheckOutOrder(order: Order)
  {
    debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
     this.routeNav.navigate(["shop/bills/checkout", order.transId, order.companyCode, order.storeId]);
  }
  ConfirmOrder(order: Order)
  {

  }
  CheckInOrder(order: Order)
  {
    debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
     this.routeNav.navigate(["shop/bills/checkin", order.transId, order.companyCode, order.storeId]);
  }

}
