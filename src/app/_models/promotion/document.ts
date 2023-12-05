import { TSalesPayment } from "../tsalepayment";
import { PromotionViewModel } from "./promotionViewModel";

export class PromotionDocument {
        
    docEntry: number; 
    docNum: number | null;  
    docDate: Date | string | null;  //Y 
    docDueDate: Date | string | null; 
    cardCode: string; //Y 
    storeId: string; //Y 
    cardName: string; 
    cardGroup: string; //Y 
    customerRank: string; //Y 
    address: string; 
    numAtCard: string; 
    docCurrency: string;  //Y 
    docRate: number | null;  
    comments: string; 
    docObjectCode: string; 
    discountPercent: number | null; 
    documentStatus: string; 
    documentLines: PromotionDocumentLine[]=[];  
    uCreatedBy: string; 
    message: string; 
    uCompanyCode: string;  //Y
    u_CompanyCode: string;  //Y
    promotionId: string;
    promotionCode: string;
    promotionApply: PromotionViewModel[]=[];  
    voucherIsApply: boolean | null; 
    roundingDigit: number | null = 2; 
    salesPayments: TSalesPayment[]=[];  
}

export class PromotionDocumentLine {
     
    lineNum: number | null; 
    itemCode: string; //Y 
    itemDescription: string; 
    itemGroup: string; //Y 
    quantity: number | null; //Y 
    currency: string; //Y 
    rate: number | null; 
    discountPercent: number | null; 
    barCode: string; 
    vatGroup: string; //Y 
    lineTotal: number | null; //Y 
    taxPercentagePerRow: number | null; 
    unitPrice: number | null;  //Y 
    uoMEntry: number | null;  
    uoMCode: string;  //Y  
    uPromoCode: string; 
    uDisPrcnt: number | null; 
    uDisAmt: number | null; 
    uTotalAfDis: number | null; 
    uPromoName: string; 
    uSchemaCode: string; 
    uSchemaName: string; 
    uPriceAfDis: number | null; 
    uIsPromo: string; 
    uCollection: string; 
    promoType: string; 
    baseQuantity: number | null; 
    baseUomCode: string; 
    vatPerPriceAfDis: number | null; 
    priceAfDisAndVat: number | null;
    promotionDisAmt: number | null;
    promotionDisPrcnt: number | null;
    promotionCollection: null

    promotionUnitPrice: number | null;
    promotionTotalAfDis: number | null;
    promotionVatPerPriceAfDis: number | null;
    promotionPriceAfDis: number | null;
    promotionPriceAfDisAndVat: number | null;
  
    promotionDiscountPercent: number | null;
    promotionIsPromo: string;
    promotionItemGroup: string | null;
    promotionLineTotal: number | null; 
    promotionPromoCode: string | null;
    promotionPromoName: string | null;
    promotionRate: number | null;
    promotionSchemaCode: string | null;
    promotionSchemaName: string | null;
    promotionType: string | null;
    promotionUoMCode: string | null;
    promotionUoMEntry: number | null; 
    promotionVatGroup: string | null;  
    itemCategory1?: string="";
    itemCategory2?: string="";
    itemCategory3?: string="";
    
    customField1?: string="";
    customField2?: string="";
    customField3?: string="";
    customField4?: string="";
    customField5?: string="";
    customField6?: string="";
    customField7?: string="";
    customField8?: string="";
    customField9?: string="";
    customField10?: string="";
    rejectPayType?: string="";
    openQty?: number | null;
    oriQty?: number | null;
    canRemove?: boolean | null;
    itemType?: boolean | null; 
    salesTaxCode: string="";
    salesTaxRate:number | null;
    purchaseTaxCode: string="";
    purchaseTaxRate:number | null;
    applyType: string="";
    refTransId: string="";
    baseLine: string="";
    baseTransId: string="";
    priceListId: string="";
    productId: string="";
    isVoucher: boolean = null;
    isSerial: boolean = null;
    isNegative: boolean = null;
    responseTime: Date | null = null;
    weighScaleBarcode: string="";
    bookletNo: string=""; 
    isFixedQty: boolean | null=null;
    defaultFixedQty: number | null=null;
}
