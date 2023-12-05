export class TInventoryTransferHeader {
    invttransid: string;
    companyCode: string;
    docType: string;
    refInvtid: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    isCanceled: string;
    docDate: Date | string | null;
    docDueDate: Date | string | null;
    storeId: string;
    storeName: string;
    fromSloc: string;
    fromSlocName: string;
    toSloc: string;
    toSlocName: string;
    name: string;
    remark: string;
    refId: string;
    shiftId: string;
    transitWhs: string;
    fromWhs: string;
    toWhs: string;
    sumQuality: number;
    lines: TInventoryTransferLine[];
}

export class TInventoryTransferLine {
    keyId: string;
    invttransid: string;
    companyCode: string;
    lineId: string;
    itemCode: string;
    frSlocId: string;
    toSlocId: string;
    docType: string;
    barCode: string;
    description: string;
    uomCode: string;
    quantity: number | null;
    shipDate: Date | string | null;
    openQty: number | null;
    price: number | null;
    lineTotal: number | null;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    baseTransId: string;
    baseLine: string;
    lines: TInventoryTransferLineSerial[];
}


export class TInventoryTransferLineSerial {
    invttransid: string;
    keyId: string;
    lineId: string;
    companyCode: string;
    itemCode: string;
    serialNum: string;
    frSlocId: string;
    toSlocId: string;
    quantity: number | null;
    uomCode: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    description: string;
}
export class TInventoryTransferLineTemplate {
    keyId: string = '';
    invttransid: string = '';
    companyCode: string = '';
    lineId: string = '';
    itemCode: string = '';
    frSlocId: string = '';
    toSlocId: string = '';
    docType: string = '';
    barCode: string = '';
    description: string = '';
    uomCode: string = '';
    quantity: number | null = null;
    shipDate: Date | string | null = null;
    openQty: number | null = null;
    price: number | null = null;
    lineTotal: number | null = null;
    createdBy: string = '';
    createdOn: Date | string | null = null;
    modifiedBy: string = '';
    modifiedOn: Date | string | null = null;
    status: string = '';
    baseTransId: string = '';
    baseLine: string = '';
    lines: TInventoryTransferLineSerial[];
    stt: number | null = null;
    listError: string = '';
}