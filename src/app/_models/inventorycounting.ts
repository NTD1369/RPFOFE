export class TInventoryCountingHeader {
    icid: string;
    companyCode: string;
    storeId: string;
    storeName: string;
    name: string; 
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
    sumOnhand: number | null;
    sumVariance: number | null;
    lines: TInventoryCountingLine[];
    terminalId:string|null;
}

export class TInventoryCountingLine {
    icid: string;
    keyId: string;
    companyCode: string;
    lineId: string;
    itemCode: string;
    slocId: string;
    barCode: string;
    description: string;
    uomCode: string;
    openQty: number | null;
    quantity: number | null;
    price: number | null;
    baseRef: string;
    baseType: string;
    baseEntry: string;
    lineStatus: string;
    lineTotal: number | null;
    comment: string;
    totalStock: number | null;
    totalCount: number | null;
    totalDifferent: number | null;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    lines: TInventoryCountingLineSerial[];
    allowDecimal:boolean |null;
}

     
export class TInventoryCountingLineSerial {
    icid: string;
    keyId: string;
    lineId: string;
    companyCode: string;
    description: string;
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
    status: string; 
}
export class TInventoryCountingTemplate {
    icid: string ='';
    keyId: string='';
    companyCode: string ='';
    lineId: string ='';
    itemCode: string ='';
    slocId: string ='';
    barCode: string ='';
    description: string ='';
    uomCode: string ='';
    openQty: number | null =null;
    quantity: number | null =null;
    price: number | null =null;
    baseRef: string = '';
    baseType: string ='';
    baseEntry: string ='';
    lineStatus: string ='';
    lineTotal: number | null =null;
    comment: string= '';
    totalStock: number | null =null;
    totalCount: number | null =null;
    totalDifferent: number | null =null;
    createdBy: string ='';
    createdOn: Date | string | null=null;
    modifiedBy: string='';
    modifiedOn: Date | string | null =null;
    status: string='';
    lines: TInventoryCountingLineSerial[];
    stt:number|null =null;
    listError:string ='';
    storeId:string ='';
    allowDecimal:boolean = null;
    iscount:boolean = null;
}

export class TInventoryCountingLineSerialTemPlate {
    itemCode: string ='';
    serialNum: string ='';
    stt1 :number|null =null;
    listError:string ='';
}
export class ErrorList{
    itemCode:string='';
    stt:number|null =null;
    listStt:number[] =[];
    type:string ='';
}