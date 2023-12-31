export class Item
{
    stt: number | null;
    itemCode: string="";
    companyCode: string="";
    productId: string="";
    variantId: string="";
    createdBy: string="";
    createdOn: Date | string | null=null;
    modifiedBy: string="";
    modifiedOn: Date | string | null=null;
    status: string="";
    capacityValue : number | null=null;
    itemGroupId: string="";
    salesTaxCode: string="";
    purchaseTaxCode: string="";
    itemName: string="";
    itemDescription: string="";
    itemCategory_1: string="";
    itemCategory_2: string="";
    itemCategory_3: string="";
    // voucherCollection: string="";
    foreignName: string="";
    inventoryUom: string="";
    imageUrl: string="";
    imageLink: string="";
    mcid: string="";
    weight: number | null=null;
    height: number | null=null;
    width: number | null=null;
    length: number | null=null;
    volume: number | null=null;
    customField1: string="";
    customField2: string="";
    customField3: string="";
    customField4: string="";
    customField5: string=""; // JA - Cuối tuần | VW - Chưa có
    customField6: string=""; // JA - Holiday | VW - Loại xe
    customField7: string="";
    customField8: string="";
    customField9: string="";
    customField10: string="";
    defaultPrice: number | null=null;
    isSerial: boolean | null=null;
    isBom: boolean | null=null;
    isVoucher: boolean | null=null;
    validFrom: Date | string | null=null;
    validTo: Date | string | null=null;
    rejectPayType: string="";
    returnable:boolean | null=null;
    voucherCollection: string="";
    isPriceTime:boolean | null=null;
    allowSalesNegative:boolean | null=null;
    isFixedQty: boolean | null=null; 
    defaultFixedQty: number | null=null;
    inventoryUOM: string="";
    uomDecimalFormat: string="";
    uomThousandFormat: string="";
    uomDecimalPlacesFormat: string="";
    uomCustomF1: string="";
    uomCustomF2: string="";
    uomCustomF3: string="";
    uomCustomF4: string="";
    uomCustomF5: string=""; 
}