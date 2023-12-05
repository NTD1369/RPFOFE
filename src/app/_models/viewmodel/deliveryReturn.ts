export interface TReturnHeader {
    purchaseId: string;
    companyCode: string;
    storeId: string;
    storeName: string;
    docStatus: string;
    cardCode: string;
    cardName: string;
    invoiceAddress: string;
    vattotal: number | null;
    docTotal: number | null;
    comment: string;
    status: string;
    isCanceled: string;
    docEntry: string;
    dataSource: string;
    sapNo: string;
    prNum: string;
    syncDate: string;
    syncSource: string;
    docDate: Date | string | null;
    docDueDate: Date | string | null;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    sumQuality: number | null;
    sumLineTotal: number | null;
    objType:number | null;
}



export interface TReturnLine {
    purchaseId: string;
    companyCode: string;
    lineId: string;
    itemCode: string;
    sLocId: string;
    barCode: string;
    description: string;
    uOMCode: string;
    quantity: number;
    openQty: number;
    price: number;
    baseSAPId: string;
    baseSAPLine: number | null;
    lineStatus: string;
    discPercent: number;
    vATPercent: number;
    lineTotal: number;
    comment: string;
    createdBy: string;
    createdOn: string | null;
    modifiedBy: string;
    modifiedOn: string | null;
    status: string;
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
    serialLines: TReturnLineSerial[];
}


export interface TReturnLineSerial {
    purchaseId: string;
    lineId: string;
    companyCode: string;
    itemCode: string;
    serialNum: string;
    sLocId: string;
    quantity: number;
    uOMCode: string;
    createdBy: string;
    createdOn: string | null;
    modifiedBy: string;
    modifiedOn: string | null;
    openQty: number;
    baseLine: string;
    baseTransId: string;
    itemName: string;
    description: string;
}

