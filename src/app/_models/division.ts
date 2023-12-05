export class TDivisionLine {
    id: string;
    lineId: string;
    storeId: string;
    companyCode: string; 
    itemCode: string;
    slocId: string;
    barCode: string;
    uomCode: string;
    quantity: number | null;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    remark: string;
    custom1: string;
    custom2: string;
    custom3: string;
    custom4: string;
    custom5: string; 
}


export class TDivisionHeader {
        id: string; 
        companyCode: string;
        companyName: string;
        storeId: string;
        contractNo: string;
        storeName: string;
        shiftId: string;
        cusId: string;
        cusGrpId: string;
        createdOn: Date | string | null;
        docDate: Date | string | null;
        createdBy: string;
        modifiedOn: Date | string | null;
        modifiedBy: string;
        status: string;
        isCanceled: string;
        remarks: string; 
        customF1: string;
        customF2: string;
        customF3: string;
        customF4: string;
        customF5: string;
        lines: TDivisionLine[]; 
    }