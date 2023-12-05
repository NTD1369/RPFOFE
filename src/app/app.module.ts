import { BrowserModule } from '@angular/platform-browser';

import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER, Injector, PipeTransform, Pipe } from '@angular/core';
// Material
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatBadgeModule } from '@angular/material/badge';
// import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
// import { MatButtonModule } from '@angular/material/button';
// import { MatButtonToggleModule } from '@angular/material/button-toggle';
// import { MatCardModule } from '@angular/material/card';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatStepperModule } from '@angular/material/stepper';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatGridListModule } from '@angular/material/grid-list';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { MatListModule } from '@angular/material/list';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatSelectModule } from '@angular/material/select';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatSliderModule } from '@angular/material/slider';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatSortModule } from '@angular/material/sort';
// import { MatTableModule } from '@angular/material/table';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatTreeModule } from '@angular/material/tree';

// End Material


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShopComponent } from './shop/shop.component';
import { ManagementComponent } from './management/management.component';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './_services/auth.service';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { AlertifyService } from './_services/system/alertify.service';
import { AuthGuard } from './_guard/auth.guard';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ShopLeftMenuComponent } from './shop/shop-left-menu/shop-left-menu.component';
import { ShopHeaderComponent } from './shop/shop-header/shop-header.component';
import { LoginComponent } from './auth/login/login.component';
import { ChangePasswordComponent } from './auth/changepassword/changepassword.component';
import { ManagementHeaderComponent } from './management/management-header/management-header.component';
import { ManagementLeftMenuComponent } from './management/management-left-menu/management-left-menu.component';
import { ManagementSubMenuComponent } from './management/management-sub-menu/management-sub-menu.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ShopItemSingleComponent } from './shop/shop-item-single/shop-item-single.component';
import { ShopOrderComponent } from './shop/shop-order/shop-order.component';
import { ItemService } from './_services/data/item.service';
import { ItemListResolver } from './_resolve/item-list.resolver';
import { ShopBillInforComponent } from './shop/shop-bill-infor/shop-bill-infor.component';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ShopBillListComponent } from './shop/shop-bill-list/shop-bill-list.component';
import { BillService } from './_services/data/bill.service';
import { BillListResolver } from './_resolve/bill-list.resolver';
import { ShopCustomerComponent } from './shop/shop-customer/shop-customer.component';
import { CustomerService } from './_services/data/customer.service';
import { CustomerListResolver } from './_resolve/customer-list.resolver';
import { PageNotFoundComponent } from './auth/page-not-found/page-not-found.component';
// import { TestComponent } from './management/test/test.component';
import { NgToggleModule } from 'ng-toggle-button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NumpadDiscountComponent } from './shop/numpad-discount/numpad-discount.component';
import { ShopBillDetailComponent } from './shop/shop-bill-detail/shop-bill-detail.component';
import { BillDetailResolver } from './_resolve/bill-detail.resolver';
import { ItemEditResolver } from './_resolve/item-edit-resolver';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';
import { ShopHoldListComponent } from './shop/shop-hold-list/shop-hold-list.component';
import { BillHoldingListResolver } from './_resolve/bill-holding-list.resolver';
import { ShopShiftCreateComponent } from './shop/shop-shift-create/shop-shift-create.component';
import { ShopDashboardComponent } from './shop/shop-dashboard/shop-dashboard.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ShopSlickItemComponent } from './shop/shop-slick-item/shop-slick-item.component';
import { ShopReturnComponent } from './shop/rma/shop-return/shop-return.component';
import { PreventUnsavedChanges } from './_guard/prevent-unsaved-changes.guard';
import { RoleEditResolver } from './_resolve/role-edit-resolver';
import { RoleListResolver } from './_resolve/role-list.resolver';
import { RoleService } from './_services/system/role.service';
import { ManagementRoleEditComponent } from './management/system/role/management-role-edit/management-role-edit.component';
import { ManagementRoleComponent } from './management/system/role/management-role/management-role.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { FunctionService } from './_services/system/function.service';
import { FunctionListResolver } from './_resolve/function-list.resolver';
import { PermissionService } from './_services/system/permission.service';
import { PermissionListResolver } from './_resolve/permission-list.resolver';
import { ManagementFunctionComponent } from './management/system/function/management-function/management-function.component';
import { ManagementPermissionComponent } from './management/system/permission/management-permission/management-permission.component';
import { ManagementFunctionEditComponent } from './management/system/function/management-function-edit/management-function-edit.component';
import { ManagementPermissionEditComponent } from './management/system/permission/management-permission-edit/management-permission-edit.component';
// import { TreetableModule } from 'ng-material-treetable';
import { ShopToolShiftComponent } from './shop/tools/shop-tool-shift/shop-tool-shift.component';
import { ShopHeaderCustomerComponent } from './shop/tools/shop-header-customer/shop-header-customer.component';
import { ShopOtherPaymentComponent } from './shop/tools/shop-other-payment/shop-other-payment.component';

import { ManagementSettingRoleListComponent } from './management/system/role-setting/management-setting-role-list/management-setting-role-list.component';
import { ManagementSettingRoleEditComponent } from './management/system/role-setting/management-setting-role-edit/management-setting-role-edit.component';
//tess
import { ManagementSettingControlPermissionComponent } from './management/system/role-setting/management-setting-control-permission/management-setting-control-permission.component';
import { PermissionEditResolver } from './_resolve/permission-edit-resolver';
import { SettingRoleEditResolver } from './_resolve/setting-role-edit-resolver';
import { ShopBillPaymentComponent } from './shop/shop-bill-payment/shop-bill-payment.component';
import { ManagementItemListComponent } from './management/masterdata/item/management-item-list/management-item-list.component';
import { ManagementItemEditComponent } from './management/masterdata/item/management-item-edit/management-item-edit.component';
import { EmployeeService } from './_services/data/employee.service';
import { EmployeeListResolver } from './_resolve/employee-list.resolver';
import { StoreEditResolver } from './_resolve/store-edit-resolver';
import { StoreGoupListResolver } from './_resolve/storegroup-list.resolver';
import { StoreService } from './_services/data/store.service';
import { StoregroupService } from './_services/data/storegroup.service';
import { StoreListResolver } from './_resolve/store-list.resolver';
import { WarehouseService } from './_services/data/warehouse.service';
import { WarehouseListResolver } from './_resolve/warehouse-list.resolver';
import { ManagementStoreListComponent } from './management/masterdata/store/management-store-list/management-store-list.component';
import { ManagementStoreEditComponent } from './management/masterdata/store/management-store-edit/management-store-edit.component';
import { ManagementStoregroupEditComponent } from './management/masterdata/storegroup/management-storegroup-edit/management-storegroup-edit.component';
import { ManagementStoregroupListComponent } from './management/masterdata/storegroup/management-storegroup-list/management-storegroup-list.component';
import { ManagementEmployeeEditComponent } from './management/masterdata/employee/management-employee-edit/management-employee-edit.component';
import { ManagementEmployeeListComponent } from './management/masterdata/employee/management-employee-list/management-employee-list.component';
import { ManagementWarehouseEditComponent } from './management/masterdata/warehouse/management-warehouse-edit/management-warehouse-edit.component';
import { ManagementWarehouseListComponent } from './management/masterdata/warehouse/management-warehouse-list/management-warehouse-list.component';
import { ManagementPaymentListComponent } from './management/masterdata/payment/management-payment-list/management-payment-list.component';
import { ManagementPaymentEditComponent } from './management/masterdata/payment/management-payment-edit/management-payment-edit.component';
import { PaymentmethodService } from './_services/data/paymentmethod.service';
import { PaymentMethodListResolver } from './_resolve/paymentmethod-list.resolver';
import { ControlService } from './_services/data/control.service';
import { ManagementControlEditComponent } from './management/system/control/management-control-edit/management-control-edit.component';
import { CommonService } from './_services/common/common.service';

import { ManagementStorePaymentSettingComponent } from './management/masterdata/store/management-store-payment-setting/management-store-payment-setting.component';
import { ManagementStorePaymentEditComponent } from './management/masterdata/store/management-store-payment-edit/management-store-payment-edit.component';
import { StorePaymentEditResolver } from './_resolve/store-payment-edit-resolver';
import { StorePaymentService } from './_services/data/store-payment.service';
import { ManagementFormatListComponent } from './management/masterdata/format/management-format-list/management-format-list.component';
import { ManagementFormatEditComponent } from './management/masterdata/format/management-format-edit/management-format-edit.component';
import { FormatconfigService } from './_services/data/formatconfig.service';
import { FormatConfigListResolver } from './_resolve/fomatconfig-list.resolver';
import { CurrencyFormat } from './currencyFormat.pipe';
import { DateFormat } from './dateFormat.pipe';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSpinnerModule } from "ngx-spinner";
import { LoadingInterceptor, LoadingInterceptorProvider } from './_services/interceptor/loading.interceptor';
import { BusyService } from './_services/system/busy.service';
import { ShopItemSerialComponent } from './shop/tools/shop-item-serial/shop-item-serial.component';
// import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import { BomService } from './_services/data/bom.service';
import { fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
//Devextreme
import { MatIconModule } from '@angular/material/icon';
import {
  DxSelectBoxModule, DxCheckBoxModule, DxDateBoxModule, DxCalendarModule, DxTemplateModule, DxDataGridModule, DxTreeListModule, DxSwitchModule,
  DxButtonModule, DxDrawerModule, DxTextBoxModule, DxLookupModule, DxTextAreaModule, DxDropDownBoxModule, DxTreeViewModule, DxTabPanelModule, DxRadioGroupModule,
  DxToolbarModule, DxListModule, DxFileUploaderModule, DxChartModule, DxPieChartModule, DxPopoverModule, DxPopupModule, DxSchedulerModule, DxNumberBoxModule, DxProgressBarModule, DxDropDownButtonModule, DxTileViewModule, DxTagBoxModule, DxSortableModule, DxScrollViewModule, DxValidatorModule, DxHtmlEditorModule, DxDiagramModule, DxTabsModule, DxGalleryModule
} from 'devextreme-angular';
import { ShopCapacityComponent } from './shop/capacity/shop-capacity/shop-capacity.component';
import { CapacityService } from './_services/data/capacity.service';
import { Service } from './_services/test/app.service';
import { TimeSpanFormat } from './timespanFormat.pipe';
import { ShopCapacityEditComponent } from './shop/capacity/shop-capacity-edit/shop-capacity-edit.component';
import { ShopItemDetailComponent } from './shop/tools/shop-item-detail/shop-item-detail.component';

import { ManagementPromotionSetupComponent } from './management/promotion/management-promotion-setup/management-promotion-setup.component';
import { ManagementPromotionListComponent } from './management/promotion/management-promotion-list/management-promotion-list.component';

import { ManagementTransactionGoodissueComponent } from './management/transaction/goodissue/management-transaction-goodissue/management-transaction-goodissue.component';
import { ManagementTransactionGoodissueEditComponent } from './management/transaction/goodissue/management-transaction-goodissue-edit/management-transaction-goodissue-edit.component';
import { ManagementTransactionGoodreceiptComponent } from './management/transaction/goodreceipt/management-transaction-goodreceipt/management-transaction-goodreceipt.component';
import { ManagementTransactionGoodreceiptEditComponent } from './management/transaction/goodreceipt/management-transaction-goodreceipt-edit/management-transaction-goodreceipt-edit.component';
import { UomService } from './_services/data/uom.service';
import { ItemuomService } from './_services/data/itemuom.service';
import { ShopTopMenuComponent } from './shop/shop-top-menu/shop-top-menu.component';
import { ItemserialstockService } from './_services/data/itemserialstock.service';
import { ItemserialService } from './_services/data/itemserial.service';
import { WindowService } from './windowService';
import { PromotionService } from './_services/promotion/promotion.service';
import { ManagementPromotionCustomerComponent } from './management/promotion/management-promotion-customer/management-promotion-customer.component';
import { ShopCustomerEditComponent } from './shop/customer/shop-customer-edit/shop-customer-edit.component';
import { ShopToolUserComponent } from './shop/tools/shop-tool-user/shop-tool-user.component';
import { ManagementPromotionEditComponent } from './management/promotion/management-promotion-edit/management-promotion-edit.component';
import { ManagementInvtransferComponent } from './management/transaction/transfer/management-invtransfer/management-invtransfer.component';
import { ManagementInvtransferEditComponent } from './management/transaction/transfer/management-invtransfer-edit/management-invtransfer-edit.component';
import { ManagementPromotionSchemaSetupComponent } from './management/promotion/management-promotion-schema-setup/management-promotion-schema-setup.component';
import { ManagementPromotionSearchComponent } from './management/promotion/management-promotion-search/management-promotion-search.component';
import { ManagementPromotionSchemaComponent } from './management/promotion/management-promotion-schema/management-promotion-schema.component';
import { ItemSerialComponent } from './component/item-serial/item-serial.component';
import { InventorypostingService } from './_services/transaction/inventoryposting.service';
import { InventorycoutingService } from './_services/transaction/inventorycouting.service';
import { CustomergroupService } from './_services/data/customergroup.service';
import { InventoryService } from './_services/transaction/inventory.service';
import { ManagementInventoryCoutingComponent } from './management/transaction/imventorycouting/management-inventory-couting/management-inventory-couting.component';
import { ManagementInventoryCoutingEditComponent } from './management/transaction/imventorycouting/management-inventory-couting-edit/management-inventory-couting-edit.component';
import { ManagementInventoryPostingComponent } from './management/transaction/inventoryposting/management-inventory-posting/management-inventory-posting.component';
import { ManagementInventoryPostingEditComponent } from './management/transaction/inventoryposting/management-inventory-posting-edit/management-inventory-posting-edit.component';
import { ManagementInvtransferSearchComponent } from './management/transaction/transfer/management-invtransfer-search/management-invtransfer-search.component';
import { ManagementInvstransferReceiptComponent } from './management/transaction/transfer/management-invstransfer-receipt/management-invstransfer-receipt.component';
import { ManagementInvtransferReceiptEditComponent } from './management/transaction/transfer/management-invtransfer-receipt-edit/management-invtransfer-receipt-edit.component';
import { ManagementInventoryCountedListComponent } from './management/transaction/inventoryposting/management-inventory-counted-list/management-inventory-counted-list.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatButtonModule } from '@angular/material/button';
import { IKeyboardLayouts, KeyboardClassKey, keyboardLayouts, MatKeyboardModule, MAT_KEYBOARD_LAYOUTS } from 'angular-onscreen-material-keyboard';
// import { ManagementItemUploadComponent } from './management/masterdata/item/management-item-upload/management-item-upload.component';
// import { ManagementItemUploadEditComponent } from './management/masterdata/item/management-item-upload-edit/management-item-upload-edit.component';
import { ExcelService } from './_services/common/excel.service';
import { ManagementImportBomComponent } from './management/masterdata/import/management-import-bom/management-import-bom.component';
import { ItemgroupService } from './_services/data/itemgroup.service';
import { PricelistService } from './_services/data/pricelist.service';
import { ProductService } from './_services/data/product.service';
import { UserstoreService } from './_services/data/userstore.service';
import { StoreareaService } from './_services/data/storearea.service';
import { ManagementImportCustomergroupComponent } from './management/masterdata/import/management-import-customergroup/management-import-customergroup.component';
import { ManagementImportCustomerComponent } from './management/masterdata/import/management-import-customer/management-import-customer.component';
import { ManagementImportEmployeeComponent } from './management/masterdata/import/management-import-employee/management-import-employee.component';
import { ManagementImportWarehouseComponent } from './management/masterdata/import/management-import-warehouse/management-import-warehouse.component';
import { ManagementImportUserComponent } from './management/masterdata/import/management-import-user/management-import-user.component';
import { ManagementImportUserstoreComponent } from './management/masterdata/import/management-import-userstore/management-import-userstore.component';
import { ManagementImportUomComponent } from './management/masterdata/import/management-import-uom/management-import-uom.component';
import { ManagementImportTaxComponent } from './management/masterdata/import/management-import-tax/management-import-tax.component';
import { ManagementImportStorepaymentComponent } from './management/masterdata/import/management-import-storepayment/management-import-storepayment.component';
import { ManagementImportStoregroupComponent } from './management/masterdata/import/management-import-storegroup/management-import-storegroup.component';
import { ManagementImportStoreareaComponent } from './management/masterdata/import/management-import-storearea/management-import-storearea.component';
import { ManagementImportStorecapacityComponent } from './management/masterdata/import/management-import-storecapacity/management-import-storecapacity.component';
import { ManagementImportStoreComponent } from './management/masterdata/import/management-import-store/management-import-store.component';
import { ManagementImportStorageComponent } from './management/masterdata/import/management-import-storage/management-import-storage.component';
import { ManagementImportProductComponent } from './management/masterdata/import/management-import-product/management-import-product.component';
import { ManagementImportPaymentmethodComponent } from './management/masterdata/import/management-import-paymentmethod/management-import-paymentmethod.component';
import { ManagementImportItemserialstockComponent } from './management/masterdata/import/management-import-itemserialstock/management-import-itemserialstock.component';
import { ManagementImportItemserialComponent } from './management/masterdata/import/management-import-itemserial/management-import-itemserial.component';
import { ManagementImportItemgroupComponent } from './management/masterdata/import/management-import-itemgroup/management-import-itemgroup.component';
import { ManagementImportMerchandiseComponent } from './management/masterdata/import/management-import-merchandise/management-import-merchandise.component';
import { ManagementImportItemComponent } from './management/masterdata/import/management-import-item/management-import-item.component';
import { ManagementImportItemuomComponent } from './management/masterdata/import/management-import-itemuom/management-import-itemuom.component';
import { ManagementImportPricelistComponent } from './management/masterdata/import/management-import-pricelist/management-import-pricelist.component';
import { ManagementMasterdataItemgroupComponent } from './management/masterdata/itemgroup/management-masterdata-itemgroup/management-masterdata-itemgroup.component';
import { ManagementMasterdataItemgroupEditComponent } from './management/masterdata/itemgroup/management-masterdata-itemgroup-edit/management-masterdata-itemgroup-edit.component';
import { ManagementMasterdataStorageComponent } from './management/masterdata/storage/management-masterdata-storage/management-masterdata-storage.component';
import { ManagementMasterdataStorageEditComponent } from './management/masterdata/storage/management-masterdata-storage-edit/management-masterdata-storage-edit.component';
import { ManagementMasterdataStoreareaComponent } from './management/masterdata/storearea/management-masterdata-storearea/management-masterdata-storearea.component';
import { ManagementMasterdataStoreareaEditComponent } from './management/masterdata/storearea/management-masterdata-storearea-edit/management-masterdata-storearea-edit.component';
import { ManagementMasterdataTaxComponent } from './management/masterdata/tax/management-masterdata-tax/management-masterdata-tax.component';
import { ManagementMasterdataTaxEditComponent } from './management/masterdata/tax/management-masterdata-tax-edit/management-masterdata-tax-edit.component';
import { ManagementMasterdataUomComponent } from './management/masterdata/uom/management-masterdata-uom/management-masterdata-uom.component';
import { ManagementMasterdataUomEditComponent } from './management/masterdata/uom/management-masterdata-uom-edit/management-masterdata-uom-edit.component';
import { ManagementUserRoleComponent } from './management/user/management-user-role/management-user-role.component';
import { ManagementUserEditComponent } from './management/user/management-user-edit/management-user-edit.component';
import { ManagementUserListComponent } from './management/user/management-user-list/management-user-list.component';
import { FilterPipe } from './filter.pipe';
import { ManagementDashboardComponent } from './management/management-dashboard/management-dashboard.component';
import { ShopStoreSelectComponent } from './shop/tools/shop-store-select/shop-store-select.component';
import { ManagementShiftListComponent } from './management/transaction/management-shift-list/management-shift-list.component';
import { ManagementShiftDetailComponent } from './management/transaction/management-shift-detail/management-shift-detail.component';
import { ShopShiftOpenComponent } from './shop/tools/shop-shift-open/shop-shift-open.component';
import { ManagementCapacityEditComponent } from './management/capacity/management-capacity-edit/management-capacity-edit.component';
import { ManagementCapacityListComponent } from './management/capacity/management-capacity-list/management-capacity-list.component';
import { ShopCheckoutDetailComponent } from './shop/checkout/shop-checkout-detail/shop-checkout-detail.component';
import { ShopCheckoutListComponent } from './shop/checkout/shop-checkout-list/shop-checkout-list.component';
import { POSItemListResolver } from './_resolve/positem-list.resolver';
import { CheckOutListResolver } from './_resolve/invoice-list.resolver';
import { ShopBillCheckoutComponent } from './shop/checkout/shop-bill-checkout/shop-bill-checkout.component';
import { InvoiceDetailResolver } from './_resolve/invoice-detail.resolver';
import { ManagementPurchaseListComponent } from './management/transaction/purchase/management-purchase-list/management-purchase-list.component';
import { ManagementPurchaseDetailComponent } from './management/transaction/purchase/management-purchase-detail/management-purchase-detail.component';
import { ManagementGrpoListComponent } from './management/transaction/grpo/management-grpo-list/management-grpo-list.component';
import { ManagementGrpoDetailComponent } from './management/transaction/grpo/management-grpo-detail/management-grpo-detail.component';
import { RptInventoryauditComponent } from './management/report/rpt-inventoryaudit/rpt-inventoryaudit.component';
import { RptInventoryonhandComponent } from './management/report/rpt-inventoryonhand/rpt-inventoryonhand.component';
import { Rpt_salesstoresummaryComponent } from './management/report/rpt_salesstoresummary/rpt_salesstoresummary.component';
import { Rpt_salestransactiondetailComponent } from './management/report/rpt_salestransactiondetail/rpt_salestransactiondetail.component';
import { Rpt_salestransactionsummaryComponent } from './management/report/rpt_salestransactionsummary/rpt_salestransactionsummary.component';
import { ManagementReportListComponent } from './management/report/management-report-list/management-report-list.component';
import { ManagementPoSearchComponent } from './management/transaction/grpo/management-po-search/management-po-search.component';
import { ManagementGrpoPoComponent } from './management/transaction/purchase/management-grpo-po/management-grpo-po.component';
import { PurchaseDetailResolver } from './_resolve/purchase-detail.resolver';
import { GRPODetailResolver } from './_resolve/grpo-detail.resolver';
import { UploadImageComponent } from './component/shared/upload-image/upload-image.component';
import { NgxPrintModule } from 'ngx-print';
import { ShopBillPrintComponent } from './shop/shop-bill-print/shop-bill-print.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { ManagementImportItemStorageComponent } from './management/masterdata/import/management-import-item-storage/management-import-item-storage.component';
import { ManagementItemstorageComponent } from './management/masterdata/itemstorage/management-itemstorage/management-itemstorage.component';
import { ManagementItemstorageEditComponent } from './management/masterdata/itemstorage/management-itemstorage-edit/management-itemstorage-edit.component';
import { ManagementPrintTransferInComponent } from './management/transaction/print/management-print-transfer-in/management-print-transfer-in.component';
import { ManagementPrintTransferOutComponent } from './management/transaction/print/management-print-transfer-out/management-print-transfer-out.component';
import { ManagementPrintEndShiftComponent } from './management/transaction/print/management-print-end-shift/management-print-end-shift.component';
import { ManagementPrintEndDayComponent } from './management/transaction/print/management-print-end-day/management-print-end-day.component';
import { DxFunnelModule } from 'devextreme-angular';
import { ManagementUserStoreComponent } from './management/user/management-user-store/management-user-store.component';
import { GoodreceiptService } from './_services/transaction/goodreceipt.service';
import { ManagementCustomerListComponent } from './management/masterdata/customer/management-customer-list/management-customer-list.component';
import { ManagementCustomerEditComponent } from './management/masterdata/customer/management-customer-edit/management-customer-edit.component';
import { ManagementPrintGrpoComponent } from './management/transaction/print/management-print-grpo/management-print-grpo.component';
import { ManagementPrintPoComponent } from './management/transaction/print/management-print-po/management-print-po.component';
import * as moment from "moment-timezone";
import { ShopSalestypeChangeComponent } from './shop/shop-salestype-change/shop-salestype-change.component';
import { ShopCardInputComponent } from './shop/components/shop-card-input/shop-card-input.component';
import { ShopMemberInputComponent } from './shop/components/shop-member-input/shop-member-input.component';
import { ManagementPrepaidComponent } from './management/masterdata/prepaidcard/management-prepaid/management-prepaid.component';
import { ManagementPrepaidEditComponent } from './management/masterdata/prepaidcard/management-prepaid-edit/management-prepaid-edit.component';
import { ComponentMoreMenuComponent } from './component/component-more-menu/component-more-menu.component';
import { ShopReturnListComponent } from './shop/rma/shop-return-list/shop-return-list.component';
import { BillReturnListResolver } from './_resolve/bill-return-list.resolver';
import { ManagementVoidreturnSettingComponent } from './management/system/appsetting/management-voidreturn-setting/management-voidreturn-setting.component';
import { ManagementVoidreturnSettingEditComponent } from './management/system/appsetting/management-voidreturn-setting-edit/management-voidreturn-setting-edit.component';
import { ManagementCategorySettingComponent } from './management/system/appsetting/management-category-setting/management-category-setting.component';
import { ManagementHolidayComponent } from './management/masterdata/holiday/management-holiday/management-holiday.component';
import { ManagementHolidayEditComponent } from './management/masterdata/holiday/management-holiday-edit/management-holiday-edit.component';
import { RouterModule } from '@angular/router';
import { ManagementPrintShiftComponent } from './management/transaction/shift/ManagementPrintShift/ManagementPrintShift.component';
import { ManagementSettingMenuComponent } from './management/setting/ui/management-setting-menu/management-setting-menu.component';
import { ShopOrderGroceryComponent } from './shop/shop-order-grocery/shop-order-grocery.component';
import { ManagementMerchandiseComponent } from './management/masterdata/merchandise/management-merchandise/management-merchandise.component';
import { ManagementMerchandiseEditComponent } from './management/masterdata/merchandise/management-merchandise-edit/management-merchandise-edit.component';
import { ManagementCompanyComponent } from './management/masterdata/company/management-company/management-company.component';
import { ManagementCompanyEditComponent } from './management/masterdata/company/management-company-edit/management-company-edit.component';
import { UploadImageCompanyComponent } from './component/shared/upload-image-company/upload-image-company.component';
import { ManagementUserInforComponent } from './management/account/management-user-infor/management-user-infor.component';
import { ShopInvoiceInputComponent } from './shop/tools/shop-invoice-input/shop-invoice-input.component';
import { ShopAnotherSourceBillComponent } from './shop/shop-another-source-bill/shop-another-source-bill.component';
import { ShopCapacityCalendarComponent } from './shop/capacity/shop-capacity-calendar/shop-capacity-calendar.component';
import { ShopItemCheckSingleComponent } from './shop/checkout/shop-item-check-single/shop-item-check-single.component';
import { ShopCheckoutSlickComponent } from './shop/checkout/shop-checkout-slick/shop-checkout-slick.component';
import { ShopOrderCheckoutComponent } from './shop/checkout/shop-order-checkout/shop-order-checkout.component';
import { ManagementPriceListComponent } from './management/masterdata/pricelist/management-price-list/management-price-list.component';
import { ShopBillCheckinComponent } from './shop/checkin/shop-bill-checkin/shop-bill-checkin.component';
import { ShopCheckinVoucherComponent } from './shop/checkin/shop-checkin-voucher/shop-checkin-voucher.component';
import { ShopCheckoutBillComponent } from './shop/checkout/shop-checkout-bill/shop-checkout-bill.component';
import { ShopCheckoutPrintComponent } from './shop/checkout/shop-checkout-print/shop-checkout-print.component';
import { ShopCheckoutPaymentComponent } from './shop/checkout/shop-checkout-payment/shop-checkout-payment.component';
import { InvoicePaymentResolver } from './_resolve/invoice-payment.resolver';
import { ShopToolPaymentComponent } from './shop/tools/shop-tool-payment/shop-tool-payment.component';
import { ShopCheckoutOpenListComponent } from './shop/checkout/shop-checkout-open-list/shop-checkout-open-list.component';
import { CustompreloadingstrategyService } from './_services/system/custompreloadingstrategy.service';
import { ManagementGeneralSettingEditComponent } from './management/setting/general/management-general-setting-edit/management-general-setting-edit.component';
import { ManagementGeneralSettingListComponent } from './management/setting/general/management-general-setting-list/management-general-setting-list.component';
import { NgxPrinterModule } from 'ngx-printer';
import { ShopCardMemberInputComponent } from './shop/components/shop-card-member-input/shop-card-member-input.component';
import { WebcamModule } from 'ngx-webcam';
import { ShopExchangeComponent } from './shop/rma/exchange/shop-exchange/shop-exchange.component';
import { ShopExchangeListComponent } from './shop/rma/exchange/shop-exchange-list/shop-exchange-list.component';
import { ShopToolPopoverComponent } from './shop/tools/shop-tool-popover/shop-tool-popover.component';
import { ShopToolPromotionDetailViewComponent } from './shop/tools/shop-tool-promotion-detail-view/shop-tool-promotion-detail-view.component';
import { ShopCustomerDetailComponent } from './shop/customer/shop-customer-detail/shop-customer-detail.component';
import { PermissionDeniedComponent } from './shop/permission-denied/permission-denied.component';
import { ImagesLazyloadModule } from './_helpers/images-lazyload.module';
import { PickThemeComponent } from './component/shared/pick-theme/pick-theme.component';
import { ManagementEndofdateListComponent } from './management/endofdate/management-endofdate-list/management-endofdate-list.component';
import { ManagementEndofdateDetailsComponent } from './management/endofdate/management-endofdate-details/management-endofdate-details.component';
import { ManagementEndofdatePrintComponent } from './management/endofdate/management-endofdate-print/management-endofdate-print.component';


import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { ShopCheckoutSummaryPrintComponent } from './shop/checkout/shop-checkout-summary-print/shop-checkout-summary-print.component';
import { ManagementImportSalesOrderComponent } from './management/transaction/import/management-import-sales-order/management-import-sales-order.component';
import { IconFormat } from './iconFormat.pipe';
import { SettingProgressComponent, TimePipe } from './shop/tools/setting-progress/setting-progress.component';
import { ShopReturnBillComponent } from './shop/rma/shop-return-bill/shop-return-bill.component';
import { RptSalesByHourComponent } from './management/report/rpt-sales-by-hour/rpt-sales-by-hour.component';
import { RptSalesByYearComponent } from './management/report/rpt-sales-by-year/rpt-sales-by-year.component';
import { Rpt_salesBySalesPersonComponent } from './management/report/rpt_sales-by-sales-person/rpt_sales-by-sales-person.component';
import { RptSalesTransactionPaymentComponent } from './management/report/rpt-sales-transaction-payment/rpt-sales-transaction-payment.component';
import { LoadingSpinnerComponent } from './component/loading-spinner/loading-spinner.component';
import { LoadingDirective } from './_helpers/loading.directive';
import { LoadingService } from './_services/common/loading.service';
import { ManagementSummaryEndShiftComponent } from './management/transaction/shift/management-summary-end-shift/management-summary-end-shift.component';
import { ManagementDenominationEditComponent } from './management/masterdata/denomination/management-denomination-edit/management-denomination-edit.component';
import { ManagementDenominationListComponent } from './management/masterdata/denomination/management-denomination-list/management-denomination-list.component';
import { ManagementPromotionImportComponent } from './management/promotion/management-promotion-import/management-promotion-import.component';
import { ShopExchangeItemListComponent } from './shop/tools/shop-exchange-item-list/shop-exchange-item-list.component';
import { ShopSearchItemComponent } from './shop/components/shop-search-item/shop-search-item.component';
import { NumberPipePipe } from './NumberPipePipe';
import { SignalRService } from './_services/common/signalR.service';
import { ManagementItemUomComponent } from './management/masterdata/item-uom/management-item-uom/management-item-uom.component';
import { ManagemenItemuomEditComponent } from './management/masterdata/item-uom/managemen-itemuom-edit/managemen-itemuom-edit.component';
import { ShopComponentOrderPrintComponent } from './shop/components/shop-component-order-print/shop-component-order-print.component';
import { ManagementTodolistComponent } from './management/todolist/management-todolist/management-todolist.component';
import { ManagementTodolistEditComponent } from './management/todolist/management-todolist-edit/management-todolist-edit.component';
import { ManagementCrmComponent } from './management/crm/management-crm/management-crm.component';
import { ManagementCrmSetupComponent } from './management/crm/management-crm-setup/management-crm-setup.component';
import { ManagementLoyaltyrankComponent } from './management/crm/rank/management-loyaltyrank/management-loyaltyrank.component';
import { ManangementLoyaltyrankEditComponent } from './management/crm/rank/manangement-loyaltyrank-edit/manangement-loyaltyrank-edit.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { WaiverFormComponent } from './component/print/waiver-form/waiver-form.component';
import { WaiverFormTemplateComponent } from './component/print/waiver-form-template/waiver-form-template.component';
import { RptPOSPromoComponent } from './management/report/rpt-POS-promo/rpt-POS-promo.component';
import { RptGiftVoucherComponent } from './management/report/rpt-gift-voucher/rpt-gift-voucher.component';
import { PrintXComponent } from './printX/printX.component';

import { ManagementTimeframeComponent } from './management/masterdata/timeframe/management-timeframe/management-timeframe.component';
import { ManagementTimeframeEditComponent } from './management/masterdata/timeframe/management-timeframe-edit/management-timeframe-edit.component';
import { TestUomComponent } from './management/test/test-uom/test-uom.component';
import { ManagementInventoryPrintTemplateComponent } from './management/transaction/print/management-inventory-print-template/management-inventory-print-template.component';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { PosTypeFormat } from './posTypeFormat.pipe';
import { StatusFormat } from './statusFormat.pipe';
import { Rpt_inventory_postingComponent } from './management/report/rpt_inventory_posting/rpt_inventory_posting.component';

import { ShopComponentManagementPrintShiftComponent } from './shop/components/shop-component-management-print-shift/shop-component-management-print-shift.component';
import { ShopComponentManagementPrintEndOfDateComponent } from './shop/components/shop-component-management-print-endofdate/shop-component-management-print-endofdate.component';
import { ShopBillCheckinListComponent } from './shop/checkin/shop-bill-checkin-list/shop-bill-checkin-list.component';
import { Rpt_invoicetransactionsummaryComponent } from './management/report/rpt_invoicetransactionsummary/rpt_invoicetransactionsummary.component';
import { Rpt_invoicetransactiondetailComponent } from './management/report/rpt_invoicetransactiondetail/rpt_invoicetransactiondetail.component';
import { RptInvoiceTransactionPaymentComponent } from './management/report/rpt-invoice-transaction-payment/rpt-invoice-transaction-payment.component';
import { ManagementShortcutComponent } from './management/shortcut/management-shortcut/management-shortcut.component';
import { ManagementShortcutEditComponent } from './management/shortcut/management-shortcut-edit/management-shortcut-edit.component';
import { ManamentPrepaidHistoryComponent } from './management/masterdata/prepaidcard/manament-prepaid-history/manament-prepaid-history.component';
import { ManagementImportGoodsReceiptComponent } from './management/transaction/import/management-import-goods-receipt/management-import-goods-receipt.component';
import { ManagementCurrencyComponent } from './management/masterdata/currency/management-currency/management-currency.component';
import { ManagementCurrencyEditComponent } from './management/masterdata/currency/management-currency-edit/management-currency-edit.component';
import { ManagementStoreCurrencyComponent } from './management/setting/store-currency/management-store-currency/management-store-currency.component';
import { ManagementExchangeRateComponent } from './management/masterdata/exchange-rate/management-exchange-rate/management-exchange-rate.component';
import { ManagementExchangeRateEditComponent } from './management/masterdata/exchange-rate/management-exchange-rate-edit/management-exchange-rate-edit.component';
import { ManagementStoreCurrencyEditComponent } from './management/setting/store-currency/management-store-currency-edit/management-store-currency-edit.component';
import { ManagementStoreCurrencySettingComponent } from './management/setting/store-currency/management-store-currency-setting/management-store-currency-setting.component';
import { ShopPaymentCurrencyComponent } from './shop/tools/shop-payment-currency/shop-payment-currency.component';
import { ManagementItemSerialComponent } from './management/shared/management-item-serial/management-item-serial.component';
import { ManagementControlComponent } from './management/masterdata/control/management-control/management-control.component';
import { ManagementShortcutSettingComponent } from './management/setting/shortcut/management-shortcut-setting/management-shortcut-setting.component';
import { GenderFormat } from './genderFormat';
import { NgBarcodeDetectorModule } from 'ng-barcode-detector';
import { ManagementStoreClientComponent } from './management/system/client/management-store-client/management-store-client.component';
import { ManagementStoreClientEditComponent } from './management/system/client/management-store-client-edit/management-store-client-edit.component';
import { ManagementOpenShiftListComponent } from './management/endofdate/management-open-shift-list/management-open-shift-list.component';
import { ManagementBarcodeSetupDetailComponent } from './management/system/barcode/management-barcode-setup-detail/management-barcode-setup-detail.component';
import { ManagementBarcodeSetupListComponent } from './management/system/barcode/management-barcode-setup-list/management-barcode-setup-list.component';
import { ShopPaymentChangePopupComponent } from './shop/tools/shop-payment-change-popup/shop-payment-change-popup.component';
import { ManagementPriotyPriceListComponent } from './management/masterdata/priotyPricelist/management-prioty-price-list/management-prioty-price-list.component';
import { ShopEmployeeListResolver } from './_resolve/shop-employee-list.resolver';
import { ShopPaymentQrscanComponent } from './shop/tools/shop-payment-qrscan/shop-payment-qrscan.component';
import { ManagementGoodReceiptPrintComponent } from './management/transaction/goodreceipt/management-transaction-goodreceipt-print/management-transaction-goodreceipt-print.component';
import { ManagementGoodIssuePrintComponent } from './management/transaction/goodissue/management-transaction-goodissue-print/management-transaction-goodissue-print.component';
import { ManagementInventoryCoutingPrintComponent } from './management/transaction/imventorycouting/management-inventory-couting-print/management-inventory-couting-print.component';
import { ManagementInventoryPostingPrintComponent } from './management/transaction/inventoryposting/management-inventory-posting-print/management-inventory-posting-print.component';
import { ManagementPurchaseOrderPrintComponent } from './management/transaction/purchase/management-purchase-order-print/management-purchase-order-print.component';
import { ManagementInvtranfeShipmentPrintComponent } from './management/transaction/transfer/management-invstranfer-shipment-print/management-invstranfer-shipment-print.component';
import { ManagementInvtranfeReceiptPrintComponent } from './management/transaction/transfer/management-invstranfer-receipt-print/management-invstranfer-receipt-print.component';
import { ManagementGRPOPrintComponent } from './management/transaction/grpo/management-grpo-print/management-grpo-print.component';
import { ManangementCurrencyRoundingoffComponent } from './management/system/roundingoff/manangement-currency-roundingoff/manangement-currency-roundingoff.component';
import { ManangementItemCheckMasterDataComponent } from './management/masterdata/item/manangement-item-check-master-data/manangement-item-check-master-data.component';
import { PrintShopComponent } from './shop/print/print-shop.component';
import { ToastrModule } from 'ngx-toastr';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { DxSankeyModule } from "devextreme-angular";
import { ManagementPriceListNameMappingComponent } from './management/masterdata/pricelist/management-price-list-name-mapping/management-price-list-name-mapping.component';
import { ShopLoadingComponent } from './shop/tools/shop-loading/shop-loading.component';
import { ShopOtherItemComponent } from './shop/components/shop-other-item/shop-other-item.component';
import { ManagementCustomerGroupListComponent } from './management/masterdata/customer-group/management-customer-group-list/management-customer-group-list.component';
import { ManagementCustomerGroupEditComponent } from './management/masterdata/customer-group/management-customer-group-edit/management-customer-group-edit.component';
import { ManagementPromotionInputOtComponent } from './management/promotion/management-promotion-input-ot/management-promotion-input-ot.component';
import { ManagementReasonListComponent } from './management/masterdata/reason/management-reason-list/management-reason-list.component';
import { ManagementReasonEditComponent } from './management/masterdata/reason/management-reason-edit/management-reason-edit.component';
import { ShopReasonInputComponent } from './shop/tools/shop-reason-input/shop-reason-input.component';
import { ManagementDatasourceEditComponent } from './management/system/datasource-edit/management-datasource-edit/management-datasource-edit.component';
import { ShopVoucherSerialComponent } from './shop/tools/shop-voucher-serial/shop-voucher-serial.component';
import { ShopApprovalInputComponent } from './shop/tools/shop-approval-input/shop-approval-input.component';
import { RptPosPromotionNewComponent } from './management/report/rpt-pos-promotion-new/rpt-pos-promotion-new.component';
import { ShopDeliveryInputComponent } from './shop/tools/shop-delivery-input/shop-delivery-input.component';
import { ManagementImportStampsComponent } from './management/masterdata/import/management-import-stamps/management-import-stamps.component';
import { StampsTemplateComponent } from './component/print/stamps-template/stamps-template.component';
import { ShopScanBarcodeComponent } from './shop/shop-scan-barcode/shop-scan-barcode.component';
import { ImportErrorlistComponent } from './management/shared/Import-errorlist/Import-errorlist.component';

import { ServiceWorkerModule } from '@angular/service-worker';
import { ManagementBankTerminalComponent } from './management/masterdata/bank-terminal/management-bank-terminal/management-bank-terminal.component';
import { PurchaseRequestDetailResolver } from './_resolve/purchaserequest-detail.resolver';
import { ManagementPurchaseRequestPrintComponent } from './management/transaction/purchaserequest/management-purchase-request-print/management-purchase-request-print.component';
import { ManagementGoodsReturnPrintComponent } from './management/transaction/goodsreturn/management-goodsreturn-print/management-goodsreturn-print.component';

import { ManagementPurchaseRequestListComponent } from './management/transaction/purchaserequest/management-purchaserequest-list/management-purchaserequest-list.component';
import { ManagementPurchaseRequestDetailComponent } from './management/transaction/purchaserequest/management-purchaserequest-detail/management-purchaserequest-detail.component';
import { ManagementGoodsReturnComponent } from './management/transaction/purchaserequest/management-goodsreturn/management-goodsreturn.component';

import { ManagementGoodsReturnListComponent } from './management/transaction/goodsreturn/management-goodsreturn-list/management-goodsreturn-list.component';
import { ManagementGoodsReturnDetailComponent } from './management/transaction/goodsreturn/management-goodsreturn-detail/management-goodsreturn-detail.component';
import { ManagementInventoryTransferComponent } from './management/transaction/grpo/inventorytransfer/management-inventory-transfer/management-inventory-transfer.component';
import { ManagementInventoryTransferEditComponent } from './management/transaction/grpo/inventorytransfer/management-inventory-transfer-edit/management-inventory-transfer-edit.component';

import { ShortcutsHelperComponent } from './shop/tools/shortcuts-helper/shortcuts-helper.component';
import { ManagementInventoryTransferPrintComponent } from './management/transaction/grpo/inventorytransfer/management-inventory-transfer-print/management-inventory-transfer-print.component';
import { ShopManualDiscountComponent } from './shop/components/shop-manual-discount/shop-manual-discount.component';
import { ShopManualPromotionComponent } from './shop/components/shop-manual-promotion/shop-manual-promotion.component';
import { ManagementStoreWhsEditComponent } from './management/masterdata/store/management-store-whs-edit/management-store-whs-edit.component';
import { ManagementStoreWhsSettingComponent } from './management/masterdata/store/management-store-whs-setting/management-store-whs-setting.component';
import { ShopSelectShiftComponent } from './shop/shop-select-shift/shop-select-shift.component';
import { EnvServiceProvider } from './env.service.provider';
import { ShopChangeStoreComponent } from './shop/shop-change-store/shop-change-store.component';
import { ShopCounterInputComponent } from './shop/shop-counter-input/shop-counter-input.component';
import { HotkeyModule } from 'angular2-hotkeys';
import { ManagementInvtransferShipmentEditComponent } from './management/transaction/transfer/management-invtransfer-shipment-edit/management-invtransfer-shipment-edit.component';
import { ManagementInvtransferShipmentComponent } from './management/transaction/transfer/management-invtransfer-shipment/management-invtransfer-shipment.component';
import { ShopPopupUserComponent } from './shop/shop-popup-user/shop-popup-user.component';
import { ShopSearchItemGridComponent } from './shop/components/shop-search-item-grid/shop-search-item-grid.component';
import { RptInventorySerialComponent } from './management/report/rpt-inventory-serial/rpt-inventory-serial.component';
import { ManagementPickupAmountListComponent } from './management/pickup-amount/management-pickup-amount-list/management-pickup-amount-list.component';
import { ShopPickupAmountInputComponent } from './shop/tools/shop-pickup-amount-input/shop-pickup-amount-input.component';
import { ManagementPickupAmountComponent } from './management/pickup-amount/management-pickup-amount/management-pickup-amount.component';
import { ManagementLoyaltyPointConvertComponent } from './management/setting/LoyaltyPointConvert/LoyaltyPointConvert.component';
import { ShopComponentLuckyDrawPrintComponent } from './shop/components/shop-component-lucky-draw-print/shop-component-lucky-draw-print.component';
import { ThermalPrintModule } from 'ng-thermal-print'; //add this line
import { JwtModule } from '@auth0/angular-jwt';
import { AuthInterceptor } from './authconfig.interceptor';
// import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { ManagementItemSerialListComponent } from './management/masterdata/item-serial/management-item-serial-list/management-item-serial-list.component';
import { StatusSerialFormat } from './statusSerialFormat.pipe';
// import { DeviceDetectorModule } from 'ngx-device-detector';
import { CookieModule } from 'ngx-cookie';
import { Rpt_salesByItemComponent } from './management/report/rpt_sales-by-item/rpt_sales-by-item.component';
import { ManagementBankinEditComponent } from './management/bankin/management-bankin-edit/management-bankin-edit.component';
import { ManagementBankinListComponent } from './management/bankin/management-bankin-list/management-bankin-list.component';
import { ShopPaymentHistoryComponent } from './shop/tools/shop-payment-history/shop-payment-history.component';
import { Rpt_SalesEPAYDetailComponent } from './management/report/rpt_SalesEPAYDetail/rpt_SalesEPAYDetail.component';
import { Rpt_customer_pointComponent } from './management/report/rpt_customer_point/rpt_customer_point.component';
import { RptVoucherCheckinComponent } from './management/report/rpt-voucher-checkin/rpt-voucher-checkin.component';
import { ShopToolVirtualKeyboardComponent } from './shop/tools/shop-tool-virtual-keyboard/shop-tool-virtual-keyboard.component';
import { RptLogComponent } from './management/report/rpt-log/rpt-log.component';
import { LogService } from './_services/common/log.service';
import { KeyboardService } from './component/shared/virtual-keyboard/virtual-keyboard.service';
import { OskInputDirective } from './component/shared/virtual-keyboard/osk-input.directive';
import { KeyboardKeyDirective } from './component/shared/virtual-keyboard/keyboard-key.directive';
import { VirtualKeyboardComponent } from './component/shared/virtual-keyboard/virtual-keyboard/virtual-keyboard.component';
import { BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { InputMaskModule } from '@ngneat/input-mask';
import { ShopFlyCartComponent } from './shop/components/shop-fly-cart/shop-fly-cart.component';
import { ShopCartDetailComponent } from './shop/shop-cart-detail/shop-cart-detail.component';
import { ManagementChangelogComponent } from './management/system/changelog/management-changelog/management-changelog.component';
import { ReleaseNoteListResolver } from './_resolve/change-logs.resolver';
import { ChangelogStatusFormat } from './ChangelogStatusFormat';
import { ManagementReleaseListComponent } from './management/todolist/management-release-list/management-release-list.component';
import { ManagementChangelogEditComponent } from './management/system/changelog/management-changelog-edit/management-changelog-edit.component';
import { ManagementChangelogListComponent } from './management/system/changelog/management-changelog-list/management-changelog-list.component';
import { ShopToolLoading2Component } from './shop/tools/shop-tool-loading-2/shop-tool-loading-2.component';
import { ComponentNotificationComponent } from './component/component-notification/component-notification.component';
import { ManagementVersionListComponent } from './management/system/version/management-version-list/management-version-list.component';
import { ManagementVersionEditComponent } from './management/system/version/management-version-edit/management-version-edit.component';
import { ShopToolClearCacheComponent } from './shop/tools/shop-tool-clear-cache/shop-tool-clear-cache.component';
import { ManagementImportLicensePlateComponent } from './management/masterdata/import/management-import-LicensePlate/management-import-LicensePlate.component';
import { ShopToolsSettlementComponent } from './shop/tools/shop-tools-settlement/shop-tools-settlement.component';
import { RptActionOnOrderComponent } from './management/report/rpt-action-on-order/rpt-action-on-order.component';
import { ManagementSalesPlanComponent } from './management/sales-plan/management-sales-plan/management-sales-plan.component';
import { ManagementSalesPlanEditComponent } from './management/sales-plan/management-sales-plan-edit/management-sales-plan-edit.component';
import { ShopCheckinMenberComponent } from './shop/checkin/shop-checkin-menber/shop-checkin-menber.component';
import { ShopToolsAssignStaffComponent } from './shop/tools/shop-tools-assign-staff/shop-tools-assign-staff.component';
import { RptSyncPriceComponent } from './management/report/rpt-sync-price/rpt-sync-price.component';
import { RptSyncItemComponent } from './management/report/rpt-sync-item/rpt-sync-item.component';
import { ManagementPickupPrintComponent } from './management/pickup-amount/management-pickup-print/management-pickup-print.component';
import { RptStoreListingComponent } from './management/report/rpt-store-listing/rpt-store-listing.component';
import { Rpt_sync_promoComponent } from './management/report/rpt_sync_promo/rpt_sync_promo.component';
import { ManagementPickupPrintTemplateComponent } from './management/pickup-amount/management-pickup-print-template/management-pickup-print-template.component';
import { Rpt_salestransactiondetail_exComponent } from './management/report/rpt_salestransactiondetail_ex/rpt_salestransactiondetail_ex.component';
import { Rpt_salestransactiondetail_returnComponent } from './management/report/rpt_salestransactiondetail_return/rpt_salestransactiondetail_return.component';
import { Rpt_clearremoveitemComponent } from './management/report/rpt_clearremoveitem/rpt_clearremoveitem.component';
import { PrintTemplateClearbillComponent } from './management/print-template/print-template-clearbill/print-template-clearbill.component';
import { ManagementEmployeeSalaryComponent } from './management/masterdata/employee/salary/management-employee-salary/management-employee-salary.component';
import { ManagementEmployeeSalaryEditComponent } from './management/masterdata/employee/salary/management-employee-salary-edit/management-employee-salary-edit.component';
import { ManagementEmployeeSalarySingleComponent } from './management/masterdata/employee/salary/management-employee-salary-single/management-employee-salary-single.component';
import { ManagementTargetSummaryComponent } from './management/target-summary/management-target-summary/management-target-summary.component';
import { ManagementSalesPlanEditNewComponent } from './management/sales-plan/management-sales-plan-edit-new/management-sales-plan-edit-new.component';

import { ManagementLicensePlateComponent } from './management/masterdata/licensePlate/management-licensePlate/management-licensePlate.component';
import { ManagementLicensePlateEditComponent } from './management/masterdata/licensePlate/management-licensePlate-edit/management-licensePlate-edit.component';
import { ManagementTransferRequestComponent } from './management/transaction/transfer/management-invtransfer-request/management-transfer-request.component';
import { ManagementInvtransferRequestEditComponent } from './management/transaction/transfer/management-invtransfer-request-edit/management-invtransfer-request-edit.component';
import { ManagementInvstranferRequestPrintComponent } from './management/transaction/transfer/management-invstranfer-request-print/management-invstranfer-request-print.component';
import { Pdf_rpt_salestransactiondetail_returnComponent } from './management/report/rpt_salestransactiondetail_return/template/pdf_rpt_salestransactiondetail_return/pdf_rpt_salestransactiondetail_return.component';
import { ShopSearchLicensePlateComponent } from './shop/components/shop-search-license-plate/shop-search-license-plate.component';
import { ManagementLicensePlateViewComponent } from './management/masterdata/licensePlate/management-licensePlate-view/management-licensePlate-view.component';
import { ManagementLicensePlateAddComponent } from './management/masterdata/licensePlate/management-licensePlate-add/management-licensePlate-add.component';
import { ShopCheckinSerialComponent } from './shop/checkin/shop-checkin-serial/shop-checkin-serial.component';
import { Rpt_dash_salestransactiondetailsComponent } from './management/report/dashboard/rpt_dash_salestransactiondetails/rpt_dash_salestransactiondetails.component';
import { Rpt_dashboard_saletransactiondetailsComponent } from './management/report/dashboard/rpt_dashboard_saletransactiondetails/rpt_dashboard_saletransactiondetails.component';
import { TestUomEditComponent } from './management/test/test-uom-edit/test-uom-edit.component';
import { DemoUomComponent } from './management/report/test2/demo-uom/demo-uom.component';
import { DemoUomEditComponent } from './management/report/test2/demo-uom-edit/demo-uom-edit.component';
import { DmUomComponent } from './management/report/test-uom/dm-uom/dm-uom.component';
import { DmUomEditComponent } from './management/report/test-uom/dm-uom-edit/dm-uom-edit.component';
import { DashboardTestComponent } from './management/report/dashboard-test/dashboard-test/dashboard-test.component';
import { TestDashboardComponent } from './management/report/dashboardtest/test-dashboard/test-dashboard.component';
import { TestDashboard2Component } from './management/report/dashboard-test2/test-dashboard2/test-dashboard2.component';
import { TableInfoComponent } from './management/masterdata/tableinfo/table-info/table-info.component';
import { PlaceInforComponent } from './management/masterdata/place-infor/place-infor.component';
import { TableplaceComponent } from './management/masterdata/tableplace/tableplace/tableplace.component';


import { ManagementTableDesignComponent } from './management/fNbtable/Management-table-design/Management-table-design.component';
// import { DxDashboardControlModule } from 'devexpress-dashboard-angular';
import { ManagementInvtranfePrintComponent } from './management/transaction/transfer/management-invstranfer-print/management-invstranfer-print.component';

import { TablePlaceResolver } from './_resolve/tableplace.resolver';
import { ManagementTableCashierComponent } from './management/fNbtable/Management-table-cashier/Management-table-cashier.component';
import { ManagementPrintDesignComponent } from './management/print-design/management-print-design/management-print-design.component';
import { Pdf_rpt_salestransactiondetailComponent } from './management/report/rpt_salestransactiondetail/template/pdf_rpt_salestransactiondetail/pdf_rpt_salestransactiondetail.component';
import { RPT_SalesTransDetailSummaryByDepartmentComponent } from './management/report/RPT_SalesTransDetailSummaryByDepartment/RPT_SalesTransDetailSummaryByDepartment.component';
import { ManagementPeripheralsListComponent } from './management/setting/peripherals/management-peripherals-list/management-peripherals-list.component';
import { ManagementPeripheralsEditComponent } from './management/setting/peripherals/management-peripherals-edit/management-peripherals-edit.component';
import { ManagementTerminalPeripheralsListComponent } from './management/setting/peripherals/management-terminal-peripherals-list/management-terminal-peripherals-list.component';
import { ManagementTransactionDeliveryComponent } from './management/transaction/delivery/management-transaction-delivery/management-transaction-delivery.component';
import { ManagementTransactionDeliveryEditComponent } from './management/transaction/delivery/management-transaction-delivery-edit/management-transaction-delivery-edit.component';
import { ManagementTransactionDeliveryPrintComponent } from './management/transaction/delivery/management-transaction-delivery-print/management-transaction-delivery-print.component';
import { ManagementTransactionDeliveryReturnComponent } from './management/transaction/deliveryReturn/management-transaction-deliveryReturn/management-transaction-deliveryReturn.component';
import { ManagementTransactionDeliveryReturnEditComponent } from './management/transaction/deliveryReturn/management-transaction-deliveryReturn-edit/management-transaction-deliveryReturn-edit.component';
import { ManagementTransactionDeliveryReturnPrintComponent } from './management/transaction/deliveryReturn/management-transaction-deliveryReturn-print/management-transaction-deliveryReturn-print.component';
import { ShopPlaceInfoComponent } from './shop/shop-placeInfo/shop-placeInfo.component';
import { ManagementReceiptFromProductionListComponent } from './management/transaction/receiptFromProduction/management-receiptFromProduction-list/management-receiptFromProduction-list.component';
import { ManagementReceiptFromProductionPrintComponent } from './management/transaction/receiptFromProduction/management-receiptFromProduction-print/management-receiptFromProduction-print.component';
import { ManagementReceiptFromProductionEditComponent } from './management/transaction/receiptFromProduction/management-receiptFromProduction-edit/management-receiptFromProduction-edit.component';
import { ManagementProductionOrderListComponent } from './management/transaction/ProductionOrder/management-production-order-list/management-production-order-list.component';
import { ManagementProductionOrderEditComponent } from './management/transaction/ProductionOrder/management-production-order-edit/management-production-order-edit.component';
import { ManagementProductionOrderPrintComponent } from './management/transaction/ProductionOrder/management-production-order-print/management-production-order-print.component';
import { RelationShipComponent } from './management/transaction/ProductionOrder/relationShip/relationShip.component';
import { ManagementItemStoreListingComponent } from './management/masterdata/item/management-item-store-listing/management-item-store-listing.component';
import { ManagementSaleschannelComponent } from './management/masterdata/saleschannel/management-saleschannel/management-saleschannel.component';
import { ManagementSaleschannelEditComponent } from './management/masterdata/saleschannel/management-saleschannel-edit/management-saleschannel-edit.component';
import { ManagenmentImportTableInforComponent } from './management/masterdata/import/managenment-import-tableInfor/managenment-import-tableInfor.component';
import { ShopComponentOtherDisplayComponent } from './shop/components/shop-component-other-display/shop-component-other-display.component';
import { ShopDeliveryOrderDetailComponent } from './shop/delivery/shop-delivery-order-detail/shop-delivery-order-detail.component';
import { ShopDeliveryOrderListComponent } from './shop/delivery/shop-delivery-order-list/shop-delivery-order-list.component';
import { ShopDeliveryOrderPrintComponent } from './shop/delivery/shop-delivery-order-print/shop-delivery-order-print.component';
import { ManagementDivisionCreateComponent } from './management/report/division/management-division-create/management-division-create.component';
import { ManagementDivisionEditComponent } from './management/report/division/management-division-edit/management-division-edit.component';
import { ManagementDivisionListComponent } from './management/report/division/management-division-list/management-division-list.component';
import { ManagementShipDivisionDetailComponent } from './management/report/division/ship/management-ship-division-detail/management-ship-division-detail.component';
import { ManagementShipDivisionListComponent } from './management/report/division/ship/management-ship-division-list/management-ship-division-list.component';
import { ShopPaymentListComponent } from './shop/payment/shop-payment-list/shop-payment-list.component';
import { ShopPaymentDetailComponent } from './shop/payment/shop-payment-detail/shop-payment-detail.component';
import { ManagementShippingListComponent } from './management/masterdata/shipping/management-shipping-list/management-shipping-list.component';
import { ManagementShippingDetailComponent } from './management/masterdata/shipping/management-shipping-detail/management-shipping-detail.component';
import { ManagementLicenseEditComponent } from './management/masterdata/company/management-license-edit/management-license-edit.component';
import { ShopItemSerialExpandComponent } from './shop/tools/shop-item-serial-expand/shop-item-serial-expand.component';
import { CollectionDailyByCounterComponent } from './management/report/collection-daily-by-counter/collection-daily-by-counter.component';
import { Rpt_SyncDataStatusByIdocComponent } from './management/report/rpt_SyncDataStatusByIdoc/rpt_SyncDataStatusByIdoc.component';

import { ShopCustomerTeraEditComponent } from './shop/customer/shop-customer-tera-edit/shop-customer-tera-edit.component';
import { SetupNewStoreComponent } from './setup/setup-new-store/setup-new-store.component';
import { ManagementDisallowanceListComponent } from './management/disallowance/management-disallowance-list/management-disallowance-list.component';
import { ManagementDisallowanceEditComponent } from './management/disallowance/management-disallowance-edit/management-disallowance-edit.component';
import { ManagementVariantListComponent } from './management/variant/management-variant-list/management-variant-list.component';
import { ManagementVariantSetupComponent } from './management/variant/management-variant-setup/management-variant-setup.component';
import { RPT_SyncDataStatusViewComponent } from './management/report/RPT_SyncDataStatusView/RPT_SyncDataStatusView.component';
import { SettingPrintComponent } from './management/masterdata/settingPrint/settingPrint.component';




// import {JwtModule } from 
moment.tz.setDefault("UTC");
const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};
export function tokenGetter() {
  return localStorage.getItem('token');
}
const customLayouts: IKeyboardLayouts = {
  ...keyboardLayouts,
  'NumberLayout': {
    'name': 'NumberLayout',
    'keys': [
      [
        ['0', '0'],
        ['.', '.'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp],

      ],
      [
        ['1', '1'],
        ['2', '2'],
        ['3', '3'],
      ],
      [
        ['4', '4'],
        ['5', '5'],
        ['6', '6'],
      ],
      [
        ['7', '7'],
        ['8', '8'],
        ['9', '9'],
      ],

    ],
    'lang': ['de-CH']
  }
};
@Pipe({ name: 'gridCellData' })
export class GridCellDataPipe implements PipeTransform {
  transform(gridData: any) {
    return gridData.data[gridData.column.caption.toLowerCase()];
  }
}

@NgModule({

  declarations: [
    TableplaceComponent,
    //delivery
    ManagementTransactionDeliveryComponent,
    ManagementTransactionDeliveryEditComponent,
    ManagementTransactionDeliveryPrintComponent,

    ManagementReceiptFromProductionListComponent,
    ManagementReceiptFromProductionEditComponent,
    ManagementReceiptFromProductionPrintComponent,
    SettingPrintComponent,

    ManagementProductionOrderListComponent,
    ManagementProductionOrderEditComponent,
    ManagementProductionOrderPrintComponent,
    RelationShipComponent,
    ManagenmentImportTableInforComponent,

    ManagementTransactionDeliveryReturnComponent,
    ManagementTransactionDeliveryReturnEditComponent,
    ManagementTransactionDeliveryReturnPrintComponent,
    PlaceInforComponent,
    ManagementTableCashierComponent,
    TableInfoComponent,
    DashboardTestComponent,
    TestDashboard2Component,
    TestDashboardComponent,
    DemoUomComponent,
    GridCellDataPipe,
    CurrencyFormat,
    DateFormat,
    VirtualKeyboardComponent, OskInputDirective, KeyboardKeyDirective,
    TimeSpanFormat,
    StatusSerialFormat,
    StatusFormat,
    ChangelogStatusFormat,
    GenderFormat,
    IconFormat,
    FilterPipe,
    NumberPipePipe,
    PosTypeFormat,
    AppComponent,
    ShopComponent,
    TestUomComponent,
    DmUomComponent,
    DemoUomEditComponent,
    TestUomEditComponent,
    DmUomEditComponent,
    LoginComponent,
    ChangePasswordComponent,
    ManagementComponent,
    ManagementDashboardComponent,
    ManagementItemListComponent,
    WaiverFormTemplateComponent,
    AuthComponent,
    ShopLeftMenuComponent,
    ShopHeaderComponent,
    ShopManualPromotionComponent,
    ShopManualDiscountComponent,
    ShopPlaceInfoComponent,
    ManagementHeaderComponent,
    ManagementLeftMenuComponent,
    ManagementSubMenuComponent,
    ManagementItemEditComponent,
    ManagementRoleComponent,
    ManagementRoleEditComponent,
    ManagementFunctionComponent,
    ManagementPermissionComponent,
    ManagementTargetSummaryComponent,
    ManagementFunctionEditComponent,
    ManagementPermissionEditComponent,
    ManagementEmployeeSalaryComponent,
    ManagementSalesPlanEditNewComponent,
    ManagementEmployeeSalarySingleComponent,
    ManagementEmployeeSalaryEditComponent,
    ManagementSettingRoleListComponent,
    ManagementSettingRoleEditComponent,
    ManagementSettingControlPermissionComponent,
    ManagementTimeframeComponent,
    ManagementTimeframeEditComponent,
    ManagementPickupAmountListComponent,
    ManagementCrmComponent,
    ManagementCrmSetupComponent,
    ManagementLoyaltyrankComponent,
    ManangementLoyaltyrankEditComponent,
    ManagementStoreListComponent,
    ManagementStoreEditComponent,
    ManagementCompanyComponent,
    ManagementCompanyEditComponent,
    ManagementStorePaymentSettingComponent,
    ManagementStorePaymentEditComponent,
    ManagementStoregroupEditComponent,
    ManagementStoregroupListComponent,
    ManagementMerchandiseComponent,
    ManagementMerchandiseEditComponent,
    ManagementEmployeeEditComponent,
    ManagementEmployeeListComponent,
    ManagementWarehouseEditComponent,
    ManagementWarehouseListComponent,
    ManagementPaymentListComponent,
    ManagementPaymentEditComponent,
    ManagementControlEditComponent,
    ManagementTableDesignComponent,
    ManagementVoidreturnSettingComponent,
    ManagementVoidreturnSettingEditComponent,
    ManagementFormatListComponent,
    ManagementFormatEditComponent,
    ManagementPromotionSetupComponent,
    ManagementChangelogListComponent,
    ManagementChangelogEditComponent,
    ManagementPromotionListComponent,
    ManagementTransactionGoodissueComponent,
    ManagementTransactionGoodissueEditComponent,
    ManagementTransactionGoodreceiptComponent,
    ManagementTransactionGoodreceiptEditComponent,
    ManagementPromotionSetupComponent,
    ManagementPromotionCustomerComponent,
    ManagementPromotionEditComponent,
    ManagementInvtransferComponent,
    ManagementInvtransferEditComponent,
    ManagementInvtransferShipmentEditComponent,
    ManagementInvtransferShipmentComponent,
    ManagementInventoryCoutingComponent,
    ManagementInventoryCoutingEditComponent,
    ManagementInventoryTransferComponent,
    Rpt_dash_salestransactiondetailsComponent,
    Rpt_dashboard_saletransactiondetailsComponent,
    ManagementInventoryTransferEditComponent,
    ManagementInventoryPostingComponent,
    ManagementInventoryPostingEditComponent,
    ManagementPromotionSchemaSetupComponent,
    ManagementBankinEditComponent,
    ManagementBankinListComponent,
    ManagementPromotionSearchComponent,
    ManagementPromotionSchemaComponent,
    ManagementInvtransferSearchComponent,
    ManagementInvstransferReceiptComponent,
    ManagementInvtransferReceiptEditComponent,
    ManagementInventoryCountedListComponent,
    ManagementMasterdataItemgroupComponent,
    ManagementMasterdataItemgroupEditComponent,
    ManagementMasterdataStorageComponent,
    ManagementMasterdataStorageEditComponent,
    ManagementMasterdataStoreareaComponent,
    ManagementMasterdataStoreareaEditComponent,
    ManagementMasterdataTaxComponent,
    ManagementMasterdataTaxEditComponent,
    ManagementMasterdataUomComponent,
    ManagementMasterdataUomEditComponent,
    ManagementUserListComponent,
    ManagementUserRoleComponent,
    ManagementUserEditComponent,
    ManagementCapacityEditComponent,
    ManagementCapacityListComponent,
    ManagementItemstorageComponent,
    ManagementItemstorageEditComponent,
    ManagementDenominationEditComponent,
    ManagementDenominationListComponent,
    PermissionDeniedComponent,
    ManagementSummaryEndShiftComponent,
    ManagementStoreClientComponent,
    ManagementStoreClientEditComponent,
    ManagementOpenShiftListComponent,
    ManagementBarcodeSetupDetailComponent,
    ManagementBarcodeSetupListComponent,
    // ManagementItemUploadComponent,
    // ManagementItemUploadEditComponent,
    ShopReasonInputComponent,
    ManagementImportSalesOrderComponent,
    ManagementReasonListComponent,
    ManagementReasonEditComponent,
    ManagementPromotionInputOtComponent,
    ManagementImportBomComponent,
    ManagementImportCustomergroupComponent,
    ManagementImportCustomerComponent,
    ManagementImportEmployeeComponent,
    ManagementImportWarehouseComponent,
    ManagementImportUserComponent,
    ManagementImportUserstoreComponent,
    ManagementImportUomComponent,
    ManagementImportTaxComponent,
    ManagementImportStorepaymentComponent,
    ManagementImportStoregroupComponent,
    ManagementImportStorecapacityComponent,
    ManagementImportStoreareaComponent,
    ManagementImportStoreComponent,
    ManagementImportStorageComponent,
    ManagementImportProductComponent,
    ManagementImportStampsComponent,
    ManagementImportPricelistComponent,
    ManagementImportPaymentmethodComponent,
    ManagementImportMerchandiseComponent,
    ManagementImportItemuomComponent,
    ManagementImportItemserialstockComponent,
    ManagementImportItemserialComponent,
    ManagementImportItemgroupComponent,
    ManagementImportItemComponent,
    ManagementImportItemStorageComponent,
    ManagementImportLicensePlateComponent,
    ManangementCurrencyRoundingoffComponent,
    ManangementItemCheckMasterDataComponent,
    ManagementPriceListNameMappingComponent,
    ManagementPriceListComponent,
    ManagementShiftListComponent,
    ManagementShiftDetailComponent,
    ManagementPurchaseListComponent,
    ManagementPurchaseDetailComponent,
    ManagementGrpoListComponent,
    ManagementGrpoDetailComponent,
    ManagementPoSearchComponent,
    ManagementChangelogComponent,
    ManagementGrpoPoComponent,
    ManagementReasonListComponent,
    ManagementUserStoreComponent,
    ManagementCustomerListComponent,
    ManagementCustomerEditComponent,
    ManagementCustomerGroupListComponent,
    ManagementCustomerGroupEditComponent,
    ManagementPrepaidComponent,
    ManagementPrepaidEditComponent,
    ManagementCategorySettingComponent,
    ManagementHolidayComponent,
    ManagementHolidayEditComponent,
    ManagementSettingMenuComponent,
    ManagementGeneralSettingEditComponent,
    ManagementGeneralSettingListComponent,
    ManagementShortcutComponent,
    ManagementShortcutEditComponent,
    ManagementEndofdateListComponent,
    ManagementEndofdateDetailsComponent,
    ManagementEndofdatePrintComponent,
    ManagementPrintDesignComponent,
    ImportErrorlistComponent,
    ManagementPurchaseRequestListComponent,
    ManagementPurchaseRequestDetailComponent,
    ManagementGoodsReturnListComponent,
    ManagementGoodsReturnDetailComponent,
    ManagementGoodsReturnComponent,
    ManagementStoreWhsEditComponent,
    ManagementStoreWhsSettingComponent,
    ManagementLoyaltyPointConvertComponent,
    ManagementVersionEditComponent,
    ManagementVersionListComponent,
    ManagementLicensePlateComponent,
    ManagementLicensePlateEditComponent,
    Pdf_rpt_salestransactiondetail_returnComponent,
    ManagementSaleschannelComponent,
    ManagementSaleschannelEditComponent,
    //Print
    ManagementPrintTransferInComponent,
    ManagementPrintTransferOutComponent,
    ManagementPrintEndShiftComponent,
    ManagementPrintEndDayComponent,
    ManagementPrintPoComponent,
    ManagementPrintGrpoComponent,
    ManagementPrintShiftComponent,
    ManagementUserInforComponent,
    ManagementPromotionImportComponent,
    ManagementItemUomComponent,
    ManagemenItemuomEditComponent,
    ManagementTodolistComponent,
    ManagementTodolistEditComponent,
    ManagemenItemuomEditComponent,
    WaiverFormComponent,
    ManagementPickupAmountComponent,
    ManagementInventoryPrintTemplateComponent,
    ManamentPrepaidHistoryComponent,
    ManagementImportGoodsReceiptComponent,
    ManagementCurrencyComponent,
    ManagementCurrencyEditComponent,
    ManagementStoreCurrencyComponent,
    ManagementStoreCurrencyEditComponent,
    ManagementExchangeRateComponent,
    ManagementExchangeRateEditComponent,
    ManagementStoreCurrencySettingComponent,
    ManagementLicenseEditComponent,
    ManagementItemSerialComponent,
    ManagementControlEditComponent,
    ManagementControlComponent,
    ManagementSalesPlanComponent,
    ManagementSalesPlanEditComponent,
    ManagementShortcutSettingComponent,
    ShopPaymentChangePopupComponent,
    ManagementPriotyPriceListComponent,
    ManagementPeripheralsListComponent,
    ManagementPeripheralsEditComponent,
    ManagementItemStoreListingComponent,
    ManagementTerminalPeripheralsListComponent,
    PrintShopComponent,
    ManagementBankTerminalComponent,
    ManagementPickupPrintComponent,
    ManagementTransferRequestComponent,
    ManagementInvtransferRequestEditComponent,
    ShopSearchLicensePlateComponent,
    ManagementLicensePlateViewComponent,
    ManagementLicensePlateAddComponent,
    ShopCheckinSerialComponent,
    ManagementInvtranfePrintComponent,
    //Report
    ManagementReportListComponent,
    ManagementPickupPrintTemplateComponent,
    RptInventoryauditComponent,
    RptStoreListingComponent,
    Rpt_sync_promoComponent,
    RptInventoryonhandComponent,
    Rpt_salesstoresummaryComponent,
    CollectionDailyByCounterComponent,
    Rpt_SyncDataStatusByIdocComponent,
    Rpt_salestransactiondetailComponent,
    Rpt_salestransactiondetail_exComponent,
    Rpt_salestransactiondetail_returnComponent,
    Rpt_salestransactionsummaryComponent,
    Rpt_invoicetransactiondetailComponent,
    Rpt_invoicetransactionsummaryComponent,
    RptInvoiceTransactionPaymentComponent,
    RptSalesByHourComponent,
    RptSalesByYearComponent,
    Rpt_salesBySalesPersonComponent,
    RptSalesTransactionPaymentComponent,
    RptVoucherCheckinComponent,
    RptPOSPromoComponent,
    RptGiftVoucherComponent,
    RptActionOnOrderComponent,
    Rpt_inventory_postingComponent,
    RptPosPromotionNewComponent,
    Rpt_salesByItemComponent,
    Rpt_SalesEPAYDetailComponent,
    Rpt_customer_pointComponent,
    RptSyncPriceComponent,
    RptSyncItemComponent,
    Rpt_clearremoveitemComponent,
    RptLogComponent,
    PrintTemplateClearbillComponent,
    ShopPickupAmountInputComponent,
    ShopSelectShiftComponent,
    ShopFlyCartComponent,
    ShopToolClearCacheComponent,
    ShopCheckoutSummaryPrintComponent,
    PageNotFoundComponent,
    ShopOrderComponent,
    ShopCustomerDetailComponent,
    ShopOrderGroceryComponent,
    ShopReturnListComponent,
    ShopPaymentHistoryComponent,
    ShopReturnBillComponent,
    ShopCartDetailComponent,
    ShopStoreSelectComponent,
    ShopItemSingleComponent,
    ShopItemDetailComponent,
    ShopComponentOtherDisplayComponent,
    ShopBillInforComponent,
    ShopHoldListComponent,
    ShopCounterInputComponent,
    ShopScanBarcodeComponent,
    ShopBillListComponent,

    ShopPopupUserComponent,
    ShopToolsAssignStaffComponent,
    ShopCustomerComponent,
    ShopBillDetailComponent,
    NumpadDiscountComponent,
    ShopToolVirtualKeyboardComponent,
    ShopShiftCreateComponent,
    ShopDashboardComponent,
    ShopSlickItemComponent,
    ShopReturnComponent,
    ShopToolShiftComponent,
    ShopHeaderCustomerComponent,
    ShopOtherPaymentComponent,
    ShopBillPaymentComponent,
    ShopItemSerialComponent,
    ShopCapacityComponent,
    ShopCapacityEditComponent,
    ShopTopMenuComponent,
    ShopCustomerEditComponent,
    ShopComponentOrderPrintComponent,
    ShopComponentManagementPrintShiftComponent,
    ShopComponentManagementPrintEndOfDateComponent,
    ShopToolUserComponent,
    ShopShiftOpenComponent,
    ShopDeliveryOrderDetailComponent,
    ShopDeliveryOrderListComponent,
    ShopCheckoutDetailComponent,
    ShopCheckoutListComponent,
    ShopBillCheckinListComponent,
    ShopBillCheckoutComponent,
    ItemSerialComponent,
    ShopBillPrintComponent,
    ShopSalestypeChangeComponent,
    ShopCardInputComponent,
    ShopMemberInputComponent,
    ShopInvoiceInputComponent,
    ShopAnotherSourceBillComponent,
    ShopCapacityCalendarComponent,
    ShopOrderCheckoutComponent,
    ShopBillCheckinComponent,
    ShopToolsSettlementComponent,
    ShopCheckinVoucherComponent,
    ShopCheckoutPrintComponent,
    ShopCheckoutPaymentComponent,
    ShopCheckoutOpenListComponent,
    ShopCardMemberInputComponent,
    ShopExchangeComponent,
    ShopExchangeListComponent,
    ShopExchangeItemListComponent,
    ShopPaymentCurrencyComponent,
    ShopPaymentQrscanComponent,
    ShopVoucherSerialComponent,
    ShopApprovalInputComponent,
    ShopDeliveryInputComponent,
    ShopDeliveryOrderPrintComponent,
    ShopCheckinMenberComponent,
    ShopCustomerTeraEditComponent,
    // ShopOtherPaymentComponent,
    //Shared
    UploadImageComponent,
    UploadImageCompanyComponent,
    ComponentMoreMenuComponent,
    ShopToolPaymentComponent,
    PickThemeComponent,
    ComponentNotificationComponent,
    //Checkout
    ShopItemCheckSingleComponent,
    ShopComponentLuckyDrawPrintComponent,
    ShopCheckoutSlickComponent,
    ShopCheckoutBillComponent,
    ShopToolPopoverComponent,
    ShopOtherItemComponent,
    ShopToolPromotionDetailViewComponent,
    ShopSearchItemComponent,
    ShopSearchItemGridComponent,
    ShopLoadingComponent,
    ShortcutsHelperComponent,
    ShopChangeStoreComponent,
    ShopToolLoading2Component,
    ShopItemSerialExpandComponent,
    ManagementDisallowanceListComponent,
    ManagementDisallowanceEditComponent,
    // CurrencyFormat,
    // TestComponent
    SettingProgressComponent,
    TimePipe,
    // Loading
    LoadingSpinnerComponent,
    LoadingDirective,
    PrintXComponent,
    Pdf_rpt_salestransactiondetailComponent,
    RPT_SalesTransDetailSummaryByDepartmentComponent,
    ManagementDatasourceEditComponent,
    ManagementGoodReceiptPrintComponent,
    ManagementGoodIssuePrintComponent,
    ManagementInventoryCoutingPrintComponent,
    ManagementInventoryPostingPrintComponent,
    ManagementInvtranfeReceiptPrintComponent,
    ManagementInvtranfeShipmentPrintComponent,
    ManagementGRPOPrintComponent,
    ManagementPurchaseOrderPrintComponent,
    ManagementDivisionCreateComponent,
    ManagementDivisionEditComponent,
    ManagementDivisionListComponent,
    ManagementShippingListComponent,
    ManagementShippingDetailComponent,

    ManagementShipDivisionListComponent,
    ManagementShipDivisionDetailComponent,
    ManagementItemSerialListComponent,
    StampsTemplateComponent,
    ManagementPurchaseRequestPrintComponent,
    ManagementGoodsReturnPrintComponent,
    ManagementInventoryTransferPrintComponent,
    RptInventorySerialComponent,
    ManagementInvstranferRequestPrintComponent,
    ShopPaymentListComponent,
    ShopPaymentDetailComponent,
    SetupNewStoreComponent,
    ManagementVariantListComponent,
    ManagementVariantSetupComponent,
    RPT_SyncDataStatusViewComponent
  ],
  imports: [
    WebcamModule,
    BrowserModule,
    ThermalPrintModule,
    CommonModule, HotkeyModule.forRoot(),
    NgxMaskModule.forRoot(maskConfigFunction),
    NgBarcodeDetectorModule,
    ZXingScannerModule,
    InputMaskModule,
    BarcodeScannerLivestreamModule,
    ImagesLazyloadModule, // nhúng vào đây
    HttpClientModule,
    NgxSpinnerModule,
    NgxQRCodeModule,
    NgxBarcode6Module,
    // DeviceDetectorModule.forRoot(),
    // DynamicDialogModule,
    // TableModule,
    // MatToolbarModule,
    // MatSidenavModule,
    // MatListModule,
    // MatButtonModule,
    MatIconModule,
    CookieModule.forRoot(),
    Ng2SearchPipeModule,
    AppRoutingModule,
    NgToggleModule,
    DxHtmlEditorModule,
    DxSelectBoxModule, DxCheckBoxModule, DxDateBoxModule, DxCalendarModule, DxTemplateModule, DxLookupModule, DxPopoverModule, DxNumberBoxModule,
    DxDataGridModule, DxTreeListModule, DxSwitchModule, DxButtonModule, DxDrawerModule, DxTextBoxModule, DxFunnelModule, DxPopupModule, DxValidatorModule,
    DxDropDownBoxModule, DxTabPanelModule, DxToolbarModule, DxRadioGroupModule, DxListModule, DxFileUploaderModule, DxChartModule, DxPieChartModule,
    DxTreeViewModule, DxSchedulerModule, DxProgressBarModule, DxDropDownButtonModule, DxTileViewModule, DxTagBoxModule, DxSortableModule, DxDiagramModule,
    DxScrollViewModule, DxSankeyModule, DxTabsModule, DxGalleryModule,
    // DxDashboardControlModule,
    NgxUsefulSwiperModule,
    DxTextAreaModule,
    // NgxPrettyCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',

    }), // ToastrModule added
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    KeyboardShortcutsModule.forRoot(),
    // SelectDropDownModule,
    BsDatepickerModule.forRoot(),
    SlickCarouselModule,
    NgxSelectModule,
    MatButtonModule,
    MatKeyboardModule,
    GalleryModule,
    LightboxModule,
    NgxPrintModule,
    NgxPrinterModule.forRoot({ printOpenWindow: false }),

    //.forRoot({printOpenWindow: true}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: () => {
    //       return localStorage.getItem('token');
    //     },
    //     allowedDomains: ['localhost'],
    //     disallowedRoutes: ['localhost/auth/login']
    //   }
    // })
    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
          // console.log('tokenGetter called = ' + localStorage.getItem('token'));
          return localStorage.getItem('token');
        },

        // allowedDomains: [environment.host],
        allowedDomains: [localStorage.getItem('environmentHost')],
        disallowedRoutes: []
      }
    }),


    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: environment.production,
    //   // Register the ServiceWorker as soon as the app is stable
    //   // or after 30 seconds (whichever comes first).
    //   registrationStrategy: 'registerWhenStable:10000'
    // }),

    // TreetableModule
    // CarouselModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy
    // },

    EnvServiceProvider,
    KeyboardService,
    AuthService,
    BusyService,
    WindowService,
    LoadingService,
    SignalRService,
    Service,
    // CookieService,
    CustompreloadingstrategyService,
    // DialogService,
    ErrorInterceptorProvider,
    LoadingInterceptorProvider,
    PreventUnsavedChanges,
    AlertifyService,
    AuthGuard,
    ItemService,
    ItemListResolver,
    ReleaseNoteListResolver,
    ItemEditResolver,
    ShopEmployeeListResolver,
    BillService,
    BillListResolver,
    CustomerService,
    CustomerListResolver,
    BillDetailResolver,
    BillReturnListResolver,
    BillHoldingListResolver,
    LogService,
    RoleService,
    RoleListResolver,
    RoleEditResolver,
    FunctionService,
    FunctionListResolver,
    PermissionService,
    PermissionEditResolver,
    PermissionListResolver,
    SettingRoleEditResolver,
    EmployeeService,
    EmployeeListResolver,
    StoreService,
    StoreListResolver,
    StoregroupService,
    StoreGoupListResolver,
    WarehouseService,
    WarehouseListResolver,
    TablePlaceResolver,
    PaymentmethodService,
    PaymentMethodListResolver,
    ControlService,
    CommonService,
    StorePaymentEditResolver,
    StorePaymentService,
    FormatconfigService,
    FormatConfigListResolver,
    BomService,
    CapacityService,
    GoodreceiptService,
    Service,
    ItemuomService,
    UomService,
    ItemserialService,
    ItemserialstockService,
    PromotionService,
    CustomergroupService,
    InventorycoutingService,
    InventorypostingService,
    InventoryService,
    ExcelService,
    StoreareaService,
    UserstoreService,
    ProductService,
    PricelistService,
    ItemgroupService,
    POSItemListResolver,
    CheckOutListResolver,
    InvoiceDetailResolver,
    PurchaseDetailResolver,
    PurchaseRequestDetailResolver,
    GRPODetailResolver,
    InvoicePaymentResolver,


    DatePipe,
    { provide: MAT_KEYBOARD_LAYOUTS, useValue: customLayouts },

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}




