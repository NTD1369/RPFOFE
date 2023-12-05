export class TInventoryPostingHeader {
    ipid: string;
    companyCode: string;
    storeId: string;
    storeName: string;
    name: string;
    remark: string;
    docStatus: string;
    docDate: Date | string | null;
    docDueDate: Date | string | null;
    docTotal: number | null;
    comment: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    isCanceled: string;
    refId: string;
    sumQuality: number | null;
    lines: TInventoryPostingLine[];
    terminalId:string|null;
}

export class TInventoryPostingLine {
    
    keyId: string; 
    ipid: string;
    companyCode: string;
    lineId: string;
    itemCode: string;
    slocId: string;
    barCode: string;
    description: string;
    uomCode: string;
    quantity: number | null;
    price: number | null;
    baseRef: string;
    baseType: string;
    baseEntry: string;
    lineStatus: string;
    lineTotal: number | null;
    comment: string;
   
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    lines: TInventoryPostingLineSerial[];
}

     
export class TInventoryPostingLineSerial {
    ipid: string;
    keyId: string; 
    lineId: string;
    companyCode: string;
    itemCode: string;
    serialNum: string;
    slocId: string;
    quantity: number | null;
    totalStock: number | null;
    totalCount: number | null;
    totalDifferent: number | null;
    uomCode: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    description: string;
}