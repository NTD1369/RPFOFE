export class TPurchaseOrderHeader {
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
    vatpercent: number | null;
    vattotal: number | null;
    docTotal: number | null;
    comment: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    isCanceled: string;
    lines: TPurchaseOrderLine[];
    serialLines: TPurchaseOrderLineSerial[];
    docEntry: string;
    dataSource: string;
    sumQuality: number | null;
    sumLineTotal: number | null;
    syncMWIStatus: string;
    sapNo: string;
    prNum: string;
    terminalId: string | null = '';
}

export class TPurchaseOrderLine {
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
    price: number | null;
    baseSAPId: string;
    baseSAPLine: number | null;
    lineStatus: string;
    discPercent: number | null;
    vatpercent: number | null;
    lineTotal: number | null;
    comment: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;

    lastPrice: string;


}

export class TPurchaseOrderLineSerial {
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
}
export class TPurchaseRequestHeader {
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
    vatpercent: number | null;
    vattotal: number | null;
    docTotal: number | null;
    comment: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    isCanceled: string;
    lines: TPurchaseOrderLine[];
    serialLines: TPurchaseOrderLineSerial[];
    docEntry: string;
    dataSource: string;
    sumQuality: number | null;
    sumLineTotal: number | null;
    syncMWIStatus: string;
    prNum: string;
    terminalId: string | null;
}

export class TPurchaseRequestLine {
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
    price: number | null;
    baseSAPId: string;
    baseSAPLine: number | null;
    lineStatus: string;
    discPercent: number | null;
    vatpercent: number | null;
    lineTotal: number | null;
    comment: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    lastPrice: string;
    fromDate: Date | string | null;
    toDate: Date | string | null;
    allowDecimal:boolean |null;

}

export class TPurchaseRequestLineSerial {
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
}
export class TPurchaseRequestLineTemplate {
    keyId: string = '';
    purchaseId: string = '';
    companyCode: string = '';
    lineId: string = '';
    itemCode: string = '';
    slocId: string = '';
    barCode: string = '';
    description: string = '';
    uomCode: string = '';
    quantity: number | null = null;
    openQty: number | null = null;
    price: number | null = null;
    baseSAPId: string = '';
    baseSAPLine: number | null = null;
    lineStatus: string = '';
    discPercent: number | null = null;
    vatpercent: number | null = null;
    lineTotal: number | null = null;
    comment: string = '';
    createdBy: string = '';
    createdOn: Date | string | null = null;
    modifiedBy: string;
    modifiedOn: Date | string | null = null;
    status: string = '';
    lastPrice: string = '';
    stt: number | null = null;
    listError: string = '';
    storeId: string = '';
    fromDate: Date | string | null;
    toDate: Date | string | null;
    allowDecimal:boolean = null;
}

export class AverageNumberModel {
    itemCode: string = '';
    barCode: string = '';
    slocId: string = '';
    uomCode: string = '';
    fromDate: Date | string | null = null;
    toDate: Date | string | null = null;
}