export class TSalesHeader
{
    transId: string='';
    companyCode: string='';
    contractNo: string='';
    storeId: string='';
    storeName: string='';
    shiftId: string='';
    cusId: string='';
    cusIdentifier: string='';
    totalAmount: number| null = null;
    totalPayable: number| null = null;
    totalDiscountAmt: number| null = null;
    totalReceipt: number| null = null;
    amountChange: number| null = null;
    paymentDiscount: number| null = null;
    totalTax: number| null = null;
    discountType: string='';
    discountAmount: number| null = null;
    discountRate: number| null = null;
    createdOn: Date | string | null;
    createdBy: string='';
    modifiedOn: Date | string | null;
    modifiedBy: string='';
    status: string='';
    remarks: string='';
    salesPerson: string='';
    salesPersonName: string = '';
    salesMode: string='';
    refTransId: string='';
    manualDiscount: string='';
    isCanceled: string = '';
    dataSource:  string='';
    reason:  string='';
    approvalId:  string='';
    otherTerminalId:  string='';
}

 