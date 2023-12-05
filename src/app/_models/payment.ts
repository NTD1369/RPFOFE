import { MPaymentMethod } from "./paymentmethod";

export class Payment
{
    id: string;
    refNum: string;
    shortName: string; 
    paymentDiscount: number;
    paymentTotal: number;
    paymentCharged: number;
    lineNum: number;
    isRequireRefNum: boolean | null = null;
    mainBalance: number | null = null;
    subBalance: number | null = null;
    cardNo:string;
    cardType:string;
    cardHolderName:string;
    canEdit:  boolean | null = null;
    rate: number | null = null;
    fcAmount: number | null = null;
    currency:string;
    paidAmt: number | null = null;
    voucherSerial: string=""; 
    paymentType:string;
    paymentMode:string;
    forfeitCode: string;
    allowChange:boolean | null = null;
    roundingOff: number | null = null;
    fcRoundingOff: number | null = null;
    forfeit: number | null = null;
    customF1:string;
    customF2:string;
    customF3:string;
    customF4:string;
    customF5:string;
    apiUrl: string ; 
    isCloseModal?: boolean | null;
    isFatherShow?: boolean | null;
    farherId: string ; 
    bankPaymentType:string=""; 
    isPaid: boolean | null = null;
    transId:string="";  
    bankSelectedMode:string=""; 
    lines: MPaymentMethod[] = [];
}