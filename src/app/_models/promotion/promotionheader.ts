export class SPromoHeader {
    promoId: string="";
    companyCode: string="";
    promoType: number | null=null;
    promoTypeName: string="";
    promoName: string="";
    customerType: string="";
    validDateFrom: Date | string | null=null;
    validDateTo: Date | string | null=null;
    validTimeFrom: number | null=null;
    validTimeTo: number | null=null;
    isMon: string="";
    isTue: string="";
    isWed: string="";
    isThu: string="";
    isFri: string="";
    isSat: string="";
    isSun: string="";
    totalBuyFrom: number | null=null;
    totalBuyTo: number | null=null;
    totalGetType: string="";
    totalGetValue: number | null=null;
    maxTotalGetValue: number | null=null;
    isCombine: string="";
    createdBy: string="";
    createdOn: Date | string | null=null;
    modifiedBy: string="";
    modifiedOn: Date | string | null=null;
    status: string="";
    isApply: string="";
    isUsed: string="";
    isVoucher: boolean | null=null;
    sapPromoId: string="";
    sapBonusBuyId: string="";
    applyLineValue: string="";
    roundingDigit: number | null=null;
    maxApplyType: string="";
    maxApplyValue: number | null=null; 
    maxQtyByReceipt : number | null=null;
    maxQtyByStore : number | null=null;
    remainQty : number |null = null;
}