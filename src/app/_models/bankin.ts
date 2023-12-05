export class TBankIn {
    id: string;
    companyCode: string;
    storeId: string;
    dailyId: string;
    lineNum: number | null;
    currency: string;
    fcAmt: number | null;
    rate: number | null;
    bankInAmt: number | null;
    refNum: string;
    refNum2: string;
    customF1: string;
    customF2: string;
    customF3: string;
    customF4: string;
    customF5: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null; 
    docDate: Date | string | null;
    status: string;
}