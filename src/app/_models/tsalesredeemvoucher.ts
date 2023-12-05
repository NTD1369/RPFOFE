export interface TSalesRedeemVoucher {
    id: string;
    companyCode: string;
    transId: string;
    lineNum: number;
    voucherCode: string;
    name: string;
    discountCode: string;
    discountValue: string;
    discountType: string;
    validTill: Date | string | null; 

}