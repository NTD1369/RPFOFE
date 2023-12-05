 
export class MItemVariant {
    variantId: string;
    description: string; 
    status: string; 
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    validFrom: Date | string | null;
    validTo: Date | string | null; 
    customF1: string;
    customF2: string;
    customF3: string;
    customF4: string;
    customF5: string;
    buyList: MItemVariantBuy[];
    mapList: MItemVariantMap[]; 
}




export class MItemVariantBuy {
    lineNum: number | null ;

    variantId: string;
    lineType: string;

    lineCode: string;
    lineName: string;

    lineUoM: string;
    collectType: string;
    selectionType: string;
    validFrom: Date | string | null;
    validTo: Date | string | null;
    status: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null; 
    customF1: string;
    customF2: string;
    customF3: string;
    customF4: string;
    customF5: string;
}
export class MItemVariantMap {
    variantId: string;
    lineNum: number | null ;  
    lineCode: string;
    lineName: string;
    lineUoM: string;
    collectType: string;
    selectionType: string;
    validFrom: Date | string | null;
    validTo: Date | string | null;
    status: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null; 
    customF1: string;
    customF2: string;
    customF3: string;
    customF4: string;
    customF5: string;
}