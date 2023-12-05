import { SPromoOTGroup } from "./promotionViewModel";

export class SPromoGet {
    keyId: string='';
    promoId: string='';
    companyCode: string='';
    lineNum: number | null = null;
    lineType: string='';
    lineCode: string='';
    lineName: string='';
    lineUom: string='';
    conditionType: string='';
    condition1: string='';
    value1: number | null = null;
    condition2: string='';
    value2: number | null = null;
    valueType: string='';
    getValue: number | null = null;
    maxAmtDis: number | null = null;
    maxQtyDis: number | null = null;
    additionValue: string='';
    inActive: string;
    modifiedDate: Date | string=null;
    lines:  SPromoOTGroup[];
}