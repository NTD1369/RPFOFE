import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../auth/page-not-found/page-not-found.component';
import { WaiverFormComponent } from '../component/print/waiver-form/waiver-form.component';
import { PermissionDeniedComponent } from '../shop/permission-denied/permission-denied.component';
import { AuthGuard } from '../_guard/auth.guard';
import { PreventUnsavedChanges } from '../_guard/prevent-unsaved-changes.guard';
import { EmployeeListResolver } from '../_resolve/employee-list.resolver';
import { FormatConfigListResolver } from '../_resolve/fomatconfig-list.resolver';
import { FunctionListResolver } from '../_resolve/function-list.resolver';
import { ItemEditResolver } from '../_resolve/item-edit-resolver';
import { ItemListResolver } from '../_resolve/item-list.resolver';
import { PaymentMethodListResolver } from '../_resolve/paymentmethod-list.resolver';
import { PermissionListResolver } from '../_resolve/permission-list.resolver';
import { PurchaseDetailResolver } from '../_resolve/purchase-detail.resolver'; 
import { PurchaseRequestDetailResolver } from '../_resolve/purchaserequest-detail.resolver';
import { RoleListResolver } from '../_resolve/role-list.resolver';
import { SettingRoleEditResolver } from '../_resolve/setting-role-edit-resolver';
import { StoreListResolver } from '../_resolve/store-list.resolver';
import { StorePaymentEditResolver } from '../_resolve/store-payment-edit-resolver';
import {   StoreGoupListResolver  } from '../_resolve/storegroup-list.resolver';
import { WarehouseListResolver } from '../_resolve/warehouse-list.resolver';
import { ManagementUserInforComponent } from './account/management-user-infor/management-user-infor.component';
import { ManagementCapacityListComponent } from './capacity/management-capacity-list/management-capacity-list.component';
import { ManagementCrmSetupComponent } from './crm/management-crm-setup/management-crm-setup.component';
import { ManagementCrmComponent } from './crm/management-crm/management-crm.component';
import { ManagementLoyaltyrankComponent } from './crm/rank/management-loyaltyrank/management-loyaltyrank.component';
import { ManagementEndofdateDetailsComponent } from './endofdate/management-endofdate-details/management-endofdate-details.component';
import { ManagementEndofdateListComponent } from './endofdate/management-endofdate-list/management-endofdate-list.component';
import { ManagementEndofdatePrintComponent } from './endofdate/management-endofdate-print/management-endofdate-print.component';
import { ManagementOpenShiftListComponent } from './endofdate/management-open-shift-list/management-open-shift-list.component';
import { ManagementDashboardComponent } from './management-dashboard/management-dashboard.component';
import { ManagementComponent } from './management.component'; 
import { ManagementBankTerminalComponent } from './masterdata/bank-terminal/management-bank-terminal/management-bank-terminal.component';
import { ManagementCompanyComponent } from './masterdata/company/management-company/management-company.component';
import { ManagementCurrencyComponent } from './masterdata/currency/management-currency/management-currency.component';
import { ManagementCustomerGroupListComponent } from './masterdata/customer-group/management-customer-group-list/management-customer-group-list.component';
import { ManagementCustomerListComponent } from './masterdata/customer/management-customer-list/management-customer-list.component';
import { ManagementDenominationListComponent } from './masterdata/denomination/management-denomination-list/management-denomination-list.component';
import { ManagementEmployeeListComponent } from './masterdata/employee/management-employee-list/management-employee-list.component';
import { ManagementExchangeRateComponent } from './masterdata/exchange-rate/management-exchange-rate/management-exchange-rate.component';
import { ManagementFormatListComponent } from './masterdata/format/management-format-list/management-format-list.component';
import { ManagementHolidayEditComponent } from './masterdata/holiday/management-holiday-edit/management-holiday-edit.component';
import { ManagementHolidayComponent } from './masterdata/holiday/management-holiday/management-holiday.component';

import { ManagementImportBomComponent } from './masterdata/import/management-import-bom/management-import-bom.component';
import { ManagementImportCustomerComponent } from './masterdata/import/management-import-customer/management-import-customer.component';
import { ManagementImportCustomergroupComponent } from './masterdata/import/management-import-customergroup/management-import-customergroup.component';
import { ManagementImportEmployeeComponent } from './masterdata/import/management-import-employee/management-import-employee.component';
import { ManagementImportItemStorageComponent } from './masterdata/import/management-import-item-storage/management-import-item-storage.component';
import { ManagementImportItemComponent } from './masterdata/import/management-import-item/management-import-item.component';
import { ManagementImportItemgroupComponent } from './masterdata/import/management-import-itemgroup/management-import-itemgroup.component';
import { ManagementImportItemserialComponent } from './masterdata/import/management-import-itemserial/management-import-itemserial.component';
import { ManagementImportItemserialstockComponent } from './masterdata/import/management-import-itemserialstock/management-import-itemserialstock.component';
import { ManagementImportItemuomComponent } from './masterdata/import/management-import-itemuom/management-import-itemuom.component';
import { ManagementImportMerchandiseComponent } from './masterdata/import/management-import-merchandise/management-import-merchandise.component';
import { ManagementImportPaymentmethodComponent } from './masterdata/import/management-import-paymentmethod/management-import-paymentmethod.component';
import { ManagementImportPricelistComponent } from './masterdata/import/management-import-pricelist/management-import-pricelist.component';
import { ManagementImportProductComponent } from './masterdata/import/management-import-product/management-import-product.component';
import { ManagementImportStampsComponent } from './masterdata/import/management-import-stamps/management-import-stamps.component';
import { ManagementImportStorageComponent } from './masterdata/import/management-import-storage/management-import-storage.component';
import { ManagementImportStoreComponent } from './masterdata/import/management-import-store/management-import-store.component';
import { ManagementImportStoreareaComponent } from './masterdata/import/management-import-storearea/management-import-storearea.component';
import { ManagementImportStorecapacityComponent } from './masterdata/import/management-import-storecapacity/management-import-storecapacity.component';
import { ManagementImportStoregroupComponent } from './masterdata/import/management-import-storegroup/management-import-storegroup.component';
import { ManagementImportStorepaymentComponent } from './masterdata/import/management-import-storepayment/management-import-storepayment.component';
import { ManagementImportTaxComponent } from './masterdata/import/management-import-tax/management-import-tax.component';
import { ManagementImportUomComponent } from './masterdata/import/management-import-uom/management-import-uom.component';
import { ManagementImportUserComponent } from './masterdata/import/management-import-user/management-import-user.component';
import { ManagementImportUserstoreComponent } from './masterdata/import/management-import-userstore/management-import-userstore.component';
import { ManagementImportWarehouseComponent } from './masterdata/import/management-import-warehouse/management-import-warehouse.component';
import { ManagementItemUomComponent } from './masterdata/item-uom/management-item-uom/management-item-uom.component';
import { ManagementItemEditComponent } from './masterdata/item/management-item-edit/management-item-edit.component';
import { ManagementItemListComponent } from './masterdata/item/management-item-list/management-item-list.component';
import { ManangementItemCheckMasterDataComponent } from './masterdata/item/manangement-item-check-master-data/manangement-item-check-master-data.component';
import { ManagementMasterdataItemgroupComponent } from './masterdata/itemgroup/management-masterdata-itemgroup/management-masterdata-itemgroup.component';
import { ManagementItemstorageComponent } from './masterdata/itemstorage/management-itemstorage/management-itemstorage.component';
import { ManagementMerchandiseEditComponent } from './masterdata/merchandise/management-merchandise-edit/management-merchandise-edit.component';
import { ManagementMerchandiseComponent } from './masterdata/merchandise/management-merchandise/management-merchandise.component';
// import { ManagementItemUploadEditComponent } from './masterdata/item/management-item-upload-edit/management-item-upload-edit.component';
// import { ManagementItemUploadComponent } from './masterdata/item/management-item-upload/management-item-upload.component';
import { ManagementPaymentListComponent } from './masterdata/payment/management-payment-list/management-payment-list.component';
import { ManagementPrepaidComponent } from './masterdata/prepaidcard/management-prepaid/management-prepaid.component';
import { ManagementPriceListNameMappingComponent } from './masterdata/pricelist/management-price-list-name-mapping/management-price-list-name-mapping.component';
import { ManagementPriceListComponent } from './masterdata/pricelist/management-price-list/management-price-list.component';
import { ManagementPriotyPriceListComponent } from './masterdata/priotyPricelist/management-prioty-price-list/management-prioty-price-list.component';
import { ManagementReasonListComponent } from './masterdata/reason/management-reason-list/management-reason-list.component';
import { ManagementMasterdataStorageComponent } from './masterdata/storage/management-masterdata-storage/management-masterdata-storage.component';
import { ManagementStoreListComponent } from './masterdata/store/management-store-list/management-store-list.component';
import { ManagementStorePaymentSettingComponent } from './masterdata/store/management-store-payment-setting/management-store-payment-setting.component';
import { ManagementMasterdataStoreareaComponent } from './masterdata/storearea/management-masterdata-storearea/management-masterdata-storearea.component';
import { ManagementStoregroupListComponent } from './masterdata/storegroup/management-storegroup-list/management-storegroup-list.component';
import { ManagementMasterdataTaxComponent } from './masterdata/tax/management-masterdata-tax/management-masterdata-tax.component';
import { ManagementTimeframeComponent } from './masterdata/timeframe/management-timeframe/management-timeframe.component';
import { ManagementMasterdataUomComponent } from './masterdata/uom/management-masterdata-uom/management-masterdata-uom.component';
import { ManagementWarehouseListComponent } from './masterdata/warehouse/management-warehouse-list/management-warehouse-list.component';
import { ManagementPromotionEditComponent } from './promotion/management-promotion-edit/management-promotion-edit.component';
import { ManagementPromotionImportComponent } from './promotion/management-promotion-import/management-promotion-import.component';
import { ManagementPromotionListComponent } from './promotion/management-promotion-list/management-promotion-list.component';
import { ManagementPromotionSchemaSetupComponent } from './promotion/management-promotion-schema-setup/management-promotion-schema-setup.component';
import { ManagementPromotionSchemaComponent } from './promotion/management-promotion-schema/management-promotion-schema.component';
import { ManagementPromotionSetupComponent } from './promotion/management-promotion-setup/management-promotion-setup.component';
import { ManagementReportListComponent } from './report/management-report-list/management-report-list.component';
import { RptGiftVoucherComponent } from './report/rpt-gift-voucher/rpt-gift-voucher.component';
import { RptInventoryauditComponent } from './report/rpt-inventoryaudit/rpt-inventoryaudit.component';
import { RptInventoryonhandComponent } from './report/rpt-inventoryonhand/rpt-inventoryonhand.component';
import { RptInvoiceTransactionPaymentComponent } from './report/rpt-invoice-transaction-payment/rpt-invoice-transaction-payment.component';
import { RptPOSPromoComponent } from './report/rpt-POS-promo/rpt-POS-promo.component';
import { RptPosPromotionNewComponent } from './report/rpt-pos-promotion-new/rpt-pos-promotion-new.component';
import { RptSalesByHourComponent } from './report/rpt-sales-by-hour/rpt-sales-by-hour.component';
import { RptSalesByYearComponent } from './report/rpt-sales-by-year/rpt-sales-by-year.component';
import { RptSalesTransactionPaymentComponent } from './report/rpt-sales-transaction-payment/rpt-sales-transaction-payment.component';
import { Rpt_inventory_postingComponent } from './report/rpt_inventory_posting/rpt_inventory_posting.component';
import { Rpt_invoicetransactiondetailComponent } from './report/rpt_invoicetransactiondetail/rpt_invoicetransactiondetail.component';
import { Rpt_invoicetransactionsummaryComponent } from './report/rpt_invoicetransactionsummary/rpt_invoicetransactionsummary.component';
import { Rpt_salesBySalesPersonComponent } from './report/rpt_sales-by-sales-person/rpt_sales-by-sales-person.component';
import { Rpt_salesstoresummaryComponent } from './report/rpt_salesstoresummary/rpt_salesstoresummary.component';
import { Rpt_salestransactiondetailComponent } from './report/rpt_salestransactiondetail/rpt_salestransactiondetail.component';
import { Rpt_salestransactionsummaryComponent } from './report/rpt_salestransactionsummary/rpt_salestransactionsummary.component';
import { ManagementGeneralSettingListComponent } from './setting/general/management-general-setting-list/management-general-setting-list.component';
import { ManagementStoreCurrencyEditComponent } from './setting/store-currency/management-store-currency-edit/management-store-currency-edit.component';
import { ManagementStoreCurrencySettingComponent } from './setting/store-currency/management-store-currency-setting/management-store-currency-setting.component';
import { ManagementSettingMenuComponent } from './setting/ui/management-setting-menu/management-setting-menu.component';
import { ManagementShortcutComponent } from './shortcut/management-shortcut/management-shortcut.component';
import { ManagementCategorySettingComponent } from './system/appsetting/management-category-setting/management-category-setting.component';
import { ManagementVoidreturnSettingComponent } from './system/appsetting/management-voidreturn-setting/management-voidreturn-setting.component';
import { ManagementBarcodeSetupListComponent } from './system/barcode/management-barcode-setup-list/management-barcode-setup-list.component';
import { ManagementStoreClientComponent } from './system/client/management-store-client/management-store-client.component';
import { ManagementFunctionComponent } from './system/function/management-function/management-function.component';
import { ManagementPermissionComponent } from './system/permission/management-permission/management-permission.component';
import { ManagementSettingRoleEditComponent } from './system/role-setting/management-setting-role-edit/management-setting-role-edit.component';
import { ManagementSettingRoleListComponent } from './system/role-setting/management-setting-role-list/management-setting-role-list.component';
import { ManagementRoleEditComponent } from './system/role/management-role-edit/management-role-edit.component';
import { ManagementRoleComponent } from './system/role/management-role/management-role.component';
import { ManangementCurrencyRoundingoffComponent } from './system/roundingoff/manangement-currency-roundingoff/manangement-currency-roundingoff.component';
import { ManagementTodolistEditComponent } from './todolist/management-todolist-edit/management-todolist-edit.component';
import { ManagementTodolistComponent } from './todolist/management-todolist/management-todolist.component';
import { ManagementTransactionGoodissueEditComponent } from './transaction/goodissue/management-transaction-goodissue-edit/management-transaction-goodissue-edit.component';
import { ManagementGoodIssuePrintComponent } from './transaction/goodissue/management-transaction-goodissue-print/management-transaction-goodissue-print.component';
import { ManagementTransactionGoodissueComponent } from './transaction/goodissue/management-transaction-goodissue/management-transaction-goodissue.component';
import { ManagementTransactionGoodreceiptEditComponent } from './transaction/goodreceipt/management-transaction-goodreceipt-edit/management-transaction-goodreceipt-edit.component';
import { ManagementGoodReceiptPrintComponent } from './transaction/goodreceipt/management-transaction-goodreceipt-print/management-transaction-goodreceipt-print.component';
import { ManagementTransactionGoodreceiptComponent } from './transaction/goodreceipt/management-transaction-goodreceipt/management-transaction-goodreceipt.component';
import { ManagementGoodsReturnDetailComponent } from './transaction/goodsreturn/management-goodsreturn-detail/management-goodsreturn-detail.component';
import { ManagementGoodsReturnListComponent } from './transaction/goodsreturn/management-goodsreturn-list/management-goodsreturn-list.component';
import { ManagementGoodsReturnPrintComponent } from './transaction/goodsreturn/management-goodsreturn-print/management-goodsreturn-print.component';
import { ManagementGrpoDetailComponent } from './transaction/grpo/management-grpo-detail/management-grpo-detail.component';
import { ManagementGrpoListComponent } from './transaction/grpo/management-grpo-list/management-grpo-list.component';
import { ManagementGRPOPrintComponent } from './transaction/grpo/management-grpo-print/management-grpo-print.component';
import { ManagementImportGoodsReceiptComponent } from './transaction/import/management-import-goods-receipt/management-import-goods-receipt.component';
import { ManagementImportSalesOrderComponent } from './transaction/import/management-import-sales-order/management-import-sales-order.component';
import { ManagementInventoryCoutingEditComponent } from './transaction/imventorycouting/management-inventory-couting-edit/management-inventory-couting-edit.component';
import { ManagementInventoryCoutingPrintComponent } from './transaction/imventorycouting/management-inventory-couting-print/management-inventory-couting-print.component';
import { ManagementInventoryCoutingComponent } from './transaction/imventorycouting/management-inventory-couting/management-inventory-couting.component';
import { ManagementInventoryPostingEditComponent } from './transaction/inventoryposting/management-inventory-posting-edit/management-inventory-posting-edit.component';
import { ManagementInventoryPostingPrintComponent } from './transaction/inventoryposting/management-inventory-posting-print/management-inventory-posting-print.component';
import { ManagementInventoryPostingComponent } from './transaction/inventoryposting/management-inventory-posting/management-inventory-posting.component';
import { ManagementShiftDetailComponent } from './transaction/management-shift-detail/management-shift-detail.component';
import { ManagementShiftListComponent } from './transaction/management-shift-list/management-shift-list.component';
import { ManagementPrintGrpoComponent } from './transaction/print/management-print-grpo/management-print-grpo.component';
import { ManagementPrintPoComponent } from './transaction/print/management-print-po/management-print-po.component';
import { ManagementPrintTransferInComponent } from './transaction/print/management-print-transfer-in/management-print-transfer-in.component';
import { ManagementPrintTransferOutComponent } from './transaction/print/management-print-transfer-out/management-print-transfer-out.component';
import { ManagementGrpoPoComponent } from './transaction/purchase/management-grpo-po/management-grpo-po.component';
import { ManagementPurchaseDetailComponent } from './transaction/purchase/management-purchase-detail/management-purchase-detail.component';
import { ManagementPurchaseListComponent } from './transaction/purchase/management-purchase-list/management-purchase-list.component';
import { ManagementPurchaseOrderPrintComponent } from './transaction/purchase/management-purchase-order-print/management-purchase-order-print.component';
import { ManagementGoodsReturnComponent } from './transaction/purchaserequest/management-goodsreturn/management-goodsreturn.component';
import { ManagementPurchaseRequestPrintComponent } from './transaction/purchaserequest/management-purchase-request-print/management-purchase-request-print.component';
import { ManagementPurchaseRequestDetailComponent } from './transaction/purchaserequest/management-purchaserequest-detail/management-purchaserequest-detail.component';
import { ManagementPurchaseRequestListComponent } from './transaction/purchaserequest/management-purchaserequest-list/management-purchaserequest-list.component';
import { ManagementSummaryEndShiftComponent } from './transaction/shift/management-summary-end-shift/management-summary-end-shift.component';
import { ManagementPrintShiftComponent } from './transaction/shift/ManagementPrintShift/ManagementPrintShift.component';
import { ManagementInvtranfeReceiptPrintComponent } from './transaction/transfer/management-invstranfer-receipt-print/management-invstranfer-receipt-print.component';
import { ManagementInvtranfeShipmentPrintComponent } from './transaction/transfer/management-invstranfer-shipment-print/management-invstranfer-shipment-print.component';
import { ManagementInvstransferReceiptComponent } from './transaction/transfer/management-invstransfer-receipt/management-invstransfer-receipt.component';
import { ManagementInvtransferEditComponent } from './transaction/transfer/management-invtransfer-edit/management-invtransfer-edit.component';
import { ManagementInvtransferReceiptEditComponent } from './transaction/transfer/management-invtransfer-receipt-edit/management-invtransfer-receipt-edit.component';
import { ManagementInvtransferComponent } from './transaction/transfer/management-invtransfer/management-invtransfer.component';
import { ManagementUserListComponent } from './user/management-user-list/management-user-list.component';
import { ManagementUserRoleComponent } from './user/management-user-role/management-user-role.component';
import { ManagementInventoryTransferComponent } from './transaction/grpo/inventorytransfer/management-inventory-transfer/management-inventory-transfer.component';
import { ManagementInventoryTransferEditComponent } from './transaction/grpo/inventorytransfer/management-inventory-transfer-edit/management-inventory-transfer-edit.component';
import { ManagementInventoryTransferPrintComponent } from './transaction/grpo/inventorytransfer/management-inventory-transfer-print/management-inventory-transfer-print.component';
import { ManagementStoreWhsSettingComponent } from './masterdata/store/management-store-whs-setting/management-store-whs-setting.component';
import { ManagementInvtransferShipmentComponent } from './transaction/transfer/management-invtransfer-shipment/management-invtransfer-shipment.component';
import { ManagementInvtransferShipmentEditComponent } from './transaction/transfer/management-invtransfer-shipment-edit/management-invtransfer-shipment-edit.component';
import { ShopCounterInputComponent } from '../shop/shop-counter-input/shop-counter-input.component';
import { RptInventorySerialComponent } from './report/rpt-inventory-serial/rpt-inventory-serial.component';
import { ManagementPickupAmountListComponent } from './pickup-amount/management-pickup-amount-list/management-pickup-amount-list.component';
import { ManagementPickupAmountComponent } from './pickup-amount/management-pickup-amount/management-pickup-amount.component';
import { ManagementLoyaltyPointConvertComponent } from './setting/LoyaltyPointConvert/LoyaltyPointConvert.component';
import { ManagementItemSerialListComponent } from './masterdata/item-serial/management-item-serial-list/management-item-serial-list.component';
import { ManagementReleaseListComponent } from './todolist/management-release-list/management-release-list.component';
import { Rpt_salesByItemComponent } from './report/rpt_sales-by-item/rpt_sales-by-item.component';
import { ManagementBankinListComponent } from './bankin/management-bankin-list/management-bankin-list.component';
import { ManagementBankinEditComponent } from './bankin/management-bankin-edit/management-bankin-edit.component';
import { Rpt_SalesEPAYDetailComponent } from './report/rpt_SalesEPAYDetail/rpt_SalesEPAYDetail.component';
import { Rpt_customer_pointComponent } from './report/rpt_customer_point/rpt_customer_point.component';
import { RptVoucherCheckinComponent } from './report/rpt-voucher-checkin/rpt-voucher-checkin.component';
import { RptLogComponent } from './report/rpt-log/rpt-log.component';
import { ManagementChangelogComponent } from './system/changelog/management-changelog/management-changelog.component';
import { ReleaseNoteListResolver } from '../_resolve/change-logs.resolver';
import { ManagementChangelogListComponent } from './system/changelog/management-changelog-list/management-changelog-list.component';
import { ManagementVersionListComponent } from './system/version/management-version-list/management-version-list.component';
import { ManagementImportLicensePlateComponent } from './masterdata/import/management-import-LicensePlate/management-import-LicensePlate.component';
import { RptActionOnOrderComponent } from './report/rpt-action-on-order/rpt-action-on-order.component';
import { ManagementSalesPlanComponent } from './sales-plan/management-sales-plan/management-sales-plan.component';
import { RptSyncItemComponent } from './report/rpt-sync-item/rpt-sync-item.component';
import { RptSyncPriceComponent } from './report/rpt-sync-price/rpt-sync-price.component';
import { ManagementPickupPrintComponent } from './pickup-amount/management-pickup-print/management-pickup-print.component';
import { RptStoreListingComponent } from './report/rpt-store-listing/rpt-store-listing.component';

import { Rpt_sync_promoComponent } from './report/rpt_sync_promo/rpt_sync_promo.component';

import { Rpt_salestransactiondetail_returnComponent } from './report/rpt_salestransactiondetail_return/rpt_salestransactiondetail_return.component';
import { Rpt_salestransactiondetail_exComponent } from './report/rpt_salestransactiondetail_ex/rpt_salestransactiondetail_ex.component';
import { Rpt_clearremoveitemComponent } from './report/rpt_clearremoveitem/rpt_clearremoveitem.component';
import { ManagementEmployeeSalaryComponent } from './masterdata/employee/salary/management-employee-salary/management-employee-salary.component';
import { ManagementTargetSummaryComponent } from './target-summary/management-target-summary/management-target-summary.component';
import { ManagementSalesPlanEditNewComponent } from './sales-plan/management-sales-plan-edit-new/management-sales-plan-edit-new.component';
 
import { ManagementTransferRequestComponent } from './transaction/transfer/management-invtransfer-request/management-transfer-request.component';
import { ManagementLicensePlateComponent } from './masterdata/licensePlate/management-licensePlate/management-licensePlate.component';
import { ManagementInvtransferRequestEditComponent } from './transaction/transfer/management-invtransfer-request-edit/management-invtransfer-request-edit.component';
import { ManagementInvstranferRequestPrintComponent } from './transaction/transfer/management-invstranfer-request-print/management-invstranfer-request-print.component';
import { ManagementLicensePlateViewComponent } from './masterdata/licensePlate/management-licensePlate-view/management-licensePlate-view.component';
import { ManagementLicensePlateAddComponent } from './masterdata/licensePlate/management-licensePlate-add/management-licensePlate-add.component';
import { Rpt_dashboard_saletransactiondetailsComponent } from './report/dashboard/rpt_dashboard_saletransactiondetails/rpt_dashboard_saletransactiondetails.component';
import { TestUomComponent } from './test/test-uom/test-uom.component';
import { DemoUomComponent } from './report/test2/demo-uom/demo-uom.component';
import { DmUomComponent } from './report/test-uom/dm-uom/dm-uom.component';
import { DmUomEditComponent } from './report/test-uom/dm-uom-edit/dm-uom-edit.component';
import { DashboardTestComponent } from './report/dashboard-test/dashboard-test/dashboard-test.component';
import { TestDashboardComponent } from './report/dashboardtest/test-dashboard/test-dashboard.component';
import { TestDashboard2Component } from './report/dashboard-test2/test-dashboard2/test-dashboard2.component';
import { TableInfoComponent } from './masterdata/tableinfo/table-info/table-info.component';
import { PlaceInforComponent } from './masterdata/place-infor/place-infor.component';
import { TableplaceComponent } from './masterdata/tableplace/tableplace/tableplace.component';
import { ManagementTableDesignComponent } from './fNbtable/Management-table-design/Management-table-design.component';
import { ManagementInvtranfePrintComponent } from './transaction/transfer/management-invstranfer-print/management-invstranfer-print.component'; 
import { TablePlaceResolver } from '../_resolve/tableplace.resolver';
import { ManagementTableCashierComponent } from './fNbtable/Management-table-cashier/Management-table-cashier.component';
import { ManagementPrintDesignComponent } from './print-design/management-print-design/management-print-design.component';
import { RPT_SalesTransDetailSummaryByDepartmentComponent } from './report/RPT_SalesTransDetailSummaryByDepartment/RPT_SalesTransDetailSummaryByDepartment.component';
import { ManagementPeripheralsListComponent } from './setting/peripherals/management-peripherals-list/management-peripherals-list.component';
import { ManagementTerminalPeripheralsListComponent } from './setting/peripherals/management-terminal-peripherals-list/management-terminal-peripherals-list.component';
import { ManagementTransactionDeliveryComponent } from './transaction/delivery/management-transaction-delivery/management-transaction-delivery.component';
import { ManagementTransactionDeliveryEditComponent } from './transaction/delivery/management-transaction-delivery-edit/management-transaction-delivery-edit.component';
import { ManagementTransactionDeliveryPrintComponent } from './transaction/delivery/management-transaction-delivery-print/management-transaction-delivery-print.component';
import { ManagementTransactionDeliveryReturnComponent } from './transaction/deliveryReturn/management-transaction-deliveryReturn/management-transaction-deliveryReturn.component';
import { ManagementTransactionDeliveryReturnEditComponent } from './transaction/deliveryReturn/management-transaction-deliveryReturn-edit/management-transaction-deliveryReturn-edit.component';
import { ManagementTransactionDeliveryReturnPrintComponent } from './transaction/deliveryReturn/management-transaction-deliveryReturn-print/management-transaction-deliveryReturn-print.component';
 
import { ManagementItemStoreListingComponent } from './masterdata/item/management-item-store-listing/management-item-store-listing.component';
 
import { ManagementReceiptFromProductionListComponent } from './transaction/receiptFromProduction/management-receiptFromProduction-list/management-receiptFromProduction-list.component';
import { ManagementProductionOrderListComponent } from './transaction/ProductionOrder/management-production-order-list/management-production-order-list.component';
import { ManagementProductionOrderEditComponent } from './transaction/ProductionOrder/management-production-order-edit/management-production-order-edit.component';
import { ManagementProductionOrderPrintComponent } from './transaction/ProductionOrder/management-production-order-print/management-production-order-print.component';
import { ManagementReceiptFromProductionPrintComponent } from './transaction/receiptFromProduction/management-receiptFromProduction-print/management-receiptFromProduction-print.component';
import { ManagementReceiptFromProductionEditComponent } from './transaction/receiptFromProduction/management-receiptFromProduction-edit/management-receiptFromProduction-edit.component';
import { ManagementSaleschannelComponent } from './masterdata/saleschannel/management-saleschannel/management-saleschannel.component';
import { ManagementSaleschannelEditComponent } from './masterdata/saleschannel/management-saleschannel-edit/management-saleschannel-edit.component';
import { ManagementDivisionCreateComponent } from './report/division/management-division-create/management-division-create.component';
import { ManagementDivisionEditComponent } from './report/division/management-division-edit/management-division-edit.component';
import { ManagementShipDivisionListComponent } from './report/division/ship/management-ship-division-list/management-ship-division-list.component';
import { ManagementShipDivisionDetailComponent } from './report/division/ship/management-ship-division-detail/management-ship-division-detail.component';
import { ManagementDivisionListComponent } from './report/division/management-division-list/management-division-list.component';
import { ManagementShippingListComponent } from './masterdata/shipping/management-shipping-list/management-shipping-list.component';
import { CollectionDailyByCounterComponent } from './report/collection-daily-by-counter/collection-daily-by-counter.component';
import { ManagementDisallowanceListComponent } from './disallowance/management-disallowance-list/management-disallowance-list.component';
import { ManagementVariantListComponent } from './variant/management-variant-list/management-variant-list.component';
import { ManagementVariantSetupComponent } from './variant/management-variant-setup/management-variant-setup.component';
import { RPT_SyncDataStatusViewComponent } from './report/RPT_SyncDataStatusView/RPT_SyncDataStatusView.component';
import { SettingPrintComponent } from './masterdata/settingPrint/settingPrint.component';

 
 
 
// import { TestComponent } from './test/test.component';

const routes: Routes = [{
  path: '', component: ManagementComponent,
  canActivate: [AuthGuard], runGuardsAndResolvers: 'always',
  children: [
    { path: 'roles', component: ManagementRoleComponent, resolve: { items: RoleListResolver } },
    { path: 'general-setting', component: ManagementGeneralSettingListComponent },
    { path: 'loyaltypointconvert-setting', component: ManagementLoyaltyPointConvertComponent },
    { path: 'setting-menu', component: ManagementSettingMenuComponent },
    { path: 'setting-roles', component: ManagementSettingRoleListComponent, resolve: { items: RoleListResolver } },
    { path: 'setting-roles/:id', component: ManagementSettingRoleEditComponent, resolve: { items: SettingRoleEditResolver } },
    { path: 'functions', component: ManagementFunctionComponent, resolve: { functions: FunctionListResolver } },
    { path: 'permissions', component: ManagementPermissionComponent, resolve: { permissions: PermissionListResolver } },
    { path: 'promotion', component: ManagementPromotionListComponent },
    { path: 'promotion/setup', component: ManagementPromotionSetupComponent },
    { path: 'promotion/import', component: ManagementPromotionImportComponent },
    { path: 'promotion/:m/:promotionId', component: ManagementPromotionSetupComponent },
    // { path: 'promotion/edit/:promotionId', component: ManagementPromotionEditComponent },
    { path: 'promotion-schema', component: ManagementPromotionSchemaComponent },
    { path: 'promotion-schema/setup', component: ManagementPromotionSchemaSetupComponent },
    { path: 'promotion-schema/setup/:id', component: ManagementPromotionSchemaSetupComponent },
    //User infor
    { path: 'user-infor', component: ManagementUserInforComponent },
    //Transaction
    { path: 'shift', component: ManagementShiftListComponent },
    { path: 'shift/summary/:id', component: ManagementSummaryEndShiftComponent },
    { path: 'shift/print/:id', component: ManagementPrintShiftComponent },
    { path: 'shift/:id', component: ManagementShiftDetailComponent },

    { path: 'goodreceipt', component: ManagementTransactionGoodreceiptComponent },
    { path: 'goodreceipt/i', component: ManagementTransactionGoodreceiptEditComponent },
    { path: 'goodreceipt/:m/:id', component: ManagementTransactionGoodreceiptEditComponent },
    { path: 'goodsreceipt/print/:id', component: ManagementGoodReceiptPrintComponent },

    { path: 'goodissue', component: ManagementTransactionGoodissueComponent },
    { path: 'goodissue/i', component: ManagementTransactionGoodissueEditComponent },
    { path: 'goodissue/:m/:id', component: ManagementTransactionGoodissueEditComponent },
    { path: 'goodsissue/print/:id', component: ManagementGoodIssuePrintComponent },

    { path: 'inventory/transfer', component: ManagementInvtransferComponent },
    { path: 'inventory/transfer/i', component: ManagementInvtransferEditComponent },
    { path: 'inventory/transfer/:m/:id', component: ManagementInvtransferEditComponent },
    { path: 'print/transfer/:id', component: ManagementPrintTransferOutComponent },

    { path: 'inventory/transfer-receipt', component: ManagementInvstransferReceiptComponent },
    { path: 'inventory/transfer-receipt/i', component: ManagementInvtransferReceiptEditComponent },
    { path: 'inventory/transfer-receipt/:m/:id', component: ManagementInvtransferReceiptEditComponent },
    { path: 'print/transfer-receipt/:id', component: ManagementPrintTransferInComponent },

    { path: 'inventory/transfer-shipment', component: ManagementInvtransferShipmentComponent },
    { path: 'inventory/transfer-shipment/i', component: ManagementInvtransferShipmentEditComponent },
    { path: 'inventory/transfer-shipment/:m/:id', component: ManagementInvtransferShipmentEditComponent },
    { path: 'print/transfer-shipment/:id', component: ManagementPrintTransferOutComponent },

    { path: 'inventory/transfer-request', component: ManagementTransferRequestComponent },
    { path: 'inventory/transfer-request/i', component: ManagementInvtransferRequestEditComponent },
    { path: 'inventory/transfer-request/:m/:id', component: ManagementInvtransferRequestEditComponent },
    { path: 'print/transfer-request/:id', component: ManagementPrintTransferOutComponent },

    { path: 'invstransfer/receipt/print/:id', component: ManagementInvtranfeReceiptPrintComponent },
    { path: 'invstransfer/shipment/print/:id', component: ManagementInvtranfeShipmentPrintComponent },
    { path: 'invstransfer/request/print/:id', component: ManagementInvstranferRequestPrintComponent },
    { path: 'invstransfer/transfer/print/:id', component: ManagementInvtranfePrintComponent },
    { path: 'grpo/print/:id', component: ManagementGRPOPrintComponent },
    { path: 'purchaseorder/print/:id', component: ManagementPurchaseOrderPrintComponent },
    { path: 'purchaserequest/print/:id', component: ManagementPurchaseRequestPrintComponent },

    { path: 'inventory/counting', component: ManagementInventoryCoutingComponent },
    { path: 'inventory/counting/i', component: ManagementInventoryCoutingEditComponent },
    { path: 'inventory/counting/:m/:id', component: ManagementInventoryCoutingEditComponent },
    { path: 'inventorycouting/print/:id', component: ManagementInventoryCoutingPrintComponent },


    { path: 'inventory/posting', component: ManagementInventoryPostingComponent },
    { path: 'inventory/posting/i', component: ManagementInventoryPostingEditComponent },
    { path: 'inventory/posting/:m/:id', component: ManagementInventoryPostingEditComponent },
    { path: 'inventoryposting/print/:id', component: ManagementInventoryPostingPrintComponent },

    // { path: 'inventory/inventorytransfer', component: ManagementInventoryTransferComponent },
    // { path: 'inventory/inventorytransfer/i', component: ManagementInventoryTransferEditComponent },
    // { path: 'inventory/inventorytransfer/:m/:id', component: ManagementInventoryTransferEditComponent },
    // { path: 'inventorytransfer/print/:id', component: ManagementInventoryTransferPrintComponent },

    { path: 'purchase', component: ManagementPurchaseListComponent },
    { path: 'purchasegpfo/:isfilter', component: ManagementPurchaseListComponent },
    { path: 'purchase/new', component: ManagementPurchaseDetailComponent },
    { path: 'purchase/:m/:id', component: ManagementPurchaseDetailComponent },
    { path: 'purchase/grpo/:id/:companycode/:storeid', component: ManagementGrpoPoComponent, resolve: { purchase: PurchaseDetailResolver } },
    { path: 'print/purchase/:id', component: ManagementPrintPoComponent },

    { path: 'purchaserequest', component: ManagementPurchaseRequestListComponent },
    { path: 'purchaserequest/new', component: ManagementPurchaseRequestDetailComponent},
    { path: 'purchaserequest/:m/:id', component: ManagementPurchaseRequestDetailComponent},
    { path: 'purchaseRequest/goodsreturn/:id/:companycode/:storeid', component: ManagementGoodsReturnComponent , resolve: {purchase: PurchaseRequestDetailResolver}},
    { path: 'print/purchaserequest/:id', component: ManagementPrintPoComponent },

     //delivery
     { path: 'delivery', component: ManagementTransactionDeliveryComponent },
     { path: 'delivery/:m/:id', component: ManagementTransactionDeliveryEditComponent },
    { path: 'deliveri/print/:id', component: ManagementTransactionDeliveryPrintComponent },
    //deliveryReturn
    { path: 'deliveryReturn', component: ManagementTransactionDeliveryReturnComponent },
    { path: 'deliveryReturn/:m/:id', component: ManagementTransactionDeliveryReturnEditComponent },
    { path: 'deliveriReturn/print/:id', component: ManagementTransactionDeliveryReturnPrintComponent },
    { path: 'masterdata/item-store-listing', component: ManagementItemStoreListingComponent },

    // receipt From Production
    { path: 'receiptFromProduction', component: ManagementReceiptFromProductionListComponent },
    { path: 'receiptFromProduction/:m/:id', component: ManagementReceiptFromProductionEditComponent },
    { path: 'receiptfromProduction/print/:id', component: ManagementReceiptFromProductionPrintComponent },

    //production Order
    { path: 'productionOrder', component: ManagementProductionOrderListComponent },
    { path: 'productionOrder/:m/:id', component: ManagementProductionOrderEditComponent },
    { path: 'productionorder/print/:id', component: ManagementProductionOrderPrintComponent },

    //division
    { path: 'division-list', component: ManagementDivisionListComponent }, 
    { path: 'division/create', component: ManagementDivisionCreateComponent },
    { path: 'division/edit/:id', component: ManagementDivisionEditComponent },

    { path: 'ship-division/list', component: ManagementShipDivisionListComponent }, 
    { path: 'ship-division/:m/:id', component: ManagementShipDivisionDetailComponent },
    


    { path: 'grpo', component: ManagementGrpoListComponent },
    { path: 'grpo/new', component: ManagementGrpoDetailComponent },
    { path: 'grpo/:m/:id/:companycode/:storeid', component: ManagementGrpoDetailComponent },
    // , resolve: {grpo: GRPODetailResolver}
    { path: 'print/grpo/:id', component: ManagementPrintGrpoComponent },

    { path: 'goodsreturn', component: ManagementGoodsReturnListComponent },
    { path: 'goodsreturn/new', component: ManagementGoodsReturnDetailComponent },
     { path: 'goodsreturn/:m/:id/:companycode/:storeid', component: ManagementGoodsReturnDetailComponent},
    { path: 'print/goodsreturn/:id', component: ManagementGoodsReturnPrintComponent },
    //Report
    { path: 'report', component: ManagementReportListComponent },
    { path: 'report/log-history', component: RptLogComponent},
    { path: 'report/sales-epay-detail', component: Rpt_SalesEPAYDetailComponent },
    { path: 'report/inventory-audit', component: RptInventoryauditComponent },
    { path: 'report/inventory-onhand', component: RptInventoryonhandComponent },
    { path: 'report/inventory-posting', component: Rpt_inventory_postingComponent },
    { path: 'report/sales-store-summary', component: Rpt_salesstoresummaryComponent },
    { path: 'report/sales-transaction-detail', component: Rpt_salestransactiondetailComponent },
    { path: 'report/dashboard-sales-transaction-detail', component: Rpt_dashboard_saletransactiondetailsComponent },
    { path: 'report/sync-data-status-view', component: RPT_SyncDataStatusViewComponent },

    { path: 'report/sales-transaction-detail-exchange', component: Rpt_salestransactiondetail_exComponent },
    { path: 'report/sales-transaction-detail-return', component: Rpt_salestransactiondetail_returnComponent },
    { path: 'report/clear-remove-item', component: Rpt_clearremoveitemComponent },
    { path: 'report/sales-transaction-summary', component: Rpt_salestransactionsummaryComponent },
    { path: 'report/sales-by-sales-person', component: Rpt_salesBySalesPersonComponent },
    { path: 'report/sales-by-hour', component: RptSalesByHourComponent },
    { path: 'report/sales-by-year', component: RptSalesByYearComponent },
    { path: 'report/sales-transaction-payment', component: RptSalesTransactionPaymentComponent },
    { path: 'report/pos-promotion', component: RptPOSPromoComponent },
    { path: 'report/pos-promotion-2', component: RptPosPromotionNewComponent },
    { path: 'report/gift-voucher', component: RptGiftVoucherComponent }, 
    { path: 'report/inventory-serial', component: RptInventorySerialComponent },
    { path: 'report/sales-by-item', component: Rpt_salesByItemComponent },
    { path: 'report/customer-point', component: Rpt_customer_pointComponent },
    { path: 'report/voucher-checkin', component: RptVoucherCheckinComponent },
    { path: 'report/invoice-transaction-payment', component: RptInvoiceTransactionPaymentComponent },
    { path: 'report/invoice-transaction-detail', component: Rpt_invoicetransactiondetailComponent },
    { path: 'report/invoice-transaction-summary', component: Rpt_invoicetransactionsummaryComponent },
    { path: 'report/action-rpt', component: RptActionOnOrderComponent },
    { path: 'report/sync-item', component: RptSyncItemComponent },
    { path: 'report/sync-price', component: RptSyncPriceComponent },
    { path: 'report/sync-store-listing', component: RptStoreListingComponent },
    { path: 'report/sync-promotion', component: Rpt_sync_promoComponent },


    { path: 'setting/void-returnorder', component: ManagementVoidreturnSettingComponent },
    { path: 'setting/merchandise', component: ManagementCategorySettingComponent },
    { path: 'setting/barcode', component: ManagementBarcodeSetupListComponent },
    { path: 'setting/pricelist', component: ManagementPriotyPriceListComponent },
    { path: 'setting/rounding-off', component: ManangementCurrencyRoundingoffComponent },
    { path: 'setting/changelog', component: ManagementChangelogListComponent },
 

    { path: 'shortcut', component: ManagementShortcutComponent},
    { path: 'changelog', component: ManagementChangelogComponent , resolve: { logs: ReleaseNoteListResolver } },
    { path: 'table-design/:storeid/:placeid', component: ManagementTableDesignComponent , resolve: { tables: TablePlaceResolver }},
    { path: 'table-cashier/:storeid/:placeid', component: ManagementTableCashierComponent},
    


//test
{ path: 'report/test1', component: TestUomComponent },
{ path: 'report/test2', component: DemoUomComponent },
{ path: 'report/test', component: DmUomComponent },
{ path: 'report/test4', component: DmUomEditComponent },
{ path: 'report/dashboard-test-sales-transaction-detail', component: DashboardTestComponent },
{ path: 'report/sales-transaction-detail-sumary-by-department', component: RPT_SalesTransDetailSummaryByDepartmentComponent },

{ path: 'report/dashboardTest', component: TestDashboardComponent },
{ path: 'report/dashboardTest2', component: TestDashboard2Component },
{ path: 'design/print-template', component: ManagementPrintDesignComponent},


{ path: 'report/collection-daily-by-counter', component: CollectionDailyByCounterComponent},

// { path: 'report/tableinfor', component: TableInfoComponent },
// { path: 'report/placeinfor', component: PlaceInforComponent },









    
    // { path: 'version-detail', component: ManagementReleaseListComponent},
    //MasterData

    // { path: 'roles/:id', component: ManagementRoleEditComponent, resolve: {role: RoleEditResolver}, canDeactivate: [PreventUnsavedChanges]},

    // , resolve: { items: ItemListResolver } 
    { path: 'masterdata/item', component: ManagementItemListComponent},
    { path: 'masterdata/item-serial', component: ManagementItemSerialListComponent},
    { path: 'masterdata/item-variant-list', component: ManagementVariantListComponent},
    { path: 'masterdata/item-variant-setup/:m/:id', component: ManagementVariantSetupComponent},
    { path: 'masterdata/item-variant-setup/i', component: ManagementVariantSetupComponent},


    // , resolve: { items: ItemListResolver } 
    { path: 'masterdata/item/:id', component: ManagementItemEditComponent, resolve: { item: ItemEditResolver }, canDeactivate: [PreventUnsavedChanges] },
    { path: 'masterdata/exchange-rate', component: ManagementExchangeRateComponent },
    { path: 'masterdata/currency', component: ManagementCurrencyComponent },
    { path: 'masterdata/prepaidcard', component: ManagementPrepaidComponent },
    { path: 'masterdata/holiday', component: ManagementHolidayComponent },
    { path: 'masterdata/merchandise', component: ManagementMerchandiseComponent },
    { path: 'masterdata/peripherals', component: ManagementPeripheralsListComponent },
    { path: 'masterdata/terminal-peripherals', component: ManagementTerminalPeripheralsListComponent },

    { path: 'masterdata/client-disallowance', component: ManagementDisallowanceListComponent },
    { path: 'masterdata/capacity', component: ManagementCapacityListComponent},
    { path: 'masterdata/customer', component: ManagementCustomerListComponent},
    { path: 'masterdata/customer-group', component: ManagementCustomerGroupListComponent},
    { path: 'masterdata/company', component: ManagementCompanyComponent},
    { path: 'masterdata/shipping', component: ManagementShippingListComponent},

    
    { path: 'masterdata/item-uom', component: ManagementItemUomComponent},
    { path: 'masterdata/store-client', component: ManagementStoreClientComponent},
    { path: 'masterdata/bank-terminal', component: ManagementBankTerminalComponent },
 
    // { path: 'masterdata/item/upload', component: ManagementItemUploadComponent },
    // { path: 'masterdata/item/upload/:m', component: ManagementItemUploadEditComponent},
    // { path: 'masterdata/item/upload/:m/:id', component: ManagementItemUploadEditComponent},

    { path: 'transaction/upload/sales-order', component: ManagementImportSalesOrderComponent },
    { path: 'transaction/upload/goods-receipt', component: ManagementImportGoodsReceiptComponent },
    { path: 'masterdata/upload/bom', component: ManagementImportBomComponent },
    { path: 'masterdata/upload/customer', component: ManagementImportCustomerComponent },
    { path: 'masterdata/upload/customergroup', component: ManagementImportCustomergroupComponent },
    { path: 'masterdata/upload/employee', component: ManagementImportEmployeeComponent },

    { path: 'masterdata/upload/warehouse', component: ManagementImportWarehouseComponent },
    { path: 'masterdata/upload/user', component: ManagementImportUserComponent },
    { path: 'masterdata/upload/userstore', component: ManagementImportUserstoreComponent },
    { path: 'masterdata/upload/uom', component: ManagementImportUomComponent },
    { path: 'masterdata/upload/tax', component: ManagementImportTaxComponent },
    { path: 'masterdata/upload/storepayment', component: ManagementImportStorepaymentComponent },
    { path: 'masterdata/upload/storegroup', component: ManagementImportStoregroupComponent },
    { path: 'masterdata/upload/storecapacity', component: ManagementImportStorecapacityComponent },
    { path: 'masterdata/upload/storearea', component: ManagementImportStoreareaComponent },
    { path: 'masterdata/upload/store', component: ManagementImportStoreComponent },
    { path: 'masterdata/upload/storage', component: ManagementImportStorageComponent },
    { path: 'masterdata/upload/product', component: ManagementImportProductComponent },
    { path: 'masterdata/upload/pricelist', component: ManagementImportPricelistComponent },
    { path: 'masterdata/upload/stamps', component: ManagementImportStampsComponent },
    { path: 'masterdata/upload/licenseplate', component: ManagementImportLicensePlateComponent },



    { path: 'masterdata/upload/paymentmethod', component: ManagementImportPaymentmethodComponent },
    { path: 'masterdata/upload/merchandise', component: ManagementImportMerchandiseComponent },
    { path: 'masterdata/upload/itemuom', component: ManagementImportItemuomComponent },
    { path: 'masterdata/upload/itemserialstock', component: ManagementImportItemserialstockComponent },
    { path: 'masterdata/upload/itemserial', component: ManagementImportItemserialComponent },
    { path: 'masterdata/upload/itemgroup', component: ManagementImportItemgroupComponent },
    { path: 'masterdata/upload/item', component: ManagementImportItemComponent },
    { path: 'masterdata/upload/itemstorage', component: ManagementImportItemStorageComponent },

    // { path: 'masterdata/sales-target', component: ManagementSalesPlanComponent },
    { path: 'masterdata/sales-plan', component: ManagementSalesPlanComponent },
    { path: 'masterdata/sales-plan/:m/:id', component: ManagementSalesPlanEditNewComponent },
    { path: 'masterdata/timeframe', component: ManagementTimeframeComponent },
    { path: 'masterdata/denomination', component: ManagementDenominationListComponent },
    { path: 'masterdata/storegroup', component: ManagementStoregroupListComponent, resolve: { groups: StoreGoupListResolver } },
    { path: 'masterdata/store', component: ManagementStoreListComponent, resolve: { stores: StoreListResolver } },
    { path: 'masterdata/formatconfig', component: ManagementFormatListComponent, resolve: { formats: FormatConfigListResolver } },
    { path: 'masterdata/store-currency/:storeid', component: ManagementStoreCurrencySettingComponent },
    { path: 'masterdata/store-payment/:storeid', component: ManagementStorePaymentSettingComponent },
    { path: 'masterdata/table-info', component: TableInfoComponent },
    { path: 'masterdata/place-info', component: PlaceInforComponent },
    { path: 'masterdata/table-place/:storeid/:placeid', component: TableplaceComponent },
    { path: 'masterdata/settingPrint', component: SettingPrintComponent },  


    // , resolve: { payments: StorePaymentEditResolver }
    { path: 'masterdata/store-warehouse/:storeid', component: ManagementStoreWhsSettingComponent },
    { path: 'masterdata/warehouse', component: ManagementWarehouseListComponent, resolve: { whs: WarehouseListResolver } },
    { path: 'masterdata/employee', component: ManagementEmployeeListComponent, resolve: { employees: EmployeeListResolver } },
    { path: 'masterdata/employee-salary', component: ManagementEmployeeSalaryComponent,   },
    { path: 'masterdata/paymentmethod', component: ManagementPaymentListComponent, resolve: { payments: PaymentMethodListResolver } },
    { path: 'masterdata/pricelist', component: ManagementPriceListComponent },
    { path: 'masterdata/pricelist-name', component: ManagementPriceListNameMappingComponent },
    { path: 'masterdata/uom', component: ManagementMasterdataUomComponent },
    { path: 'masterdata/tax', component: ManagementMasterdataTaxComponent },
    { path: 'masterdata/itemgroup', component: ManagementMasterdataItemgroupComponent },
    { path: 'masterdata/storage', component: ManagementMasterdataStorageComponent },
    { path: 'masterdata/storearea', component: ManagementMasterdataStoreareaComponent },
    { path: 'masterdata/user', component: ManagementUserListComponent },
    { path: 'masterdata/userrole', component: ManagementUserRoleComponent },
    { path: 'masterdata/itemstorage', component: ManagementItemstorageComponent },
    { path: 'version', component: ManagementVersionListComponent },
    // { path: 'masterdata/licensePlate', component: ManagementLicensePlateComponent },
    { path: 'masterdata/licensePlate', component: ManagementLicensePlateViewComponent },
    { path: 'masterdata/licensePlate/:m/:id', component: ManagementLicensePlateAddComponent },

    { path: 'masterdata/saleschannel', component: ManagementSaleschannelComponent },
    { path: 'masterdata/saleschannel/:m/:id', component: ManagementSaleschannelEditComponent },

    { path: 'salary-target-summary', component: ManagementTargetSummaryComponent },
    { path: 'crm-list', component: ManagementCrmComponent },
    { path: 'crm/setup', component: ManagementCrmSetupComponent },
    { path: 'crm/:m/:loyaltyId', component: ManagementCrmSetupComponent },
    { path: 'crm-rank', component: ManagementLoyaltyrankComponent },
    { path: 'more/reason', component: ManagementReasonListComponent },
    { path: 'pickup-amount-list', component: ManagementPickupAmountListComponent },
    { path: 'pickup-amount', component: ManagementPickupAmountComponent }, 
    { path: 'pickup-amount/print/:counterid/:shiftid', component: ManagementPickupPrintComponent }, 
    { path: 'bankin-amount-list', component: ManagementBankinListComponent },
    { path: 'bankin-amount', component: ManagementBankinEditComponent },
    { path: 'tools/item-check', component: ManangementItemCheckMasterDataComponent},
    { path: 'tools/item-check/:storeId/:keyword', component: ManangementItemCheckMasterDataComponent},
    { path: 'tools/item-check/:storeId/:keyword/:cusGrp', component: ManangementItemCheckMasterDataComponent},





    //End of date
    { path: 'waiver-form', component: WaiverFormComponent },
    { path: 'end-of-date', component: ManagementEndofdateListComponent },
    { path: 'end-of-date/:id', component: ManagementEndofdateDetailsComponent },
    { path: 'end-of-date/print/:id', component: ManagementEndofdatePrintComponent },
    { path: 'end-of-date/open-shift/:companyCode/:storeId/:date', component: ManagementOpenShiftListComponent },
    { path: 'device-setting/:url', component: ShopCounterInputComponent },
    { path: 'device-setting', component: ShopCounterInputComponent },

    { path: 'to-do-list', component: ManagementTodolistComponent },
    { path: 'to-do-list/:id', component: ManagementTodolistEditComponent },
    { path: 'permission-denied', component: PermissionDeniedComponent },
    // { path: 'test', component: TestComponent },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', component: ManagementDashboardComponent },
 
  ]
}
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
