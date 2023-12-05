export class TDeliveryHeader {
        transId: string;
        orderId: string | null;
        companyCode: string;
        companyName: string;
        storeId: string;
        contractNo: string;
        storeName: string;
        shiftId: string;
        cusId: string;
        cusGrpId: string;
        cusRank: string;
        cusIdentifier: string;
        totalAmount: number | null;
        totalPayable: number | null;
        totalDiscountAmt: number | null;
        totalReceipt: number | null;
        amountChange: number | null;
        paymentDiscount: number | null;
        totalTax: number | null;
        discountType: string;
        discountAmount: number | null;
        discountRate: number | null;
        startTime: Date | string | null;
        createdOn: Date | string | null;
        createdBy: string;
        modifiedOn: Date | string | null;
        modifiedBy: string;
        status: string;
        isCanceled: string;
        remarks: string;
        salesPerson: string;
        salesPersonName: string;
        salesMode: string;
        refTransId: string;
        manualDiscount: string;
        salesType: string;
        dataSource: string;
        posType: string;
        phone: string;
        cusName: string;
        cusAddress: string;
        reason: string;
        collectedStatus: string;
        omsId: string;
        chanel: string;
        rerminalId: string; 
        roundingOff: number | null;
        merchantId: string;
        shortOrderID: string;
        omsStatus: string;
        promoId: string;
        approvalId: string;
        syncMWIStatus: string;
        syncMWIDate: Date | string | null;
        syncMWIMsg: string;
        //    ,        //,        //,StoreAddress: string;
        email: string;
        website: string;
        storePhone: string;
        companyPhone: string; 
        rewardPoints: number | null; 
        expiryDate: Date | string | null; 
        docDate: Date | string | null;
        customF1: string;
        customF2: string;
        customF3: string;
        customF4: string;
        customF5: string;
        luckyNo: string;
        printRemarks: string;
        otherTerminalId: string;
        pinSerialDisplayUpper: string;
        salesChanel: string;
        deliveryBy: string;
        receiptBy: string;
        from: string;
        to: string;
        toCustom1: string;
        toCustom2: string;
        toCustom3: string;

        lines: TDeliveryLine[];
        sumQuantity : number | null;
        sumLineTotal : number | null;
    }


    export class TDeliveryLine {
        transId: string;
        lineId: string;
        storeId: string;
        companyCode: string;
        itemCode: string;
        slocId: string;
        barCode: string;
        uomCode: string;
        quantity: number | null;
        price: number | null;
        lineTotal: number | null;
        lineTotalBefDis: number | null;
        lineTotalDisIncludeHeader: number | null;
        discountType: string;
        discountAmt: number | null;
        discountRate: number | null;
        createdBy: string;
        createdOn: Date | string | null;
        modifiedBy: string;
        modifiedOn: Date | string | null;
        status: string;
        remark: string;
        promoId: string;
        promoType: string;
        promoPercent: number | null;
        promoBaseItem: string;
        salesMode: string;
        taxRate: number | null;
        taxAmt: number | null;
        taxCode: string;
        minDepositAmt: number | null;
        minDepositPercent: number | null;
        deliveryType: string;
        posservice: string;
        storeAreaId: string;
        timeFrameId: string;
        duration: number | null;
        bomId: string;
        appointmentDate: Date | string | null; 
        promoPrice: number | null;
        promoLineTotal: number | null;
        openQty: number | null;
        baseLine: number | null;
        baseTransId: string;
        promoDisAmt: number | null;
        isPromo: string;
        isSerial: boolean | null;
        isVoucher: boolean | null;
        allowSalesNegative: boolean | null;
       
        description: string;
        prepaidCardNo: string;
        memberDate: Date | string | null;
        memberValue: number | null;
        startDate: Date | string | null;
        endDate: Date | string | null;
        itemType: string;
        serialNum: string;
        name: string;
        phone: string;
        itemTypeS4: string;
        custom1: string;
        custom2: string;
        custom3: string;
        custom4: string;
        custom5: string;
        productId: string;
        priceListId: string;
        weightScaleBarcode: string;
        bookletNo: string;
        orgQty: number | null;
        deliveryQty: number | null;
        receiptQty: number | null;
        priceBfVAT: number | null;
        lineTotalBfVAT: number | null;
        serialLines: TDeliveryLineSerial[];
    }


    export class TDeliveryLineSerial {
        transId: string;
        lineId: string;
        companyCode: string;
        itemCode: string;
        storeId: string;
        serialNum: string;
        slocId: string;
        quantity: number | null;
        uomCode: string;
        createdBy: string;
        createdOn: Date | string | null;
        expDate: Date | string | null;
        modifiedBy: string;
        modifiedOn: Date | string | null;
        status: string;
        openQty: number | null;
        baseLine: number | null;
        baseTransId: string;
        lineNum: number | null;
        description: string;
        prefix: string;
        name: string;
        phone: string;
        customF1: string;
        customF2: string;
        customF3: string;
        customF4: string;
        customF5: string;
    }