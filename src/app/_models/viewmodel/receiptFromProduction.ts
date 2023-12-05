
export class TReceiptfromProductionHeader {
    invtid: string;
    companyCode: string;
    storeId: string;
    totalPayable: number | null;
    totalDiscountAmt: number | null;
    totalReceipt: number | null;
    totalTax: number | null;
    createdBy: string;
    createdOn: string | null;
    modifiedBy: string;
    modifiedOn: string | null;
    status: string;
    isCanceled: string;
    remark: string;
    storeName: string;
    refId: string;
    movementType: string;
    shiftId: string;
    customField1: string;
    customField2: string;
    customField3: string;
    customField4: string;
    customField5: string;
}
   

export class TReceiptfromProductionLine {
    invtid: string;
    companyCode: string;
    lineId: string;
    keyId: string;
    itemCode: string;
    slocId: string;
    barCode: string;
    uomCode: string;
    quantity: number | null;
    price: number | null;
    lineTotal: number | null;
    currencyCode: string;
    currencyRate: number | null;
    taxCode: string;
    taxRate: number | null;
    taxAmt: number | null;
    remark: string;
    createdOn: string | null;
    createdBy: string;
    modifiedOn: string | null;
    modifiedBy: string;
    status: string;
    description: string;
    serialLines: any;
}



export interface TReceiptfromProductionLineSerial {
    invtid: string;
    lineId: string;
    companyCode: string;
    itemCode: string;
    serialNum: string;
    slocId: string;
    quantity: number | null;
    openQty: number | null;
    uomCode: string;
    createdBy: string;
    createdOn: string | null;
    modifiedBy: string;
    modifiedOn: string | null;
    status: string;
    description: string;
}

