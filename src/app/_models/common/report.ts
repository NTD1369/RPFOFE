export interface RPT_SalesTransactionSummaryModel {
    transId: string;
    companyCode: string;
    storeId: string;
    contractNo: string;
    storeName: string;
    shiftId: string;
    cusId: string;
    cusIdentifier: string;
    totalAmount: number | null;
    totalPayable: number | null;
    totalDiscountAmt: number | null;
    totalReceipt: number | null;
    amountChange: number | null;
    paymentDiscount: number | null;
    totalTax: number | null;
    discountType: string;
    discountAmount: number | null;
    discountRate: number | null;
    createdOn: Date | string | null;
    createdBy: string;
    modifiedOn: Date | string | null;
    modifiedBy: string;
    status: string;
    isCanceled: string;
    remarks: string;
    salesPerson: string;
    salesMode: string;
    refTransId: string;
    manualDiscount: string;
    reason: string;
    approvalId: string;
}


export interface RPT_SalesTransactionDetailModel {
    companyCode: string;
    storeId: string;
    storeName: string;
    sLocId: string;
    contractNo: string;
    cusIdentifier: string;
    shiftId: string;
    cusId: string;
    headerStatus: string;
    isCanceled: string;
    remarks: string;
    salesPerson: string;
    headerSalesMode: string;
    refTransId: string;
    manualDiscount: string;
    dataSource: string;
    postype: string;
    phone: string;
    cusName: string;
    cusAddress: string;
    transId: string;
    lineId: string;
    itemCode: string;
    barCode: string;
    uomCode: string;
    quantity: number | null;
    price: number | null;
    lineTotal: number | null;
    lineTotalBefDiscount: number | null;
    discountType: string;
    discountAmt: number | null;
    lineDiscountAmt: number | null;
    discountRate: number | null;
    lineDiscountRate: number | null;
    createdBy: string;
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
    status: string;
    remark: string;
    promoId: string;
    promoType: string;
    promoPercent: number | null;
    promoBaseItem: string;
    salesMode: string;
    taxRate: number | null;
    taxAmt: number | null;
    taxCode: string;
    minDepositAmt: number | null;
    minDepositPercent: number | null;
    deliveryType: string;
    posService: string;
    storeAreaId: string;
    timeFrameId: string;
    appointmentDate: Date | string | null;
    bomID: string;
    promoPrice: number | null;
    promoLineTotal: number | null;
    description: string;
    prepaidCardNo: string;
    customField1: string;
    customField2: string;
    customField3: string;
    customField4: string;
    customField5: string;
    customField6: string;
    customField7: string;
    customField8: string;
    customField9: string;
    customField10: string;
    headerDiscount: number | null;
    headerDiscountAmt: number | null;
    duration: number | null; 
    customField11: string;
    customField12: string;
    customField13: string;
    customField14: string;
    customField15: string;
    customField16: string;
    customField17: string;
    customField18: string; 
    customField19: string; 
    customField20: string;
    reason: string;
    approvalId: string;
}

export interface RPT_SalesStoreSummaryModel {
    companyCode: string;
    storeId: string;
    storeName: string;
    totalAmount: number | null;
    totalPayable: number | null;
    totalDiscountAmt: number | null;
    totalReceipt: number | null;
    amountChange: number | null;
    paymentDiscount: number | null;
    totalTax: number | null;
    salesMode: string;
    countNo: number | null;
    avgTotal: number | null;


}
export class RPT_InventoryPostingModel {
    companyCode: string;
    transType: string;
    itemCode: string;
    uomcode: string;
    storeId: string;
    inQty: number | null;
    outQty: number | null;
    productId: string;
    variantId: string;
    //CreatedBy: string;	
    //CreatedOn: string;	
    //ModifiedBy: string;	
    //ModifiedOn: string;
    status: string;
    capacityValue: string;
    itemGroupId: string;

    salesTaxCode: string;
    purchaseTaxCode: string;
    itemName: string;
    itemDescription: string;
    itemCategory_1: string;
    itemCategory_2: string;
    itemCategory_3: string;
    foreignName: string;
    inventoryUOM: string;
    imageURL: string;
    imageLink: string;
    mcid: string;
    customField1: string;
    customField2: string;
    customField3: string;
    customField4: string;
    customField5: string;
    customField6: string;
    customField7: string;
    customField8: string;
    customField9: string;
    customField10: string;
    defaultPrice: number | null;
    isSerial: boolean | null;
    isBOM: boolean | null;
    validFrom: Date | string | null;
    validTo: Date | string | null;
    whsName: string;
    movementTypeCode:string;
    movementTypeName:string;
}

export interface RPT_InventoryOnHandModel {
    companyCode: string;
    itemCode: string;
    uomCode: string;
    storeId: string;
    quantity: number | null;
    //BeginQty: number | null;
    //InQty: number | null;
    //OutQty: number | null;
    //EndQty: number | null;
    productId: string;
    variantId: string;
    createdBy: string;
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
    status: string;
    capacityValue: string;
    itemGroupId: string;

    salesTaxCode: string;
    purchaseTaxCode: string;
    itemName: string;
    itemDescription: string;
    itemCategory_1: string;
    itemCategory_2: string;
    itemCategory_3: string;
    foreignName: string;
    inventoryUOM: string;
    imageURL: string;
    imageLink: string;
    mcid: string;
    customField1: string;
    customField2: string;
    customField3: string;
    customField4: string;
    customField5: string;
    customField6: string;
    customField7: string;
    customField8: string;
    customField9: string;
    customField10: string;
    defaultPrice: number | null;
    isSerial: boolean | null;
    isBOM: boolean | null;
    validFrom: Date | string | null;
    validTo: Date | string | null;
    whsName: string;
}
export class RPT_InventoryAuditModel {
    companyCode: string;
    itemCode: string;
    uomCode: string;
    storeId: string;
    beginQty: number | null;
    inQty: number | null;
    outQty: number | null;
    endQty: number | null;
    productId: string;
    variantId: string;
    //CreatedBy: string;	
    //CreatedOn: string;	
    //ModifiedBy: string;	
    //ModifiedOn: string;
    status: string;
    capacityValue: string;
    itemGroupId: string;

    salesTaxCode: string;
    purchaseTaxCode: string;
    itemName: string;
    itemDescription: string;
    itemCategory_1: string;
    itemCategory_2: string;
    itemCategory_3: string;
    foreignName: string;
    inventoryUOM: string;
    imageURL: string;
    imageLink: string;
    mcid: string;
    customField1: string;
    customField2: string;
    customField3: string;
    customField4: string;
    customField5: string;
    customField6: string;
    customField7: string;
    customField8: string;
    customField9: string;
    customField10: string;
    defaultPrice: number | null;
    isSerial: boolean | null;
    isBOM: boolean | null;

    validFrom: Date | string | null;

    validTo: Date | string | null;
    whsName: string;
}

export class RPT_SalesTopProductModel {
    companyCode: string;
    storeId: string;
    storeName: string;
    slocId: string;
    itemCode: string;
    uomCode: string;
    totalTransId: string;
    totalQuantity: number | null;
    totalAmount: number | null;
    precentQuantity: string;

}
export interface RPT_SalesByHourModel {

    companyCode: string;
    storeId: string;
    storeName: string;
    hour: number | null;
    totalTransId: number | null;
    totalQuantity: number | null;
    totalAmount: number | null;

}
export interface RPT_SalesByYearModel {
    companyCode: string;
    storeId: string;
    storeName: string;
    year: number | null;
    totalTransId: number | null;
    totalQuantity: number | null;
    totalAmount: number | null;
}

export interface RPT_SalesBySalesPersonModel {

    companyCode: string;
    storeId: string;
    storeName: string;
    salesPerson: string;
    employeeName: string;
    year: number | null;
    totalTransId: number | null;
    totalQuantity: number | null;
    totalAmount: number | null;

}

export interface RPT_SalesTransactionPaymentModel {

    companyCode: string;
    storeId: string;
    storeName: string;
    paymentCode: string;
    totalAmt: number | null;
    chargableAmount: number | null;

}

export interface RPT_InvoiceTransactionPaymentModel {

    companyCode: string;
    storeId: string;
    storeName: string;
    paymentCode: string;
    totalAmt: number | null;
    chargableAmount: number | null;

}
export interface RPT_InvoiceTransactionSummaryModel {
    transId: string;
    companyCode: string;
    storeId: string;
    contractNo: string;
    storeName: string;
    shiftId: string;
    cusId: string;
    cusIdentifier: string;
    totalAmount: number | null;
    totalPayable: number | null;
    totalDiscountAmt: number | null;
    totalReceipt: number | null;
    amountChange: number | null;
    paymentDiscount: number | null;
    totalTax: number | null;
    discountType: string;
    discountAmount: number | null;
    discountRate: number | null;
    createdOn: Date | string | null;
    createdBy: string;
    modifiedOn: Date | string | null;
    modifiedBy: string;
    status: string;
    isCanceled: string;
    remarks: string;
    salesPerson: string;
    salesMode: string;
    refTransId: string;
    manualDiscount: string;

}


export interface RPT_InvoiceTransactionDetailModel {
    companyCode: string;
    storeId: string;
    storeName: string;
    sLocId: string;
    contractNo: string;
    cusIdentifier: string;
    shiftId: string;
    cusId: string;
    headerStatus: string;
    isCanceled: string;
    remarks: string;
    salesPerson: string;
    headerSalesMode: string;
    refTransId: string;
    manualDiscount: string;
    dataSource: string;
    postype: string;
    phone: string;
    cusName: string;
    cusAddress: string;
    transId: string;
    lineId: string;
    itemCode: string;
    barCode: string;
    uomCode: string;
    quantity: number | null;
    price: number | null;
    lineTotal: number | null;
    discountType: string;
    discountAmt: number | null;
    discountRate: number | null;
    createdBy: string;
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
    status: string;
    remark: string;
    promoId: string;
    promoType: string;
    promoPercent: number | null;
    promoBaseItem: string;
    salesMode: string;
    taxRate: number | null;
    taxAmt: number | null;
    taxCode: string;
    minDepositAmt: number | null;
    minDepositPercent: number | null;
    deliveryType: string;
    posService: string;
    storeAreaId: string;
    timeFrameId: string;
    appointmentDate: Date | string | null;
    bomID: string;
    promoPrice: number | null;
    promoLineTotal: number | null;
    description: string;
    prepaidCardNo: string;
    customField1: string;
    customField2: string;
    customField3: string;
    customField4: string;
    customField5: string;
    customField6: string;
    customField7: string;
    customField8: string;
    customField9: string;
    customField10: string;
}
export interface RPT_DasboardModel {
    totalBill: number | null;
    totalAmount: number | null;
    totalSalesItem: number | null;
    cancelPercent: number | null;
}
export interface RPT_InventorySerialModel {
    companyCode: string;
    storeId: string;
    storeName: string;
    transType: string; 
    transId: string;
    transDate: Date | string | null; 
    itemCode: string;		 
    uomCode: string;
    quantity: number | null;
    qty: number | null;
 
}
export interface RPT_SalesByItemModel {
    companyCode: string;
    storeId: string;
    storeName: string;
    itemCode: string;
    barCode: string;
    uOMCode: string;
    quantity: number | null;
    price: number | null;
    lineTotal: number | null;
    lineTotalBefDis: number | null;
    discountAmt: number | null;
    createdBy: string;
    createdOn: string | null;
    createdOnG: string | null;
    description: string;
    ItemGroupId:string;
    GroupName:string;
}

export interface RPT_CustomerPoint {
    customerId: string;
    customerName: string;
    transId: string;
    cardNumber:string;
    storeId: string;
    storeName: string;
    transDate: string |null;
    createdOn: string | null;
    docDate : string | null;
    transType:string;
    inPoint: number | null;
    outPoint: number | null;
    salesMode: string;
    salesPerson: string;
    salesPersonName:string;
}
