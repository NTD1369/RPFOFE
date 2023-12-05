export class TInventoryHeader {
    invtid: string;
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
    fromStore: string;
    fromStoreName: string;
    toStore: string;
    toStoreName: string;
    name: string;
    remark: string;
    refId: string;
    shiftId: string;
    transitWhs: string;
    fromWhs: string;
    toWhs: string;
    frSlocId: string;
    toSlocId: string;
    sumQuality: number;
    lines: TInventoryLine[];
    terminalId:string|null;
    sumapprove: number;
}

export class TInventoryLine {
    keyId: string;
    invtid: string;
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
    lines: TInventoryLineSerial[];
    approve: number | null;
    percent: number |null;
    allowDecimal:boolean | null;
}

     
export class TInventoryLineSerial {
    invtid: string;
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
export class TInventoryLineTemplate {
    keyId: string ='';
    invtid: string ='';
    companyCode: string ='';
    lineId: string ='';
    itemCode: string ='';
    frSlocId: string ='';
    toSlocId: string ='';
    docType: string ='';
    barCode: string ='';
    description: string ='';
    uomCode: string ='';
    quantity: number | null = null;
    shipDate: Date | string | null = null;
    openQty: number | null = null;
    price: number | null = null;
    lineTotal: number | null = null;
    createdBy: string ='';
    createdOn: Date | string | null = null;
    modifiedBy: string ='';
    modifiedOn: Date | string | null = null;
    status: string ='';
    baseTransId: string ='';
    baseLine: string ='';
    lines: TInventoryLineSerial[];
    stt :number|null = null;
    listError:string ='';
    approve: number | null = null;
    storeId:string ='';
    isOnhand:boolean|null = false;
    percent: number |null= null;
    allowDecimal:boolean = null;
}
