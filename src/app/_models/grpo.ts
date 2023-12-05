export class TGoodsReceiptPoheader {
    purchaseId: string;
    companyCode: string;
    storeId: string;
    storeName: string;
    docStatus: string;
    docDate: Date | string | null;
    docDueDate: Date | string | null;
    cardCode: string;
    cardName: string;
    invoiceAddress: string;
    taxCode: string;
    vatPercent: number | null;
    vattotal: number | null;
    docTotal: number | null;
    comment: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    shiftId: string;
    isCanceled: string;
    lines:TGoodsReceiptPoline[];
    serialLines:TGoodsReceiptPolineSerial[];
    refTransId: string;
    sumQuality: number | null;
    sumLineTotal: number | null;
    sapNo: string;
    grpoNo: string;
    objType: number | null;
    terminalId: string = '';
    refPurchaseID:string;
}

export class TGoodsReceiptPoline {
    keyId: string;
    purchaseId: string;
    companyCode: string;
    lineId: string;
    itemCode: string;
    slocId: string;
    barCode: string;
    description: string;
    uomCode: string;
    quantity: number | null;
    openQty: number | null;
    priceBfVAT: number | null;
    price: number | null;
    baseTrans: string;
    baseType: string;
    baseEntry: string;
    lineStatus: string;
    discPercent: number | null;
    vatPercent: number | null;
    lineTotal: number | null;
    lineTotalBfVAT: number | null;

    comment: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    serialLines:TGoodsReceiptPolineSerial[];
    baseLine:number | null;
    baseTransId: string;
    allowDecimal:boolean | null;
}

export class TGoodsReceiptPolineSerial {
    keyId: string;
    purchaseId: string;
    lineId: string;
    companyCode: string;
    itemCode: string;
    serialNum: string;
    slocId: string;
    quantity: number | null;
    openQty: number | null;
    uomCode: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    baseLine:number | null;
    baseTransId: string;
    description: string;

}