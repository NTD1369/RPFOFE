export class MPriceList { 
    companyCode: string="";
    storeId: string="";
    itemCode: string="";
    priceListId: string="";
    priceListName: string="";
    uomCode: string="";
    barCode: string="";
    priceBeforeTax: number | null=null;
    priceAfterTax: number | null=null;
    validFrom: Date | string | null=null;
    validTo: Date | string | null=null;
    createdBy: string="";
    createdOn: Date | string | null=null;
    modifiedBy: string="";
    modifiedOn: Date | string | null=null;
    status: string="";
}

export class MPriorityPriceList {
    id: string;
    companyCode: string;
    cusGrpId: string;
    cusGrpDesc: string;
    priceListId: string;
    priceListName: string="";
    priority: string;
    status: string; 
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    
}