export class TEndDate {
        companyCode: string;
        storeId: string;
        storeName: string;
        id: string;
        description: string;
        remark: string;
        status: string;
        date: Date | string | null;
        createOn: Date | string | null;
        modifiedOn: Date | string | null;
        createBy: string;
        modifiedBy: string;
        terminalId: string;
        lines: TEndDateDetail[];
        payments: TEndDatePayment[];
        itemSumary: EndDateItemSumary[];
        transTotalQty: number;
        transTotalAmt: number;
        completedTotalQty: number;
        completedTotalAmt: number;
        canceledTotalQty: number;
        canceledTotalAmt: number;
        itemInventorySumary: EndDateItemSumary[]; 

        totalSales: number;
        totalCount:  number;
        totalCollected:  number;
        totalBalance:  number;
        taxTotal: number | null;
        discountTotal: number | null;
        paymentTotal: number | null;
        lineItemCount: number | null;
        taxCount: number | null;
        discountCount: number | null;
        paymentCount: number | null; 
        
    }
    export class EndDateItemSumary {
        itemCode: string;
        remarks: string;
        shiftId: string;
        itemGroupId: string;
        ItemGroupName: string;
        description: string;
        uomCode: string;
        price: number | null;
        totalQty: number | null;
        lineTotal: number | null;
        type: string;
        createdBy: string;
    }
    export class TEndDateDetail {
        companyCode: string;
        storeId: string;
        id: string;
        endDateId: string;
        lineId: number;
        itemGroupId: string;
        ItemGroupName: string;
        itemCode: string;
        uoMCode: string;
        description: string;
        barcode: string;
        price: number | null;
        quantity: number | null;
        lineTotal: number | null;
        //CreateOn: Date | string | null;
        //ModifiedOn: Date | string | null;
        //CreateBy: string;
        //ModifiedBy: string;
    }
    export class TEndDatePayment {
        companyCode: string;
        storeId: string;
        endDateId: string;
        id: string;
        lineId: number;
        shiftId: string;
        status: string;
        shortName: string;
        //CreateOn: Date | string | null;
        //ModifiedOn: Date | string | null;
        paymentCode: string;
        currency: string;
        amount: number | null;
        fcAmount: number | null;
        totalAmt: number | null;
        openAmt: number | null;
        chargableAmount: number | null;
        paymentDiscount: number | null;
        collectedAmount: number | null;
        balance: number | null;
        createdBy: string;
        fullName: string;
        canEdit: boolean;
        changeAmt: number | null;
        eod_Code:  string;

        counterId: string = "";
        eoD_Code: string = "";
        bankInAmt: number | null; 
        bankInBalance: number | null; 
        fcCollectedAmount: number | null; 
    }