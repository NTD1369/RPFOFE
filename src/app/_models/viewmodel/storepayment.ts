export class StorePaymentViewModel {
    paymentCode: string;
    companyCode: string;
    forfeitCode: string;
    paymentDesc: string;
    shortName: string;
    allowMix: boolean | null;
    isShow: boolean | null;
    orderNum: number | null;
    status: string;
    isRequireRefnum: boolean | null;
    storeId: string;
    isFatherShow: boolean | null;
    fatherId: string;
    bankPaymentType: string;
    customF1: string; 
    customF2: string; 
    customF3: string; 
    customF4: string; 
    customF5: string; 
    lines: StorePaymentViewModel[] = [];
}