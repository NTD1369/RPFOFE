import { TShiftHeader } from '../tshiftheader';
import { TShiftLine } from '../tshiftline';

export class ShiftVM implements TShiftHeader {
    shiftId: string;
    companyCode: string;
    storeId: string;
    storeName: string;
    dailyId: string;
    deviceId: string;
    openAmt: number;
    endAmt: number;
    shiftTotal: number;
    createdOn: string | Date;
    createdBy: string;
    modifiedOn: string | Date;
    modifiedBy: string;
    status: string;
    lines: TShiftLine[] = [];
    payments: EndShiftPayment[];
    cashierPayments: EndShiftPayment[];
    itemSumary: EndShiftItemSumary[];
    transTotalQty: number;
    transTotalAmt: number;
    completedTotalQty: number;
    completedTotalAmt: number;
    canceledTotalQty: number;
    canceledTotalAmt: number;
    itemInventorySumary: EndShiftItemSumary[];
    totalPrice: number | null = 0;
    totalCollected: number | null = 0;
    totalQuantity: number | null;
    counterId: string;
}

export class EndShiftItemSumary {
    itemCode: string;
    remarks: string;
    transId: string;
    description: string;
    uomCode: string;
    price: number | null;
    totalQty: number | null;
    lineTotal: number | null;
    type: string;
    itemGroupId: string;
    itemGroupName: string;
    createdBy: string;
}
export class EndShiftPayment {
    paymentCode: string;
    currency: string;
    counterId: string;
    shortName: string;
    totalAmt: number | null;
    eodApply: boolean | null = false;
    collectedAmount: number | null;
    chargableAmount: number | null;
    changeAmt: number | null;
    isLock: boolean | null = false;
    bankInAmt: number | null;
    bankInBalance: number | null;
    createdBy: string;
    cashier: string;
    customF1: string;
    customF2: string;
    customF3: string;
    customF4: string;
    customF5: string;
}

export class EndDateVM {
    createdOn: Date | string | null = null;
    storeId: string;
    createdBy: string;
    status: string;
    payments: EndDatePayment[];
}


export class EndDatePayment {
    shiftId: string;
    status: string;
    PaymentCode: string;
    currency: string;
    totalAmt: number | null;
    collectedAmount: number | null;
    paymentDiscount: number | null;
    chargableAmount: number | null;
    changeAmt: number | null;
    balance: number | null;
    createdBy: string;
    cashier: string;
    customF1: string;
    customF2: string;
    customF3: string;
    customF4: string;
    customF5: string;
}