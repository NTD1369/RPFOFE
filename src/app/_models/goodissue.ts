export class TGoodsIssueHeader {
    invtid: string;
    companyCode: string;
    storeId: string;
    storeName: string;
    totalPayable: number | null;
    totalDiscountAmt: number | null;
    totalReceipt: number | null;
    totalTax: number | null;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    isCanceled: string;
    remark: string;
    refId: string;
    shiftId: string;
    movementType: string;
    lines: TGoodsIssueLine[];
    terminalId:string|null;
    type: string;
    sapNo: string;
}
export class TGoodsIssueLine {
    invtid: string;
    keyId: string;
    companyCode: string;
    lineId: string;
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
    createdOn: Date | string | null;
    createdBy: string;
    modifiedOn: Date | string | null;
    modifiedBy: string;
    status: string;
    description: string;
    BOMId: string;
    BOMValue: number;
    lines: TGoodsIssueLine[];
    serialLines: TGoodsIssueLineSerial[];
    allowDecimal: boolean | null;
}

export class TGoodsIssueLineSerial {
    invtid: string;
    keyId: string;
    lineId: string;
    companyCode: string;
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
    description: string;
}

export class TGoodsIssueLineTemplate {
    invtid: string = '';
    keyId: string = '';
    companyCode: string = '';
    lineId: string = '';
    itemCode: string ='';
    slocId: string ='';
    barCode: string ='';
    uomCode: string = '';
    quantity: number | null =null;
    price: number | null = null;
    lineTotal: number | null = null;
    currencyCode: string = '';
    currencyRate: number | null = null;
    taxCode: string = '';
    taxRate: number | null = null;
    taxAmt: number | null = null;
    remark: string = '';
    createdOn: Date | string | null = null;
    createdBy: string = '';
    modifiedOn: Date | string | null = null;
    modifiedBy: string = '';
    status: string = '';
    description: string = '';
    BOMId: string = '';
    BOMValue: number ;
    lines: TGoodsIssueLine[];
    serialLines: TGoodsIssueLineSerial[];
    stt :number|null = null;
    listError:string ='';
    storeId:string ='';
    allowDecimal: boolean = null;
}