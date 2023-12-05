import { SPromoBuy } from "./promotionbuy";
import { SPromoCustomer } from "./promotioncus";
import { SPromoGet } from "./promotionget";
import { SPromoHeader } from "./promotionheader";
import { SPromoStore } from "./promotionstore";

export class PromotionViewModel extends SPromoHeader {
    promoCustomers: SPromoCustomer[];
    promoStores: SPromoStore[];
    promoBuys: SPromoBuy[];
    promoGets: SPromoGet[]; 
 
}
export class InActivePromoViewModel {
    promoId: string;
    companyCode: string;
    promoLineType: string;
    lineNum: number; 
    inActive: string=''; // Y/N
}

export class SPromoOTGroup {
    promoId: string;
    companyCode: string;
    groupID: string;
    lineNum: number;
    lineType: string;
    lineCode: string;
    lineName: string;
    lineUom: string;
    additionValue: string='';
}