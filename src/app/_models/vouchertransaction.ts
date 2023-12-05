export class TVoucherTransaction {
    companyCode: string;
    itemCode: string;
    voucherNo: string;
    voucherValue: number | null;
    voucherType: string;
    issueTransId: string;
    issueDate: Date | string | null;
    redeemTransId: string;
    redeemDate: Date | string | null; 
}