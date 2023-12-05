import { SPromoOTGroup } from "./promotionViewModel";

export class SPromoBuy {
    promoId: string='';
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
    additionValue: string='';
    inActive: string;
    modifiedDate: Date | string=null;
    lines:  SPromoOTGroup[];
}
function getKey(code, uom)
{
    return code + uom;
}

 