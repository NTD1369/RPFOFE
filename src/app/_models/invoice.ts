import { MCustomer } from "./customer";

export class TInvoiceHeader {
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
    isCanceled:  string;
    remarks: string;
    salesPerson: string;
    salesMode: string;
    refTransId: string;
    posType: string;
    manualDiscount: string;  
    dataSource:  string;
    customer: MCustomer;
    salesType: string;
    invoiceType: string;
    lines: TInvoiceLine[] = []; 
    serialLines: TInvoiceLineSerial[] = []; 
    promoLines: TInvoicePromo[] = []; 
    payments: TInvoicePayment[]= []; 
    invoice: TInvoiceInvoice;
    image: string;
    phone: string;
    cusName: string;
    cusAddress: string;
    totalQuanlity :number | null;
    totalLineTotal :number | null;
    totalPromoLineTotal :number | null;
    terminalId: string='';
    reason: string='';
    approvalId: string='';
    checkOutOn: string='';
}
export class TInvoiceInvoice {
    transId: string;
    companyCode: string;
    storeId: string; 
    storeName: string;
    customerName: string;
    taxCode: string;
    email: string;
    address: string;
    phone: string;
    remark: string; 
    createdOn: Date | string | null;
    createdBy: string;
    modifiedOn: Date | string | null;
    modifiedBy: string;

}
export class TInvoicePayment {
    paymentCode: string;
    companyCode: string;
    storeId: string;
    currency: string;
    transId: string;
    lineId: string;
    totalAmt: number | null;
    receivedAmt: number | null;
    paidAmt: number | null;
    changeAmt: number | null;
    paymentMode: string;
    cardType: string;
    cardHolderName: string;
    cardNo: string;
    voucherBarCode: string;
    voucherSerial: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    chargableAmount: number | null;
    paymentDiscount: number | null;
    collectedAmount: number | null;
    refNumber: string;
    terminalId: string='';
    fcAmount: number | null;
    rate: number | null;
}

export class TInvoicePromo {
    transId: string;
    companyCode: string;
    storeId: string;
    itemCode: string;
    barCode: string;
    refTransId: string;
    applyType: string;
    itemGroupId: string;
    uomCode: string;
    value: number | null;
    promoId: string;
    promoType: string;
    promoTypeLine: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    promoPercent:number | null;
    promoAmt:number | null;
}
export class TInvoiceLineSerial {
    transId: string;
    lineId: string;
    companyCode: string;
    storeId: string;
    itemCode: string;
    serialNum: string;
    slocId: string;
    quantity: number | null;
    uomCode: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    openQty: number | null;
    baseLine: number;
    baseTransId: string; 
    lineNum: number | null;
}
export class TInvoiceLine {
    transId: string;
    lineId: string;
    companyCode: string;
    storeId: string;
    itemCode: string;
    itemName: string;
    slocId: string;
    barCode: string;
    uomCode: string;
    quantity: number | null;
    price: number | null;
    lineTotal: number | null;
    discountType: string;
    discountAmt: number | null;
    discountRate: number | null;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
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
    posservice: string;
    storeAreaId: string;
    timeFrameId: string;
    bomId: string;
    appointmentDate: Date | string | null; 
    promoPrice: number | null;
    promoLineTotal: number | null;
    oriQty: number | null;
    openQty: number | null;
    checkOutQty: number | null;
    baseLine: number;
    baseTransId: string; 
    promoDisAmt : number | null;
    isPromo : string | null;
    isSerial : boolean | null;
    serialLines: TInvoiceLineSerial[];
    memberValue : number | null;
    prepaidCardNo: string;
    memberDate: Date | string | null;
    itemType: string;
    max_redemption : number | null;
    lines: TInvoiceLine[]= [];
}