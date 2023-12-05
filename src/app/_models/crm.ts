export class MLoyaltyType {
    loyaltyType: string;
    typeName: string;
    priorityNo: string;
    status: string;
}
export class SLoyaltyStore {
    loyaltyId: string;
    companyCode: string;
    lineNum: string;
    storeValue: string; 
}
export class SLoyaltyCustomer {
    loyaltyId: string;
    companyCode: string;
    lineNum: number;
    customerValue: string;
    customerType: string;
}
export class TLoyaltyLog {
    id: string;
    transId: string;
    companyCode: string;
    storeId: string;
    customerId: string;
    customerName: string;
    cardNumber: string;
    transDate: string;
    transType: string;
    inPoint: string;
    outPoint: string;
    inAmt: string;
    outAmt: string;
    createdBy: string;
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
    calcStatus: string;
    expireDate: string;
}
export class SLoyaltyRank {
     
    companyCode: string;
    rankId: string;
    rankName: string;
    factor: number | null;
    targetAmount: number | null;
    period: number | null;
    status: string;
}
export class SLoyaltyEarn {
    loyaltyId: string;
    companyCode: string;
    lineNum:  number | null=null;
    lineType: string;
    lineCode: string;
    lineName: string;
    lineUom: string;
    conditionType: string;
    condition_1: string;
    value_1: string;
    condition_2: string;
    value_2: string;
    valueType: string;
    earnValue: string; 
    maxPointApply: string;
}
export class SLoyaltyHeader {
    loyaltyId: string;
    companyCode: string;
    loyaltyType: string;
    loyaltyName: string;
    customerType: string;
    validDateFrom: Date | string | null=null;
    validDateTo: Date | string | null=null;
    validTimeFrom:  number | null=null;
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
    totalEarnType: string="";
    totalEarnValue: number | null=null; 
    maxTotalEarnValue: number | null=null; 
    createdBy: string="";
    createdOn: Date | string | null=null;
    modifiedBy: string="";
    modifiedOn: Date | string | null=null;
    status: string="";
    loyaltyBuy: SLoyaltyBuy[];
    loyaltyEarns: SLoyaltyEarn[];
    loyaltyExcludes: SLoyaltyExclude[];
    loyaltyCustomers: SLoyaltyCustomer[];
    loyaltyStores: SLoyaltyStore[];
}
export class SLoyaltyBuy {
    loyaltyId: string='';
    companyCode: string='';
    lineNum: number;
    lineType: string='';
    lineCode: string='';
    lineName: string='';
    lineUom: string='';
    valueType: string='';
    condition1: string='';
    value1: number | null=null;
    condition2: string='';
    value2: number | null=null;
    keyId: string='';
    
}

export class SLoyaltyExclude {
    loyaltyId: string='';
    companyCode: string='';
    lineNum: number;
    lineType: string='';
    lineCode: string='';
    lineName: string='';
    lineUom: string='';
    valueType: string='';
    condition1: string='';
    value1: number | null=null;
    condition2: string='';
    value2: number | null=null;
    keyId: string='';
    
}
