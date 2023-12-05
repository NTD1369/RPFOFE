export class MPaymentMethod {
    paymentCode: string="";
    companyCode: string="";
    paymentDesc: string="";
    forfeitCode: string="";
    createdBy: string="";
    createdOn: Date | string | null=null;
    modifiedBy: string="";
    modifiedOn: Date | string | null=null;
    status: string="";
    accountCode: string="";
    isRequireRefnum: boolean | null=null;
    eodApply: boolean | null=null;
    eodCode: string="";
    paymentType: string="";
    value: number | null=null;
    rate: number | null=null;
    fcAmount: number | null=null;
    currency: string="";
    shortName: string="";
    roundingMethod: string="";
    allowChange:boolean | null = null;
    rejectReturn:boolean | null = null;
    rejectVoid:boolean | null = null;
    rejectExchange:boolean | null = null;
    apiUrl: string="";
    isCloseModal:boolean | null = null;

    customF1: string="";
    customF2: string="";
    customF3: string="";
    customF4: string="";
    customF5: string="";
    ///
    allowMix:boolean | null = null;
    allowRefund:boolean | null = null; 
    requireTerminal:boolean | null = null; 
    terminalIdDefault:string="";
    voucherCategory:string="";
    isFatherShow:boolean | null = null; 
    fatherId:string="";
    bankPaymentType:string="";



    bankCustomF1: string="";
    bankCustomF2: string="";
    bankCustomF3: string="";
    bankCustomF4: string="";
    bankCustomF5: string="";

    lines: any = [];
    mappings: MPaymentMethodMapping[] = [];

    bankSelectedMode:string=""; 
}

export class MPaymentMethodMapping {
    companyCode: string="";
    paymentCode: string="";
    fatherId: string="";
    customF1: string="";
    customF2: string="";
    customF3: string="";
    customF4: string="";
    customF5: string="";
    customF6: string="";
    status: string="";
}