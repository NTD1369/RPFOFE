import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TInvoiceHeader } from 'src/app/_models/invoice';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { TSalesHeader } from 'src/app/_models/tsaleheader';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InvoiceService } from 'src/app/_services/transaction/invoice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-checkout-list',
  templateUrl: './shop-checkout-list.component.html',
  styleUrls: ['./shop-checkout-list.component.scss']
})
export class ShopCheckoutListComponent implements OnInit {


  invoices: TInvoiceHeader[];
  pagination: Pagination;
  userParams: any = {};

  constructor(private invoiceService: InvoiceService, private alertify: AlertifyService, private routeNav: Router, public datepipe: DatePipe,private authService: AuthService,
    private route: ActivatedRoute) { this.customizeText = this.customizeText.bind(this); }

  customizeText(e) {
    // debugger;
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };

  ngAfterViewInit() {
    debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function (item) {
      // Do stuff here
      if (item !== null && item !== undefined) {
        item.classList.add('hide');
        // console.log('check ou list');
      }
    });
    // paymentMenu

  }
  functionId = 'Shop_CheckOut';
  dateFormat="yyyy/MM/dd";
  fromdate = "";
  todate = "";
  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.routeNav.navigate(["/admin/permission-denied"]);
    }
    else {
      this.dateFormat = this.authService.loadFormat().dateFormat;
      let now = new Date();
      let from = now.setDate(now.getDate() - 0);
  
  
      this.fromdate = this.datepipe.transform(from, 'yyyy-MM-dd');
      this.todate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

      this.loadInvoice(this.fromdate, this.todate);
      // this.route
      // this.loadItems();
      debugger;
      // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
      // this.loadItemPagedList();
      // this.route.data.subscribe(data => {
      //   debugger;
      //   this.invoices = data['invoices'].data;//.result;
       
      //   console.log(' this.invoices' , this.invoices);
      //   // data['items']
      // });
    }
    
  }

  loadInvoice(from , to )
  {
    this.invoiceService.getByType(this.authService.storeSelected().companyCode , this.authService.storeSelected().storeId, 'CheckOut',from,to, '').subscribe((response: any)=>{
      if(response.success)
      {
        this.invoices = response.data;
      }
      else
      {
         
        Swal.fire({
          icon: 'warning',
          title: 'Get CheckIn data',
          text: response.message
        }).then(() => {
          // window.location.reload();
          
  
        });
      }
     
    })
  }
  filterBy(txtFilter: any) {
    debugger;
    this.userParams.keyword = txtFilter;
    this.loadItemPagedList();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadItemPagedList();
  }
  loadItems() {
    this.invoiceService.getItemPagedList().subscribe((res: PaginatedResult<TInvoiceHeader[]>) => {
      // loadItems
      // debugger;
      this.invoices = res.result;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
  loadItemPagedList() {
    this.invoiceService.getItemPagedList(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<TInvoiceHeader[]>) => {
        debugger;
        this.invoices = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }
  OpenInvoice(order: TInvoiceHeader) {
    debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
    this.routeNav.navigate(["shop/invoices", order.transId, order.companyCode, order.storeId]);
  }
  // PrintInvoice(order)
  // {
  //   this.routeNav.navigate(["shop/invoices/print", order.transId, order.companyCode, order.storeId]);
  // }

  PrintPage(order) {
    this.routeNav.navigate(["shop/invoices/print", order.transId, order.companyCode, order.storeId]);
  }
}
