import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from '../auth/page-not-found/page-not-found.component';
import { ManagementDashboardComponent } from '../management/management-dashboard/management-dashboard.component';
import { BillDetailResolver } from '../_resolve/bill-detail.resolver';
import { BillHoldingListResolver } from '../_resolve/bill-holding-list.resolver';
import { BillListResolver } from '../_resolve/bill-list.resolver';
import { BillReturnListResolver } from '../_resolve/bill-return-list.resolver';
import { CustomerListResolver } from '../_resolve/customer-list.resolver';
import { InvoiceDetailResolver } from '../_resolve/invoice-detail.resolver';
import { CheckOutListResolver } from '../_resolve/invoice-list.resolver';
import { InvoicePaymentResolver } from '../_resolve/invoice-payment.resolver';
import { ItemListResolver } from '../_resolve/item-list.resolver';
import { MediaResolver } from '../_resolve/media-list.resolver';
import { POSItemListResolver } from '../_resolve/positem-list.resolver';
import { ShopEmployeeListResolver } from '../_resolve/shop-employee-list.resolver';
import { ShopCapacityCalendarComponent } from './capacity/shop-capacity-calendar/shop-capacity-calendar.component';
import { ShopCapacityComponent } from './capacity/shop-capacity/shop-capacity.component';
import { ShopBillCheckinListComponent } from './checkin/shop-bill-checkin-list/shop-bill-checkin-list.component';
import { ShopBillCheckinComponent } from './checkin/shop-bill-checkin/shop-bill-checkin.component';
import { ShopCheckinMenberComponent } from './checkin/shop-checkin-menber/shop-checkin-menber.component';
import { ShopCheckinSerialComponent } from './checkin/shop-checkin-serial/shop-checkin-serial.component';
import { ShopCheckinVoucherComponent } from './checkin/shop-checkin-voucher/shop-checkin-voucher.component';
import { ShopBillCheckoutComponent } from './checkout/shop-bill-checkout/shop-bill-checkout.component';
import { ShopCheckoutBillComponent } from './checkout/shop-checkout-bill/shop-checkout-bill.component';
import { ShopCheckoutDetailComponent } from './checkout/shop-checkout-detail/shop-checkout-detail.component';
import { ShopCheckoutListComponent } from './checkout/shop-checkout-list/shop-checkout-list.component';
import { ShopCheckoutOpenListComponent } from './checkout/shop-checkout-open-list/shop-checkout-open-list.component';
import { ShopCheckoutPaymentComponent } from './checkout/shop-checkout-payment/shop-checkout-payment.component';
import { ShopCheckoutPrintComponent } from './checkout/shop-checkout-print/shop-checkout-print.component';
import { ShopCheckoutSummaryPrintComponent } from './checkout/shop-checkout-summary-print/shop-checkout-summary-print.component';
import { ShopComponentOtherDisplayComponent } from './components/shop-component-other-display/shop-component-other-display.component';
import { ShopDeliveryOrderDetailComponent } from './delivery/shop-delivery-order-detail/shop-delivery-order-detail.component';
import { ShopDeliveryOrderListComponent } from './delivery/shop-delivery-order-list/shop-delivery-order-list.component';
import { ShopDeliveryOrderPrintComponent } from './delivery/shop-delivery-order-print/shop-delivery-order-print.component';
import { ShopPaymentDetailComponent } from './payment/shop-payment-detail/shop-payment-detail.component';
import { ShopPaymentListComponent } from './payment/shop-payment-list/shop-payment-list.component';
import { PermissionDeniedComponent } from './permission-denied/permission-denied.component';
import { ShopExchangeListComponent } from './rma/exchange/shop-exchange-list/shop-exchange-list.component';
import { ShopExchangeComponent } from './rma/exchange/shop-exchange/shop-exchange.component';
import { ShopReturnBillComponent } from './rma/shop-return-bill/shop-return-bill.component';
import { ShopReturnComponent } from './rma/shop-return/shop-return.component';
import { ShopAnotherSourceBillComponent } from './shop-another-source-bill/shop-another-source-bill.component';
import { ShopBillDetailComponent } from './shop-bill-detail/shop-bill-detail.component';
import { ShopBillListComponent } from './shop-bill-list/shop-bill-list.component';
import { ShopBillPrintComponent } from './shop-bill-print/shop-bill-print.component';
import { ShopCartDetailComponent } from './shop-cart-detail/shop-cart-detail.component';
import { ShopChangeStoreComponent } from './shop-change-store/shop-change-store.component';
import { ShopCounterInputComponent } from './shop-counter-input/shop-counter-input.component';
import { ShopCustomerComponent } from './shop-customer/shop-customer.component';
import { ShopDashboardComponent } from './shop-dashboard/shop-dashboard.component';
import { ShopHoldListComponent } from './shop-hold-list/shop-hold-list.component';
import { ShopOrderGroceryComponent } from './shop-order-grocery/shop-order-grocery.component';
import { ShopOrderComponent } from './shop-order/shop-order.component';
import { ShopPlaceInfoComponent } from './shop-placeInfo/shop-placeInfo.component';
import { ShopSalestypeChangeComponent } from './shop-salestype-change/shop-salestype-change.component';
import { ShopScanBarcodeComponent } from './shop-scan-barcode/shop-scan-barcode.component';
import { ShopSelectShiftComponent } from './shop-select-shift/shop-select-shift.component';
import { ShopComponent } from './shop.component'; 

const routes: Routes = [{
  path: '', component: ShopComponent,

  children: [
    // , resolve: {items: POSItemListResolver }
    { path: 'order', data: { preload: true, loadAfterSeconds: 55 }, component: ShopOrderComponent },
    { path: 'bills/ecom-bill', component: ShopAnotherSourceBillComponent },
    { path: 'bills/ecom-checkout-bill', component: ShopCheckoutOpenListComponent },
    { path: 'order-grocery', component: ShopOrderGroceryComponent,   resolve: { employees: ShopEmployeeListResolver } },
    { path: 'order-grocery/:id', component: ShopOrderGroceryComponent, resolve: { employees: ShopEmployeeListResolver } },
    { path: 'order-grocery/:m/:id', component: ShopOrderGroceryComponent, resolve: { employees: ShopEmployeeListResolver } },
    { path: 'order/:id', component: ShopOrderComponent, resolve: { items: POSItemListResolver } },
    { path: 'order/:m/:id', component: ShopOrderComponent, resolve: { items: POSItemListResolver } },
    { path: 'order/:m/:id/:placeid', component: ShopOrderComponent, resolve: { items: POSItemListResolver } },
    { path: 'order-display', component: ShopComponentOtherDisplayComponent },
    // , resolve: { media: MediaResolver } 
    
    { path: 'return/:id', component: ShopReturnBillComponent },
    { path: 'cart', component: ShopCartDetailComponent },
    // ItemListResolver
    // { path: 'capacity/:itemcode', component: ShopCapacityComponent}, ShopDashboardComponent
    { path: 'dashboard', component: ManagementDashboardComponent },
    { path: 'select-outlets', component: ShopChangeStoreComponent },
    { path: 'shifts', component: ShopSelectShiftComponent },
    { path: 'capacity-calendar', component: ShopCapacityCalendarComponent },
    { path: 'sales-type', component: ShopSalestypeChangeComponent },
    { path: 'customer', component: ShopCustomerComponent  },
    { path: 'customer/:id', component: ShopCustomerComponent },
    { path: 'payment/list', component: ShopPaymentListComponent  },
    { path: 'payment/:m/:id', component: ShopPaymentDetailComponent  },
    { path: 'bills', component: ShopBillListComponent,  resolve: { bills: BillListResolver } },
    { path: 'bills/print/:id/:companycode/:storeid', component: ShopBillPrintComponent, resolve: { order: BillDetailResolver } },
    { path: 'bills/holdinglist', component: ShopHoldListComponent, resolve: { bills: BillHoldingListResolver } },
    { path: 'bills/returnlist', component: ShopHoldListComponent, resolve: { bills: BillReturnListResolver } },
    { path: 'bills/:id/:companycode/:storeid', component: ShopBillDetailComponent, resolve: { order: BillDetailResolver } },
    { path: 'bills/return/:id/:companycode/:storeid', component: ShopReturnComponent, resolve: { order: BillDetailResolver } },
    { path: 'bills/exchange/:id/:companycode/:storeid', component: ShopExchangeComponent, resolve: { order: BillDetailResolver } },
    { path: 'bills/exchange-list', component: ShopExchangeListComponent },
    { path: 'bills/checkout/:id/:companycode/:storeid', component: ShopCheckoutBillComponent },
    { path: 'bills/delivery/:m/:id/:companycode/:storeid', component: ShopDeliveryOrderDetailComponent },
    { path: 'bills/delivery-print/:id/:companycode/:storeid', component: ShopDeliveryOrderPrintComponent },
    { path: 'bills/delivery-list', component: ShopDeliveryOrderListComponent },
    { path: 'bills/scanbarcode', component: ShopScanBarcodeComponent },

    { path: 'bills/checkout-payment/:id/:event/:companycode/:storeid', component: ShopCheckoutPaymentComponent, resolve: { invoice: InvoicePaymentResolver } },
    { path: 'bills/checkout-summary-print/:id/:event/:companycode/:storeid', component: ShopCheckoutSummaryPrintComponent, resolve: { invoice: InvoicePaymentResolver } },

    { path: 'checkin-by-orderid', component: ShopBillCheckinComponent },
    { path: 'checkin-by-orderid/:id/:companycode/:storeid', component: ShopBillCheckinComponent },
    { path: 'checkin-by-voucher', component: ShopCheckinVoucherComponent },
    { path: 'invoices/:id/:companycode/:storeid', component: ShopCheckoutDetailComponent, resolve: { invoice: InvoiceDetailResolver } },
    { path: 'invoices/print/:id/:companycode/:storeid', component: ShopCheckoutPrintComponent, resolve: { invoice: InvoiceDetailResolver } },
    // , resolve: { invoices: CheckOutListResolver }
    { path: 'invoices/checkout', component: ShopCheckoutListComponent },
    { path: 'invoices/checkin', component: ShopBillCheckinListComponent },
    { path: 'device-setting/:url', component: ShopCounterInputComponent },
    { path: 'device-setting', component: ShopCounterInputComponent },
    { path: 'checkin-by-member', component: ShopCheckinMenberComponent },
    { path: 'checkin-by-serial', component: ShopCheckinSerialComponent },
    { path: 'placeInfo/:storeid', component: ShopPlaceInfoComponent },








    // ManagementDashboardComponent
    { path: '404', component: PageNotFoundComponent },
    { path: '**', component: ShopDashboardComponent }


  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
