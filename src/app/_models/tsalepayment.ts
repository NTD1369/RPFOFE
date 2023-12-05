export class TSalesPayment
{
    paymentCode: string='';
    companyCode: string='';
    transId: string='';
    storeId: string='';
    lineId: string='';
    shortName: number | null=null;
    totalAmt: number | null=null;
    receivedAmt: number | null=null;
    paidAmt: number | null=null;
    roundingOff: number | null=null;
    fcRoundingOff: number | null=null;
    changeAmt: number | null=null;
    paymentMode: string='';
    cardType: string='';
    cardHolderName: string='';
    cardNo: string='';
    voucherBarCode: string='';
    voucherSerial: string='';
    createdBy: string='';
    createdOn: Date | string | null=null;
    modifiedBy: string='';
    modifiedOn: Date | string | null=null;
    status: string=''; 
    chargableAmount: number | null=null;
    paymentDiscount: number | null=null;
    collectedAmount: number | null=null;
    
    refNumber: string='';
    dataSource: string='';
   
    isRemove: boolean | null=null;
    isRequire: boolean | null=null;

    mainBalance:  number | null=null;
    subBalance:  number | null=null;

    currency: string='';
    rate:  number | null=null;
    fcAmount:  number | null=null;
    forfeitCode:  string='';
    forfeit:  number | null=null;
    terminalId: string=''; 
    customF1: string=''; 
    customF2: string=''; 
    customF3: string=''; 
    customF4: string=''; 
    customF5: string='';  
    promoId: string=''; 
    paymentType: string=''; 

}