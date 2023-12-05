export class TGoodsReceiptHeader {
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
    lines: TGoodsReceiptLine[];
    terminalId:string|null;
    type: string;
    sapNo: string;


}
export class TGoodsReceiptLine {
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
    lines: TGoodsReceiptLineSerial[];
    allowDecimal:boolean |null;
}

export class TGoodsReceiptLineSerial {
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



export class TGoodsReceiptLineTemplate {
    invtid: string='';
     keyId: string='';
    companyCode: string='';
    storeId: string='';
    movementType: string='';
    lineId: string='';
    lineNum: string='';
    itemCode: string='';
    slocId: string='';
    barCode: string='';
    uomCode: string='';
    quantity: number | null=null;
    price: number | null=null;
    lineTotal: number | null=null;
    currencyCode: string='';
    currencyRate: number | null=null;
    taxCode: string='';
    taxRate: number | null=null;
    taxAmt: number | null=null;
    remark: string=''; 
    status: string='';
    createdOn: Date | string | null;
    createdBy: string;
    modifiedOn: Date | string | null;
    modifiedBy: string;
    description: string='';
    lines: TGoodsReceiptLineSerial[];
    stt :number|null = null;
    listError:string ='';
    allowDecimal:boolean = null;
}
